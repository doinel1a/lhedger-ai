import json
import pandas as pd
import tmai_api

# === CONFIG ===
API_KEY = "hackathon-9f72a4cd-b6c8-4f87-a5e2-abcdef123456"
INPUT_JSON = "aerodrome_uniswap_tokens.json"
OUTPUT_PARQUET = "aerodrome_uniswap_ohlcv.parquet"
START_DATE = "2024-04-04"
END_DATE = "2025-04-04"
BATCH_SIZE = 50

# === INIT TM CLIENT ===
client = tmai_api.TokenMetricsClient(api_key=API_KEY)

# === LOAD TOKENS ===
with open(INPUT_JSON, "r", encoding="utf-8") as f:
    tokens = json.load(f)

token_ids = [str(t["TOKEN_ID"]) for t in tokens]
total_tokens = len(token_ids)
print(f"Found {total_tokens} tokens")

# === FETCH OHLCV IN BATCHES ===
all_dataframes = []

# Make a list of sub-lists, each of length <= BATCH_SIZE
for i in range(0, len(token_ids), BATCH_SIZE):
    batch = token_ids[i : i + BATCH_SIZE]
    batch_string = ",".join(batch)

    print(f"⏳ Fetching {len(batch)} tokens (from index {i} to {i+len(batch)-1}) ...")

    try:
        # For hourly data, use: client.hourly_ohlcv.get_dataframe(...)
        df = client.daily_ohlcv.get_dataframe(
            token_id=batch_string,
            startDate=START_DATE,
            endDate=END_DATE
        )
        all_dataframes.append(df)
        print(f"✅ Batch done (size {len(batch)}). Data rows: {len(df)}")
    except Exception as e:
        print(f"❌ Failed batch {i // BATCH_SIZE + 1}: {e}")

# === COMBINE AND SAVE TO PARQUET ===
if all_dataframes:
    full_df = pd.concat(all_dataframes, ignore_index=True)
    full_df.to_parquet(OUTPUT_PARQUET, index=False)
    print(f"✅ Saved {len(full_df)} rows to {OUTPUT_PARQUET}")
else:
    print("⚠️ No OHLCV data fetched.")
