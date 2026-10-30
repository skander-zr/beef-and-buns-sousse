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
        image: "/burgers/truffle-layers/couche_1.png"
      },
      {
        num: 2,
        label: "Sauce & Roquette",
        name: "Truffle Mayo & Roquette Fraîche",
        description: "Mayonnaise onctueuse à la truffe et feuilles de roquette fraîche poivrée.",
        tag: "TRUFFLE & ROCKET",
        image: "/burgers/truffle-layers/couche_2.png"
      },
      {
        num: 3,
        label: "Champignons & Oignons",
        name: "Champignons Sautés & Oignons Croustillants",
        description: "Champignons de Paris sautés et oignons croustillants dorés.",
        tag: "MUSHROOM & CRISPY ONION",
        image: "/burgers/truffle-layers/couche_3.png"
      },
      {
        num: 4,
        label: "Steaks & Fromage",
        name: "Double Steak Smash & Fromage Fumé",
        description: "Double steak de bœuf smashé à 240°C avec double fromage fumé fondant.",
        tag: "SMASHED BEEF & SMOKED CHEESE",
        image: "/burgers/truffle-layers/couche_4.png"
      },
      {
        num: 5,
        label: "Bun Inférieur",
        name: "Pain Brioché (Dessous) & Truffle Mayo",
        description: "Base briochée toastée avec une généreuse touche de mayonnaise à la truffe.",
        tag: "BASE & TRUFFLE",
        image: "/burgers/truffle-layers/couche_5.png"
      }
    ]
  },
  {
    id: "og-smash",
    explodedImage: "/burgers/exploded-3d/og-smash-3d.png",
    name: "OG Smash",
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
        name: "Pain Brioché Toasté (Dessus)",
        description: "Pain brioché artisanal doré et toasté au beurre doux.",
        tag: "BRIOCHE BUN",
        image: "/burgers/og-layers/og_couche_1.png"
      },
      {
        num: 2,
        label: "Sauce OG & Cornichons",
        name: "Pickles Croquants & Sauce OG",
        description: "Rondelles de cornichons marinés et sauce signature OG maison.",
        tag: "PICKLES & SAUCE OG",
        image: "/burgers/og-layers/og_couche_2.png"
      },
      {
        num: 3,
        label: "Oignons Caramélisés",
        name: "Oignons Caramélisés Fondants",
        description: "Oignons fondants compotés lentement sur la plancha.",
        tag: "CARAMELIZED ONIONS",
        image: "/burgers/og-layers/og_couche_3.png"
      },
      {
        num: 4,
        label: "Double Steak & Fromage",
        name: "Double Steak Smash & American Cheese",
        description: "Deux steaks pur bœuf smashés minute à 240°C avec double fromage américain fondant.",
        tag: "DOUBLE SMASH & CHEESE",
        image: "/burgers/og-layers/og_couche_4.png"
      },
      {
        num: 5,
        label: "Bun Inférieur & Sauce OG",
        name: "Pain Brioché (Dessous) & Sauce OG",
        description: "Base briochée toastée généreusement nappée de sauce OG.",
        tag: "BASE & SAUCE OG",
        image: "/burgers/og-layers/og_couche_5.png"
      }
    ]
  },
  {
    id: "og-triple",
    explodedImage: "/burgers/og_triple_burger_entier_4k.png",
    name: "OG Triple",
    category: "Smash Burgers",
    badge: "TRIPLE SMASH MONSTER 🏆",
    price: 27.5,
    image: "/burgers/og_triple_burger_entier_4k.png",
    description: "Triple steak pur bœuf smashé minute à 240°C, triple fromage américain fondant, oignons caramélisés fondants, pickles croquants et sauce OG signature dans son pain brioché artisanal toasté.",
    specs: {
      bun: "Brioche Potato Bun artisanal toasté",
      patty: "Triple steak pur bœuf smashé minute",
      cheese: "Triple fromage américain fondant",
      sauce: "Sauce OG signature maison",
      garniture: "Oignons caramélisés & pickles croquants"
    },
    layers: [
      {
        num: 1,
        label: "Brioche Potato Bun (Dessus)",
        name: "Brioche Potato Bun (Dessus)",
        description: "Brioche dorée artisanale toastée au beurre doux.",
        tag: "POTATO BUN",
        image: "/burgers/og-triple-layers/og_triple_couche_1.png"
      },
      {
        num: 2,
        label: "Sauce OG & Cornichons",
        name: "Sauce OG & Cornichons",
        description: "Rondelles de pickles croquants marinés et sauce signature OG maison.",
        tag: "SAUCE OG & CORNICHONS",
        image: "/burgers/og-triple-layers/og_triple_couche_2.png"
      },
      {
        num: 3,
        label: "Oignons Caramélisés",
        name: "Oignons Caramélisés",
        description: "Oignons doux compotés lentement et fondants sur la plancha.",
        tag: "OIGNONS CARAMÉLISÉS",
        image: "/burgers/og-triple-layers/og_triple_couche_3.png"
      },
      {
        num: 4,
        label: "Triple Steak & Fromage",
        name: "Triple Steak Smashé & Triple Fromage Américain",
        description: "Triple steak pur bœuf smashé à 240°C avec triple fromage américain ultra-fondant.",
        tag: "TRIPLE SMASH & CHEESE",
        image: "/burgers/og-triple-layers/og_triple_couche_4.png"
      },
      {
        num: 5,
        label: "Bun Inférieur & Sauce OG",
        name: "Brioche Potato Bun (Dessous) & Sauce OG",
        description: "Base briochée toastée moelleuse généreusement garnie de sauce OG signature.",
        tag: "BASE & SAUCE OG",
        image: "/burgers/og-triple-layers/og_triple_couche_5.png"
      }
    ]
  },
  {
    id: "og-bacon",
    explodedImage: "/burgers/og_bacon_burger_entier_4k.png",
    name: "OG Bacon",
    category: "Smash Burgers",
    badge: "BACON & RUNNY EGG 🔥",
    price: 27.5,
    image: "/burgers/og_bacon_burger_entier_4k.png",
    description: "Double steak bœuf smashé, double fromage américain fondant, tranches de bacon fumé grillé croustillant, œuf au plat coulant, oignons caramélisés, roquette fraîche et sauce OG dans son pain brioché toasté.",
    specs: {
      bun: "Brioche Potato Bun artisanal toasté",
      patty: "Double steak de bœuf smashé minute",
      cheese: "Double fromage américain fondant",
      sauce: "Sauce OG signature maison",
      garniture: "Œuf au plat coulant, bacon fumé grillé & roquette"
    },
    layers: [
      {
        num: 1,
        label: "Brioche Potato Bun (Dessus)",
        name: "Brioche Potato Bun (Dessus)",
        description: "Brioche dorée artisanale toastée au beurre doux.",
        tag: "POTATO BUN",
        image: "/burgers/og-bacon-layers/og_bacon_couche_1.png"
      },
      {
        num: 2,
        label: "Sauce OG & Roquette fraîche",
        name: "Sauce OG & Roquette fraîche",
        description: "Feuilles de roquette fraîche poivrée et sauce signature OG maison.",
        tag: "SAUCE OG & ROQUETTE",
        image: "/burgers/og-bacon-layers/og_bacon_couche_2.png"
      },
      {
        num: 3,
        label: "Œuf au plat & Bacon fumé",
        name: "Œuf au plat coulant & Bacon fumé grillé",
        description: "Œuf au plat coulant doré et tranches de bacon de bœuf fumé ultra-croustillantes.",
        tag: "RUNNY EGG & CRISPY BACON",
        image: "/burgers/og-bacon-layers/og_bacon_couche_3.png"
      },
      {
        num: 4,
        label: "Steaks, Fromage & Oignons",
        name: "Double Steak Smashé, Double Fromage Américain & Oignons Caramélisés",
        description: "Double steak de bœuf smashé à 240°C avec double American cheese fondant et oignons caramélisés compotés.",
        tag: "DOUBLE SMASH & CHEESE",
        image: "/burgers/og-bacon-layers/og_bacon_couche_4.png"
      },
      {
        num: 5,
        label: "Bun Inférieur & Sauce OG",
        name: "Brioche Potato Bun (Dessous) & Sauce OG",
        description: "Base briochée toastée moelleuse généreusement garnie de sauce OG signature.",
        tag: "BASE & SAUCE OG",
        image: "/burgers/og-bacon-layers/og_bacon_couche_5.png"
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
        name: "Pain Brioché Toasté (Dessus)",
        description: "Pain brioché artisanal toasté au beurre doré.",
        tag: "BRIOCHE BUN",
        image: "/burgers/oklahoma-layers/oklahoma_couche_1.png"
      },
      {
        num: 2,
        label: "Sauce OG & Cornichons",
        name: "Pickles Croquants & Sauce OG",
        description: "Rondelles de pickles marinés et sauce signature OG maison.",
        tag: "PICKLES & SAUCE OG",
        image: "/burgers/oklahoma-layers/oklahoma_couche_2.png"
      },
      {
        num: 3,
        label: "1er Steak Oklahoma",
        name: "1er Steak Smashé aux Oignons & Fromage Américain",
        description: "Steak pur bœuf écrasé directement sur oignons émincés caramélisés avec American cheese fondant.",
        tag: "OKLAHOMA SMASH #1",
        image: "/burgers/oklahoma-layers/oklahoma_couche_3.png"
      },
      {
        num: 4,
        label: "2ème Steak Oklahoma",
        name: "2ème Steak Smashé aux Oignons & Fromage Américain",
        description: "Deuxième steak pur bœuf caramélisé aux oignons fondants et fromage américain.",
        tag: "OKLAHOMA SMASH #2",
        image: "/burgers/oklahoma-layers/oklahoma_couche_4.png"
      },
      {
        num: 5,
        label: "Bun Inférieur & Sauce OG",
        name: "Pain Brioché (Dessous) & Sauce OG",
        description: "Base briochée moelleuse toastée et nappée de sauce OG.",
        tag: "BASE & SAUCE OG",
        image: "/burgers/oklahoma-layers/oklahoma_couche_5.png"
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
        name: "Pain Brioché Toasté (Dessus)",
        description: "Pain brioché artisanal toasté au beurre doré.",
        tag: "BRIOCHE BUN",
        image: "/burgers/hot-layers/hot_couche_1.png"
      },
      {
        num: 2,
        label: "Sauce Piquante & Jalapeños",
        name: "Sauce Piquante Hot Sauce & Jalapeños",
        description: "Piments jalapeños tranchés marinés nappés de sauce piquante artisanale.",
        tag: "HOT SAUCE & JALAPEÑOS",
        image: "/burgers/hot-layers/hot_couche_2.png"
      },
      {
        num: 3,
        label: "Oignons Croustillants",
        name: "Oignons Croustillants Dorés",
        description: "Oignons frits ultra-croustillants apportant texture et gourmandise.",
        tag: "CRISPY ONIONS",
        image: "/burgers/hot-layers/hot_couche_3.png"
      },
      {
        num: 4,
        label: "Double Steak & Fromage",
        name: "Double Steak Smash & Fromage Américain",
        description: "Double steak smash pur bœuf avec double fromage fondu épicé.",
        tag: "DOUBLE SMASH & CHEESE",
        image: "/burgers/hot-layers/hot_couche_4.png"
      },
      {
        num: 5,
        label: "Bun Inférieur & Sauce OG",
        name: "Pain Brioché (Dessous) & Sauce OG",
        description: "Base briochée toastée généreusement nappée de sauce OG.",
        tag: "BASE & SAUCE OG",
        image: "/burgers/hot-layers/hot_couche_5.png"
      }
    ]
  },
  {
    id: "kids-beef",
    explodedImage: "/burgers/kids_beef_burger_entier_4k.png",
    name: "Kids Beef",
    category: "Smash Burgers",
    badge: "MENU KIDS & JUNIOR 🧒",
    price: 15.0,
    image: "/burgers/kids_beef_burger_entier_4k.png",
    description: "Steak pur bœuf smashé minute, fromage américain fondant, laitue fraîche, rondelles de tomate, oignons doux et sauce signature OG dans un pain brioché moelleux adapté aux plus jeunes.",
    specs: {
      bun: "Brioche Potato Bun artisanal toasté",
      patty: "Simple steak pur bœuf smashé minute",
      cheese: "Fromage américain fondant",
      sauce: "Sauce OG signature maison",
      garniture: "Laitue fraîche croquante, tomate & oignons doux"
    },
    layers: [
      {
        num: 1,
        label: "Brioche Potato Bun (Dessus)",
        name: "Brioche Potato Bun (Dessus)",
        description: "Pain brioché artisanal toasté au beurre doré, moelleux et savoureux.",
        tag: "POTATO BUN",
        image: "/burgers/kids-beef-layers/kids_beef_couche_1.png"
      },
      {
        num: 2,
        label: "Laitue fraîche & Sauce OG",
        name: "Laitue fraîche & Sauce OG",
        description: "Feuilles de laitue verte croquante fraîche avec sauce signature OG maison.",
        tag: "LAITUE & SAUCE OG",
        image: "/burgers/kids-beef-layers/kids_beef_couche_2.png"
      },
      {
        num: 3,
        label: "Tomates & Oignons",
        name: "Tomates & Oignons",
        description: "Rondelle de tomate fraîche juteuse et anneaux d'oignons doux.",
        tag: "TOMATES & OIGNONS",
        image: "/burgers/kids-beef-layers/kids_beef_couche_3.png"
      },
      {
        num: 4,
        label: "1x Steak & Fromage",
        name: "1x Steak Smashé & 1x Fromage Américain",
        description: "Steak pur bœuf croustillant caramélisé sous la presse avec fromage américain fondant.",
        tag: "SMASHED BEEF & CHEESE",
        image: "/burgers/kids-beef-layers/kids_beef_couche_4.png"
      },
      {
        num: 5,
        label: "Bun Inférieur & Sauce OG",
        name: "Brioche Potato Bun (Dessous) & Sauce OG",
        description: "Base briochée toastée moelleuse généreusement garnie de sauce OG signature.",
        tag: "BASE & SAUCE OG",
        image: "/burgers/kids-beef-layers/kids_beef_couche_5.png"
      }
    ]
  },
  {
    id: "og-chicken",
    explodedImage: "/burgers/exploded-3d/og-chicken-3d.png",
    name: "OG Chicken",
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
        name: "Pain Brioché Artisanal (Dessus)",
        description: "Pain brioché artisanal toasté au beurre doux.",
        tag: "BRIOCHE BUN",
        image: "/burgers/chicken-layers/chicken_couche_1.png"
      },
      {
        num: 2,
        label: "Coleslaw Maison",
        name: "Coleslaw (Salade de chou crémeuse)",
        description: "Salade de chou blanc et carottes râpées minute avec sauce crémeuse maison.",
        tag: "CREAMY COLESLAW",
        image: "/burgers/chicken-layers/chicken_couche_2.png"
      },
      {
        num: 3,
        label: "Poulet & Fromage",
        name: "Filet de Poulet Croustillant & Fromage Américain",
        description: "Généreux suprême de poulet mariné ultra-croustillant nappé d'American cheese fondant.",
        tag: "CRISPY CHICKEN & CHEESE",
        image: "/burgers/chicken-layers/chicken_couche_3.png"
      },
      {
        num: 4,
        label: "Sauce OG & Salade",
        name: "Sauce OG Signature & Salade Fraîche",
        description: "Feuille de batavia croquante nappée de sauce signature OG.",
        tag: "OG SAUCE & LETTUCE",
        image: "/burgers/chicken-layers/chicken_couche_4.png"
      },
      {
        num: 5,
        label: "Bun Inférieur",
        name: "Pain Brioché Artisanal (Dessous)",
        description: "Base briochée moelleuse toastée à la perfection.",
        tag: "BASE BRIOCHÉE",
        image: "/burgers/chicken-layers/chicken_couche_5.png"
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
        name: "Pain Brioché Artisanal (Dessus)",
        description: "Pain brioché artisanal toasté parsemé de graines de sésame dorées.",
        tag: "BRIOCHE BUN",
        image: "/burgers/classic-chicken-layers/classic_chicken_couche_1.png"
      },
      {
        num: 2,
        label: "Tomates & Oignons",
        name: "Tomates Fraîches & Oignons Rouges",
        description: "Rondelles de tomates fraîches juteuses et anneaux d'oignons rouges croquants.",
        tag: "TOMATO & ONION",
        image: "/burgers/classic-chicken-layers/classic_chicken_couche_2.png"
      },
      {
        num: 3,
        label: "Laitue Fraîche",
        name: "Laitue Croquante Fraîche",
        description: "Feuilles de salade verte croquante soigneusement sélectionnées.",
        tag: "CRISP LETTUCE",
        image: "/burgers/classic-chicken-layers/classic_chicken_couche_3.png"
      },
      {
        num: 4,
        label: "Poulet & Fromage",
        name: "Filet de Poulet Croustillant & Fromage Américain",
        description: "Suprême de poulet mariné pané minute extra-croustillant nappé d'American cheese fondant.",
        tag: "CRISPY CHICKEN & CHEESE",
        image: "/burgers/classic-chicken-layers/classic_chicken_couche_4.png"
      },
      {
        num: 5,
        label: "Bun Inférieur & Sauce OG",
        name: "Pain Brioché (Dessous) & Sauce OG",
        description: "Base briochée moelleuse toastée et généreusement nappée de sauce OG.",
        tag: "BASE & SAUCE OG",
        image: "/burgers/classic-chicken-layers/classic_chicken_couche_5.png"
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
        name: "Pain Brioché Artisanal (Dessus)",
        description: "Pain brioché artisanal toasté au beurre doré.",
        tag: "BRIOCHE BUN",
        image: "/burgers/hot-chicken-layers/hot_chicken_couche_1.png"
      },
      {
        num: 2,
        label: "Sauce Piquante & Jalapeños",
        name: "Sauce Piquante Hot Sauce & Jalapeños",
        description: "Piments jalapeños tranchés marinés nappés de sauce piquante artisanale bien relevée.",
        tag: "HOT SAUCE & JALAPEÑOS 🔥",
        image: "/burgers/hot-chicken-layers/hot_chicken_couche_2.png"
      },
      {
        num: 3,
        label: "Oignons Caramélisés",
        name: "Oignons Caramélisés",
        description: "Oignons doux compotés lentement à la plancha.",
        tag: "CARAMELIZED ONIONS",
        image: "/burgers/hot-chicken-layers/hot_chicken_couche_3.png"
      },
      {
        num: 4,
        label: "Poulet & Fromage Fumé",
        name: "Filet de Poulet Croustillant & Fromage Fumé fondant",
        description: "Suprême de poulet mariné pané pimenté extra-croquant nappé de fromage fumé ultra-fondant.",
        tag: "HOT CRISPY CHICKEN & CHEESE",
        image: "/burgers/hot-chicken-layers/hot_chicken_couche_4.png"
      },
      {
        num: 5,
        label: "Bun Inférieur & Sauce OG",
        name: "Pain Brioché (Dessous) & Sauce OG",
        description: "Base briochée toastée moelleuse généreusement garnie de sauce OG signature.",
        tag: "BASE & SAUCE OG",
        image: "/burgers/hot-chicken-layers/hot_chicken_couche_5.png"
      }
    ]
  },
  {
    id: "kids-chicken",
    explodedImage: "/burgers/kids_chicken_droit_v2.png?v=2",
    name: "Kids Chicken",
    category: "Crispy Chicken",
    badge: "KIDS CRISPY CHICKEN 🧒🍗",
    price: 12.5,
    image: "/burgers/kids_chicken_droit_v2.png?v=2",
    description: "Aiguillette de filet de poulet croustillant pané minute, fromage américain fondant, laitue fraîche croquante, rondelles de tomate fraîche, oignons doux et sauce signature OG dans un pain brioché moelleux adapté aux enfants.",
    specs: {
      bun: "Brioche Potato Bun artisanal toasté",
      patty: "Filet de poulet croustillant tendre",
      cheese: "Fromage américain fondant",
      sauce: "Sauce OG signature douce",
      garniture: "Laitue fraîche croquante, tomate & oignons doux"
    },
    layers: [
      {
        num: 1,
        label: "Brioche Potato Bun (Dessus)",
        name: "Brioche Potato Bun (Dessus)",
        description: "Brioche dorée artisanale toastée au beurre doux.",
        tag: "POTATO BUN",
        image: "/burgers/kids-chicken-layers/kids_chicken_couche_1.png"
      },
      {
        num: 2,
        label: "Laitue fraîche & Sauce OG",
        name: "Laitue fraîche & Sauce OG",
        description: "Feuilles de laitue verte croquante fraîche avec sauce signature OG maison.",
        tag: "LAITUE & SAUCE OG",
        image: "/burgers/kids-chicken-layers/kids_chicken_couche_2.png"
      },
      {
        num: 3,
        label: "Tomates & Oignons",
        name: "Tomates & Oignons",
        description: "Rondelles de tomate fraîche juteuse et anneaux d'oignons doux.",
        tag: "TOMATES & OIGNONS",
        image: "/burgers/kids-chicken-layers/kids_chicken_couche_3.png"
      },
      {
        num: 4,
        label: "Poulet & Fromage",
        name: "Filet de Poulet Croustillant & Fromage Américain",
        description: "Aiguillette de poulet tendre et ultra-croustillante nappée d'American cheese fondant.",
        tag: "CRISPY CHICKEN & CHEESE",
        image: "/burgers/kids-chicken-layers/kids_chicken_couche_4.png"
      },
      {
        num: 5,
        label: "Bun Inférieur & Sauce OG",
        name: "Brioche Potato Bun (Dessous) & Sauce OG",
        description: "Base briochée toastée moelleuse généreusement garnie de sauce OG signature.",
        tag: "BASE & SAUCE OG",
        image: "/burgers/kids-chicken-layers/kids_chicken_couche_5.png"
      }
    ]
  }

];

// All official menu items (Burgers & Crispy Chicken Tenders ONLY - No standalone drinks or sauces)
export const FULL_MENU_ITEMS = [
  ...ALL_7_BURGERS.map((burger) => ({
    id: burger.id,
    name: burger.name,
    category: burger.category,
    description: burger.description,
    priceDt: burger.price,
    image: burger.image
  })),

  // --- CRISPY CHICKEN TENDERS (2, 4 ET 8 PIÈCES) ---
  {
    id: "tenders-2",
    category: "Crispy Chicken Tenders",
    name: "2 PIECES — 2x Crispy chicken tenders",
    description: "2x aiguillettes de poulet croustillantes marinées, dorées minute à la perfection.",
    priceDt: 6.0,
    image: "/burgers/tenders_2_pieces_4k.png"
  },
  {
    id: "tenders-4",
    category: "Crispy Chicken Tenders",
    name: "4 PIECES — 4x chicken tenders + Coleslaw",
    description: "4x aiguillettes de poulet croustillantes avec salade de chou Coleslaw maison fraîche et crémeuse.",
    priceDt: 12.0,
    image: "/burgers/tenders_4_pieces_coleslaw_4k.png"
  },
  {
    id: "tenders-8",
    category: "Crispy Chicken Tenders",
    name: "8 PIECES — 8x chicken tenders + Coleslaw",
    description: "8x aiguillettes de poulet croustillantes géantes servies avec salade de chou Coleslaw crémeuse.",
    priceDt: 22.0,
    image: "/burgers/tenders_8_pieces_coleslaw_4k.png"
  }
];

// Ingrédients à retirer sur mesure selon la vraie recette de chaque burger
export const BURGER_REMOVABLE_INGREDIENTS: Record<string, string[]> = {
  "Truffle Mushroom": [
    "Sans Mayo Truffe",
    "Sans Roquette",
    "Sans Champignons",
    "Sans Oignons croustillants",
    "Sans Fromage fumé"
  ],
  "OG Smash": [
    "Sans Sauce OG",
    "Sans Pickles (Cornichons)",
    "Sans Oignons caramélisés",
    "Sans Fromage américain"
  ],
  "OG Triple": [
    "Sans Sauce OG",
    "Sans Pickles (Cornichons)",
    "Sans Oignons caramélisés",
    "Sans Fromage américain"
  ],
  "OG Bacon": [
    "Sans Sauce OG",
    "Sans Roquette",
    "Sans Œuf",
    "Sans Bacon",
    "Sans Oignons caramélisés",
    "Sans Fromage américain"
  ],
  "OG Smash Oklahoma": [
    "Sans Sauce OG",
    "Sans Pickles (Cornichons)",
    "Sans Oignons",
    "Sans Fromage américain"
  ],
  "Hot Smash": [
    "Sans Hot Sauce",
    "Sans Sauce OG",
    "Sans Jalapeños",
    "Sans Oignons croustillants",
    "Sans Fromage américain"
  ],
  "Kids Beef": [
    "Sans Sauce OG",
    "Sans Laitue",
    "Sans Tomates",
    "Sans Oignons",
    "Sans Fromage américain"
  ],
  "OG Crispy Chicken": [
    "Sans Sauce OG",
    "Sans Coleslaw",
    "Sans Salade",
    "Sans Fromage américain"
  ],
  "OG Chicken": [
    "Sans Sauce OG",
    "Sans Coleslaw",
    "Sans Salade",
    "Sans Fromage américain"
  ],
  "Classic Chicken": [
    "Sans Sauce OG",
    "Sans Laitue",
    "Sans Tomates",
    "Sans Oignons",
    "Sans Fromage américain"
  ],
  "Hot Chicken": [
    "Sans Hot Sauce",
    "Sans Sauce OG",
    "Sans Jalapeños",
    "Sans Oignons caramélisés",
    "Sans Fromage fumé"
  ],
  "Kids Chicken": [
    "Sans Sauce OG",
    "Sans Laitue",
    "Sans Tomates",
    "Sans Oignons",
    "Sans Fromage américain"
  ]
};

// Available options for Burger & Tenders customization modal
export type OptionGroup = "fries" | "garniture" | "sauce" | "drink";

export interface CustomExtra {
  id: string;
  name: string;
  price: number;
  group: OptionGroup;
}

export const AVAILABLE_EXTRAS: CustomExtra[] = [
  // 1. Portion de Frites
  { id: "classic-fries", name: "Classic Fries (Portion frites)", price: 3.0, group: "fries" },

  // 2. Extras garniture burger (Burger uniquement)
  { id: "smashed-beef", name: "Smashed beef", price: 6.0, group: "garniture" },
  { id: "bacon", name: "Bacon", price: 5.0, group: "garniture" },
  { id: "pastrami", name: "Pastrami", price: 5.0, group: "garniture" },
  { id: "american-cheese", name: "American cheese", price: 3.0, group: "garniture" },
  { id: "smoked-cheese", name: "Smoked cheese", price: 3.0, group: "garniture" },
  { id: "grilled-mushrooms", name: "Grilled mushrooms", price: 3.0, group: "garniture" },
  { id: "jalapenos", name: "Jalapeños", price: 2.5, group: "garniture" },
  { id: "fresh-rocket", name: "Fresh rocket", price: 2.5, group: "garniture" },
  { id: "pickles", name: "Pickles", price: 2.0, group: "garniture" },

  // 3. Sauces
  { id: "hot-sauce", name: "Hot sauce", price: 3.5, group: "sauce" },
  { id: "truffle-mayo", name: "Truffle mayo", price: 3.0, group: "sauce" },
  { id: "og-sauce", name: "OG sauce", price: 2.5, group: "sauce" },
  { id: "heinz-mayo", name: "Heinz Mayonnaise", price: 2.5, group: "sauce" },
  { id: "heinz-ketchup", name: "Heinz Ketchup", price: 2.5, group: "sauce" },

  // 4. Boissons
  { id: "water-05", name: "Water 0.5 L", price: 1.5, group: "drink" },
  { id: "water-1l", name: "Water 1 L", price: 3.0, group: "drink" },
  { id: "sodas", name: "Sodas (Canette 33cl)", price: 3.0, group: "drink" }
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
  // --- ALL useState AND useRef DECLARED AT THE VERY TOP ---
  const [selectedBurgerIndex, setSelectedBurgerIndex] = useState(0);
  const [isExploded, setIsExploded] = useState(false);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [activeLayerIndex, setActiveLayerIndex] = useState(1);

  // Menu filters & search
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [searchQuery, setSearchQuery] = useState("");

  // Cart & Customizer Modal
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [customizerItem, setCustomizerItem] = useState<{
    id?: string;
    name: string;
    category: string;
    basePrice: number;
    image?: string;
  } | null>(null);
  const [selectedExtras, setSelectedExtras] = useState<CustomExtra[]>([]);
  const [removedIngredients, setRemovedIngredients] = useState<string[]>([]);

  // Checkout state
  const [orderType, setOrderType] = useState<"delivery" | "pickup">("delivery");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryNeighborhood, setDeliveryNeighborhood] = useState("Sahloul");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [orderNotes, setOrderNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<{ id: number; total: number } | null>(null);

  // Refs
  const isDragging = useRef(false);
  const lastPointerPos = useRef({ x: 0, y: 0 });
  const pointerStartPos = useRef({ x: 0, y: 0 });
  const currentTilt = useRef({ x: 0, y: -15 });
  const modelRef = useRef<HTMLDivElement>(null);
  const autoRotateRef = useRef(true);
  const isExplodedRef = useRef(false);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeBurger = ALL_7_BURGERS[selectedBurgerIndex];

  // REAL VISITOR TRACKER (Records genuine site visits per session & syncs with /api/visit)
  useEffect(() => {
    try {
      const todayStr = new Date().toISOString().slice(0, 10);
      const sessionKey = "bb_visit_" + todayStr;
      if (!sessionStorage.getItem(sessionKey)) {
        sessionStorage.setItem(sessionKey, "1");

        // Record locally in history
        const raw = localStorage.getItem("beef_and_buns_real_visits");
        const history = raw ? JSON.parse(raw) : {};
        history[todayStr] = (Number(history[todayStr]) || 0) + 1;
        localStorage.setItem("beef_and_buns_real_visits", JSON.stringify(history));

        // Sync with API
        fetch("/api/visit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "record" })
        }).catch(() => {});
      }
    } catch {
      // storage unavailable
    }
  }, []);



  // Keep refs in sync for the high-performance rAF loop
  useEffect(() => {
    autoRotateRef.current = isAutoRotating;
  }, [isAutoRotating]);

  useEffect(() => {
    isExplodedRef.current = isExploded;
  }, [isExploded]);

  // 100% pure hardware-accelerated CSS @keyframes spin360 (0% CPU on Safari iOS)

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

    if (isExplodedRef.current && modelRef.current) {
      currentTilt.current.x = Math.max(-15, Math.min(25, currentTilt.current.x - deltaY * 0.25));
      currentTilt.current.y = Math.max(-28, Math.min(28, currentTilt.current.y + deltaX * 0.35));
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
        currentTilt.current = { x: 0, y: -15 };
        setIsAutoRotating(true);
      }
      return next;
    });
  };

  const resetView = () => {
    currentTilt.current = isExploded ? { x: 12, y: -10 } : { x: 0, y: -15 };
    setIsAutoRotating(true);
    if (modelRef.current) {
      const rotX = !isExploded ? 0 : currentTilt.current.x;
      modelRef.current.style.transform = `rotateX(${rotX}deg) rotateY(${currentTilt.current.y}deg)`;
    }
  };

  // --- MENU DATA & SEARCH/FILTERS ---

  const categories = ["Tous", "Smash Burgers", "Crispy Chicken", "Crispy Chicken Tenders"];

  const filteredMenuItems = useMemo(() => {
    return FULL_MENU_ITEMS.filter(item => {
      const matchesCategory = selectedCategory === "Tous" || item.category === selectedCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // --- CART & CUSTOMIZER HANDLERS ---

  const openCustomizer = (name: string, category: string, basePrice: number, image?: string, id?: string) => {
    setCustomizerItem({ name, category, basePrice, image, id });
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

  // --- CHECKOUT & ORDER DISPATCH ---

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

    // Sequential order number (Commande #1, #2, #3...)
    // 1. Calculate true sequential order ID (#1, #2, #3...) from ntfy.sh
    const todayStr = new Date().toISOString().slice(0, 10);
    let calculatedOrderId = 1;

    try {
      const pollRes = await fetch("https://ntfy.sh/beef_buns_sousse_orders_live/json?poll=1");
      if (pollRes.ok) {
        const rawText = await pollRes.text();
        const lines = rawText.trim().split("\n").filter(Boolean);
        let maxId = 0;
        for (const line of lines) {
          try {
            const evt = JSON.parse(line);
            if (evt.event === "message" && evt.message) {
              const data = JSON.parse(evt.message);
              if (data && typeof data.id === "number") {
                if (data.date === todayStr || !data.date) {
                  if (data.id > maxId) maxId = data.id;
                }
              }
            }
          } catch {}
        }
        calculatedOrderId = maxId + 1;
      }
    } catch (pollErr) {
      console.warn("Could not poll ntfy for next order id, using local fallback", pollErr);
      const lastDate = localStorage.getItem("bb_last_order_date");
      let currentCount = parseInt(localStorage.getItem("bb_order_counter") || "0", 10);
      if (lastDate !== todayStr) {
        currentCount = 0;
        localStorage.setItem("bb_last_order_date", todayStr);
      }
      calculatedOrderId = currentCount + 1;
    }

    localStorage.setItem("bb_last_order_date", todayStr);
    localStorage.setItem("bb_order_counter", calculatedOrderId.toString());
    const orderId = calculatedOrderId;

    const newHostOrder = {
      id: orderId,
      customerName: customerName.trim(),
      phone: customerPhone.trim(),
      orderType,
      neighborhood: deliveryNeighborhood,
      address: deliveryAddress.trim(),
      notes: orderNotes.trim(),
      items: cart.map(item => ({
        name: item.name,
        quantity: item.quantity,
        totalPrice: item.totalPrice * item.quantity,
        pattiesCount: item.pattiesCount,
        selectedExtras: item.selectedExtras,
        removedIngredients: item.removedIngredients
      })),
      totalDt: cartTotalDt,
      status: "new" as const,
      date: todayStr,
      createdAt: new Date().toLocaleTimeString('fr-FR', { timeZone: 'Africa/Tunis', hour: '2-digit', minute: '2-digit' })
    };

    // 2. Publish order to ntfy cloud for instant real-time sync with /hote on PC
    try {
      await fetch("https://ntfy.sh/beef_buns_sousse_orders_live", {
        method: "POST",
        headers: {
          "Title": `Nouvelle Commande #${orderId} - Beef & Buns`,
          "Priority": "high",
          "Tags": "hamburger,bell"
        },
        body: JSON.stringify(newHostOrder)
      });
    } catch (ntfyErr) {
      console.error("ntfy cloud publish error", ntfyErr);
    }

    // 3. Format single Telegram message with true sequential orderId
    let text = `🍔 *NOUVELLE COMMANDE BEEF & BUNS (#${orderId})*\n\n`;
    text += `👤 *Client :* ${newHostOrder.customerName}\n`;
    text += `📞 *Tél :* ${newHostOrder.phone}\n`;
    text += `📦 *Mode :* ${orderType === 'delivery' ? `🛵 Livraison (${deliveryNeighborhood})` : '🥡 À emporter'}\n`;
    if (orderType === 'delivery') {
      text += `📍 *Adresse :* ${newHostOrder.address}\n`;
    }
    if (orderNotes.trim()) {
      text += `📝 *Notes :* ${orderNotes.trim()}\n`;
    }

    text += `\n🛒 *ARTICLES COMMANDÉS :*\n`;
    cart.forEach((item, idx) => {
      text += `${idx + 1}. *${item.quantity}x ${item.name}* (${(item.totalPrice * item.quantity).toFixed(1)} DT)\n`;
      if (item.pattiesCount && item.pattiesCount > 1) {
        text += `   └ Steaks : ${item.pattiesCount === 3 ? 'Triple (+6 DT)' : 'Double'}\n`;
      }
      if (item.selectedExtras && item.selectedExtras.length > 0) {
        text += `   └ Extras : ${item.selectedExtras.map(e => `${e.name} (+${e.price} DT)`).join(', ')}\n`;
      }
      if (item.removedIngredients && item.removedIngredients.length > 0) {
        text += `   └ Sans : ${item.removedIngredients.join(', ')}\n`;
      }
    });

    text += `\n💰 *TOTAL COMMANDE : ${cartTotalDt.toFixed(1)} DT*\n`;
    text += `⏰ *Heure :* ${new Date().toLocaleTimeString('fr-FR', { timeZone: 'Africa/Tunis' })}\n`;
    text += `\n👉 Gérer la commande : https://beef-and-buns-sousse.vercel.app/hote\n`;

    try {
      // Send directly to Telegram bot API (SINGLE SEND with true sequential orderId)
      const botToken = "9194319608:AAFh739rW2GzXpyVB14BCWN1gfKzJ4KQ3_k";
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

      // Save locally as well
      try {
        const existingOrders = JSON.parse(localStorage.getItem("beef_and_buns_host_orders") || "[]");
        const filtered = existingOrders.filter((o: any) => o.id !== orderId);
        localStorage.setItem("beef_and_buns_host_orders", JSON.stringify([newHostOrder, ...filtered]));
        window.dispatchEvent(new Event("storage"));
      } catch (err) {
        console.error("Local order storage error", err);
      }

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
        <span className="hidden sm:inline font-normal">Ouvert 7j/7 de 12h00 à 01h00</span>
        <span className="hidden md:inline">•</span>
        <a href="tel:28151503" className="hidden md:inline-flex items-center gap-1 underline underline-offset-2 hover:opacity-80">
          <Phone className="w-3 h-3" /> 28 15 15 03
        </a>
      </div>

      {/* NAVIGATION BAR */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[#09090b]/80 border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* BRAND LOGO */}
          <a href="#" className="flex items-center gap-2.5 sm:gap-3 group">
            <img
              src="/logos/logo_3d_embleme_burger.png"
              alt="Beef & Buns Emblème 3D"
              className="h-10 sm:h-12 w-auto object-contain bg-transparent transition-transform duration-300 group-hover:scale-105 shrink-0"
              style={{
                background: "transparent",
                filter: "drop-shadow(0 4px 12px rgba(220, 38, 38, 0.35))",
              }}
            />
            <div className="flex flex-col justify-center">
              <img
                src="/logos/logo_3d_texte_beef_and_buns.png"
                alt="BEEF & BUNS"
                className="h-5 sm:h-6 w-auto object-contain bg-transparent block"
                style={{ background: "transparent" }}
              />
              <p className="text-[9px] sm:text-[10px] uppercase tracking-widest text-[#a1a1aa] font-semibold mt-0.5">
                Sousse • Smash Burger
              </p>
            </div>
          </a>

          {/* DESKTOP NAV LINKS */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-[#a1a1aa]">
            <a href="#experience-3d" className="hover:text-white transition-colors flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#ff3b30]" /> Les {ALL_7_BURGERS.length} Burgers en 3D
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
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 mb-5">
                <img
                  src="/logos/logo_3d_embleme_burger.png"
                  alt="Beef & Buns Emblème 3D"
                  className="w-16 h-16 sm:w-20 sm:h-20 object-contain bg-transparent animate-float-3d shrink-0"
                  style={{
                    background: "transparent",
                    filter: "drop-shadow(0 10px 20px rgba(220, 38, 38, 0.35))",
                  }}
                />
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ff3b30]/10 border border-[#ff3b30]/30 text-[#ff3b30] text-xs font-black uppercase tracking-wider">
                  <Flame className="w-4 h-4 fill-[#ff3b30]" />
                  <span>Simple. Bold. Perfect. • Sousse</span>
                </div>
              </div>

              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl leading-[0.95] tracking-tight uppercase mb-5">
                Le Véritable <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff3b30] via-[#f59e0b] to-[#ff3b30]">
                  Smash Burger
                </span> <br />
                À Sousse.
              </h1>

              <p className="text-base text-[#a1a1aa] leading-relaxed mb-6 max-w-xl mx-auto lg:mx-0">
                Découvrez nos 11 recettes artisanales : bœuf smashé minute sur acier brûlant à 240°C pour une croûte caramélisée incomparable, et suprême de poulet mariné pané ultra-croustillant.
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
                  <div className="font-display text-2xl text-white">{ALL_7_BURGERS.length} Burgers</div>
                  <div className="text-[10px] text-[#a1a1aa] uppercase font-semibold">Bœuf & Poulet</div>
                </div>
                <div>
                  <div className="font-display text-2xl text-[#f59e0b]">240°C</div>
                  <div className="text-[10px] text-[#a1a1aa] uppercase font-semibold">Croûte Maillard</div>
                </div>
                <div>
                  <div className="font-display text-2xl text-[#ff3b30]">7j / 7</div>
                  <div className="text-[10px] text-[#a1a1aa] uppercase font-semibold">12h - 01h Sousse</div>
                </div>
              </div>
            </div>

            {/* HERO RIGHT: 3D VIEWER (360 CONTINUOUS BY DEFAULT + 3D EXPLODED VIEW) */}
            <div className="lg:col-span-7 flex flex-col items-center">
              
              {/* 3D STAGE CARD (NO overflow-hidden TO PRESERVE 3D DEPTH) */}
              <div className="relative w-full max-w-[580px] rounded-3xl bg-gradient-to-b from-[#14141a]/95 to-[#0e0e12]/98 border border-white/10 p-3.5 sm:p-6 flex flex-col items-center justify-between shadow-2xl group">
                
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
                      <span>Anatomie 3D</span>
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
                      #{selectedBurgerIndex + 1} / {ALL_7_BURGERS.length}
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
                    isExploded ? (activeBurger?.id === "og-triple" || activeBurger?.id === "kids-chicken" ? "h-[385px] sm:h-[420px]" : "h-[360px] sm:h-[400px]") : "h-[320px] sm:h-[350px]"
                  }`}
                >


                  {/* 3D BURGER MODEL CONTAINER (HIGH-PERFORMANCE DIRECT DOM TRANSFORM) */}
                  <div
                    ref={modelRef}
                    style={{ background: "transparent", boxShadow: "none" }}
                    className={`burger-3d-model relative flex items-center justify-center cursor-pointer ${
                      !isExploded ? "spin-active" : ""
                    } ${
                      !isAutoRotating ? "spin-paused" : ""
                    } ${
                      isExploded ? (activeBurger?.id === "og-triple" || activeBurger?.id === "kids-chicken" ? "w-full max-w-[480px] h-[350px] sm:h-[380px]" : "w-full max-w-[480px] h-[330px] sm:h-[360px]") : "w-[280px] sm:w-[320px] h-[280px] sm:h-[320px]"
                    } ${
                      isExploded ? "exploded" : ""
                    }`}
                  >
                    {!isExploded ? (
                      /* MODE 1: CONTINUOUS 360 ROTATION OF THE ASSEMBLED BURGER */
                      <div className="w-full h-full relative flex items-center justify-center group/burger" style={{ background: "transparent", boxShadow: "none" }}>
                        <img
                          key={activeBurger.id}
                          src={activeBurger.image}
                          alt={activeBurger.name}
                          className="w-full h-full object-contain filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.85)] pointer-events-none transition-all duration-300 scale-105 animate-in fade-in zoom-in-95 duration-200"
                          style={{
                            background: "transparent",
                            boxShadow: "none",
                            ...(activeBurger.id === "kids-chicken" || activeBurger.name === "Kids Chicken" ? { transform: "rotate(10deg)" } : {})
                          }}
                        />
                      </div>
                    ) : (
                      /* MODE 2: TRUE 3D EXPLODED BURGER — 5 TRANSPARENT PNG LAYERS */
                      <div
                        className="w-full h-full flex items-center justify-center select-none"
                        onClick={(e) => e.stopPropagation()}
                        style={{ perspective: '1000px', perspectiveOrigin: '50% 45%' }}
                      >
                        {/* EXPLODED 3D STACK - WIDE CONTAINER WITHOUT OVERFLOW HIDDEN */}
                        <div
                          className="relative flex items-center justify-center"
                          style={{
                            width: '100%',
                            maxWidth: '480px',
                            height: '320px',
                            transformStyle: 'preserve-3d',
                          }}
                        >
                          {(activeBurger?.layers || DEFAULT_BURGER_LAYERS).map((layer, idx) => {
                            const total = (activeBurger?.layers || DEFAULT_BURGER_LAYERS).length;
                            const isActive = idx === activeLayerIndex;
                            /* Espacement vertical propre pour 5 couches sans collision */
                            const isNeedsExtraGap = activeBurger?.id === "og-triple" || activeBurger?.id === "kids-chicken";
                            const gapBoost = isNeedsExtraGap && idx <= 1 ? 22 : 0;
                            const baseY = (total - 1 - idx) * 52 + gapBoost;
                            const extraY = isActive ? -22 : 0;
                            const zDepth = (total - 1 - idx) * 10;
                            return (
                              <button
                                key={layer.num}
                                type="button"
                                onClick={(e) => { e.stopPropagation(); setActiveLayerIndex(idx); }}
                                title={layer.name}
                                className="absolute left-0 right-0 flex items-center justify-between cursor-pointer border-0 bg-transparent p-0"
                                style={{
                                  bottom: `${baseY + extraY}px`,
                                  transition: 'all 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                  transform: `translateZ(${zDepth}px)`,
                                  zIndex: isActive ? 30 : total - idx,
                                }}
                              >
                                {/* 5 TRANSPARENT PNG LAYERS (Responsive width, height: auto, NO background, NO overflow hidden) */}
                                <div
                                  className="w-[165px] min-[380px]:w-[190px] min-[440px]:w-[220px] sm:w-[260px] md:w-[280px] shrink-0 relative transition-transform duration-500"
                                  style={{
                                    transform: isActive ? 'scale(1.08)' : 'scale(1)',
                                  }}
                                >
                                  <img
                                    src={layer.image}
                                    alt={layer.name}
                                    draggable={false}
                                    className="w-full h-auto object-contain block pointer-events-none select-none"
                                    style={{
                                      filter: isActive
                                        ? 'drop-shadow(0 20px 30px rgba(0,0,0,0.8)) drop-shadow(0 0 20px rgba(255,59,48,0.85)) brightness(1.1)'
                                        : 'drop-shadow(0 15px 25px rgba(0,0,0,0.6))',
                                    }}
                                  />
                                </div>

                                {/* INGREDIENT LABEL — right side, responsive & never cut off */}
                                <div
                                  style={{
                                    transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                                    opacity: isActive ? 1 : 0.65,
                                    transform: isActive ? 'translateX(4px)' : 'translateX(0px)',
                                  }}
                                  className="flex flex-col items-start gap-0.5 sm:gap-1 pointer-events-none flex-1 min-w-0 pl-1.5 sm:pl-3.5 pr-0.5 sm:pr-2"
                                >
                                  <div className="flex items-center gap-1 sm:gap-1.5 w-full min-w-0">
                                    <span
                                      className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-1.5 sm:px-2 py-0.5 rounded-full shrink-0"
                                      style={{
                                        background: isActive ? '#ff3b30' : 'rgba(255,255,255,0.1)',
                                        color: '#ffffff',
                                        boxShadow: isActive ? '0 0 12px rgba(255,59,48,0.7)' : 'none',
                                      }}
                                    >
                                      #{layer.num}
                                    </span>
                                    <span
                                      className="text-[11px] sm:text-xs font-bold leading-tight truncate sm:whitespace-nowrap"
                                      style={{
                                        color: isActive ? '#ffffff' : '#a1a1aa',
                                        textShadow: isActive ? '0 0 10px rgba(255,59,48,0.6)' : 'none',
                                      }}
                                    >
                                      {layer.label}
                                    </span>
                                  </div>
                                  {isActive && (
                                    <span
                                      className="text-[9px] sm:text-[10px] font-semibold leading-tight text-[#f59e0b] px-1.5 py-0.5 rounded bg-black/70 border border-[#f59e0b]/30 shadow-md truncate max-w-[120px] sm:max-w-[180px]"
                                    >
                                      {layer.tag}
                                    </span>
                                  )}
                                </div>
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
                        <span className="text-[#a1a1aa] block text-[9px] uppercase font-bold">{activeBurger.category.toLowerCase().includes('chicken') ? 'Poulet' : 'Viande'}</span>
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
                    Les {ALL_7_BURGERS.length} Burgers Officiels du Menu (7 Bœuf + 4 Poulet)
                  </span>
                  <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-[#ff3b30]/20 text-[#ff3b30]">
                    {ALL_7_BURGERS.length} Burgers au total
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
                Nos 11 burgers artisanaux et nos tenders de poulet croustillants.
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
              const isTenders = item.category === "Crispy Chicken Tenders" || item.name.toLowerCase().includes("tenders");

              return (
                <div
                  key={item.id}
                  className="glass-panel rounded-2xl p-5 flex flex-col justify-between glass-panel-hover group relative overflow-hidden"
                >
                  {/* Top row */}
                  <div
                    className="flex items-start justify-between gap-3 mb-3 cursor-pointer"
                    onClick={() => {
                      openCustomizer(item.name, item.category, item.priceDt, item.image, item.id);
                    }}
                  >
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

                  {/* Image with dynamic burger image */}
                  {item.image ? (
                    <div
                      className="w-full h-44 my-2 flex items-center justify-center relative cursor-pointer"
                      onClick={() => {
                        openCustomizer(item.name, item.category, item.priceDt, item.image, item.id);
                      }}
                    >
                      <div className="absolute inset-0 bg-radial from-[#ff3b30]/10 to-transparent blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                      <img
                        src={item.image}
                        alt={item.name}
                        className="max-h-full max-w-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.7)] group-hover:scale-108 transition-transform duration-300 pointer-events-none"
                        style={item.id === "kids-chicken" || item.name === "Kids Chicken" ? { transform: "rotate(10deg)" } : undefined}
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
                            const bIdx = ALL_7_BURGERS.findIndex(b => b.id === item.id || b.name.toLowerCase() === item.name.toLowerCase());
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
                          onClick={() => openCustomizer(item.name, item.category, item.priceDt, item.image, item.id)}
                          className="flex-1 py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Sliders className="w-3.5 h-3.5 text-[#f59e0b]" />
                          <span>Personnaliser</span>
                        </button>
                        <button
                          onClick={() => addQuickItemToCart(item.name, item.category, item.priceDt, item.image)}
                          title="Ajouter direct au panier"
                          className="p-2.5 rounded-xl bg-[#ff3b30] hover:bg-[#e11d48] text-white transition-all shadow-md shadow-[#ff3b30]/20 cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => openCustomizer(item.name, item.category, item.priceDt, item.image, item.id)}
                          className="flex-1 py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Sliders className="w-3.5 h-3.5 text-[#f59e0b]" />
                          <span>Options & Sauces</span>
                        </button>
                        <button
                          onClick={() => addQuickItemToCart(item.name, item.category, item.priceDt, item.image)}
                          title="Ajouter direct au panier"
                          className="p-2.5 rounded-xl bg-[#ff3b30] hover:bg-[#e11d48] text-white transition-all shadow-md shadow-[#ff3b30]/20 cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </>
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
                      Ouvert 7 jours sur 7 en service continu : <strong className="text-white">12:00 — 01:00</strong>.
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
                  <span className="font-bold text-white">12:00 — 01:00</span>
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
          <div className="flex items-center gap-3.5">
            <img
              src="/logos/logo_3d_embleme_burger.png"
              alt="Beef & Buns Emblème 3D"
              className="w-12 h-12 sm:w-14 sm:h-14 object-contain bg-transparent animate-float-3d shrink-0"
              style={{
                background: "transparent",
                filter: "drop-shadow(0 10px 20px rgba(220, 38, 38, 0.35))",
              }}
            />
            <div className="flex flex-col justify-center">
              <img
                src="/logos/logo_3d_texte_beef_and_buns.png"
                alt="BEEF & BUNS"
                className="h-5 sm:h-6 w-auto object-contain bg-transparent block"
                style={{ background: "transparent" }}
              />
              <p className="text-[10px] text-[#71717a] mt-0.5 font-semibold uppercase tracking-wider">
                The Art of the Smash Burger • Sousse
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 font-semibold">
            <a href="#experience-3d" className="hover:text-white transition-colors">Nos Burgers 3D</a>
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

      {/* BURGER & TENDERS CUSTOMIZER MODAL */}
      {customizerItem && (() => {
        const isBurger = customizerItem.category === "Smash Burgers" || customizerItem.category === "Crispy Chicken";
        const isTenders = customizerItem.category === "Crispy Chicken Tenders" || customizerItem.name.toLowerCase().includes("tenders");

        const renderOptionItem = (extra: CustomExtra) => {
          const isChecked = selectedExtras.some(e => e.id === extra.id);
          return (
            <div
              key={extra.id}
              onClick={() => handleToggleExtra(extra)}
              className={`flex items-center justify-between p-2.5 sm:p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                isChecked
                  ? "bg-[#ff3b30]/15 border-[#ff3b30] text-white font-semibold shadow-sm shadow-[#ff3b30]/20"
                  : "bg-white/5 border-white/5 text-[#a1a1aa] hover:bg-white/10 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0 pr-2">
                <div
                  className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                    isChecked ? "bg-[#ff3b30] border-[#ff3b30]" : "border-white/20"
                  }`}
                >
                  {isChecked && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className="truncate">{extra.name}</span>
              </div>
              <span className="font-bold text-white shrink-0">+{extra.price.toFixed(1)} DT</span>
            </div>
          );
        };

        return (
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
                    style={customizerItem.id === "kids-chicken" || customizerItem.name === "Kids Chicken" ? { transform: "rotate(10deg)" } : undefined}
                  />
                )}
                <div>
                  <span className="flame-badge mb-1">
                    {isBurger ? "PERSONNALISATION BURGER" : "OPTIONS & SUPPLÉMENTS TENDERS"}
                  </span>
                  <h3 className="font-display text-2xl uppercase text-white">
                    {customizerItem.name}
                  </h3>
                  <p className="text-xs text-[#a1a1aa]">Prix de base : {customizerItem.basePrice.toFixed(1)} DT</p>
                </div>
              </div>

              {/* INGRÉDIENTS À RETIRER (OPTIONNEL - SUR MESURE POUR CE BURGER) */}
              {isBurger && (() => {
                const burgerRemovable = BURGER_REMOVABLE_INGREDIENTS[customizerItem.name] || 
                  (customizerItem.id ? BURGER_REMOVABLE_INGREDIENTS[customizerItem.id] : []) || [];
                if (burgerRemovable.length === 0) return null;

                return (
                  <div className="mb-6">
                    <label className="block text-xs font-bold uppercase tracking-wider text-white mb-1">
                      Ingrédients à retirer (Optionnel)
                    </label>
                    <p className="text-[11px] text-[#a1a1aa] mb-2.5">
                      Recette {customizerItem.name} — cochez pour préparer sans certains ingrédients :
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                      {burgerRemovable.map((ing) => {
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
                );
              })()}

              {/* 1. PORTION DE FRITES (BURGER ET TENDERS) */}
              <div className="mb-5">
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white mb-2">
                  <span>🍟</span>
                  <span>Portion de Frites (Option)</span>
                </label>
                <div className="space-y-1.5">
                  {AVAILABLE_EXTRAS.filter(e => e.group === "fries").map(renderOptionItem)}
                </div>
              </div>

              {/* 2. EXTRAS GARNITURE BURGER (BURGER UNIQUEMENT) */}
              {isBurger && (
                <div className="mb-5">
                  <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white mb-2">
                    <span>🧀🥓</span>
                    <span>Extras Garniture Burger</span>
                  </label>
                  <p className="text-[11px] text-[#a1a1aa] mb-2">
                    Ajoutez des tranches de viande smashée, bacon, pastrami, fromages ou légumes :
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                    {AVAILABLE_EXTRAS.filter(e => e.group === "garniture").map(renderOptionItem)}
                  </div>
                </div>
              )}

              {/* 3. SAUCES SIGNATURE & DIPS (BURGER ET TENDERS) */}
              <div className="mb-5">
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white mb-2">
                  <span>🥫</span>
                  <span>Sauces Signature & Dips</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-44 overflow-y-auto pr-1">
                  {AVAILABLE_EXTRAS.filter(e => e.group === "sauce").map(renderOptionItem)}
                </div>
              </div>

              {/* 4. BOISSONS FRAÎCHES (BURGER ET TENDERS) */}
              <div className="mb-6">
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white mb-2">
                  <span>🥤</span>
                  <span>Boissons Fraîches</span>
                </label>
                <div className="space-y-1.5">
                  {AVAILABLE_EXTRAS.filter(e => e.group === "drink").map(renderOptionItem)}
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
        );
      })()}

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
