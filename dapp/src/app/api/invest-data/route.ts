import { NextRequest, NextResponse } from 'next/server';

import { env } from '@/env';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tokenIds, startDate, endDate } = body as {
      tokenIds: string[];
      startDate?: string;
      endDate?: string;
    };

    if (!Array.isArray(tokenIds) || tokenIds.length === 0) {
      return NextResponse.json({ error: 'tokenIds must be a non-empty array' }, { status: 400 });
    }

    // Default to ~48h so we have data ~24h ago to compute priceChange
    const now = new Date();
    const end = endDate || now.toISOString().split('T')[0];
    const start =
      startDate || new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const idString = tokenIds.join(',');

    const url = `https://api.tokenmetrics.com/v2/hourly-ohlcv?token_id=${idString}&startDate=${start}&endDate=${end}`;

    const res = await fetch(url, {
      headers: {
        api_key: `${env.TOKENMETRICS_API_KEY}`,
        'Content-Type': 'application/json',
        accept: 'application/json'
      }
    });

    if (!res.ok) {
      console.log('Response:', await res.json());
      return NextResponse.json(
        { error: 'Failed to fetch data from TokenMetrics' },
        { status: res.status }
      );
    }

    const data = (await res.json()) as {
      success: boolean;
      data: Array<{
        TOKEN_ID: string;
        TIMESTAMP: string;
        CLOSE: number;
        VOLUME: number;
        [key: string]: any;
      }>;
    };

    if (!data.success || !Array.isArray(data.data)) {
      return NextResponse.json({ error: 'Unexpected response from TokenMetrics' }, { status: 500 });
    }

    // We'll still track earliest & latest to compute 24h price change,
    // but also sum the total volume across all rows in the time window.
    const latest: Record<string, any> = {};
    const earliest: Record<string, any> = {};
    const volumeSums: Record<string, number> = {};

    for (const entry of data.data) {
      const id = entry.TOKEN_ID;

      // Track earliest
      if (!earliest[id] || new Date(entry.TIMESTAMP) < new Date(earliest[id].TIMESTAMP)) {
        earliest[id] = entry;
      }

      // Track latest
      if (!latest[id] || new Date(entry.TIMESTAMP) > new Date(latest[id].TIMESTAMP)) {
        latest[id] = entry;
      }

      // Sum volume in 24h window
      volumeSums[id] = (volumeSums[id] || 0) + (entry.VOLUME || 0);
    }

    // Build final array
    const result = Object.keys(latest).map((id) => {
      const l = latest[id]; // most recent
      const e = earliest[id]; // earliest
      const closeLatest = l?.CLOSE ?? 0;
      const closeEarliest = e?.CLOSE ?? 0;

      let priceChange24h = null;
      if (closeEarliest) {
        priceChange24h = ((closeLatest - closeEarliest) / closeEarliest) * 100;
      }

      // The sum of volumes across the entire ~24h data
      const totalVolume24h = volumeSums[id];

      return {
        ...l,
        priceChange24h,
        totalVolume24h
      };
    });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
