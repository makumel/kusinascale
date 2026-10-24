import re

code = open("src/data/recipes.ts", encoding="utf-8").read()
local = re.findall(r"imageUrl:\s*['\"]/recipes/", code)
remote = re.findall(r"imageUrl:\s*['\"]http", code)
print(f"Total: {len(local) + len(remote)} | Local: {len(local)} | Remote: {len(remote)}")

lines = code.split("\n")
recipes = []
curr = {}
in_ingredients = False

for line in lines:
    if "ingredients: [" in line:
        in_ingredients = True
    elif in_ingredients and line.strip().startswith("],"):
        in_ingredients = False

    if not in_ingredients:
        m_id = re.match(r"^\s*id:\s*['\"]([^'\"]+)['\"]", line)
        if m_id:
            if curr and "id" in curr:
                recipes.append(curr)
            curr = {"id": m_id.group(1)}
            continue
        m_name = re.match(r"^\s*name:\s*['\"]([^'\"]+)['\"]", line)
        if m_name and curr:
            curr["name"] = m_name.group(1)
            continue
        m_img = re.match(r"^\s*imageUrl:\s*['\"]([^'\"]*)['\"]", line)
        if m_img and curr:
            curr["imageUrl"] = m_img.group(1)
            continue

if curr and "id" in curr:
    recipes.append(curr)

still_remote = [r for r in recipes if r.get("imageUrl", "").startswith("http")]
print(f"Still remote ({len(still_remote)}):")
for r in still_remote:
    print(f"  - {r.get('id')}: {r.get('name')}")
