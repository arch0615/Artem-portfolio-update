import { useRef, useState } from 'react'
import { m, useInView } from 'framer-motion'
import { Gauge, MousePointerClick } from 'lucide-react'
import type { IconName } from '@/types'
import { icons } from '@/lib/icons'
import { cn } from '@/lib/cn'
import { easeOutExpo } from '@/lib/motion'
import { useIntroRevealed } from '@/components/intro/intro-context'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

/* Canvas coordinates — nodes are positioned in % of this box so the graph scales fluidly. */
const W = 520
const H = 440

type NodeId = 'web' | 'mobile' | 'api' | 'ai' | 'automation' | 'data'

interface GraphNode {
  id: NodeId
  x: number
  y: number
  icon: IconName
  label: string
  sub: string
  title: string
  description: string
  tech: string[]
}

const nodes: GraphNode[] = [
  {
    id: 'web',
    x: 118,
    y: 60,
    icon: 'layout',
    label: 'Web Apps',
    sub: 'React · Next.js',
    title: 'Web applications',
    description: 'SaaS platforms, dashboards and portals with modern React frontends.',
    tech: ['React', 'Next.js', 'TypeScript'],
  },
  {
    id: 'mobile',
    x: 402,
    y: 60,
    icon: 'smartphone',
    label: 'Mobile Apps',
    sub: 'React Native · Expo',
    title: 'Mobile applications',
    description: 'Cross-platform iOS and Android apps served by the same backend.',
    tech: ['React Native', 'Expo', 'Kotlin'],
  },
  {
    id: 'api',
    x: 260,
    y: 158,
    icon: 'server',
    label: 'API Layer',
    sub: 'Node.js · Fastify · Python',
    title: 'APIs & backend services',
    description: 'Typed services with REST, WebSockets, authentication and integrations.',
    tech: ['Node.js', 'Fastify', 'FastAPI'],
  },
  {
    id: 'ai',
    x: 108,
    y: 256,
    icon: 'brain',
    label: 'AI Agents',
    sub: 'OpenAI · Claude · RAG',
    title: 'AI agents & retrieval',
    description: 'LLM features, agents and RAG grounded in your own business data.',
    tech: ['OpenAI', 'Claude', 'pgvector'],
  },
  {
    id: 'automation',
    x: 412,
    y: 256,
    icon: 'workflow',
    label: 'Automation',
    sub: 'n8n · Webhooks · Bots',
    title: 'Business automation',
    description: 'Workflows, bots and webhooks that take repetitive work off your team.',
    tech: ['n8n', 'Make', 'Webhooks'],
  },
  {
    id: 'data',
    x: 260,
    y: 330,
    icon: 'database',
    label: 'Data Layer',
    sub: 'PostgreSQL · Redis',
    title: 'Data & storage',
    description: 'Relational, geospatial, vector and in-memory data modelled for speed.',
    tech: ['PostgreSQL', 'PostGIS', 'Redis'],
  },
]

const edges: { id: string; from: NodeId; to: NodeId; d: string }[] = [
  { id: 'web-api', from: 'web', to: 'api', d: 'M118 60 C118 112, 260 104, 260 158' },
  { id: 'mobile-api', from: 'mobile', to: 'api', d: 'M402 60 C402 112, 260 104, 260 158' },
  { id: 'api-ai', from: 'api', to: 'ai', d: 'M260 158 C260 212, 108 200, 108 256' },
  { id: 'api-automation', from: 'api', to: 'automation', d: 'M260 158 C260 212, 412 200, 412 256' },
  { id: 'api-data', from: 'api', to: 'data', d: 'M260 158 L260 330' },
  { id: 'ai-data', from: 'ai', to: 'data', d: 'M108 256 C108 302, 260 284, 260 330' },
  { id: 'automation-data', from: 'automation', to: 'data', d: 'M412 256 C412 302, 260 284, 260 330' },
]

const pct = (value: number, total: number) => `${(value / total) * 100}%`

/** Interactive map of how a complete product fits together (shown in the Expertise section). */
export function ProductArchitecture() {
  const [active, setActive] = useState<NodeId | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const inView = useInView(containerRef, { margin: '0px 0px -10% 0px' })
  const entered = useInView(containerRef, { once: true, margin: '0px 0px -15% 0px' })
  const reducedMotion = usePrefersReducedMotion()
  // Entrance animations play once scrolled into view, and never unseen under the intro overlay.
  const revealed = useIntroRevealed() && entered
  const activeNode = nodes.find((n) => n.id === active)
  const showPackets = inView && !reducedMotion && revealed

  return (
    <div className="relative mx-auto w-full max-w-[560px]">
      {/* Glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-10 rounded-full bg-[radial-gradient(closest-side,rgb(99_102_241/0.22),transparent)] blur-2xl"
      />

      <m.div
        ref={containerRef}
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={revealed ? { opacity: 1, y: 0, scale: 1 } : undefined}
        transition={{ duration: 0.9, delay: 0.35, ease: easeOutExpo }}
        className="@container relative overflow-hidden rounded-3xl border border-line bg-surface/80 card-highlight"
        onMouseLeave={() => setActive(null)}
      >
        <div aria-hidden className="bg-grid-sm absolute inset-0 mask-radial-center" />

        {/* Window chrome */}
        <div className="relative flex items-center border-b border-line px-4 py-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5" aria-hidden>
              <span className="size-2.5 rounded-full bg-white/15" />
              <span className="size-2.5 rounded-full bg-white/15" />
              <span className="size-2.5 rounded-full bg-white/15" />
            </div>
            <p className="font-mono text-[0.68rem] tracking-wider text-fg-subtle">product-architecture.ts</p>
          </div>
        </div>

        {/* Graph */}
        <div className="relative" style={{ aspectRatio: `${W} / ${H - 60}` }}>
          <svg
            viewBox={`0 0 ${W} ${H - 60}`}
            className="absolute inset-0 size-full"
            aria-hidden
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="edge-active" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2={H - 60}>
                <stop offset="0%" stopColor="#818cf8" />
                <stop offset="100%" stopColor="#c4b5fd" />
              </linearGradient>
            </defs>
            {edges.map((edge, index) => {
              const isLit = active !== null && (edge.from === active || edge.to === active)
              const isDim = active !== null && !isLit
              return (
                <m.g
                  key={edge.id}
                  initial={{ opacity: 0 }}
                  animate={revealed ? { opacity: 1 } : undefined}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.08 }}
                >
                  {/* Base connection */}
                  <m.path
                    id={`edge-${edge.id}`}
                    d={edge.d}
                    fill="none"
                    stroke="rgb(255 255 255 / 0.16)"
                    strokeWidth={1}
                    strokeDasharray="3 5"
                    initial={false}
                    animate={{ opacity: isDim ? 0.35 : 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  {/* Highlight drawn along the path when a connected node is active */}
                  <m.path
                    d={edge.d}
                    fill="none"
                    stroke="url(#edge-active)"
                    strokeWidth={1.6}
                    strokeLinecap="round"
                    initial={false}
                    animate={{ pathLength: isLit ? 1 : 0, opacity: isLit ? 1 : 0 }}
                    transition={{ duration: 0.55, ease: easeOutExpo }}
                  />
                  {showPackets && (
                    <circle r="2.6" fill={isLit ? '#c4b5fd' : '#818cf8'} opacity={isDim ? 0.25 : 0.9}>
                      <animateMotion
                        dur={`${3.2 + (index % 3) * 0.7}s`}
                        begin={`${index * 0.45}s`}
                        repeatCount="indefinite"
                        rotate="auto"
                      >
                        <mpath href={`#edge-${edge.id}`} />
                      </animateMotion>
                    </circle>
                  )}
                </m.g>
              )
            })}
          </svg>

          {nodes.map((node, index) => {
            const Icon = icons[node.icon]
            const isActive = active === node.id
            const isPrimary = node.id === 'api'
            return (
              <m.button
                key={node.id}
                type="button"
                aria-pressed={isActive}
                aria-describedby="architecture-node-info"
                onMouseEnter={() => setActive(node.id)}
                onFocus={() => setActive(node.id)}
                onClick={() => setActive(node.id)}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={revealed ? { opacity: 1, scale: 1 } : undefined}
                transition={{ duration: 0.5, delay: 0.55 + index * 0.07, ease: easeOutExpo }}
                style={{ left: pct(node.x, W), top: pct(node.y, H - 60) }}
                className={cn(
                  'absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-xl border text-left backdrop-blur-md',
                  'px-2 py-1.5 transition-[border-color,background-color,box-shadow] duration-300 @md:gap-2.5 @md:px-3 @md:py-2',
                  isActive
                    ? 'border-accent-soft/60 bg-raised shadow-[0_0_0_4px_rgb(99_102_241/0.12),0_10px_30px_-10px_rgb(99_102_241/0.6)]'
                    : isPrimary
                      ? 'border-line-strong bg-elevated/95 hover:border-white/25'
                      : 'border-line bg-elevated/90 hover:border-line-strong',
                )}
              >
                <span
                  className={cn(
                    'grid size-6 shrink-0 place-items-center rounded-lg transition-colors duration-300 @md:size-8',
                    isActive || isPrimary
                      ? 'bg-linear-to-br from-accent to-accent-2 text-white'
                      : 'bg-white/[0.06] text-accent-soft',
                  )}
                >
                  <Icon aria-hidden className="size-3.5 @md:size-4" strokeWidth={1.9} />
                </span>
                <span className="pr-0.5">
                  <span className="block text-[0.7rem] leading-tight font-medium whitespace-nowrap text-fg @md:text-[0.8rem]">
                    {node.label}
                  </span>
                  <span className="hidden font-mono text-[0.62rem] leading-tight whitespace-nowrap text-fg-subtle @lg:block">
                    {node.sub}
                  </span>
                </span>
              </m.button>
            )
          })}
        </div>

        {/* Details for the hovered / focused layer */}
        <div className="relative border-t border-line bg-canvas/40 px-4 py-3.5" aria-live="polite" id="architecture-node-info">
          {activeNode ? (
            <div className="flex flex-col gap-2 @md:flex-row @md:items-center @md:justify-between @md:gap-4">
              <div className="min-w-0">
                <p className="text-sm font-medium text-fg">{activeNode.title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-fg-muted">{activeNode.description}</p>
              </div>
              <div className="flex shrink-0 flex-wrap gap-1.5">
                {activeNode.tech.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-md border border-line bg-white/[0.04] px-1.5 py-0.5 font-mono text-[0.65rem] text-fg-muted"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <p className="flex items-center gap-2 text-xs text-fg-subtle">
              <MousePointerClick aria-hidden className="size-3.5" />
              Hover or tap a layer to explore how a complete product fits together.
            </p>
          )}
        </div>
      </m.div>

      {/* Floating code fragment */}
      <m.div
        aria-hidden
        initial={{ opacity: 0, y: 16 }}
        animate={revealed ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.8, delay: 1.1, ease: easeOutExpo }}
        className="pointer-events-none absolute -top-28 -right-4 hidden w-[15.5rem] rounded-xl border border-line-strong bg-elevated/95 p-3 shadow-2xl shadow-black/50 backdrop-blur-md sm:block xl:-right-10"
      >
        <div className="mb-2 flex items-center justify-between">
          <span className="font-mono text-[0.65rem] text-fg-subtle">agent.ts</span>
          <span className="rounded bg-accent/15 px-1.5 py-0.5 font-mono text-[0.6rem] text-accent-soft">TS</span>
        </div>
        <pre className="font-mono text-[0.66rem] leading-[1.6] text-fg-muted">
          <code>
            <span className="text-accent-2-soft">const</span> reply = <span className="text-accent-2-soft">await</span>{' '}
            agent.<span className="text-sky-300">run</span>({'{'}
            {'\n'}  model: <span className="text-emerald-300">'claude'</span>,
            {'\n'}  tools: [<span className="text-fg">crm</span>, <span className="text-fg">search</span>],
            {'\n'}  context: <span className="text-accent-2-soft">await</span> rag.
            <span className="text-sky-300">retrieve</span>(q),
            {'\n'}
            {'}'})
            <span className="ml-0.5 inline-block h-3 w-1.5 translate-y-0.5 bg-accent-soft/80 motion-safe:animate-caret" />
          </code>
        </pre>
      </m.div>

      {/* Real, verified result from the Django optimization project */}
      <m.div
        initial={{ opacity: 0, y: 16 }}
        animate={revealed ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.8, delay: 1.25, ease: easeOutExpo }}
        className="absolute -bottom-12 -left-4 hidden items-center gap-3 rounded-xl border border-line-strong bg-elevated/95 py-2.5 pr-4 pl-2.5 shadow-2xl shadow-black/50 backdrop-blur-md sm:flex xl:-left-10"
      >
        <span className="grid size-9 place-items-center rounded-lg bg-emerald-400/10 text-emerald-300">
          <Gauge aria-hidden className="size-4.5" strokeWidth={1.9} />
        </span>
        <span>
          <span className="block font-mono text-[0.62rem] tracking-wider text-fg-subtle uppercase">
            p95 response time
          </span>
          <span className="block text-sm font-semibold text-fg">
            2.4 s <span className="text-fg-subtle">→</span> <span className="text-emerald-300">180 ms</span>
          </span>
        </span>
      </m.div>
    </div>
  )
}
