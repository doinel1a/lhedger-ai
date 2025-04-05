'use client';

import React from 'react';

import Image from 'next/image';

import { TCartItem } from '../providers/client/cart-context';
import { Badge } from '../ui/badge';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';
import CartItemActions from './item-actions';

interface CartItemProps {
  item: TCartItem;
}

export function CartItem({ item }: CartItemProps) {
  return (
    <div className='group relative flex items-start space-x-4'>
      <div className='relative size-11 overflow-hidden rounded'>
        {item.token.logo ? (
          <Image
            src={item.token.logo}
            alt={item.token.name}
            fill
            className='absolute object-cover'
            loading='lazy'
          />
        ) : (
          <div className='flex size-full items-center justify-center rounded-full bg-muted text-sm text-muted-foreground'>
            {item.token.symbol[0]}
          </div>
        )}
      </div>

      <div className='flex flex-1 flex-col gap-1 self-start text-sm'>
        <div className='flex items-end justify-between'>
          <div className='flex flex-col gap-y-1'>
            <span className='text-xs text-muted-foreground'>{item.token.symbol}</span>
            <span className='text-lg font-medium'>{item.token.name}</span>
          </div>
          <span className='line-clamp-1 text-muted-foreground'>$ {item.token.price}</span>
        </div>

        <div className='flex flex-col gap-y-1.5 rounded-md border p-1'>
          <span className='text-xs text-muted-foreground'>Categories</span>
          <ScrollArea className='w-96 whitespace-nowrap pb-3'>
            <div className='flex w-max gap-x-1'>
              {item.token.categories?.map((category) => (
                <Badge variant='secondary' className='shrink-0'>
                  {category}
                </Badge>
              ))}
            </div>

            <ScrollBar orientation='horizontal' />
          </ScrollArea>
        </div>

        <div className='flex flex-col gap-y-2 rounded-md border p-1'>
          <span className='text-xs text-muted-foreground'>Exchanges</span>
          <ScrollArea className='w-96 whitespace-nowrap pb-3'>
            <div className='flex w-max gap-x-1'>
              {item.token.exchanges.map((exchange) => (
                <Badge variant='secondary' className='shrink-0'>
                  {exchange}
                </Badge>
              ))}
            </div>

            <ScrollBar orientation='horizontal' />
          </ScrollArea>
        </div>
      </div>

      <CartItemActions item={item} />
    </div>
  );
}
