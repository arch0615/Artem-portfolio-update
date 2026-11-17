import { useEffect, useState } from 'react'

/**
 * Scroll-spy: returns the id of the section crossing a thin band just above the
 * middle of the viewport. Keeps the last match while scrolling through sections
 * that aren't tracked, so the indicator doesn't flicker.
 */
export function useActiveSection(ids: readonly string[]): string | null {
  const [active, setActive] = useState<string | null>(null)
  const key = ids.join('|')

  useEffect(() => {
    if (!key) return
    const elements = key
      .split('|')
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)

    const intersecting = new Map<string, boolean>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) intersecting.set(entry.target.id, entry.isIntersecting)
        const current = elements.find((el) => intersecting.get(el.id))
        if (current) setActive(current.id)
      },
      { rootMargin: '-38% 0px -58% 0px' },
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [key])

  return key ? active : null
}
