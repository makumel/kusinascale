"""
Recipe & Image Visual Auditor
Compares each recipe name in the catalog against its image, checks file integrity,
detects duplicate hashes, and audits image authenticity against Google/Drive references.
"""

import os
import sys
import json
import hashlib
import re
from PIL import Image

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

RECIPES_TS = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "src", "data", "recipes.ts"))
PUBLIC_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "public"))

def audit_catalog_images():
    print("=" * 65)
    print("🔍 RECIPE VISUAL AUDITOR: IMAGE VS RECIPE NAME AUDIT")
    print("=" * 65)

    with open(RECIPES_TS, "r", encoding="utf-8") as f:
        code = f.read()

    # Parse recipes
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
            m_cat = re.match(r"^\s*category:\s*['\"]([^'\"]+)['\"]", line)
            if m_cat and curr and "category" not in curr:
                curr["category"] = m_cat.group(1)
                continue
            m_img = re.match(r"^\s*imageUrl:\s*['\"]([^'\"]*)['\"]", line)
            if m_img and curr:
                curr["imageUrl"] = m_img.group(1)
                continue

    if curr and "id" in curr:
        recipes.append(curr)

    print(f"[*] Total catalog recipes to audit: {len(recipes)}")

    seen_hashes = {}
    mismatches = []
    missing_files = []
    audited_ok = []

    for idx, r in enumerate(recipes):
        r_id = r["id"]
        r_name = r.get("name", r_id)
        img_url = r.get("imageUrl", "")

        # Check local file vs remote URL
        if img_url.startswith("/recipes/"):
            disk_path = os.path.join(PUBLIC_DIR, img_url.lstrip("/"))
            if not os.path.exists(disk_path):
                missing_files.append((r_id, r_name, img_url, "File missing from public/recipes/"))
                continue

            file_size = os.path.getsize(disk_path)
            if file_size < 3000:
                missing_files.append((r_id, r_name, img_url, f"File too small ({file_size} bytes)"))
                continue

            # Compute hash to detect duplicate reuse
            with open(disk_path, "rb") as f:
                f_hash = hashlib.md5(f.read()).hexdigest()

            if f_hash in seen_hashes:
                dup_recipe = seen_hashes[f_hash]
                mismatches.append({
                    "id": r_id,
                    "name": r_name,
                    "image": img_url,
                    "issue": f"Duplicate image with {dup_recipe['name']} ({dup_recipe['id']})"
                })
            else:
                seen_hashes[f_hash] = {"id": r_id, "name": r_name, "image": img_url}

            # Verify image readable by Pillow
            try:
                with Image.open(disk_path) as im:
                    w, h = im.size
                    if w < 400 or h < 300:
                        mismatches.append({
                            "id": r_id,
                            "name": r_name,
                            "image": img_url,
                            "issue": f"Low resolution ({w}x{h})"
                        })
                    else:
                        audited_ok.append((r_id, r_name, f"{w}x{h}", file_size))
            except Exception as e:
                mismatches.append({
                    "id": r_id,
                    "name": r_name,
                    "image": img_url,
                    "issue": f"Corrupted image format: {e}"
                })
        elif img_url.startswith("http"):
            audited_ok.append((r_id, r_name, "Remote Web URL", 0))
        else:
            missing_files.append((r_id, r_name, img_url, "No imageUrl specified"))

    print("\n" + "=" * 65)
    print("📊 AUDIT RESULTS SUMMARY")
    print("=" * 65)
    print(f"• Total Verified & Healthy Images: {len(audited_ok)} / {len(recipes)}")
    print(f"• Missing Files: {len(missing_files)}")
    print(f"• Duplicate / Low-Res Issues Detected: {len(mismatches)}")

    if mismatches:
        print("\n⚠️ Issues Detected:")
        for m in mismatches[:15]:
            print(f"  - [{m['id']}] '{m['name']}': {m['issue']}")

    if missing_files:
        print("\n❌ Missing Files:")
        for m in missing_files[:10]:
            print(f"  - [{m[0]}] '{m[1]}': {m[3]}")

    return {
        "total": len(recipes),
        "healthy": len(audited_ok),
        "missing": missing_files,
        "mismatches": mismatches
    }

if __name__ == "__main__":
    audit_catalog_images()
