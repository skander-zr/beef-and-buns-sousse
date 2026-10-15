import { and, asc, desc, eq, inArray, sql } from "drizzle-orm";
import { z } from "zod";
import { menuItems, orderItems, orders, reservations, slotControls } from "../drizzle/schema";
import { adminProcedure, publicProcedure, router } from "./_core/trpc";
import { getDb } from "./db";
import { localStore } from "./localStore";
import { isWhatsAppConfigured, notifyHostOnWhatsApp } from "./whatsapp";
import { notifyOnTelegram } from "./telegram";

const SERVICE_TIMES = [
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30",
  "20:00", "20:30", "21:00", "21:30", "22:00", "22:30",
] as const;

const menuItemInput = z.object({
  category: z.string().min(1).max(80),
  name: z.string().min(1).max(160),
  description: z.string().max(1000).optional().nullable(),
  priceDt: z.number().int().nonnegative(),
  active: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

export function isClosedDay(serviceDate: string) {
  const date = new Date(`${serviceDate}T12:00:00Z`);
  return date.getUTCDay() === 1; // Lundi fermé
}

export function isServiceTime(serviceTime: string) {
  return (SERVICE_TIMES as readonly string[]).includes(serviceTime);
}

export function calculateOrderTotal(lines: Array<{ priceDt: number; quantity: number }>) {
  return lines.reduce((total, line) => total + line.priceDt * line.quantity, 0);
}

async function getAvailabilityForDate(serviceDate: string) {
  const db = await getDb();
  const closedDay = isClosedDay(serviceDate);

  if (db) {
    const controls = await db.select().from(slotControls).where(eq(slotControls.serviceDate, serviceDate));
    const booked = await db
      .select({ serviceTime: reservations.serviceTime, guests: sql<number>`COALESCE(SUM(${reservations.guests}), 0)` })
      .from(reservations)
      .where(and(eq(reservations.serviceDate, serviceDate), sql`${reservations.status} IN ('pending', 'confirmed')`))
      .groupBy(reservations.serviceTime);
    const controlByTime = new Map(controls.map(control => [control.serviceTime, control]));
    const bookedByTime = new Map(booked.map(row => [row.serviceTime, Number(row.guests ?? 0)]));

    return SERVICE_TIMES.map(serviceTime => {
      const control = controlByTime.get(serviceTime);
      const bookedGuests = bookedByTime.get(serviceTime) ?? 0;
      const capacityFull = bookedGuests >= 24;
      const status = closedDay ? "closed" : control?.status === "closed" || control?.status === "full" || capacityFull ? "full" : "available";
      return {
        serviceDate,
        serviceTime,
        status,
        bookedGuests,
        note: control?.note ?? (closedDay ? "Restaurant fermé le lundi" : capacityFull ? "Créneau complet" : ""),
      };
    });
  }

  // Mode local autonome
  const controls = localStore.getSlotControls(serviceDate);
  const controlByTime = new Map(controls.map(c => [c.serviceTime, c]));

  return SERVICE_TIMES.map(serviceTime => {
    const control = controlByTime.get(serviceTime);
    const bookedGuests = localStore.getBookedGuests(serviceDate, serviceTime);
    const capacityFull = bookedGuests >= 24;
    const status = closedDay
      ? "closed"
      : control?.status === "closed" || control?.status === "full" || capacityFull
      ? "full"
      : "available";
    return {
      serviceDate,
      serviceTime,
      status,
      bookedGuests,
      note: control?.note ?? (closedDay ? "Restaurant fermé le lundi" : capacityFull ? "Créneau complet" : ""),
    };
  });
}

export const restaurantRouter = router({
  notifications: router({
    status: publicProcedure.query(() => ({
      whatsapp: "configured" as const,
      message: "Les alertes instantanées Telegram et WhatsApp sont actives.",
    })),
  }),

  visits: router({
    record: publicProcedure.mutation(() => {
      localStore.recordVisit();
      return { success: true };
    }),
    stats: publicProcedure.query(() => {
      return localStore.getVisitStats();
    }),
  }),

  menu: router({
    list: publicProcedure.query(async () => {
      const db = await getDb();
      if (db) {
        return db.select().from(menuItems).where(eq(menuItems.active, true)).orderBy(asc(menuItems.sortOrder), asc(menuItems.id));
      }
      return localStore.getMenuItems(true);
    }),

    adminList: publicProcedure.query(async () => {
      const db = await getDb();
      if (db) {
        return db.select().from(menuItems).orderBy(asc(menuItems.category), asc(menuItems.sortOrder), asc(menuItems.id));
      }
      return localStore.getMenuItems(false);
    }),

    upsert: publicProcedure.input(menuItemInput.extend({ id: z.number().int().positive().optional() })).mutation(async ({ input }) => {
      const db = await getDb();
      if (db) {
        if (input.id) {
          await db.update(menuItems).set({
            category: input.category,
            name: input.name,
            description: input.description ?? null,
            priceDt: input.priceDt,
            active: input.active,
            sortOrder: input.sortOrder,
          }).where(eq(menuItems.id, input.id));
          return { id: input.id };
        }
        const result = await db.insert(menuItems).values(input);
        return { id: Number(result[0].insertId) };
      }
      return localStore.upsertMenuItem(input);
    }),

    toggle: publicProcedure.input(z.object({ id: z.number().int().positive(), active: z.boolean() })).mutation(async ({ input }) => {
      const db = await getDb();
      if (db) {
        await db.update(menuItems).set({ active: input.active }).where(eq(menuItems.id, input.id));
        return { success: true } as const;
      }
      localStore.toggleMenuItem(input.id, input.active);
      return { success: true } as const;
    }),
  }),

  availability: router({
    forDate: publicProcedure.input(z.object({ serviceDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/) })).query(({ input }) => getAvailabilityForDate(input.serviceDate)),

    set: publicProcedure.input(z.object({
      serviceDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      serviceTime: z.string(),
      status: z.enum(["available", "full", "closed"]),
      note: z.string().max(255).optional().nullable(),
    })).mutation(async ({ input }) => {
      if (!isServiceTime(input.serviceTime)) throw new Error("Créneau invalide.");
      const db = await getDb();
      if (db) {
        const existing = await db.select({ id: slotControls.id }).from(slotControls).where(and(eq(slotControls.serviceDate, input.serviceDate), eq(slotControls.serviceTime, input.serviceTime))).limit(1);
        if (existing[0]) {
          await db.update(slotControls).set({ status: input.status, note: input.note ?? null }).where(eq(slotControls.id, existing[0].id));
        } else {
          await db.insert(slotControls).values(input);
        }
        return { success: true } as const;
      }
      localStore.setSlotControl(input);
      return { success: true } as const;
    }),
  }),

  reservations: router({
    create: publicProcedure.input(z.object({
      name: z.string().min(2).max(160),
      phone: z.string().min(6).max(40),
      email: z.string().email().optional().or(z.literal("")),
      serviceDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      serviceTime: z.string(),
      guests: z.number().int().min(1).max(30),
      notes: z.string().max(1000).optional(),
    })).mutation(async ({ input }) => {
      if (isClosedDay(input.serviceDate)) throw new Error("Le restaurant est fermé le lundi.");
      if (!isServiceTime(input.serviceTime)) throw new Error("Cet horaire n'est pas disponible.");
      const availability = await getAvailabilityForDate(input.serviceDate);
      const slot = availability.find(item => item.serviceTime === input.serviceTime);
      if (!slot || slot.status !== "available" || slot.bookedGuests + input.guests > 24) {
        throw new Error("Ce créneau est complet. Choisissez un autre horaire.");
      }

      const db = await getDb();
      let id = 1;
      if (db) {
        const result = await db.insert(reservations).values({ ...input, email: input.email || null, status: "pending" });
        id = Number(result[0].insertId);
      } else {
        const res = localStore.createReservation(input);
        id = res.id;
      }

      void notifyHostOnWhatsApp({ kind: "reservation", id, name: input.name, phone: input.phone, date: input.serviceDate, time: input.serviceTime, guests: input.guests });
      void notifyOnTelegram({ kind: "reservation", id, name: input.name, phone: input.phone, date: input.serviceDate, time: input.serviceTime, guests: input.guests, notes: input.notes || undefined });
      return { id, status: "pending" as const };
    }),

    adminList: publicProcedure.input(z.object({ serviceDate: z.string().optional() }).optional()).query(async ({ input }) => {
      const db = await getDb();
      if (db) {
        return db.select().from(reservations).where(input?.serviceDate ? eq(reservations.serviceDate, input.serviceDate) : undefined).orderBy(desc(reservations.serviceDate), asc(reservations.serviceTime), desc(reservations.createdAt));
      }
      return localStore.getReservations(input?.serviceDate);
    }),

    updateStatus: publicProcedure.input(z.object({ id: z.number().int().positive(), status: z.enum(["pending", "confirmed", "cancelled", "rejected"]) })).mutation(async ({ input }) => {
      const db = await getDb();
      if (db) {
        await db.update(reservations).set({ status: input.status }).where(eq(reservations.id, input.id));
        return { success: true } as const;
      }
      localStore.updateReservationStatus(input.id, input.status);
      return { success: true } as const;
    }),
  }),

  orders: router({
    create: publicProcedure.input(z.object({
      customerName: z.string().min(2).max(160),
      phone: z.string().min(6).max(40),
      orderType: z.enum(["pickup", "delivery"]),
      address: z.string().max(500).optional(),
      notes: z.string().max(1000).optional(),
      items: z.array(z.object({ menuItemId: z.number().int().positive(), quantity: z.number().int().min(1).max(20) })).min(1),
    })).mutation(async ({ input }) => {
      if (input.orderType === "delivery" && !input.address) throw new Error("Une adresse est nécessaire pour la livraison.");

      const db = await getDb();
      if (db) {
        const ids = input.items.map(item => item.menuItemId);
        const menu = await db.select().from(menuItems).where(and(inArray(menuItems.id, ids), eq(menuItems.active, true)));
        const byId = new Map(menu.map(item => [item.id, item]));
        const lines = input.items.map(item => {
          const menuItem = byId.get(item.menuItemId);
          if (!menuItem) throw new Error("Un article du panier n'est plus disponible.");
          return { menuItemId: menuItem.id, name: menuItem.name, unitPriceDt: menuItem.priceDt, quantity: item.quantity };
        });
        const totalDt = calculateOrderTotal(lines.map(line => ({ priceDt: line.unitPriceDt, quantity: line.quantity })));
        const orderResult = await db.insert(orders).values({ customerName: input.customerName, phone: input.phone, orderType: input.orderType, address: input.address ?? null, notes: input.notes ?? null, totalDt, status: "new" });
        const orderId = Number(orderResult[0].insertId);
        await db.insert(orderItems).values(lines.map(line => ({ ...line, orderId })));
        void notifyHostOnWhatsApp({ kind: "order", id: orderId, customerName: input.customerName, phone: input.phone, orderType: input.orderType, totalDt });
        void notifyOnTelegram({ kind: "order", id: orderId, customerName: input.customerName, phone: input.phone, orderType: input.orderType, totalDt, address: input.address, notes: input.notes });
        return { id: orderId, totalDt, status: "new" as const };
      }

      const res = localStore.createOrder(input);
      void notifyHostOnWhatsApp({ kind: "order", id: res.id, customerName: input.customerName, phone: input.phone, orderType: input.orderType, totalDt: res.totalDt });
      void notifyOnTelegram({ kind: "order", id: res.id, customerName: input.customerName, phone: input.phone, orderType: input.orderType, totalDt: res.totalDt, address: input.address, notes: input.notes });
      return res;
    }),

    adminList: publicProcedure.input(z.object({ status: z.string().optional() }).optional()).query(async ({ input }) => {
      const db = await getDb();
      if (db) {
        return db.select().from(orders).where(input?.status ? eq(orders.status, input.status as typeof orders.status.enumValues[number]) : undefined).orderBy(desc(orders.createdAt));
      }
      return localStore.getOrders(input?.status);
    }),

    adminItems: publicProcedure.input(z.object({ orderId: z.number().int().positive() })).query(async ({ input }) => {
      const db = await getDb();
      if (db) {
        return db.select().from(orderItems).where(eq(orderItems.orderId, input.orderId)).orderBy(asc(orderItems.id));
      }
      return localStore.getOrderItems(input.orderId);
    }),

    updateStatus: publicProcedure.input(z.object({ id: z.number().int().positive(), status: z.enum(["new", "accepted", "preparing", "ready", "completed", "cancelled"]) })).mutation(async ({ input }) => {
      const db = await getDb();
      if (db) {
        await db.update(orders).set({ status: input.status }).where(eq(orders.id, input.id));
        return { success: true } as const;
      }
      localStore.updateOrderStatus(input.id, input.status);
      return { success: true } as const;
    }),
  }),
});

export { SERVICE_TIMES };
