import json
import pandas as pd
import tmai_api

# === CONFIG ===
API_KEY = "API-KEY"
INPUT_JSON = "aerodrome_uniswap_tokens.json"
OUTPUT_PARQUET = "aerodrome_uniswap_ohlcv.parquet"
START_DATE = "2025-01-01"
END_DATE = "2025-04-04"

# === INIT TM CLIENT ===
client = tmai_api.TokenMetricsClient(api_key=API_KEY)

# === LOAD TOKENS ===
with open(INPUT_JSON, "r", encoding="utf-8") as f:
    tokens = json.load(f)

token_ids = [str(t["TOKEN_ID"]) for t in tokens]

# === FETCH OHLCV ===
all_data = []

try:
    df = client.hourly_ohlcv.get_dataframe(
        token_id=",".join(token_ids),
        startDate=START_DATE,
        endDate=END_DATE
    )
    all_data.append(df)
    print(f"✅ {token_ids} done")
except Exception as e:
    print(f"❌ Failed for: {e}")

# === SAVE TO PARQUET ===
if all_data:
    full_df = pd.concat(all_data, ignore_index=True)
    full_df.to_parquet(OUTPUT_PARQUET, index=False)
    print(f"✅ Saved {len(full_df)} rows to {OUTPUT_PARQUET}")
else:
    print("⚠️ No OHLCV data fetched.")
