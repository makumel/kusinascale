import urllib.request
import re
import json

url = 'https://drive.google.com/drive/folders/1w11VLgUmFnqSP3VzTzQwMBSW4MMa0nK4?usp=drive_link'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})

with urllib.request.urlopen(req) as resp:
    html = resp.read().decode('utf-8', errors='ignore')

# Search for folder IDs and names in Google Drive's data structures
# Often in format: ["folder_id", ["name", ...]] or similar
matches = re.findall(r'\"([a-zA-Z0-9_\-]{28,35})\"[,\s]+\[\"([^\"]+?)\"', html)
print(f"Matches count: {len(matches)}")
for fid, name in matches[:25]:
    print(f"ID: {fid} -> Name: {name}")

# Also find any direct download links or file IDs
file_ids = re.findall(r'\"([a-zA-Z0-9_\-]{33})\"', html)
print(f"Unique 33-char IDs: {len(set(file_ids))}")
