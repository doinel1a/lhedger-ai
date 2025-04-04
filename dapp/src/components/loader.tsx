import React from 'react';

import { cn } from '@/lib/utils';

import LucideIcons from './lucide-icons';
import { Skeleton } from './ui/skeleton';

type TLoader = {
  className?: string;
};

export default function Loader({ className }: TLoader) {
  return (
    <Skeleton className={cn('flex h-full w-full items-center justify-center', className)}>
      <LucideIcons name='Loader' className='size-8 animate-spin' />
    </Skeleton>
  );
}
