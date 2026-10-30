import urllib.request
import json
import os

url = "https://eeetozfjqqrozwysjsgk.supabase.co/rest/v1/kusina_suggestions"
secret_key = os.environ.get("SUPABASE_SECRET_KEY", "your-supabase-secret-key")
headers = {
    "apikey": secret_key,
    "Authorization": f"Bearer {secret_key}",
    "Content-Type": "application/json",
    "Prefer": "return=representation"
}

data = json.dumps({
    "recipe_name": "Test Adobo Especial",
    "category": "Carinderia Bestseller",
    "notes": "Testing backend persistence"
}).encode()

req = urllib.request.Request(url, data=data, headers=headers)

try:
    with urllib.request.urlopen(req) as resp:
        print("Success! Response:", resp.read().decode())
except urllib.error.HTTPError as e:
    print("HTTPError:", e.code, e.read().decode())
except Exception as e:
    print("Error:", e)
