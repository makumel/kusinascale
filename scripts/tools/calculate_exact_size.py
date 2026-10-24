import urllib.request
import re

subfolders = [
    ("American Burgers & Sandwiches", "1OmyHiqh_eY3tYTqqjmyNBwI61-eo4Cxz"),
    ("Carinderia pinoy recipes", "1wgMo6TkkoCezLUAbqQUlMul3DT9lACcM"),
    ("Chinese Appetizers", "1NFwPfsYIu-K50Qo8JGU9OpiKBG_wTMBo"),
    ("Chinese Beef Recipes", "1QNAnRZ7APzBrDgy8OMg_0jLXem2k1xok"),
    ("Chinese Chicken Recipes", "1xYL2TvuID9XiKM9WaiWp11eiImx6WIf9"),
    ("Chinese pork recipes", "1njOgrZ-YOj10wMD32ZlVv4to8hnO2K9V"),
    ("Chinese Soups", "1p9DN1u3n8DS6PZdsJp_QUH2_dsNLbwpa"),
    ("Filipino beef recipes", "1vKmQSSTfW4DO9eOtaDHJ4SaF-FCiTf9w"),
    ("Filipino chicken recipes", "1cobRFCee601rmCImuRU7hFw-Ge9dlCBZ"),
    ("Filipino cuisine with a twist", "10WmKQiZhVwUeCziFobDfWzV48LkOahW4"),
    ("Filipino Dessert", "1zYpCOaz-RnQZHv7oMAiWcWhb-3J3OpYM"),
    ("Filipino drinks", "1A8oMOoIQuO1fyJM3AKULYDMq4IdY62HO"),
    ("Filipino pork recipes", "1XFxbP43KaxFMQec4c5gNT0myBjSj4Spj"),
    ("Filipino seafood/fish recipes", "1087T_Yso9obzNZ1twGOa0YUgwDiy4MM5"),
    ("Filipino vegetable recipes", "1Wtfrs19TJfP-34tnQPnM8tJ2qSAXBEzX"),
    ("Filipino (ILOCANO) recipes", "1wcdAYOZaqZwFNGhsmze2QSXmdfcebS6X"),
    ("France recipes", "1LhqwJ-dSWgkwYC7H37o3ly9Px2LRjfbk"),
    ("German recipes", "1QPPnDUKDO0JAwxpoMU3yI9vrf_teL6FV"),
    ("Greece recipes", "14b7Hw1Low4dBtb_1eFmiGpSj11Qaw9yJ"),
    ("Italian pizza", "1YPT-axEnnmzYV9f99YC5fWDpL4pmiEv9"),
    ("Italian Recipes", "18g5ND1Eo4fIA3gauIN6c8-IgbXgh5Sjf"),
    ("Italian seafood recipes", "12FxWMJYke5c5Bl4porrOITCS5Gw6ALGx"),
    ("Japanese appetizers", "1BExU2sKeWBVwAH-hXHqHZ1Ftf2n20v20"),
    ("Japanese Ramen", "1Bqz7BZUJqpmZ8J1VCVPnrIwrrTBZRRBN"),
    ("Korean Chicken recipes", "19YBMrch4JuLT1NadfY_DqUkmBXIQzxVs"),
    ("Mexican burrito", "1F5uMsVBU69O3NwSWEAVj33xtR7rViySV"),
    ("Mexican tacos", "1tZ8yoIn6Jn0MrKRppy-225REXS97X7nx"),
    ("Spanish recipes", "1qAU1gYcQmfMpnVLXpnxioUuOY5lZujF9"),
    ("Thai cuisine", "1E1IEQSicy4Loe0jbX9TsAUMoXnmg0dn1"),
    ("Turkish recipes", "1VzmNxAgpPd0YIypU0ZOMYKU9iYFzp1KN"),
    ("UK RECIPES", "1NgxgnDsCC7KXYShbypuwTjQFr5YW_W7W"),
    ("Vietnamese recipes", "1G61h_jmFTYbShtrSWH2H4nrqlenn_XsE")
]

def parse_size_str(s):
    s = s.strip().upper()
    m = re.match(r'([\d\.]+)\s*(KB|MB|GB|B)', s)
    if not m:
        return 0.0
    val, unit = float(m.group(1)), m.group(2)
    if unit == 'KB':
        return val / 1024
    elif unit == 'MB':
        return val
    elif unit == 'GB':
        return val * 1024
    return 0.0

total_files = 0
total_size_mb = 0.0

print(f"{'Folder Name':<35} | {'Files':<6} | {'Size (MB)':<10}")
print("-" * 57)

for name, fid in subfolders:
    url = f'https://drive.google.com/drive/folders/{fid}'
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            raw = resp.read().decode('utf-8', errors='ignore')
        
        folder_mb = 0.0
        folder_files = 0
        for row_html in re.findall(r'<tr [^>]*data-id="[a-zA-Z0-9_\-]{25,45}".*?</tr>', raw, re.DOTALL):
            text = re.sub(r'<[^>]+>', ' | ', row_html)
            m = re.search(r'\|\s*(\d+(?:\.\d+)?\s*(?:KB|MB|GB))\s*\|', text)
            if m:
                sz = parse_size_str(m.group(1))
                folder_mb += sz
                folder_files += 1

        total_files += folder_files
        total_size_mb += folder_mb
        print(f"{name:<35} | {folder_files:<6} | {folder_mb:<10.2f}")
    except Exception as e:
        print(f"Error on {name}: {e}")

print("=" * 57)
print(f"TOTAL: {total_files} files across 32 folders")
print(f"TOTAL SIZE: {total_size_mb:.2f} MB (~{total_size_mb/1024:.2f} GB)")
