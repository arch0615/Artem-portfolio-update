import type { brandIcons as BrandIconData } from './brand-icons'

/**
 * Lazily loads the brand glyph data (~22 KB gzip) in its own chunk so it stays
 * off the critical rendering path. Components subscribe via useSyncExternalStore.
 */
type Icons = typeof BrandIconData

let icons: Icons | null = null
let loading: Promise<void> | null = null
const listeners = new Set<() => void>()

function load() {
  loading ??= import('./brand-icons').then((mod) => {
    icons = mod.brandIcons
    listeners.forEach((notify) => notify())
  })
  return loading
}

export function subscribeBrandIcons(onChange: () => void) {
  listeners.add(onChange)
  void load()
  return () => {
    listeners.delete(onChange)
  }
}

export const getBrandIcons = () => icons
export const getServerBrandIcons = () => null
