import { useId } from 'react'
import type { TechnologyIcon } from '@/types'
import { cn } from '@/lib/cn'
import { icons } from '@/lib/icons'
import { useTechLogos } from '@/lib/tech-logo-store'

interface TechIconProps {
  icon: TechnologyIcon
  /** Size it by height; logos keep their own proportions (cap wide ones with a max width). */
  className?: string
}

/** A technology's official logo, or a Lucide icon for a capability without one. Decorative. */
export function TechIcon({ icon, className }: TechIconProps) {
  if (icon.type === 'generic') {
    const Icon = icons[icon.icon]
    return <Icon aria-hidden strokeWidth={1.5} className={cn('aspect-square text-accent-soft', className)} />
  }
  return <BrandLogo icon={icon} className={className} />
}

function BrandLogo({ icon, className }: { icon: Exclude<TechnologyIcon, { type: 'generic' }>; className?: string }) {
  const { logos } = useTechLogos()
  // Gradient ids must be unique on the page, even when the same logo appears twice.
  const uid = useId().replace(/[^\w-]/g, '')
  const logo = icon.type === 'mono' ? logos?.mono[icon.logo] : logos?.multicolor[icon.logo]

  // Until the logos arrive, an empty square keeps the card's layout steady.
  if (!logo) return <span aria-hidden className={cn('block aspect-square', className)} />

  const mono = icon.type === 'mono'
  return (
    <svg
      viewBox={logo.viewBox}
      aria-hidden="true"
      focusable="false"
      fill={mono ? 'currentColor' : undefined}
      style={mono ? { color: icon.color } : undefined}
      className={className}
      // Static markup produced from the pinned icon packages by scripts/generate-tech-logos.mjs.
      dangerouslySetInnerHTML={{ __html: logo.body.replaceAll('{uid}', uid) }}
    />
  )
}
