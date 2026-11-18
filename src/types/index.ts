/**
 * Shared content types. Data files in `src/data` are typed against these so the
 * UI can rely on a consistent shape. Keep this module free of runtime imports —
 * it is also consumed by the build-time SEO plugin.
 */

/** Keys of the Lucide icons registered in `src/lib/icons.ts`. */
export type IconName =
  | 'activity'
  | 'bell'
  | 'bot'
  | 'boxes'
  | 'brain'
  | 'camera'
  | 'cloud'
  | 'code'
  | 'compass'
  | 'copy'
  | 'database'
  | 'fileText'
  | 'gauge'
  | 'gitBranch'
  | 'globe'
  | 'layers'
  | 'layout'
  | 'listChecks'
  | 'lock'
  | 'mail'
  | 'mapPin'
  | 'network'
  | 'pause'
  | 'plug'
  | 'repeat'
  | 'rocket'
  | 'search'
  | 'server'
  | 'shield'
  | 'smartphone'
  | 'sparkles'
  | 'terminal'
  | 'timer'
  | 'users'
  | 'webhook'
  | 'workflow'
  | 'zap'

export interface NavItem {
  /** Section element id on the home page. */
  id: string
  label: string
}

export interface Highlight {
  label: string
  icon: IconName
}

export interface SkillCategory {
  id: string
  title: string
  description: string
  icon: IconName
  skills: string[]
}

export interface Service {
  id: string
  title: string
  description: string
  icon: IconName
  items: string[]
}

export interface Milestone {
  title: string
  description: string
  icon: IconName
}

export interface ProcessStep {
  step: string
  title: string
  description: string
  icon: IconName
}

/** Original CSS-based product mockups in `src/components/visuals`. */
export type ProjectVisualKey =
  | 'radar'
  | 'email'
  | 'django'
  | 'nexa'
  | 'solidhouse'
  | 'dourasoft'
  | 'style4u'
  | 'byd'

export type AccentTone = 'indigo' | 'violet' | 'sky' | 'emerald' | 'amber' | 'rose' | 'cyan' | 'fuchsia'

export interface ProjectLink {
  label: string
  href: string
}

export interface ProjectMetric {
  label: string
  value: string
  detail?: string
}

export interface Project {
  slug: string
  name: string
  category: string
  description: string
  technologies: string[]
  /** Third-party services the project integrates with. */
  integrations?: string[]
  features: string[]
  contribution?: string
  /** A verified, real result. Never add estimates here. */
  metric?: ProjectMetric
  links?: ProjectLink[]
  visual: ProjectVisualKey
  /** Short description of the mockup for screen readers. */
  visualLabel: string
  accent: AccentTone
  featured?: boolean
}

export interface CaseStudyItem {
  title: string
  description: string
}

export interface ArchitectureLayer {
  label: string
  title: string
  items: string[]
}

export interface CaseStudy {
  slug: string
  /** Meta description used for SEO and social previews. */
  seoDescription: string
  role: string
  overview: string
  problem: string
  challenges: CaseStudyItem[]
  architecture: {
    caption: string
    layers: ArchitectureLayer[]
  }
  stack: { group: string; items: string[] }[]
  implementation: CaseStudyItem[]
  decisions: CaseStudyItem[]
  results: {
    summary: string
    metrics?: ProjectMetric[]
    points: string[]
  }
}
