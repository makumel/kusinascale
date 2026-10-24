import sys
import os

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

from drive_scanner import get_subfolders, get_folder_files, CATEGORY_MAP

subfolders = get_subfolders()
print(f"Total subfolders in Google Drive: {len(subfolders)}")

category_totals = {
    "carinderia": {"name": "Carinderia Bestsellers", "files": 0, "folders": 0},
    "asian": {"name": "Top Asian Favorites", "files": 0, "folders": 0},
    "western": {"name": "Western & Italian", "files": 0, "folders": 0},
    "desserts": {"name": "Palamig & Desserts", "files": 0, "folders": 0},
    "tipid": {"name": "Tipid 15-Min Meals", "files": 0, "folders": 0}
}

total_drive_files = 0
folder_breakdowns = []

for idx, folder in enumerate(subfolders):
    f_id = folder["id"]
    f_name = folder["name"]
    f_cat = folder.get("category", "carinderia")
    if f_cat not in category_totals:
        f_cat = "carinderia"
        
    files = get_folder_files(f_id, f_name)
    count = len(files)
    total_drive_files += count
    
    category_totals[f_cat]["files"] += count
    category_totals[f_cat]["folders"] += 1
    folder_breakdowns.append((f_name, count, f_cat))
    print(f"[{idx+1}/{len(subfolders)}] {f_name}: {count} recipes ({f_cat})")

print("\n" + "=" * 65)
print("GOOGLE DRIVE REPOSITORY INVENTORY SUMMARY")
print("=" * 65)
for cat_id, data in category_totals.items():
    print(f"• {data['name']} ({cat_id}): {data['files']} total drive recipes (across {data['folders']} folders)")

print("-" * 65)
print(f"TOTAL RECIPES IN DRIVE: {total_drive_files}")
print("=" * 65)
