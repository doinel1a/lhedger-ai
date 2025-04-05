import React from 'react';

import { Breadcrumb } from './breadcrumb';
import CartSheet from './cart/sheet';
import { Separator } from './ui/separator';
import { SidebarTrigger } from './ui/sidebar';
import ThemeToggle from './ui/theme-toggle';

export default function Navbar() {
  return (
    <header className='flex h-16 w-full items-center justify-between border-b border-border px-5'>
      <div className='flex items-center gap-x-2.5'>
        <SidebarTrigger />
        <Separator orientation='vertical' className='data-[orientation=vertical]:h-4' />
        <Breadcrumb homeLabel='Dashboard' />
      </div>

      <div className='flex items-center gap-x-5'>
        <CartSheet />
        <ThemeToggle />
      </div>
    </header>
  );
}
