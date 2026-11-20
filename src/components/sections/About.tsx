import { aboutContent } from '@/data/content'
import { profile } from '@/data/profile'
import { icons } from '@/lib/icons'
import { Container } from '@/components/layout/Container'
import { BrandMark } from '@/components/layout/Logo'
import { AnimatedSection, Reveal, Stagger, StaggerItem } from '@/components/ui/AnimatedSection'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { SpotlightCard } from '@/components/ui/SpotlightCard'

export function About() {
  return (
    <AnimatedSection id="about" labelledBy="about-title">
      <Container>
        {/* The title spans the full width above both columns, so it fits on one line on desktop. */}
        <SectionHeading id="about-title" eyebrow={aboutContent.eyebrow} title={aboutContent.title} />

        <div className="mt-8 grid grid-cols-1 gap-14 lg:mt-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <Reveal className="space-y-5 text-base leading-relaxed text-fg-muted sm:text-[1.05rem]">
              {aboutContent.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </Reveal>

            <Reveal delay={0.1}>
              <figure className="relative mt-10 rounded-2xl border border-line bg-linear-to-br from-accent/[0.08] via-transparent to-accent-2/[0.06] p-6 sm:p-7">
                <span
                  aria-hidden
                  className="absolute top-6 bottom-6 left-0 w-px bg-linear-to-b from-accent-soft via-accent-2 to-transparent"
                />
                <blockquote className="text-lg leading-relaxed font-medium tracking-tight text-fg sm:text-xl">
                  “{aboutContent.belief}”
                </blockquote>
                <figcaption className="mt-4 flex items-center gap-3 text-sm text-fg-muted">
                  <BrandMark className="size-7" />
                  {profile.name}
                </figcaption>
              </figure>
            </Reveal>
          </div>

          <Reveal className="lg:col-span-5" delay={0.1}>
            <SpotlightCard className="overflow-hidden lg:sticky lg:top-28">
              <div className="relative border-b border-line p-6 sm:p-7">
                <div aria-hidden className="bg-dots absolute inset-0 mask-radial-center opacity-60" />
                <div className="relative flex items-center gap-4">
                  <BrandMark className="size-14 rounded-2xl [&>span]:rounded-[15px]" />
                  <div>
                    <p className="text-lg font-semibold tracking-tight text-fg">{profile.name}</p>
                    <p className="text-sm text-fg-muted">{profile.headline}</p>
                  </div>
                </div>
                <div className="relative mt-7 flex items-end gap-3">
                  <p className="text-6xl leading-none font-semibold tracking-[-0.05em] text-fg">
                    {profile.experienceYears}
                    <span className="text-gradient-accent">+</span>
                  </p>
                  <p className="pb-1 text-sm leading-snug text-fg-muted">
                    years building
                    <br />
                    software
                  </p>
                </div>
              </div>

              <div className="p-6 sm:p-7">
                <h3 className="font-mono text-[0.7rem] tracking-[0.2em] text-fg-subtle uppercase">At a glance</h3>
                <Stagger as="ul" stagger={0.05} className="mt-5 space-y-3.5">
                  {aboutContent.highlights.map((item) => {
                    const Icon = icons[item.icon]
                    return (
                      <StaggerItem as="li" key={item.label} className="flex items-center gap-3 text-[0.94rem] text-fg">
                        <span className="grid size-8 shrink-0 place-items-center rounded-lg border border-line bg-white/[0.03] text-accent-soft">
                          <Icon aria-hidden className="size-4" strokeWidth={1.75} />
                        </span>
                        {item.label}
                      </StaggerItem>
                    )
                  })}
                </Stagger>
              </div>
            </SpotlightCard>
          </Reveal>
        </div>
      </Container>
    </AnimatedSection>
  )
}
