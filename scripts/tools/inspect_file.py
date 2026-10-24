import urllib.request
import re

file_id = '1nF3QlriVinDulgLJfW5GIQZG45NxM5Xl' # Adobo
url = f'https://drive.google.com/file/d/{file_id}/view'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})

try:
    with urllib.request.urlopen(req) as resp:
        raw = resp.read().decode('utf-8', errors='ignore')
    title_match = re.search(r'<title>(.*?)</title>', raw)
    print("Page Title:", title_match.group(1) if title_match else 'None')
    
    # Check mime type or description or contents
    m = re.findall(r'\"([^\"]+\.(?:pdf|docx|txt|jpg|png))\"', raw)
    print("File extensions found:", set(m)[:10])
except Exception as e:
    print("Error:", e)
