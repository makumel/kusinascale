"""
Parallel Lane Worker for KusinaScale Recipe Extraction
Processes a specific list of Google Drive folders in an isolated worker lane.
Outputs processed recipe payloads to dist-recipes/lane_{lane_id}.json.
"""

import os
import sys
import json
import argparse
import time

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

from drive_scanner import get_subfolders, get_folder_files, CATEGORY_MAP
from image_processor import process_recipe_media, ensure_output_dir
from recipe_knowledge import get_recipe_data, slugify
from catalog_sync import load_existing_recipe_ids

DIST_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "dist-recipes"))

def ensure_dist_dir():
    os.makedirs(DIST_DIR, exist_ok=True)

def run_lane_worker(lane_id, folder_names, max_per_folder=15):
    print("=" * 60)
    print(f"[*] STARTING WORKER LANE: {lane_id.upper()}")
    print(f"[*] Target Folders: {folder_names}")
    print("=" * 60)

    ensure_output_dir()
    ensure_dist_dir()

    existing_ids = load_existing_recipe_ids()
    lane_output_file = os.path.join(DIST_DIR, f"lane_{lane_id}.json")

    # Load any already extracted recipes in this lane
    lane_recipes = []
    if os.path.exists(lane_output_file):
        try:
            with open(lane_output_file, "r", encoding="utf-8") as f:
                lane_recipes = json.load(f)
                for r in lane_recipes:
                    existing_ids.add(r["id"])
        except Exception:
            pass

    print(f"[*] Lane {lane_id} loaded {len(lane_recipes)} previously cached recipes.")

    # Get Google Drive folders
    all_subfolders = get_subfolders()
    matched_folders = [f for f in all_subfolders if any(fn.lower() in f["name"].lower() for fn in folder_names)]

    print(f"[*] Matched {len(matched_folders)} folders in Google Drive.")

    new_in_lane = 0

    for folder in matched_folders:
        f_name = folder["name"]
        f_id = folder["id"]
        f_cat = folder.get("category", "carinderia")

        print(f"\n📂 [{lane_id.upper()}] Folder: {f_name} (Category: {f_cat})")
        files = get_folder_files(f_id, f_name)
        print(f"   Discovered {len(files)} files.")

        count_in_folder = 0
        for item in files:
            if count_in_folder >= max_per_folder:
                break

            fname = item["filename"]
            fid = item["id"]
            slug = slugify(item["title"])

            if slug in existing_ids:
                continue

            print(f"   ➜ [{lane_id}] Processing: {item['title']} (ID: {fid})")

            # Image processing (web search, drive crop, or AI fallback)
            media_url = process_recipe_media(fid, item["title"], slug)
            if not media_url:
                media_url = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000&auto=format&fit=crop"

            # Synthesize full recipe data & costing
            recipe_obj = get_recipe_data(fname, f_name, f_cat)
            recipe_obj["imageUrl"] = media_url

            lane_recipes.append(recipe_obj)
            existing_ids.add(slug)
            new_in_lane += 1
            count_in_folder += 1

            # Persist incrementally to JSON so progress is never lost
            with open(lane_output_file, "w", encoding="utf-8") as f:
                json.dump(lane_recipes, f, indent=2, ensure_ascii=False)

            print(f"   [OK] Stored recipe: {recipe_obj['name']} ({new_in_lane} new in lane)")
            time.sleep(0.5)

    print("\n" + "=" * 60)
    print(f"[OK] LANE {lane_id.upper()} FINISHED: {new_in_lane} new recipes extracted.")
    print("=" * 60)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Lane Worker")
    parser.add_argument("--lane", type=str, required=True, help="Lane identifier (e.g. pork, asian, western, desserts)")
    parser.add_argument("--folders", nargs="+", required=True, help="Folder names to process")
    parser.add_argument("--limit", type=int, default=15, help="Limit per folder")
    args = parser.parse_args()

    run_lane_worker(args.lane, args.folders, max_per_folder=args.limit)
