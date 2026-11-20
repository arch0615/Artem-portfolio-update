import { useLayoutEffect, useRef, type ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { Reveal } from './AnimatedSection'

interface SectionHeadingProps {
  id: string
  eyebrow: string
  title: ReactNode
  description?: ReactNode
  align?: 'left' | 'center'
  className?: string
  /** Extra classes for the description paragraph. */
  descriptionClassName?: string
}

export function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  align = 'left',
  className,
  descriptionClassName,
}: SectionHeadingProps) {
  const centered = align === 'center'
  return (
    // From `lg` the heading spans its container so the title can sit on one line (the title sizes itself
    // against the heading's width, hence `@container`); the description keeps a comfortable reading width.
    <Reveal className={cn('@container max-w-3xl lg:max-w-none', centered && 'mx-auto text-center', className)}>
      <Eyebrow centered={centered}>{eyebrow}</Eyebrow>
      <SectionTitle id={id}>{title}</SectionTitle>
      {description && (
        <p
          className={cn(
            'mt-5 max-w-3xl text-base leading-relaxed text-fg-muted sm:text-lg',
            centered && 'mx-auto',
            descriptionClassName,
          )}
        >
          {description}
        </p>
      )}
    </Reveal>
  )
}

/**
 * The section title. On desktop it always sits on one line: at full size when it fits, otherwise just small
 * enough to fit. Its one-line width is measured in em (again once the web font has loaded) and CSS turns that
 * into a size against the heading's width. Below `lg` it wraps as usual.
 */
function SectionTitle({ id, children }: { id: string; children: ReactNode }) {
  const ref = useRef<HTMLHeadingElement>(null)

  useLayoutEffect(() => {
    const heading = ref.current
    if (!heading) return
    const measure = () => {
      if (!heading.isConnected) return
      // Lay the title out on one line at its natural width for a moment (nothing is painted in between).
      const { style } = heading
      style.whiteSpace = 'nowrap'
      style.width = 'max-content'
      const em = heading.offsetWidth / parseFloat(getComputedStyle(heading).fontSize)
      style.whiteSpace = ''
      style.width = ''
      style.setProperty('--title-em', em.toFixed(3))
    }
    measure()
    document.fonts.addEventListener('loadingdone', measure)
    return () => document.fonts.removeEventListener('loadingdone', measure)
  }, [children])

  return (
    <h2
      ref={ref}
      id={id}
      // Desktop: 2.85rem, or 98% of the heading's width divided by the title's width in em, whichever is smaller.
      className="mt-5 text-[2rem] leading-[1.08] font-semibold tracking-[-0.03em] text-fg sm:text-4xl lg:text-[length:min(2.85rem,calc(98cqi/var(--title-em,1)))]"
    >
      {children}
    </h2>
  )
}

function Eyebrow({ children, centered = false }: { children: ReactNode; centered?: boolean }) {
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
