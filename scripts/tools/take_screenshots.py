import os
import sys
from playwright.sync_api import sync_playwright

artifact_dir = r"C:\Users\mic fano\.gemini\antigravity\brain\19f49e28-a275-492b-b168-37b997974b3e"
os.makedirs(artifact_dir, exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": 1440, "height": 950}, device_scale_factor=1.5)
    
    # 1. Main Catalog Overview
    print("Navigating to http://localhost:5173/ ...")
    page.goto("http://localhost:5173/", wait_until="networkidle")
    page.wait_for_timeout(2000)
    
    catalog_shot = os.path.join(artifact_dir, "kusinascale_catalog_overview.png")
    page.screenshot(path=catalog_shot, full_page=False)
    print(f"Captured: {catalog_shot}")
    
    # 2. Filter Carinderia Category
    print("Clicking Carinderia category...")
    carinderia_btn = page.locator("button:has-text('Carinderia Bestsellers')").first
    if carinderia_btn.is_visible():
        carinderia_btn.click()
        page.wait_for_timeout(1500)
        
    carinderia_shot = os.path.join(artifact_dir, "kusinascale_carinderia_bestsellers.png")
    page.screenshot(path=carinderia_shot, full_page=False)
    print(f"Captured: {carinderia_shot}")
    
    # 3. Open Costing Calculator Modal
    print("Opening Costing Calculator...")
    calc_btn = page.locator("button:has-text('Kalkulahin')").first
    if calc_btn.is_visible():
        calc_btn.click()
        page.wait_for_timeout(1500)
        
    calc_shot = os.path.join(artifact_dir, "kusinascale_costing_calculator.png")
    page.screenshot(path=calc_shot, full_page=False)
    print(f"Captured: {calc_shot}")
    
    browser.close()

print("All screenshots successfully captured!")
