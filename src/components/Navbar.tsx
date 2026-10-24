import React from 'react';
import { ChefHat, Sparkles, MessageSquarePlus, Calculator, TrendingUp } from 'lucide-react';

interface NavbarProps {
  onOpenSuggestion: () => void;
  recipeCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSuggestion, recipeCount }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo & Editorial Title */}
          <div className="flex items-center gap-3.5">
            <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-md shadow-orange-500/20 ring-4 ring-orange-100">
              <ChefHat className="w-6 h-6 stroke-[2.2]" />
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500 border-2 border-white"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-2xl font-bold tracking-tight text-stone-900">
                  Kusina<span className="text-orange-600">Scale</span>
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-800 border border-orange-200">
                  Negosyo Pro
                </span>
              </div>
              <p className="text-xs text-stone-500 font-medium tracking-wide">
                Food Costing, Batch Portioning &amp; SRP Engine
              </p>
            </div>
          </div>

          {/* Quick Metrics & Call to Action */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="hidden md:flex items-center gap-3 px-3.5 py-1.5 rounded-xl bg-stone-100/80 border border-stone-200 text-xs text-stone-700">
              <span className="inline-flex items-center gap-1.5 font-medium">
                <Calculator className="w-3.5 h-3.5 text-orange-600" />
                <span className="font-mono font-semibold text-stone-900">{recipeCount}</span> Negosyo Recipes
              </span>
              <span className="text-stone-300">|</span>
              <span className="inline-flex items-center gap-1.5 text-stone-600">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                Live Margin Math
              </span>
            </div>

            <button
              onClick={onOpenSuggestion}
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 active:bg-orange-800 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 text-white font-medium text-sm shadow-sm hover:shadow transition-all duration-200 group cursor-pointer"
            >
              <MessageSquarePlus className="w-4 h-4 transition-transform group-hover:scale-110" />
              <span className="hidden sm:inline">Mag-Suggest ng Recipe</span>
              <span className="sm:hidden">Suggest</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sub-header Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white py-1.5 px-4 text-xs font-medium tracking-wide flex items-center justify-center gap-2 shadow-inner">
        <Sparkles className="w-3.5 h-3.5 text-amber-200 animate-pulse" />
        <span>Kalkulahin ang eksaktong puhunan, overhead ng gas/kuryente, at itakda ang 30% hanggang 70% target profit margin!</span>
      </div>
    </header>
  );
};
