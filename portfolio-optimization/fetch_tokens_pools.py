import json
from web3 import Web3

# ======= CONFIG =======
TOKENS_JSON = "aerodrome_uniswap_tokens.json"
OUTPUT_JSON = "uniswap_base_usdc_tokens_with_pools.json"

RPC_URL = "https://base-mainnet.g.alchemy.com/v2/7VwLCuUFsc4rBHSv7EbXP03o-s-FzMR6"  # your actual Base RPC endpoint

FACTORY_ADDRESS = "0x33128a8fC17869897dcE68Ed026d694621f6FDfD"
USDC_ADDRESS    = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"

FEE_TIERS = [100, 500, 3000, 10000]

FACTORY_ABI = [
    {
        "name": "getPool",
        "type": "function",
        "stateMutability": "view",
        "inputs": [
            {"internalType": "address", "name": "tokenA", "type": "address"},
            {"internalType": "address", "name": "tokenB", "type": "address"},
            {"internalType": "uint24",  "name": "fee",    "type": "uint24"}
        ],
        "outputs": [{"internalType": "address", "name": "pool", "type": "address"}]
    }
]

web3 = Web3(Web3.HTTPProvider(RPC_URL))
factory = web3.eth.contract(
    address=web3.to_checksum_address(FACTORY_ADDRESS),
    abi=FACTORY_ABI
)


def get_numeric_address(addr: str) -> int:
    return int(addr.lower(), 16)

with open(TOKENS_JSON, "r", encoding="utf-8") as f:
    tokens = json.load(f)

tokens_with_pools = []

for t in tokens:
    print(f"Checking token {t['TOKEN_NAME']}...")
    contract_info = t.get("contract_address", {})
    base_addr_str = contract_info.get("base", "")
    token_address = base_addr_str
    if not token_address:
        continue

    # Convert addresses to numeric form for ordering
    token_addr_num = get_numeric_address(token_address)
    usdc_addr_num  = get_numeric_address(USDC_ADDRESS)

    if token_addr_num < usdc_addr_num:
        token0 = web3.to_checksum_address(token_address)
        token1 = web3.to_checksum_address(USDC_ADDRESS)
    else:
        token0 = web3.to_checksum_address(USDC_ADDRESS)
        token1 = web3.to_checksum_address(token_address)

    supported_fees = []
    for fee in FEE_TIERS:
        pool_addr = factory.functions.getPool(token0, token1, fee).call()
        if pool_addr != "0x0000000000000000000000000000000000000000":
            supported_fees.append(fee)

    if supported_fees:
        t["uniV3FeeTier"] = supported_fees
        tokens_with_pools.append(t)

with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
    json.dump(tokens_with_pools, f, indent=2)

print(f"✅ Found {len(tokens_with_pools)} tokens that have a USDC pool on Base. Saved to {OUTPUT_JSON}.")
