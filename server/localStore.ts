import fs from "fs";
import path from "path";

export type LocalMenuItem = {
  id: number;
  category: string;
  name: string;
  description: string | null;
  priceDt: number;
  active: boolean;
  sortOrder: number;
};

export type LocalReservation = {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  serviceDate: string;
  serviceTime: string;
  guests: number;
  notes: string | null;
  status: "pending" | "confirmed" | "cancelled" | "rejected";
  createdAt: string;
};

export type LocalOrder = {
  id: number;
  customerName: string;
  phone: string;
  orderType: "pickup" | "delivery";
  address: string | null;
  notes: string | null;
  totalDt: number;
  status: "new" | "accepted" | "preparing" | "ready" | "completed" | "cancelled";
  createdAt: string;
};

export type LocalOrderItem = {
  id: number;
  orderId: number;
  menuItemId: number | null;
  name: string;
  unitPriceDt: number;
  quantity: number;
};

export type LocalSlotControl = {
  id: number;
  serviceDate: string;
  serviceTime: string;
  status: "available" | "full" | "closed";
  note: string | null;
};

export const INITIAL_MENU_ITEMS: Omit<LocalMenuItem, "id">[] = [
  // --- SMASH BURGERS ---
  {
    category: "Smash Burgers",
    name: "Truffle Mushroom",
    description: "Double smash beef patty, american cheese, grilled mushrooms, truffle mayo, rocket salad, artisanal potato bun.",
    priceDt: 29.5,
    active: true,
    sortOrder: 1,
  },
  {
    category: "Smash Burgers",
    name: "OG Smash",
    description: "Double smash beef patty, american cheese, grilled caramelized onions, signature OG sauce, artisanal potato bun.",
    priceDt: 22.7,
    active: true,
    sortOrder: 2,
  },
  {
    category: "Smash Burgers",
    name: "OG Smash Oklahoma",
    description: "Double smash beef patty smashé avec fines lamelles d'oignons caramélisés, double american cheese, sauce OG, potato bun.",
    priceDt: 22.7,
    active: true,
    sortOrder: 3,
  },
  {
    category: "Smash Burgers",
    name: "Hot Smash",
    description: "Double smash beef patty, american cheese, jalapeños épicés, sauce hot épicée maison, oignons caramélisés, potato bun.",
    priceDt: 25,
    active: true,
    sortOrder: 4,
  },

  // --- CRISPY CHICKEN ---
  {
    category: "Crispy Chicken",
    name: "OG Chicken",
    description: "Filet de poulet croustillant pané minute, coleslaw frais crémeux, sauce signature OG, artisanal potato bun.",
    priceDt: 17.5,
    active: true,
    sortOrder: 5,
  },
  {
    category: "Crispy Chicken",
    name: "Classic Chicken",
    description: "Filet de poulet pané croustillant, salade croquante, rondelles de tomate fraîche, oignons rouges, mayonnaise maison, potato bun.",
    priceDt: 17.5,
    active: true,
    sortOrder: 6,
  },
  {
    category: "Crispy Chicken",
    name: "Hot Chicken",
    description: "Filet de poulet pané épicé croustillant, rondelles de jalapeños marinés, sauce hot épicée, coleslaw crémeux, potato bun.",
    priceDt: 20,
    active: true,
    sortOrder: 7,
  },

  // --- CHICKEN TENDERS ---
  {
    category: "Chicken Tenders",
    name: "Chicken Tenders (2 Pièces)",
    description: "2 aiguillettes de poulet marinées ultra-croustillantes dorées à la perfection avec 1 sauce au choix.",
    priceDt: 6,
    active: true,
    sortOrder: 8,
  },
  {
    category: "Chicken Tenders",
    name: "Chicken Tenders (4 Pièces)",
    description: "4 aiguillettes de poulet marinées ultra-croustillantes dorées à la perfection avec 1 sauce au choix.",
    priceDt: 12,
    active: true,
    sortOrder: 9,
  },
  {
    category: "Chicken Tenders",
    name: "Chicken Tenders (8 Pièces)",
    description: "8 aiguillettes de poulet marinées ultra-croustillantes dorées à la perfection avec 2 sauces au choix.",
    priceDt: 22,
    active: true,
    sortOrder: 10,
  },

  // --- FRITES & SIDES ---
  {
    category: "Frites & Sides",
    name: "Frites Crinkle Croustillantes",
    description: "Frites ondulées ultra-croustillantes et dorées, assaisonnées au sel d'épices Beef & Buns.",
    priceDt: 3,
    active: true,
    sortOrder: 11,
  },

  // --- EXTRAS & SAUCES ---
  {
    category: "Extras & Sauces",
    name: "Extra Smash Patty (Bœuf)",
    description: "Steak de bœuf smashé supplémentaire 100% pur bœuf.",
    priceDt: 6,
    active: true,
    sortOrder: 12,
  },
  {
    category: "Extras & Sauces",
    name: "Bacon de Bœuf Croustillant",
    description: "Tranches de bacon de bœuf grillées croustillantes.",
    priceDt: 5,
    active: true,
    sortOrder: 13,
  },
  {
    category: "Extras & Sauces",
    name: "Pastrami Bœuf Artisanal",
    description: "Tranches de pastrami de bœuf artisanal grillé à la plancha.",
    priceDt: 5,
    active: true,
    sortOrder: 14,
  },
  {
    category: "Extras & Sauces",
    name: "Tranche American Cheese",
    description: "Fromage américain fondant supplémentaire.",
    priceDt: 3,
    active: true,
    sortOrder: 15,
  },
  {
    category: "Extras & Sauces",
    name: "Smoked Cheese (Fumé)",
    description: "Tranche de fromage fumé crémeux.",
    priceDt: 3,
    active: true,
    sortOrder: 16,
  },
  {
    category: "Extras & Sauces",
    name: "Champignons Sautés Grillés",
    description: "Portion de champignons frais revenus au beurre et herbes.",
    priceDt: 3,
    active: true,
    sortOrder: 17,
  },
  {
    category: "Extras & Sauces",
    name: "Sauce Truffle Mayo",
    description: "Mayonnaise onctueuse infusée à la truffe noire d'Italie.",
    priceDt: 3,
    active: true,
    sortOrder: 18,
  },
  {
    category: "Extras & Sauces",
    name: "Sauce Hot Spicy Maison",
    description: "Sauce piquante artisanale aux piments fumés.",
    priceDt: 3.5,
    active: true,
    sortOrder: 19,
  },
  {
    category: "Extras & Sauces",
    name: "Sauce OG Signature",
    description: "Notre sauce secrète culte, douce, relevée et fumée.",
    priceDt: 2.5,
    active: true,
    sortOrder: 20,
  },
  {
    category: "Extras & Sauces",
    name: "Jalapeños Épicés",
    description: "Rondelles de piments jalapeños croquants marinés.",
    priceDt: 2.5,
    active: true,
    sortOrder: 21,
  },
  {
    category: "Extras & Sauces",
    name: "Pickles Croquants",
    description: "Rondelles de cornichons marinés à l'aneth maison.",
    priceDt: 2,
    active: true,
    sortOrder: 22,
  },

  // --- BOISSONS ---
  {
    category: "Boissons",
    name: "Coca-Cola / Zero (33cl)",
    description: "Canette fraîche 33cl servie frappée.",
    priceDt: 3,
    active: true,
    sortOrder: 23,
  },
  {
    category: "Boissons",
    name: "Boga Cidre / Boga Lim (33cl)",
    description: "Boisson gazeuse tunisienne emblématique bien fraîche.",
    priceDt: 3,
    active: true,
    sortOrder: 24,
  },
  {
    category: "Boissons",
    name: "Fanta Orange / Sprite (33cl)",
    description: "Canette fraîche 33cl.",
    priceDt: 3,
    active: true,
    sortOrder: 25,
  },
  {
    category: "Boissons",
    name: "Eau Minérale 0.5L",
    description: "Bouteille 0.5L servie fraîche.",
    priceDt: 1.5,
    active: true,
    sortOrder: 26,
  },
  {
    category: "Boissons",
    name: "Eau Minérale 1L",
    description: "Bouteille 1L servie fraîche.",
    priceDt: 3,
    active: true,
    sortOrder: 27,
  },
];

type StorageState = {
  menuItems: LocalMenuItem[];
  reservations: LocalReservation[];
  orders: LocalOrder[];
  orderItems: LocalOrderItem[];
  slotControls: LocalSlotControl[];
  visits?: { date: string; timestamp: number }[];
  nextId: {
    menu: number;
    reservation: number;
    order: number;
    orderItem: number;
    slot: number;
  };
};

const DATA_DIR = path.resolve(import.meta.dirname, "../data");
const DATA_FILE = path.join(DATA_DIR, "local_db.json");

function loadState(): StorageState {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
      return data;
    }
  } catch (err) {
    console.warn("[LocalStore] Warning loading data, resetting to defaults:", err);
  }

  const items: LocalMenuItem[] = INITIAL_MENU_ITEMS.map((item, index) => ({
    ...item,
    id: index + 1,
  }));

  const initial: StorageState = {
    menuItems: items,
    reservations: [],
    orders: [],
    orderItems: [],
    slotControls: [],
    nextId: {
      menu: items.length + 1,
      reservation: 1,
      order: 1,
      orderItem: 1,
      slot: 1,
    },
  };
  saveState(initial);
  return initial;
}

function saveState(state: StorageState) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(state, null, 2), "utf-8");
  } catch (err) {
    console.error("[LocalStore] Error saving state:", err);
  }
}

class LocalStore {
  private state: StorageState;

  constructor() {
    this.state = loadState();
  }

  // --- MENU ---
  getMenuItems(onlyActive = true): LocalMenuItem[] {
    const items = onlyActive ? this.state.menuItems.filter(i => i.active) : this.state.menuItems;
    return [...items].sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id);
  }

  upsertMenuItem(input: {
    id?: number;
    category: string;
    name: string;
    description?: string | null;
    priceDt: number;
    active?: boolean;
    sortOrder?: number;
  }): { id: number } {
    if (input.id) {
      const idx = this.state.menuItems.findIndex(i => i.id === input.id);
      if (idx !== -1) {
        this.state.menuItems[idx] = {
          ...this.state.menuItems[idx],
          category: input.category,
          name: input.name,
          description: input.description ?? null,
          priceDt: input.priceDt,
          active: input.active ?? true,
          sortOrder: input.sortOrder ?? 0,
        };
        saveState(this.state);
        return { id: input.id };
      }
    }
    const newId = this.state.nextId.menu++;
    const newItem: LocalMenuItem = {
      id: newId,
      category: input.category,
      name: input.name,
      description: input.description ?? null,
      priceDt: input.priceDt,
      active: input.active ?? true,
      sortOrder: input.sortOrder ?? 0,
    };
    this.state.menuItems.push(newItem);
    saveState(this.state);
    return { id: newId };
  }

  toggleMenuItem(id: number, active: boolean) {
    const item = this.state.menuItems.find(i => i.id === id);
    if (item) {
      item.active = active;
      saveState(this.state);
    }
  }

  // --- AVAILABILITY / SLOTS ---
  getSlotControls(serviceDate: string): LocalSlotControl[] {
    return this.state.slotControls.filter(s => s.serviceDate === serviceDate);
  }

  setSlotControl(input: {
    serviceDate: string;
    serviceTime: string;
    status: "available" | "full" | "closed";
    note?: string | null;
  }) {
    const existing = this.state.slotControls.find(
      s => s.serviceDate === input.serviceDate && s.serviceTime === input.serviceTime
    );
    if (existing) {
      existing.status = input.status;
      existing.note = input.note ?? null;
    } else {
      this.state.slotControls.push({
        id: this.state.nextId.slot++,
        serviceDate: input.serviceDate,
        serviceTime: input.serviceTime,
        status: input.status,
        note: input.note ?? null,
      });
    }
    saveState(this.state);
  }

  getBookedGuests(serviceDate: string, serviceTime: string): number {
    return this.state.reservations
      .filter(
        r =>
          r.serviceDate === serviceDate &&
          r.serviceTime === serviceTime &&
          (r.status === "pending" || r.status === "confirmed")
      )
      .reduce((sum, r) => sum + r.guests, 0);
  }

  // --- RESERVATIONS ---
  createReservation(input: {
    name: string;
    phone: string;
    email?: string | null;
    serviceDate: string;
    serviceTime: string;
    guests: number;
    notes?: string | null;
  }): { id: number; status: "pending" } {
    const id = this.state.nextId.reservation++;
    const res: LocalReservation = {
      id,
      name: input.name,
      phone: input.phone,
      email: input.email ?? null,
      serviceDate: input.serviceDate,
      serviceTime: input.serviceTime,
      guests: input.guests,
      notes: input.notes ?? null,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    this.state.reservations.push(res);
    saveState(this.state);
    return { id, status: "pending" };
  }

  getReservations(serviceDate?: string): LocalReservation[] {
    let list = this.state.reservations;
    if (serviceDate) {
      list = list.filter(r => r.serviceDate === serviceDate);
    }
    return [...list].sort(
      (a, b) =>
        b.serviceDate.localeCompare(a.serviceDate) ||
        a.serviceTime.localeCompare(b.serviceTime) ||
        b.createdAt.localeCompare(a.createdAt)
    );
  }

  updateReservationStatus(id: number, status: LocalReservation["status"]) {
    const res = this.state.reservations.find(r => r.id === id);
    if (res) {
      res.status = status;
      saveState(this.state);
    }
  }

  // --- ORDERS ---
  createOrder(input: {
    customerName: string;
    phone: string;
    orderType: "pickup" | "delivery";
    address?: string | null;
    notes?: string | null;
    items: Array<{ menuItemId: number; quantity: number }>;
  }): { id: number; totalDt: number; status: "new" } {
    const orderId = this.state.nextId.order++;
    const menuMap = new Map(this.state.menuItems.map(m => [m.id, m]));

    const orderLines: LocalOrderItem[] = [];
    let totalDt = 0;

    for (const item of input.items) {
      const menuItem = menuMap.get(item.menuItemId);
      if (!menuItem) {
        throw new Error("Un article du panier n'est plus disponible.");
      }
      const lineTotal = menuItem.priceDt * item.quantity;
      totalDt += lineTotal;
      orderLines.push({
        id: this.state.nextId.orderItem++,
        orderId,
        menuItemId: menuItem.id,
        name: menuItem.name,
        unitPriceDt: menuItem.priceDt,
        quantity: item.quantity,
      });
    }

    const order: LocalOrder = {
      id: orderId,
      customerName: input.customerName,
      phone: input.phone,
      orderType: input.orderType,
      address: input.address ?? null,
      notes: input.notes ?? null,
      totalDt,
      status: "new",
      createdAt: new Date().toISOString(),
    };

    this.state.orders.push(order);
    this.state.orderItems.push(...orderLines);
    saveState(this.state);

    return { id: orderId, totalDt, status: "new" };
  }

  getOrders(status?: string): LocalOrder[] {
    let list = this.state.orders;
    if (status) {
      list = list.filter(o => o.status === status);
    }
    return [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  getOrderItems(orderId: number): LocalOrderItem[] {
    return this.state.orderItems.filter(i => i.orderId === orderId);
  }

  updateOrderStatus(id: number, status: LocalOrder["status"]) {
    const order = this.state.orders.find(o => o.id === id);
    if (order) {
      order.status = status;
      saveState(this.state);
    }
  }

  recordVisit(): void {
    if (!this.state.visits) {
      this.state.visits = [];
    }
    const date = new Date().toISOString().slice(0, 10);
    this.state.visits.push({ date, timestamp: Date.now() });
    if (this.state.visits.length > 5000) {
      this.state.visits = this.state.visits.slice(-5000);
    }
    saveState(this.state);
  }

  getVisitStats(): { today: number; week: number; month: number; year: number; total: number } {
    const list = this.state.visits || [];
    const now = Date.now();
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
    const todayStr = new Date().toISOString().slice(0, 10);
    const monthStr = todayStr.slice(0, 7);
    const yearStr = todayStr.slice(0, 4);
    let today = 0;
    let week = 0;
    let month = 0;
    let year = 0;

    for (const v of list) {
      if (v.date === todayStr) today++;
      if (v.timestamp >= sevenDaysAgo) week++;
      if (v.date.startsWith(monthStr)) month++;
      if (v.date.startsWith(yearStr)) year++;
    }
    return {
      today,
      week,
      month,
      year,
      total: list.length,
    };
  }
}

export const localStore = new LocalStore();
