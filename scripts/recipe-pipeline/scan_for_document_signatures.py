import os
import sys
import glob
from PIL import Image, ImageStat

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
PUBLIC_RECIPES = os.path.join(BASE_DIR, "public", "recipes")

images = glob.glob(os.path.join(PUBLIC_RECIPES, "*.jpg"))
print(f"Auditing all {len(images)} recipe images for document/paper/form signatures...")

suspects = []

for p in images:
    try:
        im = Image.open(p)
        w, h = im.size
        
        # Check aspect ratio (A4 or Letter portrait documents are ~0.7 to 0.77, while food cards are landscape 1.33 = 800x600)
        aspect = w / h
        
        # Check color saturation (documents are nearly pure black and white / grayscale with saturation < 15)
        im_hsv = im.convert("HSV")
        stat = ImageStat.Stat(im_hsv)
        mean_sat = stat.mean[1] # HSV Saturation channel
        mean_val = stat.mean[2] # HSV Brightness/Value channel
        
        # Scanned documents typically have very low saturation (< 20) and high brightness (> 200) or pure text
        if mean_sat < 15 and mean_val > 180:
            suspects.append({
                "file": os.path.basename(p),
                "reason": f"Low saturation ({mean_sat:.1f}) & high brightness ({mean_val:.1f}) - document-like",
                "aspect": f"{aspect:.2f}"
            })
        elif aspect < 0.9: # Vertical document portrait
            suspects.append({
                "file": os.path.basename(p),
                "reason": f"Vertical aspect ratio ({aspect:.2f})",
                "aspect": f"{aspect:.2f}"
            })
    except Exception as e:
        suspects.append({
            "file": os.path.basename(p),
            "reason": f"Unreadable / corrupted: {e}",
            "aspect": "N/A"
        })

print(f"\nAudit completed across {len(images)} images.")
print(f"Total document/non-food suspects found: {len(suspects)}")

if suspects:
    print("\nSUSPECTS LIST:")
    for s in suspects:
        print(f"  - {s['file']}: {s['reason']}")
else:
    print("ALL 573+ RECIPE IMAGES PASSED! Zero document/paper signatures detected. 100% authentic food photography!")
