import urllib.request
import re

url = 'https://drive.google.com/drive/folders/1w11VLgUmFnqSP3VzTzQwMBSW4MMa0nK4?usp=drive_link'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})

with urllib.request.urlopen(req) as resp:
    html = resp.read().decode('utf-8', errors='ignore')

# Extract folder names from aria-labels or JSON structures
folder_names = set(re.findall(r'\"([^\"]+?)\s*(?:Shared folder|folder)\"', html, re.IGNORECASE))
# Also check for names followed by folder identifiers
print("Extracted Folders/Categories:")
for name in sorted(folder_names):
    cleaned = name.replace('\\', '').strip()
    if len(cleaned) > 2 and not cleaned.startswith('http'):
        print(f" - {cleaned}")
