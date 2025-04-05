'use client';

import React, { useMemo } from 'react';

import { useQuery } from '@tanstack/react-query';

import { TPortfolio } from '@/app/checkout/page';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { env } from '@/env';

import Loader from '../loader';
import { useCart } from '../providers/client/cart-context';
import { DataPoint, Scatterplot } from './scatter-plot';

type TScatterChart = {
  onPortfolioSelect: (portfolio: TPortfolio) => void;
};

export default function ScatterChart({ onPortfolioSelect }: TScatterChart) {
  const { cartItems } = useCart();
  const assetNames = useMemo(() => cartItems.map((item) => item.token.name), [cartItems]);

  const { isLoading, data, error } = useQuery({
    queryKey: ['scatter-chart'],
    queryFn: async function () {
      const request = await fetch(`${env.NEXT_PUBLIC_PYTHON_BACKEND_URL}/markowitz-scatter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          assets: assetNames
        })
      });

      return (await request.json()) as DataPoint[];
    },
    enabled: assetNames.length > 0
    // refetchOnWindowFocus: false
  });

  if (isLoading) {
    return <Loader className='h-[675px]' />;
  }

  if (error) {
    console.log('CLIENT ERROR | Failed to fetch data from the API', error);
    return <p>Something went wrong</p>;
  }

  return (
    <Card className='flex w-full flex-col justify-center bg-secondary/50 p-0'>
      <CardHeader className='items-center pb-0'>
        <CardTitle>Scatter chart</CardTitle>
        <CardDescription>
          Showing different types of portfolio with their risk/reward ratio
        </CardDescription>
      </CardHeader>
      <CardContent className='h-[600px] w-full pb-0'>
        <Scatterplot
          width={800}
          height={600}
          data={data ?? []}
          onPortfolioSelect={onPortfolioSelect}
        />
      </CardContent>
    </Card>
  );
}
