export interface BeverageIngredient {
  name: string;
  quantity: number;
  unit: 'g' | 'ml' | 'pc/s';
  unitPrice: number;
  unitPriceUnit: '/kg' | '/l' | '/pc';
  cost: number;
}

export interface BeverageRecipe {
  id: string;
  name: string;
  category: 'coffee_hot' | 'coffee_iced' | 'milktea' | 'fruittea' | 'blended_frappe' | 'fruit_shake_juice' | 'drip';
  categoryLabel: string;
  size: string;
  isIntroSalesLeader?: boolean;
  description: string;
  primaryIngredients: BeverageIngredient[];
  secondaryIngredients: BeverageIngredient[];
  heatAndUtilities: number;
  recipeCost: number;
  packagingCost: number;
  laborCost: number;
  equipmentDepreciation: number;
  miscCost: number;
  totalCost: number;
  markup: number;
  walkinPrice: number;
  walkinNetProfit: number;
  foodPandaPrice: number;
  cogsRatio: number;
  baristaNotes: string[];
  preparationSteps: string[];
}

export const BARISTA_GOLDEN_RULES = [
  {
    number: 1,
    title: "The Barista Milliliter Formula (Unit Costing)",
    tagalogTitle: "Paano Kunin Ang Presyo ng Hindi Per Kilo / Per Litro",
    content: "Halimbawa sa Vanilla Extract o Syrup na ₱345 para sa 475ml na bote: Divide 345 / 475 = ₱0.7263 per ml. I-multiply sa 1,000 para makuha ang presyo per litro = ₱726.32/L. Gawin itong ₱750/L sa iyong costing sheet para may 3% buffer sa tapon at spillage.",
    icon: "calculator"
  },
  {
    number: 2,
    title: "COGS Guardrail: Keep Food Cost Below 35%",
    tagalogTitle: "Kontrolin ang Cost of Goods Sold",
    content: "Sa Milk Tea at Kape, ang Food Cost ay dapat nasa 25% hanggang 35% lang ng iyong Walk-in SRP. Kapag lumampas sa 40%, kakainin ng upa, kuryente, at yelo ang iyong kikitain.",
    icon: "percent"
  },
  {
    number: 3,
    title: "The 30% Food Delivery App Protection Formula",
    tagalogTitle: "Bakit Nalulugi sa FoodPanda at GrabFood Kung Walk-in SRP ang Benta?",
    content: "Ang FoodPanda ay may 30% merchant commission plus 5% promo/discount fee. Kung ang Walk-in SRP mo ay ₱135, ang Panda Price mo ay dapat: ₱135 ÷ (1 - 0.30 - 0.05) = ₱212.63. Sa ganitong computation, mananatiling buo ang iyong ₱92.50 net profit kahit kumuha ang rider at app ng komisyon.",
    icon: "trending-up"
  },
  {
    number: 4,
    title: "The Golden Labor Separation Rule",
    tagalogTitle: "Wag na Wag Gagawing Baon ang Pera ng Negosyo",
    content: "Ang totoong personal na kita mo sa bawat baso ay ang iyong 'Labor Allocation' (₱7.50 - ₱20 per cup). Ang natitirang Net Profit ay mananatili sa bangko ng shop para sa replenishment, buffer sa masisirang blender, at business expansion. Pag tumataas ang benta, tsaka mo lang itataas ang labor mo.",
    icon: "shield-alert"
  },
  {
    number: 5,
    title: "Direct Dairy & Powder Supplier Hunting",
    tagalogTitle: "Huwag Bumili sa Supermarket Retail",
    content: "Ang freshmilk sa supermarket ay ₱140/L, ngunit sa wholesale dairy distributor o UHT institutional pack ay ₱90/L lang (makakatipid ka agad ng ₱50 kada litro!). Ang bawas sa puhunan ay direktang dagdag sa iyong net profit.",
    icon: "store"
  }
];

export const COFFEE_MILKTEA_RECIPES: BeverageRecipe[] = [
  // 1. Medium Milk Tea 16oz (The #1 Intro Sales Hero)
  {
    id: 'intro-milktea-16oz',
    name: 'Classic Brown Sugar Pearl Milk Tea',
    category: 'milktea',
    categoryLabel: 'Milk Tea & Pearls',
    size: '16oz',
    isIntroSalesLeader: true,
    description: 'Ang pambansang intro sales leader! Mataas ang margin (68.5% net profit), mabilis gawin (under 90 seconds), at paboritong panimulang order ng mga walk-in at food delivery customers.',
    primaryIngredients: [
      { name: 'Brewed Assam/Black Tea Base', quantity: 100, unit: 'ml', unitPrice: 15, unitPriceUnit: '/l', cost: 1.50 },
      { name: 'Non-Dairy Creamer (High Grade)', quantity: 20, unit: 'g', unitPrice: 250, unitPriceUnit: '/kg', cost: 5.00 },
      { name: 'Signature Milk Tea Flavor Powder', quantity: 20, unit: 'g', unitPrice: 500, unitPriceUnit: '/kg', cost: 10.00 },
      { name: 'Cooked Brown Sugar Tapioca Pearls', quantity: 15, unit: 'g', unitPrice: 150, unitPriceUnit: '/kg', cost: 2.25 },
    ],
    secondaryIngredients: [
      { name: 'Liquid Fructose / Cane Syrup', quantity: 15, unit: 'ml', unitPrice: 150, unitPriceUnit: '/l', cost: 2.25 },
      { name: 'Tube/Tube Block Ice', quantity: 100, unit: 'g', unitPrice: 10, unitPriceUnit: '/kg', cost: 1.00 },
    ],
    heatAndUtilities: 3.00,
    recipeCost: 25.00,
    packagingCost: 10.00,
    laborCost: 7.50,
    equipmentDepreciation: 0,
    miscCost: 0,
    totalCost: 42.50,
    markup: 92.50,
    walkinPrice: 135.00,
    walkinNetProfit: 92.50,
    foodPandaPrice: 212.63,
    cogsRatio: 0.3148,
    baristaNotes: [
      "Brew Black Tea at 85°C for exactly 10 minutes. Huwag i-squeeze ang tea bag para hindi pumait.",
      "Tunawin ang creamer at powder sa mainit na tea base gamit ang shaker bago lagyan ng yelo.",
      "Ang 15g tapioca pearls ay dapat panatilihin sa brown sugar syrup na maligamgam para manatiling chewy."
    ],
    preparationSteps: [
      "I-scoop ang 15g cooked brown sugar pearls sa ilalim ng 16oz cup at i-coat ang gilid ng baso.",
      "Sa cocktail shaker, ilagay ang 100ml mainit na brewed tea base.",
      "Idagdag ang 20g creamer at 20g flavor powder. Haluing mabuti hanggang matunaw.",
      "Idagdag ang 15ml fructose at punuin ng 100g yelo.",
      "I-shake nang malakas sa loob ng 10-15 segundo hanggang lumamig at mag-froth.",
      "Isalin sa baso, i-seal gamit ang cup sealer o lagyan ng dome lid at boba straw."
    ]
  },

  // 2. Large Milk Tea 22oz
  {
    id: 'milktea-22oz',
    name: 'Classic Brown Sugar Pearl Milk Tea (Large)',
    category: 'milktea',
    categoryLabel: 'Milk Tea & Pearls',
    size: '22oz',
    isIntroSalesLeader: false,
    description: 'Upgraded 22oz thirst-quencher. ₱100.38 net profit kada baso sa walk-in customers.',
    primaryIngredients: [
      { name: 'Brewed Assam/Black Tea Base', quantity: 220, unit: 'ml', unitPrice: 15, unitPriceUnit: '/l', cost: 3.30 },
      { name: 'Non-Dairy Creamer (High Grade)', quantity: 30, unit: 'ml', unitPrice: 230, unitPriceUnit: '/kg', cost: 6.90 },
      { name: 'Signature Milk Tea Flavor Powder', quantity: 30, unit: 'g', unitPrice: 500, unitPriceUnit: '/kg', cost: 15.00 },
      { name: 'Cooked Brown Sugar Tapioca Pearls', quantity: 20, unit: 'g', unitPrice: 150, unitPriceUnit: '/kg', cost: 3.00 },
    ],
    secondaryIngredients: [
      { name: 'Liquid Fructose / Cane Syrup', quantity: 20, unit: 'ml', unitPrice: 150, unitPriceUnit: '/l', cost: 3.00 },
      { name: 'Tube/Tube Block Ice', quantity: 120, unit: 'g', unitPrice: 10, unitPriceUnit: '/kg', cost: 1.20 },
    ],
    heatAndUtilities: 5.00,
    recipeCost: 37.40,
    packagingCost: 10.00,
    laborCost: 11.22,
    equipmentDepreciation: 0,
    miscCost: 0,
    totalCost: 58.62,
    markup: 101.00,
    walkinPrice: 159.00,
    walkinNetProfit: 100.38,
    foodPandaPrice: 250.42,
    cogsRatio: 0.3687,
    baristaNotes: [
      "Perpektong sweetness balance: 20ml fructose para sa 220ml tea base.",
      "Mataas ang margin dahil ang tea base cost ay ₱3.30 lamang."
    ],
    preparationSteps: [
      "Ilagay ang 20g chewy pearls sa 22oz baso.",
      "Tunawin ang creamer at powder sa 220ml mainit na tea base.",
      "Ihalo ang 20ml fructose at 120g yelo sa shaker.",
      "I-shake nang masigla sa loob ng 15 segundo at isalin sa baso."
    ]
  },

  // 3. 16oz Ice Coffee Basic (The #2 Intro Sales Hero)
  {
    id: 'intro-ice-coffee-16oz',
    name: 'Iced Caramel Cafe Latte / Macchiato',
    category: 'coffee_iced',
    categoryLabel: 'Iced Coffee Specials',
    size: '16oz',
    isIntroSalesLeader: true,
    description: 'Ang best-selling iced coffee sa mga coffee cart at cafes. Espresso kick na may Torani caramel syrup at fresh milk, nagbibigay ng ₱64.43 net profit kada baso.',
    primaryIngredients: [
      { name: 'Freshly Ground Espresso Beans (Arabica/Robusta blend)', quantity: 18, unit: 'g', unitPrice: 1550, unitPriceUnit: '/kg', cost: 27.90 },
      { name: 'Chilled Fresh Milk', quantity: 120, unit: 'ml', unitPrice: 140, unitPriceUnit: '/l', cost: 16.80 },
      { name: 'Torani Caramel/Vanilla Flavored Syrup', quantity: 25, unit: 'ml', unitPrice: 795, unitPriceUnit: '/l', cost: 19.88 },
    ],
    secondaryIngredients: [
      { name: 'Purified Ice Cubes', quantity: 100, unit: 'g', unitPrice: 10, unitPriceUnit: '/kg', cost: 1.00 },
      { name: 'Whipped Cream Topping (Optional)', quantity: 10, unit: 'ml', unitPrice: 280, unitPriceUnit: '/l', cost: 0.00 },
    ],
    heatAndUtilities: 5.00,
    recipeCost: 70.58,
    packagingCost: 10.00,
    laborCost: 10.00,
    equipmentDepreciation: 0,
    miscCost: 0,
    totalCost: 90.58,
    markup: 65.00,
    walkinPrice: 155.00,
    walkinNetProfit: 64.43,
    foodPandaPrice: 244.13,
    cogsRatio: 0.5844,
    baristaNotes: [
      "Extract double shot espresso (approx 36-40ml liquid output) within 25-28 seconds.",
      "Syrup first: ibuhos ang Torani syrup sa baso, lagyan ng cold milk, punuin ng yelo, at dahan-dahang i-float ang mainit na espresso shot para sa signature layered aesthetic."
    ],
    preparationSteps: [
      "I-tamp ang 18g espresso grounds at i-extract ang double shot espresso sa shot glass.",
      "Sa 16oz cup, ilagay ang 25ml Torani syrup.",
      "Ibuhos ang 120ml malamig na fresh milk at haluin saglit gamit ang bar spoon.",
      "Punuin ang baso ng 100g yelo.",
      "Dahan-dahang ibuhos ang espresso shot sa ibabaw ng yelo para lumabas ang layered coffee effect."
    ]
  },

  // 4. 22oz Ice Coffee Basic
  {
    id: 'ice-coffee-22oz-basic',
    name: 'Iced Cafe Latte (Large 22oz)',
    category: 'coffee_iced',
    categoryLabel: 'Iced Coffee Specials',
    size: '22oz',
    isIntroSalesLeader: false,
    description: 'Malaking 22oz iced coffee para sa matagalang pag-aaral o work-from-home sessions. ₱81.23 net profit sa bawat order.',
    primaryIngredients: [
      { name: 'Freshly Ground Espresso Beans', quantity: 17, unit: 'g', unitPrice: 1550, unitPriceUnit: '/kg', cost: 26.35 },
      { name: 'Chilled Fresh Milk (Wholesale)', quantity: 140, unit: 'ml', unitPrice: 90, unitPriceUnit: '/l', cost: 12.60 },
      { name: 'Torani Flavored Syrup', quantity: 35, unit: 'ml', unitPrice: 795, unitPriceUnit: '/l', cost: 27.83 },
    ],
    secondaryIngredients: [
      { name: 'Purified Ice Cubes', quantity: 200, unit: 'g', unitPrice: 10, unitPriceUnit: '/kg', cost: 2.00 },
    ],
    heatAndUtilities: 5.00,
    recipeCost: 73.78,
    packagingCost: 10.00,
    laborCost: 10.00,
    equipmentDepreciation: 0,
    miscCost: 0,
    totalCost: 93.78,
    markup: 81.22,
    walkinPrice: 175.00,
    walkinNetProfit: 81.23,
    foodPandaPrice: 275.63,
    cogsRatio: 0.5359,
    baristaNotes: [
      "Gumamit ng wholesale dairy (₱90/L) para mapababa ang milk cost sa ₱12.60 sa halip na ₱19.60.",
      "Tamang tamis: 35ml syrup para sa 22oz baso."
    ],
    preparationSteps: [
      "Mag-brew ng double espresso mula sa 17g freshly ground beans.",
      "Ilagay ang 35ml syrup sa ilalim ng 22oz cup.",
      "Ibuhos ang 140ml fresh milk.",
      "Punuin ng 200g yelo at i-pour ang espresso sa tuktok."
    ]
  },

  // 5. 12oz Ice Coffee Beginner Starter Pack
  {
    id: 'ice-coffee-12oz-starter',
    name: '12oz Pop-up Kiosk Iced Coffee',
    category: 'coffee_iced',
    categoryLabel: 'Iced Coffee Specials',
    size: '12oz',
    isIntroSalesLeader: false,
    description: 'Ang mabilisang pang-kiosk na 12oz formula na binigyang-diin sa Barista Notes. Puhunang ₱37.15 lang sa sangkap at ₱20 labor, benta sa ₱107.15.',
    primaryIngredients: [
      { name: 'Dark Roast Coffee Grounds (Moka pot / Espresso)', quantity: 10, unit: 'g', unitPrice: 800, unitPriceUnit: '/kg', cost: 8.00 },
      { name: 'Fresh Milk', quantity: 60, unit: 'ml', unitPrice: 90, unitPriceUnit: '/l', cost: 5.40 },
      { name: 'Flavor Extract / Sauce', quantity: 10, unit: 'ml', unitPrice: 500, unitPriceUnit: '/l', cost: 5.00 },
      { name: 'Sugar Syrup', quantity: 25, unit: 'ml', unitPrice: 150, unitPriceUnit: '/l', cost: 3.75 },
    ],
    secondaryIngredients: [
      { name: '12oz Cup & Straw', quantity: 1, unit: 'pc/s', unitPrice: 12, unitPriceUnit: '/pc', cost: 12.00 },
    ],
    heatAndUtilities: 3.00,
    recipeCost: 37.15,
    packagingCost: 0.00,
    laborCost: 20.00,
    equipmentDepreciation: 0,
    miscCost: 0,
    totalCost: 57.15,
    markup: 50.00,
    walkinPrice: 107.15,
    walkinNetProfit: 50.00,
    foodPandaPrice: 168.00,
    cogsRatio: 0.5333,
    baristaNotes: [
      "Eto ang resipe mula sa 'PAKI BASA MUNA' tutorial tab ng barista notes.",
      "Ang ₱20 per cup ay direct labor income mo bilang barista at may ₱50 net profit pa ang negosyo."
    ],
    preparationSteps: [
      "I-brew ang 10g coffee grounds sa 60ml mainit na tubig (ratio 1:6).",
      "Haluin ang 10ml flavor extract at 25ml syrup sa brewed coffee.",
      "Ibuhos ang 60ml fresh milk at lagyan ng yelo."
    ]
  },

  // 6. Drip Coffee Single-Origin Kiosk Pack
  {
    id: 'drip-coffee-single',
    name: 'Artisan Pour-Over Drip Coffee Bag',
    category: 'drip',
    categoryLabel: 'Drip Coffee Pouches',
    size: 'Single Cup',
    isIntroSalesLeader: false,
    description: 'Grab-and-go artisan drip bag. Walang mamahaling espresso machine na kailangan — ₱13.50 lang ang kape, benta sa ₱57.50.',
    primaryIngredients: [
      { name: 'Specialty Ground Coffee', quantity: 15, unit: 'g', unitPrice: 900, unitPriceUnit: '/kg', cost: 13.50 },
    ],
    secondaryIngredients: [
      { name: 'Organic Sugar Packet', quantity: 1, unit: 'pc/s', unitPrice: 5, unitPriceUnit: '/pc', cost: 5.00 },
      { name: 'Hanging Ear Drip Filter Bag & Foil', quantity: 1, unit: 'pc/s', unitPrice: 3.5, unitPriceUnit: '/pc', cost: 3.50 },
    ],
    heatAndUtilities: 3.00,
    recipeCost: 25.00,
    packagingCost: 10.00,
    laborCost: 2.50,
    equipmentDepreciation: 0,
    miscCost: 0,
    totalCost: 37.50,
    markup: 20.00,
    walkinPrice: 57.50,
    walkinNetProfit: 20.00,
    foodPandaPrice: 90.56,
    cogsRatio: 0.6522,
    baristaNotes: [
      "Perpekto para sa office supply packages, souvenirs, at takeout bundles.",
      "Pre-packed sa nitrogen o sealed pouch para manatiling fresh hanggang 6 buwan."
    ],
    preparationSteps: [
      "Timbangin ang 15g medium-coarse ground coffee.",
      "Ilagay sa hanging ear filter bag at i-heat seal ang protective outer pouch.",
      "Para sa customer: buksan ang bag, isabit sa baso, at dahan-dahang buhusan ng 180ml 92°C na tubig."
    ]
  },

  // 7. Small Hot 8oz Non-Coffee
  {
    id: 'small-hot-noncoffee-8oz',
    name: 'Hot Belgian Chocolate / Matcha Latte (8oz)',
    category: 'coffee_hot',
    categoryLabel: 'Hot Classics & Non-Coffee',
    size: '8oz HOT',
    isIntroSalesLeader: false,
    description: 'Silky smooth comfort beverage para sa rainy days at malamig na umaga.',
    primaryIngredients: [
      { name: 'Fresh Milk (Full Cream)', quantity: 200, unit: 'ml', unitPrice: 140, unitPriceUnit: '/l', cost: 28.00 },
      { name: 'Dark Chocolate / Ceremonial Matcha Sauce', quantity: 20, unit: 'ml', unitPrice: 680, unitPriceUnit: '/l', cost: 13.60 },
    ],
    secondaryIngredients: [
      { name: 'Muscovado Sugar', quantity: 1, unit: 'pc/s', unitPrice: 3, unitPriceUnit: '/pc', cost: 3.00 },
    ],
    heatAndUtilities: 5.00,
    recipeCost: 49.60,
    packagingCost: 7.00,
    laborCost: 4.96,
    equipmentDepreciation: 0,
    miscCost: 0,
    totalCost: 61.56,
    markup: 38.44,
    walkinPrice: 100.00,
    walkinNetProfit: 38.44,
    foodPandaPrice: 152.50,
    cogsRatio: 0.6156,
    baristaNotes: [
      "Steam milk to 65°C para lumabas ang natural sweetness at velvety microfoam.",
      "Haluin muna ang sauce sa kaunting mainit na gatas bago ibuhos ang buong steam jug."
    ],
    preparationSteps: [
      "Ilagay ang 20ml chocolate o matcha sauce sa 8oz hot cup.",
      "Mag-steam ng 200ml fresh milk gamit ang steam wand hanggang magkaroon ng makintab na microfoam.",
      "Magbuhos ng kaunting steamed milk at haluin gamit ang mini whisk hanggang mag-emulsify.",
      "I-pour ang natitirang milk na may subtle latte art sa ibabaw."
    ]
  },

  // 8. Med Hot 12oz Non-Coffee
  {
    id: 'med-hot-noncoffee-12oz',
    name: 'Hot Belgian Chocolate / Matcha Latte (12oz)',
    category: 'coffee_hot',
    categoryLabel: 'Hot Classics & Non-Coffee',
    size: '12oz HOT',
    isIntroSalesLeader: false,
    description: 'Medium sized hot comforting chocolate or rich matcha latte.',
    primaryIngredients: [
      { name: 'Fresh Milk (Full Cream)', quantity: 250, unit: 'ml', unitPrice: 140, unitPriceUnit: '/l', cost: 35.00 },
      { name: 'Rich Flavor Sauce', quantity: 30, unit: 'ml', unitPrice: 680, unitPriceUnit: '/l', cost: 20.40 },
    ],
    secondaryIngredients: [],
    heatAndUtilities: 10.00,
    recipeCost: 65.40,
    packagingCost: 7.00,
    laborCost: 6.54,
    equipmentDepreciation: 0,
    miscCost: 0,
    totalCost: 78.94,
    markup: 46.06,
    walkinPrice: 125.00,
    walkinNetProfit: 46.06,
    foodPandaPrice: 196.88,
    cogsRatio: 0.6014,
    baristaNotes: ["Higher milk volume nangangailangan ng 30ml sauce para manatiling buo ang lasa."],
    preparationSteps: [
      "Ilagay ang 30ml premium sauce sa 12oz double wall cup.",
      "I-steam ang 250ml fresh milk sa 65°C.",
      "Haluin nang maigi at buhusan ng silky milk foam."
    ]
  },

  // 9. 16oz Non-Coffee Milk-based Iced
  {
    id: 'noncoffee-iced-16oz',
    name: 'Iced Matcha / Chocolate Milk Cream (16oz)',
    category: 'milktea',
    categoryLabel: 'Milk-Based Cold Creations',
    size: '16oz',
    isIntroSalesLeader: false,
    description: 'Rich and creamy non-coffee refresher. ₱87.80 net profit kada baso.',
    primaryIngredients: [
      { name: 'Fresh Milk', quantity: 150, unit: 'ml', unitPrice: 140, unitPriceUnit: '/l', cost: 21.00 },
      { name: 'Specialty Flavor Powder', quantity: 25, unit: 'g', unitPrice: 500, unitPriceUnit: '/kg', cost: 12.50 },
      { name: 'Sweetened Condensed Milk Syrup', quantity: 30, unit: 'ml', unitPrice: 150, unitPriceUnit: '/l', cost: 4.50 },
    ],
    secondaryIngredients: [
      { name: 'Tube Ice', quantity: 100, unit: 'g', unitPrice: 10, unitPriceUnit: '/kg', cost: 1.00 },
    ],
    heatAndUtilities: 5.00,
    recipeCost: 44.00,
    packagingCost: 10.00,
    laborCost: 13.20,
    equipmentDepreciation: 0,
    miscCost: 0,
    totalCost: 67.20,
    markup: 65.00,
    walkinPrice: 155.00,
    walkinNetProfit: 87.80,
    foodPandaPrice: 244.13,
    cogsRatio: 0.4335,
    baristaNotes: ["I-dissolve ang powder sa 30ml warm water o gatas bago ihalo sa malamig na gatas."],
    preparationSteps: [
      "Tunawin ang 25g powder sa kaunting mainit na tubig.",
      "Ihalo ang 30ml milk syrup at 150ml malamig na gatas.",
      "Lagyan ng 100g yelo at i-serve nang malamig."
    ]
  },

  // 10. 22oz Non-Coffee Milk-based Iced
  {
    id: 'noncoffee-iced-22oz',
    name: 'Iced Matcha / Chocolate Milk Cream (22oz)',
    category: 'milktea',
    categoryLabel: 'Milk-Based Cold Creations',
    size: '22oz',
    isIntroSalesLeader: false,
    description: 'Giant 22oz size non-coffee iced drink with high margin.',
    primaryIngredients: [
      { name: 'Fresh Milk', quantity: 200, unit: 'ml', unitPrice: 140, unitPriceUnit: '/l', cost: 28.00 },
      { name: 'Specialty Flavor Powder', quantity: 30, unit: 'g', unitPrice: 500, unitPriceUnit: '/kg', cost: 15.00 },
      { name: 'Sweetened Milk Syrup', quantity: 30, unit: 'ml', unitPrice: 150, unitPriceUnit: '/l', cost: 4.50 },
    ],
    secondaryIngredients: [
      { name: 'Tube Ice', quantity: 100, unit: 'g', unitPrice: 10, unitPriceUnit: '/kg', cost: 1.00 },
    ],
    heatAndUtilities: 5.00,
    recipeCost: 53.50,
    packagingCost: 5.00,
    laborCost: 16.05,
    equipmentDepreciation: 0,
    miscCost: 0,
    totalCost: 74.55,
    markup: 70.00,
    walkinPrice: 170.00,
    walkinNetProfit: 95.45,
    foodPandaPrice: 267.75,
    cogsRatio: 0.4385,
    baristaNotes: ["Napakataas ng gross margin sa 22oz dahil sa mabisang milk syrup ratio."],
    preparationSteps: [
      "I-dissolve ang 30g powder sa 50ml warm milk.",
      "Idagdag ang 30ml milk syrup at natitirang gatas.",
      "Punuin ng yelo at i-serve."
    ]
  },

  // 11. Small Hot 8oz Espresso Latte
  {
    id: 'small-hot-latte-8oz',
    name: 'Caffe Latte / Flat White (8oz HOT)',
    category: 'coffee_hot',
    categoryLabel: 'Hot Classics & Non-Coffee',
    size: '8oz HOT',
    isIntroSalesLeader: false,
    description: 'Classic double espresso with velvety steamed milk. The benchmark recipe for any barista.',
    primaryIngredients: [
      { name: 'Specialty Espresso Beans', quantity: 18, unit: 'g', unitPrice: 1550, unitPriceUnit: '/kg', cost: 27.90 },
      { name: 'Steamed Fresh Milk', quantity: 200, unit: 'ml', unitPrice: 140, unitPriceUnit: '/l', cost: 28.00 },
    ],
    secondaryIngredients: [
      { name: 'Sugar stick', quantity: 1, unit: 'pc/s', unitPrice: 3, unitPriceUnit: '/pc', cost: 3.00 },
    ],
    heatAndUtilities: 5.00,
    recipeCost: 63.90,
    packagingCost: 7.00,
    laborCost: 12.78,
    equipmentDepreciation: 0,
    miscCost: 0,
    totalCost: 83.68,
    markup: 50.00,
    walkinPrice: 133.68,
    walkinNetProfit: 50.00,
    foodPandaPrice: 203.86,
    cogsRatio: 0.6260,
    baristaNotes: [
      "18g dose in -> 36g liquid espresso out in 27 seconds.",
      "Steam milk to 60-65°C with microfoam like wet paint."
    ],
    preparationSteps: [
      "Grind 18g espresso beans, distribute, tamp evenly.",
      "Extract double shot into pre-warmed 8oz cup.",
      "Steam 200ml milk creating fine microfoam.",
      "Pour with gentle heart or tulip latte art."
    ]
  },

  // 12. Small Hot 8oz Flavored Latte
  {
    id: 'small-hot-flavored-latte-8oz',
    name: 'Spanish Latte / Mocha (8oz HOT)',
    category: 'coffee_hot',
    categoryLabel: 'Hot Classics & Non-Coffee',
    size: '8oz HOT',
    isIntroSalesLeader: false,
    description: 'Double espresso infused with condensed sauce or rich cocoa.',
    primaryIngredients: [
      { name: 'Specialty Espresso Beans', quantity: 18, unit: 'g', unitPrice: 1550, unitPriceUnit: '/kg', cost: 27.90 },
      { name: 'Steamed Fresh Milk', quantity: 200, unit: 'ml', unitPrice: 140, unitPriceUnit: '/l', cost: 28.00 },
      { name: 'Flavored Sauce', quantity: 20, unit: 'ml', unitPrice: 680, unitPriceUnit: '/l', cost: 13.60 },
    ],
    secondaryIngredients: [],
    heatAndUtilities: 5.00,
    recipeCost: 74.50,
    packagingCost: 7.00,
    laborCost: 11.18,
    equipmentDepreciation: 0,
    miscCost: 0,
    totalCost: 92.68,
    markup: 40.00,
    walkinPrice: 132.68,
    walkinNetProfit: 40.00,
    foodPandaPrice: 202.00,
    cogsRatio: 0.6985,
    baristaNotes: ["Haluin ang sauce direkta sa mainit na espresso shot bago ibuhos ang steamed milk."],
    preparationSteps: [
      "Ilagay ang 20ml sauce sa ilalim ng baso.",
      "I-extract ang double shot espresso direkta sa ibabaw ng sauce at haluin.",
      "I-steam ang 200ml fresh milk at i-pour."
    ]
  },

  // 13. Med Hot 12oz Latte
  {
    id: 'med-hot-latte-12oz',
    name: 'Caffe Latte Classic (12oz HOT)',
    category: 'coffee_hot',
    categoryLabel: 'Hot Classics & Non-Coffee',
    size: '12oz HOT',
    isIntroSalesLeader: false,
    description: 'Comforting 12oz latte with balanced coffee sweetness and rich milk body.',
    primaryIngredients: [
      { name: 'Specialty Espresso Beans', quantity: 18, unit: 'g', unitPrice: 1550, unitPriceUnit: '/kg', cost: 27.90 },
      { name: 'Steamed Fresh Milk', quantity: 250, unit: 'ml', unitPrice: 140, unitPriceUnit: '/l', cost: 35.00 },
    ],
    secondaryIngredients: [],
    heatAndUtilities: 10.00,
    recipeCost: 72.90,
    packagingCost: 7.00,
    laborCost: 14.58,
    equipmentDepreciation: 0,
    miscCost: 0,
    totalCost: 94.48,
    markup: 60.52,
    walkinPrice: 155.00,
    walkinNetProfit: 60.52,
    foodPandaPrice: 244.13,
    cogsRatio: 0.5805,
    baristaNotes: ["18g double espresso holds up perfectly in 250ml milk."],
    preparationSteps: [
      "I-extract ang double shot espresso sa 12oz hot cup.",
      "I-steam ang 250ml fresh milk.",
      "I-pour at i-serve na may latte art."
    ]
  },

  // 14. Med Hot 12oz Flavored Latte
  {
    id: 'med-hot-flavored-latte-12oz',
    name: 'Caramel Macchiato / Mocha (12oz HOT)',
    category: 'coffee_hot',
    categoryLabel: 'Hot Classics & Non-Coffee',
    size: '12oz HOT',
    isIntroSalesLeader: false,
    description: '12oz rich flavored espresso indulgence.',
    primaryIngredients: [
      { name: 'Specialty Espresso Beans', quantity: 18, unit: 'g', unitPrice: 1550, unitPriceUnit: '/kg', cost: 27.90 },
      { name: 'Steamed Fresh Milk', quantity: 250, unit: 'ml', unitPrice: 140, unitPriceUnit: '/l', cost: 35.00 },
      { name: 'Gourmet Sauce', quantity: 30, unit: 'ml', unitPrice: 680, unitPriceUnit: '/l', cost: 20.40 },
    ],
    secondaryIngredients: [],
    heatAndUtilities: 5.00,
    recipeCost: 88.30,
    packagingCost: 8.00,
    laborCost: 17.66,
    equipmentDepreciation: 0,
    miscCost: 0,
    totalCost: 113.96,
    markup: 41.04,
    walkinPrice: 155.00,
    walkinNetProfit: 41.04,
    foodPandaPrice: 235.99,
    cogsRatio: 0.7352,
    baristaNotes: ["Drizzle additional caramel sauce on top of the milk foam."],
    preparationSteps: [
      "Ilagay ang 30ml gourmet sauce sa 12oz cup.",
      "I-extract ang 18g espresso sa ibabaw nito at i-swirl.",
      "I-steam ang 250ml gatas at buhusan ng foam."
    ]
  },

  // 15. 16oz Fruit Shake
  {
    id: 'fruit-shake-16oz',
    name: 'Real Fruit Shake (Mango / Strawberry 16oz)',
    category: 'fruit_shake_juice',
    categoryLabel: 'Fruit Shakes & Fresh Juices',
    size: '16oz',
    isIntroSalesLeader: false,
    description: 'Fresh tropical fruit blitzed with milk and ice. ₱81.00 net profit per cup.',
    primaryIngredients: [
      { name: 'Real Frozen/Fresh Fruit Slices', quantity: 165, unit: 'g', unitPrice: 300, unitPriceUnit: '/kg', cost: 49.50 },
      { name: 'Fresh Milk', quantity: 100, unit: 'ml', unitPrice: 140, unitPriceUnit: '/l', cost: 14.00 },
      { name: 'Milk Syrup', quantity: 30, unit: 'g', unitPrice: 120, unitPriceUnit: '/kg', cost: 3.60 },
      { name: 'Liquid Fructose', quantity: 30, unit: 'ml', unitPrice: 150, unitPriceUnit: '/l', cost: 4.50 },
    ],
    secondaryIngredients: [
      { name: 'Crushed Ice', quantity: 200, unit: 'g', unitPrice: 10, unitPriceUnit: '/kg', cost: 2.00 },
    ],
    heatAndUtilities: 5.00,
    recipeCost: 78.60,
    packagingCost: 10.00,
    laborCost: 15.72,
    equipmentDepreciation: 0,
    miscCost: 0,
    totalCost: 104.32,
    markup: 81.00,
    walkinPrice: 185.32,
    walkinNetProfit: 81.00,
    foodPandaPrice: 291.88,
    cogsRatio: 0.5629,
    baristaNotes: [
      "Gumamit ng hinog na mangga o pre-frozen fruit para creamy at hindi matubig ang shake.",
      "High-speed blender 25 seconds sa pulse mode para walang naiiwang tipak ng yelo."
    ],
    preparationSteps: [
      "Ilagay sa blender jar ang 165g prutas, 100ml gatas, 30g milk syrup, at 30ml fructose.",
      "Idagdag ang 200g yelo.",
      "I-blend sa high speed sa loob ng 25-30 segundo hanggang maging silky smooth.",
      "Isalin sa 16oz cup at lagyan ng dome lid."
    ]
  },

  // 16. 22oz Fruit Shake
  {
    id: 'fruit-shake-22oz',
    name: 'Real Fruit Shake (Mango / Strawberry 22oz)',
    category: 'fruit_shake_juice',
    categoryLabel: 'Fruit Shakes & Fresh Juices',
    size: '22oz',
    isIntroSalesLeader: false,
    description: 'Jumbo 22oz real fruit shake. Premium healthy choice for summer seasons.',
    primaryIngredients: [
      { name: 'Real Frozen/Fresh Fruit Slices', quantity: 185, unit: 'g', unitPrice: 300, unitPriceUnit: '/kg', cost: 55.50 },
      { name: 'Fresh Milk', quantity: 100, unit: 'ml', unitPrice: 140, unitPriceUnit: '/l', cost: 14.00 },
      { name: 'Milk Syrup', quantity: 40, unit: 'g', unitPrice: 120, unitPriceUnit: '/kg', cost: 4.80 },
      { name: 'Liquid Fructose', quantity: 30, unit: 'g', unitPrice: 150, unitPriceUnit: '/kg', cost: 4.50 },
    ],
    secondaryIngredients: [
      { name: 'Crushed Ice', quantity: 300, unit: 'g', unitPrice: 10, unitPriceUnit: '/kg', cost: 3.00 },
    ],
    heatAndUtilities: 10.00,
    recipeCost: 91.80,
    packagingCost: 10.00,
    laborCost: 18.36,
    equipmentDepreciation: 0,
    miscCost: 0,
    totalCost: 120.16,
    markup: 62.00,
    walkinPrice: 182.16,
    walkinNetProfit: 62.00,
    foodPandaPrice: 286.90,
    cogsRatio: 0.6596,
    baristaNotes: ["Requires 300g ice for the thick 22oz frosty texture."],
    preparationSteps: [
      "Ilagay ang 185g prutas, 100ml gatas, syrups, at 300g yelo sa blender.",
      "I-blend nang buo hanggang maging creamy.",
      "I-serve agad para hindi matunaw."
    ]
  },

  // 17. 16oz Fresh Calamansi Juice
  {
    id: 'calamansi-juice-16oz',
    name: 'Fresh Native Calamansi Juice Refresher (16oz)',
    category: 'fruit_shake_juice',
    categoryLabel: 'Fruit Shakes & Fresh Juices',
    size: '16oz',
    isIntroSalesLeader: false,
    description: 'High margin citrus staple! 10 pcs fresh calamansi with pure cane sweetener. ₱87.00 net profit per cup (puhunang ₱43 lang total).',
    primaryIngredients: [
      { name: 'Fresh Native Calamansi', quantity: 10, unit: 'pc/s', unitPrice: 2, unitPriceUnit: '/pc', cost: 20.00 },
      { name: 'Liquid Cane Fructose', quantity: 20, unit: 'ml', unitPrice: 150, unitPriceUnit: '/l', cost: 3.00 },
    ],
    secondaryIngredients: [
      { name: 'Purified Tube Ice', quantity: 200, unit: 'g', unitPrice: 10, unitPriceUnit: '/kg', cost: 2.00 },
    ],
    heatAndUtilities: 5.00,
    recipeCost: 30.00,
    packagingCost: 7.00,
    laborCost: 6.00,
    equipmentDepreciation: 0,
    miscCost: 0,
    totalCost: 43.00,
    markup: 84.00,
    walkinPrice: 130.00,
    walkinNetProfit: 87.00,
    foodPandaPrice: 204.75,
    cogsRatio: 0.3308,
    baristaNotes: [
      "Pigaan ng kalamansi gamit ang hand squeezer. Huwag pipisilin ang balat para hindi pumait ang katas.",
      "Ihalo ang honey o chia seeds para sa instant ₱20-₱30 add-on premium."
    ],
    preparationSteps: [
      "Hiwain at pigaan ang 10 pirasong sariwang kalamansi gamit ang salaan.",
      "Sa shaker, pagsamahin ang katas ng kalamansi, 20ml fructose, at 150ml malamig na tubig.",
      "Lagyan ng 200g yelo at i-shake nang masigla sa loob ng 10 segundo.",
      "Isalin sa 16oz baso at palamutian ng calamansi wheel."
    ]
  },

  // 18. 22oz Fresh Calamansi Juice
  {
    id: 'calamansi-juice-22oz',
    name: 'Fresh Native Calamansi Juice Refresher (22oz)',
    category: 'fruit_shake_juice',
    categoryLabel: 'Fruit Shakes & Fresh Juices',
    size: '22oz',
    isIntroSalesLeader: false,
    description: 'Giant 22oz cold citrus quencher. ₱97.00 net profit per cup.',
    primaryIngredients: [
      { name: 'Fresh Native Calamansi', quantity: 13, unit: 'pc/s', unitPrice: 2, unitPriceUnit: '/pc', cost: 26.00 },
      { name: 'Liquid Cane Fructose', quantity: 30, unit: 'ml', unitPrice: 150, unitPriceUnit: '/l', cost: 4.50 },
    ],
    secondaryIngredients: [
      { name: 'Purified Tube Ice', quantity: 200, unit: 'g', unitPrice: 10, unitPriceUnit: '/kg', cost: 2.00 },
    ],
    heatAndUtilities: 5.00,
    recipeCost: 37.50,
    packagingCost: 8.00,
    laborCost: 7.50,
    equipmentDepreciation: 0,
    miscCost: 0,
    totalCost: 53.00,
    markup: 97.00,
    walkinPrice: 150.00,
    walkinNetProfit: 97.00,
    foodPandaPrice: 236.25,
    cogsRatio: 0.3533,
    baristaNotes: ["Very cost-effective: ₱37.50 recipe cost yields ₱150 walk-in price."],
    preparationSteps: [
      "Pigaan ang 13 pirasong kalamansi.",
      "Ihalo sa 30ml fructose at 200ml tubig.",
      "I-shake kasama ang 200g yelo at i-serve."
    ]
  },

  // 19. 16oz Blended Frappe
  {
    id: 'blended-frappe-16oz',
    name: 'Ice-Blended Vanilla / Caramel Frappe (16oz)',
    category: 'blended_frappe',
    categoryLabel: 'Ice-Blended Frappes',
    size: '16oz',
    isIntroSalesLeader: false,
    description: 'Creamy frappe with frappe binder base and whipped cream crown. ₱89.86 net profit.',
    primaryIngredients: [
      { name: 'Fresh Milk', quantity: 100, unit: 'ml', unitPrice: 140, unitPriceUnit: '/l', cost: 14.00 },
      { name: 'Flavoring Powder / Sauce', quantity: 30, unit: 'g', unitPrice: 500, unitPriceUnit: '/kg', cost: 15.00 },
      { name: 'Commercial Frappe Base (Emulsifier)', quantity: 15, unit: 'g', unitPrice: 500, unitPriceUnit: '/kg', cost: 7.50 },
    ],
    secondaryIngredients: [
      { name: 'Crushed Ice', quantity: 300, unit: 'g', unitPrice: 10, unitPriceUnit: '/kg', cost: 3.00 },
      { name: 'Whipped Cream', quantity: 10, unit: 'ml', unitPrice: 280, unitPriceUnit: '/l', cost: 2.80 },
      { name: 'Whipped Topping / Drizzle', quantity: 50, unit: 'ml', unitPrice: 250, unitPriceUnit: '/l', cost: 12.50 },
    ],
    heatAndUtilities: 3.00,
    recipeCost: 57.80,
    packagingCost: 10.00,
    laborCost: 17.34,
    equipmentDepreciation: 0,
    miscCost: 0,
    totalCost: 85.14,
    markup: 89.86,
    walkinPrice: 175.00,
    walkinNetProfit: 89.86,
    foodPandaPrice: 275.63,
    cogsRatio: 0.4865,
    baristaNotes: [
      "Ang Frappe Base (15g) ang susi para hindi maghiwalay ang yelo at gatas habang iniinom.",
      "Whipped cream crown adds perceived value allowing ₱175 retail price."
    ],
    preparationSteps: [
      "Ilagay ang 100ml milk, 30g flavor, 15g frappe base, at 300g yelo sa blender.",
      "I-blend sa high speed sa loob ng 30 segundo.",
      "Isalin sa 16oz cup, i-swirl ang whipped cream, at lagyan ng drizzle syrup."
    ]
  },

  // 20. 22oz Blended Frappe
  {
    id: 'blended-frappe-22oz',
    name: 'Ice-Blended Vanilla / Caramel Frappe (22oz)',
    category: 'blended_frappe',
    categoryLabel: 'Ice-Blended Frappes',
    size: '22oz',
    isIntroSalesLeader: false,
    description: 'Ultimate blended frappe indulgence. ₱84.91 net profit.',
    primaryIngredients: [
      { name: 'Fresh Milk', quantity: 100, unit: 'ml', unitPrice: 140, unitPriceUnit: '/l', cost: 14.00 },
      { name: 'Flavoring Powder / Sauce', quantity: 40, unit: 'g', unitPrice: 500, unitPriceUnit: '/kg', cost: 20.00 },
      { name: 'Commercial Frappe Base', quantity: 25, unit: 'g', unitPrice: 500, unitPriceUnit: '/kg', cost: 12.50 },
    ],
    secondaryIngredients: [
      { name: 'Crushed Ice', quantity: 200, unit: 'g', unitPrice: 10, unitPriceUnit: '/kg', cost: 2.00 },
      { name: 'Whipped Cream', quantity: 10, unit: 'ml', unitPrice: 280, unitPriceUnit: '/l', cost: 2.80 },
      { name: 'Whipped Topping', quantity: 60, unit: 'ml', unitPrice: 250, unitPriceUnit: '/l', cost: 15.00 },
    ],
    heatAndUtilities: 3.00,
    recipeCost: 69.30,
    packagingCost: 10.00,
    laborCost: 20.79,
    equipmentDepreciation: 0,
    miscCost: 0,
    totalCost: 100.09,
    markup: 85.00,
    walkinPrice: 185.00,
    walkinNetProfit: 84.91,
    foodPandaPrice: 291.38,
    cogsRatio: 0.5410,
    baristaNotes: ["Blend on medium first 10 seconds then high 20 seconds."],
    preparationSteps: [
      "Ihalo ang ingredients at yelo sa blender.",
      "I-blend hanggang maging makinis ang texture.",
      "Lagyan ng whipped topping at i-serve."
    ]
  },

  // 21. 16oz Refreshing Fruit Tea
  {
    id: 'fruittea-16oz',
    name: 'Jasmine Green Fruit Tea w/ Popping Boba (16oz)',
    category: 'fruittea',
    categoryLabel: 'Refreshing Fruit Teas',
    size: '16oz',
    isIntroSalesLeader: false,
    description: 'Crisp brewed Jasmine green tea infused with tropical fruit syrup and pearls. ₱88.91 net profit.',
    primaryIngredients: [
      { name: 'Brewed Jasmine Green Tea Base', quantity: 170, unit: 'ml', unitPrice: 15, unitPriceUnit: '/l', cost: 2.55 },
      { name: 'Fruit Tea Concentrated Syrup / Jam', quantity: 30, unit: 'g', unitPrice: 600, unitPriceUnit: '/kg', cost: 18.00 },
      { name: 'Tapioca Pearls / Popping Boba', quantity: 10, unit: 'g', unitPrice: 150, unitPriceUnit: '/kg', cost: 1.50 },
    ],
    secondaryIngredients: [
      { name: 'Liquid Fructose', quantity: 15, unit: 'ml', unitPrice: 135, unitPriceUnit: '/l', cost: 2.03 },
      { name: 'Purified Tube Ice', quantity: 100, unit: 'g', unitPrice: 10, unitPriceUnit: '/kg', cost: 1.00 },
    ],
    heatAndUtilities: 5.00,
    recipeCost: 30.08,
    packagingCost: 10.00,
    laborCost: 6.02,
    equipmentDepreciation: 0,
    miscCost: 0,
    totalCost: 46.09,
    markup: 88.91,
    walkinPrice: 135.00,
    walkinNetProfit: 88.91,
    foodPandaPrice: 212.63,
    cogsRatio: 0.3414,
    baristaNotes: [
      "Brew Jasmine green tea at 75°C for 7 minutes only. Never boiling water to avoid bitter astringency.",
      "Can pair with passion fruit, peach, or lychee syrup."
    ],
    preparationSteps: [
      "Ilagay ang 10g pearls o boba sa ilalim ng baso.",
      "Sa shaker, ilagay ang 170ml brewed green tea, 30g fruit syrup, at 15ml fructose.",
      "Lagyan ng 100g yelo at i-shake nang masigla.",
      "Ibuhos sa baso at lagyan ng slice ng lemon o mint leaves."
    ]
  },

  // 22. 22oz Refreshing Fruit Tea
  {
    id: 'fruittea-22oz',
    name: 'Jasmine Green Fruit Tea w/ Popping Boba (22oz)',
    category: 'fruittea',
    categoryLabel: 'Refreshing Fruit Teas',
    size: '22oz',
    isIntroSalesLeader: false,
    description: 'Refreshing 22oz giant fruit tea quencher. ₱101.86 net profit.',
    primaryIngredients: [
      { name: 'Brewed Jasmine Green Tea Base', quantity: 220, unit: 'ml', unitPrice: 15, unitPriceUnit: '/l', cost: 3.30 },
      { name: 'Fruit Tea Concentrated Syrup', quantity: 40, unit: 'g', unitPrice: 600, unitPriceUnit: '/kg', cost: 24.00 },
      { name: 'Tapioca Pearls / Popping Boba', quantity: 15, unit: 'g', unitPrice: 150, unitPriceUnit: '/kg', cost: 2.25 },
    ],
    secondaryIngredients: [
      { name: 'Liquid Fructose', quantity: 20, unit: 'ml', unitPrice: 135, unitPriceUnit: '/l', cost: 2.70 },
      { name: 'Purified Tube Ice', quantity: 120, unit: 'g', unitPrice: 10, unitPriceUnit: '/kg', cost: 1.20 },
    ],
    heatAndUtilities: 5.00,
    recipeCost: 38.45,
    packagingCost: 11.00,
    laborCost: 7.69,
    equipmentDepreciation: 0,
    miscCost: 0,
    totalCost: 57.14,
    markup: 101.86,
    walkinPrice: 159.00,
    walkinNetProfit: 101.86,
    foodPandaPrice: 250.42,
    cogsRatio: 0.3594,
    baristaNotes: ["Top tier profit: ₱101.86 per cup on ₱57.14 total investment."],
    preparationSteps: [
      "Ilagay ang 15g pearls sa baso.",
      "I-shake ang 220ml green tea, 40g syrup, at fructose kasama ang yelo.",
      "Isalin sa baso at i-seal."
    ]
  },

  // 23. 22oz Blended Coffee Frappe
  {
    id: 'blended-coffee-frappe-22oz',
    name: 'Mocha Espresso Java Chip Frappe (22oz)',
    category: 'blended_frappe',
    categoryLabel: 'Ice-Blended Frappes',
    size: '22oz',
    isIntroSalesLeader: false,
    description: 'Blended espresso frappe with chocolate chip textures and frappe base. ₱70.00 net profit.',
    primaryIngredients: [
      { name: 'Espresso Beans Extract', quantity: 17, unit: 'g', unitPrice: 1100, unitPriceUnit: '/kg', cost: 18.70 },
      { name: 'Flavor / Mocha Powder', quantity: 35, unit: 'g', unitPrice: 500, unitPriceUnit: '/kg', cost: 17.50 },
      { name: 'Frappe Base Thickener', quantity: 30, unit: 'g', unitPrice: 500, unitPriceUnit: '/kg', cost: 15.00 },
    ],
    secondaryIngredients: [
      { name: 'Purified Ice', quantity: 200, unit: 'g', unitPrice: 10, unitPriceUnit: '/kg', cost: 2.00 },
      { name: 'Chocolate Drizzle Topping', quantity: 10, unit: 'ml', unitPrice: 280, unitPriceUnit: '/l', cost: 2.80 },
    ],
    heatAndUtilities: 3.00,
    recipeCost: 59.00,
    packagingCost: 5.00,
    laborCost: 17.70,
    equipmentDepreciation: 0,
    miscCost: 0,
    totalCost: 81.70,
    markup: 70.00,
    walkinPrice: 151.70,
    walkinNetProfit: 70.00,
    foodPandaPrice: 238.93,
    cogsRatio: 0.5386,
    baristaNotes: ["Cool down espresso shot before blending so it doesn't melt the ice immediately."],
    preparationSteps: [
      "I-extract ang espresso at palamigin nang saglit.",
      "I-combine ang kape, powder, frappe base, at yelo sa blender.",
      "I-blend nang buo, ibuhos sa 22oz cup, at lagyan ng chocolate drizzle."
    ]
  },

  // 24. 16oz Blended Premium Sauce Series
  {
    id: 'blended-sauce-premium-16oz',
    name: 'Gourmet Salted Caramel Blended Frappe (16oz)',
    category: 'blended_frappe',
    categoryLabel: 'Ice-Blended Frappes',
    size: '16oz',
    isIntroSalesLeader: false,
    description: 'Premium Torani sauce-based coffee frappe. ₱92.38 net profit.',
    primaryIngredients: [
      { name: 'Espresso Grounds', quantity: 18, unit: 'g', unitPrice: 1550, unitPriceUnit: '/kg', cost: 27.90 },
      { name: 'Gourmet Flavor Sauce (Torani)', quantity: 35, unit: 'ml', unitPrice: 680, unitPriceUnit: '/l', cost: 23.80 },
      { name: 'Frappe Base Powder', quantity: 20, unit: 'g', unitPrice: 395, unitPriceUnit: '/kg', cost: 7.90 },
    ],
    secondaryIngredients: [
      { name: 'Ice', quantity: 200, unit: 'g', unitPrice: 10, unitPriceUnit: '/kg', cost: 2.00 },
      { name: 'Sauce Drizzle Topping', quantity: 10, unit: 'ml', unitPrice: 280, unitPriceUnit: '/l', cost: 2.80 },
    ],
    heatAndUtilities: 3.00,
    recipeCost: 67.40,
    packagingCost: 10.00,
    laborCost: 20.22,
    equipmentDepreciation: 0,
    miscCost: 0,
    totalCost: 97.62,
    markup: 60.00,
    walkinPrice: 190.00,
    walkinNetProfit: 92.38,
    foodPandaPrice: 299.25,
    cogsRatio: 0.5138,
    baristaNotes: ["Sauce-based frappes taste richer than powder-only alternatives."],
    preparationSteps: [
      "Ihalo ang espresso, sauce, frappe base, at yelo sa blender.",
      "I-blend hanggang mag-ribbon ang texture.",
      "Isalin sa baso na may caramel lining."
    ]
  },

  // 25. 22oz Blended Premium Sauce Series
  {
    id: 'blended-sauce-premium-22oz',
    name: 'Gourmet Salted Caramel Blended Frappe (22oz)',
    category: 'blended_frappe',
    categoryLabel: 'Ice-Blended Frappes',
    size: '22oz',
    isIntroSalesLeader: false,
    description: 'Large gourmet sauce-based coffee frappe. ₱93.41 net profit.',
    primaryIngredients: [
      { name: 'Espresso Grounds', quantity: 18, unit: 'g', unitPrice: 1550, unitPriceUnit: '/kg', cost: 27.90 },
      { name: 'Torani Gourmet Sauce', quantity: 45, unit: 'ml', unitPrice: 680, unitPriceUnit: '/l', cost: 30.60 },
      { name: 'Frappe Base Powder', quantity: 30, unit: 'g', unitPrice: 395, unitPriceUnit: '/kg', cost: 11.85 },
    ],
    secondaryIngredients: [
      { name: 'Ice', quantity: 200, unit: 'g', unitPrice: 10, unitPriceUnit: '/kg', cost: 2.00 },
      { name: 'Topping', quantity: 10, unit: 'ml', unitPrice: 280, unitPriceUnit: '/l', cost: 2.80 },
    ],
    heatAndUtilities: 3.00,
    recipeCost: 78.15,
    packagingCost: 10.00,
    laborCost: 23.45,
    equipmentDepreciation: 0,
    miscCost: 0,
    totalCost: 111.59,
    markup: 70.00,
    walkinPrice: 205.00,
    walkinNetProfit: 93.41,
    foodPandaPrice: 322.88,
    cogsRatio: 0.5444,
    baristaNotes: ["Upsell whip cream and crushed oreo/biscoff for ₱25 additional."],
    preparationSteps: [
      "I-blend ang 18g espresso shot, 45ml sauce, frappe base, at 200g yelo.",
      "Isalin sa 22oz cup at lagyan ng whipped cream at drizzle."
    ]
  },

  // 26. 16oz Blended Powder Basic Series
  {
    id: 'blended-powder-basic-16oz',
    name: 'Cafe Frappe Powder Series (16oz)',
    category: 'blended_frappe',
    categoryLabel: 'Ice-Blended Frappes',
    size: '16oz',
    isIntroSalesLeader: false,
    description: 'Affordable high-speed powder frappe formulation.',
    primaryIngredients: [
      { name: 'Espresso Grounds', quantity: 18, unit: 'g', unitPrice: 1550, unitPriceUnit: '/kg', cost: 27.90 },
      { name: 'Flavor Powder', quantity: 30, unit: 'g', unitPrice: 450, unitPriceUnit: '/kg', cost: 13.50 },
      { name: 'Frappe Base', quantity: 20, unit: 'g', unitPrice: 395, unitPriceUnit: '/kg', cost: 7.90 },
    ],
    secondaryIngredients: [
      { name: 'Ice', quantity: 200, unit: 'g', unitPrice: 10, unitPriceUnit: '/kg', cost: 2.00 },
      { name: 'Topping', quantity: 10, unit: 'ml', unitPrice: 280, unitPriceUnit: '/l', cost: 2.80 },
    ],
    heatAndUtilities: 3.00,
    recipeCost: 57.10,
    packagingCost: 10.00,
    laborCost: 17.13,
    equipmentDepreciation: 0,
    miscCost: 0,
    totalCost: 84.23,
    markup: 60.00,
    walkinPrice: 180.00,
    walkinNetProfit: 95.77,
    foodPandaPrice: 283.50,
    cogsRatio: 0.4679,
    baristaNotes: ["Lower ingredient cost compared to sauce yet gives rich mouthfeel."],
    preparationSteps: [
      "I-blend ang espresso, powder, base, at yelo nang tuloy-tuloy.",
      "I-serve nang malamig."
    ]
  },

  // 27. 22oz Blended Powder Basic Series
  {
    id: 'blended-powder-basic-22oz',
    name: 'Cafe Frappe Powder Series (22oz)',
    category: 'blended_frappe',
    categoryLabel: 'Ice-Blended Frappes',
    size: '22oz',
    isIntroSalesLeader: false,
    description: 'Large powder-blend frappe recipe.',
    primaryIngredients: [
      { name: 'Espresso Grounds', quantity: 18, unit: 'g', unitPrice: 1550, unitPriceUnit: '/kg', cost: 27.90 },
      { name: 'Flavor Powder', quantity: 40, unit: 'g', unitPrice: 450, unitPriceUnit: '/kg', cost: 18.00 },
      { name: 'Frappe Base', quantity: 30, unit: 'g', unitPrice: 395, unitPriceUnit: '/kg', cost: 11.85 },
    ],
    secondaryIngredients: [
      { name: 'Ice', quantity: 200, unit: 'g', unitPrice: 10, unitPriceUnit: '/kg', cost: 2.00 },
      { name: 'Topping', quantity: 10, unit: 'ml', unitPrice: 280, unitPriceUnit: '/l', cost: 2.80 },
    ],
    heatAndUtilities: 3.00,
    recipeCost: 65.55,
    packagingCost: 10.00,
    laborCost: 19.67,
    equipmentDepreciation: 0,
    miscCost: 0,
    totalCost: 95.22,
    markup: 70.00,
    walkinPrice: 195.00,
    walkinNetProfit: 99.78,
    foodPandaPrice: 307.13,
    cogsRatio: 0.4883,
    baristaNotes: ["Quick 25 second blend time."],
    preparationSteps: [
      "Ihalo sa blender at i-blend sa high speed.",
      "Isalin sa baso at palamutian."
    ]
  },

  // 28. 12oz Ice Coffee Basic & Premium
  {
    id: 'ice-coffee-12oz-basic',
    name: 'Iced Coffee Kiosk Classic (12oz)',
    category: 'coffee_iced',
    categoryLabel: 'Iced Coffee Specials',
    size: '12oz',
    isIntroSalesLeader: false,
    description: 'Compact 12oz iced coffee recipe for daily commuters.',
    primaryIngredients: [
      { name: 'Specialty Coffee Grounds', quantity: 12, unit: 'g', unitPrice: 1100, unitPriceUnit: '/kg', cost: 13.20 },
      { name: 'Fresh Milk', quantity: 100, unit: 'ml', unitPrice: 90, unitPriceUnit: '/l', cost: 9.00 },
      { name: 'Torani Syrup', quantity: 15, unit: 'ml', unitPrice: 800, unitPriceUnit: '/l', cost: 12.00 },
      { name: 'Milk Syrup', quantity: 15, unit: 'ml', unitPrice: 120, unitPriceUnit: '/l', cost: 1.80 },
    ],
    secondaryIngredients: [
      { name: 'Tube Ice', quantity: 100, unit: 'g', unitPrice: 10, unitPriceUnit: '/kg', cost: 1.00 },
    ],
    heatAndUtilities: 5.00,
    recipeCost: 42.00,
    packagingCost: 10.00,
    laborCost: 8.40,
    equipmentDepreciation: 0,
    miscCost: 0,
    totalCost: 60.40,
    markup: 40.00,
    walkinPrice: 100.40,
    walkinNetProfit: 40.00,
    foodPandaPrice: 158.13,
    cogsRatio: 0.6016,
    baristaNotes: ["Compact 12oz size is ideal for high-traffic MRT/LRT commuter stalls."],
    preparationSteps: [
      "I-brew ang 12g coffee shot.",
      "Haluin ang syrups sa gatas at buhusan ng yelo.",
      "I-float ang coffee shot."
    ]
  }
];

export const BEVERAGE_CATEGORIES = [
  { id: 'all', name: 'Lahat ng Inumin', count: 28 },
  { id: 'milktea', name: 'Milk Tea & Pearls', count: 4 },
  { id: 'coffee_iced', name: 'Iced Coffee Specials', count: 5 },
  { id: 'coffee_hot', name: 'Hot Classics & Non-Coffee', count: 6 },
  { id: 'blended_frappe', name: 'Ice-Blended Frappes', count: 7 },
  { id: 'fruit_shake_juice', name: 'Fruit Shakes & Fresh Juices', count: 4 },
  { id: 'drip', name: 'Drip Coffee Pouches', count: 2 },
];
