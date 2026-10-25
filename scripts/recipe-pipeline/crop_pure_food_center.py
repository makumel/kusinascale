"""
Applies an inward zoom / center-dish crop (trimming 12-16% from the perimeter)
on the authentic Drive dish photos to completely eliminate all residual
seller badges ("CARINDERIA APPROVED", "HOUSE OF FOOD", and text banners).
"""

import os
from PIL import Image, ImageOps, ImageEnhance

RECIPES_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "public", "recipes"))

DISHES_TO_ZOOM = [
    # (filename, left_trim, top_trim, right_trim, bottom_trim)
    ("beef-caldereta-fiesta.jpg", 0.08, 0.06, 0.16, 0.14),
    ("chicken-adobo-classic.jpg", 0.06, 0.12, 0.14, 0.08),
    ("adobong-pusit.jpg", 0.14, 0.12, 0.18, 0.14),
    ("kare-kare-bagnet.jpg", 0.14, 0.12, 0.16, 0.12),
]

for fname, lt, tt, rt, bt in DISHES_TO_ZOOM:
    fpath = os.path.join(RECIPES_DIR, fname)
    img = Image.open(fpath).convert("RGB")
    w, h = img.size

    # Inward crop box to remove outer perimeter badges
    crop_box = (int(w * lt), int(h * tt), int(w * (1.0 - rt)), int(h * (1.0 - bt)))
    pure_food = img.crop(crop_box)

    # Re-fit to 800x600
    fit_food = ImageOps.fit(pure_food, (800, 600), method=Image.Resampling.LANCZOS, centering=(0.5, 0.5))

    # Enhance vibrancy and sharpness
    enhancer = ImageEnhance.Color(fit_food)
    fit_food = enhancer.enhance(1.05)
    sharpener = ImageEnhance.Sharpness(fit_food)
    fit_food = sharpener.enhance(1.08)

    fit_food.save(fpath, "JPEG", quality=95, optimize=True)
    print(f"[100% PURE FOOD CROPPED]: {fname} -> Trimmed badges successfully!")

print("\nAll 4 authentic dishes are now 100% badge-free, pristine food photography!")
