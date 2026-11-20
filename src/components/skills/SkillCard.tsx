import { memo, type CSSProperties } from 'react'
import type { Technology } from '@/types'
import { TechIcon } from './TechIcon'

/** One technology: its logo and name. Hover lifts the card and gives the logo a faint brand-coloured halo. */
export const SkillCard = memo(function SkillCard({ technology }: { technology: Technology }) {
  const { icon, name } = technology
  const brand = icon.type === 'generic' ? undefined : ({ '--brand': icon.color } as CSSProperties)

  return (
    <div
      style={brand}
      className="group relative flex h-full flex-col items-center justify-center gap-2.5 overflow-hidden rounded-2xl border border-line bg-[rgb(13_14_24/0.62)] px-2.5 text-center shadow-[inset_0_1px_0_rgb(255_255_255/0.04),0_12px_28px_-20px_rgb(0_0_0/0.9)] transition-[translate,border-color,background-color] duration-300 ease-out hover:-translate-y-[3px] hover:border-line-strong hover:bg-[rgb(17_18_30/0.72)] sm:gap-3 sm:px-3"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_50%_at_50%_34%,color-mix(in_srgb,var(--brand,var(--color-accent))_14%,transparent),transparent)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
      <span className="relative flex h-8 items-center justify-center transition-[scale,filter] duration-300 ease-out group-hover:scale-[1.08] group-hover:brightness-110 sm:h-9 lg:h-10">
        <TechIcon icon={icon} className="h-full w-auto max-w-12 sm:max-w-[3.25rem] lg:max-w-14" />
      </span>
      <span className="relative line-clamp-2 text-[0.8rem] leading-snug font-medium text-fg/85 transition-colors duration-300 group-hover:text-fg sm:text-sm">
        {name}
      </span>
    </div>
  )
})
