'use client';

import React from 'react';

import { useAccount, useReadContract } from 'wagmi';

import PortfolioOverview from '@/components/portfolio/overview';

const CONTRACT_ADDRESS = '0x23b838A2b6B9158de82eb261a818D07EC5ab0624';
const getUserTokensABI = [
  {
    type: 'function',
    name: 'getUserTokens',
    inputs: [{ name: 'user', type: 'address', internalType: 'address' }],
    outputs: [
      {
        name: '',
        type: 'tuple[]',
        internalType: 'struct Bundler.UserTokens[]',
        components: [
          { name: 'token', type: 'address', internalType: 'address' },
          { name: 'decimals', type: 'uint8', internalType: 'uint8' },
          { name: 'balance', type: 'uint256', internalType: 'uint256' }
        ]
      }
    ],
    stateMutability: 'view'
  }
] as const;
export default function PortfolioPage() {
  const { address } = useAccount();
  const { data } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: getUserTokensABI,
    functionName: 'getUserTokens',
    args: [address || '0x']
  });

  return <PortfolioOverview />;
}
