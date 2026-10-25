"""
Precision Food-Plate Cropper for Google Drive Recipe Sheets.
Extracts the authentic dish (Caldereta, Adobo, Adobong Pusit, Kare-Kare)
while cleanly stripping out all outer badges, text cards, and seller stamps.
"""

import os
import sys
import urllib.request
import io
from PIL import Image, ImageOps, ImageEnhance

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

RECIPES_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "public", "recipes"))

TARGETS = [
    {
        "name": "Beef Caldereta",
        "slug": "beef-caldereta-fiesta.jpg",
        "drive_id": "1xgAClM_uoPyBNxzRlA59aO0gO3Y-krs1",
        # Food plate is located in the upper-right section.
        # Outer badges are at the top-left (w*0.33) and top header (h*0.015)
        # Tight crop: (w*0.44, h*0.06, w*0.92, h*0.35)
        "crop_box": (0.44, 0.06, 0.92, 0.35)
    },
    {
        "name": "Chicken Adobo",
        "slug": "chicken-adobo-classic.jpg",
        "drive_id": "1KF8_NGC75iz9GixeAphOoMtreVHNC1t_",
        # Cast iron skillet with chicken drumsticks and bay leaf
        "crop_box": (0.44, 0.06, 0.92, 0.35)
    },
    {
        "name": "Adobong Pusit",
        "slug": "adobong-pusit.jpg",
        "drive_id": "1TLKLLv32aeOR5wNeGaqOwGs-5N5Ic9E3",
        # Bowl of glistening squid in black ink
        "crop_box": (0.42, 0.06, 0.92, 0.35)
    },
    {
        "name": "Beef Kare-Kare",
        "slug": "kare-kare-bagnet.jpg",
        "drive_id": "1FhKEOwutR5L6aVhtyu2u5AWzZCZ-CJcM",
        # Palayok clay pot of orange peanut stew with sitaw & eggplant
        "crop_box": (0.42, 0.06, 0.92, 0.35)
    }
]

def download_drive_sheet(file_id):
    url = f"https://drive.google.com/uc?id={file_id}&export=download"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=25) as resp:
        data = resp.read()
    return Image.open(io.BytesIO(data)).convert("RGB")

for t in TARGETS:
    print(f"\nProcessing {t['name']} ({t['slug']})...")
    sheet = download_drive_sheet(t["drive_id"])
    w, h = sheet.size
    print(f"  Drive Sheet size: {w}x{h}")

    cx1, cy1, cx2, cy2 = t["crop_box"]
    box = (int(w * cx1), int(h * cy1), int(w * cx2), int(h * cy2))
    dish = sheet.crop(box)
    print(f"  Tight crop box: {box} -> Result: {dish.size}")

    # Scale to 800x600 cover
    dish_fit = ImageOps.fit(dish, (800, 600), method=Image.Resampling.LANCZOS, centering=(0.5, 0.5))

    # Enhance vibrancy and clarity
    enhancer = ImageEnhance.Color(dish_fit)
    dish_fit = enhancer.enhance(1.08)
    sharpener = ImageEnhance.Sharpness(dish_fit)
    dish_fit = sharpener.enhance(1.10)

    out_path = os.path.join(RECIPES_DIR, t["slug"])
    dish_fit.save(out_path, "JPEG", quality=95, optimize=True)
    print(f"  [SAVED CLEAN DISH]: {out_path} ({dish_fit.size})")

print("\nAll 4 authentic dishes cropped and saved cleanly!")
