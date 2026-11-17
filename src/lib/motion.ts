import type { Transition, Variants } from 'framer-motion'

export const easeOutExpo = [0.16, 1, 0.3, 1] as const

export const revealTransition: Transition = { duration: 0.7, ease: easeOutExpo }

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: revealTransition },
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8, ease: easeOutExpo } },
}

export const staggerContainer = (stagger = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: stagger, delayChildren } },
})

/** Shared viewport settings: animate once, slightly before the element is fully visible. */
export const viewportOnce = { once: true, margin: '0px 0px -8% 0px' } as const
