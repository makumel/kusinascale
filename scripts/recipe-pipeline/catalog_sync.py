"""
Catalog Synchronizer for KusinaScale
Appends extracted and processed recipes into src/data/recipes.ts safely.
"""

import os
import re
import json

RECIPES_TS_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "src", "data", "recipes.ts"))

def load_existing_recipe_ids():
    if not os.path.exists(RECIPES_TS_PATH):
        return set()
    with open(RECIPES_TS_PATH, "r", encoding="utf-8") as f:
        content = f.read()
    ids = set(re.findall(r"id:\s*['\"]([^'\"]+)['\"]", content))
    return ids

def format_recipe_to_ts(recipe):
    """
    Formats a recipe dictionary into a type-safe TypeScript object block.
    """
    ingredients_lines = []
    for idx, ing in enumerate(recipe["ingredients"]):
        ing_id = f"ing-{recipe['id'][:6]}-{idx + 1}"
        ingredients_lines.append(
            f"      {{ id: '{ing_id}', name: {json.dumps(ing['name'])}, quantity: {ing['quantity']}, unit: '{ing['unit']}', baseCost: {ing['baseCost']}, unitCostDescription: '{ing['unitCostDescription']}', category: '{ing['category']}' }},"
        )
    ingredients_str = "\n".join(ingredients_lines)

    instructions_lines = [f"      {json.dumps(step)}," for step in recipe["instructions"]]
    instructions_str = "\n".join(instructions_lines)

    tips_lines = [f"      {json.dumps(tip)}," for tip in recipe.get("chefTips", [])]
    tips_str = "\n".join(tips_lines)

    ts_block = f"""  {{
    id: '{recipe['id']}',
    name: {json.dumps(recipe['name'])},
    tagline: {json.dumps(recipe['tagline'])},
    category: '{recipe['category']}',
    categoryLabel: '{recipe['categoryLabel']}',
    baseServings: {recipe['baseServings']},
    prepTime: '{recipe['prepTime']}',
    cookTime: '{recipe['cookTime']}',
    difficulty: '{recipe['difficulty']}',
    imageUrl: '{recipe['imageUrl']}',
    description: {json.dumps(recipe['description'])},
    defaultOverheadPercent: {recipe['defaultOverheadPercent']},
    defaultPackagingPerServing: {recipe['defaultPackagingPerServing']},
    defaultTargetMargin: {recipe['defaultTargetMargin']},
    marketNotes: {json.dumps(recipe['marketNotes'])},
    ingredients: [
{ingredients_str}
    ],
    instructions: [
{instructions_str}
    ],
    chefTips: [
{tips_str}
    ],
  }},"""
    return ts_block

def append_recipes_to_catalog(new_recipes):
    if not os.path.exists(RECIPES_TS_PATH):
        print(f"[Error]: {RECIPES_TS_PATH} does not exist.")
        return 0

    with open(RECIPES_TS_PATH, "r", encoding="utf-8") as f:
        content = f.read()

    existing_ids = load_existing_recipe_ids()
    to_add = [r for r in new_recipes if r["id"] not in existing_ids]

    if not to_add:
        print("[Notice]: All recipes already exist in catalog.")
        return 0

    print(f"[Catalog Sync]: Adding {len(to_add)} new recipes to {RECIPES_TS_PATH}...")

    # Find the closing bracket of `export const RECIPES: Recipe[] = [...]`
    # We locate the last `];`
    last_bracket_pos = content.rfind("];")
    if last_bracket_pos == -1:
        print("[Error]: Could not locate closing '];' in recipes.ts")
        return 0

    formatted_blocks = "\n\n".join([format_recipe_to_ts(r) for r in to_add])
    new_content = content[:last_bracket_pos] + "\n" + formatted_blocks + "\n" + content[last_bracket_pos:]

    with open(RECIPES_TS_PATH, "w", encoding="utf-8") as f:
        f.write(new_content)

    print(f"[Success]: Appended {len(to_add)} recipes to catalog.")
    return len(to_add)

if __name__ == "__main__":
    existing = load_existing_recipe_ids()
    print(f"Current catalog recipes count: {len(existing)}")
