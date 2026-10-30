import os
from PIL import Image, ImageOps, ImageEnhance

RECIPES_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "public", "recipes"))

DISHES_TO_CLEAN = [
    # (filename, left_trim, top_trim, right_trim, bottom_trim)
    ("special-bulalo-batangas.jpg", 0.08, 0.06, 0.12, 0.12),
    ("pork-sinigang-sampaloc.jpg", 0.06, 0.04, 0.06, 0.16), # trim bottom text card
    ("bicol-laing-creamy.jpg", 0.08, 0.06, 0.12, 0.12),
    ("pork-sisig-kapampangan.jpg", 0.08, 0.06, 0.12, 0.12),
    ("bicol-express-classic.jpg", 0.08, 0.06, 0.12, 0.12),
    ("pork-menudo-kapampangan.jpg", 0.08, 0.06, 0.12, 0.14),
    ("crispy-pork-dinuguan.jpg", 0.08, 0.06, 0.12, 0.12),
    ("ilocano-pinakbet-bagnet.jpg", 0.08, 0.06, 0.12, 0.14),
    ("lumpiang-shanghai-crispy.jpg", 0.08, 0.06, 0.12, 0.12),
    ("pancit-canton-special.jpg", 0.08, 0.06, 0.12, 0.14),
    ("chicken-inasal-bacolod.jpg", 0.08, 0.06, 0.12, 0.12),
    ("lechon-kawali-crispy.jpg", 0.08, 0.06, 0.12, 0.12),
]

for fname, lt, tt, rt, bt in DISHES_TO_CLEAN:
    fpath = os.path.join(RECIPES_DIR, fname)
    if not os.path.exists(fpath):
        continue
    img = Image.open(fpath).convert("RGB")
    w, h = img.size
    
    crop_box = (int(w * lt), int(h * tt), int(w * (1.0 - rt)), int(h * (1.0 - bt)))
    pure_food = img.crop(crop_box)
    
    fit_food = ImageOps.fit(pure_food, (800, 600), method=Image.Resampling.LANCZOS, centering=(0.5, 0.5))
    
    # Enhance vibrancy and sharpness
    enhancer = ImageEnhance.Color(fit_food)
    fit_food = enhancer.enhance(1.04)
    sharpener = ImageEnhance.Sharpness(fit_food)
    fit_food = sharpener.enhance(1.06)
    
    fit_food.save(fpath, "JPEG", quality=95, optimize=True)
    print(f"[CLEANED PURE DISH]: {fname}")

print("\nAll 12 dishes trimmed to 100% pure food photography without borders or text cards!")
