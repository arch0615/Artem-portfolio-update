import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

/**
 * Page-width wrapper shared by the navbar, every section and the footer, so they all line up.
 * Side gutters: 20px on phones, 24px from `sm`, 32px from `lg`; the content width tops out at 1440px.
 */
export function Container({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'mx-auto w-[calc(100%-2.5rem)] max-w-[90rem] sm:w-[calc(100%-3rem)] lg:w-[calc(100%-4rem)]',
        className,
      )}
      {...props}
    />
  )
}
