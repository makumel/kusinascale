import os
from PIL import Image, ImageOps, ImageEnhance

RECIPES_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "public", "recipes"))

TARGETS = [
    # (fname, left_trim, top_trim, right_trim, bottom_trim)
    ("crispy-pork-dinuguan.jpg", 0.14, 0.06, 0.16, 0.14),
    ("pork-menudo-kapampangan.jpg", 0.06, 0.04, 0.06, 0.16),
]

for fname, lt, tt, rt, bt in TARGETS:
    fpath = os.path.join(RECIPES_DIR, fname)
    img = Image.open(fpath).convert("RGB")
    w, h = img.size
    
    crop_box = (int(w * lt), int(h * tt), int(w * (1.0 - rt)), int(h * (1.0 - bt)))
    pure_food = img.crop(crop_box)
    
    fit_food = ImageOps.fit(pure_food, (800, 600), method=Image.Resampling.LANCZOS, centering=(0.5, 0.5))
    
    enhancer = ImageEnhance.Color(fit_food)
    fit_food = enhancer.enhance(1.04)
    sharpener = ImageEnhance.Sharpness(fit_food)
    fit_food = sharpener.enhance(1.06)
    
    fit_food.save(fpath, "JPEG", quality=95, optimize=True)
    print(f"[REFINED PURE DISH]: {fname}")
