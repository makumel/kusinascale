import urllib.request
import re

item_id = '1nF3QlriVinDulgLJfW5GIQZG45NxM5Xl' # Adobo
url = f'https://drive.google.com/drive/folders/{item_id}'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})

try:
    with urllib.request.urlopen(req) as resp:
        raw = resp.read().decode('utf-8', errors='ignore')
    unescaped = raw.encode().decode('unicode_escape', errors='ignore')
    title_match = re.search(r'<title>(.*?)</title>', raw)
    print("Page Title:", title_match.group(1) if title_match else 'None')
    files = re.findall(rf'\[\"([a-zA-Z0-9_\-]{{25,45}})\",\[\"{item_id}\"\],\"([^\"]+)\"', unescaped)
    print(f"Items inside Adobo ({len(files)} items):")
    for fid, fname in files:
        print(f"  - {fname} (ID: {fid})")
except Exception as e:
    print("Error / Not a folder:", e)
