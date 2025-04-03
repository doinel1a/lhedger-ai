'use client';

import React, { useMemo } from 'react';

import type { ChartConfig } from '@/components/ui/chart';

import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

import { type TMarketCapData } from '@/app/page';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

const chartConfig = {
  marketCap: {
    label: 'Market cap ',
    color: 'hsl(var(--chart-1))'
  }
} satisfies ChartConfig;

type TCryptoMarketCapChart = {
  data: TMarketCapData[];
};

export default function CryptoMarketCapChart({ data }: TCryptoMarketCapChart) {
  const ticks = useMemo(() => {
    const yearTicks: string[] = [];
    const years = new Set();

    for (const item of data) {
      const year = item.date.slice(0, 4);
      if (!years.has(year)) {
        years.add(year);
        yearTicks.push(item.date);
      }
    }

    return yearTicks;
  }, [data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Total Crypto Market Cap</CardTitle>
        <CardDescription>From 2023 to today</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='date'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 4)}
              ticks={ticks}
              interval='preserveStartEnd'
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator='line' />} />
            <Area
              dataKey='marketCap'
              type='natural'
              fill='var(--color-marketCap)'
              fillOpacity={0.4}
              stroke='var(--color-marketCap)'
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
