'use client';

import React, { useMemo } from 'react';

import { TrendingUp } from 'lucide-react';
import { Label, Pie, PieChart } from 'recharts';

import { TPortfolio } from '@/app/checkout/page';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';

const chartColors = [
  '#FF6B6B', // rosso
  '#4ECDC4', // turchese
  '#FFD166', // giallo
  '#A66DE9', // viola chiaro
  '#6BD490', // verde chiaro
  '#53D8FB', // azzurro
  '#FFA69E' // pesca
];

type TPortfolioChart = {
  portfolio: TPortfolio | null;
};

export default function PortfolioChart({ portfolio }: TPortfolioChart) {
  const data = useMemo(() => {
    return Object.entries(portfolio ?? []).map(([name, value], index) => ({
      name,
      value: value,
      percentage: (value * 100).toFixed(2),
      fill: chartColors[index % chartColors.length],
      color: chartColors[index % chartColors.length]
    }));
  }, [portfolio]);

  // Calcola il totale (dovrebbe essere circa 1.0 se i valori sono percentuali)
  const totalValue = useMemo(() => {
    return Object.values(portfolio ?? []).reduce((acc, curr) => acc + curr, 0);
  }, [portfolio]);

  // Crea dinamicamente la configurazione del grafico in base alle chiavi del portfolio
  const dynamicChartConfig = useMemo(() => {
    const config: ChartConfig = {
      value: {
        label: 'Allocation'
      }
    };

    // Aggiungi ogni asset dal portfolio alla configurazione
    Object.entries(portfolio ?? []).forEach(([name, _], index) => {
      config[name.toLowerCase()] = {
        label: name,
        color: chartColors[index % chartColors.length]
      };
    });

    return config;
  }, [portfolio]);

  return (
    <Card className='flex w-full flex-col justify-center bg-secondary/50 p-0'>
      <CardHeader className='items-center pb-0'>
        <CardTitle>Portfolio allocation</CardTitle>
        <CardDescription>Showing current portfolio allocation</CardDescription>
      </CardHeader>
      <CardContent className='h-96 w-full pb-0'>
        <ChartContainer config={dynamicChartConfig} className='h-full w-full'>
          {portfolio ? (
            <PieChart className='p-5'>
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    formatter={(value) => `${(Number(value) * 100).toFixed(2)}%`}
                  />
                }
              />
              <Pie
                data={data}
                dataKey='value'
                nameKey='name'
                innerRadius={60}
                strokeWidth={5}
                stroke='#fff'
                labelLine={true}
                label={({ name, percentage }) => `${name}: ${percentage}%`}
                paddingAngle={1}
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
                            className='fill-foreground text-3xl font-bold'
                          >
                            {(totalValue * 100).toFixed(0)}%
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className='fill-muted-foreground'
                          >
                            Allocated
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          ) : (
            <div className='flex items-center justify-center'>
              <p className='text-muted-foreground'>No portfolio data available</p>
            </div>
          )}
        </ChartContainer>
      </CardContent>
      <CardFooter className='flex-col gap-2 text-sm'>
        <div className='flex items-center gap-2 font-medium leading-none'>
          {data.length} Assets in Portfolio <TrendingUp className='h-4 w-4' />
        </div>
      </CardFooter>
    </Card>
  );
}
