import { z } from 'zod'
import { inquiryOptions, isFormDeliveryEnabled } from '@/data/contact'

/**
 * Project inquiry form: schema, brief builder and (optional) delivery client.
 *
 * Two modes, chosen by `platformCompliance.allowExternalFormSubmission` in `src/data/contact.ts`:
 * - "brief" (default): nothing leaves the browser. The form turns the inquiry into a
 *   ready-to-send brief that the visitor sends through marketplace messaging.
 * - "send": the inquiry is posted to `/api/contact`, which emails it (server-side secrets only).
 * Field rules are mirrored server-side in `api/contact.ts`.
 */

export const MESSAGE_MIN_LENGTH = 30
export const MESSAGE_MAX_LENGTH = 5000

const projectTypes = inquiryOptions.projectTypes
const budgetRanges = inquiryOptions.budgetRanges

export const inquirySchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, 'Please enter your name.')
      .max(100, 'Please keep your name under 100 characters.'),
    email: z.string().trim().max(254, 'This email address is too long.'),
    projectType: z.string().refine((value) => projectTypes.includes(value), 'Please choose a project type.'),
    budget: z.string().refine((value) => value === '' || budgetRanges.includes(value), 'Please choose a budget range.'),
    message: z
      .string()
      .trim()
      .min(MESSAGE_MIN_LENGTH, `Please describe your project in a little more detail (at least ${MESSAGE_MIN_LENGTH} characters).`)
      .max(MESSAGE_MAX_LENGTH, 'Please keep your description under 5,000 characters.'),
  })
  .superRefine((values, ctx) => {
    // A reply address is only needed — and only collected — when the form sends email.
    if (isFormDeliveryEnabled() && !z.email().safeParse(values.email).success) {
      ctx.addIssue({ code: 'custom', path: ['email'], message: 'Please enter a valid email address so I can reply.' })
    }
  })

export type InquiryValues = z.infer<typeof inquirySchema>

export const emptyInquiry: InquiryValues = { name: '', email: '', projectType: '', budget: '', message: '' }

/** Plain-text brief the visitor can paste into marketplace messaging. Contains only what they typed. */
export function buildProjectBrief(values: InquiryValues): string {
  return [
    'Hi Artem,',
    '',
    "I'd like to discuss a project with you.",
    '',
    `Name: ${values.name.trim()}`,
    `Project type: ${values.projectType}`,
    ...(values.budget ? [`Budget range: ${values.budget}`] : []),
    '',
    'Project description:',
    values.message.trim(),
  ].join('\n')
}

/* ---------------------------------------------------------------- */
/* Delivery ("send" mode only)                                       */
/* ---------------------------------------------------------------- */

/** Defaults to the Vercel function; override with VITE_CONTACT_ENDPOINT. */
export const CONTACT_ENDPOINT: string = import.meta.env.VITE_CONTACT_ENDPOINT || '/api/contact'

/** Field name of the hidden honeypot input. */
export const HONEYPOT_FIELD = 'company'

export type InquiryErrorKind = 'unavailable' | 'invalid' | 'duplicate' | 'failed'

export class InquiryError extends Error {
  readonly kind: InquiryErrorKind

  constructor(kind: InquiryErrorKind, message: string) {
    super(message)
    this.name = 'InquiryError'
    this.kind = kind
  }
}

interface SpamSignals {
  /** Honeypot value — real users never fill it. */
  company: string
  /** Time between the form mounting and submission. */
  elapsedMs: number
}

/** Marks when the form mounted; used to reject implausibly fast (automated) submissions. */
export function markFormStart(form: HTMLFormElement | null) {
  if (form && !form.dataset.startedAt) form.dataset.startedAt = String(Date.now())
}

export function readSpamSignals(form: HTMLFormElement | null): SpamSignals {
  const field = form?.elements.namedItem(HONEYPOT_FIELD)
  const company = field instanceof HTMLInputElement ? field.value : ''
  const startedAt = Number(form?.dataset.startedAt ?? 0)
  return { company, elapsedMs: startedAt ? Date.now() - startedAt : 0 }
}

// Duplicate protection: concurrent submits share one request, and an identical
// inquiry that was already delivered in this session is not sent again.
let inFlight: { signature: string; promise: Promise<void> } | null = null
let lastDelivered = ''

const signatureOf = (values: InquiryValues) =>
  JSON.stringify([values.name.trim(), values.email.trim().toLowerCase(), values.projectType, values.budget, values.message.trim()])

export function sendInquiry(values: InquiryValues, signals: SpamSignals): Promise<void> {
  const signature = signatureOf(values)
  if (inFlight?.signature === signature) return inFlight.promise
  if (lastDelivered === signature) {
    return Promise.reject(new InquiryError('duplicate', 'This inquiry has already been sent.'))
  }

  const promise = postInquiry(values, signals)
    .then(() => {
      lastDelivered = signature
    })
    .finally(() => {
      inFlight = null
    })
  inFlight = { signature, promise }
  return promise
}

async function postInquiry(values: InquiryValues, signals: SpamSignals): Promise<void> {
  let response: Response
  try {
    response = await fetch(CONTACT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ ...values, ...signals }),
    })
  } catch {
    throw new InquiryError('failed', 'Network error — please check your connection and try again.')
  }

  if (response.ok) return

  let serverMessage: string | undefined
  try {
    const body = (await response.json()) as { error?: unknown }
    if (typeof body.error === 'string') serverMessage = body.error
  } catch {
    // Non-JSON error body — fall through to a generic message.
  }

  if ([404, 405, 501, 503].includes(response.status)) {
    // Usually means email delivery isn't configured — show visitors a neutral message.
    throw new InquiryError('unavailable', 'The inquiry form is temporarily unavailable.')
  }
  if (response.status === 400 || response.status === 422) {
    throw new InquiryError('invalid', serverMessage ?? 'Please check the form fields and try again.')
  }
  throw new InquiryError('failed', serverMessage ?? 'Something went wrong while sending your inquiry.')
}
