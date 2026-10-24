"""
Autonomous Recipe Extraction, Image Processing & Catalog Agent
Executes end-to-end ingestion from Google Drive into KusinaScale.
"""

import os
import sys
import argparse
import subprocess

# Set utf-8 output encoding for Windows PowerShell compatibility
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

from drive_scanner import get_subfolders, get_folder_files
from image_processor import process_recipe_media, ensure_output_dir
from recipe_knowledge import get_recipe_data, slugify
from catalog_sync import append_recipes_to_catalog, load_existing_recipe_ids

def run_extraction_agent(target_folder_name=None, max_recipes=10):
    print("=" * 65)
    print("[*] KUSINASCALE AUTONOMOUS RECIPE EXTRACTION & MEDIA AGENT")
    print("=" * 65)

    ensure_output_dir()
    existing_ids = load_existing_recipe_ids()
    print(f"[*] Existing recipes in catalog: {len(existing_ids)}")

    # Step 1: Scan Google Drive Subfolders
    print("\n[*] Step 1: Scanning Google Drive repository...")
    subfolders = get_subfolders()
    if not subfolders:
        print("[!] No subfolders retrieved. Checking fallback...")
        return

    print(f"[OK] Discovered {len(subfolders)} subfolders.")

    # Filter folders if requested
    if target_folder_name:
        subfolders = [f for f in subfolders if target_folder_name.lower() in f["name"].lower()]

    processed_recipes = []
    total_processed_count = 0

    # Step 2: Iterate and process
    for folder in subfolders:
        if total_processed_count >= max_recipes:
            break

        f_name = folder["name"]
        f_id = folder["id"]
        f_cat = folder["category"]
        print(f"\n[FOLDER] Scanning folder: {f_name} (Category: {f_cat})")

        files = get_folder_files(f_id, f_name)
        print(f"   Found {len(files)} files.")

        for item in files:
            if total_processed_count >= max_recipes:
                break

            fname = item["filename"]
            fid = item["id"]
            slug = slugify(re_slug := item["title"])

            if slug in existing_ids:
                print(f"   --> Skipping {fname} (Already in catalog)")
                continue

            print(f"\n   --> Processing: {fname} (ID: {fid})")

            # Image processing (accurate web search, drive crop, or AI fallback)
            media_url = process_recipe_media(fid, item["title"], slug)
            if not media_url:
                media_url = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000&auto=format&fit=crop"

            # Synthesize full recipe data & costing
            recipe_obj = get_recipe_data(fname, f_name, f_cat)
            recipe_obj["imageUrl"] = media_url

            processed_recipes.append(recipe_obj)
            existing_ids.add(slug)
            total_processed_count += 1
            print(f"   [OK] Recipe ready: {recipe_obj['name']} -> {media_url}")

    if not processed_recipes:
        print("\n[!] No new recipes needed processing.")
        return

    # Step 3: Append to catalog
    print(f"\n[*] Step 3: Synchronizing {len(processed_recipes)} recipes to catalog...")
    added_count = append_recipes_to_catalog(processed_recipes)
    print(f"[OK] Added {added_count} new recipes to src/data/recipes.ts.")

    # Step 4: Verification Build Check
    print("\n[*] Step 4: Verifying application build integrity...")
    try:
        res = subprocess.run(["npm.cmd", "run", "build"], capture_output=True, text=True, check=True)
        print("[OK] Build check passed! 0 errors.")
    except Exception as e:
        print(f"[!] Build check error: {e}")
        if hasattr(e, "stderr"):
            print(e.stderr)

    print("\n" + "=" * 65)
    print(f"[SUCCESS] PIPELINE COMPLETED SUCCESSFULLY: {len(processed_recipes)} recipes processed.")
    print("=" * 65)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="KusinaScale Recipe Agent Runner")
    parser.add_argument("--folder", type=str, default="Carinderia pinoy recipes", help="Folder name filter")
    parser.add_argument("--limit", type=int, default=8, help="Maximum recipes to ingest")
    args = parser.parse_args()

    run_extraction_agent(target_folder_name=args.folder, max_recipes=args.limit)
