import { useRef } from 'react'
import { AnimatePresence, m, useInView, useReducedMotion, type Variants } from 'framer-motion'
import type { SkillCategory } from '@/types'
import { useIntroRevealed } from '@/components/intro/intro-context'
import { useTechLogos } from '@/lib/tech-logo-store'
import { SkillCard } from './SkillCard'

interface SkillGridProps {
  category: SkillCategory
  /** Technologies in the largest category: the grid reserves room for them so switching never shifts the page. */
  maxCount: number
}

const columns = 'grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 xl:grid-cols-4 xl:gap-3.5'
const cardHeight = 'h-[6.75rem] sm:h-28 lg:h-[7.5rem]'
const easeOut = [0.22, 1, 0.36, 1] as const

// The previous category fades out quickly; the new cards then rise in one after another, in
// reading order (left to right, top to bottom).
const listVariants: Variants = {
  hidden: {},
  show: {},
  exit: { opacity: 0, transition: { duration: 0.18, ease: 'easeOut' } },
}
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.95 },
  show: (index: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: easeOut, delay: index * 0.055 },
  }),
}
// Reduced motion: no movement and no cascade, just a short fade.
const reducedCardVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.2 } },
}

/** The selected category's technologies, cascading in when the section comes into view and on every switch. */
export function SkillGrid({ category, maxCount }: SkillGridProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -12% 0px' })
  const revealed = useIntroRevealed()
  const reduced = useReducedMotion()
  const { logos, failed } = useTechLogos()
  // Cards and their logos appear together: wait for the logos (or show names only if they failed).
  const play = inView && revealed && (logos !== null || failed)

  return (
    <div ref={ref} className="grid">
      <ul aria-hidden className={`invisible col-start-1 row-start-1 ${columns}`}>
        {Array.from({ length: maxCount }, (_, index) => (
          <li key={index} className={cardHeight} />
        ))}
      </ul>
      <AnimatePresence mode="wait">
        <m.ul
          key={category.id}
          aria-label={`${category.title} technologies`}
          className={`col-start-1 row-start-1 content-start ${columns}`}
          variants={listVariants}
          initial="hidden"
          animate={play ? 'show' : 'hidden'}
          exit="exit"
        >
          {category.technologies.map((technology, index) => (
            <m.li
              key={technology.name}
              custom={index}
              variants={reduced ? reducedCardVariants : cardVariants}
              className={cardHeight}
            >
              <SkillCard technology={technology} />
            </m.li>
          ))}
        </m.ul>
      </AnimatePresence>
    </div>
  )
}
