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
          description: 'The asset to deposit.',
          enum: ['LBTC', 'USDbC', 'EURC', 'USDC', 'GHO', 'cbBTC', 'cbETH', 'WETH']
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
          enum: ['USDbC', 'EURC', 'USDC', 'GHO', 'cbBTC', 'cbETH', 'WETH']
        },
        amount: { type: 'number', description: 'Amount to borrow.' }
      },
      required: ['asset', 'amount']
    }
  }
};
