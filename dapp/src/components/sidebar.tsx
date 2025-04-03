'use client';

import React from 'react';

import {
  Calendar,
  ChartNoAxesCombined,
  CircleDollarSign,
  Home,
  Inbox,
  Search,
  Settings
} from 'lucide-react';
import Link from 'next/link';

import {
  Sidebar as SCN_Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar
} from '@/components/ui/sidebar';
import useActivePath from '@/hooks/use-active-route';
import useActiveRoute from '@/hooks/use-active-route';
import { routes } from '@/lib/constants/routes';
import { cn } from '@/lib/utils';

import LucideIcons, { TLucideIconName } from './lucide-icons';

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
  const { isMobile } = useSidebar();

  return (
    <SCN_Sidebar side={isMobile ? 'right' : 'left'} collapsible='icon'>
      <SidebarHeader className='h-16'>
        <div className='flex items-center'>
          <span className='text-3xl [transform:_rotateY(180deg)]'>L</span>
          <span className='text-3xl font-bold text-primary'>Hedger</span>
          <span className='text-3xl'>AI</span>
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
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </SCN_Sidebar>
  );
}

type TSidebarItem = {
  title: string;
  href: string;
  iconName: TLucideIconName;
};

function SidebarItem({ title, href, iconName }: TSidebarItem) {
  const isRouteActive = useActiveRoute(href);

  return (
    <SidebarMenuItem
      className={cn('rounded-md', {
        'bg-sidebar-accent text-sidebar-accent-foreground': isRouteActive
      })}
    >
      <SidebarMenuButton asChild>
        <Link href={href}>
          <LucideIcons name={iconName} />
          <span>{title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
