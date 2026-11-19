import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react'
import { AnimatePresence, m, useInView } from 'framer-motion'
import { ArrowRight, Check, ImageIcon, Monitor, Smartphone } from 'lucide-react'
import { showcaseContent } from '@/data/content'
import { getProject } from '@/data/projects'
import { showcaseProjects } from '@/data/showcase'
import { accentStyle } from '@/lib/accent'
import { cn } from '@/lib/cn'
import { easeOutExpo } from '@/lib/motion'
import { screenshotUrl } from '@/lib/screenshots'
import { Reveal } from '@/components/ui/AnimatedSection'
import { ButtonLink } from '@/components/ui/Button'
import type { ShowcaseScreen } from '@/types'

/** Showcase entries joined with their project (name, category, accent); unknown slugs are skipped. */
const entries = showcaseProjects.flatMap((item) => {
  const project = getProject(item.slug)
  return project ? [{ ...item, project }] : []
})
type Entry = (typeof entries)[number]

const fade = { duration: 0.3, ease: easeOutExpo }

/**
 * Selected work: real projects shown through their real application screens. Tabs pick the project;
 * its details sit on the left (stacked above on small screens), its screens on the right, in phone
 * or browser frames. Content and screenshots: `src/data/showcase.ts`.
 */
export function WorkShowcase({ className }: { className?: string }) {
  const [active, setActive] = useState(0)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  if (!entries.length) return null
  const entry = entries[active]

  // Arrow keys, Home and End move between the project tabs (WAI-ARIA tabs pattern).
  const onTabKeyDown = (event: KeyboardEvent, index: number) => {
    const last = entries.length - 1
    const target =
      event.key === 'ArrowRight' || event.key === 'ArrowDown'
        ? (index + 1) % entries.length
        : event.key === 'ArrowLeft' || event.key === 'ArrowUp'
          ? (index - 1 + entries.length) % entries.length
          : event.key === 'Home'
            ? 0
            : event.key === 'End'
              ? last
              : -1
    if (target < 0) return
    event.preventDefault()
    setActive(target)
    tabs.current[target]?.focus()
  }

  return (
    <Reveal className={className}>
      <div
        role="tablist"
        aria-label={showcaseContent.projectsLabel}
        className="grid grid-cols-1 gap-3 sm:grid-cols-[repeat(var(--tabs),minmax(0,1fr))]"
        style={{ '--tabs': entries.length } as CSSProperties}
      >
        {entries.map((item, index) => {
          const selected = index === active
          return (
            <button
              key={item.slug}
              ref={(element) => {
                tabs.current[index] = element
              }}
              type="button"
              role="tab"
              id={`showcase-tab-${item.slug}`}
              aria-selected={selected}
              aria-controls="showcase-panel"
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(index)}
              onKeyDown={(event) => onTabKeyDown(event, index)}
              style={accentStyle(item.project.accent)}
              className={cn(
                'relative overflow-hidden rounded-2xl border px-5 py-4 text-left transition-[border-color,background-color] duration-300',
                selected
                  ? 'border-[rgb(var(--accent)/0.45)] bg-white/[0.05]'
                  : 'border-line bg-white/[0.02] hover:border-line-strong hover:bg-white/[0.04]',
              )}
            >
              <span
                className={cn(
                  'font-mono text-[0.65rem] tracking-[0.16em] transition-colors',
                  selected ? 'text-[rgb(var(--accent))]' : 'text-fg-subtle',
                )}
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="mt-1.5 block text-base font-semibold tracking-tight text-fg">{item.project.name}</span>
              <span className="mt-0.5 block truncate text-xs text-fg-subtle">{item.project.category}</span>
              <span
                aria-hidden
                className={cn(
                  'absolute inset-x-5 bottom-0 h-px bg-linear-to-r from-transparent via-[rgb(var(--accent))] to-transparent transition-opacity duration-300',
                  selected ? 'opacity-80' : 'opacity-0',
                )}
              />
            </button>
          )
        })}
      </div>

      <div
        role="tabpanel"
        id="showcase-panel"
        aria-labelledby={`showcase-tab-${entry.slug}`}
        style={accentStyle(entry.project.accent)}
        className="mt-8 grid grid-cols-1 items-center gap-10 lg:mt-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-14"
      >
        <AnimatePresence mode="wait" initial={false}>
          <ProjectDetails key={entry.slug} entry={entry} />
        </AnimatePresence>
        <AnimatePresence mode="wait" initial={false}>
          <m.div key={entry.slug} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={fade}>
            <ScreenViewer entry={entry} />
          </m.div>
        </AnimatePresence>
      </div>
    </Reveal>
  )
}

function ProjectDetails({ entry }: { entry: Entry }) {
  const { project } = entry
  return (
    <m.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={fade}
    >
      <p className="font-mono text-[0.68rem] tracking-[0.16em] text-[rgb(var(--accent))] uppercase">{project.category}</p>
      <h3 className="mt-3 text-2xl font-semibold tracking-tight text-fg sm:text-[2rem]">{project.name}</h3>
      <p className="mt-4 leading-relaxed text-fg-muted sm:text-[1.05rem]">{entry.description}</p>

      <h4 className="mt-8 font-mono text-[0.65rem] tracking-[0.18em] text-fg-subtle uppercase">
        {showcaseContent.featuresLabel}
      </h4>
      <ul className="mt-4 space-y-3">
        {entry.features.map((feature) => (
          <li key={feature} className="flex items-start gap-3 text-[0.95rem] text-fg-muted">
            <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border border-[rgb(var(--accent)/0.35)] bg-[rgb(var(--accent)/0.1)]">
              <Check aria-hidden className="size-3 text-[rgb(var(--accent))]" strokeWidth={2.5} />
            </span>
            {feature}
          </li>
        ))}
      </ul>

      {project.featured && (
        <div className="mt-9">
          <ButtonLink to={`/projects/${project.slug}`} variant="secondary" aria-label={`Read the ${project.name} case study`}>
            {showcaseContent.caseStudy}
            <ArrowRight aria-hidden className="size-4 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
          </ButtonLink>
        </div>
      )}
    </m.div>
  )
}

/** The active screen, large, in its device frame, with buttons to switch screens below. */
function ScreenViewer({ entry }: { entry: Entry }) {
  const [index, setIndex] = useState(0)
  const stage = useRef<HTMLDivElement>(null)
  const near = useInView(stage, { once: true, margin: '400px 0px' })
  const screen = entry.screens[index]
  const url = screenshotUrl(screen.file)

  // Once the showcase is close to the screen, fetch this project's screenshots so switching is instant.
  useEffect(() => {
    if (!near) return
    for (const { file } of entry.screens) {
      const src = screenshotUrl(file)
      if (src) new Image().src = src
    }
  }, [near, entry])

  return (
    <div>
      <div ref={stage} className="group relative aspect-[4/5] sm:aspect-[10/7]">
        <div
          aria-hidden
          className="absolute inset-[10%] rounded-full bg-[radial-gradient(closest-side,rgb(var(--accent)/0.16),transparent)]"
        />
        <AnimatePresence>
          <m.div
            key={screen.file}
            initial={{ opacity: 0, scale: 0.985 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: easeOutExpo }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <DeviceFrame device={screen.device}>
              {url ? (
                <img
                  src={url}
                  alt={screen.alt}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  className="absolute inset-0 size-full object-contain"
                />
              ) : (
                <ScreenPlaceholder screen={screen} />
              )}
            </DeviceFrame>
          </m.div>
        </AnimatePresence>
      </div>

      <div
        role="group"
        aria-label={showcaseContent.screensLabel}
        className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-[repeat(var(--screens),minmax(0,1fr))]"
        style={{ '--screens': entry.screens.length } as CSSProperties}
      >
        {entry.screens.map((item, i) => {
          const Icon = item.device === 'phone' ? Smartphone : Monitor
          const current = i === index
          return (
            <button
              key={item.file}
              type="button"
              aria-pressed={current}
              onClick={() => setIndex(i)}
              className={cn(
                'flex min-w-0 items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-xs transition-colors duration-200',
                current
                  ? 'border-[rgb(var(--accent)/0.4)] bg-white/[0.05] text-fg'
                  : 'border-line bg-white/[0.015] text-fg-subtle hover:border-line-strong hover:text-fg-muted',
              )}
            >
              <Icon aria-hidden className={cn('size-3.5 shrink-0', current && 'text-[rgb(var(--accent))]')} />
              <span className="leading-snug">{item.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

/**
 * Thin, restrained frames: a phone for app screens, a browser window for web interfaces. The whole
 * screenshot is always shown, never cropped or stretched (thin dark margins if its proportions differ).
 */
function DeviceFrame({ device, children }: { device: ShowcaseScreen['device']; children: ReactNode }) {
  const lift = 'transition-transform duration-500 ease-out group-hover:-translate-y-1'
  if (device === 'phone') {
    return (
      <div
        className={cn(
          'relative aspect-[9/19.5] h-full rounded-[2.3rem] border border-white/12 bg-[#0b0b10] p-1.5 shadow-[0_40px_80px_-40px_rgb(0_0_0/0.9)]',
          lift,
        )}
      >
        <div className="relative size-full overflow-hidden rounded-[1.95rem] bg-black">{children}</div>
      </div>
    )
  }
  return (
    <div
      className={cn(
        'w-full overflow-hidden rounded-xl border border-white/10 bg-[#0d0d12] shadow-[0_40px_80px_-40px_rgb(0_0_0/0.9)]',
        lift,
      )}
    >
      <div aria-hidden className="flex items-center gap-1.5 border-b border-white/[0.06] px-3.5 py-2.5">
        <span className="size-2 rounded-full bg-white/15" />
        <span className="size-2 rounded-full bg-white/15" />
        <span className="size-2 rounded-full bg-white/15" />
        <span className="ml-3 h-4 w-2/5 rounded-full bg-white/[0.05]" />
      </div>
      <div className="relative aspect-[16/10] bg-black">{children}</div>
    </div>
  )
}

/** Shown in a frame until the real screenshot has been added. */
function ScreenPlaceholder({ screen }: { screen: ShowcaseScreen }) {
  return (
    <div
      role="img"
      aria-label={`${screen.alt}: ${showcaseContent.placeholder.toLowerCase()}`}
      className="absolute inset-0 grid place-items-center overflow-hidden bg-[radial-gradient(ellipse_at_50%_35%,rgb(var(--accent)/0.12),transparent_70%)]"
    >
      <div aria-hidden className="bg-grid-sm absolute inset-0 opacity-50" />
      <div className="relative px-4 text-center">
        <ImageIcon aria-hidden className="mx-auto size-6 text-fg-subtle" strokeWidth={1.5} />
        <p className="mt-3 text-sm font-medium text-fg-muted">{screen.label}</p>
        <p className="mt-1 font-mono text-[0.6rem] tracking-[0.16em] text-fg-subtle uppercase">
          {showcaseContent.placeholder}
        </p>
      </div>
    </div>
  )
}
