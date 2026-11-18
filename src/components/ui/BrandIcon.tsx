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
