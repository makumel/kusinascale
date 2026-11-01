import os
import sys
import subprocess
import json
from PIL import Image

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
CACHE_DIR = os.path.join(BASE_DIR, "scripts", "recipe-pipeline", "drive_cache")
PUBLIC_RECIPES = os.path.join(BASE_DIR, "public", "recipes")
INDRA_BIN = r"D:\tools\indra-ocr\venv\Scripts\indra-ocr.exe"

targets = [
    {
        "src": "beef_caldereta_carinderia.png",
        "dest": "beef-caldereta-fiesta.jpg",
        "alias": "caldereta.jpg",
        "crop": (0.45, 0.08, 0.81, 0.28) # (left, top, right, bottom)
    },
    {
        "src": "chicken_adobo_carinderia.png",
        "dest": "chicken-adobo-classic.jpg",
        "alias": "adobo.jpg",
        "crop": (0.45, 0.08, 0.81, 0.28)
    }
]

for t in targets:
    src_p = os.path.join(CACHE_DIR, t["src"])
    im = Image.open(src_p).convert("RGB")
    W, H = im.size
    
    cl, ct, cr, cb = t["crop"]
    box = (int(cl * W), int(ct * H), int(cr * W), int(cb * H))
    cropped = im.crop(box)
    
    # Resize to standard 800x600 high-res card
    resized = cropped.resize((800, 600), Image.Resampling.LANCZOS)
    
    dest_p = os.path.join(PUBLIC_RECIPES, t["dest"])
    resized.save(dest_p, "JPEG", quality=92)
    print(f"Saved {dest_p} ({os.path.getsize(dest_p) / 1024:.1f} KB)")
    
    if t.get("alias"):
        alias_p = os.path.join(PUBLIC_RECIPES, t["alias"])
        resized.save(alias_p, "JPEG", quality=92)
        print(f"Saved alias {alias_p} ({os.path.getsize(alias_p) / 1024:.1f} KB)")

    # Test with Indra OCR
    res = subprocess.run([INDRA_BIN, dest_p, "--format", "json"], capture_output=True, text=True)
    try:
        data = json.loads(res.stdout)
        lines = [l for l in data.get("lines", []) if l.get("conf", 0) >= 0.4]
        print(f"Indra OCR scan on {t['dest']}: {len(lines)} text lines detected.")
        for l in lines:
            print(f"   Detected text: '{l['text']}' (conf: {l['conf']:.2f})")
    except Exception as e:
        print(f"OCR parse error: {e}")
