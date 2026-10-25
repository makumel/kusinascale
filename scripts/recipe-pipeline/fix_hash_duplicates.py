import os
import hashlib
import urllib.request
import io
from PIL import Image, ImageOps, ImageEnhance

RECIPES_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "public", "recipes"))

# Specific unique URLs for each:
UNIQUE_FIXES = {
    # Authentic Beef Caldereta (rich red tomato beef stew with carrots and peppers)
    "beef-caldereta-fiesta.jpg": "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=900&auto=format&fit=crop",
    # Adobong Pusit (dark squid adobo)
    "adobong-pusit.jpg": "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?q=80&w=900&auto=format&fit=crop",
    # Chinese BBQ Spare Ribs (char siu sticky ribs)
    "chinese-bbq-spare-ribs.jpg": "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=950&auto=format&fit=crop",
    # Guyabano Pineapple Juice (tropical soursop + pineapple smoothie)
    "guyabano-pineapple-juice.jpg": "https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?q=80&w=900&auto=format&fit=crop",
    # Authentic Japanese Tonkotsu Ramen bowl with ajitama egg and chashu
    "japanese-tonkotsu-ramen.jpg": "https://images.unsplash.com/photo-1591814468924-caf88d1232e1?q=80&w=900&auto=format&fit=crop",
    # New England Lobster Roll with buttered toasted brioche
    "lobster-roll.jpg": "https://images.unsplash.com/photo-1559847844-5315695dadae?q=80&w=900&auto=format&fit=crop",
    # Salt & Pepper Pork Chops
    "salt-u0026-pepper-pork-chops.jpg": "https://images.unsplash.com/photo-1432139555190-58524dae6a55?q=80&w=900&auto=format&fit=crop",
    # Melon Milk Drink (creamy cantaloupe drink)
    "melon-milk-drink.jpg": "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?q=80&w=900&auto=format&fit=crop",
}

for fname, url in UNIQUE_FIXES.items():
    out_path = os.path.join(RECIPES_DIR, fname)
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    try:
        with urllib.request.urlopen(req, timeout=12) as resp:
            data = resp.read()
        img = Image.open(io.BytesIO(data)).convert("RGB")
        img_fit = ImageOps.fit(img, (800, 600), method=Image.Resampling.LANCZOS, centering=(0.5, 0.5))
        enhancer = ImageEnhance.Color(img_fit)
        img_fit = enhancer.enhance(1.06)
        sharpener = ImageEnhance.Sharpness(img_fit)
        img_fit = sharpener.enhance(1.08)
        img_fit.save(out_path, "JPEG", quality=92, optimize=True)
        print(f"[UNIQUE REPLACED]: {fname}")
    except Exception as e:
        print(f"[ERROR]: {fname} - {e}")

# Re-check duplicates
files = [f for f in os.listdir(RECIPES_DIR) if f.endswith('.jpg')]
hashes = {}
dups = []
for f in files:
    h = hashlib.md5(open(os.path.join(RECIPES_DIR, f), 'rb').read()).hexdigest()
    if h in hashes:
        dups.append((f, hashes[h]))
    else:
        hashes[h] = f

print(f"\nFinal Hash Check -> Total: {len(files)} | Unique: {len(hashes)} | Duplicates: {len(dups)}")
