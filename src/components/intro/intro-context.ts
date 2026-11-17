import { createContext, useContext } from 'react'

/**
 * `true` once the intro overlay has started to dissolve (and always `true` when no intro is shown).
 * Entrance animations that would otherwise play unseen under the overlay wait for it.
 */
export const IntroRevealContext = createContext(true)

export function useIntroRevealed(): boolean {
  return useContext(IntroRevealContext)
}
