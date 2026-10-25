import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Award,
  Clock,
  ArrowRight,
  Flame,
  Calculator,
  FileSpreadsheet
} from 'lucide-react';
import { COFFEE_MILKTEA_RECIPES, BeverageRecipe, getBeverageActiveSize } from '../data/coffeeMilkteaData';

interface IntroSalesRecipePopupProps {
  isOpen: boolean;
  onClose: () => void;
  onUnlockFullPackage?: () => void;
  onOpenCalculator?: (recipe: BeverageRecipe) => void;
  onOpenSpreadsheetModal?: (recipe: BeverageRecipe, size?: string) => void;
}

export const IntroSalesRecipePopup: React.FC<IntroSalesRecipePopupProps> = ({
  isOpen,
  onClose,
  onUnlockFullPackage,
  onOpenSpreadsheetModal
}) => {
  const [selectedDrinkId, setSelectedDrinkId] = useState<string>('classic-pearl-milktea');
  const [selectedSize, setSelectedSize] = useState<string>('16oz');

  if (!isOpen) return null;

  const currentRecipe: BeverageRecipe = 
    COFFEE_MILKTEA_RECIPES.find((r) => r.id === selectedDrinkId) || COFFEE_MILKTEA_RECIPES[0];

  const currentSizeOption = getBeverageActiveSize(currentRecipe, selectedSize);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-stone-200 overflow-hidden max-h-[96dvh] sm:max-h-[92vh] flex flex-col">
        
        {/* Sticky Exit Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-30 p-2.5 rounded-full bg-stone-900/70 hover:bg-stone-900 text-white transition-all hover:scale-105 cursor-pointer shadow-md"
          aria-label="Isara ang Popup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Urgency Header */}
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white py-2 px-3 text-center text-xs font-bold tracking-wide flex items-center justify-center gap-2 shadow-inner shrink-0">
          <Award className="w-4 h-4 text-amber-200 animate-pulse" />
          <span>5-YEAR COMMERCIAL BARISTA &amp; CAFE OWNER INTRO SALES RECIPES</span>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto p-3.5 sm:p-6 space-y-4 sm:space-y-6 flex-1 bg-stone-50/50">
          
          {/* Header Title & Pitch */}
          <div className="text-center max-w-2xl mx-auto space-y-1.5 pt-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>Tested on 10,000+ Cups Sold • Proven Commercial Formula</span>
            </div>
            <h2 className="font-serif text-xl sm:text-3xl font-black text-stone-900 leading-tight">
              Ang Aming #1 Intro Sales Recipe &amp; Costing Matrix
            </h2>
            <p className="text-xs text-stone-600 max-w-xl mx-auto leading-relaxed">
              Binuo mula sa 5 taong karanasan sa pagpapatakbo ng kiosk at cafe. Alamin kung paano kumita ng hanggang <strong className="text-emerald-700">68% gross margin</strong> sa bawat baso.
            </p>
          </div>

          {/* Drink Selector Tabs with Stock Photos */}
          <div className="grid grid-cols-2 gap-2 sm:gap-4 p-1.5 bg-stone-200/80 rounded-2xl max-w-xl mx-auto">
            <button
              onClick={() => {
                setSelectedDrinkId('classic-pearl-milktea');
                setSelectedSize('16oz');
              }}
              className={`flex items-center gap-2.5 p-2 sm:p-3 rounded-xl transition-all cursor-pointer text-left ${
                selectedDrinkId === 'classic-pearl-milktea'
                  ? 'bg-white text-stone-900 shadow-md border border-stone-200 scale-[1.02]'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-white/60'
              }`}
            >
              <img
                src="/beverages/classic-pearl-milktea.jpg"
                alt="Classic Pearl Milk Tea"
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl object-cover shrink-0 border border-stone-200"
              />
              <div className="leading-tight min-w-0">
                <div className="font-bold text-xs sm:text-sm truncate">Classic Pearl Milk Tea</div>
                <div className="text-[10px] text-emerald-700 font-semibold font-mono">68.5% Net Margin</div>
              </div>
            </button>

            <button
              onClick={() => {
                setSelectedDrinkId('iced-caramel-latte');
                setSelectedSize('16oz');
              }}
              className={`flex items-center gap-2.5 p-2 sm:p-3 rounded-xl transition-all cursor-pointer text-left ${
                selectedDrinkId === 'iced-caramel-latte'
                  ? 'bg-white text-stone-900 shadow-md border border-stone-200 scale-[1.02]'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-white/60'
              }`}
            >
              <img
                src="/beverages/iced-caramel-latte.jpg"
                alt="Iced Caramel Latte"
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl object-cover shrink-0 border border-stone-200"
              />
              <div className="leading-tight min-w-0">
                <div className="font-bold text-xs sm:text-sm truncate">Iced Caramel Latte</div>
                <div className="text-[10px] text-amber-800 font-semibold font-mono">Double Espresso</div>
              </div>
            </button>
          </div>

          {/* Cup Size Selector Pills */}
          <div className="flex items-center justify-center gap-2 pt-1">
            <span className="text-xs font-semibold text-stone-600">Piliin ang Laki ng Baso:</span>
            <div className="flex items-center gap-1.5 bg-stone-200/90 p-1 rounded-xl">
              {currentRecipe.sizes.map((s) => {
                const isSelected = s.size === currentSizeOption.size;
                return (
                  <button
                    key={s.size}
                    onClick={() => setSelectedSize(s.size)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-600 text-white shadow-xs font-black'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-white/50'
                    }`}
                  >
                    <span>{s.size}</span>
                    <span className="text-[10px] opacity-80 ml-1">({s.sizeLabel})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Metrics Bar for Selected Size */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            <div className="bg-amber-50 p-2.5 sm:p-3 rounded-2xl border border-amber-200 text-center">
              <span className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider block">Raw Food Cost</span>
              <span className="font-serif text-lg sm:text-2xl font-black text-amber-950">₱{currentSizeOption.recipeCost.toFixed(2)}</span>
              <span className="text-[10px] text-stone-500 block">Sangkap ({currentSizeOption.size})</span>
            </div>

            <div className="bg-stone-100 p-2.5 sm:p-3 rounded-2xl border border-stone-200 text-center">
              <span className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider block">Total Production Cost</span>
              <span className="font-serif text-lg sm:text-2xl font-black text-stone-800">₱{currentSizeOption.totalCost.toFixed(2)}</span>
              <span className="text-[10px] text-stone-500 block">Food + Pack + Labor</span>
            </div>

            <div className="bg-emerald-50 p-2.5 sm:p-3 rounded-2xl border border-emerald-200 text-center">
              <span className="text-[10px] font-semibold text-emerald-800 uppercase tracking-wider block">Walk-In SRP</span>
              <span className="font-serif text-lg sm:text-2xl font-black text-emerald-700">₱{currentSizeOption.walkinPrice.toFixed(2)}</span>
              <span className="text-[10px] text-emerald-800 font-bold block">Tubo: +₱{currentSizeOption.walkinNetProfit.toFixed(2)}</span>
            </div>

            <div className="bg-rose-50 p-2.5 sm:p-3 rounded-2xl border border-rose-200 text-center">
              <span className="text-[10px] font-semibold text-rose-800 uppercase tracking-wider block">FoodPanda SRP (30%)</span>
              <span className="font-serif text-lg sm:text-2xl font-black text-rose-700">₱{currentSizeOption.foodPandaPrice.toFixed(2)}</span>
              <span className="text-[10px] text-rose-800 block">Protected Margin</span>
            </div>
          </div>

          {/* Ingredient & Cost Breakdown Table (Responsive) */}
          <div className="border border-stone-200 rounded-2xl overflow-hidden shadow-xs bg-white">
            <div className="bg-stone-900 text-white px-3.5 py-2.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <Calculator className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold">Talaan ng Sangkap at Presyo ({currentSizeOption.sizeLabel})</h3>
              </div>
              <span className="text-amber-300 font-mono text-[11px]">1 Cup Serving</span>
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-stone-100 text-stone-700 font-bold uppercase tracking-wider text-[10px] border-b border-stone-200">
                  <tr>
                    <th className="py-2 px-3">Sangkap / Material</th>
                    <th className="py-2 px-3 text-right">Dami (Qty)</th>
                    <th className="py-2 px-3 text-right">Presyo sa Merkado</th>
                    <th className="py-2 px-3 text-right">Gastos Bawat Baso</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 font-mono text-xs">
                  {currentSizeOption.primaryIngredients.map((item, idx) => (
                    <tr key={idx} className="hover:bg-stone-50">
                      <td className="py-1.5 px-3 font-sans text-stone-900 font-medium">{item.name}</td>
                      <td className="py-1.5 px-3 text-right text-stone-600">{item.quantity} {item.unit}</td>
                      <td className="py-1.5 px-3 text-right text-stone-600">₱{item.unitPrice}{item.unitPriceUnit}</td>
                      <td className="py-1.5 px-3 text-right font-bold text-stone-900">₱{item.cost.toFixed(2)}</td>
                    </tr>
                  ))}
                  {currentSizeOption.secondaryIngredients.map((item, idx) => (
                    <tr key={`sec-${idx}`} className="hover:bg-stone-50">
                      <td className="py-1.5 px-3 font-sans text-stone-900 font-medium">{item.name}</td>
                      <td className="py-1.5 px-3 text-right text-stone-600">{item.quantity} {item.unit}</td>
                      <td className="py-1.5 px-3 text-right text-stone-600">₱{item.unitPrice}{item.unitPriceUnit}</td>
                      <td className="py-1.5 px-3 text-right font-bold text-stone-900">₱{item.cost.toFixed(2)}</td>
                    </tr>
                  ))}
                  <tr className="bg-stone-50 text-stone-700 font-sans">
                    <td colSpan={3} className="py-1.5 px-3">Overhead, Packaging &amp; Barista Labor</td>
                    <td className="py-1.5 px-3 text-right font-mono font-bold text-stone-900">₱{(currentSizeOption.packagingCost + currentSizeOption.laborCost + currentSizeOption.heatAndUtilities).toFixed(2)}</td>
                  </tr>
                  <tr className="bg-stone-900 text-white font-bold font-sans">
                    <td colSpan={3} className="py-2 px-3">TOTAL PRODUCTION COST</td>
                    <td className="py-2 px-3 text-right font-mono font-black text-amber-300 text-sm">₱{currentSizeOption.totalCost.toFixed(2)}</td>
                  </tr>
                  <tr className="bg-emerald-700 text-white font-bold font-sans">
                    <td colSpan={3} className="py-2 px-3">WALK-IN SRP (Tubo: +₱{currentSizeOption.walkinNetProfit.toFixed(2)})</td>
                    <td className="py-2 px-3 text-right font-mono font-black text-white text-base">₱{currentSizeOption.walkinPrice.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Mobile Card List View */}
            <div className="sm:hidden divide-y divide-stone-200 text-xs">
              {currentSizeOption.primaryIngredients.map((item, idx) => (
                <div key={`m-p-${idx}`} className="p-2.5 flex justify-between items-center">
                  <div>
                    <span className="font-sans font-medium text-stone-900 block">{item.name}</span>
                    <span className="text-[11px] text-stone-500 font-mono">{item.quantity} {item.unit}</span>
                  </div>
                  <span className="font-mono font-bold text-stone-900">₱{item.cost.toFixed(2)}</span>
                </div>
              ))}
              {currentSizeOption.secondaryIngredients.map((item, idx) => (
                <div key={`m-s-${idx}`} className="p-2.5 flex justify-between items-center bg-stone-50/50">
                  <div>
                    <span className="font-sans font-medium text-stone-800 block">{item.name}</span>
                    <span className="text-[11px] text-stone-500 font-mono">{item.quantity} {item.unit}</span>
                  </div>
                  <span className="font-mono font-bold text-stone-800">₱{item.cost.toFixed(2)}</span>
                </div>
              ))}
              <div className="p-2.5 flex justify-between items-center font-sans text-stone-700 bg-stone-100">
                <span>Pack &amp; Labor:</span>
                <span className="font-mono font-bold">₱{(currentSizeOption.packagingCost + currentSizeOption.laborCost).toFixed(2)}</span>
              </div>
              <div className="p-3 bg-emerald-700 text-white flex justify-between items-center font-sans font-bold">
                <div>
                  <span>WALK-IN SRP:</span>
                  <span className="block text-[10px] text-emerald-200 font-normal">+₱{currentSizeOption.walkinNetProfit.toFixed(2)} Tubo</span>
                </div>
                <span className="font-mono text-base font-black">₱{currentSizeOption.walkinPrice.toFixed(2)}</span>
              </div>
            </div>

          </div>

          {/* Barista Step-by-Step SOP */}
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center gap-2 text-stone-900 font-bold text-xs sm:text-sm">
              <Clock className="w-4 h-4 text-orange-600" />
              <span>5-Year Barista Standard Operating Procedure (SOP)</span>
            </div>
            <ol className="space-y-1.5 text-xs text-stone-700 list-decimal list-inside leading-relaxed">
              {currentRecipe.preparationSteps.map((step, idx) => (
                <li key={idx} className="pl-1">
                  <span className="font-semibold text-stone-900">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Bottom Actions CTA: Easy 1-Click Workflow */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-3 border-t border-stone-200">
            {onOpenSpreadsheetModal && (
              <button
                onClick={() => {
                  onClose();
                  onOpenSpreadsheetModal(currentRecipe, currentSizeOption.size);
                }}
                className="w-full sm:w-auto px-5 py-3 rounded-xl border-2 border-emerald-600 bg-emerald-50 hover:bg-emerald-100 active:scale-95 text-emerald-950 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
                <span>Buksan sa Buong Drive Spreadsheet Modal</span>
              </button>
            )}

            <button
              onClick={() => {
                onClose();
                if (onUnlockFullPackage) onUnlockFullPackage();
              }}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 hover:from-amber-700 hover:to-orange-700 active:scale-95 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition cursor-pointer group"
            >
              <Flame className="w-4 h-4 text-amber-200 animate-bounce" />
              <span>I-unlock ang Buong 28-Drink Package</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
