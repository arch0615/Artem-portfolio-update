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
  /**
   * Keep the description on one line from this breakpoint up, easing its size down only where it wouldn't fit.
   * Use `xl` for a long description that would get too small to read at `lg`.
   */
  descriptionOneLine?: 'lg' | 'xl'
}

// 1.125rem, or 98% of the heading's width divided by the description's width in em, whichever is smaller.
// Spelled out per breakpoint so Tailwind can find the classes.
const oneLineDescription = {
  lg: 'lg:max-w-none lg:text-[length:min(1.125rem,calc(98cqi/var(--fit-em,1)))]',
  xl: 'xl:max-w-none xl:text-[length:min(1.125rem,calc(98cqi/var(--fit-em,1)))]',
}

export function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  align = 'left',
  className,
  descriptionClassName,
  descriptionOneLine,
}: SectionHeadingProps) {
  const centered = align === 'center'
  const descriptionRef = useOneLineFit<HTMLParagraphElement>(!!descriptionOneLine && !!description, description)
  return (
    // From `lg` the heading spans its container so the title can sit on one line (the title sizes itself
    // against the heading's width, hence `@container`); the description keeps a comfortable reading width.
    <Reveal className={cn('@container max-w-3xl lg:max-w-none', centered && 'mx-auto text-center', className)}>
      <Eyebrow centered={centered}>{eyebrow}</Eyebrow>
      <SectionTitle id={id}>{title}</SectionTitle>
      {description && (
        <p
          ref={descriptionRef}
          className={cn(
            'mt-5 max-w-3xl text-base leading-relaxed text-fg-muted sm:text-lg',
            centered && 'mx-auto',
            descriptionOneLine && oneLineDescription[descriptionOneLine],
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
 * Keeps an element's text on one line on desktop: at full size when it fits, otherwise just small enough to
 * fit. The text's one-line width is measured in em (again once the web font has loaded) into `--fit-em`, and
 * the element's `lg:` font size divides the heading's width (`cqi`) by it. Below `lg` the text wraps as usual.
 */
function useOneLineFit<T extends HTMLElement>(enabled: boolean, content: ReactNode) {
  const ref = useRef<T>(null)

  useLayoutEffect(() => {
    const element = ref.current
    if (!enabled || !element) return
    const measure = () => {
      if (!element.isConnected) return
      // Lay the text out on one line at its natural width for a moment (nothing is painted in between).
      const { style } = element
      style.whiteSpace = 'nowrap'
      style.width = 'max-content'
      style.maxWidth = 'none'
      const em = element.offsetWidth / parseFloat(getComputedStyle(element).fontSize)
      style.whiteSpace = ''
      style.width = ''
      style.maxWidth = ''
      style.setProperty('--fit-em', em.toFixed(3))
    }
    measure()
    document.fonts.addEventListener('loadingdone', measure)
    return () => document.fonts.removeEventListener('loadingdone', measure)
  }, [enabled, content])

  return ref
}

/** The section title: always on one line on desktop (see `useOneLineFit`). */
function SectionTitle({ id, children }: { id: string; children: ReactNode }) {
  const ref = useOneLineFit<HTMLHeadingElement>(true, children)

  return (
    <h2
      ref={ref}
      id={id}
      // Desktop: 2.85rem, or 98% of the heading's width divided by the title's width in em, whichever is smaller.
      className="mt-5 text-[2rem] leading-[1.08] font-semibold tracking-[-0.03em] text-fg sm:text-4xl lg:text-[length:min(2.85rem,calc(98cqi/var(--fit-em,1)))]"
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
