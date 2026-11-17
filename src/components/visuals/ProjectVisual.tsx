import type { ComponentType } from 'react'
import type { Project, ProjectVisualKey } from '@/types'
import { accentStyle } from '@/lib/accent'
import { cn } from '@/lib/cn'
import { BydVisual } from './BydVisual'
import { DjangoVisual } from './DjangoVisual'
import { DourasoftVisual } from './DourasoftVisual'
import { EmailVisual } from './EmailVisual'
import { NexaVisual } from './NexaVisual'
import { RadarVisual } from './RadarVisual'
import { SolidHouseVisual } from './SolidHouseVisual'
import { Style4uVisual } from './Style4uVisual'

const visuals: Record<ProjectVisualKey, ComponentType> = {
  radar: RadarVisual,
  email: EmailVisual,
  django: DjangoVisual,
  nexa: NexaVisual,
  solidhouse: SolidHouseVisual,
  dourasoft: DourasoftVisual,
  style4u: Style4uVisual,
  byd: BydVisual,
}

interface ProjectVisualProps {
  project: Pick<Project, 'visual' | 'visualLabel' | 'accent'>
  className?: string
}

/** Original, resolution-independent product mockup (16:10) for a project. */
export function ProjectVisual({ project, className }: ProjectVisualProps) {
  const Visual = visuals[project.visual]
  return (
    <div
      role="img"
      aria-label={project.visualLabel}
      style={accentStyle(project.accent)}
      className={cn('@container relative aspect-[16/10] w-full overflow-hidden bg-[#0d0d11]', className)}
    >
      <div aria-hidden className="bg-grid-sm absolute inset-0 opacity-70" />
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_50%_0%,rgb(var(--accent)/0.2),transparent_70%)]"
      />
      <div aria-hidden className="absolute inset-0 flex items-center">
        <div className="mockup relative aspect-[16/10] w-full">
          <Visual />
        </div>
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-1/5 bg-linear-to-t from-[#0d0d11]/80 to-transparent" />
    </div>
  )
}
