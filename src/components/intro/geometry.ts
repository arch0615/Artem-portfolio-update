/**
 * Static geometry for the intro: energy ribbon paths and particle positions.
 * Computed once at module load with a deterministic hash, so every render (and every
 * visit) produces the same layout and nothing random runs during render.
 */

const WIDTH = 1440
const HEIGHT = 400
const MID = HEIGHT / 2

export const ribbonViewBox = `0 0 ${WIDTH} ${HEIGHT}`
export const ribbonWidth = WIDTH

const fract = (n: number) => n - Math.floor(n)
const hash = (index: number, salt: number) => fract(Math.sin(index * 127.1 + salt * 311.7) * 43758.5453)

type Point = readonly [number, number]

/** Smooth path through the points (Catmull-Rom converted to cubic Béziers). */
function smoothPath(points: Point[]): string {
  const f = (n: number) => Math.round(n * 10) / 10
  let d = `M${f(points[0][0])} ${f(points[0][1])}`
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[i + 2] ?? p2
    d += ` C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)}`
    d += ` ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])} ${f(p2[1])}`
  }
  return d
}

interface StrandSpec {
  /** -1 arcs above the name, 1 arcs below it. */
  side: -1 | 1
  /** How far the strand bows away from the centre line at mid-screen. */
  bow: number
  /** Amplitude and phase of the ripple layered on top, so strands weave around each other. */
  ripple: number
  phase: number
  /** Relative stroke width and brightness. */
  weight: number
  intensity: number
}

const strandSpecs: StrandSpec[] = [
  { side: -1, bow: 112, ripple: 16, phase: 0.2, weight: 1.25, intensity: 1 },
  { side: -1, bow: 92, ripple: 20, phase: 2.3, weight: 0.85, intensity: 0.7 },
  { side: -1, bow: 128, ripple: 10, phase: 4.1, weight: 0.6, intensity: 0.45 },
  { side: 1, bow: 100, ripple: 16, phase: 1.1, weight: 1.25, intensity: 1 },
  { side: 1, bow: 82, ripple: 18, phase: 3.3, weight: 0.85, intensity: 0.7 },
  { side: 1, bow: 116, ripple: 10, phase: 5.2, weight: 0.6, intensity: 0.45 },
]

/**
 * Strands enter as a single line at the left edge, part around the name in an eye-shaped
 * frame, and rejoin at the right edge.
 */
function strandPoints({ side, bow, ripple, phase }: StrandSpec): Point[] {
  const points: Point[] = []
  for (let x = -60; x <= WIDTH + 60; x += 30) {
    const t = Math.min(Math.max(x / WIDTH, 0), 1)
    const envelope = Math.sin(Math.PI * t) ** 1.4
    const y = MID + envelope * (side * bow + ripple * Math.sin((2 * Math.PI * x) / 560 + phase))
    points.push([x, y])
  }
  return points
}

export const ribbonStrands = strandSpecs.map((spec, index) => ({
  id: `strand-${index}`,
  side: spec.side,
  d: smoothPath(strandPoints(spec)),
  weight: spec.weight,
  intensity: spec.intensity,
  /** The brightest strand on each side gets a soft halo and a travelling glint. */
  halo: spec.intensity === 1,
}))

/**
 * Particle haze: small motes drifting upward around the centre band. They appear gradually over
 * the first ~2.5 s and most are still drifting during the final hold (each fades in, then out).
 */
export const particles = Array.from({ length: 26 }, (_, index) => ({
  id: index,
  x: 4 + hash(index, 1) * 92, // % of viewport width
  y: 18 + hash(index, 2) * 64, // % of viewport height
  size: 2 + hash(index, 3) * 3, // px
  opacity: 0.3 + hash(index, 4) * 0.55,
  delay: hash(index, 5) * 2.4, // s
  duration: 5.4 + hash(index, 6) * 4.2, // s
  dx: (hash(index, 7) - 0.5) * 48, // px
  dy: -(14 + hash(index, 8) * 46), // px
}))

/**
 * Glowing motes floating around the name: scattered on a loose ellipse around the letters
 * (positions in % of the name's box), each bobbing on its own slow, endless cycle.
 */
export const motes = Array.from({ length: 16 }, (_, index) => {
  const angle = ((index + hash(index, 11) * 0.6) / 16) * Math.PI * 2
  const radiusX = 46 + hash(index, 12) * 14 // % of the name's width, from its centre
  const radiusY = 95 + hash(index, 13) * 65 // % of the name's height, from its centre
  const duration = 3.2 + hash(index, 16) * 2.2 // s
  return {
    id: index,
    x: 50 + Math.cos(angle) * radiusX,
    y: 50 + Math.sin(angle) * radiusY,
    size: 2 + hash(index, 14) * 2.5, // px
    opacity: 0.45 + hash(index, 15) * 0.45,
    duration,
    delay: -hash(index, 17) * duration, // s; negative = already mid-cycle, so they never move in step
    dx: (hash(index, 18) - 0.5) * 18, // px
    dy: -(6 + hash(index, 19) * 14), // px
  }
})

/**
 * Soft blue/violet "energy smoke" drifting left to right behind the ribbons (positions and sizes
 * in % of the smoke band). Several overlapping wisps at different speeds keep its shape evolving.
 */
export const smokeWisps = [
  { id: 0, tone: 'blue', left: -12, top: 8, width: 62, height: 46, rotate: -4, duration: 13, delay: -2 },
  { id: 1, tone: 'violet', left: 28, top: 46, width: 66, height: 40, rotate: 3, duration: 11, delay: -5 },
  { id: 2, tone: 'indigo', left: 46, top: 4, width: 52, height: 36, rotate: 5, duration: 14, delay: -8 },
  { id: 3, tone: 'violet', left: -6, top: 54, width: 56, height: 38, rotate: -3, duration: 12, delay: -3 },
] as const
