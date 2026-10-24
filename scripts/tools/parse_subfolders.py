import urllib.request
import re

url = 'https://drive.google.com/drive/folders/1w11VLgUmFnqSP3VzTzQwMBSW4MMa0nK4?usp=drive_link'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})

with urllib.request.urlopen(req) as resp:
    raw = resp.read().decode('utf-8', errors='ignore')

# Unescape \x22, \x5b, \x5d, etc.
unescaped = raw.encode().decode('unicode_escape', errors='ignore')

# Find patterns like ["<id>", ["<parent>"], "<Folder Name>"]
items = re.findall(r'\[\"([a-zA-Z0-9_\-]{25,45})\",\[\"1w11VLgUmFnqSP3VzTzQwMBSW4MMa0nK4\"\],\"([^\"]+)\"', unescaped)

print(f"Extracted {len(items)} subfolders directly under root:")
for folder_id, folder_name in items:
    print(f"{folder_name} -> ID: {folder_id}")
