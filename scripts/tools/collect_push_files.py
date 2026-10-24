import os
import json

base_dir = r"c:\Users\mic fano\Documents\antigravity\zealous-babbage"
excluded = {'.git', 'node_modules', 'dist', '.gemini', '.system_generated', 'tsconfig.tsbuildinfo', 'package-lock.json'}

files_to_push = []

for root, dirs, files in os.walk(base_dir):
    dirs[:] = [d for d in dirs if d not in excluded]
    for file in files:
        if file in excluded:
            continue
        full_path = os.path.join(root, file)
        rel_path = os.path.relpath(full_path, base_dir).replace('\\', '/')
        try:
            with open(full_path, 'r', encoding='utf-8') as f:
                content = f.read()
            files_to_push.append({
                "path": rel_path,
                "content": content
            })
        except Exception as e:
            print("Skipping binary/unreadable:", rel_path, e)

print(f"Total files collected: {len(files_to_push)}")
output_json = r"C:\Users\mic fano\.gemini\antigravity\brain\9cab03bb-d8ff-408b-aa09-850ae10dda0a\scratch\push_payload.json"
with open(output_json, 'w', encoding='utf-8') as f:
    json.dump({
        "owner": "makumel",
        "repo": "kusinascale",
        "branch": "main",
        "message": "Initial commit: KusinaScale Interactive Recipe & Negosyo Costing Platform",
        "files": files_to_push
    }, f, indent=2)

print("Saved payload to", output_json)
