import React from 'react';
import { RecipeCategory } from '../types/recipe';
import { Search, UtensilsCrossed, Soup, Globe, Flame, IceCream, Clock } from 'lucide-react';

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
  return (
    <div className="space-y-4">
      {/* Search Input Bar */}
      <div className="relative max-w-2xl mx-auto">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-400">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Maghanap ng recipe o sangkap (hal. Adobo, Ramen, Gata, Sardinas)..."
          className="w-full pl-11 pr-4 py-3.5 bg-white border border-stone-300 rounded-2xl shadow-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 text-sm transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-xs font-semibold text-stone-400 hover:text-stone-600 cursor-pointer"
          >
            I-clear
          </button>
        )}
      </div>

      {/* Category Pills Slider */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none justify-start sm:justify-center">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              type="button"
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 cursor-pointer select-none ${
                isActive
                  ? 'bg-stone-900 text-white shadow-md shadow-stone-900/10 scale-102 ring-2 ring-stone-900/10'
                  : 'bg-white/90 text-stone-700 hover:bg-white hover:text-stone-950 border border-stone-200/90 shadow-2xs hover:shadow-xs'
              }`}
            >
              <span className={isActive ? 'text-orange-400' : 'text-stone-500'}>
                {getCategoryIcon(cat.id)}
              </span>
              <span>{cat.name}</span>
              {typeof cat.count === 'number' && (
                <span
                  className={`text-[11px] font-mono font-medium px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-stone-800 text-stone-100' : 'bg-stone-100 text-stone-700'
                  }`}
                >
                  {cat.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
