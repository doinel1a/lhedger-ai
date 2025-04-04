import React from 'react';

import { notFound } from 'next/navigation';

import CryptoFearAndGreedChart from '@/components/charts/crypto-fear-and-greed';
import CryptoMarketCapChart from '@/components/charts/crypto-market-cap';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/constants/routes';
import { getAppBaseUrl } from '@/lib/utils';

export const dynamic = 'force-dynamic';
const baseUrl = getAppBaseUrl();

export type TMarketCapData = {
  date: string;
  marketCap: number;
};

export default async function Home() {
  const startDate = '2023-01-01';
  const endDate = generateEndDate(2025);
  const marketMetricsPromise = fetch(
    `${baseUrl}/${api.getMarketMetrics}?startDate=${startDate}&endDate=${endDate}`
  );
  const marketSentimentPromise = fetch(`${baseUrl}/${api.getMarketSentiment}`);

  const [marketMetrics, marketSentiment] = await Promise.all([
    marketMetricsPromise,
    marketSentimentPromise
  ]);

  if (!marketMetrics.ok || !marketSentiment.ok) {
    return notFound();
  }

  const marketMetricsResponse = await marketMetrics.json();
  const marketSentimentResponse = await marketSentiment.json();

  if (
    !marketMetricsResponse ||
    typeof marketMetricsResponse !== 'object' ||
    !('data' in marketMetricsResponse) ||
    !Array.isArray(marketMetricsResponse.data) ||
    // --
    !marketSentimentResponse ||
    typeof marketSentimentResponse !== 'object' ||
    !('data' in marketSentimentResponse) ||
    !marketSentimentResponse.data ||
    typeof marketSentimentResponse.data !== 'object' ||
    // --
    !('news' in marketSentimentResponse.data) ||
    !marketSentimentResponse.data.news ||
    typeof marketSentimentResponse.data.news !== 'object' ||
    !('grade' in marketSentimentResponse.data.news) ||
    typeof marketSentimentResponse.data.news.grade !== 'number' ||
    !('summary' in marketSentimentResponse.data.news) ||
    typeof marketSentimentResponse.data.news.summary !== 'string' ||
    // --
    !('twitter' in marketSentimentResponse.data) ||
    !marketSentimentResponse.data.twitter ||
    typeof marketSentimentResponse.data.twitter !== 'object' ||
    !('grade' in marketSentimentResponse.data.twitter) ||
    typeof marketSentimentResponse.data.twitter.grade !== 'number' ||
    !('summary' in marketSentimentResponse.data.twitter) ||
    typeof marketSentimentResponse.data.twitter.summary !== 'string'
  ) {
    return notFound();
  }

  return (
    <main className='grid h-full w-full grid-rows-2 gap-5'>
      <div className='w-full rounded-md border'>TOP 100 TOKENS BY MARKET CAP</div>

      <div className='grid w-full grid-cols-3 gap-5'>
        <div className='col-span-3 h-full lg:col-span-2'>
          <CryptoMarketCapChart data={marketMetricsResponse.data.reverse() as TMarketCapData[]} />
        </div>

        <Card className='col-span-3 lg:col-span-1'>
          <CardHeader>
            <CardTitle>Crypto Fear and Greed Index</CardTitle>
          </CardHeader>
          <CardContent className='flex flex-col gap-5'>
            <CryptoFearAndGreedChart
              title='News'
              description={marketSentimentResponse.data.news.summary}
              value={marketSentimentResponse.data.news.grade}
            />

            <CryptoFearAndGreedChart
              title='Twitter'
              description={marketSentimentResponse.data.twitter.summary}
              value={marketSentimentResponse.data.twitter.grade}
            />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function generateEndDate(year: number) {
  const todayDate = new Date();
  const todayMonth = String(todayDate.getMonth() + 1).padStart(2, '0');
  const todayDay = String(todayDate.getDate()).padStart(2, '0');
  return `${year}-${todayMonth}-${todayDay}`;
}
