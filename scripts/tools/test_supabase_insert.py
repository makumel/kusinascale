import urllib.request
import json

url = "https://eeetozfjqqrozwysjsgk.supabase.co/rest/v1/kusina_suggestions"
headers = {
    "apikey": "sanitized_secret_placeholder",
    "Authorization": "Bearer sanitized_secret_placeholder",
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
