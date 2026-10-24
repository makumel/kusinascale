export type RecipeCategory =
  | 'all'
  | 'carinderia'
  | 'asian'
  | 'western'
  | 'desserts'
  | 'tipid';

export interface CategoryMeta {
  id: RecipeCategory;
  name: string;
  tagline: string;
  count?: number;
}

export type IngredientGroup = 'protein' | 'produce' | 'pantry' | 'dairy' | 'packaging' | 'other';

export interface Ingredient {
  id: string;
  name: string;
  quantity: number; // Base quantity for baseServings
  unit: string; // e.g., 'kg', 'g', 'ml', 'tbsp', 'cup', 'pcs', 'pack'
  baseCost: number; // Base cost in PHP for this quantity in the original recipe
  unitCostDescription?: string; // e.g. "₱240/kg", "₱45/can"
  category?: IngredientGroup;
}

export interface ScaledIngredientItem {
  id: string;
  name: string;
  baseQuantity: number;
  scaledQuantity: number;
  unit: string;
  baseCost: number;
  effectiveCost: number; // current calculated cost (with custom override if applied)
  isOverridden: boolean;
  unitCostDescription?: string;
  category?: IngredientGroup;
}

export interface Recipe {
  id: string;
  name: string;
  tagline: string;
  category: 'carinderia' | 'asian' | 'western' | 'desserts' | 'tipid';
  categoryLabel: string;
  baseServings: number;
  prepTime: string;
  cookTime: string;
  difficulty: 'Madali (Easy)' | 'Katamtaman (Medium)' | 'Negosyo Pro';
  imageUrl: string;
  description: string;
  ingredients: Ingredient[];
  instructions: string[];
  chefTips: string[];
  defaultOverheadPercent: number; // typically 15% (LPG, water, electricity, spoilage)
  defaultPackagingPerServing: number; // e.g. ₱6 (microwavable bowl, lid, spork)
  defaultTargetMargin: number; // e.g. 50%
  marketNotes?: string;
}

export interface OverheadBreakdown {
  lpgCost: number;
  utilitiesCost: number;
  laborCost: number;
  packagingCost: number;
  shrinkageBufferCost: number;
  totalOverhead: number;
}

export interface CostingParameters {
  servings: number;
  targetMarginPercent: number; // e.g., 50 for 50%
  overheadPercent?: number; // legacy / simple mode
  packagingCostPerServing?: number; // per serving
  priceOverrides?: Record<string, number>; // ingredientId -> custom price for this batch
  overheadMode?: 'simple' | 'itemized';
  lpgCost?: number;
  utilitiesCost?: number;
  laborCost?: number;
  shrinkagePercent?: number; // e.g. 4%
  dailyTargetUnits?: number; // for monthly ROI simulator (e.g. 30 servings/day)
}

export interface CostingBreakdown {
  servings: number;
  scaleMultiplier: number;
  rawIngredientsCost: number;
  overheadCost: number;
  packagingCost: number;
  totalProductionCost: number;
  costPerServing: number;
  targetMarginPercent: number;
  suggestedSrp: number;
  suggestedBatchRevenue: number;
  netBatchProfit: number;
  profitPerServing: number;
  scaledIngredients: ScaledIngredientItem[];
  overheadBreakdown: OverheadBreakdown;
  dailyProjection: {
    unitsPerDay: number;
    dailyRevenue: number;
    dailyCost: number;
    dailyProfit: number;
    monthlyProfit: number; // 26 operating days / month
  };
}
