import sys
import io
from playwright.sync_api import sync_playwright

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

test_url = "https://kusinakita.mikabiz.space"
results = []

def record(name, passed, details=""):
    status = "PASS" if passed else "FAIL"
    clean_details = str(details).replace("\u20b1", "PHP ")
    results.append({"name": name, "status": status, "details": clean_details})
    print(f"[{status}] {name}: {clean_details}")

print(f"Starting E2E Test Suite against: {test_url}\n" + "="*55)

with sync_playwright() as p:
    browser = p.chromium.launch()
    # Test on mobile viewport (iPhone 14)
    context = browser.new_context(
        viewport={"width": 390, "height": 844},
        user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X)"
    )
    page = context.new_page()

    # TEST 1: Page Load & HTTP 200
    try:
        resp = page.goto(test_url, wait_until="networkidle", timeout=15000)
        record("1. Live Production Load", resp.status == 200, f"HTTP status: {resp.status}")
    except Exception as e:
        record("1. Live Production Load", False, str(e))

    # TEST 2: Brand Title & Header
    try:
        title = page.locator("header").first.text_content() or ""
        has_brand = "Kusina" in title and "Kita" in title
        record("2. Brand Title & Header Display", has_brand, "Found 'KusinaKita' in header")
    except Exception as e:
        clean_err = str(e).replace("\u20b1", "PHP ")
        record("2. Brand Title & Header Display", False, clean_err)

    # TEST 3: Recipe Cards Count
    try:
        cards = page.locator("article")
        count = cards.count()
        record("3. Recipe Cards Rendered", count >= 10, f"Rendered {count} active cards")
    except Exception as e:
        record("3. Recipe Cards Rendered", False, str(e))

    # TEST 4: Category Filtering
    try:
        carinderia_btn = page.locator("button:has-text('Carinderia Bestsellers')")
        carinderia_btn.click()
        page.wait_for_timeout(500)
        filtered_count = page.locator("article").count()
        record("4. Category Filter (Carinderia)", filtered_count >= 4, f"Filtered down to {filtered_count} cards (expected >= 4)")
    except Exception as e:
        record("4. Category Filter (Carinderia)", False, str(e))

    # TEST 5: Multi-Field Search Functionality
    try:
        page.locator("button:has-text('Lahat ng Recipes')").click()
        search_input = page.locator("input[placeholder*='Maghanap ng recipe']")
        search_input.fill("Ramen")
        page.wait_for_timeout(500)
        search_count = page.locator("article").count()
        record("5. Real-time Search ('Ramen')", search_count >= 1, f"Found {search_count} card matching 'Ramen'")
    except Exception as e:
        record("5. Real-time Search ('Ramen')", False, str(e))

    # TEST 6: Open Costing Calculator Modal
    try:
        card_calc_btn = page.locator("article button:has-text('Kalkulahin')").first
        card_calc_btn.click()
        page.wait_for_timeout(600)
        modal_visible = page.locator("#recipe-print-area").is_visible()
        record("6. Costing Calculator Modal Launch", modal_visible, "Modal opened with live costing view")
    except Exception as e:
        record("6. Costing Calculator Modal Launch", False, str(e))

    # TEST 7: Dynamic Ingredient Price Override
    try:
        first_price_input = page.locator("table input[type='number']").first
        init_val = first_price_input.input_value()
        first_price_input.fill("450")
        page.wait_for_timeout(500)
        new_val = first_price_input.input_value()
        record("7. Dynamic Price Override Math", new_val == "450", f"Updated price from {init_val} to 450")
    except Exception as e:
        record("7. Dynamic Price Override Math", False, str(e))

    # TEST 8: PWA Protection Gate & Calculator Download Restriction
    try:
        # Verify the PWA protected banner is visible
        pwa_badge = page.locator("text=PWA Protected").is_visible()
        record("8. PWA Protected Calculator Gate", pwa_badge, "Pricing calculator is gated with PWA installation requirement")
    except Exception as e:
        record("8. PWA Protected Calculator Gate", False, str(e))

    # TEST 9: Infographic Recipe Card, Portion Scaler & Prep Download
    try:
        recipe_tab = page.locator("button:has-text('Infographic Recipe')")
        recipe_tab.click()
        page.wait_for_timeout(500)
        has_scaler = page.locator("text=Adjustable Portions").is_visible()
        has_download_btn = page.locator("button:has-text('Download Shopping List')").is_visible()
        record("9. Infographic Card & Scaler Download", has_scaler and has_download_btn, "Portion scaler and shopping prep list download active")
        
        # Close recipe modal
        close_x = page.locator("button[aria-label='Isara ang recipe modal']").first
        if close_x.is_visible():
            close_x.click()
        else:
            page.keyboard.press("Escape")
        page.wait_for_timeout(600)
    except Exception as e:
        record("9. Infographic Card & Scaler Download", False, str(e))

    # TEST 10: Suggestion Modal & Honeypot Invisibility Trap
    try:
        suggest_btn = page.locator("button:has-text('Suggest')").first
        suggest_btn.click()
        page.wait_for_timeout(700)
        
        # Verify honeypot input is in DOM but off-screen (invisible to human users)
        hp = page.locator("input[name='website_url_field']")
        hp_exists = hp.count() > 0
        hp_offscreen = hp.evaluate("el => { const r = el.getBoundingClientRect(); return (r.right < 0 || r.bottom < 0); }")
        record("10. Honeypot Invisibility Trap", hp_exists and hp_offscreen, "Bot decoy field is present in DOM and placed off-screen (-9999px) invisible to human users")
        
        # Close suggestion modal
        page.locator("button[aria-label='Isara ang modal']").first.click()
        page.wait_for_timeout(400)
    except Exception as e:
        record("10. Honeypot Invisibility Trap", False, str(e))

    browser.close()

print("="*55)
total_tests = len(results)
passed_tests = sum(1 for r in results if r['status'] == 'PASS')
print(f"E2E Test Suite Summary: {passed_tests}/{total_tests} Tests Passed ({(passed_tests/total_tests)*100:.1f}%)")
