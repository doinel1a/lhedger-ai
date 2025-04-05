'use client';

import { useMemo } from 'react';

import type React from 'react';

import { ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';

export interface BreadcrumbProps {
  homeLabel?: string;
  className?: string;
  separator?: React.ReactNode;
}

export function Breadcrumb({
  homeLabel = 'Home',
  className,
  separator = <ChevronRight className='h-4 w-4' />
}: BreadcrumbProps) {
  const pathname = usePathname();
  const isDashboard = useMemo(() => pathname === '/', [pathname]);

  const segments = useMemo(() => {
    return pathname
      .split('/')
      .filter(Boolean)
      .map((segment) => decodeURIComponent(segment));
  }, [pathname]);

  const breadcrumbItems = useMemo(
    () =>
      segments.map((segment, index) => {
        const href = `/${segments.slice(0, index + 1).join('/')}`;
        const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
        const isLast = index === segments.length - 1;

        return {
          href,
          label,
          isLast
        };
      }),
    [segments]
  );

  return (
    <nav aria-label='Breadcrumb' className={cn('flex', className)}>
      <ol className='flex flex-wrap items-center gap-1 text-sm'>
        <li className='flex items-center'>
          {isDashboard ? (
            <span className='flex items-center text-foreground transition-colors'>{homeLabel}</span>
          ) : (
            <Link
              href='/'
              className='flex items-center text-muted-foreground transition-colors hover:text-foreground'
            >
              <span>{homeLabel}</span>
            </Link>
          )}
        </li>

        {breadcrumbItems.map((item, index) => (
          <li key={item.href} className='flex items-center'>
            <span className='mx-1 text-muted-foreground' aria-hidden='true'>
              {separator}
            </span>
            {item.isLast ? (
              <span className='font-medium' aria-current='page'>
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className='text-muted-foreground transition-colors hover:text-foreground'
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
