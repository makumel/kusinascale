import urllib.request
import urllib.parse
import os

prompt = "Close-up hero shot of Filipino Chicken Adobo in a rustic ceramic bowl, tender chicken drumstick in glossy dark savory sauce, bay leaf, commercial food photography, warm kitchen light"
encoded_prompt = urllib.parse.quote(prompt)

url = f"https://image.pollinations.ai/prompt/{encoded_prompt}?width=800&height=600&model=flux&seed=42&nologo=true"
save_path = r"C:\Users\mic fano\.gemini\antigravity\brain\9cab03bb-d8ff-408b-aa09-850ae10dda0a\scratch\pollinations_adobo.jpg"

print("Requesting free image from Pollinations.ai (Flux model)...")
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})

try:
    with urllib.request.urlopen(req, timeout=30) as resp:
        data = resp.read()
        with open(save_path, 'wb') as f:
            f.write(data)
    print("Success! File size:", len(data) / 1024, "KB")
except Exception as e:
    print("Error:", e)
