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

export interface PortraitMedia {
  alt: string
  /** Intrinsic size of the still image. */
  width: number
  height: number
  /** The still image in several widths, smallest first: placeholder, fallback and reduced-motion view. */
  images: { src: string; width: number }[]
  /**
   * Optional muted looping clip, the primary visual when set. The frame takes the clip's aspect
   * ratio, so the clip is shown whole; the still image is cropped to it (background only).
   */
  video?: {
    width: number
    height: number
    /** In order of preference. */
    sources: { src: string; type: string }[]
  }
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
  /** Real projects that demonstrate this skill area, shown with their screens. */
  examples: SkillExample[]
}

export interface SkillExample {
  /** Project slug in `projects.ts`. */
  project: string
  /** How the project demonstrates the skill, based only on its recorded facts. */
  note: string
  /** Technologies to show: a subset of the project's own (defaults to all of them). */
  technologies?: string[]
  /** Screens to show, by file name (defaults to all of the project's screens). */
  screens?: string[]
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

/** One real application screen (see `src/data/project-screens.ts`). */
export interface ProjectScreen {
  /** File name without extension in `src/assets/work/` (.webp, .png, .jpg or .avif). */
  file: string
  /** Short label for the screen selector, e.g. "Map". */
  label: string
  /** What the screenshot shows, for screen readers. */
  alt: string
  /** Frame: `phone` for a portrait app screen, `browser` for a web interface. */
  device: 'phone' | 'browser'
}
