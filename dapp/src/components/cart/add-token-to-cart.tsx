'use client';

import React, { useCallback, useEffect, useMemo } from 'react';

import type { TToken } from '@/components/providers/client/cart-context';

import { Button } from '@heroui/button';

import LucideIcons from '@/components/lucide-icons';
import { useCart } from '@/components/providers/client/cart-context';

type TAddTokenToCart = {
  token: TToken;
};

export default function AddTokenToCart({ token }: TAddTokenToCart) {
  const { cartItems, addToCart, removeFromCart } = useCart();

  const isTokenInCart = useMemo(
    () => cartItems.some((item) => item.token.id === token.id),
    [cartItems, token]
  );

  useEffect(() => console.log('cartItems', cartItems), [cartItems]);

  const onCartButtonClick = useCallback(() => {
    if (isTokenInCart) {
      removeFromCart(token.id);
    } else {
      addToCart(token);
    }
  }, [token, isTokenInCart, addToCart, removeFromCart]);

  return (
    <Button
      color={isTokenInCart ? 'danger' : 'primary'}
      className='flex w-40 items-center gap-1'
      onPress={onCartButtonClick}
    >
      <LucideIcons name={isTokenInCart ? 'X' : 'ShoppingCart'} className='h-4 w-4' />
      {isTokenInCart ? 'Remove from cart' : 'Add to cart'}
    </Button>
  );
}
