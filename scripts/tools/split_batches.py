import json

payload_path = r"C:\Users\mic fano\.gemini\antigravity\brain\9cab03bb-d8ff-408b-aa09-850ae10dda0a\scratch\push_payload.json"
with open(payload_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

files = data['files']
print("Total files:", len(files))

b1 = files[:10]
b2 = files[10:]

print("Batch 1 files:", [f['path'] for f in b1])
print("Batch 1 size:", sum(len(f['content']) for f in b1) / 1024, "KB")

print("Batch 2 files:", [f['path'] for f in b2])
print("Batch 2 size:", sum(len(f['content']) for f in b2) / 1024, "KB")
