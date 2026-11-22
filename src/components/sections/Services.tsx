import { servicesContent } from '@/data/content'
import { services } from '@/data/services'
import { Container } from '@/components/layout/Container'
import { AnimatedSection, Stagger, StaggerItem } from '@/components/ui/AnimatedSection'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ServiceCard } from '@/components/ui/ServiceCard'

export function Services() {
  return (
    <AnimatedSection id="services" labelledBy="services-title">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-line-strong to-transparent" />
      <Container>
        <SectionHeading
          id="services-title"
          eyebrow={servicesContent.eyebrow}
          title={servicesContent.title}
          description={servicesContent.description}
          descriptionOneLine="lg"
        />
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
