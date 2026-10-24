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
  Zap,
  UserCheck,
  Scale,
  Calendar,
  Store,
  Sliders
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

  // Overhead Mode: 'simple' vs 'itemized'
  const [overheadMode, setOverheadMode] = useState<'simple' | 'itemized'>('itemized');

  // Simple overhead percentage
  const [overheadPercent, setOverheadPercent] = useState<number>(recipe.defaultOverheadPercent);

  // Itemized Overhead line items
  const scaleMultiplier = servings / recipe.baseServings;
  const [lpgCost, setLpgCost] = useState<number>(Math.round(35 * scaleMultiplier));
  const [utilitiesCost, setUtilitiesCost] = useState<number>(Math.round(20 * scaleMultiplier));
  const [laborCost, setLaborCost] = useState<number>(Math.round(50 * scaleMultiplier));
  const [shrinkagePercent, setShrinkagePercent] = useState<number>(4);

  // Packaging cost per serving (microwavable container, spork, bag)
  const [packagingPerServing, setPackagingPerServing] = useState<number>(
    recipe.defaultPackagingPerServing
  );

  // Market Price Preset: 'palengke' (1.0x) vs 'supermarket' (1.20x)
  const [marketPreset, setMarketPreset] = useState<'palengke' | 'supermarket'>('palengke');

  // Daily target sales volume for ROI projection
  const [dailyTargetUnits, setDailyTargetUnits] = useState<number>(30);

  // Dynamic price overrides (ingredientId -> custom batch cost in PHP)
  const [priceOverrides, setPriceOverrides] = useState<Record<string, number>>({});

  // Compute active price overrides considering market preset
  const computedOverrides = useMemo(() => {
    const result: Record<string, number> = { ...priceOverrides };
    if (marketPreset === 'supermarket') {
      recipe.ingredients.forEach((ing) => {
        if (result[ing.id] === undefined) {
          result[ing.id] = Number((ing.baseCost * scaleMultiplier * 1.20).toFixed(2));
        }
      });
    }
    return result;
  }, [priceOverrides, marketPreset, recipe.ingredients, scaleMultiplier]);

  // Memoized costing calculation
  const costingParams: CostingParameters = useMemo(
    () => ({
      servings,
      targetMarginPercent: targetMargin,
      overheadMode,
      overheadPercent,
      packagingCostPerServing: packagingPerServing,
      lpgCost,
      utilitiesCost,
      laborCost,
      shrinkagePercent,
      dailyTargetUnits,
      priceOverrides: computedOverrides,
    }),
    [
      servings,
      targetMargin,
      overheadMode,
      overheadPercent,
      packagingPerServing,
      lpgCost,
      utilitiesCost,
      laborCost,
      shrinkagePercent,
      dailyTargetUnits,
      computedOverrides,
    ]
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
    setMarketPreset('palengke');
  };

  // Reset entire calculator to recipe defaults
  const handleResetAll = () => {
    setServings(recipe.baseServings);
    setTargetMargin(recipe.defaultTargetMargin);
    setOverheadMode('itemized');
    setOverheadPercent(recipe.defaultOverheadPercent);
    setLpgCost(35);
    setUtilitiesCost(20);
    setLaborCost(50);
    setShrinkagePercent(4);
    setPackagingPerServing(recipe.defaultPackagingPerServing);
    setMarketPreset('palengke');
    setDailyTargetUnits(30);
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

  const getMarginBadgeClass = (margin: number) => {
    if (margin < 40) return 'bg-amber-100 text-amber-900 border-amber-300';
    if (margin <= 55) return 'bg-emerald-100 text-emerald-900 border-emerald-300';
    return 'bg-indigo-100 text-indigo-900 border-indigo-300';
  };

  const getMarginLabel = (margin: number) => {
    if (margin < 40) return 'Budget / Volume Drive';
    if (margin <= 55) return 'Sweet Spot Negosyo';
    return 'Artisan / High-Margin';
  };

  const getMarginSubtext = (margin: number) => {
    if (margin < 40) return 'Mababang presyo, kailangan ng maraming volume para kumita nang malaki.';
    if (margin <= 55) return 'Ideal para sa carinderia, food stall, at cloud kitchen. Balanseng kita at mabilis mabenta.';
    return 'Pang-catering tray, premium packaging, at gourmet delivery menu.';
  };

  const markupPercent = calculateMarkupPercent(breakdown.suggestedSrp, breakdown.costPerServing);
  const overriddenCount = Object.keys(priceOverrides).length;

  return (
    <div className="space-y-6">
      {/* Top Controls & Reset Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-stone-200">
        <div>
          <h2 className="font-serif text-lg sm:text-xl font-bold text-stone-900 flex items-center gap-2">
            <span>Kalkulador ng Puhunan at Suggested SRP</span>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              {breakdown.scaleMultiplier}x Batch Multiplier
            </span>
          </h2>
          <p className="text-xs text-stone-500">
            Kumpletong commercial costing kabilang ang sangkap, LPG, tubig, kuryente, labor, at tapyas buffer.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {overriddenCount > 0 && (
            <button
              onClick={handleResetOverrides}
              type="button"
              className="text-xs text-orange-600 hover:text-orange-700 underline font-medium cursor-pointer"
            >
              I-reset {overriddenCount} binagong presyo
            </button>
          )}
          <button
            onClick={handleResetAll}
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-xl transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>I-reset Lahat</span>
          </button>
        </div>
      </div>

      {/* Market Sourcing Preset Selector (Wet Market vs Supermarket) */}
      <div className="flex items-center justify-between bg-stone-100/80 p-2.5 rounded-2xl border border-stone-200 text-xs">
        <div className="flex items-center gap-2">
          <Store className="w-4 h-4 text-emerald-700" />
          <span className="font-bold text-stone-800">Pinagbilhan ng Sangkap:</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setMarketPreset('palengke')}
            type="button"
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              marketPreset === 'palengke'
                ? 'bg-emerald-700 text-white shadow-2xs'
                : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            Palengke / Wet Market (Base)
          </button>
          <button
            onClick={() => setMarketPreset('supermarket')}
            type="button"
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              marketPreset === 'supermarket'
                ? 'bg-emerald-700 text-white shadow-2xs'
                : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            Supermarket / Mall (+20%)
          </button>
        </div>
      </div>

      {/* KPI Cards: Puhunan vs SRP vs Kita */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Cost per Serving */}
        <div className="bg-white border border-stone-200 rounded-2xl p-3.5 sm:p-4 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between text-stone-500 text-xs font-medium">
            <span>Puhunan / Serving</span>
            <Coins className="w-4 h-4 text-stone-400" />
          </div>
          <div className="mt-2">
            <span className="font-mono text-xl sm:text-2xl lg:text-3xl font-bold text-stone-900 tracking-tight break-all">
              {formatPHP(breakdown.costPerServing)}
            </span>
            <div className="text-[11px] text-stone-500 mt-1">
              Kabuuang puhunan: {formatPHP(breakdown.totalProductionCost)}
            </div>
          </div>
        </div>

        {/* Suggested SRP */}
        <div className="bg-white border-2 border-emerald-600 rounded-2xl p-3.5 sm:p-4 flex flex-col justify-between shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-emerald-800 text-xs font-bold">
            <span>Suggested SRP</span>
            <Sparkles className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2">
            <span className="font-mono text-xl sm:text-2xl lg:text-3xl font-black text-emerald-700 tracking-tight break-all">
              {formatPHP(breakdown.suggestedSrp)}
            </span>
            <div className="text-[11px] text-emerald-700 font-semibold mt-1">
              {targetMargin}% Margin ({markupPercent}% Markup)
            </div>
          </div>
        </div>

        {/* Profit per Serving */}
        <div className="bg-emerald-950 text-white rounded-2xl p-3.5 sm:p-4 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-emerald-200 text-xs font-semibold">
            <span>Tubo kada Serving</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
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
              Total benta: {formatPHP(breakdown.suggestedBatchRevenue)} ({servings} pax)
            </div>
          </div>
        </div>
      </div>

      {/* Main Controls: Portions, Margin & Overhead Switcher */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-stone-50/80 p-5 rounded-3xl border border-stone-200/80">
        {/* Left Column: Servings Batch Scaling */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-700" />
              <span>Dami ng Servings (Portion Batch)</span>
            </label>
            <div className="flex items-center gap-1.5 bg-white border border-stone-300 px-3 py-1 rounded-xl shadow-2xs">
              <input
                type="number"
                min="1"
                max="1000"
                value={servings}
                onChange={(e) => setServings(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-16 font-mono text-base font-bold text-stone-900 text-center focus:outline-none"
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
                className={`text-xs px-2.5 py-1.5 rounded-lg font-medium transition-all active:scale-95 cursor-pointer ${
                  servings === preset.value
                    ? 'bg-emerald-700 text-white shadow-2xs font-bold'
                    : 'bg-white text-stone-700 hover:bg-stone-200/80 border border-stone-200'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Target Profit Margin Slider */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <Percent className="w-4 h-4 text-emerald-700" />
              <span>Target Profit Margin</span>
            </label>
            <div className="flex items-baseline gap-1 font-mono text-2xl font-black text-emerald-700 bg-white border border-stone-300 px-3 py-1 rounded-xl shadow-2xs">
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
              className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex justify-between text-[11px] font-mono text-stone-500 font-medium">
              <span>30% (Volume Drive)</span>
              <span>50% (Standard Sweet Spot)</span>
              <span>70% (Artisan / Gourmet)</span>
            </div>
          </div>

          <div className={`p-3 rounded-xl border text-xs space-y-1 ${getMarginBadgeClass(targetMargin)}`}>
            <div className="font-bold">{getMarginLabel(targetMargin)}</div>
            <p className="text-[11px] leading-relaxed opacity-90">{getMarginSubtext(targetMargin)}</p>
          </div>
        </div>
      </div>

      {/* Professional Overhead Expenses Breakdown Suite */}
      <section className="bg-white rounded-3xl border border-stone-200 p-5 sm:p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-emerald-700" />
              <h3 className="font-serif text-lg font-bold text-stone-900">
                Overhead Expenses &amp; Operasyonal na Gastusin
              </h3>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Isama ang LPG, kuryente, tubig, packaging, at tapyas para sigurado ang tunay na kita.
            </p>
          </div>

          {/* Mode Toggle */}
          <div className="inline-flex p-1 rounded-xl bg-stone-100 border border-stone-200 text-xs">
            <button
              onClick={() => setOverheadMode('simple')}
              type="button"
              className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                overheadMode === 'simple'
                  ? 'bg-white text-stone-900 shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Simpleng Porsyento (%)
            </button>
            <button
              onClick={() => setOverheadMode('itemized')}
              type="button"
              className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                overheadMode === 'itemized'
                  ? 'bg-emerald-700 text-white shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Itemized Commercial (Pro)
            </button>
          </div>
        </div>

        {overheadMode === 'simple' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-stone-800">
                <span className="flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-500" />
                  Overhead Rate (% ng Sangkap)
                </span>
                <span className="font-mono text-sm font-bold text-emerald-700">{overheadPercent}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="30"
                step="1"
                value={overheadPercent}
                onChange={(e) => setOverheadPercent(Number(e.target.value))}
                className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <p className="text-[11px] text-stone-500">
                Kabuuang gastusin sa gas, tubig, at kuryente: <strong className="text-stone-800">{formatPHP(breakdown.overheadCost)}</strong>
              </p>
            </div>

            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-stone-800">
                <span className="flex items-center gap-1.5">
                  <Package className="w-4 h-4 text-blue-500" />
                  Packaging Allowance kada Serving
                </span>
                <span className="font-mono text-sm font-bold text-emerald-700">{formatPHP(packagingPerServing)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="25"
                step="0.5"
                value={packagingPerServing}
                onChange={(e) => setPackagingPerServing(Number(e.target.value))}
                className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <p className="text-[11px] text-stone-500">
                Microwavable bowl, lid, at bag para sa {servings} pax: <strong className="text-stone-800">{formatPHP(breakdown.packagingCost)}</strong>
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {/* LPG Gas */}
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                  <Flame className="w-4 h-4 text-amber-600" />
                  <span>LPG Cooking Fuel</span>
                </div>
                <div className="flex items-center gap-1 bg-white border border-amber-200 rounded-xl px-2.5 py-1">
                  <span className="text-xs text-stone-400 font-mono">₱</span>
                  <input
                    type="number"
                    min="0"
                    value={lpgCost}
                    onChange={(e) => setLpgCost(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full text-sm font-mono font-bold text-stone-900 focus:outline-none"
                  />
                </div>
                <p className="text-[10px] text-stone-500">Estimated para sa batch</p>
              </div>

              {/* Utilities */}
              <div className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-200 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-sky-900">
                  <Zap className="w-4 h-4 text-sky-600" />
                  <span>Kuryente &amp; Tubig</span>
                </div>
                <div className="flex items-center gap-1 bg-white border border-sky-200 rounded-xl px-2.5 py-1">
                  <span className="text-xs text-stone-400 font-mono">₱</span>
                  <input
                    type="number"
                    min="0"
                    value={utilitiesCost}
                    onChange={(e) => setUtilitiesCost(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full text-sm font-mono font-bold text-stone-900 focus:outline-none"
                  />
                </div>
                <p className="text-[10px] text-stone-500">Ilaw, hugas, ref</p>
              </div>

              {/* Labor */}
              <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900">
                  <UserCheck className="w-4 h-4 text-indigo-600" />
                  <span>Sahod sa Kusinero</span>
                </div>
                <div className="flex items-center gap-1 bg-white border border-indigo-200 rounded-xl px-2.5 py-1">
                  <span className="text-xs text-stone-400 font-mono">₱</span>
                  <input
                    type="number"
                    min="0"
                    value={laborCost}
                    onChange={(e) => setLaborCost(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full text-sm font-mono font-bold text-stone-900 focus:outline-none"
                  />
                </div>
                <p className="text-[10px] text-stone-500">Cook/helper prep share</p>
              </div>

              {/* Packaging */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                  <Package className="w-4 h-4 text-emerald-600" />
                  <span>Packaging / Pax</span>
                </div>
                <div className="flex items-center gap-1 bg-white border border-emerald-200 rounded-xl px-2.5 py-1">
                  <span className="text-xs text-stone-400 font-mono">₱</span>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={packagingPerServing}
                    onChange={(e) => setPackagingPerServing(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full text-sm font-mono font-bold text-stone-900 focus:outline-none"
                  />
                </div>
                <p className="text-[10px] text-stone-500">Total: {formatPHP(breakdown.packagingCost)}</p>
              </div>

              {/* Shrinkage Buffer */}
              <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-purple-900">
                  <Scale className="w-4 h-4 text-purple-600" />
                  <span>Tapyas Buffer ({shrinkagePercent}%)</span>
                </div>
                <div className="flex items-center gap-1 bg-white border border-purple-200 rounded-xl px-2.5 py-1">
                  <input
                    type="number"
                    min="0"
                    max="15"
                    value={shrinkagePercent}
                    onChange={(e) => setShrinkagePercent(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full text-sm font-mono font-bold text-stone-900 focus:outline-none"
                  />
                  <span className="text-xs text-stone-400 font-mono">%</span>
                </div>
                <p className="text-[10px] text-stone-500">{formatPHP(breakdown.overheadBreakdown.shrinkageBufferCost)} bawas</p>
              </div>
            </div>

            {/* Itemized Summary Pill */}
            <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="text-stone-600">
                Kabuuang Itemized Overhead para sa {servings} pax:
              </span>
              <span className="font-mono font-bold text-emerald-800 text-sm">
                {formatPHP(breakdown.overheadBreakdown.totalOverhead)} (LPG + Utilities + Labor + Packaging + Tapyas)
              </span>
            </div>
          </div>
        )}
      </section>

      {/* Daily & Monthly ROI Profit Projection Simulator */}
      <section className="bg-gradient-to-r from-emerald-900 via-teal-900 to-stone-900 rounded-3xl p-5 sm:p-6 text-white shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-emerald-800/60 pb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-300" />
            <div>
              <h3 className="font-serif text-base sm:text-lg font-bold text-white">
                Buwanang Negosyo ROI Simulator (26 Araw)
              </h3>
              <p className="text-xs text-emerald-200">
                Tantyahin ang kikitain kada buwan batay sa dami ng order na maibebenta kada araw.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-emerald-950/80 border border-emerald-700/60 px-3 py-1.5 rounded-xl">
            <span className="text-xs text-emerald-200 font-medium">Benta kada Araw:</span>
            <input
              type="number"
              min="1"
              max="1000"
              value={dailyTargetUnits}
              onChange={(e) => setDailyTargetUnits(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-14 text-center font-mono font-bold text-sm bg-white text-stone-900 rounded-lg focus:outline-none"
            />
            <span className="text-xs text-emerald-200">orders</span>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
            <span className="text-[11px] text-emerald-300 font-medium block">Puhunan kada Araw</span>
            <span className="font-mono text-lg sm:text-xl font-bold text-white">
              {formatPHP(breakdown.dailyProjection.dailyCost)}
            </span>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
            <span className="text-[11px] text-emerald-300 font-medium block">Total Benta kada Araw</span>
            <span className="font-mono text-lg sm:text-xl font-bold text-white">
              {formatPHP(breakdown.dailyProjection.dailyRevenue)}
            </span>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
            <span className="text-[11px] text-amber-300 font-medium block">Netong Kita kada Araw</span>
            <span className="font-mono text-lg sm:text-xl font-bold text-amber-300">
              +{formatPHP(breakdown.dailyProjection.dailyProfit)}
            </span>
          </div>

          <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 p-3.5 rounded-2xl font-bold shadow-md">
            <span className="text-[11px] text-stone-900 font-semibold block uppercase tracking-wider">
              Netong Kita Kada Buwan
            </span>
            <span className="font-mono text-xl sm:text-2xl font-black text-stone-950">
              {formatPHP(breakdown.dailyProjection.monthlyProfit)}
            </span>
            <span className="text-[10px] text-stone-800 font-medium block mt-0.5">
              (Batay sa 26 operating days)
            </span>
          </div>
        </div>
      </section>

      {/* Raw Ingredients Cost Breakdown Table */}
      <section className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-serif text-base sm:text-lg font-bold text-stone-900">
              Talaan ng mga Sangkap at Presyo sa Palengke
            </h3>
            <p className="text-xs text-stone-500">
              Maaari mong baguhin ang halaga sa kolum ng &quot;Aktwal na Halaga&quot; ayon sa binili mo sa palengke.
            </p>
          </div>
          <div className="text-xs text-stone-600 bg-stone-100 px-3 py-1.5 rounded-xl font-semibold">
            Raw Sangkap Subtotal: <span className="font-mono text-stone-900">{formatPHP(breakdown.rawIngredientsCost)}</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 uppercase tracking-wider text-[11px] font-bold">
              <tr>
                <th className="py-3 px-4">Sangkap</th>
                <th className="py-3 px-4">Dami ({servings} pax)</th>
                <th className="py-3 px-4 hidden sm:table-cell">Baseline Wet Market</th>
                <th className="py-3 px-4 text-right">Aktwal na Halaga (₱)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {breakdown.scaledIngredients.map((item) => (
                <tr key={item.id} className="hover:bg-stone-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-semibold text-stone-900 block">{item.name}</span>
                    <span className="text-[11px] text-stone-500 font-mono capitalize">
                      {item.category || 'Sangkap'}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-medium text-stone-800">
                    {formatQuantity(item.scaledQuantity, item.unit)}
                  </td>
                  <td className="py-3 px-4 text-stone-500 hidden sm:table-cell font-mono text-xs">
                    {item.unitCostDescription || formatPHP(item.baseCost)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center gap-1 bg-stone-50 border border-stone-300 rounded-xl px-2.5 py-1 focus-within:ring-2 focus-within:ring-emerald-500">
                      <span className="text-xs text-stone-400 font-mono">₱</span>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={item.effectiveCost}
                        onChange={(e) => handleIngredientPriceChange(item.id, e.target.value)}
                        className="w-20 font-mono text-right font-bold text-stone-900 text-xs sm:text-sm focus:outline-none"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
