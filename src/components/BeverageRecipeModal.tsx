import React, { useState } from 'react';
import { BeverageRecipe, getBeverageActiveSize } from '../data/coffeeMilkteaData';
import { X, Sparkles, Clock, Check, Copy } from 'lucide-react';

interface BeverageRecipeModalProps {
  recipe: BeverageRecipe | null;
  initialSize?: string;
  onClose: () => void;
}

export const BeverageRecipeModal: React.FC<BeverageRecipeModalProps> = ({
  recipe,
  initialSize,
  onClose
}) => {
  const [selectedSize, setSelectedSize] = useState<string>(initialSize || (recipe?.sizes[0]?.size || '16oz'));
  const [copied, setCopied] = useState<boolean>(false);

  if (!recipe) return null;

  const currentSizeOption = getBeverageActiveSize(recipe, selectedSize);

  const handleCopy = () => {
    const text = `${recipe.name} (${currentSizeOption.size})\nCategory: ${recipe.categoryLabel}\nCost: ₱${currentSizeOption.totalCost.toFixed(2)}\nWalk-in SRP: ₱${currentSizeOption.walkinPrice.toFixed(2)}\nDelivery SRP: ₱${currentSizeOption.foodPandaPrice.toFixed(2)}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-200 my-8">
        {/* Header Banner */}
        <div className="relative p-6 bg-gradient-to-r from-amber-950 via-stone-900 to-amber-900 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 transition"
          >
            <X className="w-5 h-5" />
          </button>
          <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">{recipe.categoryLabel}</span>
          <h2 className="font-serif text-2xl font-bold mt-1 text-white">{recipe.name}</h2>
          <p className="text-xs text-stone-300 mt-1 max-w-lg">{recipe.description}</p>
        </div>

        {/* Size Selector */}
        <div className="p-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-stone-700">Pumili ng Cup Size:</span>
            <div className="flex gap-1.5">
              {recipe.sizes.map((s) => (
                <button
                  key={s.size}
                  onClick={() => setSelectedSize(s.size)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                    selectedSize === s.size
                      ? 'bg-amber-500 text-stone-950 shadow-xs'
                      : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
                  }`}
                >
                  {s.size}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-stone-100 text-stone-700 font-bold text-xs border border-stone-200 flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Kopya!' : 'Kopyahin'}</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Costing Summary */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200">
              <span className="text-[10px] uppercase font-bold text-amber-800">Total Puhunan</span>
              <p className="text-lg font-black text-amber-950 font-mono mt-0.5">₱{currentSizeOption.totalCost.toFixed(2)}</p>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200">
              <span className="text-[10px] uppercase font-bold text-emerald-800">Walk-in SRP</span>
              <p className="text-lg font-black text-emerald-950 font-mono mt-0.5">₱{currentSizeOption.walkinPrice.toFixed(2)}</p>
              <span className="text-[10px] text-emerald-700">+₱{currentSizeOption.walkinNetProfit.toFixed(2)} kita</span>
            </div>
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200">
              <span className="text-[10px] uppercase font-bold text-rose-800">FoodPanda SRP</span>
              <p className="text-lg font-black text-rose-950 font-mono mt-0.5">₱{currentSizeOption.foodPandaPrice.toFixed(2)}</p>
              <span className="text-[10px] text-rose-700">30% buffer</span>
            </div>
          </div>

          {/* Primary Ingredients */}
          <div>
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Mga Pangunahing Sangkap:</span>
            </h4>
            <div className="divide-y divide-stone-100 border border-stone-200 rounded-2xl p-2 bg-stone-50/50 text-xs">
              {currentSizeOption.primaryIngredients.map((item, idx) => (
                <div key={idx} className="flex justify-between py-1.5 px-2">
                  <span className="text-stone-800 font-medium">{item.name} ({item.quantity} {item.unit})</span>
                  <span className="font-mono font-bold text-stone-900">₱{item.cost.toFixed(2)}</span>
                </div>
              ))}
              {currentSizeOption.secondaryIngredients.map((item, idx) => (
                <div key={`sec-${idx}`} className="flex justify-between py-1.5 px-2 text-stone-600">
                  <span>{item.name} ({item.quantity} {item.unit})</span>
                  <span className="font-mono font-bold">₱{item.cost.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Preparation Steps */}
          {recipe.preparationSteps && recipe.preparationSteps.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                <span>Barista Standard Operating Procedure (SOP):</span>
              </h4>
              <ol className="space-y-2 text-xs text-stone-700">
                {recipe.preparationSteps.map((step, idx) => (
                  <li key={idx} className="flex gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center shrink-0 font-bold text-[10px]">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs transition"
          >
            Isara
          </button>
        </div>
      </div>
    </div>
  );
};
