import { Link } from 'react-router'
import { ArrowUp } from 'lucide-react'
import { navigation } from '@/data/navigation'
import { profile } from '@/data/profile'
import { footerContent } from '@/data/content'
import { Container } from './Container'
import { BrandMark } from './Logo'

/** Footer navigation: every section except "Home" (the logo already links there). */
const footerLinks = navigation.filter((item) => item.id !== 'home')

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative border-t border-line bg-surface/40">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-accent/50 to-transparent"
      />
      <Container className="py-14 sm:py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.4fr_1fr]">
          <div>
            <Link to="/#home" className="inline-flex items-center gap-3 rounded-lg">
              <BrandMark className="size-10 rounded-xl [&>span]:rounded-[11px]" />
              <span>
                <span className="block font-semibold tracking-tight text-fg">{profile.name}</span>
                <span className="block text-sm text-fg-muted">{profile.title}</span>
              </span>
            </Link>
            <p className="mt-5 font-mono text-[0.72rem] tracking-wide text-accent-soft">{footerContent.tagline}</p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-fg-muted">{footerContent.message}</p>
          </div>

          <nav aria-label="Footer">
            <h2 className="font-mono text-[0.7rem] tracking-[0.2em] text-fg-subtle uppercase">Navigate</h2>
            <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2.5 text-sm">
              {footerLinks.map((item) => (
                <li key={item.id}>
                  <Link to={`/#${item.id}`} className="text-fg-muted transition-colors hover:text-fg">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-14 flex flex-col-reverse items-start justify-between gap-4 border-t border-line pt-6 text-xs text-fg-subtle sm:flex-row sm:items-center">
          <p>
            © {year} {profile.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <p>
              {profile.title} · {footerContent.tagline}
            </p>
            <Link
              to="/#home"
              aria-label="Back to top"
              className="grid size-8 shrink-0 place-items-center rounded-full border border-line text-fg-muted transition-colors hover:border-line-strong hover:text-fg"
            >
              <ArrowUp aria-hidden className="size-3.5" />
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  )
}
