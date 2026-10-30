"""
Audits and corrects language dialect, grammar, and redundant terminology across the codebase:
1. Eliminates "Suggested SRP" RAS-syndrome redundancy (Suggested Suggested Retail Price) -> replaced with "Presyo ng Benta (SRP)" or "Suggested Retail Price (SRP)" or "SRP".
2. Enhances Philippine business/carinderia dialect consistency across UI and exports.
"""

import os
import re

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))

def patch_file(rel_path, replacements):
    fpath = os.path.join(BASE_DIR, rel_path)
    if not os.path.exists(fpath):
        print(f"File not found: {rel_path}")
        return
    with open(fpath, "r", encoding="utf-8") as f:
        content = f.read()
    
    modified = content
    for old_txt, new_txt in replacements:
        if old_txt in modified:
            modified = modified.replace(old_txt, new_txt)
            print(f"  [Replaced in {rel_path}]: {repr(old_txt)[:40]} -> {repr(new_txt)[:40]}")
        else:
            print(f"  [Not found in {rel_path}]: {repr(old_txt)[:40]}")
            
    if modified != content:
        with open(fpath, "w", encoding="utf-8") as f:
            f.write(modified)
        print(f"[UPDATED]: {rel_path}")
    else:
        print(f"[UNCHANGED]: {rel_path}")

print("=== 1. PATCHING APP.TSX ===")
patch_file("src/App.tsx", [
    (
        "Suggested SRP",
        "Presyo ng Benta (SRP)"
    )
])

print("\n=== 2. PATCHING COSTINGCALCULATOR.TSX ===")
patch_file("src/components/CostingCalculator.tsx", [
    (
        "<span>Kalkulador ng Puhunan at Suggested SRP</span>",
        "<span>Kalkulador ng Puhunan at Presyo ng Benta (SRP)</span>"
    ),
    (
        "{/* Suggested SRP */}",
        "{/* Presyo ng Benta (SRP) */}"
    ),
    (
        "<span>Suggested SRP</span>",
        "<span>Presyo ng Benta (SRP)</span>"
    )
])

print("\n=== 3. PATCHING RECIPECARD.TSX ===")
patch_file("src/components/RecipeCard.tsx", [
    (
        '<span className="block text-[11px] text-orange-700 font-medium">Suggested SRP</span>',
        '<span className="block text-[11px] text-orange-700 font-medium">Presyo ng Benta (SRP)</span>'
    )
])

print("\n=== 4. PATCHING BRANDIMAGEEXPORTER.TS ===")
patch_file("src/utils/brandImageExporter.ts", [
    (
        "// Card 1: Suggested SRP",
        "// Card 1: Presyo ng Benta (SRP)"
    ),
    (
        "ctx.fillText('SUGGESTED SRP / BENTA', 65, cardY + 36);",
        "ctx.fillText('PRESYO NG BENTA (SRP)', 65, cardY + 36);"
    )
])

print("\n=== 5. PATCHING COFFEEMILKTEAPAGE.TSX ===")
patch_file("src/components/CoffeeMilkteaPage.tsx", [
    (
        "'Suggested Walk-In SRP (PHP)'",
        "'Walk-In SRP (PHP)'"
    )
])

print("\n=== 6. PATCHING GENERATE_MASTER_GOOGLE_SHEETS.PY ===")
patch_file("scripts/recipe-pipeline/generate_master_google_sheets.py", [
    (
        '"Suggested SRP (PHP)": suggested_srp,',
        '"Suggested Retail Price - SRP (PHP)": suggested_srp,'
    )
])

print("\n=== ALL DIALECT & GRAMMAR PATCHES COMPLETE ===")
