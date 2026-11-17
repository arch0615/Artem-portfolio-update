import type { CSSProperties } from 'react'
import type { AccentTone } from '@/types'

/** RGB channels per accent tone — consumed as `rgb(var(--accent) / <alpha>)`. */
const accentRgb: Record<AccentTone, string> = {
  indigo: '99 102 241',
  violet: '139 92 246',
  sky: '56 189 248',
  emerald: '52 211 153',
  amber: '251 191 36',
  rose: '251 113 133',
  cyan: '34 211 238',
  fuchsia: '232 121 249',
}

export function accentStyle(tone: AccentTone): CSSProperties {
  return { '--accent': accentRgb[tone] } as CSSProperties
}
