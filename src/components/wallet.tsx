import React from 'react';

import { Avatar, Name } from '@coinbase/onchainkit/identity';
import {
  Wallet as CoinbaseWallet,
  ConnectWallet,
  WalletAdvancedAddressDetails,
  WalletAdvancedTokenHoldings,
  WalletAdvancedTransactionActions,
  WalletAdvancedWalletActions,
  WalletDropdown
} from '@coinbase/onchainkit/wallet';

export default function Wallet() {
  return (
    <CoinbaseWallet className='h-10'>
      <ConnectWallet className='flex h-10 items-center justify-center'>
        <Avatar className='h-6' />
        <Name className='text-base' />
      </ConnectWallet>
      <WalletDropdown>
        <WalletAdvancedWalletActions />
        <WalletAdvancedAddressDetails />
        <WalletAdvancedTransactionActions />
        <WalletAdvancedTokenHoldings />
      </WalletDropdown>
    </CoinbaseWallet>
  );
}
