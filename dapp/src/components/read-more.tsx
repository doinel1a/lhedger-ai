'use client';

import React, { useMemo, useState } from 'react';

import { cn } from '@/lib/utils';

type TReadMore = {
  content: string;
  maxLength?: number;
};

export default function ReadMore({ content, maxLength = 65 }: TReadMore) {
  const [isExpanded, setIsExpanded] = useState(false);

  const needToTruncate = useMemo(() => content.length > maxLength, [content, maxLength]);
  const truncatedContent = useMemo(() => {
    if (needToTruncate) {
      return content.slice(0, maxLength) + '...';
    }

    return content;
  }, [content, maxLength, needToTruncate]);

  return (
    <div
      className={cn('flex max-w-[750px] items-center gap-x-2.5', {
        'items-start': isExpanded
      })}
    >
      <p
        className={cn('w-max', {
          'whitespace-pre-line break-all': needToTruncate
        })}
      >
        {isExpanded ? content : truncatedContent}
      </p>

      {needToTruncate && (
        <button
          type='button'
          className='w-fit text-foreground underline underline-offset-2'
          onClick={() => setIsExpanded((previousState) => !previousState)}
        >
          Read {isExpanded ? 'less' : 'more'}
        </button>
      )}
    </div>
  );
}
