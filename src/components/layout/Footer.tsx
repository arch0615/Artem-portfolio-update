import { Link } from 'react-router'
import { ArrowUp } from 'lucide-react'
import { footerNavigation } from '@/data/navigation'
import { contactConfig, getContactMethods } from '@/data/contact'
import { footerContent } from '@/data/content'
import { ContactMethodIcon } from '@/components/ui/ContactMethodIcon'
import { Container } from './Container'
import { Monogram } from './Logo'

export function Footer() {
  // Only methods that are configured AND permitted by platformCompliance.
  const methods = getContactMethods()
  const year = new Date().getFullYear()

  return (
    <footer className="relative border-t border-line bg-surface/40">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-accent/50 to-transparent"
      />
      <Container className="py-14 sm:py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Link to="/#home" className="inline-flex items-center gap-3 rounded-lg">
              <Monogram className="size-10 rounded-xl [&>span]:rounded-[11px] [&>span]:text-xs" />
              <span>
                <span className="block font-semibold tracking-tight text-fg">{contactConfig.fullName}</span>
                <span className="block text-sm text-fg-muted">{contactConfig.title}</span>
              </span>
            </Link>
            <p className="mt-5 font-mono text-[0.72rem] tracking-wide text-accent-soft">{footerContent.tagline}</p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-fg-muted">{footerContent.message}</p>
          </div>

          <nav aria-label="Footer">
            <h2 className="font-mono text-[0.7rem] tracking-[0.2em] text-fg-subtle uppercase">Navigate</h2>
            <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2.5 text-sm">
              {footerNavigation.map((item) => (
                <li key={item.id}>
                  <Link to={`/#${item.id}`} className="text-fg-muted transition-colors hover:text-fg">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="font-mono text-[0.7rem] tracking-[0.2em] text-fg-subtle uppercase">Work with me</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {methods.map((method) => (
                <li key={method.key}>
                  <a
                    href={method.href}
                    {...(method.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="inline-flex items-center gap-2.5 text-fg-muted transition-colors hover:text-fg"
                  >
                    <ContactMethodIcon method={method.key} className="size-4" />
                    {method.key === 'platform' ? method.display : method.label}
                    {method.external && <span className="sr-only">(opens in a new tab)</span>}
                  </a>
                </li>
              ))}
              <li>
                <Link
                  to="/#inquiry"
                  className="inline-flex items-center gap-2.5 text-fg-muted transition-colors hover:text-fg"
                >
                  <ContactMethodIcon method="inquiry" className="size-4" />
                  Start a project inquiry
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col-reverse items-start justify-between gap-4 border-t border-line pt-6 text-xs text-fg-subtle sm:flex-row sm:items-center">
          <p>
            © {year} {contactConfig.fullName}. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <p>
              {contactConfig.title} · {footerContent.tagline}
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
