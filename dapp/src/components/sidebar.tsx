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
import { routes } from '@/lib/constants/routes';

// Menu items.
const items = [
  {
    title: 'Dashboard',
    url: routes.dashboard,
    icon: Home
  },
  {
    title: 'Invest',
    url: routes.invest,
    icon: CircleDollarSign
  },
  {
    title: 'Portfolio',
    url: routes.portfolio,
    icon: ChartNoAxesCombined
  }
];

export function Sidebar() {
  const { isMobile } = useSidebar();

  return (
    <SCN_Sidebar side={isMobile ? 'right' : 'left'} collapsible='icon'>
      <SidebarHeader className='h-16'>
        <p className='text-3xl font-bold'>tHedger AI</p>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </SCN_Sidebar>
  );
}
