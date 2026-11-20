import type { SkillCategory } from '../types'

/** Primary technologies shown in the strip directly below the hero. */
export const coreTechnologies = [
  'React',
  'TypeScript',
  'Node.js',
  'Python',
  'OpenAI',
  'Claude',
  'React Native',
  'PostgreSQL',
  'n8n',
  'AWS',
] as const

/**
 * Skill areas in the Skills section, each with the technologies used and the real projects that
 * demonstrate it (shown with their screens, see `project-screens.ts`). Example notes and
 * technologies must come from the project's recorded facts in `projects.ts`; never invent features.
 */
export const skillCategories: SkillCategory[] = [
  {
    id: 'fullstack',
    title: 'Full-Stack Development',
    description: 'Modern web frontends and the backends behind them, designed and shipped end to end.',
    icon: 'code',
    skills: ['React', 'Next.js', 'TypeScript', 'JavaScript', 'Node.js', 'Python', 'PHP', 'C# / .NET'],
    examples: [
      {
        project: 'radar-app',
        note: 'Designed and built end to end: the mobile application, API, geospatial database and administration system.',
      },
      {
        project: 'nexa-betfair-demo',
        note: 'A React marketplace interface integrated with the Betfair snapshot API, with session maintenance and API reliability improvements.',
        technologies: ['React', 'Cloudflare Functions', 'API integrations'],
      },
    ],
  },
  {
    id: 'mobile',
    title: 'Mobile Application Development',
    description: 'Cross-platform and native Android apps connected to production backends.',
    icon: 'smartphone',
    skills: [
      'React Native',
      'Expo',
      'Android',
      'Kotlin',
      'Java',
      'Mobile API Integration',
      'Push Notifications',
      'Cross-platform Development',
    ],
    examples: [
      {
        project: 'radar-app',
        note: 'A React Native and Expo app with interactive maps, GPS, alerts and notifications, and camera and gallery uploads.',
        technologies: ['React Native', 'Expo', 'TypeScript'],
        screens: ['radar-map', 'radar-location', 'radar-search'],
      },
      {
        project: 'style4u',
        note: 'A cross-platform mobile application built with React Native, Expo and TypeScript.',
      },
    ],
  },
  {
    id: 'ai',
    title: 'AI Integration & Intelligent Agents',
    description: 'LLM-powered features, agents and retrieval systems built into real products.',
    icon: 'brain',
    skills: [
      'OpenAI API',
      'Claude API',
      'LLM Integration',
      'AI Agents',
      'RAG Systems',
      'Vector Search',
      'pgvector',
      'CLIP',
      'Whisper',
      'AI-powered applications',
    ],
    examples: [
      {
        project: 'byd-technical-library-agent',
        note: 'An AI-powered technical knowledge assistant that helps users interact with technical documentation.',
      },
    ],
  },
  {
    id: 'automation',
    title: 'Business Process Automation',
    description: 'Workflows, bots and integrations that remove repetitive work from operations.',
    icon: 'workflow',
    skills: [
      'n8n',
      'Make',
      'Workflow Automation',
      'WhatsApp Business API',
      'Telegram Bots',
      'Email Automation',
      'API Integrations',
      'Webhooks',
      'Data Processing',
      'Background Jobs',
    ],
    examples: [
      {
        project: 'email-campaign-module',
        note: 'Automates email campaigns from creation to tracking: a six-step wizard, audience selection, queued sending with rate limiting and automatic pausing, and open and click tracking.',
      },
    ],
  },
  {
    id: 'backend',
    title: 'Backend Architecture & API Development',
    description: 'Typed APIs, background processing and data models built for reliability and performance.',
    icon: 'server',
    skills: [
      'Node.js',
      'Fastify',
      'Hono',
      'Python',
      'FastAPI',
      'REST APIs',
      'WebSockets',
      'PostgreSQL',
      'MySQL',
      'Redis',
      'Supabase',
      'MongoDB',
      'Drizzle ORM',
      'Prisma',
      'PostGIS',
    ],
    examples: [
      {
        project: 'email-campaign-module',
        note: 'A database-backed sending queue with background workers, retries, webhook processing and integrations with SMTP, SendGrid, Amazon SES and other providers.',
        screens: ['email-dashboard', 'email-tracking'],
      },
      {
        project: 'django-performance-optimization',
        note: 'Performance analysis, asynchronous processing with Celery and Redis integration: p95 response time from about 2.4 s to about 180 ms.',
      },
      {
        project: 'radar-app',
        note: 'A Fastify API over PostgreSQL with PostGIS geospatial search, accessed through Drizzle ORM.',
        technologies: ['Fastify', 'TypeScript', 'Drizzle ORM', 'PostgreSQL', 'PostGIS'],
        screens: ['radar-moderation'],
      },
    ],
  },
  {
    id: 'cloud',
    title: 'Cloud Infrastructure & DevOps',
    description: 'Containerised deployments, infrastructure as code and automated pipelines.',
    icon: 'cloud',
    skills: [
      'AWS',
      'Docker',
      'Kubernetes',
      'Terraform',
      'GitHub Actions',
      'Linux',
      'Ubuntu',
      'Nginx',
      'Cloudflare',
      'Vercel',
      'CI/CD',
    ],
    examples: [
      {
        project: 'nexa-betfair-demo',
        note: 'Hosted on Cloudflare Pages and Functions, with automated deployment through GitHub Actions and improved deployment reliability.',
        technologies: ['Cloudflare Pages', 'Cloudflare Functions', 'GitHub Actions'],
      },
    ],
  },
]
