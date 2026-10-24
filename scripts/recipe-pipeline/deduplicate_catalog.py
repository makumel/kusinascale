"""
Deduplicates any repeated recipe objects in src/data/recipes.ts.
"""

import os
import re

RECIPES_TS = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "src", "data", "recipes.ts"))

with open(RECIPES_TS, "r", encoding="utf-8") as f:
    code = f.read()

# Locate the RECIPES array
start_marker = "export const RECIPES: Recipe[] = ["
start_pos = code.find(start_marker)
if start_pos == -1:
    print("Could not find start of RECIPES array")
    exit(1)

prefix = code[:start_pos + len(start_marker)]
rest = code[start_pos + len(start_marker):]

# Find the ending ];
end_pos = rest.rfind("];")
suffix = rest[end_pos:]
array_content = rest[:end_pos]

# Match recipe object blocks: starts with { \n id: '...' up to the matching }
recipe_blocks = re.findall(r"(\s*\{\s*id:\s*['\"]([^'\"]+)['\"].*?\n\s*\},?)", array_content, re.DOTALL)

print(f"Total blocks matched: {len(recipe_blocks)}")

unique_blocks = []
seen_ids = set()
duplicates = []

for block, r_id in recipe_blocks:
    if r_id in seen_ids:
        duplicates.append(r_id)
    else:
        seen_ids.add(r_id)
        # Ensure trailing comma
        b_clean = block.strip()
        if not b_clean.endswith(","):
            b_clean += ","
        unique_blocks.append("  " + b_clean)

print(f"Found {len(duplicates)} duplicate IDs: {duplicates}")
print(f"Clean unique recipes count: {len(unique_blocks)}")

new_catalog = prefix + "\n" + "\n\n".join(unique_blocks) + "\n" + suffix

with open(RECIPES_TS, "w", encoding="utf-8") as f:
    f.write(new_catalog)

print("Catalog deduplication complete!")
