import { House, Search, User, Heart } from 'lucide-react'
import { BrandIcon } from '@/components/ui/BrandIcon'
import { FloatingChip, Phone, Skel } from './primitives'

function AppScreen() {
  return (
    <>
      <div className="mt-4.5 flex items-center justify-between px-2">
        <span className="space-y-1">
          <Skel className="w-8 bg-white/30" />
          <Skel className="w-5" />
        </span>
        <span className="size-3.5 rounded-full bg-linear-to-br from-[rgb(var(--accent))] to-violet-500" />
      </div>
      <div className="mx-2 mt-2 h-10 rounded-[1.2cqw] bg-linear-to-br from-[rgb(var(--accent)/0.55)] via-violet-500/30 to-transparent p-1.5">
        <Skel className="w-1/2 bg-white/60" />
        <Skel className="mt-1 w-1/3 bg-white/40" />
      </div>
      <div className="mx-2 mt-2 grid flex-1 grid-cols-2 gap-1.5">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="rounded-[1cqw] border border-white/8 bg-white/[0.04]" />
        ))}
      </div>
      <div className="mt-2 flex items-center justify-around border-t border-white/8 py-1.5 text-white/40">
        <House className="size-2.5 text-[rgb(var(--accent))]" />
        <Search className="size-2.5" />
        <Heart className="size-2.5" />
        <User className="size-2.5" />
      </div>
    </>
  )
}

export function Style4uVisual() {
  return (
    <>
      <Phone className="top-4 left-22 h-48 w-25">
        <AppScreen />
      </Phone>
      <Phone className="top-4 left-53 h-48 w-25">
        <AppScreen />
      </Phone>
      <span className="absolute top-53.5 left-22 w-25 text-center text-[0.6em] tracking-wider text-white/45 uppercase">iOS</span>
      <span className="absolute top-53.5 left-53 w-25 text-center text-[0.6em] tracking-wider text-white/45 uppercase">
        Android
      </span>
      <FloatingChip className="top-24 left-1/2 -translate-x-1/2">
        <BrandIcon name="expo" className="size-3" />
        <BrandIcon name="typescript" className="size-3 text-sky-300" />
        One codebase
      </FloatingChip>
    </>
  )
}
