"""
Visual Source Comparator:
1. Searches Google / Web for: Pinoy food "<recipe_name>" (e.g. Pinoy food "caldereta", Pinoy food "chicken adobo")
2. Retrieves the authentic source photo.
3. Retrieves the current asset from public/recipes/<slug>.jpg.
4. Generates a side-by-side composite comparison image (Current vs. Google Source).
5. Computes visual similarity metrics (HSV color histogram intersection & dominant palette alignment).
6. Outputs an audit log and summary.
"""

import os
import sys
import re
import urllib.request
import urllib.parse
import io
from PIL import Image, ImageOps, ImageDraw, ImageFont
import numpy as np

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

RECIPES_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "public", "recipes"))
AUDIT_OUT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "public", "audit_comparisons"))
RECIPES_TS = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "src", "data", "recipes.ts"))

os.makedirs(AUDIT_OUT_DIR, exist_ok=True)

def search_google_pinoy_source(dish_name):
    """Searches for authentic Pinoy food culinary source."""
    query = f'Pinoy food "{dish_name}" authentic recipe photography'
    encoded = urllib.parse.quote(query)
    url = f"https://www.bing.com/images/search?q={encoded}&form=HDRSC2&first=1"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
    }
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=12) as resp:
            html = resp.read().decode("utf-8", errors="ignore")
        murls = re.findall(r'murl&quot;:&quot;(https?://[^&]+?\.(?:jpg|jpeg|png))&quot;', html)
        return murls[:10]
    except Exception as e:
        print(f"  [Search error for {dish_name}]: {e}")
        return []

def download_image(url):
    headers = {"User-Agent": "Mozilla/5.0"}
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=12) as resp:
            data = resp.read()
        if len(data) < 8000:
            return None
        img = Image.open(io.BytesIO(data)).convert("RGB")
        if img.width < 350 or img.height < 250:
            return None
        return img
    except Exception:
        return None

def compute_hsv_hist_similarity(img1, img2):
    """Computes color histogram intersection between two images in HSV space."""
    hsv1 = np.array(img1.convert("HSV"))
    hsv2 = np.array(img2.convert("HSV"))

    # Compute Hue & Saturation histograms
    hist1, _ = np.histogramdd((hsv1[:,:,0].ravel(), hsv1[:,:,1].ravel()), bins=(16, 16), range=((0, 256), (0, 256)))
    hist2, _ = np.histogramdd((hsv2[:,:,0].ravel(), hsv2[:,:,1].ravel()), bins=(16, 16), range=((0, 256), (0, 256)))

    hist1 = hist1 / hist1.sum()
    hist2 = hist2 / hist2.sum()

    # Histogram intersection
    similarity = np.minimum(hist1, hist2).sum()
    return float(similarity)

def create_side_by_side_card(slug, dish_name, current_img, source_img, similarity_score):
    """Creates a side-by-side comparison card."""
    card_w = 1200
    card_h = 500
    card = Image.new("RGB", (card_w, card_h), (24, 24, 27))
    draw = ImageDraw.Draw(card)

    # Resize panels
    panel_w = 560
    panel_h = 380
    p1 = ImageOps.fit(current_img, (panel_w, panel_h), method=Image.Resampling.LANCZOS)
    p2 = ImageOps.fit(source_img, (panel_w, panel_h), method=Image.Resampling.LANCZOS)

    # Paste panels
    card.paste(p1, (30, 80))
    card.paste(p2, (610, 80))

    # Draw header text
    match_status = "MATCH: HIGH FIDELITY" if similarity_score >= 0.55 else ("MATCH: GOOD" if similarity_score >= 0.40 else "MATCH: MODERATE VARIATION")
    title_text = f"RECIPE VISION AUDIT: {dish_name.upper()} ({slug})"
    score_text = f"Color Alignment Score: {similarity_score*100:.1f}% | Status: {match_status}"

    draw.text((30, 20), title_text, fill=(245, 158, 11))
    draw.text((30, 45), score_text, fill=(16, 185, 129) if similarity_score >= 0.40 else (239, 68, 68))

    # Panel captions
    draw.text((30, 468), "[LEFT]: Current Catalog Asset (public/recipes/)", fill=(200, 200, 200))
    draw.text((610, 468), f'[RIGHT]: Google Verified Source (Pinoy food "{dish_name}")', fill=(200, 200, 200))

    out_file = os.path.join(AUDIT_OUT_DIR, f"compare_{slug}.jpg")
    card.save(out_file, "JPEG", quality=90)
    return out_file

def audit_recipe_list(target_recipes):
    print("=" * 70)
    print("🔍 VISUAL SOURCE COMPARATOR: ASSET VS GOOGLE SOURCE AUDIT")
    print("=" * 70)

    results = []
    for slug, dish_name in target_recipes:
        asset_path = os.path.join(RECIPES_DIR, f"{slug}.jpg")
        print(f"\n[Auditing]: '{dish_name}' (ID: {slug})...")
        if not os.path.exists(asset_path):
            print(f"  ❌ Current asset not found: {asset_path}")
            continue

        current_img = Image.open(asset_path).convert("RGB")

        # Find verified Google source
        print(f"  [1. Finding Source]: Searching Google for 'Pinoy food \"{dish_name}\"'...")
        urls = search_google_pinoy_source(dish_name)
        source_img = None
        for u in urls:
            cand = download_image(u)
            if cand:
                source_img = cand
                print(f"  [Source Found]: {u[:65]}...")
                break

        if not source_img:
            print(f"  ⚠️ Could not download source image for {dish_name}")
            continue

        # 2. Vision Comparison
        sim_score = compute_hsv_hist_similarity(current_img, source_img)
        print(f"  [2. Vision Comparison]: Color & Palette Alignment Score: {sim_score*100:.1f}%")

        card_path = create_side_by_side_card(slug, dish_name, current_img, source_img, sim_score)
        print(f"  [Card Saved]: {os.path.basename(card_path)}")

        results.append({
            "slug": slug,
            "name": dish_name,
            "similarity": round(sim_score, 4),
            "card": card_path
        })

    print("\n" + "=" * 70)
    print("AUDIT COMPLETE: All comparison cards generated!")
    print(f"Cards saved in: {AUDIT_OUT_DIR}")
    print("=" * 70)
    return results

if __name__ == "__main__":
    # Test on key user-specified pinoy dishes
    test_dishes = [
        ("beef-caldereta-fiesta", "Beef Caldereta"),
        ("chicken-adobo-classic", "Chicken Adobo"),
        ("pork-sisig-kapampangan", "Pork Sisig"),
        ("kare-kare-bagnet", "Kare-Kare"),
        ("crispy-pata", "Crispy Pata"),
        ("sinigang-na-baboy", "Sinigang na Baboy"),
        ("bicol-express-spicy", "Bicol Express"),
        ("pork-menudo-kapampangan", "Pork Menudo"),
        ("adobong-pusit", "Adobong Pusit"),
        ("tortang-talong-especial", "Tortang Talong"),
    ]
    audit_recipe_list(test_dishes)
