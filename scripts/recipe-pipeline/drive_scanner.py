"""
Google Drive Scanner for KusinaScale Recipes
Extracts subfolders and file lists from the shared Google Drive repository.
"""

import urllib.request
import re
import json
import os

ROOT_FOLDER_ID = "1w11VLgUmFnqSP3VzTzQwMBSW4MMa0nK4"

# Mapping Google Drive subfolders to KusinaScale categories
CATEGORY_MAP = {
    # Carinderia / Pinoy Classics
    "Carinderia pinoy recipes": "carinderia",
    "Filipino chicken recipes": "carinderia",
    "Filipino beef recipes": "carinderia",
    "Filipino pork recipes": "carinderia",
    "Filipino seafood/fish recipes": "carinderia",
    "Filipino vegetable recipes": "carinderia",
    "Filipino(ILOCANO) recipes": "carinderia",
    "Filipino cuisine with a twist": "carinderia",
    # Asian
    "Chinese Appetizers": "asian",
    "Chinese Beef Recipes": "asian",
    "Chinese Chicken Recipes": "asian",
    "Chinese pork recipes": "asian",
    "Chinese Soups": "asian",
    "Japanese appetizers": "asian",
    "Japanese Ramen": "asian",
    "Korean Chicken recipes": "asian",
    "Thai cuisine": "asian",
    "Vietnamese recipes": "asian",
    # Western / International
    "Italian pizza": "western",
    "Italian Recipes": "western",
    "Italian seafood recipes": "western",
    "American Burgers & Sandwiches": "western",
    "Mexican tacos": "western",
    "Mexican burrito": "western",
    "France recipes": "western",
    "German recipes": "western",
    "Spanish recipes": "western",
    "Greece recipes": "western",
    "UK RECIPES": "western",
    # Desserts & Drinks
    "Filipino Dessert": "desserts",
    "Filipino drinks": "desserts",
}

def get_subfolders(root_id=ROOT_FOLDER_ID):
    url = f"https://drive.google.com/drive/folders/{root_id}"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            raw = resp.read().decode("utf-8", errors="ignore")
    except Exception as e:
        print(f"[Error fetching root folder {root_id}]: {e}")
        return []

    unescaped = raw.encode().decode("unicode_escape", errors="ignore")
    items = re.findall(rf'\[\"([a-zA-Z0-9_\-]{{25,45}})\",\[\"{root_id}\"\],\"([^\"]+)\"', unescaped)

    subfolders = []
    for fid, name in items:
        clean_name = name.replace(r"\/", "/").replace(r"\u0026", "&").strip()
        cat = CATEGORY_MAP.get(clean_name, "carinderia")
        subfolders.append({
            "id": fid,
            "name": clean_name,
            "category": cat
        })
    return subfolders

def get_folder_files(folder_id, folder_name=""):
    url = f"https://drive.google.com/drive/folders/{folder_id}"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            raw = resp.read().decode("utf-8", errors="ignore")
    except Exception as e:
        print(f"[Error fetching folder {folder_name} ({folder_id})]: {e}")
        return []

    unescaped = raw.encode().decode("unicode_escape", errors="ignore")
    files = re.findall(rf'\[\"([a-zA-Z0-9_\-]{{25,45}})\",\[\"{folder_id}\"\],\"([^\"]+)\"', unescaped)

    results = []
    for fid, fname in files:
        clean_fname = fname.strip()
        # Clean title removing extensions
        base_title = re.sub(r'\.(png|jpg|jpeg|pdf|webp)$', '', clean_fname, flags=re.I).strip()
        results.append({
            "id": fid,
            "filename": clean_fname,
            "title": base_title,
            "folder_id": folder_id,
            "folder_name": folder_name
        })
    return results

if __name__ == "__main__":
    folders = get_subfolders()
    print(f"Discovered {len(folders)} subfolders.")
    for f in folders[:5]:
        print(f" - {f['name']} [{f['category']}] -> {f['id']}")
