import type { NavItem } from '../types'

/** Primary navigation. Each `id` must match a section id on the home page. */
export const navigation: NavItem[] = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'expertise', label: 'Expertise' },
  { id: 'projects', label: 'Projects' },
  { id: 'services', label: 'Services' },
  { id: 'contact', label: 'Contact' },
]

export const navCta = { label: "Let's Talk", id: 'contact' } as const
