import { z } from 'zod'

/**
 * POST /api/contact — Vercel serverless function (Node.js runtime).
 *
 * Delivers project inquiries through the Resend REST API. Only used when
 * `platformCompliance.allowExternalFormSubmission` is true in `src/data/contact.ts`
 * (check your marketplace's rules first); otherwise the form never calls it.
 * Required environment variables (set them in Vercel → Project → Settings → Environment Variables):
 *   RESEND_API_KEY     – Resend API key
 *   CONTACT_TO_EMAIL   – recipient address(es), comma-separated
 *   CONTACT_FROM_EMAIL – verified sender, e.g. "Portfolio <hello@yourdomain.com>" (optional)
 *
 * Spam protection: a hidden honeypot field and a minimum fill time. Suspected bots
 * receive a normal success response so they get no signal to adapt.
 *
 * Keep this file self-contained (no imports from /src) so it bundles cleanly on Vercel.
 * The field rules mirror `src/lib/contact.ts`; the option lists mirror `src/data/contact.ts`.
 */

const MIN_FILL_TIME_MS = 2500

const PROJECT_TYPES = [
  'AI Development',
  'Full-Stack Web Development',
  'Mobile Application',
  'Business Automation',
  'API Integration',
  'Backend Development',
  'Other',
] as const

const payloadSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.email().max(254),
  projectType: z.enum(PROJECT_TYPES),
  budget: z.string().trim().max(40).optional(),
  message: z.string().trim().min(30).max(5000),
  company: z.string().max(200).optional(),
  elapsedMs: z.number().int().nonnegative().optional(),
})

const json = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  })

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

export async function POST(request: Request): Promise<Response> {
  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return json(400, { ok: false, error: 'Invalid request body.' })
  }

  const parsed = payloadSchema.safeParse(payload)
  if (!parsed.success) {
    return json(422, { ok: false, error: 'Please check the form fields and try again.' })
  }

  const { name, email, projectType, budget, message, company, elapsedMs } = parsed.data
  const budgetLine = budget ? budget : 'Not specified'

  // Honeypot filled or submitted implausibly fast → silently accept and drop.
  if (company || (elapsedMs !== undefined && elapsedMs < MIN_FILL_TIME_MS)) {
    return json(200, { ok: true })
  }

  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.CONTACT_TO_EMAIL
  const from = process.env.CONTACT_FROM_EMAIL || 'Portfolio Contact <onboarding@resend.dev>'

  if (!apiKey || !to) {
    return json(503, { ok: false, error: 'The contact form is not configured yet.' })
  }

  const text = `New project inquiry from your portfolio\n\nName: ${name}\nEmail: ${email}\nProject type: ${projectType}\nBudget range: ${budgetLine}\n\n${message}\n`
  const html = `
    <div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;line-height:1.6;color:#111">
      <h2 style="margin:0 0 16px">New project inquiry</h2>
      <p style="margin:0"><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p style="margin:0"><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p style="margin:0"><strong>Project type:</strong> ${escapeHtml(projectType)}</p>
      <p style="margin:0 0 16px"><strong>Budget range:</strong> ${escapeHtml(budgetLine)}</p>
      <p style="white-space:pre-wrap;margin:0">${escapeHtml(message)}</p>
    </div>`

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: to.split(',').map((address) => address.trim()).filter(Boolean),
        reply_to: email,
        subject: `[Portfolio] ${projectType} inquiry from ${name.replace(/[\r\n]+/g, ' ')}`,
        text,
        html,
      }),
    })

    if (!response.ok) {
      console.error('[contact] Resend responded with', response.status, await response.text())
      return json(502, { ok: false, error: 'The message could not be delivered. Please try again later.' })
    }
  } catch (error) {
    console.error('[contact] Failed to reach Resend', error)
    return json(502, { ok: false, error: 'The message could not be delivered. Please try again later.' })
  }

  return json(200, { ok: true })
}
