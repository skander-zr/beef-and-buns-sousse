import React, { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import {
  Lock,
  RefreshCw,
  LogOut,
  Check,
  X,
  Clock,
  Calendar,
  Phone,
  MapPin,
  ShoppingBag,
  Flame,
  Sparkles,
  Bell,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Volume2,
  VolumeX,
  TrendingUp,
  UtensilsCrossed,
  Truck,
  PackageCheck,
  CalendarDays,
  History
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

const SERVICE_HOURS = [
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
  "18:00", "18:30", "19:00", "19:30", "20:00", "20:30",
  "21:00", "21:30", "22:00", "22:30", "23:00", "23:30"
];

// Helper to get formatted date string YYYY-MM-DD
function getDateString(offsetDays = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
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
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.45);
  } catch {
    // Ignore audio restrictions
  }
}

export default function HostDashboard() {
  const [pinInput, setPinInput] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(() => {
    return sessionStorage.getItem("beef-and-buns-host-unlocked") === "true";
  });
  const [pinError, setPinError] = useState(false);

  // Today and Yesterday date keys
  const todayStr = useMemo(() => getDateString(0), []);
  const yesterdayStr = useMemo(() => getDateString(-1), []);

  // Orders State (No fake orders, 100% real client orders)
  const [orders, setOrders] = useState<HostOrder[]>(() => {
    try {
      const saved = localStorage.getItem("beef_and_buns_host_orders");
      if (saved) {
        const parsed = JSON.parse(saved);
        // Filter out any legacy dummy/mock orders from test versions
        return parsed.filter((o: any) => o.id !== 4892 && o.id !== 4891 && o.id !== 4890 && o.customerName !== "Client Test Sousse");
      }
    } catch {}
    return [];
  });

  // Clean out legacy fake orders on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("beef_and_buns_host_orders");
      if (saved) {
        const parsed = JSON.parse(saved);
        const hasDummy = parsed.some((o: any) => o.id === 4892 || o.id === 4891 || o.id === 4890 || o.customerName === "Client Test Sousse");
        if (hasDummy) {
          const cleaned = parsed.filter((o: any) => o.id !== 4892 && o.id !== 4891 && o.id !== 4890 && o.customerName !== "Client Test Sousse");
          localStorage.setItem("beef_and_buns_host_orders", JSON.stringify(cleaned));
          setOrders(cleaned);
        }
      }
    } catch {}
  }, []);

  // Listen to new orders placed on the client site in real time
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const saved = localStorage.getItem("beef_and_buns_host_orders");
        if (saved) {
          const parsed = JSON.parse(saved);
          const cleaned = parsed.filter((o: any) => o.id !== 4892 && o.id !== 4891 && o.id !== 4890 && o.customerName !== "Client Test Sousse");
          setOrders(cleaned);
        }
      } catch {}
    };

    window.addEventListener("storage", handleStorageChange);
    const interval = setInterval(handleStorageChange, 3000); // Polling local changes
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Menu Active Items State (27 official items)
  const [disabledMenuIds, setDisabledMenuIds] = useState<number[]>(() => {
    const saved = localStorage.getItem("beef_and_buns_disabled_menu_ids");
    return saved ? JSON.parse(saved) : [];
  });

  // Slot Controls State (available / full / closed)
  const [slotsState, setSlotsState] = useState<Record<string, "available" | "full" | "closed">>(() => {
    const saved = localStorage.getItem("beef_and_buns_slots_state");
    return saved ? JSON.parse(saved) : {};
  });

  // Filters & Tabs
  // Day filter: "today" | "yesterday" | "all"
  const [selectedDayTab, setSelectedDayTab] = useState<"today" | "yesterday" | "all">("today");
  // Status filter: "all" | "new" | "preparing" | "ready" | "completed"
  const [selectedStatusTab, setSelectedStatusTab] = useState<"all" | "new" | "preparing" | "ready" | "completed">("all");
  const [selectedSlotDate, setSelectedSlotDate] = useState(() => getDateString(0));
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [currentTimeStr, setCurrentTimeStr] = useState("");

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
    localStorage.setItem("beef_and_buns_host_orders", JSON.stringify(orders));
  }, [orders]);

  // Save Menu
  useEffect(() => {
    localStorage.setItem("beef_and_buns_disabled_menu_ids", JSON.stringify(disabledMenuIds));
  }, [disabledMenuIds]);

  // Save Slots
  useEffect(() => {
    localStorage.setItem("beef_and_buns_slots_state", JSON.stringify(slotsState));
  }, [slotsState]);

  // Unlock Handler
  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === "2026") {
      sessionStorage.setItem("beef-and-buns-host-unlocked", "true");
      setIsUnlocked(true);
      setPinError(false);
      if (isSoundEnabled) playKitchenChime();
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

  // Change Order Status
  const handleUpdateOrderStatus = (orderId: number, newStatus: HostOrder["status"]) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    if (isSoundEnabled) playKitchenChime();
    const labels = {
      new: "Nouvelle",
      preparing: "En préparation sur plancha 🔥",
      ready: "Prête pour remise / livraison 🥡",
      completed: "Terminée & Archivée ✅",
      cancelled: "Annulée ❌"
    };
    toast.success(`Commande #${orderId} : ${labels[newStatus]}`);
  };

  // Toggle Menu Item
  const handleToggleMenuItem = (itemId: number, itemName: string) => {
    setDisabledMenuIds(prev => {
      const isCurrentlyDisabled = prev.includes(itemId);
      const updated = isCurrentlyDisabled ? prev.filter(id => id !== itemId) : [...prev, itemId];
      toast.info(isCurrentlyDisabled ? `"${itemName}" remis en vente` : `"${itemName}" marqué en rupture / masqué`);
      return updated;
    });
  };

  // Toggle Slot
  const handleToggleSlot = (time: string) => {
    const key = `${selectedSlotDate}_${time}`;
    const current = slotsState[key] || "available";
    const next = current === "available" ? "full" : current === "full" ? "closed" : "available";
    setSlotsState(prev => ({ ...prev, [key]: next }));
  };

  // 1. Filter orders by Day (Aujourd'hui / Hier / Toutes)
  const ordersForSelectedDay = useMemo(() => {
    if (selectedDayTab === "today") {
      return orders.filter(o => o.date === todayStr || (!o.date && o.createdAt));
    }
    if (selectedDayTab === "yesterday") {
      return orders.filter(o => o.date === yesterdayStr);
    }
    return orders;
  }, [orders, selectedDayTab, todayStr, yesterdayStr]);

  // 2. Filter orders by Status
  const filteredOrders = useMemo(() => {
    if (selectedStatusTab === "all") return ordersForSelectedDay;
    return ordersForSelectedDay.filter(o => o.status === selectedStatusTab);
  }, [ordersForSelectedDay, selectedStatusTab]);

  // Statistics Calculation
  const todayOrders = useMemo(() => orders.filter(o => o.date === todayStr || (!o.date && o.createdAt)), [orders, todayStr]);
  const yesterdayOrders = useMemo(() => orders.filter(o => o.date === yesterdayStr), [orders, yesterdayStr]);

  const todayOrdersCount = todayOrders.length;
  const yesterdayOrdersCount = yesterdayOrders.length;

  const todayRevenueDt = todayOrders
    .filter(o => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.totalDt, 0);

  const yesterdayRevenueDt = yesterdayOrders
    .filter(o => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.totalDt, 0);

  const activePreparingCount = orders.filter(o => o.status === "preparing").length;
  const activeNewCount = orders.filter(o => o.status === "new").length;

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
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[#09090b]/90 border-b border-white/10 px-4 sm:px-8 py-3 flex items-center justify-between">
        
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
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Live Clock */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-zinc-300">
            <Clock className="w-3.5 h-3.5 text-[#f59e0b]" />
            <span>{currentTimeStr || "12:00:00"}</span>
            <span className="text-[10px] text-zinc-500 font-sans">Sousse</span>
          </div>

          {/* CASE COMMANDES AUJOURD'HUI (REPLACE TELEGRAM BADGE - RESETS EVERY DAY) */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#ff3b30]/15 border border-[#ff3b30]/35 text-white shadow-sm shadow-[#ff3b30]/20">
            <ShoppingBag className="w-4 h-4 text-[#ff3b30] shrink-0" />
            <div className="flex items-baseline gap-1">
              <span className="text-[11px] font-semibold text-[#a1a1aa] hidden sm:inline">Aujourd'hui :</span>
              <span className="font-display text-base text-[#ff3b30] leading-none">{todayOrdersCount}</span>
              <span className="text-[10px] text-zinc-400">commande{todayOrdersCount > 1 ? "s" : ""}</span>
            </div>
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
            onClick={() => {
              try {
                const saved = localStorage.getItem("beef_and_buns_host_orders");
                if (saved) setOrders(JSON.parse(saved));
              } catch {}
              toast.info("Commandes actualisées");
            }}
            title="Actualiser"
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-[#a1a1aa] hover:text-white transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
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
        
        {/* KPI OVERVIEW CARDS WITH TODAY VS PREVIOUS DAY COMPARISON */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          
          {/* Card 1: Commandes Aujourd'hui (Reset quotidien automatique) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#14141a] to-[#0e0e12] border border-white/10 flex flex-col justify-between shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#a1a1aa] flex items-center gap-1.5">
                <ShoppingBag className="w-3.5 h-3.5 text-[#ff3b30]" /> Aujourd'hui
              </span>
              <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-[#ff3b30]/20 text-[#ff3b30]">
                RESET MINUIT
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-3xl sm:text-4xl text-[#ff3b30]">{todayOrdersCount}</span>
              <span className="text-[11px] text-[#a1a1aa]">commande{todayOrdersCount > 1 ? "s" : ""}</span>
            </div>
            <p className="text-[10px] text-zinc-500 mt-2">
              Chiffre du jour : <strong className="text-white">{todayRevenueDt.toFixed(1)} DT</strong>
            </p>
          </div>

          {/* Card 2: Commandes Jour Précédent (Hier) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#14141a] to-[#0e0e12] border border-white/10 flex flex-col justify-between shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#a1a1aa] flex items-center gap-1.5">
                <CalendarDays className="w-3.5 h-3.5 text-[#f59e0b]" /> Jour Précédent
              </span>
              <span className="text-[9px] font-bold text-zinc-500">
                Hier
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-3xl sm:text-4xl text-[#f59e0b]">{yesterdayOrdersCount}</span>
              <span className="text-[11px] text-[#a1a1aa]">commande{yesterdayOrdersCount > 1 ? "s" : ""}</span>
            </div>
            <p className="text-[10px] text-zinc-500 mt-2">
              Total hier : <strong className="text-white">{yesterdayRevenueDt.toFixed(1)} DT</strong>
            </p>
          </div>

          {/* Card 3: En Cours de Préparation sur Plancha */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#14141a] to-[#0e0e12] border border-white/10 flex flex-col justify-between shadow-lg">
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
            <p className="text-[10px] text-zinc-500 mt-2">Smash minute à la presse d'acier</p>
          </div>

          {/* Card 4: Service & Horaires */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#14141a] to-[#0e0e12] border border-white/10 flex flex-col justify-between shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#a1a1aa] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-zinc-400" /> Service
              </span>
              <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-[#22c55e]/20 text-[#22c55e]">
                OUVERT
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-2xl sm:text-3xl text-white">12h - 00h</span>
              <span className="text-[11px] text-[#a1a1aa]">7j / 7</span>
            </div>
            <p className="text-[10px] text-zinc-500 mt-2">Sousse Corniche & Ville</p>
          </div>
        </section>

        {/* SECTION 1: GESTION DES COMMANDES EN DIRECT */}
        <section className="p-5 sm:p-6 rounded-3xl bg-gradient-to-b from-[#14141a] to-[#0d0d12] border border-white/10 shadow-2xl">
          
          {/* Header with Title and Day Navigation Tabs */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
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

            {/* DAY SELECTOR TABS (AUJOURD'HUI vs JOUR PRÉCÉDENT vs TOUTES) */}
            <div className="flex items-center gap-1.5 bg-black/60 p-1 rounded-xl border border-white/10">
              <button
                onClick={() => setSelectedDayTab("today")}
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

              <button
                onClick={() => setSelectedDayTab("yesterday")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedDayTab === "yesterday"
                    ? "bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-black shadow-md shadow-[#f59e0b]/30"
                    : "text-[#a1a1aa] hover:text-white"
                }`}
              >
                <CalendarDays className="w-3.5 h-3.5" />
                <span>Jour Précédent (Hier)</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/40 font-mono text-white">
                  {yesterdayOrdersCount}
                </span>
              </button>

              <button
                onClick={() => setSelectedDayTab("all")}
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
              Affichage : <strong>{selectedDayTab === "today" ? `Aujourd'hui (${formatDisplayDate(todayStr)})` : selectedDayTab === "yesterday" ? `Hier (${formatDisplayDate(yesterdayStr)})` : "Historique Complet"}</strong>
            </span>
          </div>

          {/* Orders List Grid */}
          {filteredOrders.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl bg-black/20">
              <ShoppingBag className="w-12 h-12 mx-auto text-[#71717a] opacity-30 mb-3" />
              <p className="text-sm font-bold text-white">
                {selectedDayTab === "today"
                  ? "Aucune commande pour aujourd'hui pour le moment"
                  : selectedDayTab === "yesterday"
                  ? "Aucune commande enregistrée hier"
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

        {/* SECTION 2: GESTION DES DISPONIBILITÉS & CRÉNEAUX */}
        <section className="p-5 sm:p-6 rounded-3xl bg-gradient-to-b from-[#14141a] to-[#0d0d12] border border-white/10 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-[#f59e0b]" />
                <h2 className="font-display text-xl sm:text-2xl uppercase tracking-wide text-white">
                  Créneaux & Horaires de Service
                </h2>
              </div>
              <p className="text-xs text-[#a1a1aa]">
                Fermez une heure d'affluence en un clic ou marquez-la complète. Le restaurant fonctionne 7j/7 en continu de 12h à 00h.
              </p>
            </div>

            {/* Date Selector */}
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={selectedSlotDate}
                onChange={(e) => setSelectedSlotDate(e.target.value)}
                className="bg-black/60 border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-[#ff3b30]"
              />
            </div>
          </div>

          {/* Time Slots Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-8 gap-2">
            {SERVICE_HOURS.map((hour) => {
              const key = `${selectedSlotDate}_${hour}`;
              const state = slotsState[key] || "available";
              const isAvail = state === "available";
              const isFull = state === "full";

              return (
                <button
                  key={hour}
                  type="button"
                  onClick={() => handleToggleSlot(hour)}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    isAvail
                      ? "bg-[#22c55e]/10 border-[#22c55e]/40 hover:bg-[#22c55e]/20 text-white"
                      : isFull
                      ? "bg-[#f59e0b]/15 border-[#f59e0b]/50 text-white"
                      : "bg-red-500/10 border-red-500/30 text-zinc-500 line-through"
                  }`}
                >
                  <span className="block text-xs font-mono font-bold">{hour}</span>
                  <span
                    className={`block text-[9px] font-black uppercase mt-0.5 ${
                      isAvail ? "text-[#22c55e]" : isFull ? "text-[#f59e0b]" : "text-red-400"
                    }`}
                  >
                    {isAvail ? "Ouvert" : isFull ? "Complet" : "Fermé"}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-4 text-xs text-zinc-400 mt-4 pt-3 border-t border-white/5">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#22c55e]" /> Ouvert
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#f59e0b]" /> Complet
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500" /> Fermé
            </span>
          </div>
        </section>

        {/* SECTION 3: GESTION DE LA CARTE (27 ARTICLES OFFICIELS) */}
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
