import { experienceContent, milestones } from '@/data/content'
import { profile } from '@/data/profile'
import { Container } from '@/components/layout/Container'
import { AnimatedSection, Reveal, Stagger, StaggerItem } from '@/components/ui/AnimatedSection'
import { IconBadge } from '@/components/ui/IconBadge'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { SpotlightCard } from '@/components/ui/SpotlightCard'

export function Experience() {
  return (
    <AnimatedSection id="experience" labelledBy="experience-title">
      <Container className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <SectionHeading id="experience-title" eyebrow={experienceContent.eyebrow} title={experienceContent.title} />
            <Reveal className="mt-7 space-y-4 text-base leading-relaxed text-fg-muted">
              {experienceContent.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </Reveal>
            <Reveal delay={0.1} className="mt-10 flex items-center gap-5 border-t border-line pt-8">
              <p className="text-7xl leading-none font-semibold tracking-[-0.05em] text-gradient">
                {profile.experienceYears}+
              </p>
              <p className="text-sm leading-relaxed text-fg-muted">
                years across industries,
                <br />
                stacks and architectures
              </p>
            </Reveal>
          </div>
        </div>

        <div className="lg:col-span-7">
          <Reveal>
            <p className="font-mono text-[0.7rem] tracking-[0.2em] text-fg-subtle uppercase">Areas of expertise</p>
          </Reveal>
          <Stagger as="ul" stagger={0.06} className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {milestones.map((milestone, index) => (
              <StaggerItem as="li" key={milestone.title}>
                <SpotlightCard className="group flex h-full flex-col p-5 sm:p-6">
                  <div className="flex items-center justify-between">
                    <IconBadge icon={milestone.icon} size="sm" />
                    <span className="font-mono text-[0.68rem] text-fg-subtle">{String(index + 1).padStart(2, '0')}</span>
                  </div>
                  <h3 className="mt-5 font-semibold tracking-tight text-fg">{milestone.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">{milestone.description}</p>
                </SpotlightCard>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </Container>
    </AnimatedSection>
  )
}
