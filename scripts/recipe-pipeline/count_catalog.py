import re
import os
import sys

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

recipes_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "src", "data", "recipes.ts"))
public_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "public"))

with open(recipes_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

recipes = []
current = {}
in_ingredients = False

for line in lines:
    stripped = line.strip()
    
    # Track when we are inside ingredients array to avoid grabbing ingredient categories
    if "ingredients: [" in line:
        in_ingredients = True
    elif in_ingredients and line.strip().startswith("],"):
        in_ingredients = False
        
    if not in_ingredients:
        # Match top-level recipe fields
        m_id = re.match(r"^id:\s*['\"]([^'\"]+)['\"]", stripped)
        if m_id:
            if current and "id" in current:
                recipes.append(current)
            current = {"id": m_id.group(1)}
            continue
            
        m_name = re.match(r"^name:\s*['\"]([^'\"]+)['\"]", stripped)
        if m_name and current:
            current["name"] = m_name.group(1)
            continue
            
        m_cat = re.match(r"^category:\s*['\"]([^'\"]+)['\"]", stripped)
        if m_cat and current and "category" not in current:
            current["category"] = m_cat.group(1)
            continue
            
        m_img = re.match(r"^imageUrl:\s*['\"]([^'\"]*)['\"]", stripped)
        if m_img and current:
            current["imageUrl"] = m_img.group(1)
            continue

if current and "id" in current:
    recipes.append(current)

print(f"Total verified recipes parsed: {len(recipes)}")

# Now tally by category and image status
CATEGORIES_DISPLAY = {
    "carinderia": "Carinderia Bestsellers",
    "asian": "Top Asian Favorites",
    "western": "Western & Italian",
    "desserts": "Palamig & Desserts",
    "tipid": "Tipid 15-Min Meals"
}

by_category = {}
for cat_id in CATEGORIES_DISPLAY.keys():
    by_category[cat_id] = {
        "name": CATEGORIES_DISPLAY[cat_id],
        "total": 0,
        "with_image": 0,
        "without_image": 0,
        "local_image": 0,
        "web_image": 0
    }

for r in recipes:
    cat = r.get("category", "carinderia")
    if cat not in by_category:
        by_category[cat] = {
            "name": cat,
            "total": 0,
            "with_image": 0,
            "without_image": 0,
            "local_image": 0,
            "web_image": 0
        }
    
    by_category[cat]["total"] += 1
    img = r.get("imageUrl", "").strip()
    
    has_img = False
    if img.startswith("/recipes/"):
        disk_file = os.path.join(public_dir, img.lstrip("/"))
        if os.path.exists(disk_file) and os.path.getsize(disk_file) > 1000:
            has_img = True
            by_category[cat]["local_image"] += 1
    elif img.startswith("http"):
        has_img = True
        by_category[cat]["web_image"] += 1
        
    if has_img:
        by_category[cat]["with_image"] += 1
    else:
        by_category[cat]["without_image"] += 1

print("\n" + "=" * 65)
print("RECIPE & IMAGE INVENTORY REPORT (APP CATALOG)")
print("=" * 65)

total_all = 0
total_with_all = 0
total_without_all = 0

for cat_id, data in by_category.items():
    total_all += data["total"]
    total_with_all += data["with_image"]
    total_without_all += data["without_image"]
    print(f"• {data['name']} ({cat_id}):")
    print(f"    - With Images: {data['with_image']}/{data['total']} (Local: {data['local_image']}, Web: {data['web_image']})")
    print(f"    - Without Images: {data['without_image']}/{data['total']}")

print("-" * 65)
print(f"GRAND TOTAL: {total_with_all}/{total_all} with images ({total_without_all}/{total_all} without images)")
print("=" * 65)
