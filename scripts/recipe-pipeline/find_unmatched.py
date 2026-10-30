import json
import re

with open("scripts/recipe-pipeline/drive_inventory.json", "r", encoding="utf-8") as f:
    drive_data = json.load(f)

drive_files = drive_data["files"]

queries = ["lasagna", "margherita", "sardinas", "bulgogi", "curry", "sweet", "macaroni", "cordon", "salmon", "graham", "coffee", "tea"]

for q in queries:
    matches = [df for df in drive_files if q in df["title"].lower()]
    print(f"Query '{q}': {len(matches)} matches")
    for m in matches[:3]:
        print(f"   [{m['folder_name']}] {m['title']} (ID: {m['file_id']})")
