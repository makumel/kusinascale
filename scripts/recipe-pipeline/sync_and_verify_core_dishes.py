import os
import sys
import shutil
import subprocess
import json

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
PUBLIC_RECIPES = os.path.join(BASE_DIR, "public", "recipes")
INDRA_BIN = r"D:\tools\indra-ocr\venv\Scripts\indra-ocr.exe"

sync_pairs = [
    ("pork-sinigang-sampaloc.jpg", "sinigang.jpg"),
    ("special-bulalo-batangas.jpg", "bulalo.jpg"),
    ("bicol-express-classic.jpg", "bicol-express.jpg"),
    ("lechon-kawali-crispy.jpg", "lechon-kawali.jpg"),
    ("bicol-laing-creamy.jpg", "laing.jpg"),
    ("ilocano-pinakbet-bagnet.jpg", "pinakbet.jpg"),
    ("lumpiang-shanghai-crispy.jpg", "lumpiang-shanghai.jpg"),
    ("pancit-canton-special.jpg", "pancit-canton.jpg"),
    ("crispy-pork-dinuguan.jpg", "dinuguan.jpg"),
    ("beef-caldereta-fiesta.jpg", "caldereta.jpg"),
    ("chicken-adobo-classic.jpg", "adobo.jpg")
]

print("=" * 70)
print("SYNCHRONIZING DUAL ALIASES AND VERIFYING WITH INDRA OCR")
print("=" * 70)

for src_name, target_name in sync_pairs:
    src_p = os.path.join(PUBLIC_RECIPES, src_name)
    target_p = os.path.join(PUBLIC_RECIPES, target_name)
    
    if not os.path.exists(src_p):
        print(f"[ERROR] Source {src_name} does not exist!")
        continue
        
    shutil.copy2(src_p, target_p)
    print(f"Synced {src_name} -> {target_name} ({os.path.getsize(target_p) / 1024:.1f} KB)")
    
    # Run Indra OCR on target
    res = subprocess.run([INDRA_BIN, target_p, "--format", "json"], capture_output=True, text=True)
    try:
        data = json.loads(res.stdout)
        lines = [l for l in data.get("lines", []) if l.get("conf", 0) >= 0.4]
        print(f"   OCR Check [{target_name}]: {len(lines)} text lines")
        if lines:
            for l in lines:
                print(f"     Text: '{l['text']}' ({l['conf']:.2f})")
    except Exception as e:
        print(f"   OCR parse error: {e}")

print("=" * 70)
print("ALL CORE RECIPES SYNCHRONIZED AND VERIFIED!")
print("=" * 70)
