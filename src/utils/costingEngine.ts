import { Recipe, CostingParameters, CostingBreakdown, ScaledIngredientItem, OverheadBreakdown } from '../types/recipe';

/**
 * Calculates complete batch food costing, itemized overhead expenses, packaging,
 * suggested retail price (SRP), and projected net profit margins for KusinaKita recipes.
 */
export function calculateCosting(
  recipe: Recipe,
  params: CostingParameters
): CostingBreakdown {
  const servings = Math.max(1, Math.round(Number(params.servings) || 1));
  const baseServings = Math.max(1, Math.round(Number(recipe.baseServings) || 1));
  const scaleMultiplier = servings / baseServings;

  const priceOverrides = params.priceOverrides || {};

  // Scaled Ingredients breakdown
  const scaledIngredients: ScaledIngredientItem[] = recipe.ingredients.map((ing) => {
    const scaledQty = Number((ing.quantity * scaleMultiplier).toFixed(2));
    const isOverridden = priceOverrides[ing.id] !== undefined && !isNaN(priceOverrides[ing.id]);
    
    // If the user has overridden the price for this ingredient, use their custom cost.
    // Otherwise, calculate standard scaled base cost.
    const effectiveCost = isOverridden
      ? Math.max(0, priceOverrides[ing.id])
      : Number((ing.baseCost * scaleMultiplier).toFixed(2));

    return {
      id: ing.id,
      name: ing.name,
      baseQuantity: ing.quantity,
      scaledQuantity: scaledQty,
      unit: ing.unit,
      baseCost: ing.baseCost,
      effectiveCost,
      isOverridden,
      unitCostDescription: ing.unitCostDescription,
      category: ing.category,
    };
  });

  // Total raw ingredients cost
  const rawIngredientsCost = Number(
    scaledIngredients.reduce((sum, item) => sum + item.effectiveCost, 0).toFixed(2)
  );

  // Packaging cost (food containers, paper bags, disposable spoons, sauce containers)
  const packagingPerServing = Math.max(0, Number(params.packagingCostPerServing ?? recipe.defaultPackagingPerServing));
  const packagingCost = Number((packagingPerServing * servings).toFixed(2));

  // Determine Overhead Mode (Simple Percentage vs. Itemized Commercial Breakdown)
  const overheadMode = params.overheadMode || 'simple';

  let lpgCost = 0;
  let utilitiesCost = 0;
  let laborCost = 0;
  let shrinkageBufferCost = 0;
  let overheadCost = 0;

  if (overheadMode === 'itemized') {
    // Commercial itemized allocation based on batch multiplier
    lpgCost = Number((params.lpgCost ?? Math.round(35 * scaleMultiplier)).toFixed(2));
    utilitiesCost = Number((params.utilitiesCost ?? Math.round(20 * scaleMultiplier)).toFixed(2));
    laborCost = Number((params.laborCost ?? Math.round(50 * scaleMultiplier)).toFixed(2));
    
    const shrinkagePct = Math.max(0, Number(params.shrinkagePercent ?? 4));
    shrinkageBufferCost = Number(((rawIngredientsCost * shrinkagePct) / 100).toFixed(2));

    overheadCost = Number((lpgCost + utilitiesCost + laborCost + shrinkageBufferCost).toFixed(2));
  } else {
    // Standard Simple Mode (% of Raw Ingredients)
    const overheadPercent = Math.max(0, Number(params.overheadPercent ?? recipe.defaultOverheadPercent));
    overheadCost = Number(((rawIngredientsCost * overheadPercent) / 100).toFixed(2));

    // Approximate line-item distribution for visual transparency
    lpgCost = Number((overheadCost * 0.40).toFixed(2));
    utilitiesCost = Number((overheadCost * 0.25).toFixed(2));
    laborCost = Number((overheadCost * 0.20).toFixed(2));
    shrinkageBufferCost = Number((overheadCost * 0.15).toFixed(2));
  }

  const overheadBreakdown: OverheadBreakdown = {
    lpgCost,
    utilitiesCost,
    laborCost,
    packagingCost,
    shrinkageBufferCost,
    totalOverhead: Number((overheadCost + packagingCost).toFixed(2)),
  };

  // Total batch production cost
  const totalProductionCost = Number(
    (rawIngredientsCost + overheadCost + packagingCost).toFixed(2)
  );

  // Cost per serving
  const costPerServing = Number((totalProductionCost / servings).toFixed(2));

  // Target profit margin calculation:
  // Margin Formula: SRP = Cost / (1 - MarginRate)
  const rawTargetMargin = Number(params.targetMarginPercent);
  const targetMarginPercent = Math.min(85, Math.max(5, isNaN(rawTargetMargin) ? recipe.defaultTargetMargin : rawTargetMargin));
  const marginDecimal = targetMarginPercent / 100;

  // Suggested SRP per serving with floating point stabilization
  const rawSrp = costPerServing / (1 - marginDecimal);
  const cleanRawSrp = Math.round(rawSrp * 10000) / 10000;
  const suggestedSrp = Math.ceil(cleanRawSrp);

  // Suggested Batch Revenue & Net Profit
  const suggestedBatchRevenue = suggestedSrp * servings;
  const netBatchProfit = Number((suggestedBatchRevenue - totalProductionCost).toFixed(2));
  const profitPerServing = Number((suggestedSrp - costPerServing).toFixed(2));

  // Daily & Monthly ROI Simulation (default: 30 servings/day, 26 business days/month)
  const unitsPerDay = Math.max(1, Number(params.dailyTargetUnits || 30));
  const dailyRevenue = Number((suggestedSrp * unitsPerDay).toFixed(2));
  const dailyCost = Number((costPerServing * unitsPerDay).toFixed(2));
  const dailyProfit = Number((profitPerServing * unitsPerDay).toFixed(2));
  const monthlyProfit = Number((dailyProfit * 26).toFixed(2));

  return {
    servings,
    scaleMultiplier: Number(scaleMultiplier.toFixed(2)),
    rawIngredientsCost,
    overheadCost,
    packagingCost,
    totalProductionCost,
    costPerServing,
    targetMarginPercent,
    suggestedSrp,
    suggestedBatchRevenue,
    netBatchProfit,
    profitPerServing,
    scaledIngredients,
    overheadBreakdown,
    dailyProjection: {
      unitsPerDay,
      dailyRevenue,
      dailyCost,
      dailyProfit,
      monthlyProfit,
    },
  };
}

/**
 * Format numerical currency value into Philippine Peso string (e.g. ₱1,250.00)
 */
export function formatPHP(value: number): string {
  if (isNaN(value) || !isFinite(value)) return '₱0.00';
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Format quantity with clean human-readable precision
 */
export function formatQuantity(qty: number, unit: string): string {
  if (qty === 0) return `0 ${unit}`;
  const rounded = Math.round(qty * 100) / 100;
  return `${rounded} ${unit}`;
}

/**
 * Calculate commercial markup percentage from margin
 * Markup % = (Profit / Cost) * 100
 */
export function calculateMarkupPercent(srp: number, cost: number): number {
  if (!isFinite(srp) || !isFinite(cost) || cost <= 0) return 0;
  return Math.round(((srp - cost) / cost) * 100);
}
