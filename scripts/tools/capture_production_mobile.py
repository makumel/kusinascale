from playwright.sync_api import sync_playwright
import os

output_png = os.path.abspath(r'C:\Users\mic fano\.gemini\antigravity\brain\9cab03bb-d8ff-408b-aa09-850ae10dda0a\scratch\kusinakita_production_proof.png')

with sync_playwright() as p:
    browser = p.chromium.launch()
    # Emulate mobile iPhone 14 / modern smartphone view
    context = browser.new_context(
        viewport={"width": 390, "height": 844},
        user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1",
        device_scale_factor=2
    )
    page = context.new_page()
    page.goto('https://kusinakita.mikabiz.space', wait_until='networkidle')
    page.wait_for_timeout(2000)
    page.screenshot(path=output_png, full_page=False)
    browser.close()

print("Mobile screenshot saved to:", output_png)
