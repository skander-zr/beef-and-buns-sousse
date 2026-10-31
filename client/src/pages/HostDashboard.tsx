import React, { useState, useEffect, useMemo, useRef } from "react";
import { toast } from "sonner";
import {
  Lock,
  RefreshCw,
  Clock,
  Phone,
  MapPin,
  ShoppingBag,
  Flame,
  CheckCircle2,
  ExternalLink,
  Volume2,
  VolumeX,
  TrendingUp,
  UtensilsCrossed,
  Truck,
  PackageCheck,
  CalendarDays,
  History,
  Check,
  Trash2
} from "lucide-react";
import { FULL_MENU_ITEMS } from "./Home";

export interface HostOrder {
  id: number;
  customerName: string;
  phone: string;
  orderType: "pickup" | "delivery";
  neighborhood?: string;
  address?: string;
  notes?: string;
  items: Array<{
    name: string;
    quantity: number;
    totalPrice: number;
    pattiesCount?: number;
    selectedExtras?: Array<{ name: string; price: number }>;
    removedIngredients?: string[];
  }>;
  totalDt: number;
  status: "new" | "preparing" | "ready" | "completed" | "cancelled";
  date: string; // YYYY-MM-DD
  createdAt: string; // HH:mm
}


// Helper to get formatted date string YYYY-MM-DD
function getDateString(offsetDays = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

// Calculate current week days (Monday to Sunday)
function getCurrentWeekDays(): Array<{ name: string; shortName: string; date: string; isToday: boolean }> {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 is Sunday, 1 is Monday ... 6 is Saturday
  const distanceToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(now);
  monday.setDate(now.getDate() + distanceToMonday);

  const daysNames = [
    { short: "Lun", full: "Lundi" },
    { short: "Mar", full: "Mardi" },
    { short: "Mer", full: "Mercredi" },
    { short: "Jeu", full: "Jeudi" },
    { short: "Ven", full: "Vendredi" },
    { short: "Sam", full: "Samedi" },
    { short: "Dim", full: "Dimanche" }
  ];

  const todayStr = now.toISOString().slice(0, 10);

  return daysNames.map((d, index) => {
    const currentDay = new Date(monday);
    currentDay.setDate(monday.getDate() + index);
    const dateStr = currentDay.toISOString().slice(0, 10);
    return {
      name: d.full,
      shortName: d.short,
      date: dateStr,
      isToday: dateStr === todayStr
    };
  });
}

// Helper to format date in French
function formatDisplayDate(dateStr: string): string {
  try {
    const [y, m, d] = dateStr.split("-").map(Number);
    const dateObj = new Date(y, m - 1, d);
    return dateObj.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long"
    });
  } catch {
    return dateStr;
  }
}

// Audio chime synthesizer
function playKitchenChime() {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.45);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  } catch {
    // Ignore audio restrictions
  }
}

// Robust sanitizer with safe default values for every field so page never crashes
function sanitizeOrder(raw: any): HostOrder {
  const todayStr = getDateString(0);
  const rawStatus = String(raw?.status || "new").toLowerCase();
  let status: HostOrder["status"] = "new";
  if (rawStatus === "preparing" || rawStatus.includes("prep") || rawStatus.includes("cuisson")) {
    status = "preparing";
  } else if (rawStatus === "ready" || rawStatus.includes("pret") || rawStatus.includes("prête")) {
    status = "ready";
  } else if (rawStatus === "completed" || rawStatus.includes("term") || rawStatus.includes("livre")) {
    status = "completed";
  } else if (rawStatus === "cancelled" || rawStatus.includes("annul")) {
    status = "cancelled";
  } else {
    status = "new";
  }

  const rawItems = Array.isArray(raw?.items) ? raw.items : [];
  const items = rawItems.map((it: any) => ({
    name: String(it?.name || "Article"),
    quantity: Number(it?.quantity || 1),
    totalPrice: Number(it?.totalPrice || 0),
    pattiesCount: it?.pattiesCount ? Number(it.pattiesCount) : undefined,
    selectedExtras: Array.isArray(it?.selectedExtras) ? it.selectedExtras : [],
    removedIngredients: Array.isArray(it?.removedIngredients) ? it.removedIngredients : []
  }));

  const totalDt = Number(raw?.totalDt !== undefined ? raw.totalDt : (raw?.total !== undefined ? raw.total : 0));

  return {
    id: Number(raw?.id || 1),
    customerName: String(raw?.customerName || "Client"),
    phone: String(raw?.phone || ""),
    orderType: raw?.orderType === "delivery" ? "delivery" : "pickup",
    neighborhood: raw?.neighborhood ? String(raw.neighborhood) : undefined,
    address: raw?.address ? String(raw.address) : undefined,
    notes: raw?.notes ? String(raw.notes) : undefined,
    items,
    totalDt: isNaN(totalDt) ? 0 : totalDt,
    status,
    date: String(raw?.date || todayStr),
    createdAt: String(raw?.createdAt || new Date().toLocaleTimeString("fr-FR", { timeZone: "Africa/Tunis", hour: "2-digit", minute: "2-digit" }))
  };
}

// Helper to parse ntfy messages and merge with orders safely
function parseNtfyMessages(rawText: string, currentOrders: HostOrder[]): HostOrder[] {
  const ordersMap = new Map<number, HostOrder>();

  // Seed with current orders
  for (const o of currentOrders) {
    if (o && typeof o.id === "number") {
      ordersMap.set(o.id, sanitizeOrder(o));
    }
  }

  try {
    const lines = (rawText || "").trim().split("\n").filter(Boolean);
    for (const line of lines) {
      try {
        const evt = JSON.parse(line);
        if (evt && evt.event === "message" && evt.message) {
          try {
            const data = JSON.parse(evt.message);
            if (data && (data.type === "order_deleted" || (data.type === "status_update" && data.status === "cancelled"))) {
              if (data.orderId) {
                ordersMap.delete(Number(data.orderId));
              }
            } else if (data && data.type === "status_update" && data.orderId) {
              const existing = ordersMap.get(data.orderId);
              if (existing) {
                ordersMap.set(data.orderId, sanitizeOrder({ ...existing, status: data.status }));
              }
            } else if (data && data.id) {
              if (data.status === "cancelled") {
                ordersMap.delete(Number(data.id));
              } else {
                const sanitized = sanitizeOrder(data);
                const existing = ordersMap.get(sanitized.id);
                if (existing) {
                  const statusOrder = ["new", "preparing", "ready", "completed", "cancelled"];
                  const currentIdx = statusOrder.indexOf(existing.status);
                  const newIdx = statusOrder.indexOf(sanitized.status);
                  const chosenStatus = currentIdx > newIdx ? existing.status : sanitized.status;
                  ordersMap.set(sanitized.id, { ...sanitized, status: chosenStatus });
                } else {
                  ordersMap.set(sanitized.id, sanitized);
                }
              }
            }
          } catch (innerErr) {
            console.warn("Could not parse inner message from ntfy", innerErr);
          }
        }
      } catch (lineErr) {
        console.warn("Could not parse ntfy event line", lineErr);
      }
    }
  } catch (err) {
    console.error("parseNtfyMessages error", err);
  }

  return Array.from(ordersMap.values()).sort((a, b) => b.id - a.id);
}

export default function HostDashboard() {
  // 1. ALL useState AND useRef AT THE VERY TOP (STRICTLY BEFORE ANY useEffect OR HANDLER)
  const [pinInput, setPinInput] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(() => {
    return sessionStorage.getItem("beef-and-buns-host-unlocked") === "true";
  });
  const [pinError, setPinError] = useState(false);

  // Sound toggle state & ref (Declared together at the top)
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const isSoundEnabledRef = useRef(true);

  // Today key and week days
  const todayStr = useMemo(() => getDateString(0), []);
  const weekDays = useMemo(() => getCurrentWeekDays(), []);
  const weekDateStrings = useMemo(() => weekDays.map(d => d.date), [weekDays]);

  // Orders State (No fake orders, 100% real client orders with safe defaults)
  const [orders, setOrders] = useState<HostOrder[]>(() => {
    try {
      const saved = localStorage.getItem("beef_and_buns_host_orders");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed
            .filter((o: any) => o && o.id !== 4892 && o.id !== 4891 && o.id !== 4890 && o.customerName !== "Client Test Sousse")
            .map(sanitizeOrder);
        }
      }
    } catch {}
    return [];
  });

  // Menu Active Items State (27 official items)
  const [disabledMenuIds, setDisabledMenuIds] = useState<(string | number)[]>(() => {
    try {
      const saved = localStorage.getItem("beef_and_buns_disabled_menu_ids");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Filters & Tabs
  const [selectedDayTab, setSelectedDayTab] = useState<"today" | "week" | "all">("today");
  const [selectedWeekDayDate, setSelectedWeekDayDate] = useState<string>("all-week");
  const [selectedStatusTab, setSelectedStatusTab] = useState<"all" | "new" | "preparing" | "ready" | "completed">("all");
    const [currentTimeStr, setCurrentTimeStr] = useState("");

  
  // 2. ALL UTILITY FUNCTIONS & EVENT HANDLERS (BEFORE ANY useEffect)
  const playSound = () => {
    if (isSoundEnabledRef.current) {
      playKitchenChime();
    }
  };

  const loadOrders = async () => {
    try {
      const res = await fetch("https://ntfy.sh/beef_buns_sousse_orders_live/json?poll=1");
      if (res.ok) {
        const text = await res.text();
        setOrders(prev => {
          const merged = parseNtfyMessages(text, prev);
          try {
            localStorage.setItem("beef_and_buns_host_orders", JSON.stringify(merged));
          } catch {}
          return merged;
        });
      }
    } catch (err) {
      console.warn("Could not poll ntfy orders", err);
    }
  };

  
  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === "2026") {
      sessionStorage.setItem("beef-and-buns-host-unlocked", "true");
      setIsUnlocked(true);
      setPinError(false);
      playSound();
      toast.success("Bienvenue dans l'espace hôte Beef & Buns Sousse !");
    } else {
      setPinError(true);
      toast.error("Code PIN incorrect. Veuillez réessayer.");
    }
  };

  const handleLock = () => {
    sessionStorage.removeItem("beef-and-buns-host-unlocked");
    setIsUnlocked(false);
    setPinInput("");
    toast.info("Espace hôte verrouillé.");
  };

  const handleUpdateOrderStatus = (orderId: number, newStatus: HostOrder["status"]) => {
    if (newStatus === "cancelled") {
      // Annulation : La commande est immédiatement supprimée et disparaît de l'écran et du CA
      setOrders(prev => {
        const updated = prev.filter(o => o.id !== orderId);
        try {
          localStorage.setItem("beef_and_buns_host_orders", JSON.stringify(updated));
        } catch {}
        return updated;
      });

      try {
        fetch("https://ntfy.sh/beef_buns_sousse_orders_live", {
          method: "POST",
          headers: {
            "Title": `Commande #${orderId} Annulée / Supprimée`,
            "Priority": "default"
          },
          body: JSON.stringify({
            type: "order_deleted",
            orderId
          })
        }).catch(err => console.error("Failed to sync delete to ntfy", err));
      } catch {}

      toast.info(`Commande #${orderId} annulée et retirée de la liste.`);
      return;
    }

    setOrders(prev => {
      const updated = prev.map(o => o.id === orderId ? sanitizeOrder({ ...o, status: newStatus }) : o);
      try {
        localStorage.setItem("beef_and_buns_host_orders", JSON.stringify(updated));
      } catch {}
      return updated;
    });

    try {
      fetch("https://ntfy.sh/beef_buns_sousse_orders_live", {
        method: "POST",
        headers: {
          "Title": `Statut Commande #${orderId} -> ${newStatus}`,
          "Priority": "default"
        },
        body: JSON.stringify({
          type: "status_update",
          orderId,
          status: newStatus
        })
      }).catch(err => console.error("Failed to sync status update to ntfy", err));
    } catch {}

    playSound();
    const labels = {
      new: "Nouvelle",
      preparing: "En préparation sur plancha 🔥",
      ready: "Prête pour remise / livraison 🥡",
      completed: "Terminée & Archivée ✅",
      cancelled: "Annulée ❌"
    };
    toast.success(`Commande #${orderId} : ${labels[newStatus]}`);
  };

  const handleToggleMenuItem = (itemId: string | number, itemName: string) => {
    setDisabledMenuIds(prev => {
      const isCurrentlyDisabled = prev.includes(itemId);
      const updated = isCurrentlyDisabled ? prev.filter(id => id !== itemId) : [...prev, itemId];
      toast.info(isCurrentlyDisabled ? `"${itemName}" remis en vente` : `"${itemName}" marqué en rupture / masqué`);
      return updated;
    });
  };

  
  // 3. ALL useEffect HOOKS (Strictly after state, refs, and functions)
  useEffect(() => {
    isSoundEnabledRef.current = isSoundEnabled;
  }, [isSoundEnabled]);

  // Clean out legacy fake orders and reset past test orders on initial load
  useEffect(() => {
    try {
      const isResetDone = localStorage.getItem("bb_orders_reset_live_v1");
      if (!isResetDone) {
        localStorage.removeItem("beef_and_buns_host_orders");
        localStorage.removeItem("bb_order_counter");
        localStorage.removeItem("bb_last_order_date");
        localStorage.setItem("bb_orders_reset_live_v1", "true");
        setOrders([]);
      }
    } catch {}
  }, []);

  // Listen to new orders placed on phones & PCs via ntfy.sh cloud in real time + localStorage
  useEffect(() => {
    loadOrders();

    let es: EventSource | null = null;
    try {
      es = new EventSource("https://ntfy.sh/beef_buns_sousse_orders_live/sse");

      es.onmessage = (event) => {
        try {
          if (!event || !event.data) return;
          const evt = JSON.parse(event.data);
          if (evt && evt.event === "message" && evt.message) {
            try {
              const data = JSON.parse(evt.message);
              if (!data) return;

              if (data.type === "order_deleted" || (data.type === "status_update" && data.status === "cancelled")) {
                const targetId = Number(data.orderId || data.id);
                setOrders(prev => {
                  const updated = prev.filter(o => o.id !== targetId);
                  try {
                    localStorage.setItem("beef_and_buns_host_orders", JSON.stringify(updated));
                  } catch {}
                  return updated;
                });
              } else if (data.type === "status_update" && data.orderId) {
                setOrders(prev => {
                  const updated = prev.map(o => o.id === data.orderId ? sanitizeOrder({ ...o, status: data.status }) : o);
                  try {
                    localStorage.setItem("beef_and_buns_host_orders", JSON.stringify(updated));
                  } catch {}
                  return updated;
                });
              } else if (data.id && typeof data.id === "number") {
                if (data.status === "cancelled") {
                  setOrders(prev => {
                    const updated = prev.filter(o => o.id !== Number(data.id));
                    try {
                      localStorage.setItem("beef_and_buns_host_orders", JSON.stringify(updated));
                    } catch {}
                    return updated;
                  });
                } else {
                  const safeOrder = sanitizeOrder(data);
                  setOrders(prev => {
                    const exists = prev.some(o => o.id === safeOrder.id);
                    if (exists) {
                      return prev.map(o => o.id === safeOrder.id ? { ...o, ...safeOrder } : o);
                    }

                    playSound();
                    toast.success(`🔔 Nouvelle commande reçue ! #${safeOrder.id} (${safeOrder.customerName})`, {
                      duration: 6000
                    });

                    const updated = [safeOrder, ...prev];
                    try {
                      localStorage.setItem("beef_and_buns_host_orders", JSON.stringify(updated));
                    } catch {}
                    return updated;
                  });
                }
              }
            } catch (innerErr) {
              console.error("Error parsing inner ntfy message", innerErr);
            }
          }
        } catch (e) {
          console.error("Error parsing ntfy SSE event", e);
        }
      };

      es.onerror = (e) => {
        console.warn("ntfy SSE reconnecting...", e);
      };
    } catch (err) {
      console.error("EventSource initialization error", err);
    }

    const handleStorageChange = () => {
      try {
        const saved = localStorage.getItem("beef_and_buns_host_orders");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            const cleaned = parsed
              .filter((o: any) => o && o.id !== 4892 && o.id !== 4891 && o.id !== 4890 && o.customerName !== "Client Test Sousse")
              .map(sanitizeOrder);
            setOrders(cleaned);
          }
        }
      } catch {}
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      if (es) {
        es.close();
      }
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  
  
  // Live Clock
  useEffect(() => {
    const updateTime = () => {
      setCurrentTimeStr(new Date().toLocaleTimeString("fr-FR", { timeZone: "Africa/Tunis" }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Save Orders
  useEffect(() => {
    try {
      localStorage.setItem("beef_and_buns_host_orders", JSON.stringify(orders));
    } catch {}
  }, [orders]);

  // Save Menu
  useEffect(() => {
    try {
      localStorage.setItem("beef_and_buns_disabled_menu_ids", JSON.stringify(disabledMenuIds));
    } catch {}
  }, [disabledMenuIds]);

  // 1. Filter orders by Day Tab (Aujourd'hui / Semaine / Toutes)
  const ordersForSelectedDay = useMemo(() => {
    if (selectedDayTab === "today") {
      return orders.filter(o => o.date === todayStr || (!o.date && o.createdAt));
    }
    if (selectedDayTab === "week") {
      if (selectedWeekDayDate === "all-week") {
        return orders.filter(o => weekDateStrings.includes(o.date) || o.date === todayStr);
      }
      return orders.filter(o => o.date === selectedWeekDayDate);
    }
    return orders;
  }, [orders, selectedDayTab, todayStr, weekDateStrings, selectedWeekDayDate]);

  // 2. Filter orders by Status Tab
  const filteredOrders = useMemo(() => {
    if (selectedStatusTab === "all") return ordersForSelectedDay;
    return ordersForSelectedDay.filter(o => o.status === selectedStatusTab);
  }, [ordersForSelectedDay, selectedStatusTab]);

  // Statistics Calculation
  const todayOrders = useMemo(() => orders.filter(o => o.date === todayStr || (!o.date && o.createdAt)), [orders, todayStr]);
  const weekOrders = useMemo(() => orders.filter(o => weekDateStrings.includes(o.date) || o.date === todayStr), [orders, weekDateStrings, todayStr]);

  const todayOrdersCount = todayOrders.length;
  const weekOrdersCount = weekOrders.length;

  const todayRevenueDt = todayOrders
    .filter(o => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.totalDt, 0);

  const weekRevenueDt = weekOrders
    .filter(o => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.totalDt, 0);

  const activePreparingCount = orders.filter(o => o.status === "preparing").length;
  const activeNewCount = orders.filter(o => o.status === "new").length;

  // VISITOR METRICS (100% REAL LIVE TRACKING - ZERO FAKE NUMBERS)
  
  // Grouped Menu
  const groupedMenu = useMemo(() => {
    const groups: Record<string, typeof FULL_MENU_ITEMS> = {};
    FULL_MENU_ITEMS.forEach(item => {
      if (!groups[item.category]) groups[item.category] = [];
      groups[item.category].push(item);
    });
    return groups;
  }, []);

  // 1. PIN LOCK SCREEN
  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-[#070709] text-white flex flex-col items-center justify-center p-4 selection:bg-[#ff3b30]">
        <div className="w-full max-w-sm rounded-3xl bg-gradient-to-b from-[#14141a] to-[#0d0d12] border border-white/10 p-7 sm:p-8 shadow-2xl flex flex-col items-center text-center relative overflow-hidden">
          
          {/* Ambient Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-32 bg-[#ff3b30]/20 rounded-full blur-3xl pointer-events-none" />

          {/* 3D Burger Emblem */}
          <div className="relative mb-4">
            <img
              src="/logos/logo_3d_embleme_burger.png"
              alt="Beef & Buns Emblème 3D"
              className="w-20 h-20 sm:w-24 sm:h-24 object-contain animate-float-3d"
              style={{ filter: "drop-shadow(0 10px 20px rgba(220, 38, 38, 0.45))" }}
            />
          </div>

          <img
            src="/logos/logo_3d_texte_beef_and_buns.png"
            alt="BEEF & BUNS"
            className="h-6 sm:h-7 w-auto object-contain mb-2"
          />

          <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#f59e0b] px-2.5 py-0.5 rounded-full bg-[#f59e0b]/10 border border-[#f59e0b]/30 mb-2">
            Espace Hôte & Cuisine • Sousse
          </span>

          <p className="text-xs text-[#a1a1aa] mb-6">
            Accès sécurisé réservé au personnel, cuisiniers et gérant du restaurant.
          </p>

          <form onSubmit={handleUnlock} className="w-full space-y-4">
            <div className="relative">
              <input
                type="password"
                maxLength={6}
                autoFocus
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError(false);
                }}
                placeholder="Code PIN (ex: 2026)"
                className={`w-full rounded-2xl border px-4 py-3.5 text-center text-xl font-mono tracking-widest text-white outline-none transition-all placeholder:text-[#52525b] ${
                  pinError
                    ? "border-red-500 bg-red-500/10 shadow-lg shadow-red-500/20"
                    : "border-white/15 bg-black/60 focus:border-[#ff3b30] focus:ring-2 focus:ring-[#ff3b30]/30"
                }`}
              />
              <Lock className="w-4 h-4 text-[#71717a] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {pinError && (
              <p className="text-xs text-red-400 font-semibold animate-shake">
                Code PIN erroné. Veuillez réessayer.
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#ff3b30] to-[#e11d48] text-white font-bold text-xs uppercase tracking-wider shadow-xl shadow-[#ff3b30]/30 hover:scale-[1.02] active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Déverrouiller l'Espace Hôte</span>
            </button>

            <div className="pt-2">
              <p className="text-[11px] text-[#71717a]">
                Code d'accès par défaut : <strong className="text-white font-mono">2026</strong>
              </p>
            </div>
          </form>

          {/* Quick return to public site */}
          <div className="mt-6 pt-4 border-t border-white/10 w-full">
            <a
              href="/"
              className="text-xs text-[#a1a1aa] hover:text-white transition-colors flex items-center justify-center gap-1.5"
            >
              <span>← Retourner au site public</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  // 2. UNLOCKED DASHBOARD
  return (
    <div className="min-h-screen bg-[#070709] text-white flex flex-col selection:bg-[#ff3b30]">
      
      {/* TOP HOST NAVIGATION BAR */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[#09090b]/90 border-b border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        
        {/* Brand Left */}
        <div className="flex items-center gap-3">
          <img
            src="/logos/logo_3d_embleme_burger.png"
            alt="Beef & Buns"
            className="w-9 h-9 sm:w-10 sm:h-10 object-contain shrink-0"
            style={{ filter: "drop-shadow(0 4px 10px rgba(220, 38, 38, 0.4))" }}
          />
          <div>
            <div className="flex items-center gap-2">
              <img
                src="/logos/logo_3d_texte_beef_and_buns.png"
                alt="BEEF & BUNS"
                className="h-4 sm:h-5 w-auto object-contain block"
              />
              <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#ff3b30]/20 text-[#ff3b30] border border-[#ff3b30]/30 hidden sm:inline-block">
                ESPACE HÔTE
              </span>
            </div>
            <p className="text-[9px] uppercase tracking-widest text-[#a1a1aa] font-semibold">
              Sousse • Tableau de Bord Cuisine
            </p>
          </div>
        </div>

        {/* Live Status Indicators & Actions Right */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          
          {/* Live Clock */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-zinc-300">
            <Clock className="w-3.5 h-3.5 text-[#f59e0b]" />
            <span>{currentTimeStr || "12:00:00"}</span>
            <span className="text-[10px] text-zinc-500 font-sans">Sousse</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => setIsSoundEnabled(!isSoundEnabled)}
            title={isSoundEnabled ? "Désactiver le son" : "Activer le son"}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-[#a1a1aa] hover:text-white transition-colors cursor-pointer"
          >
            {isSoundEnabled ? <Volume2 className="w-4 h-4 text-[#f59e0b]" /> : <VolumeX className="w-4 h-4 text-zinc-500" />}
          </button>

          {/* Refresh Button */}
          <button
            onClick={async () => {
              try {
                const res = await fetch("https://ntfy.sh/beef_buns_sousse_orders_live/json?poll=1");
                if (res.ok) {
                  const text = await res.text();
                  setOrders(prev => {
                    const merged = parseNtfyMessages(text, prev);
                    localStorage.setItem("beef_and_buns_host_orders", JSON.stringify(merged));
                    return merged;
                  });
                } else {
                  const saved = localStorage.getItem("beef_and_buns_host_orders");
                  if (saved) setOrders(JSON.parse(saved));
                }
              } catch {
                const saved = localStorage.getItem("beef_and_buns_host_orders");
                if (saved) setOrders(JSON.parse(saved));
              }
              toast.info("Commandes actualisées");
            }}
            title="Actualiser"
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-[#a1a1aa] hover:text-white transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Reset All Orders & CA Button */}
          <button
            onClick={() => {
              if (window.confirm("Êtes-vous sûr de vouloir vider toutes les commandes et remettre le CA à 0 ?")) {
                localStorage.removeItem("beef_and_buns_host_orders");
                localStorage.removeItem("bb_order_counter");
                setOrders([]);
                toast.success("Commandes vidées et CA remis à 0 DT !");
              }
            }}
            title="Vider les commandes & Reset CA"
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-[#a1a1aa] hover:text-red-400 hover:border-red-500/40 transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          {/* Site Public Button */}
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 text-xs font-semibold transition-all"
          >
            <span>Site Public</span>
            <ExternalLink className="w-3 h-3 text-zinc-400" />
          </a>

          {/* Lock Button */}
          <button
            onClick={handleLock}
            title="Verrouiller l'espace hôte"
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-[#a1a1aa] hover:text-white border border-white/10 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Verrouiller</span>
          </button>
        </div>
      </header>

      {/* DASHBOARD MAIN CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        
        {/* KPI OVERVIEW CARDS */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
          
          {/* Card 1: Commandes Cette Semaine (avec sous-détail aujourd'hui) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#14141a] to-[#0e0e12] border border-white/10 flex flex-col justify-between shadow-lg">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#a1a1aa] flex items-center gap-1.5">
                  <CalendarDays className="w-3.5 h-3.5 text-[#ff3b30]" /> Cette Semaine
                </span>
                <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-[#ff3b30]/20 text-[#ff3b30]">
                  TOTAL SEMAINE
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-display text-3xl sm:text-4xl text-[#ff3b30]">{weekOrdersCount}</span>
                <span className="text-[11px] text-[#a1a1aa]">commande{weekOrdersCount > 1 ? "s" : ""}</span>
              </div>
            </div>
            <div className="pt-2 border-t border-white/5 mt-3 flex items-center justify-between text-[11px]">
              <span className="text-zinc-400">Dont aujourd'hui :</span>
              <strong className="text-white font-mono">{todayOrdersCount} commande{todayOrdersCount > 1 ? "s" : ""}</strong>
            </div>
          </div>

          {/* Card 2: En Cours de Préparation sur Plancha */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#14141a] to-[#0e0e12] border border-white/10 flex flex-col justify-between shadow-lg">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#a1a1aa] flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-[#22c55e]" /> Cuisine Active
                </span>
                {activeNewCount > 0 && (
                  <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-red-500 text-white animate-pulse">
                    {activeNewCount} NOUVELLE{activeNewCount > 1 ? "S" : ""}
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-display text-3xl sm:text-4xl text-white">{activePreparingCount}</span>
                <span className="text-[11px] text-[#a1a1aa]">sur plancha 240°C</span>
              </div>
            </div>
            <p className="text-[10px] text-zinc-500 mt-2">Smash minute à la presse d'acier</p>
          </div>

          {/* Card 3: Chiffre d'Affaires Semaine */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#14141a] to-[#0e0e12] border border-white/10 flex flex-col justify-between shadow-lg">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#a1a1aa] flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-[#f59e0b]" /> CA Semaine
                </span>
                <span className="text-[9px] font-bold text-zinc-500 font-mono">
                  {todayRevenueDt.toFixed(1)} DT auj.
                </span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-display text-3xl sm:text-4xl text-white">{weekRevenueDt.toFixed(1)}</span>
                <span className="text-xs font-bold text-[#f59e0b]">DT</span>
              </div>
            </div>
            <p className="text-[10px] text-zinc-500 mt-2">{weekOrdersCount} commandes validées cette semaine</p>
          </div>
        </section>

        {/* SECTION 1: GESTION DES COMMANDES EN DIRECT */}
        <section className="p-5 sm:p-6 rounded-3xl bg-gradient-to-b from-[#14141a] to-[#0d0d12] border border-white/10 shadow-2xl">
          
          {/* Header with Title and Day Navigation Tabs */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4 pb-4 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <ShoppingBag className="w-4 h-4 text-[#ff3b30]" />
                <h2 className="font-display text-xl sm:text-2xl uppercase tracking-wide text-white">
                  Commandes en Direct
                </h2>
              </div>
              <p className="text-xs text-[#a1a1aa]">
                Suivi chronologique réel (#1, #2, #3...) des commandes passées par les clients sur le site.
              </p>
            </div>

            {/* MAIN DAY TABS: AUJOURD'HUI vs CETTE SEMAINE vs TOUTES */}
            <div className="flex items-center gap-1.5 bg-black/60 p-1 rounded-xl border border-white/10">
              
              {/* Onglet Aujourd'hui */}
              <button
                onClick={() => {
                  setSelectedDayTab("today");
                  setSelectedWeekDayDate("all-week");
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedDayTab === "today"
                    ? "bg-[#ff3b30] text-white shadow-md shadow-[#ff3b30]/30"
                    : "text-[#a1a1aa] hover:text-white"
                }`}
              >
                <span>Aujourd'hui</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/40 font-mono">
                  {todayOrdersCount}
                </span>
              </button>

              {/* Onglet Cette Semaine */}
              <button
                onClick={() => setSelectedDayTab("week")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedDayTab === "week"
                    ? "bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-black font-bold shadow-md shadow-[#f59e0b]/30"
                    : "text-[#a1a1aa] hover:text-white"
                }`}
              >
                <CalendarDays className="w-3.5 h-3.5" />
                <span>Cette Semaine</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/40 font-mono text-white">
                  {weekOrdersCount}
                </span>
              </button>

              {/* Onglet Toutes */}
              <button
                onClick={() => {
                  setSelectedDayTab("all");
                  setSelectedWeekDayDate("all-week");
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedDayTab === "all"
                    ? "bg-white/20 text-white"
                    : "text-[#a1a1aa] hover:text-white"
                }`}
              >
                <History className="w-3.5 h-3.5" />
                <span>Toutes ({orders.length})</span>
              </button>
            </div>
          </div>

          {/* SUB-BAR WHEN "CETTE SEMAINE" IS SELECTED (CHOIX DU JOUR DE LA SEMAINE) */}
          {selectedDayTab === "week" && (
            <div className="bg-black/40 p-2.5 rounded-2xl border border-white/10 mb-5 flex items-center justify-between gap-2 flex-wrap">
              <span className="text-xs text-[#f59e0b] font-bold flex items-center gap-1.5 pl-1">
                <CalendarDays className="w-3.5 h-3.5" />
                <span>Filtrer par jour de la semaine :</span>
              </span>

              <div className="flex items-center gap-1 overflow-x-auto py-0.5">
                {/* Bouton toute la semaine */}
                <button
                  onClick={() => setSelectedWeekDayDate("all-week")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    selectedWeekDayDate === "all-week"
                      ? "bg-white text-black font-black"
                      : "bg-white/5 text-zinc-300 hover:bg-white/10"
                  }`}
                >
                  Toute la semaine ({weekOrdersCount})
                </button>

                {/* Les 7 jours de la semaine : Lun -> Dim */}
                {weekDays.map((day) => {
                  const dayOrdersCount = orders.filter(o => o.date === day.date).length;
                  const isSelected = selectedWeekDayDate === day.date;
                  return (
                    <button
                      key={day.date}
                      onClick={() => setSelectedWeekDayDate(day.date)}
                      className={`px-2 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 whitespace-nowrap ${
                        isSelected
                          ? "bg-[#f59e0b] text-black font-bold shadow-sm"
                          : day.isToday
                          ? "bg-[#ff3b30]/20 text-[#ff3b30] border border-[#ff3b30]/30 hover:bg-[#ff3b30]/30"
                          : "bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      <span>{day.shortName}</span>
                      <span className={`text-[10px] font-mono px-1 rounded ${isSelected ? "bg-black/30 text-white" : "text-zinc-300"}`}>
                        {dayOrdersCount}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Subheader: Status Tabs Filter */}
          <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
            <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/5 overflow-x-auto">
              <button
                onClick={() => setSelectedStatusTab("all")}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedStatusTab === "all" ? "bg-white/15 text-white" : "text-[#a1a1aa] hover:text-white"
                }`}
              >
                Toutes ({ordersForSelectedDay.length})
              </button>
              <button
                onClick={() => setSelectedStatusTab("new")}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedStatusTab === "new" ? "bg-[#ff3b30] text-white" : "text-[#a1a1aa] hover:text-white"
                }`}
              >
                Nouvelles ({ordersForSelectedDay.filter(o => o.status === "new").length})
              </button>
              <button
                onClick={() => setSelectedStatusTab("preparing")}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedStatusTab === "preparing" ? "bg-[#f59e0b] text-black" : "text-[#a1a1aa] hover:text-white"
                }`}
              >
                En Cuisson ({ordersForSelectedDay.filter(o => o.status === "preparing").length})
              </button>
              <button
                onClick={() => setSelectedStatusTab("ready")}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedStatusTab === "ready" ? "bg-[#22c55e] text-black" : "text-[#a1a1aa] hover:text-white"
                }`}
              >
                Prêtes ({ordersForSelectedDay.filter(o => o.status === "ready").length})
              </button>
              <button
                onClick={() => setSelectedStatusTab("completed")}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedStatusTab === "completed" ? "bg-zinc-700 text-white" : "text-[#a1a1aa] hover:text-white"
                }`}
              >
                Terminées ({ordersForSelectedDay.filter(o => o.status === "completed").length})
              </button>
            </div>

            <span className="text-xs text-zinc-400">
              Période : <strong>
                {selectedDayTab === "today"
                  ? `Aujourd'hui (${formatDisplayDate(todayStr)})`
                  : selectedDayTab === "week"
                  ? selectedWeekDayDate === "all-week"
                    ? `Cette Semaine (Lun ${weekDays[0].date.slice(8)} - Dim ${weekDays[6].date.slice(8)})`
                    : formatDisplayDate(selectedWeekDayDate)
                  : "Historique Complet"}
              </strong>
            </span>
          </div>

          {/* Orders List Grid */}
          {filteredOrders.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl bg-black/20">
              <ShoppingBag className="w-12 h-12 mx-auto text-[#71717a] opacity-30 mb-3" />
              <p className="text-sm font-bold text-white">
                {selectedDayTab === "today"
                  ? "Aucune commande pour aujourd'hui pour le moment"
                  : selectedDayTab === "week"
                  ? selectedWeekDayDate === "all-week"
                    ? "Aucune commande enregistrée cette semaine"
                    : `Aucune commande enregistrée pour ce jour (${formatDisplayDate(selectedWeekDayDate)})`
                  : "Aucune commande dans cet onglet"}
              </p>
              <p className="text-xs text-[#a1a1aa] mt-1.5 max-w-sm mx-auto">
                Dès qu'un client passe commande sur le site web, elle apparaîtra ici instantanément avec son numéro séquentiel réel (#1, #2...).
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredOrders.map((order) => {
                const isNew = order.status === "new";
                const isPrep = order.status === "preparing";
                const isReady = order.status === "ready";
                const isDone = order.status === "completed";

                return (
                  <div
                    key={order.id}
                    className={`rounded-2xl p-4 sm:p-5 border transition-all flex flex-col justify-between gap-4 ${
                      isNew
                        ? "bg-[#ff3b30]/10 border-[#ff3b30]/50 shadow-lg shadow-[#ff3b30]/15"
                        : isPrep
                        ? "bg-[#f59e0b]/10 border-[#f59e0b]/40"
                        : isReady
                        ? "bg-[#22c55e]/10 border-[#22c55e]/40"
                        : "bg-white/5 border-white/5 opacity-80"
                    }`}
                  >
                    {/* Header: Sequential Commande #ID, Time, Type Badge */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-display text-xl text-white tracking-wide">
                            Commande #{order.id}
                          </span>
                          <span className="text-[11px] text-zinc-400 font-mono">
                            {order.createdAt}
                          </span>
                        </div>
                        <span
                          className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            isNew
                              ? "bg-[#ff3b30] text-white shadow-sm shadow-[#ff3b30]/50 animate-pulse"
                              : isPrep
                              ? "bg-[#f59e0b] text-black font-bold"
                              : isReady
                              ? "bg-[#22c55e] text-black font-bold"
                              : isDone
                              ? "bg-zinc-700 text-white"
                              : "bg-red-900 text-white"
                          }`}
                        >
                          {order.status === "new"
                            ? "NOUVELLE"
                            : order.status === "preparing"
                            ? "EN CUISSON"
                            : order.status === "ready"
                            ? "PRÊTE"
                            : order.status === "completed"
                            ? "LIVRÉE"
                            : "ANNULÉE"}
                        </span>
                      </div>

                      {/* Customer Info */}
                      <div className="bg-black/40 rounded-xl p-3 border border-white/5 mb-3 text-xs space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white text-sm">{order.customerName}</span>
                          <a
                            href={`tel:${order.phone.replace(/\s+/g, '')}`}
                            className="inline-flex items-center gap-1 text-[#ff3b30] hover:underline font-bold text-xs"
                          >
                            <Phone className="w-3 h-3" />
                            {order.phone}
                          </a>
                        </div>
                        <div className="text-[11px] text-zinc-300 flex items-center gap-1.5">
                          {order.orderType === "delivery" ? (
                            <>
                              <Truck className="w-3.5 h-3.5 text-[#f59e0b] shrink-0" />
                              <span className="font-semibold text-white">Livraison</span>
                              <span className="text-zinc-400">• {order.neighborhood || "Sousse"}</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="w-3.5 h-3.5 text-[#22c55e] shrink-0" />
                              <span className="font-semibold text-white">À emporter</span>
                            </>
                          )}
                        </div>
                        {order.address && (
                          <div className="text-[10px] text-zinc-400 flex items-start gap-1">
                            <MapPin className="w-3 h-3 text-zinc-500 shrink-0 mt-0.5" />
                            <span>{order.address}</span>
                          </div>
                        )}
                        {order.notes && (
                          <div className="text-[10px] text-amber-300 bg-amber-500/10 p-1.5 rounded border border-amber-500/20 mt-1">
                            📝 <em>{order.notes}</em>
                          </div>
                        )}
                      </div>

                      {/* Ordered Articles List */}
                      <div className="space-y-1.5 text-xs mb-3 pr-1">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex flex-col border-b border-white/5 pb-1 last:border-0">
                            <div className="flex justify-between items-baseline">
                              <span className="font-bold text-white">
                                {item.quantity}x {item.name}
                              </span>
                              <span className="text-zinc-300 font-semibold text-[11px]">
                                {item.totalPrice.toFixed(1)} DT
                              </span>
                            </div>
                            {item.pattiesCount && item.pattiesCount > 1 && (
                              <span className="text-[10px] text-[#f59e0b] font-medium pl-2">
                                └ Steaks : {item.pattiesCount === 3 ? "Triple Smash" : "Double Smash"}
                              </span>
                            )}
                            {item.selectedExtras && item.selectedExtras.length > 0 && (
                              <span className="text-[10px] text-zinc-400 pl-2">
                                └ Extras : {item.selectedExtras.map(e => e.name).join(", ")}
                              </span>
                            )}
                            {item.removedIngredients && item.removedIngredients.length > 0 && (
                              <span className="text-[10px] text-red-400 pl-2">
                                └ Sans : {item.removedIngredients.join(", ")}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bottom: Total & Action Buttons */}
                    <div>
                      <div className="flex items-center justify-between pt-2 border-t border-white/10 mb-3">
                        <span className="text-xs uppercase font-bold text-zinc-400">Total Commande</span>
                        <span className="font-display text-xl text-[#ff3b30]">
                          {order.totalDt.toFixed(1)} DT
                        </span>
                      </div>

                      {/* Kitchen Progression Buttons */}
                      <div className="grid grid-cols-2 gap-2">
                        {isNew && (
                          <>
                            <button
                              onClick={() => handleUpdateOrderStatus(order.id, "preparing")}
                              className="col-span-2 py-2 px-3 rounded-xl bg-gradient-to-r from-[#ff3b30] to-[#e11d48] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md shadow-[#ff3b30]/30 hover:scale-[1.02] cursor-pointer"
                            >
                              <Flame className="w-3.5 h-3.5" />
                              <span>Lancer la Cuisson</span>
                            </button>
                            <button
                              onClick={() => handleUpdateOrderStatus(order.id, "cancelled")}
                              className="col-span-2 py-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 text-[11px] font-semibold transition-colors cursor-pointer"
                            >
                              Refuser / Annuler
                            </button>
                          </>
                        )}

                        {isPrep && (
                          <>
                            <button
                              onClick={() => handleUpdateOrderStatus(order.id, "ready")}
                              className="col-span-2 py-2 px-3 rounded-xl bg-[#22c55e] text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md shadow-[#22c55e]/30 hover:scale-[1.02] cursor-pointer"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Marquer Prête</span>
                            </button>
                            <button
                              onClick={() => handleUpdateOrderStatus(order.id, "cancelled")}
                              className="col-span-2 py-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 text-[11px] font-semibold transition-colors cursor-pointer"
                            >
                              Annuler
                            </button>
                          </>
                        )}

                        {isReady && (
                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, "completed")}
                            className="col-span-2 py-2 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 border border-white/10 cursor-pointer"
                          >
                            <PackageCheck className="w-4 h-4 text-[#22c55e]" />
                            <span>Remis / Livré (Terminer)</span>
                          </button>
                        )}

                        {isDone && (
                          <div className="col-span-2 text-center text-[10px] text-zinc-500 py-1">
                            ✓ Commande complétée
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* SECTION 2: GESTION DE LA CARTE (27 ARTICLES OFFICIELS) */}
        <section className="p-5 sm:p-6 rounded-3xl bg-gradient-to-b from-[#14141a] to-[#0d0d12] border border-white/10 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <UtensilsCrossed className="w-4 h-4 text-[#ff3b30]" />
                <h2 className="font-display text-xl sm:text-2xl uppercase tracking-wide text-white">
                  Gestion de la Carte (27 Plats Officiels)
                </h2>
              </div>
              <p className="text-xs text-[#a1a1aa]">
                Désactivez un burger ou ingrédient en cas de rupture de stock. La mise à jour est instantanée.
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-zinc-300">
              {FULL_MENU_ITEMS.length - disabledMenuIds.length} / {FULL_MENU_ITEMS.length} Plats Disponibles
            </span>
          </div>

          {/* Grouped Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(groupedMenu).map(([category, items]) => (
              <div key={category} className="bg-black/40 rounded-2xl p-4 border border-white/5 flex flex-col justify-between">
                <div>
                  <h3 className="font-display text-base uppercase text-[#f59e0b] pb-2 border-b border-white/10 mb-3 flex items-center justify-between">
                    <span>{category}</span>
                    <span className="text-[10px] text-zinc-500 font-mono">({items.length})</span>
                  </h3>

                  <div className="space-y-2">
                    {items.map((item) => {
                      const isDisabled = disabledMenuIds.includes(item.id);
                      return (
                        <div
                          key={item.id}
                          className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 transition-all ${
                            isDisabled
                              ? "bg-red-500/10 border-red-500/30 opacity-60"
                              : "bg-white/5 border-white/5 hover:border-white/15"
                          }`}
                        >
                          <div className="min-w-0 flex-1">
                            <span className={`block text-xs font-bold truncate ${isDisabled ? "line-through text-zinc-500" : "text-white"}`}>
                              {item.name}
                            </span>
                            <span className="text-[11px] text-[#ff3b30] font-semibold">
                              {item.priceDt.toFixed(1)} DT
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleToggleMenuItem(item.id, item.name)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase transition-all cursor-pointer ${
                              isDisabled
                                ? "bg-red-500 text-white"
                                : "bg-[#22c55e]/20 text-[#22c55e] border border-[#22c55e]/30 hover:bg-[#22c55e] hover:text-black"
                            }`}
                          >
                            {isDisabled ? "Rupture" : "En Vente"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-6 text-center text-xs text-zinc-500 bg-[#050507]">
        <p>© {new Date().getFullYear()} Beef & Buns Sousse • Espace Gestion Hôte & Cuisine</p>
      </footer>

    </div>
  );
}
