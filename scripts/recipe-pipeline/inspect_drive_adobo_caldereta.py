import os
import sys
import json
import urllib.request
from PIL import Image

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
CACHE_DIR = os.path.join(BASE_DIR, "scripts", "recipe-pipeline", "drive_cache")
os.makedirs(CACHE_DIR, exist_ok=True)

test_files = [
    {"name": "beef_caldereta_carinderia", "id": "1xgAClM_uoPyBNxzRlA59aO0gO3Y-krs1"},
    {"name": "caldereta_beef_folder", "id": "1Wm4f77b4XLoCWE4WTBzE8A43ciRaDT2g"},
    {"name": "chicken_adobo_carinderia", "id": "1KF8_NGC75iz9GixeAphOoMtreVHNC1t_"},
    {"name": "adobo_chicken_folder", "id": "1nF3QlriVinDulgLJfW5GIQZG45NxM5Xl"}
]

for item in test_files:
    out_path = os.path.join(CACHE_DIR, f"{item['name']}.png")
    if not os.path.exists(out_path):
        url = f"https://drive.google.com/uc?export=download&id={item['id']}"
        print(f"Downloading {item['name']} ({item['id']})...")
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req) as resp, open(out_path, "wb") as f:
            f.write(resp.read())
    
    im = Image.open(out_path)
    print(f"{item['name']}: size={im.size}, mode={im.mode}")
