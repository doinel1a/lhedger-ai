import React from 'react';

import LucideIcons from './lucide-icons';
import { Skeleton } from './ui/skeleton';

export default function Loader() {
  return (
    <Skeleton className='flex h-full w-full items-center justify-center'>
      <LucideIcons name='Loader' className='size-8 animate-spin' />
    </Skeleton>
  );
}
