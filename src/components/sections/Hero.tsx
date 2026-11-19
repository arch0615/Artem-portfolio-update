import { m } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { heroContent } from '@/data/content'
import { heroHighlights, profile } from '@/data/profile'
import { icons } from '@/lib/icons'
import { cn } from '@/lib/cn'
import { easeOutExpo } from '@/lib/motion'
import { useIntroRevealed } from '@/components/intro/intro-context'
import { Container } from '@/components/layout/Container'
import { ButtonLink } from '@/components/ui/Button'
import { HeroFragments } from './HeroFragments'
import { HeroPortrait } from './HeroPortrait'

const hidden = { opacity: 0, y: 18, filter: 'blur(6px)' }
const shown = { opacity: 1, y: 0, filter: 'blur(0px)' }

/** Entrance props; elements hold their hidden state until the intro overlay starts to dissolve. */
const entrance = (play: boolean) => (delay: number) => ({
  initial: hidden,
  animate: play ? shown : hidden,
  transition: { duration: 0.8, delay, ease: easeOutExpo },
})

const lineStyles = ['text-fg', 'text-gradient', 'text-gradient-accent']

export function Hero() {
  const enter = entrance(useIntroRevealed())

  return (
    <section id="home" aria-labelledby="hero-title" className="relative isolate overflow-hidden">
      <HeroBackground />

      {/*
        Layout: one column below lg (portrait after the text). From lg, the text sits left and the
        portrait right, under the full-width headline. From 1400px, where the headline fits beside
        it, the portrait runs down the whole right side. Its right edge always lines up with the
        container (and the navbar); the text keeps a comfortable reading width.
      */}
      <Container className="relative grid grid-cols-1 pt-32 pb-24 sm:pt-36 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-x-12 lg:pt-40 lg:pb-32 xl:gap-x-16">
        <m.p
          {...enter(0)}
          className="inline-flex items-center gap-2.5 justify-self-start rounded-full lg:col-span-2 min-[87.5rem]:col-span-1 border border-line bg-white/[0.03] py-1.5 pr-3.5 pl-2.5 font-mono text-[0.68rem] font-medium tracking-[0.1em] text-fg-muted uppercase sm:tracking-[0.18em]"
        >
          <span className="relative flex size-2" aria-hidden>
            <span className="absolute inline-flex size-full rounded-full bg-emerald-400 opacity-60 motion-safe:animate-ping-soft" />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
          </span>
          {heroContent.eyebrow}
        </m.p>

        <h1
          id="hero-title"
          className="mt-7 text-[clamp(2.15rem,5.4vw,4.35rem)] leading-[1.04] font-semibold tracking-[-0.04em] lg:col-span-2 min-[87.5rem]:col-span-1"
        >
          {heroContent.headline.map((line, index) => (
            <m.span key={line} {...enter(0.08 + index * 0.1)} className={cn('block pb-[0.04em]', lineStyles[index])}>
              {line}
            </m.span>
          ))}
        </h1>

        <div className="mt-12 lg:col-start-1 lg:mt-14 lg:max-w-[38rem]">
          <m.div {...enter(0.4)} className="max-w-xl space-y-4 text-base leading-relaxed text-fg-muted sm:text-lg">
            {heroContent.intro.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </m.div>

          <m.div {...enter(0.5)} className="mt-9 flex flex-col gap-3 min-[420px]:flex-row">
            <ButtonLink to={`/#${heroContent.primaryCta.id}`} size="lg">
              {heroContent.primaryCta.label}
              <ArrowRight aria-hidden className="size-4 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
            </ButtonLink>
            <ButtonLink to={`/#${heroContent.secondaryCta.id}`} variant="secondary" size="lg">
              {heroContent.secondaryCta.label}
            </ButtonLink>
          </m.div>

          <m.div
            {...enter(0.6)}
            className="mt-12 flex flex-col gap-6 border-t border-line pt-8 sm:flex-row sm:items-center sm:gap-8"
          >
            <div className="flex shrink-0 items-baseline gap-3 sm:block">
              <p className="text-5xl leading-none font-semibold tracking-[-0.04em] text-fg">
                {profile.experienceYears}
                <span className="text-accent-soft">+</span>
              </p>
              <p className="text-sm text-fg-muted sm:mt-2">Years Experience</p>
            </div>
            <span aria-hidden className="hidden h-14 w-px bg-line sm:block" />
            <ul className="grid grid-cols-1 gap-x-6 gap-y-3 min-[420px]:grid-cols-2" aria-label="Highlights">
              {heroHighlights.map((item) => {
                const Icon = icons[item.icon]
                return (
                  <li key={item.label} className="flex items-center gap-2.5 text-sm text-fg-muted">
                    <Icon aria-hidden className="size-4 shrink-0 text-accent-soft" strokeWidth={1.75} />
                    {item.label}
                  </li>
                )
              })}
            </ul>
          </m.div>
        </div>

        <HeroPortrait className="mt-16 lg:col-start-2 lg:row-start-3 lg:mt-14 lg:self-start min-[87.5rem]:row-span-3 min-[87.5rem]:row-start-1 min-[87.5rem]:mt-0 min-[87.5rem]:self-center" />
      </Container>
    </section>
  )
}

function HeroBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      <div className="bg-grid absolute inset-0 mask-radial opacity-70" />
      <div className="absolute -top-48 left-1/2 h-[36rem] w-[64rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(99_102_241/0.22),transparent)]" />
      <div className="absolute top-40 -right-40 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(closest-side,rgb(139_92_246/0.14),transparent)]" />
      <HeroFragments />
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-b from-transparent to-canvas" />
    </div>
  )
}
