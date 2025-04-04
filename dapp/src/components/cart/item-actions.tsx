import React, { useCallback } from 'react';

import { Button } from '@heroui/button';

import LucideIcons from '../lucide-icons';
import { TCartItem, useCart } from '../providers/client/cart-context';
import { Input } from '../ui/input';

interface TCartItemActions {
  item: TCartItem;
}

export default function CartItemActions({ item }: TCartItemActions) {
  const { removeFromCart } = useCart();

  const onRemoveClick = useCallback(() => {
    removeFromCart(item.token.id);
  }, [item, removeFromCart]);

  return (
    <div className='absolute right-0 top-0 flex items-center space-x-1 opacity-0 transition-opacity group-hover:opacity-100'>
      <button onClick={onRemoveClick}>
        <LucideIcons name='Trash' className='h-4 w-4 text-danger-500' />
      </button>
    </div>
  );
}
