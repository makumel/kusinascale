import json

with open(r"C:\Users\mic fano\.gemini\antigravity\brain\9cab03bb-d8ff-408b-aa09-850ae10dda0a\scratch\push_payload.json", 'r', encoding='utf-8') as f:
    data = json.load(f)

# Files for batch 2 (core source & data)
paths_batch2 = [
    'src/types/recipe.ts',
    'src/utils/costingEngine.ts',
    'src/data/recipes.ts',
    'src/index.css',
    'src/main.tsx',
    'src/App.tsx'
]

b2_files = [f for f in data['files'] if f['path'] in paths_batch2]
with open(r"C:\Users\mic fano\.gemini\antigravity\brain\9cab03bb-d8ff-408b-aa09-850ae10dda0a\scratch\batch2.json", 'w', encoding='utf-8') as f:
    json.dump(b2_files, f)

print("Batch 2 count:", len(b2_files))
