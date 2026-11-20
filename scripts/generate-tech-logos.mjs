#!/usr/bin/env node
/**
 * Generates `src/lib/tech-logos.ts`, the technology logos shown in the Skills section.
 *
 *   npm run logos
 *
 * Downloads the pinned icon packages below into a temporary folder (no project dependencies are
 * added), copies only the logos listed in LOGOS, checks them and writes the module. The site then
 * bundles those few SVGs and loads nothing from a CDN at runtime.
 *
 * To add a logo: add an entry to LOGOS, run `npm run logos`, then reference its key from a
 * technology in `src/data/skills.ts`.
 */
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const PACKAGES = {
  simpleIcons: { name: 'simple-icons', version: '16.38.0', license: 'CC0-1.0' },
  iconifyLogos: { name: '@iconify-json/logos', version: '1.2.20', license: 'CC0-1.0 (SVG Logos by Gil Barbara)' },
  lobehub: { name: '@lobehub/icons-static-svg', version: '1.104.0', license: 'MIT, Copyright (c) LobeHub' },
}

/**
 * Each logo's source. Simple Icons marks are single-colour (the brand colour is set per technology
 * in `skills.ts`); Iconify "logos" and LobeHub "-color" files keep the official multicolour artwork.
 * `mono` marks a single-colour source outside Simple Icons; `currentColor` fixes the colour of a
 * themeable part (e.g. the official light variant of a wordmark for dark backgrounds).
 */
const LOGOS = {
  // Full-stack
  react: { from: 'simpleIcons', slug: 'react' },
  nextjs: { from: 'simpleIcons', slug: 'nextdotjs' },
  typescript: { from: 'iconifyLogos', name: 'typescript-icon' },
  javascript: { from: 'iconifyLogos', name: 'javascript' },
  nodejs: { from: 'simpleIcons', slug: 'nodedotjs' },
  python: { from: 'iconifyLogos', name: 'python' },
  fastapi: { from: 'simpleIcons', slug: 'fastapi' },
  tailwindcss: { from: 'simpleIcons', slug: 'tailwindcss' },
  php: { from: 'iconifyLogos', name: 'php' },
  dotnet: { from: 'iconifyLogos', name: 'dotnet' },
  // Mobile
  expo: { from: 'simpleIcons', slug: 'expo' },
  android: { from: 'simpleIcons', slug: 'android' },
  kotlin: { from: 'iconifyLogos', name: 'kotlin-icon' },
  java: { from: 'iconifyLogos', name: 'java' },
  // AI
  openai: { from: 'lobehub', name: 'openai', mono: true },
  claude: { from: 'simpleIcons', slug: 'claude' },
  // Automation
  n8n: { from: 'simpleIcons', slug: 'n8n' },
  make: { from: 'lobehub', name: 'make-color' },
  whatsapp: { from: 'iconifyLogos', name: 'whatsapp-icon' },
  telegram: { from: 'iconifyLogos', name: 'telegram' },
  // Backend and databases
  fastify: { from: 'simpleIcons', slug: 'fastify' },
  hono: { from: 'iconifyLogos', name: 'hono' },
  postgresql: { from: 'iconifyLogos', name: 'postgresql' },
  mysql: { from: 'iconifyLogos', name: 'mysql' },
  redis: { from: 'simpleIcons', slug: 'redis' },
  supabase: { from: 'iconifyLogos', name: 'supabase-icon' },
  drizzle: { from: 'simpleIcons', slug: 'drizzle' },
  prisma: { from: 'simpleIcons', slug: 'prisma' },
  // Cloud and DevOps
  aws: { from: 'lobehub', name: 'aws-color', currentColor: '#FFFFFF' },
  docker: { from: 'simpleIcons', slug: 'docker' },
  terraform: { from: 'simpleIcons', slug: 'terraform' },
  githubactions: { from: 'simpleIcons', slug: 'githubactions' },
  cloudflare: { from: 'iconifyLogos', name: 'cloudflare-icon' },
  vercel: { from: 'simpleIcons', slug: 'vercel' },
  linux: { from: 'iconifyLogos', name: 'linux-tux' },
  nginx: { from: 'iconifyLogos', name: 'nginx' },
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const output = path.join(root, 'src/lib/tech-logos.ts')

/** Downloads and unpacks each package; returns { key: packageDir }. */
function fetchPackages() {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'tech-logos-'))
  const dirs = {}
  for (const [key, pkg] of Object.entries(PACKAGES)) {
    const tarball = execFileSync('npm', ['pack', `${pkg.name}@${pkg.version}`, '--silent', '--pack-destination', tmp], {
      encoding: 'utf8',
    }).trim()
    const dir = path.join(tmp, key)
    fs.mkdirSync(dir)
    execFileSync('tar', ['-xzf', path.join(tmp, tarball.split('\n').at(-1)), '-C', dir])
    dirs[key] = path.join(dir, 'package')
  }
  return { tmp, dirs }
}

/** Gives every id a per-instance placeholder so several copies of a logo never share gradient ids. */
function namespaceIds(body) {
  const ids = [...body.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1])
  ids.forEach((id, index) => {
    const escaped = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    body = body
      .replace(new RegExp(`\\sid="${escaped}"`, 'g'), ` id="{uid}-${index}"`)
      .replace(new RegExp(`url\\(#${escaped}\\)`, 'g'), `url(#{uid}-${index})`)
      .replace(new RegExp(`href="#${escaped}"`, 'g'), `href="#{uid}-${index}"`)
  })
  return body
}

function assertSafe(key, body) {
  const unsafe = /<script|<foreignObject|<image|\son[a-z]+=|href="(?!#)|javascript:/i.exec(body)
  if (unsafe) throw new Error(`${key}: unexpected markup "${unsafe[0]}"`)
}

const minify = (markup) => markup.replace(/<!--[\s\S]*?-->/g, '').replace(/>\s+</g, '><').replace(/\s+/g, ' ').trim()

function readLogo(key, spec, dirs) {
  if (spec.from === 'simpleIcons') {
    const svg = fs.readFileSync(path.join(dirs.simpleIcons, 'icons', `${spec.slug}.svg`), 'utf8')
    const title = svg.match(/<title>([^<]+)<\/title>/)[1]
    const d = svg.match(/\sd="([^"]+)"/)[1]
    return { mono: true, title, viewBox: '0 0 24 24', body: `<path d="${d}"/>` }
  }
  if (spec.from === 'iconifyLogos') {
    const set = JSON.parse(fs.readFileSync(path.join(dirs.iconifyLogos, 'icons.json'), 'utf8'))
    const icon = set.icons[spec.name]
    if (!icon) throw new Error(`${key}: "${spec.name}" is not in @iconify-json/logos`)
    const width = icon.width ?? set.width ?? 16
    const height = icon.height ?? set.height ?? 16
    return { mono: false, title: key, viewBox: `0 0 ${width} ${height}`, body: icon.body }
  }
  if (spec.from === 'lobehub') {
    const svg = fs.readFileSync(path.join(dirs.lobehub, 'icons', `${spec.name}.svg`), 'utf8')
    const open = svg.match(/<svg([^>]*)>/)
    const attr = (name) => open[1].match(new RegExp(`\\s${name}="([^"]+)"`))?.[1]
    const inner = svg
      .slice(open.index + open[0].length, svg.lastIndexOf('</svg>'))
      .replace(/<title>[\s\S]*?<\/title>/, '')
    // Carry the root's paint attributes onto a group, since only the inner markup is kept.
    const paint = ['fill', 'fill-rule', 'clip-rule'].map((name) => (attr(name) ? ` ${name}="${attr(name)}"` : '')).join('')
    return {
      mono: Boolean(spec.mono),
      title: svg.match(/<title>([^<]+)<\/title>/)?.[1] ?? key,
      viewBox: attr('viewBox'),
      body: paint ? `<g${paint}>${inner}</g>` : inner,
    }
  }
  throw new Error(`${key}: unknown source ${spec.from}`)
}

function build(dirs) {
  const mono = {}
  const multicolor = {}
  for (const [key, spec] of Object.entries(LOGOS)) {
    const logo = readLogo(key, spec, dirs)
    let body = minify(logo.body)
    if (spec.currentColor) body = body.replaceAll('currentColor', spec.currentColor)
    body = namespaceIds(body)
    assertSafe(key, body)
    if (logo.mono && /fill="#|stop-color|url\(#/.test(body)) throw new Error(`${key}: a single-colour logo has its own colours`)
    ;(logo.mono ? mono : multicolor)[key] = { title: logo.title, viewBox: logo.viewBox, body }
  }
  return { mono, multicolor }
}

function write({ mono, multicolor }) {
  const entries = (logos) =>
    Object.entries(logos)
      .map(([key, logo]) => `  ${key}: ${JSON.stringify(logo)},`)
      .join('\n')
  const sources = Object.values(PACKAGES)
    .map((pkg) => ` *   ${pkg.name}@${pkg.version} (${pkg.license})`)
    .join('\n')
  const file = `/**
 * Technology logos for the Skills section.
 * GENERATED by scripts/generate-tech-logos.mjs (\`npm run logos\`). Do not edit by hand.
 *
 * Sources:
${sources}
 * Brand names and logos are trademarks of their respective owners, shown only to identify the
 * technologies. In \`body\`, "{uid}" is replaced per instance to keep gradient ids unique.
 */
export interface TechLogo {
  title: string
  viewBox: string
  /** Inner SVG markup. */
  body: string
}

/** Single-colour marks: drawn in \`currentColor\` (each technology's colour is set in \`skills.ts\`). */
export const monoLogos = {
${entries(mono)}
} satisfies Record<string, TechLogo>

/** Official multicolour logos, drawn in their own colours. */
export const multicolorLogos = {
${entries(multicolor)}
} satisfies Record<string, TechLogo>

export type MonoLogoKey = keyof typeof monoLogos
export type MulticolorLogoKey = keyof typeof multicolorLogos
`
  fs.writeFileSync(output, file)
  const kb = (Buffer.byteLength(file) / 1024).toFixed(1)
  console.log(`Wrote ${path.relative(root, output)}: ${Object.keys(mono).length} single-colour + ${Object.keys(multicolor).length} multicolour logos, ${kb} KB`)
}

const { tmp, dirs } = fetchPackages()
try {
  write(build(dirs))
} finally {
  fs.rmSync(tmp, { recursive: true, force: true })
}
