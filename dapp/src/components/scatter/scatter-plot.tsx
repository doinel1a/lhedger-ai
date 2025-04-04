'use client';

import { useState } from 'react';

import * as d3 from 'd3';

import { TPortfolio } from '@/app/checkout/page';

import { AxisBottom } from './axis-bottom';
import { AxisLeft } from './axis-left';
import { InteractionData, Tooltip } from './tooltip';

const MARGIN = { top: 60, right: 60, bottom: 60, left: 60 };

// The star path used by Lucide's "Star" icon, centered roughly around (0,0).
// We'll scale & shift it as needed in `transform`.
const STAR_PATH = `M12 .587l3.668 7.431 8.21 1.193
-5.938 5.79 1.405 8.193L12 18.896l-7.345 3.868
1.405-8.193-5.938-5.79 8.21-1.193z`;

export type DataPoint = {
  x: number; // interpret as Volatility
  y: number; // interpret as Return
  sharpe: number;
  portfolio: Record<string, number>;
};

type ScatterplotProps = {
  width: number;
  height: number;
  data: DataPoint[];
  onPortfolioSelect: (portfolio: TPortfolio) => void;
};

export const Scatterplot = ({ width, height, data, onPortfolioSelect }: ScatterplotProps) => {
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  const [hovered, setHovered] = useState<InteractionData | null>(null);

  // ----- X & Y SCALES -----
  const minY = d3.min(data, (d) => d.y) ?? 0;
  const maxY = d3.max(data, (d) => d.y) ?? 1;
  const minX = d3.min(data, (d) => d.x) ?? 0;
  const maxX = d3.max(data, (d) => d.x) ?? 1;

  const yScale = d3.scaleLinear().domain([minY, maxY]).range([boundsHeight, 0]);
  const xScale = d3.scaleLinear().domain([minX, maxX]).range([0, boundsWidth]);

  // ----- COLOR BY SHARPE -----
  const sharpeMin = d3.min(data, (d) => d.sharpe) ?? 0;
  const sharpeMax = d3.max(data, (d) => d.sharpe) ?? 1;

  const colorScale = d3
    .scaleLinear<string>()
    .domain([sharpeMin, sharpeMax])
    .range(['red', 'green']);

  // Find the portfolio with the highest Sharpe
  const maxSharpeIndex = d3.maxIndex(data, (d) => d.sharpe);

  // Build shapes
  const allShapes = data.map((d, i) => {
    const isBest = i === maxSharpeIndex;

    if (isBest) {
      // If it's the best portfolio, draw a star
      // The star path is built for a ~24x24 bounding box, centered at (12,12).
      // We'll center it at the data point by shifting by -12 and scaling down.
      return (
        <path
          key={i}
          d={STAR_PATH}
          fill='yellow'
          stroke='black'
          strokeWidth={1.5}
          fillOpacity={1}
          transform={`
            translate(${xScale(d.x)}, ${yScale(d.y)})
            scale(0.8)
            translate(-12, -12)
          `}
          onMouseEnter={() =>
            setHovered({
              xPos: xScale(d.x),
              yPos: yScale(d.y),
              sharpe: d.sharpe,
              portfolio: d.portfolio
            })
          }
          onMouseLeave={() => setHovered(null)}
          onClick={() => onPortfolioSelect(d.portfolio)}
        />
      );
    } else {
      // For normal portfolios, draw a circle
      return (
        <circle
          key={i}
          r={6}
          cx={xScale(d.x)}
          cy={yScale(d.y)}
          fill={colorScale(d.sharpe)}
          stroke={colorScale(d.sharpe)}
          fillOpacity={0.7}
          onMouseEnter={() =>
            setHovered({
              xPos: xScale(d.x),
              yPos: yScale(d.y),
              sharpe: d.sharpe,
              portfolio: d.portfolio
            })
          }
          onMouseLeave={() => setHovered(null)}
          onClick={() => onPortfolioSelect(d.portfolio)}
        />
      );
    }
  });

  return (
    <div style={{ position: 'relative' }}>
      <svg width={width} height={height}>
        <g transform={`translate(${MARGIN.left},${MARGIN.top})`}>
          {/* Y axis */}
          <AxisLeft yScale={yScale} pixelsPerTick={40} width={boundsWidth} />

          {/* X axis */}
          <g transform={`translate(0, ${boundsHeight})`}>
            <AxisBottom xScale={xScale} pixelsPerTick={40} height={boundsHeight} />
          </g>

          {/* Circles & Star */}
          {allShapes}
        </g>
      </svg>

      {/* Tooltip */}
      <div
        style={{
          width: boundsWidth,
          height: boundsHeight,
          position: 'absolute',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          marginLeft: MARGIN.left,
          marginTop: MARGIN.top
        }}
      >
        <Tooltip interactionData={hovered} />
      </div>
    </div>
  );
};
