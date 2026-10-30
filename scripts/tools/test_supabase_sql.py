import urllib.request
import json
import os

url = "https://eeetozfjqqrozwysjsgk.supabase.co/pg/query"
secret_key = os.environ.get("SUPABASE_SECRET_KEY", "your-supabase-secret-key")
headers = {
    "apikey": secret_key,
    "Authorization": f"Bearer {secret_key}",
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
