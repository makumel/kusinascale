import os
import sys

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
TARGET = os.path.join(BASE_DIR, "src", "components", "CookingMode.tsx")

with open(TARGET, "r", encoding="utf-8") as f:
    code = f.read()

# 1. Insert Wake Lock state and lifecycle inside CookingMode
anchor_state = "  const [activeStepTimerIndex, setActiveStepTimerIndex] = useState<number | null>(null);"
wake_lock_code = """  const [activeStepTimerIndex, setActiveStepTimerIndex] = useState<number | null>(null);

  // Screen Wake Lock API with visibility re-acquisition guard
  const [isWakeLocked, setIsWakeLocked] = useState<boolean>(false);
  const wakeLockRef = useRef<any>(null);

  useEffect(() => {
    let isMounted = true;

    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator && (navigator as any).wakeLock) {
          wakeLockRef.current = await (navigator as any).wakeLock.request('screen');
          if (isMounted) setIsWakeLocked(true);
          wakeLockRef.current.addEventListener('release', () => {
            if (isMounted) setIsWakeLocked(false);
          });
        }
      } catch (err) {
        console.warn('Screen WakeLock failed:', err);
        if (isMounted) setIsWakeLocked(false);
      }
    };

    requestWakeLock();

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        requestWakeLock();
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      isMounted = false;
      document.removeEventListener('visibilitychange', handleVisibility);
      if (wakeLockRef.current) {
        wakeLockRef.current.release().catch(() => {});
      }
    };
  }, []);"""

assert anchor_state in code, "anchor_state not found"
code = code.replace(anchor_state, wake_lock_code, 1)

# 2. Add Screen Wake Lock indicator chip in Top Header
anchor_header = """            <span className="text-xs text-white/90 font-medium">
              • {portions} Pax ({scaleMultiplier.toFixed(2)}x Multiplier)
            </span>
          </div>"""

header_with_badge = """            <span className="text-xs text-white/90 font-medium font-mono tabular-nums">
              • {portions} Pax ({scaleMultiplier.toFixed(2)}x Multiplier)
            </span>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold tracking-tight border ${
              isWakeLocked 
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/60 shadow-xs' 
                : 'bg-stone-900/60 text-stone-300 border-white/20'
            }`}>
              <span className={`w-2 h-2 rounded-full ${isWakeLocked ? 'bg-emerald-400 animate-pulse' : 'bg-stone-400'}`} />
              {isWakeLocked ? 'Screen On 🔒' : 'Screen Auto-Sleep'}
            </span>
          </div>"""

assert anchor_header in code, "anchor_header not found"
code = code.replace(anchor_header, header_with_badge, 1)

with open(TARGET, "w", encoding="utf-8") as f:
    f.write(code)

print("[SUCCESS] CookingMode.tsx updated with Screen Wake Lock and tabular-nums.")
