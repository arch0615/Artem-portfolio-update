import { Building2, House, Search } from 'lucide-react'
import { BrowserWindow, Skel } from './primitives'

export function SolidHouseVisual() {
  return (
    <BrowserWindow url="solidhouse.ro" className="top-5 left-7 h-54 w-86" bodyClassName="flex flex-col p-3">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <span className="grid size-4 place-items-center rounded-[0.7cqw] bg-[rgb(var(--accent)/0.2)] text-[rgb(var(--accent))]">
            <House className="size-2.5" />
          </span>
          <Skel className="w-10 bg-white/30" />
        </span>
        <span className="flex gap-2">
          <Skel className="w-5" />
          <Skel className="w-5" />
          <Skel className="w-5" />
          <span className="h-2.5 w-8 rounded-full bg-[rgb(var(--accent)/0.75)]" />
        </span>
      </div>

      <div className="relative mt-2.5 overflow-hidden rounded-[1.2cqw] bg-linear-to-br from-[rgb(var(--accent)/0.28)] via-rose-400/10 to-transparent p-3">
        <Building2 className="absolute -right-2 -bottom-3 size-20 text-white/[0.07]" strokeWidth={1} />
        <Skel className="h-1.5 w-32 bg-white/50" />
        <Skel className="mt-1.5 h-1.5 w-22 bg-white/35" />
        <div className="mt-3 flex w-44 items-center gap-1.5 rounded-full border border-white/15 bg-black/40 px-2 py-1">
          <Search className="size-2.5 text-white/50" />
          <Skel className="flex-1 bg-white/15" />
          <span className="h-2.5 w-7 rounded-full bg-[rgb(var(--accent))]" />
        </div>
      </div>

      <div className="mt-2.5 grid flex-1 grid-cols-3 gap-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex flex-col overflow-hidden rounded-[1cqw] border border-white/8 bg-white/[0.02]">
            <div className="relative grid flex-1 place-items-center bg-linear-to-br from-white/[0.07] to-[rgb(var(--accent)/0.08)]">
              <House className="size-5 text-white/20" strokeWidth={1.25} />
            </div>
            <div className="space-y-1 p-1.5">
              <Skel className="w-4/5 bg-white/25" />
              <Skel className="w-1/2 bg-[rgb(var(--accent)/0.5)]" />
            </div>
          </div>
        ))}
      </div>
    </BrowserWindow>
  )
}
