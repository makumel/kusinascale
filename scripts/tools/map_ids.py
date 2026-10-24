import urllib.request
import re

url = 'https://drive.google.com/drive/folders/1w11VLgUmFnqSP3VzTzQwMBSW4MMa0nK4?usp=drive_link'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})

with urllib.request.urlopen(req) as resp:
    html = resp.read().decode('utf-8', errors='ignore')

# Print out snippets containing the 33-char IDs and surrounding text
ids = set(re.findall(r'[a-zA-Z0-9_\-]{33}', html))
print(f"Found {len(ids)} candidate IDs")

for id_val in list(ids)[:10]:
    pos = html.find(id_val)
    if pos != -1:
        start = max(0, pos - 50)
        end = min(len(html), pos + 150)
        snippet = html[start:end].replace('\n', ' ')
        print(f"[{id_val}] -> {snippet[:150]}")
