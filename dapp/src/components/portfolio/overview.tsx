'use client';

import { useState } from 'react';

import { ArrowDown, ArrowUp } from 'lucide-react';
import Image from 'next/image';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

// Mock data for the portfolio
const tokens = [
  {
    id: 1,
    name: 'Bitcoin',
    symbol: 'BTC',
    logo: '/placeholder.svg?height=32&width=32',
    balance: 0.45,
    price: 62345.78,
    value: 28055.6,
    change: 2.34
  },
  {
    id: 2,
    name: 'Ethereum',
    symbol: 'ETH',
    logo: '/placeholder.svg?height=32&width=32',
    balance: 3.2,
    price: 3456.89,
    value: 11062.05,
    change: -1.23
  },
  {
    id: 3,
    name: 'Solana',
    symbol: 'SOL',
    logo: '/placeholder.svg?height=32&width=32',
    balance: 45.5,
    price: 145.67,
    value: 6628.0,
    change: 5.67
  },
  {
    id: 4,
    name: 'Cardano',
    symbol: 'ADA',
    logo: '/placeholder.svg?height=32&width=32',
    balance: 2500,
    price: 0.58,
    value: 1450.0,
    change: -0.45
  },
  {
    id: 5,
    name: 'Polkadot',
    symbol: 'DOT',
    logo: '/placeholder.svg?height=32&width=32',
    balance: 120,
    price: 7.89,
    value: 946.8,
    change: 1.23
  }
];

export default function PortfolioOverview() {
  const [sortField, setSortField] = useState('value');
  const [sortDirection, setSortDirection] = useState('desc');
  const [searchQuery, setSearchQuery] = useState('');

  const totalValue = tokens.reduce((sum, token) => sum + token.value, 0);

  const formatCurrency = (value: any) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const formatNumber = (value: any) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  const sortedTokens = [...tokens]
    .filter(
      (token) =>
        token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a: any, b: any) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const handleSort = (field: any) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='mb-8 text-3xl font-bold'>Portfolio Dashboard</h1>

      <div className='mb-8 grid gap-6 md:grid-cols-3'>
        <Card>
          <CardHeader className='pb-2'>
            <CardDescription>Total Portfolio Value</CardDescription>
            <CardTitle className='text-3xl'>{formatCurrency(totalValue)}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-sm text-muted-foreground'>Updated just now</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-2'>
            <CardDescription>Number of Assets</CardDescription>
            <CardTitle className='text-3xl'>{tokens.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-sm text-muted-foreground'>On the Base blockchain</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-2'>
            <CardDescription>Portfolio Performance</CardDescription>
            <CardTitle className='text-3xl text-emerald-500'>+12.4%</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-sm text-muted-foreground'>Last 30 days</div>
          </CardContent>
        </Card>
      </div>

      <div className='rounded-lg border shadow-sm'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[250px]'>Asset</TableHead>
              <TableHead className='cursor-pointer' onClick={() => handleSort('balance')}>
                Balance
                {sortField === 'balance' &&
                  (sortDirection === 'asc' ? (
                    <ArrowUp className='ml-1 inline h-4 w-4' />
                  ) : (
                    <ArrowDown className='ml-1 inline h-4 w-4' />
                  ))}
              </TableHead>
              <TableHead className='cursor-pointer' onClick={() => handleSort('price')}>
                Price
                {sortField === 'price' &&
                  (sortDirection === 'asc' ? (
                    <ArrowUp className='ml-1 inline h-4 w-4' />
                  ) : (
                    <ArrowDown className='ml-1 inline h-4 w-4' />
                  ))}
              </TableHead>
              <TableHead className='cursor-pointer' onClick={() => handleSort('value')}>
                Value
                {sortField === 'value' &&
                  (sortDirection === 'asc' ? (
                    <ArrowUp className='ml-1 inline h-4 w-4' />
                  ) : (
                    <ArrowDown className='ml-1 inline h-4 w-4' />
                  ))}
              </TableHead>
              <TableHead className='cursor-pointer text-right' onClick={() => handleSort('change')}>
                24h Change
                {sortField === 'change' &&
                  (sortDirection === 'asc' ? (
                    <ArrowUp className='ml-1 inline h-4 w-4' />
                  ) : (
                    <ArrowDown className='ml-1 inline h-4 w-4' />
                  ))}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTokens.map((token) => (
              <TableRow key={token.id}>
                <TableCell className='font-medium'>
                  <div className='flex items-center gap-2'>
                    <Image
                      src={token.logo || '/placeholder.svg'}
                      alt={token.name}
                      width={24}
                      height={24}
                      className='rounded-full'
                    />
                    <div>
                      <div>{token.name}</div>
                      <div className='text-xs text-muted-foreground'>{token.symbol}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className='font-medium'>{formatNumber(token.balance)}</div>
                  <div className='text-xs text-muted-foreground'>{token.symbol}</div>
                </TableCell>
                <TableCell>{formatCurrency(token.price)}</TableCell>
                <TableCell>{formatCurrency(token.value)}</TableCell>
                <TableCell className='text-right'>
                  <Badge
                    variant={token.change >= 0 ? 'outline' : 'destructive'}
                    className={
                      token.change >= 0
                        ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-700'
                        : ''
                    }
                  >
                    {token.change >= 0 ? '+' : ''}
                    {token.change}%
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
