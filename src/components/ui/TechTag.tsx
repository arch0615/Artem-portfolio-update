import { cn } from '@/lib/cn'

/** A compact technology badge: plain text on a faint accent tint. */
export function TechTag({ label, className }: { label: string; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border border-accent/20 bg-accent/[0.07] px-2 py-0.5 text-xs leading-5 font-medium text-accent-soft',
        className,
      )}
    >
      {label}
    </span>
  )
}
