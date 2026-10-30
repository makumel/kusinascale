import json
import urllib.request
from PIL import Image
import io
import sys

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

with open("scripts/recipe-pipeline/drive_inventory.json", "r", encoding="utf-8") as f:
    data = json.load(f)

samples = [
    data["files"][1],   # Carinderia pinoy
    data["files"][55],  # Chinese Beef
    data["files"][120], # Filipino Dessert
    data["files"][200], # Italian pizza
]

for s in samples:
    print(f"Folder: {s['folder_name']} | Title: {s['title']} | ID: {s['file_id']}")
    try:
        url = f"https://drive.google.com/uc?id={s['file_id']}&export=download"
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=15) as resp:
            raw = resp.read()
        img = Image.open(io.BytesIO(raw))
        print(f"   -> Image format: {img.format}, Size: {img.size}")
    except Exception as e:
        print(f"   -> Error: {e}")
