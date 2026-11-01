import os
import sys
import json
import re

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
RECIPES_TS = os.path.join(BASE_DIR, "src", "data", "recipes.ts")
PUBLIC_RECIPES = os.path.join(BASE_DIR, "public", "recipes")

target_slugs = [
    "beef-caldereta-fiesta.jpg",
    "chicken-adobo-classic.jpg",
    "adobong-pusit.jpg",
    "kare-kare-bagnet.jpg",
    "bicol-express-classic.jpg",
    "bicol-laing-creamy.jpg",
    "chicken-inasal-bacolod.jpg",
    "crispy-pork-dinuguan.jpg",
    "ilocano-pinakbet-bagnet.jpg",
    "lechon-kawali-crispy.jpg",
    "lumpiang-shanghai-crispy.jpg",
    "pancit-canton-special.jpg",
    "pork-menudo-kapampangan.jpg",
    "pork-sinigang-sampaloc.jpg",
    "special-bulalo-batangas.jpg"
]

with open(RECIPES_TS, "r", encoding="utf-8") as f:
    content = f.read()

print("=" * 75)
print("AUDITING RECIPES IN RECIPES.TS VS LOCAL ASSETS")
print("=" * 75)

for slug in target_slugs:
    img_url_pattern = rf"imageUrl:\s*['\"]/recipes/{re.escape(slug)}['\"]"
    match = re.search(img_url_pattern, content)
    
    # Also find recipe name associated with this imageUrl
    recipe_name = "UNKNOWN"
    recipe_id = "UNKNOWN"
    if match:
        # Search backwards for id and name
        pos = match.start()
        chunk = content[max(0, pos-800):pos]
        id_m = re.findall(r"id:\s*['\"]([^'\"]+)['\"]", chunk)
        name_m = re.findall(r"name:\s*['\"]([^'\"]+)['\"]", chunk)
        if id_m:
            recipe_id = id_m[-1]
        if name_m:
            recipe_name = name_m[-1]
            
    fpath = os.path.join(PUBLIC_RECIPES, slug)
    exists = os.path.exists(fpath)
    size_kb = round(os.path.getsize(fpath) / 1024, 1) if exists else 0
    
    status = "LINKED & VERIFIED" if (match and exists) else "UNLINKED / MISSING"
    print(f"• [{status}] {slug}:")
    print(f"    Recipe Name: {recipe_name} (ID: {recipe_id})")
    print(f"    In recipes.ts: {'YES' if match else 'NO'} | On Disk: {'YES (' + str(size_kb) + ' KB)' if exists else 'NO'}")

print("=" * 75)
