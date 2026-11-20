import type { Milestone, ProcessStep } from '../types'

/** Section copy for the home page. Edit text here, not in components. */

export const heroContent = {
  eyebrow: 'Available for select projects',
  headline: ['Building Intelligent Products.', 'Automating Businesses.', 'Engineering the Future.'],
  intro: [
    "I'm Artem Bohomolov, an AI Full-Stack Developer specializing in modern web applications, mobile development, AI integrations, and intelligent automation.",
    'I turn complex ideas into scalable digital products that solve real business problems.',
  ],
  primaryCta: { label: 'Explore My Projects', id: 'projects' },
  secondaryCta: { label: 'View My Skills', id: 'skills' },
}

export const aboutContent = {
  eyebrow: 'About',
  title: 'Engineering Ideas Into Digital Products.',
  paragraphs: [
    "I'm Artem Bohomolov, a developer with more than 17 years of experience building software solutions for businesses and technology products.",
    'My expertise covers full-stack application development, backend architecture, mobile applications, artificial intelligence, and workflow automation.',
    'I enjoy solving complex technical challenges, integrating different technologies, improving performance, and creating reliable software that delivers measurable business value.',
  ],
  belief:
    'I believe great software combines thoughtful architecture, intuitive user experience, and practical business outcomes.',
  highlights: [
    { label: '17+ years of development experience', icon: 'timer' },
    { label: 'Full-stack application architecture', icon: 'layers' },
    { label: 'AI and LLM integrations', icon: 'brain' },
    { label: 'Cross-platform mobile applications', icon: 'smartphone' },
    { label: 'Business workflow automation', icon: 'workflow' },
    { label: 'API and third-party integrations', icon: 'plug' },
    { label: 'Cloud infrastructure and deployment', icon: 'cloud' },
  ],
} as const

export const skillsContent = {
  eyebrow: 'My Skills',
  title: 'Skills That Build Real Products.',
  description:
    'From full-stack engineering and mobile development to AI integration and intelligent automation, I turn complex ideas into practical digital solutions.',
}

/** Labels in the Skills section (skill areas: `src/data/skills.ts`). */
export const skillsShowcaseContent = {
  areasLabel: 'Skill areas',
  technologiesLabel: 'Technologies',
  exampleLabel: 'Project example',
  examplesLabel: 'Project examples',
  /** Follows the project name: "Radar App case study". */
  caseStudy: 'case study',
}

/** Labels in the screenshot viewer (screens: `src/data/project-screens.ts`). */
export const screenViewerContent = {
  screensLabel: 'Screens',
  placeholder: 'Screenshot coming soon',
}

export const projectsContent = {
  eyebrow: 'Selected Projects',
  title: 'Real Products, Engineered End to End.',
  description:
    'A selection of platforms, mobile apps, AI tools and backend systems — from geospatial mobile products to email delivery infrastructure and performance engineering.',
  moreTitle: 'More projects',
}

export const servicesContent = {
  eyebrow: 'Services',
  title: 'How I Can Help Your Business.',
  description:
    'From a single AI integration to a complete product built end to end — engagements shaped around the outcome you need.',
}

export const experienceContent = {
  eyebrow: 'Experience',
  title: '17+ Years of Turning Complex Ideas Into Working Software.',
  paragraphs: [
    "Throughout my career, I've worked across multiple industries, technology stacks, and software architectures.",
    'My experience includes developing business applications, scalable backend systems, mobile platforms, AI integrations, automation tools, and cloud infrastructure.',
    'I focus on delivering software that is reliable, maintainable, secure, and aligned with business objectives.',
  ],
}

export const milestones: Milestone[] = [
  {
    title: 'Full-Stack Development',
    description: 'Complete web applications — frontend, backend and everything that connects them.',
    icon: 'layers',
  },
  {
    title: 'Backend Engineering',
    description: 'APIs, data models, queues and services designed to stay reliable under load.',
    icon: 'server',
  },
  {
    title: 'Mobile Applications',
    description: 'Cross-platform and native Android apps wired to production backends.',
    icon: 'smartphone',
  },
  {
    title: 'AI Integrations',
    description: 'LLMs, agents, retrieval and vector search embedded into real workflows.',
    icon: 'brain',
  },
  {
    title: 'Business Automation',
    description: 'Workflows, bots and background processing that remove repetitive work.',
    icon: 'workflow',
  },
  {
    title: 'API Integrations',
    description: 'Third-party services, messaging platforms, webhooks and reliable data exchange.',
    icon: 'plug',
  },
  {
    title: 'Cloud Infrastructure',
    description: 'Containerised deployments, CI/CD pipelines and Linux server management.',
    icon: 'cloud',
  },
  {
    title: 'Performance Optimization',
    description: 'Finding bottlenecks and making slow systems fast — like a p95 drop from 2.4 s to 180 ms.',
    icon: 'gauge',
  },
]

export const processContent = {
  eyebrow: 'Process',
  title: 'From Business Idea to Production.',
  description: 'A clear, four-stage process that keeps scope, architecture and delivery aligned with your goals.',
}

export const processSteps: ProcessStep[] = [
  {
    step: '01',
    title: 'Discovery',
    description: 'Understand business requirements, user needs, technical challenges, and objectives.',
    icon: 'search',
  },
  {
    step: '02',
    title: 'Architecture',
    description: 'Design the system architecture, database, APIs, technology stack, and implementation strategy.',
    icon: 'compass',
  },
  {
    step: '03',
    title: 'Development',
    description:
      'Build the frontend, backend, mobile applications, AI integrations, automation workflows, and tests.',
    icon: 'code',
  },
  {
    step: '04',
    title: 'Delivery',
    description: 'Deploy, validate, optimize, document, and deliver the completed solution.',
    icon: 'rocket',
  },
]

export const footerContent = {
  tagline: 'Mobile Apps | AI Integration | Automation',
  message: 'Building intelligent digital experiences with passion.',
}

/** Full-screen intro shown on each page load (the name itself comes from `profile.name`). */
export const introContent = {
  roles: ['AI Full-Stack Developer', 'Mobile Apps · Automation'],
  skipLabel: 'Skip intro',
}
