export const aaveDepositTool = {
  type: 'function',
  function: {
    name: 'aave-deposit',
    description: 'Can deposit tokens into AAVE lending protocol.',
    parameters: {
      type: 'object',
      properties: {
        asset: {
          type: 'string',
          description: 'The asset to deposit. When user says ETH or BTC, it means cbETH or cbBTC.',
          enum: ['LBTC', 'USDbC', 'EURC', 'USDC', 'cbBTC', 'cbETH', 'WETH']
        },
        amount: { type: 'number', description: 'Amount to deposit.' }
      },
      required: ['asset', 'amount']
    }
  }
};

export const aaveBorrowTool = {
  type: 'function',
  function: {
    name: 'aave-borrow',
    description: 'Can borrow tokens from AAVE lending protocol.',
    parameters: {
      type: 'object',
      properties: {
        asset: {
          type: 'string',
          description: 'The asset to borrow.',
          enum: ['USDbC', 'EURC', 'USDC', 'cbBTC', 'cbETH', 'WETH']
        },
        amount: { type: 'number', description: 'Amount to borrow.' }
      },
      required: ['asset', 'amount']
    }
  }
};

export const aerodromeSwapTool = {
  type: 'function',
  function: {
    name: 'aerodrome-swap',
    description: 'Can swap tokens on Aerodrome.',
    parameters: {
      type: 'object',
      properties: {
        fromToken: {
          type: 'string',
          description: 'The token to swap from.',
          enum: ['USDbC', 'EURC', 'USDC', 'cbBTC', 'cbETH', 'WETH']
        },
        toToken: {
          type: 'string',
          description: 'The token to swap to.',
          enum: ['USDbC', 'EURC', 'USDC', 'cbBTC', 'cbETH', 'WETH']
        },
        amount: { type: 'number', description: 'Amount to swap.' }
      },
      required: ['fromToken', 'toToken', 'amount']
    }
  }
};

export const aerodromeLiquidityProviderTool = {
  type: 'function',
  function: {
    name: 'aerodrome-liquidity-provider',
    description: 'Can provide liquidity on Aerodrome.',
    parameters: {
      type: 'object',
      properties: {
        tokenA: {
          type: 'string',
          description: 'The first token to provide liquidity for.',
          enum: ['USDbC', 'EURC', 'USDC', 'cbBTC', 'cbETH', 'WETH']
        },
        tokenB: {
          type: 'string',
          description: 'The second token to provide liquidity for.',
          enum: ['USDbC', 'EURC', 'USDC', 'cbBTC', 'cbETH', 'WETH']
        },
        amountA: { type: 'number', description: 'Amount of the first token to provide.' },
        amountB: { type: 'number', description: 'Amount of the second token to provide.' }
      },
      required: ['tokenA', 'tokenB', 'amountA', 'amountB']
    }
  }
};
