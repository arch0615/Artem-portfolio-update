import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

/*
 * Building blocks for the project mockups. Everything renders inside `.mockup`,
 * where 1 spacing unit = 1% of the card width, so the illustrations scale cleanly.
 * Text content is intentionally abstract (skeleton bars) — no invented data.
 */

export function Skel({ className }: { className?: string }) {
  return <span className={cn('block h-1 rounded-full bg-white/12', className)} />
}

interface WindowProps {
  url?: string
  className?: string
  bodyClassName?: string
  children?: ReactNode
}

export function BrowserWindow({ url, className, bodyClassName, children }: WindowProps) {
  return (
    <div
      className={cn(
        'absolute flex flex-col overflow-hidden rounded-[1.6cqw] border border-white/12 bg-[#101015] shadow-[0_2cqw_6cqw_-1cqw_rgb(0_0_0/0.7)]',
        className,
      )}
    >
      <div className="flex h-5 shrink-0 items-center gap-2 border-b border-white/8 bg-white/[0.03] px-2.5">
        <div className="flex gap-1">
          <span className="size-1 rounded-full bg-white/20" />
          <span className="size-1 rounded-full bg-white/20" />
          <span className="size-1 rounded-full bg-white/20" />
        </div>
        {url && (
          <div className="mx-auto flex h-2.5 max-w-[70%] min-w-0 items-center gap-1 rounded-full bg-white/[0.06] px-2 font-mono text-[0.55em] text-white/55">
            <span className="size-1 shrink-0 rounded-full bg-emerald-400/70" />
            <span className="truncate">{url}</span>
          </div>
        )}
      </div>
      <div className={cn('relative min-h-0 flex-1', bodyClassName)}>{children}</div>
    </div>
  )
}

export function Phone({ className, children }: { className?: string; children?: ReactNode }) {
  return (
    <div
      className={cn(
        'absolute rounded-[4cqw] border border-white/15 bg-[#0b0b0f] p-[0.7cqw] shadow-[0_2.5cqw_7cqw_-1cqw_rgb(0_0_0/0.75)]',
        className,
      )}
    >
      <div className="relative flex size-full flex-col overflow-hidden rounded-[3.3cqw] bg-[#121218]">
        <span className="absolute top-1 left-1/2 z-10 h-1.5 w-7 -translate-x-1/2 rounded-full bg-black" />
        {children}
      </div>
    </div>
  )
}

/** Small floating label card used on several mockups. */
export function FloatingChip({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={cn(
        'absolute flex items-center gap-1.5 rounded-[1.2cqw] border border-white/14 bg-[#16161c]/95 px-2 py-1.5 text-[0.7em] font-medium whitespace-nowrap text-white/85 shadow-[0_1.5cqw_4cqw_-1cqw_rgb(0_0_0/0.7)]',
        className,
      )}
    >
      {children}
    </div>
  )
}

/** Stylised street grid used as a map backdrop. */
export function MapLines({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className={cn('absolute inset-0 size-full', className)}>
      <g fill="none" strokeLinecap="round" style={{ stroke: 'rgb(var(--accent) / 0.28)' }}>
        <path d="M-5 22 L105 14" strokeWidth="1.4" />
        <path d="M-5 58 L105 66" strokeWidth="2" />
        <path d="M24 -5 L32 105" strokeWidth="1.4" />
        <path d="M68 -5 L60 105" strokeWidth="1" />
        <path d="M84 -5 Q72 45 98 105" strokeWidth="0.8" />
        <path d="M-5 84 Q40 76 105 90" strokeWidth="0.8" />
        <path d="M-5 40 L48 38" strokeWidth="0.6" />
      </g>
    </svg>
  )
}
