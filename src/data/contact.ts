import type { ContactConfig, ContactMethod, PrimaryContactAction } from '../types'

/**
 * Contact & collaboration settings — the single source of truth for every way a
 * visitor can reach Artem: the contact section, the footer, the inquiry form and
 * the structured data in the page <head>.
 *
 * Every contact method has TWO independent switches:
 *   1. its value below — empty ('') means "not provided" and it is never shown;
 *   2. its `platformCompliance` flag — `false` hides it everywhere, even if a value exists.
 *
 * PLATFORM POLICY
 * The defaults are deliberately the strictest possible: only marketplace messaging is
 * enabled. Many freelance marketplaces prohibit sharing email addresses, phone numbers,
 * messaging apps or social profiles before a contract starts. Before enabling any other
 * method, check the CURRENT rules of every marketplace that links to this site, and only
 * enable what all of them permit. Never put contact details in images, QR codes or
 * hidden markup to get around a disabled flag.
 *
 * Only add real, verified details — never placeholders or guesses.
 *
 * NOTE: imported by the build-time SEO plugin; keep it free of browser APIs and `@/` aliases.
 */
export const contactConfig: ContactConfig = {
  fullName: 'Artem Bohomolov',
  title: 'AI Full-Stack Developer',
  specialty: 'Mobile Applications & Automation',
  introduction:
    '17+ years of experience turning business ideas into web platforms, mobile apps, AI integrations and automation systems.',
  availability: 'Available for select projects',

  /** City / country, e.g. 'Lisbon, Portugal'. Empty = hidden. */
  location: '',
  /** e.g. 'hello@yourdomain.com' */
  email: '',
  /** International format, e.g. '+351 900 000 000' */
  phone: '',
  /** International format; used to build a wa.me link */
  whatsapp: '',
  /** Full profile URL, e.g. 'https://www.linkedin.com/in/username' */
  linkedin: '',
  /** Full profile URL, e.g. 'https://github.com/username' */
  github: '',
  /** This portfolio's public URL */
  website: 'https://artem-bohomolov-portfolio.vercel.app/',

  /**
   * The marketplace where clients should message Artem. Copy the real profile URL from
   * the marketplace itself — never guess it. While empty, visitors are asked to use the
   * messaging system of the marketplace where they found the profile.
   */
  marketplace: {
    /** e.g. 'Upwork' */
    name: '',
    /** Your public profile URL on that marketplace */
    profileUrl: '',
  },

  platformCompliance: {
    allowEmail: false,
    allowPhone: false,
    allowWhatsApp: false,
    allowLinkedIn: false,
    allowGitHub: false,
    allowExternalWebsite: false,
    allowPlatformMessaging: true,
    /**
     * true  → the inquiry form emails the message to you (needs RESEND_* env vars) and asks for the sender's email.
     * false → the form prepares a project brief for the visitor to send through marketplace messaging.
     */
    allowExternalFormSubmission: false,
    allowProjectLinks: true,
  },
}

/** Options for the project inquiry form. */
export const inquiryOptions = {
  projectTypes: [
    'AI Development',
    'Full-Stack Web Development',
    'Mobile Application',
    'Business Automation',
    'API Integration',
    'Backend Development',
    'Other',
  ],
  budgetRanges: ['Under $1,000', '$1,000 – $5,000', '$5,000 – $15,000', '$15,000 – $50,000', '$50,000+', 'Not sure yet'],
}

/* ------------------------------------------------------------------------- */
/* Derived helpers — UI code should use these instead of reading raw values. */
/* ------------------------------------------------------------------------- */

const isHttpsUrl = (value: string) => /^https:\/\/[^\s]+\.[^\s]+/.test(value.trim())
const digitsOnly = (value: string) => value.replace(/\D/g, '')

export function prettyUrl(url: string): string {
  return url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')
}

/** The configured marketplace name, or '' when none is set. */
export function getMarketplaceName(): string {
  return contactConfig.marketplace.name.trim()
}

/** Marketplace messaging is enabled and has a real destination URL. */
export function getMarketplaceUrl(): string {
  const { marketplace, platformCompliance } = contactConfig
  return platformCompliance.allowPlatformMessaging && isHttpsUrl(marketplace.profileUrl) ? marketplace.profileUrl.trim() : ''
}

/** Every contact method that is both provided and permitted, in display order. */
export function getContactMethods(): ContactMethod[] {
  const c = contactConfig
  const allow = c.platformCompliance
  const methods: ContactMethod[] = []

  const marketplaceUrl = getMarketplaceUrl()
  if (marketplaceUrl) {
    const name = getMarketplaceName()
    methods.push({
      key: 'platform',
      label: name ? `${name} messages` : 'Marketplace messages',
      display: name ? `Message me on ${name}` : 'Message me on the marketplace',
      href: marketplaceUrl,
      external: true,
    })
  }
  if (allow.allowEmail && c.email.includes('@')) {
    methods.push({ key: 'email', label: 'Email', display: c.email.trim(), href: `mailto:${c.email.trim()}`, external: false })
  }
  if (allow.allowPhone && digitsOnly(c.phone).length >= 6) {
    methods.push({ key: 'phone', label: 'Phone', display: c.phone.trim(), href: `tel:+${digitsOnly(c.phone)}`, external: false })
  }
  if (allow.allowWhatsApp && digitsOnly(c.whatsapp).length >= 6) {
    methods.push({
      key: 'whatsapp',
      label: 'WhatsApp',
      display: c.whatsapp.trim(),
      href: `https://wa.me/${digitsOnly(c.whatsapp)}`,
      external: true,
    })
  }
  if (allow.allowLinkedIn && isHttpsUrl(c.linkedin)) {
    methods.push({ key: 'linkedin', label: 'LinkedIn', display: prettyUrl(c.linkedin), href: c.linkedin.trim(), external: true })
  }
  if (allow.allowGitHub && isHttpsUrl(c.github)) {
    methods.push({ key: 'github', label: 'GitHub', display: prettyUrl(c.github), href: c.github.trim(), external: true })
  }
  if (allow.allowExternalWebsite && isHttpsUrl(c.website)) {
    methods.push({ key: 'website', label: 'Website', display: prettyUrl(c.website), href: c.website.trim(), external: true })
  }
  return methods
}

/** Where the main "Contact Me" button leads: marketplace → email → the on-page inquiry form. */
export function getPrimaryContactAction(): PrimaryContactAction {
  const methods = getContactMethods()
  const platform = methods.find((m) => m.key === 'platform')
  if (platform) {
    const name = getMarketplaceName()
    return { kind: 'platform', href: platform.href, external: true, hint: `Opens my ${name || 'marketplace'} profile in a new tab` }
  }
  const email = methods.find((m) => m.key === 'email')
  if (email) return { kind: 'email', href: email.href, external: false, hint: 'Opens your email app' }
  return { kind: 'form', href: '/#inquiry', external: false, hint: 'Takes you to the project inquiry form' }
}

export const isFormDeliveryEnabled = () => contactConfig.platformCompliance.allowExternalFormSubmission
export const areProjectLinksAllowed = () => contactConfig.platformCompliance.allowProjectLinks

/** Contact data for schema.org markup — permitted methods only, so metadata never leaks hidden details. */
export function getStructuredDataContacts(): { sameAs: string[]; email?: string } {
  const methods = getContactMethods()
  const sameAs = methods.filter((m) => ['platform', 'linkedin', 'github'].includes(m.key)).map((m) => m.href)
  const email = methods.find((m) => m.key === 'email')
  return { sameAs, ...(email ? { email: email.href } : {}) }
}
