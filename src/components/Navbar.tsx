import React from 'react';
import { Sparkles, MessageSquarePlus, Calculator, TrendingUp, Smartphone, CheckCircle2, Flame } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface NavbarProps {
  onOpenSuggestion: () => void;
  onOpenLaunchOffer?: () => void;
  recipeCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSuggestion, onOpenLaunchOffer, recipeCount }) => {
  const { isInstalled, triggerInstall } = usePWAInstall();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo & Editorial Title */}
          <div className="flex items-center gap-3.5">
            <a href="/" className="relative flex items-center justify-center w-12 h-12 rounded-2xl shadow-md shadow-stone-800/15 overflow-hidden group hover:scale-105 transition-transform">
              <img src="/logo.png" alt="KusinaKita 3D App Icon" className="w-full h-full object-cover" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-white"></span>
              </span>
            </a>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-2xl font-bold tracking-tight text-stone-900">
                  Kusina<span className="text-emerald-700">Kita</span>
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase tracking-wider">
                  Hindi Ito AI
                </span>
              </div>
              <p className="text-xs text-stone-500 font-medium tracking-wide">
                May Kita sa Kusina • Recipe &amp; Food Costing OS
              </p>
            </div>
          </div>

          {/* Quick Metrics & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
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
                <span>500+ Drive Pack (₱119)</span>
              </button>
            )}

            {/* PWA Install Button */}
            <button
              onClick={triggerInstall}
              type="button"
              title={isInstalled ? 'Naka-install na ang app sa device na ito' : 'I-install ang KusinaKita PWA sa iyong Phone'}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-stone-950 font-bold text-xs shadow-xs transition-all cursor-pointer"
            >
              {isInstalled ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-stone-950" />
                  <span className="hidden sm:inline">Installed</span>
                </>
              ) : (
                <>
                  <Smartphone className="w-3.5 h-3.5 text-stone-950" />
                  <span>I-install App</span>
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
              <span className="hidden sm:inline">Mag-Suggest</span>
              <span className="sm:hidden">Suggest</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sub-header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white py-1.5 px-4 text-xs font-medium tracking-wide flex items-center justify-center gap-2 shadow-inner text-center">
        <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse shrink-0" />
        <span>Subok na timpla mula sa retiradong Head Cook at Fastfood Entrepreneur — Hindi AI. I-install ang PWA para magamit offline sa palengke.</span>
      </div>
    </header>
  );
};
