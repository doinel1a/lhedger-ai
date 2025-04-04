import React from 'react';

import type { PropsWithChildren } from 'react';

import { CartProvider } from './client/cart-context';
import HeroUiProvider from './client/hero-ui';
import ThemeProvider from './client/theme';
import Web3Provider from './client/web3';

type TRootProvider = PropsWithChildren;

export default function RootProvider({ children }: TRootProvider) {
  return (
    <HeroUiProvider>
      <ThemeProvider>
        <Web3Provider>
          <CartProvider>{children}</CartProvider>
        </Web3Provider>
      </ThemeProvider>
    </HeroUiProvider>
  );
}
