'use client';

import React from 'react';

import type { PropsWithChildren } from 'react';

import { OnchainKitProvider } from '@coinbase/onchainkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { baseSepolia } from 'viem/chains';
import { createConfig, http, WagmiProvider } from 'wagmi';
import { coinbaseWallet } from 'wagmi/connectors';

import { env } from '@/env';

const wagmiConfig = createConfig({
  chains: [baseSepolia],
  connectors: [
    coinbaseWallet({
      appName: 'eth-bucharest-starter-template'
    })
  ],
  ssr: true,
  transports: {
    [baseSepolia.id]: http()
  }
});

const queryClient = new QueryClient();

type TWeb3Provider = PropsWithChildren;

export default function Web3Provider({ children }: TWeb3Provider) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider apiKey={env.NEXT_PUBLIC_ONCHAINKIT_API_KEY} chain={baseSepolia}>
          {children}
          <ReactQueryDevtools initialIsOpen={false} />
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
