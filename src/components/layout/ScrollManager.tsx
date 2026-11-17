import { useEffect, useRef } from 'react'
import { useLocation, useNavigationType } from 'react-router'

/** Last known scroll position per history entry (keyed by location.key). */
const positions = new Map<string, number>()
const MAX_FRAMES = 90

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Scroll behaviour for client-side navigation:
 * - back/forward restores the previous position for that history entry
 * - `/#section` scrolls to the section (smoothly when staying on the same page)
 * - a new page without a hash starts at the top
 * Retries for a few frames so lazily rendered routes can mount first.
 */
export function ScrollManager() {
  const location = useLocation()
  const navigationType = useNavigationType()
  const previousPath = useRef<string | null>(null)

  // Record the scroll position for the current history entry.
  useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual'
    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => positions.set(location.key, window.scrollY))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [location.key])

  // Apply the right scroll position after navigation.
  useEffect(() => {
    const pathChanged = previousPath.current !== null && previousPath.current !== location.pathname
    const isInitial = previousPath.current === null
    previousPath.current = location.pathname

    let frame = 0
    let attempts = 0
    const repeat = (fn: () => void) => {
      if (attempts++ < MAX_FRAMES) frame = requestAnimationFrame(fn)
    }

    const saved = navigationType === 'POP' ? positions.get(location.key) : undefined
    if (saved !== undefined) {
      const restore = () => {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight
        if (maxScroll >= saved - 1 || attempts >= MAX_FRAMES) {
          window.scrollTo({ top: saved, behavior: 'instant' })
        } else {
          repeat(restore)
        }
      }
      restore()
      return () => cancelAnimationFrame(frame)
    }

    if (!location.hash) {
      if (!isInitial) window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      return
    }

    const id = decodeURIComponent(location.hash.slice(1))
    const smooth = !pathChanged && !isInitial && !prefersReducedMotion()
    const scrollToTarget = () => {
      const target = document.getElementById(id)
      if (target) target.scrollIntoView({ behavior: smooth ? 'smooth' : 'instant', block: 'start' })
      else repeat(scrollToTarget)
    }
    frame = requestAnimationFrame(scrollToTarget)
    return () => cancelAnimationFrame(frame)
  }, [location.key, location.pathname, location.hash, navigationType])

  return null
}
