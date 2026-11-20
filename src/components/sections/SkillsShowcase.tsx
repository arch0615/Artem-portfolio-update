import { useRef, useState, type KeyboardEvent } from 'react'
import { Link } from 'react-router'
import { AnimatePresence, m } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { skillsShowcaseContent as labels } from '@/data/content'
import { getProject } from '@/data/projects'
import { projectScreens } from '@/data/project-screens'
import { skillCategories } from '@/data/skills'
import { accentStyle } from '@/lib/accent'
import { cn } from '@/lib/cn'
import { icons } from '@/lib/icons'
import { easeOutExpo } from '@/lib/motion'
import { Reveal } from '@/components/ui/AnimatedSection'
import { ScreenViewer } from '@/components/ui/ScreenViewer'
import { TechChip } from '@/components/ui/TechChip'

/** Skill areas with their project examples resolved (unknown project slugs are skipped). */
const areas = skillCategories.map((category) => ({
  ...category,
  examples: category.examples.flatMap((example) => {
    const project = getProject(example.project)
    if (!project) return []
    const all = projectScreens[project.slug] ?? []
    const screens = example.screens ? all.filter((screen) => example.screens?.includes(screen.file)) : all
    return [{ ...example, project, screens, technologies: example.technologies ?? project.technologies }]
  }),
}))
type Area = (typeof areas)[number]
type Example = Area['examples'][number]

const fade = { duration: 0.3, ease: easeOutExpo }
const label = 'font-mono text-[0.65rem] tracking-[0.18em] text-fg-subtle uppercase'
const countLabel = (count: number) => `${count} ${(count === 1 ? labels.exampleLabel : labels.examplesLabel).toLowerCase()}`

/**
 * The Skills section's explorer: pick a skill area to see its technologies and the real projects
 * that demonstrate it (with a short note and the technologies used); the selected project's real
 * screens sit beside them (below, on small screens). Content: `skills.ts` and `project-screens.ts`.
 */
export function SkillsShowcase({ className }: { className?: string }) {
  const [active, setActive] = useState(0)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const area = areas[active]

  // Arrow keys, Home and End move between the skill areas (WAI-ARIA tabs pattern).
  const onTabKeyDown = (event: KeyboardEvent, index: number) => {
    const target =
      event.key === 'ArrowRight' || event.key === 'ArrowDown'
        ? (index + 1) % areas.length
        : event.key === 'ArrowLeft' || event.key === 'ArrowUp'
          ? (index - 1 + areas.length) % areas.length
          : event.key === 'Home'
            ? 0
            : event.key === 'End'
              ? areas.length - 1
              : -1
    if (target < 0) return
    event.preventDefault()
    setActive(target)
    tabs.current[target]?.focus()
  }

  return (
    <Reveal className={className}>
      <div role="tablist" aria-label={labels.areasLabel} className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-3">
        {areas.map((item, index) => {
          const Icon = icons[item.icon]
          const selected = index === active
          return (
            <button
              key={item.id}
              ref={(element) => {
                tabs.current[index] = element
              }}
              type="button"
              role="tab"
              id={`skills-tab-${item.id}`}
              aria-selected={selected}
              aria-controls="skills-panel"
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(index)}
              onKeyDown={(event) => onTabKeyDown(event, index)}
              className={cn(
                'group flex items-center gap-3 rounded-2xl border p-3 text-left transition-[border-color,background-color] duration-300 sm:gap-4 sm:p-4',
                selected
                  ? 'border-accent/45 bg-white/[0.05]'
                  : 'border-line bg-white/[0.02] hover:border-line-strong hover:bg-white/[0.04]',
              )}
            >
              <span
                className={cn(
                  'grid size-9 shrink-0 place-items-center rounded-xl border transition-colors duration-300 sm:size-11',
                  selected
                    ? 'border-accent/40 bg-accent/15 text-accent-soft'
                    : 'border-line bg-white/[0.03] text-fg-muted group-hover:text-fg',
                )}
              >
                <Icon aria-hidden className="size-4 sm:size-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-[0.8rem] leading-snug font-semibold tracking-tight text-fg sm:text-[0.95rem]">
                  {item.title}
                </span>
                <span className="mt-0.5 hidden text-xs text-fg-subtle sm:block">{countLabel(item.examples.length)}</span>
              </span>
            </button>
          )
        })}
      </div>

      <div role="tabpanel" id="skills-panel" aria-labelledby={`skills-tab-${area.id}`} className="mt-8 lg:mt-12">
        <AnimatePresence mode="wait" initial={false}>
          <AreaPanel key={area.id} area={area} />
        </AnimatePresence>
      </div>
    </Reveal>
  )
}

function AreaPanel({ area }: { area: Area }) {
  const [selected, setSelected] = useState(0)
  const example = area.examples[selected]
  const choosable = area.examples.length > 1

  return (
    <m.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={fade}
      className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-14"
    >
      <div>
        <h3 className="text-2xl font-semibold tracking-tight text-fg sm:text-[2rem]">{area.title}</h3>
        <p className="mt-4 leading-relaxed text-fg-muted sm:text-[1.05rem]">{area.description}</p>

        <h4 className={cn(label, 'mt-8')}>{labels.technologiesLabel}</h4>
        <ul className="mt-3 flex flex-wrap gap-1.5" aria-label={`${area.title}: ${labels.technologiesLabel}`}>
          {area.skills.map((skill) => (
            <li key={skill}>
              <TechChip label={skill} />
            </li>
          ))}
        </ul>

        {example && (
          <>
            <h4 className={cn(label, 'mt-8')}>{choosable ? labels.examplesLabel : labels.exampleLabel}</h4>
            <div className="mt-3 space-y-2.5">
              {area.examples.map((item, index) =>
                choosable ? (
                  <button
                    key={item.project.slug}
                    type="button"
                    aria-pressed={index === selected}
                    onClick={() => setSelected(index)}
                    style={accentStyle(item.project.accent)}
                    className={cn(
                      'block w-full rounded-xl border p-4 text-left transition-[border-color,background-color] duration-300',
                      index === selected
                        ? 'border-[rgb(var(--accent)/0.45)] bg-white/[0.05]'
                        : 'border-line bg-white/[0.015] hover:border-line-strong hover:bg-white/[0.035]',
                    )}
                  >
                    <ExampleSummary example={item} />
                  </button>
                ) : (
                  <div
                    key={item.project.slug}
                    style={accentStyle(item.project.accent)}
                    className="rounded-xl border border-[rgb(var(--accent)/0.35)] bg-white/[0.04] p-4"
                  >
                    <ExampleSummary example={item} />
                  </div>
                ),
              )}
            </div>
            {example.project.featured && (
              <Link
                to={`/projects/${example.project.slug}`}
                className="group mt-5 inline-flex items-center gap-2 text-sm font-medium text-accent-soft transition-colors hover:text-fg"
              >
                {example.project.name} {labels.caseStudy}
                <ArrowRight aria-hidden className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            )}
          </>
        )}
      </div>

      {/* On wide screens the viewer stays in view while reading a long list of examples. */}
      {example && (
        <div style={accentStyle(example.project.accent)} className="lg:self-stretch">
          <div className="lg:sticky lg:top-28">
            <AnimatePresence mode="wait" initial={false}>
              <m.div key={example.project.slug} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={fade}>
                <ScreenViewer screens={example.screens} />
              </m.div>
            </AnimatePresence>
          </div>
        </div>
      )}
    </m.div>
  )
}

function ExampleSummary({ example }: { example: Example }) {
  return (
    <>
      <span className="flex items-center gap-2.5">
        <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-[rgb(var(--accent))]" />
        <span className="font-semibold tracking-tight text-fg">{example.project.name}</span>
      </span>
      <span className="mt-1.5 block text-sm leading-relaxed text-fg-muted">{example.note}</span>
      {example.technologies.length > 0 && (
        <span className="mt-3 flex flex-wrap gap-1.5">
          {example.technologies.map((tech) => (
            <TechChip key={tech} label={tech} />
          ))}
        </span>
      )}
    </>
  )
}
