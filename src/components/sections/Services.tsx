import { ArrowRight } from 'lucide-react'
import { servicesContent } from '@/data/content'
import { services } from '@/data/services'
import { Container } from '@/components/layout/Container'
import { AnimatedSection, Reveal, Stagger, StaggerItem } from '@/components/ui/AnimatedSection'
import { ButtonLink } from '@/components/ui/Button'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ServiceCard } from '@/components/ui/ServiceCard'

export function Services() {
  return (
    <AnimatedSection id="services" labelledBy="services-title" className="bg-surface/30">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-line-strong to-transparent" />
      <Container>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            id="services-title"
            eyebrow={servicesContent.eyebrow}
            title={servicesContent.title}
            description={servicesContent.description}
          />
          <Reveal className="shrink-0">
            <ButtonLink to="/#contact" variant="secondary">
              Discuss your project
              <ArrowRight aria-hidden className="size-4 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
            </ButtonLink>
          </Reveal>
        </div>
        <Stagger as="ul" className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 xl:gap-5">
          {services.map((service, index) => (
            <StaggerItem as="li" key={service.id}>
              <ServiceCard service={service} index={index} />
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </AnimatedSection>
  )
}
