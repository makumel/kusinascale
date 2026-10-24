import React, { useState } from 'react';
import { Recipe } from '../types/recipe';
import { CostingCalculator } from './CostingCalculator';
import {
  X,
  Calculator,
  ChefHat,
  Clock,
  Users,
  Lightbulb,
  CheckCircle2,
  Printer,
  Download,
  Sparkles,
  BookmarkCheck
} from 'lucide-react';

interface RecipeModalProps {
  recipe: Recipe | null;
  onClose: () => void;
  initialTab?: 'calculator' | 'recipe';
}

export const RecipeModal: React.FC<RecipeModalProps> = ({
  recipe,
  onClose,
  initialTab = 'calculator',
}) => {
  const [activeTab, setActiveTab] = useState<'calculator' | 'recipe'>(initialTab);
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});

  if (!recipe) return null;

  const toggleStep = (index: number) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    if (!recipe) return;
    const headers = ['Pangalan ng Sangkap', 'Kategorya', 'Dami', 'Yunit', 'Halaga (PHP)', 'Market Note'];
    const rows = recipe.ingredients.map(ing => [
      '"' + ing.name.replace(/"/g, '""') + '"',
      '"' + ing.category + '"',
      ing.quantity,
      '"' + ing.unit + '"',
      ing.baseCost,
      '"' + (ing.unitCostDescription || '').replace(/"/g, '""') + '"'
    ]);
    const lines = [
      `"${recipe.name} - KusinaKita Negosyo Costing Sheet"`,
      `"Kategorya: ${recipe.categoryLabel}","Yield: ${recipe.baseServings} servings","Prep Time: ${recipe.prepTime}"`,
      '',
      headers.join(','),
      ...rows.map(e => e.join(','))
    ];
    const csvContent = 'data:text/csv;charset=utf-8,﻿' + lines.join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `KusinaKita_${recipe.id}_Costing.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      {/* Modal Dialog Card */}
      <div id="recipe-print-area" className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Sticky Header with Title and Tab Switcher */}
        <div className="p-4 sm:p-6 border-b border-stone-200 bg-white sticky top-0 z-20 flex flex-col gap-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl overflow-hidden shrink-0 hidden sm:block border border-stone-200 shadow-2xs">
                <img
                  src={recipe.imageUrl}
                  alt={recipe.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full">
                    {recipe.categoryLabel}
                  </span>
                  <span className="text-xs text-stone-400">•</span>
                  <span className="text-xs text-stone-500 font-medium">{recipe.difficulty}</span>
                </div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
                  {recipe.name}
                </h2>
                <p className="text-xs text-orange-700 italic hidden sm:block">
                  {recipe.tagline}
                </p>
              </div>
            </div>

            {/* Action buttons: Print, Export CSV & Close */}
            <div className="flex items-center gap-2 no-print">
              <button
                onClick={handleExportCSV}
                title="I-download ang Costing Sheet (CSV / Excel)"
                aria-label="I-download ang Costing Sheet (CSV / Excel)"
                type="button"
                className="p-2 text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-xl transition-all cursor-pointer"
              >
                <Download className="w-5 h-5" />
              </button>
              <button
                onClick={handlePrint}
                title="I-print ang Costing Sheet"
                aria-label="I-print ang Costing Sheet"
                type="button"
                className="p-2 text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-xl transition-all cursor-pointer"
              >
                <Printer className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
                aria-label="Isara ang recipe modal"
                type="button"
                className="p-2 text-stone-500 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-xl transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-stone-100 pt-1 no-print">
            <button
              onClick={() => setActiveTab('calculator')}
              type="button"
              className={`flex items-center gap-2 pb-2.5 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-t-lg ${
                activeTab === 'calculator'
                  ? 'border-orange-600 text-emerald-700'
                  : 'border-transparent text-stone-600 hover:text-stone-900'
              }`}
            >
              <Calculator className="w-4 h-4" />
              <span>Costing &amp; SRP Calculator</span>
              <span className="text-[10px] bg-orange-100 text-orange-800 font-semibold px-1.5 py-0.2 rounded-full">
                Interactive
              </span>
            </button>

            <button
              onClick={() => setActiveTab('recipe')}
              type="button"
              className={`flex items-center gap-2 pb-2.5 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-t-lg ${
                activeTab === 'recipe'
                  ? 'border-orange-600 text-emerald-700'
                  : 'border-transparent text-stone-600 hover:text-stone-900'
              }`}
            >
              <ChefHat className="w-4 h-4" />
              <span>Mga Hakbang &amp; Chef Tips</span>
              <span className="text-[10px] bg-stone-100 text-stone-700 font-medium px-1.5 py-0.2 rounded-full">
                {recipe.instructions.length} steps
              </span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'calculator' ? (
            <CostingCalculator recipe={recipe} onClose={onClose} />
          ) : (
            <div className="space-y-6">
              {/* Recipe Meta Banner */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-stone-50 rounded-2xl border border-stone-200 text-stone-700 text-xs">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-700" />
                  <div>
                    <span className="text-stone-500 font-medium block text-[10px] uppercase">Oras ng Pagluluto</span>
                    <span className="font-semibold text-stone-900">
                      Prep: {recipe.prepTime} | Cook: {recipe.cookTime}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-700" />
                  <div>
                    <span className="text-stone-500 font-medium block text-[10px] uppercase">Base Yield</span>
                    <span className="font-semibold text-stone-900">
                      {recipe.baseServings} portions (Standard Recipe)
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-700" />
                  <div>
                    <span className="text-stone-500 font-medium block text-[10px] uppercase">Negosyo Classification</span>
                    <span className="font-semibold text-stone-900">{recipe.marketNotes || 'High Demand Menu'}</span>
                  </div>
                </div>
              </div>

              {/* Instructions Section with Checkboxes */}
              <div className="space-y-3">
                <h3 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2">
                  <BookmarkCheck className="w-5 h-5 text-emerald-700" />
                  <span>Paraan ng Pagluluto (Instructions)</span>
                </h3>
                <div className="space-y-2.5">
                  {recipe.instructions.map((step, idx) => {
                    const isDone = completedSteps[idx];
                    return (
                      <div
                        key={idx}
                        role="button"
                        tabIndex={0}
                        aria-pressed={!!isDone}
                        onClick={() => toggleStep(idx)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            toggleStep(idx);
                          }
                        }}
                        className={`flex items-start gap-3 p-3.5 rounded-2xl border transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 select-none ${
                          isDone
                            ? 'bg-emerald-50/50 border-emerald-200 text-stone-500'
                            : 'bg-white border-stone-200 hover:border-orange-300 text-stone-800'
                        }`}
                      >
                        <button
                          type="button"
                          tabIndex={-1}
                          className="mt-0.5 text-stone-400 focus:outline-none"
                        >
                          <CheckCircle2
                            className={`w-5 h-5 transition-colors ${
                              isDone ? 'text-emerald-600 fill-emerald-100' : 'text-stone-300'
                            }`}
                          />
                        </button>
                        <div className="flex-1 text-xs sm:text-sm leading-relaxed">
                          <span className="font-bold text-emerald-700 mr-2">Hakbang {idx + 1}:</span>
                          <span className={isDone ? 'line-through text-stone-500' : ''}>
                            {step}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Chef & Negosyo Tips (Callout Card) */}
              <div className="p-5 rounded-3xl bg-amber-50/90 border border-amber-300/80 shadow-xs space-y-3">
                <h4 className="font-serif text-base font-bold text-amber-950 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-amber-600" />
                  <span>Chef &amp; Negosyo Secrets (Pampadagdag ng Benta at Tipid Tips)</span>
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-amber-950/90">
                  {recipe.chefTips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-600 font-bold">•</span>
                      <span className="leading-relaxed">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
          <span>KusinaKita • Ginawa para sa mga Kusinerong Negosyante</span>
          <button
            onClick={onClose}
            type="button"
            className="px-4 py-2 rounded-xl bg-stone-900 text-white font-medium hover:bg-stone-800 transition-colors cursor-pointer"
          >
            Isara
          </button>
        </div>
      </div>
    </div>
  );
};
