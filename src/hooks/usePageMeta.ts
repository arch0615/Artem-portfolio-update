import { useEffect } from 'react'
import { site } from '@/data/profile'

interface PageMeta {
  title: string
  description: string
  /** Path relative to the site root, e.g. `/projects/radar-app`. */
  path: string
}

const selectors = {
  description: ['meta[name="description"]', 'meta[property="og:description"]', 'meta[name="twitter:description"]'],
  title: ['meta[property="og:title"]', 'meta[name="twitter:title"]'],
  url: ['meta[property="og:url"]'],
} as const

function setContent(selectorList: readonly string[], value: string) {
  for (const selector of selectorList) {
    document.querySelector(selector)?.setAttribute('content', value)
  }
}

/**
 * Keeps document metadata in sync during client-side navigation. The initial HTML
 * for every route already contains the right tags (generated at build time), so
 * this only updates existing elements — it never duplicates them.
 */
export function usePageMeta({ title, description, path }: PageMeta) {
  useEffect(() => {
    const url = new URL(path, site.url).toString()
    document.title = title
    setContent(selectors.title, title)
    setContent(selectors.description, description)
    setContent(selectors.url, url)
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', url)
  }, [title, description, path])
}
