import os
import sys
from playwright.sync_api import sync_playwright

artifact_dir = r"C:\Users\mic fano\.gemini\antigravity\brain\19f49e28-a275-492b-b168-37b997974b3e"
os.makedirs(artifact_dir, exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": 1440, "height": 980}, device_scale_factor=1.5)
    
    print("Navigating to http://localhost:4173/ ...")
    page.goto("http://localhost:4173/", wait_until="networkidle")
    page.wait_for_timeout(2500)
    
    # 1. Hero & Navigation
    hero_shot = os.path.join(artifact_dir, "kusinascale_hero.png")
    page.screenshot(path=hero_shot, full_page=False)
    print("Saved:", hero_shot)
    
    # 2. Scroll to Recipe Grid Cards
    print("Scrolling to recipe grid...")
    page.evaluate("window.scrollBy(0, 520)")
    page.wait_for_timeout(2000)
    grid_shot = os.path.join(artifact_dir, "kusinascale_recipes_grid.png")
    page.screenshot(path=grid_shot, full_page=False)
    print("Saved:", grid_shot)
    
    # 3. Open Costing Calculator Modal
    print("Clicking Kalkulahin button...")
    page.locator("button:has-text('Kalkulahin')").first.click()
    page.wait_for_timeout(2000)
    modal_shot = os.path.join(artifact_dir, "kusinascale_costing_calculator.png")
    page.screenshot(path=modal_shot, full_page=False)
    print("Saved:", modal_shot)
        
    browser.close()

print("All screenshots successfully captured!")
