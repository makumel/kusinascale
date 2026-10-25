import json
import re

suspects = json.load(open('scripts/recipe-pipeline/suspect_images.json', encoding='utf-8'))
print(f"Total suspect images to replace: {len(suspects)}")

# Map filename to recipe name from recipes.ts
code = open('src/data/recipes.ts', encoding='utf-8').read()
lines = code.split('\n')
fn_to_name = {}
curr_name = ""
for line in lines:
    m_name = re.match(r"^\s*name:\s*['\"]([^'\"]+)['\"]", line)
    if m_name:
        curr_name = m_name.group(1)
    m_img = re.match(r"^\s*imageUrl:\s*['\"]/recipes/([^'\"]+)['\"]", line)
    if m_img and curr_name:
        fn_to_name[m_img.group(1)] = curr_name

for s in suspects:
    fn = s["filename"]
    r_name = fn_to_name.get(fn, fn.replace('.jpg', '').replace('-', ' ').title())
    print(f"• {fn} -> Recipe: '{r_name}' | Reasons: {', '.join(s['reasons'])}")
