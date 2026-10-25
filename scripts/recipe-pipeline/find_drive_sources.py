import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__)))
from drive_scanner import get_subfolders, get_folder_files

folders = get_subfolders()
print(f"Total folders discovered: {len(folders)}")

target_terms = ["caldereta", "adobo", "sisig", "kare-kare", "sinigang", "bicol express", "menudo"]

found = []
for folder in folders:
    f_name = folder["name"]
    files = get_folder_files(folder["id"], f_name)
    for f in files:
        title = f["title"].lower()
        if any(term in title for term in target_terms):
            print(f"MATCH: [{f_name}] '{f['title']}' -> ID: {f['id']}")
            found.append({
                "folder": f_name,
                "title": f["title"],
                "file_id": f["id"],
                "filename": f["filename"]
            })

print(f"\nTotal matches found: {len(found)}")
