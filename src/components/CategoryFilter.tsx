import React, { useState } from 'react';
import { RecipeCategory } from '../types/recipe';
import { 
  Search, UtensilsCrossed, Soup, Flame, Globe, IceCream, Clock, X, 
  SlidersHorizontal, ChevronDown, RotateCcw
} from 'lucide-react';

export type ProteinFilter = 'all' | 'pork' | 'chicken' | 'beef' | 'seafood' | 'vegetable';
export type TimeFilter = 'all' | 'quick' | 'medium' | 'slow';
export type SortOption = 'bestseller' | 'profit-desc' | 'cost-asc' | 'time-asc' | 'alphabetical';
export type ViewMode = 'grid' | 'pos';

interface CategoryFilterProps {
  categories: { id: RecipeCategory; name: string; tagline: string; count?: number }[];
  activeCategory: RecipeCategory;
  onSelectCategory: (category: RecipeCategory) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedProtein: ProteinFilter;
  onSelectProtein: (protein: ProteinFilter) => void;
  selectedTime: TimeFilter;
  onSelectTime: (time: TimeFilter) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  totalFilteredCount: number;
  onResetFilters: () => void;
}

const getCategoryIcon = (id: RecipeCategory) => {
  switch (id) {
    case 'all': return <UtensilsCrossed className="w-4 h-4" />;
    case 'carinderia': return <Soup className="w-4 h-4" />;
    case 'asian': return <Flame className="w-4 h-4" />;
    case 'western': return <Globe className="w-4 h-4" />;
    case 'desserts': return <IceCream className="w-4 h-4" />;
    case 'tipid': return <Clock className="w-4 h-4" />;
    default: return <UtensilsCrossed className="w-4 h-4" />;
  }
};

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  selectedProtein,
  onSelectProtein,
  selectedTime,
  onSelectTime,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  totalFilteredCount,
  onResetFilters,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const hasActiveSecondaryFilters = 
    selectedProtein !== 'all' || selectedTime !== 'all' || searchQuery.trim() !== '' || activeCategory !== 'all';

  return (
    <div className="space-y-4">
      {/* Sticky Primary Search & Controls Card */}
      <div className="bg-white/95 backdrop-blur-md p-3.5 sm:p-4 rounded-3xl border border-stone-200/90 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          {/* Main Search Input */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-800">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Maghanap ng ulam o sangkap (hal. Baboy, Liempo, Toyo, Dinuguan)..."
              className="w-full pl-11 pr-10 py-3 bg-stone-50 border border-stone-300 rounded-2xl text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-700 text-sm font-sans transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-700 cursor-pointer"
                aria-label="I-clear ang search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Controls: Sorting, View Mode, and Filter Drawer Toggle */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:flex-none min-w-[170px]">
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value as SortOption)}
                aria-label="Ayusin ayon sa"
                className="w-full appearance-none pl-3 pr-8 py-3 bg-stone-50 border border-stone-300 rounded-2xl text-xs font-semibold text-stone-800 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
              >
                <option value="bestseller">⭐ Bestseller Turnover</option>
                <option value="profit-desc">💰 Pinakamalaking Tubo</option>
                <option value="cost-asc">🏷️ Mababang Puhunan</option>
                <option value="time-asc">⏱️ Mabilis Lutuin</option>
                <option value="alphabetical">🔤 A to Z</option>
              </select>
              <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* View Mode Switcher: Cards vs POS Kitchen View */}
            <div className="hidden sm:flex items-center bg-stone-100 p-1 rounded-2xl border border-stone-200">
              <button
                onClick={() => onViewModeChange('grid')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'grid' 
                    ? 'bg-white text-stone-900 shadow-2xs' 
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Cards
              </button>
              <button
                onClick={() => onViewModeChange('pos')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'pos' 
                    ? 'bg-emerald-900 text-white shadow-2xs' 
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                POS View
              </button>
            </div>

            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`flex items-center justify-center gap-1.5 px-3.5 py-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                showAdvanced || (selectedProtein !== 'all' || selectedTime !== 'all')
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : 'bg-stone-50 border-stone-300 text-stone-700 hover:bg-stone-100'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden md:inline">Filters</span>
            </button>
          </div>
        </div>

        {/* Primary Commercial Category Pills (Horizontal Scroll) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-1">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex-shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer select-none ${
                  isActive
                    ? 'bg-emerald-900 text-white shadow-sm shadow-emerald-950/20'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200/80 border border-stone-200/60'
                }`}
              >
                {getCategoryIcon(cat.id)}
                <span>{cat.name}</span>
                {cat.count !== undefined && (
                  <span
                    className={`ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                      isActive ? 'bg-white/20 text-white' : 'bg-stone-200 text-stone-700'
                    }`}
                  >
                    {cat.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Advanced Secondary Filter Drawer */}
        {showAdvanced && (
          <div className="pt-3 border-t border-stone-200/80 space-y-3">
            {/* Protein Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-semibold text-stone-600 min-w-[70px]">Protina:</span>
              {(['all', 'pork', 'chicken', 'beef', 'seafood', 'vegetable'] as ProteinFilter[]).map((protein) => (
                <button
                  key={protein}
                  onClick={() => onSelectProtein(protein)}
                  className={`px-3 py-1 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    selectedProtein === protein
                      ? 'bg-orange-600 text-white font-bold shadow-2xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {protein === 'all' && 'Lahat'}
                  {protein === 'pork' && '🐷 Baboy'}
                  {protein === 'chicken' && '🍗 Manok'}
                  {protein === 'beef' && '🥩 Baka'}
                  {protein === 'seafood' && '🐟 Isda/Dagat'}
                  {protein === 'vegetable' && '🥬 Gulay/Tokwa'}
                </button>
              ))}
            </div>

            {/* Cook Time Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-semibold text-stone-600 min-w-[70px]">Oras:</span>
              {(['all', 'quick', 'medium', 'slow'] as TimeFilter[]).map((time) => (
                <button
                  key={time}
                  onClick={() => onSelectTime(time)}
                  className={`px-3 py-1 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    selectedTime === time
                      ? 'bg-amber-600 text-white font-bold shadow-2xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {time === 'all' && 'Lahat'}
                  {time === 'quick' && '⚡ < 20 mins (Mabilis)'}
                  {time === 'medium' && '⏳ 20–45 mins'}
                  {time === 'slow' && '🍲 45+ mins (Slow Stew)'}
                </button>
              ))}

              {hasActiveSecondaryFilters && (
                <div className="ml-auto flex items-center gap-3">
                  <span className="text-stone-500 font-medium">
                    Natagpuan: <strong className="text-emerald-800">{totalFilteredCount}</strong>
                  </span>
                  <button
                    onClick={onResetFilters}
                    className="inline-flex items-center gap-1 text-xs text-stone-500 hover:text-red-600 font-semibold cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>I-reset ang filters</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
