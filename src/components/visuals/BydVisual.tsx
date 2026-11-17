import { BookOpen, FileText, Send, Sparkles } from 'lucide-react'
import { BrowserWindow, Skel } from './primitives'

export function BydVisual() {
  return (
    <BrowserWindow className="top-5 left-6 h-53 w-88" bodyClassName="flex">
      <aside className="flex w-24 shrink-0 flex-col gap-2 border-r border-white/8 bg-white/[0.02] p-2.5">
        <p className="flex items-center gap-1 text-[0.62em] font-semibold text-white/80">
          <BookOpen className="size-2.5 text-[rgb(var(--accent))]" /> Library
        </p>
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`flex items-center gap-1.5 rounded-[0.6cqw] px-1 py-1 ${i === 1 ? 'bg-[rgb(var(--accent)/0.12)]' : ''}`}
          >
            <FileText className={`size-2.5 shrink-0 ${i === 1 ? 'text-[rgb(var(--accent))]' : 'text-white/35'}`} />
            <Skel className={i === 1 ? 'w-full bg-white/30' : 'w-4/5'} />
          </div>
        ))}
      </aside>

      <div className="flex flex-1 flex-col p-3">
        <div className="ml-auto w-3/5 space-y-1 rounded-[1.2cqw] rounded-br-[0.3cqw] bg-[rgb(var(--accent)/0.22)] p-2">
          <Skel className="w-full bg-white/45" />
          <Skel className="w-2/3 bg-white/35" />
        </div>

        <div className="mt-2.5 flex gap-1.5">
          <span className="grid size-4.5 shrink-0 place-items-center rounded-full bg-linear-to-br from-[rgb(var(--accent))] to-indigo-500 text-white">
            <Sparkles className="size-2.5" />
          </span>
          <div className="flex-1 space-y-1.5 rounded-[1.2cqw] rounded-tl-[0.3cqw] border border-white/8 bg-white/[0.03] p-2">
            <Skel className="w-full bg-white/25" />
            <Skel className="w-11/12" />
            <Skel className="w-3/4" />
            <div className="flex gap-1 pt-1">
              {[0, 1].map((i) => (
                <span
                  key={i}
                  className="flex items-center gap-1 rounded-full border border-[rgb(var(--accent)/0.35)] bg-[rgb(var(--accent)/0.08)] px-1.5 py-0.5 text-[0.5em] text-white/70"
                >
                  <FileText className="size-2 text-[rgb(var(--accent))]" /> Source {i + 1}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-auto flex items-center gap-1.5 rounded-full border border-white/12 bg-black/30 py-1 pr-1 pl-2.5">
          <span className="flex-1 truncate text-[0.58em] text-white/40">Ask the technical library…</span>
          <span className="grid size-4 place-items-center rounded-full bg-[rgb(var(--accent))] text-white">
            <Send className="size-2" />
          </span>
        </div>
      </div>
    </BrowserWindow>
  )
}
