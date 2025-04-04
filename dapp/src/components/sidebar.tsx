'use client';

import React, { useMemo } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import logo from '@/assets/images/logo.png';
import {
  Sidebar as SCN_Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar
} from '@/components/ui/sidebar';
import useActiveRoute from '@/hooks/use-active-route';
import { routes } from '@/lib/constants/routes';
import { cn } from '@/lib/utils';

import LucideIcons, { TLucideIconName } from './lucide-icons';
import Wallet from './wallet';

type TLink = {
  title: string;
  href: string;
  iconName: TLucideIconName;
};

const links: TLink[] = [
  {
    title: 'Dashboard',
    href: routes.dashboard,
    iconName: 'House'
  },
  {
    title: 'Invest',
    href: routes.invest,
    iconName: 'CircleDollarSign'
  },
  {
    title: 'Portfolio',
    href: routes.portfolio,
    iconName: 'ChartNoAxesCombined'
  }
];

export default function Sidebar() {
  const { isMobile, state } = useSidebar();
  const isExpanded = useMemo(() => state === 'expanded', [state]);

  return (
    <SCN_Sidebar side={isMobile ? 'right' : 'left'} collapsible='icon'>
      <SidebarHeader className='h-16 p-0'>
        <div className='flex h-full items-center gap-x-2 p-2'>
          <Image
            src={logo.src}
            width={isExpanded ? 48 : 32}
            height={isExpanded ? 48 : 32}
            alt='logo'
            className={cn('size-8 transition-size', { 'size-12': isExpanded })}
          />

          <div
            className={cn(
              'pointer-events-none flex size-0 items-center opacity-0 transition-opacity duration-0',
              {
                'pointer-events-auto size-fit opacity-100 duration-700': isExpanded
              }
            )}
          >
            <span className='text-3xl [transform:_rotateY(180deg)]'>L</span>
            <span className='text-3xl font-bold'>Hedger</span>
            <span className='text-3xl'>AI</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {links.map((link) => (
                <SidebarItem
                  key={link.title}
                  title={link.title}
                  href={link.href}
                  iconName={link.iconName}
                  isSidebarExpanded={isExpanded}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <Wallet isSidebarExpanded={isExpanded} />
      </SidebarFooter>
    </SCN_Sidebar>
  );
}

type TSidebarItem = {
  title: string;
  href: string;
  iconName: TLucideIconName;
  isSidebarExpanded: boolean;
};

function SidebarItem({ title, href, iconName, isSidebarExpanded }: TSidebarItem) {
  const isRouteActive = useActiveRoute(href);

  return (
    <SidebarMenuItem
      className={cn('rounded-md', {
        'bg-sidebar-accent text-sidebar-accent-foreground': isRouteActive,
        'flex items-center justify-center': !isSidebarExpanded
      })}
    >
      <SidebarMenuButton tooltip={title} asChild>
        <Link href={href}>
          <LucideIcons name={iconName} />
          <span>{title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
