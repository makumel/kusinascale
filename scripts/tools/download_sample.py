import urllib.request

file_id = '1nF3QlriVinDulgLJfW5GIQZG45NxM5Xl'
url = f'https://drive.google.com/uc?id={file_id}&export=download'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})

try:
    with urllib.request.urlopen(req) as resp:
        content_type = resp.headers.get('Content-Type')
        content_disposition = resp.headers.get('Content-Disposition')
        data = resp.read(5000)
        print("Content-Type:", content_type)
        print("Content-Disposition:", content_disposition)
        print("Data length:", len(data))
        print("Header snippet:", repr(data[:200]))
except Exception as e:
    print("Error:", e)
