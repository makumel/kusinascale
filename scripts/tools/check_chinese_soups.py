import urllib.request
import re

fid = '1p9DN1u3n8DS6PZdsJp_QUH2_dsNLbwpa' # Chinese Soups
url = f'https://drive.google.com/drive/folders/{fid}'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})

with urllib.request.urlopen(req) as resp:
    raw = resp.read().decode('utf-8', errors='ignore')

for row_html in re.findall(r'<tr [^>]*data-id="[a-zA-Z0-9_\-]{25,45}".*?</tr>', raw, re.DOTALL):
    text = re.sub(r'<[^>]+>', ' | ', row_html)
    print(re.sub(r'\s+', ' ', text))
