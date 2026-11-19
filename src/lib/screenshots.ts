/**
 * Real application screenshots for the Selected work showcase, found at build time in
 * `src/assets/work/` (configured in `src/data/showcase.ts`). The build fingerprints them, so they
 * are cached long-term; a screen without a file simply has no URL.
 */
const files = import.meta.glob<string>('/src/assets/work/*.{webp,png,jpg,jpeg,avif}', {
  eager: true,
  query: '?url',
  import: 'default',
})

const byName = new Map(
  Object.entries(files).map(([path, url]) => [path.slice(path.lastIndexOf('/') + 1).replace(/\.[^.]+$/, ''), url]),
)

/** URL of the screenshot saved as `name` (any supported extension), or `undefined` if there is none. */
export function screenshotUrl(name: string): string | undefined {
  return byName.get(name)
}
