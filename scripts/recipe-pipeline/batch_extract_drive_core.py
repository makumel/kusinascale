import json
import os
import re
import urllib.request
import io
from PIL import Image, ImageOps, ImageEnhance
import sys

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
PUBLIC_RECIPES = os.path.join(BASE_DIR, "public", "recipes")

with open(os.path.join(BASE_DIR, "scripts/recipe-pipeline/drive_inventory.json"), "r", encoding="utf-8") as f:
    drive_data = json.load(f)

drive_files = drive_data["files"]

# Key Filipino classic dishes to pull directly from Drive
CORE_DISHES = [
    {"name": "Pork Sinigang", "query": "sinigang", "slug": "pork-sinigang-sampaloc.jpg"},
    {"name": "Pork Sisig", "query": "sisig", "slug": "pork-sisig-kapampangan.jpg"},
    {"name": "Bicol Express", "query": "bicol express", "slug": "bicol-express-classic.jpg"},
    {"name": "Pork Menudo", "query": "menudo", "slug": "pork-menudo-kapampangan.jpg"},
    {"name": "Crispy Dinuguan", "query": "dinuguan", "slug": "crispy-pork-dinuguan.jpg"},
    {"name": "Bulalo Especial", "query": "bulalo", "slug": "special-bulalo-batangas.jpg"},
    {"name": "Pinakbet", "query": "pinakbet", "slug": "ilocano-pinakbet-bagnet.jpg"},
    {"name": "Laing", "query": "laing", "slug": "bicol-laing-creamy.jpg"},
    {"name": "Lumpiang Shanghai", "query": "lumpia", "slug": "lumpiang-shanghai-crispy.jpg"},
    {"name": "Pancit Canton", "query": "pancit canton", "slug": "pancit-canton-special.jpg"},
    {"name": "Chicken Inasal", "query": "inasal", "slug": "chicken-inasal-bacolod.jpg"},
    {"name": "Lechon Kawali", "query": "lechon kawali", "slug": "lechon-kawali-crispy.jpg"},
]

def crop_food_from_sheet(sheet_img):
    w, h = sheet_img.size
    # Precision inward crop avoiding top-right "House of Food" and bottom-right "Carinderia Approved"
    box = (int(w * 0.44), int(h * 0.105), int(w * 0.83), int(h * 0.31))
    dish = sheet_img.crop(box)
    
    # Fit to 800x600 cover
    dish_fit = ImageOps.fit(dish, (800, 600), method=Image.Resampling.LANCZOS, centering=(0.5, 0.5))
    
    # Slight color/contrast enhancement
    enhancer = ImageEnhance.Color(dish_fit)
    dish_fit = enhancer.enhance(1.06)
    sharpener = ImageEnhance.Sharpness(dish_fit)
    dish_fit = sharpener.enhance(1.08)
    return dish_fit

print("Extracting authentic food images from Google Drive sheets...")
success_count = 0

for item in CORE_DISHES:
    target_q = item["query"]
    slug = item["slug"]
    
    # Find matching Drive file
    match = None
    for df in drive_files:
        if target_q in df["title"].lower():
            match = df
            break
            
    if not match:
        print(f"[MISSING IN DRIVE]: {item['name']} (query: {target_q})")
        continue
        
    print(f"\n[Processing]: {item['name']} -> Drive File: '{match['title']}' ({match['folder_name']})")
    try:
        url = f"https://drive.google.com/uc?id={match['file_id']}&export=download"
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=25) as resp:
            data = resp.read()
            
        sheet = Image.open(io.BytesIO(data)).convert("RGB")
        clean_food = crop_food_from_sheet(sheet)
        
        out_path = os.path.join(PUBLIC_RECIPES, slug)
        clean_food.save(out_path, "JPEG", quality=95, optimize=True)
        print(f"  [SAVED AUTHENTIC DISH]: {out_path} (800x600, {round(os.path.getsize(out_path)/1024, 1)} KB)")
        success_count += 1
    except Exception as e:
        print(f"  [ERROR]: {e}")

print(f"\n[DONE]: Successfully extracted {success_count}/{len(CORE_DISHES)} authentic dish images directly from Google Drive!")
