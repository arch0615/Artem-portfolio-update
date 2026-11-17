import { BrowserWindow, Skel } from './primitives'

const windows = [
  { url: 'veja.dourasoft.com.br', className: 'top-3 left-31' },
  { url: 'lotericas.dourasoft.com.br', className: 'top-7.5 left-23' },
  { url: 'assinaturas.dourasoft.com.br', className: 'top-12 left-15' },
]

export function DourasoftVisual() {
  return (
    <>
      {windows.map((w, i) => (
        <BrowserWindow
          key={w.url}
          url={w.url}
          className={`${w.className} h-38 w-62`}
          bodyClassName="p-3"
        >
          <div style={{ opacity: 0.35 + i * 0.15 }} className="space-y-1.5">
            <Skel className="w-1/3 bg-white/25" />
            <Skel className="w-1/2" />
          </div>
        </BrowserWindow>
      ))}

      <BrowserWindow url="dourasoft.com.br" className="top-17 left-7 h-42 w-62" bodyClassName="flex gap-2 p-2.5">
        <div className="flex w-11 shrink-0 flex-col gap-1.5 rounded-[0.8cqw] bg-white/[0.03] p-1.5">
          <span className="mb-1 h-2 w-6 rounded-full bg-[rgb(var(--accent)/0.7)]" />
          {[0, 1, 2, 3].map((i) => (
            <Skel key={i} className={i === 0 ? 'bg-white/30' : ''} />
          ))}
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <div className="grid grid-cols-3 gap-1.5">
            {[0, 1, 2].map((i) => (
              <div key={i} className="rounded-[0.8cqw] border border-white/8 bg-white/[0.03] p-1.5">
                <Skel className="w-1/2" />
                <Skel className="mt-1.5 h-1.5 w-3/4 bg-white/30" />
              </div>
            ))}
          </div>
          <div className="flex flex-1 items-end gap-1 rounded-[0.8cqw] border border-white/8 bg-white/[0.02] p-1.5">
            {[35, 55, 40, 70, 50, 85, 60, 75].map((h, i) => (
              <span
                key={i}
                className="flex-1 rounded-t-[0.3cqw] bg-linear-to-t from-[rgb(var(--accent)/0.25)] to-[rgb(var(--accent)/0.7)]"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>
      </BrowserWindow>
    </>
  )
}
