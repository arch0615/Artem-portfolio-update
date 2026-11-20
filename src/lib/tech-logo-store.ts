import { useSyncExternalStore } from 'react'
import type { monoLogos, multicolorLogos } from './tech-logos'

/**
 * Loads the Skills section's technology logos in their own chunk, off the critical rendering path.
 * Components read them with `useTechLogos()`, which re-renders once they arrive.
 */
interface TechLogoState {
  logos: { mono: typeof monoLogos; multicolor: typeof multicolorLogos } | null
  /** The chunk could not be loaded (e.g. offline after a new deploy): show the names without logos. */
  failed: boolean
}

let state: TechLogoState = { logos: null, failed: false }
let loading: Promise<void> | null = null
const listeners = new Set<() => void>()

function update(next: TechLogoState) {
  state = next
  listeners.forEach((notify) => notify())
}

function load() {
  loading ??= import('./tech-logos').then(
    (mod) => update({ logos: { mono: mod.monoLogos, multicolor: mod.multicolorLogos }, failed: false }),
    () => {
      loading = null
      update({ logos: null, failed: true })
    },
  )
  return loading
}

function subscribe(onChange: () => void) {
  listeners.add(onChange)
  void load()
  return () => {
    listeners.delete(onChange)
  }
}

const getState = () => state

export function useTechLogos(): TechLogoState {
  return useSyncExternalStore(subscribe, getState, getState)
}
