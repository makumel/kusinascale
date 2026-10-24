from playwright.sync_api import sync_playwright
import os

output_png = os.path.abspath(r'C:\Users\mic fano\.gemini\antigravity\brain\9cab03bb-d8ff-408b-aa09-850ae10dda0a\scratch\calculator_modal_preview.png')

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": 1440, "height": 1100}, device_scale_factor=1.5)
    page.goto('http://localhost:5173/')
    page.wait_for_timeout(1000)
    # Click the first recipe card's Kalkulahin button
    page.locator('button:has-text("Kalkulahin")').first.click()
    page.wait_for_timeout(1000)
    page.screenshot(path=output_png, full_page=False)
    browser.close()

print("Modal screenshot captured to:", output_png)
