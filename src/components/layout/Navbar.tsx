import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router'
import { AnimatePresence, m } from 'framer-motion'
import { ArrowRight, ArrowUpRight, Menu, X } from 'lucide-react'
import { navCta, navigation } from '@/data/navigation'
import { useActiveSection } from '@/hooks/useActiveSection'
import { useScrolled } from '@/hooks/useScrolled'
import { cn } from '@/lib/cn'
import { easeOutExpo } from '@/lib/motion'
import { ButtonLink } from '@/components/ui/Button'
import { Container } from './Container'
import { Logo } from './Logo'

const sectionIds = navigation.map((item) => item.id)
const noSections: string[] = []

export function Navbar() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'
  const scrolled = useScrolled(12)
  const active = useActiveSection(isHome ? sectionIds : noSections)
  const [open, setOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const firstLinkRef = useRef<HTMLAnchorElement>(null)

  const close = useCallback(() => setOpen(false), [])

  // Escape closes the menu and returns focus to the toggle; scroll is locked while open.
  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }
    const onResize = () => {
      if (window.matchMedia('(min-width: 1024px)').matches) setOpen(false)
    }
    const { overflow } = document.documentElement.style
    document.documentElement.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('resize', onResize)
    firstLinkRef.current?.focus({ preventScroll: true })
    return () => {
      document.documentElement.style.overflow = overflow
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('resize', onResize)
    }
  }, [open])

  const solid = scrolled || open || !isHome

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-300',
          solid
            ? 'border-line bg-canvas/70 backdrop-blur-xl backdrop-saturate-150'
            : 'border-transparent bg-transparent',
        )}
      >
        <Container className="flex h-16 items-center justify-between gap-6">
          <Logo onNavigate={close} />

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-0.5 rounded-full border border-line bg-white/[0.025] p-1">
              {navigation.map((item) => {
                const isActive = active === item.id
                return (
                  <li key={item.id}>
                    <Link
                      to={`/#${item.id}`}
                      aria-current={isActive ? 'location' : undefined}
                      className={cn(
                        'relative block rounded-full px-3.5 py-1.5 text-sm transition-colors duration-200',
                        isActive ? 'text-fg' : 'text-fg-muted hover:text-fg',
                      )}
                    >
                      <span
                        aria-hidden
                        className={cn(
                          'absolute inset-0 rounded-full border border-white/[0.08] bg-white/[0.08] transition-[opacity,scale] duration-300 ease-out',
                          isActive ? 'scale-100 opacity-100' : 'scale-90 opacity-0',
                        )}
                      />
                      <span className="relative">{item.label}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden lg:block">
              <ButtonLink to={`/#${navCta.id}`} size="sm">
                {navCta.label}
                <ArrowRight aria-hidden className="size-4 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
              </ButtonLink>
            </div>

            <button
              ref={toggleRef}
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              className="relative grid size-10 place-items-center rounded-full border border-line bg-white/[0.03] text-fg transition-colors hover:bg-white/[0.07] lg:hidden"
            >
              <AnimatePresence mode="wait" initial={false}>
                <m.span
                  key={open ? 'close' : 'open'}
                  initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
                  transition={{ duration: 0.18 }}
                  className="grid place-items-center"
                >
                  {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
                </m.span>
              </AnimatePresence>
            </button>
          </div>
        </Container>
      </header>

      {/* Rendered outside <header>: backdrop-filter would otherwise trap these fixed elements. */}
      <AnimatePresence>
        {open && (
          <>
            <m.div
              key="backdrop"
              aria-hidden
              onClick={close}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 top-16 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            />
            <m.div
              key="panel"
              id="mobile-menu"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: easeOutExpo }}
              className="fixed inset-x-0 top-16 z-50 max-h-[calc(100dvh-4rem)] overflow-y-auto border-b border-line bg-canvas/95 backdrop-blur-xl lg:hidden"
            >
              <Container className="pt-2 pb-6">
                <nav aria-label="Mobile">
                  <ul>
                    {navigation.map((item, index) => {
                      const isActive = active === item.id
                      return (
                        <m.li
                          key={item.id}
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.04 * index + 0.05, duration: 0.35, ease: easeOutExpo }}
                          className="border-b border-line last:border-b-0"
                        >
                          <Link
                            ref={index === 0 ? firstLinkRef : undefined}
                            to={`/#${item.id}`}
                            onClick={close}
                            aria-current={isActive ? 'location' : undefined}
                            className={cn(
                              'flex items-center justify-between py-4 text-lg font-medium tracking-tight transition-colors',
                              isActive ? 'text-fg' : 'text-fg-muted hover:text-fg',
                            )}
                          >
                            <span className="flex items-center gap-3">
                              <span className="font-mono text-xs text-fg-subtle">0{index + 1}</span>
                              {item.label}
                            </span>
                            <ArrowUpRight aria-hidden className="size-4 text-fg-subtle" />
                          </Link>
                        </m.li>
                      )
                    })}
                  </ul>
                  <ButtonLink to={`/#${navCta.id}`} onClick={close} size="lg" className="mt-5 w-full">
                    {navCta.label}
                    <ArrowRight aria-hidden className="size-4" />
                  </ButtonLink>
                </nav>
              </Container>
            </m.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
