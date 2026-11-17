import type { IconName } from '@/types'
import { icons } from '@/lib/icons'
import { cn } from '@/lib/cn'

interface IconBadgeProps {
  icon: IconName
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

/** Gradient-bordered square holding a Lucide icon. */
export function IconBadge({ icon, className, size = 'md' }: IconBadgeProps) {
  const Icon = icons[icon]
  return (
    <span
      className={cn(
        'relative inline-grid shrink-0 place-items-center rounded-xl bg-linear-to-b from-white/[0.14] to-white/[0.03] p-px',
        size === 'sm' && 'size-8 rounded-lg',
        size === 'md' && 'size-10',
        size === 'lg' && 'size-12',
        className,
      )}
    >
      <span
        className={cn(
          'grid size-full place-items-center bg-linear-to-b from-raised to-elevated text-accent-soft',
          size === 'sm' ? 'rounded-[7px]' : 'rounded-[11px]',
        )}
      >
        <Icon aria-hidden className={size === 'sm' ? 'size-4' : 'size-5'} strokeWidth={1.75} />
      </span>
    </span>
  )
}
