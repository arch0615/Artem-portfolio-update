import type { HTMLAttributes, PointerEvent } from 'react'
import { cn } from '@/lib/cn'

function trackPointer(event: PointerEvent<HTMLElement>) {
  const target = event.currentTarget
  const rect = target.getBoundingClientRect()
  target.style.setProperty('--mx', `${event.clientX - rect.left}px`)
  target.style.setProperty('--my', `${event.clientY - rect.top}px`)
}

/** Card surface with a soft, cursor-following highlight. */
export function SpotlightCard({ className, onPointerMove, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      onPointerMove={(event) => {
        trackPointer(event)
        onPointerMove?.(event)
      }}
      className={cn(
        'spotlight card-highlight rounded-2xl border border-line bg-elevated/60 transition-colors duration-300 hover:border-line-strong',
        className,
      )}
      {...props}
    />
  )
}
