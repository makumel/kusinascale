import urllib.request
import re
import json

url = 'https://drive.google.com/drive/folders/1w11VLgUmFnqSP3VzTzQwMBSW4MMa0nK4?usp=drive_link'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})

with urllib.request.urlopen(req) as resp:
    html = resp.read().decode('utf-8', errors='ignore')

print('Title:', re.search(r'<title>(.*?)</title>', html).group(1))

# Look for patterns like ["title", ...] or folder item listings
# In Drive html, items often appear in WZ_ or _DRIVE_ or similar js variables
matches = re.findall(r'\[\"([a-zA-Z0-9_\-]{20,})\",\[\"([^\"]+)\"', html)
print('Matches 1:', matches[:10])

# Search for typical recipe keywords in the HTML
keywords = ['Filipino', 'Chinese', 'Italian', 'Korean', 'Thai', 'Japanese', 'Chicken', 'Pork', 'Beef', 'Dessert', 'Baking', 'Cookbook', 'Recipe', 'Ebook']
found_kw = {}
for kw in keywords:
    c = len(re.findall(re.escape(kw), html, re.IGNORECASE))
    if c > 0:
        found_kw[kw] = c
print('Keyword counts:', found_kw)

# Find strings that look like titles or folders
potential_titles = set(re.findall(r'\"([A-Z0-9\s\-_]{4,50}(?:RECIPE|COOKBOOK|FOOD|DISHES|KITCHEN)[A-Z0-9\s\-_]{0,30})\"', html, re.IGNORECASE))
print('Potential titles:', list(potential_titles)[:20])
