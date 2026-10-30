import React, { useState, useMemo, useEffect } from 'react';
import { Recipe, RecipeCategory } from '../types/recipe';
import { RECIPES as INITIAL_RECIPES, CATEGORIES } from '../data/recipes';
import {
  Lock,
  Unlock,
  Search,
  CheckSquare,
  Square,
  Image as ImageIcon,
  Trash2,
  Download,
  FileSpreadsheet,
  RefreshCw,
  Eye,
  CheckCircle2,
  X,
  AlertTriangle,
  ArrowLeft,
  MessageSquare,
  ExternalLink
} from 'lucide-react';

interface AdminDashboardProps {
  onBackToStorefront: () => void;
  onPreviewRecipe?: (recipe: Recipe) => void;
}

const ADMIN_PASSWORD = 'asenso123';
const LOCAL_STORAGE_KEY = 'kusina_admin_recipes_override';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onBackToStorefront,
  onPreviewRecipe
}) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('kusina_admin_auth') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');

  // Recipes State (defaults to initial catalog + any local overrides)
  const [recipes, setRecipes] = useState<Recipe[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_RECIPES;
  });

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<'catalog' | 'add' | 'suggestions' | 'honeypot'>('catalog');

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Bulk Actions Selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Image Edit Modal
  const [imageModalRecipe, setImageModalRecipe] = useState<Recipe | null>(null);
  const [newImageUrl, setNewImageUrl] = useState<string>('');


  // Community Suggestions & Honeypot logs state
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState<boolean>(false);

  // Status Notification Message
  const [toastMessage, setToastMessage] = useState<string>('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  // Sync recipes to local storage on change
  const persistRecipes = (updated: Recipe[]) => {
    setRecipes(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  };

  // Auth handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('kusina_admin_auth', 'true');
      setAuthError('');
      showToast('Matagumpay na nag-log in sa Admin OS!');
    } else {
      setAuthError('Maling Password! Pakitsek ang security code.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('kusina_admin_auth');
    setPasswordInput('');
  };

  // Fetch suggestions
  useEffect(() => {
    if (isAuthenticated && activeTab === 'suggestions') {
      setIsLoadingSuggestions(true);
      fetch('/api/suggestions')
        .then((r) => r.json())
        .then((data) => {
          if (data && data.suggestions) {
            setSuggestions(data.suggestions);
          }
        })
        .catch(() => {})
        .finally(() => setIsLoadingSuggestions(false));
    }
  }, [isAuthenticated, activeTab]);

  // Filtered recipes for admin view
  const filteredRecipes = useMemo(() => {
    return recipes.filter((r) => {
      const matchCat = selectedCategory === 'all' || r.category === selectedCategory;
      const matchSearch =
        !searchQuery.trim() ||
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.ingredients.some((i) => i.name.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [recipes, selectedCategory, searchQuery]);

  // Bulk Selection Handlers
  const handleToggleSelectAll = () => {
    if (selectedIds.size === filteredRecipes.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredRecipes.map((r) => r.id)));
    }
  };

  const handleToggleSelectOne = (id: string) => {
    const updated = new Set(selectedIds);
    if (updated.has(id)) {
      updated.delete(id);
    } else {
      updated.add(id);
    }
    setSelectedIds(updated);
  };

  // Bulk Actions
  const handleBulkChangeCategory = (newCat: Exclude<RecipeCategory, 'all'>) => {
    if (selectedIds.size === 0) return;
    const catLabel = CATEGORIES.find((c) => c.id === newCat)?.name || newCat;
    const updated = recipes.map((r) => {
      if (selectedIds.has(r.id)) {
        return { ...r, category: newCat, categoryLabel: catLabel };
      }
      return r;
    });
    persistRecipes(updated);
    showToast(`Binago ang kategorya ng ${selectedIds.size} recipe sa "${catLabel}"!`);
    setSelectedIds(new Set());
  };

  const handleBulkChangeDifficulty = (newDiff: 'Madali (Easy)' | 'Katamtaman (Medium)' | 'Negosyo Pro') => {
    if (selectedIds.size === 0) return;
    const updated = recipes.map((r) => {
      if (selectedIds.has(r.id)) {
        return { ...r, difficulty: newDiff };
      }
      return r;
    });
    persistRecipes(updated);
    showToast(`Binago ang antas ng hirap ng ${selectedIds.size} recipe sa "${newDiff}"!`);
    setSelectedIds(new Set());
  };

  const handleBulkDelete = () => {
    if (selectedIds.size === 0) return;
    if (!window.confirm(`Sigurado ka bang nais mong tanggalin ang ${selectedIds.size} napiling recipes?`)) return;
    const updated = recipes.filter((r) => !selectedIds.has(r.id));
    persistRecipes(updated);
    showToast(`Tinanggal ang ${selectedIds.size} recipe sa database.`);
    setSelectedIds(new Set());
  };

  const handleBulkExportJSON = () => {
    const exportData = recipes.filter((r) => selectedIds.size === 0 || selectedIds.has(r.id));
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `KusinaKita_Recipes_Export_${exportData.length}items.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`Na-export ang ${exportData.length} recipes bilang JSON!`);
  };

  // Image Update Handler
  const handleSaveImageUpdate = () => {
    if (!imageModalRecipe || !newImageUrl.trim()) return;
    const updated = recipes.map((r) => {
      if (r.id === imageModalRecipe.id) {
        return { ...r, imageUrl: newImageUrl.trim() };
      }
      return r;
    });
    persistRecipes(updated);
    showToast(`Matagumpay na napalitan ang litrato ng "${imageModalRecipe.name}"!`);
    setImageModalRecipe(null);
    setNewImageUrl('');
  };

  // Preset Culinary Image options
  const IMAGE_PRESETS = [
    { label: 'Crispy Pork / Lechon', url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80' },
    { label: 'Braised Beef Stew', url: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=800&auto=format&fit=crop&q=80' },
    { label: 'Chicken Sizzling', url: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800&auto=format&fit=crop&q=80' },
    { label: 'Fresh Seafood / Prawns', url: 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=800&auto=format&fit=crop&q=80' },
    { label: 'Asian Soup / Broth', url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&auto=format&fit=crop&q=80' },
    { label: 'Pinoy Dessert / Mango', url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&auto=format&fit=crop&q=80' }
  ];

  // LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-stone-950 border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
              <Lock className="w-8 h-8" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-white tracking-tight">
              KusinaKita Admin OS
            </h1>
            <p className="text-xs text-stone-400">
              Ilagay ang security password upang ma-manage ang 500+ recipes, litrato, at bulk actions.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1.5">
                Admin Password
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="I-enter ang password..."
                className="w-full px-4 py-3 rounded-xl bg-stone-900 border border-stone-700 text-white placeholder-stone-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                autoFocus
              />
              {authError && (
                <p className="text-xs text-red-400 mt-1.5 font-medium flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{authError}</span>
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-stone-950 font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4" />
              <span>I-unlock ang Dashboard</span>
            </button>
          </form>

          <div className="pt-2 border-t border-stone-800 text-center">
            <button
              onClick={onBackToStorefront}
              type="button"
              className="text-xs text-stone-500 hover:text-stone-300 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Bumalik sa KusinaKita Storefront</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // AUTHENTICATED DASHBOARD
  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 flex flex-col">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-stone-700 flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Admin Navbar */}
      <header className="sticky top-0 z-40 bg-stone-950 text-white border-b border-stone-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" onClick={(e) => { e.preventDefault(); onBackToStorefront(); }} className="flex items-center gap-2.5">
              <img src="/brand-logo-main.png" alt="KusinaKita" className="h-10 w-auto" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-serif font-bold text-lg text-white">
                    Kusina<span className="text-amber-400">Kita</span>
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                    Admin OS
                  </span>
                </div>
                <p className="text-[10px] text-stone-400">Recipe Catalog &amp; Image Management</p>
              </div>
            </a>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onBackToStorefront}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium border border-stone-700 transition-all cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Buksan ang Storefront</span>
            </button>

            <button
              onClick={handleLogout}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-800/50 text-xs font-semibold transition-all cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Mag-Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full space-y-6">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">Kabuuang Recipes</span>
            <div className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
              {recipes.length}
            </div>
            <span className="text-[11px] text-emerald-700 font-medium">100% Commercial Negosyo</span>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">Carinderia Classics</span>
            <div className="font-serif text-2xl sm:text-3xl font-bold text-orange-600 mt-1">
              {recipes.filter((r) => r.category === 'carinderia').length}
            </div>
            <span className="text-[11px] text-stone-500">High-volume viands</span>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">Asian &amp; Western</span>
            <div className="font-serif text-2xl sm:text-3xl font-bold text-teal-700 mt-1">
              {recipes.filter((r) => r.category === 'asian' || r.category === 'western').length}
            </div>
            <span className="text-[11px] text-stone-500">Specialty viands &amp; snacks</span>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">Desserts &amp; Drinks</span>
            <div className="font-serif text-2xl sm:text-3xl font-bold text-purple-700 mt-1">
              {recipes.filter((r) => r.category === 'desserts' || r.category === 'tipid').length}
            </div>
            <span className="text-[11px] text-stone-500">High-margin add-ons</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'catalog'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-white text-stone-600 hover:bg-stone-200/60'
            }`}
          >
            Recipe &amp; Image Catalog ({recipes.length})
          </button>
          <button
            onClick={() => setActiveTab('suggestions')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'suggestions'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-white text-stone-600 hover:bg-stone-200/60'
            }`}
          >
            Community Suggestions Inbox
          </button>
        </div>

        {/* TAB 1: CATALOG & BULK ACTIONS */}
        {activeTab === 'catalog' && (
          <div className="space-y-4">
            {/* Google Sheets & Excel Export Card */}
            <div className="bg-gradient-to-r from-emerald-950/80 via-stone-900 to-amber-950/70 border border-emerald-500/30 rounded-2xl p-4 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-emerald-300">573 Master Recipes Google Sheet &amp; Costing Database</h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      100% Ingested
                    </span>
                  </div>
                  <p className="text-xs text-stone-300">
                    Na-extract mula sa Google Drive archive (32 subfolders). Kasama ang picture preview links, recipe ingredients, step-by-step instructions, at costing calculations.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <a
                  href="/downloads/KusinaKita_573_Master_Recipes_GoogleSheet.csv"
                  download="KusinaKita_573_Master_Recipes_GoogleSheet.csv"
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Google Sheet (CSV)</span>
                </a>
                <a
                  href="/downloads/KusinaKita_573_Ingredients_Costing_Matrix.csv"
                  download="KusinaKita_573_Ingredients_Costing_Matrix.csv"
                  className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Ingredients Matrix</span>
                </a>
                <a
                  href="/downloads/KusinaKita_573_Complete_Recipe_Book.xlsx"
                  download="KusinaKita_573_Complete_Recipe_Book.xlsx"
                  className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Excel (.xlsx)</span>
                </a>
              </div>
            </div>
            {/* Search & Filter Toolbar */}
            <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Maghanap ayon sa pangalan o sangkap..."
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-stone-50 border border-stone-200 text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    selectedCategory === 'all' ? 'bg-amber-600 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  Lahat ({recipes.length})
                </button>
                <button
                  onClick={() => setSelectedCategory('carinderia')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    selectedCategory === 'carinderia' ? 'bg-amber-600 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  Carinderia
                </button>
                <button
                  onClick={() => setSelectedCategory('asian')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    selectedCategory === 'asian' ? 'bg-amber-600 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  Asian
                </button>
                <button
                  onClick={() => setSelectedCategory('western')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    selectedCategory === 'western' ? 'bg-amber-600 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  Western
                </button>
                <button
                  onClick={() => setSelectedCategory('desserts')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    selectedCategory === 'desserts' ? 'bg-amber-600 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  Desserts &amp; Drinks
                </button>
              </div>
            </div>

            {/* Bulk Actions Bar */}
            <div className="bg-stone-900 text-white rounded-2xl p-3.5 sm:p-4 flex flex-wrap items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleToggleSelectAll}
                  type="button"
                  className="flex items-center gap-2 text-xs font-semibold text-stone-200 hover:text-white cursor-pointer"
                >
                  {selectedIds.size === filteredRecipes.length && filteredRecipes.length > 0 ? (
                    <CheckSquare className="w-4 h-4 text-amber-400" />
                  ) : (
                    <Square className="w-4 h-4 text-stone-400" />
                  )}
                  <span>Piliin Lahat ({filteredRecipes.length})</span>
                </button>

                {selectedIds.size > 0 && (
                  <span className="text-xs font-bold text-amber-300 bg-amber-950/80 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
                    {selectedIds.size} napili
                  </span>
                )}
              </div>

              {selectedIds.size > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  {/* Category Assignment */}
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        handleBulkChangeCategory(e.target.value as any);
                        e.target.value = '';
                      }
                    }}
                    defaultValue=""
                    className="px-2.5 py-1.5 rounded-xl bg-stone-800 text-xs font-medium text-white border border-stone-700 focus:outline-none cursor-pointer"
                  >
                    <option value="" disabled>I-assign sa Category...</option>
                    <option value="carinderia">Carinderia</option>
                    <option value="asian">Asian</option>
                    <option value="western">Western</option>
                    <option value="desserts">Desserts &amp; Drinks</option>
                    <option value="tipid">Tipid Sulit</option>
                  </select>

                  {/* Difficulty Assignment */}
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        handleBulkChangeDifficulty(e.target.value as any);
                        e.target.value = '';
                      }
                    }}
                    defaultValue=""
                    className="px-2.5 py-1.5 rounded-xl bg-stone-800 text-xs font-medium text-white border border-stone-700 focus:outline-none cursor-pointer"
                  >
                    <option value="" disabled>I-assign sa Difficulty...</option>
                    <option value="Madali (Easy)">Madali (Easy)</option>
                    <option value="Katamtaman (Medium)">Katamtaman (Medium)</option>
                    <option value="Negosyo Pro">Negosyo Pro</option>
                  </select>

                  {/* Export Selected JSON */}
                  <button
                    onClick={handleBulkExportJSON}
                    type="button"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-xs font-semibold text-white transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export JSON</span>
                  </button>

                  {/* Bulk Delete */}
                  <button
                    onClick={handleBulkDelete}
                    type="button"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-700 hover:bg-red-600 text-xs font-semibold text-white transition-all cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Tanggalin</span>
                  </button>
                </div>
              )}
            </div>

            {/* Recipes Grid / List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRecipes.map((recipe) => {
                const isSelected = selectedIds.has(recipe.id);

                return (
                  <div
                    key={recipe.id}
                    className={`bg-white rounded-2xl border p-4 transition-all shadow-xs flex flex-col justify-between gap-3 ${
                      isSelected ? 'border-amber-500 ring-2 ring-amber-400/30' : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    {/* Top Row: Checkbox, Name, Category */}
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => handleToggleSelectOne(recipe.id)}
                        type="button"
                        className="mt-1 text-stone-400 hover:text-stone-700 cursor-pointer"
                      >
                        {isSelected ? (
                          <CheckSquare className="w-5 h-5 text-amber-600" />
                        ) : (
                          <Square className="w-5 h-5 text-stone-300" />
                        )}
                      </button>

                      {/* Image Thumbnail with Overlay Action */}
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200 group">
                        <img
                          src={recipe.imageUrl}
                          alt={recipe.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <button
                          onClick={() => {
                            setImageModalRecipe(recipe);
                            setNewImageUrl(recipe.imageUrl);
                          }}
                          type="button"
                          title="Palitan ang Litrato"
                          className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                        >
                          <ImageIcon className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Title & Metadata */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                            {recipe.category}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 font-mono">
                            {recipe.baseServings} pax
                          </span>
                        </div>
                        <h4 className="font-serif font-bold text-sm text-stone-900 truncate mt-0.5">
                          {recipe.name}
                        </h4>
                        <p className="text-[11px] text-stone-500 truncate">{recipe.tagline}</p>
                      </div>
                    </div>

                    {/* Stats & Actions Row */}
                    <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-[11px] text-stone-500">
                        <span>{recipe.ingredients.length} sangkap</span>
                        <span>•</span>
                        <span>{recipe.instructions.length} steps</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setImageModalRecipe(recipe);
                            setNewImageUrl(recipe.imageUrl);
                          }}
                          type="button"
                          className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition-all cursor-pointer"
                          title="Palitan ang Litrato"
                        >
                          <ImageIcon className="w-3.5 h-3.5" />
                        </button>

                        {onPreviewRecipe && (
                          <button
                            onClick={() => onPreviewRecipe(recipe)}
                            type="button"
                            className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition-all cursor-pointer"
                            title="Tingnan ang Recipe Modal"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: SUGGESTIONS INBOX */}
        {activeTab === 'suggestions' && (
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div>
                <h3 className="font-serif text-lg font-bold text-stone-900">
                  Community Recipe Requests
                </h3>
                <p className="text-xs text-stone-500">
                  Mga ipinasang mungkahi ng mga cook at karinderya owners mula sa web app.
                </p>
              </div>

              <button
                onClick={() => {
                  setIsLoadingSuggestions(true);
                  fetch('/api/suggestions')
                    .then((r) => r.json())
                    .then((d) => setSuggestions(d.suggestions || []))
                    .finally(() => setIsLoadingSuggestions(false));
                }}
                type="button"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition-all cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingSuggestions ? 'animate-spin' : ''}`} />
                <span>I-refresh</span>
              </button>
            </div>

            {suggestions.length === 0 ? (
              <div className="py-12 text-center text-stone-400 space-y-2">
                <MessageSquare className="w-8 h-8 mx-auto text-stone-300" />
                <p className="text-xs">Walang bagong mungkahi sa ngayon.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3 px-3">Recipe Name</th>
                      <th className="py-3 px-3">Category</th>
                      <th className="py-3 px-3">Author</th>
                      <th className="py-3 px-3">Notes</th>
                      <th className="py-3 px-3">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {suggestions.map((sug) => (
                      <tr key={sug.id} className="hover:bg-stone-50/60">
                        <td className="py-3 px-3 font-semibold text-stone-900">{sug.recipe_name}</td>
                        <td className="py-3 px-3 text-stone-600">{sug.category}</td>
                        <td className="py-3 px-3 text-stone-700">{sug.author_name || 'Anonymous'}</td>
                        <td className="py-3 px-3 text-stone-500 max-w-xs truncate">{sug.notes || '-'}</td>
                        <td className="py-3 px-3 text-stone-400 font-mono text-[11px]">{sug.created_at || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>

      {/* IMAGE UPDATE MODAL */}
      {imageModalRecipe && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 border border-stone-200 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <h3 className="font-serif text-lg font-bold text-stone-900">
                  Palitan ang Litrato
                </h3>
                <p className="text-xs text-stone-500 truncate max-w-xs">
                  {imageModalRecipe.name}
                </p>
              </div>
              <button
                onClick={() => setImageModalRecipe(null)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Current Image Preview */}
            <div className="relative h-44 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200">
              <img
                src={newImageUrl || imageModalRecipe.imageUrl}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 text-white text-[10px] font-bold backdrop-blur-md">
                Live Preview
              </div>
            </div>

            {/* Input URL */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600">
                Image URL (Unsplash o Local Path)
              </label>
              <input
                type="text"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/... o /recipes/ulam.jpg"
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-300 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Quick Presets */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold text-stone-500">
                O pumili mula sa mga culinary presets:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {IMAGE_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setNewImageUrl(preset.url)}
                    className="p-2 rounded-xl text-left border border-stone-200 hover:border-amber-500 text-[11px] font-medium text-stone-700 hover:bg-amber-50 transition-all cursor-pointer truncate"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-end gap-2 border-t border-stone-100">
              <button
                onClick={() => setImageModalRecipe(null)}
                type="button"
                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold cursor-pointer"
              >
                Kanselahin
              </button>
              <button
                onClick={handleSaveImageUpdate}
                type="button"
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                I-save ang Bagong Litrato
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
