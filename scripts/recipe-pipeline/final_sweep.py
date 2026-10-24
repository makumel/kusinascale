"""
Identifies all remaining un-ingested recipes from Google Drive and extracts them.
"""

import os
import sys
import json
import time

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

from drive_scanner import get_subfolders, get_folder_files, CATEGORY_MAP
from image_processor import process_recipe_media, ensure_output_dir
from recipe_knowledge import get_recipe_data, slugify
from catalog_sync import load_existing_recipe_ids, append_recipes_to_catalog

def sweep_all_remaining():
    print("=" * 65)
    print("🏁 FINAL COMPLETION SWEEP: INGESTING ALL REMAINING RECIPES")
    print("=" * 65)

    existing_ids = load_existing_recipe_ids()
    print(f"[*] Currently verified in catalog: {len(existing_ids)}")

    subfolders = get_subfolders()
    print(f"[*] Discovered {len(subfolders)} folders in Google Drive.")

    remaining_items = []
    for f in subfolders:
        f_name = f["name"]
        f_id = f["id"]
        f_cat = f.get("category", "carinderia")

        files = get_folder_files(f_id, f_name)
        for item in files:
            slug = slugify(item["title"])
            if slug not in existing_ids:
                remaining_items.append({
                    "item": item,
                    "folder_name": f_name,
                    "folder_category": f_cat,
                    "slug": slug
                })

    print(f"\n[*] Exact remaining recipes in Google Drive: {len(remaining_items)}")

    if not remaining_items:
        print("[🎉] 100% of all recipes from Google Drive are already ingested!")
        return 0

    processed_new = []
    for idx, rem in enumerate(remaining_items):
        item = rem["item"]
        f_name = rem["folder_name"]
        f_cat = rem["folder_category"]
        slug = rem["slug"]

        print(f"\n[{idx+1}/{len(remaining_items)}] Processing: {item['title']} (Folder: {f_name})")
        media_url = process_recipe_media(item["id"], item["title"], slug)
        if not media_url:
            media_url = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000&auto=format&fit=crop"

        recipe_obj = get_recipe_data(item["filename"], f_name, f_cat)
        recipe_obj["imageUrl"] = media_url

        processed_new.append(recipe_obj)
        existing_ids.add(slug)
        print(f"   [OK] Recipe ready: {recipe_obj['name']} -> {media_url}")

    print(f"\n[*] Appending final {len(processed_new)} recipes to catalog...")
    added = append_recipes_to_catalog(processed_new)
    print(f"[OK] Appended {added} recipes.")

    # Run consolidation / catalog count
    import subprocess
    consolidator = os.path.abspath(os.path.join(os.path.dirname(__file__), "consolidate_batches.py"))
    subprocess.run([sys.executable, consolidator], shell=True)

if __name__ == "__main__":
    sweep_all_remaining()
