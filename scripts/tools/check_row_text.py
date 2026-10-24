import urllib.request
import re

folder_id = '1cobRFCee601rmCImuRU7hFw-Ge9dlCBZ'
url = f'https://drive.google.com/drive/folders/{folder_id}'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})

with urllib.request.urlopen(req) as resp:
    raw = resp.read().decode('utf-8', errors='ignore')

# Find row containing 1nF3QlriVinDulgLJfW5GIQZG45NxM5Xl
match = re.search(r'(<tr [^>]*data-id="1nF3QlriVinDulgLJfW5GIQZG45NxM5Xl".*?</tr>)', raw, re.DOTALL)
if match:
    row_html = match.group(1)
    # clean tags to get text
    text = re.sub(r'<[^>]+>', ' | ', row_html)
    print("Row text:", re.sub(r'\s+', ' ', text))
else:
    print("Row not found via regex")
