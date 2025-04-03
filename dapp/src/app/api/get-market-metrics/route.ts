import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';

import { env } from '@/env';
import { tokenMetrics } from '@/lib/constants/routes';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  if (!startDate || !endDate) {
    return new Response('Invalid request', { status: 400 });
  }

  try {
    const request = await fetch(
      `${tokenMetrics.api}/market-metrics?startDate=${startDate}&endDate=${endDate}`,
      {
        headers: {
          accept: 'application/json',
          api_key: env.TOKEN_METRICS_API_KEY
        }
      }
    );

    if (!request.ok) {
      return new Response('Something went horribly wrong', { status: 500 });
    }

    try {
      const response = await request.json();

      if (
        response &&
        typeof response === 'object' &&
        'data' in response &&
        response.data &&
        Array.isArray(response.data)
      ) {
        const formattedData = response.data.map((data) => {
          if (
            data &&
            typeof data === 'object' &&
            // --
            'DATE' in data &&
            data.DATE &&
            typeof data.DATE === 'string' &&
            // --
            'TOTAL_CRYPTO_MCAP' in data &&
            data.TOTAL_CRYPTO_MCAP &&
            typeof data.TOTAL_CRYPTO_MCAP === 'number'
          ) {
            const responseDate = new Date(data.DATE);
            const year = responseDate.getUTCFullYear();
            const month = String(responseDate.getUTCMonth() + 1).padStart(2, '0');
            const day = String(responseDate.getUTCDate()).padStart(2, '0');
            const date = `${year}-${month}-${day}`;

            return {
              date,
              marketCap: data.TOTAL_CRYPTO_MCAP
            };
          }
        });
        return NextResponse.json({ data: formattedData }, { status: 200 });
      }
    } catch (error) {
      console.error(
        'SERVER ERROR | Could not deserialize response body from TokenMetrics API',
        error
      );

      return NextResponse.json(
        { error: 'Could not deserialize response body from TokenMetrics AP' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('SERVER ERROR | Could not fetch data from TokenMetrics API', error);

    return NextResponse.json(
      { error: 'Could not fetch data from TokenMetrics API' },
      { status: 500 }
    );
  }
}
