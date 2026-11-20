import type { NavItem } from '../types'

/** Primary navigation (top menu and footer). Each `id` must match a section id on the home page. */
export const navigation: NavItem[] = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'services', label: 'Services' },
  { id: 'experience', label: 'Experience' },
]
