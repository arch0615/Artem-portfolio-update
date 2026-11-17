import { Activity, Check, RefreshCw } from 'lucide-react'
import { BrandIcon } from '@/components/ui/BrandIcon'
import { BrowserWindow, Skel } from './primitives'

export function NexaVisual() {
  return (
    <>
      <BrowserWindow url="marketplace · demo" className="top-5 left-5 h-52 w-62" bodyClassName="flex flex-col p-3">
        <div className="flex items-center justify-between">
          <span className="space-y-1">
            <Skel className="w-16 bg-white/30" />
            <Skel className="w-10" />
          </span>
          <span className="rounded-full border border-white/12 px-1.5 py-0.5 text-[0.55em] text-white/55">Demo</span>
        </div>
        <div className="mt-3 grid grid-cols-[1fr_repeat(4,9cqw)] gap-1 text-center text-[0.55em] tracking-wider text-white/40 uppercase">
          <span className="text-left">Selection</span>
          <span className="col-span-2">Back</span>
          <span className="col-span-2">Lay</span>
        </div>
        <div className="mt-1.5 flex flex-1 flex-col justify-between">
          {[0, 1, 2, 3].map((row) => (
            <div key={row} className="grid grid-cols-[1fr_repeat(4,9cqw)] items-center gap-1">
              <Skel className="bg-white/20" />
              {[0, 1, 2, 3].map((cell) => (
                <span
                  key={cell}
                  className={`grid h-5 place-items-center rounded-[0.6cqw] ${cell < 2 ? 'bg-sky-400/15' : 'bg-rose-400/15'}`}
                >
                  <Skel className={`w-1/2 ${cell < 2 ? 'bg-sky-300/50' : 'bg-rose-300/50'}`} />
                </span>
              ))}
            </div>
          ))}
        </div>
      </BrowserWindow>

      <div className="absolute top-7 left-70 w-26 space-y-2.5">
        <div className="rounded-[1.4cqw] border border-white/12 bg-[#16161c]/95 p-2.5 shadow-[0_1.5cqw_4cqw_-1cqw_rgb(0_0_0/0.7)]">
          <p className="flex items-center gap-1.5 text-[0.62em] font-medium text-white/80">
            <RefreshCw className="size-2.5 text-[rgb(var(--accent))]" /> Session
          </p>
          <p className="mt-1.5 flex items-center gap-1 text-[0.56em] text-emerald-300">
            <span className="size-1.5 rounded-full bg-emerald-400" /> Maintained
          </p>
        </div>
        <div className="rounded-[1.4cqw] border border-white/12 bg-[#16161c]/95 p-2.5 shadow-[0_1.5cqw_4cqw_-1cqw_rgb(0_0_0/0.7)]">
          <p className="flex items-center gap-1.5 text-[0.62em] font-medium text-white/80">
            <Activity className="size-2.5 text-[rgb(var(--accent))]" /> Snapshot API
          </p>
          <div className="mt-2 flex h-5 items-end gap-0.5">
            {[40, 65, 50, 80, 60, 90, 70].map((h, i) => (
              <span key={i} className="flex-1 rounded-t-[0.3cqw] bg-[rgb(var(--accent)/0.5)]" style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>
        <div className="rounded-[1.4cqw] border border-white/12 bg-[#16161c]/95 p-2.5 shadow-[0_1.5cqw_4cqw_-1cqw_rgb(0_0_0/0.7)]">
          <p className="text-[0.56em] tracking-wider text-white/45 uppercase">Deploy</p>
          <div className="mt-1.5 flex items-center justify-between text-white/75">
            <BrandIcon name="githubactions" className="size-3.5" />
            <span className="mx-1 h-px flex-1 border-t border-dashed border-white/25" />
            <BrandIcon name="cloudflarepages" className="size-3.5 text-orange-300" />
            <Check className="ml-1 size-3 text-emerald-300" strokeWidth={3} />
          </div>
        </div>
      </div>
    </>
  )
}
