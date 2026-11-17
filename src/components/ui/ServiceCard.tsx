import { Check } from 'lucide-react'
import type { Service } from '@/types'
import { IconBadge } from './IconBadge'
import { SpotlightCard } from './SpotlightCard'

export function ServiceCard({ service, index }: { service: Service; index: number }) {
  return (
    <SpotlightCard className="group flex h-full flex-col p-6 sm:p-7">
      <div className="flex items-center justify-between">
        <IconBadge icon={service.icon} size="lg" />
        <span className="font-mono text-3xl font-medium tracking-tight text-white/[0.07] transition-colors duration-300 group-hover:text-white/[0.14]">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>
      <h3 className="mt-6 text-xl font-semibold tracking-tight text-fg">{service.title}</h3>
      <p className="mt-2.5 text-sm leading-relaxed text-fg-muted">{service.description}</p>
      <ul className="mt-6 space-y-2.5 border-t border-line pt-6">
        {service.items.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-sm text-fg-muted">
            <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-accent-soft" strokeWidth={2} />
            {item}
          </li>
        ))}
      </ul>
    </SpotlightCard>
  )
}
