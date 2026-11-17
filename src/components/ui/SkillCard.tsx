import type { SkillCategory } from '@/types'
import { IconBadge } from './IconBadge'
import { SpotlightCard } from './SpotlightCard'
import { TechChip } from './TechChip'

export function SkillCard({ category, index }: { category: SkillCategory; index: number }) {
  return (
    <SpotlightCard className="group flex h-full flex-col p-6 sm:p-7">
      <div className="flex items-start justify-between">
        <IconBadge icon={category.icon} />
        <span className="font-mono text-[0.68rem] text-fg-subtle">
          {String(index + 1).padStart(2, '0')} / {category.skills.length} tools
        </span>
      </div>
      <h3 className="mt-6 text-lg font-semibold tracking-tight text-fg">{category.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-fg-muted">{category.description}</p>
      <ul className="mt-6 flex flex-wrap gap-1.5 border-t border-line pt-6" aria-label={`${category.title} skills`}>
        {category.skills.map((skill) => (
          <li key={skill}>
            <TechChip label={skill} className="group-hover:border-white/[0.12]" />
          </li>
        ))}
      </ul>
    </SpotlightCard>
  )
}
