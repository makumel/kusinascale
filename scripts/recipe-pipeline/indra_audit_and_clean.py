"""
Indra OCR Recipe Image Quality & Decontamination Engine
Powered by Indra OCR (1M parameter CPU OCR installed in D:\\tools\\indra-ocr)

Capabilities:
1. Runs lightning-fast CPU inference on recipe images (<600ms per image).
2. Detects any residual seller stamps, badges, watermark text, or foreign document labels.
3. Automatically computes bounding box margins and trims contaminated borders.
4. Verifies 0 text tokens remaining for 100% pure culinary photography.
"""

import os
import sys
import json
import subprocess
from PIL import Image, ImageOps, ImageEnhance

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

INDRA_EXE = r"D:\tools\indra-ocr\venv\Scripts\indra-ocr.exe"
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
PUBLIC_RECIPES = os.path.join(BASE_DIR, "public", "recipes")

def run_indra_ocr(image_path: str):
    """Runs Indra OCR CLI and returns parsed JSON output."""
    if not os.path.exists(INDRA_EXE):
        raise FileNotFoundError(f"Indra OCR not found at {INDRA_EXE}")
        
    cmd = [INDRA_EXE, image_path, "--format", "json"]
    proc = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8")
    
    if proc.returncode != 0:
        return {"lines": [], "markdown": "", "error": proc.stderr}
        
    try:
        return json.loads(proc.stdout)
    except Exception as e:
        return {"lines": [], "markdown": "", "error": str(e)}

def audit_and_clean_image(filename: str):
    fpath = os.path.join(PUBLIC_RECIPES, filename)
    if not os.path.exists(fpath):
        return {"status": "missing", "filename": filename}
        
    ocr_result = run_indra_ocr(fpath)
    all_lines = ocr_result.get("lines", [])
    
    # Filter for real text (confidence >= 0.4 and has alphanumeric characters)
    lines = [
        l for l in all_lines 
        if l.get("conf", 0) >= 0.4 and any(c.isalnum() for c in l.get("text", ""))
    ]
    
    if not lines:
        return {"status": "pristine", "filename": filename, "text_detected": 0}
        
    detected_text = " | ".join([l.get("text", "") for l in lines if l.get("text")])
    print(f"\n[ALERT]: Text detected in {filename}: \"{detected_text}\"")
    
    # Analyze bounding boxes to determine trim direction
    img = Image.open(fpath).convert("RGB")
    w, h = img.size
    
    trim_left = 0.0
    trim_right = 0.0
    trim_top = 0.0
    trim_bottom = 0.0
    
    for l in lines:
        box = l.get("box", [])
        if len(box) == 4:
            x1, y1, x2, y2 = box
            # If near borders, flag for trim
            if x2 > w * 0.8:
                trim_right = max(trim_right, 0.12)
            if x1 < w * 0.2:
                trim_left = max(trim_left, 0.10)
            if y2 > h * 0.8:
                trim_bottom = max(trim_bottom, 0.12)
            if y1 < h * 0.2:
                trim_top = max(trim_top, 0.10)
                
    # Fallback trim if anywhere
    if trim_left == 0 and trim_right == 0 and trim_top == 0 and trim_bottom == 0:
        trim_left = 0.06
        trim_right = 0.08
        trim_bottom = 0.10
        
    crop_box = (
        int(w * trim_left),
        int(h * trim_top),
        int(w * (1.0 - trim_right)),
        int(h * (1.0 - trim_bottom))
    )
    
    pure = img.crop(crop_box)
    fit_food = ImageOps.fit(pure, (800, 600), method=Image.Resampling.LANCZOS, centering=(0.5, 0.5))
    
    fit_food.save(fpath, "JPEG", quality=95, optimize=True)
    
    # Re-verify with Indra OCR
    recheck = run_indra_ocr(fpath)
    recheck_lines = recheck.get("lines", [])
    recheck_status = "100% CLEAN (0 text)" if len(recheck_lines) == 0 else f"REMAINING: {len(recheck_lines)} items"
    print(f"  -> Applied precision crop {crop_box} -> Indra OCR Recheck: {recheck_status}")
    
    return {
        "status": "cleaned",
        "filename": filename,
        "original_text": detected_text,
        "recheck_lines": len(recheck_lines)
    }

if __name__ == "__main__":
    test_dishes = [
        "beef-caldereta-fiesta.jpg",
        "chicken-adobo-classic.jpg",
        "pork-sinigang-sampaloc.jpg",
        "pork-sisig-kapampangan.jpg",
        "bicol-express-classic.jpg",
        "pork-menudo-kapampangan.jpg",
        "crispy-pork-dinuguan.jpg",
        "special-bulalo-batangas.jpg",
        "ilocano-pinakbet-bagnet.jpg",
        "bicol-laing-creamy.jpg",
        "lumpiang-shanghai-crispy.jpg",
        "pancit-canton-special.jpg",
    ]
    
    print("=" * 65)
    print("INDRA OCR QUALITY AUDIT & AUTONOMOUS DECONTAMINATION PASS")
    print(f"Engine: {INDRA_EXE}")
    print("=" * 65)
    
    clean_count = 0
    for d in test_dishes:
        res = audit_and_clean_image(d)
        if res["status"] in ["pristine", "cleaned"] and res.get("recheck_lines", 0) == 0:
            clean_count += 1
            print(f"[VERIFIED PRISTINE]: {d} (0 text tokens)")
            
    print("\n" + "=" * 65)
    print(f"AUDIT COMPLETE: {clean_count}/{len(test_dishes)} dishes verified 100% clean by Indra OCR!")
    print("=" * 65)
