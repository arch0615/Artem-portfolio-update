import { Link } from 'react-router'
import { ArrowRight, ArrowUpRight, Check } from 'lucide-react'
import type { Project } from '@/types'
import { cn } from '@/lib/cn'
import { areProjectLinksAllowed } from '@/data/contact'
import { ProjectVisual } from '@/components/visuals/ProjectVisual'
import { ButtonLink } from './Button'
import { SpotlightCard } from './SpotlightCard'
import { TechChip } from './TechChip'

const FEATURED_FEATURE_LIMIT = 6

interface FeaturedProjectCardProps {
  project: Project
  index: number
  reversed?: boolean
}

/** Large card for projects with a full case study. */
export function FeaturedProjectCard({ project, index, reversed = false }: FeaturedProjectCardProps) {
  const href = `/projects/${project.slug}`
  const stack = [...project.technologies, ...(project.integrations ?? [])]
  const features = project.features.slice(0, FEATURED_FEATURE_LIMIT)
  const extraFeatures = project.features.length - features.length

  return (
    <SpotlightCard className="group overflow-hidden">
      <article className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <Link
          to={href}
          tabIndex={-1}
          aria-hidden
          className={cn(
            'relative block overflow-hidden border-b border-line lg:border-b-0',
            reversed ? 'lg:order-2 lg:border-l' : 'lg:border-r',
          )}
        >
          <ProjectVisual
            project={project}
            className="transition-transform duration-700 ease-out group-hover:scale-[1.025] lg:aspect-auto lg:h-full"
          />
        </Link>

        <div className="flex flex-col p-6 sm:p-8 lg:p-10">
          <p className="font-mono text-[0.68rem] tracking-[0.16em] text-fg-subtle uppercase">
            <span className="text-accent-soft">{String(index + 1).padStart(2, '0')}</span>
            <span aria-hidden className="mx-2">/</span>
            {project.category}
          </p>
          <h3 className="mt-3 text-2xl font-semibold tracking-tight text-fg sm:text-[1.75rem]">
            <Link to={href} className="transition-colors hover:text-white">
              {project.name}
            </Link>
          </h3>
          <p className="mt-3 leading-relaxed text-fg-muted">{project.description}</p>

          {project.metric && (
            <div className="mt-6 flex items-center gap-4 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.06] px-4 py-3">
              <span className="text-2xl font-semibold tracking-tight text-emerald-300">{project.metric.value}</span>
              <span className="text-xs leading-snug text-fg-muted">
                {project.metric.label}
                {project.metric.detail && <span className="block text-fg-subtle">{project.metric.detail}</span>}
              </span>
            </div>
          )}

          <div className="mt-6">
            <h4 className="font-mono text-[0.65rem] tracking-[0.18em] text-fg-subtle uppercase">Key features</h4>
            <ul className="mt-3 grid gap-x-5 gap-y-2 sm:grid-cols-2">
              {features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm text-fg-muted">
                  <Check aria-hidden className="mt-0.5 size-3.5 shrink-0 text-accent-soft" strokeWidth={2.25} />
                  {feature}
                </li>
              ))}
            </ul>
            {extraFeatures > 0 && (
              <p className="mt-2 text-xs text-fg-subtle">+ {extraFeatures} more in the case study</p>
            )}
          </div>

          {project.contribution && (
            <div className="mt-6 border-l-2 border-accent/40 pl-4">
              <h4 className="font-mono text-[0.65rem] tracking-[0.18em] text-fg-subtle uppercase">My contribution</h4>
              <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">{project.contribution}</p>
            </div>
          )}

          <ul className="mt-6 flex flex-wrap gap-1.5" aria-label="Technologies">
            {stack.map((tech) => (
              <li key={tech}>
                <TechChip label={tech} />
              </li>
            ))}
          </ul>

          <div className="mt-8 pt-1 lg:mt-auto lg:pt-8">
            <ButtonLink to={href} variant="secondary" aria-label={`Read the ${project.name} case study`}>
              Read case study
              <ArrowRight aria-hidden className="size-4 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
            </ButtonLink>
          </div>
        </div>
      </article>
    </SpotlightCard>
  )
}

interface ProjectCardProps {
  project: Project
  className?: string
  /** Lay the card out horizontally on tablet widths (used when it spans a full row). */
  wideOnTablet?: boolean
}

/** Compact card for additional projects. */
export function ProjectCard({ project, className, wideOnTablet = false }: ProjectCardProps) {
  return (
    <SpotlightCard className={cn('group h-full overflow-hidden', className)}>
      <article className={cn('flex h-full flex-col', wideOnTablet && 'md:max-xl:grid md:max-xl:grid-cols-2')}>
        <div
          className={cn(
            'overflow-hidden border-b border-line',
            wideOnTablet && 'md:max-xl:border-r md:max-xl:border-b-0',
          )}
        >
          <ProjectVisual
            project={project}
            className={cn(
              'transition-transform duration-700 ease-out group-hover:scale-[1.03]',
              wideOnTablet && 'md:max-xl:aspect-auto md:max-xl:h-full',
            )}
          />
        </div>

        <div className="flex flex-1 flex-col p-6">
          <p className="font-mono text-[0.65rem] tracking-[0.16em] text-fg-subtle uppercase">{project.category}</p>
          <h3 className="mt-2.5 text-xl font-semibold tracking-tight text-fg">{project.name}</h3>
          <p className="mt-2 text-sm leading-relaxed text-fg-muted">{project.description}</p>

          {project.features.length > 0 && (
            <ul className="mt-5 grid gap-x-4 gap-y-1.5 sm:grid-cols-2" aria-label="Features">
              {project.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-[0.8rem] text-fg-muted">
                  <Check aria-hidden className="mt-0.5 size-3.5 shrink-0 text-accent-soft" strokeWidth={2.25} />
                  {feature}
                </li>
              ))}
            </ul>
          )}

          {project.contribution && (
            <p className="mt-5 text-[0.8rem] leading-relaxed text-fg-muted">
              <span className="font-medium text-fg">My contribution: </span>
              {project.contribution}
            </p>
          )}

          {project.technologies.length > 0 && (
            <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Technologies">
              {project.technologies.map((tech) => (
                <li key={tech}>
                  <TechChip label={tech} />
                </li>
              ))}
            </ul>
          )}

          {areProjectLinksAllowed() && project.links && project.links.length > 0 && (
            <ul className="mt-auto space-y-1 pt-6" aria-label={`${project.name} links`}>
              {project.links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/link -mx-2 flex items-center justify-between gap-3 rounded-lg px-2 py-1.5 text-sm text-fg-muted transition-colors hover:bg-white/[0.04] hover:text-fg"
                  >
                    <span className="min-w-0 truncate font-mono text-[0.8rem]">{link.label}</span>
                    <span className="flex shrink-0 items-center gap-1 text-xs text-fg-subtle group-hover/link:text-fg">
                      Visit
                      <ArrowUpRight
                        aria-hidden
                        className="size-3.5 transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                      />
                    </span>
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </article>
    </SpotlightCard>
  )
}
