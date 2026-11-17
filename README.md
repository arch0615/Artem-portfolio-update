# Artem Bohomolov — Portfolio

Personal portfolio for **Artem Bohomolov**, AI Full-Stack Developer (Mobile Apps & Automation).
A single-page site with dedicated case-study pages, built as a fast, accessible, SEO-friendly React SPA.

**Live:** https://artem-bohomolov-portfolio.vercel.app/

## Tech stack

| Area | Choice |
| --- | --- |
| Framework | React 19 + TypeScript 6, Vite 8 |
| Styling | Tailwind CSS 4 (CSS-first tokens in `src/styles/index.css`) |
| Animation | Framer Motion (`LazyMotion` + `m`, respects *reduce motion*) |
| Routing | React Router 8 (case studies are lazy-loaded routes) |
| Forms | React Hook Form + Zod |
| Icons | Lucide React; brand glyphs from Simple Icons (CC0), lazy-loaded |
| Fonts | Geist / Geist Mono, self-hosted via Fontsource |
| Contact backend | Vercel serverless function → Resend REST API |

## Getting started

Requires **Node.js 20.19+** (or 22.12+).

```bash
npm install
npm run dev        # http://localhost:5173
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server with HMR. Also serves `/api/contact` locally (see below). |
| `npm run build` | Type-checks, then builds to `dist/` (plus SEO pages, sitemap, robots). |
| `npm run preview` | Serves the production build locally. |
| `npm run typecheck` | TypeScript only. |
| `npm run lint` | ESLint (incl. React Compiler-aware hooks rules). |
| `npm run check` | Typecheck + lint + build — run before deploying. |

## Editing content

All copy and project data live in typed files under `src/data/` — components contain no content.

| File | Contents |
| --- | --- |
| `profile.ts` | Name, titles, site URL and SEO defaults |
| `contact.ts` | **Contact details, marketplace profile and platform-compliance switches** |
| `content.ts` | Section copy: hero, about, experience, process, contact, footer |
| `projects.ts` | Project cards (featured projects get a case study) |
| `case-studies.ts` | Case-study narrative, architecture layers, decisions, results |
| `skills.ts` | Expertise categories and the core-technology strip |
| `services.ts` | Service cards |
| `navigation.ts` | Navbar items (ids must match section ids) |

**Content rules:** only real, verified information — no invented clients, URLs, metrics,
testimonials or technologies. Case-study text is derived strictly from the project facts;
extend it as more details (screenshots, diagrams, measured results) become available.

### Contact details & marketplace compliance

Everything about how visitors can reach Artem lives in **`src/data/contact.ts`**: identity, location,
email, phone, WhatsApp, LinkedIn, GitHub, website, the marketplace profile, and the
`platformCompliance` switches. It drives the contact card, footer, inquiry form, error fallbacks
and the Person structured data. Nothing else in the codebase reads contact details directly.

Each method has **two independent switches**: its value (empty = not provided) and its
`platformCompliance` flag (`false` = never rendered, including in metadata). Malformed or non-HTTPS
values are ignored even when allowed.

**Shipped defaults are the strictest setting**: only marketplace messaging is enabled, and the
inquiry form sends nothing off-site. Before enabling anything else, check the *current* rules of
every marketplace that links to this site and enable only what all of them permit. Many platforms
(e.g. Upwork before a contract starts, Fiverr) prohibit sharing email, phone, messaging apps or
social links. Never work around a disabled flag with images, QR codes, metadata or hidden markup.

| Flag | Shows |
| --- | --- |
| `allowPlatformMessaging` | "Message me on <marketplace>" — needs `marketplace.name` + the real `marketplace.profileUrl` |
| `allowEmail` / `allowPhone` / `allowWhatsApp` | `mailto:` / `tel:` / `wa.me` links |
| `allowLinkedIn` / `allowGitHub` / `allowExternalWebsite` | Profile and website links |
| `allowExternalFormSubmission` | Inquiry form emails you (asks for the sender's email); off = "brief" mode |
| `allowProjectLinks` | Live links to finished client projects (portfolio evidence, not contact channels) |

The **"Contact Me"** button goes to the marketplace profile when configured, otherwise email (if
allowed), otherwise the on-page inquiry form.

The **project inquiry form** (name, project type, optional budget, description) has two modes:

- **Brief mode** (default): nothing leaves the browser. The visitor gets a formatted project brief
  to copy and send through marketplace messaging, with a button to open the marketplace when configured.
- **Send mode** (`allowExternalFormSubmission: true`): posts to `/api/contact`, which emails the
  inquiry via Resend (see below). Rapid repeat clicks send one request, and an identical inquiry
  isn't sent twice.

### Intro animation

Every fresh page load (first visit, refresh, opening a link) starts with a 7 s full-screen
"digital identity reveal" of the name (dark entry, energy ribbons, name reveal, roles, hold and
dissolve; the phase boundaries are listed at the top of `timeline.ts`). Throughout, slow ambient
motion keeps the scene alive: blue/violet energy smoke flowing left to right, glowing motes
floating around the name, light pulses behind it, a shimmer across the floor reflection and a
barely perceptible background drift. The letters themselves never move, scale or distort. In-app navigation never replays it, and nothing is stored
in the browser. It lives in `src/components/intro/`:

| File | Purpose |
| --- | --- |
| `IntroProvider.tsx` | When the intro plays and ends; wraps the app in `App.tsx` |
| `IntroAnimation.tsx` | The overlay: ambient glow, smoke, energy ribbons, light pulses, motes, centre-out name reveal, floor shimmer, subtitle, Skip button |
| `timeline.ts` | Every phase start, delay and duration (entry → energy → name → subtitle → hold → dissolve) |
| `geometry.ts` | Ribbon paths, particle/mote positions and timings, smoke wisps (deterministic, computed once) |
| `intro.css` | Glows, smoke, pulses, particle and mote drift, light glints, the gloss sweep and floor shimmer |
| `intro-context.ts` | `useIntroRevealed()`, so entrance animations wait for the dissolve |

The subtitle and Skip label are in `introContent` (`src/data/content.ts`); the name comes from
`profile.name`.

- **Never blocks the visitor:** the Skip button, any key, scrolling, swiping or clicking ends it at
  once. The page underneath is rendered from the start and stays readable to screen readers (the
  overlay is decorative and hidden from them).
- **Reduced motion:** visitors who prefer reduced motion get a plain 2 s fade of the name and roles
  (deliberately not lengthened with the full intro).
- **Hand-off:** the hero's entrance animations, and any reveal already on screen (e.g. a case-study
  header), start as the overlay dissolves instead of playing unseen underneath it.
- **Performance:** CSS/SVG only, no images or video. Moving effects sit on their own compositor
  layers, and the timeline starts after the first frame is painted (and only once the tab is visible).
- **Turning it off:** remove `<IntroProvider>` from `src/App.tsx`. Components that call
  `useIntroRevealed()` then animate immediately (the context defaults to "revealed").

### Project visuals

Each project uses an original, resolution-independent CSS mockup (`src/components/visuals/`),
selected by the `visual` key in `projects.ts`. Mockup text is abstract by design (skeleton bars)
so it never implies data that doesn't exist. To use a real screenshot instead, place an optimised
image in `public/images/projects/` and render it in `ProjectCard` in place of `ProjectVisual`.

## Email delivery for the inquiry form (optional)

Only needed if you enable `allowExternalFormSubmission` in `src/data/contact.ts` — and only if your
marketplace's rules permit it. In send mode the form posts JSON to `/api/contact` (`api/contact.ts`),
a Vercel function that emails the inquiry through [Resend](https://resend.com).
**No secrets are exposed to the browser.**

### Environment variables

Copy `.env.example` to `.env.local` for local development, and add the same variables in
**Vercel → Project → Settings → Environment Variables** for production.

| Variable | Required | Description |
| --- | --- | --- |
| `RESEND_API_KEY` | yes | Resend API key (server-only) |
| `CONTACT_TO_EMAIL` | yes | Recipient address(es), comma-separated |
| `CONTACT_FROM_EMAIL` | no | Verified sender, e.g. `Portfolio <hello@yourdomain.com>`. Defaults to Resend's test sender, which can only deliver to the Resend account owner's address. |
| `VITE_CONTACT_ENDPOINT` | no | Public override for the form endpoint (e.g. a Formspree URL). Defaults to `/api/contact`. |

Setup steps:

1. Create a Resend account and an API key.
2. (Recommended) Verify your sending domain in Resend and set `CONTACT_FROM_EMAIL`.
3. Set the variables above in Vercel and redeploy.

**Graceful fallback:** without credentials the function returns `503`, and the form shows a
neutral "temporarily unavailable" message plus a *permitted* alternative (marketplace or email, if enabled).

**Spam protection:** hidden honeypot field + minimum fill time (bots get a fake success and nothing
is sent), server-side validation and length limits. For heavier traffic, add Cloudflare Turnstile
or a rate limiter (e.g. Upstash) in `api/contact.ts`.

**Local testing:** `npm run dev` emulates `/api/contact` (`config/dev-api-plugin.ts`) using the
variables from `.env.local`, so the full flow works without the Vercel CLI.

## SEO

- Head tags, Open Graph/Twitter cards and **Person JSON-LD** are generated from `src/data/profile.ts`
  by `config/seo-plugin.ts` — edit the data, not `index.html`.
- At build time each case study gets its own static HTML (`dist/projects/<slug>/index.html`) with
  route-specific title, description and canonical URL, so link previews and non-JS crawlers see the
  right metadata.
- `sitemap.xml` and `robots.txt` are generated into `dist/` on every build.
- Changing domains? Update `site.url` in `profile.ts` and `website` in `contact.ts`.
- Structured data only includes contact methods permitted by `platformCompliance`.
- The OG image (`public/og-image.png`, 1200×630) and favicons are static files in `public/`.

## Performance

- Vendor code is split into long-cacheable chunks (`react`, `router`, `motion`).
- Case-study pages, the inquiry form (React Hook Form + Zod) and brand-icon data load lazily.
- The Latin Geist font file is preloaded; other subsets load only when needed.
- Animations are transform/opacity only, play once on reveal, and are disabled for users who prefer
  reduced motion. The hero's data "packets" only run while the hero is on screen.

## Deployment (Vercel)

1. Push the repository to GitHub and import it in Vercel (framework preset: **Vite**).
2. Build command `npm run build`, output directory `dist` (already set in `vercel.json`).
3. Add the environment variables above, then deploy.

`vercel.json` adds SPA rewrites (excluding `/api` and static files), long-term caching for hashed
assets and baseline security headers.

## Project structure

```
api/contact.ts            Vercel function (send mode only): validated, spam-filtered inquiry email via Resend
config/                   Build plugins: SEO/sitemap/robots, font preload, local /api emulation
public/                   favicon.ico/.svg, touch & PWA icons, og-image.png, site.webmanifest
src/
  components/
    intro/                Full-screen intro (provider, overlay, timeline, ribbon geometry, styles)
    layout/               Navbar, Footer, Container, Logo, ScrollManager
    sections/             Hero (+ interactive HeroVisual), TechHighlights, About, Expertise,
                          Projects, Services, Experience, Process, Contact (+ lazy InquiryForm)
    ui/                   Button, SectionHeading, AnimatedSection, ProjectCard, SkillCard,
                          ServiceCard, SpotlightCard, TechChip, IconBadge, BrandIcon
    visuals/              Original CSS product mockups for each project
    case-study/           ArchitectureDiagram
  data/                   All site content (see "Editing content"); contact.ts = contact & compliance
  hooks/                  Scroll-spy, page metadata, scroll state, reduced motion
  lib/                    Icons, motion presets, contact client + schema, helpers
  pages/                  HomePage, CaseStudyPage (lazy), NotFoundPage
  styles/index.css        Design tokens and utilities
  types/                  Shared content types
```

## Credits

Brand glyphs: [Simple Icons](https://simpleicons.org) (CC0 1.0). Trademarks belong to their owners
and are used only to identify technologies.
