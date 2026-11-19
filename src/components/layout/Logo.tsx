import { Link } from 'react-router'
import { profile } from '@/data/profile'
import { cn } from '@/lib/cn'

/**
 * Brand mark: the brand icon inside the gradient-bordered rounded square. The icon's own near-black
 * background matches the dark tile, so it needs no cut-out; the padding keeps the whole emblem clear
 * of the rounded corners.
 */
export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        'relative inline-grid size-8 shrink-0 place-items-center rounded-[10px] bg-linear-to-br from-accent-soft via-accent to-accent-2 p-px shadow-[0_0_24px_-6px_rgb(99_102_241/0.7)]',
        className,
      )}
    >
      <span className="grid size-full place-items-center overflow-hidden rounded-[9px] bg-canvas">
        <img
          src={profile.brandIcon}
          alt=""
          width={2048}
          height={2048}
          decoding="async"
          draggable={false}
          className="size-full object-contain p-[8%]"
        />
      </span>
    </span>
  )
}

interface LogoProps {
  className?: string
  onNavigate?: () => void
}

export function Logo({ className, onNavigate }: LogoProps) {
  return (
    <Link
      to="/#home"
      onClick={onNavigate}
      className={cn('group flex items-center gap-2.5 rounded-lg', className)}
      aria-label={`${profile.name} — home`}
    >
      <BrandMark className="transition-transform duration-300 group-hover:scale-105" />
      <span className="text-[0.95rem] font-semibold tracking-tight text-fg">{profile.name}</span>
    </Link>
  )
}
