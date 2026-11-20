import { skillsContent } from '@/data/content'
import { Container } from '@/components/layout/Container'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { SkillsShowcase } from './SkillsShowcase'

/** Skills: six skill areas, each shown through the technologies and real projects behind it. */
export function Skills() {
  return (
    <AnimatedSection id="skills" labelledBy="skills-title" className="overflow-x-clip">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-line-strong to-transparent" />
      <Container>
        <SectionHeading
          id="skills-title"
          eyebrow={skillsContent.eyebrow}
          title={skillsContent.title}
          description={skillsContent.description}
          // Desktop: the description runs on one line. From 1280px its size eases down just enough to fit
          // the narrower desktops; between 1024 and 1280px it splits into two even lines.
          className="lg:max-w-none"
          descriptionClassName="lg:text-balance xl:text-[length:min(1.125rem,calc((100vw_-_6rem)/70))]"
        />
        <SkillsShowcase className="mt-12 lg:mt-14" />
      </Container>
    </AnimatedSection>
  )
}
