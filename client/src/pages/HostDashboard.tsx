import { useMemo, useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";
import { Bell, CalendarDays, Check, ChevronLeft, ChevronRight, Clock3, Loader2, Lock, LogIn, PackageCheck, Phone, RefreshCw, UtensilsCrossed } from "lucide-react";
import { toast } from "sonner";

const statusLabels: Record<string, string> = {
  pending: "En attente",
  confirmed: "Confirmée",
  cancelled: "Annulée",
  rejected: "Refusée",
  new: "Nouvelle",
  accepted: "Acceptée",
  preparing: "En préparation",
  ready: "Prête",
  completed: "Terminée",
};

const formatDate = (date: string) => new Date(`${date}T12:00:00`).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });

function HostContent() {
  const { user, loading } = useAuth();
  const [pinInput, setPinInput] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(() => sessionStorage.getItem("per-voi-host-unlocked") === "true");
  const [pinError, setPinError] = useState(false);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
  const utils = trpc.useUtils();
  const availability = trpc.restaurant.availability.forDate.useQuery({ serviceDate: date }, { enabled: Boolean(isUnlocked && user?.role === "admin") });
  const reservations = trpc.restaurant.reservations.adminList.useQuery({ serviceDate: date }, { enabled: Boolean(isUnlocked && user?.role === "admin") });
  const orders = trpc.restaurant.orders.adminList.useQuery(undefined, { enabled: Boolean(isUnlocked && user?.role === "admin") });
  const menu = trpc.restaurant.menu.adminList.useQuery(undefined, { enabled: Boolean(isUnlocked && user?.role === "admin") });
  const notificationStatus = trpc.restaurant.notifications.status.useQuery(undefined, { enabled: Boolean(isUnlocked && user?.role === "admin") });
  const orderItems = trpc.restaurant.orders.adminItems.useQuery({ orderId: expandedOrder ?? 0 }, { enabled: Boolean(isUnlocked && expandedOrder && user?.role === "admin") });
  const setSlot = trpc.restaurant.availability.set.useMutation({
    onSuccess: () => { void utils.restaurant.availability.forDate.invalidate({ serviceDate: date }); toast.success("Disponibilité mise à jour"); },
    onError: error => toast.error("Mise à jour impossible", { description: error.message }),
  });
  const updateReservation = trpc.restaurant.reservations.updateStatus.useMutation({
    onSuccess: () => { void utils.restaurant.reservations.adminList.invalidate(); void utils.restaurant.availability.forDate.invalidate({ serviceDate: date }); toast.success("Réservation mise à jour"); },
    onError: error => toast.error("Action impossible", { description: error.message }),
  });
  const updateOrder = trpc.restaurant.orders.updateStatus.useMutation({
    onSuccess: () => { void utils.restaurant.orders.adminList.invalidate(); toast.success("Commande mise à jour"); },
    onError: error => toast.error("Action impossible", { description: error.message }),
  });
  const toggleMenu = trpc.restaurant.menu.toggle.useMutation({
    onSuccess: () => { void utils.restaurant.menu.adminList.invalidate(); toast.success("Article mis à jour"); },
    onError: error => toast.error("Action impossible", { description: error.message }),
  });

  const pendingReservations = reservations.data?.filter(item => item.status === "pending").length ?? 0;
  const newOrders = orders.data?.filter(item => item.status === "new").length ?? 0;
  const activeMenu = menu.data?.filter(item => item.active).length ?? 0;
  const groupedMenu = useMemo(() => {
    const groups = new Map<string, typeof menu.data>();
    for (const item of menu.data ?? []) groups.set(item.category, [...(groups.get(item.category) ?? []), item]);
    return Array.from(groups.entries());
  }, [menu.data]);

  const moveDate = (offset: number) => {
    const next = new Date(`${date}T12:00:00`);
    next.setDate(next.getDate() + offset);
    setDate(next.toISOString().slice(0, 10));
  };

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === "2026") {
      sessionStorage.setItem("per-voi-host-unlocked", "true");
      setIsUnlocked(true);
      setPinError(false);
      toast.success("Bienvenue dans l'espace hôte");
    } else {
      setPinError(true);
      toast.error("Code PIN incorrect");
    }
  };

  const handleLock = () => {
    sessionStorage.removeItem("per-voi-host-unlocked");
    setIsUnlocked(false);
    setPinInput("");
  };

  if (!isUnlocked) {
    return (
      <div className="mx-auto flex min-h-[75vh] max-w-sm flex-col items-center justify-center p-6 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f4e8df] text-[#b95230] shadow-sm">
          <Lock size={26} />
        </div>
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b95230]">Per Voi · Sousse</span>
        <h1 className="mt-1 text-2xl font-semibold">Espace Hôte</h1>
        <p className="mt-2 text-xs text-muted-foreground">Accès réservé au personnel et gérant du restaurant.</p>
        <form onSubmit={handleUnlock} className="mt-6 w-full space-y-3">
          <input
            type="password"
            maxLength={6}
            autoFocus
            value={pinInput}
            onChange={e => { setPinInput(e.target.value); setPinError(false); }}
            placeholder="Code PIN (ex: 2026)"
            className={`w-full rounded-xl border px-4 py-3 text-center text-lg font-mono tracking-widest outline-none transition ${pinError ? "border-red-500 bg-red-50/50" : "border-stone-300 focus:border-[#b95230]"}`}
          />
          {pinError && <p className="text-xs text-red-600 font-medium">Code PIN erroné. Réessayez.</p>}
          <button type="submit" className="button button-dark w-full py-3">Déverrouiller</button>
          <p className="text-[11px] text-muted-foreground pt-2">Code d'accès par défaut : <strong>2026</strong></p>
        </form>
      </div>
    );
  }

  if (loading) return <div className="flex min-h-[70vh] items-center justify-center"><Loader2 className="animate-spin" /></div>;
  if (!user) return <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center gap-5 text-center"><div className="rounded-full bg-stone-100 p-4"><LogIn /></div><h1 className="text-2xl font-semibold">Connexion hôte</h1><p className="text-sm text-muted-foreground">Connectez-vous avec le compte administrateur du restaurant pour gérer les réservations et commandes.</p><button className="button button-dark" onClick={() => startLogin()}>Se connecter <ArrowIcon /></button></div>;
  if (user.role !== "admin") return <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center gap-5 text-center"><div className="rounded-full bg-red-50 p-4 text-red-700"><Lock /></div><h1 className="text-2xl font-semibold">Accès hôte requis</h1><p className="text-sm text-muted-foreground">Ce compte est connecté mais n’a pas les droits de gestion du restaurant.</p></div>;

  return <div className="mx-auto max-w-7xl space-y-8 pb-10">
    <header className="flex flex-col justify-between gap-4 border-b pb-6 md:flex-row md:items-end"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b95230]">Per Voi · espace hôte</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">Bonjour {user.name?.split(" ")[0] ?? "à vous"}.</h1><p className="mt-2 text-sm text-muted-foreground">Pilotez votre service, vos tables et vos commandes depuis un seul endroit.</p></div><div className="flex items-center gap-2"><button className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm hover:bg-muted" onClick={() => { void utils.restaurant.availability.forDate.invalidate(); void utils.restaurant.reservations.adminList.invalidate(); void utils.restaurant.orders.adminList.invalidate(); }}><RefreshCw size={15} /> Actualiser</button><button className="inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-sm hover:bg-muted text-stone-600" onClick={handleLock} title="Verrouiller l'espace hôte"><Lock size={15} /> Verrouiller</button></div></header>

    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><StatCard label="Demandes du jour" value={pendingReservations} detail="à confirmer" icon={<CalendarDays size={18} />} /><StatCard label="Nouvelles commandes" value={newOrders} detail="à traiter" icon={<PackageCheck size={18} />} /><StatCard label="Créneaux ouverts" value={availability.data?.filter(slot => slot.status === "available").length ?? 0} detail="aujourd’hui" icon={<Clock3 size={18} />} /><StatCard label="Articles actifs" value={activeMenu} detail="sur la carte" icon={<UtensilsCrossed size={18} />} /></div>
    <section className={`flex items-start gap-3 rounded-2xl border p-4 shadow-sm ${notificationStatus.data?.whatsapp === "configured" ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"}`}><Bell size={18} className="mt-0.5 text-[#b95230]" /><div><p className="text-sm font-semibold">Alertes WhatsApp</p><p className="mt-1 text-xs text-muted-foreground">{notificationStatus.data?.message ?? "Vérification de la configuration…"}</p></div></section>

    <section className="rounded-2xl border bg-card p-5 shadow-sm"><div className="flex flex-col justify-between gap-4 md:flex-row md:items-center"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#b95230]">Disponibilités</p><h2 className="mt-1 text-xl font-semibold">Gérer les créneaux</h2><p className="mt-1 text-sm text-muted-foreground">Fermez une heure ou marquez-la complète en un clic. Le lundi reste fermé automatiquement.</p></div><div className="flex items-center gap-2"><button className="rounded-full border p-2 hover:bg-muted" onClick={() => moveDate(-1)} aria-label="Jour précédent"><ChevronLeft size={17} /></button><div className="min-w-52 rounded-full bg-muted px-4 py-2 text-center text-sm font-medium capitalize">{formatDate(date)}</div><button className="rounded-full border p-2 hover:bg-muted" onClick={() => moveDate(1)} aria-label="Jour suivant"><ChevronRight size={17} /></button><input className="h-9 w-10 cursor-pointer rounded border p-1" type="date" value={date} onChange={event => setDate(event.target.value)} aria-label="Choisir une date" /></div></div><div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-6">{(availability.data ?? []).map(slot => <button key={slot.serviceTime} className={`rounded-xl border px-2 py-3 text-left transition ${slot.status === "available" ? "border-emerald-200 bg-emerald-50 hover:bg-emerald-100" : slot.status === "full" ? "border-amber-200 bg-amber-50 hover:bg-amber-100" : "border-stone-200 bg-stone-100 hover:bg-stone-200"}`} onClick={() => setSlot.mutate({ serviceDate: date, serviceTime: slot.serviceTime, status: slot.status === "available" ? "full" : "available", note: slot.status === "available" ? "Complet par l’hôte" : null })}><div className="flex items-center justify-between"><strong className="text-sm">{slot.serviceTime}</strong>{slot.status === "available" ? <Check size={14} className="text-emerald-700" /> : <Lock size={13} className="text-amber-700" />}</div><span className="mt-1 block text-[10px] uppercase tracking-wide text-muted-foreground">{slot.status === "available" ? "Disponible" : slot.status === "full" ? "Complet" : "Fermé"}</span><span className="mt-1 block text-[10px] text-muted-foreground">{slot.bookedGuests} pers.</span></button>)}</div><div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground"><span className="flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-emerald-500" /> Disponible</span><span className="flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-amber-500" /> Complet</span><span className="flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-stone-400" /> Fermé</span></div></section>

    <div className="grid gap-6 xl:grid-cols-[1.1fr_.9fr]"><section className="rounded-2xl border bg-card p-5 shadow-sm"><div className="flex items-center justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#b95230]">Réservations</p><h2 className="mt-1 text-xl font-semibold">Demandes du {formatDate(date)}</h2></div><span className="rounded-full bg-muted px-3 py-1 text-xs">{reservations.data?.length ?? 0} demandes</span></div><div className="mt-5 space-y-3">{reservations.data?.length ? reservations.data.map(item => <div key={item.id} className="rounded-xl border p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="font-semibold">{item.name} · {item.guests} pers.</h3><p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground"><Clock3 size={14} /> {item.serviceTime} · <Phone size={14} /> {item.phone}</p></div><span className={`rounded-full px-3 py-1 text-xs font-medium ${item.status === "confirmed" ? "bg-emerald-100 text-emerald-800" : item.status === "cancelled" || item.status === "rejected" ? "bg-red-100 text-red-800" : "bg-amber-100 text-amber-800"}`}>{statusLabels[item.status]}</span></div>{item.notes && <p className="mt-3 rounded-lg bg-muted p-2 text-xs">{item.notes}</p>}<div className="mt-3 flex gap-2">{item.status === "pending" && <><button className="rounded-full bg-[#39453a] px-3 py-1.5 text-xs font-semibold text-white" onClick={() => updateReservation.mutate({ id: item.id, status: "confirmed" })}>Confirmer</button><button className="rounded-full border px-3 py-1.5 text-xs" onClick={() => updateReservation.mutate({ id: item.id, status: "rejected" })}>Refuser</button></>}{item.status === "confirmed" && <button className="rounded-full border px-3 py-1.5 text-xs" onClick={() => updateReservation.mutate({ id: item.id, status: "cancelled" })}>Annuler</button>}</div></div>) : <EmptyState label="Aucune demande pour cette date." />}</div></section>

    <section className="rounded-2xl border bg-card p-5 shadow-sm"><div className="flex items-center justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#b95230]">Commandes</p><h2 className="mt-1 text-xl font-semibold">À traiter</h2></div><span className="rounded-full bg-muted px-3 py-1 text-xs">{orders.data?.length ?? 0} total</span></div><div className="mt-5 space-y-3">{orders.data?.slice(0, 8).map(order => <div key={order.id} className="rounded-xl border p-4"><div className="flex items-start justify-between gap-3"><div><h3 className="font-semibold">#{order.id} · {order.customerName}</h3><p className="mt-1 text-sm text-muted-foreground">{order.orderType === "pickup" ? "À emporter" : "Livraison"} · {order.totalDt} DT</p><p className="mt-1 text-xs text-muted-foreground">{order.phone}</p></div><span className="rounded-full bg-muted px-3 py-1 text-xs">{statusLabels[order.status]}</span></div>{expandedOrder === order.id && <div className="mt-3 rounded-lg bg-muted/60 p-3 text-xs">{orderItems.data?.length ? orderItems.data.map(item => <div key={item.id} className="flex justify-between py-1"><span>{item.quantity} × {item.name}</span><strong>{item.unitPriceDt * item.quantity} DT</strong></div>) : "Chargement des articles…"}</div>}<div className="mt-3 flex flex-wrap gap-2"><button className="rounded-full border px-3 py-1.5 text-xs" onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}>{expandedOrder === order.id ? "Masquer les articles" : "Voir les articles"}</button>{order.status === "new" && <button className="rounded-full bg-[#39453a] px-3 py-1.5 text-xs font-semibold text-white" onClick={() => updateOrder.mutate({ id: order.id, status: "accepted" })}>Accepter</button>}{order.status === "accepted" && <button className="rounded-full bg-[#39453a] px-3 py-1.5 text-xs font-semibold text-white" onClick={() => updateOrder.mutate({ id: order.id, status: "preparing" })}>En préparation</button>}{order.status === "preparing" && <button className="rounded-full bg-[#39453a] px-3 py-1.5 text-xs font-semibold text-white" onClick={() => updateOrder.mutate({ id: order.id, status: "ready" })}>Marquer prête</button>}{order.status === "ready" && <button className="rounded-full border px-3 py-1.5 text-xs" onClick={() => updateOrder.mutate({ id: order.id, status: "completed" })}>Terminer</button>}{!["completed", "cancelled"].includes(order.status) && <button className="rounded-full border px-3 py-1.5 text-xs" onClick={() => updateOrder.mutate({ id: order.id, status: "cancelled" })}>Annuler</button>}</div></div>)}{!orders.data?.length && <EmptyState label="Aucune commande reçue." />}</div></section></div>

    <section className="rounded-2xl border bg-card p-5 shadow-sm"><div className="flex items-center justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#b95230]">Carte</p><h2 className="mt-1 text-xl font-semibold">Activer ou masquer un article</h2></div><span className="text-sm text-muted-foreground">{activeMenu} actifs</span></div><div className="mt-5 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{groupedMenu.map(([group, items]) => <div key={group}><h3 className="mb-2 border-b pb-2 text-sm font-semibold">{group}</h3><div className="space-y-2">{items?.map(item => <div key={item.id} className="flex items-center justify-between gap-3 rounded-lg bg-muted/50 px-3 py-2"><div className="min-w-0"><p className={`truncate text-sm ${item.active ? "" : "text-muted-foreground line-through"}`}>{item.name}</p><span className="text-xs text-muted-foreground">{item.priceDt} DT</span></div><button className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase ${item.active ? "bg-emerald-100 text-emerald-800" : "bg-stone-200 text-stone-600"}`} onClick={() => toggleMenu.mutate({ id: item.id, active: !item.active })}>{item.active ? "Actif" : "Masqué"}</button></div>)}</div></div>)}</div></section>
  </div>;
}

function StatCard({ label, value, detail, icon }: { label: string; value: number; detail: string; icon: React.ReactNode }) { return <div className="rounded-2xl border bg-card p-4 shadow-sm"><div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">{label}</span><span className="rounded-full bg-[#f4e8df] p-2 text-[#b95230]">{icon}</span></div><div className="mt-4 flex items-end gap-2"><strong className="text-3xl font-semibold">{value}</strong><span className="pb-1 text-xs text-muted-foreground">{detail}</span></div></div>; }
function EmptyState({ label }: { label: string }) { return <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">{label}</div>; }
function ArrowIcon() { return <ChevronRight size={17} />; }

export default function HostDashboard() { return <DashboardLayout><HostContent /></DashboardLayout>; }
