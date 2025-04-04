import { ArrowDown, ArrowRight, ArrowUp } from 'lucide-react';
import millify from 'millify';
import Image from 'next/image';

import AddTokenToCart from '@/components/cart/add-token-to-cart';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { env } from '@/env';
import { tokenMetrics } from '@/lib/constants/routes';

export const dynamic = 'force-dynamic';

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

export default async function InvestPage() {
  const supportedTokensRequest = await fetch(
    `${env.PYTHON_BACKEND_URL}/supported-tokens?page=${1}`
  );
  const supportedTokensResponse = (await supportedTokensRequest.json()) as TokenData[];
  const supportedTokenIds = supportedTokensResponse.map((token) => token.TOKEN_ID);
  const supportedTokenSymbols = supportedTokensResponse
    .map((token) => token.TOKEN_SYMBOL)
    .concat(',');

  const investDataPromise = fetch(`http://localhost:3000/api/invest-data`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      tokenIds: supportedTokenIds
    })
  });

  const tradingSignalPromise = fetch(
    `${tokenMetrics.api}/trading-signals?token_id=${supportedTokenIds.join(',')}`,
    {
      headers: {
        api_key: `${env.TOKEN_METRICS_API_KEY}`,
        accept: 'application/json'
      }
    }
  );

  const priceFPromise = fetch(`${tokenMetrics.api}/price?token_id=${supportedTokenIds.join(',')}`, {
    headers: {
      api_key: `${env.TOKEN_METRICS_API_KEY}`,
      accept: 'application/json'
    }
  });

  const tokenLogosPromise = fetch(
    `https://pro-api.coinmarketcap.com/v2/cryptocurrency/info?symbol=${supportedTokenSymbols}&skip_invalid=true&aux=logo`,
    {
      headers: {
        'X-CMC_PRO_API_KEY': `${env.COIN_MARKET_CAP_API_KEY}`,
        accept: 'application/json'
      }
    }
  );

  const [investDataResponse, tradingSignalResponse, priceResponse, tokenLogosResponse] =
    await Promise.all([investDataPromise, tradingSignalPromise, priceFPromise, tokenLogosPromise]);

  const investDataPromise2 = investDataResponse.json() as unknown as Array<{
    TOKEN_ID: number;
    priceChange24h: number;
    totalVolume24h: number;
  }>;

  const tradingSignalDataPromise = tradingSignalResponse.json() as unknown as {
    data: Array<{
      TOKEN_ID: number;
      TRADING_SIGNAL: -1 | 0 | 1;
      TM_TRADER_GRADE: number;
      TM_INVESTOR_GRADE: number;
    }>;
  };

  const priceDataPromise = priceResponse.json() as unknown as {
    data: Array<{
      TOKEN_ID: number;
      CURRENT_PRICE: number;
    }>;
  };

  const tokenLogosResponsePromise = tokenLogosResponse.json() as unknown as {
    data: Array<{
      symbol: string;
      logo: string;
    }>;
  };

  const [investData, tradingSignalData, priceData, tokenLogos] = await Promise.all([
    investDataPromise2,
    tradingSignalDataPromise,
    priceDataPromise,
    tokenLogosResponsePromise
  ]);

  const allData = supportedTokensResponse.map((token) => {
    const investDataItem = investData.find((item) => item.TOKEN_ID === token.TOKEN_ID);
    const tradingSignalItem = tradingSignalData.data.find(
      (item) => item.TOKEN_ID === token.TOKEN_ID
    );
    const priceDataItem = priceData.data.find((item) => item.TOKEN_ID === token.TOKEN_ID);
    const tokenMetadata = Object.values(tokenLogos.data)
      .flat()
      .find((item) => item.symbol === token.TOKEN_SYMBOL);

    return {
      ...token,
      logo: tokenMetadata?.logo,
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
                <TableHead className='text-muted-foreground'></TableHead>
                <TableHead className='text-muted-foreground'>Token Name</TableHead>
                <TableHead className='text-muted-foreground'>TM Trader Grade</TableHead>
                <TableHead className='text-muted-foreground'>Current Price</TableHead>
                <TableHead className='text-muted-foreground'>24H Price Change</TableHead>
                <TableHead className='text-muted-foreground'>24H Vol</TableHead>
                <TableHead className='text-muted-foreground'>Trading Signal</TableHead>
                <TableHead className='text-muted-foreground'>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allData.map((row) => (
                <TableRow key={row.TOKEN_ID} className='border-b hover:bg-muted/50'>
                  <TableCell>
                    <div className='relative size-8 overflow-hidden'>
                      {row.logo ? (
                        <Image
                          src={row.logo}
                          alt={row.TOKEN_NAME}
                          fill
                          className='absolute object-cover'
                          loading='lazy'
                        />
                      ) : (
                        <div className='flex size-full items-center justify-center rounded-full bg-muted text-sm text-muted-foreground'>
                          {row.TOKEN_SYMBOL[0]}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className='flex flex-col'>
                      <span className='text-xs text-muted-foreground'>{row.TOKEN_SYMBOL}</span>
                      <span className='text-lg font-medium'>{row.TOKEN_NAME}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div
                      className={`flex w-24 items-center justify-between rounded-md px-2 py-1 ${
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
                    <AddTokenToCart
                      token={{
                        id: row.TOKEN_SYMBOL,
                        name: row.TOKEN_NAME,
                        symbol: row.TOKEN_SYMBOL,
                        logo: row.logo,
                        price: row.CURRENT_PRICE,
                        categories: row.CATEGORY_LIST.map((category) => category.category_name),
                        exchanges: row.EXCHANGE_LIST.map((exchange) => exchange.exchange_name)
                      }}
                    />
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
