import { projectsContent } from '@/data/content'
import { featuredProjects, otherProjects } from '@/data/projects'
import { cn } from '@/lib/cn'
import { Container } from '@/components/layout/Container'
import { AnimatedSection, Reveal, Stagger, StaggerItem } from '@/components/ui/AnimatedSection'
import { FeaturedProjectCard, ProjectCard } from '@/components/ui/ProjectCard'
import { SectionHeading } from '@/components/ui/SectionHeading'

/** Column spans for the "more projects" bento grid on wide screens (3 + 3, then 2 + 2 + 2). */
const wideSpans = ['xl:col-span-3', 'xl:col-span-3', 'xl:col-span-2', 'xl:col-span-2', 'xl:col-span-2']

export function Projects() {
  // On tablets (2 columns) an odd count leaves a gap, so the first card spans the full row.
  const firstSpansTablet = otherProjects.length % 2 === 1

  return (
    <AnimatedSection id="projects" labelledBy="projects-title">
      <Container>
        <SectionHeading
          id="projects-title"
          eyebrow={projectsContent.eyebrow}
          title={projectsContent.title}
          description={projectsContent.description}
          descriptionOneLine="xl"
        />

        <div className="mt-14 space-y-6 lg:space-y-8">
          {featuredProjects.map((project, index) => (
            <Reveal key={project.slug}>
              <FeaturedProjectCard project={project} index={index} reversed={index % 2 === 1} />
            </Reveal>
          ))}
        </div>

        <div className="mt-20 lg:mt-24">
          <Reveal className="flex items-center gap-4">
            <h3 className="font-mono text-[0.7rem] font-medium tracking-[0.2em] text-fg-muted uppercase">
              {projectsContent.moreTitle}
            </h3>
            <span aria-hidden className="h-px flex-1 bg-line" />
          </Reveal>

          <Stagger as="ul" className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-6">
            {otherProjects.map((project, index) => {
              const spanTablet = firstSpansTablet && index === 0
              return (
                <StaggerItem
                  as="li"
                  key={project.slug}
                  className={cn(wideSpans[index] ?? 'xl:col-span-2', spanTablet && 'md:col-span-2')}
                >
                  <ProjectCard project={project} wideOnTablet={spanTablet} />
                </StaggerItem>
              )
            })}
          </Stagger>
        </div>
      </Container>
    </AnimatedSection>
  )
}
