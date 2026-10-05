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
  // --- ENTRÉES ---
  {
    category: "Entrées",
    name: "Burrata crémeuse",
    description: "Marmelade de tomates, pickles de gingembre, crème citronnée et basilic frais.",
    priceDt: 27,
    active: true,
    sortOrder: 1,
  },
  {
    category: "Entrées",
    name: "Carpaccio de Bœuf Truffé",
    description: "Fines tranches de filet de bœuf, copeaux de grana padano, roquette et huile de truffe.",
    priceDt: 32,
    active: true,
    sortOrder: 2,
  },
  {
    category: "Entrées",
    name: "Bruschetta Gourmande Saumon",
    description: "Pain de campagne grillé, saumon gravlax, ricotta aux herbes et câpres croquantes.",
    priceDt: 24,
    active: true,
    sortOrder: 3,
  },
  {
    category: "Entrées",
    name: "Salade Caprese Di Bufala",
    description: "Tomates savoureuses, mozzarella di bufala, réduction balsamique et basilic.",
    priceDt: 26,
    active: true,
    sortOrder: 4,
  },
  {
    category: "Entrées",
    name: "Fritto Misto de la Mer",
    description: "Calamars, crevettes et seiches croustillants, mayonnaise citronnée maison.",
    priceDt: 34,
    active: true,
    sortOrder: 5,
  },

  // --- PÂTES FRAÎCHES ---
  {
    category: "Pâtes",
    name: "Rigatoni Effiloché de Bœuf",
    description: "Sauce tomates mijotée, tomates séchées, bœuf fondant et crème de parmesan.",
    priceDt: 36,
    active: true,
    sortOrder: 6,
  },
  {
    category: "Pâtes",
    name: "Rigatoni Poivrons Fumés et Crevettes",
    description: "Crevettes sautées, crème de poivrons fumés, miel, noisettes et figues séchées.",
    priceDt: 42,
    active: true,
    sortOrder: 7,
  },
  {
    category: "Pâtes",
    name: "Tagliatelles aux Fruits de Mer",
    description: "Crevettes, moules, seiches, bisque maison, tomates cerises et persil plat.",
    priceDt: 46,
    active: true,
    sortOrder: 8,
  },
  {
    category: "Pâtes",
    name: "Raviolis Ricotta & Épinards",
    description: "Pâtes fraîches maison farcies, beurre de sauge parfumé et crème de parmesan.",
    priceDt: 34,
    active: true,
    sortOrder: 9,
  },
  {
    category: "Pâtes",
    name: "Penne au Poulet et Champignons",
    description: "Émincé de poulet fermier, champignons de Paris, crème fraîche et parmesan.",
    priceDt: 32,
    active: true,
    sortOrder: 10,
  },
  {
    category: "Pâtes",
    name: "Spaghetti Al Pomodoro & Burrata",
    description: "Sauce tomate napolitaine au basilic frais, couronnée d'une burrata entière.",
    priceDt: 35,
    active: true,
    sortOrder: 11,
  },
  {
    category: "Pâtes",
    name: "Risotto aux Crevettes & Safran",
    description: "Riz carnaroli crémeux, bouillon de crustacés, crevettes fraîches et parmesan.",
    priceDt: 44,
    active: true,
    sortOrder: 12,
  },

  // --- PIZZAS ---
  {
    category: "Pizzas",
    name: "La Margherita",
    description: "Sauce tomate italienne, mozzarella fior di latte, grana padano et basilic frais.",
    priceDt: 22,
    active: true,
    sortOrder: 13,
  },
  {
    category: "Pizzas",
    name: "Quattro Formaggi",
    description: "Mozzarella, gorgonzola, grana padano, ricotta crémeuse et touche de miel.",
    priceDt: 28,
    active: true,
    sortOrder: 14,
  },
  {
    category: "Pizzas",
    name: "Pizza Diavola",
    description: "Sauce tomate, mozzarella fior di latte, salami piquant italien et piments doux.",
    priceDt: 29,
    active: true,
    sortOrder: 15,
  },
  {
    category: "Pizzas",
    name: "Pizza Per Voi Truffe",
    description: "Crème de truffe blanche, mozzarella, champignons sautés, parmesan et roquette.",
    priceDt: 38,
    active: true,
    sortOrder: 16,
  },
  {
    category: "Pizzas",
    name: "Pizza Frutti di Mare",
    description: "Sauce tomate, mozzarella, fruits de mer frais de Sousse, ail confit et persil.",
    priceDt: 39,
    active: true,
    sortOrder: 17,
  },
  {
    category: "Pizzas",
    name: "Pizza Végétarienne Grillée",
    description: "Courgettes, aubergines marinées, poivrons rôtis, mozzarella et origan.",
    priceDt: 25,
    active: true,
    sortOrder: 18,
  },

  // --- TERRE & MER ---
  {
    category: "Terre & mer",
    name: "Filet de Bœuf au Poivre Vert",
    description: "Filet de bœuf tendre, sauce au poivre vert et crème, légumes sautés du jour.",
    priceDt: 54,
    active: true,
    sortOrder: 19,
  },
  {
    category: "Terre & mer",
    name: "Daurade Royale Grillée",
    description: "Filet de daurade fraîche, écrasé de pommes de terre à l'huile d'olive et caviar d'aubergines.",
    priceDt: 48,
    active: true,
    sortOrder: 20,
  },
  {
    category: "Terre & mer",
    name: "Escalope Milanaise Croustillante",
    description: "Escalope de veau panée dorée au beurre clarifié, servie avec spaghettis al pomodoro.",
    priceDt: 38,
    active: true,
    sortOrder: 21,
  },
  {
    category: "Terre & mer",
    name: "Saumon Poêlé aux Agrumes",
    description: "Pavé de saumon croustillant, réduction d'agrumes, fenouil croquant et riz safrané.",
    priceDt: 52,
    active: true,
    sortOrder: 22,
  },

  // --- DESSERTS ---
  {
    category: "Desserts",
    name: "Tiramisu Classico",
    description: "Café espresso italien, mascarpone onctueux, biscuits savoiardi et pur cacao amer.",
    priceDt: 23,
    active: true,
    sortOrder: 23,
  },
  {
    category: "Desserts",
    name: "Panna Cotta Vanille & Fruits Rouges",
    description: "Crème cuite à la vanille bourbon de Madagascar, coulis acidulé de framboises.",
    priceDt: 18,
    active: true,
    sortOrder: 24,
  },
  {
    category: "Desserts",
    name: "Pizza Nutella & Pistaches",
    description: "Pâte fine et croustillante au four, Nutella fondant et éclats de pistaches grillées.",
    priceDt: 24,
    active: true,
    sortOrder: 25,
  },
  {
    category: "Desserts",
    name: "Fondant au Chocolat Coeur Coulant",
    description: "Chocolat noir 70%, cœur coulant intense, servi avec glace vanille.",
    priceDt: 22,
    active: true,
    sortOrder: 26,
  },

  // --- BOISSONS ---
  {
    category: "Boissons",
    name: "Mocktail Signature Per Voi",
    description: "Jus d'agrumes frais de Tunisie, menthe pilée, purée de passion et eau pétillante.",
    priceDt: 14,
    active: true,
    sortOrder: 27,
  },
  {
    category: "Boissons",
    name: "Mojito Frais Maison",
    description: "Citron vert pressé, feuilles de menthe fraîche, sucre de canne et soda.",
    priceDt: 12,
    active: true,
    sortOrder: 28,
  },
  {
    category: "Boissons",
    name: "Limonade Artisanale Menthe",
    description: "Citrons frais pressés minute, sirop de menthe maison et glace pilée.",
    priceDt: 10,
    active: true,
    sortOrder: 29,
  },
  {
    category: "Boissons",
    name: "Espresso Italien",
    description: "Sélection de café italien torréfié artisanalement.",
    priceDt: 5,
    active: true,
    sortOrder: 30,
  },
  {
    category: "Boissons",
    name: "Eau Minérale / Gazeuse 1L",
    description: "Bouteille en verre servie bien fraîche.",
    priceDt: 4,
    active: true,
    sortOrder: 31,
  },
];

type StorageState = {
  menuItems: LocalMenuItem[];
  reservations: LocalReservation[];
  orders: LocalOrder[];
  orderItems: LocalOrderItem[];
  slotControls: LocalSlotControl[];
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
}

export const localStore = new LocalStore();
