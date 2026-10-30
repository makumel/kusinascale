import json
import os
import re
import sys

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

with open("scripts/recipe-pipeline/recipes_dump.json", "r", encoding="utf-8") as f:
    recipes = json.load(f)

with open("scripts/recipe-pipeline/drive_inventory.json", "r", encoding="utf-8") as f:
    drive_data = json.load(f)

drive_files = drive_data["files"]

print(f"Total recipes: {len(recipes)}")
print(f"Total Drive files: {len(drive_files)}")

# Normalize titles for matching
def clean_str(s):
    s = s.lower()
    s = re.sub(r'\.(png|jpg|jpeg|webp)$', '', s)
    s = re.sub(r'[^a-z0-9]+', ' ', s).strip()
    return s

drive_by_clean = {clean_str(df["title"]): df for df in drive_files}

matched = 0
unmatched = []

for r in recipes:
    r_name_clean = clean_str(r["name"])
    r_id_clean = clean_str(r["id"])
    
    found = None
    if r_name_clean in drive_by_clean:
        found = drive_by_clean[r_name_clean]
    elif r_id_clean in drive_by_clean:
        found = drive_by_clean[r_id_clean]
    else:
        # Substring search
        for d_title, df in drive_by_clean.items():
            if len(d_title) > 3 and (d_title in r_name_clean or r_name_clean in d_title or d_title in r_id_clean):
                found = df
                break
                
    if found:
        matched += 1
    else:
        unmatched.append((r["id"], r["name"]))

print(f"\nExact & High-Confidence Matches: {matched}/{len(recipes)} ({round(matched/len(recipes)*100, 1)}%)")
print(f"Unmatched: {len(unmatched)}")
if unmatched[:10]:
    print("Sample unmatched:")
    for uid, uname in unmatched[:10]:
        print(f"  • {uname} ({uid})")
