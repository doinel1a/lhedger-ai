'use client';

import React, { useCallback, useState } from 'react';

import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { Address, erc20Abi } from 'viem';
import { useWriteContract } from 'wagmi';

import PortfolioChart from '@/components/charts/portfolio';
import { useCart } from '@/components/providers/client/cart-context';
import ScatterChart from '@/components/scatter/chart';

export const dynamic = 'force-dynamic';

export type TPortfolio = Record<string, number>;
const CONTRACT_ADDRESS = '0x23b838A2b6B9158de82eb261a818D07EC5ab0624';
const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';

const abi = [
  {
    type: 'function',
    name: 'executeBatchSwaps',
    inputs: [
      { name: 'totalAmount', type: 'uint256', internalType: 'uint256' },
      {
        name: 'swaps',
        type: 'tuple[]',
        internalType: 'struct Bundler.SwapUniV3[]',
        components: [
          { name: 'tokenOut', type: 'address', internalType: 'address' },
          { name: 'amountIn', type: 'uint256', internalType: 'uint256' },
          { name: 'fee', type: 'uint24', internalType: 'uint24' }
        ]
      }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  }
] as const;

export default function CheckoutPage() {
  const { cartItems } = useCart();
  const [selectedPortoflio, setSelectedPortfolio] = useState<TPortfolio | null>(null);
  const [investmentAmount, setInvestmentAmount] = useState('');

  const { writeContract } = useWriteContract();
  const onPortfolioSelect = useCallback((portfolio: TPortfolio) => {
    setSelectedPortfolio(portfolio);
  }, []);

  const onInvestClick = useCallback(() => {
    const totalUSDCAmount = Number(investmentAmount) * 1000000;
    const inputData = cartItems.map((item) => {
      const token = item.token;
      return {
        tokenOut: token.contractAddress as Address,
        amountIn: BigInt(Math.floor(selectedPortoflio![token.name]! * totalUSDCAmount)),
        fee: token.feeTier
      };
    });
    console.log(inputData);
    writeContract({
      address: USDC_ADDRESS,
      abi: erc20Abi,
      functionName: 'approve',
      args: [CONTRACT_ADDRESS, BigInt(totalUSDCAmount)]
    });

    writeContract({
      address: CONTRACT_ADDRESS,
      abi,
      functionName: 'executeBatchSwaps',
      args: [BigInt(totalUSDCAmount), inputData]
    });
  }, [selectedPortoflio, investmentAmount, cartItems]);

  return (
    <div className='flex h-full w-full flex-col gap-5 lg:flex-row'>
      <div className='h-full w-full lg:w-1/2'>
        <ScatterChart onPortfolioSelect={onPortfolioSelect} />
      </div>

      <div className='flex w-1/2 flex-col gap-5'>
        <PortfolioChart portfolio={selectedPortoflio} />
        <div className='flex h-[155px] flex-col gap-y-5 rounded-md border p-5'>
          <Input
            label='Amount'
            placeholder='1000'
            startContent={
              <div className='pointer-events-none flex items-center'>
                <span className='text-small text-default-400'>USDC</span>
              </div>
            }
            value={investmentAmount}
            onChange={(event) => setInvestmentAmount(event.target.value)}
          />

          <Button color='primary' className='ml-auto w-fit' onPress={onInvestClick}>
            Invest
          </Button>
        </div>
      </div>
    </div>
  );
}
