import { ArrowDown, ArrowRight, ShoppingCart } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

export default async function InvestPage() {
  return (
    <div className='min-h-screen bg-background text-foreground'>
      <div className='p-4'>
        <div className='overflow-x-auto rounded-md border'>
          <Table>
            <TableHeader className='bg-muted'>
              <TableRow className='border-b hover:bg-muted'>
                <TableHead className='text-muted-foreground'>#</TableHead>
                <TableHead className='text-muted-foreground'>Token Name</TableHead>
                <TableHead className='text-muted-foreground'>TM Trader Grade</TableHead>
                <TableHead className='text-muted-foreground'>TM Trader Grade 24H Change</TableHead>
                <TableHead className='text-muted-foreground'>Price</TableHead>
                <TableHead className='text-muted-foreground'>24H Price Change</TableHead>
                <TableHead className='text-muted-foreground'>Market Cap</TableHead>
                <TableHead className='text-muted-foreground'>24H Vol</TableHead>
                <TableHead className='text-muted-foreground'>Trading Signal</TableHead>
                <TableHead className='text-muted-foreground'>Add to Cart</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.rank} className='border-b hover:bg-muted/50'>
                  <TableCell>{row.rank}</TableCell>
                  <TableCell>
                    <div className='flex items-center gap-2'>
                      <div className='flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs'>
                        {row.symbol[0]}
                      </div>
                      <div>{row.name}</div>
                      <div className='text-muted-foreground'>{row.symbol}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div
                      className={`flex w-fit items-center gap-1 rounded px-2 py-1 ${
                        row.grade > 70
                          ? 'bg-green-900/50 text-green-500'
                          : row.grade === 50
                            ? 'bg-yellow-900/50 text-yellow-500'
                            : 'bg-red-900/50 text-red-500'
                      }`}
                    >
                      {row.grade}%{row.grade === 50 && <ArrowRight className='h-4 w-4' />}
                      {row.grade < 50 && <ArrowDown className='h-4 w-4' />}
                    </div>
                  </TableCell>
                  <TableCell className='text-green-500'>
                    <div className='flex items-center gap-1'>{row.gradeChange}%</div>
                  </TableCell>
                  <TableCell>{row.price}</TableCell>
                  <TableCell className={row.priceChange > 0 ? 'text-green-500' : 'text-red-500'}>
                    <div className='flex items-center gap-1'>
                      {row.priceChange < 0 && <ArrowDown className='h-4 w-4' />} {row.priceChange}%
                    </div>
                  </TableCell>
                  <TableCell>{row.marketCap}</TableCell>
                  <TableCell>{row.volume}</TableCell>
                  <TableCell
                    className={
                      row.signal === 'Bullish'
                        ? 'text-green-500'
                        : row.signal === 'Bearish'
                          ? 'text-red-500'
                          : 'text-muted-foreground'
                    }
                  >
                    {row.signal || '-'}
                  </TableCell>
                  <TableCell>
                    <Button className='flex items-center gap-1 bg-primary text-primary-foreground hover:bg-primary/90'>
                      <ShoppingCart className='h-4 w-4' /> Add to Cart
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

const rows = [
  {
    rank: 140,
    name: 'Pendle',
    symbol: 'PENDLE',
    grade: 88.92,
    gradeChange: 0.15,
    price: '$2.84',
    priceChange: -12.14,
    marketCap: '$461.1M',
    volume: '$188M',
    signal: 'Bullish'
  },
  {
    rank: 174,
    name: 'Fartcoin',
    symbol: 'FARTCOIN',
    grade: 82.44,
    gradeChange: 0.2,
    price: '$0.37',
    priceChange: -31.81,
    marketCap: '$367.1M',
    volume: '$217M',
    signal: 'Bullish'
  },
  {
    rank: 205,
    name: 'LayerZero',
    symbol: 'ZRO',
    grade: 76.52,
    gradeChange: 5.14,
    price: '$2.60',
    priceChange: -5.85,
    marketCap: '$287.1M',
    volume: '$141M',
    signal: 'Bullish'
  },
  {
    rank: 107,
    name: 'Walrus',
    symbol: 'WAL',
    grade: 50.0,
    gradeChange: 0.0,
    price: '$0.53',
    priceChange: -8.67,
    marketCap: '$0.7B',
    volume: '$186M',
    signal: '-'
  },
  {
    rank: 674,
    name: 'VICE',
    symbol: 'VICE',
    grade: 50.0,
    gradeChange: 0.0,
    price: '$0.05',
    priceChange: 34.92,
    marketCap: '$41.7M',
    volume: '$1M',
    signal: '-'
  },
  {
    rank: 448,
    name: 'Nillion',
    symbol: 'NIL',
    grade: 50.0,
    gradeChange: 0.0,
    price: '$0.42',
    priceChange: -10.68,
    marketCap: '$81.8M',
    volume: '$69M',
    signal: '-'
  },
  {
    rank: 20,
    name: 'Sui',
    symbol: 'SUI',
    grade: 29.14,
    gradeChange: 12.33,
    price: '$2.23',
    priceChange: -10.17,
    marketCap: '$7.2B',
    volume: '$2B',
    signal: 'Bearish'
  },
  {
    rank: 161,
    name: 'Wormhole',
    symbol: 'W',
    grade: 25.95,
    gradeChange: -0.22,
    price: '$0.09',
    priceChange: 13.77,
    marketCap: '$397.9M',
    volume: '$190M',
    signal: 'Bearish'
  }
];
