import urllib.request
import re

fid = '1wgMo6TkkoCezLUAbqQUlMul3DT9lACcM' # Carinderia pinoy recipes
url = f'https://drive.google.com/drive/folders/{fid}'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})

with urllib.request.urlopen(req) as resp:
    raw = resp.read().decode('utf-8', errors='ignore')

sizes = []
for row_html in re.findall(r'<tr [^>]*data-id="[a-zA-Z0-9_\-]{25,45}".*?</tr>', raw, re.DOTALL):
    text = re.sub(r'<[^>]+>', ' | ', row_html)
    m = re.search(r'\|\s*(\d+(?:\.\d+)?\s*(?:KB|MB|GB))\s*\|', text)
    if m:
        sizes.append(m.group(1))

print("Found sizes:", len(sizes))
print("Sample sizes:", sizes[:10])
