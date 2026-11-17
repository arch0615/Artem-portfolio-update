import { ArrowLeft } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { ButtonLink } from '@/components/ui/Button'
import { usePageMeta } from '@/hooks/usePageMeta'
import { profile } from '@/data/profile'

export default function NotFoundPage() {
  usePageMeta({
    title: `Page not found | ${profile.name}`,
    description: 'The page you are looking for does not exist.',
    path: '/',
  })

  return (
    <section className="relative isolate overflow-hidden">
      <div aria-hidden className="bg-grid absolute inset-0 -z-10 mask-radial opacity-60" />
      <Container className="flex min-h-[80dvh] flex-col items-center justify-center py-32 text-center">
        <p className="font-mono text-sm tracking-[0.2em] text-accent-soft uppercase">404</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">This page doesn’t exist.</h1>
        <p className="mt-4 max-w-md text-fg-muted">
          The link may be outdated, or the page may have moved. Let’s get you back on track.
        </p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <ButtonLink to="/">
            <ArrowLeft aria-hidden className="size-4" />
            Back to home
          </ButtonLink>
          <ButtonLink to="/#projects" variant="secondary">
            View projects
          </ButtonLink>
        </div>
      </Container>
    </section>
  )
}
