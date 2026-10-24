import os
import urllib.request
from PIL import Image, ImageOps, ImageEnhance
import io

OUTPUT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "public", "recipes"))

STAMP_REPLACEMENTS = {
    # Authentic Adobong Pusit (black ink squid stew)
    "adobong-pusit.jpg": "https://images.unsplash.com/photo-1541544741938-0af808871cc0?q=80&w=1000&auto=format&fit=crop", # Seafood dish
    # Authentic Spaghetti alle Vongole (clam pasta)
    "spaghetti-alla-vongole.jpg": "https://images.unsplash.com/photo-1621996346565-e3d5d6281744?q=80&w=1000&auto=format&fit=crop", # Clam pasta
    # Authentic Turon (crispy banana lumpia rolls)
    "turon-with-chocolate-syrup.jpg": "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?q=80&w=1000&auto=format&fit=crop", # Fried rolls dessert
}

for fname, url in STAMP_REPLACEMENTS.items():
    out_path = os.path.join(OUTPUT_DIR, fname)
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = resp.read()
        img = Image.open(io.BytesIO(data)).convert("RGB")
        img_fit = ImageOps.fit(img, (800, 600), method=Image.Resampling.LANCZOS, centering=(0.5, 0.5))
        enhancer = ImageEnhance.Color(img_fit)
        img_fit = enhancer.enhance(1.05)
        sharpener = ImageEnhance.Sharpness(img_fit)
        img_fit = sharpener.enhance(1.08)
        img_fit.save(out_path, "JPEG", quality=92, optimize=True)
        print(f"[CLEANED STAMP]: {fname}")
    except Exception as e:
        print(f"[ERROR]: {fname} - {e}")

print("Cleaned seller stamp recipes!")
