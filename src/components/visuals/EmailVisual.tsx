import { Check, Mail, ShieldCheck } from 'lucide-react'
import { BrowserWindow, FloatingChip, Skel } from './primitives'

const providers = ['SMTP', 'Resend', 'SendGrid', 'Mailgun', 'Postmark', 'SES']
const queueRows = [
  { label: 'sent', tone: 'bg-emerald-400' },
  { label: 'sent', tone: 'bg-emerald-400' },
  { label: 'retry', tone: 'bg-amber-400' },
  { label: 'queued', tone: 'bg-white/40' },
]

export function EmailVisual() {
  return (
    <>
      <BrowserWindow className="top-5 left-6 h-50 w-88" bodyClassName="flex flex-col p-3.5">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-[0.8em] font-semibold text-white/90">
            <Mail className="size-3.5 text-[rgb(var(--accent))]" /> New campaign
          </span>
          <span className="rounded-full bg-[rgb(var(--accent)/0.15)] px-2 py-0.5 text-[0.6em] font-medium text-[rgb(var(--accent))]">
            Step 4 of 6
          </span>
        </div>

        {/* Six-step wizard */}
        <div className="mt-3.5 flex items-center">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="flex flex-1 items-center last:flex-none">
              <span
                className={
                  i < 3
                    ? 'grid size-4 place-items-center rounded-full bg-[rgb(var(--accent))] text-white'
                    : i === 3
                      ? 'grid size-4 place-items-center rounded-full border border-[rgb(var(--accent))] bg-[rgb(var(--accent)/0.15)] text-[0.55em] font-semibold text-white shadow-[0_0_0_0.8cqw_rgb(var(--accent)/0.12)]'
                      : 'grid size-4 place-items-center rounded-full border border-white/15 text-[0.55em] text-white/40'
                }
              >
                {i < 3 ? <Check className="size-2.5" strokeWidth={3} /> : i + 1}
              </span>
              {i < 5 && <span className={`mx-1 h-px flex-1 ${i < 3 ? 'bg-[rgb(var(--accent)/0.7)]' : 'bg-white/12'}`} />}
            </div>
          ))}
        </div>

        <div className="mt-4 grid flex-1 grid-cols-2 gap-3">
          <div>
            <p className="text-[0.6em] font-medium tracking-wider text-white/45 uppercase">Delivery provider</p>
            <div className="mt-2 grid grid-cols-2 gap-1.5">
              {providers.map((name) => (
                <span
                  key={name}
                  className={
                    name === 'Resend'
                      ? 'rounded-[0.8cqw] border border-[rgb(var(--accent)/0.7)] bg-[rgb(var(--accent)/0.12)] px-1.5 py-1 text-center text-[0.6em] text-white'
                      : 'rounded-[0.8cqw] border border-white/10 bg-white/[0.03] px-1.5 py-1 text-center text-[0.6em] text-white/60'
                  }
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-[1cqw] border border-white/8 bg-white/[0.02] p-2">
            <div className="flex items-center justify-between">
              <p className="text-[0.6em] font-medium tracking-wider text-white/45 uppercase">Sending queue</p>
              <span className="text-[0.55em] text-white/40">rate-limited</span>
            </div>
            <div className="mt-2 space-y-1.5">
              {queueRows.map((row, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <span className={`size-1.5 shrink-0 rounded-full ${row.tone}`} />
                  <Skel className="flex-1" />
                  <span className="w-7 text-right font-mono text-[0.5em] text-white/45">{row.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </BrowserWindow>

      <FloatingChip className="top-52 left-52">
        <ShieldCheck className="size-3 text-emerald-300" />
        Webhook verified · open &amp; click tracked
      </FloatingChip>
    </>
  )
}
