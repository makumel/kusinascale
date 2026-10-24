import urllib.request
import re

folder_id = '1wgMo6TkkoCezLUAbqQUlMul3DT9lACcM' # Carinderia pinoy recipes
url = f'https://drive.google.com/drive/folders/{folder_id}'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})

with urllib.request.urlopen(req) as resp:
    raw = resp.read().decode('utf-8', errors='ignore')

unescaped = raw.encode().decode('unicode_escape', errors='ignore')
files = re.findall(rf'\[\"([a-zA-Z0-9_\-]{{25,45}})\",\[\"{folder_id}\"\],\"([^\"]+)\"', unescaped)

print(f"Files in 'Carinderia pinoy recipes' ({len(files)} items):")
for fid, fname in files[:10]:
    print(f"  - {fname} (ID: {fid})")
