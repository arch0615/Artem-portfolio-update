import { useEffect, useRef, type CSSProperties } from 'react'
import { m, useIsPresent, type Transition } from 'framer-motion'
import { ChevronsRight } from 'lucide-react'
import { profile } from '@/data/profile'
import { introContent } from '@/data/content'
import { cn } from '@/lib/cn'
import { easeOutExpo } from '@/lib/motion'
import { motes, particles, ribbonStrands, ribbonViewBox, ribbonWidth, smokeWisps } from './geometry'
import { introTimeline as T, reducedIntroTimeline as R, sweepEase } from './timeline'
import './intro.css'

interface IntroAnimationProps {
  /** False until the first frame is on screen (or while the tab is in the background): dark overlay only. */
  started: boolean
  reduced: boolean
  onSkip: () => void
}

/**
 * "Digital identity reveal" overlay. Purely visual: the scene is hidden from assistive tech,
 * the page underneath stays readable and focusable, and any key, scroll, click/tap or the Skip
 * button ends it. Rendered inside <AnimatePresence>, which plays the exit dissolve.
 *
 * Ending on `click` (not `pointerdown`) and keeping the overlay hit-testable while it fades means
 * the click that skips the intro can never fall through and activate something on the page.
 */
export function IntroAnimation({ started, reduced, onSkip }: IntroAnimationProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const isPresent = useIsPresent()

  // While dissolving, don't leave keyboard focus on a control that is about to disappear:
  // focus returns to the document, so the next Tab starts at the top of the page.
  useEffect(() => {
    if (isPresent) return
    const active = document.activeElement
    if (active instanceof HTMLElement && rootRef.current?.contains(active)) active.blur()
  }, [isPresent])

  return (
    <m.div
      ref={rootRef}
      onClick={onSkip}
      exit={{
        opacity: 0,
        transition: { duration: reduced ? R.exitDuration : T.exitDuration, ease: [0.4, 0, 0.2, 1] },
      }}
      className="fixed inset-0 z-[100] overflow-hidden bg-canvas select-none"
    >
      {started && (reduced ? <ReducedScene /> : <Scene />)}
      {started && <SkipButton onSkip={onSkip} delay={reduced ? 0 : 0.5} disabled={!isPresent} />}
    </m.div>
  )
}

/* -------------------------------------------------------------------------- */
/* Name                                                                       */
/* -------------------------------------------------------------------------- */

const [firstName, ...otherNames] = profile.name.split(' ')
const lastName = otherNames.join(' ')

/**
 * Display size of the name. Set on the element that wraps the name and its effects, so the
 * ribbons, reflection and horizon can be sized in `em` and scale together with the letters.
 * Phones get two lines so the name can stay large.
 */
const nameSize = 'text-[clamp(2rem,11.5vw,4.5rem)] sm:text-[min(7vw,6.25rem)]'

interface NameTextProps {
  className?: string
  wordClassName?: string
  style?: CSSProperties
}

/**
 * The name, in the intro's display type (size inherited from `nameSize`).
 * `padding-left` equal to the tracking re-centres the text (letter-spacing trails the last glyph).
 */
function NameText({ className, wordClassName, style }: NameTextProps) {
  return (
    <span
      style={style}
      className={cn(
        'block pl-[0.08em] text-center leading-[0.95] font-semibold tracking-[0.08em] whitespace-nowrap uppercase',
        className,
      )}
    >
      <span className={cn('block sm:inline', wordClassName)}>{firstName}</span>{' '}
      <span className={cn('block sm:inline', wordClassName)}>{lastName}</span>
    </span>
  )
}

/* -------------------------------------------------------------------------- */
/* Full scene                                                                 */
/* -------------------------------------------------------------------------- */

function Scene() {
  return (
    <>
      <Atmosphere />
      <div aria-hidden className="relative grid h-full place-items-center px-4">
        <div className="flex flex-col items-center">
          <div className={cn('relative', nameSize)}>
            <Smoke />
            <Pulses />
            <Ribbons />
            {/* Keeps smoke, pulses and ribbons behind the letters from competing with them */}
            <span className="intro-backplate absolute -inset-x-[4%] -inset-y-[45%]" />
            <Flare />
            <Motes />
            <NameReveal />
            <FloorShimmer />
            <Beams />
            <Horizon />
          </div>
          <Subtitle animated />
        </div>
      </div>
    </>
  )
}

/** Background drift: sideways and vertical reach of one slow pass (opposite ends at start/end). */
const drift = (x: string, y: string) =>
  ({ animationDuration: `${T.driftDuration}s`, '--intro-drift-x': x, '--intro-drift-y': y }) as CSSProperties

/**
 * Phase 1 — dark entry: ambient glow, faint grid and drifting particles. The colour accents and
 * the grid keep drifting very slowly (in opposite directions) for the whole intro.
 */
function Atmosphere() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <m.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: T.ambientDuration, ease: easeOutExpo }}
        className="intro-ambient absolute inset-0 will-change-transform"
      />
      <div className="intro-drift absolute inset-0" style={drift('1.4%', '0.8%')}>
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: T.accents, duration: T.accentsDuration, ease: easeOutExpo }}
          className="intro-ambient-accents absolute inset-0"
        />
      </div>
      <div className="intro-drift absolute inset-0" style={drift('-0.6%', '-1%')}>
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.35 }}
          transition={{ duration: T.gridDuration }}
          className="bg-grid absolute inset-0 mask-radial-center"
        />
      </div>
      {particles.map((p) => (
        <span
          key={p.id}
          className="intro-particle"
          style={
            {
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              '--intro-o': p.opacity,
              '--intro-dx': `${p.dx}px`,
              '--intro-dy': `${p.dy}px`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  )
}

/**
 * Full-width band whose height follows the name size (taller for the two-line phone layout).
 * The viewBox is stretched to fit (`preserveAspectRatio="none"`): the ribbons always span the
 * screen edge to edge, and their vertical reach stays proportional to the letters, so they frame
 * the name without running into the subtitle on any screen shape.
 */
const ribbonBox =
  'pointer-events-none absolute top-1/2 left-1/2 h-[6.2em] w-screen -translate-x-1/2 -translate-y-1/2 will-change-transform sm:h-[4.4em]'

const leadStrands = ribbonStrands.filter((strand) => strand.halo)

const draw = (index: number): Transition => {
  const delay = T.energy + index * T.energyStagger
  return {
    pathLength: { delay, duration: T.energyDuration, ease: [0.6, 0, 0.3, 1] },
    opacity: { delay, duration: T.energyFadeIn },
  }
}

/**
 * Phase 2 — energy ribbons flow in from the left and part around the name.
 * Strokes and glints sit on separate layers so each frame only repaints what moves.
 * The gradients fade to transparent at both ends, so no CSS mask is needed.
 */
function Ribbons() {
  return (
    <>
      <svg aria-hidden viewBox={ribbonViewBox} preserveAspectRatio="none" className={ribbonBox}>
        <defs>
          <linearGradient id="intro-ribbon-upper" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={ribbonWidth} y2="0">
            <stop offset="0" stopColor="#3b82f6" stopOpacity="0" />
            <stop offset="0.16" stopColor="#3b82f6" />
            <stop offset="0.5" stopColor="#c7d2fe" />
            <stop offset="0.84" stopColor="#8b5cf6" />
            <stop offset="1" stopColor="#8b5cf6" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="intro-ribbon-lower" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={ribbonWidth} y2="0">
            <stop offset="0" stopColor="#8b5cf6" stopOpacity="0" />
            <stop offset="0.16" stopColor="#8b5cf6" />
            <stop offset="0.5" stopColor="#a5b4fc" />
            <stop offset="0.84" stopColor="#3b82f6" />
            <stop offset="1" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
        </defs>

        {ribbonStrands.map((strand, index) => (
          <g
            key={strand.id}
            fill="none"
            strokeLinecap="round"
            stroke={`url(#intro-ribbon-${strand.side < 0 ? 'upper' : 'lower'})`}
          >
            {/* Soft halo on the lead strands only, then the bright core */}
            {strand.halo && (
              <m.path
                d={strand.d}
                strokeWidth={strand.weight * 7}
                strokeOpacity={0.12}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={draw(index)}
              />
            )}
            <m.path
              d={strand.d}
              strokeWidth={strand.weight * 1.6}
              strokeOpacity={strand.intensity}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={draw(index)}
            />
          </g>
        ))}
      </svg>
      <Glints />
    </>
  )
}

/** Light glints that keep the energy flowing left to right once the ribbons are drawn. */
function Glints() {
  const layers = [
    { width: 10, color: 'rgb(165 180 252 / 0.28)' },
    { width: 2.4, color: '#eef2ff' },
  ]
  return (
    <svg aria-hidden viewBox={ribbonViewBox} preserveAspectRatio="none" className={ribbonBox}>
      {leadStrands.map((strand, index) =>
        layers.map((layer) => (
          <path
            key={`${strand.id}-${layer.width}`}
            d={strand.d}
            pathLength={1}
            stroke={layer.color}
            strokeWidth={layer.width}
            className="intro-spark"
            style={{
              animationDelay: `${T.glints + index * T.glintStagger}s`,
              animationDuration: `${T.glintDuration}s`,
            }}
          />
        )),
      )}
    </svg>
  )
}

/** Start of phase 3 — a horizontal flare ignites at the centre. */
function Flare() {
  return (
    <>
      <m.span
        initial={{ scale: 0.2, opacity: 0 }}
        animate={{ scale: [0.2, 1, 1.12], opacity: [0, 0.9, 0.3] }}
        transition={{ delay: T.flare, duration: T.bloomDuration, times: [0, 0.3, 1], ease: 'easeOut' }}
        className="absolute top-1/2 left-1/2 size-[min(80vw,32rem)] -translate-x-1/2 -translate-y-1/2 rounded-full will-change-transform intro-bloom"
      />
      <m.span
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: [0, 1, 1.15], opacity: [0, 1, 0] }}
        transition={{ delay: T.flare, duration: T.streakDuration, times: [0, 0.35, 1], ease: 'easeOut' }}
        className="absolute top-1/2 left-1/2 h-0.5 w-[min(120vw,100rem)] -translate-x-1/2 -translate-y-1/2 will-change-transform bg-linear-to-r from-transparent via-white to-transparent"
      />
    </>
  )
}

/**
 * Phase 3 — the name opens from the centre outward behind two scan beams, then a gloss sweep.
 * Only the mask and the light move: the letters themselves are never moved, scaled or distorted.
 */
function NameReveal() {
  return (
    <m.div
      initial={{ clipPath: 'inset(-40% 50% -130% 50%)' }}
      animate={{ clipPath: 'inset(-40% -10% -130% -10%)' }}
      transition={{ delay: T.name, duration: T.nameReveal, ease: sweepEase }}
      className="relative"
    >
      <div className="relative">
        <NameText className="intro-name-glow" wordClassName="intro-name-fill" />
        {/* Own layer, so the sweep repaints only itself and never the glowing text below */}
        <NameText
          className="intro-sheen absolute inset-0 will-change-transform"
          style={{ animationDelay: `${T.sheen}s`, animationDuration: `${T.sheenDuration}s` }}
        />
      </div>
      <NameText
        className="intro-reflection intro-reflection-live absolute inset-x-0 top-[calc(100%-0.1em)] will-change-transform"
        wordClassName="intro-name-fill"
        style={{ animationDelay: `${T.shimmer}s` }}
      />
    </m.div>
  )
}

/** Light gliding across the floor reflection, left to right, every few seconds. */
function FloorShimmer() {
  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: T.shimmer, duration: 0.8 }}
      className="intro-floor pointer-events-none absolute top-[calc(100%-0.1em)] left-1/2 h-[0.95em] w-[min(94vw,78rem)] -translate-x-1/2"
    >
      <div className="intro-floor-depth">
        <span
          className="intro-floor-band"
          style={{ animationDelay: `${T.shimmer}s`, animationDuration: `${T.shimmerPeriod}s` }}
        />
      </div>
    </m.div>
  )
}

/**
 * Phase 2 — soft blue/violet energy smoke flowing slowly left to right behind the ribbons.
 * Each wisp runs one pass longer than the intro, so the flow never stops or turns back.
 */
function Smoke() {
  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: T.smoke, duration: T.smokeFadeIn, ease: 'easeOut' }}
      className="pointer-events-none absolute top-1/2 left-1/2 h-[7em] w-screen -translate-x-1/2 -translate-y-1/2 sm:h-[5em]"
    >
      {smokeWisps.map((wisp) => (
        <span
          key={wisp.id}
          className={`intro-smoke intro-smoke-${wisp.tone}`}
          style={
            {
              left: `${wisp.left}%`,
              top: `${wisp.top}%`,
              width: `${wisp.width}%`,
              height: `${wisp.height}%`,
              animationDuration: `${wisp.duration}s`,
              animationDelay: `${wisp.delay}s`,
              '--intro-r': `${wisp.rotate}deg`,
            } as CSSProperties
          }
        />
      ))}
    </m.div>
  )
}

/** Gentle blue and violet light pulses behind the letters (dimmed right behind them by the backplate). */
function Pulses() {
  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: T.pulses, duration: T.pulsesFadeIn, ease: 'easeOut' }}
      className="pointer-events-none absolute inset-0"
    >
      <span
        className="intro-pulse intro-pulse-blue"
        style={{ animationDuration: `${T.pulsePeriod}s`, animationDelay: `${T.pulses}s` }}
      />
      <span
        className="intro-pulse intro-pulse-violet"
        style={{ animationDuration: `${T.pulsePeriod}s`, animationDelay: `${T.pulses + T.pulsePeriod / 2}s` }}
      />
    </m.div>
  )
}

/** Glowing motes floating around the name; rendered behind the letters so they never cover them. */
function Motes() {
  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: T.motes, duration: T.motesFadeIn, ease: 'easeOut' }}
      className="pointer-events-none absolute inset-0"
    >
      {motes.map((mote) => (
        <span
          key={mote.id}
          className="intro-mote"
          style={
            {
              left: `${mote.x}%`,
              top: `${mote.y}%`,
              width: mote.size,
              height: mote.size,
              animationDuration: `${mote.duration}s`,
              animationDelay: `${mote.delay}s`,
              '--intro-o': mote.opacity,
              '--intro-dx': `${mote.dx}px`,
              '--intro-dy': `${mote.dy}px`,
            } as CSSProperties
          }
        />
      ))}
    </m.div>
  )
}

function Beams() {
  // The mask edge travels from 50% to -10% inset (60% of the width), i.e. 120% of each half.
  const travel = { delay: T.name, duration: T.nameReveal, ease: sweepEase }
  const fade = { delay: T.name, duration: T.nameReveal * 1.15, times: [0, 0.12, 0.7, 1] }
  const beams = [
    { side: 'right', className: 'left-1/2', to: '120%' },
    { side: 'left', className: 'right-1/2', to: '-120%' },
  ] as const

  return (
    <div className="pointer-events-none absolute inset-x-0 -inset-y-[30%]">
      {beams.map((beam) => (
        <m.div
          key={beam.side}
          initial={{ x: '0%', opacity: 0 }}
          animate={{ x: beam.to, opacity: [0, 1, 1, 0] }}
          transition={{ x: travel, opacity: fade }}
          className={cn('absolute inset-y-0 w-1/2 will-change-transform', beam.className)}
        >
          <span
            className={cn(
              'absolute inset-y-[12%] w-14 bg-[radial-gradient(closest-side,rgb(165_180_252/0.5),transparent)]',
              beam.side === 'right' ? 'left-0 -translate-x-1/2' : 'right-0 translate-x-1/2',
            )}
          />
          <span
            className={cn(
              'absolute inset-y-0 w-px bg-linear-to-b from-transparent via-white to-transparent',
              beam.side === 'right' ? 'left-0' : 'right-0',
            )}
          />
        </m.div>
      ))}
    </div>
  )
}

/** Ground sheen: a hairline horizon and soft glow under the name. */
function Horizon() {
  return (
    <>
      <m.span
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ delay: T.name, duration: T.horizonDuration, ease: easeOutExpo }}
        className="absolute top-[calc(100%-0.1em)] left-1/2 h-px w-[min(94vw,78rem)] -translate-x-1/2 will-change-transform bg-linear-to-r from-transparent via-indigo-200/55 to-transparent"
      />
      <m.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: T.groundGlow, duration: T.groundGlowDuration, ease: easeOutExpo }}
        className="absolute top-full left-1/2 h-24 w-[min(80vw,52rem)] -translate-x-1/2 -translate-y-1/2 intro-ground"
      />
    </>
  )
}

/* -------------------------------------------------------------------------- */
/* Subtitle, skip control, reduced-motion scene                               */
/* -------------------------------------------------------------------------- */

/** Phase 4 — role lines. Static (for the reduced scene) when `animated` is false. */
function Subtitle({ animated = false }: { animated?: boolean }) {
  const [primary, secondary] = introContent.roles
  const enter = (index: number) =>
    animated
      ? {
          initial: { opacity: 0, y: 10, filter: 'blur(4px)' },
          animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
          transition: {
            delay: T.subtitle + index * T.subtitleStagger,
            duration: T.subtitleDuration,
            ease: easeOutExpo,
          },
        }
      : {}

  return (
    <div className="mt-[clamp(5rem,10vw,6rem)] flex flex-col items-center gap-3 text-center font-mono uppercase">
      <m.p
        {...enter(0)}
        className="flex items-center gap-3 text-[0.72rem] tracking-[0.26em] text-fg/85 sm:gap-4 sm:text-sm sm:tracking-[0.34em]"
      >
        <span className="hidden h-px w-8 bg-linear-to-r from-transparent to-accent-soft/80 min-[400px]:block sm:w-12" />
        <span className="pl-[0.26em] sm:pl-[0.34em]">{primary}</span>
        <span className="hidden h-px w-8 bg-linear-to-l from-transparent to-accent-soft/80 min-[400px]:block sm:w-12" />
      </m.p>
      <m.p
        {...enter(1)}
        className="pl-[0.3em] text-[0.66rem] tracking-[0.3em] text-indigo-200/70 sm:text-xs sm:tracking-[0.36em]"
      >
        {secondary}
      </m.p>
    </div>
  )
}

interface SkipButtonProps {
  onSkip: () => void
  delay: number
  /** True while the overlay dissolves: no longer focusable, still blocks the click beneath it. */
  disabled: boolean
}

function SkipButton({ onSkip, delay, disabled }: SkipButtonProps) {
  return (
    <m.button
      type="button"
      onClick={onSkip}
      disabled={disabled}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.5 }}
      className="absolute right-[max(1rem,env(safe-area-inset-right))] bottom-[max(1rem,env(safe-area-inset-bottom))] inline-flex min-h-10 items-center gap-1.5 rounded-full border border-line bg-white/[0.03] pr-3 pl-4 font-mono text-[0.68rem] tracking-[0.18em] text-fg-muted uppercase transition-colors duration-200 hover:border-line-strong hover:text-fg sm:right-6 sm:bottom-6"
    >
      {introContent.skipLabel}
      <ChevronsRight aria-hidden className="size-3.5" strokeWidth={1.75} />
    </m.button>
  )
}

/** Reduced motion: no movement, light streaks or particles — the identity simply fades in and out. */
function ReducedScene() {
  return (
    <>
      <div
        aria-hidden
        className="intro-ambient pointer-events-none absolute inset-0"
      />
      <m.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: R.fadeIn, ease: 'easeOut' }}
        className="relative grid h-full place-items-center px-4"
      >
        <div className="flex flex-col items-center">
          <div className={cn('relative', nameSize)}>
            <NameText className="intro-name-glow" wordClassName="intro-name-fill" />
            <span className="absolute top-[calc(100%-0.1em)] left-1/2 h-px w-[min(94vw,78rem)] -translate-x-1/2 bg-linear-to-r from-transparent via-indigo-200/55 to-transparent" />
          </div>
          <Subtitle />
        </div>
      </m.div>
    </>
  )
}
