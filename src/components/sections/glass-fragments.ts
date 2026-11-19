/**
 * Glass fragments behind the hero: a few nearly transparent cubes floating freely in 3D space.
 *
 * Motion: a small perspective projection (no 3D library). Every fragment has its own size, depth,
 * drift speed and slowly turning heading, wandering path, tumble axis and spin speed. All of these
 * keep changing slowly, so no two fragments move alike and nothing repeats in step. Some drift across
 * the screen, some diagonally, some mostly toward and away from the camera; nearer ones are larger
 * and move faster on screen (parallax).
 *
 * Look: faces are 3–8 % opaque glass, shaded by angle (faces seen edge-on and faces catching the
 * light from the upper left are a little brighter). Edges are hair-thin lines that brighten when they
 * face the light, and a very faint glow sits behind each fragment. No blur filters or shadows.
 *
 * Rendering: each fragment draws into its own small canvas, just big enough for the cube, which is
 * moved with a CSS transform; its glow is a CSS gradient that the compositor moves and scales. Only
 * the cubes' own pixels are redrawn each frame, never the whole hero, so it stays cheap even where
 * the browser draws canvases without the GPU.
 */

type Vec3 = [number, number, number]

interface Motion {
  /** Edge length in world units (1 unit = 1 px at the focal plane). */
  size: number
  /** Drifting base position in world units; wraps around once fully off screen. */
  x: number
  y: number
  /** Drift speed (world units per second) and heading, which turns slowly (amplitude, frequency, phase). */
  speed: number
  heading: number
  turn: [number, number, number]
  /** Wandering offset per axis: amplitude plus two slow sines (angular frequency, phase). */
  wanderX: [number, number, number, number, number]
  wanderY: [number, number, number, number, number]
  /** Depth: centre, amplitude plus two slow sines, so it drifts toward and away from the camera. */
  depth: [number, number, number, number, number, number]
  /** Orientation quaternion [w, x, y, z]. */
  q: [number, number, number, number]
  /** Tumble axis, which wanders around this direction (three slow sines: frequency, phase). */
  axis: Vec3
  axisWobble: [number, number, number, number, number, number]
  /** Spin speed in rad/s, varying slowly (frequency, phase). */
  spin: number
  spinWobble: [number, number]
  /** 0 = electric blue … 1 = violet. */
  hue: number
}

interface Fragment extends Motion {
  /** Moves with the fragment (one transform per frame); holds its glow and canvas, centred on it. */
  node: HTMLDivElement
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  glow: HTMLDivElement
  /** Half the canvas size in CSS px; follows the projected size with some slack. */
  radius: number
  layer: number
  /** Last values written to the DOM, so unchanged ones aren't written again. */
  position: string
  glowScale: number
  glowOpacity: number
  /** Orientation, depth and position the canvas was last drawn at (`drawnZ` 0 = never drawn). */
  drawnQ: Motion['q']
  drawnZ: number
  drawnX: number
  drawnY: number
  /** Per-frame state: depth and projected centre. */
  z: number
  sx: number
  sy: number
}

export interface GlassFragments {
  /** Matches the layout to the container's size (call when it changes). */
  resize(): void
  /** Advances the simulation by `dt` seconds (0 = still frame) and draws it. */
  render(dt: number): void
  /** Removes the fragments' elements. */
  destroy(): void
}

const TAU = Math.PI * 2
/** Focal length in world units: depth `F` is drawn at 1:1. Depths stay within 0.6F–2.75F. */
const F = 1000
const BLUE: Vec3 = [72, 142, 255]
const VIOLET: Vec3 = [150, 104, 255]
const WHITE: Vec3 = [235, 240, 255]
/** Direction towards the light: upper left, slightly in front. */
const LIGHT = normalize([-0.4, -0.75, -0.5])

/** Fewer fragments on smaller screens. */
const fragmentCount = (width: number) => (width < 640 ? 5 : width < 1024 ? 8 : 12)

// Cube corners: bit 0 = +x, bit 1 = +y, bit 2 = +z. Faces as corner loops around their axis.
const FACES: { axis: 0 | 1 | 2; sign: 1 | -1; corners: [number, number, number, number] }[] = [
  { axis: 0, sign: 1, corners: [1, 3, 7, 5] },
  { axis: 0, sign: -1, corners: [0, 4, 6, 2] },
  { axis: 1, sign: 1, corners: [2, 6, 7, 3] },
  { axis: 1, sign: -1, corners: [0, 1, 5, 4] },
  { axis: 2, sign: 1, corners: [4, 5, 7, 6] },
  { axis: 2, sign: -1, corners: [0, 2, 3, 1] },
]
/** Edges as [corner, corner, face, face]. */
const EDGES: [number, number, number, number][] = []
for (let i = 0; i < 8; i++) {
  for (const bit of [1, 2, 4]) {
    if (i & bit) continue
    const j = i | bit
    const faces = FACES.flatMap((face, k) => (face.corners.includes(i) && face.corners.includes(j) ? [k] : []))
    EDGES.push([i, j, faces[0], faces[1]])
  }
}

function normalize(v: Vec3): Vec3 {
  const length = Math.hypot(v[0], v[1], v[2]) || 1
  return [v[0] / length, v[1] / length, v[2] / length]
}

const mix = (a: Vec3, b: Vec3, t: number): Vec3 => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]
const rgba = (c: Vec3, alpha: number) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${alpha.toFixed(3)})`
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

/** Deterministic random numbers (mulberry32), so the composition is the same on every visit. */
function seededRandom(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function zAt(d: Motion['depth'], t: number) {
  return d[0] + d[1] * (0.65 * Math.sin(d[2] * t + d[3]) + 0.35 * Math.sin(d[4] * t + d[5]))
}

function wander(w: Motion['wanderX'], t: number) {
  return w[0] * (0.6 * Math.sin(w[1] * t + w[2]) + 0.4 * Math.sin(w[3] * t + w[4]))
}

function createMotions(count: number, width: number, height: number): Motion[] {
  const random = seededRandom(20_26)
  const between = (min: number, max: number) => min + random() * (max - min)
  const period = (min: number, max: number) => TAU / between(min, max)
  const scale = clamp(width / 1440, 0.55, 1)

  // Start spread out: one fragment per cell of a jittered grid, cells in random order.
  const cols = Math.max(2, Math.round(Math.sqrt((count * width) / height)))
  const rows = Math.ceil(count / cols) + 1
  const cells = Array.from({ length: cols * rows }, (_, i) => i)
  for (let i = cells.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[cells[i], cells[j]] = [cells[j], cells[i]]
  }

  return Array.from({ length: count }, (_, i): Motion => {
    // Three kinds, interleaved: drifts across the screen, drifts diagonally, moves mostly in depth.
    const kind = i % 3
    const speed = (kind === 0 ? between(7, 20) : kind === 1 ? between(5, 13) : between(0.5, 3)) * scale
    // Fragments crossing the screen alternate left and right, so they never travel as a group.
    const angle =
      kind === 0
        ? (i % 2 ? Math.PI : 0) + between(-0.35, 0.35)
        : kind === 1
          ? (Math.floor(random() * 4) * Math.PI) / 2 + between(0.5, 1.07)
          : random() * TAU
    const zCentre = between(0.85, 2.2) * F
    // Never closer than 0.6F, so no fragment ever looms large in front of the content.
    const zAmplitude = Math.min((kind === 2 ? between(0.3, 0.55) : between(0.06, 0.16)) * F, zCentre - 0.6 * F)
    const depth: Motion['depth'] = [zCentre, zAmplitude, period(30, 80), random() * TAU, period(45, 110), random() * TAU]
    const z = zAt(depth, 0)

    const cell = cells[i]
    const screenX = ((cell % cols) + between(0.15, 0.85)) / cols
    const screenY = (Math.floor(cell / cols) + between(0.15, 0.85)) / rows

    // Uniformly random starting orientation (Shoemake).
    const [u1, u2, u3] = [random(), random(), random()]
    const q: Motion['q'] = [
      Math.sqrt(u1) * Math.cos(TAU * u3),
      Math.sqrt(1 - u1) * Math.sin(TAU * u2),
      Math.sqrt(1 - u1) * Math.cos(TAU * u2),
      Math.sqrt(u1) * Math.sin(TAU * u3),
    ]
    const slow = random() < 0.3
    const amplitude = () => between(20, 70) * scale

    return {
      size: (16 + 88 * random() ** 1.5) * scale,
      x: ((screenX - 0.5) * width * z) / F,
      y: ((screenY - 0.5) * height * z) / F,
      speed,
      heading: angle,
      turn: [between(0.25, 0.6), period(40, 110), random() * TAU],
      wanderX: [amplitude(), period(26, 70), random() * TAU, period(17, 43), random() * TAU],
      wanderY: [amplitude(), period(29, 75), random() * TAU, period(19, 47), random() * TAU],
      depth,
      q,
      axis: normalize([between(-1, 1), between(-1, 1), between(-1, 1)]),
      axisWobble: [period(20, 60), random() * TAU, period(20, 60), random() * TAU, period(20, 60), random() * TAU],
      spin: (((slow ? between(2, 4) : between(4, 12)) * Math.PI) / 180) * (random() < 0.5 ? -1 : 1),
      spinWobble: [period(15, 40), random() * TAU],
      hue: random(),
    }
  })
}

export function createGlassFragments(container: HTMLElement): GlassFragments {
  let fragments: Fragment[] = []
  let width = 0
  let height = 0
  let dpr = 1
  let time = 0

  // Scratch buffers for one cube: projected corners and per-face view/lighting terms.
  const screen = new Float64Array(16)
  const faceFront = new Array<boolean>(6)
  const faceFacing = new Float64Array(6)
  const faceLight = new Float64Array(6)
  const faceSpec = new Float64Array(6)
  const order = FACES.map((_, k) => k)

  function mount(motion: Motion): Fragment | null {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return null
    const node = document.createElement('div')
    node.style.cssText = 'position:absolute;left:0;top:0;will-change:transform'
    canvas.style.cssText = 'position:absolute;left:0;top:0;width:0;height:0'
    const glow = document.createElement('div')
    const color = mix(BLUE, VIOLET, motion.hue)
    glow.style.cssText = `position:absolute;left:-50px;top:-50px;width:100px;height:100px;border-radius:50%;opacity:0;background:radial-gradient(closest-side,${rgba(color, 1)},${rgba(color, 0.4)} 35%,${rgba(color, 0)})`
    node.append(glow, canvas)
    container.append(node)
    return {
      ...motion,
      node,
      canvas,
      ctx,
      glow,
      radius: 0,
      layer: -1,
      position: '',
      glowScale: 0,
      glowOpacity: 0,
      drawnQ: motion.q,
      drawnZ: 0,
      drawnX: 0,
      drawnY: 0,
      z: zAt(motion.depth, time),
      sx: 0,
      sy: 0,
    }
  }

  function unmount() {
    for (const fragment of fragments) fragment.node.remove()
    fragments = []
  }

  function sizeCanvas(fragment: Fragment, radius: number) {
    fragment.radius = radius
    fragment.drawnZ = 0
    fragment.canvas.width = fragment.canvas.height = Math.ceil(2 * radius * dpr)
    fragment.canvas.style.width = fragment.canvas.style.height = `${2 * radius}px`
    fragment.canvas.style.left = fragment.canvas.style.top = `${-radius}px`
  }

  function resize() {
    const rect = container.getBoundingClientRect()
    const nextWidth = Math.round(rect.width)
    const nextHeight = Math.round(rect.height)
    if (!nextWidth || !nextHeight) return
    const count = fragmentCount(nextWidth)
    if (fragments.length !== count) {
      unmount()
      fragments = createMotions(count, nextWidth, nextHeight).flatMap((motion) => mount(motion) ?? [])
    } else {
      for (const fragment of fragments) {
        fragment.x *= nextWidth / width
        fragment.y *= nextHeight / height
      }
    }
    const nextDpr = Math.min(window.devicePixelRatio || 1, 2)
    if (nextDpr !== dpr) {
      dpr = nextDpr
      for (const fragment of fragments) if (fragment.radius) sizeCanvas(fragment, fragment.radius)
    }
    width = nextWidth
    height = nextHeight
  }

  function step(fragment: Fragment, dt: number) {
    const [turnAmplitude, turnFrequency, turnPhase] = fragment.turn
    const heading = fragment.heading + turnAmplitude * Math.sin(turnFrequency * time + turnPhase)
    fragment.x += Math.cos(heading) * fragment.speed * dt
    fragment.y += Math.sin(heading) * fragment.speed * dt
    fragment.z = zAt(fragment.depth, time)
    const project = () => {
      fragment.sx = width / 2 + ((fragment.x + wander(fragment.wanderX, time)) * F) / fragment.z
      fragment.sy = height / 2 + ((fragment.y + wander(fragment.wanderY, time)) * F) / fragment.z
    }
    project()
    // Wrap around once completely off screen (glow included), so drifting never runs out of space.
    const margin = (fragment.size * 1.6 * F) / fragment.z + 8
    const toWorld = fragment.z / F
    if (fragment.sx < -margin) fragment.x += (width + 2 * margin) * toWorld
    else if (fragment.sx > width + margin) fragment.x -= (width + 2 * margin) * toWorld
    if (fragment.sy < -margin) fragment.y += (height + 2 * margin) * toWorld
    else if (fragment.sy > height + margin) fragment.y -= (height + 2 * margin) * toWorld
    project()

    if (dt > 0) {
      // Tumble about a slowly wandering axis at a slowly changing speed.
      const [f1, p1, f2, p2, f3, p3] = fragment.axisWobble
      const axis = normalize([
        fragment.axis[0] + 0.6 * Math.sin(f1 * time + p1),
        fragment.axis[1] + 0.6 * Math.sin(f2 * time + p2),
        fragment.axis[2] + 0.6 * Math.sin(f3 * time + p3),
      ])
      const angle = fragment.spin * (1 + 0.35 * Math.sin(fragment.spinWobble[0] * time + fragment.spinWobble[1])) * dt
      const s = Math.sin(angle / 2)
      const [dw, dx, dy, dz] = [Math.cos(angle / 2), axis[0] * s, axis[1] * s, axis[2] * s]
      const [w, x, y, z] = fragment.q
      const q: Motion['q'] = [
        dw * w - dx * x - dy * y - dz * z,
        dw * x + dx * w + dy * z - dz * y,
        dw * y - dx * z + dy * w + dz * x,
        dw * z + dx * y - dy * x + dz * w,
      ]
      const length = Math.hypot(...q)
      fragment.q = [q[0] / length, q[1] / length, q[2] / length, q[3] / length]
    }
  }

  function draw(fragment: Fragment) {
    const { size, z, sx: centreX, sy: centreY } = fragment
    const half = size / 2
    const fade = clamp(1.3 - (0.32 * z) / F, 0.45, 1)
    const nearness = clamp(F / z, 0.75, 1.35)
    const base = mix(BLUE, VIOLET, fragment.hue)

    // Move the fragment (glow and canvas together): a compositor transform, written only when changed.
    const position = `translate3d(${centreX.toFixed(1)}px,${centreY.toFixed(1)}px,0)`
    if (position !== fragment.position) {
      fragment.position = position
      fragment.node.style.transform = position
    }
    // Glow: a CSS gradient; its size and strength follow the depth, which changes slowly.
    const glowScale = (size * 1.25 * F) / z / 50
    const glowOpacity = 0.06 * fade
    if (Math.abs(glowScale - fragment.glowScale) > fragment.glowScale * 0.02) {
      fragment.glowScale = glowScale
      fragment.glow.style.transform = `scale(${glowScale.toFixed(3)})`
    }
    if (Math.abs(glowOpacity - fragment.glowOpacity) > 0.002) {
      fragment.glowOpacity = glowOpacity
      fragment.glow.style.opacity = glowOpacity.toFixed(3)
    }

    // Rotation matrix columns = the cube's rotated axes.
    const [w, x, y, zq] = fragment.q
    const axes: Vec3[] = [
      [1 - 2 * (y * y + zq * zq), 2 * (x * y + w * zq), 2 * (x * zq - w * y)],
      [2 * (x * y - w * zq), 1 - 2 * (x * x + zq * zq), 2 * (y * zq + w * x)],
      [2 * (x * zq + w * y), 2 * (y * zq - w * x), 1 - 2 * (x * x + y * y)],
    ]
    const cx = fragment.x + wander(fragment.wanderX, time)
    const cy = fragment.y + wander(fragment.wanderY, time)
    let extent = 0
    for (let i = 0; i < 8; i++) {
      const sx = i & 1 ? half : -half
      const sy = i & 2 ? half : -half
      const sz = i & 4 ? half : -half
      const wx = cx + sx * axes[0][0] + sy * axes[1][0] + sz * axes[2][0]
      const wy = cy + sx * axes[0][1] + sy * axes[1][1] + sz * axes[2][1]
      const wz = z + sx * axes[0][2] + sy * axes[1][2] + sz * axes[2][2]
      // Relative to the projected centre for now; shifted into canvas space below.
      screen[i * 2] = width / 2 + (wx * F) / wz - centreX
      screen[i * 2 + 1] = height / 2 + (wy * F) / wz - centreY
      extent = Math.max(extent, Math.abs(screen[i * 2]), Math.abs(screen[i * 2 + 1]))
    }

    // Keep the canvas just big enough (resized only when the cube outgrows it or shrinks a lot).
    const needed = extent + 3
    if (needed > fragment.radius || needed < fragment.radius * 0.6) sizeCanvas(fragment, Math.ceil(needed * 1.2))
    const r = fragment.radius
    // Fully off screen: moved out of sight above, nothing to redraw.
    if (centreX + r < 0 || centreX - r > width || centreY + r < 0 || centreY - r > height) return
    // Moving is the compositor's job (the transform above). Repaint only once the cube's outline
    // has visibly changed, by about a third of a pixel, from turning or changing depth (or after
    // drifting far enough for the perspective to shift): small and distant cubes turn so slowly
    // on screen that they need only a few repaints a second.
    if (fragment.drawnZ) {
      const [qw, qx, qy, qz] = fragment.drawnQ
      const turned = 2 * Math.acos(Math.min(1, Math.abs(w * qw + x * qx + y * qy + zq * qz)))
      const rescaled = Math.abs(z - fragment.drawnZ) / z
      const drifted = Math.hypot(centreX - fragment.drawnX, centreY - fragment.drawnY)
      if ((turned + rescaled) * extent + drifted * 0.005 < 0.35) return
    }
    fragment.drawnQ = fragment.q
    fragment.drawnZ = z
    fragment.drawnX = centreX
    fragment.drawnY = centreY
    for (let i = 0; i < 16; i++) screen[i] += r

    const c = fragment.ctx
    c.setTransform(dpr, 0, 0, dpr, 0, 0)
    c.clearRect(0, 0, 2 * r, 2 * r)
    c.globalCompositeOperation = 'lighter'

    // Faces: lighting from the face normal, the view direction and the light.
    for (let k = 0; k < 6; k++) {
      const face = FACES[k]
      const n = axes[face.axis]
      const nx = n[0] * face.sign
      const ny = n[1] * face.sign
      const nz = n[2] * face.sign
      const view = normalize([-(cx + nx * half), -(cy + ny * half), -(z + nz * half)])
      const facing = nx * view[0] + ny * view[1] + nz * view[2]
      const halfway = normalize([LIGHT[0] + view[0], LIGHT[1] + view[1], LIGHT[2] + view[2]])
      faceFront[k] = facing > 0
      faceFacing[k] = Math.abs(facing)
      faceLight[k] = Math.max(0, nx * LIGHT[0] + ny * LIGHT[1] + nz * LIGHT[2])
      faceSpec[k] = Math.max(0, nx * halfway[0] + ny * halfway[1] + nz * halfway[2]) ** 20
    }
    order.sort((a, b) => Number(faceFront[a]) - Number(faceFront[b]))
    for (const k of order) {
      const face = FACES[k]
      const facing = faceFront[k]
      // Glass reflects more at grazing angles: faces seen edge-on are a little brighter.
      const fresnel = (1 - faceFacing[k]) ** 2
      const alpha =
        (0.03 + 0.025 * fresnel + 0.018 * faceLight[k] + 0.04 * faceSpec[k]) * (facing ? 1 : 0.55) * fade
      const tint = mix(
        mix(BLUE, VIOLET, clamp(fragment.hue + 0.3 * axes[face.axis][1] * face.sign, 0, 1)),
        WHITE,
        faceSpec[k] * 0.45,
      )
      c.fillStyle = rgba(tint, alpha)
      c.beginPath()
      const [a, b, d, e] = face.corners
      c.moveTo(screen[a * 2], screen[a * 2 + 1])
      c.lineTo(screen[b * 2], screen[b * 2 + 1])
      c.lineTo(screen[d * 2], screen[d * 2 + 1])
      c.lineTo(screen[e * 2], screen[e * 2 + 1])
      c.closePath()
      c.fill()
    }

    // Edge glow: one soft, wide pass over the visible edges.
    c.lineCap = 'round'
    c.lineWidth = 2.6 * nearness
    c.strokeStyle = rgba(base, 0.05 * fade)
    c.beginPath()
    for (const [a, b, f1, f2] of EDGES) {
      if (!faceFront[f1] && !faceFront[f2]) continue
      c.moveTo(screen[a * 2], screen[a * 2 + 1])
      c.lineTo(screen[b * 2], screen[b * 2 + 1])
    }
    c.stroke()

    // Thin luminous edges: brighter where they catch the light or outline the cube.
    c.lineWidth = 0.8 * nearness
    for (const [a, b, f1, f2] of EDGES) {
      const back = !faceFront[f1] && !faceFront[f2]
      const outline = faceFront[f1] !== faceFront[f2]
      const lit = Math.max(faceLight[f1], faceLight[f2])
      const glint = Math.max(faceSpec[f1], faceSpec[f2])
      const alpha = Math.min(0.5, (0.09 + 0.26 * lit * lit + (outline ? 0.1 : 0) + 0.15 * glint) * (back ? 0.4 : 1) * fade)
      c.strokeStyle = rgba(mix(base, WHITE, 0.1 + 0.4 * lit), alpha)
      c.beginPath()
      c.moveTo(screen[a * 2], screen[a * 2 + 1])
      c.lineTo(screen[b * 2], screen[b * 2 + 1])
      c.stroke()
    }
  }

  function render(dt: number) {
    if (!width) resize()
    if (!width) return
    time += dt
    for (const fragment of fragments) step(fragment, dt)
    // Far fragments behind near ones.
    fragments.sort((a, b) => b.z - a.z)
    fragments.forEach((fragment, rank) => {
      if (fragment.layer !== rank) {
        fragment.layer = rank
        fragment.node.style.zIndex = String(rank + 1)
      }
      draw(fragment)
    })
  }

  return { resize, render, destroy: unmount }
}
