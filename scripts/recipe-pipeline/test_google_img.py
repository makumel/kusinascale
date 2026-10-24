import urllib.request
import urllib.parse
import re
import json

def search_google_images(query):
    # Google Images search query with search headers
    encoded = urllib.parse.quote(query)
    url = f"https://www.google.com/search?q={encoded}&tbm=isch&safe=active"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5"
    }
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            
        # In Google Images HTML, encrypted thumbnails / source images appear in script tags or img src
        # Matches formats: ["https://...", width, height] or data-src or src="https://encrypted-tbn0.gstatic.com/images?q=tbn:..."
        # First priority: find encrypted-tbn0.gstatic.com thumbnails (guaranteed accessible, high quality, accurate)
        tbns = re.findall(r'(https://encrypted-tbn0\.gstatic\.com/images\?q=tbn:[^\s\"\'\\]+)', html)
        # Also look for high-res web images in JSON payloads: ["http...",...]
        full_imgs = re.findall(r'\[\"(https?://[^\"]+?\.(?:jpg|jpeg|png))\",\s*\d+,\s*\d+\]', html)
        
        print(f"Found {len(tbns)} Google thumbnails, {len(full_imgs)} full-res candidates for '{query}'")
        return full_imgs + tbns
    except Exception as e:
        print(f"Error querying Google Images for {query}: {e}")
        return []

if __name__ == "__main__":
    imgs = search_google_images("Adobong Bangus Filipino food")
    for i, img in enumerate(imgs[:5]):
        print(f"[{i}] {img}")
