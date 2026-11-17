import { Bell, Camera, MapPin, Search, Users } from 'lucide-react'
import { FloatingChip, MapLines, Phone, Skel } from './primitives'

const queue = [
  { status: 'Approved', tone: 'bg-emerald-400/15 text-emerald-300' },
  { status: 'Duplicate', tone: 'bg-amber-400/15 text-amber-300' },
  { status: 'Pending', tone: 'bg-white/10 text-white/60' },
]

export function RadarVisual() {
  return (
    <>
      <MapLines className="opacity-60" />

      {/* Admin moderation panel (web) */}
      <div className="absolute top-8 left-42 flex h-44 w-52 flex-col overflow-hidden rounded-[1.6cqw] border border-white/12 bg-[#101015]/95 shadow-[0_2cqw_6cqw_-1cqw_rgb(0_0_0/0.7)]">
        <div className="flex items-center justify-between border-b border-white/8 px-3 py-2">
          <span className="text-[0.75em] font-semibold text-white/85">Moderation</span>
          <span className="flex items-center gap-1 text-[0.6em] text-white/45">
            <Users className="size-2.5" /> Admin
          </span>
        </div>
        <div className="flex flex-1 flex-col justify-around px-3">
          {queue.map((row) => (
            <div key={row.status} className="flex items-center gap-2">
              <span className="grid size-6 shrink-0 place-items-center rounded-[0.8cqw] bg-[rgb(var(--accent)/0.14)] text-[rgb(var(--accent))]">
                <Camera className="size-3" />
              </span>
              <span className="flex-1 space-y-1">
                <Skel className="w-4/5" />
                <Skel className="w-1/2 bg-white/8" />
              </span>
              <span className={`rounded-full px-1.5 py-0.5 text-[0.55em] font-medium ${row.tone}`}>{row.status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile app */}
      <Phone className="top-4 left-12 h-55 w-29">
        <div className="relative z-0 mx-1.5 mt-4 flex h-3.5 items-center gap-1 rounded-full bg-white/[0.07] px-1.5">
          <Search className="size-2 text-white/50" />
          <Skel className="w-1/2 bg-white/15" />
        </div>
        <div className="relative flex-1">
          <MapLines />
          {/* Radar */}
          <div className="absolute top-[42%] left-1/2 size-22 -translate-x-1/2 -translate-y-1/2">
            <span className="absolute inset-0 rounded-full border border-[rgb(var(--accent)/0.5)] bg-[rgb(var(--accent)/0.06)] motion-safe:animate-radar" />
            <span className="absolute inset-[22%] rounded-full border border-[rgb(var(--accent)/0.25)]" />
            <span className="absolute inset-[40%] grid place-items-center rounded-full bg-[rgb(var(--accent)/0.25)]">
              <MapPin className="size-3 text-[rgb(var(--accent))]" />
            </span>
          </div>
          <span className="absolute top-[22%] left-[22%] size-1.5 rounded-full bg-[rgb(var(--accent))] shadow-[0_0_1.5cqw_rgb(var(--accent))]" />
          <span className="absolute top-[58%] left-[74%] size-1.5 rounded-full bg-amber-300 shadow-[0_0_1.5cqw_rgb(252_211_77)]" />
          <span className="absolute top-[30%] left-[78%] size-1 rounded-full bg-white/60" />
        </div>
        <div className="m-1.5 flex items-center gap-1.5 rounded-[1.4cqw] border border-white/10 bg-[#1a1a21] p-1.5">
          <span className="grid size-4.5 shrink-0 place-items-center rounded-[0.8cqw] bg-[rgb(var(--accent)/0.2)] text-[rgb(var(--accent))]">
            <Bell className="size-2.5" />
          </span>
          <span className="flex-1 space-y-1">
            <Skel className="w-4/5 bg-white/25" />
            <Skel className="w-1/2" />
          </span>
        </div>
      </Phone>

      <FloatingChip className="top-52 left-56">
        <MapPin className="size-3 text-[rgb(var(--accent))]" />
        Geospatial search
      </FloatingChip>
    </>
  )
}
