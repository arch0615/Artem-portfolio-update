import { ArrowUpRight } from 'lucide-react'
import type { Project } from '@/types'
import { cn } from '@/lib/cn'
import { showProjectLinks } from '@/data/projects'

interface ProjectSiteLinksProps {
  project: Pick<Project, 'name' | 'links'>
  className?: string
}

/**
 * "Visit swan.io ↗": text links to a project's live site, opening in a new tab. Plain links rather than
 * buttons (buttons only lead within the portfolio). Hidden when `showProjectLinks` is off.
 */
export function ProjectSiteLinks({ project, className }: ProjectSiteLinksProps) {
  if (!showProjectLinks || !project.links?.length) return null
  return (
    <ul className={cn('flex flex-wrap items-center gap-x-5 gap-y-2', className)} aria-label={`${project.name} links`}>
      {project.links.map((link) => (
        <li key={link.href}>
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group/link inline-flex items-center gap-1.5 rounded-md py-1 text-sm text-fg-muted transition-colors hover:text-fg"
          >
            {/* Real spaces between the parts, so screen readers say "Visit swan.io (opens in a new tab)". */}
            Visit <span className="font-mono text-[0.8rem] text-fg">{link.label}</span>{' '}
            <ArrowUpRight
              aria-hidden
              className="size-3.5 transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
            />{' '}
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </li>
      ))}
    </ul>
  )
}
