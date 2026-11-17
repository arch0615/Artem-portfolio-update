import type { NavItem } from '../types'

/**
 * Top menu (desktop bar and mobile menu). Each `id` must match a section id on the home page.
 * Contact isn't listed: the "Let's Talk" button next to the menu leads there.
 */
export const navigation: NavItem[] = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'expertise', label: 'Expertise' },
  { id: 'projects', label: 'Projects' },
  { id: 'services', label: 'Services' },
]

export const navCta = { label: "Let's Talk", id: 'contact' } as const

/** Footer links: the menu sections except "Home" (the logo already links there), plus Contact. */
export const footerNavigation: NavItem[] = [
  ...navigation.filter((item) => item.id !== 'home'),
  { id: 'contact', label: 'Contact' },
]
