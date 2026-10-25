export interface BeverageIngredient {
  name: string;
  quantity: number;
  unit: 'g' | 'ml' | 'pc/s';
  unitPrice: number;
  unitPriceUnit: '/kg' | '/l' | '/pc';
  cost: number;
}

export interface BeverageSizeOption {
  size: string;
  sizeLabel: string;
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
}

export interface BeverageRecipe {
  id: string;
  name: string;
  category: 'milktea' | 'coffee_iced' | 'coffee_hot' | 'fruittea' | 'blended_frappe' | 'fruit_shake_juice' | 'drip';
  categoryLabel: string;
  imageUrl: string;
  description: string;
  isIntroSalesLeader?: boolean;
  defaultSize: string;
  sizes: BeverageSizeOption[];
  baristaNotes: string[];
  preparationSteps: string[];
}

export function getBeverageActiveSize(recipe: BeverageRecipe, selectedSize?: string): BeverageSizeOption {
  if (selectedSize) {
    const found = recipe.sizes.find(s => s.size === selectedSize);
    if (found) return found;
  }
  return recipe.sizes[0];
}

export const BEVERAGE_CATEGORIES = [
  { id: 'all', name: 'Lahat ng Inumin' },
  { id: 'milktea', name: 'Milk Tea & Pearls' },
  { id: 'coffee_iced', name: 'Iced Espresso' },
  { id: 'coffee_hot', name: 'Hot Specialty Coffee' },
  { id: 'fruittea', name: 'Jasmine Fruit Teas' },
  { id: 'blended_frappe', name: 'Frappes & Shakes' },
  { id: 'fruit_shake_juice', name: 'Real Fruit & Calamansi' },
  { id: 'drip', name: 'Single Drip Coffee' }
];

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
    content: "Ang totoong personal na kita mo sa bawat baso ay ang iyong 'Labor Allocation' (₱7.50 - ₱20 per cup). Ang natitirang Net Profit ay mananatili sa bangko ng shop para sa replenishment, buffer sa masisirang blender, at business expansion.",
    icon: "shield-alert"
  }
];

export const COFFEE_MILKTEA_RECIPES: BeverageRecipe[] = [
  // 1. CLASSIC BROWN SUGAR PEARL MILK TEA
  {
    id: "classic-pearl-milktea",
    name: "Classic Brown Sugar Pearl Milk Tea",
    category: "milktea",
    categoryLabel: "Milk Tea & Pearls",
    imageUrl: "/beverages/classic-pearl-milktea.jpg",
    description: "Ang #1 profit maker sa buong menu. Signature black tea blend na may non-dairy creamer, brown sugar syrup, at chewy tapioca boba pearls.",
    isIntroSalesLeader: true,
    defaultSize: "16oz",
    sizes: [
      {
        size: "16oz",
        sizeLabel: "Medium (16oz)",
        primaryIngredients: [
          { name: "Black Tea Concentrate", quantity: 100, unit: "ml", unitPrice: 15, unitPriceUnit: "/l", cost: 1.50 },
          { name: "Non-Dairy Creamer", quantity: 20, unit: "g", unitPrice: 250, unitPriceUnit: "/kg", cost: 5.00 },
          { name: "Brown Sugar Flavor Powder", quantity: 20, unit: "g", unitPrice: 500, unitPriceUnit: "/kg", cost: 10.00 },
          { name: "Cooked Boba Pearls", quantity: 15, unit: "g", unitPrice: 150, unitPriceUnit: "/kg", cost: 2.25 }
        ],
        secondaryIngredients: [
          { name: "Fructose / Liquid Sugar", quantity: 15, unit: "ml", unitPrice: 150, unitPriceUnit: "/l", cost: 2.25 },
          { name: "Solid Tube Ice", quantity: 100, unit: "g", unitPrice: 10, unitPriceUnit: "/kg", cost: 1.00 }
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
        cogsRatio: 0.185
      },
      {
        size: "22oz",
        sizeLabel: "Large (22oz)",
        primaryIngredients: [
          { name: "Black Tea Concentrate", quantity: 150, unit: "ml", unitPrice: 15, unitPriceUnit: "/l", cost: 2.25 },
          { name: "Non-Dairy Creamer", quantity: 30, unit: "g", unitPrice: 250, unitPriceUnit: "/kg", cost: 7.50 },
          { name: "Brown Sugar Flavor Powder", quantity: 30, unit: "g", unitPrice: 500, unitPriceUnit: "/kg", cost: 15.00 },
          { name: "Cooked Boba Pearls", quantity: 25, unit: "g", unitPrice: 150, unitPriceUnit: "/kg", cost: 3.75 }
        ],
        secondaryIngredients: [
          { name: "Fructose / Liquid Sugar", quantity: 25, unit: "ml", unitPrice: 150, unitPriceUnit: "/l", cost: 3.75 },
          { name: "Solid Tube Ice", quantity: 150, unit: "g", unitPrice: 10, unitPriceUnit: "/kg", cost: 1.50 }
        ],
        heatAndUtilities: 3.65,
        recipeCost: 37.40,
        packagingCost: 10.00,
        laborCost: 11.22,
        equipmentDepreciation: 0,
        miscCost: 0,
        totalCost: 58.62,
        markup: 106.38,
        walkinPrice: 165.00,
        walkinNetProfit: 106.38,
        foodPandaPrice: 259.85,
        cogsRatio: 0.227
      }
    ],
    preparationSteps: [
      "Maglagay ng 1 scoop (15g-25g) ng mainit-init na brown sugar pearls sa ilalim ng baso.",
      "Sa shaker cup, ihalo ang freshly brewed black tea base at creamer gamit ang bar whisk hanggang matunaw.",
      "Idagdag ang flavor powder at liquid fructose ayon sa napiling sweetness level ng customer.",
      "Punuin ng yelo, isara ang shaker at i-shake nang malakas ng 10-15 seconds para lumabas ang velvety microfoam.",
      "Isalin sa baso, i-seal gamit ang cup sealing machine o dome lid, at i-serve kasama ang boba straw."
    ],
    baristaNotes: [
      "Ang pearls ay huwag ilalagay sa ref! Titigas ang core nito. Panatilihin itong nakababad sa brown sugar syrup sa room temperature sa loob ng 4-6 hours.",
      "Kung medyo matamlay ang kulay, mag-drizzle ng 5ml brown sugar syrup sa panloob na dingding ng baso bago ibuhos ang gatas."
    ]
  },

  // 2. WINTERMELON MILK TEA
  {
    id: "wintermelon-milktea",
    name: "Wintermelon Milk Tea Supreme",
    category: "milktea",
    categoryLabel: "Milk Tea & Pearls",
    imageUrl: "/beverages/wintermelon-milktea.jpg",
    description: "Caramelized melon flavor na balanseng-balanse sa black tea at silky creamer. Paboritong all-day refresher.",
    defaultSize: "16oz",
    sizes: [
      {
        size: "16oz",
        sizeLabel: "Medium (16oz)",
        primaryIngredients: [
          { name: "Black Tea Concentrate", quantity: 100, unit: "ml", unitPrice: 15, unitPriceUnit: "/l", cost: 1.50 },
          { name: "Non-Dairy Creamer", quantity: 20, unit: "g", unitPrice: 250, unitPriceUnit: "/kg", cost: 5.00 },
          { name: "Wintermelon Syrup / Powder", quantity: 20, unit: "g", unitPrice: 480, unitPriceUnit: "/kg", cost: 9.60 },
          { name: "Cooked Boba Pearls", quantity: 15, unit: "g", unitPrice: 150, unitPriceUnit: "/kg", cost: 2.25 }
        ],
        secondaryIngredients: [
          { name: "Fructose / Sugar", quantity: 10, unit: "ml", unitPrice: 150, unitPriceUnit: "/l", cost: 1.50 },
          { name: "Solid Tube Ice", quantity: 100, unit: "g", unitPrice: 10, unitPriceUnit: "/kg", cost: 1.00 }
        ],
        heatAndUtilities: 3.00,
        recipeCost: 23.85,
        packagingCost: 10.00,
        laborCost: 7.15,
        equipmentDepreciation: 0,
        miscCost: 0,
        totalCost: 41.00,
        markup: 89.00,
        walkinPrice: 130.00,
        walkinNetProfit: 89.00,
        foodPandaPrice: 204.76,
        cogsRatio: 0.183
      },
      {
        size: "22oz",
        sizeLabel: "Large (22oz)",
        primaryIngredients: [
          { name: "Black Tea Concentrate", quantity: 150, unit: "ml", unitPrice: 15, unitPriceUnit: "/l", cost: 2.25 },
          { name: "Non-Dairy Creamer", quantity: 30, unit: "g", unitPrice: 250, unitPriceUnit: "/kg", cost: 7.50 },
          { name: "Wintermelon Syrup / Powder", quantity: 30, unit: "g", unitPrice: 480, unitPriceUnit: "/kg", cost: 14.40 },
          { name: "Cooked Boba Pearls", quantity: 25, unit: "g", unitPrice: 150, unitPriceUnit: "/kg", cost: 3.75 }
        ],
        secondaryIngredients: [
          { name: "Fructose / Sugar", quantity: 15, unit: "ml", unitPrice: 150, unitPriceUnit: "/l", cost: 2.25 },
          { name: "Solid Tube Ice", quantity: 150, unit: "g", unitPrice: 10, unitPriceUnit: "/kg", cost: 1.50 }
        ],
        heatAndUtilities: 3.50,
        recipeCost: 35.15,
        packagingCost: 10.00,
        laborCost: 10.55,
        equipmentDepreciation: 0,
        miscCost: 0,
        totalCost: 55.70,
        markup: 99.30,
        walkinPrice: 155.00,
        walkinNetProfit: 99.30,
        foodPandaPrice: 244.13,
        cogsRatio: 0.227
      }
    ],
    preparationSteps: [
      "Ihanda ang baso na may boba pearls sa ilalim.",
      "Tunawin ang creamer at wintermelon base sa mainit na tea concentrate.",
      "Lagyan ng yelo at i-shake ng 10 segundo.",
      "Isalin sa cup at i-seal."
    ],
    baristaNotes: [
      "Natural nang matamis ang wintermelon syrup; bawasan ang fructose sa 50% kung maselan ang customer sa tamis."
    ]
  },

  // 3. OKINAWA ROASTED MILK TEA
  {
    id: "okinawa-milktea",
    name: "Okinawa Roasted Brown Sugar Tea",
    category: "milktea",
    categoryLabel: "Milk Tea & Pearls",
    imageUrl: "/beverages/okinawa-milktea.jpg",
    description: "Mabango at deep roasted Japanese style brown sugar flavor na may nutty molasses aroma.",
    defaultSize: "16oz",
    sizes: [
      {
        size: "16oz",
        sizeLabel: "Medium (16oz)",
        primaryIngredients: [
          { name: "Black Tea Concentrate", quantity: 100, unit: "ml", unitPrice: 15, unitPriceUnit: "/l", cost: 1.50 },
          { name: "Non-Dairy Creamer", quantity: 20, unit: "g", unitPrice: 250, unitPriceUnit: "/kg", cost: 5.00 },
          { name: "Okinawa Roasted Powder", quantity: 20, unit: "g", unitPrice: 520, unitPriceUnit: "/kg", cost: 10.40 },
          { name: "Cooked Boba Pearls", quantity: 15, unit: "g", unitPrice: 150, unitPriceUnit: "/kg", cost: 2.25 }
        ],
        secondaryIngredients: [
          { name: "Molasses Sugar", quantity: 10, unit: "ml", unitPrice: 150, unitPriceUnit: "/l", cost: 1.50 },
          { name: "Solid Tube Ice", quantity: 100, unit: "g", unitPrice: 10, unitPriceUnit: "/kg", cost: 1.00 }
        ],
        heatAndUtilities: 3.00,
        recipeCost: 24.65,
        packagingCost: 10.00,
        laborCost: 7.40,
        equipmentDepreciation: 0,
        miscCost: 0,
        totalCost: 42.05,
        markup: 92.95,
        walkinPrice: 135.00,
        walkinNetProfit: 92.95,
        foodPandaPrice: 212.63,
        cogsRatio: 0.183
      },
      {
        size: "22oz",
        sizeLabel: "Large (22oz)",
        primaryIngredients: [
          { name: "Black Tea Concentrate", quantity: 150, unit: "ml", unitPrice: 15, unitPriceUnit: "/l", cost: 2.25 },
          { name: "Non-Dairy Creamer", quantity: 30, unit: "g", unitPrice: 250, unitPriceUnit: "/kg", cost: 7.50 },
          { name: "Okinawa Roasted Powder", quantity: 30, unit: "g", unitPrice: 520, unitPriceUnit: "/kg", cost: 15.60 },
          { name: "Cooked Boba Pearls", quantity: 25, unit: "g", unitPrice: 150, unitPriceUnit: "/kg", cost: 3.75 }
        ],
        secondaryIngredients: [
          { name: "Molasses Sugar", quantity: 15, unit: "ml", unitPrice: 150, unitPriceUnit: "/l", cost: 2.25 },
          { name: "Solid Tube Ice", quantity: 150, unit: "g", unitPrice: 10, unitPriceUnit: "/kg", cost: 1.50 }
        ],
        heatAndUtilities: 3.50,
        recipeCost: 36.35,
        packagingCost: 10.00,
        laborCost: 10.90,
        equipmentDepreciation: 0,
        miscCost: 0,
        totalCost: 57.25,
        markup: 102.75,
        walkinPrice: 160.00,
        walkinNetProfit: 102.75,
        foodPandaPrice: 251.97,
        cogsRatio: 0.227
      }
    ],
    preparationSteps: [
      "Ilagay ang boba pearls sa cup.",
      "Ihalo ang Okinawa powder at creamer sa bagong timplang tea base.",
      "Lagyan ng yelo at i-shake ng masigla.",
      "Isalin at takpan."
    ],
    baristaNotes: [
      "Bagay itong lagyan ng cream cheese foam topping para sa karagdagang ₱25 upcharge sa menu."
    ]
  },

  // 4. TARO CREAM MILK TEA
  {
    id: "taro-milktea",
    name: "Taro Cream Velvet Milk Tea",
    category: "milktea",
    categoryLabel: "Milk Tea & Pearls",
    imageUrl: "/beverages/taro-milktea.jpg",
    description: "Creamy at malinamnam na purple taro na paborito ng mga bata at kabataan. Sweet vanilla-nutty profile.",
    defaultSize: "16oz",
    sizes: [
      {
        size: "16oz",
        sizeLabel: "Medium (16oz)",
        primaryIngredients: [
          { name: "Black Tea Concentrate", quantity: 80, unit: "ml", unitPrice: 15, unitPriceUnit: "/l", cost: 1.20 },
          { name: "Non-Dairy Creamer", quantity: 25, unit: "g", unitPrice: 250, unitPriceUnit: "/kg", cost: 6.25 },
          { name: "Premium Taro Powder", quantity: 25, unit: "g", unitPrice: 480, unitPriceUnit: "/kg", cost: 12.00 },
          { name: "Cooked Boba Pearls", quantity: 15, unit: "g", unitPrice: 150, unitPriceUnit: "/kg", cost: 2.25 }
        ],
        secondaryIngredients: [
          { name: "Fructose / Sugar", quantity: 10, unit: "ml", unitPrice: 150, unitPriceUnit: "/l", cost: 1.50 },
          { name: "Solid Tube Ice", quantity: 100, unit: "g", unitPrice: 10, unitPriceUnit: "/kg", cost: 1.00 }
        ],
        heatAndUtilities: 3.00,
        recipeCost: 27.20,
        packagingCost: 10.00,
        laborCost: 8.16,
        equipmentDepreciation: 0,
        miscCost: 0,
        totalCost: 45.36,
        markup: 89.64,
        walkinPrice: 135.00,
        walkinNetProfit: 89.64,
        foodPandaPrice: 212.63,
        cogsRatio: 0.201
      },
      {
        size: "22oz",
        sizeLabel: "Large (22oz)",
        primaryIngredients: [
          { name: "Black Tea Concentrate", quantity: 120, unit: "ml", unitPrice: 15, unitPriceUnit: "/l", cost: 1.80 },
          { name: "Non-Dairy Creamer", quantity: 35, unit: "g", unitPrice: 250, unitPriceUnit: "/kg", cost: 8.75 },
          { name: "Premium Taro Powder", quantity: 35, unit: "g", unitPrice: 480, unitPriceUnit: "/kg", cost: 16.80 },
          { name: "Cooked Boba Pearls", quantity: 25, unit: "g", unitPrice: 150, unitPriceUnit: "/kg", cost: 3.75 }
        ],
        secondaryIngredients: [
          { name: "Fructose / Sugar", quantity: 15, unit: "ml", unitPrice: 150, unitPriceUnit: "/l", cost: 2.25 },
          { name: "Solid Tube Ice", quantity: 150, unit: "g", unitPrice: 10, unitPriceUnit: "/kg", cost: 1.50 }
        ],
        heatAndUtilities: 3.50,
        recipeCost: 38.60,
        packagingCost: 10.00,
        laborCost: 11.58,
        equipmentDepreciation: 0,
        miscCost: 0,
        totalCost: 60.18,
        markup: 99.82,
        walkinPrice: 160.00,
        walkinNetProfit: 99.82,
        foodPandaPrice: 251.97,
        cogsRatio: 0.241
      }
    ],
    preparationSteps: [
      "Haluing maigi ang taro powder gamit ang 50ml mainit na tubig o tea base bago i-shake para walang buo-buong pulbos.",
      "Ilagay ang creamer at yelo.",
      "I-shake at ibuhos sa basong may boba."
    ],
    baristaNotes: [
      "Huwag iwanan ang taro powder na nakabukas sa hangin; mabilis itong mamuo sa humidity."
    ]
  },

  // 5. ICED CARAMEL CAFE LATTE / MACCHIATO
  {
    id: "iced-caramel-latte",
    name: "Iced Caramel Cafe Latte / Macchiato",
    category: "coffee_iced",
    categoryLabel: "Iced Espresso",
    imageUrl: "/beverages/iced-caramel-latte.jpg",
    description: "Double-shot espresso sa ibabaw ng malamig na fresh milk at premium Torani caramel sauce. Napakaganda ng layered visual.",
    isIntroSalesLeader: true,
    defaultSize: "16oz",
    sizes: [
      {
        size: "12oz",
        sizeLabel: "Small (12oz)",
        primaryIngredients: [
          { name: "Espresso Beans (Single Shot)", quantity: 12, unit: "g", unitPrice: 1100, unitPriceUnit: "/kg", cost: 13.20 },
          { name: "Pasteurized Fresh Milk", quantity: 100, unit: "ml", unitPrice: 90, unitPriceUnit: "/l", cost: 9.00 },
          { name: "Torani Caramel Syrup / Sauce", quantity: 15, unit: "ml", unitPrice: 800, unitPriceUnit: "/l", cost: 12.00 },
          { name: "Milk Sweetener Blend", quantity: 15, unit: "ml", unitPrice: 120, unitPriceUnit: "/l", cost: 1.80 }
        ],
        secondaryIngredients: [
          { name: "Tube Ice", quantity: 100, unit: "g", unitPrice: 10, unitPriceUnit: "/kg", cost: 1.00 }
        ],
        heatAndUtilities: 5.00,
        recipeCost: 42.00,
        packagingCost: 10.00,
        laborCost: 10.00,
        equipmentDepreciation: 0,
        miscCost: 0,
        totalCost: 62.00,
        markup: 68.00,
        walkinPrice: 130.00,
        walkinNetProfit: 68.00,
        foodPandaPrice: 204.76,
        cogsRatio: 0.323
      },
      {
        size: "16oz",
        sizeLabel: "Medium (16oz)",
        primaryIngredients: [
          { name: "Espresso Beans (Double Shot)", quantity: 18, unit: "g", unitPrice: 1550, unitPriceUnit: "/kg", cost: 27.90 },
          { name: "Pasteurized Fresh Milk", quantity: 120, unit: "ml", unitPrice: 140, unitPriceUnit: "/l", cost: 16.80 },
          { name: "Torani Caramel Syrup / Sauce", quantity: 25, unit: "ml", unitPrice: 795, unitPriceUnit: "/l", cost: 19.88 }
        ],
        secondaryIngredients: [
          { name: "Tube Ice", quantity: 100, unit: "g", unitPrice: 10, unitPriceUnit: "/kg", cost: 1.00 }
        ],
        heatAndUtilities: 5.00,
        recipeCost: 70.58,
        packagingCost: 10.00,
        laborCost: 10.00,
        equipmentDepreciation: 0,
        miscCost: 0,
        totalCost: 90.58,
        markup: 64.42,
        walkinPrice: 155.00,
        walkinNetProfit: 64.42,
        foodPandaPrice: 244.13,
        cogsRatio: 0.455
      },
      {
        size: "22oz",
        sizeLabel: "Large (22oz)",
        primaryIngredients: [
          { name: "Espresso Beans (Double Shot+)", quantity: 17, unit: "g", unitPrice: 1550, unitPriceUnit: "/kg", cost: 26.35 },
          { name: "Pasteurized Fresh Milk", quantity: 140, unit: "ml", unitPrice: 90, unitPriceUnit: "/l", cost: 12.60 },
          { name: "Torani Caramel Syrup / Sauce", quantity: 35, unit: "ml", unitPrice: 795, unitPriceUnit: "/l", cost: 27.83 }
        ],
        secondaryIngredients: [
          { name: "Tube Ice", quantity: 200, unit: "g", unitPrice: 10, unitPriceUnit: "/kg", cost: 2.00 }
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
        walkinNetProfit: 81.22,
        foodPandaPrice: 275.63,
        cogsRatio: 0.421
      }
    ],
    preparationSteps: [
      "I-extract ang double shot espresso (18g in, 36g out sa 25-28 seconds).",
      "Magbuhos ng caramel syrup/sauce sa ilalim o paligid ng baso.",
      "Ibuhos ang malamig na fresh milk at punuin ng yelo hanggang 80% ng baso.",
      "Dahan-dahang i-float ang bagong extract na mainit na espresso sa ibabaw ng yelo para makita ang magandang 2-layer separation."
    ],
    baristaNotes: [
      "Huwag ihalo bago ibigay sa customer! Hayaan silang mag-enjoy sa visual layering at mag-picture para sa organic social media promo."
    ]
  },

  // 6. ICED CLASSIC CAFE LATTE
  {
    id: "iced-cafe-latte",
    name: "Iced Classic Cafe Latte",
    category: "coffee_iced",
    categoryLabel: "Iced Espresso",
    imageUrl: "/beverages/iced-cafe-latte.jpg",
    description: "Malinis, masarap, at smooth na gatas na may tapang ng espresso. Walang halong artificial flavoring.",
    defaultSize: "16oz",
    sizes: [
      {
        size: "16oz",
        sizeLabel: "Medium (16oz)",
        primaryIngredients: [
          { name: "Espresso Beans (Double Shot)", quantity: 18, unit: "g", unitPrice: 1550, unitPriceUnit: "/kg", cost: 27.90 },
          { name: "Pasteurized Fresh Milk", quantity: 140, unit: "ml", unitPrice: 140, unitPriceUnit: "/l", cost: 19.60 }
        ],
        secondaryIngredients: [
          { name: "Liquid Sugar (Optional)", quantity: 10, unit: "ml", unitPrice: 150, unitPriceUnit: "/l", cost: 1.50 },
          { name: "Tube Ice", quantity: 100, unit: "g", unitPrice: 10, unitPriceUnit: "/kg", cost: 1.00 }
        ],
        heatAndUtilities: 5.00,
        recipeCost: 55.00,
        packagingCost: 10.00,
        laborCost: 10.00,
        equipmentDepreciation: 0,
        miscCost: 0,
        totalCost: 75.00,
        markup: 65.00,
        walkinPrice: 140.00,
        walkinNetProfit: 65.00,
        foodPandaPrice: 220.47,
        cogsRatio: 0.392
      },
      {
        size: "22oz",
        sizeLabel: "Large (22oz)",
        primaryIngredients: [
          { name: "Espresso Beans (Double Shot+)", quantity: 20, unit: "g", unitPrice: 1550, unitPriceUnit: "/kg", cost: 31.00 },
          { name: "Pasteurized Fresh Milk", quantity: 180, unit: "ml", unitPrice: 140, unitPriceUnit: "/l", cost: 25.20 }
        ],
        secondaryIngredients: [
          { name: "Liquid Sugar (Optional)", quantity: 15, unit: "ml", unitPrice: 150, unitPriceUnit: "/l", cost: 2.25 },
          { name: "Tube Ice", quantity: 150, unit: "g", unitPrice: 10, unitPriceUnit: "/kg", cost: 1.50 }
        ],
        heatAndUtilities: 5.00,
        recipeCost: 64.95,
        packagingCost: 10.00,
        laborCost: 10.00,
        equipmentDepreciation: 0,
        miscCost: 0,
        totalCost: 84.95,
        markup: 75.05,
        walkinPrice: 160.00,
        walkinNetProfit: 75.05,
        foodPandaPrice: 251.97,
        cogsRatio: 0.405
      }
    ],
    preparationSteps: [
      "I-pull ang double espresso shot.",
      "Maglagay ng yelo sa baso at ibuhos ang fresh milk.",
      "I-pour ang espresso sa ibabaw."
    ],
    baristaNotes: [
      "Siguraduhing malamig ang fresh milk bago gamitin para hindi matunaw agad ang yelo."
    ]
  },

  // 7. ICED SPANISH LATTE
  {
    id: "iced-spanish-latte",
    name: "Iced Spanish Sweet Latte",
    category: "coffee_iced",
    categoryLabel: "Iced Espresso",
    imageUrl: "/beverages/iced-spanish-latte.jpg",
    description: "Bestseller sa mga kabataan! Pinaghalong condensed milk, fresh milk, at matapang na espresso.",
    defaultSize: "16oz",
    sizes: [
      {
        size: "16oz",
        sizeLabel: "Medium (16oz)",
        primaryIngredients: [
          { name: "Espresso Beans (Double Shot)", quantity: 18, unit: "g", unitPrice: 1550, unitPriceUnit: "/kg", cost: 27.90 },
          { name: "Fresh Milk", quantity: 110, unit: "ml", unitPrice: 140, unitPriceUnit: "/l", cost: 15.40 },
          { name: "Condensed Milk Sauce", quantity: 30, unit: "ml", unitPrice: 220, unitPriceUnit: "/l", cost: 6.60 }
        ],
        secondaryIngredients: [
          { name: "Tube Ice", quantity: 100, unit: "g", unitPrice: 10, unitPriceUnit: "/kg", cost: 1.00 }
        ],
        heatAndUtilities: 5.00,
        recipeCost: 55.90,
        packagingCost: 10.00,
        laborCost: 10.00,
        equipmentDepreciation: 0,
        miscCost: 0,
        totalCost: 75.90,
        markup: 74.10,
        walkinPrice: 150.00,
        walkinNetProfit: 74.10,
        foodPandaPrice: 236.22,
        cogsRatio: 0.372
      },
      {
        size: "22oz",
        sizeLabel: "Large (22oz)",
        primaryIngredients: [
          { name: "Espresso Beans (Double Shot+)", quantity: 20, unit: "g", unitPrice: 1550, unitPriceUnit: "/kg", cost: 31.00 },
          { name: "Fresh Milk", quantity: 150, unit: "ml", unitPrice: 140, unitPriceUnit: "/l", cost: 21.00 },
          { name: "Condensed Milk Sauce", quantity: 45, unit: "ml", unitPrice: 220, unitPriceUnit: "/l", cost: 9.90 }
        ],
        secondaryIngredients: [
          { name: "Tube Ice", quantity: 150, unit: "g", unitPrice: 10, unitPriceUnit: "/kg", cost: 1.50 }
        ],
        heatAndUtilities: 5.00,
        recipeCost: 68.40,
        packagingCost: 10.00,
        laborCost: 10.00,
        equipmentDepreciation: 0,
        miscCost: 0,
        totalCost: 88.40,
        markup: 81.60,
        walkinPrice: 170.00,
        walkinNetProfit: 81.60,
        foodPandaPrice: 267.72,
        cogsRatio: 0.402
      }
    ],
    preparationSteps: [
      "Ilagay ang condensed milk sa ilalim ng baso.",
      "Ibuhos ang fresh milk at haluin bahagya.",
      "Lagyan ng yelo.",
      "I-float ang double espresso shot."
    ],
    baristaNotes: [
      "Haluing maigi bago inumin para lumabas ang signature velvety texture ng Spanish Latte."
    ]
  },

  // 8. HOT ARTISAN CAFE LATTE
  {
    id: "hot-cafe-latte",
    name: "Hot Artisan Cafe Latte",
    category: "coffee_hot",
    categoryLabel: "Hot Specialty Coffee",
    imageUrl: "/beverages/hot-cafe-latte.jpg",
    description: "Steamed textured milk na may silky microfoam sa ibabaw ng espresso shot. Paborito sa umaga.",
    defaultSize: "8oz",
    sizes: [
      {
        size: "8oz",
        sizeLabel: "Small (8oz)",
        primaryIngredients: [
          { name: "Espresso Beans", quantity: 10, unit: "g", unitPrice: 1100, unitPriceUnit: "/kg", cost: 11.00 },
          { name: "Fresh Milk", quantity: 160, unit: "ml", unitPrice: 140, unitPriceUnit: "/l", cost: 22.40 }
        ],
        secondaryIngredients: [
          { name: "Sugar Packet", quantity: 1, unit: "pc/s", unitPrice: 3, unitPriceUnit: "/pc", cost: 3.00 }
        ],
        heatAndUtilities: 5.00,
        recipeCost: 41.40,
        packagingCost: 7.00,
        laborCost: 8.28,
        equipmentDepreciation: 0,
        miscCost: 0,
        totalCost: 56.68,
        markup: 48.32,
        walkinPrice: 105.00,
        walkinNetProfit: 48.32,
        foodPandaPrice: 165.35,
        cogsRatio: 0.394
      },
      {
        size: "12oz",
        sizeLabel: "Medium (12oz)",
        primaryIngredients: [
          { name: "Espresso Beans (Double Shot)", quantity: 17, unit: "g", unitPrice: 1100, unitPriceUnit: "/kg", cost: 18.70 },
          { name: "Fresh Milk", quantity: 240, unit: "ml", unitPrice: 140, unitPriceUnit: "/l", cost: 33.60 }
        ],
        secondaryIngredients: [
          { name: "Sugar Packet", quantity: 1, unit: "pc/s", unitPrice: 3, unitPriceUnit: "/pc", cost: 3.00 }
        ],
        heatAndUtilities: 5.00,
        recipeCost: 60.30,
        packagingCost: 8.00,
        laborCost: 12.06,
        equipmentDepreciation: 0,
        miscCost: 0,
        totalCost: 80.36,
        markup: 54.64,
        walkinPrice: 135.00,
        walkinNetProfit: 54.64,
        foodPandaPrice: 212.63,
        cogsRatio: 0.446
      }
    ],
    preparationSteps: [
      "I-extract ang espresso sa tasa.",
      "I-steam ang gatas hanggang umabot sa 60°C - 65°C para makalikha ng makinis na microfoam.",
      "Ibuhos ang gatas na may kasamang latte art."
    ],
    baristaNotes: [
      "Huwag iinit ang gatas nang higit sa 70°C dahil masusunog ang natural sugar ng dairy."
    ]
  },

  // 9. PASSION FRUIT JASMINE TEA
  {
    id: "passion-fruit-tea",
    name: "Passion Fruit Jasmine Green Tea",
    category: "fruittea",
    categoryLabel: "Jasmine Fruit Teas",
    imageUrl: "/beverages/passion-fruit-tea.jpg",
    description: "Malamig at preskong Jasmine green tea na may natural passion fruit pulp at chewy nata / boba pearls.",
    defaultSize: "16oz",
    sizes: [
      {
        size: "16oz",
        sizeLabel: "Medium (16oz)",
        primaryIngredients: [
          { name: "Jasmine Green Tea Base", quantity: 170, unit: "ml", unitPrice: 15, unitPriceUnit: "/l", cost: 2.55 },
          { name: "Passion Fruit Syrup & Pulp", quantity: 30, unit: "ml", unitPrice: 450, unitPriceUnit: "/l", cost: 13.50 },
          { name: "Cooked Boba / Nata Pearls", quantity: 10, unit: "g", unitPrice: 150, unitPriceUnit: "/kg", cost: 1.50 }
        ],
        secondaryIngredients: [
          { name: "Fructose Syrup", quantity: 15, unit: "ml", unitPrice: 135, unitPriceUnit: "/l", cost: 2.03 },
          { name: "Tube Ice", quantity: 100, unit: "g", unitPrice: 10, unitPriceUnit: "/kg", cost: 1.00 }
        ],
        heatAndUtilities: 3.00,
        recipeCost: 23.58,
        packagingCost: 10.00,
        laborCost: 7.07,
        equipmentDepreciation: 0,
        miscCost: 0,
        totalCost: 40.65,
        markup: 74.35,
        walkinPrice: 115.00,
        walkinNetProfit: 74.35,
        foodPandaPrice: 181.10,
        cogsRatio: 0.205
      },
      {
        size: "22oz",
        sizeLabel: "Large (22oz)",
        primaryIngredients: [
          { name: "Jasmine Green Tea Base", quantity: 230, unit: "ml", unitPrice: 15, unitPriceUnit: "/l", cost: 3.45 },
          { name: "Passion Fruit Syrup & Pulp", quantity: 45, unit: "ml", unitPrice: 450, unitPriceUnit: "/l", cost: 20.25 },
          { name: "Cooked Boba / Nata Pearls", quantity: 20, unit: "g", unitPrice: 150, unitPriceUnit: "/kg", cost: 3.00 }
        ],
        secondaryIngredients: [
          { name: "Fructose Syrup", quantity: 20, unit: "ml", unitPrice: 135, unitPriceUnit: "/l", cost: 2.70 },
          { name: "Tube Ice", quantity: 150, unit: "g", unitPrice: 10, unitPriceUnit: "/kg", cost: 1.50 }
        ],
        heatAndUtilities: 3.50,
        recipeCost: 34.40,
        packagingCost: 10.00,
        laborCost: 10.32,
        equipmentDepreciation: 0,
        miscCost: 0,
        totalCost: 54.72,
        markup: 90.28,
        walkinPrice: 145.00,
        walkinNetProfit: 90.28,
        foodPandaPrice: 228.35,
        cogsRatio: 0.237
      }
    ],
    preparationSteps: [
      "Ilagay ang nata o boba pearls sa baso.",
      "Sa shaker, pagsamahin ang jasmine tea base, passion fruit syrup, at fructose.",
      "Lagyan ng yelo at i-shake ng 8-10 segundo.",
      "Isalin at i-serve nang napakalamig."
    ],
    baristaNotes: [
      "Ang Jasmine green tea ay dapat i-brew sa 80°C sa loob ng 7 minuto. Kapag pinakuluan ng 100°C ay papait ang tsaa."
    ]
  },

  // 10. JAVA CHIP BLENDED FRAPPE
  {
    id: "java-chip-frappe",
    name: "Java Chip Chocolate Coffee Frappe",
    category: "blended_frappe",
    categoryLabel: "Frappes & Shakes",
    imageUrl: "/beverages/java-chip-frappe.jpg",
    description: "Ice-blended mocha espresso na may halong dark chocolate chips, creamy frappe base, at whipped cream topping.",
    defaultSize: "16oz",
    sizes: [
      {
        size: "16oz",
        sizeLabel: "Medium (16oz)",
        primaryIngredients: [
          { name: "Espresso Beans (Double Shot)", quantity: 18, unit: "g", unitPrice: 1550, unitPriceUnit: "/kg", cost: 27.90 },
          { name: "Chocolate / Torani Sauce", quantity: 35, unit: "ml", unitPrice: 680, unitPriceUnit: "/l", cost: 23.80 },
          { name: "Frappe Emulsifier Base", quantity: 20, unit: "g", unitPrice: 395, unitPriceUnit: "/kg", cost: 7.90 }
        ],
        secondaryIngredients: [
          { name: "Crushed Tube Ice", quantity: 200, unit: "g", unitPrice: 10, unitPriceUnit: "/kg", cost: 2.00 },
          { name: "Chocolate Drizzle Topping", quantity: 10, unit: "ml", unitPrice: 280, unitPriceUnit: "/l", cost: 2.80 }
        ],
        heatAndUtilities: 5.00,
        recipeCost: 69.40,
        packagingCost: 12.00,
        laborCost: 15.00,
        equipmentDepreciation: 2.00,
        miscCost: 0,
        totalCost: 98.40,
        markup: 66.60,
        walkinPrice: 165.00,
        walkinNetProfit: 66.60,
        foodPandaPrice: 259.85,
        cogsRatio: 0.421
      },
      {
        size: "22oz",
        sizeLabel: "Large (22oz)",
        primaryIngredients: [
          { name: "Espresso Beans (Double Shot)", quantity: 18, unit: "g", unitPrice: 1550, unitPriceUnit: "/kg", cost: 27.90 },
          { name: "Chocolate / Torani Sauce", quantity: 45, unit: "ml", unitPrice: 680, unitPriceUnit: "/l", cost: 30.60 },
          { name: "Frappe Emulsifier Base", quantity: 30, unit: "g", unitPrice: 395, unitPriceUnit: "/kg", cost: 11.85 }
        ],
        secondaryIngredients: [
          { name: "Crushed Tube Ice", quantity: 250, unit: "g", unitPrice: 10, unitPriceUnit: "/kg", cost: 2.50 },
          { name: "Chocolate Drizzle Topping", quantity: 15, unit: "ml", unitPrice: 280, unitPriceUnit: "/l", cost: 4.20 }
        ],
        heatAndUtilities: 5.00,
        recipeCost: 82.05,
        packagingCost: 12.00,
        laborCost: 18.00,
        equipmentDepreciation: 2.00,
        miscCost: 0,
        totalCost: 114.05,
        markup: 80.95,
        walkinPrice: 195.00,
        walkinNetProfit: 80.95,
        foodPandaPrice: 307.09,
        cogsRatio: 0.421
      }
    ],
    preparationSteps: [
      "Ilagay sa commercial blender pitcher ang yelo, espresso, chocolate sauce, at frappe base powder.",
      "I-blend sa Low ng 10 segundo, pagkatapos sa High ng 25 segundo hanggang maging malasutla ang texture.",
      "Isalin sa baso, lagyan ng whipped cream sa ibabaw at i-drizzle ng chocolate sauce."
    ],
    baristaNotes: [
      "Laging gumamit ng frappe base powder! Ito ang sikreto para hindi maghiwalay ang yelo at likido kapag iniwan ng customer."
    ]
  },

  // 11. FRESH PHILIPPINE MANGO SHAKE
  {
    id: "fresh-mango-shake",
    name: "Fresh Philippine Mango Shake",
    category: "fruit_shake_juice",
    categoryLabel: "Real Fruit & Calamansi",
    imageUrl: "/beverages/fresh-mango-shake.jpg",
    description: "Gawa sa tunay na hinog na manggang kalabaw, fresh milk, at condensed milk. Purong sarap ng prutas.",
    defaultSize: "16oz",
    sizes: [
      {
        size: "16oz",
        sizeLabel: "Medium (16oz)",
        primaryIngredients: [
          { name: "Fresh Ripe Mango Slices", quantity: 165, unit: "g", unitPrice: 300, unitPriceUnit: "/kg", cost: 49.50 },
          { name: "Fresh Milk", quantity: 100, unit: "ml", unitPrice: 140, unitPriceUnit: "/l", cost: 14.00 },
          { name: "Sweetened Milk Syrup", quantity: 30, unit: "g", unitPrice: 120, unitPriceUnit: "/kg", cost: 3.60 },
          { name: "Fructose Syrup", quantity: 30, unit: "ml", unitPrice: 150, unitPriceUnit: "/l", cost: 4.50 }
        ],
        secondaryIngredients: [
          { name: "Crushed Ice", quantity: 200, unit: "g", unitPrice: 10, unitPriceUnit: "/kg", cost: 2.00 }
        ],
        heatAndUtilities: 3.00,
        recipeCost: 76.60,
        packagingCost: 10.00,
        laborCost: 15.00,
        equipmentDepreciation: 0,
        miscCost: 0,
        totalCost: 101.60,
        markup: 43.40,
        walkinPrice: 145.00,
        walkinNetProfit: 43.40,
        foodPandaPrice: 228.35,
        cogsRatio: 0.528
      },
      {
        size: "22oz",
        sizeLabel: "Large (22oz)",
        primaryIngredients: [
          { name: "Fresh Ripe Mango Slices", quantity: 220, unit: "g", unitPrice: 300, unitPriceUnit: "/kg", cost: 66.00 },
          { name: "Fresh Milk", quantity: 140, unit: "ml", unitPrice: 140, unitPriceUnit: "/l", cost: 19.60 },
          { name: "Sweetened Milk Syrup", quantity: 40, unit: "g", unitPrice: 120, unitPriceUnit: "/kg", cost: 4.80 },
          { name: "Fructose Syrup", quantity: 40, unit: "ml", unitPrice: 150, unitPriceUnit: "/l", cost: 6.00 }
        ],
        secondaryIngredients: [
          { name: "Crushed Ice", quantity: 250, unit: "g", unitPrice: 10, unitPriceUnit: "/kg", cost: 2.50 }
        ],
        heatAndUtilities: 3.50,
        recipeCost: 102.40,
        packagingCost: 10.00,
        laborCost: 18.00,
        equipmentDepreciation: 0,
        miscCost: 0,
        totalCost: 130.40,
        markup: 44.60,
        walkinPrice: 175.00,
        walkinNetProfit: 44.60,
        foodPandaPrice: 275.63,
        cogsRatio: 0.585
      }
    ],
    preparationSteps: [
      "Ilagay ang sariwang hiwa ng mangga sa blender.",
      "Idagdag ang gatas, milk syrup, at yelo.",
      "I-blend hanggang sa maging pino at creamy.",
      "Ibuhos sa baso at lagyan ng hiwang mangga sa ibabaw kung nais."
    ],
    baristaNotes: [
      "Tiyaking hinog ang mangga bago gamitin. Kapag medyo maasim, dagdagan ng 10ml fructose syrup."
    ]
  },

  // 12. CALAMANSI HONEY COLD PRESS JUICE
  {
    id: "calamansi-honey-juice",
    name: "Native Calamansi Honey Cold Press",
    category: "fruit_shake_juice",
    categoryLabel: "Real Fruit & Calamansi",
    imageUrl: "/beverages/calamansi-honey-juice.jpg",
    description: "100% natural calamansi juice na pinalasa ng purong pulot-pukyutan (honey). Mura ang puhunan pero mataas ang demand.",
    defaultSize: "16oz",
    sizes: [
      {
        size: "16oz",
        sizeLabel: "Medium (16oz)",
        primaryIngredients: [
          { name: "Fresh Native Calamansi", quantity: 10, unit: "pc/s", unitPrice: 2, unitPriceUnit: "/pc", cost: 20.00 },
          { name: "Honey / Fructose Blend", quantity: 20, unit: "ml", unitPrice: 150, unitPriceUnit: "/l", cost: 3.00 }
        ],
        secondaryIngredients: [
          { name: "Tube Ice & Cold Water", quantity: 200, unit: "g", unitPrice: 10, unitPriceUnit: "/kg", cost: 2.00 }
        ],
        heatAndUtilities: 2.00,
        recipeCost: 27.00,
        packagingCost: 10.00,
        laborCost: 5.00,
        equipmentDepreciation: 0,
        miscCost: 0,
        totalCost: 42.00,
        markup: 53.00,
        walkinPrice: 95.00,
        walkinNetProfit: 53.00,
        foodPandaPrice: 149.61,
        cogsRatio: 0.284
      },
      {
        size: "22oz",
        sizeLabel: "Large (22oz)",
        primaryIngredients: [
          { name: "Fresh Native Calamansi", quantity: 15, unit: "pc/s", unitPrice: 2, unitPriceUnit: "/pc", cost: 30.00 },
          { name: "Honey / Fructose Blend", quantity: 30, unit: "ml", unitPrice: 150, unitPriceUnit: "/l", cost: 4.50 }
        ],
        secondaryIngredients: [
          { name: "Tube Ice & Cold Water", quantity: 250, unit: "g", unitPrice: 10, unitPriceUnit: "/kg", cost: 2.50 }
        ],
        heatAndUtilities: 2.00,
        recipeCost: 39.00,
        packagingCost: 10.00,
        laborCost: 7.00,
        equipmentDepreciation: 0,
        miscCost: 0,
        totalCost: 56.00,
        markup: 64.00,
        walkinPrice: 120.00,
        walkinNetProfit: 64.00,
        foodPandaPrice: 188.98,
        cogsRatio: 0.325
      }
    ],
    preparationSteps: [
      "Hiwain at pigain ang calamansi sa baso gamit ang citrus squeezer para hindi mapiga ang buto.",
      "Idagdag ang honey / fructose blend at malamig na tubig.",
      "Punuin ng yelo at haluing maigi."
    ],
    baristaNotes: [
      "Huwag pipigain nang sobra ang balat ng calamansi dahil naglalabas ito ng mapait na citrus oil."
    ]
  },

  // 13. BENGUET ARABICA DRIP COFFEE
  {
    id: "benguet-arabica-drip",
    name: "Benguet Highland Arabica Drip Coffee",
    category: "drip",
    categoryLabel: "Single Drip Coffee",
    imageUrl: "/beverages/benguet-arabica-drip.jpg",
    description: "Single-serve pour over hanging drip bag na may 15g premium medium roast Cordillera Arabica coffee.",
    defaultSize: "1 pc",
    sizes: [
      {
        size: "1 pc",
        sizeLabel: "Single Cup (1 pc)",
        primaryIngredients: [
          { name: "Benguet Arabica Ground Coffee", quantity: 15, unit: "g", unitPrice: 900, unitPriceUnit: "/kg", cost: 13.50 }
        ],
        secondaryIngredients: [
          { name: "Sugar Packet", quantity: 1, unit: "pc/s", unitPrice: 5, unitPriceUnit: "/pc", cost: 5.00 },
          { name: "Japanese Filter Drip Pouch", quantity: 1, unit: "pc/s", unitPrice: 3.5, unitPriceUnit: "/pc", cost: 3.50 }
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
        cogsRatio: 0.435
      }
    ],
    preparationSteps: [
      "Buksan ang drip bag at isabit ang cardboard ears sa bibig ng tasa.",
      "Magbuhos ng 30ml mainit na tubig (92°C) at maghintay ng 30 seconds para sa coffee bloom.",
      "Dahan-dahang ibuhos ang natitirang 150ml na tubig nang paikot.",
      "Alisin ang drip bag at i-enjoy ang sariwang pour-over kape."
    ],
    baristaNotes: [
      "Napaka-patok nito para sa mga nag-oopisina at takeout breakfast bundles kasama ang silog o pastry."
    ]
  }
];
