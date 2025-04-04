# app.py

from flask import Flask, request, jsonify
import numpy as np
import pandas as pd
import json

app = Flask(__name__)

# ========================
# Load cached OHLCV parquet
# ========================

DATA_PATH = "aerodrome_uniswap_ohlcv.parquet"
print("📦 Loading cached OHLCV data...")
ohlcv = pd.read_parquet(DATA_PATH)
print("✅ Loaded successfully")


# For the portfolio endpoint, we still need the available token names from the OHLCV data.
available_tokens = ohlcv["TOKEN_NAME"].unique().tolist()

@app.route('/supported-tokens', methods=['GET'])
def supported_tokens():
    try:
        with open("aerodrome_uniswap_tokens.json", "r", encoding="utf-8") as f:
            tokens = json.load(f)
        return jsonify(tokens)
    except Exception as e:
        return jsonify({"error": str(e)}), 500




@app.route('/portfolio', methods=['POST'])
def optimize():
    data = request.get_json()
    
    if 'assets' not in data or not isinstance(data['assets'], list):
        return jsonify({"error": "Missing or invalid 'assets' list"}), 400
    
    asset_names = data['assets']

    # Check if requested assets are available
    unsupported = [token for token in asset_names if token not in available_tokens]
    if unsupported:
        return jsonify({"error": f"Unsupported token(s): {unsupported}"}), 400

    # Filter only requested tokens
    ohlcv_filtered = ohlcv[ohlcv['TOKEN_NAME'].isin(asset_names)]

    # Pivot
    prices = ohlcv_filtered.pivot_table(
        index='DATE',
        columns='TOKEN_NAME',
        values='CLOSE',
        aggfunc='last'
    ).dropna()

    # Returns
    returns = prices.pct_change().dropna()

    # Mean & Cov
    mean_returns = returns.mean()
    cov_matrix = returns.cov()

    # =====================
    # === MARKOWITZ CORE ===
    # =====================
    num_portfolios = 100000
    results = np.zeros((3, num_portfolios))
    weights_record = []

    for i in range(num_portfolios):
        weights = np.random.random(len(asset_names))
        weights /= np.sum(weights)
        weights_record.append(weights)

        portfolio_return = np.sum(weights * mean_returns)
        portfolio_stddev = np.sqrt(np.dot(weights.T, np.dot(cov_matrix, weights)))
        sharpe_ratio = portfolio_return / portfolio_stddev

        results[0, i] = portfolio_return
        results[1, i] = portfolio_stddev
        results[2, i] = sharpe_ratio

    max_sharpe_idx = np.argmax(results[2])
    optimal_weights = weights_record[max_sharpe_idx]
    max_sharpe_ratio = results[2, max_sharpe_idx]

    return jsonify({
        "optimal_weights": dict(zip(asset_names, optimal_weights.tolist())),
        "max_sharpe_ratio": max_sharpe_ratio
    })

if __name__ == '__main__':
    app.run(debug=True)
