import React, { useState, useRef, useEffect, useMemo } from "react";
import { toast } from "sonner";
import {
  Flame,
  ShoppingBag,
  Phone,
  MapPin,
  Clock,
  Sparkles,
  RotateCw,
  Layers,
  Eye,
  Play,
  Pause,
  Plus,
  Minus,
  Check,
  X,
  ShieldCheck,
  Instagram,
  Search,
  Sliders,
  UtensilsCrossed,
  Truck,
  Store,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

// The 7 Official Burgers from the Drive Menu
export interface BurgerLayerInfo {
  num: number;
  label: string;
  name: string;
  description: string;
  tag: string;
  image: string;
}

export const DEFAULT_BURGER_LAYERS: BurgerLayerInfo[] = [
  {
    num: 1,
    label: "Bun Supérieur",
    name: "Pain Brioché Doré (Dessus)",
    description: "Pain artisanal brioché ultra-moelleux toasté au beurre doux à la plancha.",
    tag: "PAIN ARTISANAL",
    image: "/burgers/layers/top-bun.png"
  },
  {
    num: 2,
    label: "Garniture & Sauce",
    name: "Sauce Signature & Garniture Fraîche",
    description: "Sauce secrète maison, pickles croquants et oignons caramélisés.",
    tag: "SIGNATURE",
    image: "/burgers/layers/toppings.png"
  },
  {
    num: 3,
    label: "1er Steak Smash",
    name: "Steak Pur Bœuf Smashé & American Cheese",
    description: "Viande bœuf écrasée minute à 240°C avec double fromage américain fondant.",
    tag: "CROÛTE MAILLARD",
    image: "/burgers/layers/cheese-patty1.png"
  },
  {
    num: 4,
    label: "2ème Steak Smash",
    name: "Deuxième Steak Pur Bœuf Smashé",
    description: "Deuxième steak bœuf croustillant caramélisé sous la presse d'acier brûlante.",
    tag: "PUR JUS",
    image: "/burgers/layers/patty2.png"
  },
  {
    num: 5,
    label: "Bun Inférieur",
    name: "Pain Brioché Doré (Dessous)",
    description: "Base briochée toastée retenant les sucs de cuisson et la sauce.",
    tag: "BASE",
    image: "/burgers/layers/bottom-bun.png"
  }
];

export interface BurgerItem {
  id: string;
  name: string;
  category: "Smash Burgers" | "Crispy Chicken";
  badge: string;
  price: number;
  image: string;
  description: string;
  specs: {
    bun: string;
    patty: string;
    cheese: string;
    sauce: string;
    garniture: string;
  };
  layers: BurgerLayerInfo[];
  explodedImage: string;
}

export const ALL_7_BURGERS: BurgerItem[] = [
  {
    id: "truffle-mushroom",
    explodedImage: "/burgers/exploded-3d/truffle-mushroom-3d.png",
    name: "Truffle Mushroom",
    category: "Smash Burgers",
    badge: "BEST SELLER #1",
    price: 29.5,
    image: "/burgers/truffle-mushroom.png",
    description: "Double steak bœuf smashé, double fromage fumé, champignons sautés, oignons croustillants, roquette fraîche et mayonnaise à la truffe dans son pain brioché.",
    specs: {
      bun: "Pain brioché artisanal toasté",
      patty: "Double steak bœuf smashé minute",
      cheese: "Double fromage fumé fondant",
      sauce: "Mayonnaise artisanale à la truffe noire",
      garniture: "Champignons sautés, roquette fraîche & oignons croustillants"
    },
    layers: [
      {
        num: 1,
        label: "Bun Supérieur",
        name: "Pain Brioché (Dessus)",
        description: "Brioche dorée artisanale toastée au beurre doux.",
        tag: "BRIOCHE BUN",
        image: "/burgers/layers/top-bun.png"
      },
      {
        num: 2,
        label: "Sauce & Roquette",
        name: "Truffle Mayo & Roquette Fraîche",
        description: "Mayonnaise onctueuse à la truffe et feuilles de roquette fraîche poivrée.",
        tag: "TRUFFLE & ROCKET",
        image: "/burgers/layers/toppings.png"
      },
      {
        num: 3,
        label: "Champignons & Oignons",
        name: "Champignons Sautés & Oignons Croustillants",
        description: "Champignons de Paris sautés et oignons croustillants dorés.",
        tag: "MUSHROOM & CRISPY ONION",
        image: "/burgers/layers/hot-toppings.png"
      },
      {
        num: 4,
        label: "Steaks & Fromage",
        name: "Double Steak Smash & Fromage Fumé",
        description: "Double steak de bœuf smashé à 240°C avec double fromage fumé fondant.",
        tag: "SMASHED BEEF & SMOKED CHEESE",
        image: "/burgers/layers/cheese-patty1.png"
      },
      {
        num: 5,
        label: "Bun Inférieur",
        name: "Pain Brioché (Dessous) & Truffle Mayo",
        description: "Base briochée toastée avec une généreuse touche de mayonnaise à la truffe.",
        tag: "BASE & TRUFFLE",
        image: "/burgers/layers/bottom-bun.png"
      }
    ]
  },
  {
    id: "og-smash",
    explodedImage: "/burgers/exploded-3d/og-smash-3d.png",
    name: "The OG Smash",
    category: "Smash Burgers",
    badge: "CLASSIQUE INCONTOURNABLE",
    price: 22.7,
    image: "/burgers/og-smash.png",
    description: "Double steak bœuf smashé, double fromage américain, oignons caramélisés fondants, pickles croquants et sauce OG signature dans son pain brioché.",
    specs: {
      bun: "Pain brioché toasté",
      patty: "Double steak de bœuf smashé pur bœuf",
      cheese: "Double fromage américain fondu",
      sauce: "Sauce OG signature maison",
      garniture: "Oignons caramélisés & pickles américains"
    },
    layers: [
      {
        num: 1,
        label: "Bun Supérieur",
        name: "Pain Brioché (Dessus)",
        description: "Pain brioché new-yorkais aérien et doré au beurre.",
        tag: "BRIOCHE BUN",
        image: "/burgers/layers/top-bun.png"
      },
      {
        num: 2,
        label: "Sauce & Pickles",
        name: "Sauce OG Signature & Cornichons Pickles",
        description: "Sauce secrète OG signature et pickles croquants tranchés finement.",
        tag: "OG SAUCE & PICKLES",
        image: "/burgers/layers/toppings.png"
      },
      {
        num: 3,
        label: "Oignons Caramélisés",
        name: "Oignons Caramélisés Fondants",
        description: "Oignons doux mijotés longuement à la plancha jusqu'à caramélisation parfaite.",
        tag: "CARAMELISED ONIONS",
        image: "/burgers/layers/hot-toppings.png"
      },
      {
        num: 4,
        label: "Steaks & Fromage",
        name: "Double Steak Smash & American Cheese",
        description: "Double steak smash pur bœuf croûte Maillard avec double fromage américain ultra fondant.",
        tag: "SMASHED BEEF & CHEESE",
        image: "/burgers/layers/cheese-patty1.png"
      },
      {
        num: 5,
        label: "Bun Inférieur",
        name: "Pain Brioché (Dessous) & Sauce OG",
        description: "Base briochée toastée nappée de sauce OG.",
        tag: "BASE BRIOCHÉE",
        image: "/burgers/layers/bottom-bun.png"
      }
    ]
  },
  {
    id: "og-smash-oklahoma",
    explodedImage: "/burgers/exploded-3d/og-smash-oklahoma-3d.png",
    name: "OG Smash Oklahoma",
    category: "Smash Burgers",
    badge: "TECHNIQUE OKLAHOMA 1926",
    price: 22.7,
    image: "/burgers/og-smash-oklahoma.png",
    description: "Double steak bœuf smashé avec fines lamelles d'oignons doux écrasées directement dans la viande à 240°C, double fromage américain, sauce OG et pickles.",
    specs: {
      bun: "Pain brioché toasté",
      patty: "Double steak smash infusé aux oignons",
      cheese: "Double fromage américain fondu",
      sauce: "Sauce OG signature",
      garniture: "Oignons écrasés dans la viande & pickles"
    },
    layers: [
      {
        num: 1,
        label: "Bun Supérieur",
        name: "Pain Brioché (Dessus)",
        description: "Pain brioché moelleux toasté délicatement.",
        tag: "BRIOCHE BUN",
        image: "/burgers/layers/top-bun.png"
      },
      {
        num: 2,
        label: "Sauce & Pickles",
        name: "Sauce OG & Cornichons Pickles",
        description: "Sauce OG signature et tranches de pickles croquants marinés.",
        tag: "OG SAUCE & PICKLES",
        image: "/burgers/layers/toppings.png"
      },
      {
        num: 3,
        label: "1er Steak Oklahoma",
        name: "Steak Smash Écrasé avec Oignons & Cheese",
        description: "Oignons doux tranchés ultra-fins écrasés directement DANS la viande brûlante avec fromage américain.",
        tag: "OKLAHOMA PATTY 1",
        image: "/burgers/layers/cheese-patty1.png"
      },
      {
        num: 4,
        label: "2ème Steak Oklahoma",
        name: "2ème Steak Smash avec Oignons & Cheese",
        description: "Deuxième palet caramélisé aux sucs d'oignons doux et fromage fondant.",
        tag: "OKLAHOMA PATTY 2",
        image: "/burgers/layers/patty2.png"
      },
      {
        num: 5,
        label: "Bun Inférieur",
        name: "Pain Brioché (Dessous) & Sauce OG",
        description: "Base briochée maintenant le tout et les sucs caramélisés.",
        tag: "BASE",
        image: "/burgers/layers/bottom-bun.png"
      }
    ]
  },
  {
    id: "hot-smash",
    explodedImage: "/burgers/exploded-3d/hot-smash-3d.png",
    name: "Hot Smash",
    category: "Smash Burgers",
    badge: "SPICY LOVERS 🔥",
    price: 25.0,
    image: "/burgers/hot-smash.png",
    description: "Double steak bœuf smashé, double fromage américain, rondelles de jalapeños pimentés, oignons croustillants, sauce piquante et sauce OG dans son pain brioché.",
    specs: {
      bun: "Pain brioché toasté",
      patty: "Double steak bœuf smashé pur jus",
      cheese: "Double fromage américain",
      sauce: "Sauce piquante Hot Sauce & Sauce OG",
      garniture: "Jalapeños marinés & oignons croustillants"
    },
    layers: [
      {
        num: 1,
        label: "Bun Supérieur",
        name: "Pain Brioché (Dessus)",
        description: "Pain brioché toasté sur plaque chaude.",
        tag: "BRIOCHE BUN",
        image: "/burgers/layers/top-bun.png"
      },
      {
        num: 2,
        label: "Sauce & Piments",
        name: "Hot Sauce & Piments Jalapeños",
        description: "Sauce piquante maison relevée et rondelles de jalapeños croquants.",
        tag: "HOT SAUCE & JALAPEÑOS 🔥",
        image: "/burgers/layers/hot-toppings.png"
      },
      {
        num: 3,
        label: "Oignons Croustillants",
        name: "Oignons Croustillants Frits",
        description: "Fils d'oignons frits ultra-croustillants apportant un croquant irrésistible.",
        tag: "CRISPY ONIONS",
        image: "/burgers/layers/toppings.png"
      },
      {
        num: 4,
        label: "Steaks & Fromage",
        name: "Double Steak Smash & American Cheese",
        description: "Double steak smash pur bœuf à croûte Maillard intense et double cheddar fondant.",
        tag: "DOUBLE SMASH & CHEESE",
        image: "/burgers/layers/cheese-patty1.png"
      },
      {
        num: 5,
        label: "Bun Inférieur",
        name: "Pain Brioché (Dessous) & Sauce OG",
        description: "Base briochée dorée nappée de sauce OG.",
        tag: "BASE",
        image: "/burgers/layers/bottom-bun.png"
      }
    ]
  },
  {
    id: "og-chicken",
    explodedImage: "/burgers/exploded-3d/og-chicken-3d.png",
    name: "OG Crispy Chicken",
    category: "Crispy Chicken",
    badge: "POULET SIGNATURE",
    price: 17.5,
    image: "/burgers/og-chicken.png",
    description: "Généreux filet de poulet croustillant pané minute, salade de chou coleslaw fraîche crémeuse, fromage américain fondant et sauce OG dans son pain brioché.",
    specs: {
      bun: "Pain brioché artisanal toasté",
      patty: "Filet de poulet croustillant extra-crispy",
      cheese: "Fromage américain fondant",
      sauce: "Sauce OG signature",
      garniture: "Coleslaw crémeux maison"
    },
    layers: [
      {
        num: 1,
        label: "Bun Supérieur",
        name: "Pain Brioché (Dessus)",
        description: "Pain brioché aérien toasté au beurre doux.",
        tag: "BRIOCHE BUN",
        image: "/burgers/layers/top-bun.png"
      },
      {
        num: 2,
        label: "Coleslaw Maison",
        name: "Coleslaw Frais Crémeux",
        description: "Salade de chou blanc et rouge râpée minute avec carottes et sauce crémeuse.",
        tag: "COLESLAW FRAIS",
        image: "/burgers/layers/coleslaw.png"
      },
      {
        num: 3,
        label: "Fromage Fondu",
        name: "Fromage Américain Fondant",
        description: "Tranche d'American Cheese fondant nappant le poulet chaud.",
        tag: "AMERICAN CHEESE",
        image: "/burgers/layers/cheese-patty1.png"
      },
      {
        num: 4,
        label: "Poulet Croustillant",
        name: "Suprême de Poulet Extra-Croustillant",
        description: "Filet de poulet mariné 24h et pané minute dans une chapelure ultra-dorée et croustillante.",
        tag: "CRISPY CHICKEN",
        image: "/burgers/layers/crispy-chicken.png"
      },
      {
        num: 5,
        label: "Bun Inférieur",
        name: "Pain Brioché (Dessous) & Sauce OG",
        description: "Base briochée toastée avec la sauce signature OG.",
        tag: "BASE & SAUCE OG",
        image: "/burgers/layers/bottom-bun.png"
      }
    ]
  },
  {
    id: "classic-chicken",
    explodedImage: "/burgers/exploded-3d/classic-chicken-3d.png",
    name: "Classic Chicken",
    category: "Crispy Chicken",
    badge: "LE FRAIS & CROUSTILLANT",
    price: 17.5,
    image: "/burgers/classic-chicken.png",
    description: "Filet de poulet pané croustillant, rondelles de tomate fraîche, oignons rouges, laitue croquante, fromage américain et sauce OG dans son pain brioché.",
    specs: {
      bun: "Pain brioché artisanal toasté",
      patty: "Filet de poulet croustillant mariné",
      cheese: "Fromage américain fondu",
      sauce: "Sauce OG signature",
      garniture: "Tomate fraîche, oignons & laitue"
    },
    layers: [
      {
        num: 1,
        label: "Bun Supérieur",
        name: "Pain Brioché (Dessus)",
        description: "Pain brioché toasté au beurre doré.",
        tag: "BRIOCHE BUN",
        image: "/burgers/layers/top-bun.png"
      },
      {
        num: 2,
        label: "Crudités Fraîches",
        name: "Tomate, Oignons & Laitue Croquante",
        description: "Tranches de tomates fraîches juteuses, rondelles d'oignons rouges et feuilles de laitue croquante.",
        tag: "TOMATO, ONION & LETTUCE",
        image: "/burgers/layers/toppings.png"
      },
      {
        num: 3,
        label: "Fromage Fondu",
        name: "Fromage Américain Fondant",
        description: "Tranche d'American Cheese fondu sur le poulet croustillant.",
        tag: "AMERICAN CHEESE",
        image: "/burgers/layers/cheese-patty1.png"
      },
      {
        num: 4,
        label: "Poulet Croustillant",
        name: "Filet de Poulet Pané Croustillant",
        description: "Poulet pané doré et juteux aux herbes et épices douces.",
        tag: "CRISPY CHICKEN",
        image: "/burgers/layers/crispy-chicken.png"
      },
      {
        num: 5,
        label: "Bun Inférieur",
        name: "Pain Brioché (Dessous) & Sauce OG",
        description: "Base briochée moelleuse nappée de sauce OG.",
        tag: "BASE & SAUCE OG",
        image: "/burgers/layers/bottom-bun.png"
      }
    ]
  },
  {
    id: "hot-chicken",
    explodedImage: "/burgers/exploded-3d/hot-chicken-3d.png",
    name: "Hot Chicken",
    category: "Crispy Chicken",
    badge: "ÉPICÉ & CROUSTILLANT 🔥",
    price: 20.0,
    image: "/burgers/hot-chicken.png",
    description: "Filet de poulet pané croustillant pimenté, sauce piquante, piments jalapeños marinés, oignons caramélisés, fromage fumé et sauce OG dans son pain brioché.",
    specs: {
      bun: "Pain brioché artisanal toasté",
      patty: "Filet de poulet croustillant spicy",
      cheese: "Fromage fumé fondant",
      sauce: "Sauce piquante Hot Sauce & Sauce OG",
      garniture: "Jalapeños marinés & oignons caramélisés"
    },
    layers: [
      {
        num: 1,
        label: "Bun Supérieur",
        name: "Pain Brioché (Dessus)",
        description: "Pain brioché toasté au paprika fumé doux.",
        tag: "BRIOCHE BUN",
        image: "/burgers/layers/top-bun.png"
      },
      {
        num: 2,
        label: "Sauce & Jalapeños",
        name: "Hot Sauce & Piments Jalapeños",
        description: "Sauce piquante artisanale aux piments et rondelles de jalapeños.",
        tag: "HOT SAUCE & JALAPEÑOS 🔥",
        image: "/burgers/layers/hot-toppings.png"
      },
      {
        num: 3,
        label: "Oignons Caramélisés",
        name: "Oignons Caramélisés & Fromage Fumé",
        description: "Oignons fondants caramélisés à la plancha et fromage fumé savoureux.",
        tag: "CARAMELISED ONIONS & SMOKED CHEESE",
        image: "/burgers/layers/cheese-patty1.png"
      },
      {
        num: 4,
        label: "Poulet Pimenté",
        name: "Filet de Poulet Extra-Crispy Spicy",
        description: "Filet de poulet mariné pané relevé aux épices fumées et piment de Cayenne.",
        tag: "CRISPY CHICKEN SPICY",
        image: "/burgers/layers/crispy-chicken.png"
      },
      {
        num: 5,
        label: "Bun Inférieur",
        name: "Pain Brioché (Dessous) & Sauce OG",
        description: "Base briochée toastée avec sauce OG.",
        tag: "BASE & SAUCE OG",
        image: "/burgers/layers/bottom-bun.png"
      }
    ]
  }
];

// All 27 official menu items from Google Drive PDF
export const FULL_MENU_ITEMS = [
  // --- 4 SMASH BEEF BURGERS ---
  { id: 1, category: "Smash Burgers", name: "Truffle Mushroom", description: "Double smash beef patty, american cheese, grilled mushrooms, truffle mayo, rocket salad, artisanal potato bun.", priceDt: 29.5, image: "/burgers/truffle-mushroom.png" },
  { id: 2, category: "Smash Burgers", name: "The OG Smash", description: "Double smash beef patty, american cheese, grilled caramelized onions, signature OG sauce, pickles, artisanal potato bun.", priceDt: 22.7, image: "/burgers/og-smash.png" },
  { id: 3, category: "Smash Burgers", name: "OG Smash Oklahoma", description: "Double smash beef patty smashé avec fines lamelles d oignons caramélisés, double american cheese, sauce OG, potato bun.", priceDt: 22.7, image: "/burgers/og-smash-oklahoma.png" },
  { id: 4, category: "Smash Burgers", name: "Hot Smash", description: "Double smash beef patty, american cheese, jalapeños épicés, sauce hot épicée maison, oignons caramélisés, potato bun.", priceDt: 25.0, image: "/burgers/hot-smash.png" },

  // --- 3 CRISPY CHICKEN BURGERS ---
  { id: 5, category: "Crispy Chicken", name: "OG Chicken", description: "Filet de poulet croustillant pané minute, coleslaw frais crémeux, sauce signature OG, artisanal potato bun.", priceDt: 17.5, image: "/burgers/og-chicken.png" },
  { id: 6, category: "Crispy Chicken", name: "Classic Chicken", description: "Filet de poulet pané croustillant, salade croquante, rondelles de tomate fraîche, oignons rouges, mayonnaise maison, potato bun.", priceDt: 17.5, image: "/burgers/classic-chicken.png" },
  { id: 7, category: "Crispy Chicken", name: "Hot Chicken", description: "Filet de poulet pané épicé croustillant, rondelles de jalapeños marinés, sauce hot épicée, coleslaw crémeux, potato bun.", priceDt: 20.0, image: "/burgers/hot-chicken.png" },

  // --- CHICKEN TENDERS & SIDES ---
  { id: 8, category: "Tenders & Frites", name: "Chicken Tenders (2 Pièces)", description: "2 aiguillettes de poulet marinées ultra-croustillantes dorées à la perfection avec 1 sauce au choix.", priceDt: 6.0, image: "/burgers/chicken-tenders.png" },
  { id: 9, category: "Tenders & Frites", name: "Chicken Tenders (4 Pièces)", description: "4 aiguillettes de poulet marinées ultra-croustillantes dorées à la perfection avec 1 sauce au choix.", priceDt: 12.0, image: "/burgers/chicken-tenders.png" },
  { id: 10, category: "Tenders & Frites", name: "Chicken Tenders (8 Pièces)", description: "8 aiguillettes de poulet marinées ultra-croustillantes dorées à la perfection avec 2 sauces au choix.", priceDt: 22.0, image: "/burgers/chicken-tenders.png" },
  { id: 11, category: "Tenders & Frites", name: "Frites Crinkle Croustillantes", description: "Frites ondulées ultra-croustillantes et dorées, assaisonnées au sel d'épices maison Beef & Buns.", priceDt: 3.0, image: "/burgers/crinkle-fries.png" },

  // --- EXTRAS & SAUCES ---
  { id: 12, category: "Extras & Sauces", name: "Extra Smash Patty (Bœuf)", description: "Steak de bœuf smashé supplémentaire 100% pur bœuf.", priceDt: 6.0 },
  { id: 13, category: "Extras & Sauces", name: "Bacon de Bœuf Croustillant", description: "Tranches de bacon de bœuf grillées croustillantes.", priceDt: 5.0 },
  { id: 14, category: "Extras & Sauces", name: "Pastrami Bœuf Artisanal", description: "Tranches de pastrami de bœuf artisanal grillé à la plancha.", priceDt: 5.0 },
  { id: 15, category: "Extras & Sauces", name: "Tranche American Cheese", description: "Fromage américain fondant supplémentaire.", priceDt: 3.0 },
  { id: 16, category: "Extras & Sauces", name: "Smoked Cheese (Fumé)", description: "Tranche de fromage fumé crémeux.", priceDt: 3.0 },
  { id: 17, category: "Extras & Sauces", name: "Champignons Sautés Grillés", description: "Portion de champignons frais revenus au beurre et herbes.", priceDt: 3.0 },
  { id: 18, category: "Extras & Sauces", name: "Sauce Truffle Mayo Extra", description: "Mayonnaise onctueuse infusée à la truffe noire d'Italie.", priceDt: 3.0 },
  { id: 19, category: "Extras & Sauces", name: "Sauce Hot Spicy Maison", description: "Sauce piquante artisanale aux piments fumés.", priceDt: 3.5 },
  { id: 20, category: "Extras & Sauces", name: "Sauce OG Signature Extra", description: "Notre sauce secrète culte, douce, relevée et fumée.", priceDt: 2.5 },
  { id: 21, category: "Extras & Sauces", name: "Jalapeños Épicés", description: "Rondelles de piments jalapeños croquants marinés.", priceDt: 2.5 },
  { id: 22, category: "Extras & Sauces", name: "Pickles Croquants", description: "Cornichons marinés à l'aneth maison.", priceDt: 2.0 },

  // --- BOISSONS ---
  { id: 23, category: "Boissons", name: "Coca-Cola / Zero (33cl)", description: "Canette fraîche 33cl servie très fraîche.", priceDt: 3.0 },
  { id: 24, category: "Boissons", name: "Boga Cidre / Boga Lim (33cl)", description: "Boisson gazeuse tunisienne emblématique bien fraîche.", priceDt: 3.0 },
  { id: 25, category: "Boissons", name: "Fanta Orange / Sprite (33cl)", description: "Canette fraîche 33cl.", priceDt: 3.0 },
  { id: 26, category: "Boissons", name: "Eau Minérale 0.5L", description: "Bouteille 0.5L servie fraîche.", priceDt: 1.5 },
  { id: 27, category: "Boissons", name: "Eau Minérale 1L", description: "Bouteille 1L servie fraîche.", priceDt: 3.0 }
];

// Available extras for customization
export interface CustomExtra {
  id: string;
  name: string;
  price: number;
}

export const AVAILABLE_EXTRAS: CustomExtra[] = [
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
  { id: "pickles", name: "Pickles Croquants Extra", price: 2.0 }
];

export const REMOVABLE_INGREDIENTS = [
  "Sans Oignons",
  "Sans Pickles (Cornichons)",
  "Sans Sauce Signature / Mayo",
  "Sans Fromage",
  "Sans Piments Jalapeños",
  "Sans Salade / Roquette",
  "Sans Tomates"
];

export interface CartItem {
  id: string;
  name: string;
  category: string;
  basePrice: number;
  quantity: number;
  image?: string;
  pattiesCount?: number;
  selectedExtras?: CustomExtra[];
  removedIngredients?: string[];
  totalPrice: number;
}

export default function Home() {
  // --- 3D INTERACTIVE HERO STATE (Clean pure 3D, all 7 burgers) ---
  const [selectedBurgerIndex, setSelectedBurgerIndex] = useState(0);
  const [isExploded, setIsExploded] = useState(false);
  const [isAutoRotating, setIsAutoRotating] = useState(true); // Continuous 360 rotation is active by default
  const [activeLayerIndex, setActiveLayerIndex] = useState(1);

  const isDragging = useRef(false);
  const lastPointerPos = useRef({ x: 0, y: 0 });
  const pointerStartPos = useRef({ x: 0, y: 0 });
  const currentTilt = useRef({ x: 8, y: -15 });
  const modelRef = useRef<HTMLDivElement>(null);
  const autoRotateRef = useRef(true);
  const isExplodedRef = useRef(false);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeBurger = ALL_7_BURGERS[selectedBurgerIndex];

  // Keep refs in sync for the high-performance rAF loop
  useEffect(() => {
    autoRotateRef.current = isAutoRotating;
  }, [isAutoRotating]);

  useEffect(() => {
    isExplodedRef.current = isExploded;
  }, [isExploded]);

  // Butter-smooth 60/120fps continuous 360 rotation loop directly on DOM (0 React re-renders)
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const loop = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Continuous 360 spin when auto-rotating and not actively dragging
      if (autoRotateRef.current && !isDragging.current) {
        if (!isExplodedRef.current) {
          // Continuous 360 degree spin around Y axis
          currentTilt.current.y = (currentTilt.current.y + dt * 28) % 360;
        } else {
          // Subtle gentle sway in exploded view so layers retain 3D depth
          currentTilt.current.y = -10 + Math.sin(now * 0.001) * 12;
        }
      }

      if (modelRef.current) {
        modelRef.current.style.transform = `rotateX(${currentTilt.current.x}deg) rotateY(${currentTilt.current.y}deg)`;
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Universal Touch & Mouse pointer handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    lastPointerPos.current = { x: e.clientX, y: e.clientY };
    pointerStartPos.current = { x: e.clientX, y: e.clientY };
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch (_) {}
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const deltaX = e.clientX - lastPointerPos.current.x;
    const deltaY = e.clientY - lastPointerPos.current.y;
    lastPointerPos.current = { x: e.clientX, y: e.clientY };

    // Update 3D tilt instantaneously
    currentTilt.current.x = Math.max(-35, Math.min(45, currentTilt.current.x - deltaY * 0.4));
    currentTilt.current.y = currentTilt.current.y + deltaX * 0.45;

    if (modelRef.current) {
      modelRef.current.style.transform = `rotateX(${currentTilt.current.x}deg) rotateY(${currentTilt.current.y}deg)`;
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch (_) {}

    // Calculate total movement distance
    const dist = Math.hypot(e.clientX - pointerStartPos.current.x, e.clientY - pointerStartPos.current.y);
    if (dist < 6) {
      // Tap / click detected!
      toggleExploded();
    } else {
      // Drag detected: wait 2.5s then resume auto 360 spin
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
      resumeTimer.current = setTimeout(() => {
        setIsAutoRotating(true);
      }, 2500);
    }
  };

  const toggleExploded = () => {
    setIsExploded(prev => {
      const next = !prev;
      if (next) {
        currentTilt.current = { x: 12, y: -10 };
      } else {
        currentTilt.current = { x: 8, y: -15 };
        setIsAutoRotating(true);
      }
      return next;
    });
  };

  const resetView = () => {
    currentTilt.current = isExploded ? { x: 12, y: -10 } : { x: 8, y: -15 };
    setIsAutoRotating(true);
    if (modelRef.current) {
      modelRef.current.style.transform = `rotateX(${currentTilt.current.x}deg) rotateY(${currentTilt.current.y}deg)`;
    }
  };

  // --- MENU DATA & SEARCH/FILTERS ---
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = ["Tous", "Smash Burgers", "Crispy Chicken", "Tenders & Frites", "Extras & Sauces", "Boissons"];

  const filteredMenuItems = useMemo(() => {
    return FULL_MENU_ITEMS.filter(item => {
      const matchesCategory = selectedCategory === "Tous" || item.category === selectedCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

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

  const [selectedExtras, setSelectedExtras] = useState<CustomExtra[]>([]);
  const [removedIngredients, setRemovedIngredients] = useState<string[]>([]);

  const openCustomizer = (name: string, category: string, basePrice: number, image?: string) => {
    setCustomizerItem({ name, category, basePrice, image });
    setSelectedExtras([]);
    setRemovedIngredients([]);
  };

  const handleToggleExtra = (extra: CustomExtra) => {
    setSelectedExtras(prev =>
      prev.some(e => e.id === extra.id)
        ? prev.filter(e => e.id !== extra.id)
        : [...prev, extra]
    );
  };

  const handleToggleRemovedIngredient = (ing: string) => {
    setRemovedIngredients(prev =>
      prev.includes(ing) ? prev.filter(i => i !== ing) : [...prev, ing]
    );
  };

  const calculateCustomizerTotal = () => {
    if (!customizerItem) return 0;
    let total = customizerItem.basePrice;
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
      selectedExtras: [...selectedExtras],
      removedIngredients: [...removedIngredients],
      totalPrice: unitPrice
    };

    setCart(prev => [...prev, newItem]);
    setCustomizerItem(null);
    setIsCartOpen(true);
    toast.success(`${customizerItem.name} ajouté au panier !`);
  };

  const addQuickItemToCart = (name: string, category: string, price: number, image?: string) => {
    const newItem: CartItem = {
      id: `${Date.now()}-${Math.random()}`,
      name,
      category,
      basePrice: price,
      quantity: 1,
      image,
      totalPrice: price
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

  // --- CHECKOUT & TELEGRAM ORDER DISPATCH ---
  const [orderType, setOrderType] = useState<"delivery" | "pickup">("delivery");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryNeighborhood, setDeliveryNeighborhood] = useState("Sahloul");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [orderNotes, setOrderNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<{ id: number; total: number } | null>(null);

  const handleConfirmOrder = async () => {
    if (cart.length === 0) {
      toast.error("Votre panier est vide.");
      return;
    }
    if (!customerName.trim() || !customerPhone.trim()) {
      toast.error("Veuillez indiquer votre nom et numéro de téléphone.");
      return;
    }
    if (orderType === "delivery" && !deliveryAddress.trim()) {
      toast.error("Veuillez indiquer votre adresse complète de livraison.");
      return;
    }

    setIsSubmitting(true);
    const orderId = Math.floor(1000 + Math.random() * 9000);

    const orderPayload = {
      orderId,
      customerName: customerName.trim(),
      phone: customerPhone.trim(),
      orderType,
      neighborhood: deliveryNeighborhood,
      address: deliveryAddress.trim(),
      notes: orderNotes.trim(),
      items: cart,
      totalDt: cartTotalDt
    };

    // Format telegram message
    let text = `🍔 *NOUVELLE COMMANDE BEEF & BUNS (#${orderId})*\n\n`;
    text += `👤 *Client :* ${orderPayload.customerName}\n`;
    text += `📞 *Tél :* ${orderPayload.phone}\n`;
    text += `📦 *Mode :* ${orderType === 'delivery' ? `🛵 Livraison (${deliveryNeighborhood})` : '🥡 À emporter'}\n`;
    if (orderType === 'delivery') {
      text += `📍 *Adresse :* ${orderPayload.address}\n`;
    }
    if (orderNotes.trim()) {
      text += `📝 *Notes :* ${orderNotes.trim()}\n`;
    }

    text += `\n🛒 *ARTICLES COMMANDÉS :*\n`;
    cart.forEach((item, idx) => {
      text += `${idx + 1}. *${item.quantity}x ${item.name}* (${item.totalPrice.toFixed(1)} DT)\n`;
      if (item.pattiesCount && item.pattiesCount > 1) {
        text += `   └ Steaks : ${item.pattiesCount === 3 ? 'Triple (+6 DT)' : 'Double'}\n`;
      }
      if (item.selectedExtras && item.selectedExtras.length > 0) {
        text += `   └ Extras : ${item.selectedExtras.map(e => `${e.name} (+${e.price} DT)`).join(', ')}\n`;
      }
    });

    text += `\n💰 *TOTAL COMMANDE : ${cartTotalDt.toFixed(1)} DT*\n`;
    text += `⏰ *Heure :* ${new Date().toLocaleTimeString('fr-FR', { timeZone: 'Africa/Tunis' })}\n`;
    text += `\n👉 _Envoyé instantanément depuis le site web_\n`;

    try {
      // Send directly to Telegram bot API
      const botToken = "8962458398:AAEOGRd4gVH29CY93STH2kfN6F8XuA5oRis";
      const chatId = "6048748092";

      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: "Markdown"
        })
      });

      // Also call serverless API if available
      fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload)
      }).catch(() => {});

      setConfirmedOrder({ id: orderId, total: cartTotalDt });
      setCart([]);
      setIsCartOpen(false);
      toast.success("Commande transmise avec succès au restaurant !");
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de l'envoi de la commande. Veuillez nous contacter au 28 15 15 03.");
    } finally {
      setIsSubmitting(false);
    }
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
              <Sparkles className="w-3.5 h-3.5 text-[#ff3b30]" /> Les 7 Burgers en 3D
            </a>
            <a href="#menu" className="hover:text-white transition-colors">
              Le Menu Officiel
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

      {/* HERO SECTION: CONTINUOUS 360 BY DEFAULT + 3D EXPLODED VIEW */}
      <section id="experience-3d" className="relative z-10 pt-8 pb-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* HERO LEFT COPY */}
            <div className="lg:col-span-5 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ff3b30]/10 border border-[#ff3b30]/30 text-[#ff3b30] text-xs font-black uppercase tracking-wider mb-4">
                <Flame className="w-4 h-4 fill-[#ff3b30]" />
                <span>Simple. Bold. Perfect.</span>
              </div>

              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl leading-[0.95] tracking-tight uppercase mb-5">
                Le Véritable <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff3b30] via-[#f59e0b] to-[#ff3b30]">
                  Smash Burger
                </span> <br />
                À Sousse.
              </h1>

              <p className="text-base text-[#a1a1aa] leading-relaxed mb-6 max-w-xl mx-auto lg:mx-0">
                Découvrez nos 7 recettes artisanales : bœuf smashé minute sur acier brûlant à 240°C pour une croûte caramélisée incomparable, et suprême de poulet mariné pané ultra-croustillant.
              </p>

              {/* ACTION BUTTONS */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-8">
                <a
                  href="#menu"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#ff3b30] to-[#e11d48] text-white font-bold text-xs uppercase tracking-wider shadow-xl shadow-[#ff3b30]/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 text-center cursor-pointer"
                >
                  <UtensilsCrossed className="w-4 h-4" />
                  <span>Voir le Menu Complet (27 Plats)</span>
                </a>

                <button
                  onClick={toggleExploded}
                  className={`w-full sm:w-auto px-5 py-3.5 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    isExploded
                      ? "bg-gradient-to-r from-[#ff3b30] to-[#e11d48] text-white border-[#ff3b30] shadow-lg shadow-[#ff3b30]/30"
                      : "bg-white/5 text-white border-white/15 hover:bg-white/10"
                  }`}
                >
                  <Layers className="w-4 h-4 text-[#f59e0b]" />
                  <span>{isExploded ? "Revenir au 360°" : "Voir en 3D"}</span>
                </button>
              </div>

              {/* HIGHLIGHT STATS */}
              <div className="grid grid-cols-3 gap-4 pt-5 border-t border-white/10 max-w-md mx-auto lg:mx-0">
                <div>
                  <div className="font-display text-2xl text-white">7 Burgers</div>
                  <div className="text-[10px] text-[#a1a1aa] uppercase font-semibold">Bœuf & Poulet</div>
                </div>
                <div>
                  <div className="font-display text-2xl text-[#f59e0b]">240°C</div>
                  <div className="text-[10px] text-[#a1a1aa] uppercase font-semibold">Croûte Maillard</div>
                </div>
                <div>
                  <div className="font-display text-2xl text-[#ff3b30]">7j / 7</div>
                  <div className="text-[10px] text-[#a1a1aa] uppercase font-semibold">12h - 00h Sousse</div>
                </div>
              </div>
            </div>

            {/* HERO RIGHT: 3D VIEWER (360 CONTINUOUS BY DEFAULT + 3D EXPLODED VIEW) */}
            <div className="lg:col-span-7 flex flex-col items-center">
              
              {/* 3D STAGE CARD (NO overflow-hidden TO PRESERVE 3D DEPTH) */}
              <div className="relative w-full max-w-[580px] rounded-3xl bg-gradient-to-b from-[#14141a]/95 to-[#0e0e12]/98 border border-white/10 p-5 sm:p-6 flex flex-col items-center justify-between shadow-2xl group">
                
                {/* AMBIENT RADIAL GLOW */}
                <div
                  className="absolute inset-0 pointer-events-none rounded-3xl overflow-hidden"
                  style={{
                    background: isExploded
                      ? "radial-gradient(circle at 50% 50%, rgba(255, 59, 48, 0.25) 0%, rgba(245, 158, 11, 0.12) 45%, transparent 75%)"
                      : "radial-gradient(circle at 50% 45%, rgba(255, 59, 48, 0.2) 0%, rgba(245, 158, 11, 0.08) 40%, transparent 70%)"
                  }}
                />

                {/* 3D HEADER WITH MODE TOGGLE & ROTATION CONTROLS */}
                <div className="w-full flex items-center justify-between z-20 mb-2 gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="flame-badge text-[10px]">
                      <Sparkles className="w-3 h-3 text-[#ff3b30]" />
                      <span className="font-bold text-white uppercase">{activeBurger.name}</span>
                    </span>
                  </div>

                  {/* MODE SWITCHER BUTTONS */}
                  <div className="flex items-center gap-1.5 bg-black/60 p-1 rounded-xl border border-white/10">
                    <button
                      onClick={() => {
                        if (isExploded) {
                          toggleExploded();
                        } else {
                          setIsAutoRotating(true);
                        }
                      }}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
                        !isExploded
                          ? "bg-[#ff3b30] text-white shadow-md shadow-[#ff3b30]/30"
                          : "text-[#a1a1aa] hover:text-white"
                      }`}
                    >
                      <RotateCw className={`w-3 h-3 ${isAutoRotating && !isExploded ? "animate-spin" : ""}`} />
                      <span>360° Continu</span>
                    </button>

                    <button
                      onClick={() => {
                        if (!isExploded) {
                          toggleExploded();
                        }
                      }}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
                        isExploded
                          ? "bg-gradient-to-r from-[#ff3b30] to-[#e11d48] text-white shadow-md shadow-[#ff3b30]/30"
                          : "text-[#a1a1aa] hover:text-white"
                      }`}
                    >
                      <Layers className="w-3 h-3 text-[#f59e0b]" />
                      <span>Vue 3D</span>
                    </button>
                  </div>

                  {/* ROTATION PLAY/PAUSE & RESET */}
                  <div className="flex items-center gap-1">
                    {!isExploded && (
                      <button
                        onClick={() => setIsAutoRotating(!isAutoRotating)}
                        title={isAutoRotating ? "Mettre la rotation en pause" : "Reprendre la rotation 360°"}
                        className="p-1.5 rounded-lg bg-black/40 text-[#a1a1aa] border border-white/10 hover:text-white text-xs cursor-pointer transition-all"
                      >
                        {isAutoRotating ? <Pause className="w-3.5 h-3.5 text-[#f59e0b]" /> : <Play className="w-3.5 h-3.5 text-white" />}
                      </button>
                    )}

                    <button
                      onClick={resetView}
                      title="Réinitialiser l'angle"
                      className="px-2 py-1 rounded-lg bg-black/40 text-[#a1a1aa] border border-white/10 hover:text-white text-[10px] uppercase font-semibold cursor-pointer"
                    >
                      Reset
                    </button>
                  </div>
                </div>

                {/* 3D PERSPECTIVE STAGE (TOUCH-ACTION NONE FOR FLAWLESS MOBILE ROTATION) */}
                {/* DIRECT BURGER NAVIGATION CONTROLS ON 3D STAGE */}
                <div className="w-full flex items-center justify-between px-2 mb-1 z-30">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-black px-2 py-0.5 rounded bg-black/60 text-[#f59e0b] border border-white/10">
                      #{selectedBurgerIndex + 1} / 7
                    </span>
                    <span className="text-xs font-bold text-white uppercase tracking-wide">
                      {activeBurger.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedBurgerIndex((prev) => (prev - 1 + ALL_7_BURGERS.length) % ALL_7_BURGERS.length);
                        setIsExploded(false);
                        setIsAutoRotating(true);
                      }}
                      title="Burger précédent"
                      className="p-1.5 rounded-lg bg-black/50 hover:bg-[#ff3b30] text-white border border-white/10 hover:border-[#ff3b30] transition-all cursor-pointer flex items-center justify-center"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedBurgerIndex((prev) => (prev + 1) % ALL_7_BURGERS.length);
                        setIsExploded(false);
                        setIsAutoRotating(true);
                      }}
                      title="Burger suivant"
                      className="p-1.5 rounded-lg bg-black/50 hover:bg-[#ff3b30] text-white border border-white/10 hover:border-[#ff3b30] transition-all cursor-pointer flex items-center justify-center"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  style={{ touchAction: "none" }}
                  className={`burger-3d-stage relative w-full flex items-center justify-center cursor-grab active:cursor-grabbing select-none transition-all duration-500 ${
                    isExploded ? "h-[350px] sm:h-[390px]" : "h-[320px] sm:h-[350px]"
                  }`}
                >
                  {/* Dynamic Realistic Contact Shadow */}
                  <div className={`burger-contact-shadow ${isExploded ? "exploded" : ""}`} />

                  {/* 3D BURGER MODEL CONTAINER (HIGH-PERFORMANCE DIRECT DOM TRANSFORM) */}
                  <div
                    ref={modelRef}
                    className={`burger-3d-model relative flex items-center justify-center cursor-pointer w-[280px] sm:w-[320px] h-[280px] sm:h-[320px] ${
                      isExploded ? "exploded" : ""
                    }`}
                  >
                    {!isExploded ? (
                      /* MODE 1: CONTINUOUS 360 ROTATION OF THE ASSEMBLED BURGER */
                      <div className="w-full h-full relative flex items-center justify-center group/burger">
                        <img
                          key={activeBurger.id}
                          src={activeBurger.image}
                          alt={activeBurger.name}
                          className="w-full h-full object-contain filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.85)] pointer-events-none transition-all duration-300 scale-105 animate-in fade-in zoom-in-95 duration-200"
                        />
                        {/* INSTRUCTION PILL ON HOVER */}
                        <div className="absolute -bottom-2 px-3 py-1 rounded-full bg-black/80 border border-white/15 text-[10px] text-zinc-300 flex items-center gap-1.5 shadow-lg backdrop-blur-md opacity-90 group-hover/burger:opacity-100 group-hover/burger:border-[#ff3b30]/50 transition-all pointer-events-none">
                          <Layers className="w-3 h-3 text-[#ff3b30]" />
                          <span>Cliquez pour la vue 3D</span>
                        </div>
                      </div>
                    ) : (
                      /* MODE 2: 4K REAL BURGER INGREDIENT EXPLORER — ZERO TEXT OVERLAY ON BURGER */
                      <div
                        className="w-full h-full relative flex items-center justify-center select-none"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* 4K REAL BURGER PHOTO — 100% AUTHENTIC (EXACT SAME AS 360, ZERO AI) */}
                        <img
                          key={activeBurger.id + '-real-4k'}
                          src={activeBurger.image}
                          alt={activeBurger.name}
                          className="w-full h-full object-contain filter drop-shadow-[0_25px_45px_rgba(0,0,0,0.92)] drop-shadow-[0_0_25px_rgba(255,59,48,0.22)] transition-all duration-500 scale-105 pointer-events-none"
                        />

                        {/* LASER SCAN HIGHLIGHT ON ACTIVE ÉTAGE (CLEAN HORIZONTAL BEAM) */}
                        <div
                          className="absolute left-2 right-12 sm:right-16 h-[2px] bg-gradient-to-r from-transparent via-[#ff3b30] to-transparent pointer-events-none transition-all duration-500 shadow-[0_0_16px_#ff3b30] z-20"
                          style={{
                            top: ['16%', '32%', '50%', '68%', '84%'][activeLayerIndex] || '50%'
                          }}
                        />

                        {/* ÉTAGE SELECTOR PINS (CLEANLY POSITIONED OUTSIDE THE BURGER ON THE RIGHT) */}
                        <div className="absolute right-0 top-3 bottom-3 flex flex-col justify-between py-1 z-30 pointer-events-auto">
                          {((activeBurger?.layers && activeBurger.layers.length > 0) ? activeBurger.layers : DEFAULT_BURGER_LAYERS).map((layer, idx) => {
                            const isCurrent = idx === activeLayerIndex;
                            return (
                              <button
                                key={layer.num}
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveLayerIndex(idx);
                                }}
                                title={`Étage #${layer.num} : ${layer.name}`}
                                className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-black transition-all cursor-pointer shadow-lg ${
                                  isCurrent
                                    ? "bg-gradient-to-r from-[#ff3b30] to-[#e11d48] text-white ring-4 ring-[#ff3b30]/40 shadow-[0_0_15px_rgba(255,59,48,0.8)] scale-110"
                                    : "bg-black/90 text-zinc-300 border border-white/20 hover:border-[#ff3b30] hover:text-white"
                                }`}
                              >
                                #{layer.num}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* BOTTOM SECTION: DEDICATED ANATOMIE 3D PANEL (ZERO OVERLAP, 100% READABLE) */}
                <div className="w-full pt-4 border-t border-white/10 flex flex-col gap-3 z-20">
                  
                  {isExploded ? (
                    /* DEDICATED ANATOMIE 3D PANEL (5 COUCHES D'INGRÉDIENTS DE CE BURGER) */
                    <div className="bg-black/50 p-3.5 rounded-2xl border border-white/10 flex flex-col gap-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-[#f59e0b] uppercase tracking-wider flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5" />
                          Anatomie 3D • 5 Couches ({activeBurger.name})
                        </span>
                        <span className="text-[10px] text-[#a1a1aa]">
                          Cliquez sur une couche pour l'inspecter
                        </span>
                      </div>

                      {/* 5 LAYER BUTTON SELECTORS */}
                      <div className="grid grid-cols-5 gap-1.5">
                        {(activeBurger?.layers || DEFAULT_BURGER_LAYERS).map((layer, idx) => {
                          const isCurrent = idx === activeLayerIndex;
                          return (
                            <button
                              key={layer.num}
                              onClick={() => setActiveLayerIndex(idx)}
                              className={`py-1.5 px-1 rounded-lg text-center transition-all cursor-pointer border ${
                                isCurrent
                                  ? "bg-gradient-to-r from-[#ff3b30] to-[#e11d48] text-white border-[#ff3b30] shadow-md shadow-[#ff3b30]/30 font-bold"
                                  : "bg-white/5 text-[#a1a1aa] border-white/5 hover:text-white hover:bg-white/10"
                              }`}
                            >
                              <span className="block text-[11px] font-black">#{layer.num}</span>
                              <span className="block text-[9px] truncate">{layer.label}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* ACTIVE LAYER DETAIL CARD (CRISP, NON-BLURRY, SPECIFIC TO THIS BURGER) */}
                      <div className="bg-gradient-to-r from-white/[0.04] to-white/[0.02] p-3 rounded-xl border border-white/10 flex items-start gap-3">
                        <div className="w-7 h-7 rounded-lg bg-[#ff3b30]/20 border border-[#ff3b30]/40 flex items-center justify-center text-xs font-black text-[#ff3b30] shrink-0">
                          {(activeBurger?.layers?.[activeLayerIndex] || DEFAULT_BURGER_LAYERS[0]).num}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-[#f59e0b]/20 text-[#f59e0b] uppercase">
                              {(activeBurger?.layers?.[activeLayerIndex] || DEFAULT_BURGER_LAYERS[0]).tag}
                            </span>
                            <h4 className="text-xs font-bold text-white">
                              {(activeBurger?.layers?.[activeLayerIndex] || DEFAULT_BURGER_LAYERS[0]).name}
                            </h4>
                          </div>
                          <p className="text-[11px] text-zinc-300 leading-snug">
                            {(activeBurger?.layers?.[activeLayerIndex] || DEFAULT_BURGER_LAYERS[0]).description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* COMPACT SPECS (WHEN IN 360 CONTINUOUS MODE) */
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] bg-black/40 p-3 rounded-xl border border-white/5">
                      <div>
                        <span className="text-[#a1a1aa] block text-[9px] uppercase font-bold">Pain</span>
                        <span className="text-white font-semibold line-clamp-1">{activeBurger.specs.bun}</span>
                      </div>
                      <div>
                        <span className="text-[#a1a1aa] block text-[9px] uppercase font-bold">Viande</span>
                        <span className="text-white font-semibold line-clamp-1">{activeBurger.specs.patty}</span>
                      </div>
                      <div>
                        <span className="text-[#a1a1aa] block text-[9px] uppercase font-bold">Fromage</span>
                        <span className="text-white font-semibold line-clamp-1">{activeBurger.specs.cheese}</span>
                      </div>
                      <div>
                        <span className="text-[#a1a1aa] block text-[9px] uppercase font-bold">Sauce</span>
                        <span className="text-white font-semibold line-clamp-1">{activeBurger.specs.sauce}</span>
                      </div>
                    </div>
                  )}

                  {/* ACTIVE BURGER SUMMARY INFO & BUTTONS */}
                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <span className="text-[10px] font-black text-[#f59e0b] tracking-wider uppercase">
                        {activeBurger.badge}
                      </span>
                      <h3 className="font-display text-2xl text-white tracking-wide">
                        {activeBurger.name}
                      </h3>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-display text-3xl text-[#ff3b30]">
                        {activeBurger.price.toFixed(1)} <span className="text-sm">DT</span>
                      </span>

                      <button
                        onClick={() => openCustomizer(activeBurger.name, activeBurger.category, activeBurger.price, activeBurger.image)}
                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#ff3b30] to-[#e11d48] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-[#ff3b30]/30 hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5"
                      >
                        <Sliders className="w-3.5 h-3.5" />
                        <span>Personnaliser</span>
                      </button>
                    </div>
                  </div>

                </div>

              </div>

              {/* ALL 7 BURGERS SWITCHER SELECTOR (7-ITEM RESPONSIVE WRAPPED GRID) */}
              <div className="w-full max-w-[620px] mt-5">
                <div className="flex items-center justify-between mb-3 px-1">
                  <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-[#ff3b30]" />
                    Les 7 Burgers Officiels du Menu (4 Bœuf + 3 Poulet)
                  </span>
                  <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-[#ff3b30]/20 text-[#ff3b30]">
                    7 Burgers au total
                  </span>
                </div>
                
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {ALL_7_BURGERS.map((burger, idx) => {
                    const isActive = idx === selectedBurgerIndex;
                    return (
                      <button
                        key={burger.id}
                        onClick={() => {
                          setSelectedBurgerIndex(idx);
                          setIsExploded(false);
                          setIsAutoRotating(true);
                        }}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                          isActive
                            ? "bg-gradient-to-r from-[#ff3b30] to-[#e11d48] text-white border-[#ff3b30] shadow-lg shadow-[#ff3b30]/30 scale-105"
                            : "bg-white/5 text-[#a1a1aa] border-white/10 hover:text-white hover:bg-white/10"
                        }`}
                      >
                        <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-black/40 text-[#f59e0b]">
                          #{idx + 1}
                        </span>
                        <img src={burger.image} alt={burger.name} className="w-5 h-5 object-contain" />
                        <span>{burger.name}</span>
                        <span className="text-[11px] font-semibold text-zinc-300">
                          {burger.price.toFixed(1)} DT
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* FULL OFFICIAL MENU SECTION (27 ITEMS) */}
      <section id="menu" className="py-20 relative z-10 border-t border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* MENU HEADER */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="flame-badge mb-3">
                <UtensilsCrossed className="w-3 h-3" /> LA CARTE OFFICIELLE DU DRIVE
              </span>
              <h2 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-white">
                Tout Le Menu <span className="text-[#ff3b30]">Beef & Buns</span>
              </h2>
              <p className="text-[#a1a1aa] text-sm mt-2">
                Les 7 burgers, tenders de poulet, frites crinkle croustillantes, extras et boissons fraîches.
              </p>
            </div>

            {/* SEARCH INPUT */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-[#a1a1aa] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Rechercher burger, sauce..."
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMenuItems.map((item) => {
              const isBurger = item.category === "Smash Burgers" || item.category === "Crispy Chicken";

              return (
                <div
                  key={item.id}
                  className="glass-panel rounded-2xl p-5 flex flex-col justify-between glass-panel-hover group relative overflow-hidden"
                >
                  {/* Top row */}
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
                  {"image" in item && item.image ? (
                    <div className="w-full h-44 my-2 flex items-center justify-center relative">
                      <div className="absolute inset-0 bg-radial from-[#ff3b30]/10 to-transparent blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                      <img
                        src={item.image}
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
                          onClick={() => {
                            const bIdx = ALL_7_BURGERS.findIndex(b => b.name.toLowerCase() === item.name.toLowerCase() || b.id === String(item.id));
                            if (bIdx !== -1) {
                              setSelectedBurgerIndex(bIdx);
                              setIsExploded(false);
                              setIsAutoRotating(true);
                            }
                            const exp = document.getElementById("experience-3d");
                            if (exp) exp.scrollIntoView({ behavior: "smooth" });
                          }}
                          className="py-2.5 px-2.5 rounded-xl bg-white/5 hover:bg-[#ff3b30]/20 hover:border-[#ff3b30]/50 border border-white/10 text-white text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                          title="Voir ce burger en 3D 360°"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#ff3b30]" />
                          <span className="hidden sm:inline">3D 360°</span>
                        </button>
                        <button
                          onClick={() => openCustomizer(item.name, item.category, item.priceDt, "image" in item ? item.image : undefined)}
                          className="flex-1 py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Sliders className="w-3.5 h-3.5 text-[#f59e0b]" />
                          <span>Personnaliser</span>
                        </button>
                        <button
                          onClick={() => addQuickItemToCart(item.name, item.category, item.priceDt, "image" in item ? item.image : undefined)}
                          title="Ajouter direct au panier"
                          className="p-2.5 rounded-xl bg-[#ff3b30] hover:bg-[#e11d48] text-white transition-all shadow-md shadow-[#ff3b30]/20 cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => addQuickItemToCart(item.name, item.category, item.priceDt, "image" in item ? item.image : undefined)}
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

        </div>
      </section>

      {/* THE SECRET OF THE SMASH */}
      <section id="science-smash" className="py-20 bg-[#0e0e12] border-t border-white/[0.08] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="flame-badge mb-3">
              <Flame className="w-3 h-3" /> L'EXCELLENCE CULINAIRE
            </span>
            <h2 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-white mb-4">
              L'Art Secret Du <span className="text-[#ff3b30]">Smash</span>
            </h2>
            <p className="text-[#a1a1aa] text-base leading-relaxed">
              Pourquoi Beef & Buns est unique à Sousse ? Une alchimie précise entre chaleur extrême, sélection de viande et maîtrise technique.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-panel p-6 rounded-2xl glass-panel-hover flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#ff3b30]/15 border border-[#ff3b30]/30 flex items-center justify-center text-[#ff3b30] mb-5">
                  <Flame className="w-6 h-6" />
                </div>
                <h3 className="font-heading text-xl font-bold uppercase text-white mb-2">
                  La Réaction de Maillard
                </h3>
                <p className="text-xs text-[#a1a1aa] leading-relaxed">
                  Pressé avec force sur acier chauffé à 240°C, les sucs caramélisent instantanément pour créer cette croûte dentelée ultra-savoureuse inimitable.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-bold text-[#ff3b30]">
                <span>PLANCHA ACIER 240°C</span>
                <Check className="w-4 h-4" />
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl glass-panel-hover flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#f59e0b]/15 border border-[#f59e0b]/30 flex items-center justify-center text-[#f59e0b] mb-5">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="font-heading text-xl font-bold uppercase text-white mb-2">
                  Le Véritable Potato Bun
                </h3>
                <p className="text-xs text-[#a1a1aa] leading-relaxed">
                  Inspiré des plus célèbres burger joints de New York. Un pain à base de pomme de terre d'un moelleux aérien, beurré et toasté pour résister aux jus.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-bold text-[#f59e0b]">
                <span>MOELLEUX INCOMPARABLE</span>
                <Check className="w-4 h-4" />
              </div>
            </div>

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

            <div className="glass-panel p-6 rounded-2xl glass-panel-hover flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#f59e0b]/15 border border-[#f59e0b]/30 flex items-center justify-center text-[#f59e0b] mb-5">
                  <UtensilsCrossed className="w-6 h-6" />
                </div>
                <h3 className="font-heading text-xl font-bold uppercase text-white mb-2">
                  Sauces Signatures Maison
                </h3>
                <p className="text-xs text-[#a1a1aa] leading-relaxed">
                  De notre mayonnaise infusée à la véritable truffe noire d'Italie jusqu'à notre mythique sauce OG fumée et notre sauce hot épicée artisanale.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-bold text-[#f59e0b]">
                <span>RECETTES EXCLUSIVES</span>
                <Check className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DELIVERY & RESTAURANT INFO */}
      <section id="livraison" className="py-20 bg-[#08080a] border-t border-white/[0.08] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div>
              <span className="flame-badge mb-3">
                <Truck className="w-3 h-3" /> LIVRAISON DIRECTE
              </span>
              <h2 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-white mb-6">
                Chaud & Croustillant <br />
                <span className="text-[#ff3b30]">Chez Vous À Sousse</span>
              </h2>
              <p className="text-[#a1a1aa] text-base leading-relaxed mb-8">
                Commandez directement en ligne sur le site. Notre cuisine reçoit instantanément votre commande sur Telegram et lance la préparation minute.
              </p>

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
                    <h4 className="text-sm font-bold text-white uppercase">Ligne Directe Restaurant</h4>
                    <p className="text-xs text-[#a1a1aa] mt-1">
                      Contact : <a href="tel:28151503" className="text-[#ff3b30] font-bold underline">28 15 15 03</a>
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="px-6 py-3.5 rounded-xl bg-[#ff3b30] hover:bg-[#e11d48] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#ff3b30]/30 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Commander En Ligne</span>
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
                  <span className="text-[#a1a1aa]">Modes</span>
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
      <footer className="bg-[#050507] py-12 border-t border-white/[0.08] relative z-10 text-xs text-[#a1a1aa]">
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
            <a href="#experience-3d" className="hover:text-white transition-colors">Les 7 Burgers 3D</a>
            <a href="#menu" className="hover:text-white transition-colors">Menu Complet</a>
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
            <button
              onClick={() => setCustomizerItem(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-[#a1a1aa] hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

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

            {/* INGRÉDIENTS À RETIRER (OPTIONNEL - SANS FRAIS) */}
            <div className="mb-6">
              <label className="block text-xs font-bold uppercase tracking-wider text-white mb-1">
                Ingrédients à retirer (Optionnel)
              </label>
              <p className="text-[11px] text-[#a1a1aa] mb-2.5">
                Cochez pour préparer votre burger sur mesure sans certains ingrédients :
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                {REMOVABLE_INGREDIENTS.map((ing) => {
                  const isRemoved = removedIngredients.includes(ing);
                  return (
                    <div
                      key={ing}
                      onClick={() => handleToggleRemovedIngredient(ing)}
                      className={`flex items-center justify-between p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                        isRemoved
                          ? "bg-red-500/20 border-red-500 text-white font-semibold"
                          : "bg-white/5 border-white/5 text-[#a1a1aa] hover:bg-white/10"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded-md border flex items-center justify-center text-[10px] font-black ${
                            isRemoved ? "bg-red-500 border-red-500 text-white" : "border-white/20"
                          }`}
                        >
                          {isRemoved ? "✕" : ""}
                        </div>
                        <span className={isRemoved ? "line-through text-red-300" : ""}>{ing}</span>
                      </div>
                      <span className="text-[10px] uppercase font-bold text-zinc-400">0 DT</span>
                    </div>
                  );
                })}
              </div>
            </div>

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

              {/* CART ITEMS */}
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

                        {item.removedIngredients && item.removedIngredients.length > 0 && (
                          <div className="text-[10px] text-red-400 mt-1 font-medium">
                            Sans : {item.removedIngredients.join(", ")}
                          </div>
                        )}
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

            {/* CHECKOUT FORM WITH TELEGRAM NOTIFICATION (NO WHATSAPP FORCING) */}
            {cart.length > 0 && (
              <div className="pt-4 border-t border-white/10">
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
                    <span>Livraison 🛵</span>
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
                    <span>À Emporter 🥡</span>
                  </button>
                </div>

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
                        <option value="Autre Quartier Sousse">Autre Quartier à Sousse</option>
                      </select>

                      <input
                        type="text"
                        placeholder="Adresse exacte (Rue, Résidence, Étage) *"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        className="w-full bg-[#18181f] border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-[#71717a] focus:outline-none focus:border-[#ff3b30]"
                      />
                    </>
                  )}

                  <input
                    type="text"
                    placeholder="Remarques (sans sauce, sonnette, code...)"
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    className="w-full bg-[#18181f] border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-[#71717a] focus:outline-none focus:border-[#ff3b30]"
                  />
                </div>

                <div className="flex items-center justify-between mb-4 pt-2 border-t border-white/10">
                  <span className="text-xs font-bold text-[#a1a1aa] uppercase">Total à Payer</span>
                  <span className="font-display text-2xl text-[#ff3b30]">
                    {cartTotalDt.toFixed(1)} DT
                  </span>
                </div>

                {/* DIRECT ORDER SUBMIT (TRANSMITS TO RESTAURANT TELEGRAM) */}
                <button
                  onClick={handleConfirmOrder}
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-[#ff3b30] to-[#e11d48] text-white font-bold text-xs uppercase tracking-wider shadow-xl shadow-[#ff3b30]/30 hover:scale-[1.02] active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isSubmitting ? "Envoi en cours..." : "🍔 Confirmer & Envoyer la Commande"}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CONFIRMATION MODAL POPUP */}
      {confirmedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-modal">
          <div className="relative w-full max-w-md rounded-3xl bg-[#14141a] border border-white/15 p-8 shadow-2xl text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#ff3b30]/20 border border-[#ff3b30]/40 flex items-center justify-center mx-auto mb-5 text-[#ff3b30]">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <span className="text-[11px] font-bold text-[#f59e0b] tracking-widest uppercase">
              COMMANDE ENREGISTRÉE !
            </span>
            <h3 className="font-display text-3xl uppercase text-white mt-1 mb-3">
              Commande #{confirmedOrder.id}
            </h3>
            <p className="text-xs text-[#a1a1aa] leading-relaxed mb-6">
              Votre commande a été transmise instantanément à la cuisine de Beef & Buns Sousse. Nos cuisiniers préparent vos smash burgers minute.
            </p>

            <div className="p-4 rounded-2xl bg-black/50 border border-white/5 mb-6 text-left text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[#a1a1aa]">Temps estimé :</span>
                <span className="font-bold text-white">~25 - 35 minutes</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#a1a1aa]">Montant à payer :</span>
                <span className="font-bold text-[#ff3b30]">{confirmedOrder.total.toFixed(1)} DT</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#a1a1aa]">Contact restaurant :</span>
                <a href="tel:28151503" className="font-bold text-white underline">28 15 15 03</a>
              </div>
            </div>

            <button
              onClick={() => setConfirmedOrder(null)}
              className="w-full py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      {/* FLOATING CART TRIGGER */}
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
