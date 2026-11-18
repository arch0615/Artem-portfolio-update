import fs from 'node:fs/promises'
import path from 'node:path'
import type { Plugin, ResolvedConfig } from 'vite'
import { knowsAbout, profile, site } from '../src/data/profile.ts'
import { projects } from '../src/data/projects.ts'
import { caseStudies } from '../src/data/case-studies.ts'

/**
 * Build-time SEO for a client-rendered SPA.
 *
 * - Injects title, description, canonical, Open Graph, Twitter and Person JSON-LD
 *   into index.html from `src/data/profile.ts` (single source of truth).
 * - Emits a static HTML entry per case study with route-specific metadata, so
 *   crawlers and link previews that don't execute JavaScript see the right tags.
 * - Generates sitemap.xml and robots.txt.
 */

interface PageMeta {
  path: string
  title: string
  description: string
  type: 'website' | 'article'
}

const START = '<!-- seo:start -->'
const END = '<!-- seo:end -->'

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const absoluteUrl = (pathname: string) => new URL(pathname, site.url).toString()

/**
 * Person structured data. Deliberately carries no contact details (email, phone, social or
 * marketplace profiles), in line with the site's no-off-platform-contact policy.
 */
function personSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    url: absoluteUrl('/'),
    image: absoluteUrl(site.ogImage),
    jobTitle: profile.title,
    description: site.description,
    knowsAbout,
  }
}

function renderHead(page: PageMeta): string {
  const url = absoluteUrl(page.path)
  const image = absoluteUrl(site.ogImage)
  const title = escapeHtml(page.title)
  const description = escapeHtml(page.description)
  const jsonLd = JSON.stringify(personSchema()).replace(/</g, '\\u003c')

  return [
    START,
    `<title>${title}</title>`,
    `<meta name="description" content="${description}" />`,
    `<meta name="keywords" content="${escapeHtml(site.keywords.join(', '))}" />`,
    `<meta name="author" content="${escapeHtml(profile.name)}" />`,
    `<meta name="robots" content="index, follow" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="${page.type}" />`,
    `<meta property="og:site_name" content="${escapeHtml(profile.name)}" />`,
    `<meta property="og:locale" content="${site.locale}" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${escapeHtml(site.ogImageAlt)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${title}" />`,
    `<meta name="twitter:description" content="${description}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    `<script type="application/ld+json">${jsonLd}</script>`,
    END,
  ].join('\n    ')
}

function replaceHead(html: string, page: PageMeta): string {
  const pattern = new RegExp(`${START}[\\s\\S]*?${END}`)
  if (!pattern.test(html)) {
    throw new Error(`[seo] index.html is missing the "${START}${END}" markers`)
  }
  return html.replace(pattern, renderHead(page))
}

const homePage: PageMeta = { path: '/', title: site.title, description: site.description, type: 'website' }

function caseStudyPages(): PageMeta[] {
  return projects
    .filter((p) => caseStudies[p.slug])
    .map((p) => ({
      path: `/projects/${p.slug}`,
      title: `${p.name} — Case Study | ${profile.name}`,
      description: caseStudies[p.slug].seoDescription,
      type: 'article' as const,
    }))
}

function sitemap(pages: PageMeta[]): string {
  const lastmod = new Date().toISOString().slice(0, 10)
  const urls = pages
    .map(
      (p) =>
        `  <url>\n    <loc>${absoluteUrl(p.path)}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <priority>${p.path === '/' ? '1.0' : '0.8'}</priority>\n  </url>`,
    )
    .join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
}

const robots = () => `User-agent: *\nAllow: /\n\nSitemap: ${absoluteUrl('/sitemap.xml')}\n`

export function seoPlugin(): Plugin {
  let config: ResolvedConfig

  return {
    name: 'portfolio-seo',
    configResolved(resolved) {
      config = resolved
    },
    transformIndexHtml: {
      order: 'pre',
      handler: (html) => replaceHead(html, homePage),
    },
    async closeBundle() {
      if (config.command !== 'build') return
      const outDir = path.resolve(config.root, config.build.outDir)
      const indexHtml = await fs.readFile(path.join(outDir, 'index.html'), 'utf8')
      const pages = caseStudyPages()

      await Promise.all(
        pages.map(async (page) => {
          const dir = path.join(outDir, page.path)
          await fs.mkdir(dir, { recursive: true })
          await fs.writeFile(path.join(dir, 'index.html'), replaceHead(indexHtml, page))
        }),
      )
      await fs.writeFile(path.join(outDir, 'sitemap.xml'), sitemap([homePage, ...pages]))
      await fs.writeFile(path.join(outDir, 'robots.txt'), robots())
      config.logger.info(`[seo] generated ${pages.length} case-study pages, sitemap.xml and robots.txt`)
    },
  }
}

/**
 * Preloads the hashed Latin Geist font file so the hero headline renders in the
 * brand typeface without waiting for the CSS to be parsed first.
 */
export function fontPreloadPlugin(patterns: RegExp[] = [/geist-latin-wght-normal-[\w-]+\.woff2$/]): Plugin {
  return {
    name: 'portfolio-font-preload',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(_html, ctx) {
        if (!ctx.bundle) return
        return Object.keys(ctx.bundle)
          .filter((file) => patterns.some((pattern) => pattern.test(file)))
          .map((file) => ({
            tag: 'link',
            attrs: { rel: 'preload', as: 'font', type: 'font/woff2', href: `/${file}`, crossorigin: '' },
            injectTo: 'head' as const,
          }))
      },
    },
  }
}
