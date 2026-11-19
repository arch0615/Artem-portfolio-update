import { useEffect, useRef } from 'react'
import { useIntroRevealed } from '@/components/intro/intro-context'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { GlassFragments } from './GlassFragments'
import { renderStarfield, twinkles } from './starfield'
import './space.css'

/**
 * The site-wide background: one fixed, full-viewport layer behind every page. It's mounted once in
 * `App.tsx`, outside the routes, so it never restarts while navigating. Back to front:
 *
 * 1. Deep space: near-black with dark navy and violet nebulae and distant stars (one static
 *    background), two slowly drifting clouds and faint flowing "space-time" light waves.
 * 2. A few twinkling stars.
 * 3. Glass fragments: transparent cubes floating freely in 3D (`GlassFragments`).
 *
 * The page content sits above it, and it never takes pointer events. It's sized to the largest
 * viewport height, so it doesn't resize when a phone's address bar shows or hides. Animations start
 * as the intro dissolves; visitors who prefer reduced motion get a still version. Styles: `space.css`.
 */
export function GlobalSpaceBackground() {
  const rootRef = useRef<HTMLDivElement>(null)
  const revealed = useIntroRevealed()
  const reduced = usePrefersReducedMotion()

  // The star field is drawn into an image once, and again only when the viewport changes size.
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    let current: string | null = null
    let size = ''
    let timer = 0
    let disposed = false

    const update = async () => {
      const width = root.clientWidth
      const height = root.clientHeight
      if (`${width}x${height}` === size) return
      size = `${width}x${height}`
      const url = await renderStarfield(width, height)
      if (!url) return
      // Swap only once the new image is decoded, so the stars never blink out.
      const image = new Image()
      image.src = url
      await image.decode().catch(() => {})
      if (disposed) return URL.revokeObjectURL(url)
      root.style.setProperty('--space-stars', `url(${url})`)
      if (current) URL.revokeObjectURL(current)
      current = url
    }
    const observer = new ResizeObserver(() => {
      window.clearTimeout(timer)
      timer = window.setTimeout(update, current ? 200 : 0)
    })
    observer.observe(root)

    return () => {
      disposed = true
      observer.disconnect()
      window.clearTimeout(timer)
      if (current) URL.revokeObjectURL(current)
    }
  }, [])

  return (
    <div
      ref={rootRef}
      aria-hidden
      data-live={revealed && !reduced ? '' : undefined}
      className="space-bg pointer-events-none fixed inset-x-0 top-0 -z-10 h-lvh overflow-hidden select-none"
    >
      <div className="space-cloud space-cloud-blue space-anim" />
      <div className="space-cloud space-cloud-violet space-anim" />
      <SpaceTimeWaves />
      {twinkles.map((star, index) => (
        <span
          key={index}
          className="space-twinkle space-anim"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: star.size * 3,
            height: star.size * 3,
            animationDuration: `${star.duration}s`,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}
      <GlassFragments />
    </div>
  )
}

/**
 * Faint light waves. Their shapes repeat every 1200 (or 600) of the 2400 units, so sliding the SVG
 * by half its width loops seamlessly.
 */
function SpaceTimeWaves() {
  return (
    <svg className="space-waves space-anim" viewBox="0 0 2400 400" preserveAspectRatio="none" fill="none">
      <path
        d="M0 200C400 130 800 270 1200 200C1600 130 2000 270 2400 200"
        stroke="#6366f1"
        strokeOpacity="0.022"
        strokeWidth="7"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M0 200C400 130 800 270 1200 200C1600 130 2000 270 2400 200"
        stroke="#818cf8"
        strokeOpacity="0.09"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M0 240C200 195 400 285 600 240C800 195 1000 285 1200 240C1400 195 1600 285 1800 240C2000 195 2200 285 2400 240"
        stroke="#8b5cf6"
        strokeOpacity="0.06"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M0 150C400 235 800 65 1200 150C1600 235 2000 65 2400 150"
        stroke="#6366f1"
        strokeOpacity="0.05"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M0 290C400 340 800 230 1200 290C1600 340 2000 230 2400 290"
        stroke="#a78bfa"
        strokeOpacity="0.045"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}
