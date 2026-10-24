"""
Consolidator for KusinaScale Multi-Lane Recipe Pipeline
Merges all lane JSON files into src/data/recipes.ts, computes statistics, and validates build.
"""

import os
import sys
import json
import subprocess

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

from catalog_sync import append_recipes_to_catalog, load_existing_recipe_ids

DIST_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "dist-recipes"))

def consolidate_all_lanes():
    print("=" * 65)
    print("🔄 CONSOLIDATING RECIPES FROM ALL PARALLEL LANES")
    print("=" * 65)

    if not os.path.exists(DIST_DIR):
        print(f"[!] No dist-recipes directory found at {DIST_DIR}")
        return 0

    all_lane_recipes = []
    seen_ids = set()

    for fname in os.listdir(DIST_DIR):
        if fname.endswith(".json") and fname.startswith("lane_"):
            fpath = os.path.join(DIST_DIR, fname)
            try:
                with open(fpath, "r", encoding="utf-8") as f:
                    lane_items = json.load(f)
                    print(f"[*] Loaded {len(lane_items)} recipes from {fname}")
                    for item in lane_items:
                        if item["id"] not in seen_ids:
                            all_lane_recipes.append(item)
                            seen_ids.add(item["id"])
            except Exception as e:
                print(f"[!] Error reading {fname}: {e}")

    print(f"[*] Total unique recipes aggregated from all lanes: {len(all_lane_recipes)}")

    # Append to src/data/recipes.ts
    added = append_recipes_to_catalog(all_lane_recipes)
    print(f"[OK] Appended {added} new recipes to src/data/recipes.ts")

    # Run count report
    print("\n" + "=" * 65)
    print("📊 CURRENT RUNTIME INVENTORY REPORT")
    print("=" * 65)
    counter_script = os.path.abspath(os.path.join(os.path.dirname(__file__), "count_catalog.py"))
    subprocess.run([sys.executable, counter_script])

    # Run build check
    print("\n[*] Verifying TypeScript build integrity...")
    try:
        subprocess.run(["npm.cmd", "run", "build"], capture_output=True, text=True, check=True, shell=True)
        print("[OK] Production build check passed! 0 errors.")
    except Exception as e:
        print(f"[!] Build check error: {e}")

    return added

if __name__ == "__main__":
    consolidate_all_lanes()
