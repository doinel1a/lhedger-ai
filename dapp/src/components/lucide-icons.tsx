import React from 'react';

import type { LucideProps } from 'lucide-react';

import { icons } from 'lucide-react';

import { cn } from '@/lib/utils';

export type TLucideIconName = keyof typeof icons;

type TLucideIcon = LucideProps & {
  name: TLucideIconName;
  color?: string;
  size?: string | number;
  className?: string;
};

export default function LucideIcons({ name, color, size, className }: TLucideIcon) {
  const LucideIcon = icons[name];
  return <LucideIcon color={color} size={size} className={cn('', className)} />;
}
