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

# Precision inward crop:
# x1: 0.44 -> starts right inside the bowl
# y1: 0.11 -> clears the bottom of the House of Food top-right badge
# x2: 0.82 -> clears the left of the circular seal
# y2: 0.30 -> clears the top of the circular seal
box = (int(w * 0.44), int(h * 0.11), int(w * 0.82), int(h * 0.30))
dish = sheet.crop(box)

# Scale to 800x600
dish_fit = ImageOps.fit(dish, (800, 600), method=Image.Resampling.LANCZOS, centering=(0.5, 0.5))

test_dir = os.path.abspath("scripts/recipe-pipeline/test_crops")
out_path = os.path.join(test_dir, "laing_100pct_clean.jpg")
dish_fit.save(out_path, quality=95)
print("Saved laing_100pct_clean.jpg successfully!")
