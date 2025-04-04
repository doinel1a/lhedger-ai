'use client';

import React from 'react';

import Image from 'next/image';

import { TCartItem } from '../providers/client/cart-context';
import CartItemActions from './item-actions';

interface CartItemProps {
  item: TCartItem;
}

export function CartItem({ item }: CartItemProps) {
  return (
    <div className='flex items-center space-x-4'>
      <div className='relative h-16 w-16 overflow-hidden rounded'>
        <Image
          src={item.token.logo ?? ''}
          alt={item.token.name}
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          fill
          className='absolute object-cover'
          loading='lazy'
        />
      </div>
      <div className='flex flex-1 flex-col gap-1 self-start text-sm'>
        <span className='line-clamp-1'>{item.token.name}</span>
        <span className='line-clamp-1 text-muted-foreground'>{item.token.price}</span>
        <span className='line-clamp-1 text-xs capitalize text-muted-foreground'>'CATEGORY'</span>
      </div>
      <CartItemActions item={item} />
    </div>
  );
}
