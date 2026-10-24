import { CookingMode } from './CookingMode';
import React, { useState, useEffect } from 'react';
import { Recipe } from '../types/recipe';
import { CostingCalculator } from './CostingCalculator';
import { exportRecipeKitchenSheet, ImageExportFormat } from '../utils/brandImageExporter';
import { usePWAInstall } from '../hooks/usePWAInstall';
import {
  X,
  Calculator,
  ChefHat,
  Lightbulb,
  CheckCircle2,
  Printer,
  BookmarkCheck,
  Smartphone,
  Minus,
  Plus,
  Scale,
  Flame,
  Download,
  FileText,
} from 'lucide-react';

interface RecipeModalProps {
  recipe: Recipe | null;
  onClose: () => void;
  initialTab?: 'calculator' | 'recipe';
}

const QUICK_PORTIONS = [5, 10, 25, 50, 100];

export const RecipeModal: React.FC<RecipeModalProps> = ({
  recipe,
  onClose,
  initialTab = 'recipe',
}) => {
  const [activeTab, setActiveTab] = useState<'calculator' | 'recipe'>(initialTab);
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  const [isCookingMode, setIsCookingMode] = useState<boolean>(false);
  const [portions, setPortions] = useState<number>(recipe ? recipe.baseServings : 5);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const { triggerInstall } = usePWAInstall();

  useEffect(() => {
    setActiveTab(initialTab);
    if (recipe) {
      setPortions(recipe.baseServings);
    }
  }, [initialTab, recipe]);

  if (!recipe) return null;

  const scaleMultiplier = portions / recipe.baseServings;

  
  const handleExportRecipe = async (format: ImageExportFormat) => {
    if (!recipe) return;
    setIsExporting(true);
    try {
      await exportRecipeKitchenSheet(recipe, portions, format);
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadRecipe = () => {
    if (!recipe) return;
    const lines = [
      "=======================================================",
      "KUSINAKITA - OPISYAL NA RESIPE AT GABAY SA PAGLULUTO",
      "=======================================================",
      `Ulam: ${recipe.name}`,
      `Kategorya: ${recipe.categoryLabel}`,
      `Tagline: ${recipe.tagline}`,
      `Inihanda Para sa: ${portions} Portions (Scale: ${scaleMultiplier.toFixed(2)}x Multiplier)`,
      `Oras ng Paghahanda: ${recipe.prepTime}`,
      `Oras ng Pagluluto: ${recipe.cookTime}`,
      `Antas ng Hirap: ${recipe.difficulty}`,
      "-------------------------------------------------------",
      "DESKRIPSIYON:",
      recipe.description,
      "-------------------------------------------------------",
      `MGA SANGKAP AT SUKAT (${portions} PAX):`,
      "-------------------------------------------------------",
      ...recipe.ingredients.map((ing, idx) => {
        const scaledQty = ing.quantity * scaleMultiplier;
        const qtyStr = scaledQty % 1 === 0 ? String(scaledQty) : scaledQty.toFixed(2);
        return `${idx + 1}. ${ing.name.padEnd(28, ' ')} : ${qtyStr} ${ing.unit} [${((ing.category || 'sangkap') as string).toUpperCase()}]`;
      }),
      "-------------------------------------------------------",
      "MGA HAKBANG SA PAGLULUTO (STEP-BY-STEP):",
      "-------------------------------------------------------",
      ...recipe.instructions.map((step, idx) => `[Hakbang ${idx + 1}] ${step}`),
      "-------------------------------------------------------",
      "LIHIM NG KUSINERO (CHEF TIPS & NEGOSYO ADVICE):",
      recipe.chefTips && recipe.chefTips.length > 0 ? recipe.chefTips.join('\r\n• ') : (recipe.marketNotes || 'Walang karagdagang paalala.'),
      "=======================================================",
      "KusinaKita - May Kita sa Kusina • https://kusinakita.mikabiz.space",
      "Paalala: Ang opisyal na Food Costing at Kalkulador ng SRP ay eksklusibong makukuha sa naka-install na PWA app."
    ];

    const blob = new Blob([lines.join('\r\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `KusinaKita_${recipe.id}_${portions}pax_Recipe.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadShoppingList = () => {
    if (!recipe) return;
    const lines = [
      "=======================================================",
      "KUSINAKITA - PALENGKE SHOPPING & PREP LIST",
      "=======================================================",
      `Recipe: ${recipe.name}`,
      `Category: ${recipe.categoryLabel}`,
      `Servings: ${portions} pax (Base: ${recipe.baseServings} pax, Scale: ${scaleMultiplier.toFixed(2)}x)`,
      `Prep / Cook Time: ${recipe.prepTime} / ${recipe.cookTime}`,
      `Date Generated: ${new Date().toLocaleDateString('fil-PH', { year: 'numeric', month: 'long', day: 'numeric' })}`,
      "-------------------------------------------------------",
      "MGA SANGKAP NA BIBILHIN SA PALENGKE:",
      "-------------------------------------------------------",
      ...recipe.ingredients.map((ing) => {
        const scaledQty = ing.quantity * scaleMultiplier;
        const qtyStr = scaledQty % 1 === 0 ? String(scaledQty) : scaledQty.toFixed(2);
        return `[ ] ${ing.name.padEnd(28, ' ')} : ${qtyStr} ${ing.unit}`;
      }),
      "=======================================================",
      "KusinaKita - May Kita sa Kusina • https://kusinakita.mikabiz.space"
    ];

    const blob = new Blob([lines.join('\r\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `KusinaKita_${recipe.id}_${portions}pax_ShoppingList.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const toggleStep = (index: number) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };


  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div id="recipe-print-area" className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <header className="p-4 sm:p-6 border-b border-stone-200 bg-white sticky top-0 z-20 flex flex-col gap-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0 hidden sm:block border border-stone-200 shadow-2xs">
                <img
                  src={recipe.imageUrl}
                  alt={recipe.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/80 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                    {recipe.categoryLabel}
                  </span>
                  <span className="text-xs text-stone-400">•</span>
                  <span className="text-xs text-stone-600 font-semibold">{recipe.difficulty}</span>
                </div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-950 mt-0.5">
                  {recipe.name}
                </h2>
                <p className="text-xs text-orange-700 italic hidden sm:block">
                  {recipe.tagline}
                </p>
              </div>
            </div>

            {/* Header Action Controls */}
            <div className="flex items-center gap-2 no-print">
              <button
                onClick={() => window.print()}
                title="I-print ang Resipe"
                aria-label="I-print ang Resipe"
                type="button"
                className="p-2 text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 active:scale-95 rounded-xl transition-all cursor-pointer"
              >
                <Printer className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
                aria-label="Isara ang recipe modal"
                type="button"
                className="p-2 text-stone-500 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 active:scale-95 rounded-xl transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-2 border-b border-stone-100 pt-1 no-print">
            <button
              onClick={() => setActiveTab('recipe')}
              type="button"
              className={`flex items-center gap-2 pb-2.5 px-3.5 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer ${
                activeTab === 'recipe'
                  ? 'border-emerald-600 text-emerald-800'
                  : 'border-transparent text-stone-600 hover:text-stone-900'
              }`}
            >
              <ChefHat className="w-4 h-4" />
              <span>Infographic Recipe &amp; Scaler</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded-full">
                Auto-Compute
              </span>
            </button>

            <button
              onClick={() => setActiveTab('calculator')}
              type="button"
              className={`flex items-center gap-2 pb-2.5 px-3.5 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer ${
                activeTab === 'calculator'
                  ? 'border-orange-600 text-orange-800'
                  : 'border-transparent text-stone-600 hover:text-stone-900'
              }`}
            >
              <Calculator className="w-4 h-4" />
              <span>Food Costing &amp; SRP</span>
              <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded-full">
                Tubo &amp; SRP
              </span>
            </button>
          </nav>
        </header>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'recipe' ? (
            isCookingMode ? (
              <CookingMode
                recipe={recipe}
                portions={portions}
                onExit={() => setIsCookingMode(false)}
              />
            ) : (
            <div className="space-y-6">
              {/* Infographic Portions Scaler Toolbar (Google Drive Format) */}
              <section className="bg-gradient-to-r from-emerald-50/80 via-teal-50/60 to-stone-50 border border-emerald-200/80 rounded-2xl p-4 sm:p-5 shadow-xs">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <Scale className="w-4 h-4 text-emerald-700" />
                      <h3 className="text-sm font-bold text-stone-900">
                        Adjustable Portions &amp; Serving Scaler
                      </h3>
                      <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-200/80 text-emerald-900">
                        {scaleMultiplier.toFixed(1)}x Batch Multiplier
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 mt-1">
                      Pumili o mag-type ng bilang ng pax. Kusa nitong iko-compute ang eksaktong timbang ng mga sangkap.
                    </p>
                  </div>

                  {/* Stepper & Download Action */}
                  <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
                    <div className="inline-flex items-center border border-stone-300 rounded-xl bg-white shadow-2xs">
                      <button
                        onClick={() => setPortions((prev) => Math.max(1, prev - 1))}
                        type="button"
                        aria-label="Bawasan ang portions"
                        className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-l-xl transition"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <input
                        type="number"
                        min="1"
                        max="500"
                        value={portions}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          if (!isNaN(val) && val >= 1) setPortions(val);
                        }}
                        className="w-14 text-center font-mono font-bold text-sm text-stone-900 focus:outline-none"
                      />
                      <span className="text-xs text-stone-500 pr-2">pax</span>
                      <button
                        onClick={() => setPortions((prev) => prev + 1)}
                        type="button"
                        aria-label="Dagdagan ang portions"
                        className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-r-xl transition"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Interactive Cooking Mode & Exporter Actions */}
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => setIsCookingMode(true)}
                        type="button"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 active:scale-95 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all cursor-pointer"
                      >
                        <Flame className="w-4 h-4 text-amber-200 animate-pulse" />
                        <span>Lutuin Natin! (Let's Cook This)</span>
                      </button>

                      <button
                        onClick={handleDownloadRecipe}
                        type="button"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>I-download Resipe</span>
                      </button>

                      <button
                        onClick={handleDownloadShoppingList}
                        type="button"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 font-bold text-xs shadow-2xs transition-all cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5 text-stone-500" />
                        <span>Shopping List</span>
                      </button>

                      {/* Branded Recipe Card Exporter: PNG / JPG / GIF (Never Excel / Never PDF) */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleExportRecipe('png')}
                          disabled={isExporting}
                          type="button"
                          title="I-save ang Resipe na may opisyal na watermark (PNG)"
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white font-bold text-xs shadow-xs transition-all cursor-pointer disabled:opacity-50"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>{isExporting ? 'Generating...' : 'I-save Resipe (PNG)'}</span>
                        </button>
                        <button
                          onClick={() => handleExportRecipe('jpeg')}
                          disabled={isExporting}
                          type="button"
                          title="I-save bilang JPG Image"
                          className="px-2.5 py-2 rounded-xl border border-emerald-300 bg-white hover:bg-emerald-50 text-emerald-800 font-bold text-xs transition-all cursor-pointer disabled:opacity-50"
                        >
                          JPG
                        </button>
                        <button
                          onClick={() => handleExportRecipe('gif')}
                          disabled={isExporting}
                          type="button"
                          title="I-save bilang GIF Image"
                          className="px-2.5 py-2 rounded-xl border border-emerald-300 bg-white hover:bg-emerald-50 text-emerald-800 font-bold text-xs transition-all cursor-pointer disabled:opacity-50"
                        >
                          GIF
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Portions Buttons */}
                <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-3 border-t border-emerald-200/50 text-xs">
                  <span className="text-stone-500 font-medium mr-1">Quick Select:</span>
                  {QUICK_PORTIONS.map((pax) => {
                    const isSelected = portions === pax;
                    return (
                      <button
                        key={pax}
                        onClick={() => setPortions(pax)}
                        type="button"
                        className={`px-3 py-1 rounded-lg font-semibold text-xs transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-700 text-white shadow-2xs'
                            : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
                        }`}
                      >
                        {pax} pax
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* Ingredients Section displayed in TILES (Google Drive Infographic Format) */}
              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg font-bold text-stone-950 flex items-center gap-2">
                    <BookmarkCheck className="w-5 h-5 text-emerald-700" />
                    <span>Mga Sangkap na Pamamalengkehin</span>
                  </h3>
                  <span className="text-xs font-mono font-medium text-stone-500">
                    {recipe.ingredients.length} sangkap para sa {portions} pax
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {recipe.ingredients.map((ing) => {
                    const scaledVal = Math.round(ing.quantity * scaleMultiplier * 100) / 100;
                    return (
                      <div
                        key={ing.id}
                        className="p-3.5 rounded-2xl bg-white border border-stone-200 hover:border-emerald-300 transition-all flex flex-col justify-between gap-2 shadow-2xs"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-stone-100 text-stone-600">
                            {ing.category || 'Sangkap'}
                          </span>
                          <span className="font-mono font-bold text-emerald-800 text-sm bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 rounded-lg">
                            {scaledVal} {ing.unit}
                          </span>
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-stone-900 leading-snug">
                            {ing.name}
                          </h4>
                          {ing.unitCostDescription && (
                            <p className="text-[11px] text-stone-500 mt-0.5">
                              {ing.unitCostDescription}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Cooking Steps Section */}
              <section className="space-y-3 pt-2">
                <h3 className="font-serif text-lg font-bold text-stone-950 flex items-center gap-2">
                  <ChefHat className="w-5 h-5 text-emerald-700" />
                  <span>Paraan ng Pagluluto (Cooking Instructions)</span>
                </h3>

                <div className="space-y-2.5">
                  {recipe.instructions.map((step, idx) => {
                    const isDone = completedSteps[idx];
                    return (
                      <div
                        key={idx}
                        onClick={() => toggleStep(idx)}
                        className={`flex items-start gap-3.5 p-4 rounded-2xl border transition-all cursor-pointer select-none ${
                          isDone
                            ? 'bg-emerald-50/40 border-emerald-200 text-stone-500'
                            : 'bg-white border-stone-200 hover:border-emerald-300 text-stone-800'
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
                          <span className="font-bold text-emerald-800 mr-2">Hakbang {idx + 1}:</span>
                          <span className={isDone ? 'line-through text-stone-500' : ''}>
                            {step}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Chef Tips / Negosyo Secret Tile */}
              {recipe.chefTips && recipe.chefTips.length > 0 && (
                <section className="p-4 sm:p-5 rounded-2xl bg-amber-50/90 border border-amber-200/90 text-amber-950 space-y-2.5 shadow-2xs">
                  <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                    <Lightbulb className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Lihim ng Kusinero at Sekreto sa Negosyo</span>
                  </div>
                  <ul className="space-y-1.5 text-xs sm:text-sm text-stone-700 leading-relaxed list-disc list-inside">
                    {recipe.chefTips.map((tip, idx) => (
                      <li key={idx}>{tip}</li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
            )
          ) : (
            <div className="space-y-6">
              {/* Cellphone Offline Guide & Install Assistance for Android and iPhone */}
              <section className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950 via-stone-900 to-emerald-900 text-white shadow-sm border border-emerald-800/40 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center shrink-0 font-bold">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <span>Gamitin sa Palengke Kahit Walang Internet</span>
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold">
                          Libre • Offline Ready
                        </span>
                      </h4>
                      <p className="text-xs text-stone-300 mt-0.5">
                        Maaari mong i-save ang KusinaKita sa iyong cellphone para mabilis buksan habang namamalengke.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={triggerInstall}
                    type="button"
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-stone-950 font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>I-save sa Cellphone</span>
                  </button>
                </div>

                {/* Clear Step-by-Step Instructions for Android and iPhone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-emerald-800/50 text-xs">
                  <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                    <div className="font-bold text-amber-300 flex items-center gap-1.5 mb-1">
                      <span>🤖 Para sa Android (Samsung, Xiaomi, Oppo, Vivo):</span>
                    </div>
                    <ol className="list-decimal list-inside space-y-1 text-stone-300">
                      <li>Pindutin ang <strong>tatlong tuldok (⋮)</strong> sa itaas ng Chrome.</li>
                      <li>Piliin ang <strong>&quot;Install app&quot;</strong> o <strong>&quot;Add to Home screen&quot;</strong>.</li>
                      <li>Kusa nang lalabas ang KusinaKita sa iyong home screen!</li>
                    </ol>
                  </div>

                  <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                    <div className="font-bold text-emerald-300 flex items-center gap-1.5 mb-1">
                      <span>🍎 Para sa iPhone / iPad (Safari):</span>
                    </div>
                    <ol className="list-decimal list-inside space-y-1 text-stone-300">
                      <li>Pindutin ang <strong>Share button</strong> (icon na may kahon at arrow paitaas sa ibaba).</li>
                      <li>Piliin ang <strong>&quot;Add to Home Screen&quot;</strong>.</li>
                      <li>Pindutin ang <strong>&quot;Add&quot;</strong> sa kanang itaas.</li>
                    </ol>
                  </div>
                </div>
              </section>

              {/* The Live Interactive Calculator */}
              <CostingCalculator recipe={recipe} onClose={onClose} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
