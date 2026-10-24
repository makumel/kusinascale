import os
import sys
import re
import urllib.request
import urllib.parse
from PIL import Image, ImageOps, ImageEnhance
import hashlib
import io

OUTPUT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "public", "recipes"))
RECIPES_TS = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "src", "data", "recipes.ts"))

TARGETS = [
    ("korean-crispy-yangnyeom-chicken", "korean fried chicken yangnyeom sauce crispy"),
    ("thai-pad-kra-pao", "thai basil chicken pad kra pao with fried egg"),
    ("beef-pares-retiro", "filipino beef pares tender stew garlic rice"),
    ("pork-dinuguan-gold", "filipino pork dinuguan stew puto"),
    ("crispy-lumpiang-shanghai", "crispy spring rolls lumpiang shanghai sweet chili"),
    ("chicken-cordon-bleu-rolls", "chicken cordon bleu rolled sliced ham cheese"),
]

def search_images(query):
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
        return murls[:20]
    except Exception as e:
        print(f"Search error: {e}")
        return []

def download_and_save(urls, slug):
    out_path = os.path.join(OUTPUT_DIR, f"{slug}.jpg")
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
    }

    for url in urls:
        try:
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=12) as resp:
                data = resp.read()
            if len(data) < 10000:
                continue
            img = Image.open(io.BytesIO(data)).convert("RGB")
            w, h = img.size
            if w < 400 or h < 300:
                continue

            img_fit = ImageOps.fit(img, (800, 600), method=Image.Resampling.LANCZOS, centering=(0.5, 0.5))
            enhancer = ImageEnhance.Color(img_fit)
            img_fit = enhancer.enhance(1.06)
            sharpener = ImageEnhance.Sharpness(img_fit)
            img_fit = sharpener.enhance(1.08)

            img_fit.save(out_path, "JPEG", quality=90, optimize=True)
            print(f"[SUCCESS] Saved {slug}.jpg ({w}x{h} -> 800x600)")
            return f"/recipes/{slug}.jpg"
        except Exception as e:
            continue
    return None

replacements = {}
for slug, query in TARGETS:
    print(f"Searching for {slug}...")
    urls = search_images(query)
    res = download_and_save(urls, slug)
    if res:
        replacements[slug] = res
    else:
        print(f"[FAIL] Could not download image for {slug}")

print(f"\nReplaced {len(replacements)} / {len(TARGETS)} images.")

# Update recipes.ts
with open(RECIPES_TS, "r", encoding="utf-8") as f:
    lines = f.readlines()

new_lines = []
curr_id = None
for line in lines:
    m_id = re.match(r"^\s*id:\s*['\"]([^'\"]+)['\"]", line)
    if m_id:
        curr_id = m_id.group(1)
    if curr_id in replacements and "imageUrl:" in line:
        line = f"    imageUrl: '{replacements[curr_id]}',\n"
    new_lines.append(line)

with open(RECIPES_TS, "w", encoding="utf-8") as f:
    f.writelines(new_lines)

print("Done updating recipes.ts!")
