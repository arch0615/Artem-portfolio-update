import { experienceContent } from '@/data/content'
import { positions } from '@/data/experience'
import { monthIndex } from '@/lib/months'
import { Container } from '@/components/layout/Container'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ExperienceEntry } from '@/components/experience/ExperienceEntry'

/** Newest position first. */
const timeline = [...positions].sort((a, b) => monthIndex(b.start) - monthIndex(a.start))

/** Experience: the work history as a vertical timeline. Content: `src/data/experience.ts`. */
export function Experience() {
  return (
    <AnimatedSection id="experience" labelledBy="experience-title">
      <Container>
        <SectionHeading
          id="experience-title"
          eyebrow={experienceContent.eyebrow}
          title={experienceContent.title}
          description={experienceContent.description}
        />
        <ol aria-label={experienceContent.timelineLabel} className="mt-12 grid gap-6 sm:gap-8 lg:mt-16">
          {timeline.map((position, index) => (
            <ExperienceEntry key={position.id} position={position} last={index === timeline.length - 1} />
          ))}
        </ol>
      </Container>
    </AnimatedSection>
  )
}
