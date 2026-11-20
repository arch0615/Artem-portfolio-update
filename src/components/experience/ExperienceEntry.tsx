import { m, type Variants } from 'framer-motion'
import type { Position } from '@/types'
import { experienceContent as labels } from '@/data/content'
import { cn } from '@/lib/cn'
import { icons } from '@/lib/icons'
import { formatMonth } from '@/lib/months'
import { easeOutExpo, fadeUp, viewportOnce } from '@/lib/motion'
import { useIntroRevealed } from '@/components/intro/intro-context'
import { SpotlightCard } from '@/components/ui/SpotlightCard'
import { TechTag } from '@/components/ui/TechTag'

interface ExperienceEntryProps {
  position: Position
  /** The oldest position: the timeline line stops at its marker. */
  last: boolean
}

// The card rises in, the company marker settles onto the line and the line then draws down to the next one.
const metaVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.7, ease: easeOutExpo, delay: 0.1 } },
}
const markerVariants: Variants = {
  hidden: { opacity: 0, scale: 0.6 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: easeOutExpo } },
}
const lineVariants: Variants = {
  hidden: { scaleY: 0 },
  visible: { scaleY: 1, transition: { duration: 1.2, ease: easeOutExpo, delay: 0.25 } },
}

/** "C" for Coinbag, "GS" for Giant Swarm. */
const monogram = (company: string) =>
  company
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()

/**
 * One position in the Experience timeline. Desktop: dates and location, the timeline line with the company
 * marker, then the card. Tablets: the line and the card. Phones: the card alone, with the marker in its header.
 */
export function ExperienceEntry({ position, last }: ExperienceEntryProps) {
  const revealed = useIntroRevealed()
  const { company, role, summary, highlights, technologies } = position
  const initials = monogram(company)

  return (
    <m.li
      initial="hidden"
      whileInView={revealed ? 'visible' : undefined}
      viewport={viewportOnce}
      className="grid grid-cols-1 sm:grid-cols-[2.75rem_minmax(0,1fr)] sm:gap-x-5 lg:grid-cols-[11rem_2.75rem_minmax(0,1fr)] lg:gap-x-6 xl:grid-cols-[13.5rem_2.75rem_minmax(0,1fr)] xl:gap-x-8"
    >
      {/* Desktop: period and location beside the line, level with the company name and role. */}
      <m.div variants={metaVariants} className="hidden lg:block lg:pt-10 lg:text-right">
        <Period position={position} />
        <Location position={position} className="mt-4 justify-end" />
      </m.div>

      {/* Timeline line and company marker (tablets and up). */}
      <div aria-hidden className="relative hidden sm:block">
        {!last && (
          <m.span
            variants={lineVariants}
            className="absolute top-[2.75rem] -bottom-8 left-1/2 w-px origin-top -translate-x-1/2 bg-linear-to-b from-accent-soft/60 via-accent/25 to-line lg:top-12"
          />
        )}
        <m.span
          variants={markerVariants}
          className="relative mt-[1.375rem] grid size-11 place-items-center rounded-xl border border-accent/35 bg-canvas bg-linear-to-br from-accent/20 to-accent-2/5 text-sm font-semibold tracking-tight text-accent-soft shadow-[0_0_26px_-8px_rgb(99_102_241/0.7)] lg:mt-[1.625rem]"
        >
          {initials}
        </m.span>
      </div>

      <m.div variants={fadeUp} className="min-w-0">
        <SpotlightCard className="p-5 sm:p-7 lg:p-8">
          <header className="flex items-start gap-3.5">
            <span
              aria-hidden
              className="grid size-10 shrink-0 place-items-center rounded-xl border border-accent/35 bg-linear-to-br from-accent/20 to-accent-2/5 text-sm font-semibold tracking-tight text-accent-soft sm:hidden"
            >
              {initials}
            </span>
            <div className="min-w-0">
              <h3 className="text-xl leading-8 font-semibold tracking-tight text-fg sm:text-2xl">{company}</h3>
              <p className="mt-0.5 text-[0.95rem] font-medium text-fg/85 sm:mt-1 sm:text-lg">{role}</p>
            </div>
          </header>

          {/* Phones and tablets: period and location under the role. */}
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 lg:hidden">
            <Period position={position} />
            <Location position={position} />
          </div>

          <p className="mt-5 max-w-4xl text-[0.95rem] leading-relaxed text-fg-muted sm:text-base">{summary}</p>

          <ul
            aria-label={labels.highlightsLabel}
            className="mt-5 grid grid-cols-1 gap-x-8 gap-y-3 border-t border-line pt-5 xl:grid-cols-2"
          >
            {highlights.map((highlight) => (
              <li key={highlight} className="relative pl-5 text-sm leading-relaxed text-fg/80 sm:text-[0.94rem]">
                <span aria-hidden className="absolute top-[0.6em] left-0.5 size-1.5 rounded-full bg-accent-soft/80" />
                {highlight}
              </li>
            ))}
          </ul>

          <ul aria-label={labels.technologiesLabel} className="mt-6 flex flex-wrap gap-2">
            {technologies.map((technology) => (
              <li key={technology}>
                <TechTag label={technology} />
              </li>
            ))}
          </ul>
        </SpotlightCard>
      </m.div>
    </m.li>
  )
}

function Period({ position: { start, end } }: { position: Position }) {
  return (
    <p className="font-mono text-[0.7rem] leading-4 tracking-[0.14em] whitespace-nowrap text-accent-soft uppercase">
      <time dateTime={start}>{formatMonth(start)}</time>
      {' – '}
      {end === 'present' ? labels.present : <time dateTime={end}>{formatMonth(end)}</time>}
    </p>
  )
}

function Location({ position, className }: { position: Position; className?: string }) {
  const Pin = icons.mapPin
  return (
    <p className={cn('flex items-center gap-1.5 text-sm leading-5 text-fg-subtle', className)}>
      <Pin aria-hidden className="size-3.5 shrink-0" />
      {position.location}
    </p>
  )
}
