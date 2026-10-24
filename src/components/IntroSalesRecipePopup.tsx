import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Award,
  Clock,
  ArrowRight,
  Flame,
  Calculator,
  Info,
  FileSpreadsheet
} from 'lucide-react';
import { COFFEE_MILKTEA_RECIPES, BARISTA_GOLDEN_RULES, BeverageRecipe } from '../data/coffeeMilkteaData';

interface IntroSalesRecipePopupProps {
  isOpen: boolean;
  onClose: () => void;
  onUnlockFullPackage?: () => void;
  onOpenCalculator?: (recipe: BeverageRecipe) => void;
  onOpenSpreadsheetModal?: (recipe: BeverageRecipe, tab?: 'spreadsheet' | 'sop' | 'simulator') => void;
}

export const IntroSalesRecipePopup: React.FC<IntroSalesRecipePopupProps> = ({
  isOpen,
  onClose,
  onUnlockFullPackage,
  onOpenCalculator,
  onOpenSpreadsheetModal
}) => {
  const [selectedDrinkId, setSelectedDrinkId] = useState<string>('intro-milktea-16oz');

  if (!isOpen) return null;

  const currentRecipe = COFFEE_MILKTEA_RECIPES.find((r) => r.id === selectedDrinkId) || COFFEE_MILKTEA_RECIPES[0];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-md flex justify-center p-2 sm:p-4 md:p-6 animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto flex flex-col max-h-[94vh]">
        
        {/* Sticky Exit Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-stone-900/70 hover:bg-stone-900 text-white transition-all hover:scale-105 cursor-pointer shadow-md"
          aria-label="Isara ang Popup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Urgency Header */}
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white py-2.5 px-4 text-center text-xs sm:text-sm font-bold tracking-wide flex items-center justify-center gap-2 shadow-inner shrink-0">
          <Award className="w-4 h-4 text-amber-200 animate-pulse" />
          <span>5-YEAR COMMERCIAL BARISTA &amp; CAFE OWNER INTRO SALES RECIPES</span>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto p-4 sm:p-8 space-y-8">
          
          {/* Header Title & Pitch */}
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>Tested on 10,000+ Cups Sold • Proven Commercial Formula</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-black text-stone-900 leading-tight">
              Ang Aming #1 Intro Sales Recipe &amp; Live Costing Computation
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Binuo mula sa 5 taong karanasan sa pagpapatakbo ng coffee cart at milk tea kiosk. Alamin kung paano kumita ng hanggang <strong className="text-emerald-700">68% gross profit margin</strong> sa bawat baso nang hindi tinitipid ang lasa at kalidad.
            </p>
          </div>

          {/* Recipe Selector Tabs: Milk Tea vs Iced Coffee */}
          <div className="grid grid-cols-2 gap-2 sm:gap-4 p-1.5 bg-stone-100 rounded-2xl max-w-xl mx-auto">
            <button
              onClick={() => setSelectedDrinkId('intro-milktea-16oz')}
              className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                selectedDrinkId === 'intro-milktea-16oz'
                  ? 'bg-white text-stone-900 shadow-md border border-stone-200/80 scale-[1.02]'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
              }`}
            >
              <span className="text-base">🧋</span>
              <div className="text-left leading-tight">
                <div className="font-bold">16oz Classic Pearl Milk Tea</div>
                <div className="text-[10px] text-emerald-700 font-semibold font-mono">₱25 Food Cost • ₱92.50 Net Profit</div>
              </div>
            </button>

            <button
              onClick={() => setSelectedDrinkId('intro-ice-coffee-16oz')}
              className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                selectedDrinkId === 'intro-ice-coffee-16oz'
                  ? 'bg-white text-stone-900 shadow-md border border-stone-200/80 scale-[1.02]'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
              }`}
            >
              <span className="text-base">☕</span>
              <div className="text-left leading-tight">
                <div className="font-bold">16oz Iced Caramel Latte</div>
                <div className="text-[10px] text-amber-700 font-semibold font-mono">Double Espresso • ₱64.43 Net Profit</div>
              </div>
            </button>
          </div>

          {/* Quick Metrics Bar for Selected Drink */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200 text-center">
              <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">Raw Recipe Cost</span>
              <span className="font-serif text-xl sm:text-2xl font-black text-amber-900">₱{currentRecipe.recipeCost.toFixed(2)}</span>
              <span className="text-[10px] text-stone-500 block">Sangkap per cup</span>
            </div>

            <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 text-center">
              <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">Total Production Cost</span>
              <span className="font-serif text-xl sm:text-2xl font-black text-stone-800">₱{currentRecipe.totalCost.toFixed(2)}</span>
              <span className="text-[10px] text-stone-500 block">Food + Pack + Labor</span>
            </div>

            <div className="bg-emerald-50/80 p-3.5 rounded-2xl border border-emerald-200 text-center">
              <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider block">Walk-In SRP</span>
              <span className="font-serif text-xl sm:text-2xl font-black text-emerald-700">₱{currentRecipe.walkinPrice.toFixed(2)}</span>
              <span className="text-[10px] text-emerald-800 font-bold block">Tubo: +₱{currentRecipe.walkinNetProfit.toFixed(2)}</span>
            </div>

            <div className="bg-rose-50/80 p-3.5 rounded-2xl border border-rose-200 text-center">
              <span className="text-[11px] font-semibold text-rose-800 uppercase tracking-wider block">FoodPanda SRP (30%)</span>
              <span className="font-serif text-xl sm:text-2xl font-black text-rose-700">₱{currentRecipe.foodPandaPrice.toFixed(2)}</span>
              <span className="text-[10px] text-rose-800 block">Protected Margin</span>
            </div>
          </div>

          {/* Ingredient & Cost Breakdown Table */}
          <div className="border border-stone-200 rounded-2xl overflow-hidden shadow-xs">
            <div className="bg-stone-900 text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-sm">Opisyal na Talaan ng Sangkap at Presyo ({currentRecipe.size})</h3>
              </div>
              <span className="text-xs text-amber-300 font-mono">1 Serving = 1 pc</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-stone-100 text-stone-700 font-bold uppercase tracking-wider text-[10px] border-b border-stone-200">
                  <tr>
                    <th className="py-2.5 px-3">Sangkap / Material</th>
                    <th className="py-2.5 px-3 text-right">Dami (Qty)</th>
                    <th className="py-2.5 px-3 text-right">Presyo sa Merkado</th>
                    <th className="py-2.5 px-3 text-right">Gastos Bawat Baso</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200/70 font-mono">
                  {/* Primary Ingredients */}
                  <tr className="bg-amber-50/40 text-[11px] font-sans font-bold text-stone-700">
                    <td colSpan={4} className="py-1 px-3">Primary Ingredients</td>
                  </tr>
                  {currentRecipe.primaryIngredients.map((item, idx) => (
                    <tr key={idx} className="hover:bg-stone-50">
                      <td className="py-2 px-3 font-sans text-stone-900 font-medium">{item.name}</td>
                      <td className="py-2 px-3 text-right text-stone-600">{item.quantity} {item.unit}</td>
                      <td className="py-2 px-3 text-right text-stone-600">₱{item.unitPrice.toLocaleString()}{item.unitPriceUnit}</td>
                      <td className="py-2 px-3 text-right font-bold text-stone-900">₱{item.cost.toFixed(2)}</td>
                    </tr>
                  ))}

                  {/* Secondary Ingredients */}
                  {currentRecipe.secondaryIngredients.length > 0 && (
                    <>
                      <tr className="bg-stone-100/60 text-[11px] font-sans font-bold text-stone-700">
                        <td colSpan={4} className="py-1 px-3">Secondary Ingredients</td>
                      </tr>
                      {currentRecipe.secondaryIngredients.map((item, idx) => (
                        <tr key={`sec-${idx}`} className="hover:bg-stone-50">
                          <td className="py-2 px-3 font-sans text-stone-900 font-medium">{item.name}</td>
                          <td className="py-2 px-3 text-right text-stone-600">{item.quantity} {item.unit}</td>
                          <td className="py-2 px-3 text-right text-stone-600">₱{item.unitPrice.toLocaleString()}{item.unitPriceUnit}</td>
                          <td className="py-2 px-3 text-right font-bold text-stone-900">₱{item.cost.toFixed(2)}</td>
                        </tr>
                      ))}
                    </>
                  )}

                  {/* Utilities, Packaging, Labor */}
                  <tr className="bg-stone-100/60 text-[11px] font-sans font-bold text-stone-700">
                    <td colSpan={4} className="py-1 px-3">Other Overhead Expenses</td>
                  </tr>
                  <tr className="hover:bg-stone-50">
                    <td className="py-2 px-3 font-sans text-stone-700">Kuryente, Yelo &amp; Heat Consumption</td>
                    <td className="py-2 px-3 text-right text-stone-500">10 mins</td>
                    <td className="py-2 px-3 text-right text-stone-500">Medium-High</td>
                    <td className="py-2 px-3 text-right font-bold text-stone-900">₱{currentRecipe.heatAndUtilities.toFixed(2)}</td>
                  </tr>
                  <tr className="hover:bg-stone-50">
                    <td className="py-2 px-3 font-sans text-stone-700">Packaging (Baso, Takip, Sealing Film, Boba Straw)</td>
                    <td className="py-2 px-3 text-right text-stone-500">1 set</td>
                    <td className="py-2 px-3 text-right text-stone-500">Commercial pack</td>
                    <td className="py-2 px-3 text-right font-bold text-stone-900">₱{currentRecipe.packagingCost.toFixed(2)}</td>
                  </tr>
                  <tr className="hover:bg-stone-50">
                    <td className="py-2 px-3 font-sans text-stone-700">Labor Allocation ng Barista (Direktang Pasahod)</td>
                    <td className="py-2 px-3 text-right text-stone-500">Per cup</td>
                    <td className="py-2 px-3 text-right text-stone-500">Standard rate</td>
                    <td className="py-2 px-3 text-right font-bold text-emerald-700">₱{currentRecipe.laborCost.toFixed(2)}</td>
                  </tr>

                  {/* Grand Totals */}
                  <tr className="bg-amber-100/60 font-bold border-t-2 border-amber-300">
                    <td colSpan={3} className="py-2.5 px-3 font-sans text-stone-900">Kabuuang Puhunan sa Produksiyon (TOTAL COST)</td>
                    <td className="py-2.5 px-3 text-right text-amber-950 font-black text-sm">₱{currentRecipe.totalCost.toFixed(2)}</td>
                  </tr>
                  <tr className="bg-emerald-100/60 font-bold">
                    <td colSpan={3} className="py-2.5 px-3 font-sans text-emerald-950">Walk-in SRP (Net Profit: +₱{currentRecipe.walkinNetProfit.toFixed(2)})</td>
                    <td className="py-2.5 px-3 text-right text-emerald-900 font-black text-base">₱{currentRecipe.walkinPrice.toFixed(2)}</td>
                  </tr>
                  <tr className="bg-rose-100/60 font-bold">
                    <td colSpan={3} className="py-2.5 px-3 font-sans text-rose-950">FoodPanda / GrabFood SRP (30% Platform Cut Buffer)</td>
                    <td className="py-2.5 px-3 text-right text-rose-900 font-black text-base">₱{currentRecipe.foodPandaPrice.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Barista Step-by-Step SOP */}
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
              <Clock className="w-4 h-4 text-orange-600" />
              <span>5-Year Barista Standard Operating Procedure (SOP)</span>
            </div>
            <ol className="space-y-2 text-xs sm:text-sm text-stone-700 list-decimal list-inside leading-relaxed">
              {currentRecipe.preparationSteps.map((step, idx) => (
                <li key={idx} className="pl-1">
                  <span className="font-semibold text-stone-900">{step}</span>
                </li>
              ))}
            </ol>
            
            {/* Barista Secrets Note */}
            <div className="p-3.5 bg-amber-50 border border-amber-200/90 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                <Flame className="w-3.5 h-3.5 text-amber-700" />
                <span>Barista Secret Tip:</span>
              </div>
              <ul className="text-xs text-amber-950 list-disc list-inside space-y-1 leading-relaxed">
                {currentRecipe.baristaNotes.map((note, idx) => (
                  <li key={idx}>{note}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* 5-Year Barista Principles */}
          <div className="space-y-4 pt-2">
            <div className="text-center max-w-xl mx-auto">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">Barista Business School</span>
              <h3 className="font-serif text-xl sm:text-2xl font-black text-stone-900">
                4 na Ginintuang Panuntunan sa Negosyo ng Kape at Milk Tea
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {BARISTA_GOLDEN_RULES.slice(0, 4).map((rule) => (
                <div key={rule.number} className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-amber-600 text-white text-xs font-black flex items-center justify-center shrink-0">
                      {rule.number}
                    </span>
                    <h4 className="font-bold text-xs sm:text-sm text-stone-900">{rule.title}</h4>
                  </div>
                  <h5 className="text-[11px] font-semibold text-amber-800">{rule.tagalogTitle}</h5>
                  <p className="text-xs text-stone-600 leading-relaxed">{rule.content}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Conversion Math Example */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-white space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <Info className="w-4 h-4" />
              <span>Halimbawa ng Formula mula sa Spreadsheet:</span>
            </div>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-mono">
              Kung ang Vanilla Extract ay <strong>₱345 para sa 475ml</strong> na bote:
              <br />
              &bull; Presyo bawat ML: 345 &divide; 475 = <span className="text-amber-300 font-bold">₱0.7263/ml</span>
              <br />
              &bull; Presyo bawat Litro: ₱0.7263 &times; 1,000 = <span className="text-emerald-400 font-bold">₱726.32/L</span>
              <br />
              &bull; Ligtas na Costing: Gawing <strong>₱750/L</strong> para may buffer sa tapon at spillage!
            </p>
          </div>

          {/* Bottom Actions CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-stone-200">
            <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
              {onOpenSpreadsheetModal && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenSpreadsheetModal(currentRecipe, 'spreadsheet');
                  }}
                  className="flex-1 sm:flex-initial px-4 py-3 rounded-xl border-2 border-emerald-600 bg-emerald-50 hover:bg-emerald-100 active:scale-95 text-emerald-950 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
                  <span>Drive Spreadsheet Format</span>
                </button>
              )}

              {onOpenCalculator && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenCalculator(currentRecipe);
                  }}
                  className="flex-1 sm:flex-initial px-4 py-3 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 active:scale-95 text-stone-800 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Calculator className="w-4 h-4 text-amber-700" />
                  <span>Live Simulator</span>
                </button>
              )}
            </div>

            <button
              onClick={() => {
                onClose();
                if (onUnlockFullPackage) onUnlockFullPackage();
              }}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 hover:from-amber-700 hover:to-orange-700 active:scale-95 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition cursor-pointer group"
            >
              <Flame className="w-4 h-4 text-amber-200 animate-bounce" />
              <span>I-unlock ang Buong 28-Drink Package &amp; Excel Matrix</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
