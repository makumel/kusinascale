import React, { useState, useMemo } from 'react';
import { Recipe, CostingParameters } from '../types/recipe';
import { calculateCosting, formatPHP, formatQuantity, calculateMarkupPercent } from '../utils/costingEngine';
import {
  RotateCcw,
  Sparkles,
  TrendingUp,
  Percent,
  Flame,
  Package,
  Layers,
  Coins,
  DollarSign,
  AlertCircle
} from 'lucide-react';

interface CostingCalculatorProps {
  recipe: Recipe;
  onClose?: () => void;
}

export const CostingCalculator: React.FC<CostingCalculatorProps> = ({ recipe }) => {
  // State for portion servings
  const [servings, setServings] = useState<number>(recipe.baseServings);

  // Target profit margin slider (30% to 70%)
  const [targetMargin, setTargetMargin] = useState<number>(recipe.defaultTargetMargin);

  // Overhead percentage (LPG, electricity, water, minor spoilage)
  const [overheadPercent, setOverheadPercent] = useState<number>(recipe.defaultOverheadPercent);

  // Packaging cost per serving (microwavable container, spork, bag)
  const [packagingPerServing, setPackagingPerServing] = useState<number>(
    recipe.defaultPackagingPerServing
  );

  // Dynamic price overrides (ingredientId -> custom batch cost in PHP)
  const [priceOverrides, setPriceOverrides] = useState<Record<string, number>>({});

  // Memoized costing calculation
  const costingParams: CostingParameters = useMemo(
    () => ({
      servings,
      targetMarginPercent: targetMargin,
      overheadPercent,
      packagingCostPerServing: packagingPerServing,
      priceOverrides,
    }),
    [servings, targetMargin, overheadPercent, packagingPerServing, priceOverrides]
  );

  const breakdown = useMemo(
    () => calculateCosting(recipe, costingParams),
    [recipe, costingParams]
  );

  // Helper to handle individual ingredient price change
  const handleIngredientPriceChange = (id: string, rawVal: string) => {
    if (rawVal === '') {
      const next = { ...priceOverrides };
      delete next[id];
      setPriceOverrides(next);
      return;
    }
    const num = parseFloat(rawVal);
    if (!isNaN(num) && num >= 0) {
      setPriceOverrides((prev) => ({ ...prev, [id]: num }));
    }
  };

  // Reset all custom overrides back to defaults
  const handleResetOverrides = () => {
    setPriceOverrides({});
  };

  // Reset entire calculator to recipe defaults
  const handleResetAll = () => {
    setServings(recipe.baseServings);
    setTargetMargin(recipe.defaultTargetMargin);
    setOverheadPercent(recipe.defaultOverheadPercent);
    setPackagingPerServing(recipe.defaultPackagingPerServing);
    setPriceOverrides({});
  };

  // Quick portion batch presets
  const batchPresets = [
    { label: `Base (${recipe.baseServings} pax)`, value: recipe.baseServings },
    { label: `2x (${recipe.baseServings * 2} pax)`, value: recipe.baseServings * 2 },
    { label: '15 pax (Platter)', value: 15 },
    { label: '25 pax (Carinderia)', value: 25 },
    { label: '50 pax (Fiesta / Catering)', value: 50 },
    { label: '100 pax (Event)', value: 100 },
  ];

  // Profit margin tier classification
  const getMarginClassification = (margin: number) => {
    if (margin < 40) {
      return {
        label: 'Budget / Volume Drive',
        subtext: 'Mababang presyo, kailangan ng maraming volume para kumita nang malaki.',
        badgeClass: 'bg-amber-100 text-amber-900 border-amber-300',
      };
    }
    if (margin <= 55) {
      return {
        label: 'Sweet Spot Negosyo',
        subtext: 'Ideal para sa carinderia, food stall, at cloud kitchen. Balanseng kita at mabilis mabenta.',
        badgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      };
    }
    return {
      label: 'Artisan / High-Margin',
      subtext: 'Pang-catering tray, premium packaging, at gourmet delivery menu.',
      badgeClass: 'bg-indigo-100 text-indigo-900 border-indigo-300',
    };
  };

  const marginInfo = getMarginClassification(targetMargin);
  const markupPercent = calculateMarkupPercent(breakdown.suggestedSrp, breakdown.costPerServing);
  const overriddenCount = Object.keys(priceOverrides).length;

  return (
    <div className="space-y-6">
      {/* Top Controls & Reset Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-stone-200">
        <div>
          <h2 className="font-serif text-lg sm:text-xl font-bold text-stone-900 flex items-center gap-2">
            <span>Kalkulador ng Puhunan at SRP</span>
            <span className="text-xs font-mono font-normal px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-200">
              {breakdown.scaleMultiplier}x Batch Multiplier
            </span>
          </h2>
          <p className="text-xs text-stone-500">
            I-adjust ang dami ng servings at baguhin ang presyo ng sangkap ayon sa wet market mo.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {overriddenCount > 0 && (
            <button
              onClick={handleResetOverrides}
              type="button"
              className="text-xs text-amber-800 bg-amber-50 hover:bg-amber-100 active:scale-95 border border-amber-200 px-2.5 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            >
              <RotateCcw className="w-3 h-3" />
              I-reset {overriddenCount} Custom Prices
            </button>
          )}
          <button
            onClick={handleResetAll}
            type="button"
            className="text-xs text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 active:scale-95 border border-stone-200 px-2.5 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
          >
            <RotateCcw className="w-3 h-3" />
            I-reset Lahat
          </button>
        </div>
      </div>

      {/* KPI Highlight Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {/* Cost per Serving */}
        <div className="bg-stone-900 text-white rounded-2xl p-3.5 sm:p-4 flex flex-col justify-between shadow-md">
          <div className="flex items-center justify-between text-stone-300 text-xs font-medium">
            <span>Puhunan / Serving</span>
            <DollarSign className="w-4 h-4 text-orange-400" />
          </div>
          <div className="mt-2">
            <span className="font-mono text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight break-all">
              {formatPHP(breakdown.costPerServing)}
            </span>
            <div className="text-[11px] text-stone-300 mt-1">
              Kasama ang ingredients + overhead
            </div>
          </div>
        </div>

        {/* Suggested SRP */}
        <div className="bg-gradient-to-br from-orange-600 to-amber-600 text-white rounded-2xl p-3.5 sm:p-4 flex flex-col justify-between shadow-md shadow-orange-600/20">
          <div className="flex items-center justify-between text-orange-100 text-xs font-medium">
            <span>Suggested SRP (Benta)</span>
            <Sparkles className="w-4 h-4 text-amber-200" />
          </div>
          <div className="mt-2">
            <span className="font-mono text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight break-all">
              {formatPHP(breakdown.suggestedSrp)}
            </span>
            <div className="text-[11px] text-orange-100 mt-1">
              Kada plato sa {targetMargin}% margin (+{markupPercent}% markup)
            </div>
          </div>
        </div>

        {/* Profit per Serving */}
        <div className="bg-emerald-950 text-white rounded-2xl p-3.5 sm:p-4 flex flex-col justify-between shadow-md">
          <div className="flex items-center justify-between text-emerald-300 text-xs font-medium">
            <span>Tubo kada Serving</span>
            <Coins className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2">
            <span className="font-mono text-xl sm:text-2xl lg:text-3xl font-bold text-emerald-300 tracking-tight break-all">
              +{formatPHP(breakdown.profitPerServing)}
            </span>
            <div className="text-[11px] text-emerald-200 mt-1">
              Netong kita sa bawat isang order
            </div>
          </div>
        </div>

        {/* Total Batch Profit */}
        <div className="bg-white border-2 border-orange-200 rounded-2xl p-3.5 sm:p-4 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-stone-700 text-xs font-semibold">
            <span>Kabuuang Kita sa Batch</span>
            <TrendingUp className="w-4 h-4 text-orange-600" />
          </div>
          <div className="mt-2">
            <span className="font-mono text-xl sm:text-2xl lg:text-3xl font-bold text-orange-600 tracking-tight break-all">
              {formatPHP(breakdown.netBatchProfit)}
            </span>
            <div className="text-[11px] text-stone-600 mt-1">
              Total benta: {formatPHP(breakdown.suggestedBatchRevenue)}
            </div>
          </div>
        </div>
      </div>

      {/* Main Controls Section: Portions & Profit Sliders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-stone-50/70 p-5 rounded-3xl border border-stone-200/80">
        {/* Left Column: Servings Batch Scaling */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-orange-600" />
              <span>Dami ng Servings (Portion Batch)</span>
            </label>
            <div className="flex items-center gap-1.5 bg-white border border-stone-300 px-3 py-1 rounded-xl shadow-2xs">
              <input
                type="number"
                min="1"
                max="1000"
                value={servings}
                onChange={(e) => setServings(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-16 font-mono text-base font-bold text-stone-900 text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-md"
              />
              <span className="text-xs text-stone-600 font-medium">servings</span>
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex flex-wrap gap-1.5">
            {batchPresets.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => setServings(preset.value)}
                className={`text-xs px-2.5 py-1.5 rounded-lg font-medium transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 cursor-pointer ${
                  servings === preset.value
                    ? 'bg-orange-600 text-white shadow-2xs'
                    : 'bg-white text-stone-700 hover:bg-stone-200/80 border border-stone-200'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Overhead and Packaging Inputs */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            {/* Overhead buffer */}
            <div className="bg-white p-3 rounded-2xl border border-stone-200 space-y-1">
              <div className="flex items-center justify-between text-xs text-stone-700 font-medium">
                <span className="flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-500" />
                  Overhead (Gas/LPG)
                </span>
                <span className="font-mono font-bold text-stone-900">{overheadPercent}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                step="1"
                value={overheadPercent}
                onChange={(e) => setOverheadPercent(Number(e.target.value))}
                className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="text-[10px] text-stone-500 font-medium">
                LPG, tubig, kuryente ({formatPHP(breakdown.overheadCost)})
              </div>
            </div>

            {/* Packaging Allowance */}
            <div className="bg-white p-3 rounded-2xl border border-stone-200 space-y-1">
              <div className="flex items-center justify-between text-xs text-stone-700 font-medium">
                <span className="flex items-center gap-1">
                  <Package className="w-3.5 h-3.5 text-blue-500" />
                  Packaging / Serving
                </span>
                <span className="font-mono font-bold text-stone-900">
                  {formatPHP(packagingPerServing)}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="25"
                step="1"
                value={packagingPerServing}
                onChange={(e) => setPackagingPerServing(Number(e.target.value))}
                className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="text-[10px] text-stone-500 font-medium">
                Microwavable bowl, lid, bag ({formatPHP(breakdown.packagingCost)})
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Target Profit Margin Slider */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <Percent className="w-4 h-4 text-orange-600" />
              <span>Target Profit Margin</span>
            </label>
            <div className="flex items-baseline gap-1 font-mono text-2xl font-black text-orange-600 bg-white border border-stone-300 px-3 py-1 rounded-xl shadow-2xs">
              <span>{targetMargin}</span>
              <span className="text-sm font-bold">%</span>
            </div>
          </div>

          <div className="space-y-2">
            <input
              type="range"
              min="30"
              max="70"
              step="1"
              value={targetMargin}
              onChange={(e) => setTargetMargin(Number(e.target.value))}
              className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
            />
            <div className="flex justify-between text-[11px] font-mono text-stone-500 font-medium">
              <span>30% (Volume)</span>
              <span>50% (Standard)</span>
              <span>70% (Gourmet)</span>
            </div>
          </div>

          {/* Margin Status Card */}
          <div className={`p-3.5 rounded-2xl border text-xs space-y-1 ${marginInfo.badgeClass}`}>
            <div className="flex items-center justify-between font-bold">
              <span>Estratehiya: {marginInfo.label}</span>
              <span className="font-mono">+{markupPercent}% Commercial Markup</span>
            </div>
            <p className="text-[11px] opacity-90 leading-relaxed">{marginInfo.subtext}</p>
          </div>

          {/* Quick batch revenue summary line */}
          <div className="bg-white p-3 rounded-2xl border border-stone-200 flex items-center justify-between text-xs text-stone-700">
            <span>Kabuuang Gastos sa Produksyon:</span>
            <span className="font-mono font-bold text-stone-900">
              {formatPHP(breakdown.totalProductionCost)}
            </span>
          </div>
        </div>
      </div>

      {/* Dynamic Ingredient Table with Live Overrides */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-base font-bold text-stone-900 flex items-center gap-2">
            <span>Listahan ng Sangkap at Presyo</span>
            <span className="text-xs font-sans text-stone-600 font-medium">
              (Puwede mong i-type ang sarili mong presyo sa palengke)
            </span>
          </h3>
          <span className="text-xs text-stone-600 font-mono font-medium">
            {breakdown.scaledIngredients.length} Sangkap
          </span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-stone-200 bg-white shadow-2xs">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Sangkap (Ingredient)</th>
                <th className="py-3 px-3">Base Qty</th>
                <th className="py-3 px-3">Batch Qty ({breakdown.scaleMultiplier}x)</th>
                <th className="py-3 px-3">Base Presyo</th>
                <th className="py-3 px-4 text-right">Batch Halaga (PHP)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {breakdown.scaledIngredients.map((item) => (
                <tr
                  key={item.id}
                  className={`hover:bg-amber-50/50 transition-colors ${
                    item.isOverridden ? 'bg-orange-50/40' : ''
                  }`}
                >
                  <td className="py-3 px-4">
                    <div className="font-medium text-stone-900 flex items-center gap-1.5">
                      <span>{item.name}</span>
                      {item.isOverridden && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-orange-100 text-orange-800 font-semibold">
                          Custom
                        </span>
                      )}
                    </div>
                    {item.unitCostDescription && (
                      <span className="text-[10px] text-stone-500 block">
                        {item.unitCostDescription}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 font-mono text-stone-600">
                    {formatQuantity(item.baseQuantity, item.unit)}
                  </td>
                  <td className="py-3 px-3 font-mono font-semibold text-stone-900">
                    {formatQuantity(item.scaledQuantity, item.unit)}
                  </td>
                  <td className="py-3 px-3 font-mono text-stone-600 font-medium">
                    {formatPHP(item.baseCost * breakdown.scaleMultiplier)}
                  </td>
                  <td className="py-2.5 px-4 text-right">
                    <div className="inline-flex items-center gap-1.5 bg-stone-50 border border-stone-300 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500/30 rounded-lg px-2 py-1">
                      <span className="text-stone-500 font-mono text-xs font-semibold">₱</span>
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        value={item.effectiveCost}
                        onChange={(e) => handleIngredientPriceChange(item.id, e.target.value)}
                        className="w-20 text-right font-mono text-xs font-bold text-stone-900 bg-transparent focus:outline-none"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-stone-50 border-t border-stone-200 text-xs font-semibold">
              <tr>
                <td colSpan={4} className="py-3 px-4 text-stone-600">
                  Kabuuang Raw Ingredients Cost:
                </td>
                <td className="py-3 px-4 text-right font-mono font-bold text-stone-900 text-sm">
                  {formatPHP(breakdown.rawIngredientsCost)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Production Cost Breakdown Notice */}
      <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-3 text-xs text-amber-900">
        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold">Negosyo Tip sa Pagpepresyo:</span>
          <p className="leading-relaxed">
            Ang Suggested SRP na <strong className="font-mono">{formatPHP(breakdown.suggestedSrp)}</strong> ay
            kalkulado gamit ang gross profit margin formula na nagbibigay ng tamang proteksyon sa
            pagtaas ng bilihin at hindi simpleng cost-plus markup lamang. Kasama na rito ang{' '}
            <strong className="font-mono">{overheadPercent}%</strong> na allowance sa LPG gas/kuryente at{' '}
            <strong className="font-mono">{formatPHP(packagingPerServing)}</strong> kada takeout box o supot.
          </p>
        </div>
      </div>
    </div>
  );
};
