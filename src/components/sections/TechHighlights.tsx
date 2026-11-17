import { BrainCircuit, Cloud } from 'lucide-react'
import { coreTechnologies } from '@/data/skills'
import { getBrandKey } from '@/lib/tech'
import { Container } from '@/components/layout/Container'
import { BrandIcon } from '@/components/ui/BrandIcon'
import { Stagger, StaggerItem } from '@/components/ui/AnimatedSection'

/** Technologies without a Simple Icons glyph get a neutral Lucide stand-in. */
const fallbackIcons: Record<string, typeof Cloud> = {
  OpenAI: BrainCircuit,
  AWS: Cloud,
}

export function TechHighlights() {
  return (
    <section aria-labelledby="tech-title" className="relative border-y border-line bg-surface/50">
      <Container className="py-10 sm:py-12">
        <h2
          id="tech-title"
          className="text-center font-mono text-[0.7rem] font-medium tracking-[0.2em] text-fg-subtle uppercase"
        >
          Core technologies I build with
        </h2>
        <Stagger
          as="ul"
          stagger={0.04}
          className="mt-8 grid grid-cols-2 gap-x-4 gap-y-6 min-[480px]:grid-cols-3 md:grid-cols-5 xl:flex xl:items-center xl:justify-between"
        >
          {coreTechnologies.map((tech) => {
            const brand = getBrandKey(tech)
            const Fallback = fallbackIcons[tech]
            return (
              <StaggerItem
                as="li"
                key={tech}
                className="flex items-center justify-center gap-2.5 text-fg-muted transition-colors duration-200 hover:text-fg"
              >
                {brand ? (
                  <BrandIcon name={brand} className="size-5 shrink-0" />
                ) : Fallback ? (
                  <Fallback aria-hidden className="size-5 shrink-0" strokeWidth={1.6} />
                ) : null}
                <span className="text-sm font-medium tracking-tight whitespace-nowrap">{tech}</span>
              </StaggerItem>
            )
          })}
        </Stagger>
      </Container>
    </section>
  )
}
