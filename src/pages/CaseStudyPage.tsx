import type { ReactNode } from 'react'
import { Link, useParams } from 'react-router'
import { ArrowLeft, ArrowRight, Check, CircleCheck } from 'lucide-react'
import type { CaseStudy, Project } from '@/types'
import { getCaseStudy } from '@/data/case-studies'
import { featuredProjects, getProject } from '@/data/projects'
import { profile } from '@/data/profile'
import { useActiveSection } from '@/hooks/useActiveSection'
import { usePageMeta } from '@/hooks/usePageMeta'
import { accentStyle } from '@/lib/accent'
import { cn } from '@/lib/cn'
import { Container } from '@/components/layout/Container'
import { ArchitectureDiagram } from '@/components/case-study/ArchitectureDiagram'
import { Reveal, Stagger, StaggerItem } from '@/components/ui/AnimatedSection'
import { SpotlightCard } from '@/components/ui/SpotlightCard'
import { TechChip } from '@/components/ui/TechChip'
import { ProjectSiteLinks } from '@/components/ui/ProjectSiteLinks'
import { ProjectVisual } from '@/components/visuals/ProjectVisual'
import NotFoundPage from './NotFoundPage'

const sections = [
  { id: 'cs-overview', label: 'Overview' },
  { id: 'cs-problem', label: 'Business problem' },
  { id: 'cs-challenge', label: 'Technical challenge' },
  { id: 'cs-architecture', label: 'Architecture' },
  { id: 'cs-stack', label: 'Technology stack' },
  { id: 'cs-implementation', label: 'Implementation' },
  { id: 'cs-features', label: 'Key features' },
  { id: 'cs-decisions', label: 'Engineering decisions' },
  { id: 'cs-results', label: 'Results' },
] as const

const sectionIds = sections.map((s) => s.id)
const caseStudyProjects = featuredProjects.filter((p) => getCaseStudy(p.slug))

export default function CaseStudyPage() {
  const { slug = '' } = useParams()
  const project = getProject(slug)
  const study = getCaseStudy(slug)
  if (!project || !study) return <NotFoundPage />
  return <CaseStudyView key={slug} project={project} study={study} />
}

function CaseStudyView({ project, study }: { project: Project; study: CaseStudy }) {
  usePageMeta({
    title: `${project.name} — Case Study | ${profile.name}`,
    description: study.seoDescription,
    path: `/projects/${project.slug}`,
  })
  const active = useActiveSection(sectionIds)

  const position = caseStudyProjects.findIndex((p) => p.slug === project.slug)
  const previous = caseStudyProjects[(position - 1 + caseStudyProjects.length) % caseStudyProjects.length]
  const next = caseStudyProjects[(position + 1) % caseStudyProjects.length]
  const coreStack = [...project.technologies, ...(project.integrations ?? [])].slice(0, 6)

  return (
    <article style={accentStyle(project.accent)}>
      {/* Header */}
      <header className="relative isolate overflow-hidden pt-28 sm:pt-32">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="bg-grid absolute inset-0 mask-radial opacity-60" />
          <div className="absolute -top-40 left-1/2 h-[30rem] w-[56rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(var(--accent)/0.18),transparent)]" />
        </div>

        <Container>
          <Reveal>
            <Link
              to="/#projects"
              className="group inline-flex items-center gap-2 rounded-full text-sm text-fg-muted transition-colors hover:text-fg"
            >
              <ArrowLeft aria-hidden className="size-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
              All projects
            </Link>
          </Reveal>

          <Reveal delay={0.05} className="mt-10 max-w-4xl">
            <p className="font-mono text-[0.7rem] tracking-[0.18em] text-accent-soft uppercase">
              Case study · {project.category}
            </p>
            <h1 className="mt-4 text-[clamp(2.4rem,6vw,4.25rem)] leading-[1.03] font-semibold tracking-[-0.04em] text-fg">
              {project.name}
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-fg-muted sm:text-xl">{project.description}</p>
            <ProjectSiteLinks project={project} className="mt-4" />
          </Reveal>

          <Reveal delay={0.1}>
            <dl className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3">
              <MetaItem label="My role">{study.role}</MetaItem>
              <MetaItem label="Category">{project.category}</MetaItem>
              <MetaItem label="Core stack">{coreStack.join(' · ')}</MetaItem>
            </dl>
          </Reveal>

          <Reveal delay={0.15} className="mt-8 sm:mt-10">
            <div className="relative overflow-hidden rounded-3xl border border-line bg-[#0d0d11] p-3 sm:p-8 lg:p-12">
              <div aria-hidden className="bg-grid-sm absolute inset-0 opacity-70" />
              <div
                aria-hidden
                className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgb(var(--accent)/0.18),transparent_70%)]"
              />
              <ProjectVisual
                project={project}
                className="relative mx-auto max-w-3xl rounded-xl border border-line shadow-2xl shadow-black/60 sm:rounded-2xl"
              />
            </div>
          </Reveal>
        </Container>
      </header>

      {/* Body */}
      <Container className="grid grid-cols-1 gap-12 py-20 sm:py-24 lg:grid-cols-[12.5rem_minmax(0,1fr)] lg:gap-16">
        <aside className="hidden lg:block">
          <nav aria-label="Case study sections" className="sticky top-28">
            <p className="font-mono text-[0.65rem] tracking-[0.2em] text-fg-subtle uppercase">On this page</p>
            <ul className="mt-4 space-y-0.5 border-l border-line">
              {sections.map((section) => {
                const isActive = active === section.id
                return (
                  <li key={section.id}>
                    <Link
                      to={`#${section.id}`}
                      aria-current={isActive ? 'location' : undefined}
                      className={cn(
                        '-ml-px block border-l py-1.5 pl-4 text-sm transition-colors duration-200',
                        isActive
                          ? 'border-accent-soft text-fg'
                          : 'border-transparent text-fg-subtle hover:border-line-strong hover:text-fg-muted',
                      )}
                    >
                      {section.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
        </aside>

        <div className="max-w-3xl min-w-0 space-y-20 sm:space-y-24">
          <CaseSection id="cs-overview" index={1} title="Overview">
            <p className="text-lg leading-relaxed text-fg-muted">{study.overview}</p>
          </CaseSection>

          <CaseSection id="cs-problem" index={2} title="Business problem">
            <p className="border-l-2 border-[rgb(var(--accent)/0.6)] pl-5 text-xl leading-relaxed font-medium tracking-tight text-fg sm:text-2xl">
              {study.problem}
            </p>
          </CaseSection>

          <CaseSection id="cs-challenge" index={3} title="Technical challenge">
            <Stagger as="ul" className="grid gap-4 sm:grid-cols-2">
              {study.challenges.map((challenge, i) => (
                <StaggerItem as="li" key={challenge.title}>
                  <SpotlightCard className="h-full p-5 sm:p-6">
                    <span className="font-mono text-xs text-accent-soft">{String(i + 1).padStart(2, '0')}</span>
                    <h3 className="mt-3 font-semibold tracking-tight text-fg">{challenge.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">{challenge.description}</p>
                  </SpotlightCard>
                </StaggerItem>
              ))}
            </Stagger>
          </CaseSection>

          <CaseSection id="cs-architecture" index={4} title="Architecture">
            <ArchitectureDiagram architecture={study.architecture} />
          </CaseSection>

          <CaseSection id="cs-stack" index={5} title="Technology stack">
            <dl className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-elevated/50">
              {study.stack.map((group) => (
                <div key={group.group} className="grid gap-3 p-5 sm:grid-cols-[11rem_1fr] sm:items-center sm:gap-6">
                  <dt className="text-sm font-medium text-fg">{group.group}</dt>
                  <dd>
                    <ul className="flex flex-wrap gap-1.5">
                      {group.items.map((item) => (
                        <li key={item}>
                          <TechChip label={item} size="md" />
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
              ))}
            </dl>
          </CaseSection>

          <CaseSection id="cs-implementation" index={6} title="Implementation">
            <Stagger as="ol" className="relative space-y-8">
              <span aria-hidden className="absolute top-2 bottom-2 left-[1.15rem] w-px bg-linear-to-b from-[rgb(var(--accent)/0.6)] via-line to-transparent" />
              {study.implementation.map((step, i) => (
                <StaggerItem as="li" key={step.title} className="relative flex gap-5">
                  <span className="relative z-10 grid size-9 shrink-0 place-items-center rounded-xl border border-line-strong bg-elevated font-mono text-xs text-fg">
                    {i + 1}
                  </span>
                  <div className="pt-1.5">
                    <h3 className="font-semibold tracking-tight text-fg">{step.title}</h3>
                    <p className="mt-1.5 leading-relaxed text-fg-muted">{step.description}</p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </CaseSection>

          <CaseSection id="cs-features" index={7} title="Key features">
            <ul className="grid gap-3 sm:grid-cols-2">
              {project.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-3 rounded-xl border border-line bg-elevated/50 px-4 py-3 text-sm text-fg"
                >
                  <span className="grid size-6 shrink-0 place-items-center rounded-md bg-[rgb(var(--accent)/0.14)] text-[rgb(var(--accent))]">
                    <Check aria-hidden className="size-3.5" strokeWidth={2.5} />
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
          </CaseSection>

          <CaseSection id="cs-decisions" index={8} title="Engineering decisions">
            <Stagger as="ul" className="grid gap-4 sm:grid-cols-2">
              {study.decisions.map((decision) => (
                <StaggerItem as="li" key={decision.title}>
                  <SpotlightCard className="h-full p-5 sm:p-6">
                    <h3 className="font-semibold tracking-tight text-fg">{decision.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-fg-muted">{decision.description}</p>
                  </SpotlightCard>
                </StaggerItem>
              ))}
            </Stagger>
          </CaseSection>

          <CaseSection id="cs-results" index={9} title="Results">
            <div className="relative overflow-hidden rounded-2xl border border-[rgb(var(--accent)/0.3)] bg-linear-to-br from-[rgb(var(--accent)/0.1)] to-transparent p-6 sm:p-8">
              <p className="text-xl leading-relaxed font-medium tracking-tight text-fg sm:text-2xl">
                {study.results.summary}
              </p>
              {study.results.metrics && (
                <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-4">
                  {study.results.metrics.map((metric) => (
                    <div key={metric.label} className="bg-canvas/80 p-4">
                      <dt className="text-xs text-fg-subtle">{metric.label}</dt>
                      <dd className="mt-1 text-2xl font-semibold tracking-tight text-[rgb(var(--accent))]">
                        {metric.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              )}
              <ul className="mt-8 space-y-3">
                {study.results.points.map((point) => (
                  <li key={point} className="flex items-start gap-3 text-fg-muted">
                    <CircleCheck aria-hidden className="mt-0.5 size-5 shrink-0 text-[rgb(var(--accent))]" strokeWidth={1.75} />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </CaseSection>
        </div>
      </Container>

      {/* Navigation between case studies */}
      <Container className="pb-24 sm:pb-32">
        <nav aria-label="More case studies" className="grid gap-4 border-t border-line pt-12 sm:grid-cols-2">
          <CaseLink project={previous} direction="previous" />
          <CaseLink project={next} direction="next" />
        </nav>
      </Container>
    </article>
  )
}

function MetaItem({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="bg-canvas/90 p-5">
      <dt className="font-mono text-[0.65rem] tracking-[0.18em] text-fg-subtle uppercase">{label}</dt>
      <dd className="mt-2 text-sm leading-relaxed text-fg">{children}</dd>
    </div>
  )
}

function CaseSection({ id, index, title, children }: { id: string; index: number; title: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-28">
      <Reveal>
        <p className="font-mono text-xs text-[rgb(var(--accent))]">{String(index).padStart(2, '0')}</p>
        <h2 id={`${id}-title`} className="mt-2 text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
          {title}
        </h2>
      </Reveal>
      <div className="mt-7">{children}</div>
    </section>
  )
}

function CaseLink({ project, direction }: { project: Project; direction: 'previous' | 'next' }) {
  const isNext = direction === 'next'
  return (
    <Link
      to={`/projects/${project.slug}`}
      className={cn(
        'group flex flex-col rounded-2xl border border-line bg-elevated/50 p-5 transition-colors hover:border-line-strong hover:bg-elevated sm:p-6',
        isNext && 'sm:items-end sm:text-right',
      )}
    >
      <span className="flex items-center gap-2 font-mono text-[0.65rem] tracking-[0.18em] text-fg-subtle uppercase">
        {!isNext && <ArrowLeft aria-hidden className="size-3.5 transition-transform group-hover:-translate-x-0.5" />}
        {isNext ? 'Next case study' : 'Previous case study'}
        {isNext && <ArrowRight aria-hidden className="size-3.5 transition-transform group-hover:translate-x-0.5" />}
      </span>
      <span className="mt-3 text-lg font-semibold tracking-tight text-fg">{project.name}</span>
      <span className="mt-1 text-sm text-fg-muted">{project.category}</span>
    </Link>
  )
}
