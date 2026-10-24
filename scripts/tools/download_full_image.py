import urllib.request

file_id = '1nF3QlriVinDulgLJfW5GIQZG45NxM5Xl'
url = f'https://drive.google.com/uc?id={file_id}&export=download'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})

save_path = r'C:\Users\mic fano\.gemini\antigravity\brain\9cab03bb-d8ff-408b-aa09-850ae10dda0a\scratch\adobo.png'

with urllib.request.urlopen(req) as resp, open(save_path, 'wb') as out_f:
    out_f.write(resp.read())

print("Downloaded successfully to", save_path)
