import React, { useState, useEffect, useRef } from 'react';
import { Recipe } from '../types/recipe';
import {
  Flame,
  CheckCircle2,
  Circle,
  Play,
  Pause,
  RotateCcw,
  Clock,
  Sparkles,
  ArrowLeft,
  Timer as TimerIcon,
  Bell,
  UtensilsCrossed,
  ChefHat
} from 'lucide-react';

interface CookingModeProps {
  recipe: Recipe;
  portions: number;
  onExit: () => void;
}

// Helper to extract minutes from step description (e.g. "Simmer for 20 minutes" -> 20)
function extractMinutes(text: string): number | null {
  const match = text.match(/(\d+)\s*(?:hanggang\s*\d+\s*)?(?:minuto|minutos|mins?|minutes?)/i);
  if (match && match[1]) {
    const mins = parseInt(match[1], 10);
    return mins > 0 && mins <= 180 ? mins : null;
  }
  return null;
}

// Audio beep using Web Audio API for timer finish alert
function playTimerChime() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    const playTone = (freq: number, start: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.3, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + duration);
    };

    playTone(587.33, now, 0.2); // D5
    playTone(880, now + 0.25, 0.4); // A5
    playTone(1174.66, now + 0.55, 0.6); // D6
  } catch (err) {
    console.warn('Audio chime unsupported:', err);
  }
}

export const CookingMode: React.FC<CookingModeProps> = ({ recipe, portions, onExit }) => {
  const scaleMultiplier = portions / recipe.baseServings;

  // Prep checklist state (ingredient index -> boolean)
  const [preppedIngredients, setPreppedIngredients] = useState<Record<number, boolean>>({});

  // Active cooking steps state (step index -> boolean)
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});

  // Active Countdown Timer state
  const [timerSecondsLeft, setTimerSecondsLeft] = useState<number | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [activeStepTimerIndex, setActiveStepTimerIndex] = useState<number | null>(null);
  const timerIntervalRef = useRef<any>(null);

  // Timer tick effect
  useEffect(() => {
    if (isTimerRunning && timerSecondsLeft !== null && timerSecondsLeft > 0) {
      timerIntervalRef.current = setInterval(() => {
        setTimerSecondsLeft((prev) => {
          if (prev !== null && prev > 1) {
            return prev - 1;
          }
          // Timer finished!
          clearInterval(timerIntervalRef.current);
          setIsTimerRunning(false);
          playTimerChime();
          return 0;
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isTimerRunning, timerSecondsLeft]);

  const startStepTimer = (stepIndex: number, minutes: number) => {
    const totalSecs = minutes * 60;
    setActiveStepTimerIndex(stepIndex);
    setTimerSecondsLeft(totalSecs);
    setIsTimerRunning(true);
  };

  const toggleTimerPause = () => {
    setIsTimerRunning((prev) => !prev);
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimerSecondsLeft(null);
    setActiveStepTimerIndex(null);
  };

  const addExtraMinutes = (extraMins: number) => {
    setTimerSecondsLeft((prev) => (prev || 0) + extraMins * 60);
    setIsTimerRunning(true);
  };

  const formatTimerDisplay = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Metrics
  const totalIngredients = recipe.ingredients.length;
  const preppedCount = Object.values(preppedIngredients).filter(Boolean).length;
  const prepProgressPercent = totalIngredients > 0 ? Math.round((preppedCount / totalIngredients) * 100) : 0;

  const totalSteps = recipe.instructions.length;
  const stepsDoneCount = Object.values(completedSteps).filter(Boolean).length;
  const stepsProgressPercent = totalSteps > 0 ? Math.round((stepsDoneCount / totalSteps) * 100) : 0;
  const isCookingComplete = stepsDoneCount === totalSteps && totalSteps > 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Cooking Station Header */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-emerald-700 text-white rounded-3xl p-5 sm:p-6 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/20 backdrop-blur-md uppercase tracking-wider text-amber-200">
              Interactive Cooking Station
            </span>
            <span className="text-xs text-white/90 font-medium">
              • {portions} Pax ({scaleMultiplier.toFixed(2)}x Multiplier)
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight mt-1 flex items-center gap-2">
            <span>{recipe.name}</span>
            <Flame className="w-6 h-6 text-amber-300 animate-pulse" />
          </h2>
          <p className="text-xs text-amber-100/90 mt-1">
            Subaybayan ang paghahanda ng sangkap at lutuin gamit ang live countdown timer.
          </p>
        </div>

        <button
          onClick={onExit}
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 active:scale-95 text-white font-semibold text-xs backdrop-blur-md border border-white/20 transition-all cursor-pointer self-start md:self-center"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Resipe</span>
        </button>
      </div>

      {/* Floating Active Timer Widget (If Timer is Active) */}
      {timerSecondsLeft !== null && (
        <div className="sticky top-20 z-30 bg-stone-900/95 backdrop-blur-md text-white rounded-2xl p-4 sm:p-5 border border-amber-500/40 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl ${isTimerRunning ? 'bg-amber-500 text-stone-950 animate-pulse' : 'bg-stone-800 text-amber-400'}`}>
              <TimerIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                {activeStepTimerIndex !== null ? `Hakbang ${activeStepTimerIndex + 1} Cooking Timer` : 'Kitchen Timer'}
              </div>
              <div className="font-mono text-3xl sm:text-4xl font-extrabold tracking-wider text-white">
                {formatTimerDisplay(timerSecondsLeft)}
              </div>
            </div>
          </div>

          {timerSecondsLeft === 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-600 text-white text-xs font-bold animate-bounce">
              <Bell className="w-4 h-4" />
              <span>Tapos na ang Oras! Haluin o patayin ang apoy.</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTimerPause}
              type="button"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-stone-950 font-bold text-xs transition-all cursor-pointer"
            >
              {isTimerRunning ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Resume</span>
                </>
              )}
            </button>

            <button
              onClick={() => addExtraMinutes(1)}
              type="button"
              className="px-2.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 active:scale-95 text-stone-200 font-bold text-xs transition-all cursor-pointer"
              title="Magdagdag ng 1 minuto"
            >
              +1m
            </button>

            <button
              onClick={() => addExtraMinutes(5)}
              type="button"
              className="px-2.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 active:scale-95 text-stone-200 font-bold text-xs transition-all cursor-pointer"
              title="Magdagdag ng 5 minuto"
            >
              +5m
            </button>

            <button
              onClick={resetTimer}
              type="button"
              className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 active:scale-95 text-stone-400 hover:text-white transition-all cursor-pointer"
              title="I-reset ang timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Completion Banner */}
      {isCookingComplete && (
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-3xl p-6 text-center space-y-2 shadow-lg animate-in zoom-in-95">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto text-amber-200">
            <ChefHat className="w-7 h-7" />
          </div>
          <h3 className="font-serif text-2xl font-bold">
            Mabuhay! Handa na ang iyong {recipe.name}!
          </h3>
          <p className="text-sm text-emerald-100 max-w-md mx-auto">
            Matagumpay mong natapos ang lahat ng {totalSteps} hakbang sa pagluluto para sa {portions} portions. Handa nang ihain o ibenta sa iyong mga suki!
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Preparation Station (Mise en Place Checklist) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <UtensilsCrossed className="w-4 h-4 text-orange-600" />
                <h3 className="font-serif text-base font-bold text-stone-900">
                  Mise en Place (Paghahanda)
                </h3>
              </div>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-800">
                {preppedCount}/{totalIngredients} Handa ({prepProgressPercent}%)
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${prepProgressPercent}%` }}
              />
            </div>

            <p className="text-xs text-stone-500">
              I-check ang bawat sangkap habang hinihiwa at sinusukat bago simulan ang pag-apoy.
            </p>

            {/* Ingredient Checklist */}
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {recipe.ingredients.map((ing, idx) => {
                const isPrepped = !!preppedIngredients[idx];
                const scaledQty = ing.quantity * scaleMultiplier;
                const formattedQty = scaledQty % 1 === 0 ? String(scaledQty) : scaledQty.toFixed(2);

                return (
                  <div
                    key={ing.id || idx}
                    onClick={() => setPreppedIngredients((prev) => ({ ...prev, [idx]: !prev[idx] }))}
                    className={`flex items-start gap-3 p-3 rounded-2xl border transition-all cursor-pointer select-none ${
                      isPrepped
                        ? 'bg-emerald-50/70 border-emerald-200 text-stone-500'
                        : 'bg-stone-50 hover:bg-stone-100/80 border-stone-200 text-stone-900'
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={isPrepped}
                      readOnly
                      aria-label={`Handa na ang ${ing.name}`}
                    />
                    <div className="mt-0.5">
                      {isPrepped ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Circle className="w-4 h-4 text-stone-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className={`text-xs font-semibold ${isPrepped ? 'line-through text-stone-400' : 'text-stone-900'}`}>
                          {ing.name}
                        </span>
                        <span className="text-xs font-mono font-bold text-emerald-700 shrink-0">
                          {formattedQty} {ing.unit}
                        </span>
                      </div>
                      <span className="inline-block text-[10px] uppercase font-bold text-stone-400 mt-0.5">
                        {ing.category}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Cooking Steps with Timers */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-600" />
                <h3 className="font-serif text-base font-bold text-stone-900">
                  Mga Hakbang sa Pagluluto
                </h3>
              </div>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                {stepsDoneCount}/{totalSteps} Tapos ({stepsProgressPercent}%)
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${stepsProgressPercent}%` }}
              />
            </div>

            {/* Steps List */}
            <div className="space-y-4">
              {recipe.instructions.map((step, idx) => {
                const isDone = !!completedSteps[idx];
                const detectedMins = extractMinutes(step);
                const isStepTimerActive = activeStepTimerIndex === idx && timerSecondsLeft !== null && timerSecondsLeft > 0;

                return (
                  <div
                    key={idx}
                    className={`rounded-2xl border p-4 transition-all ${
                      isDone
                        ? 'bg-emerald-50/60 border-emerald-200 text-stone-600'
                        : isStepTimerActive
                        ? 'bg-amber-50/70 border-amber-300 ring-2 ring-amber-400/40'
                        : 'bg-stone-50/60 hover:bg-stone-50 border-stone-200 text-stone-900'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={isDone}
                        readOnly
                        aria-label={`Tapos na ang hakbang ${idx + 1}`}
                      />
                      <button
                        onClick={() => setCompletedSteps((prev) => ({ ...prev, [idx]: !prev[idx] }))}
                        type="button"
                        className="mt-0.5 cursor-pointer focus:outline-none"
                        aria-label={`Mark step ${idx + 1} as ${isDone ? 'incomplete' : 'complete'}`}
                      >
                        {isDone ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-stone-400 flex items-center justify-center text-[10px] font-bold text-stone-600 hover:border-emerald-600">
                            {idx + 1}
                          </div>
                        )}
                      </button>

                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                            Hakbang {idx + 1}
                          </span>
                          {isDone && (
                            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                              Tapos Na
                            </span>
                          )}
                        </div>

                        <p className={`text-sm leading-relaxed ${isDone ? 'line-through text-stone-500' : 'text-stone-800'}`}>
                          {step}
                        </p>

                        {/* Interactive Countdown Timer Button on Step */}
                        {detectedMins && (
                          <div className="pt-2 flex flex-wrap items-center gap-2">
                            <button
                              onClick={() => startStepTimer(idx, detectedMins)}
                              type="button"
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                isStepTimerActive
                                  ? 'bg-amber-500 text-stone-950 animate-pulse'
                                  : 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-200'
                              }`}
                            >
                              <Clock className="w-3.5 h-3.5 text-amber-700" />
                              <span>{isStepTimerActive ? 'Aktibong Timer' : `Simulan ang ${detectedMins} Minuto Timer`}</span>
                            </button>

                            <button
                              onClick={() => startStepTimer(idx, 5)}
                              type="button"
                              className="px-2 py-1 rounded-lg text-[11px] font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700"
                            >
                              5m
                            </button>
                            <button
                              onClick={() => startStepTimer(idx, 10)}
                              type="button"
                              className="px-2 py-1 rounded-lg text-[11px] font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700"
                            >
                              10m
                            </button>
                            <button
                              onClick={() => startStepTimer(idx, 20)}
                              type="button"
                              className="px-2 py-1 rounded-lg text-[11px] font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700"
                            >
                              20m
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Lihim ng Kusinero Callout */}
          {recipe.chefTips && recipe.chefTips.length > 0 && (
            <div className="bg-amber-50 rounded-3xl p-5 border border-amber-200/80 shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-900">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Lihim ng Kusinero (Tips sa Pagluluto)</span>
              </div>
              <ul className="space-y-1.5 text-xs text-amber-950 leading-relaxed list-disc list-inside">
                {recipe.chefTips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
