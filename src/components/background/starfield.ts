import { seededRandom } from './random'

type Rgb = [number, number, number]

/** Mostly cool white, some blue and violet. */
const TINTS: Rgb[] = [
  [232, 236, 255],
  [232, 236, 255],
  [190, 205, 255],
  [205, 192, 255],
]

/** Twinkling stars (CSS-animated elements on top of the static field), in viewport percentages. */
export interface Twinkle {
  left: number
  top: number
  size: number
  duration: number
  delay: number
}

/**
 * Distant stars for a `width` × `height` CSS-px area, drawn once into an off-screen canvas and
 * returned as an image URL (used as a background image, so the stars cost nothing per frame and
 * need no layer of their own). Sizes and brightness vary with an imagined distance: most are tiny
 * and faint, a few closer ones are brighter with a soft halo. Phones get a sparser field.
 */
export async function renderStarfield(width: number, height: number): Promise<string | null> {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx || !width || !height) return null
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  canvas.width = Math.round(width * dpr)
  canvas.height = Math.round(height * dpr)
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

  const random = seededRandom(5_050_509)
  const count = Math.min(320, Math.round((width * height) / (width < 640 ? 8500 : 6500)))
  for (let i = 0; i < count; i++) {
    const x = random() * width
    const y = random() * height
    const nearness = random()
    const radius = 0.35 + nearness ** 3 * 1.05
    const alpha = 0.1 + nearness ** 2 * 0.55 + random() * 0.08
    const [r, g, b] = TINTS[Math.floor(random() * TINTS.length)]
    if (nearness > 0.9) {
      const halo = ctx.createRadialGradient(x, y, 0, x, y, radius * 5)
      halo.addColorStop(0, `rgba(${r},${g},${b},${(alpha * 0.25).toFixed(3)})`)
      halo.addColorStop(1, `rgba(${r},${g},${b},0)`)
      ctx.fillStyle = halo
      ctx.fillRect(x - radius * 5, y - radius * 5, radius * 10, radius * 10)
    }
    ctx.fillStyle = `rgba(${r},${g},${b},${alpha.toFixed(3)})`
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.fill()
  }

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'))
  return blob ? URL.createObjectURL(blob) : null
}

/** Positions and timings for the twinkling stars (phones show only the first 10, see CSS). */
export const twinkles: Twinkle[] = (() => {
  const random = seededRandom(7_007)
  return Array.from({ length: 24 }, () => ({
    left: 2 + random() * 96,
    top: 2 + random() * 96,
    size: 2 + random() * 1.6,
    duration: 3.5 + random() * 5,
    delay: -random() * 8,
  }))
})()
