import { cn } from '@/lib/cn'
import { getBrandKey } from '@/lib/tech'
import { BrandIcon } from './BrandIcon'

interface TechChipProps {
  label: string
  className?: string
  size?: 'sm' | 'md'
}

export function TechChip({ label, className, size = 'sm' }: TechChipProps) {
  const brand = getBrandKey(label)
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border border-line bg-white/[0.025] text-fg-muted transition-colors duration-200',
        size === 'sm' ? 'px-2 py-1 text-xs' : 'px-2.5 py-1.5 text-[0.8rem]',
        className,
      )}
    >
      {brand && <BrandIcon name={brand} className="size-3.5 shrink-0 opacity-75" />}
      {label}
    </span>
  )
}
