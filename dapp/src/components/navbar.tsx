import React from 'react';

import { SidebarTrigger } from './ui/sidebar';
import ThemeToggle from './ui/theme-toggle';
import Wallet from './wallet';

export default function Navbar() {
  return (
    <header className='flex h-16 w-full items-center justify-between border-b border-border px-5'>
      <SidebarTrigger />
      <div className='flex items-center gap-x-5'>
        <ThemeToggle />
      </div>
    </header>
  );
}
