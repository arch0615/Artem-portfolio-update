import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence } from 'framer-motion'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { IntroAnimation } from './IntroAnimation'
import { IntroRevealContext } from './intro-context'
import { introTimeline, reducedIntroTimeline } from './timeline'

/** Keys that never end the intro on their own (e.g. the start of a screenshot shortcut). */
const MODIFIER_KEYS = new Set(['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Fn'])

/**
 * Plays the intro once per page load — every fresh visit or refresh, never on in-app navigation
 * (the provider lives above the router and is never remounted). No storage is involved.
 *
 * The page renders underneath from the start, so content, fonts and lazy chunks load in parallel;
 * `useIntroRevealed()` lets entrance animations wait until the overlay starts to dissolve. The page
 * stays at the top while it is covered, so the visitor always lands on Home.
 */
export function IntroProvider({ children }: { children: ReactNode }) {
  const reduced = usePrefersReducedMotion()
  const [playing, setPlaying] = useState(true)
  const [started, setStarted] = useState(false)
  const [covering, setCovering] = useState(true)
  const lastWheel = useRef(0)
  const finish = useCallback(() => setPlaying(false), [])

  // Lock page scrolling while the overlay covers the page (until its dissolve has finished), so
  // the wheel turn, swipe or key press (Space, Page Down, End…) that skips the intro can't also
  // scroll the page out from under it. Styles: `html[data-intro]` in `src/styles/index.css`.
  // Touch moves are cancelled too, so a swipe can't start a fling that outlasts the overlay.
  useLayoutEffect(() => {
    if (!covering) return
    const root = document.documentElement
    root.dataset.intro = ''
    const onWheel = () => {
      lastWheel.current = performance.now()
    }
    const onTouchMove = (event: TouchEvent) => {
      if (event.cancelable) event.preventDefault()
    }
    window.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    return () => {
      delete root.dataset.intro
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchmove', onTouchMove)
    }
  }, [covering])

  // Once the dissolve has finished, unlock as soon as the wheel is quiet: a trackpad swipe that
  // skipped the intro keeps sending momentum events for a moment (waits at most 1 s).
  const uncover = useCallback(() => {
    const since = performance.now()
    const settle = () => {
      const now = performance.now()
      const quiet = now - lastWheel.current
      if (quiet >= 200 || now - since >= 1000) setCovering(false)
      else window.setTimeout(settle, 200 - quiet)
    }
    settle()
  }, [])

  // Start the timeline once the first frame (dark overlay + page underneath) has been produced,
  // so a slow first paint can't eat into the animation. Browsers don't run animation frames in
  // background tabs, so a page opened in the background also waits until it's actually seen.
  useEffect(() => {
    let inner = 0
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setStarted(true))
    })
    return () => {
      cancelAnimationFrame(outer)
      cancelAnimationFrame(inner)
    }
  }, [])

  // Timeline: dissolve at 6.3 s (1.6 s with reduced motion).
  useEffect(() => {
    if (!started || !playing) return
    const exitAt = (reduced ? reducedIntroTimeline.exit : introTimeline.exit) * 1000
    const timer = window.setTimeout(finish, exitAt)
    return () => window.clearTimeout(timer)
  }, [started, playing, reduced, finish])

  // Never trap the visitor: any key press, scroll or swipe ends the intro early.
  useEffect(() => {
    if (!playing) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (!MODIFIER_KEYS.has(event.key)) finish()
    }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('wheel', finish, { passive: true })
    window.addEventListener('touchmove', finish, { passive: true })
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('wheel', finish)
      window.removeEventListener('touchmove', finish)
    }
  }, [playing, finish])

  return (
    <IntroRevealContext value={!playing}>
      {children}
      <AnimatePresence onExitComplete={uncover}>
        {playing && <IntroAnimation key="intro" started={started} reduced={reduced} onSkip={finish} />}
      </AnimatePresence>
    </IntroRevealContext>
  )
}
