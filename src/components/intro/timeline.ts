/**
 * Intro timeline, in seconds from the moment the intro starts playing (7 s in total).
 *
 *   0.0 – 1.5  dark entry: ambient glow, faint grid and particle haze fade in slowly
 *   1.2 – 3.0  energy: blue/violet smoke starts drifting left to right, light ribbons flow
 *              across the screen and part around the name
 *   3.0 – 5.0  name: flare, centre-out mask reveal and a slow gloss sweep; light pulses and
 *              floating motes gather around the letters, the floor reflection starts to shimmer
 *   4.8 – 5.9  subtitle: the two role lines, one after the other
 *   5.9 – 6.3  hold: everything keeps moving gently (smoke, motes, pulses, glints)
 *   6.3 – 7.0  the overlay dissolves while the page plays its entrance animations
 *
 * The name itself never moves, scales or distorts: effects only pass behind, around or over it.
 * Movement is deliberately slow; particle timings live with the particles in `geometry.ts`.
 */
export const introTimeline = {
  // Phase 1: dark entry
  ambientDuration: 3.6,
  accents: 0.9,
  accentsDuration: 2.7,
  gridDuration: 1.8,
  /** One slow pass of the background drift; longer than the intro, so it never stops or reverses. */
  driftDuration: 9,

  // Phase 2: energy
  smoke: 1.2,
  smokeFadeIn: 2.4,
  energy: 1.5,
  energyDuration: 1.5,
  energyStagger: 0.1,
  energyFadeIn: 0.6,
  /** Glints travelling left to right along the lead strands, through the name reveal and the hold. */
  glints: 2.9,
  glintStagger: 0.45,
  glintDuration: 3.75,

  // Phase 3: name
  flare: 2.85,
  bloomDuration: 3.9,
  streakDuration: 2.85,
  name: 3.0,
  nameReveal: 2.0,
  sheen: 3.6,
  sheenDuration: 2.1,
  horizonDuration: 3.3,
  groundGlow: 3.6,
  groundGlowDuration: 2.7,
  /** Blue and violet light breathing behind the letters (half a period apart). */
  pulses: 3.2,
  pulsesFadeIn: 1.6,
  pulsePeriod: 3.2,
  /** Glowing motes floating around the name. */
  motes: 3.4,
  motesFadeIn: 1.6,
  /** Light gliding across the floor reflection, and the reflection's gentle breathing. */
  shimmer: 4.2,
  shimmerPeriod: 3,

  // Phase 4: subtitle
  subtitle: 4.8,
  subtitleStagger: 0.24,
  subtitleDuration: 0.9,

  // Phase 5: hold, then dissolve
  exit: 6.3,
  exitDuration: 0.7,
} as const

/**
 * Reduced-motion version: a plain fade in, a short hold, a fade out (2 s in total). Kept short on
 * purpose: these visitors asked for less animation, so they shouldn't wait longer for the page.
 */
export const reducedIntroTimeline = {
  fadeIn: 0.4,
  exit: 1.6,
  exitDuration: 0.4,
} as const

/** Smooth "scan" curve shared by the reveal mask and the light beams so they stay in sync. */
export const sweepEase = [0.65, 0, 0.25, 1] as const
