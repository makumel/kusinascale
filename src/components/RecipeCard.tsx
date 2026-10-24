import React from 'react';
import { Recipe } from '../types/recipe';
import { calculateCosting, formatPHP } from '../utils/costingEngine';
import { Clock, Users, ArrowUpRight, Sparkles, ChefHat } from 'lucide-react';

interface RecipeCardProps {
  recipe: Recipe;
  onOpenCalculator: (recipe: Recipe) => void;
  onViewRecipe: (recipe: Recipe) => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  onOpenCalculator,
  onViewRecipe,
}) => {
  // Pre-calculate base baseline numbers for preview card
  const baseMetrics = calculateCosting(recipe, {
    servings: recipe.baseServings,
    targetMarginPercent: recipe.defaultTargetMargin,
    overheadPercent: recipe.defaultOverheadPercent,
    packagingCostPerServing: recipe.defaultPackagingPerServing,
    priceOverrides: {},
  });

  return (
    <article className="group relative flex flex-col bg-white rounded-3xl border border-stone-200/80 shadow-xs hover:shadow-xl hover:border-orange-200/80 transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
      {/* Recipe Photo Header with Badges */}
      <div className="relative h-56 w-full overflow-hidden bg-stone-100">
        <img
          src={recipe.imageUrl}
          alt={recipe.name}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3.5 inset-x-3.5 flex items-center justify-between pointer-events-none">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-white/95 text-stone-800 backdrop-blur-md shadow-xs">
            <Sparkles className="w-3 h-3 text-orange-500" />
            {recipe.categoryLabel}
          </span>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-black/50 text-white backdrop-blur-md border border-white/20">
            {recipe.difficulty}
          </span>
        </div>

        {/* Bottom Time & Servings Info overlay */}
        <div className="absolute bottom-3 inset-x-3.5 flex items-center justify-between text-white text-xs">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 drop-shadow-sm font-medium">
              <Clock className="w-3.5 h-3.5 text-amber-300" />
              {recipe.cookTime}
            </span>
            <span className="inline-flex items-center gap-1 drop-shadow-sm font-medium">
              <Users className="w-3.5 h-3.5 text-amber-300" />
              {recipe.baseServings} portions
            </span>
          </div>
          <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-orange-600/90 text-white shadow-xs">
            {recipe.defaultTargetMargin}% Target Margin
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="flex flex-col flex-1 p-5 sm:p-6 justify-between gap-4">
        <div>
          <h3 className="font-serif text-xl font-bold text-stone-900 group-hover:text-orange-600 transition-colors line-clamp-1">
            {recipe.name}
          </h3>
          <p className="mt-1 text-xs text-orange-700/90 font-medium italic line-clamp-1">
            {recipe.tagline}
          </p>
          <p className="mt-2 text-xs text-stone-600 line-clamp-2 leading-relaxed">
            {recipe.description}
          </p>
        </div>

        {/* Financial Negosyo Snapshot Card */}
        <div className="rounded-2xl bg-amber-50/60 border border-amber-200/60 p-3.5 space-y-2">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-amber-800/80 flex items-center justify-between">
            <span>Puhunan vs Benta</span>
            <span className="text-[10px] text-stone-500 lowercase">per serving</span>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-amber-200/50">
            <div>
              <span className="block text-[11px] text-stone-500">Puhunan (Cost)</span>
              <span className="font-mono text-base font-bold text-stone-900">
                {formatPHP(baseMetrics.costPerServing)}
              </span>
            </div>
            <div>
              <span className="block text-[11px] text-orange-700 font-medium">Suggested SRP</span>
              <span className="font-mono text-base font-bold text-orange-600">
                {formatPHP(baseMetrics.suggestedSrp)}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between pt-1.5 text-xs border-t border-amber-200/40 text-stone-600">
            <span>Tubo kada plato:</span>
            <span className="font-mono font-bold text-emerald-700">
              +{formatPHP(baseMetrics.profitPerServing)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={() => onOpenCalculator(recipe)}
            type="button"
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 active:scale-[0.98] active:bg-orange-800 text-white text-xs font-semibold shadow-xs hover:shadow transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
          >
            <span>Kalkulahin</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onViewRecipe(recipe)}
            type="button"
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 active:scale-[0.98] text-stone-800 text-xs font-medium border border-stone-200 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
          >
            <ChefHat className="w-3.5 h-3.5 text-stone-600" />
            <span>Recipe &amp; Tips</span>
          </button>
        </div>
      </div>
    </article>
  );
};
