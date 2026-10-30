import urllib.request
from PIL import Image, ImageOps, ImageEnhance
import io
import os

url = "https://drive.google.com/uc?id=1NCYfYlFMFpWn6I79oy52fgpU_nCR0YRY&export=download" # Laing
req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
with urllib.request.urlopen(req, timeout=20) as resp:
    raw = resp.read()

sheet = Image.open(io.BytesIO(raw)).convert("RGB")
w, h = sheet.size

# Inward crop avoiding all badges (House of food at top right, Carinderia Approved at bottom right)
# w: 0.45 to 0.86, h: 0.09 to 0.32
box = (int(w * 0.44), int(h * 0.09), int(w * 0.86), int(h * 0.32))
dish = sheet.crop(box)

# Scale to 800x600
dish_fit = ImageOps.fit(dish, (800, 600), method=Image.Resampling.LANCZOS, centering=(0.5, 0.5))

test_dir = os.path.abspath("scripts/recipe-pipeline/test_crops")
out_path = os.path.join(test_dir, "laing_pure_food.jpg")
dish_fit.save(out_path, quality=95)
print("Saved laing_pure_food.jpg successfully!")
