import { useSyncExternalStore } from 'react'
import type { BrandIconKey } from '@/lib/brand-icons'
import { getBrandIcons, getServerBrandIcons, subscribeBrandIcons } from '@/lib/brand-icon-store'

interface BrandIconProps {
  name: BrandIconKey
  className?: string
}

/**
 * Monochrome brand glyph (inherits `currentColor`). Decorative — pair with a visible label.
 * Renders an empty box of the same size until the icon data chunk has loaded.
 */
export function BrandIcon({ name, className }: BrandIconProps) {
  const icons = useSyncExternalStore(subscribeBrandIcons, getBrandIcons, getServerBrandIcons)
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false" className={className}>
      {icons && <path d={icons[name].path} />}
    </svg>
  )
}

/** LinkedIn isn't available in Simple Icons; a neutral "in" glyph is used instead. */
export function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false" className={className}>
      <path
        fillRule="evenodd"
        d="M4.5 3A1.5 1.5 0 0 0 3 4.5v15A1.5 1.5 0 0 0 4.5 21h15a1.5 1.5 0 0 0 1.5-1.5v-15A1.5 1.5 0 0 0 19.5 3h-15Zm2.25 6.75h2.5V18h-2.5V9.75ZM8 5.6a1.45 1.45 0 1 1 0 2.9 1.45 1.45 0 0 1 0-2.9Zm3.25 4.15h2.4v1.13h.04c.33-.63 1.15-1.3 2.37-1.3 2.53 0 3 1.67 3 3.83V18h-2.5v-4.03c0-.96-.02-2.2-1.34-2.2-1.34 0-1.55 1.05-1.55 2.13V18h-2.42V9.75Z"
      />
    </svg>
  )
}
