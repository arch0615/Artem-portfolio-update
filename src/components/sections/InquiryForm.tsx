import { useId, useState, type BaseSyntheticEvent, type ReactNode } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, m } from 'framer-motion'
import {
  AlertCircle,
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  ChevronDown,
  ClipboardCopy,
  LoaderCircle,
  PencilLine,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react'
import { getContactMethods, getMarketplaceName, getMarketplaceUrl, inquiryOptions, isFormDeliveryEnabled } from '@/data/contact'
import {
  buildProjectBrief,
  emptyInquiry,
  HONEYPOT_FIELD,
  InquiryError,
  inquirySchema,
  markFormStart,
  MESSAGE_MAX_LENGTH,
  readSpamSignals,
  sendInquiry,
  type InquiryValues,
} from '@/lib/contact'
import { cn } from '@/lib/cn'
import { easeOutExpo } from '@/lib/motion'
import { Button, ButtonLink } from '@/components/ui/Button'

type Status =
  | { state: 'idle' }
  | { state: 'brief'; brief: string }
  | { state: 'sent'; name: string }
  | { state: 'error'; error: InquiryError }

const deliveryEnabled = isFormDeliveryEnabled()

const fieldClasses =
  'block w-full rounded-xl border border-line bg-canvas/60 px-4 py-3 text-[0.95rem] text-fg placeholder:text-fg-subtle/80 outline-none transition-[border-color,box-shadow,background-color] duration-200 focus:border-accent-soft/70 focus:bg-canvas focus:ring-4 focus:ring-accent/15 aria-[invalid=true]:border-rose-400/60 aria-[invalid=true]:focus:ring-rose-400/15'

const panelMotion = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.35, ease: easeOutExpo },
}

export default function InquiryForm() {
  const formId = useId()
  const [status, setStatus] = useState<Status>({ state: 'idle' })

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<InquiryValues>({
    resolver: zodResolver(inquirySchema),
    defaultValues: emptyInquiry,
    mode: 'onTouched',
  })

  const messageLength = useWatch({ control, name: 'message' })?.length ?? 0

  const onSubmit = async (values: InquiryValues, event?: BaseSyntheticEvent) => {
    // Marketplace mode: nothing leaves the browser — prepare a brief to send via platform messaging.
    if (!deliveryEnabled) {
      setStatus({ state: 'brief', brief: buildProjectBrief(values) })
      return
    }

    setStatus({ state: 'idle' })
    const form = event?.target instanceof HTMLFormElement ? event.target : null
    const signals = readSpamSignals(form)
    try {
      // A filled honeypot means a bot: show success without sending anything.
      if (!signals.company) await sendInquiry(values, signals)
      setStatus({ state: 'sent', name: values.name.trim().split(/\s+/)[0] })
      reset()
    } catch (error) {
      setStatus({
        state: 'error',
        error: error instanceof InquiryError ? error : new InquiryError('failed', 'Something went wrong.'),
      })
    }
  }

  const describedBy = (field: keyof InquiryValues) => (errors[field] ? `${formId}-${field}-error` : undefined)

  return (
    <div className="relative">
      <AnimatePresence mode="wait" initial={false}>
        {status.state === 'sent' ? (
          <m.div key="sent" {...panelMotion} role="status" className="flex min-h-[28rem] flex-col items-center justify-center px-4 text-center">
            <span className="grid size-14 place-items-center rounded-2xl border border-emerald-400/30 bg-emerald-400/10 text-emerald-300">
              <CheckCircle2 aria-hidden className="size-7" strokeWidth={1.75} />
            </span>
            <h3 className="mt-6 text-2xl font-semibold tracking-tight text-fg">Inquiry sent</h3>
            <p className="mt-3 max-w-sm leading-relaxed text-fg-muted">
              Thank you{status.name ? `, ${status.name}` : ''}. I’ll review your project details and reply by email.
            </p>
            <Button variant="secondary" className="mt-8" onClick={() => setStatus({ state: 'idle' })}>
              <RotateCcw aria-hidden className="size-4" />
              Send another inquiry
            </Button>
          </m.div>
        ) : status.state === 'brief' ? (
          <m.div key="brief" {...panelMotion}>
            <BriefPanel brief={status.brief} onEdit={() => setStatus({ state: 'idle' })} />
          </m.div>
        ) : (
          <m.form
            key="form"
            {...panelMotion}
            ref={markFormStart}
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            aria-describedby={status.state === 'error' ? `${formId}-status` : undefined}
            className="space-y-5"
          >
            <div className={cn('grid grid-cols-1 gap-5', deliveryEnabled && 'sm:grid-cols-2')}>
              <Field id={`${formId}-name`} label="Name" error={errors.name?.message}>
                <input
                  id={`${formId}-name`}
                  type="text"
                  autoComplete="name"
                  placeholder="Your name"
                  aria-invalid={errors.name ? true : undefined}
                  aria-describedby={describedBy('name')}
                  className={fieldClasses}
                  {...register('name')}
                />
              </Field>
              {deliveryEnabled && (
                <Field id={`${formId}-email`} label="Email" hint="For my reply" error={errors.email?.message}>
                  <input
                    id={`${formId}-email`}
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="you@company.com"
                    aria-invalid={errors.email ? true : undefined}
                    aria-describedby={describedBy('email')}
                    className={fieldClasses}
                    {...register('email')}
                  />
                </Field>
              )}
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field id={`${formId}-projectType`} label="Project type" error={errors.projectType?.message}>
                <SelectShell>
                  <select
                    id={`${formId}-projectType`}
                    aria-invalid={errors.projectType ? true : undefined}
                    aria-describedby={describedBy('projectType')}
                    className={cn(fieldClasses, 'appearance-none pr-10')}
                    {...register('projectType')}
                  >
                    <option value="" disabled>
                      Select a project type
                    </option>
                    {inquiryOptions.projectTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </SelectShell>
              </Field>
              <Field id={`${formId}-budget`} label="Budget range" hint="Optional" error={errors.budget?.message}>
                <SelectShell>
                  <select
                    id={`${formId}-budget`}
                    aria-invalid={errors.budget ? true : undefined}
                    aria-describedby={describedBy('budget')}
                    className={cn(fieldClasses, 'appearance-none pr-10')}
                    {...register('budget')}
                  >
                    <option value="">Prefer not to say</option>
                    {inquiryOptions.budgetRanges.map((range) => (
                      <option key={range} value={range}>
                        {range}
                      </option>
                    ))}
                  </select>
                </SelectShell>
              </Field>
            </div>

            <Field
              id={`${formId}-message`}
              label="Project description"
              error={errors.message?.message}
              hint={`${messageLength.toLocaleString('en-US')} / ${MESSAGE_MAX_LENGTH.toLocaleString('en-US')}`}
            >
              <textarea
                id={`${formId}-message`}
                rows={6}
                maxLength={MESSAGE_MAX_LENGTH}
                placeholder="What are you building, what problem should it solve, and what would a successful result look like?"
                aria-invalid={errors.message ? true : undefined}
                aria-describedby={describedBy('message')}
                className={cn(fieldClasses, 'min-h-40 resize-y')}
                {...register('message')}
              />
            </Field>

            {/* Honeypot: hidden from people and assistive tech; bots tend to fill every field. */}
            {deliveryEnabled && (
              <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
                <label htmlFor={`${formId}-company`}>Company</label>
                <input id={`${formId}-company`} name={HONEYPOT_FIELD} type="text" tabIndex={-1} autoComplete="off" />
              </div>
            )}

            <AnimatePresence initial={false}>
              {status.state === 'error' && (
                <m.div
                  key="error"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: easeOutExpo }}
                  className="overflow-hidden"
                >
                  <ErrorNotice id={`${formId}-status`} error={status.error} />
                </m.div>
              )}
            </AnimatePresence>

            <div className="flex flex-col-reverse items-start gap-4 pt-1 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-xs text-xs leading-relaxed text-fg-subtle">
                {deliveryEnabled
                  ? 'Your details are only used to reply to your inquiry.'
                  : `Nothing is sent from this page — you’ll get a brief to send me through ${getMarketplaceName() || 'marketplace'} messaging.`}
              </p>
              <Button type="submit" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
                {isSubmitting ? (
                  <>
                    <LoaderCircle aria-hidden className="size-4 animate-spin" />
                    Sending…
                  </>
                ) : (
                  <>
                    {deliveryEnabled ? 'Send Inquiry' : 'Prepare Inquiry'}
                    <ArrowRight aria-hidden className="size-4 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
                  </>
                )}
              </Button>
            </div>
            <p className="sr-only" role="status" aria-live="polite">
              {isSubmitting ? 'Sending your inquiry…' : ''}
            </p>
          </m.form>
        )}
      </AnimatePresence>
    </div>
  )
}

/** Shown in marketplace mode: the visitor copies the brief and sends it via platform messaging. */
function BriefPanel({ brief, onEdit }: { brief: string; onEdit: () => void }) {
  const briefId = useId()
  const [copy, setCopy] = useState<'idle' | 'copied' | 'manual'>('idle')
  const marketplaceName = getMarketplaceName()
  const marketplaceUrl = getMarketplaceUrl()
  const where = marketplaceName || 'the freelance marketplace where you found my profile'

  const copyBrief = async () => {
    try {
      await navigator.clipboard.writeText(brief)
      setCopy('copied')
      window.setTimeout(() => setCopy('idle'), 2500)
    } catch {
      // Clipboard blocked (permissions / insecure context): select the text for a manual copy.
      const field = document.getElementById(briefId)
      if (field instanceof HTMLTextAreaElement) {
        field.focus()
        field.select()
      }
      setCopy('manual')
    }
  }

  return (
    <div role="status" aria-live="polite">
      <div className="flex items-start gap-4">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-emerald-400/30 bg-emerald-400/10 text-emerald-300">
          <CheckCircle2 aria-hidden className="size-5" strokeWidth={1.75} />
        </span>
        <div>
          <h3 className="text-xl font-semibold tracking-tight text-fg">Your project brief is ready</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">
            Send it to me through {marketplaceName ? `${marketplaceName} messages` : `the messaging system of ${where}`}.
          </p>
        </div>
      </div>

      <ol className="mt-6 grid gap-2 text-sm text-fg-muted sm:grid-cols-3">
        {['Copy the brief', marketplaceName ? `Open ${marketplaceName}` : 'Open the marketplace', 'Paste it in a message to me'].map(
          (step, index) => (
            <li key={step} className="flex items-center gap-2.5 rounded-lg border border-line bg-white/[0.02] px-3 py-2">
              <span className="font-mono text-[0.7rem] text-accent-soft">0{index + 1}</span>
              {step}
            </li>
          ),
        )}
      </ol>

      <label htmlFor={briefId} className="sr-only">
        Project brief
      </label>
      <textarea
        id={briefId}
        readOnly
        value={brief}
        rows={9}
        className="mt-5 block w-full resize-none rounded-xl border border-line bg-canvas/70 px-4 py-3 font-mono text-[0.8rem] leading-relaxed text-fg-muted outline-none focus:border-accent-soft/60"
      />

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Button onClick={copyBrief} size="lg" className="w-full sm:w-auto">
          {copy === 'copied' ? <Check aria-hidden className="size-4" /> : <ClipboardCopy aria-hidden className="size-4" />}
          {copy === 'copied' ? 'Copied' : 'Copy brief'}
        </Button>
        {marketplaceUrl && (
          <ButtonLink href={marketplaceUrl} variant="secondary" size="lg" className="w-full sm:w-auto">
            Open {marketplaceName || 'marketplace'}
            <ArrowUpRight aria-hidden className="size-4" />
            <span className="sr-only">(opens in a new tab)</span>
          </ButtonLink>
        )}
        <Button onClick={onEdit} variant="ghost" size="lg" className="w-full sm:w-auto">
          <PencilLine aria-hidden className="size-4" />
          Edit details
        </Button>
      </div>
      <p className="sr-only" aria-live="polite">
        {copy === 'copied' ? 'Brief copied to clipboard.' : ''}
      </p>
      {copy === 'manual' && (
        <p className="mt-3 text-sm text-fg-muted">The brief is selected — press Ctrl+C (⌘C on Mac) to copy it.</p>
      )}

      <p className="mt-6 flex items-start gap-2.5 border-t border-line pt-5 text-xs leading-relaxed text-fg-subtle">
        <ShieldCheck aria-hidden className="mt-px size-4 shrink-0 text-emerald-300/80" />
        Keeping our conversation on {where} keeps your project, messages and payments protected by the platform.
      </p>
    </div>
  )
}

function ErrorNotice({ id, error }: { id: string; error: InquiryError }) {
  // Only offer alternatives that are configured AND permitted.
  const alternative = getContactMethods().find((method) => method.key === 'platform' || method.key === 'email')
  return (
    <div id={id} role="alert" className="flex gap-3 rounded-xl border border-rose-400/25 bg-rose-400/[0.07] p-4 text-sm">
      <AlertCircle aria-hidden className="mt-0.5 size-4 shrink-0 text-rose-300" />
      <div className="space-y-1 text-fg-muted">
        <p className="font-medium text-fg">{error.message}</p>
        <p>
          {error.kind === 'invalid' ? (
            'Please review the highlighted fields.'
          ) : error.kind === 'duplicate' ? (
            'I already have it — no need to send it again.'
          ) : alternative ? (
            <>
              You can also reach me via{' '}
              <a
                href={alternative.href}
                {...(alternative.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="text-accent-soft underline-offset-4 hover:underline"
              >
                {alternative.display}
              </a>
              .
            </>
          ) : (
            'Please try again in a little while.'
          )}
        </p>
      </div>
    </div>
  )
}

function SelectShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative">
      {children}
      <ChevronDown aria-hidden className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-fg-subtle" />
    </div>
  )
}

interface FieldProps {
  id: string
  label: string
  error?: string
  hint?: string
  children: ReactNode
}

function Field({ id, label, error, hint, children }: FieldProps) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm font-medium text-fg">
          {label}
        </label>
        {hint && <span className="font-mono text-[0.68rem] text-fg-subtle">{hint}</span>}
      </div>
      {children}
      <AnimatePresence initial={false}>
        {error && (
          <m.p
            id={`${id}-error`}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="mt-2 flex items-center gap-1.5 text-[0.8rem] text-rose-300"
          >
            <AlertCircle aria-hidden className="size-3.5 shrink-0" />
            {error}
          </m.p>
        )}
      </AnimatePresence>
    </div>
  )
}
