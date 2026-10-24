import { useState, useMemo } from 'react';
import { RECIPES, CATEGORIES } from './data/recipes';
import { Recipe, RecipeCategory } from './types/recipe';
import { Navbar } from './components/Navbar';
import { CategoryFilter } from './components/CategoryFilter';
import { RecipeCard } from './components/RecipeCard';
import { RecipeModal } from './components/RecipeModal';
import { SuggestionModal } from './components/SuggestionModal';
import {
  TrendingUp,
  Percent,
  Layers,
  Utensils,
  SearchX,
  Sparkles,
  HelpCircle
} from 'lucide-react';

export function App() {
  const [activeCategory, setActiveCategory] = useState<RecipeCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected recipe for modal
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [modalInitialTab, setModalInitialTab] = useState<'calculator' | 'recipe'>('calculator');

  // Suggestion modal state
  const [isSuggestionOpen, setIsSuggestionOpen] = useState(false);

  // Compute category counts
  const categoriesWithCounts = useMemo(() => {
    return CATEGORIES.map((cat) => {
      if (cat.id === 'all') {
        return { ...cat, count: RECIPES.length };
      }
      const count = RECIPES.filter((r) => r.category === cat.id).length;
      return { ...cat, count };
    });
  }, []);

  // Filter recipes based on active category & search query
  const filteredRecipes = useMemo(() => {
    return RECIPES.filter((recipe) => {
      // Category check
      if (activeCategory !== 'all' && recipe.category !== activeCategory) {
        return false;
      }

      // Search query check (name, tagline, description, or ingredient)
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = recipe.name.toLowerCase().includes(q);
        const matchesTagline = recipe.tagline.toLowerCase().includes(q);
        const matchesDescription = recipe.description.toLowerCase().includes(q);
        const matchesIngredient = recipe.ingredients.some((ing) =>
          ing.name.toLowerCase().includes(q)
        );
        return matchesName || matchesTagline || matchesDescription || matchesIngredient;
      }

      return true;
    });
  }, [activeCategory, searchQuery]);

  const handleOpenCalculator = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setModalInitialTab('calculator');
  };

  const handleViewRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setModalInitialTab('recipe');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8f5] text-stone-900 selection:bg-orange-500 selection:text-white">
      {/* Editorial Navbar */}
      <Navbar
        onOpenSuggestion={() => setIsSuggestionOpen(true)}
        recipeCount={RECIPES.length}
      />

      {/* Hero Section with Editorial Styling */}
      <section className="relative overflow-hidden bg-gradient-to-b from-amber-100/60 via-amber-50/40 to-[#faf8f5] pt-12 pb-16 border-b border-stone-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-orange-100/80 text-orange-800 border border-orange-200/90 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-orange-600" />
              <span>Para sa Carinderia, Cloud Kitchen, Kiosk at Handaan</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-black text-stone-950 tracking-tight leading-[1.15]">
              Master Your Food Costing &amp;{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700">
                Suggested SRP
              </span>
            </h1>

            <p className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-2xl mx-auto">
              Huwag hulaan ang benta. I-compute ang bawat gramo ng sangkap, overhead ng LPG at
              kuryente, at kontrolin ang iyong <strong className="text-stone-900">30% hanggang 70%</strong> na tubo
              bago ka pa magbukas ng kalan.
            </p>

            {/* Feature Pills */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs font-medium text-stone-700">
              <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-stone-200 shadow-2xs">
                <Layers className="w-4 h-4 text-orange-600" />
                <span>1x hanggang 10x Batch Scaling</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-stone-200 shadow-2xs">
                <Percent className="w-4 h-4 text-emerald-600" />
                <span>Gross Margin Pricing Engine</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-stone-200 shadow-2xs">
                <TrendingUp className="w-4 h-4 text-amber-600" />
                <span>Dynamic Wet Market Price Overrides</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog & Interactive Filtering */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Category Filter and Search */}
        <CategoryFilter
          categories={categoriesWithCounts}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Filter Summary & Count Header */}
        <div className="flex items-center justify-between text-xs text-stone-500 pt-2 border-b border-stone-200/80 pb-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-stone-800">
              {filteredRecipes.length}
            </span>
            <span>
              {filteredRecipes.length === 1 ? 'recipe na natagpuan' : 'mga recipe na natagpuan'}
            </span>
            {activeCategory !== 'all' && (
              <span className="bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full font-medium">
                Kategorya: {CATEGORIES.find((c) => c.id === activeCategory)?.name}
              </span>
            )}
          </div>
          <span className="hidden sm:inline text-stone-400">
            I-click ang &quot;Kalkulahin&quot; para sa live costing
          </span>
        </div>

        {/* Recipe Cards Grid */}
        {filteredRecipes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onOpenCalculator={handleOpenCalculator}
                onViewRecipe={handleViewRecipe}
              />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center space-y-4 bg-white rounded-3xl border border-dashed border-stone-300 p-8">
            <div className="w-14 h-14 bg-stone-100 text-stone-400 rounded-full flex items-center justify-center mx-auto">
              <SearchX className="w-7 h-7" />
            </div>
            <h3 className="font-serif text-xl font-bold text-stone-800">
              Walang nahanap na recipe para sa &quot;{searchQuery}&quot;
            </h3>
            <p className="text-xs text-stone-500 max-w-md mx-auto">
              Subukan maghanap ng ibang pangalan ng ulam o sangkap, o gamitin ang aming suggestion form
              para idagdag namin ito.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setSearchQuery('')}
                type="button"
                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 active:scale-95 text-xs font-semibold text-stone-700 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
              >
                I-clear ang Search
              </button>
              <button
                onClick={() => setIsSuggestionOpen(true)}
                type="button"
                className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 active:scale-95 text-xs font-semibold text-white transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
              >
                Mag-Suggest ng Recipe
              </button>
            </div>
          </div>
        )}

        {/* Educational Negosyo Primer Section */}
        <section className="mt-16 rounded-3xl bg-stone-900 text-stone-100 p-6 sm:p-10 border border-stone-800 shadow-xl space-y-6">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-orange-400">
              Negosyo Accounting 101
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              Bakit Mas Mabuti ang Target Margin kaysa Simpleng Markup?
            </h2>
            <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
              Maraming carinderia ang nalulugi dahil inaakala nilang kapag nagdagdag sila ng 50%
              markup sa karne, 50% na ang kanilang tubo. Nakakalimutan ang LPG, mantika, sibuyas,
              takeout boxes, at spoilage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="bg-stone-800/80 p-5 rounded-2xl border border-stone-700/60 space-y-2">
              <div className="flex items-center gap-2 text-orange-400 font-bold text-xs uppercase">
                <Utensils className="w-4 h-4" />
                <span>1. Raw Ingredients</span>
              </div>
              <p className="text-xs text-stone-300 leading-relaxed">
                Tinitiyak ng KusinaScale na bawat gramo ng pampalasa, marinade, at mantika ay may
                katumbas na sentimos sa bawat serving.
              </p>
            </div>

            <div className="bg-stone-800/80 p-5 rounded-2xl border border-stone-700/60 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase">
                <TrendingUp className="w-4 h-4" />
                <span>2. 15% Overhead Buffer</span>
              </div>
              <p className="text-xs text-stone-300 leading-relaxed">
                Awtomatikong nakalaan ang pambayad sa tangke ng LPG gas, kuryente sa refrigerator, at
                tubig pang-hugas ng kaldero.
              </p>
            </div>

            <div className="bg-stone-800/80 p-5 rounded-2xl border border-stone-700/60 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase">
                <HelpCircle className="w-4 h-4" />
                <span>3. Gross Margin Math</span>
              </div>
              <p className="text-xs text-stone-300 leading-relaxed">
                Formula:{' '}
                <code className="text-orange-300 bg-stone-900 px-1 py-0.5 rounded font-mono text-[11px]">
                  SRP = Puhunan / (1 - Margin%)
                </code>
                . Ginagarantiyahan nito na may sapat kang pondo para sa expansion at re-stocking.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Editorial Footer */}
      <footer className="mt-20 border-t border-stone-200 bg-white py-12 text-stone-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="font-serif text-lg font-bold text-stone-900">
                Kusina<span className="text-orange-600">Scale</span>
              </span>
              <span className="text-stone-300">|</span>
              <span className="text-stone-500">
                Food Costing &amp; Portions Calculator para sa Negosyong Pilipino
              </span>
            </div>

            <div className="flex items-center gap-4 text-stone-600 font-medium">
              <button
                onClick={() => setIsSuggestionOpen(true)}
                className="hover:text-orange-600 transition-colors cursor-pointer"
              >
                Mag-Suggest ng Ulam
              </button>
              <span>•</span>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="hover:text-orange-600 transition-colors cursor-pointer"
              >
                Bumalik sa Taas
              </button>
            </div>
          </div>

          <div className="border-t border-stone-100 pt-6 text-[11px] text-stone-400 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p>
              © {new Date().getFullYear()} KusinaScale. Built for culinary entrepreneurs, food stalls, and catering artisans.
            </p>
            <p>
              Disclaimer: Ang mga presyo ng sangkap ay gabay lamang batay sa palengke at supermarket benchmarks.
            </p>
          </div>
        </div>
      </footer>

      {/* Interactive Modals */}
      <RecipeModal
        recipe={selectedRecipe}
        initialTab={modalInitialTab}
        onClose={() => setSelectedRecipe(null)}
      />

      <SuggestionModal
        isOpen={isSuggestionOpen}
        onClose={() => setIsSuggestionOpen(false)}
      />
    </div>
  );
}

export default App;
