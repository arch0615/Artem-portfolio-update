import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { Reveal } from './AnimatedSection'

interface SectionHeadingProps {
  id: string
  eyebrow: string
  title: ReactNode
  description?: ReactNode
  align?: 'left' | 'center'
  className?: string
}

export function SectionHeading({ id, eyebrow, title, description, align = 'left', className }: SectionHeadingProps) {
  const centered = align === 'center'
  return (
    <Reveal className={cn('max-w-3xl', centered && 'mx-auto text-center', className)}>
      <Eyebrow centered={centered}>{eyebrow}</Eyebrow>
      <h2
        id={id}
        className="mt-5 text-[2rem] leading-[1.08] font-semibold tracking-[-0.03em] text-fg sm:text-4xl lg:text-[2.85rem]"
      >
        {title}
      </h2>
      {description && (
        <p className="mt-5 text-base leading-relaxed text-fg-muted sm:text-lg">{description}</p>
      )}
    </Reveal>
  )
}

export function Eyebrow({ children, centered = false }: { children: ReactNode; centered?: boolean }) {
  return (
    <p
      className={cn(
        'flex items-center gap-3 font-mono text-[0.7rem] font-medium tracking-[0.2em] text-accent-soft uppercase',
        centered && 'justify-center',
      )}
    >
      <span aria-hidden className="h-px w-6 bg-linear-to-r from-transparent to-accent-soft/70" />
      {children}
      {centered && <span aria-hidden className="h-px w-6 bg-linear-to-l from-transparent to-accent-soft/70" />}
    </p>
  )
}
