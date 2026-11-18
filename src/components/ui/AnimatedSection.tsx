import type { HTMLAttributes, ReactNode } from 'react'
import { m } from 'framer-motion'
import { cn } from '@/lib/cn'
import { fadeUp, staggerContainer, viewportOnce } from '@/lib/motion'
import { useIntroRevealed } from '@/components/intro/intro-context'

interface AnimatedSectionProps extends HTMLAttributes<HTMLElement> {
  id: string
  /** id of the heading that labels this section. */
  labelledBy?: string
  children: ReactNode
}

/** Semantic page section with consistent vertical rhythm and scroll offset. */
export function AnimatedSection({ id, labelledBy, className, children, ...props }: AnimatedSectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn('relative py-24 sm:py-28 lg:py-32', className)}
      {...props}
    >
      {children}
    </section>
  )
}

interface RevealProps {
  children: ReactNode
  className?: string
  delay?: number
}

/** Fades and lifts its content into view once. */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  // Content already on screen at load waits for the intro overlay instead of animating under it.
  const revealed = useIntroRevealed()
  return (
    <m.div
      className={className}
      initial="hidden"
      whileInView={revealed ? 'visible' : undefined}
      viewport={viewportOnce}
      variants={fadeUp}
      transition={{ delay }}
    >
      {children}
    </m.div>
  )
}

interface StaggerProps {
  children: ReactNode
  className?: string
  as?: 'div' | 'ul' | 'ol'
  stagger?: number
  delay?: number
}

const staggerTags = { div: m.div, ul: m.ul, ol: m.ol }

/** Container that reveals `StaggerItem` children one after another. */
export function Stagger({ children, className, as = 'div', stagger = 0.08, delay = 0 }: StaggerProps) {
  const Tag = staggerTags[as] as typeof m.div
  const revealed = useIntroRevealed()
  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView={revealed ? 'visible' : undefined}
      viewport={viewportOnce}
      variants={staggerContainer(stagger, delay)}
    >
      {children}
    </Tag>
  )
}

interface StaggerItemProps {
  children: ReactNode
  className?: string
  as?: 'div' | 'li'
}

const itemTags = { div: m.div, li: m.li }

export function StaggerItem({ children, className, as = 'div' }: StaggerItemProps) {
  const Tag = itemTags[as] as typeof m.div
  return (
    <Tag className={className} variants={fadeUp}>
      {children}
    </Tag>
  )
}
