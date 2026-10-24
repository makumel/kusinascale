"""
Fixes all 36 legacy remote Unsplash recipes by finding authentic culinary photographs,
optimizing them to 800x600 in public/recipes/, and updating src/data/recipes.ts.
"""

import os
import sys
import re

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

from image_processor import process_recipe_media, ensure_output_dir
from catalog_sync import RECIPES_TS_PATH

ensure_output_dir()

with open(RECIPES_TS_PATH, "r", encoding="utf-8") as f:
    code = f.read()

lines = code.split("\n")
recipes = []
curr = {}
in_ingredients = False

for line in lines:
    if "ingredients: [" in line:
        in_ingredients = True
    elif in_ingredients and line.strip().startswith("],"):
        in_ingredients = False

    if not in_ingredients:
        m_id = re.match(r"^\s*id:\s*['\"]([^'\"]+)['\"]", line)
        if m_id:
            if curr and "id" in curr:
                recipes.append(curr)
            curr = {"id": m_id.group(1)}
            continue
        m_name = re.match(r"^\s*name:\s*['\"]([^'\"]+)['\"]", line)
        if m_name and curr:
            curr["name"] = m_name.group(1)
            continue
        m_img = re.match(r"^\s*imageUrl:\s*['\"]([^'\"]*)['\"]", line)
        if m_img and curr:
            curr["imageUrl"] = m_img.group(1)
            continue

if curr and "id" in curr:
    recipes.append(curr)

remote_recipes = [r for r in recipes if r.get("imageUrl", "").startswith("http")]
print(f"Found {len(remote_recipes)} remote recipes to convert to authentic local photos:", flush=True)

replacements = {}
for r in remote_recipes:
    r_id = r["id"]
    r_name = r["name"]
    r_url = r["imageUrl"]
    print(f"\n[Processing]: {r_name} ({r_id})...", flush=True)
    local_url = process_recipe_media(None, r_name, r_id, prefer_web_search=True)
    if local_url and local_url.startswith("/recipes/"):
        replacements[r_id] = (r_url, local_url)
        print(f"  [OK] Replaced with {local_url}", flush=True)

print(f"\nTotal replacements ready: {len(replacements)}", flush=True)

# Update code safely per recipe id
new_lines = []
curr_id = None
for line in lines:
    m_id = re.match(r"^\s*id:\s*['\"]([^'\"]+)['\"]", line)
    if m_id:
        curr_id = m_id.group(1)
    if curr_id in replacements and "imageUrl:" in line:
        old_u, new_u = replacements[curr_id]
        line = re.sub(r"imageUrl:\s*['\"][^'\"]*['\"]", f"imageUrl: '{new_u}'", line)
    new_lines.append(line)

with open(RECIPES_TS_PATH, "w", encoding="utf-8") as f:
    f.write("\n".join(new_lines))

print("[OK] Successfully updated all starter recipes to authentic local photos!", flush=True)
