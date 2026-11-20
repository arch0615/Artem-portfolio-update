import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { AnimatePresence, m, useInView } from 'framer-motion'
import { ImageIcon, Monitor, Smartphone } from 'lucide-react'
import { screenViewerContent } from '@/data/content'
import { cn } from '@/lib/cn'
import { easeOutExpo } from '@/lib/motion'
import { screenshotUrl } from '@/lib/screenshots'
import type { ProjectScreen } from '@/types'

/**
 * Real application screens: the active one large, in a phone or browser frame, with buttons to
 * switch screens below. Screens without a screenshot file show a placeholder. Tinted by the
 * surrounding `--accent`.
 */
export function ScreenViewer({ screens }: { screens: ProjectScreen[] }) {
  const [index, setIndex] = useState(0)
  const stage = useRef<HTMLDivElement>(null)
  const near = useInView(stage, { once: true, margin: '400px 0px' })
  const screen = screens[Math.min(index, screens.length - 1)]

  // Once the viewer is close to the screen, fetch these screenshots so switching is instant.
  useEffect(() => {
    if (!near) return
    for (const { file } of screens) {
      const src = screenshotUrl(file)
      if (src) new Image().src = src
    }
  }, [near, screens])

  if (!screen) return null
  const url = screenshotUrl(screen.file)

  return (
    <div>
      <div ref={stage} className="group relative aspect-[4/5] sm:aspect-[10/7]">
        <div
          aria-hidden
          className="absolute inset-[10%] rounded-full bg-[radial-gradient(closest-side,rgb(var(--accent)/0.16),transparent)]"
        />
        <AnimatePresence>
          <m.div
            key={screen.file}
            initial={{ opacity: 0, scale: 0.985 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: easeOutExpo }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <DeviceFrame device={screen.device}>
              {url ? (
                <img
                  src={url}
                  alt={screen.alt}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  className="absolute inset-0 size-full object-contain"
                />
              ) : (
                <ScreenPlaceholder screen={screen} />
              )}
            </DeviceFrame>
          </m.div>
        </AnimatePresence>
      </div>

      {screens.length > 1 && (
        <div
          role="group"
          aria-label={screenViewerContent.screensLabel}
          className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-[repeat(var(--screens),minmax(0,1fr))]"
          style={{ '--screens': screens.length } as CSSProperties}
        >
          {screens.map((item, i) => {
            const Icon = item.device === 'phone' ? Smartphone : Monitor
            const current = item === screen
            return (
              <button
                key={item.file}
                type="button"
                aria-pressed={current}
                onClick={() => setIndex(i)}
                className={cn(
                  'flex min-w-0 items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-xs transition-colors duration-200',
                  current
                    ? 'border-[rgb(var(--accent)/0.4)] bg-white/[0.05] text-fg'
                    : 'border-line bg-white/[0.015] text-fg-subtle hover:border-line-strong hover:text-fg-muted',
                )}
              >
                <Icon aria-hidden className={cn('size-3.5 shrink-0', current && 'text-[rgb(var(--accent))]')} />
                <span className="leading-snug">{item.label}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

/**
 * Thin, restrained frames: a phone for app screens, a browser window for web interfaces. The whole
 * screenshot is always shown, never cropped or stretched (thin dark margins if its proportions differ).
 */
function DeviceFrame({ device, children }: { device: ProjectScreen['device']; children: ReactNode }) {
  const lift = 'transition-transform duration-500 ease-out group-hover:-translate-y-1'
  if (device === 'phone') {
    return (
      <div
        className={cn(
          'relative aspect-[9/19.5] h-full rounded-[2.3rem] border border-white/12 bg-[#0b0b10] p-1.5 shadow-[0_40px_80px_-40px_rgb(0_0_0/0.9)]',
          lift,
        )}
      >
        <div className="relative size-full overflow-hidden rounded-[1.95rem] bg-black">{children}</div>
      </div>
    )
  }
  return (
    <div
      className={cn(
        'w-full overflow-hidden rounded-xl border border-white/10 bg-[#0d0d12] shadow-[0_40px_80px_-40px_rgb(0_0_0/0.9)]',
        lift,
      )}
    >
      <div aria-hidden className="flex items-center gap-1.5 border-b border-white/[0.06] px-3.5 py-2.5">
        <span className="size-2 rounded-full bg-white/15" />
        <span className="size-2 rounded-full bg-white/15" />
        <span className="size-2 rounded-full bg-white/15" />
        <span className="ml-3 h-4 w-2/5 rounded-full bg-white/[0.05]" />
      </div>
      <div className="relative aspect-[16/10] bg-black">{children}</div>
    </div>
  )
}

/** Shown in a frame until the real screenshot has been added. */
function ScreenPlaceholder({ screen }: { screen: ProjectScreen }) {
  return (
    <div
      role="img"
      aria-label={`${screen.alt}: ${screenViewerContent.placeholder.toLowerCase()}`}
      className="absolute inset-0 grid place-items-center overflow-hidden bg-[radial-gradient(ellipse_at_50%_35%,rgb(var(--accent)/0.12),transparent_70%)]"
    >
      <div aria-hidden className="bg-grid-sm absolute inset-0 opacity-50" />
      <div className="relative px-4 text-center">
        <ImageIcon aria-hidden className="mx-auto size-6 text-fg-subtle" strokeWidth={1.5} />
        <p className="mt-3 text-sm font-medium text-fg-muted">{screen.label}</p>
        <p className="mt-1 font-mono text-[0.6rem] tracking-[0.16em] text-fg-subtle uppercase">
          {screenViewerContent.placeholder}
        </p>
      </div>
    </div>
  )
}
