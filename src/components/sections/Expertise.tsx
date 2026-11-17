import { expertiseContent } from '@/data/content'
import { skillCategories } from '@/data/skills'
import { Container } from '@/components/layout/Container'
import { AnimatedSection, Stagger, StaggerItem } from '@/components/ui/AnimatedSection'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { SkillCard } from '@/components/ui/SkillCard'

export function Expertise() {
  return (
    <AnimatedSection id="expertise" labelledBy="expertise-title" className="bg-surface/30">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-line-strong to-transparent" />
      <Container>
        <SectionHeading
          id="expertise-title"
          eyebrow={expertiseContent.eyebrow}
          title={expertiseContent.title}
          description={expertiseContent.description}
        />
        <Stagger as="ul" className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 xl:gap-5">
          {skillCategories.map((category, index) => (
            <StaggerItem as="li" key={category.id}>
              <SkillCard category={category} index={index} />
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </AnimatedSection>
  )
}
