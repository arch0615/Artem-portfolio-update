import { Link } from 'react-router'
import { profile } from '@/data/profile'
import { cn } from '@/lib/cn'

export function Monogram({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        'relative inline-grid size-8 shrink-0 place-items-center rounded-[10px] bg-linear-to-br from-accent-soft via-accent to-accent-2 p-px shadow-[0_0_24px_-6px_rgb(99_102_241/0.7)]',
        className,
      )}
    >
      <span className="grid size-full place-items-center rounded-[9px] bg-canvas font-mono text-[0.68rem] font-semibold tracking-tight text-fg">
        {profile.initials}
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
      <Monogram className="transition-transform duration-300 group-hover:scale-105" />
      <span className="text-[0.95rem] font-semibold tracking-tight text-fg">{profile.name}</span>
    </Link>
  )
}
