import { ArrowDownLeft, ArrowUpRight, Braces, Check, Copy, CreditCard, Landmark, Nfc } from 'lucide-react'
import { BrowserWindow, FloatingChip, Skel } from './primitives'

const transactions = [
  { icon: ArrowDownLeft, label: 'Received', tone: 'bg-emerald-400/15 text-emerald-300' },
  { icon: ArrowUpRight, label: 'Instant', tone: 'bg-[rgb(var(--accent)/0.16)] text-[rgb(var(--accent))]' },
  { icon: CreditCard, label: 'Card', tone: 'bg-[rgb(var(--accent)/0.16)] text-[rgb(var(--accent))]' },
]

const onboardingSteps = [
  { label: 'Account holder', done: true },
  { label: 'Documents', done: true },
  { label: 'Identity check', done: false },
]

export function SwanVisual() {
  return (
    <>
      {/* White-labeled web banking: the account, its IBAN and recent payments */}
      <BrowserWindow url="web banking" className="top-5 left-5 h-52 w-58" bodyClassName="flex flex-col p-3">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-[0.8em] font-semibold text-white/90">
            <Landmark className="size-3.5 text-[rgb(var(--accent))]" /> Business account
          </span>
          <span className="rounded-full bg-emerald-400/15 px-1.5 py-0.5 text-[0.55em] font-medium text-emerald-300">
            Open
          </span>
        </div>

        <p className="mt-3 text-[0.55em] font-medium tracking-wider text-white/45 uppercase">Balance</p>
        <Skel className="mt-1.5 h-2 w-2/5 bg-white/30" />

        <div className="mt-3 flex items-center gap-2 rounded-[0.8cqw] border border-white/10 bg-white/[0.03] px-2 py-1.5">
          <span className="font-mono text-[0.55em] font-medium text-[rgb(var(--accent))]">IBAN</span>
          <Skel className="flex-1 bg-white/18" />
          <Copy className="size-2.5 text-white/40" />
        </div>

        <p className="mt-3 text-[0.55em] font-medium tracking-wider text-white/45 uppercase">Transactions</p>
        <div className="mt-1 flex flex-1 flex-col justify-around">
          {transactions.map(({ icon: Icon, label, tone }) => (
            <div key={label} className="flex items-center gap-2">
              <span className={`grid size-4.5 shrink-0 place-items-center rounded-[0.8cqw] ${tone}`}>
                <Icon className="size-2.5" />
              </span>
              <span className="flex-1 space-y-1">
                <Skel className="w-3/4" />
                <Skel className="w-2/5 bg-white/8" />
              </span>
              <span className="w-9 text-right text-[0.55em] text-white/50">{label}</span>
            </div>
          ))}
        </div>
      </BrowserWindow>

      {/* Issued card */}
      <div className="absolute top-6 left-65 flex h-20 w-31 -rotate-3 flex-col justify-between overflow-hidden rounded-[1.6cqw] border border-white/20 bg-linear-to-br from-[rgb(var(--accent)/0.95)] via-[rgb(var(--accent)/0.55)] to-[#1b1530] p-2.5 shadow-[0_2cqw_6cqw_-1cqw_rgb(0_0_0/0.75)]">
        <span className="absolute -top-8 -right-6 size-24 rounded-full bg-white/10" />
        <div className="relative flex items-center justify-between">
          <span className="h-3.5 w-5 rounded-[0.5cqw] border border-amber-100/40 bg-linear-to-br from-amber-100/80 to-amber-400/60" />
          <Nfc className="size-3.5 text-white/75" />
        </div>
        <p className="relative font-mono text-[0.6em] tracking-[0.18em] text-white/85">•••• •••• •••• ••••</p>
        <div className="relative flex items-end justify-between">
          <Skel className="w-2/5 bg-white/45" />
          <span className="text-[0.5em] font-semibold tracking-wider text-white/80 uppercase">Virtual</span>
        </div>
      </div>

      {/* Onboarding with KYC */}
      <div className="absolute top-31 left-65 flex h-24 w-31 flex-col overflow-hidden rounded-[1.6cqw] border border-white/12 bg-[#101015]/95 shadow-[0_2cqw_6cqw_-1cqw_rgb(0_0_0/0.7)]">
        <div className="flex items-center justify-between border-b border-white/8 px-2.5 py-1.5">
          <span className="text-[0.7em] font-semibold text-white/85">Onboarding</span>
          <span className="rounded-full border border-white/12 px-1.5 py-0.5 text-[0.5em] text-white/55">Company</span>
        </div>
        <div className="flex flex-1 flex-col justify-around px-2.5">
          {onboardingSteps.map((step) => (
            <div key={step.label} className="flex items-center gap-2">
              <span
                className={
                  step.done
                    ? 'grid size-3.5 shrink-0 place-items-center rounded-full bg-emerald-400/20 text-emerald-300'
                    : 'grid size-3.5 shrink-0 place-items-center rounded-full border border-[rgb(var(--accent))] bg-[rgb(var(--accent)/0.15)] shadow-[0_0_0_0.6cqw_rgb(var(--accent)/0.12)]'
                }
              >
                {step.done ? (
                  <Check className="size-2" strokeWidth={3} />
                ) : (
                  <span className="size-1 rounded-full bg-[rgb(var(--accent))] motion-safe:animate-pulse" />
                )}
              </span>
              <span className={`text-[0.6em] ${step.done ? 'text-white/70' : 'font-medium text-white/90'}`}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <FloatingChip className="top-53 left-32">
        <Braces className="size-3 text-[rgb(var(--accent))]" />
        GraphQL API · accounts, cards, payments
      </FloatingChip>
    </>
  )
}
