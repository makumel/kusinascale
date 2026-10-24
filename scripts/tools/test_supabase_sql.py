import urllib.request
import json

url = "https://eeetozfjqqrozwysjsgk.supabase.co/pg/query"
headers = {
    "apikey": "sanitized_secret_placeholder",
    "Authorization": "Bearer sanitized_secret_placeholder",
    "Content-Type": "application/json"
}

body = json.dumps({"query": "SELECT table_name FROM information_schema.tables WHERE table_schema='public';"}).encode()
req = urllib.request.Request(url, data=body, headers=headers)

try:
    with urllib.request.urlopen(req) as resp:
        print("Status:", resp.status)
        print("Response:", resp.read().decode())
except urllib.error.HTTPError as e:
    print("HTTPError:", e.code, e.read().decode())
except Exception as e:
    print("Error:", e)
