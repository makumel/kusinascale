import os

modal_code = '''import React, { useState } from 'react';
import { BeverageRecipe } from '../data/coffeeMilkteaData';
import {
  X,
  FileSpreadsheet,
  Coffee,
  Calculator,
  Printer,
  Copy,
  Check,
  Minus,
  Plus,
  Clock,
  Flame,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  Layers,
  Scale,
  Info
} from 'lucide-react';

interface BeverageRecipeModalProps {
  recipe: BeverageRecipe | null;
  onClose: () => void;
  initialTab?: 'spreadsheet' | 'sop' | 'simulator';
}

const BATCH_SIZES = [1, 5, 10, 25, 50];

export const BeverageRecipeModal: React.FC<BeverageRecipeModalProps> = ({
  recipe,
  onClose,
  initialTab = 'spreadsheet'
}) => {
  const [activeTab, setActiveTab] = useState<'spreadsheet' | 'sop' | 'simulator'>(initialTab);
  const [batchCount, setBatchCount] = useState<number>(1);
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  const [copied, setCopied] = useState<boolean>(false);

  // Simulator Overrides State
  const [customMilkPrice, setCustomMilkPrice] = useState<number>(140);
  const [customBeanPrice, setCustomBeanPrice] = useState<number>(1550);
  const [customPackagingCost, setCustomPackagingCost] = useState<number>(recipe ? recipe.packagingCost : 10);
  const [customLaborCost, setCustomLaborCost] = useState<number>(recipe ? recipe.laborCost : 10);
  const [customMarkupPercent, setCustomMarkupPercent] = useState<number>(50);
  const [customPandaCommission, setCustomPandaCommission] = useState<number>(30);
  const [customPromoPercent, setCustomPromoPercent] = useState<number>(5);

  if (!recipe) return null;

  // Toggle SOP step completion
  const toggleStep = (idx: number) => {
    setCompletedSteps(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  // Copy ingredients list for grocery / inventory replenishment
  const handleCopyIngredients = () => {
    const lines = [
      `*** KUSINAKITA RECIPE: ${recipe.name} (${recipe.size}) ***`,
      `Batch Size: ${batchCount} cup(s)`,
      `Category: ${recipe.categoryLabel}`,
      `--- Primary Ingredients ---`,
      ...recipe.primaryIngredients.map(ing => `- ${ing.name}: ${(ing.quantity * batchCount).toFixed(1)} ${ing.unit} (₱${(ing.cost * batchCount).toFixed(2)})`),
      `--- Secondary Ingredients ---`,
      ...recipe.secondaryIngredients.map(ing => `- ${ing.name}: ${(ing.quantity * batchCount).toFixed(1)} ${ing.unit} (₱${(ing.cost * batchCount).toFixed(2)})`),
      `Total Food Cost: ₱${(recipe.recipeCost * batchCount).toFixed(2)}`,
      `Total Cost (w/ Pack & Labor): ₱${(recipe.totalCost * batchCount).toFixed(2)}`,
      `Walk-in SRP: ₱${recipe.walkinPrice.toFixed(2)} / cup (Total Revenue: ₱${(recipe.walkinPrice * batchCount).toFixed(2)})`,
      `FoodPanda SRP (30% Protected): ₱${recipe.foodPandaPrice.toFixed(2)} / cup`
    ];
    navigator.clipboard.writeText(lines.join('\\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simulator Calculations
  const simRecipeCost = recipe.primaryIngredients.reduce((sum, ing) => {
    let unitCost = ing.unitPrice;
    if (ing.name.toLowerCase().includes('milk') && ing.unit === 'ml') {
      unitCost = customMilkPrice;
    } else if (ing.name.toLowerCase().includes('coffee') && ing.unit === 'g') {
      unitCost = customBeanPrice;
    }
    const divisor = ing.unitPriceUnit === '/kg' || ing.unitPriceUnit === '/l' ? 1000 : 1;
    return sum + (ing.quantity * (unitCost / divisor));
  }, 0) + recipe.secondaryIngredients.reduce((sum, ing) => sum + ing.cost, 0) + recipe.heatAndUtilities;

  const simTotalCost = simRecipeCost + customPackagingCost + customLaborCost + recipe.miscCost + recipe.equipmentDepreciation;
  const simWalkinPrice = simTotalCost * (1 + (customMarkupPercent / 100));
  const simWalkinProfit = simWalkinPrice - simTotalCost;
  const simPandaPrice = simWalkinPrice / (1 - (customPandaCommission / 100) - (customPromoPercent / 100));
  const simPandaNetPayout = simPandaPrice * (1 - (customPandaCommission / 100) - (customPromoPercent / 100));
  const simPandaProfit = simPandaNetPayout - simTotalCost;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto max-h-[94vh] flex flex-col">
        
        {/* Modal Top Header */}
        <header className="bg-stone-900 text-white p-4 sm:p-6 border-b border-stone-800 flex flex-col gap-4 sticky top-0 z-20 shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold shrink-0">
                <Coffee className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider text-amber-300 bg-amber-950/80 border border-amber-800/80 px-2 py-0.5 rounded-full">
                    {recipe.categoryLabel}
                  </span>
                  <span className="text-xs text-stone-500">•</span>
                  <span className="text-xs font-mono text-emerald-400 font-semibold">
                    Yield: {batchCount} {batchCount === 1 ? 'pc / cup' : 'pcs / cups'} ({recipe.size})
                  </span>
                </div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-white mt-0.5">
                  {recipe.name} <span className="text-amber-400 font-sans text-base font-normal">({recipe.size})</span>
                </h2>
                <p className="text-xs text-stone-400 line-clamp-1">
                  {recipe.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white text-xs font-semibold border border-stone-700 transition cursor-pointer"
                title="I-print ang Barista Recipe Sheet"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>

              <button
                onClick={handleCopyIngredients}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white text-xs font-semibold border border-stone-700 transition cursor-pointer"
                title="Kopyahin ang sangkap para sa grocery list"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{copied ? 'Kopya na!' : 'Kopyahin'}</span>
              </button>

              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation Tab Bar: Drive Spreadsheet vs Barista SOP vs Live Costing Simulator */}
          <div className="flex items-center justify-between border-t border-stone-800/80 pt-3 gap-2 flex-wrap">
            <div className="flex items-center p-1 bg-stone-950/70 rounded-xl border border-stone-800 text-xs font-bold">
              <button
                onClick={() => setActiveTab('spreadsheet')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  activeTab === 'spreadsheet'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Drive Spreadsheet Format</span>
              </button>

              <button
                onClick={() => setActiveTab('sop')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  activeTab === 'sop'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <Coffee className="w-3.5 h-3.5" />
                <span>Barista Kitchen &amp; SOP</span>
              </button>

              <button
                onClick={() => setActiveTab('simulator')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  activeTab === 'simulator'
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>Live Margin Simulator</span>
              </button>
            </div>

            {/* Batch / Serving Scaler */}
            <div className="flex items-center gap-1.5 bg-stone-950/80 px-2 py-1 rounded-xl border border-stone-800 text-xs">
              <Scale className="w-3.5 h-3.5 text-stone-400 hidden sm:block" />
              <span className="text-stone-400 text-[11px] font-semibold hidden md:inline">Batch:</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setBatchCount(prev => Math.max(1, prev - 1))}
                  className="p-1 rounded bg-stone-800 text-stone-300 hover:text-white hover:bg-stone-700 cursor-pointer"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="font-mono font-bold text-amber-300 px-1 text-xs">{batchCount}x</span>
                <button
                  onClick={() => setBatchCount(prev => prev + 1)}
                  className="p-1 rounded bg-stone-800 text-stone-300 hover:text-white hover:bg-stone-700 cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              {/* Quick Batch Pills */}
              <div className="hidden sm:flex items-center gap-1 pl-1 border-l border-stone-800">
                {BATCH_SIZES.map(b => (
                  <button
                    key={b}
                    onClick={() => setBatchCount(b)}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold transition cursor-pointer ${
                      batchCount === b
                        ? 'bg-amber-500 text-stone-950 font-black'
                        : 'bg-stone-800 text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    {b}x
                  </button>
                ))}
              </div>
            </div>
          </div>
        </header>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 bg-stone-50/50">

          {/* ========================================================= */}
          {/* TAB 1: EXACT ORIGINAL DRIVE SPREADSHEET FORMAT            */}
          {/* ========================================================= */}
          {activeTab === 'spreadsheet' && (
            <div className="space-y-6">
              
              {/* Authenticity Banner */}
              <div className="bg-emerald-950 text-emerald-100 rounded-2xl p-4 border border-emerald-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-800/80 flex items-center justify-center text-white shrink-0 font-bold">
                    📊
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-white">Official Google Drive / Excel Sheet Costing Model</h4>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-800 text-emerald-200 font-mono">5-Year Commercial Calibrated</span>
                    </div>
                    <p className="text-xs text-emerald-200/90 leading-tight mt-0.5">
                      Recreates the exact row-by-row structure from the master spreadsheet: Primary, Secondary, Utilities, Packaging, Labor, Markup, and FoodPanda commission protection.
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0 font-mono text-xs bg-emerald-900/90 px-3 py-1.5 rounded-xl border border-emerald-700/60">
                  <span className="text-emerald-300 block text-[10px]">Batch Size</span>
                  <span className="font-bold text-white">{batchCount} pc/s ({recipe.size})</span>
                </div>
              </div>

              {/* Exact Spreadsheet Table Container */}
              <div className="border-2 border-stone-300 rounded-2xl overflow-hidden bg-white shadow-md font-mono text-xs">
                
                {/* Excel-like Green Title Bar */}
                <div className="bg-[#107c41] text-white px-4 py-2.5 flex items-center justify-between font-sans">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-200" />
                    <span className="font-bold text-sm tracking-wide">{recipe.name} — COSTING &amp; SRP MATRIX</span>
                  </div>
                  <span className="text-xs text-emerald-100 font-mono">Yield: {batchCount} pc/s | Last Update: 2021-04-26</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-stone-200 text-stone-800 font-bold uppercase text-[10px] tracking-wider border-b border-stone-300 font-sans">
                        <th className="py-2 px-3 border-r border-stone-300">Item / Description</th>
                        <th className="py-2 px-3 text-right border-r border-stone-300">Quantity</th>
                        <th className="py-2 px-3 text-center border-r border-stone-300">Unit</th>
                        <th className="py-2 px-3 text-right border-r border-stone-300">Unit Price</th>
                        <th className="py-2 px-3 text-center border-r border-stone-300">Rate Unit</th>
                        <th className="py-2 px-3 text-right">Estimated Cost</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200">
                      
                      {/* Section: Primary Ingredients */}
                      <tr className="bg-amber-100/70 font-sans font-bold text-stone-800 text-[11px]">
                        <td colSpan={6} className="py-1.5 px-3 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-amber-600 inline-block" />
                          <span>Primary Ingredients</span>
                        </td>
                      </tr>

                      {recipe.primaryIngredients.map((item, idx) => (
                        <tr key={`p-${idx}`} className="hover:bg-amber-50/40">
                          <td className="py-2 px-3 font-sans text-stone-900 font-medium border-r border-stone-200">{item.name}</td>
                          <td className="py-2 px-3 text-right text-stone-700 border-r border-stone-200 font-bold">
                            {(item.quantity * batchCount).toFixed(item.unit === 'pc/s' ? 0 : 1)}
                          </td>
                          <td className="py-2 px-3 text-center text-stone-500 border-r border-stone-200">{item.unit}</td>
                          <td className="py-2 px-3 text-right text-stone-600 border-r border-stone-200">₱{item.unitPrice.toLocaleString()}</td>
                          <td className="py-2 px-3 text-center text-stone-500 border-r border-stone-200">{item.unitPriceUnit}</td>
                          <td className="py-2 px-3 text-right font-bold text-stone-900 bg-stone-50/70">
                            ₱{(item.cost * batchCount).toFixed(2)}
                          </td>
                        </tr>
                      ))}

                      {/* Section: Secondary Ingredients */}
                      <tr className="bg-stone-200/80 font-sans font-bold text-stone-800 text-[11px]">
                        <td colSpan={6} className="py-1.5 px-3 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-stone-600 inline-block" />
                          <span>Secondary Ingredients</span>
                        </td>
                      </tr>

                      {recipe.secondaryIngredients.map((item, idx) => (
                        <tr key={`s-${idx}`} className="hover:bg-stone-50">
                          <td className="py-2 px-3 font-sans text-stone-800 border-r border-stone-200">{item.name}</td>
                          <td className="py-2 px-3 text-right text-stone-700 border-r border-stone-200 font-bold">
                            {(item.quantity * batchCount).toFixed(item.unit === 'pc/s' ? 0 : 1)}
                          </td>
                          <td className="py-2 px-3 text-center text-stone-500 border-r border-stone-200">{item.unit}</td>
                          <td className="py-2 px-3 text-right text-stone-600 border-r border-stone-200">₱{item.unitPrice.toLocaleString()}</td>
                          <td className="py-2 px-3 text-center text-stone-500 border-r border-stone-200">{item.unitPriceUnit}</td>
                          <td className="py-2 px-3 text-right font-bold text-stone-800 bg-stone-50/70">
                            ₱{(item.cost * batchCount).toFixed(2)}
                          </td>
                        </tr>
                      ))}

                      {/* Section: Other Expenses (Heat / Energy Consumption) */}
                      <tr className="bg-stone-100 font-sans font-bold text-stone-700 text-[11px]">
                        <td colSpan={6} className="py-1 px-3">Other Expenses (Preparation &amp; Heat Consumption)</td>
                      </tr>
                      <tr className="hover:bg-stone-50">
                        <td className="py-2 px-3 font-sans text-stone-700 border-r border-stone-200">Heat &amp; Electrical Consumption (LPG / Machine Energy)</td>
                        <td className="py-2 px-3 text-right text-stone-600 border-r border-stone-200">10</td>
                        <td className="py-2 px-3 text-center text-stone-500 border-r border-stone-200">mins</td>
                        <td className="py-2 px-3 text-right text-stone-600 border-r border-stone-200">Medium/High</td>
                        <td className="py-2 px-3 text-center text-stone-500 border-r border-stone-200">rate</td>
                        <td className="py-2 px-3 text-right font-bold text-stone-900 bg-stone-50/70">
                          ₱{(recipe.heatAndUtilities * batchCount).toFixed(2)}
                        </td>
                      </tr>

                      {/* Subtotal: Recipe Cost */}
                      <tr className="bg-amber-100/90 font-bold border-t-2 border-b-2 border-amber-300 font-sans text-stone-950">
                        <td colSpan={5} className="py-2.5 px-3">
                          RECIPE COST (Direct Food Cost: Raw Ingredients + Utilities)
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-black text-amber-950 text-sm">
                          ₱{(recipe.recipeCost * batchCount).toFixed(2)}
                        </td>
                      </tr>

                      {/* Packaging & Labor Breakdown */}
                      <tr>
                        <td className="py-2 px-3 font-sans text-stone-700 border-r border-stone-200">Packaging Cost (Cup, Lid, Straw, Sleeve, Plastic Bag)</td>
                        <td className="py-2 px-3 text-right text-stone-600 border-r border-stone-200">{batchCount}</td>
                        <td className="py-2 px-3 text-center text-stone-500 border-r border-stone-200">set</td>
                        <td className="py-2 px-3 text-right text-stone-600 border-r border-stone-200">₱{recipe.packagingCost.toFixed(2)}</td>
                        <td className="py-2 px-3 text-center text-stone-500 border-r border-stone-200">/set</td>
                        <td className="py-2 px-3 text-right font-bold text-stone-900 bg-stone-50/70">
                          ₱{(recipe.packagingCost * batchCount).toFixed(2)}
                        </td>
                      </tr>

                      <tr>
                        <td className="py-2 px-3 font-sans text-stone-700 border-r border-stone-200">
                          Labor Allocation per Box / Cup (Direct Barista Wage Buffer)
                        </td>
                        <td className="py-2 px-3 text-right text-stone-600 border-r border-stone-200">{batchCount}</td>
                        <td className="py-2 px-3 text-center text-stone-500 border-r border-stone-200">cup</td>
                        <td className="py-2 px-3 text-right text-stone-600 border-r border-stone-200">₱{recipe.laborCost.toFixed(2)}</td>
                        <td className="py-2 px-3 text-center text-stone-500 border-r border-stone-200">/cup</td>
                        <td className="py-2 px-3 text-right font-bold text-emerald-700 bg-stone-50/70">
                          ₱{(recipe.laborCost * batchCount).toFixed(2)}
                        </td>
                      </tr>

                      {recipe.equipmentDepreciation > 0 && (
                        <tr>
                          <td className="py-2 px-3 font-sans text-stone-700 border-r border-stone-200">Equipment Depreciation &amp; Machine Maintenance</td>
                          <td className="py-2 px-3 text-right text-stone-600 border-r border-stone-200">{batchCount}</td>
                          <td className="py-2 px-3 text-center text-stone-500 border-r border-stone-200">cup</td>
                          <td className="py-2 px-3 text-right text-stone-600 border-r border-stone-200">₱{recipe.equipmentDepreciation.toFixed(2)}</td>
                          <td className="py-2 px-3 text-center text-stone-500 border-r border-stone-200">/cup</td>
                          <td className="py-2 px-3 text-right font-bold text-stone-900 bg-stone-50/70">
                            ₱{(recipe.equipmentDepreciation * batchCount).toFixed(2)}
                          </td>
                        </tr>
                      )}

                      {/* Total Cost */}
                      <tr className="bg-stone-900 text-white font-bold font-sans text-sm">
                        <td colSpan={5} className="py-3 px-3">
                          TOTAL COST (Food Cost + Packaging + Labor + Utilities)
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-black text-amber-300 text-base">
                          ₱{(recipe.totalCost * batchCount).toFixed(2)}
                        </td>
                      </tr>

                      {/* Markup & Selling Price */}
                      <tr className="bg-emerald-50 text-emerald-950 font-bold font-sans">
                        <td colSpan={5} className="py-2 px-3">
                          Target Commercial Markup (Profit Margin per Cup)
                        </td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-emerald-800 text-sm">
                          +₱{(recipe.markup * batchCount).toFixed(2)}
                        </td>
                      </tr>

                      <tr className="bg-emerald-700 text-white font-bold font-sans text-sm">
                        <td colSpan={5} className="py-3 px-3 flex items-center justify-between">
                          <span>Walk-in RETAIL PRICE (Suggested Retail Price / SRP)</span>
                          <span className="text-xs font-normal text-emerald-100 font-mono">
                            Net Profit: +₱{(recipe.walkinNetProfit * batchCount).toFixed(2)}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-black text-white text-base">
                          ₱{(recipe.walkinPrice * batchCount).toFixed(2)}
                        </td>
                      </tr>

                      {/* Section: FoodPanda Delivery Margin Analysis */}
                      <tr className="bg-rose-100/90 font-sans font-bold text-rose-950 text-[11px]">
                        <td colSpan={6} className="py-2 px-3 flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-rose-600 inline-block" />
                            <span>FOODPANDA / GRABFOOD 30% COMMISSION PROTECTION FORMULA</span>
                          </span>
                          <span className="text-[10px] font-mono text-rose-800">Panda SRP = Walk-in SRP / (1 - 0.30 - 0.05)</span>
                        </td>
                      </tr>

                      <tr className="hover:bg-rose-50/40">
                        <td className="py-2 px-3 font-sans text-stone-700 border-r border-stone-200">5% Misc &amp; In-App Tax Buffer</td>
                        <td className="py-2 px-3 text-right text-stone-600 border-r border-stone-200">5%</td>
                        <td className="py-2 px-3 text-center text-stone-500 border-r border-stone-200">rate</td>
                        <td className="py-2 px-3 text-right text-stone-600 border-r border-stone-200">₱{(recipe.walkinPrice * 0.05).toFixed(2)}</td>
                        <td className="py-2 px-3 text-center text-stone-500 border-r border-stone-200">/cup</td>
                        <td className="py-2 px-3 text-right font-bold text-stone-800 bg-stone-50/70">
                          ₱{(recipe.walkinPrice * 0.05 * batchCount).toFixed(2)}
                        </td>
                      </tr>

                      <tr className="hover:bg-rose-50/40">
                        <td className="py-2 px-3 font-sans text-stone-700 border-r border-stone-200">In-App Discount &amp; Voucher Promotion Buffer</td>
                        <td className="py-2 px-3 text-right text-stone-600 border-r border-stone-200">15-20%</td>
                        <td className="py-2 px-3 text-center text-stone-500 border-r border-stone-200">rate</td>
                        <td className="py-2 px-3 text-right text-stone-600 border-r border-stone-200">₱{(recipe.walkinPrice * 0.20).toFixed(2)}</td>
                        <td className="py-2 px-3 text-center text-stone-500 border-r border-stone-200">/cup</td>
                        <td className="py-2 px-3 text-right font-bold text-stone-800 bg-stone-50/70">
                          ₱{(recipe.walkinPrice * 0.20 * batchCount).toFixed(2)}
                        </td>
                      </tr>

                      <tr className="hover:bg-rose-50/40">
                        <td className="py-2 px-3 font-sans text-stone-700 border-r border-stone-200">FoodPanda 30% Platform Merchant Commission</td>
                        <td className="py-2 px-3 text-right text-stone-600 border-r border-stone-200">30%</td>
                        <td className="py-2 px-3 text-center text-stone-500 border-r border-stone-200">rate</td>
                        <td className="py-2 px-3 text-right text-stone-600 border-r border-stone-200">₱{(recipe.foodPandaPrice * 0.30).toFixed(2)}</td>
                        <td className="py-2 px-3 text-center text-stone-500 border-r border-stone-200">/cup</td>
                        <td className="py-2 px-3 text-right font-bold text-rose-800 bg-stone-50/70">
                          ₱{(recipe.foodPandaPrice * 0.30 * batchCount).toFixed(2)}
                        </td>
                      </tr>

                      <tr className="bg-rose-600 text-white font-bold font-sans text-sm">
                        <td colSpan={5} className="py-3 px-3 flex items-center justify-between">
                          <span>FoodPanda / GrabFood PUSHED SRP (Menu Selling Price on App)</span>
                          <span className="text-xs font-normal text-rose-100 font-mono">
                            Protected Net Take-Home: ₱{(recipe.walkinNetProfit * batchCount).toFixed(2)}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-black text-white text-base">
                          ₱{(recipe.foodPandaPrice * batchCount).toFixed(2)}
                        </td>
                      </tr>

                    </tbody>
                  </table>
                </div>

                {/* Bottom Formula Footnotes from Drive Sheet */}
                <div className="bg-stone-100 p-4 border-t border-stone-300 font-sans text-[11px] text-stone-600 space-y-1.5">
                  <div className="font-bold text-stone-800 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-amber-700" />
                    <span>Spreadsheet Mathematical Principles (From Original Google Drive Notes):</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-stone-600">
                    <li><strong>Per-ML Unit Formula:</strong> Divide retail price by ml bottle size (e.g. ₱345 / 475ml = ₱0.7263/ml × 1,000 = ₱726.32/L → rounded up to ₱750/L with spillage buffer).</li>
                    <li><strong>Protected Panda Price:</strong> Calculated as Walk-in SRP divided by (1 - 0.30 Commission - 0.05 Promo) so that delivery sales deliver the exact same net profit in pesos as walk-in customers.</li>
                    <li><strong>Labor Allocation:</strong> Included as a fixed ₱{recipe.laborCost.toFixed(2)} expense per cup to guarantee the barista or owner is paid an honest wage before business profit is counted.</li>
                  </ul>
                </div>

              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: BARISTA KITCHEN & SOP PROCEDURE                    */}
          {/* ========================================================= */}
          {activeTab === 'sop' && (
            <div className="space-y-6">
              
              {/* Calibration Header */}
              <div className="bg-gradient-to-r from-stone-900 to-stone-800 text-white p-5 rounded-3xl border border-stone-700 shadow-md flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                    Barista Station Prep &amp; Calibrations
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold mt-0.5">
                    {recipe.name} ({recipe.size})
                  </h3>
                  <p className="text-xs text-stone-300 mt-1 max-w-xl">
                    Sundin ang standard calibration at hakbang upang mapanatili ang signature taste at maiwasan ang tapon ng mamahaling syrup at gatas.
                  </p>
                </div>

                <div className="flex items-center gap-2 bg-stone-950/80 p-3 rounded-2xl border border-stone-700">
                  <Clock className="w-5 h-5 text-amber-400" />
                  <div className="text-left">
                    <span className="text-[10px] text-stone-400 block uppercase">Target Prep Time</span>
                    <span className="font-mono font-bold text-sm text-white">60 - 90 seconds</span>
                  </div>
                </div>
              </div>

              {/* Step by Step Checklist */}
              <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <h4 className="font-bold text-sm text-stone-900 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-orange-600" />
                    <span>Hakbang sa Pagtimpla (Click step to mark complete):</span>
                  </h4>
                  <span className="text-xs text-stone-500 font-mono">
                    {Object.values(completedSteps).filter(Boolean).length} / {recipe.preparationSteps.length} tapos na
                  </span>
                </div>

                <div className="space-y-3">
                  {recipe.preparationSteps.map((step, idx) => {
                    const isDone = completedSteps[idx];
                    return (
                      <div
                        key={idx}
                        onClick={() => toggleStep(idx)}
                        className={`flex items-start gap-3 p-3.5 rounded-xl border transition cursor-pointer select-none ${
                          isDone
                            ? 'bg-emerald-50/70 border-emerald-300 text-stone-500 line-through'
                            : 'bg-stone-50/60 hover:bg-stone-100 border-stone-200 text-stone-800'
                        }`}
                      >
                        <button
                          type="button"
                          className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-colors mt-0.5 cursor-pointer ${
                            isDone ? 'bg-emerald-600 text-white' : 'border border-stone-300 bg-white text-transparent'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </button>
                        <div className="text-xs sm:text-sm font-medium leading-relaxed">
                          <span className="font-bold text-stone-900 mr-2">Hakbang {idx + 1}:</span>
                          {step}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Barista Pro Tips & Storage Wisdom */}
              {recipe.baristaNotes.length > 0 && (
                <div className="bg-amber-50 border-2 border-amber-300/80 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                    <Flame className="w-4 h-4 text-amber-600 animate-pulse" />
                    <span>Lihim ng 5-Year Barista (Trade Secrets &amp; Spoilage Prevention):</span>
                  </div>
                  <ul className="space-y-2 text-xs sm:text-sm text-amber-950 list-disc list-inside leading-relaxed font-medium">
                    {recipe.baristaNotes.map((note, idx) => (
                      <li key={idx} className="pl-1">{note}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Station Cleanliness & FIFO Rules */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white border border-stone-200 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>FIFO Rule sa Gatas &amp; Boba</span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    First-in, First-out. Ang brewed black tea ay may 4-6 hours holding time lang sa room temperature. Huwag itabi sa ref ang nalutong tapioca pearls dahil titigas ang core.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-stone-200 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-sky-800 uppercase">
                    <TrendingUp className="w-4 h-4 text-sky-600" />
                    <span>Syrup Dispenser Calibration</span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Ang standard Torani / Monin pump ay naglalabas ng 10ml o 7.5ml bawat buong pump. I-calibrate linggo-linggo gamit ang digital jewelry scale para hindi sumobra ang asukal.
                  </p>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: LIVE COSTING & MARGIN SIMULATOR                    */}
          {/* ========================================================= */}
          {activeTab === 'simulator' && (
            <div className="space-y-6">
              
              <div className="bg-teal-950 text-teal-100 p-5 rounded-3xl border border-teal-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400 block">
                    Live Commercial Simulator
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-white mt-0.5">
                    Palengke &amp; Wholesale Price Adjuster
                  </h3>
                  <p className="text-xs text-teal-200/90 mt-1 max-w-xl">
                    Subukan ang iba&apos;t ibang presyo ng sangkap, packaging, at pasahod para makita ang live epekto sa iyong Walk-in at FoodPanda net profit.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setCustomMilkPrice(140);
                    setCustomBeanPrice(1550);
                    setCustomPackagingCost(recipe.packagingCost);
                    setCustomLaborCost(recipe.laborCost);
                    setCustomMarkupPercent(50);
                    setCustomPandaCommission(30);
                    setCustomPromoPercent(5);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-teal-800 hover:bg-teal-700 text-teal-200 text-xs font-bold transition cursor-pointer"
                >
                  I-reset sa Defaults
                </button>
              </div>

              {/* Sliders Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                
                {/* Milk Price Slider */}
                <div className="space-y-2 p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <div className="flex justify-between text-xs font-bold text-stone-800">
                    <span>Presyo ng Fresh Milk (per Liter):</span>
                    <span className="font-mono text-amber-700">₱{customMilkPrice.toFixed(0)} / L</span>
                  </div>
                  <input
                    type="range"
                    min="80"
                    max="180"
                    step="5"
                    value={customMilkPrice}
                    onChange={(e) => setCustomMilkPrice(Number(e.target.value))}
                    className="w-full accent-amber-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-stone-400 font-mono">
                    <span>₱80 (Direct wholesale)</span>
                    <span>₱180 (Convenience store)</span>
                  </div>
                </div>

                {/* Coffee Bean Price Slider */}
                <div className="space-y-2 p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <div className="flex justify-between text-xs font-bold text-stone-800">
                    <span>Presyo ng Espresso Beans (per Kilo):</span>
                    <span className="font-mono text-amber-900">₱{customBeanPrice.toLocaleString()} / kg</span>
                  </div>
                  <input
                    type="range"
                    min="600"
                    max="2200"
                    step="50"
                    value={customBeanPrice}
                    onChange={(e) => setCustomBeanPrice(Number(e.target.value))}
                    className="w-full accent-amber-800 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-stone-400 font-mono">
                    <span>₱600 (Commercial Robusta)</span>
                    <span>₱2,200 (Specialty Arabica)</span>
                  </div>
                </div>

                {/* Packaging Slider */}
                <div className="space-y-2 p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <div className="flex justify-between text-xs font-bold text-stone-800">
                    <span>Packaging Cost (Cup, Lid, Straw, Seal):</span>
                    <span className="font-mono text-stone-800">₱{customPackagingCost.toFixed(2)} / set</span>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="18"
                    step="0.5"
                    value={customPackagingCost}
                    onChange={(e) => setCustomPackagingCost(Number(e.target.value))}
                    className="w-full accent-stone-700 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-stone-400 font-mono">
                    <span>₱4 (Basic PP Cup)</span>
                    <span>₱18 (Hard U-cup w/ custom sleeve)</span>
                  </div>
                </div>

                {/* Labor Slider */}
                <div className="space-y-2 p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <div className="flex justify-between text-xs font-bold text-stone-800">
                    <span>Barista Labor Allocation:</span>
                    <span className="font-mono text-emerald-700">₱{customLaborCost.toFixed(2)} / cup</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="25"
                    step="0.5"
                    value={customLaborCost}
                    onChange={(e) => setCustomLaborCost(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-stone-400 font-mono">
                    <span>₱2 (High-volume kiosk)</span>
                    <span>₱25 (Artisan boutique cafe)</span>
                  </div>
                </div>

                {/* Markup Slider */}
                <div className="space-y-2 p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <div className="flex justify-between text-xs font-bold text-stone-800">
                    <span>Target Walk-in Markup:</span>
                    <span className="font-mono text-teal-700 font-black">{customMarkupPercent}%</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="150"
                    step="5"
                    value={customMarkupPercent}
                    onChange={(e) => setCustomMarkupPercent(Number(e.target.value))}
                    className="w-full accent-teal-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-stone-400 font-mono">
                    <span>20% (Budget friendly)</span>
                    <span>150% (Mall premium)</span>
                  </div>
                </div>

                {/* FoodPanda Commission Slider */}
                <div className="space-y-2 p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <div className="flex justify-between text-xs font-bold text-stone-800">
                    <span>FoodPanda / GrabFood Commission:</span>
                    <span className="font-mono text-rose-700 font-black">{customPandaCommission}% (+{customPromoPercent}% Promo)</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="range"
                      min="20"
                      max="35"
                      step="1"
                      value={customPandaCommission}
                      onChange={(e) => setCustomPandaCommission(Number(e.target.value))}
                      className="w-full accent-rose-600 cursor-pointer"
                    />
                    <input
                      type="range"
                      min="0"
                      max="10"
                      step="1"
                      value={customPromoPercent}
                      onChange={(e) => setCustomPromoPercent(Number(e.target.value))}
                      className="w-full accent-rose-400 cursor-pointer"
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-stone-400 font-mono">
                    <span>Commission (20%-35%)</span>
                    <span>Promo Fund (0%-10%)</span>
                  </div>
                </div>

              </div>

              {/* Dynamic Recalculated Results Card */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Walk-in Scenario */}
                <div className="p-5 rounded-3xl bg-emerald-900 text-white space-y-3 shadow-lg border border-emerald-700">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase font-bold tracking-wider text-emerald-300">Kiosk / Walk-In Channel</span>
                    <span className="text-[11px] font-mono bg-emerald-800 px-2 py-0.5 rounded-full">Cost: ₱{simTotalCost.toFixed(2)}</span>
                  </div>
                  <div className="flex items-baseline justify-between pt-1">
                    <div>
                      <span className="text-xs text-emerald-200 block">Suggested Walk-in SRP:</span>
                      <span className="font-serif text-3xl font-black text-white">₱{simWalkinPrice.toFixed(2)}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-emerald-300 block font-semibold">Net Profit per Cup:</span>
                      <span className="font-mono text-2xl font-black text-amber-300">+₱{simWalkinProfit.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-emerald-800/80 text-[11px] text-emerald-200 flex justify-between font-mono">
                    <span>Net Margin: {((simWalkinProfit / simWalkinPrice) * 100).toFixed(1)}%</span>
                    <span>Food Cost Ratio: {((simRecipeCost / simWalkinPrice) * 100).toFixed(1)}%</span>
                  </div>
                </div>

                {/* Delivery App Scenario */}
                <div className="p-5 rounded-3xl bg-stone-900 text-white space-y-3 shadow-lg border border-stone-700">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase font-bold tracking-wider text-rose-400">FoodPanda / GrabFood Channel</span>
                    <span className="text-[11px] font-mono bg-stone-800 px-2 py-0.5 rounded-full">Comm: {customPandaCommission + customPromoPercent}%</span>
                  </div>
                  <div className="flex items-baseline justify-between pt-1">
                    <div>
                      <span className="text-xs text-stone-300 block">Pushed Delivery Menu SRP:</span>
                      <span className="font-serif text-3xl font-black text-rose-400">₱{simPandaPrice.toFixed(2)}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-stone-400 block font-semibold">Net Payout Puhunan:</span>
                      <span className="font-mono text-2xl font-black text-emerald-400">+₱{simPandaProfit.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-stone-800 text-[11px] text-stone-400 flex justify-between font-mono">
                    <span>Protected Profit Match: ₱{simWalkinProfit.toFixed(2)}</span>
                    <span>App Cut: ₱{(simPandaPrice * ((customPandaCommission + customPromoPercent)/100)).toFixed(2)}</span>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Modal Bottom Sticky Action Bar */}
        <footer className="p-4 sm:p-5 bg-white border-t border-stone-200 flex items-center justify-between gap-3 shrink-0 flex-wrap">
          <div className="flex items-center gap-2 text-xs text-stone-600 font-mono">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Walk-in: <strong className="text-emerald-700 font-bold">₱{(recipe.walkinPrice * batchCount).toFixed(2)}</strong></span>
            <span>•</span>
            <span>Panda: <strong className="text-rose-700 font-bold">₱{(recipe.foodPandaPrice * batchCount).toFixed(2)}</strong></span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyIngredients}
              className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Kopya na sa Clipboard!' : 'Kopyahin ang Talaan'}</span>
            </button>

            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs transition cursor-pointer"
            >
              Isara
            </button>
          </div>
        </footer>

      </div>
    </div>
  );
};
'''

with open(r'src\components\BeverageRecipeModal.tsx', 'w', encoding='utf-8') as f:
    f.write(modal_code)
print('WROTE BeverageRecipeModal.tsx')
