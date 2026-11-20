import type { MonoLogoKey, MulticolorLogoKey } from '../lib/tech-logos'
import type { IconName, SkillCategory, TechnologyIcon } from '../types'

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

// Icon helpers: `mono` fills a single-colour mark, `multicolor` keeps the official artwork,
// `generic` is a Lucide icon for capabilities without a logo. Logo keys: `src/lib/tech-logos.ts`.
const mono = (logo: MonoLogoKey, color: string): TechnologyIcon => ({ type: 'mono', logo, color })
const multicolor = (logo: MulticolorLogoKey, color: string): TechnologyIcon => ({ type: 'multicolor', logo, color })
const generic = (icon: IconName): TechnologyIcon => ({ type: 'generic', icon })

/** Marks that are black in their brand colours use the brand's official white variant on the dark theme. */
const WHITE = '#FFFFFF'

/**
 * Skill categories in the Skills section, in display order (the first is selected by default).
 * Colours are the official brand colours.
 */
export const skillCategories: SkillCategory[] = [
  {
    id: 'fullstack',
    title: 'Full-Stack Development',
    icon: 'code',
    technologies: [
      { name: 'React', icon: mono('react', '#61DAFB') },
      { name: 'Next.js', icon: mono('nextjs', WHITE) },
      { name: 'TypeScript', icon: multicolor('typescript', '#3178C6') },
      { name: 'JavaScript', icon: multicolor('javascript', '#F7DF1E') },
      { name: 'Node.js', icon: mono('nodejs', '#5FA04E') },
      { name: 'Python', icon: multicolor('python', '#3776AB') },
      { name: 'FastAPI', icon: mono('fastapi', '#009688') },
      { name: 'Tailwind CSS', icon: mono('tailwindcss', '#06B6D4') },
      { name: 'PHP', icon: multicolor('php', '#777BB4') },
      { name: 'C# / .NET', icon: multicolor('dotnet', '#512BD4') },
    ],
  },
  {
    id: 'mobile',
    title: 'Mobile Development',
    icon: 'smartphone',
    technologies: [
      { name: 'React Native', icon: mono('react', '#61DAFB') },
      { name: 'Expo', icon: mono('expo', WHITE) },
      { name: 'Android', icon: mono('android', '#3DDC84') },
      { name: 'Kotlin', icon: multicolor('kotlin', '#7F52FF') },
      { name: 'Java', icon: multicolor('java', '#E76F00') },
      { name: 'Mobile API Integration', icon: generic('plug') },
      { name: 'Push Notifications', icon: generic('bellRing') },
    ],
  },
  {
    id: 'ai',
    title: 'AI & Intelligent Agents',
    icon: 'brain',
    technologies: [
      { name: 'OpenAI', icon: mono('openai', WHITE) },
      { name: 'Claude', icon: mono('claude', '#D97757') },
      { name: 'LLM Integration', icon: generic('brain') },
      { name: 'AI Agents', icon: generic('bot') },
      { name: 'RAG', icon: generic('fileSearch') },
      { name: 'Vector Search', icon: generic('axis3d') },
      // pgvector and CLIP have no official logo.
      { name: 'pgvector', icon: generic('database') },
      { name: 'CLIP', icon: generic('scanEye') },
    ],
  },
  {
    id: 'automation',
    title: 'Automation & Integrations',
    icon: 'workflow',
    technologies: [
      { name: 'n8n', icon: mono('n8n', '#FF91AC') },
      { name: 'Make', icon: multicolor('make', '#6D00CC') },
      { name: 'WhatsApp Business API', icon: multicolor('whatsapp', '#25D366') },
      { name: 'Telegram Bots', icon: multicolor('telegram', '#26A5E4') },
      { name: 'Webhooks', icon: generic('webhook') },
      { name: 'Workflow Automation', icon: generic('workflow') },
      { name: 'Email Automation', icon: generic('mails') },
    ],
  },
  {
    id: 'backend',
    title: 'Backend & Databases',
    icon: 'database',
    technologies: [
      { name: 'Fastify', icon: mono('fastify', WHITE) },
      { name: 'Hono', icon: multicolor('hono', '#E36002') },
      { name: 'PostgreSQL', icon: multicolor('postgresql', '#4169E1') },
      { name: 'MySQL', icon: multicolor('mysql', '#4479A1') },
      { name: 'Redis', icon: mono('redis', '#FF4438') },
      { name: 'Supabase', icon: multicolor('supabase', '#3FCF8E') },
      // PostGIS's logo is not in any of the icon libraries used.
      { name: 'PostGIS', icon: generic('globe') },
      { name: 'Drizzle ORM', icon: mono('drizzle', '#C5F74F') },
      { name: 'Prisma', icon: mono('prisma', WHITE) },
    ],
  },
  {
    id: 'cloud',
    title: 'Cloud & DevOps',
    icon: 'cloud',
    technologies: [
      { name: 'AWS', icon: multicolor('aws', '#FF9900') },
      { name: 'Docker', icon: mono('docker', '#2496ED') },
      { name: 'Terraform', icon: mono('terraform', '#844FBA') },
      { name: 'GitHub Actions', icon: mono('githubactions', '#2088FF') },
      { name: 'Cloudflare', icon: multicolor('cloudflare', '#F38020') },
      { name: 'Vercel', icon: mono('vercel', WHITE) },
      { name: 'Linux', icon: multicolor('linux', '#FCC624') },
      { name: 'Nginx', icon: multicolor('nginx', '#009639') },
      { name: 'CI/CD', icon: generic('infinity') },
    ],
  },
]
