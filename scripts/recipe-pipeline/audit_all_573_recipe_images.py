import os
import sys
import re

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
RECIPES_TS = os.path.join(BASE_DIR, "src", "data", "recipes.ts")
PUBLIC_RECIPES = os.path.join(BASE_DIR, "public", "recipes")

with open(RECIPES_TS, "r", encoding="utf-8") as f:
    lines = f.readlines()

recipes = []
curr = {}
in_ingredients = False

for line in lines:
    stripped = line.strip()
    if "ingredients: [" in line:
        in_ingredients = True
    elif in_ingredients and stripped.startswith("],"):
        in_ingredients = False
        
    if not in_ingredients:
        m_id = re.match(r"^id:\s*['\"]([^'\"]+)['\"]", stripped)
        if m_id:
            if curr and "id" in curr:
                recipes.append(curr)
            curr = {"id": m_id.group(1)}
            continue
            
        m_name = re.match(r"^name:\s*['\"]([^'\"]+)['\"]", stripped)
        if m_name and curr:
            curr["name"] = m_name.group(1)
            continue
            
        m_img = re.match(r"^imageUrl:\s*['\"]([^'\"]*)['\"]", stripped)
        if m_img and curr:
            curr["imageUrl"] = m_img.group(1)
            continue

if curr and "id" in curr:
    recipes.append(curr)

print(f"Total recipes correctly parsed: {len(recipes)}")

# Let's check which recipes have which images
queries = ["sinigang", "bulalo", "inasal", "dinuguan", "pinakbet", "laing", "lumpia", "pancit canton", "bicol express", "lechon kawali", "sisig", "menudo", "caldereta", "adobo"]

for q in queries:
    matched_recipes = [r for r in recipes if q in r.get("name", "").lower() or q in r.get("id", "").lower()]
    print(f"\n--- QUERY: {q.upper()} ({len(matched_recipes)} recipes found) ---")
    for r in matched_recipes:
        img = r.get("imageUrl", "")
        fpath = os.path.join(PUBLIC_RECIPES, os.path.basename(img))
        exists = os.path.exists(fpath)
        size = round(os.path.getsize(fpath) / 1024, 1) if exists else 0
        print(f"  • [{r.get('id')}]: '{r.get('name')}'")
        print(f"      Image URL: {img} (Exists: {exists}, Size: {size} KB)")
