import sys
import os
import json
import re

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

sys.path.append(os.path.join(os.path.dirname(__file__)))
from drive_scanner import get_subfolders, get_folder_files, CATEGORY_MAP

subfolders = get_subfolders()
print(f"Discovered {len(subfolders)} subfolders in Google Drive.", flush=True)

all_drive_files = []
folder_summary = {}

for idx, folder in enumerate(subfolders):
    f_id = folder["id"]
    f_name = folder["name"]
    f_cat = folder.get("category", "carinderia")
    if f_cat not in CATEGORY_MAP.values():
        f_cat = "carinderia"

    files = get_folder_files(f_id, f_name)
    folder_summary[f_name] = {"count": len(files), "category": f_cat, "folder_id": f_id}
    print(f"[{idx+1}/{len(subfolders)}] {f_name}: {len(files)} files ({f_cat})", flush=True)

    for item in files:
        file_id = item["id"]
        filename = item["filename"]
        title = item["title"]
        all_drive_files.append({
            "folder_name": f_name,
            "folder_id": f_id,
            "category": f_cat,
            "file_id": file_id,
            "filename": filename,
            "title": title,
            "drive_view_url": f"https://drive.google.com/file/d/{file_id}/view?usp=sharing",
            "drive_direct_img": f"https://lh3.googleusercontent.com/d/{file_id}=s800"
        })

output_path = os.path.join(os.path.dirname(__file__), "drive_inventory.json")
with open(output_path, "w", encoding="utf-8") as f:
    json.dump({
        "total_files": len(all_drive_files),
        "total_folders": len(subfolders),
        "folders": folder_summary,
        "files": all_drive_files
    }, f, indent=2, ensure_ascii=False)

print(f"\n[SUCCESS] Saved {len(all_drive_files)} Drive items to {output_path}", flush=True)
