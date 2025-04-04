'use client';

import React, { useMemo } from 'react';

import type { ChartConfig } from '@/components/ui/chart';

import { Label, PolarGrid, PolarRadiusAxis, RadialBar, RadialBarChart } from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer } from '@/components/ui/chart';

import ReadMore from '../read-more';

type TCryptoFearAndGreedChart = {
  title: string;
  description: string;
  value: number;
};

export default function CryptoFearAndGreedChart({
  title,
  description,
  value
}: TCryptoFearAndGreedChart) {
  const { safeValue, sentiment, chartData, chartConfig } = useMemo(() => {
    const safeValue = Math.max(0, Math.min(100, value));
    let color = '';
    let sentiment = '';

    if (safeValue >= 0 && safeValue < 20) {
      color = 'hsl(0, 100%, 50%)';
      sentiment = 'Strong sell';
    } else if (safeValue >= 20 && safeValue < 40) {
      color = 'hsl(30, 100%, 50%)';
      sentiment = 'Sell';
    } else if (safeValue >= 40 && safeValue < 60) {
      color = 'hsl(60, 100%, 50%)';
      sentiment = 'Neutral';
    } else if (safeValue >= 60 && safeValue < 80) {
      color = 'hsl(120, 70%, 60%)';
      sentiment = 'Buy';
    } else {
      color = 'hsl(120, 100%, 30%)';
      sentiment = 'Strong buy';
    }

    const chartData = [{ value: 100, fill: color }];
    const chartConfig = {
      value: {
        label: 'Index Value',
        color: color
      }
    } satisfies ChartConfig;

    return { safeValue, color, sentiment, chartData, chartConfig };
  }, [value]);

  const endAngle = useMemo(() => {
    return 90 + (safeValue / 100) * 360;
  }, [safeValue]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          <ReadMore content={description} />
        </CardDescription>
      </CardHeader>
      <CardContent className='flex-1 pb-0'>
        <ChartContainer config={chartConfig} className='mx-auto aspect-square max-h-[250px]'>
          <RadialBarChart
            data={chartData}
            startAngle={90}
            endAngle={endAngle}
            innerRadius={80}
            outerRadius={110}
            barSize={30}
          >
            <PolarGrid
              gridType='circle'
              radialLines={false}
              stroke='none'
              className='first:fill-muted last:fill-background'
              polarRadius={[86, 74]}
            />
            <RadialBar
              dataKey='value'
              background={{ fill: 'hsl(var(--muted))' }}
              cornerRadius={10}
            />
            <PolarRadiusAxis
              type='number'
              domain={[0, 100]}
              tick={false}
              tickLine={false}
              axisLine={false}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor='middle'
                        dominantBaseline='middle'
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className='fill-foreground text-4xl font-bold'
                        >
                          {safeValue}%
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className='fill-muted-foreground'
                        >
                          {sentiment}
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
