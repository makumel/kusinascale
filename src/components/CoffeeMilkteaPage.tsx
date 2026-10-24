import React, { useState, useMemo, useEffect } from 'react';
import {
  COFFEE_MILKTEA_RECIPES,
  BEVERAGE_CATEGORIES,
  BARISTA_GOLDEN_RULES,
  BeverageRecipe
} from '../data/coffeeMilkteaData';
import { IntroSalesRecipePopup } from './IntroSalesRecipePopup';
import { BeverageRecipeModal } from './BeverageRecipeModal';
import {
  Sparkles,
  Lock,
  Unlock,
  Flame,
  Search,
  Calculator,
  Download,
  CheckCircle2,
  ArrowRight,
  X,
  FileSpreadsheet,
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
  const [recipeModalInitialTab, setRecipeModalInitialTab] = useState<'spreadsheet' | 'sop' | 'simulator'>('spreadsheet');

  // Filter & Search state
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Gate Form state with Honeypot field
  const [gateForm, setGateForm] = useState({
    name: '',
    email: '',
    phone: '',
    businessType: 'kiosk',
    vipCode: '',
    botTrap: '' // Invisible Honeypot field
  });
  const [gateSuccessMsg, setGateSuccessMsg] = useState<string>('');

  // Auto trigger intro popup once on first landing if not dismissed
  useEffect(() => {
    const hasSeenIntro = sessionStorage.getItem('has_seen_barista_intro');
    if (!hasSeenIntro) {
      const timer = setTimeout(() => {
        setIsIntroPopupOpen(true);
        sessionStorage.setItem('has_seen_barista_intro', 'true');
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  // Filtered recipes
  const filteredRecipes = useMemo(() => {
    return COFFEE_MILKTEA_RECIPES.filter((item) => {
      if (activeCategory !== 'all' && item.category !== activeCategory) {
        return false;
      }
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesCategory = item.categoryLabel.toLowerCase().includes(q);
        const matchesSize = item.size.toLowerCase().includes(q);
        const matchesIngredients = item.primaryIngredients.some((ing) =>
          ing.name.toLowerCase().includes(q)
        );
        return matchesName || matchesCategory || matchesSize || matchesIngredients;
      }
      return true;
    });
  }, [activeCategory, searchQuery]);

  // Handle Gate Submission (with Honeypot protection)
  const handleUnlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Silent Honeypot Bot Interception: If bot filled the trap field, pretend success silently
    if (gateForm.botTrap.trim() !== '') {
      console.warn('Bot submission intercepted silently by KusinaKita Barista honeypot.');
      setIsUnlocked(true);
      setIsUnlockModalOpen(false);
      return;
    }

    // 2. VIP Code instant bypass or standard lead unlock
    if (gateForm.vipCode.trim().toUpperCase() === 'BARISTA2026' || gateForm.vipCode.trim().toUpperCase() === 'VIP') {
      setIsUnlocked(true);
      localStorage.setItem('kusina_barista_unlocked', 'true');
      setGateSuccessMsg('VIP Pass Na-verify! Binuksan ang lahat ng 28 resipe at spreadsheet.');
      setTimeout(() => {
        setIsUnlockModalOpen(false);
        setGateSuccessMsg('');
      }, 1000);
      return;
    }

    // 3. Legitimate user submission
    if (!gateForm.name.trim() || !gateForm.email.trim()) {
      alert('Paki-lagay ang iyong pangalan at email.');
      return;
    }

    setIsUnlocked(true);
    localStorage.setItem('kusina_barista_unlocked', 'true');
    setGateSuccessMsg('Mabuhay! Na-unlock mo na ang Buong Coffee & Milk Tea Business Package.');
    setTimeout(() => {
      setIsUnlockModalOpen(false);
      setGateSuccessMsg('');
    }, 1200);
  };

  // Export all recipes as CSV / Spreadsheet
  const handleDownloadSpreadsheet = () => {
    const headers = [
      'ID',
      'Pangalan ng Inumin',
      'Kategorya',
      'Sukat (Size)',
      'Raw Recipe Cost (PHP)',
      'Packaging Cost (PHP)',
      'Labor Cost (PHP)',
      'Total Cost (PHP)',
      'Walk-in Retail Price (PHP)',
      'Net Profit / Cup (PHP)',
      'FoodPanda Price (PHP)',
      'COGS Ratio (%)'
    ];

    const rows = COFFEE_MILKTEA_RECIPES.map((r) => [
      r.id,
      `"${r.name}"`,
      `"${r.categoryLabel}"`,
      r.size,
      r.recipeCost.toFixed(2),
      r.packagingCost.toFixed(2),
      r.laborCost.toFixed(2),
      r.totalCost.toFixed(2),
      r.walkinPrice.toFixed(2),
      r.walkinNetProfit.toFixed(2),
      r.foodPandaPrice.toFixed(2),
      (r.cogsRatio * 100).toFixed(1) + '%'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'KusinaKita_Coffee_Milktea_Master_Costing_2026.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-900 flex flex-col selection:bg-amber-600 selection:text-white">
      
      {/* Editorial Navigation Sub-Bar */}
      <section className="bg-stone-900 text-stone-200 py-2.5 px-4 sm:px-8 border-b border-stone-800 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-semibold text-white">Commercial Beverage Operating System</span>
            <span className="hidden sm:inline text-stone-400">• 5-Year Tested Recipes &amp; Costing Engine</span>
          </div>

          <div className="flex items-center gap-3">
            {onBackToCarinderia && (
              <button
                onClick={onBackToCarinderia}
                className="text-stone-300 hover:text-amber-300 transition-colors font-medium cursor-pointer"
              >
                &larr; Bumalik sa Ulam &amp; Carinderia
              </button>
            )}
            {isUnlocked ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-500/40">
                <Unlock className="w-3 h-3" />
                <span>VIP Package Unlocked</span>
              </span>
            ) : (
              <button
                onClick={() => setIsUnlockModalOpen(true)}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-300 bg-amber-950/80 hover:bg-amber-900 px-2.5 py-1 rounded-full border border-amber-500/40 transition cursor-pointer"
              >
                <Lock className="w-3 h-3 text-amber-400" />
                <span>I-unlock Full Access</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Hero Showcase Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-amber-900 via-stone-900 to-stone-950 text-white pt-12 pb-16 sm:pb-20 border-b border-stone-800 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Tested on 10,000+ Cups Sold • Direct Barista Business Costing</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
              Coffee &amp; Milk Tea{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-amber-200">
                Turnkey Business Package
              </span>
            </h1>

            <p className="text-sm sm:text-base text-stone-300 leading-relaxed max-w-2xl mx-auto">
              Huwag mag-franchise ng daan-daang libo. Narito ang kumpletong <strong>28-drink recipe matrix</strong>, eksaktong gramo at mililitro, food costing, packaging, labor allocation, at ang <strong>30% FoodPanda delivery margin formula</strong> mula sa 5 taong barista at kiosk operator.
            </p>

            {/* Hero CTAs */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => setIsIntroPopupOpen(true)}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 active:scale-95 text-stone-950 font-black text-sm shadow-xl shadow-amber-500/20 transition-all hover:scale-105 cursor-pointer flex items-center justify-center gap-2"
              >
                <Flame className="w-4 h-4 text-stone-950 animate-bounce" />
                <span>Panoorin ang #1 Intro Sales Recipe &amp; Costing</span>
              </button>

              {!isUnlocked ? (
                <button
                  onClick={() => setIsUnlockModalOpen(true)}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-stone-800 hover:bg-stone-700 active:scale-95 text-white font-bold text-sm border border-stone-700 transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4 text-amber-400" />
                  <span>I-unlock ang Buong 28-Drink Package</span>
                </button>
              ) : (
                <button
                  onClick={handleDownloadSpreadsheet}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-600 active:scale-95 text-white font-bold text-sm shadow-md transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>I-download Master CSV Spreadsheet</span>
                </button>
              )}
            </div>

            {/* Quick Benefits Bar */}
            <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
              <div className="bg-stone-800/80 p-3 rounded-xl border border-stone-700/80">
                <span className="text-[11px] text-amber-400 font-bold block">₱25 vs ₱135</span>
                <span className="text-xs text-stone-300">Milk Tea Food Cost vs SRP (68% profit)</span>
              </div>
              <div className="bg-stone-800/80 p-3 rounded-xl border border-stone-700/80">
                <span className="text-[11px] text-emerald-400 font-bold block">Double Espresso</span>
                <span className="text-xs text-stone-300">18g specialty coffee calibration</span>
              </div>
              <div className="bg-stone-800/80 p-3 rounded-xl border border-stone-700/80">
                <span className="text-[11px] text-rose-400 font-bold block">Panda 30% Buffer</span>
                <span className="text-xs text-stone-300">Protektado sa komisyon ng delivery apps</span>
              </div>
              <div className="bg-stone-800/80 p-3 rounded-xl border border-stone-700/80">
                <span className="text-[11px] text-sky-400 font-bold block">Per-ML Unit Formula</span>
                <span className="text-xs text-stone-300">Eksaktong costing ng syrup &amp; extract</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 flex-1">
        
        {/* Intro Sales Recipe Teaser Banner */}
        <section className="bg-gradient-to-r from-amber-500/10 via-orange-500/15 to-amber-500/10 border-2 border-amber-500/30 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Starter Hero Formula • Libreng Preview</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
              Gusto Mo Bang Makita ang Aming #1 Best-Selling Recipe?
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Silipin ang exact <strong>16oz Classic Brown Sugar Pearl Milk Tea</strong> at <strong>16oz Iced Caramel Latte</strong> na may kumpletong listahan ng sangkap, gramo, mililitro, food cost (₱25), packaging, labor, at FoodPanda delivery calculation.
            </p>
          </div>

          <button
            onClick={() => setIsIntroPopupOpen(true)}
            className="w-full md:w-auto px-6 py-4 rounded-2xl bg-amber-600 hover:bg-amber-700 active:scale-95 text-white font-black text-sm shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0 group"
          >
            <span>Buksan ang Intro Sales Recipe Pop-up</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </section>

        {/* 5-Year Barista Business Principles */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-stone-200 pb-3">
            <div>
              <span className="text-xs font-bold text-amber-800 uppercase tracking-widest block">Barista Business School</span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                5 Ginintuang Panuntunan sa Negosyo ng Kape at Milk Tea
              </h2>
            </div>
            <p className="text-xs text-stone-500 max-w-md">
              Huwag magtayo ng cafe nang walang financial guardrails. Sundin ang mga patakarang ito upang hindi malugi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {BARISTA_GOLDEN_RULES.map((rule) => (
              <div key={rule.number} className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-2.5 hover:border-amber-400 transition-colors">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-xl bg-amber-600 text-white text-xs font-black flex items-center justify-center shrink-0">
                    {rule.number}
                  </span>
                  <h3 className="font-bold text-sm text-stone-900">{rule.title}</h3>
                </div>
                <h4 className="text-xs font-semibold text-amber-800">{rule.tagalogTitle}</h4>
                <p className="text-xs text-stone-600 leading-relaxed">{rule.content}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Recipe Matrix Catalog Header & Controls */}
        <section className="space-y-6 pt-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                  Ang Kumpletong 28-Beverage Matrix &amp; Costing Database
                </h2>
                {!isUnlocked && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
                    <Lock className="w-3 h-3 text-amber-700" />
                    <span>Gated Package</span>
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                Lahat ng formula ay may kasamang raw food cost, packaging, labor, walk-in SRP, at FoodPanda price.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              {isUnlocked && (
                <button
                  onClick={handleDownloadSpreadsheet}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition shadow-xs cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>I-download ang Buong Excel (.csv)</span>
                </button>
              )}
            </div>
          </div>

          {/* Search Bar & Category Filters */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Maghanap ng inumin (e.g., Milk Tea, Iced Latte, Frappe, Calamansi, Matcha)..."
                className="w-full pl-10 pr-4 py-3 bg-white border border-stone-200 rounded-2xl text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {BEVERAGE_CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
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

          {/* Locked Overlay Teaser (if not unlocked) */}
          {!isUnlocked && (
            <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-white p-6 sm:p-8 rounded-3xl border border-stone-700 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
              <div className="space-y-2 max-w-xl">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                  <Lock className="w-4 h-4" />
                  <span>VIP Gated Member Portal</span>
                </div>
                <h3 className="font-serif text-2xl font-bold text-white">
                  I-unlock ang Kumpletong 28 Inumin &amp; Excel Matrix
                </h3>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                  I-enter lamang ang iyong detalye para ma-access ang full recipe SOPs, editable costing calculator, printable bar guide, at downloadable CSV spreadsheet file. Libreng panimulang access!
                </p>
              </div>

              <button
                onClick={() => setIsUnlockModalOpen(true)}
                className="w-full md:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 active:scale-95 text-stone-950 font-black text-sm shadow-lg transition cursor-pointer flex items-center justify-center gap-2 shrink-0"
              >
                <Unlock className="w-4 h-4 text-stone-950" />
                <span>I-unlock Ngayon (Libre)</span>
              </button>
            </div>
          )}

          {/* Beverage Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe, index) => {
              const isBlurred = !isUnlocked && !recipe.isIntroSalesLeader && index > 1;

              return (
                <div
                  key={recipe.id}
                  className={`bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col relative ${
                    isBlurred ? 'select-none' : ''
                  }`}
                >
                  {/* Blurred Lock Overlay if gated */}
                  {isBlurred && (
                    <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs z-20 flex flex-col items-center justify-center p-6 text-center text-white space-y-3">
                      <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center">
                        <Lock className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-sm text-white">Naka-Lock ang Resipe na Ito</h4>
                        <p className="text-xs text-stone-300 max-w-xs">
                          I-unlock ang buong 28-package para mabasa ang sangkap at SOP.
                        </p>
                      </div>
                      <button
                        onClick={() => setIsUnlockModalOpen(true)}
                        className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-black text-xs shadow-md cursor-pointer transition active:scale-95"
                      >
                        I-unlock ang Resipe
                      </button>
                    </div>
                  )}

                  {/* Card Header */}
                  <div className="p-5 pb-3 space-y-2 border-b border-stone-100">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 uppercase tracking-wide">
                        {recipe.categoryLabel}
                      </span>
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-lg bg-amber-100 text-amber-900 border border-amber-300">
                        {recipe.size}
                      </span>
                    </div>

                    <h3 className="font-serif text-lg font-bold text-stone-900 leading-snug">
                      {recipe.name}
                    </h3>

                    {recipe.isIntroSalesLeader && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                        <Award className="w-3 h-3 text-emerald-700" />
                        <span>#1 Intro Sales Leader</span>
                      </span>
                    )}

                    <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                      {recipe.description}
                    </p>
                  </div>

                  {/* Card Financials Box */}
                  <div className="p-5 py-4 bg-stone-50/70 border-b border-stone-100 space-y-2">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-stone-400 text-[10px] uppercase font-semibold block">Food Cost</span>
                        <span className="font-mono font-bold text-stone-900 text-sm">₱{recipe.recipeCost.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-stone-400 text-[10px] uppercase font-semibold block">Total Cost</span>
                        <span className="font-mono font-bold text-stone-700 text-sm">₱{recipe.totalCost.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-emerald-700 text-[10px] uppercase font-bold block">Walk-in SRP</span>
                        <span className="font-mono font-black text-emerald-800 text-base">₱{recipe.walkinPrice.toFixed(2)}</span>
                        <span className="text-[10px] text-emerald-700 block font-semibold">+₱{recipe.walkinNetProfit.toFixed(2)} tubo</span>
                      </div>
                      <div>
                        <span className="text-rose-700 text-[10px] uppercase font-bold block">Panda (30%)</span>
                        <span className="font-mono font-black text-rose-800 text-base">₱{recipe.foodPandaPrice.toFixed(2)}</span>
                        <span className="text-[10px] text-rose-700 block">Protected</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Actions: Spreadsheet vs SOP vs Live Calculator */}
                  <div className="p-3 mt-auto flex items-center justify-between gap-1.5 border-t border-stone-100 bg-stone-50/50">
                    <button
                      onClick={() => {
                        setSelectedRecipeDetail(recipe);
                        setRecipeModalInitialTab('spreadsheet');
                      }}
                      className="flex-1 py-2 px-2 rounded-xl bg-white hover:bg-emerald-50 text-emerald-800 border border-stone-200 hover:border-emerald-300 font-bold text-[11px] transition cursor-pointer text-center flex items-center justify-center gap-1 shadow-2xs"
                      title="Tingnan ang Orihinal na Drive Spreadsheet Format"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Drive Sheet</span>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedRecipeDetail(recipe);
                        setRecipeModalInitialTab('sop');
                      }}
                      className="py-2 px-2.5 rounded-xl bg-white hover:bg-amber-50 text-stone-800 border border-stone-200 hover:border-amber-300 font-bold text-[11px] transition cursor-pointer flex items-center gap-1 shadow-2xs"
                      title="Tingnan ang Barista SOP Hakbang"
                    >
                      <span>☕ SOP</span>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedRecipeDetail(recipe);
                        setRecipeModalInitialTab('simulator');
                      }}
                      className="py-2 px-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] transition cursor-pointer flex items-center gap-1 shadow-xs"
                      title="Live Margin Simulator"
                    >
                      <Calculator className="w-3.5 h-3.5" />
                      <span>Sim</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

      </main>

      {/* Floating Action Button for Intro Sales Recipe */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsIntroPopupOpen(true)}
          className="flex items-center gap-2.5 px-5 py-3.5 rounded-full bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-700 hover:to-orange-700 active:scale-95 text-white font-black text-xs sm:text-sm shadow-2xl shadow-orange-600/40 border-2 border-white/80 transition-all hover:scale-105 cursor-pointer"
        >
          <Flame className="w-4 h-4 text-amber-200 animate-bounce" />
          <span>Intro Sales Recipe &amp; Costing</span>
        </button>
      </div>

      {/* The 5-Year Barista Intro Sales Recipe Popup Modal */}
      <IntroSalesRecipePopup
        isOpen={isIntroPopupOpen}
        onClose={() => setIsIntroPopupOpen(false)}
        onUnlockFullPackage={() => setIsUnlockModalOpen(true)}
        onOpenCalculator={(recipe) => {
          setSelectedRecipeDetail(recipe);
          setRecipeModalInitialTab('simulator');
        }}
        onOpenSpreadsheetModal={(recipe, tab) => {
          setSelectedRecipeDetail(recipe);
          setRecipeModalInitialTab(tab || 'spreadsheet');
        }}
      />

      {/* Gate Unlock Modal (With CSS Invisible Honeypot Field) */}
      {isUnlockModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-md flex justify-center p-4 animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto p-6 sm:p-8 space-y-6">
            
            <button
              onClick={() => setIsUnlockModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2 text-center">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto font-bold">
                <Unlock className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl font-black text-stone-900">
                I-unlock ang 28-Beverage Master Package
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Makuha ang lahat ng 28 recipe formulas, printable barista SOPs, live costing calculator, at ang kumpletong Excel/CSV sheet.
              </p>
            </div>

            {gateSuccessMsg ? (
              <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="text-sm font-bold text-emerald-900">{gateSuccessMsg}</p>
              </div>
            ) : (
              <form onSubmit={handleUnlockSubmit} className="space-y-4 text-left">
                
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
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
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
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Mobile / Phone Number</label>
                  <input
                    type="tel"
                    value={gateForm.phone}
                    onChange={(e) => setGateForm({ ...gateForm, phone: e.target.value })}
                    placeholder="0917 123 4567"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Uri ng Negosyo</label>
                  <select
                    value={gateForm.businessType}
                    onChange={(e) => setGateForm({ ...gateForm, businessType: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                  >
                    <option value="kiosk">Coffee / Milk Tea Kiosk o Cart</option>
                    <option value="home">Home-based Cafe / Online Delivery</option>
                    <option value="carinderia">Carinderia / Restaurant Add-on</option>
                    <option value="planning">Nasa Plano Pa Lang (Magbubukas Palang)</option>
                  </select>
                </div>

                <div className="pt-1">
                  <label className="block text-[11px] font-semibold text-stone-500 mb-1">
                    May VIP Access Code ka ba? (Optional, e.g. BARISTA2026)
                  </label>
                  <input
                    type="text"
                    value={gateForm.vipCode}
                    onChange={(e) => setGateForm({ ...gateForm, vipCode: e.target.value })}
                    placeholder="I-type dito ang VIP code..."
                    className="w-full px-3.5 py-2 rounded-xl border border-dashed border-stone-300 text-xs font-mono uppercase focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-700 hover:to-orange-700 text-white font-black text-sm shadow-lg transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <Unlock className="w-4 h-4 text-amber-200" />
                  <span>I-unlock ang Buong Package</span>
                </button>

                <p className="text-[10px] text-stone-400 text-center flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>Protektado ng KusinaKita Honeypot Defense • Walang Spam</span>
                </p>
              </form>
            )}

          </div>
        </div>
      )}

            {/* 3-in-1 Master Beverage Recipe Modal: Authentic Drive Spreadsheet + Barista Kitchen SOP + Live Margin Simulator */}
      {selectedRecipeDetail && (
        <BeverageRecipeModal
          recipe={selectedRecipeDetail}
          initialTab={recipeModalInitialTab}
          onClose={() => setSelectedRecipeDetail(null)}
        />
      )}

    </div>
  );
};
