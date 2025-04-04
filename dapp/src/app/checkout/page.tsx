import React from 'react';

import { DataPoint, Scatterplot } from '@/components/scatter/scatter-plot';
import { env } from '@/env';

export default async function CheckoutPage() {
  const scatterDataFetch = await fetch(`${env.PYTHON_BACKEND_URL}/markowitz-scatter`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      assets: [37939, 38135, 30747]
    })
  });
  const scatterData = (await scatterDataFetch.json()) as DataPoint[];
  console.log(scatterData);
  return <Scatterplot width={800} height={600} data={scatterData} />;
}
