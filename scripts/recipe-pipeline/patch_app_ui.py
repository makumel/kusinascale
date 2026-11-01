import os
import sys

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
APP_TSX = os.path.join(BASE_DIR, "src", "App.tsx")

with open(APP_TSX, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update CategoryFilter import
old_import = "import { CategoryFilter } from './components/CategoryFilter';"
new_import = "import { CategoryFilter, ProteinFilter, TimeFilter, SortOption, ViewMode } from './components/CategoryFilter';"
assert old_import in content, "old_import not found"
content = content.replace(old_import, new_import, 1)

# 2. Add state and helper functions after searchQuery state
target_state = "  const [searchQuery, setSearchQuery] = useState<string>('');"
new_state = """  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProtein, setSelectedProtein] = useState<ProteinFilter>('all');
  const [selectedTime, setSelectedTime] = useState<TimeFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('bestseller');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Helper to deduce protein group from name & ingredients
  const getRecipeProtein = (recipe: Recipe): ProteinFilter => {
    const text = (recipe.name + ' ' + recipe.description).toLowerCase();
    if (text.includes('baboy') || text.includes('pork') || text.includes('liempo') || text.includes('kasim') || text.includes('bagnet') || text.includes('lechon') || text.includes('sisig') || text.includes('menudo')) return 'pork';
    if (text.includes('manok') || text.includes('chicken') || text.includes('inasal') || text.includes('tinola')) return 'chicken';
    if (text.includes('baka') || text.includes('beef') || text.includes('bulalo') || text.includes('kansi') || text.includes('caldereta') || text.includes('bistek')) return 'beef';
    if (text.includes('isda') || text.includes('bangus') || text.includes('shrimp') || text.includes('hipon') || text.includes('tuna') || text.includes('pusit') || text.includes('seafood') || text.includes('salmon') || text.includes('tilapia')) return 'seafood';
    if (text.includes('gulay') || text.includes('tokwa') || text.includes('talong') || text.includes('sitaw') || text.includes('kangkong') || text.includes('ampalaya') || text.includes('laing') || text.includes('pinakbet')) return 'vegetable';
    return 'all';
  };

  // Helper to parse cook time in minutes
  const parseCookTimeMinutes = (timeStr: string): number => {
    const match = timeStr.match(/\\d+/);
    return match ? parseInt(match[0], 10) : 30;
  };

  const handleResetFilters = () => {
    setActiveCategory('all');
    setSearchQuery('');
    setSelectedProtein('all');
    setSelectedTime('all');
    setSortBy('bestseller');
  };"""

assert target_state in content, "target_state not found"
content = content.replace(target_state, new_state, 1)

# 3. Replace filteredRecipes definition with multi-facet & sort logic
old_filter_block = """  // Filter recipes based on active category & search query
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
  }, [activeCategory, searchQuery]);"""

new_filter_block = """  // Filter & sort recipes based on active category, multi-facets, & search query
  const filteredRecipes = useMemo(() => {
    const matched = RECIPES.filter((recipe) => {
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
        if (!matchesName && !matchesTagline && !matchesDescription && !matchesIngredient) {
          return false;
        }
      }

      // Protein facet check
      if (selectedProtein !== 'all') {
        const protein = getRecipeProtein(recipe);
        if (protein !== selectedProtein) {
          return false;
        }
      }

      // Cook time facet check
      if (selectedTime !== 'all') {
        const minutes = parseCookTimeMinutes(recipe.cookTime);
        if (selectedTime === 'quick' && minutes > 20) return false;
        if (selectedTime === 'medium' && (minutes <= 20 || minutes > 45)) return false;
        if (selectedTime === 'slow' && minutes <= 45) return false;
      }

      return true;
    });

    // Sort order
    return matched.sort((a, b) => {
      if (sortBy === 'profit-desc') {
        return b.defaultTargetMargin - a.defaultTargetMargin;
      }
      if (sortBy === 'cost-asc') {
        const costA = a.ingredients.reduce((acc, i) => acc + i.baseCost, 0) / a.baseServings;
        const costB = b.ingredients.reduce((acc, i) => acc + i.baseCost, 0) / b.baseServings;
        return costA - costB;
      }
      if (sortBy === 'time-asc') {
        return parseCookTimeMinutes(a.cookTime) - parseCookTimeMinutes(b.cookTime);
      }
      if (sortBy === 'alphabetical') {
        return a.name.localeCompare(b.name);
      }
      return 0; // Bestseller turnover default order
    });
  }, [activeCategory, searchQuery, selectedProtein, selectedTime, sortBy]);"""

assert old_filter_block in content, "old_filter_block not found"
content = content.replace(old_filter_block, new_filter_block, 1)

# 4. Update CategoryFilter component call in JSX
old_cat_filter = """        <CategoryFilter
          categories={categoriesWithCounts}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />"""

new_cat_filter = """        <CategoryFilter
          categories={categoriesWithCounts}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedProtein={selectedProtein}
          onSelectProtein={setSelectedProtein}
          selectedTime={selectedTime}
          onSelectTime={setSelectedTime}
          sortBy={sortBy}
          onSortChange={setSortBy}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          totalFilteredCount={filteredRecipes.length}
          onResetFilters={handleResetFilters}
        />"""

assert old_cat_filter in content, "old_cat_filter not found"
content = content.replace(old_cat_filter, new_cat_filter, 1)

# 5. Update Recipe Cards grid rendering for dual view mode
old_grid = """        {/* Recipe Cards Grid */}
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
        ) : ("""

new_grid = """        {/* Recipe Cards Grid / POS Table View */}
        {filteredRecipes.length > 0 ? (
          viewMode === 'pos' ? (
            <div className="space-y-3">
              {filteredRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  viewMode="pos"
                  onOpenCalculator={handleOpenCalculator}
                  onViewRecipe={handleViewRecipe}
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  viewMode="grid"
                  onOpenCalculator={handleOpenCalculator}
                  onViewRecipe={handleViewRecipe}
                />
              ))}
            </div>
          )
        ) : ("""

assert old_grid in content, "old_grid not found"
content = content.replace(old_grid, new_grid, 1)

with open(APP_TSX, "w", encoding="utf-8") as f:
    f.write(content)

print("[SUCCESS] src/App.tsx updated with multi-facet filters, sorting, and dual POS/Card views.")
