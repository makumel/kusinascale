import os
import sys
import json
from PIL import Image
import numpy as np

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

RECIPES_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "public", "recipes"))
OUT_JSON = os.path.abspath(os.path.join(os.path.dirname(__file__), "suspect_images.json"))

def analyze_image(path):
    try:
        with Image.open(path) as raw_img:
            img = raw_img.convert("RGB")
            w, h = img.size
            arr = np.array(img, dtype=np.float32)

        # 1. Color saturation via HSV
        hsv = np.array(img.convert("HSV"), dtype=np.float32)
        sat_mean = float(hsv[:, :, 1].mean())
        val_mean = float(hsv[:, :, 2].mean())

        # 2. Distance between R, G, B channels (grayscale/document check)
        diff_rg = np.abs(arr[:, :, 0] - arr[:, :, 1])
        diff_gb = np.abs(arr[:, :, 1] - arr[:, :, 2])
        diff_br = np.abs(arr[:, :, 2] - arr[:, :, 0])
        color_diff_mean = float((diff_rg + diff_gb + diff_br).mean())

        # 3. White / Paper background percentage
        is_white_paper = (arr[:, :, 0] > 215) & (arr[:, :, 1] > 215) & (arr[:, :, 2] > 215) & (diff_rg < 15) & (diff_gb < 15)
        white_paper_ratio = float(is_white_paper.mean())

        # 4. Dark text on paper
        is_black_text = (arr[:, :, 0] < 60) & (arr[:, :, 1] < 60) & (arr[:, :, 2] < 60)
        black_text_ratio = float(is_black_text.mean())

        is_suspect = False
        reasons = []

        if white_paper_ratio > 0.45:
            is_suspect = True
            reasons.append(f"Excessive white/paper background ({white_paper_ratio*100:.1f}%)")

        if sat_mean < 25.0:
            is_suspect = True
            reasons.append(f"Extremely low color saturation ({sat_mean:.1f}/255)")

        if color_diff_mean < 12.0:
            is_suspect = True
            reasons.append(f"Near-grayscale/document palette (diff={color_diff_mean:.1f})")

        if white_paper_ratio > 0.30 and black_text_ratio > 0.05:
            is_suspect = True
            reasons.append(f"Form-like text on paper ({black_text_ratio*100:.1f}% dark text, {white_paper_ratio*100:.1f}% white)")

        return {
            "filename": os.path.basename(path),
            "size": [w, h],
            "sat_mean": round(sat_mean, 2),
            "val_mean": round(val_mean, 2),
            "color_diff_mean": round(color_diff_mean, 2),
            "white_paper_ratio": round(white_paper_ratio, 4),
            "black_text_ratio": round(black_text_ratio, 4),
            "is_suspect": is_suspect,
            "reasons": reasons
        }
    except Exception as e:
        return {
            "filename": os.path.basename(path),
            "is_suspect": True,
            "reasons": [f"Unreadable file: {e}"]
        }

def run():
    files = [f for f in os.listdir(RECIPES_DIR) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
    print(f"Scanning all {len(files)} recipe images...")

    suspects = []
    healthy = 0

    for f in sorted(files):
        fpath = os.path.join(RECIPES_DIR, f)
        res = analyze_image(fpath)
        if res["is_suspect"]:
            suspects.append(res)
        else:
            healthy += 1

    with open(OUT_JSON, "w", encoding="utf-8") as f:
        json.dump(suspects, f, indent=2)

    print("=" * 65)
    print(f"SCAN RESULTS: {healthy} Healthy Food Photos | {len(suspects)} Suspect Files")
    print(f"Saved suspect list to {OUT_JSON}")
    print("=" * 65)

    for s in suspects:
        print(f"[SUSPECT] {s['filename']}: {', '.join(s['reasons'])}")

if __name__ == "__main__":
    run()
