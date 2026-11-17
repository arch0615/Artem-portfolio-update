import { ArrowRight, Gauge } from 'lucide-react'
import { BrandIcon } from '@/components/ui/BrandIcon'

/** Bars are drawn to scale: 180 ms is 7.5% of 2.4 s. */
const BEFORE_WIDTH = 52
const AFTER_WIDTH = BEFORE_WIDTH * (180 / 2400)

export function DjangoVisual() {
  return (
    <>
      <div className="absolute top-6 left-7 w-86 rounded-[1.6cqw] border border-white/12 bg-[#101015]/95 p-4 shadow-[0_2cqw_6cqw_-1cqw_rgb(0_0_0/0.7)]">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-[0.8em] font-semibold text-white/90">
            <Gauge className="size-3.5 text-[rgb(var(--accent))]" />
            p95 response time
          </span>
          <span className="rounded-full bg-[rgb(var(--accent)/0.15)] px-2 py-0.5 text-[0.62em] font-semibold text-[rgb(var(--accent))]">
            ≈13× faster
          </span>
        </div>

        <div className="mt-4 space-y-3">
          <div className="flex items-center gap-2.5">
            <span className="w-9 text-[0.62em] text-white/50">Before</span>
            <span className="h-3.5 rounded-[0.6cqw] bg-linear-to-r from-rose-400/30 to-rose-400/60" style={{ width: `${BEFORE_WIDTH}cqw` }} />
            <span className="font-mono text-[0.68em] font-semibold whitespace-nowrap text-rose-200">2.4 s</span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="w-9 text-[0.62em] text-white/50">After</span>
            <span
              className="h-3.5 rounded-[0.6cqw] bg-[rgb(var(--accent))] shadow-[0_0_2cqw_rgb(var(--accent)/0.6)]"
              style={{ width: `${AFTER_WIDTH}cqw` }}
            />
            <span className="font-mono text-[0.68em] font-semibold whitespace-nowrap text-[rgb(var(--accent))]">180 ms</span>
          </div>
        </div>
        <p className="mt-3 border-t border-white/8 pt-2 text-[0.52em] text-white/40">
          Approximate values · bars drawn to scale
        </p>
      </div>

      {/* Async architecture */}
      <div className="absolute top-44 left-7 flex w-86 items-center justify-between">
        {['Django', 'Celery', 'Redis', 'Channels'].map((name, i, all) => (
          <div key={name} className="flex flex-1 items-center last:flex-none">
            <span className="flex items-center gap-1.5 rounded-[1cqw] border border-white/12 bg-[#16161c] px-2 py-1.5 text-[0.66em] font-medium text-white/80">
              <BrandIcon
                name={name === 'Redis' ? 'redis' : name === 'Celery' ? 'celery' : 'django'}
                className="size-3 text-[rgb(var(--accent))]"
              />
              {name}
            </span>
            {i < all.length - 1 && (
              <span className="flex flex-1 items-center px-1">
                <span className="h-px flex-1 border-t border-dashed border-white/20" />
                <ArrowRight className="size-2.5 text-white/30" />
              </span>
            )}
          </div>
        ))}
      </div>
    </>
  )
}
