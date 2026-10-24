import { Recipe, CostingParameters, CostingBreakdown, ScaledIngredientItem } from '../types/recipe';

/**
 * Calculates complete batch food costing, overhead, packaging, suggested retail price (SRP),
 * and projected net profit margins for KusinaKita recipes.
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
  const rawIngredientsCost = scaledIngredients.reduce(
    (sum, item) => sum + item.effectiveCost,
    0
  );

  // Overhead cost (LPG gas, electricity, water, kitchen wear & tear)
  const overheadPercent = Math.max(0, Number(params.overheadPercent) || 0);
  const overheadCost = Number(((rawIngredientsCost * overheadPercent) / 100).toFixed(2));

  // Packaging cost (e.g. food containers, paper bags, disposable spoons, sauce containers)
  const packagingPerServing = Math.max(0, Number(params.packagingCostPerServing) || 0);
  const packagingCost = Number((packagingPerServing * servings).toFixed(2));

  // Total batch production cost
  const totalProductionCost = Number(
    (rawIngredientsCost + overheadCost + packagingCost).toFixed(2)
  );

  // Cost per serving
  const costPerServing = Number((totalProductionCost / servings).toFixed(2));

  // Target profit margin calculation:
  // Margin Formula: SRP = Cost / (1 - MarginRate)
  // Clamp margin between 5% and 85% to prevent division by zero or infinite SRP
  const rawTargetMargin = Number(params.targetMarginPercent);
  const targetMarginPercent = Math.min(85, Math.max(5, isNaN(rawTargetMargin) ? 50 : rawTargetMargin));
  const marginDecimal = targetMarginPercent / 100;

  // Suggested SRP per serving
  // Note: Normalize precision with 4-decimal round prior to Math.ceil to eliminate
  // IEEE 754 precision artifacts (e.g. 99.4 / 0.7 = 142.00000000000003)
  const rawSrp = costPerServing / (1 - marginDecimal);
  const cleanRawSrp = Math.round(rawSrp * 10000) / 10000;
  // Negosyo-friendly psychological rounding (round to nearest whole peso)
  const suggestedSrp = Math.ceil(cleanRawSrp);

  // Suggested Batch Revenue & Net Profit
  const suggestedBatchRevenue = suggestedSrp * servings;
  const netBatchProfit = Number((suggestedBatchRevenue - totalProductionCost).toFixed(2));
  const profitPerServing = Number((suggestedSrp - costPerServing).toFixed(2));

  return {
    servings,
    scaleMultiplier: Number(scaleMultiplier.toFixed(2)),
    rawIngredientsCost: Number(rawIngredientsCost.toFixed(2)),
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
  // Avoid unsightly floating precision issues like 1.3333333
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
