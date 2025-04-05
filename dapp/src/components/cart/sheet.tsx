'use client';

import React, { useState } from 'react';

import { Button as HUI_Button } from '@heroui/button';
import Link from 'next/link';

import { routes } from '@/lib/constants/routes';

import LucideIcons from '../lucide-icons';
import { useCart } from '../providers/client/cart-context';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';
import { CartItem } from './item';

export default function CartSheet() {
  const [isOpen, setIsOpen] = useState(false);
  const { cartItems } = useCart();
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <HUI_Button variant='bordered' className='relative overflow-visible' isIconOnly>
          {itemCount > 0 && (
            <Badge className='absolute -right-2 -top-2 h-6 w-6 rounded-full p-2'>{itemCount}</Badge>
          )}
          <LucideIcons name='ShoppingCart' className='h-4 w-4' />
        </HUI_Button>
      </SheetTrigger>
      <SheetContent className='flex w-full flex-col pr-0 sm:max-w-lg'>
        <SheetHeader className='px-1'>
          <SheetTitle>Cart {itemCount > 0 && `(${itemCount})`}</SheetTitle>
        </SheetHeader>
        <Separator />
        {itemCount > 0 ? (
          <div className='flex flex-1 flex-col justify-between gap-5 overflow-hidden'>
            <ScrollArea className='h-full'>
              <div className='flex flex-col gap-5 divide-y-2 pr-6'>
                {cartItems.map((item) => (
                  <div key={item.token.id} className='space-y-3 pt-4'>
                    <CartItem item={item} />
                  </div>
                ))}
              </div>
            </ScrollArea>

            <Button color='primary' className='flex gap-x-1' asChild>
              <Link href={routes.checkout} onClick={() => setIsOpen(false)}>
                <LucideIcons name='HandCoins' className='h-4 w-4' />
                Checkout
              </Link>
            </Button>
          </div>
        ) : (
          <p className='text-lg font-semibold text-muted-foreground'>No items in cart</p>
        )}
      </SheetContent>
    </Sheet>
  );
}
