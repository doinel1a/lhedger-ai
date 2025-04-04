import { ArrowDown, ArrowRight, ArrowUp, ShoppingCart } from 'lucide-react';
import millify from 'millify';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { env } from '@/env';

interface ExchangeItem {
  exchange_id: string;
  exchange_name: string;
}

interface CategoryItem {
  category_id: number;
  category_name: string;
}

interface ContractAddressMap {
  [chain: string]: string; // e.g. "base": "0x..."
}

export interface TokenData {
  TOKEN_ID: number;
  TOKEN_NAME: string;
  TOKEN_SYMBOL: string;
  EXCHANGE_LIST: ExchangeItem[];
  CATEGORY_LIST: CategoryItem[];
  contract_address: ContractAddressMap;
}

export const dynamic = 'force-dynamic';

export default async function InvestPage() {
  const supportedTokensFetch = await fetch(`${env.PYTHON_BACKEND_URL}/supported-tokens?page=${2}`, {
    method: 'GET'
  });

  const supportedTokens = (await supportedTokensFetch.json()) as TokenData[];
  const supportedTokenIds = supportedTokens.map((token) => token.TOKEN_ID);
  const investDataFetch = await fetch(`http://localhost:3000/api/invest-data`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      tokenIds: supportedTokenIds
    })
  });
  const investData = (await investDataFetch.json()) as Array<{
    TOKEN_ID: number;
    priceChange24h: number;
    totalVolume24h: number;
  }>;
  const tradingSignalFetch = await fetch(
    `https://api.tokenmetrics.com/v2/trading-signals?token_id=${supportedTokenIds.join(',')}`,
    {
      headers: {
        api_key: `${env.TOKENMETRICS_API_KEY}`,
        accept: 'application/json'
      }
    }
  );
  const tradingSignalData = (await tradingSignalFetch.json()) as {
    data: Array<{
      TOKEN_ID: number;
      TRADING_SIGNAL: -1 | 0 | 1;
      TM_TRADER_GRADE: number;
      TM_INVESTOR_GRADE: number;
    }>;
  };
  const priceFetch = await fetch(
    `https://api.tokenmetrics.com/v2/price?token_id=${supportedTokenIds.join(',')}`,
    {
      headers: {
        api_key: `${env.TOKENMETRICS_API_KEY}`,
        accept: 'application/json'
      }
    }
  );
  const priceData = (await priceFetch.json()) as {
    data: Array<{
      TOKEN_ID: number;
      CURRENT_PRICE: number;
    }>;
  };

  const allData = supportedTokens.map((token) => {
    const investDataItem = investData.find((item) => item.TOKEN_ID === token.TOKEN_ID);
    const tradingSignalItem = tradingSignalData.data.find(
      (item) => item.TOKEN_ID === token.TOKEN_ID
    );
    const priceDataItem = priceData.data.find((item) => item.TOKEN_ID === token.TOKEN_ID);
    return {
      ...token,
      priceChange: investDataItem ? investDataItem.priceChange24h : 0,
      volume: investDataItem ? investDataItem.totalVolume24h : 0,
      TM_TRADER_GRADE: tradingSignalItem ? tradingSignalItem.TM_TRADER_GRADE : 0,
      TM_INVESTOR_GRADE: tradingSignalItem ? tradingSignalItem.TM_INVESTOR_GRADE : 0,
      TRADING_SIGNAL: tradingSignalItem ? tradingSignalItem.TRADING_SIGNAL : 0,
      CURRENT_PRICE: priceDataItem ? priceDataItem.CURRENT_PRICE : 0
    };
  });

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
                <TableHead className='text-muted-foreground'>Current Price</TableHead>
                <TableHead className='text-muted-foreground'>24H Price Change</TableHead>
                <TableHead className='text-muted-foreground'>24H Vol</TableHead>
                <TableHead className='text-muted-foreground'>Trading Signal</TableHead>
                <TableHead className='text-muted-foreground'>Add to Cart</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allData.map((row) => (
                <TableRow key={row.TOKEN_ID} className='border-b hover:bg-muted/50'>
                  <TableCell>{row.TOKEN_ID}</TableCell>
                  <TableCell>
                    <div className='flex items-center gap-2'>
                      <div className='flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs'>
                        {row.TOKEN_SYMBOL}
                      </div>
                      <div>{row.TOKEN_NAME}</div>
                      <div className='text-muted-foreground'>{row.TOKEN_SYMBOL}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div
                      className={`flex w-fit items-center gap-1 rounded px-2 py-1 ${
                        row.TM_TRADER_GRADE > 70
                          ? 'bg-green-700/50 text-green-500'
                          : row.TM_TRADER_GRADE === 50
                            ? 'bg-yellow-700/50 text-yellow-500'
                            : 'bg-red-700/50 text-red-500'
                      }`}
                    >
                      {row.TM_TRADER_GRADE}%
                      {row.TM_TRADER_GRADE === 50 && <ArrowRight className='h-4 w-4' />}
                      {row.TM_TRADER_GRADE < 50 && <ArrowDown className='h-4 w-4' />}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className='flex items-center gap-1'>${row.CURRENT_PRICE}</div>
                  </TableCell>
                  <TableCell className={row.priceChange > 0 ? 'text-green-500' : 'text-red-500'}>
                    <div className='flex items-center gap-1'>
                      {row.priceChange < 0 ? (
                        <ArrowDown className='h-4 w-4' />
                      ) : (
                        <ArrowUp className='h-4 w-4' />
                      )}
                      {row.priceChange.toPrecision(2)}%
                    </div>
                  </TableCell>
                  <TableCell>{millify(row.volume)}</TableCell>
                  <TableCell
                    className={
                      row.TRADING_SIGNAL === 1
                        ? 'text-green-500'
                        : row.TRADING_SIGNAL === -1
                          ? 'text-red-500'
                          : 'text-muted-foreground'
                    }
                  >
                    {row.TRADING_SIGNAL === 1
                      ? 'Bullish'
                      : row.TRADING_SIGNAL === -1
                        ? 'Bearish'
                        : '-'}
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
