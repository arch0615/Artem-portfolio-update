import type { Highlight, PortraitMedia } from '../types'

/**
 * Identity and site-wide SEO configuration. The site intentionally publishes no contact details.
 *
 * NOTE: this file is imported by the build-time SEO plugin (`config/seo-plugin.ts`),
 * so keep it free of browser APIs, React and `@/` path aliases.
 */

export const profile = {
  name: 'Artem Bohomolov',
  firstName: 'Artem',
  initials: 'AB',
  title: 'AI Full-Stack Developer',
  tagline: 'Mobile Apps & Automation',
  headline: 'AI Full-Stack Developer | Mobile Apps & Automation',
  experienceYears: 17,
  positioning:
    'I build intelligent digital products, scalable web applications, mobile experiences, and AI-powered automation systems.',
} as const

/**
 * Hero portrait (right side of the hero). The still image always shows first. To animate it, put the
 * looping clip in `public/videos/` and list it in `videos`, e.g.
 * `{ src: '/videos/portrait.mp4', type: 'video/mp4' }` (see README, "Hero portrait").
 */
export const portrait: PortraitMedia = {
  alt: 'Full-length portrait of Artem Bohomolov',
  width: 1024,
  height: 1536,
  images: [
    { src: '/images/portrait-480.webp', width: 480 },
    { src: '/images/portrait-768.webp', width: 768 },
    { src: '/images/portrait-1024.webp', width: 1024 },
  ],
  videos: [],
}

export const site = {
  url: 'https://artem-bohomolov-portfolio.vercel.app',
  title: 'Artem Bohomolov | AI Full-Stack Developer | Mobile & Automation',
  description:
    'Artem Bohomolov is an AI Full-Stack Developer with 17+ years of experience building intelligent web applications, mobile apps, AI integrations, and business automation systems.',
  keywords: [
    'AI Full-Stack Developer',
    'React Developer',
    'Mobile App Developer',
    'AI Automation Developer',
    'Custom Software Development',
    'AI Integration Specialist',
    'React Native Developer',
    'Business Automation',
    'Artem Bohomolov',
  ],
  ogImage: '/og-image.png',
  ogImageAlt: 'Artem Bohomolov — AI Full-Stack Developer | Mobile Apps & Automation',
  locale: 'en_US',
  themeColor: '#09090B',
}

/** Topics listed in the Person structured data (schema.org `knowsAbout`). */
export const knowsAbout = [
  'Full-stack web development',
  'Artificial intelligence integration',
  'Large language models',
  'Retrieval-augmented generation',
  'Mobile application development',
  'React',
  'React Native',
  'TypeScript',
  'Node.js',
  'Python',
  'Business process automation',
  'n8n',
  'Backend architecture',
  'PostgreSQL',
  'Cloud infrastructure',
]

export const heroHighlights: Highlight[] = [
  { label: 'AI-Powered Development', icon: 'sparkles' },
  { label: 'Full-Stack Engineering', icon: 'layers' },
  { label: 'Mobile Applications', icon: 'smartphone' },
  { label: 'Business Automation', icon: 'workflow' },
]
