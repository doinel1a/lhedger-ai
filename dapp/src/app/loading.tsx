import React from 'react';

import LucideIcons from '@/components/lucide-icons';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <Skeleton className='flex h-full w-full items-center justify-center'>
      <LucideIcons name='Loader' className='size-12 animate-spin' />
    </Skeleton>
  );
}
