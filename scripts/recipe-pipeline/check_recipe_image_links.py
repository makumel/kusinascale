import re
import sys

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

with open("src/data/recipes.ts", "r", encoding="utf-8") as f:
    text = f.read()

queries = ["sinigang", "bulalo", "inasal", "dinuguan", "pinakbet", "laing", "lumpia", "pancit canton", "bicol express", "lechon kawali", "sisig", "menudo"]

for q in queries:
    # Match recipe blocks
    matches = re.finditer(r"{\s*id:\s*['\"]([^'\"]+)['\"].*?name:\s*['\"]([^'\"]+)['\"].*?imageUrl:\s*['\"]([^'\"]+)['\"]", text, re.DOTALL)
    for m in matches:
        r_id, r_name, r_img = m.groups()
        if q in r_name.lower() or q in r_id.lower():
            print(f"[{q.upper()}] ID: {r_id} | Name: '{r_name}' -> Image: '{r_img}'")
            break
