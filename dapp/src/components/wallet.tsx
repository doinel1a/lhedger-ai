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

import { cn } from '@/lib/utils';

type TWallet = {
  isSidebarExpanded: boolean;
};

export default function Wallet({ isSidebarExpanded }: TWallet) {
  return (
    <CoinbaseWallet className={cn('w-full', { 'w-10': !isSidebarExpanded })}>
      <ConnectWallet className='flex h-10 w-full items-center justify-center'>
        <Avatar className='size-[18px]' />
        {isSidebarExpanded && <Name className='text-base' />}
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
