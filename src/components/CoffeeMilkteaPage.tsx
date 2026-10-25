import React, { useState, useMemo, useEffect } from 'react';
import {
  COFFEE_MILKTEA_RECIPES,
  BEVERAGE_CATEGORIES,
  BARISTA_GOLDEN_RULES,
  BeverageRecipe,
  getBeverageActiveSize
} from '../data/coffeeMilkteaData';
import { IntroSalesRecipePopup } from './IntroSalesRecipePopup';
import { BeverageRecipeModal } from './BeverageRecipeModal';
import {
  Sparkles,
  Lock,
  Unlock,
  Flame,
  Search,
  Download,
  CheckCircle2,
  ArrowRight,
  X,
  ShieldCheck,
  Award
} from 'lucide-react';

interface CoffeeMilkteaPageProps {
  onBackToCarinderia?: () => void;
}

export const CoffeeMilkteaPage: React.FC<CoffeeMilkteaPageProps> = ({ onBackToCarinderia }) => {
  // Gated access state
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    return localStorage.getItem('kusina_barista_unlocked') === 'true';
  });

  // Modals state
  const [isIntroPopupOpen, setIsIntroPopupOpen] = useState<boolean>(false);
  const [isUnlockModalOpen, setIsUnlockModalOpen] = useState<boolean>(false);
  const [selectedRecipeDetail, setSelectedRecipeDetail] = useState<BeverageRecipe | null>(null);
  const [selectedRecipeSize, setSelectedRecipeSize] = useState<string>('16oz');

  // Filter & Search state
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Per-card selected cup size state
  const [cardSizes, setCardSizes] = useState<Record<string, string>>({});

  // Gate Form state with Honeypot field
  const [gateForm, setGateForm] = useState({
    name: '',
    email: '',
    phone: '',
    businessType: 'kiosk',
    vipCode: '',
    botTrap: '' // Invisible Honeypot field (RULE[user_global])
  });
  const [gateSuccessMsg, setGateSuccessMsg] = useState<string>('');

  // Auto trigger intro popup once on first landing if not dismissed
  useEffect(() => {
    const hasSeenIntro = sessionStorage.getItem('has_seen_barista_intro');
    if (!hasSeenIntro) {
      const timer = setTimeout(() => {
        setIsIntroPopupOpen(true);
        sessionStorage.setItem('has_seen_barista_intro', 'true');
      }, 600);
      return () => clearTimeout(timer);
    }
  }, []);

  // Category counts
  const categoriesWithCounts = useMemo(() => {
    return BEVERAGE_CATEGORIES.map((cat) => {
      if (cat.id === 'all') {
        return { ...cat, count: COFFEE_MILKTEA_RECIPES.length };
      }
      const count = COFFEE_MILKTEA_RECIPES.filter((r) => r.category === cat.id).length;
      return { ...cat, count };
    });
  }, []);

  // Filtered recipes
  const filteredRecipes = useMemo(() => {
    return COFFEE_MILKTEA_RECIPES.filter((recipe) => {
      if (activeCategory !== 'all' && recipe.category !== activeCategory) {
        return false;
      }
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = recipe.name.toLowerCase().includes(q);
        const matchesCategory = recipe.categoryLabel.toLowerCase().includes(q);
        const matchesDescription = recipe.description.toLowerCase().includes(q);
        const matchesIngredient = recipe.sizes.some(s => 
          s.primaryIngredients.some(i => i.name.toLowerCase().includes(q))
        );
        return matchesName || matchesCategory || matchesDescription || matchesIngredient;
      }
      return true;
    });
  }, [activeCategory, searchQuery]);

  // Handle Form Submission with Honeypot Check
  const handleUnlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (gateForm.botTrap) {
      setGateSuccessMsg('Access requested. Please check your email.');
      setTimeout(() => setIsUnlockModalOpen(false), 2000);
      return;
    }

    localStorage.setItem('kusina_barista_unlocked', 'true');
    setIsUnlocked(true);
    setGateSuccessMsg('Mabuhay! Na-unlock na ang buong 28-Beverage Commercial Package.');
    setTimeout(() => {
      setIsUnlockModalOpen(false);
      setGateSuccessMsg('');
    }, 1200);
  };

  // Instant 1-Click VIP Unlock
  const handleInstantUnlock = () => {
    localStorage.setItem('kusina_barista_unlocked', 'true');
    setIsUnlocked(true);
    setIsUnlockModalOpen(false);
  };

  // Download Master CSV Spreadsheet
  const handleDownloadSpreadsheet = () => {
    const headers = [
      'ID',
      'Pangalan ng Inumin',
      'Kategorya',
      'Sukat ng Baso',
      'Direct Food Cost (PHP)',
      'Packaging Cost (PHP)',
      'Labor Allocation (PHP)',
      'Kabuuang Gastos / Total Cost (PHP)',
      'Markup / Tubo (PHP)',
      'Suggested Walk-In SRP (PHP)',
      'Net Profit / Tubo per Cup (PHP)',
      'FoodPanda 30% SRP (PHP)'
    ];

    const rows: string[][] = [];
    COFFEE_MILKTEA_RECIPES.forEach((drink) => {
      drink.sizes.forEach((s) => {
        rows.push([
          drink.id,
          drink.name,
          drink.categoryLabel,
          s.size,
          s.recipeCost.toFixed(2),
          s.packagingCost.toFixed(2),
          s.laborCost.toFixed(2),
          s.totalCost.toFixed(2),
          s.markup.toFixed(2),
          s.walkinPrice.toFixed(2),
          s.walkinNetProfit.toFixed(2),
          s.foodPandaPrice.toFixed(2)
        ]);
      });
    });

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.map(item => `"${item}"`).join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'KusinaKita_Coffee_Milktea_Master_Costing_Matrix.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8f5] text-stone-900 selection:bg-amber-600 selection:text-white">
      
      {/* Top Banner Navigation */}
      <nav className="bg-stone-950 text-white px-3 sm:px-6 py-2.5 sm:py-3 border-b border-stone-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {onBackToCarinderia && (
              <button
                onClick={onBackToCarinderia}
                className="px-2.5 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 active:scale-95 text-stone-300 hover:text-white text-xs font-semibold border border-stone-700 transition cursor-pointer shrink-0"
              >
                ← Ulam &amp; Carinderia
              </button>
            )}
            <div className="flex items-center gap-1.5 truncate">
              <span className="text-base sm:text-lg">☕</span>
              <span className="font-serif font-black text-xs sm:text-base tracking-tight truncate">
                Coffee &amp; Milk Tea Hub
              </span>
              <span className="hidden sm:inline-block text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full font-mono">
                28 Recipes
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {!isUnlocked ? (
              <button
                onClick={() => setIsUnlockModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 active:scale-95 text-stone-950 font-black text-xs shadow-md transition cursor-pointer flex items-center gap-1"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>I-unlock Package</span>
              </button>
            ) : (
              <button
                onClick={handleDownloadSpreadsheet}
                className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 active:scale-95 text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">I-download</span>
                <span>CSV</span>
              </button>
            )}
          </div>

        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-stone-900 via-stone-950 to-stone-900 text-white pt-8 pb-10 sm:pt-12 sm:pb-14 border-b border-stone-800 px-3 sm:px-6">
        <div className="max-w-7xl mx-auto text-center space-y-3 sm:space-y-4">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>5-Year Commercial Barista Standard • Drive Spreadsheet Calibrated</span>
          </div>

          <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight max-w-3xl mx-auto">
            Commercial Coffee &amp; Milk Tea{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500">
              Costing &amp; Profit Engine
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-stone-400 max-w-2xl mx-auto leading-relaxed">
            Eksaktong sukat ng kape, gatas, syrups, at pearls. Awtomatikong nagbabago ang computation kapag pinalitan ang laki ng baso (8oz, 12oz, 16oz, 22oz), protektado laban sa 30% FoodPanda delivery fee.
          </p>

          {/* Hero CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5">
            <button
              onClick={() => setIsIntroPopupOpen(true)}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 active:scale-95 text-stone-950 font-black text-xs sm:text-sm shadow-xl transition cursor-pointer flex items-center justify-center gap-2"
            >
              <Flame className="w-4 h-4 text-stone-950 animate-bounce" />
              <span>Panoorin ang #1 Intro Sales Recipe &amp; Costing</span>
            </button>

            {!isUnlocked && (
              <button
                onClick={() => setIsUnlockModalOpen(true)}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-stone-800 hover:bg-stone-700 active:scale-95 text-white font-bold text-xs sm:text-sm border border-stone-700 transition cursor-pointer flex items-center justify-center gap-2"
              >
                <Unlock className="w-4 h-4 text-amber-400" />
                <span>Libreng 1-Click VIP Access</span>
              </button>
            )}
          </div>

        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8 flex-1">
        
        {/* Search & Category Filter (Mobile Swipeable) */}
        <div className="space-y-3">
          
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Maghanap ng inumin, kape, milk tea, syrups..."
              className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-2xl border border-stone-300 bg-white text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 text-xs font-bold"
              >
                Clear
              </button>
            )}
          </div>

          {/* Horizontally Scrollable Categories for Mobile */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 no-scrollbar">
            {categoriesWithCounts.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-amber-800 text-amber-100' : 'bg-stone-100 text-stone-500'
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

        </div>

        {/* Beverage Cards Grid (Mobile Responsive & Easy 1-Action Workflow) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredRecipes.map((recipe, index) => {
            const isBlurred = !isUnlocked && !recipe.isIntroSalesLeader && index > 2;
            const currentCardSize = cardSizes[recipe.id] || recipe.defaultSize;
            const activeSizeData = getBeverageActiveSize(recipe, currentCardSize);

            return (
              <div
                key={recipe.id}
                onClick={() => {
                  if (!isBlurred) {
                    setSelectedRecipeDetail(recipe);
                    setSelectedRecipeSize(currentCardSize);
                  }
                }}
                className={`group bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-2xs hover:shadow-lg transition-all flex flex-col relative cursor-pointer ${
                  isBlurred ? 'select-none' : ''
                }`}
              >
                {/* Locked Overlay if not unlocked */}
                {isBlurred && (
                  <div className="absolute inset-0 bg-stone-900/65 backdrop-blur-xs z-20 flex flex-col items-center justify-center p-4 text-center text-white space-y-2.5">
                    <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="font-bold text-xs sm:text-sm text-white">{recipe.name}</h4>
                      <p className="text-[11px] text-stone-300">I-unlock ang buong 28-recipe package.</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsUnlockModalOpen(true);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-black text-xs shadow-md cursor-pointer transition active:scale-95"
                    >
                      I-unlock Ngayon
                    </button>
                  </div>
                )}

                {/* Stock Photo Image Header */}
                <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-stone-100">
                  <img
                    src={recipe.imageUrl}
                    alt={recipe.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-black/20" />
                  
                  {/* Category Pill Over Photo */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-stone-900/80 text-white backdrop-blur-xs uppercase tracking-wide border border-white/20">
                      {recipe.categoryLabel}
                    </span>
                    {recipe.isIntroSalesLeader && (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-600 text-white uppercase tracking-wider flex items-center gap-1 shadow-xs">
                        <Award className="w-3 h-3" />
                        <span>#1 Leader</span>
                      </span>
                    )}
                  </div>

                  {/* Price Tag Over Photo */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-emerald-300 block">Walk-in SRP</span>
                      <span className="font-serif text-2xl font-black text-white leading-none">
                        ₱{activeSizeData.walkinPrice.toFixed(2)}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-amber-300 block">Tubo / Cup</span>
                      <span className="font-mono text-sm font-bold text-amber-200">
                        +₱{activeSizeData.walkinNetProfit.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 sm:p-5 space-y-3 flex-1 flex flex-col justify-between">
                  
                  <div className="space-y-2">
                    <h3 className="font-serif text-base sm:text-lg font-bold text-stone-900 leading-snug group-hover:text-amber-800 transition-colors">
                      {recipe.name}
                    </h3>
                    <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                      {recipe.description}
                    </p>
                  </div>

                  {/* Cup Size Switcher Buttons right on the Card */}
                  <div className="pt-2 border-t border-stone-100 space-y-2" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-stone-500 font-semibold">Piliin ang Sukat:</span>
                      <span className="font-mono text-stone-600 text-[10px]">{activeSizeData.sizeLabel}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {recipe.sizes.map((s) => {
                        const isSelected = s.size === currentCardSize;
                        return (
                          <button
                            key={s.size}
                            onClick={() => {
                              setCardSizes(prev => ({ ...prev, [recipe.id]: s.size }));
                            }}
                            className={`flex-1 py-1 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer text-center ${
                              isSelected
                                ? 'bg-amber-600 text-white shadow-xs font-black'
                                : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                            }`}
                          >
                            {s.size}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Financial Mini Summary */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] p-2.5 bg-stone-50 rounded-xl font-mono">
                    <div>
                      <span className="text-stone-400 block text-[10px]">Puhunan (Food Cost):</span>
                      <span className="font-bold text-stone-800">₱{activeSizeData.recipeCost.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-rose-600 block text-[10px]">Panda 30% SRP:</span>
                      <span className="font-bold text-rose-700">₱{activeSizeData.foodPandaPrice.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* 1 Single Clear Action Button: Easy Workflow */}
                  <button
                    onClick={() => {
                      setSelectedRecipeDetail(recipe);
                      setSelectedRecipeSize(currentCardSize);
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-stone-900 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition active:scale-95 cursor-pointer mt-1"
                  >
                    <span>Resipe &amp; Costing ({currentCardSize})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                </div>

              </div>
            );
          })}
        </div>

        {/* Barista Principles Section */}
        <section className="bg-stone-900 text-white p-5 sm:p-8 rounded-3xl border border-stone-800 space-y-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Barista Business Rules</span>
            <h3 className="font-serif text-xl sm:text-2xl font-bold">5-Year Barista Wisdom &amp; Profit Guardrails</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {BARISTA_GOLDEN_RULES.map((rule) => (
              <div key={rule.number} className="bg-stone-800/80 p-4 rounded-2xl border border-stone-700/80 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-[11px] font-mono">
                    {rule.number}
                  </span>
                  <span>{rule.title}</span>
                </div>
                <p className="text-xs text-stone-300 leading-relaxed">
                  {rule.content}
                </p>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* 3-in-1 Master Beverage Recipe Modal: Mobile Responsive & Dynamic Cup Size */}
      {selectedRecipeDetail && (
        <BeverageRecipeModal
          recipe={selectedRecipeDetail}
          initialSize={selectedRecipeSize}
          onClose={() => setSelectedRecipeDetail(null)}
        />
      )}

      {/* The 5-Year Barista Intro Sales Recipe Popup Modal */}
      <IntroSalesRecipePopup
        isOpen={isIntroPopupOpen}
        onClose={() => setIsIntroPopupOpen(false)}
        onUnlockFullPackage={() => setIsUnlockModalOpen(true)}
        onOpenSpreadsheetModal={(recipe, size) => {
          setSelectedRecipeDetail(recipe);
          setSelectedRecipeSize(size || '16oz');
        }}
      />

      {/* Gate Unlock Modal (With CSS Invisible Honeypot Field) */}
      {isUnlockModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-stone-200 overflow-hidden p-5 sm:p-8 space-y-5">
            
            <button
              onClick={() => setIsUnlockModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1.5 text-center pt-2">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto font-bold">
                <Unlock className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-black text-stone-900">
                I-unlock ang 28-Beverage Master Package
              </h3>
              <p className="text-xs text-stone-500">
                Instant access sa buong recipe book, costing spreadsheet, at barista calibrations.
              </p>
            </div>

            {/* Quick 1-Click Instant Unlock (Easy Workflow) */}
            <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-center space-y-2">
              <span className="text-xs font-bold text-amber-900 block">Mabilisang VIP Access:</span>
              <button
                onClick={handleInstantUnlock}
                className="w-full py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-300 font-black text-xs shadow-md transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>1-Click Instant Unlock (Libre)</span>
              </button>
            </div>

            {gateSuccessMsg ? (
              <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="text-sm font-bold text-emerald-900">{gateSuccessMsg}</p>
              </div>
            ) : (
              <form onSubmit={handleUnlockSubmit} className="space-y-3 text-left">
                
                {/* 
                  INVISIBLE CSS HONEYPOT FIELD (MANDATORY RULE[user_global])
                  Invisible to human users, but automated spam bots will fill it and get silently neutralized!
                */}
                <div
                  aria-hidden="true"
                  tabIndex={-1}
                  style={{
                    position: 'absolute',
                    left: '-9999px',
                    top: '-9999px',
                    opacity: 0,
                    pointerEvents: 'none',
                    height: 0,
                    width: 0,
                    overflow: 'hidden'
                  }}
                >
                  <label htmlFor="barista_bot_security_code">Security Code (Do not fill)</label>
                  <input
                    type="text"
                    id="barista_bot_security_code"
                    name="bot_trap_code"
                    tabIndex={-1}
                    autoComplete="off"
                    value={gateForm.botTrap}
                    onChange={(e) => setGateForm({ ...gateForm, botTrap: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Pangalan (Full Name)</label>
                  <input
                    type="text"
                    required
                    value={gateForm.name}
                    onChange={(e) => setGateForm({ ...gateForm, name: e.target.value })}
                    placeholder="Juan Dela Cruz"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={gateForm.email}
                    onChange={(e) => setGateForm({ ...gateForm, email: e.target.value })}
                    placeholder="juan@gmail.com"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">VIP Access Code (Optional: BARISTA2026)</label>
                  <input
                    type="text"
                    value={gateForm.vipCode}
                    onChange={(e) => setGateForm({ ...gateForm, vipCode: e.target.value })}
                    placeholder="BARISTA2026"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-mono uppercase focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-black text-xs sm:text-sm shadow-md transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <Unlock className="w-4 h-4 text-amber-200" />
                  <span>I-unlock Gamit ang Email</span>
                </button>

                <p className="text-[10px] text-stone-400 text-center flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>Protektado ang iyong impormasyon • Walang spam</span>
                </p>

              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
