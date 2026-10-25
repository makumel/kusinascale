import React from 'react';
import { Sparkles, MessageSquarePlus, Calculator, TrendingUp, Smartphone, CheckCircle2, Flame, Wifi, WifiOff, Coffee } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useNetworkStatus } from '../hooks/useNetworkStatus';

interface NavbarProps {
  onOpenSuggestion: () => void;
  onOpenLaunchOffer?: () => void;
  onOpenCoffeeMilktea?: () => void;
  currentView?: 'food' | 'beverage';
  recipeCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSuggestion,
  onOpenLaunchOffer,
  onOpenCoffeeMilktea,
  currentView = 'food',
  recipeCount
}) => {
  const { isInstalled, triggerInstall } = usePWAInstall();
  const { isOnline } = useNetworkStatus();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo & Editorial Title */}
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-3 group hover:opacity-95 transition-opacity">
              <img
                src="/brand-logo-main.png"
                alt="KusinaKita - Asian & Carinderia Logo"
                className="h-12 sm:h-14 w-auto object-contain transition-transform group-hover:scale-105"
              />
              <div className="hidden sm:block border-l border-stone-200 pl-3">
                <div className="flex items-center gap-2">
                  <span className="font-serif text-xl font-bold tracking-tight text-stone-900 leading-none">
                    Kusina<span className="text-emerald-700">Kita</span>
                  </span>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase tracking-wider">
                    Hindi Ito AI
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 font-medium tracking-wide mt-1">
                  May Kita sa Kusina • Recipe &amp; Food Costing OS
                </p>
              </div>
            </a>
          </div>

          {/* Center Navigation Switcher for Food vs Beverage */}
          {onOpenCoffeeMilktea && (
            <div className="hidden md:flex items-center p-1 bg-stone-100 rounded-2xl border border-stone-200/90 text-xs font-bold">
              <button
                onClick={() => {
                  if (currentView !== 'food') onOpenCoffeeMilktea(); // toggle
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition cursor-pointer ${
                  currentView === 'food'
                    ? 'bg-white text-stone-900 shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <span>🥘 Ulam &amp; Carinderia</span>
                <span className="text-[10px] text-stone-400 font-mono">({recipeCount})</span>
              </button>

              <button
                onClick={onOpenCoffeeMilktea}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition cursor-pointer ${
                  currentView === 'beverage'
                    ? 'bg-amber-600 text-white shadow-2xs'
                    : 'text-amber-800 hover:bg-amber-100/60'
                }`}
              >
                <Coffee className="w-3.5 h-3.5 text-amber-500" />
                <span>Coffee &amp; Milk Tea</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-200 text-amber-900 font-extrabold">
                  28 Recipes
                </span>
              </button>
            </div>
          )}

          {/* Quick Metrics & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Coffee & Milk Tea Quick Toggle */}
            {onOpenCoffeeMilktea && (
              <button
                onClick={onOpenCoffeeMilktea}
                className="md:hidden flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-500/20 text-amber-900 border border-amber-500/40 text-xs font-bold transition active:scale-95 cursor-pointer"
              >
                <Coffee className="w-3.5 h-3.5 text-amber-700" />
                <span>{currentView === 'beverage' ? 'Ulam' : 'Kape & Tea'}</span>
              </button>
            )}
            {/* Palengke Offline / Online Status Badge */}
            {!isOnline ? (
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-900 text-xs font-bold animate-pulse">
                <WifiOff className="w-3.5 h-3.5 text-amber-700" />
                <span className="hidden sm:inline">Palengke Mode (Offline)</span>
                <span className="sm:hidden">Offline</span>
              </div>
            ) : (
              <div className="hidden xl:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-[11px] font-medium" title="Offline ready: Ang lahat ng 64 recipe ay naka-cache sa device">
                <Wifi className="w-3 h-3 text-emerald-600" />
                <span>Palengke Ready</span>
              </div>
            )}

            <div className="hidden lg:flex items-center gap-3 px-3.5 py-1.5 rounded-xl bg-stone-100/80 border border-stone-200 text-xs text-stone-700">
              <span className="inline-flex items-center gap-1.5 font-medium">
                <Calculator className="w-3.5 h-3.5 text-emerald-600" />
                <span className="font-mono font-semibold text-stone-900">{recipeCount}</span> Negosyo Recipes
              </span>
              <span className="text-stone-300">|</span>
              <span className="inline-flex items-center gap-1.5 text-stone-600">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                Proven &amp; Tested
              </span>
            </div>

            {onOpenLaunchOffer && (
              <button
                onClick={onOpenLaunchOffer}
                type="button"
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 text-white font-semibold text-xs shadow-xs hover:shadow transition-all cursor-pointer"
              >
                <Flame className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                <span>Asenso Bundle (₱299)</span>
              </button>
            )}

            {/* PWA Install Button */}
            <button
              onClick={triggerInstall}
              type="button"
              title={isInstalled ? 'Naka-save na ang app sa device na ito' : 'I-save ang KusinaKita app sa iyong cellphone'}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-stone-950 font-bold text-xs shadow-xs transition-all cursor-pointer"
            >
              {isInstalled ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-stone-950" />
                  <span className="hidden sm:inline">Naka-save na</span>
                </>
              ) : (
                <>
                  <Smartphone className="w-3.5 h-3.5 text-stone-950" />
                  <span>Gamitin Offline</span>
                </>
              )}
            </button>

            {/* Suggest Recipe Button */}
            <button
              onClick={onOpenSuggestion}
              type="button"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 active:scale-95 text-white font-medium text-xs shadow-xs transition-all cursor-pointer"
            >
              <MessageSquarePlus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Dagdag Ulam</span>
              <span className="sm:hidden">Suggest</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sub-header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white py-1.5 px-4 text-xs font-medium tracking-wide flex items-center justify-center gap-2 shadow-inner text-center">
        <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse shrink-0" />
        <span>Subok na timpla mula sa retiradong Head Cook at Fastfood Entrepreneur — Hindi AI. I-save sa iyong cellphone para magamit kahit walang internet sa palengke.</span>
      </div>
    </header>
  );
};
