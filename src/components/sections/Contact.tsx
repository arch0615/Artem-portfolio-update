import { lazy, Suspense, type ReactNode } from 'react'
import { Link } from 'react-router'
import { ArrowRight, ArrowUpRight, MapPin, ShieldCheck } from 'lucide-react'
import { contactContent } from '@/data/content'
import {
  contactConfig,
  getContactMethods,
  getMarketplaceName,
  getPrimaryContactAction,
  isFormDeliveryEnabled,
} from '@/data/contact'
import type { ContactMethod } from '@/types'
import { Container } from '@/components/layout/Container'
import { Monogram } from '@/components/layout/Logo'
import { AnimatedSection, Reveal } from '@/components/ui/AnimatedSection'
import { ButtonLink } from '@/components/ui/Button'
import { ContactMethodIcon } from '@/components/ui/ContactMethodIcon'
import { Eyebrow } from '@/components/ui/SectionHeading'
import { SpotlightCard } from '@/components/ui/SpotlightCard'

const InquiryForm = lazy(() => import('./InquiryForm'))

export function Contact() {
  const marketplace = getMarketplaceName()

  return (
    <AnimatedSection id="contact" labelledBy="contact-title" className="overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute bottom-0 left-1/2 h-[32rem] w-[60rem] -translate-x-1/2 translate-y-1/3 rounded-full bg-[radial-gradient(closest-side,rgb(99_102_241/0.16),transparent)]" />
        <div className="bg-grid absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_100%,#000,transparent)]" />
      </div>

      <Container className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <Reveal>
            <Eyebrow>{contactContent.eyebrow}</Eyebrow>
            <h2
              id="contact-title"
              className="mt-5 text-[2.25rem] leading-[1.05] font-semibold tracking-[-0.035em] text-fg sm:text-5xl"
            >
              {contactContent.title}
            </h2>
            <p className="mt-5 text-xl leading-snug font-medium tracking-tight text-fg sm:text-2xl">
              {contactContent.subheadline}
            </p>
          </Reveal>
          <Reveal className="mt-6 space-y-4 text-base leading-relaxed text-fg-muted">
            {contactContent.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </Reveal>
          <Reveal delay={0.1} className="mt-10">
            <ContactCard />
          </Reveal>
        </div>

        <Reveal className="lg:col-span-7" delay={0.1}>
          <div
            id="inquiry"
            className="relative scroll-mt-24 rounded-3xl border border-line bg-elevated/70 p-6 card-highlight backdrop-blur-sm sm:p-8 lg:p-10"
          >
            <div aria-hidden className="pointer-events-none absolute inset-x-10 -top-px h-px bg-linear-to-r from-transparent via-accent-soft/60 to-transparent" />
            <div className="mb-8">
              <h3 className="text-xl font-semibold tracking-tight text-fg">{contactContent.formTitle}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">
                {isFormDeliveryEnabled()
                  ? 'Tell me about your project and I’ll reply by email.'
                  : `Tell me about your project and I’ll turn it into a brief you can send me through ${
                      marketplace ? `${marketplace} messages` : 'marketplace messaging'
                    }.`}
              </p>
            </div>
            <Suspense fallback={<FormSkeleton />}>
              <InquiryForm />
            </Suspense>
          </div>
        </Reveal>
      </Container>
    </AnimatedSection>
  )
}

/** Identity, availability and the permitted contact methods — nothing else is rendered. */
function ContactCard() {
  const methods = getContactMethods()
  const action = getPrimaryContactAction()
  const marketplace = getMarketplaceName()
  const { platformCompliance } = contactConfig

  return (
    <SpotlightCard className="overflow-hidden">
      <div className="relative border-b border-line p-6 sm:p-7">
        <div aria-hidden className="bg-dots absolute inset-0 mask-radial-center opacity-50" />
        <div className="relative flex items-center gap-4">
          <Monogram className="size-12 rounded-xl [&>span]:rounded-[11px] [&>span]:text-sm" />
          <div>
            <p className="text-lg font-semibold tracking-tight text-fg">{contactConfig.fullName}</p>
            <p className="text-sm text-fg">{contactConfig.title}</p>
            <p className="text-sm text-fg-muted">{contactConfig.specialty}</p>
          </div>
        </div>
        <p className="relative mt-5 text-sm leading-relaxed text-fg-muted">{contactConfig.introduction}</p>
        <div className="relative mt-5 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/[0.07] px-3 py-1 text-xs text-emerald-200">
            <span className="size-1.5 rounded-full bg-emerald-400" aria-hidden />
            {contactConfig.availability}
          </span>
          {contactConfig.location.trim() && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1 text-xs text-fg-muted">
              <MapPin aria-hidden className="size-3.5" />
              {contactConfig.location}
            </span>
          )}
        </div>
      </div>

      <div className="p-6 sm:p-7">
        <h3 className="font-mono text-[0.68rem] tracking-[0.2em] text-fg-subtle uppercase">How to reach me</h3>
        <ul className="mt-4 divide-y divide-line overflow-hidden rounded-xl border border-line bg-canvas/40">
          {methods.map((method) => (
            <li key={method.key}>
              <MethodRow method={method} />
            </li>
          ))}
          <li>
            <Link
              to="/#inquiry"
              className="group flex items-center gap-3.5 px-4 py-3.5 transition-colors hover:bg-white/[0.03]"
            >
              <MethodIconBox>
                <ContactMethodIcon method="inquiry" className="size-4" />
              </MethodIconBox>
              <span className="min-w-0 flex-1">
                <span className="block text-xs text-fg-subtle">Project inquiry</span>
                <span className="block text-sm text-fg">Describe your project in the form</span>
              </span>
              <ArrowRight aria-hidden className="size-4 text-fg-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-fg" />
            </Link>
          </li>
        </ul>

        {platformCompliance.allowPlatformMessaging && (
          <p className="mt-4 flex items-start gap-2.5 text-xs leading-relaxed text-fg-subtle">
            <ShieldCheck aria-hidden className="mt-px size-4 shrink-0 text-emerald-300/80" />
            {marketplace
              ? `Project discussions, contracts and payments stay on ${marketplace}, so your project is protected by the platform.`
              : 'Project discussions, contracts and payments stay on the freelance marketplace where you found my profile, so your project is protected by the platform.'}
          </p>
        )}

        <ButtonLink
          {...(action.external || action.kind === 'email' ? { href: action.href } : { to: action.href })}
          size="lg"
          className="mt-6 w-full"
          aria-describedby="contact-action-hint"
        >
          Contact Me
          {action.external ? (
            <ArrowUpRight aria-hidden className="size-4" />
          ) : (
            <ArrowRight aria-hidden className="size-4 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
          )}
        </ButtonLink>
        <p id="contact-action-hint" className="mt-2.5 text-center text-xs text-fg-subtle">
          {action.hint}
        </p>
      </div>
    </SpotlightCard>
  )
}

function MethodRow({ method }: { method: ContactMethod }) {
  return (
    <a
      href={method.href}
      {...(method.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className="group flex items-center gap-3.5 px-4 py-3.5 transition-colors hover:bg-white/[0.03]"
    >
      <MethodIconBox>
        <ContactMethodIcon method={method.key} className="size-4" />
      </MethodIconBox>
      <span className="min-w-0 flex-1">
        <span className="block text-xs text-fg-subtle">{method.label}</span>
        <span className="block truncate text-sm text-fg">{method.display}</span>
      </span>
      <ArrowUpRight
        aria-hidden
        className="size-4 shrink-0 text-fg-subtle transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-fg"
      />
      {method.external && <span className="sr-only">(opens in a new tab)</span>}
    </a>
  )
}

function MethodIconBox({ children }: { children: ReactNode }) {
  return (
    <span className="grid size-9 shrink-0 place-items-center rounded-lg border border-line bg-white/[0.03] text-fg-muted transition-colors group-hover:text-fg">
      {children}
    </span>
  )
}

function FormSkeleton() {
  return (
    <div aria-hidden className="min-h-[28rem] space-y-5">
      <div className="h-[4.6rem] rounded-xl bg-white/[0.03]" />
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="h-[4.6rem] rounded-xl bg-white/[0.03]" />
        <div className="h-[4.6rem] rounded-xl bg-white/[0.03]" />
      </div>
      <div className="h-52 rounded-xl bg-white/[0.03]" />
    </div>
  )
}
