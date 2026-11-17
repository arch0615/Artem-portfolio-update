import { useReducedMotion } from 'framer-motion'

/** Boolean wrapper around Framer Motion's reduced-motion detection. */
export function usePrefersReducedMotion(): boolean {
  return useReducedMotion() ?? false
}
