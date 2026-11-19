import { useEffect, useRef } from 'react'
import { useIntroRevealed } from '@/components/intro/intro-context'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { cn } from '@/lib/cn'
import { createGlassFragments } from './glass-fragments'

/** Frames closer together than this are skipped, so 120 Hz screens draw at about 60 fps… */
const FRAME_MS = 15
/** …or about 30 fps on devices that can't keep up (the drift is slow enough to look the same). */
const SLOW_FRAME_MS = 31

/**
 * Decorative glass fragments floating behind the hero (drawing: `glass-fragments.ts`). Placed in
 * the hero background, so they sit behind all hero content and never take pointer events.
 *
 * They fade in as the intro dissolves and only animate while the hero is on screen (browsers also
 * pause animation frames in background tabs). Visitors who prefer reduced motion see a still frame.
 */
export function HeroFragments() {
  const containerRef = useRef<HTMLDivElement>(null)
  const revealed = useIntroRevealed()
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const container = containerRef.current
    if (!container || !revealed) return
    const fragments = createGlassFragments(container)

    let frame = 0
    let last = 0
    let running = false
    let interval = FRAME_MS
    let late = 0

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick)
      const elapsed = last ? now - last : 0
      if (last && elapsed < interval) return
      // Frames keep arriving late: the device is struggling, so halve the work for good.
      if (interval === FRAME_MS && last) {
        late = elapsed > 24 ? late + 1 : Math.max(0, late - 1)
        if (late > 20) interval = SLOW_FRAME_MS
      }
      // Clamp long gaps (e.g. after a stutter) so fragments never jump.
      fragments.render(Math.min(elapsed / 1000, 0.05))
      last = now
    }
    const start = () => {
      if (running) return
      running = true
      last = 0
      frame = requestAnimationFrame(tick)
    }
    const stop = () => {
      running = false
      cancelAnimationFrame(frame)
    }

    // Re-lay out on resize, and redraw at once unless the animation is about to.
    const resizeObserver = new ResizeObserver(() => {
      fragments.resize()
      if (!running) fragments.render(0)
    })
    resizeObserver.observe(container)

    const visibility = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !reduced) start()
      else stop()
    })
    visibility.observe(container)

    return () => {
      stop()
      resizeObserver.disconnect()
      visibility.disconnect()
      fragments.destroy()
    }
  }, [revealed, reduced])

  return (
    <div
      ref={containerRef}
      className={cn(
        'absolute inset-0 overflow-hidden [contain:strict] transition-opacity duration-[2400ms] ease-out',
        revealed ? 'opacity-100' : 'opacity-0',
      )}
    />
  )
}
