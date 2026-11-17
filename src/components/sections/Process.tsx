import { m } from 'framer-motion'
import { processContent, processSteps } from '@/data/content'
import { icons } from '@/lib/icons'
import { easeOutExpo, viewportOnce } from '@/lib/motion'
import { Container } from '@/components/layout/Container'
import { AnimatedSection, Stagger, StaggerItem } from '@/components/ui/AnimatedSection'
import { SectionHeading } from '@/components/ui/SectionHeading'

export function Process() {
  return (
    <AnimatedSection id="process" labelledBy="process-title" className="bg-surface/30">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-line-strong to-transparent" />
      <Container>
        <SectionHeading
          id="process-title"
          eyebrow={processContent.eyebrow}
          title={processContent.title}
          description={processContent.description}
          align="center"
        />

        <div className="relative mt-16 lg:mt-20">
          {/* Horizontal timeline rail (desktop) */}
          <div aria-hidden className="absolute top-7 right-[12.5%] left-[12.5%] hidden h-px bg-line lg:block">
            <m.div
              className="h-full origin-left bg-linear-to-r from-accent via-accent-2 to-accent-soft"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={viewportOnce}
              transition={{ duration: 1.6, ease: easeOutExpo, delay: 0.2 }}
            />
          </div>
          {/* Vertical rail (mobile / tablet) */}
          <div aria-hidden className="absolute top-2 bottom-2 left-7 w-px bg-linear-to-b from-accent via-accent-2/60 to-transparent lg:hidden" />

          <Stagger as="ol" stagger={0.14} className="relative grid grid-cols-1 gap-10 lg:grid-cols-4 lg:gap-6">
            {processSteps.map((step) => {
              const Icon = icons[step.icon]
              return (
                <StaggerItem as="li" key={step.step} className="relative flex gap-6 lg:flex-col lg:items-center lg:text-center">
                  <div className="relative z-10 grid size-14 shrink-0 place-items-center rounded-2xl border border-line-strong bg-elevated card-highlight">
                    <Icon aria-hidden className="size-5 text-accent-soft" strokeWidth={1.75} />
                    <span className="absolute -top-2 -right-2 rounded-md border border-line bg-canvas px-1.5 py-0.5 font-mono text-[0.6rem] text-fg-muted">
                      {step.step}
                    </span>
                  </div>
                  <div className="pt-1 lg:mt-7 lg:pt-0">
                    <h3 className="text-lg font-semibold tracking-tight text-fg">
                      <span className="sr-only">Step {step.step}: </span>
                      {step.title}
                    </h3>
                    <p className="mt-2 max-w-xs text-sm leading-relaxed text-fg-muted lg:mx-auto">{step.description}</p>
                  </div>
                </StaggerItem>
              )
            })}
          </Stagger>
        </div>
      </Container>
    </AnimatedSection>
  )
}
