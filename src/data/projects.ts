import type { Project } from '../types'

/**
 * Show the "Visit" links to projects' live sites on the project cards and case-study pages. These are portfolio
 * evidence (the delivered websites), not contact channels. Set to `false` if a marketplace you
 * use doesn't allow external links on your portfolio.
 */
export const showProjectLinks = true

/**
 * Portfolio projects. Only real, verified information belongs here:
 * no invented clients, URLs, statistics or technologies.
 *
 * - `featured: true` projects get a large card and a full case study
 *   (content in `case-studies.ts`, keyed by `slug`).
 * - `visual` selects an original CSS mockup from `src/components/visuals`.
 *   To use a real screenshot instead, add it under `public/images/projects`
 *   and extend the card to render it.
 */
export const projects: Project[] = [
  {
    slug: 'swan',
    name: 'Swan',
    category: 'Fintech / Embedded Banking Platform',
    description:
      'An embedded banking platform that lets companies offer accounts, cards and payments inside their own products, white-labeled under their own brand.',
    technologies: ['TypeScript', 'React', 'GraphQL', 'Node.js'],
    features: [
      'Accounts with IBANs',
      'Individual and company onboarding',
      'KYC verification',
      'Virtual, physical and digital cards',
      'SEPA and instant credit transfers',
      'Direct debits',
      'Card payments',
      'White-labeled banking',
      'GraphQL API',
    ],
    contribution:
      'Full stack development across accounts and IBANs, card issuing, payments, and onboarding with KYC: React and TypeScript on the frontend, Node.js on the backend, connected through GraphQL.',
    links: [{ label: 'swan.io', href: 'https://www.swan.io/' }],
    visual: 'swan',
    visualLabel:
      'Illustration of a white-labeled business account with an IBAN and transactions, a virtual card, and a company onboarding checklist',
    accent: 'violet',
    featured: true,
  },
  {
    slug: 'radar-app',
    name: 'Radar App',
    category: 'AI-Ready Mobile Platform / Geolocation Application',
    description:
      'A location-based mobile application designed to help users discover nearby information through interactive maps, GPS functionality, and alerts.',
    technologies: [
      'Fastify',
      'TypeScript',
      'Drizzle ORM',
      'PostgreSQL',
      'PostGIS',
      'React Native',
      'Expo',
      'Next.js',
      'Tailwind CSS',
    ],
    features: [
      'User authentication',
      'Geospatial search',
      'Interactive maps',
      'GPS functionality',
      'Alerts and notifications',
      'Camera and gallery uploads',
      'Duplicate detection',
      'Admin moderation',
      'User management',
    ],
    contribution:
      'Designed and implemented the backend architecture, geospatial database, mobile application, API functionality, and administration system.',
    visual: 'radar',
    visualLabel: 'Illustration of a mobile map app with a location radar next to an admin moderation panel',
    accent: 'sky',
    featured: true,
  },
  {
    slug: 'email-campaign-module',
    name: 'Email Campaign Module',
    category: 'Marketing Automation / Backend Engineering',
    description:
      'A custom email campaign management system designed to automate campaign creation, audience selection, message delivery, and tracking.',
    technologies: ['Database-backed queue', 'Background workers', 'Webhooks', 'Open & click tracking'],
    integrations: ['SMTP', 'Resend', 'SendGrid', 'Mailgun', 'Postmark', 'Amazon SES'],
    features: [
      'Campaign management',
      'Audience selection',
      'Six-step campaign wizard',
      'Database-backed sending queue',
      'Background workers',
      'Rate limiting',
      'Automatic campaign pausing',
      'Open and click tracking',
      'Unsubscribe management',
      'Webhook processing',
      'Retry mechanisms',
      'Dashboard authentication',
    ],
    contribution:
      'Developed the campaign workflow, sending infrastructure, provider integrations, webhook verification, and tracking system.',
    visual: 'email',
    visualLabel: 'Illustration of a six-step campaign wizard with delivery providers and a sending queue',
    accent: 'indigo',
    featured: true,
  },
  {
    slug: 'django-performance-optimization',
    name: 'Django Performance Optimization',
    category: 'Backend Engineering / Performance Optimization',
    description: 'Optimized backend performance and asynchronous processing for a Django application.',
    technologies: ['Python', 'Django', 'Celery', 'Redis', 'Django Channels'],
    features: [
      'Performance analysis',
      'Asynchronous processing optimization',
      'Redis integration',
      'Backend improvements',
    ],
    contribution:
      'Performance analysis, asynchronous processing optimization, Redis integration, and backend improvements.',
    metric: { label: 'p95 response time', value: '2.4 s → 180 ms', detail: 'approximately' },
    visual: 'django',
    visualLabel: 'Chart comparing p95 response time before (about 2.4 seconds) and after (about 180 milliseconds)',
    accent: 'emerald',
    featured: true,
  },
  {
    slug: 'nexa-betfair-demo',
    name: 'Nexa Betfair Demo',
    category: 'Web Application / API Integration',
    description: 'A marketplace demonstration platform integrated with Betfair services.',
    technologies: ['React', 'Cloudflare Pages', 'Cloudflare Functions', 'GitHub Actions', 'API integrations'],
    features: [
      'Marketplace interface',
      'Snapshot API integration',
      'Session maintenance',
      'Automated deployment',
      'Demo environment',
      'API reliability improvements',
    ],
    contribution: 'Frontend integration, deployment reliability, API integration, and session management.',
    visual: 'nexa',
    visualLabel: 'Illustration of a marketplace table with session status and an automated deployment pipeline',
    accent: 'rose',
  },
  {
    slug: 'dourasoft',
    name: 'DouraSoft',
    category: 'Business Platforms / Web Development',
    description: 'A collection of business-oriented web platforms and digital services.',
    technologies: [],
    features: [],
    links: [
      { label: 'dourasoft.com.br', href: 'https://dourasoft.com.br/' },
      { label: 'assinaturas.dourasoft.com.br', href: 'https://assinaturas.dourasoft.com.br/' },
      { label: 'lotericas.dourasoft.com.br', href: 'https://lotericas.dourasoft.com.br/' },
      { label: 'veja.dourasoft.com.br', href: 'https://veja.dourasoft.com.br/' },
    ],
    visual: 'dourasoft',
    visualLabel: 'Illustration of four related DouraSoft web platforms shown as stacked browser windows',
    accent: 'cyan',
  },
  {
    slug: 'solid-house',
    name: 'Solid House',
    category: 'Real Estate Web Development',
    description: 'A real estate website for a property business operating in Romania.',
    technologies: [],
    features: [],
    links: [{ label: 'solidhouse.ro', href: 'https://solidhouse.ro/' }],
    visual: 'solidhouse',
    visualLabel: 'Illustration of a real estate website with a hero banner and property listings',
    accent: 'amber',
  },
  {
    slug: 'style4u',
    name: 'Style4U',
    category: 'Mobile Application Development',
    description: 'A mobile application project demonstrating cross-platform application development capabilities.',
    technologies: ['React Native', 'Expo', 'TypeScript'],
    features: [],
    visual: 'style4u',
    visualLabel: 'Illustration of the same mobile app running on iOS and Android',
    accent: 'fuchsia',
  },
  {
    slug: 'byd-technical-library-agent',
    name: 'BYD Technical Library Agent',
    category: 'AI / Knowledge Management',
    description:
      'An AI-powered technical knowledge assistant designed to help users interact with technical documentation.',
    technologies: [],
    features: [],
    visual: 'byd',
    visualLabel: 'Illustration of an AI assistant answering questions with references to technical documents',
    accent: 'violet',
  },
]

export const featuredProjects = projects.filter((p) => p.featured)
export const otherProjects = projects.filter((p) => !p.featured)

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug)
}
