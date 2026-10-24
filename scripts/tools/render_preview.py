from playwright.sync_api import sync_playwright
import os

html_path = os.path.abspath(r'C:\Users\mic fano\.gemini\antigravity\brain\9cab03bb-d8ff-408b-aa09-850ae10dda0a\scratch\recipe_adobo.html')
output_png = os.path.abspath(r'C:\Users\mic fano\.gemini\antigravity\brain\9cab03bb-d8ff-408b-aa09-850ae10dda0a\scratch\recipe_adobo_preview.png')

print("Rendering HTML from:", html_path)

with sync_playwright() as p:
    browser = p.chromium.launch()
    # Set high device scale factor for ultra-sharp crisp text
    page = browser.new_page(viewport={"width": 1200, "height": 1800}, device_scale_factor=2)
    page.goto(f'file:///{html_path}')
    page.wait_for_load_state('networkidle')
    page.screenshot(path=output_png, full_page=True)
    browser.close()

print("Render complete! Saved to:", output_png)
print("File size:", os.path.getsize(output_png) / 1024, "KB")
