import { useEffect, useRef, useSyncExternalStore, type KeyboardEvent } from 'react'
import { useReducedMotion } from 'framer-motion'
import type { SkillCategory } from '@/types'
import { skillsContent as labels } from '@/data/content'
import { cn } from '@/lib/cn'
import { icons } from '@/lib/icons'

interface SkillCategorySelectorProps {
  categories: SkillCategory[]
  active: number
  onSelect: (index: number) => void
  /** id of the panel the tabs control. */
  panelId: string
  /** id of a category's tab (the panel is labelled by the selected one). */
  tabId: (category: SkillCategory) => string
}

// The tabs are a vertical list beside the grid from `lg`, and a horizontally scrolling row above it below.
const desktopQuery = '(min-width: 64rem)'
const subscribeDesktop = (onChange: () => void) => {
  const query = window.matchMedia(desktopQuery)
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}
const isDesktop = () => window.matchMedia(desktopQuery).matches

const countLabel = (count: number) => `${count} ${count === 1 ? labels.technology : labels.technologies}`

/** Skill category tabs (WAI-ARIA tabs pattern: arrow keys, Home and End move and select). */
export function SkillCategorySelector({ categories, active, onSelect, panelId, tabId }: SkillCategorySelectorProps) {
  const list = useRef<HTMLDivElement>(null)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const vertical = useSyncExternalStore(subscribeDesktop, isDesktop, () => true)
  const reduced = useReducedMotion()

  // In the scrolling row, keep the selected tab in view (scrolls the row only, never the page).
  useEffect(() => {
    const row = list.current
    const tab = tabs.current[active]
    if (!row || !tab || row.scrollWidth <= row.clientWidth) return
    row.scrollTo({ left: tab.offsetLeft - (row.clientWidth - tab.offsetWidth) / 2, behavior: reduced ? 'auto' : 'smooth' })
  }, [active, reduced])

  const onKeyDown = (event: KeyboardEvent, index: number) => {
    const last = categories.length - 1
    const target =
      event.key === 'ArrowDown' || event.key === 'ArrowRight'
        ? index === last ? 0 : index + 1
        : event.key === 'ArrowUp' || event.key === 'ArrowLeft'
          ? index === 0 ? last : index - 1
          : event.key === 'Home'
            ? 0
            : event.key === 'End'
              ? last
              : -1
    if (target < 0) return
    event.preventDefault()
    onSelect(target)
    tabs.current[target]?.focus()
  }

  return (
    <div
      ref={list}
      role="tablist"
      aria-label={labels.categoriesLabel}
      aria-orientation={vertical ? 'vertical' : 'horizontal'}
      className={cn(
        // Phones and tablets: a row that scrolls sideways, bleeding to the screen edges, with faded ends.
        'relative -mx-5 flex snap-x scroll-px-5 gap-2 overflow-x-auto px-5 py-1 [scrollbar-width:none] sm:-mx-6 sm:scroll-px-6 sm:px-6 [&::-webkit-scrollbar]:hidden',
        '[mask-image:linear-gradient(to_right,transparent,#000_1.25rem,#000_calc(100%-1.25rem),transparent)]',
        // Desktop: a vertical list.
        'lg:mx-0 lg:flex-col lg:gap-1.5 lg:overflow-visible lg:p-0 lg:[mask-image:none]',
      )}
    >
      {categories.map((category, index) => {
        const Icon = icons[category.icon]
        const selected = index === active
        return (
          <button
            key={category.id}
            ref={(element) => {
              tabs.current[index] = element
            }}
            type="button"
            role="tab"
            id={tabId(category)}
            aria-selected={selected}
            aria-controls={panelId}
            tabIndex={selected ? 0 : -1}
            onClick={() => onSelect(index)}
            onKeyDown={(event) => onKeyDown(event, index)}
            className={cn(
              'group relative flex min-h-11 shrink-0 snap-start items-center gap-2.5 rounded-full border py-1.5 pr-4 pl-1.5 text-left whitespace-nowrap transition-[background-color,border-color,color] duration-250 ease-out',
              'lg:w-full lg:gap-3.5 lg:rounded-xl lg:py-3 lg:pr-4 lg:pl-4 lg:whitespace-normal',
              selected
                ? 'border-accent/45 bg-white/[0.06] text-fg'
                : 'border-line bg-white/[0.02] text-fg-muted hover:border-line-strong hover:bg-white/[0.04] hover:text-fg lg:border-transparent lg:bg-transparent',
            )}
          >
            {/* Active indicator (desktop). */}
            <span
              aria-hidden
              className={cn(
                'absolute top-1/2 left-0 hidden h-6 w-[3px] -translate-y-1/2 rounded-full bg-accent-soft transition-opacity duration-250 lg:block',
                selected ? 'opacity-100' : 'opacity-0',
              )}
            />
            <span
              className={cn(
                'grid size-8 shrink-0 place-items-center rounded-full border transition-colors duration-250 lg:size-10 lg:rounded-lg',
                selected
                  ? 'border-accent/40 bg-accent/15 text-accent-soft'
                  : 'border-line bg-white/[0.03] text-fg-muted group-hover:text-fg',
              )}
            >
              <Icon aria-hidden className="size-4 lg:size-[1.15rem]" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm leading-snug font-medium tracking-tight lg:text-[0.95rem] lg:font-semibold">
                {category.title}
              </span>
              <span className="mt-0.5 hidden text-xs text-fg-subtle lg:block">
                {countLabel(category.technologies.length)}
              </span>
            </span>
          </button>
        )
      })}
    </div>
  )
}
