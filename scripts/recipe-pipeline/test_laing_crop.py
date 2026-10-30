import urllib.request
from PIL import Image
import io
import os

url = "https://drive.google.com/uc?id=1NCYfYlFMFpWn6I79oy52fgpU_nCR0YRY&export=download" # Laing
req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
with urllib.request.urlopen(req, timeout=20) as resp:
    raw = resp.read()

sheet = Image.open(io.BytesIO(raw)).convert("RGB")
w, h = sheet.size
print(f"Laing Sheet dimensions: {w}x{h}")

# Let's save a few test crops to see where the food plate is
test_dir = os.path.abspath("scripts/recipe-pipeline/test_crops")
os.makedirs(test_dir, exist_ok=True)

# 1. Upper right dish (0.42, 0.05, 0.94, 0.38)
crop1 = sheet.crop((int(w * 0.42), int(h * 0.05), int(w * 0.94), int(h * 0.38)))
crop1.save(os.path.join(test_dir, "laing_upper_right.jpg"), quality=90)

# 2. Upper half (0.0, 0.0, 1.0, 0.5)
crop2 = sheet.crop((0, 0, w, int(h * 0.5)))
crop2.resize((400, 300)).save(os.path.join(test_dir, "laing_upper_half.jpg"), quality=85)

print("Saved test crops successfully!")
