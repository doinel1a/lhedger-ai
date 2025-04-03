import React from 'react';

import { notFound } from 'next/navigation';

import CryptoMarketCapChart from '@/components/charts/crypto-market-cap';
import { api } from '@/lib/constants/routes';
import { getAppBaseUrl } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export type TMarketCapData = {
  date: string;
  marketCap: number;
};

export default async function Home() {
  const base = getAppBaseUrl();
  const startDate = '2023-01-01';
  const endDate = generateEndDate(2025);
  const request = await fetch(
    `${base}/${api.getMarketMetrics}?startDate=${startDate}&endDate=${endDate}`
  );

  if (!request.ok) {
    return notFound();
  }

  const response = await request.json();

  if (
    !response ||
    typeof response !== 'object' ||
    !('data' in response) ||
    !Array.isArray(response.data)
  ) {
    return notFound();
  }

  return (
    <main className='h-full w-full'>
      <CryptoMarketCapChart data={response.data.reverse() as TMarketCapData[]} />
    </main>
  );
}

function generateEndDate(year: number) {
  const todayDate = new Date();
  const todayMonth = String(todayDate.getMonth() + 1).padStart(2, '0');
  const todayDay = String(todayDate.getDate()).padStart(2, '0');
  return `${year}-${todayMonth}-${todayDay}`;
}
