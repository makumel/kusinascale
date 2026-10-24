import urllib.request
import re

folder_id = '1cobRFCee601rmCImuRU7hFw-Ge9dlCBZ' # Filipino chicken recipes
url = f'https://drive.google.com/drive/folders/{folder_id}'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})

with urllib.request.urlopen(req) as resp:
    raw = resp.read().decode('utf-8', errors='ignore')

unescaped = raw.encode().decode('unicode_escape', errors='ignore')

# Match items inside this folder: ["<file_id>", ["<folder_id>"], "<Filename>"]
files = re.findall(rf'\[\"([a-zA-Z0-9_\-]{{25,45}})\",\[\"{folder_id}\"\],\"([^\"]+)\"', unescaped)

print(f"Files found in 'Filipino chicken recipes' ({len(files)} items):")
for fid, fname in files:
    print(f"  - {fname} (ID: {fid})")
