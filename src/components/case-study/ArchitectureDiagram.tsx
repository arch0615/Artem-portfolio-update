import { m } from 'framer-motion'
import type { CaseStudy } from '@/types'
import { easeOutExpo, viewportOnce } from '@/lib/motion'
import { TechChip } from '@/components/ui/TechChip'

/** Layered architecture diagram rendered from case-study data. */
export function ArchitectureDiagram({ architecture }: { architecture: CaseStudy['architecture'] }) {
  const { layers, caption } = architecture
  return (
    <figure className="relative overflow-hidden rounded-2xl border border-line bg-surface/70 p-5 sm:p-8">
      <div aria-hidden className="bg-grid-sm absolute inset-0 mask-radial-center" />
      <ol className="relative">
        {layers.map((layer, index) => (
          <m.li
            key={layer.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.6, delay: index * 0.1, ease: easeOutExpo }}
          >
            <div className="grid gap-3 rounded-xl border border-line-strong bg-elevated/90 p-4 card-highlight sm:grid-cols-[9rem_1fr] sm:items-center sm:gap-5 sm:p-5">
              <div>
                <p className="font-mono text-[0.65rem] tracking-[0.18em] text-accent-soft uppercase">
                  {String(index + 1).padStart(2, '0')} · {layer.label}
                </p>
                <p className="mt-1 text-sm font-medium text-fg sm:hidden">{layer.title}</p>
              </div>
              <div>
                <p className="hidden text-sm font-medium text-fg sm:block">{layer.title}</p>
                <ul className="flex flex-wrap gap-1.5 sm:mt-2.5">
                  {layer.items.map((item) => (
                    <li key={item}>
                      <TechChip label={item} />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {index < layers.length - 1 && (
              <div aria-hidden className="flex h-8 justify-center sm:justify-start sm:pl-[4.5rem]">
                <span className="relative w-px bg-linear-to-b from-accent-soft/70 to-accent-2/40">
                  <span className="absolute -bottom-0.5 left-1/2 size-1.5 -translate-x-1/2 rotate-45 border-r border-b border-accent-2/70" />
                </span>
              </div>
            )}
          </m.li>
        ))}
      </ol>
      <figcaption className="relative mt-6 text-sm text-fg-subtle">{caption}</figcaption>
    </figure>
  )
}
