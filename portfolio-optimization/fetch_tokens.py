import requests
import pandas as pd
import json

url = "https://api.tokenmetrics.com/v2/tokens"
params = {
    "exchange": "aerodrome-base,uniswap-v3-base",
    "limit": 1000,
    "page": 0
}
headers = {
    "api_key": "API-KEY"
}

all_tokens = []

while True:
    response = requests.get(url, params=params, headers=headers)
    data = response.json()

    if not data.get("success"):
        print("❌ API call failed:", data.get("message", "No message"))
        break

    all_tokens.extend(data["data"])

    if len(data["data"]) < params["limit"]:
        break

    params["page"] += 1

# Save as JSON
with open("aerodrome_uniswap_tokens.json", "w") as f:
    json.dump(all_tokens, f, indent=2)

# Save as Parquet
df = pd.json_normalize(all_tokens)
df.to_parquet("aerodrome_uniswap_tokens.parquet", index=False)

print(f"✅ Done. Tokens saved: {len(df)}")
