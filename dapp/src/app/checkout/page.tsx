'use client';

import React, { useCallback, useEffect, useState } from 'react';

import { Button } from '@heroui/button';
import { Input } from '@heroui/input';

import PortfolioChart from '@/components/charts/portfolio';
import ScatterChart from '@/components/scatter/chart';

export const dynamic = 'force-dynamic';

export type TPortfolio = Record<string, number>;

export default function CheckoutPage() {
  const [selectedPortoflio, setSelectedPortfolio] = useState<TPortfolio | null>(null);
  const [investmentAmount, setInvestmentAmount] = useState('');

  const onPortfolioSelect = useCallback((portfolio: TPortfolio) => {
    setSelectedPortfolio(portfolio);
  }, []);

  const onInvestClick = useCallback(() => {
    // IMPLEMENTATION
  }, []);

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
                <span className='text-small text-default-400'>USDT</span>
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
