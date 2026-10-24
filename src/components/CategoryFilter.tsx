import React from 'react';
import { RecipeCategory } from '../types/recipe';
import { Search, UtensilsCrossed, Soup, Globe, Flame, IceCream, Clock, X } from 'lucide-react';

interface CategoryFilterProps {
  categories: { id: RecipeCategory; name: string; tagline: string; count?: number }[];
  activeCategory: RecipeCategory;
  onSelectCategory: (category: RecipeCategory) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const getCategoryIcon = (id: RecipeCategory) => {
  switch (id) {
    case 'all':
      return <UtensilsCrossed className="w-4 h-4" />;
    case 'carinderia':
      return <Soup className="w-4 h-4" />;
    case 'asian':
      return <Flame className="w-4 h-4" />;
    case 'western':
      return <Globe className="w-4 h-4" />;
    case 'desserts':
      return <IceCream className="w-4 h-4" />;
    case 'tipid':
      return <Clock className="w-4 h-4" />;
    default:
      return <UtensilsCrossed className="w-4 h-4" />;
  }
};

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
}) => {
  const activeMeta = categories.find((c) => c.id === activeCategory);

  return (
    <div className="space-y-4">
      {/* Search Input Bar */}
      <div className="relative max-w-2xl mx-auto">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-400">
          <Search className="w-5 h-5 text-emerald-700" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Maghanap ng recipe o sangkap (hal. Sisig, Pares, Ramen, Dinuguan, Liempo)..."
          className="w-full pl-11 pr-10 py-3.5 bg-white border border-stone-300 rounded-2xl shadow-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 text-sm transition-all"
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

      {/* Category Tiles Slider */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none justify-start sm:justify-center">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              type="button"
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 active:scale-95 cursor-pointer select-none ${
                isActive
                  ? 'bg-emerald-800 text-white shadow-sm ring-2 ring-emerald-900/20'
                  : 'bg-white text-stone-700 hover:bg-stone-50 border border-stone-200 shadow-2xs'
              }`}
            >
              <span className={isActive ? 'text-amber-300' : 'text-emerald-700'}>
                {getCategoryIcon(cat.id)}
              </span>
              <span>{cat.name}</span>
              {typeof cat.count === 'number' && (
                <span
                  className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-emerald-950 text-emerald-200' : 'bg-stone-100 text-stone-700'
                  }`}
                >
                  {cat.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Active Category Tagline Banner */}
      {activeMeta && (
        <div className="text-center text-xs text-stone-500 font-medium">
          <span className="text-emerald-800 font-bold">{activeMeta.name}:</span>{' '}
          <span className="italic">{activeMeta.tagline}</span>
        </div>
      )}
    </div>
  );
};
