import React, { useState, useRef, useEffect, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  Flame,
  ShoppingBag,
  Phone,
  MapPin,
  Clock,
  Sparkles,
  Layers,
  RotateCw,
  Plus,
  Minus,
  Check,
  X,
  ChevronRight,
  ShieldCheck,
  Instagram,
  ArrowRight,
  Search,
  Sliders,
  UtensilsCrossed,
  Truck,
  Store
} from "lucide-react";

// Featured Burgers for 3D stage
interface FeaturedBurger {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  tag: string;
  image: string;
  description: string;
  details: {
    bun: string;
    patty: string;
    cheese: string;
    sauce: string;
    toppings: string;
  };
}

const FEATURED_BURGERS: FeaturedBurger[] = [
  {
    id: "truffle-mushroom",
    name: "Truffle Mushroom",
    subtitle: "Notre Chef-d'œuvre Signature",
    price: 29.5,
    tag: "BEST SELLER #1",
    image: "/burgers/truffle-mushroom.png",
    description: "Double smash patty de bœuf pur jus, champignons de Paris sautés à la plancha, sauce truffe noire onctueuse, roquette fraîche et double cheddar fondant dans notre potato bun doré.",
    details: {
      bun: "Artisanal Potato Bun doré au beurre doux",
      patty: "Double steak smash pur bœuf croustillant",
      cheese: "Double American Cheese affiné fondant",
      sauce: "Mayonnaise artisanale à la truffe noire",
      toppings: "Champignons sautés minute & roquette croquante"
    }
  },
  {
    id: "og-smash",
    name: "The OG Smash",
    subtitle: "L'Authentique Classique Américain",
    price: 22.7,
    tag: "ORIGINAL RECIPE",
    image: "/burgers/og-smash.png",
    description: "L'essence même du smash : double steak écrasé ultra-fin avec croûte caramélisée, oignons fondants, double American cheese et notre mythique sauce secrète OG.",
    details: {
      bun: "Potato Bun New-Yorkais toasté à cœur",
      patty: "Double smash patty croûte Maillard intense",
      cheese: "Double American cheese fondu",
      sauce: "Sauce secrète OG maison",
      toppings: "Oignons caramélisés & pickles croquants"
    }
  },
  {
    id: "og-smash-oklahoma",
    name: "OG Smash Oklahoma",
    subtitle: "Oignons Caramélisés Dans La Viande",
    price: 22.7,
    tag: "TECHNIQUE OKLAHOMA",
    image: "/burgers/og-smash-oklahoma.png",
    description: "La légende de 1926 : de très fines lamelles d'oignons doux écrasées directement sur le bœuf brûlant, caramélisant ensemble à 240°C sous la presse d'acier.",
    details: {
      bun: "Potato Bun moelleux aérien toasté",
      patty: "Double steak infusé aux oignons grillés",
      cheese: "American cheese ultra fondant",
      sauce: "Sauce signature OG relevée",
      toppings: "Oignons fondants fusionnés au bœuf"
    }
  },
  {
    id: "hot-smash",
    name: "Hot Smash",
    subtitle: "Pour Les Amateurs de Frissons",
    price: 25.0,
    tag: "SPICY LOVERS 🔥",
    image: "/burgers/hot-smash.png",
    description: "Double smash patty croustillant, piments jalapeños croquants marinés, notre sauce piquante aux piments fumés et oignons caramélisés.",
    details: {
      bun: "Potato Bun toasté au beurre",
      patty: "Double steak smash pur bœuf",
      cheese: "Double American cheese fondant",
      sauce: "Hot Sauce maison aux piments fumés",
      toppings: "Jalapeños marinés & oignons grillés"
    }
  },
  {
    id: "og-chicken",
    name: "OG Crispy Chicken",
    subtitle: "Poulet Frit Ultra-Croustillant",
    price: 17.5,
    tag: "100% FILET FRAIS",
    image: "/burgers/og-chicken.png",
    description: "Généreux suprême de poulet mariné aux épices, pané minute pour un croustillant légendaire, salade coleslaw crémeuse et sauce OG.",
    details: {
      bun: "Potato Bun toasté crousti-moelleux",
      patty: "Filet de poulet panure dorée croustillante",
      cheese: "Sauce crémeuse signature",
      sauce: "Sauce OG douce et relevée",
      toppings: "Coleslaw frais préparé le matin"
    }
  }
];

// Available customization extras
interface CustomExtra {
  id: string;
  name: string;
  price: number;
}

const DEFAULT_BEEF_MENU = [
  { id: 1, category: Smash Burgers, name: Truffle Mushroom, description: Double smash beef patty, american cheese, grilled mushrooms, truffle mayo, rocket salad, artisanal potato bun., priceDt: 29.5, active: true },
  { id: 2, category: Smash Burgers, name: The OG Smash, description: Double smash beef patty, american cheese, grilled caramelized onions, signature OG sauce, artisanal potato bun., priceDt: 22.7, active: true },
  { id: 3, category: Smash Burgers, name: OG Smash Oklahoma, description: Double smash beef patty smash� avec fines lamelles d oignons caram�lis�s, double american cheese, sauce OG, potato bun., priceDt: 22.7, active: true },
  { id: 4, category: Smash Burgers, name: Hot Smash, description: Double smash beef patty, american cheese, jalape�os �pic�s, sauce hot �pic�e maison, oignons caram�lis�s, potato bun., priceDt: 25.0, active: true },
  { id: 5, category: Crispy Chicken, name: OG Chicken, description: Filet de poulet croustillant pan� minute, coleslaw frais cr�meux, sauce signature OG, artisanal potato bun., priceDt: 17.5, active: true },
  { id: 6, category: Crispy Chicken, name: Classic Chicken, description: Filet de poulet pan� croustillant, salade croquante, rondelles de tomate fra�che, oignons rouges, mayonnaise maison, potato bun., priceDt: 17.5, active: true },
  { id: 7, category: Crispy Chicken, name: Hot Chicken, description: Filet de poulet pan� �pic� croustillant, rondelles de jalape�os marin�s, sauce hot �pic�e, coleslaw cr�meux, potato bun., priceDt: 20.0, active: true },
  { id: 8, category: Chicken Tenders, name: Chicken Tenders (2 Pi�ces), description: 2 aiguillettes de poulet marin�es ultra-croustillantes dor�es � la perfection avec 1 sauce au choix., priceDt: 6.0, active: true },
  { id: 9, category: Chicken Tenders, name: Chicken Tenders (4 Pi�ces), description: 4 aiguillettes de poulet marin�es ultra-croustillantes dor�es � la perfection avec 1 sauce au choix., priceDt: 12.0, active: true },
  { id: 10, category: Chicken Tenders, name: Chicken Tenders (8 Pi�ces), description: 8 aiguillettes de poulet marin�es ultra-croustillantes dor�es � la perfection avec 2 sauces au choix., priceDt: 22.0, active: true },
  { id: 11, category: Frites & Sides, name: Frites Crinkle Croustillantes, description: Frites ondul�es ultra-croustillantes et dor�es, assaisonn�es au sel d �pices Beef & Buns., priceDt: 3.0, active: true },
  { id: 12, category: Extras & Sauces, name: Extra Smash Patty (B�uf), description: Steak de b�uf smash� suppl�mentaire 100% pur b�uf., priceDt: 6.0, active: true },
  { id: 13, category: Extras & Sauces, name: Bacon de B�uf Croustillant, description: Tranches de bacon de b�uf grill�es croustillantes., priceDt: 5.0, active: true },
  { id: 14, category: Extras & Sauces, name: Pastrami B�uf Artisanal, description: Tranches de pastrami de b�uf artisanal grill� � la plancha., priceDt: 5.0, active: true },
  { id: 15, category: Extras & Sauces, name: Tranche American Cheese, description: Fromage am�ricain fondant suppl�mentaire., priceDt: 3.0, active: true },
  { id: 16, category: Extras & Sauces, name: Smoked Cheese (Fum�), description: Tranche de fromage fum� cr�meux., priceDt: 3.0, active: true },
  { id: 17, category: Extras & Sauces, name: Champignons Saut�s Grill�s, description: Portion de champignons frais revenus au beurre et herbes., priceDt: 3.0, active: true },
  { id: 18, category: Extras & Sauces, name: Sauce Truffle Mayo Extra, description: Mayonnaise onctueuse infus�e � la truffe noire d Italie., priceDt: 3.0, active: true },
  { id: 19, category: Extras & Sauces, name: Sauce Hot Spicy Maison, description: Sauce piquante artisanale aux piments fum�s., priceDt: 3.5, active: true },
  { id: 20, category: Extras & Sauces, name: Sauce OG Signature Extra, description: Notre sauce secr�te culte, douce, relev�e et fum�e., priceDt: 2.5, active: true },
  { id: 21, category: Extras & Sauces, name: Jalape�os �pic�s, description: Rondelles de piments jalape�os croquants marin�s., priceDt: 2.5, active: true },
  { id: 22, category: Extras & Sauces, name: Pickles Croquants, description: Cornichons marin�s � l aneth maison., priceDt: 2.0, active: true },
  { id: 23, category: Boissons, name: Coca-Cola / Zero (33cl), description: Canette fra�che 33cl servie tr�s fra�che., priceDt: 3.0, active: true },
  { id: 24, category: Boissons, name: Boga Cidre / Boga Lim (33cl), description: Boisson gazeuse tunisienne embl�matique bien fra�che., priceDt: 3.0, active: true },
  { id: 25, category: Boissons, name: Fanta Orange / Sprite (33cl), description: Canette fra�che 33cl., priceDt: 3.0, active: true },
  { id: 26, category: Boissons, name: Eau Min�rale 0.5L, description: Bouteille 0.5L servie fra�che., priceDt: 1.5, active: true },
  { id: 27, category: Boissons, name: Eau Min�rale 1L, description: Bouteille 1L servie fra�che., priceDt: 3.0, active: true },
];

const AVAILABLE_EXTRAS: CustomExtra[] = [
  { id: "patty", name: "Extra Smash Patty (Bœuf)", price: 6.0 },
  { id: "bacon", name: "Bacon de Bœuf Croustillant", price: 5.0 },
  { id: "pastrami", name: "Pastrami Bœuf Grillé", price: 5.0 },
  { id: "cheddar", name: "Extra Tranche American Cheese", price: 3.0 },
  { id: "smoked", name: "Fromage Fumé (Smoked Cheese)", price: 3.0 },
  { id: "mushrooms", name: "Champignons Sautés Grillés", price: 3.0 },
  { id: "truffle-mayo", name: "Sauce Truffle Mayo Extra", price: 3.0 },
  { id: "hot-sauce", name: "Sauce Hot Spicy Extra", price: 3.5 },
  { id: "jalapenos", name: "Piments Jalapeños Marinés", price: 2.5 },
  { id: "og-sauce", name: "Sauce OG Signature Extra", price: 2.5 },
  { id: "pickles", name: "Pickles Croquants Extra", price: 2.0 },
];

// Cart Item interface
interface CartItem {
  id: string; // unique item uuid
  name: string;
  category: string;
  basePrice: number;
  quantity: number;
  image?: string;
  pattiesCount?: number; // 1, 2 or 3
  selectedExtras?: CustomExtra[];
  totalPrice: number;
}

export default function Home() {
  // --- 3D INTERACTIVE HERO STATE ---
  const [selectedBurgerIndex, setSelectedBurgerIndex] = useState(0);
  const [isExploded, setIsExploded] = useState(false);
  const [activePin, setActivePin] = useState<string | null>(null);
  const [isAutoRotating, setIsAutoRotating] = useState(false);

  // 3D Tilt Coordinates
  const [tilt, setTilt] = useState({ x: 12, y: -16 });
  const isDragging = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const stageRef = useRef<HTMLDivElement>(null);

  const activeBurger = FEATURED_BURGERS[selectedBurgerIndex];

  // Mouse / Touch handlers for 3D rotation
  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    lastMousePos.current = { x: e.clientX, y: e.clientY };
    setIsAutoRotating(false);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const deltaX = e.clientX - lastMousePos.current.x;
    const deltaY = e.clientY - lastMousePos.current.y;
    lastMousePos.current = { x: e.clientX, y: e.clientY };

    setTilt(prev => ({
      x: Math.max(-35, Math.min(45, prev.x - deltaY * 0.35)),
      y: Math.max(-60, Math.min(60, prev.y + deltaX * 0.35)),
    }));
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  // Auto rotation effect when enabled
  useEffect(() => {
    if (!isAutoRotating) return;
    const interval = setInterval(() => {
      setTilt(prev => ({
        ...prev,
        y: (prev.y + 1) % 360,
      }));
    }, 30);
    return () => clearInterval(interval);
  }, [isAutoRotating]);

  // --- MENU DATA & SEARCH/FILTERS ---
  const { data: remoteMenu } = trpc.restaurant.menu.list.useQuery(undefined, { retry: false });
  const menuItemsData = (remoteMenu && remoteMenu.length > 0) ? remoteMenu : DEFAULT_BEEF_MENU;
  const isMenuLoading = false;
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = useMemo(() => {
    if (!menuItemsData) return ["Tous", "Smash Burgers", "Crispy Chicken", "Chicken Tenders", "Frites & Sides", "Extras & Sauces", "Boissons"];
    const unique = Array.from(new Set(menuItemsData.map(item => item.category)));
    return ["Tous", ...unique];
  }, [menuItemsData]);

  const filteredMenuItems = useMemo(() => {
    if (!menuItemsData) return [];
    return menuItemsData.filter(item => {
      const matchesCategory = selectedCategory === "Tous" || item.category === selectedCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [menuItemsData, selectedCategory, searchQuery]);

  // Helper to find image for menu item
  const getItemImage = (name: string, category: string) => {
    const lower = name.toLowerCase();
    if (lower.includes("truffle") || lower.includes("truffe")) return "/burgers/truffle-mushroom.png";
    if (lower.includes("oklahoma")) return "/burgers/og-smash-oklahoma.png";
    if (lower.includes("hot smash")) return "/burgers/hot-smash.png";
    if (lower.includes("og smash")) return "/burgers/og-smash.png";
    if (lower.includes("og chicken")) return "/burgers/og-chicken.png";
    if (lower.includes("classic chicken")) return "/burgers/classic-chicken.png";
    if (lower.includes("hot chicken")) return "/burgers/hot-chicken.png";
    if (lower.includes("tender")) return "/burgers/chicken-tenders.png";
    if (lower.includes("frite") || lower.includes("fries")) return "/burgers/crinkle-fries.png";
    return null;
  };

  // --- CART STATE ---
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Customizer modal state
  const [customizerItem, setCustomizerItem] = useState<{
    name: string;
    category: string;
    basePrice: number;
    image?: string;
  } | null>(null);

  const [customPatties, setCustomPatties] = useState(2); // 1 = simple, 2 = double, 3 = triple (+6 DT)
  const [selectedExtras, setSelectedExtras] = useState<CustomExtra[]>([]);

  const openCustomizer = (name: string, category: string, basePrice: number, image?: string) => {
    setCustomizerItem({ name, category, basePrice, image });
    setCustomPatties(category === "Smash Burgers" ? 2 : 1);
    setSelectedExtras([]);
  };

  const handleToggleExtra = (extra: CustomExtra) => {
    setSelectedExtras(prev =>
      prev.some(e => e.id === extra.id)
        ? prev.filter(e => e.id !== extra.id)
        : [...prev, extra]
    );
  };

  const calculateCustomizerTotal = () => {
    if (!customizerItem) return 0;
    let total = customizerItem.basePrice;
    if (customizerItem.category === "Smash Burgers") {
      if (customPatties === 3) total += 6.0; // Triple patty
      if (customPatties === 1) total -= 4.0; // Simple patty reduction
    }
    selectedExtras.forEach(e => {
      total += e.price;
    });
    return Math.max(0, Math.round(total * 10) / 10);
  };

  const addCustomizedToCart = () => {
    if (!customizerItem) return;
    const unitPrice = calculateCustomizerTotal();
    const newItem: CartItem = {
      id: `${Date.now()}-${Math.random()}`,
      name: customizerItem.name,
      category: customizerItem.category,
      basePrice: customizerItem.basePrice,
      quantity: 1,
      image: customizerItem.image,
      pattiesCount: customizerItem.category === "Smash Burgers" ? customPatties : undefined,
      selectedExtras: [...selectedExtras],
      totalPrice: unitPrice,
    };

    setCart(prev => [...prev, newItem]);
    setCustomizerItem(null);
    setIsCartOpen(true);
    toast.success(`${customizerItem.name} ajouté avec succès !`);
  };

  const addQuickItemToCart = (name: string, category: string, price: number, image?: string) => {
    // If it's a burger, we can open customizer or add directly
    const newItem: CartItem = {
      id: `${Date.now()}-${Math.random()}`,
      name,
      category,
      basePrice: price,
      quantity: 1,
      image,
      totalPrice: price,
    };
    setCart(prev => [...prev, newItem]);
    toast.success(`${name} ajouté au panier !`);
  };

  const updateCartQuantity = (id: string, delta: number) => {
    setCart(prev =>
      prev
        .map(item => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const cartTotalDt = useMemo(() => {
    const sum = cart.reduce((total, item) => total + item.totalPrice * item.quantity, 0);
    return Math.round(sum * 10) / 10;
  }, [cart]);

  const cartItemCount = useMemo(() => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  }, [cart]);

  // --- CHECKOUT & ORDER STATE ---
  const [orderType, setOrderType] = useState<"delivery" | "pickup">("delivery");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryNeighborhood, setDeliveryNeighborhood] = useState("Sahloul");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [orderNotes, setOrderNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createOrderMutation = trpc.restaurant.orders.create.useMutation();

  const handleWhatsAppCheckout = () => {
    if (cart.length === 0) {
      toast.error("Votre panier est vide.");
      return;
    }
    if (!customerName.trim() || !customerPhone.trim()) {
      toast.error("Veuillez renseigner votre nom et votre numéro de téléphone.");
      return;
    }
    if (orderType === "delivery" && !deliveryAddress.trim()) {
      toast.error("Veuillez indiquer votre adresse de livraison.");
      return;
    }

    // Build stylish WhatsApp message
    let msg = `🍔 *NOUVELLE COMMANDE BEEF & BUNS SOUSSE*\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `👤 *Client :* ${customerName.trim()}\n`;
    msg += `📞 *Téléphone :* ${customerPhone.trim()}\n`;
    msg += `📦 *Mode :* ${orderType === "delivery" ? `🛵 Livraison (${deliveryNeighborhood})` : "🛍️ À emporter (Takeout)"}\n`;
    if (orderType === "delivery") {
      msg += `📍 *Adresse :* ${deliveryAddress.trim()}, ${deliveryNeighborhood}, Sousse\n`;
    }
    if (orderNotes.trim()) {
      msg += `📝 *Notes :* ${orderNotes.trim()}\n`;
    }
    msg += `━━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `🛒 *ARTICLES COMMANDÉS :*\n\n`;

    cart.forEach((item, idx) => {
      msg += `${idx + 1}. *${item.quantity}x ${item.name}* (${item.totalPrice.toFixed(1)} DT/u)\n`;
      if (item.pattiesCount) {
        msg += `   └ Steak : ${item.pattiesCount === 3 ? "Triple (+6 DT)" : item.pattiesCount === 1 ? "Simple" : "Double (Standard)"}\n`;
      }
      if (item.selectedExtras && item.selectedExtras.length > 0) {
        msg += `   └ Extras : ${item.selectedExtras.map(e => `${e.name} (+${e.price} DT)`).join(", ")}\n`;
      }
    });

    msg += `━━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `💰 *TOTAL À PAYER : ${cartTotalDt.toFixed(1)} DT*\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `_Commande passée via le site web officiel Beef & Buns_`;

    const encoded = encodeURIComponent(msg);
    const whatsappUrl = `https://wa.me/21628151503?text=${encoded}`;

    window.open(whatsappUrl, "_blank");
    toast.success("Ouverture de WhatsApp avec votre commande prête à être envoyée !");
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] selection:bg-[#ff3b30] selection:text-white">
      {/* BACKGROUND ACCENTS */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-b from-[#ff3b30]/15 via-[#f59e0b]/5 to-transparent blur-[120px]" />
        <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-[#ff3b30]/10 blur-[140px]" />
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-[#f59e0b]/5 blur-[120px]" />
        <div className="absolute inset-0 bg-grid-pattern opacity-40" />
      </div>

      {/* TOP ANNOUNCEMENT BANNER */}
      <div className="relative z-50 bg-[#ff3b30] text-white text-[12px] font-bold tracking-wider py-1.5 px-4 text-center flex items-center justify-center gap-3">
        <span className="flex items-center gap-1.5 uppercase">
          <Flame className="w-3.5 h-3.5 fill-white animate-pulse" />
          Les véritables Smash Burgers artisanaux à Sousse
        </span>
        <span className="hidden sm:inline">•</span>
        <span className="hidden sm:inline font-normal">Ouvert 7j/7 de 12h00 à 00h00</span>
        <span className="hidden md:inline">•</span>
        <a href="tel:28151503" className="hidden md:inline-flex items-center gap-1 underline underline-offset-2 hover:opacity-80">
          <Phone className="w-3 h-3" /> 28 15 15 03
        </a>
      </div>

      {/* NAVIGATION BAR */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[#09090b]/80 border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* BRAND LOGO */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#ff3b30] to-[#f59e0b] p-0.5 shadow-lg shadow-[#ff3b30]/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#09090b] rounded-[10px] flex items-center justify-center">
                <Flame className="w-6 h-6 text-[#ff3b30] fill-[#ff3b30] group-hover:text-[#f59e0b] transition-colors" />
              </div>
            </div>
            <div>
              <div className="font-display text-2xl tracking-wide flex items-center gap-1.5">
                <span>BEEF</span>
                <span className="text-[#ff3b30]">&</span>
                <span>BUNS</span>
              </div>
              <p className="text-[10px] uppercase tracking-widest text-[#a1a1aa] font-semibold -mt-1">
                Sousse • Smash Burger
              </p>
            </div>
          </a>

          {/* DESKTOP NAV LINKS */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-[#a1a1aa]">
            <a href="#experience-3d" className="hover:text-white transition-colors flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#ff3b30]" /> L'Expérience 3D
            </a>
            <a href="#menu" className="hover:text-white transition-colors">
              Le Menu
            </a>
            <a href="#science-smash" className="hover:text-white transition-colors">
              Le Secret du Smash
            </a>
            <a href="#livraison" className="hover:text-white transition-colors">
              Livraison & Contact
            </a>
          </nav>

          {/* ACTIONS */}
          <div className="flex items-center gap-3">
            <a
              href="tel:28151503"
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-white/10 text-xs font-semibold hover:border-white/20 hover:bg-white/5 transition-all text-white"
            >
              <Phone className="w-3.5 h-3.5 text-[#ff3b30]" />
              <span>28 15 15 03</span>
            </a>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-gradient-to-r from-[#ff3b30] to-[#e11d48] text-white font-bold text-xs tracking-wider uppercase shadow-lg shadow-[#ff3b30]/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Panier</span>
              {cartItemCount > 0 ? (
                <span className="bg-white text-[#09090b] text-[11px] font-black px-2 py-0.5 rounded-full">
                  {cartItemCount} • {cartTotalDt.toFixed(1)} DT
                </span>
              ) : (
                <span className="bg-white/20 text-white text-[11px] px-1.5 py-0.5 rounded-full">0</span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION WITH 3D BURGER SHOWCASE */}
      <section id="experience-3d" className="relative z-10 pt-8 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* HERO LEFT COPY */}
            <div className="lg:col-span-5 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ff3b30]/10 border border-[#ff3b30]/30 text-[#ff3b30] text-xs font-black uppercase tracking-wider mb-5">
                <Flame className="w-4 h-4 fill-[#ff3b30]" />
                <span>Simple. Bold. Perfect.</span>
              </div>

              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl leading-[0.95] tracking-tight uppercase mb-6">
                Le Vrai <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff3b30] via-[#f59e0b] to-[#ff3b30]">
                  Smash Burger
                </span>{" "}
                <br />
                De Sousse.
              </h1>

              <p className="text-base sm:text-lg text-[#a1a1aa] leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
                Pur bœuf d'exception pressé ultra-fin sur plaque brûlante à 240°C pour une croûte croustillante caramélisée, servi dans notre fameux potato bun brioché ultra-moelleux.
              </p>

              {/* HERO CTA BUTTONS */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10">
                <a
                  href="#menu"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-[#ff3b30] to-[#e11d48] text-white font-bold text-sm uppercase tracking-wider shadow-xl shadow-[#ff3b30]/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 text-center"
                >
                  <UtensilsCrossed className="w-4 h-4" />
                  <span>Commander En Ligne</span>
                </a>

                <button
                  onClick={() => setIsExploded(!isExploded)}
                  className={`w-full sm:w-auto px-6 py-4 rounded-xl border text-sm font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    isExploded
                      ? "bg-[#f59e0b] text-[#09090b] border-[#f59e0b] shadow-lg shadow-[#f59e0b]/30"
                      : "bg-white/5 text-white border-white/15 hover:bg-white/10"
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  <span>{isExploded ? "Fermer la vue éclatée" : "⚡ Vue Éclatée 3D"}</span>
                </button>
              </div>

              {/* HIGHLIGHT STATS */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10 max-w-md mx-auto lg:mx-0">
                <div>
                  <div className="font-display text-2xl sm:text-3xl text-white">240°C</div>
                  <div className="text-[11px] text-[#a1a1aa] uppercase font-semibold">Croûte Maillard</div>
                </div>
                <div>
                  <div className="font-display text-2xl sm:text-3xl text-[#f59e0b]">100%</div>
                  <div className="text-[11px] text-[#a1a1aa] uppercase font-semibold">Pur Bœuf Frais</div>
                </div>
                <div>
                  <div className="font-display text-2xl sm:text-3xl text-[#ff3b30]">7j / 7</div>
                  <div className="text-[11px] text-[#a1a1aa] uppercase font-semibold">12h - 00h Sousse</div>
                </div>
              </div>
            </div>

            {/* HERO RIGHT: 3D INTERACTIVE BURGER VIEWER */}
            <div className="lg:col-span-7 flex flex-col items-center">
              {/* 3D STAGE CARD */}
              <div className="relative w-full max-w-[540px] aspect-square rounded-3xl bg-gradient-to-b from-[#14141a]/90 to-[#0e0e12]/95 border border-white/10 p-6 flex flex-col items-center justify-center shadow-2xl overflow-hidden group">
                
                {/* AMBIENT RADIAL LIGHT */}
                <div
                  className="absolute inset-0 pointer-events-none transition-opacity duration-700"
                  style={{
                    background: isExploded
                      ? "radial-gradient(circle at 50% 50%, rgba(245, 158, 11, 0.18) 0%, rgba(255, 59, 48, 0.08) 45%, transparent 70%)"
                      : "radial-gradient(circle at 50% 50%, rgba(255, 59, 48, 0.22) 0%, rgba(245, 158, 11, 0.08) 40%, transparent 70%)",
                  }}
                />

                {/* 3D BADGE & CONTROLS HEADER */}
                <div className="absolute top-5 left-5 right-5 flex items-center justify-between z-30">
                  <div className="flex items-center gap-2">
                    <span className="flame-badge">
                      <Sparkles className="w-3 h-3" /> 3D INTERACTIF
                    </span>
                    <span className="hidden sm:inline-flex text-[11px] text-[#a1a1aa] bg-black/40 px-2.5 py-1 rounded-full border border-white/5">
                      Glissez pour pivoter à 360°
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsAutoRotating(!isAutoRotating)}
                      title="Rotation Automatique"
                      className={`p-2 rounded-lg border text-xs transition-colors cursor-pointer ${
                        isAutoRotating
                          ? "bg-[#ff3b30] text-white border-[#ff3b30]"
                          : "bg-black/40 text-[#a1a1aa] border-white/10 hover:text-white"
                      }`}
                    >
                      <RotateCw className={`w-4 h-4 ${isAutoRotating ? "animate-spin" : ""}`} />
                    </button>
                    <button
                      onClick={() => setTilt({ x: 12, y: -16 })}
                      title="Réinitialiser l'angle"
                      className="p-2 rounded-lg bg-black/40 text-[#a1a1aa] border border-white/10 hover:text-white text-xs cursor-pointer"
                    >
                      Reset
                    </button>
                  </div>
                </div>

                {/* 3D PERSPECTIVE CANVAS */}
                <div
                  ref={stageRef}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  className="burger-3d-stage relative w-full h-[380px] flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
                >
                  {/* Dynamic 3D Contact Shadow */}
                  <div className={`burger-contact-shadow ${isExploded ? "exploded" : ""}`} />

                  {/* 3D BURGER CONTAINER */}
                  <div
                    className="burger-3d-model relative w-[310px] h-[310px]"
                    style={{
                      transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                    }}
                  >
                    {/* EXPLODED LAYER VIEW (Separated Slices) */}
                    {isExploded ? (
                      <div className="exploded w-full h-full relative">
                        {/* Layer 1: Top Bun */}
                        <div className="burger-layer layer-top-bun">
                          <img src="/burgers/layers/top-bun.png" alt="Potato Bun Top" />
                          <div
                            onClick={(e) => { e.stopPropagation(); setActivePin(activePin === "bun" ? null : "bun"); }}
                            className="layer-annotation -top-6 -right-4"
                          >
                            <div className="hotspot-pin">1</div>
                            <div className="hotspot-card text-left">
                              <p className="text-[11px] font-bold text-[#f59e0b] uppercase">Brioche Potato Bun</p>
                              <p className="text-[10px] text-zinc-300">Toastée au beurre fondu</p>
                            </div>
                          </div>
                        </div>

                        {/* Layer 2: Toppings & Truffle Mayo */}
                        <div className="burger-layer layer-toppings">
                          <img src="/burgers/layers/toppings.png" alt="Toppings & Truffle Sauce" />
                          <div
                            onClick={(e) => { e.stopPropagation(); setActivePin(activePin === "toppings" ? null : "toppings"); }}
                            className="layer-annotation top-2 -left-8"
                          >
                            <div className="hotspot-card text-right">
                              <p className="text-[11px] font-bold text-[#ff3b30] uppercase">Sauce Truffe & Roquette</p>
                              <p className="text-[10px] text-zinc-300">Champignons sautés minute</p>
                            </div>
                            <div className="hotspot-pin">2</div>
                          </div>
                        </div>

                        {/* Layer 3: Smash Patty 1 + American Cheese */}
                        <div className="burger-layer layer-patty1">
                          <img src="/burgers/layers/cheese-patty1.png" alt="Smash Patty & Cheese" />
                          <div
                            onClick={(e) => { e.stopPropagation(); setActivePin(activePin === "patty1" ? null : "patty1"); }}
                            className="layer-annotation top-8 -right-8"
                          >
                            <div className="hotspot-pin">3</div>
                            <div className="hotspot-card text-left">
                              <p className="text-[11px] font-bold text-[#f59e0b] uppercase">Double Cheese Fondu</p>
                              <p className="text-[10px] text-zinc-300">American cheese fondant</p>
                            </div>
                          </div>
                        </div>

                        {/* Layer 4: Smash Patty 2 */}
                        <div className="burger-layer layer-patty2">
                          <img src="/burgers/layers/patty2.png" alt="Smash Patty 2" />
                          <div
                            onClick={(e) => { e.stopPropagation(); setActivePin(activePin === "patty2" ? null : "patty2"); }}
                            className="layer-annotation top-16 -left-8"
                          >
                            <div className="hotspot-card text-right">
                              <p className="text-[11px] font-bold text-[#ff3b30] uppercase">Croûte Caramélisée</p>
                              <p className="text-[10px] text-zinc-300">Réaction de Maillard 240°C</p>
                            </div>
                            <div className="hotspot-pin">4</div>
                          </div>
                        </div>

                        {/* Layer 5: Bottom Bun */}
                        <div className="burger-layer layer-bottom-bun">
                          <img src="/burgers/layers/bottom-bun.png" alt="Potato Bun Bottom" />
                          <div
                            onClick={(e) => { e.stopPropagation(); setActivePin(activePin === "bottom" ? null : "bottom"); }}
                            className="layer-annotation bottom-0 -right-6"
                          >
                            <div className="hotspot-pin">5</div>
                            <div className="hotspot-card text-left">
                              <p className="text-[11px] font-bold text-[#f59e0b] uppercase">Base Grille Protectrice</p>
                              <p className="text-[10px] text-zinc-300">Scelle tous les jus précieux</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* SOLID 3D BURGER (Active Selected Burger) */
                      <div className="w-full h-full relative flex items-center justify-center">
                        <img
                          src={activeBurger.image}
                          alt={activeBurger.name}
                          className="w-full h-full object-contain filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.85)] pointer-events-none transition-all duration-500 scale-105"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* ACTIVE BURGER INFO & QUICK ACTION */}
                <div className="w-full pt-4 border-t border-white/10 flex items-center justify-between z-20 mt-auto">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-[#f59e0b] tracking-wider uppercase">
                        {activeBurger.tag}
                      </span>
                    </div>
                    <h3 className="font-display text-xl text-white tracking-wide">
                      {activeBurger.name}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-display text-2xl text-[#ff3b30]">
                      {activeBurger.price.toFixed(1)} <span className="text-sm">DT</span>
                    </span>
                    <button
                      onClick={() => openCustomizer(activeBurger.name, "Smash Burgers", activeBurger.price, activeBurger.image)}
                      className="px-4 py-2 rounded-lg bg-[#ff3b30] hover:bg-[#e11d48] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-[#ff3b30]/30 cursor-pointer flex items-center gap-1.5"
                    >
                      <Sliders className="w-3.5 h-3.5" />
                      <span>Personnaliser</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* BURGER SELECTOR SWITCHER */}
              <div className="flex items-center gap-2 mt-6 overflow-x-auto max-w-full pb-2 px-2">
                {FEATURED_BURGERS.map((burger, idx) => {
                  const isActive = idx === selectedBurgerIndex;
                  return (
                    <button
                      key={burger.id}
                      onClick={() => {
                        setSelectedBurgerIndex(idx);
                        setIsExploded(false);
                      }}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer border ${
                        isActive
                          ? "bg-white/10 text-white border-[#ff3b30] shadow-md shadow-[#ff3b30]/20 scale-105"
                          : "bg-white/5 text-[#a1a1aa] border-white/5 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      <img src={burger.image} alt={burger.name} className="w-6 h-6 object-contain" />
                      <span>{burger.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* THE SECRET OF THE SMASH (SCIENCE SECTION) */}
      <section id="science-smash" className="py-20 bg-[#0e0e12] border-y border-white/[0.08] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="flame-badge mb-3">
              <Flame className="w-3 h-3" /> L'EXCELLENCE CULINAIRE
            </span>
            <h2 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-white mb-4">
              L'Art Secret Du <span className="text-[#ff3b30]">Smash</span>
            </h2>
            <p className="text-[#a1a1aa] text-base leading-relaxed">
              Pourquoi Beef & Buns surpasse les burgers traditionnels ? Une alchimie précise entre chaleur extrême, sélection de viande et maîtrise technique.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* CARD 1 */}
            <div className="glass-panel p-6 rounded-2xl glass-panel-hover flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#ff3b30]/15 border border-[#ff3b30]/30 flex items-center justify-center text-[#ff3b30] mb-5">
                  <Flame className="w-6 h-6" />
                </div>
                <h3 className="font-heading text-xl font-bold uppercase text-white mb-2">
                  La Réaction de Maillard
                </h3>
                <p className="text-xs text-[#a1a1aa] leading-relaxed">
                  Pressé avec force sur acier chauffé à 240°C, les acides aminés et sucres caramélisent en millisecondes pour créer cette croûte dentelée ultra-savoureuse inimitable.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-bold text-[#ff3b30]">
                <span>PLANCHA ACIER 240°C</span>
                <Check className="w-4 h-4" />
              </div>
            </div>

            {/* CARD 2 */}
            <div className="glass-panel p-6 rounded-2xl glass-panel-hover flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#f59e0b]/15 border border-[#f59e0b]/30 flex items-center justify-center text-[#f59e0b] mb-5">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="font-heading text-xl font-bold uppercase text-white mb-2">
                  Le Véritable Potato Bun
                </h3>
                <p className="text-xs text-[#a1a1aa] leading-relaxed">
                  Inspiré des plus célèbres burger joints de New York. Un pain à base de pomme de terre d'une légèreté aérienne, beurré et toasté pour résister aux jus sans jamais s'imbiber.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-bold text-[#f59e0b]">
                <span>MOELLEUX INCOMPARABLE</span>
                <Check className="w-4 h-4" />
              </div>
            </div>

            {/* CARD 3 */}
            <div className="glass-panel p-6 rounded-2xl glass-panel-hover flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#ff3b30]/15 border border-[#ff3b30]/30 flex items-center justify-center text-[#ff3b30] mb-5">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="font-heading text-xl font-bold uppercase text-white mb-2">
                  100% Frais Jamais Surgelé
                </h3>
                <p className="text-xs text-[#a1a1aa] leading-relaxed">
                  Sélection rigoureuse des meilleurs morceaux de bœuf avec le ratio parfait gras/maigre (80/20) pour une explosion de jutosité en bouche.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-bold text-[#ff3b30]">
                <span>HACHÉ SUR PLACE</span>
                <Check className="w-4 h-4" />
              </div>
            </div>

            {/* CARD 4 */}
            <div className="glass-panel p-6 rounded-2xl glass-panel-hover flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#f59e0b]/15 border border-[#f59e0b]/30 flex items-center justify-center text-[#f59e0b] mb-5">
                  <UtensilsCrossed className="w-6 h-6" />
                </div>
                <h3 className="font-heading text-xl font-bold uppercase text-white mb-2">
                  Sauces Signatures Secrètes
                </h3>
                <p className="text-xs text-[#a1a1aa] leading-relaxed">
                  De notre mayonnaise infusée à la véritable truffe noire d'Italie jusqu'à notre mythique sauce OG fumée et notre sauce hot épicée artisanale.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-bold text-[#f59e0b]">
                <span>RECETTES MAISON</span>
                <Check className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FULL MENU SECTION */}
      <section id="menu" className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* MENU HEADER */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="flame-badge mb-3">
                <UtensilsCrossed className="w-3 h-3" /> LA CARTE OFFICIELLE
              </span>
              <h2 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-white">
                Nos Créations <span className="text-[#ff3b30]">Gourmet</span>
              </h2>
              <p className="text-[#a1a1aa] text-sm mt-2">
                Tous nos smash burgers sont servis en double steak 100% pur bœuf dans leur potato bun artisanal.
              </p>
            </div>

            {/* SEARCH INPUT */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-[#a1a1aa] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Rechercher un plat, sauce..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#14141a] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-[#71717a] focus:outline-none focus:border-[#ff3b30] transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a1a1aa] hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* CATEGORY TABS */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`category-pill ${selectedCategory === cat ? "active" : ""}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* MENU ITEMS GRID */}
          {isMenuLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-64 rounded-2xl bg-[#14141a] animate-pulse border border-white/5" />
              ))}
            </div>
          ) : filteredMenuItems.length === 0 ? (
            <div className="text-center py-16 bg-[#14141a] rounded-2xl border border-white/10">
              <UtensilsCrossed className="w-12 h-12 text-[#a1a1aa] mx-auto mb-3 opacity-40" />
              <p className="text-lg font-bold text-white mb-1">Aucun article trouvé</p>
              <p className="text-sm text-[#a1a1aa]">Essayez une autre recherche ou réinitialisez le filtre de catégorie.</p>
              <button
                onClick={() => { setSelectedCategory("Tous"); setSearchQuery(""); }}
                className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/15 rounded-lg text-xs font-semibold text-white transition-colors"
              >
                Afficher tout le menu
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMenuItems.map((item) => {
                const itemImg = getItemImage(item.name, item.category);
                const isBurger = item.category === "Smash Burgers" || item.category === "Crispy Chicken";

                return (
                  <div
                    key={item.id}
                    className="glass-panel rounded-2xl p-5 flex flex-col justify-between glass-panel-hover group relative overflow-hidden"
                  >
                    {/* Top row with category / tag & price */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <span className="text-[10px] font-bold text-[#f59e0b] tracking-wider uppercase">
                          {item.category}
                        </span>
                        <h3 className="font-heading text-2xl font-bold text-white group-hover:text-[#ff3b30] transition-colors leading-tight">
                          {item.name}
                        </h3>
                      </div>
                      <div className="text-right">
                        <span className="font-display text-2xl text-[#ff3b30] tracking-wide whitespace-nowrap">
                          {item.priceDt.toFixed(1)} <span className="text-xs">DT</span>
                        </span>
                      </div>
                    </div>

                    {/* Image if available */}
                    {itemImg ? (
                      <div className="w-full h-44 my-2 flex items-center justify-center relative">
                        <div className="absolute inset-0 bg-radial from-[#ff3b30]/10 to-transparent blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        <img
                          src={itemImg}
                          alt={item.name}
                          className="max-h-full max-w-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.7)] group-hover:scale-108 transition-transform duration-300 pointer-events-none"
                        />
                      </div>
                    ) : (
                      <div className="my-2" />
                    )}

                    {/* Description */}
                    {item.description && (
                      <p className="text-xs text-[#a1a1aa] leading-relaxed mb-5 line-clamp-3">
                        {item.description}
                      </p>
                    )}

                    {/* Action buttons */}
                    <div className="pt-4 border-t border-white/[0.08] flex items-center gap-2 mt-auto">
                      {isBurger ? (
                        <>
                          <button
                            onClick={() => openCustomizer(item.name, item.category, item.priceDt, itemImg || undefined)}
                            className="flex-1 py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Sliders className="w-3.5 h-3.5 text-[#f59e0b]" />
                            <span>Personnaliser</span>
                          </button>
                          <button
                            onClick={() => addQuickItemToCart(item.name, item.category, item.priceDt, itemImg || undefined)}
                            title="Ajouter direct au panier"
                            className="p-2.5 rounded-xl bg-[#ff3b30] hover:bg-[#e11d48] text-white transition-all shadow-md shadow-[#ff3b30]/20 cursor-pointer"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => addQuickItemToCart(item.name, item.category, item.priceDt, itemImg || undefined)}
                          className="w-full py-2.5 px-3 rounded-xl bg-[#ff3b30] hover:bg-[#e11d48] text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-md shadow-[#ff3b30]/20 cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Ajouter au Panier</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </section>

      {/* DELIVERY & LOCATION SECTION */}
      <section id="livraison" className="py-20 bg-[#0e0e12] border-t border-white/[0.08] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* LEFT COPY */}
            <div>
              <span className="flame-badge mb-3">
                <Truck className="w-3 h-3" /> LIVRAISON & EMPORTER
              </span>
              <h2 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-white mb-6">
                Chaud & Croustillant <br />
                <span className="text-[#ff3b30]">Chez Vous À Sousse</span>
              </h2>
              <p className="text-[#a1a1aa] text-base leading-relaxed mb-8">
                Commandez directement en ligne ou par téléphone. Vos smash burgers sont préparés minute à la commande et emballés dans nos papiers thermiques spéciaux pour garder la croûte croustillante et le fromage fondant.
              </p>

              {/* DETAILS CARDS */}
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-[#14141a] border border-white/10">
                  <div className="p-2.5 rounded-lg bg-[#ff3b30]/15 text-[#ff3b30] mt-0.5">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase">Zones de Livraison</h4>
                    <p className="text-xs text-[#a1a1aa] mt-1">
                      Sousse Ville, Sahloul (1, 2, 3, 4), Hammam Sousse, Port El Kantaoui, Khzema, Bouhsina, Taffala, Kalaa Sghira.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-[#14141a] border border-white/10">
                  <div className="p-2.5 rounded-lg bg-[#f59e0b]/15 text-[#f59e0b] mt-0.5">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase">Horaires d'Ouverture</h4>
                    <p className="text-xs text-[#a1a1aa] mt-1">
                      Ouvert 7 jours sur 7 en service continu : <strong className="text-white">12:00 — 00:00</strong>.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-[#14141a] border border-white/10">
                  <div className="p-2.5 rounded-lg bg-[#ff3b30]/15 text-[#ff3b30] mt-0.5">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase">Ligne Directe & WhatsApp</h4>
                    <p className="text-xs text-[#a1a1aa] mt-1">
                      Pour commander ou réserver : <a href="tel:28151503" className="text-[#ff3b30] font-bold underline">28 15 15 03</a>
                    </p>
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="px-6 py-3.5 rounded-xl bg-[#ff3b30] hover:bg-[#e11d48] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#ff3b30]/30 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Commander Maintenant</span>
                </button>

                <a
                  href="https://instagram.com/beef.and.buns.sousse"
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-3.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2"
                >
                  <Instagram className="w-4 h-4 text-[#e1306c]" />
                  <span>@beef.and.buns.sousse</span>
                </a>
              </div>
            </div>

            {/* RIGHT: RESTAURANT ADDRESS & MAP CARD */}
            <div className="glass-panel p-8 rounded-3xl border border-white/10 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#ff3b30] to-[#f59e0b] p-0.5 shadow-xl shadow-[#ff3b30]/30 mb-6">
                <div className="w-full h-full bg-[#09090b] rounded-[14px] flex items-center justify-center">
                  <Store className="w-8 h-8 text-[#ff3b30]" />
                </div>
              </div>

              <span className="text-xs font-black tracking-widest uppercase text-[#f59e0b] mb-2">
                RESTAURANT BEEF & BUNS
              </span>
              <h3 className="font-display text-3xl uppercase text-white mb-2">
                Avenue des Orangers
              </h3>
              <p className="text-sm text-[#a1a1aa] max-w-sm mb-6">
                Avenue des Orangers, Sousse, Tunisie (près du rond-point / en face de l'école internationale).
              </p>

              <div className="w-full p-4 rounded-2xl bg-black/50 border border-white/5 mb-6 text-left">
                <div className="flex items-center justify-between py-2 border-b border-white/5 text-xs">
                  <span className="text-[#a1a1aa]">Lundi — Dimanche</span>
                  <span className="font-bold text-white">12:00 — 00:00</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-white/5 text-xs">
                  <span className="text-[#a1a1aa]">Service</span>
                  <span className="font-bold text-[#f59e0b]">Sur place • Emporter • Livraison</span>
                </div>
                <div className="flex items-center justify-between py-2 text-xs">
                  <span className="text-[#a1a1aa]">Téléphone</span>
                  <span className="font-bold text-[#ff3b30]">28 15 15 03</span>
                </div>
              </div>

              <a
                href="https://maps.google.com/?q=Beef+and+Buns+Sousse+Avenue+des+Orangers"
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
              >
                <MapPin className="w-4 h-4 text-[#ff3b30]" />
                <span>Ouvrir dans Google Maps</span>
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#08080a] py-12 border-t border-white/[0.08] relative z-10 text-xs text-[#a1a1aa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#ff3b30] flex items-center justify-center text-white">
              <Flame className="w-4 h-4 fill-white" />
            </div>
            <div>
              <span className="font-display text-lg tracking-wider text-white">BEEF & BUNS</span>
              <p className="text-[10px] text-[#71717a]">The Art of the Smash Burger • Sousse</p>
            </div>
          </div>

          <div className="flex items-center gap-6 font-semibold">
            <a href="#experience-3d" className="hover:text-white transition-colors">3D Experience</a>
            <a href="#menu" className="hover:text-white transition-colors">Menu</a>
            <a href="#science-smash" className="hover:text-white transition-colors">Le Smash</a>
            <a href="#livraison" className="hover:text-white transition-colors">Livraison</a>
            <a href="tel:28151503" className="text-[#ff3b30] hover:underline">28 15 15 03</a>
          </div>

          <div>
            <p>© {new Date().getFullYear()} Beef & Buns Sousse. Tous droits réservés.</p>
          </div>
        </div>
      </footer>

      {/* BURGER CUSTOMIZER MODAL */}
      {customizerItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-modal">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#14141a] border border-white/15 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* CLOSE BUTTON */}
            <button
              onClick={() => setCustomizerItem(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-[#a1a1aa] hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* MODAL HEADER */}
            <div className="flex items-center gap-4 mb-6">
              {customizerItem.image && (
                <img
                  src={customizerItem.image}
                  alt={customizerItem.name}
                  className="w-16 h-16 object-contain filter drop-shadow-md"
                />
              )}
              <div>
                <span className="flame-badge mb-1">PERSONNALISATION</span>
                <h3 className="font-display text-2xl uppercase text-white">
                  {customizerItem.name}
                </h3>
                <p className="text-xs text-[#a1a1aa]">Prix de base : {customizerItem.basePrice.toFixed(1)} DT</p>
              </div>
            </div>

            {/* PATTIES SELECTION (FOR BURGERS) */}
            {customizerItem.category === "Smash Burgers" && (
              <div className="mb-6">
                <label className="block text-xs font-bold uppercase tracking-wider text-white mb-2">
                  Nombre de Steaks Smash (Pur Bœuf)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setCustomPatties(1)}
                    className={`py-3 px-2 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer ${
                      customPatties === 1
                        ? "bg-[#ff3b30] text-white border-[#ff3b30]"
                        : "bg-white/5 text-[#a1a1aa] border-white/10 hover:text-white"
                    }`}
                  >
                    Simple (-4 DT)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCustomPatties(2)}
                    className={`py-3 px-2 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer ${
                      customPatties === 2
                        ? "bg-[#ff3b30] text-white border-[#ff3b30]"
                        : "bg-white/5 text-[#a1a1aa] border-white/10 hover:text-white"
                    }`}
                  >
                    Double (Signature)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCustomPatties(3)}
                    className={`py-3 px-2 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer ${
                      customPatties === 3
                        ? "bg-[#ff3b30] text-white border-[#ff3b30]"
                        : "bg-white/5 text-[#a1a1aa] border-white/10 hover:text-white"
                    }`}
                  >
                    Triple (+6 DT) 🔥
                  </button>
                </div>
              </div>
            )}

            {/* EXTRAS CHECKBOX LIST */}
            <div className="mb-6">
              <label className="block text-xs font-bold uppercase tracking-wider text-white mb-2">
                Ajouter des Extras & Sauces Gourmets
              </label>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {AVAILABLE_EXTRAS.map((extra) => {
                  const isChecked = selectedExtras.some(e => e.id === extra.id);
                  return (
                    <div
                      key={extra.id}
                      onClick={() => handleToggleExtra(extra)}
                      className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                        isChecked
                          ? "bg-[#ff3b30]/15 border-[#ff3b30] text-white font-semibold"
                          : "bg-white/5 border-white/5 text-[#a1a1aa] hover:bg-white/10"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                            isChecked ? "bg-[#ff3b30] border-[#ff3b30]" : "border-white/20"
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <span>{extra.name}</span>
                      </div>
                      <span className="font-bold text-white">+{extra.price.toFixed(1)} DT</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* MODAL FOOTER */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <div>
                <p className="text-[11px] text-[#a1a1aa] uppercase font-bold">Total Calculé</p>
                <p className="font-display text-2xl text-[#ff3b30]">
                  {calculateCustomizerTotal().toFixed(1)} <span className="text-sm">DT</span>
                </p>
              </div>

              <button
                onClick={addCustomizedToCart}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#ff3b30] to-[#e11d48] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#ff3b30]/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Ajouter au Panier</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SHOPPING CART & CHECKOUT DRAWER */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end backdrop-blur-modal">
          <div className="relative w-full max-w-md h-full bg-[#121216] border-l border-white/15 p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
            {/* DRAWER HEADER */}
            <div>
              <div className="flex items-center justify-between pb-5 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-[#ff3b30]" />
                  <h3 className="font-display text-2xl uppercase text-white">Mon Panier</h3>
                  <span className="text-xs bg-white/10 text-white px-2 py-0.5 rounded-full font-bold">
                    {cartItemCount}
                  </span>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-[#a1a1aa] hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* CART ITEMS LIST */}
              <div className="py-4 space-y-3 max-h-[38vh] overflow-y-auto pr-1">
                {cart.length === 0 ? (
                  <div className="text-center py-12 text-[#a1a1aa]">
                    <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30 text-[#ff3b30]" />
                    <p className="text-sm font-bold text-white">Votre panier est encore vide</p>
                    <p className="text-xs mt-1">Sélectionnez vos burgers et sauces préférés pour commencer.</p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-start justify-between gap-3"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-heading text-sm font-bold text-white">{item.name}</h4>
                          {item.pattiesCount && item.pattiesCount > 1 && (
                            <span className="text-[10px] text-[#f59e0b] font-bold">
                              ({item.pattiesCount === 3 ? "Triple" : "Double"})
                            </span>
                          )}
                        </div>

                        {item.selectedExtras && item.selectedExtras.length > 0 && (
                          <div className="text-[10px] text-[#a1a1aa] mt-1 space-y-0.5">
                            {item.selectedExtras.map((e) => (
                              <div key={e.id}>+ {e.name} ({e.price} DT)</div>
                            ))}
                          </div>
                        )}

                        <p className="font-bold text-[#ff3b30] text-xs mt-1.5">
                          {(item.totalPrice * item.quantity).toFixed(1)} DT
                        </p>
                      </div>

                      {/* QUANTITY CONTROLS */}
                      <div className="flex items-center gap-1.5 bg-black/40 rounded-lg p-1 border border-white/10">
                        <button
                          onClick={() => updateCartQuantity(item.id, -1)}
                          className="w-6 h-6 rounded flex items-center justify-center text-[#a1a1aa] hover:text-white hover:bg-white/10 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-5 text-center text-xs font-bold text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.id, 1)}
                          className="w-6 h-6 rounded flex items-center justify-center text-[#a1a1aa] hover:text-white hover:bg-white/10 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* CHECKOUT FORM & ACTIONS */}
            {cart.length > 0 && (
              <div className="pt-4 border-t border-white/10">
                {/* MODE SELECTOR */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <button
                    type="button"
                    onClick={() => setOrderType("delivery")}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      orderType === "delivery"
                        ? "bg-[#ff3b30] text-white border-[#ff3b30]"
                        : "bg-white/5 text-[#a1a1aa] border-white/10"
                    }`}
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Livraison</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderType("pickup")}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      orderType === "pickup"
                        ? "bg-[#ff3b30] text-white border-[#ff3b30]"
                        : "bg-white/5 text-[#a1a1aa] border-white/10"
                    }`}
                  >
                    <Store className="w-3.5 h-3.5" />
                    <span>À Emporter</span>
                  </button>
                </div>

                {/* FORM INPUTS */}
                <div className="space-y-2 mb-4 text-xs">
                  <input
                    type="text"
                    placeholder="Votre Nom & Prénom *"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-[#18181f] border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-[#71717a] focus:outline-none focus:border-[#ff3b30]"
                  />
                  <input
                    type="tel"
                    placeholder="Numéro de Téléphone (ex: 28 15 15 03) *"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-[#18181f] border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-[#71717a] focus:outline-none focus:border-[#ff3b30]"
                  />

                  {orderType === "delivery" && (
                    <>
                      <select
                        value={deliveryNeighborhood}
                        onChange={(e) => setDeliveryNeighborhood(e.target.value)}
                        className="w-full bg-[#18181f] border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#ff3b30]"
                      >
                        <option value="Sahloul">Sahloul (1, 2, 3, 4)</option>
                        <option value="Hammam Sousse">Hammam Sousse</option>
                        <option value="Port El Kantaoui">Port El Kantaoui</option>
                        <option value="Khzema Est / Ouest">Khzema Est / Ouest</option>
                        <option value="Sousse Centre / Médina">Sousse Centre / Médina</option>
                        <option value="Bouhsina">Bouhsina</option>
                        <option value="Kalaa Sghira">Kalaa Sghira</option>
                        <option value="Autre Zone Sousse">Autre Zone à Sousse</option>
                      </select>

                      <input
                        type="text"
                        placeholder="Adresse précise (Rue, Résidence, Étage) *"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        className="w-full bg-[#18181f] border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-[#71717a] focus:outline-none focus:border-[#ff3b30]"
                      />
                    </>
                  )}

                  <input
                    type="text"
                    placeholder="Remarques éventuelles (sans oignons, sonnette...)"
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    className="w-full bg-[#18181f] border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-[#71717a] focus:outline-none focus:border-[#ff3b30]"
                  />
                </div>

                {/* TOTAL SUMMARY */}
                <div className="flex items-center justify-between mb-4 pt-2 border-t border-white/10">
                  <span className="text-xs font-bold text-[#a1a1aa] uppercase">Total Commande</span>
                  <span className="font-display text-2xl text-[#ff3b30]">
                    {cartTotalDt.toFixed(1)} DT
                  </span>
                </div>

                {/* WHATSAPP 1-CLICK ORDER BUTTON */}
                <button
                  onClick={handleWhatsAppCheckout}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#25D366]/30 hover:scale-[1.02] active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Phone className="w-4 h-4 fill-white" />
                  <span>Envoyer Commande via WhatsApp</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* FLOATING ACTION CART TRIGGER (MOBILE & DESKTOP) */}
      {cartItemCount > 0 && !isCartOpen && (
        <button
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-3 px-5 py-3.5 rounded-full bg-gradient-to-r from-[#ff3b30] to-[#e11d48] text-white font-bold text-xs uppercase tracking-wider shadow-2xl shadow-[#ff3b30]/50 hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Voir Panier ({cartItemCount})</span>
          <span className="bg-white text-[#09090b] px-2 py-0.5 rounded-full text-[11px] font-black">
            {cartTotalDt.toFixed(1)} DT
          </span>
        </button>
      )}

    </div>
  );
}
