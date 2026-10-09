import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Instagram,
  MapPin,
  Menu,
  MessageCircle,
  Minus,
  Phone,
  Plus,
  ShoppingBag,
  Star,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

const mapLink = "https://share.google/l2G73Ea4o4TdpSBVz";
const whatsappLink = "https://wa.me/21620217090?text=Bonjour%20Per%20Voi%2C%20je%20souhaite%20r%C3%A9server%20une%20table%20ou%20poser%20une%20question.";
const googleReviewLink = "https://www.google.com/search?q=per+voi+sousse+avis&oq=per+voi+sousse+avis&sourceid=chrome&ie=UTF-8#lrd=0x12fd8b00228081c7:0x86eae71c78023075,3,,,,";

type Language = "fr" | "en" | "it" | "ar";
const languages: Language[] = ["fr", "en", "it", "ar"];
const languageLabels: Record<Language, string> = { fr: "Français", en: "English", it: "Italiano", ar: "العربية" };
const languageCodes: Record<Language, string> = { fr: "FR", en: "EN", it: "IT", ar: "AR" };

const menuCopy: Record<Language, Record<string, string>> = {
  fr: {},
  en: {
    "Entrées": "Starters",
    "Pâtes": "Pasta",
    "Pizzas": "Pizzas",
    "Terre & mer": "Land & Sea",
    "Desserts": "Desserts",
    "Boissons": "Drinks",
    "Burrata crémeuse": "Creamy Burrata",
    "Carpaccio de Bœuf Truffé": "Truffled Beef Carpaccio",
    "Bruschetta Gourmande Saumon": "Gourmet Salmon Bruschetta",
    "Salade Caprese Di Bufala": "Bufala Caprese Salad",
    "Fritto Misto de la Mer": "Seafood Fritto Misto",
    "Rigatoni Effiloché de Bœuf": "Pulled Beef Rigatoni",
    "Rigatoni Poivrons Fumés et Crevettes": "Smoked Pepper & Shrimp Rigatoni",
    "Tagliatelles aux Fruits de Mer": "Seafood Tagliatelle",
    "Raviolis Ricotta & Épinards": "Ricotta & Spinach Ravioli",
    "Penne au Poulet et Champignons": "Chicken & Mushroom Penne",
    "Spaghetti Al Pomodoro & Burrata": "Spaghetti Al Pomodoro & Burrata",
    "Risotto aux Crevettes & Safran": "Shrimp & Saffron Risotto",
    "La Margherita": "Margherita Pizza",
    "Quattro Formaggi": "Four Cheese Pizza",
    "Pizza Diavola": "Diavola Pizza",
    "Pizza Per Voi Truffe": "Per Voi Truffle Pizza",
    "Pizza Frutti di Mare": "Frutti di Mare Pizza",
    "Pizza Végétarienne Grillée": "Grilled Veggie Pizza",
    "Filet de Bœuf au Poivre Vert": "Green Pepper Beef Tenderloin",
    "Daurade Royale Grillée": "Grilled Sea Bream",
    "Escalope Milanaise Croustillante": "Crispy Milanese Veal Escalope",
    "Saumon Poêlé aux Agrumes": "Pan-Seared Citrus Salmon",
    "Tiramisu Classico": "Classic Tiramisu",
    "Panna Cotta Vanille & Fruits Rouges": "Vanilla & Red Berry Panna Cotta",
    "Pizza Nutella & Pistaches": "Nutella & Pistachio Pizza",
    "Fondant au Chocolat Coeur Coulant": "Molten Chocolate Lava Cake",
    "Mocktail Signature Per Voi": "Signature Per Voi Mocktail",
    "Mojito Frais Maison": "Fresh Homemade Mojito",
    "Limonade Artisanale Menthe": "Craft Mint Lemonade",
    "Espresso Italien": "Italian Espresso",
    "Eau Minérale / Gazeuse 1L": "Mineral / Sparkling Water 1L",
    "Marmelade de tomates, pickles de gingembre, crème citronnée et basilic frais.": "Tomato marmalade, ginger pickles, lemon cream and fresh basil.",
    "Fines tranches de filet de bœuf, copeaux de grana padano, roquette et huile de truffe.": "Thin slices of beef tenderloin, grana padano shavings, rocket and truffle oil.",
    "Pain de campagne grillé, saumon gravlax, ricotta aux herbes et câpres croquantes.": "Toasted sourdough bread, gravlax salmon, herb ricotta and crispy capers.",
    "Tomates savoureuses, mozzarella di bufala, réduction balsamique et basilic.": "Heirloom tomatoes, mozzarella di bufala, balsamic reduction and fresh basil.",
    "Calamars, crevettes et seiches croustillants, mayonnaise citronnée maison.": "Crispy calamari, shrimp and cuttlefish with homemade lemon mayonnaise.",
    "Sauce tomates mijotée, tomates séchées, bœuf fondant et crème de parmesan.": "Slow-simmered tomato sauce, sun-dried tomatoes, tender pulled beef and parmesan cream.",
    "Crevettes sautées, crème de poivrons fumés, miel, noisettes et figues séchées.": "Sautéed shrimp, smoked pepper cream, honey, roasted hazelnuts and dried figs.",
    "Crevettes, moules, seiches, bisque maison, tomates cerises et persil plat.": "Shrimp, mussels, cuttlefish, homemade bisque, cherry tomatoes and flat parsley.",
    "Pâtes fraîches maison farcies, beurre de sauge parfumé et crème de parmesan.": "Fresh homemade stuffed pasta, fragrant sage butter and parmesan cream.",
    "Émincé de poulet fermier, champignons de Paris, crème fraîche et parmesan.": "Sliced farm chicken, button mushrooms, fresh cream and parmesan.",
    "Sauce tomate napolitaine au basilic frais, couronnée d'une burrata entière.": "Neapolitan tomato sauce with fresh basil, crowned with a whole creamy burrata.",
    "Riz carnaroli crémeux, bouillon de crustacés, crevettes fraîches et parmesan.": "Creamy carnaroli risotto, shellfish broth, fresh shrimp and aged parmesan.",
    "Sauce tomate italienne, mozzarella fior di latte, grana padano et basilic frais.": "Italian tomato sauce, mozzarella fior di latte, grana padano and fresh basil.",
    "Mozzarella, gorgonzola, grana padano, ricotta crémeuse et touche de miel.": "Mozzarella, gorgonzola, grana padano, creamy ricotta and a touch of honey.",
    "Sauce tomate, mozzarella fior di latte, salami piquant italien et piments doux.": "Tomato sauce, mozzarella fior di latte, spicy Italian salami and sweet peppers.",
    "Crème de truffe blanche, mozzarella, champignons sautés, parmesan et roquette.": "White truffle cream, mozzarella, sautéed mushrooms, parmesan and fresh rocket.",
    "Sauce tomate, mozzarella, fruits de mer frais de Sousse, ail confit et persil.": "Tomato sauce, mozzarella, fresh Sousse seafood, confit garlic and parsley.",
    "Courgettes, aubergines marinées, poivrons rôtis, mozzarella et origan.": "Zucchini, marinated eggplants, roasted peppers, mozzarella and wild oregano.",
    "Filet de bœuf tendre, sauce au poivre vert et crème, légumes sautés du jour.": "Tender beef tenderloin, green peppercorn cream sauce and sautéed daily vegetables.",
    "Filet de daurade fraîche, écrasé de pommes de terre à l'huile d'olive et caviar d'aubergines.": "Fresh sea bream fillet, olive oil crushed potatoes and smoked eggplant caviar.",
    "Escalope de veau panée dorée au beurre clarifié, servie avec spaghettis al pomodoro.": "Crispy golden breaded veal escalope in clarified butter, served with spaghetti al pomodoro.",
    "Pavé de saumon croustillant, réduction d'agrumes, fenouil croquant et riz safrané.": "Crispy salmon steak, citrus reduction, crunchy fennel and saffron rice.",
    "Café espresso italien, mascarpone onctueux, biscuits savoiardi et pur cacao amer.": "Italian espresso, velvety mascarpone, savoiardi ladyfingers and pure dark cocoa.",
    "Crème cuite à la vanille bourbon de Madagascar, coulis acidulé de framboises.": "Madagascar bourbon vanilla panna cotta, tangy raspberry coulis.",
    "Pâte fine et croustillante au four, Nutella fondant et éclats de pistaches grillées.": "Thin crispy oven-baked dough, melted Nutella and toasted roasted pistachios.",
    "Chocolat noir 70%, cœur coulant intense, servi avec glace vanille.": "70% dark chocolate lava cake with warm molten center, served with vanilla gelato.",
    "Jus d'agrumes frais de Tunisie, menthe pilée, purée de passion et eau pétillante.": "Fresh Tunisian citrus juice, crushed mint, passion fruit puree and sparkling soda.",
    "Citron vert pressé, feuilles de menthe fraîche, sucre de canne et soda.": "Freshly squeezed lime, fresh mint leaves, cane sugar and sparkling soda.",
    "Citrons frais pressés minute, sirop de menthe maison et glace pilée.": "Freshly squeezed lemons, artisanal mint syrup and crushed ice.",
    "Sélection de café italien torréfié artisanalement.": "Selection of artisan roasted Italian coffee.",
    "Bouteille en verre servie bien fraîche.": "Glass bottle served chilled."
  },
  it: {
    "Entrées": "Antipasti",
    "Pâtes": "Primi Piatti",
    "Pizzas": "Pizze",
    "Terre & mer": "Secondi Piatti",
    "Desserts": "Dolci",
    "Boissons": "Bevande",
    "Burrata crémeuse": "Burrata cremosa",
    "Carpaccio de Bœuf Truffé": "Carpaccio di Manzo al Tartufo",
    "Bruschetta Gourmande Saumon": "Bruschetta Gourmet al Salmone",
    "Salade Caprese Di Bufala": "Insalata Caprese di Bufala",
    "Fritto Misto de la Mer": "Fritto Misto di Mare",
    "Rigatoni Effiloché de Bœuf": "Rigatoni con Manzo Sfilacciato",
    "Rigatoni Poivrons Fumés et Crevettes": "Rigatoni Peperoni Affumicati e Gamberi",
    "Tagliatelles aux Fruits de Mer": "Tagliatelle ai Frutti di Mare",
    "Raviolis Ricotta & Épinards": "Ravioli Ricotta e Spinaci",
    "Penne au Poulet et Champignons": "Penne Pollo e Funghi",
    "Spaghetti Al Pomodoro & Burrata": "Spaghetti al Pomodoro e Burrata",
    "Risotto aux Crevettes & Safran": "Risotto Gamberi e Zafferano",
    "La Margherita": "Pizza Margherita",
    "Quattro Formaggi": "Pizza Quattro Formaggi",
    "Pizza Diavola": "Pizza Diavola",
    "Pizza Per Voi Truffe": "Pizza Per Voi al Tartufo",
    "Pizza Frutti di Mare": "Pizza Frutti di Mare",
    "Pizza Végétarienne Grillée": "Pizza Vegetariana",
    "Filet de Bœuf au Poivre Vert": "Filetto di Manzo al Pepe Verde",
    "Daurade Royale Grillée": "Orata Reale alla Griglia",
    "Escalope Milanaise Croustillante": "Cotoletta alla Milanese",
    "Saumon Poêlé aux Agrumes": "Salmone Scottato agli Agrumi",
    "Tiramisu Classico": "Tiramisù Classico",
    "Panna Cotta Vanille & Fruits Rouges": "Panna Cotta ai Frutti di Bosco",
    "Pizza Nutella & Pistaches": "Pizza Nutella e Pistacchi",
    "Fondant au Chocolat Coeur Coulant": "Tortino al Cioccolato Cuore Caldo",
    "Mocktail Signature Per Voi": "Mocktail Signature Per Voi",
    "Mojito Frais Maison": "Mojito Fresco della Casa",
    "Limonade Artisanale Menthe": "Limonata Artigianale alla Menta",
    "Espresso Italien": "Caffè Espresso Italiano",
    "Eau Minérale / Gazeuse 1L": "Acqua Minerale / Frizzante 1L",
    "Marmelade de tomates, pickles de gingembre, crème citronnée et basilic frais.": "Marmellata di pomodoro, pickles di zenzero, crema al limone e basilico fresco.",
    "Fines tranches de filet de bœuf, copeaux de grana padano, roquette et huile de truffe.": "Sottili fette di filetto di manzo, scaglie di grana padano, rucola e olio al tartufo.",
    "Pain de campagne grillé, saumon gravlax, ricotta aux herbes et câpres croquantes.": "Pane casereccio tostato, salmone gravlax, ricotta alle erbe e capperi croccanti.",
    "Tomates savoureuses, mozzarella di bufala, réduction balsamique et basilic.": "Pomodori saporiti, mozzarella di bufala, riduzione balsamica e basilico fresco.",
    "Calamars, crevettes et seiches croustillants, mayonnaise citronnée maison.": "Calamari, gamberi e seppie croccanti con maionese fatta in casa al limone.",
    "Sauce tomates mijotée, tomates séchées, bœuf fondant et crème de parmesan.": "Salsa di pomodoro cotta a fuoco lento, pomodori secchi, manzo tenero e crema di parmigiano.",
    "Crevettes sautées, crème de poivrons fumés, miel, noisettes et figues séchées.": "Gamberi saltati, crema di peperoni affumicati, miele, nocciole tostate e fichi secchi.",
    "Crevettes, moules, seiches, bisque maison, tomates cerises et persil plat.": "Gamberi, cozze, seppie, bisque della casa, pomodorini e prezzemolo fresco.",
    "Pâtes fraîches maison farcies, beurre de sauge parfumé et crème de parmesan.": "Pasta fresca fatta in casa ripiena, burro alla salvia profumato e crema di parmigiano.",
    "Émincé de poulet fermier, champignons de Paris, crème fraîche et parmesan.": "Straccetti di pollo ruspante, funghi champignon, panna fresca e parmigiano.",
    "Sauce tomate napolitaine au basilic frais, couronnée d'une burrata entière.": "Salsa di pomodoro napoletana con basilico fresco, coronata da una burrata intera.",
    "Riz carnaroli crémeux, bouillon de crustacés, crevettes fraîches et parmesan.": "Riso carnaroli mantecato, brodo di crostacei, gamberi freschi e parmigiano.",
    "Sauce tomate italienne, mozzarella fior di latte, grana padano et basilic frais.": "Salsa di pomodoro italiana, mozzarella fior di latte, grana padano e basilico fresco.",
    "Mozzarella, gorgonzola, grana padano, ricotta crémeuse et touche de miel.": "Mozzarella, gorgonzola, grana padano, ricotta cremosa e un tocco di miele.",
    "Sauce tomate, mozzarella fior di latte, salami piquant italien et piments doux.": "Salsa di pomodoro, mozzarella fior di latte, salame piccante italiano e peperoncini dolci.",
    "Crème de truffe blanche, mozzarella, champignons sautés, parmesan et roquette.": "Crema di tartufo bianco, mozzarella, funghi saltati, parmigiano e rucola fresca.",
    "Sauce tomate, mozzarella, fruits de mer frais de Sousse, ail confit et persil.": "Salsa di pomodoro, mozzarella, frutti di mare freschi di Sousse, aglio confit e prezzemolo.",
    "Courgettes, aubergines marinées, poivrons rôtis, mozzarella et origan.": "Zucchine, melanzane marinate, peperoni arrostiti, mozzarella e origano selvatico.",
    "Filet de bœuf tendre, sauce au poivre vert et crème, légumes sautés du jour.": "Filetto di manzo tenero, salsa al pepe verde e panna, verdure saltate del giorno.",
    "Filet de daurade fraîche, écrasé de pommes de terre à l'huile d'olive et caviar d'aubergines.": "Filetto di orata fresca, purea rustica di patate all'olio d'oliva e caviale di melanzane.",
    "Escalope de veau panée dorée au beurre clarifié, servie avec spaghettis al pomodoro.": "Cotoletta di vitello dorata al burro chiarificato, servita con spaghetti al pomodoro.",
    "Pavé de saumon croustillant, réduction d'agrumes, fenouil croquant et riz safrané.": "Trancio di salmone croccante, riduzione agli agrumi, finocchio fresco e riso allo zafferano.",
    "Café espresso italien, mascarpone onctueux, biscuits savoiardi et pur cacao amer.": "Caffè espresso italiano, crema al mascarpone, biscotti savoiardi e cacao amaro puro.",
    "Crème cuite à la vanille bourbon de Madagascar, coulis acidulé de framboises.": "Panna cotta alla vaniglia bourbon del Madagascar, coulis ai lamponi freschi.",
    "Pâte fine et croustillante au four, Nutella fondant et éclats de pistaches grillées.": "Pasta sottile e croccante al forno, Nutella calda e granella di pistacchi tostati.",
    "Chocolat noir 70%, cœur coulant intense, servi avec glace vanille.": "Tortino al cioccolato fondente 70% con cuore caldo fuso, servito con gelato alla vaniglia.",
    "Jus d'agrumes frais de Tunisie, menthe pilée, purée de passion et eau pétillante.": "Spremuta di agrumi freschi di Tunisia, menta pestata, purea di frutto della passione e soda.",
    "Citron vert pressé, feuilles de menthe fraîche, sucre de canne et soda.": "Lime fresco spremuto, foglie di menta fresca, zucchero di canna e soda.",
    "Citrons frais pressés minute, sirop de menthe maison et glace pilée.": "Limoni freschi spremuti al momento, sciroppo di menta artigianale e ghiaccio tritato.",
    "Sélection de café italien torréfié artisanalement.": "Selezione di caffè italiano tostato artigianalmente.",
    "Bouteille en verre servie bien fraîche.": "Bottiglia di vetro servita freschissima."
  },
  ar: {
    // Categories
    "Entrées": "المقبلات",
    "Pâtes": "المعكرونة",
    "Pizzas": "البيتزا",
    "Terre & mer": "اللحوم والأسماك",
    "Desserts": "الحلويات",
    "Boissons": "المشروبات",
    "Burrata crémeuse": "بوراتا كريمية",
    "Carpaccio de Bœuf Truffé": "كارباتشيو لحم بالكمأة",
    "Bruschetta Gourmande Saumon": "بروسكيتا بالسلمون الفاخر",
    "Salade Caprese Di Bufala": "سلطة كابريزي بجبن البوفالا",
    "Fritto Misto de la Mer": "فواكه بحر مقلية ومقرمشة",
    "Rigatoni Effiloché de Bœuf": "ريغاتوني بلحم البقر المفتت",
    "Rigatoni Poivrons Fumés et Crevettes": "ريغاتوني بالفلفل المدخن والجمبري",
    "Tagliatelles aux Fruits de Mer": "تالياتيلي بفواكه البحر",
    "Raviolis Ricotta & Épinards": "رافيولي الريكوتا والسبانخ",
    "Penne au Poulet et Champignons": "بيني بالدجاج والفطر",
    "Spaghetti Al Pomodoro & Burrata": "سباغيتي بصلصة الطماطم والبوراتا",
    "Risotto aux Crevettes & Safran": "ريزوتو بالجمبري والزعفران",
    "La Margherita": "بيتزا مارغريتا",
    "Quattro Formaggi": "بيتزا أربعة أجبان",
    "Pizza Diavola": "بيتزا ديافولا حارة",
    "Pizza Per Voi Truffe": "بيتزا بير فوي بالكمأة",
    "Pizza Frutti di Mare": "بيتزا فواكه البحر",
    "Pizza Végétarienne Grillée": "بيتزا خضار مشوية",
    "Filet de Bœuf au Poivre Vert": "فيليه لحم بقر بالفلفل الأخضر",
    "Daurade Royale Grillée": "سمك وراطة ملكية مشوية",
    "Escalope Milanaise Croustillante": "إسكالوب ميلانيز مقرمش",
    "Saumon Poêlé aux Agrumes": "سلمون مشوح بالحمضيات",
    "Tiramisu Classico": "تيراميسو كلاسيكي",
    "Panna Cotta Vanille & Fruits Rouges": "بانا كوتا بالفانيليا والفواكه الحمراء",
    "Pizza Nutella & Pistaches": "بيتزا النوتيلا والفستق",
    "Fondant au Chocolat Coeur Coulant": "فوندان الشوكولاتة الذائبة",
    "Mocktail Signature Per Voi": "موكتيل بير فوي الخاص",
    "Mojito Frais Maison": "موهيتو طازج محضر في المطعم",
    "Limonade Artisanale Menthe": "عصير ليمون بالنعناع طبيعي",
    "Espresso Italien": "إسبريسو إيطالي",
    "Eau Minérale / Gazeuse 1L": "مياه معدنية / غازية 1 لتر",
    "Marmelade de tomates, pickles de gingembre, crème citronnée et basilic frais.": "مربى الطماطم، مخلل الزنجبيل، كريمة الليمون والريحان الطازج.",
    "Fines tranches de filet de bœuf, copeaux de grana padano, roquette et huile de truffe.": "شرائح رقيقة من فيليه البقر، رقائق جبن غرانا بادانو، جرجير وزيت الكمأة.",
    "Pain de campagne grillé, saumon gravlax, ricotta aux herbes et câpres croquantes.": "خبز ريفي محمص، سلمون جرافلاكس، ريكوتا بالأعشاب وقبار مقرمش.",
    "Tomates savoureuses, mozzarella di bufala, réduction balsamique et basilic.": "طماطم طازجة، جبن موزاريلا بوفالا، خل بلسمي وريحان طازج.",
    "Calamars, crevettes et seiches croustillants, mayonnaise citronnée maison.": "كالاماري وجمبري وسبيط مقرمش مع مايونيز بالليمون محضر في المطعم.",
    "Sauce tomates mijotée, tomates séchées, bœuf fondant et crème de parmesan.": "صلصة طماطم مطهوة بهدوء، طماطم مجففة، لحم بقر طري وكريمة البارميزان.",
    "Crevettes sautées, crème de poivrons fumés, miel, noisettes et figues séchées.": "جمبري مشوح، كريمة الفلفل المدخن، عسل، بندق محمص وتين مجفف.",
    "Crevettes, moules, seiches, bisque maison, tomates cerises et persil plat.": "جمبري، بلح البحر، سبيط، حساء البحر الخاص، طماطم كرزية وبقدونس.",
    "Pâtes fraîches maison farcies, beurre de sauge parfumé et crème de parmesan.": "معكرونة طازجة محشوة، زبدة الميرمية العطرة وكريمة البارميزان.",
    "Émincé de poulet fermier, champignons de Paris, crème fraîche et parmesan.": "شرائح دجاج طازج، فطر باريسي، كريمة طازجة وجبن بارميزان.",
    "Sauce tomate napolitaine au basilic frais, couronnée d'une burrata entière.": "صلصة طماطم نابولية بالريحان الطازج مع قطعة بوراتا كاملة وكريمية.",
    "Riz carnaroli crémeux, bouillon de crustacés, crevettes fraîches et parmesan.": "أرز كارنارولي كريمي، مرق ثمار البحر، جمبري طازج وجبن بارميزان.",
    "Sauce tomate italienne, mozzarella fior di latte, grana padano et basilic frais.": "صلصة طماطم إيطالية، موزاريلا فيور دي لاتي، غرانا بادانو وريحان طازج.",
    "Mozzarella, gorgonzola, grana padano, ricotta crémeuse et touche de miel.": "موزاريلا، جورجونزولا، غرانا بادانو، ريكوتا ولمسة عسل طبيعي.",
    "Sauce tomate, mozzarella fior di latte, salami piquant italien et piments doux.": "صلصة طماطم، موزاريلا، سلامي إيطالي حار وفلفل حلو.",
    "Crème de truffe blanche, mozzarella, champignons sautés, parmesan et roquette.": "كريمة الكمأة البيضاء، موزاريلا، فطر مشوح، بارميزان وجرجير طازج.",
    "Sauce tomate, mozzarella, fruits de mer frais de Sousse, ail confit et persil.": "صلصة طماطم، موزاريلا، فواكه بحر طازجة من سوسة، ثوم وبقدونس.",
    "Courgettes, aubergines marinées, poivrons rôtis, mozzarella et origan.": "كوسة، باذنجان متبل، فلفل مشوي، موزاريلا وزعتر بري.",
    "Filet de bœuf tendre, sauce au poivre vert et crème, légumes sautés du jour.": "فيليه بقر طري جداً، صلصة الفلفل الأخضر والكريمة، مع خضار اليوم المشوحة.",
    "Filet de daurade fraîche, écrasé de pommes de terre à l'huile d'olive et caviar d'aubergines.": "فيليه سمك وراطة طازج، بطاطا مهروسة بزيت الزيتون وكافيار الباذنجان.",
    "Escalope de veau panée dorée au beurre clarifié, servie avec spaghettis al pomodoro.": "إسكالوب عجل مقرمش ومحمر بالزبدة، يُقدم مع سباغيتي بصلصة الطماطم.",
    "Pavé de saumon croustillant, réduction d'agrumes, fenouil croquant et riz safrané.": "شريحة سلمون مقرمشة، صلصة الحمضيات، شمر طازج وأرز بالزعفران.",
    "Café espresso italien, mascarpone onctueux, biscuits savoiardi et pur cacao amer.": "قهوة إسبريسو إيطالية، ماسكاربوني كريمي، بسكويت سافوياردي وكاكاو نقي.",
    "Crème cuite à la vanille bourbon de Madagascar, coulis acidulé de framboises.": "بانا كوتا بالفانيليا الطبيعية، مع صلصة توت العليق الطازجة.",
    "Pâte fine et croustillante au four, Nutella fondant et éclats de pistaches grillées.": "عجينة رقيقة ومقرمشة من الفرن، نوتيلا ذائبة وفستق حلبي محمص.",
    "Chocolat noir 70%, cœur coulant intense, servi avec glace vanille.": "فوندان شوكولاتة داكنة 70% بقلب سائل دافئ، يُقدم مع آيس كريم فانيليا.",
    "Jus d'agrumes frais de Tunisie, menthe pilée, purée de passion et eau pétillante.": "عصير حمضيات تونسية طازجة، نعناع مفروم، باشن فروت ومياه فوارة.",
    "Citron vert pressé, feuilles de menthe fraîche, sucre de canne et soda.": "ليمون أخضر طازج، أوراق نعناع، سكر القصب وصودا.",
    "Citrons frais pressés minute, sirop de menthe maison et glace pilée.": "عصير ليمون طازج معصور مباشرة، شراب نعناع محلي وثلج مجروش.",
    "Sélection de café italien torréfié artisanalement.": "تشكيلة قهوة إيطالية محمصة يدوياً بجودة عالية.",
    "Bouteille en verre servie bien fraîche.": "قارورة زجاجية تُقدم باردة ومنعشة."
  }
};
const menuTokenCopy: Record<Exclude<Language, "fr">, Record<string, string>> = {
  en: { "Selon stock :": "Subject to availability: ", "sauce tomates": "tomato sauce", "sauce tomate": "tomato sauce", "crème": "cream", "tomates séchées": "sun-dried tomatoes", "huile d’olives": "olive oil", "basilic frais": "fresh basil", "basilic": "basil", "persil": "parsley", "crevettes": "shrimp", "poulpes": "octopus", "moules": "mussels", "seiches": "cuttlefish", "bœuf": "beef", "poulet": "chicken", "saumon": "salmon", "champignons de Paris": "button mushrooms", "champignons": "mushrooms", "mozzarella": "mozzarella", "parmesan": "parmesan", "grana padano": "grana padano", "miel": "honey", "noisettes": "hazelnuts", "figues séchées": "dried figs", "citron": "lemon", "orange": "orange", "courgettes": "zucchini", "poivrons": "peppers", "oignons": "onions", "ail confit": "confit garlic", "huile de truffes": "truffle oil", "truffes": "truffle", "pistaches": "pistachios", "roquette": "rocket", "olives": "olives", "frites": "fries", "pâtes": "pasta", "pommes de terre": "potatoes", "épinard": "spinach", "épinards": "spinach", "risotto": "risotto", "jus de bœuf": "beef jus", "pâte fraîche": "fresh pasta", "pâte": "dough", "houmous": "hummus", "tahina": "tahini", "jus de citron": "lemon juice", "fleur de sel": "sea salt", "caramel au lait": "milk caramel", "fruits secs concassés": "crushed nuts", "café": "coffee", "mascarpone": "mascarpone", "poudre de cacao": "cocoa powder", "pain brioché": "brioche bread", "framboises": "raspberries", "menthe": "mint", "chocolat": "chocolate", "œuf": "egg", "salade": "salad", "fromage": "cheese", "croûtons": "croutons", "anchois": "anchovies", "betterave": "beetroot", "melon": "melon", "saumon gravlax": "gravlax salmon", "filet": "fillet", "mille-feuille": "layered", "gingembre": "ginger", "légumes sautés": "sautéed vegetables", "daurade": "sea bream", "caviar d’aubergines": "eggplant caviar", "aubergines": "eggplant", "algue croustillante": "crispy seaweed", "bisque de crevettes": "shrimp bisque", "ricotta": "ricotta", "noix": "walnuts" },
  it: { "Selon stock :": "Secondo disponibilità: ", "sauce tomates": "salsa di pomodoro", "sauce tomate": "salsa di pomodoro", "crème": "crema", "tomates séchées": "pomodori secchi", "huile d’olives": "olio d’oliva", "basilic frais": "basilico fresco", "basilic": "basilico", "persil": "prezzemolo", "crevettes": "gamberi", "poulpes": "polpo", "moules": "cozze", "seiches": "seppie", "bœuf": "manzo", "poulet": "pollo", "saumon": "salmone", "champignons de Paris": "funghi champignon", "champignons": "funghi", "miel": "miele", "noisettes": "nocciole", "figues séchées": "fichi secchi", "citron": "limone", "orange": "arancia", "courgettes": "zucchine", "poivrons": "peperoni", "oignons": "cipolle", "ail confit": "aglio confit", "huile de truffes": "olio al tartufo", "truffes": "tartufo", "pistaches": "pistacchi", "roquette": "rucola", "olives": "olive", "frites": "patatine", "pâtes": "pasta", "pommes de terre": "patate", "épinard": "spinaci", "épinards": "spinaci", "risotto": "risotto", "jus de bœuf": "fondo di manzo", "pâte fraîche": "pasta fresca", "houmous": "hummus", "tahina": "tahina", "jus de citron": "succo di limone", "fleur de sel": "fior di sale", "caramel au lait": "caramello al latte", "fruits secs concassés": "frutta secca tritata", "café": "caffè", "mascarpone": "mascarpone", "poudre de cacao": "cacao in polvere", "pain brioché": "pane brioche", "framboises": "lamponi", "menthe": "menta", "chocolat": "cioccolato", "œuf": "uovo", "salade": "insalata", "fromage": "formaggio", "croûtons": "crostini", "anchois": "acciughe", "betterave": "barbabietola", "melon": "melone", "saumon gravlax": "salmone gravlax", "filet": "filetto", "gingembre": "zenzero", "légumes sautés": "verdure saltate", "daurade": "orata", "caviar d’aubergines": "caviale di melanzane", "aubergines": "melanzane", "algue croustillante": "alga croccante", "bisque de crevettes": "bisque di gamberi", "ricotta": "ricotta", "noix": "noci" },
  ar: { "Selon stock :": "حسب التوفر: ", "sauce tomates": "صلصة الطماطم", "sauce tomate": "صلصة الطماطم", "crème": "كريمة", "tomates séchées": "طماطم مجففة", "huile d’olives": "زيت الزيتون", "basilic frais": "ريحان طازج", "basilic": "ريحان", "persil": "بقدونس", "crevettes": "جمبري", "poulpes": "أخطبوط", "moules": "بلح البحر", "seiches": "حبار", "bœuf": "لحم بقر", "poulet": "دجاج", "saumon": "سلمون", "champignons de Paris": "فطر", "champignons": "فطر", "miel": "عسل", "noisettes": "بندق", "figues séchées": "تين مجفف", "citron": "ليمون", "orange": "برتقال", "courgettes": "كوسة", "poivrons": "فلفل", "oignons": "بصل", "ail confit": "ثوم مطهو", "huile de truffes": "زيت الكمأة", "truffes": "كمأة", "pistaches": "فستق", "roquette": "جرجير", "olives": "زيتون", "frites": "بطاطا مقلية", "pâtes": "معكرونة", "pommes de terre": "بطاطا", "épinard": "سبانخ", "épinards": "سبانخ", "risotto": "ريزوتو", "jus de bœuf": "صلصة لحم البقر", "pâte fraîche": "عجينة طازجة", "houmous": "حمص", "tahina": "طحينة", "jus de citron": "عصير الليمون", "fleur de sel": "ملح البحر", "caramel au lait": "كراميل الحليب", "fruits secs concassés": "مكسرات مجروشة", "café": "قهوة", "mascarpone": "ماسكاربوني", "poudre de cacao": "مسحوق الكاكاو", "pain brioché": "خبز بريوش", "framboises": "توت العليق", "menthe": "نعناع", "chocolat": "شوكولاتة", "œuf": "بيض", "salade": "سلطة", "fromage": "جبن", "croûtons": "خبز محمص", "anchois": "أنشوفة", "betterave": "شمندر", "melon": "شمام", "saumon gravlax": "سلمون جرافلاكس", "filet": "فيليه", "gingembre": "زنجبيل", "légumes sautés": "خضروات مشوحة", "daurade": "دنيس", "caviar d’aubergines": "كافيار الباذنجان", "aubergines": "باذنجان", "algue croustillante": "أعشاب بحرية مقرمشة", "bisque de crevettes": "حساء الجمبري", "ricotta": "ريكوتا", "noix": "جوز" }
};
const translateMenuText = (language: Language, text: string | null | undefined) => {
  if (!text) return "";
  if (language === "fr") return text;
  const exact = menuCopy[language]?.[text];
  if (exact) return exact;
  const translated = Object.entries(menuTokenCopy[language]).sort((a, b) => b[0].length - a[0].length).reduce((value, [from, to]) => value.replaceAll(from, to), text);
  if (language === "en") return translated.replaceAll(" et ", " and ").replaceAll(" de ", " of ").replaceAll(" aux ", " with ").replaceAll(" au ", " with ").replaceAll(" à ", " with ").replaceAll(" fumés", " smoked").replaceAll(" Poivrons", " Peppers").replaceAll(" Crevettes", " Shrimp").replaceAll(" Poulpes", " Octopus").replaceAll(" Fruits de Mer", " Seafood").replaceAll(" Poulet", " Chicken").replaceAll(" Bœuf", " Beef").replaceAll(" Saumon", " Salmon");
  if (language === "it") return translated.replaceAll(" et ", " e ").replaceAll(" de ", " di ").replaceAll(" aux ", " con ").replaceAll(" au ", " con ").replaceAll(" à ", " con ");
  return translated.replaceAll(" et ", " و ").replaceAll(" de ", " من ").replaceAll(" aux ", " مع ").replaceAll(" au ", " مع ").replaceAll(" à ", " مع ");
};

const translations: Record<Language, Record<string, string>> = {
  fr: {
    locationCity: "Sousse · 4054",
    reviewsCount: "· 286 avis",
    perPerson: "par personne",
    house: "La maison",
    menu: "La carte",
    gallery: "Galerie",
    reviews: "Avis",
    find: "Nous trouver",
    reserve: "Réserver",
    reserveTable: "Réserver une table",
    discover: "Découvrir la carte",
    story: "Notre histoire",
    scroll: "Faites défiler",
    restaurant: "Restaurant italien à Sousse",
    cuisine: "Cucina italiana, cuore mediterraneo",
    houseTitle: "Une table italienne avec une âme tunisienne.",
    menuTitle: "À choisir, à savourer.",
    completeMenu: "La carte complète",
    menuFor: "Tous les plats et prix du menu Per Voi.",
    galleryTitle: "Le goût du détail.",
    reviewTitle: "Ils parlent de Per Voi.",
    leaveReview: "Laisser un avis Google",
    reviewHint: "Votre avis s’ouvre directement dans Google.",
    bookIntro: "Votre table vous attend.",
    bookText: "Choisissez un jour et un créneau disponibles.",
    findUs: "À presto, à Sousse.",
    add: "Ajouter",
    officialMenu: "Menu Per Voi",
    maps: "Ouvrir dans Maps",
    call: "Nous appeler",
    host: "Espace hôte",
    whatsapp: "Réserver sur WhatsApp",
    sending: "Envoi…",
    thanks: "Grazie mille.",
    unit: "/ unité",
    addedToast: "ajouté au panier",
    addedToastDesc: "Votre panier est prêt à être commandé.",
    resToastSuccess: "Votre demande est bien envoyée",
    resToastSuccessDesc: "Per Voi vous recontactera pour confirmer votre table.",
    resToastError: "Réservation impossible",
    orderToastSuccess: "Commande reçue",
    orderToastSuccessDesc: "Per Voi va vous contacter pour confirmer la commande.",
    orderToastError: "Commande impossible",
    takeawayHeader: "Per Voi à emporter",
    namePlaceholder: "Ex. Amira Ben Ali",
    emailPlaceholder: "vous@exemple.com",
    notePlaceholder: "Anniversaire, chaise bébé…",
    addressPlaceholder: "Adresse de livraison",
    addressDefault: "Sahloul, Sousse",
    kitchenNotePlaceholder: "Précision pour la cuisine",
    itemWord: "article",
    itemsWord: "articles",
    closedMonday: "Fermé le lundi",
    sahloulSousse: "Sahloul · Sousse",
    copyright: "© 2026 Per Voi · Sousse"
  },
  en: {
    locationCity: "Sousse · 4054",
    reviewsCount: "· 286 reviews",
    perPerson: "per person",
    house: "The house",
    menu: "The menu",
    gallery: "Gallery",
    reviews: "Reviews",
    find: "Find us",
    reserve: "Book",
    reserveTable: "Book a table",
    discover: "Discover the menu",
    story: "Our story",
    scroll: "Scroll down",
    restaurant: "Italian restaurant in Sousse",
    cuisine: "Italian cuisine, Mediterranean heart",
    houseTitle: "An Italian table with a Tunisian soul.",
    menuTitle: "Choose, then savor.",
    completeMenu: "The full menu",
    menuFor: "All Per Voi dishes and prices.",
    galleryTitle: "A taste for detail.",
    reviewTitle: "They talk about Per Voi.",
    leaveReview: "Leave a Google review",
    reviewHint: "Your review opens directly in Google.",
    bookIntro: "Your table is waiting.",
    bookText: "Choose an available day and time.",
    findUs: "See you soon in Sousse.",
    add: "Add",
    officialMenu: "Per Voi menu",
    maps: "Open in Maps",
    call: "Call us",
    host: "Owner area",
    whatsapp: "Book on WhatsApp",
    sending: "Sending…",
    thanks: "Grazie mille.",
    unit: "/ unit",
    addedToast: "added to cart",
    addedToastDesc: "Your cart is ready to order.",
    resToastSuccess: "Your request has been sent",
    resToastSuccessDesc: "Per Voi will contact you to confirm your table.",
    resToastError: "Reservation unavailable",
    orderToastSuccess: "Order received",
    orderToastSuccessDesc: "Per Voi will contact you to confirm your order.",
    orderToastError: "Order unavailable",
    takeawayHeader: "Per Voi Takeaway",
    namePlaceholder: "Ex. John Smith",
    emailPlaceholder: "you@example.com",
    notePlaceholder: "Birthday, high chair…",
    addressPlaceholder: "Delivery address",
    addressDefault: "Sahloul, Sousse",
    kitchenNotePlaceholder: "Note for the kitchen",
    itemWord: "item",
    itemsWord: "items",
    closedMonday: "Closed on Monday",
    sahloulSousse: "Sahloul · Sousse",
    copyright: "© 2026 Per Voi · Sousse"
  },
  it: {
    locationCity: "Sousse · 4054",
    reviewsCount: "· 286 recensioni",
    perPerson: "a persona",
    house: "La casa",
    menu: "Il menù",
    gallery: "Galleria",
    reviews: "Recensioni",
    find: "Dove trovarci",
    reserve: "Prenota",
    reserveTable: "Prenota un tavolo",
    discover: "Scopri il menù",
    story: "La nostra storia",
    scroll: "Scorri",
    restaurant: "Ristorante italiano a Sousse",
    cuisine: "Cucina italiana, cuore mediterraneo",
    houseTitle: "Una tavola italiana con un'anima tunisina.",
    menuTitle: "Scegli, poi assapora.",
    completeMenu: "Il menù completo",
    menuFor: "Tutti i piatti e i prezzi di Per Voi.",
    galleryTitle: "Il gusto dei dettagli.",
    reviewTitle: "Parlano di Per Voi.",
    leaveReview: "Lascia una recensione Google",
    reviewHint: "La recensione si apre direttamente su Google.",
    bookIntro: "Il tuo tavolo ti aspetta.",
    bookText: "Scegli un giorno e un orario disponibili.",
    findUs: "A presto, a Sousse.",
    add: "Aggiungi",
    officialMenu: "Menù Per Voi",
    maps: "Apri in Maps",
    call: "Chiamaci",
    host: "Area proprietario",
    whatsapp: "Prenota su WhatsApp",
    sending: "Invio in corso…",
    thanks: "Grazie mille.",
    unit: "/ unità",
    addedToast: "aggiunto al carrello",
    addedToastDesc: "Il carrello è pronto per l'ordine.",
    resToastSuccess: "La tua richiesta è stata inviata",
    resToastSuccessDesc: "Per Voi ti ricontatterà per confermare il tavolo.",
    resToastError: "Prenotazione non riuscita",
    orderToastSuccess: "Ordine ricevuto",
    orderToastSuccessDesc: "Per Voi ti contatterà per confermare l'ordine.",
    orderToastError: "Ordine non riuscito",
    takeawayHeader: "Per Voi da asporto",
    namePlaceholder: "Es. Marco Rossi",
    emailPlaceholder: "tu@esempio.it",
    notePlaceholder: "Compleanno, seggiolone…",
    addressPlaceholder: "Indirizzo di consegna",
    addressDefault: "Sahloul, Sousse",
    kitchenNotePlaceholder: "Nota per la cucina",
    itemWord: "articolo",
    itemsWord: "articoli",
    closedMonday: "Chiuso il lunedì",
    sahloulSousse: "Sahloul · Sousse",
    copyright: "© 2026 Per Voi · Sousse"
  },
  ar: {
    locationCity: "سوسة · 4054",
    reviewsCount: "· 286 تقييماً",
    perPerson: "للشخص",
    house: "عن المطعم",
    menu: "القائمة",
    gallery: "الصور",
    reviews: "التقييمات",
    find: "موقعنا",
    reserve: "احجز",
    reserveTable: "احجز طاولة",
    discover: "اكتشف القائمة",
    story: "قصتنا",
    scroll: "مرر للأسفل",
    restaurant: "مطعم إيطالي في سوسة",
    cuisine: "مطبخ إيطالي بروح متوسطية",
    houseTitle: "مائدة إيطالية بروح تونسية.",
    menuTitle: "اختر واستمتع.",
    completeMenu: "القائمة الكاملة",
    menuFor: "جميع أطباق وأسعار بير فوي.",
    galleryTitle: "مذاق التفاصيل.",
    reviewTitle: "ماذا يقولون عن بير فوي.",
    leaveReview: "اترك تقييماً على Google",
    reviewHint: "سيُفتح تقييمك مباشرة على Google.",
    bookIntro: "طاولتك في انتظارك.",
    bookText: "اختر يوماً ووقتاً متاحاً.",
    findUs: "نراك قريباً في سوسة.",
    add: "أضف",
    officialMenu: "قائمة بير فوي",
    maps: "افتح الخريطة",
    call: "اتصل بنا",
    host: "مساحة المالك",
    whatsapp: "احجز عبر واتساب",
    sending: "جاري الإرسال…",
    thanks: "شكراً جزيلاً لكم.",
    unit: "/ للوحدة",
    addedToast: "تمت إضافته إلى السلة",
    addedToastDesc: "سلتك جاهزة لتأكيد الطلب.",
    resToastSuccess: "تم إرسال طلبكم بنجاح",
    resToastSuccessDesc: "سيتصل بكم فريق بير فوي لتأكيد حجز الطاولة.",
    resToastError: "تعذر الحجز حالياً",
    orderToastSuccess: "تم استلام الطلب",
    orderToastSuccessDesc: "سيتصل بكم فريق بير فوي لتأكيد الطلب.",
    orderToastError: "تعذر إرسال الطلب",
    takeawayHeader: "بير فوي للطلب الخارجي",
    namePlaceholder: "مثال: أميرة بن علي",
    emailPlaceholder: "you@example.com",
    notePlaceholder: "عيد ميلاد، كرسي أطفال…",
    addressPlaceholder: "عنوان التوصيل بالتفصيل",
    addressDefault: "سهلول، سوسة",
    kitchenNotePlaceholder: "ملاحظات إضافية للمطبخ",
    itemWord: "عنصر",
    itemsWord: "عناصر",
    closedMonday: "مغلق يوم الاثنين",
    sahloulSousse: "سهلول · سوسة",
    copyright: "© 2026 بير فوي · سوسة"
  }
};

const formLabels: Record<Language, Record<string, string>> = {
  fr: { request:"Demande de réservation", name:"Votre nom", date:"Date", time:"Heure", guests:"Personnes", phone:"Téléphone", email:"Email (facultatif)", note:"Note (facultatif)", chooseDate:"Choisir une date d'abord", chooseTime:"Choisir un créneau", chooseGuests:"Choisir", send:"Envoyer la demande", disclaimer:"Les créneaux complets ou fermés ne sont pas proposés.", pickup:"À emporter", delivery:"Livraison", address:"Adresse", order:"Passer la commande", total:"Total", yourOrder:"Votre commande" },
  en: { request:"Reservation request", name:"Your name", date:"Date", time:"Time", guests:"Guests", phone:"Phone", email:"Email (optional)", note:"Note (optional)", chooseDate:"Choose a date first", chooseTime:"Choose a time", chooseGuests:"Choose", send:"Send request", disclaimer:"Full or closed time slots are not offered.", pickup:"Pickup", delivery:"Delivery", address:"Address", order:"Place order", total:"Total", yourOrder:"Your order" },
  it: { request:"Richiesta di prenotazione", name:"Il tuo nome", date:"Data", time:"Ora", guests:"Persone", phone:"Telefono", email:"Email (facoltativa)", note:"Nota (facoltativa)", chooseDate:"Scegli prima una data", chooseTime:"Scegli un orario", chooseGuests:"Scegli", send:"Invia la richiesta", disclaimer:"Gli orari completi o chiusi non vengono mostrati.", pickup:"Da asporto", delivery:"Consegna", address:"Indirizzo", order:"Invia ordine", total:"Totale", yourOrder:"Il tuo ordine" },
  ar: { request:"طلب حجز", name:"اسمك", date:"التاريخ", time:"الوقت", guests:"عدد الأشخاص", phone:"الهاتف", email:"البريد الإلكتروني (اختياري)", note:"ملاحظة (اختياري)", chooseDate:"اختر التاريخ أولاً", chooseTime:"اختر الوقت", chooseGuests:"اختر", send:"إرسال الطلب", disclaimer:"لا تظهر الأوقات الممتلئة أو المغلقة.", pickup:"استلام", delivery:"توصيل", address:"العنوان", order:"إرسال الطلب", total:"المجموع", yourOrder:"طلبك" }
};

const siteCopy: Record<Language, Record<string, string>> = {
  fr: { heroTitle:"La dolce vita", heroTitleAccent:"à votre table.", heroCopy:"Une cuisine italienne sincère, généreuse et solaire. Des pâtes fraîches, des produits choisis, et le plaisir d'être ensemble.", introEyebrow:"Benvenuti da Per Voi", introTitle:"Une table italienne", introAccent:"avec une âme tunisienne.", introCopy:"Chez Per Voi, l'Italie se raconte sans détour : dans une pâte faite avec patience, une sauce qui mijote, un verre partagé. Notre cuisine puise dans les gestes italiens et dans la lumière de Sousse.", visitCta:"Venir nous voir", welcome:"L'art de recevoir, tout simplement.", gallery:"La galerie", instagram:"Voir Instagram", galleryNote:"Photos fournies par Per Voi · Autocollants retirés et images nettoyées pour la présentation du site.", reviews:"Les avis", google:"sur Google · 286 avis", reviewSource:"Avis vérifiés de nos clients sur Google · Note moyenne 4,7/5.", dayHours:"Mardi — dimanche · 12h — 23h", closed:"Lundi fermé · réservation conseillée", serviceNote:"Les demandes sont enregistrées et confirmées par l'équipe Per Voi.", locationCopy:"Per Voi vous accueille à Sahloul, Sousse. Venez découvrir une table pensée pour les bons moments.", open:"À bientôt", days:"Mardi — Dimanche", orderNote:"Paiement à la livraison ou sur place. Votre commande est confirmée par téléphone.", quantity:"/ unité", person:"personne", people:"personnes", close:"Fermer", orderReceived:"Ordre reçu.", orderReceivedCopy:"Per Voi vous contactera pour confirmer votre commande et le délai.", backMenu:"Retour à la carte", requestSent:"Votre demande est bien enregistrée. Notre équipe vous appellera au numéro fourni pour confirmer la table.", anotherRequest:"Faire une autre demande" },
  en: { heroTitle:"La dolce vita", heroTitleAccent:"at your table.", heroCopy:"Sincere, generous and sunny Italian cuisine. Fresh pasta, carefully chosen ingredients, and the pleasure of being together.", introEyebrow:"Benvenuti da Per Voi", introTitle:"An Italian table", introAccent:"with a Tunisian soul.", introCopy:"At Per Voi, Italy is told without detours: through patiently made pasta, a gently simmered sauce and a glass shared together. Our cuisine draws on Italian gestures and the light of Sousse.", visitCta:"Come and see us", welcome:"The art of welcoming, simply.", gallery:"The gallery", instagram:"View Instagram", galleryNote:"Photos provided by Per Voi · Stickers removed and images cleaned for the website presentation.", reviews:"Reviews", google:"on Google · 286 reviews", reviewSource:"Verified customer reviews on Google · Average rating 4.7/5.", dayHours:"Tuesday — Sunday · 12pm — 11pm", closed:"Monday closed · reservations recommended", serviceNote:"Requests are recorded and confirmed by the Per Voi team.", locationCopy:"Per Voi welcomes you in Sahloul, Sousse. Discover a table designed for good moments.", open:"See you soon", days:"Tuesday — Sunday", orderNote:"Pay on delivery or pickup. Your order is confirmed by phone.", quantity:"/ unit", person:"person", people:"people", close:"Close", orderReceived:"Order received.", orderReceivedCopy:"Per Voi will contact you to confirm your order and timing.", backMenu:"Back to the menu", requestSent:"Your request has been recorded. Our team will call the number provided to confirm your table.", anotherRequest:"Make another request" },
  it: { heroTitle:"La dolce vita", heroTitleAccent:"alla tua tavola.", heroCopy:"Una cucina italiana sincera, generosa e solare. Pasta fresca, ingredienti scelti e il piacere di stare insieme.", introEyebrow:"Benvenuti da Per Voi", introTitle:"Una tavola italiana", introAccent:"con un'anima tunisina.", introCopy:"Da Per Voi l'Italie si racconta senza mezzi termini: nella pasta fatta con pazienza, in una salsa che cuoce lentamente e in un calice condiviso. La nostra cucina nasce dai gesti italiani e dalla luce di Sousse.", visitCta:"Vieni a trovarci", welcome:"L'arte dell'accoglienza, semplicemente.", gallery:"La galleria", instagram:"Vedi Instagram", galleryNote:"Foto fornite da Per Voi · Adesivi rimossi e immagini pulite per la presentazione del sito.", reviews:"Recensioni", google:"su Google · 286 recensioni", reviewSource:"Recensioni verificate dei clienti su Google · Valutazione media 4,7/5.", dayHours:"Martedì — domenica · 12:00 — 23:00", closed:"Lunedì chiuso · prenotazione consigliata", serviceNote:"Le richieste vengono registrate e confermate dal team Per Voi.", locationCopy:"Per Voi ti accoglie a Sahloul, Sousse. Scopri una tavola pensata per i momenti belli.", open:"A presto", days:"Martedì — Domenica", orderNote:"Pagamento alla consegna o al ritiro. L'ordine viene confermato per telefono.", quantity:"/ unità", person:"persona", people:"persone", close:"Chiudi", orderReceived:"Ordine ricevuto.", orderReceivedCopy:"Per Voi ti contatterà per confermare l'ordine e i tempi.", backMenu:"Torna al menù", requestSent:"La richiesta è stata registrata. Il nostro team chiamerà il numero fornito per confermare il tavolo.", anotherRequest:"Fai un'altra richiesta" },
  ar: { heroTitle:"لا دولتشي فيتا", heroTitleAccent:"على طاولتكم.", heroCopy:"مطبخ إيطالي صادق، غني ومشرق. معكرونة طازجة، مكونات مختارة ومتعة اللقاء.", introEyebrow:"أهلاً بكم في بير فوي", introTitle:"مائدة إيطالية", introAccent:"بروح تونسية.", introCopy:"في بير فوي، تُروى إيطاليا ببساطة: في العجين المحضر بصبر، والصلصة المطهوة بهدوء، والكأس الذي نتشاركه. يستلهم مطبخنا الحركات الإيطالية وضوء سوسة.", visitCta:"تفضلوا بزيارتنا", welcome:"فن الضيافة ببساطة.", gallery:"الصور", instagram:"شاهد Instagram", galleryNote:"صور مقدمة من بير فوي · تمت إزالة الملصقات وتنظيف الصور لعرضها على الموقع.", reviews:"التقييمات", google:"على Google · 286 تقييماً", reviewSource:"تقييمات موثقة من زبائننا على Google · متوسط التقييم 4.7/5.", dayHours:"الثلاثاء — الأحد · 12:00 — 23:00", closed:"الاثنين مغلق · ينصح بالحجز", serviceNote:"يتم تسجيل الطلبات وتأكيدها من فريق بير فوي.", locationCopy:"يستقبلكم بير فوي في سهلول، سوسة. اكتشفوا مائدة صممت للحظات الجميلة.", open:"إلى اللقاء", days:"الثلاثاء — الأحد", orderNote:"الدفع عند التوصيل أو الاستلام. يتم تأكيد الطلب عبر الهاتف.", quantity:"/ الوحدة", person:"شخص", people:"أشخاص", close:"إغلاق", orderReceived:"تم استلام الطلب.", orderReceivedCopy:"سيتصل بكم بير فوي لتأكيد الطلب والمدة.", backMenu:"العودة إلى القائمة", requestSent:"تم تسجيل طلبكم. سيتصل فريقنا بالرقم المقدم لتأكيد الطاولة.", anotherRequest:"إرسال طلب آخر" }
};
const galleryCopy: Record<Language, Array<{ title: string; caption: string }>> = {
  fr: [{ title:"La salle", caption:"Lumière, arches & dolce vita" }, { title:"La pizza", caption:"Pâte levée, four & basilic" }, { title:"Les cocktails", caption:"Fraîcheur, agrumes & partage" }, { title:"La pasta", caption:"Des recettes généreuses" }, { title:"Les raviolis", caption:"Fait maison, avec amore" }, { title:"Les classiques", caption:"Le goût du vrai" }, { title:"Le dessert", caption:"La dernière touche" }, { title:"À partager", caption:"Une cuisine qui rassemble" }],
  en: [{ title:"The room", caption:"Light, arches & dolce vita" }, { title:"The pizza", caption:"Risen dough, oven & basil" }, { title:"Cocktails", caption:"Freshness, citrus & sharing" }, { title:"The pasta", caption:"Generous recipes" }, { title:"The ravioli", caption:"Homemade, with amore" }, { title:"The classics", caption:"The taste of the real" }, { title:"Dessert", caption:"The final touch" }, { title:"To share", caption:"A cuisine that brings us together" }],
  it: [{ title:"La sala", caption:"Luce, archi & dolce vita" }, { title:"La pizza", caption:"Impasto, forno & basilico" }, { title:"I cocktail", caption:"Freschezza, agrumi & condivisione" }, { title:"La pasta", caption:"Ricette generose" }, { title:"I ravioli", caption:"Fatti in casa, con amore" }, { title:"I classici", caption:"Il gusto autentico" }, { title:"Il dolce", caption:"Il tocco finale" }, { title:"Da condividere", caption:"Una cucina che unisce" }],
  ar: [{ title:"القاعة", caption:"ضوء وأقواس ولا دولتشي فيتا" }, { title:"البيتزا", caption:"عجين مخمر وفرن وريحان" }, { title:"المشروبات", caption:"انتعاش وحمضيات ومشاركة" }, { title:"المعكرونة", caption:"وصفات غنية" }, { title:"الرافيولي", caption:"محضر في المطعم بحب" }, { title:"الأطباق الكلاسيكية", caption:"المذاق الأصيل" }, { title:"الحلوى", caption:"اللمسة الأخيرة" }, { title:"للمشاركة", caption:"مطبخ يجمعنا" }]
};

const customerReviewsByLang: Record<Language, Array<{ quote: string; author: string; detail: string }>> = {
  fr: [
    { quote: "Restaurant très accueillant sympathique et délicieux.", author: "Momo Farhat", detail: "Avis Google · 5/5 · il y a 23 jours" },
    { quote: "Un restaurant moderne et un lieu de vie où cuisine d'exception, mocktails signatures, musique et atmosphère unique se rencontrent. Un endroit parfait pour savourer, se détendre et partager des moments inoubliables.", author: "Omar Hajamor", detail: "Avis Google · 5/5 · il y a 23 jours" },
    { quote: "Très bonne expérience, le service était excellent, à refaire absolument la prochaine fois.", author: "Sabi F.", detail: "Avis Google · 5/5 · il y a 23 jours" },
    { quote: "Très belle expérience au restaurant Per Voi ! Les pizzas sont magnifiques, très bonnes et préparées avec des produits de qualité. Les entrées étaient également excellentes. Le cadre est magnifique et le service très agréable !", author: "A M", detail: "Avis Google · 5/5 · il y a 23 jours" },
    { quote: "Honnêtement une ambiance européenne très agréable et chaleureuse !", author: "Ahmed Zguem", detail: "Avis Google · 5/5 · il y a 23 jours" },
    { quote: "Très bel endroit. Service agréable. Très bon service. Pizza très bonne.", author: "Angélique Cossinet", detail: "Avis Google · 5/5 · il y a 23 jours" },
    { quote: "Très bon, restaurant joli, rien à redire.", author: "Ymène Zouaghi", detail: "Avis Google · 5/5 · il y a 25 jours" },
    { quote: "C'était vraiment excellent, très très bon ! L'accueil était super chaleureux, petite attention pour notre fille. On a passé un moment magique !", author: "Ib Marie", detail: "Avis Google · 5/5 · il y a 27 jours" },
  ],
  en: [
    { quote: "Very welcoming, friendly and delicious restaurant.", author: "Momo Farhat", detail: "Google Review · 5/5 · 23 days ago" },
    { quote: "A modern restaurant & lifestyle spot where great food, signature mocktails, music, and a unique atmosphere come together. A place to eat, relax, connect, and enjoy unforgettable moments.", author: "Omar Hajamor", detail: "Google Review · 5/5 · 23 days ago" },
    { quote: "Great experience, the service was excellent, definitely returning next time.", author: "Sabi F.", detail: "Google Review · 5/5 · 23 days ago" },
    { quote: "Wonderful experience at Per Voi! The pizzas are gorgeous, delicious and made with prime quality ingredients. Starters were wonderful too. Stunning ambiance and attentive service!", author: "A M", detail: "Google Review · 5/5 · 23 days ago" },
    { quote: "Honestly a very pleasant and warm European atmosphere!", author: "Ahmed Zguem", detail: "Google Review · 5/5 · 23 days ago" },
    { quote: "Very nice place. Friendly and prompt service. Pizzas were delicious.", author: "Angélique Cossinet", detail: "Google Review · 5/5 · 23 days ago" },
    { quote: "Really tasty food, lovely interior design, flawless experience.", author: "Ymène Zouaghi", detail: "Google Review · 5/5 · 25 days ago" },
    { quote: "Everything was truly excellent and delicious! Very warm welcome, lovely gesture for our daughter. We had a memorable time!", author: "Ib Marie", detail: "Google Review · 5/5 · 27 days ago" },
  ],
  it: [
    { quote: "Ristorante molto accogliente, simpatico e squisito.", author: "Momo Farhat", detail: "Recensione Google · 5/5 · 23 giorni fa" },
    { quote: "Un locale moderno dove si incontrano cucina raffinata, mocktail d'autore, musica e un'atmosfera unica. Il posto ideale per rilassarsi e condividere momenti indimenticabili.", author: "Omar Hajamor", detail: "Recensione Google · 5/5 · 23 giorni fa" },
    { quote: "Esperienza ottima, servizio eccellente, ci torneremo sicuramente la prossima volta.", author: "Sabi F.", detail: "Recensione Google · 5/5 · 23 giorni fa" },
    { quote: "Splendida esperienza al ristorante Per Voi! Le pizze sono stupende, buonissime e preparate con materie prime scelte. Antipasti deliziosi e servizio impeccabile!", author: "A M", detail: "Recensione Google · 5/5 · 23 giorni fa" },
    { quote: "Un'atmosfera europea davvero piacevole e calorosa!", author: "Ahmed Zguem", detail: "Recensione Google · 5/5 · 23 giorni fa" },
    { quote: "Posto incantevole. Servizio rapido e cortese. Pizza davvero squisita.", author: "Angélique Cossinet", detail: "Recensione Google · 5/5 · 23 giorni fa" },
    { quote: "Cibo buonissimo, locale stupendo, nulla da ridire.", author: "Ymène Zouaghi", detail: "Recensione Google · 5/5 · 25 giorni fa" },
    { quote: "Cucina eccellente e gustosissima! Accoglienza calorosa con una dolce attenzione per nostra figlia. Abbiamo trascorso una serata meravigliosa!", author: "Ib Marie", detail: "Recensione Google · 5/5 · 27 giorni fa" },
  ],
  ar: [
    { quote: "مطعم مضياف وودود للغاية، والأكل شهي ولذيذ جداً.", author: "Momo Farhat", detail: "تقييم Google · 5/5 · منذ 23 يوماً" },
    { quote: "مطعم عصري ومكان لقاء مميز يجمع بين الأطباق الراقية والمشروبات المبتكرة والموسيقى والأجواء الفريدة. المكان المثالي للاستمتاع بلحظات لا تُنسى.", author: "Omar Hajamor", detail: "تقييم Google · 5/5 · منذ 23 يوماً" },
    { quote: "تجربة ممتازة والخدمة كانت رائعة للغاية، سنعود بالتأكيد في المرة القادمة.", author: "Sabi F.", detail: "تقييم Google · 5/5 · منذ 23 يوماً" },
    { quote: "تجربة رائعة في مطعم بير فوي! البيتزا مذهلة ومعدة بمكونات عالية الجودة، والمقبلات لذيذة جداً والديكور فخم والخدمة في القمة!", author: "A M", detail: "تقييم Google · 5/5 · منذ 23 يوماً" },
    { quote: "أجواء أوروبية راقية ودافئة ومريحة للغاية!", author: "Ahmed Zguem", detail: "تقييم Google · 5/5 · منذ 23 يوماً" },
    { quote: "مكان جميل جداً، استقبال لطيف وخدمة ممتازة وبيتزا لذيذة وخفيفة.", author: "Angélique Cossinet", detail: "تقييم Google · 5/5 · منذ 23 يوماً" },
    { quote: "أكل لذيذ جداً ومطعم أنيق ومرتب بدون أي ملاحظات.", author: "Ymène Zouaghi", detail: "تقييم Google · 5/5 · منذ 25 يوماً" },
    { quote: "الأطباق كانت استثنائية ولذيذة جداً! استقبال رائع ومعاملة لطيفة جداً لابنتنا. قضينا وقتاً ممتعاً للغاية!", author: "Ib Marie", detail: "تقييم Google · 5/5 · منذ 27 يوماً" },
  ]
};

const ownerGallery = [
  { src: "/photos/table-design.jpg", alt: "Salle principale de Per Voi", title: "La salle", caption: "Lumière, arches & dolce vita" },
  { src: "/photos/pizza-part.jpg", alt: "Pizza de Per Voi", title: "La pizza", caption: "Pâte levée, four & basilic" },
  { src: "/photos/cocktails.jpg", alt: "Cocktails frais de Per Voi", title: "Les cocktails", caption: "Fraîcheur, agrumes & partage" },
  { src: "/photos/penne-boeuf.jpg", alt: "Penne crémeuses de Per Voi", title: "La pasta", caption: "Des recettes généreuses" },
  { src: "/photos/raviolis.jpg", alt: "Raviolis maison de Per Voi", title: "Les raviolis", caption: "Fait maison, avec amore" },
  { src: "/photos/pasta-fourchette.jpg", alt: "Tagliatelles bolognaises de Per Voi", title: "Les classiques", caption: "Le goût du vrai" },
  { src: "/photos/tiramisu.jpg", alt: "Dessert au cacao de Per Voi", title: "Le dessert", caption: "La dernière touche" },
  { src: "/photos/assiette-gourmande.jpg", alt: "Assiette gourmande de Per Voi", title: "À partager", caption: "Une cuisine qui rassemble" },
];

type LiveMenuItem = {
  id: number;
  category: string;
  name: string;
  description: string | null;
  priceDt: number;
  active: boolean;
  sortOrder: number;
};

const fallbackItems: LiveMenuItem[] = [
  // Entrées
  { id: 1, category: "Entrées", name: "Burrata crémeuse", description: "Marmelade de tomates, pickles de gingembre, crème citronnée et basilic frais.", priceDt: 27, active: true, sortOrder: 1 },
  { id: 2, category: "Entrées", name: "Carpaccio de Bœuf Truffé", description: "Fines tranches de filet de bœuf, copeaux de grana padano, roquette et huile de truffe.", priceDt: 32, active: true, sortOrder: 2 },
  { id: 3, category: "Entrées", name: "Bruschetta Gourmande Saumon", description: "Pain de campagne grillé, saumon gravlax, ricotta aux herbes et câpres croquantes.", priceDt: 24, active: true, sortOrder: 3 },
  { id: 4, category: "Entrées", name: "Salade Caprese Di Bufala", description: "Tomates savoureuses, mozzarella di bufala, réduction balsamique et basilic.", priceDt: 26, active: true, sortOrder: 4 },
  { id: 5, category: "Entrées", name: "Fritto Misto de la Mer", description: "Calamars, crevettes et seiches croustillants, mayonnaise citronnée maison.", priceDt: 34, active: true, sortOrder: 5 },

  // Pâtes
  { id: 6, category: "Pâtes", name: "Rigatoni Effiloché de Bœuf", description: "Sauce tomates mijotée, tomates séchées, bœuf fondant et crème de parmesan.", priceDt: 36, active: true, sortOrder: 6 },
  { id: 7, category: "Pâtes", name: "Rigatoni Poivrons Fumés et Crevettes", description: "Crevettes sautées, crème de poivrons fumés, miel, noisettes et figues séchées.", priceDt: 42, active: true, sortOrder: 7 },
  { id: 8, category: "Pâtes", name: "Tagliatelles aux Fruits de Mer", description: "Crevettes, moules, seiches, bisque maison, tomates cerises et persil plat.", priceDt: 46, active: true, sortOrder: 8 },
  { id: 9, category: "Pâtes", name: "Raviolis Ricotta & Épinards", description: "Pâtes fraîches maison farcies, beurre de sauge parfumé et crème de parmesan.", priceDt: 34, active: true, sortOrder: 9 },
  { id: 10, category: "Pâtes", name: "Penne au Poulet et Champignons", description: "Émincé de poulet fermier, champignons de Paris, crème fraîche et parmesan.", priceDt: 32, active: true, sortOrder: 10 },
  { id: 11, category: "Pâtes", name: "Spaghetti Al Pomodoro & Burrata", description: "Sauce tomate napolitaine au basilic frais, couronnée d'une burrata entière.", priceDt: 35, active: true, sortOrder: 11 },
  { id: 12, category: "Pâtes", name: "Risotto aux Crevettes & Safran", description: "Riz carnaroli crémeux, bouillon de crustacés, crevettes fraîches et parmesan.", priceDt: 44, active: true, sortOrder: 12 },

  // Pizzas
  { id: 13, category: "Pizzas", name: "La Margherita", description: "Sauce tomate italienne, mozzarella fior di latte, grana padano et basilic frais.", priceDt: 22, active: true, sortOrder: 13 },
  { id: 14, category: "Pizzas", name: "Quattro Formaggi", description: "Mozzarella, gorgonzola, grana padano, ricotta crémeuse et touche de miel.", priceDt: 28, active: true, sortOrder: 14 },
  { id: 15, category: "Pizzas", name: "Pizza Diavola", description: "Sauce tomate, mozzarella fior di latte, salami piquant italien et piments doux.", priceDt: 29, active: true, sortOrder: 15 },
  { id: 16, category: "Pizzas", name: "Pizza Per Voi Truffe", description: "Crème de truffe blanche, mozzarella, champignons sautés, parmesan et roquette.", priceDt: 38, active: true, sortOrder: 16 },
  { id: 17, category: "Pizzas", name: "Pizza Frutti di Mare", description: "Sauce tomate, mozzarella, fruits de mer frais de Sousse, ail confit et persil.", priceDt: 39, active: true, sortOrder: 17 },
  { id: 18, category: "Pizzas", name: "Pizza Végétarienne Grillée", description: "Courgettes, aubergines marinées, poivrons rôtis, mozzarella et origan.", priceDt: 25, active: true, sortOrder: 18 },

  // Terre & mer
  { id: 19, category: "Terre & mer", name: "Filet de Bœuf au Poivre Vert", description: "Filet de bœuf tendre, sauce au poivre vert et crème, légumes sautés du jour.", priceDt: 54, active: true, sortOrder: 19 },
  { id: 20, category: "Terre & mer", name: "Daurade Royale Grillée", description: "Filet de daurade fraîche, écrasé de pommes de terre à l'huile d'olive et caviar d'aubergines.", priceDt: 48, active: true, sortOrder: 20 },
  { id: 21, category: "Terre & mer", name: "Escalope Milanaise Croustillante", description: "Escalope de veau panée dorée au beurre clarifié, servie avec spaghettis al pomodoro.", priceDt: 38, active: true, sortOrder: 21 },
  { id: 22, category: "Terre & mer", name: "Saumon Poêlé aux Agrumes", description: "Pavé de saumon croustillant, réduction d'agrumes, fenouil croquant et riz safrané.", priceDt: 52, active: true, sortOrder: 22 },

  // Desserts
  { id: 23, category: "Desserts", name: "Tiramisu Classico", description: "Café espresso italien, mascarpone onctueux, biscuits savoiardi et pur cacao amer.", priceDt: 23, active: true, sortOrder: 23 },
  { id: 24, category: "Desserts", name: "Panna Cotta Vanille & Fruits Rouges", description: "Crème cuite à la vanille bourbon de Madagascar, coulis acidulé de framboises.", priceDt: 18, active: true, sortOrder: 24 },
  { id: 25, category: "Desserts", name: "Pizza Nutella & Pistaches", description: "Pâte fine et croustillante au four, Nutella fondant et éclats de pistaches grillées.", priceDt: 24, active: true, sortOrder: 25 },
  { id: 26, category: "Desserts", name: "Fondant au Chocolat Coeur Coulant", description: "Chocolat noir 70%, cœur coulant intense, servi avec glace vanille.", priceDt: 22, active: true, sortOrder: 26 },

  // Boissons
  { id: 27, category: "Boissons", name: "Mocktail Signature Per Voi", description: "Jus d'agrumes frais de Tunisie, menthe pilée, purée de passion et eau pétillante.", priceDt: 14, active: true, sortOrder: 27 },
  { id: 28, category: "Boissons", name: "Mojito Frais Maison", description: "Citron vert pressé, feuilles de menthe fraîche, sucre de canne et soda.", priceDt: 12, active: true, sortOrder: 28 },
  { id: 29, category: "Boissons", name: "Limonade Artisanale Menthe", description: "Citrons frais pressés minute, sirop de menthe maison et glace pilée.", priceDt: 10, active: true, sortOrder: 29 },
  { id: 30, category: "Boissons", name: "Espresso Italien", description: "Sélection de café italien torréfié artisanalement.", priceDt: 5, active: true, sortOrder: 30 },
  { id: 31, category: "Boissons", name: "Eau Minérale / Gazeuse 1L", description: "Bouteille en verre servie bien fraîche.", priceDt: 4, active: true, sortOrder: 31 },
];

export default function Home() {
  const [language, setLanguage] = useState<Language>(() => (localStorage.getItem("per-voi-language") as Language) || "fr");
  const t = translations[language];
  const menuQuery = trpc.restaurant.menu.list.useQuery();
  const menuItems = (menuQuery.data as LiveMenuItem[] | undefined) ?? fallbackItems;
  const categories = useMemo(() => Array.from(new Set(menuItems.map(item => item.category))), [menuItems]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [category, setCategory] = useState("Pâtes");
  const [submitted, setSubmitted] = useState(false);
  const [reservationDate, setReservationDate] = useState("");
  const [reservationTime, setReservationTime] = useState("");
  const [orderOpen, setOrderOpen] = useState(false);
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [cart, setCart] = useState<Record<number, { item: LiveMenuItem; quantity: number }>>({});
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [orderType, setOrderType] = useState<"pickup" | "delivery">("pickup");
  const [address, setAddress] = useState("");
  const [orderNotes, setOrderNotes] = useState("");
  const [reviewIndex, setReviewIndex] = useState(0);

  const currentReviews = customerReviewsByLang[language];

  useEffect(() => {
    localStorage.setItem("per-voi-language", language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.title = language === "ar" ? "بير فوي — مطعم إيطالي في سوسة" : language === "en" ? "Per Voi — Italian restaurant in Sousse" : language === "it" ? "Per Voi — Ristorante italiano a Sousse" : "Per Voi — Restaurant italien à Sousse";
  }, [language]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setReviewIndex(current => (current + 1) % currentReviews.length);
    }, 5500);
    return () => window.clearInterval(timer);
  }, [currentReviews.length]);

  const availabilityQuery = trpc.restaurant.availability.forDate.useQuery(
    { serviceDate: reservationDate },
    { enabled: reservationDate.length === 10 },
  );
  const reservationMutation = trpc.restaurant.reservations.create.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      toast.success(t.resToastSuccess, { description: t.resToastSuccessDesc });
    },
    onError: error => toast.error(t.resToastError, { description: error.message }),
  });
  const orderMutation = trpc.restaurant.orders.create.useMutation({
    onSuccess: result => {
      setOrderSubmitted(true);
      setCart({});
      toast.success(`${t.orderToastSuccess} #${result.id}`, { description: t.orderToastSuccessDesc });
    },
    onError: error => toast.error(t.orderToastError, { description: error.message }),
  });

  const visibleItems = menuItems.filter(item => item.category === category);
  const cartLines = Object.values(cart);
  const cartCount = cartLines.reduce((sum, line) => sum + line.quantity, 0);
  const cartTotal = cartLines.reduce((sum, line) => sum + line.item.priceDt * line.quantity, 0);
  const isMonday = useMemo(() => {
    if (!reservationDate) return false;
    const parts = reservationDate.split("-");
    if (parts.length !== 3) return false;
    const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]), 12, 0, 0);
    return d.getDay() === 1;
  }, [reservationDate]);

  const availableTimes = useMemo(() => {
    if (!reservationDate || isMonday) return [];
    if (availabilityQuery.data && availabilityQuery.data.length > 0) {
      return availabilityQuery.data.filter(slot => slot.status === "available");
    }
    const STANDARD_SLOTS = [
      "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00",
      "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00", "22:30"
    ];
    return STANDARD_SLOTS.map(time => ({ serviceTime: time, status: "available" as const, remainingGuests: 30 }));
  }, [reservationDate, isMonday, availabilityQuery.data]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const addToCart = (item: LiveMenuItem) => {
    if (item.id < 0) return;
    setCart(current => ({ ...current, [item.id]: { item, quantity: (current[item.id]?.quantity ?? 0) + 1 } }));
    toast.success(`${translateMenuText(language, item.name)} ${t.addedToast}`, { description: t.addedToastDesc });
  };

  const changeQuantity = (id: number, delta: number) => {
    setCart(current => {
      const line = current[id];
      if (!line) return current;
      const quantity = line.quantity + delta;
      if (quantity <= 0) {
        const next = { ...current };
        delete next[id];
        return next;
      }
      return { ...current, [id]: { ...line, quantity } };
    });
  };

  const handleReservation = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    reservationMutation.mutate({
      name: String(data.get("name") ?? ""),
      phone: String(data.get("phone") ?? ""),
      email: String(data.get("email") ?? ""),
      serviceDate: reservationDate,
      serviceTime: reservationTime,
      guests: Number(data.get("guests") ?? 0),
      notes: String(data.get("notes") ?? ""),
    });
  };

  const handleOrder = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (customerName.trim().length < 2) {
      toast.error("Veuillez entrer votre nom.");
      return;
    }
    if (phone.trim().length < 6) {
      toast.error("Veuillez entrer un numéro de téléphone valide.");
      return;
    }
    if (orderType === "delivery" && address.trim().length < 2) {
      toast.error("Veuillez entrer votre adresse de livraison.");
      return;
    }

    orderMutation.mutate({
      customerName,
      phone,
      orderType,
      address: address || undefined,
      notes: orderNotes || undefined,
      items: cartLines.map(line => ({ menuItemId: line.item.id, quantity: line.quantity })),
    });
  };

  return (
    <main className={`site-shell language-transition language-${language}`} key={language}>
      <div className="topline"><div className="container topline-inner"><span>{t.locationCity}</span><span className="topline-center">{t.cuisine}</span><span className="rating-mini"><Star size={13} fill="currentColor" /> 4,7 <em>{t.reviewsCount}</em></span></div></div>
      <header className="nav-wrap"><div className="container nav-inner">
        <button className="brand" onClick={() => scrollTo("accueil")} aria-label="Per Voi"><span className="brand-mark">PV</span><span className="brand-wordmark">Per Voi</span></button>
        <nav className={menuOpen ? "main-nav is-open" : "main-nav"} aria-label="Navigation">
          <button onClick={() => scrollTo("histoire")}>{t.house}</button><button onClick={() => scrollTo("carte")}>{t.menu}</button><button onClick={() => scrollTo("galerie")}>{t.gallery}</button><button onClick={() => scrollTo("avis")}>{t.reviews}</button><button onClick={() => scrollTo("visiter")}>{t.find}</button><button className="nav-mobile-cta" onClick={() => scrollTo("reservation")}>{t.reserveTable}</button>
        </nav>
        <div className="nav-actions"><div className="language-switcher" aria-label="Choisir la langue">{languages.map(code => <button key={code} type="button" className={language === code ? "active" : ""} onClick={() => setLanguage(code)} aria-label={languageLabels[code]} title={languageLabels[code]}>{languageCodes[code]}</button>)}</div><button className="icon-button mobile-trigger" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? siteCopy[language].close : t.menu}>{menuOpen ? <X size={21} /> : <Menu size={21} />}</button><button className="button button-dark nav-cta" onClick={() => scrollTo("reservation")}>{t.reserve} <ArrowRight size={16} /></button></div>
      </div></header>

      <section className="hero" id="accueil"><div className="hero-image" /><div className="hero-overlay" /><div className="container hero-content"><div className="hero-kicker reveal"><span className="kicker-line" /> {t.restaurant}</div><h1 className="hero-title reveal delay-1">{siteCopy[language].heroTitle},<br /><i>{siteCopy[language].heroTitleAccent}</i></h1><p className="hero-copy reveal delay-2">{siteCopy[language].heroCopy}</p><div className="hero-actions reveal delay-3"><button className="button button-light" onClick={() => scrollTo("carte")}>{t.discover} <ArrowRight size={16} /></button><button className="text-link text-link-light" onClick={() => scrollTo("histoire")}>{t.story} <ArrowDown size={15} /></button></div></div><div className="hero-side-note">PER VOI <span>·</span> 01</div><div className="hero-bottom container"><span className="scroll-note"><span className="scroll-dot" /> {t.scroll}</span><span className="hero-price">30 — 90 DT <em>{t.perPerson}</em></span></div></section>

      <section className="intro-section section-padding" id="histoire"><div className="container intro-grid"><div className="section-eyebrow">01 <span /> {t.house}</div><div className="intro-statement"><p className="eyebrow-label">{siteCopy[language].introEyebrow}</p><h2>{siteCopy[language].introTitle}<br /><i>{siteCopy[language].introAccent}</i></h2><p className="intro-text">{siteCopy[language].introCopy}</p><button className="text-link" onClick={() => scrollTo("visiter")}>{siteCopy[language].visitCta} <ArrowRight size={16} /></button></div><div className="intro-image-frame"><img src="/photos/salle-principale.jpg" alt="Salle de Per Voi" /><span className="image-caption">{siteCopy[language].welcome}</span></div></div></section>

      <section className="menu-section section-padding" id="carte"><div className="container"><div className="menu-heading"><div><div className="section-eyebrow">02 <span /> {t.completeMenu}</div><h2>{t.menuTitle}</h2></div><div className="menu-heading-note">{t.menuFor}</div></div><div className="menu-layout"><div className="menu-list-wrap"><div className="category-tabs" role="tablist" aria-label="Catégories">{categories.map(item => <button key={item} role="tab" aria-selected={category === item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{translateMenuText(language, item)}</button>)}</div><div className="menu-items">{visibleItems.map((item, index) => <article className="menu-item" key={item.id}><div className="menu-item-index">{String(index + 1).padStart(2, "0")}</div><div className="menu-item-body"><h3>{translateMenuText(language, item.name)}</h3><p>{translateMenuText(language, item.description)}</p></div><div className="menu-item-action"><span className="menu-item-price">{item.priceDt} DT</span><button className="menu-add" onClick={() => addToCart(item)}><Plus size={14} /> {t.add}</button></div></article>)}</div></div></div></div></section>

      <section className="gallery-section section-padding" id="galerie"><div className="container"><div className="gallery-heading"><div><div className="section-eyebrow">02 bis <span /> {siteCopy[language].gallery}</div><h2>{t.galleryTitle}</h2></div><a className="text-link" href="https://www.instagram.com/pervoi_restaurant/" target="_blank" rel="noreferrer">{siteCopy[language].instagram} <Instagram size={16} /></a></div><div className="gallery-grid">{ownerGallery.map((photo, index) => <figure className={`gallery-card ${index === 0 ? "gallery-card-large" : ""} ${index === 2 ? "gallery-card-offset" : ""}`} key={photo.src}><img src={photo.src} alt={photo.alt} loading={index > 1 ? "lazy" : "eager"} /><figcaption><span>{String(index + 1).padStart(2, "0")}</span><strong>{galleryCopy[language][index].title}</strong><em>{galleryCopy[language][index].caption}</em></figcaption></figure>)}</div><p className="gallery-note">{siteCopy[language].galleryNote}</p></div></section>

      <section className="quote-band" id="avis"><div className="container reviews-container"><div className="reviews-heading"><div><div className="section-eyebrow">02 ter <span /> {siteCopy[language].reviews}</div><h2>{t.reviewTitle}</h2></div><div className="quote-meta"><div className="stars"><Star size={15} fill="currentColor" /><Star size={15} fill="currentColor" /><Star size={15} fill="currentColor" /><Star size={15} fill="currentColor" /><Star size={15} fill="currentColor" /></div><strong>4,7 / 5</strong><span>{siteCopy[language].google}</span></div></div><div className="review-carousel"><div className="review-quote-mark">“</div><div className="review-slide review-slide-enter" key={`${language}-${reviewIndex}`}><div className="review-stars"><Star size={13} fill="currentColor" /><Star size={13} fill="currentColor" /><Star size={13} fill="currentColor" /><Star size={13} fill="currentColor" /><Star size={13} fill="currentColor" /></div><blockquote>{currentReviews[reviewIndex % currentReviews.length].quote}</blockquote><div className="review-author"><strong>{currentReviews[reviewIndex % currentReviews.length].author}</strong><span>{currentReviews[reviewIndex % currentReviews.length].detail}</span></div></div><div className="review-controls"><button onClick={() => setReviewIndex(current => (current - 1 + currentReviews.length) % currentReviews.length)} aria-label="Avis précédent"><ChevronLeft size={18} /></button><span>{String((reviewIndex % currentReviews.length) + 1).padStart(2, "0")} / {String(currentReviews.length).padStart(2, "0")}</span><button onClick={() => setReviewIndex(current => (current + 1) % currentReviews.length)} aria-label="Avis suivant"><ChevronRight size={18} /></button></div></div><p className="review-source">{siteCopy[language].reviewSource}</p><div className="review-actions"><a className="button button-light" href={googleReviewLink} target="_blank" rel="noreferrer">{t.leaveReview} <ArrowRight size={16} /></a><span>{t.reviewHint}</span></div></div></section>

      <section className="reservation-section section-padding" id="reservation"><div className="container reservation-grid"><div className="reservation-intro"><div className="section-eyebrow">03 <span /> {t.reserve}</div><h2>{t.bookIntro}</h2><p>{t.bookText} {siteCopy[language].serviceNote}</p><div className="reservation-details"><span><Clock3 size={17} /> {siteCopy[language].dayHours}</span><span><CalendarDays size={17} /> {siteCopy[language].closed}</span></div></div><div className="reservation-card">{submitted ? <div className="submitted-state"><div className="success-icon"><Check size={24} /></div><h3>{t.thanks}</h3><p>{siteCopy[language].requestSent}</p><button className="text-link" onClick={() => setSubmitted(false)}>{siteCopy[language].anotherRequest} <ArrowRight size={16} /></button></div> : <form onSubmit={handleReservation}><div className="form-topline"><span>{formLabels[language].request}</span><span>03 / 04</span></div><label>{formLabels[language].name}<input required name="name" placeholder={t.namePlaceholder} /></label><div className="form-row"><label>{formLabels[language].date}<input required type="date" name="date" min={new Date().toISOString().slice(0, 10)} value={reservationDate} onChange={event => { setReservationDate(event.target.value); setReservationTime(""); }} /></label><label>{formLabels[language].time}<select required name="time" value={reservationTime} onChange={event => setReservationTime(event.target.value)}><option value="">{isMonday ? t.closedMonday : !reservationDate ? formLabels[language].chooseDate : formLabels[language].chooseTime}</option>{availableTimes.map(slot => <option key={slot.serviceTime} value={slot.serviceTime}>{slot.serviceTime}</option>)}</select></label></div><div className="form-row"><label>{formLabels[language].guests}<select required name="guests" defaultValue=""><option value="" disabled>{formLabels[language].chooseGuests}</option>{[1,2,3,4,5,6,7,8,9,10].map(value => <option key={value} value={value}>{value} {value > 1 ? siteCopy[language].people : siteCopy[language].person}</option>)}</select></label><label>{formLabels[language].phone}<input required name="phone" placeholder="20 217 090" /></label></div><label>{formLabels[language].email}<input type="email" name="email" placeholder={t.emailPlaceholder} /></label><label>{formLabels[language].note}<input name="notes" placeholder={t.notePlaceholder} /></label><button className="button button-dark button-wide" type="submit" disabled={reservationMutation.isPending}>{reservationMutation.isPending ? t.sending : formLabels[language].send} <ArrowRight size={16} /></button><p className="form-disclaimer">{formLabels[language].disclaimer}</p></form>}</div></div></section>

      <section className="visit-section" id="visiter"><div className="container visit-grid"><div className="visit-copy"><div className="section-eyebrow">04 <span /> {t.find}</div><h2>{t.findUs}</h2><p>{siteCopy[language].locationCopy}</p><div className="visit-actions"><a className="button button-light" href={mapLink} target="_blank" rel="noreferrer">{t.maps} <MapPin size={16} /></a><a className="text-link text-link-light" href="tel:+21620217090">{t.call} <Phone size={15} /></a></div></div><div className="visit-card"><div className="visit-card-top"><span>Per Voi</span><span className="open-pill"><span /> {siteCopy[language].open}</span></div><div className="visit-address"><MapPin size={20} /><div><strong>{t.sahloulSousse}</strong><span>+216 20 217 090</span></div></div><div className="visit-hours"><span>{siteCopy[language].days}</span><strong>12:00 — 23:00</strong></div><div className="visit-socials"><a href="https://www.instagram.com/pervoi_restaurant/" target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={18} /></a><a href={whatsappLink} target="_blank" rel="noreferrer" aria-label="WhatsApp"><MessageCircle size={18} /></a></div></div></div></section>

      <footer className="footer"><div className="container footer-inner"><div className="footer-brand"><span className="brand-mark">PV</span><span className="brand-wordmark">Per Voi</span></div><p>{t.cuisine}</p><div className="footer-links"><span className="footer-copy">{t.copyright}</span></div></div></footer>
      <a className="whatsapp-float" href={whatsappLink} target="_blank" rel="noreferrer" aria-label="WhatsApp"><MessageCircle size={23} /><span>{t.whatsapp}</span></a>
      {cartCount > 0 && <button className="cart-float" onClick={() => setOrderOpen(true)}><ShoppingBag size={18} /><span>{cartCount} {cartCount > 1 ? t.itemsWord : t.itemWord}</span><strong>{cartTotal} DT</strong></button>}
      {orderOpen && <div className="order-overlay" role="dialog" aria-modal="true" aria-label={formLabels[language].yourOrder}><div className="order-panel"><div className="order-panel-head"><div><span className="eyebrow-label">{t.takeawayHeader}</span><h2>{formLabels[language].yourOrder}</h2></div><button className="icon-button" onClick={() => setOrderOpen(false)} aria-label={siteCopy[language].close}><X /></button></div>{orderSubmitted ? <div className="submitted-state"><div className="success-icon"><Check size={24} /></div><h3>{siteCopy[language].orderReceived}</h3><p>{siteCopy[language].orderReceivedCopy}</p><button className="text-link" onClick={() => { setOrderSubmitted(false); setOrderOpen(false); }}>{siteCopy[language].backMenu} <ArrowRight size={16} /></button></div> : <form onSubmit={handleOrder} noValidate><div className="order-lines">{cartLines.map(line => <div className="order-line" key={line.item.id}><div><strong>{translateMenuText(language, line.item.name)}</strong><span>{line.item.priceDt} DT {t.unit}</span></div><div className="quantity-control"><button type="button" onClick={() => changeQuantity(line.item.id, -1)} aria-label="Diminuer"><Minus size={13} /></button><span>{line.quantity}</span><button type="button" onClick={() => changeQuantity(line.item.id, 1)} aria-label="Augmenter"><Plus size={13} /></button></div></div>)}</div><div className="order-total"><span>{formLabels[language].total}</span><strong>{cartTotal} DT</strong></div><label>{formLabels[language].name}<input value={customerName} onChange={event => setCustomerName(event.target.value)} placeholder={t.namePlaceholder} /></label><label>{formLabels[language].phone}<input value={phone} onChange={event => setPhone(event.target.value)} placeholder="20 217 090" /></label><div className="form-row"><label>{formLabels[language].order}<select value={orderType} onChange={event => setOrderType(event.target.value as "pickup" | "delivery")}><option value="pickup">{formLabels[language].pickup}</option><option value="delivery">{formLabels[language].delivery}</option></select></label><label>{formLabels[language].address}{orderType === "delivery" ? <input value={address} onChange={event => setAddress(event.target.value)} placeholder={t.addressPlaceholder} /> : <input value={t.addressDefault} readOnly />}</label></div><label>{formLabels[language].note}<input value={orderNotes} onChange={event => setOrderNotes(event.target.value)} placeholder={t.kitchenNotePlaceholder} /></label><button className="button button-dark button-wide" type="submit" disabled={orderMutation.isPending}>{orderMutation.isPending ? t.sending : formLabels[language].order} <ArrowRight size={16} /></button><p className="form-disclaimer">{siteCopy[language].orderNote}</p></form>}</div></div>}
    </main>
  );
}
