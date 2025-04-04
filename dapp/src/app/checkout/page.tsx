import React from 'react';

import { DataPoint, Scatterplot } from '@/components/scatter/scatter-plot';
import { env } from '@/env';

export const dynamic = 'force-dynamic';

export default async function CheckoutPage() {
  const scatterDataFetch = await fetch(`${env.PYTHON_BACKEND_URL}/markowitz-scatter`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      assets: ['Sushi', 'Coinbase Wrapped Staked ETH', 'Tower']
    })
  });
  const scatterData = (await scatterDataFetch.json()) as DataPoint[];
  return <Scatterplot width={800} height={600} data={scatterData} />;
}
