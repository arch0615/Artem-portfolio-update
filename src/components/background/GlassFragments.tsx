import { useEffect, useRef, useState } from 'react'
import { useIntroRevealed } from '@/components/intro/intro-context'
import { introTimeline, reducedIntroTimeline } from '@/components/intro/timeline'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { cn } from '@/lib/cn'
import { createGlassFragments, type GlassFragments as Field } from './glass-fragments'

/** Frames closer together than this are skipped, so 120 Hz screens draw at about 60 fps… */
const FRAME_MS = 15
/** …or about 30 fps on phones and devices that can't keep up (the drift is slow enough). */
const SLOW_FRAME_MS = 31
/** Scrolling moves the camera through the field by this fraction of the distance scrolled… */
const PARALLAX = 0.08
/** …at most this many world units per frame (keeps long smooth-scroll jumps gentle)… */
const MAX_CAMERA_STEP = 5
/** …and scroll jumps larger than this in one frame (route changes, back/forward) are ignored. */
const SCROLL_JUMP = 800

/**
 * The floating glass fragments of the global space background (drawing: `glass-fragments.ts`).
 * Mounted once for the whole app, so they never restart while navigating.
 *
 * They're set up once the intro's dissolve has finished (so the setup never competes with it), fade
 * in, then animate continuously (browsers pause animation frames in background tabs). Scrolling
 * slides them past at a depth-dependent rate, so moving through the page feels like moving through
 * the space. Visitors who prefer reduced motion see a still frame.
 */
export function GlassFragments() {
  const containerRef = useRef<HTMLDivElement>(null)
  const revealed = useIntroRevealed()
  const reduced = usePrefersReducedMotion()
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container || !revealed) return
    let fragments: Field | null = null
    let resizeObserver: ResizeObserver | null = null
    let frame = 0

    const start = () => {
      const field = createGlassFragments(container)
      fragments = field

      // Reduced motion: a still frame, redrawn only when the viewport changes size.
      if (reduced) {
        resizeObserver = new ResizeObserver(() => {
          field.resize()
          field.render(0)
        })
        resizeObserver.observe(container)
        setShown(true)
        return
      }

      let last = 0
      let interval = window.innerWidth < 1024 ? SLOW_FRAME_MS : FRAME_MS
      let late = 0
      let camera = 0
      let lastScroll = window.scrollY

      const tick = (now: number) => {
        frame = requestAnimationFrame(tick)
        const elapsed = last ? now - last : 0
        if (last && elapsed < interval) return
        // Frames keep arriving late: the device is struggling, so halve the work for good.
        if (interval === FRAME_MS && last) {
          late = elapsed > 24 ? late + 1 : Math.max(0, late - 1)
          if (late > 20) interval = SLOW_FRAME_MS
        }
        const scroll = window.scrollY
        const scrolled = scroll - lastScroll
        lastScroll = scroll
        if (Math.abs(scrolled) < SCROLL_JUMP) {
          camera += Math.max(-MAX_CAMERA_STEP, Math.min(MAX_CAMERA_STEP, scrolled * PARALLAX))
        }
        // Clamp long gaps (e.g. after a stutter) so fragments never jump.
        field.render(Math.min(elapsed / 1000, 0.05), camera)
        last = now
      }
      frame = requestAnimationFrame(tick)
      resizeObserver = new ResizeObserver(() => field.resize())
      resizeObserver.observe(container)
      setShown(true)
    }

    const dissolve = (reduced ? reducedIntroTimeline : introTimeline).exitDuration
    const timer = window.setTimeout(start, dissolve * 1000 + 100)

    return () => {
      window.clearTimeout(timer)
      cancelAnimationFrame(frame)
      resizeObserver?.disconnect()
      fragments?.destroy()
    }
  }, [revealed, reduced])

  return (
    <div
      ref={containerRef}
      className={cn(
        'absolute inset-0 overflow-hidden [contain:strict] transition-opacity duration-[2400ms] ease-out',
        shown ? 'opacity-100' : 'opacity-0',
      )}
    />
  )
}
