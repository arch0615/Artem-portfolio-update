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
| Icons | Lucide React; brand glyphs from Simple Icons and Skills logos from Simple Icons, SVG Logos and LobeHub (generated, lazy-loaded) |
| Fonts | Geist / Geist Mono, self-hosted via Fontsource |

## Getting started

Requires **Node.js 20.19+** (or 22.12+).

```bash
npm install
npm run dev        # http://localhost:5173
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server with HMR. |
| `npm run build` | Type-checks, then builds to `dist/` (plus SEO pages, sitemap, robots). |
| `npm run preview` | Serves the production build locally. |
| `npm run typecheck` | TypeScript only. |
| `npm run lint` | ESLint (incl. React Compiler-aware hooks rules). |
| `npm run check` | Typecheck + lint + build — run before deploying. |
| `npm run logos` | Regenerates the Skills section's technology logos (`src/lib/tech-logos.ts`). |

## Editing content

All copy and project data live in typed files under `src/data/` — components contain no content.

| File | Contents |
| --- | --- |
| `profile.ts` | Name, titles, brand icon, hero portrait, site URL and SEO defaults |
| `content.ts` | Section copy: hero, about, experience heading, process, footer, intro |
| `projects.ts` | Project cards (featured projects get a case study) and the `showProjectLinks` switch |
| `case-studies.ts` | Case-study narrative, architecture layers, decisions, results |
| `skills.ts` | Skill categories and their technologies (icon, brand colour) and the core-technology strip |
| `experience.ts` | Work history for the Experience timeline (company, role, months, location, summary, highlights, technologies) |
| `services.ts` | Service cards |
| `navigation.ts` | Navbar items (ids must match section ids) |

**Content rules:** only real, verified information — no invented clients, URLs, metrics,
testimonials or technologies. Case-study text is derived strictly from the project facts;
extend it as more details (screenshots, diagrams, measured results) become available.

### No contact options (marketplace compliance)

The site is built to be shared on freelance marketplaces, many of which (e.g. Upwork before a
contract starts, Fiverr) prohibit sharing email addresses, phone numbers, messaging apps, social
profiles or other off-platform contact routes. It therefore has **no contact section, contact
buttons, forms or contact details anywhere**: not in the pages, the footer, the page metadata or
the structured data. Visitors reach Artem through the marketplace where they found the portfolio.

Keep it that way: don't add contact details or invitations to message off-platform, and never
put them in images, QR codes, metadata or hidden markup. The only outbound links are the "Visit"
links to finished client websites on the project cards (portfolio evidence, not contact channels);
set `showProjectLinks` in `src/data/projects.ts` to `false` if a marketplace you use doesn't allow
external links.

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
- **Always opens on Home:** every fresh load or refresh starts at the top of the page. The browser
  doesn't restore an earlier scroll position, a `#section` in the address (e.g. `/#projects` after
  using the menu) is dropped instead of jumping there (`src/main.tsx`), and the page can't scroll
  while the overlay covers it, so the wheel, swipe or key that skips the intro doesn't move it.
  Menu links, smooth scrolling and back/forward work as usual once the intro has ended.
- **Performance:** CSS/SVG only, no images or video. Moving effects sit on their own compositor
  layers, and the timeline starts after the first frame is painted (and only once the tab is visible).
- **Turning it off:** remove `<IntroProvider>` from `src/App.tsx`. Components that call
  `useIntroRevealed()` then animate immediately (the context defaults to "revealed").

### Hero portrait

The right side of the hero shows an animated full-length portrait (`HeroPortrait.tsx`, configured
by `portrait` in `src/data/profile.ts`):

- **Clip:** `public/videos/portrait.mp4`, a muted 5 s loop (720×1280, H.264) made from the portrait
  photo with an image-to-video tool. The frame takes the clip's aspect ratio, so the clip is always
  shown whole, head to feet, never cropped or stretched.
- **Still image:** the photo as WebP in three widths (480, 768 and 1024 px, 17–63 KB) in
  `public/images/`, cropped to the frame at the background edges only. It shows until the clip
  plays, and on its own for visitors who prefer reduced motion, if the clip fails to load or if the
  browser refuses autoplay.

Playback: nothing of the clip is downloaded until the portrait is close to the screen, and then only
its metadata. It starts once the intro has dissolved, loops silently without controls, pauses when
the portrait is scrolled out of view and resumes when it's back.

To replace the clip, export a seamless loop as MP4 (H.264), ideally under 3 MB, then save it under
the same name (or update `video.sources`) and set `video.width`/`video.height` to its dimensions.
Remove `video` to show the still image only. To replace the photo, export new
`portrait-480/768/1024.webp` files under the same names and update `width`/`height`.

### Global space background

The whole site floats in one continuous, dark 3D space: a single fixed, full-viewport layer behind
every page (`src/components/background/`, mounted once in `App.tsx`, outside the routes, so it never
restarts while navigating). Sections have no full-width backgrounds of their own; cards, borders and
local glows (e.g. in the hero) sit on top of it. Back to front:

1. **Deep space** (`space.css`): near-black (`#050509`) with midnight-navy and violet nebulae, a faint
   electric-blue light, darker edges, two slowly drifting nebula clouds and faint flowing
   "space-time" light waves.
2. **Stars** (`starfield.ts`): a static field (sparser on phones) drawn once into an image, plus 24
   twinkling stars (10 on phones).
3. **Glass fragments** (`GlassFragments.tsx`, motion and drawing in `glass-fragments.ts`): nearly
   transparent cubes floating freely in 3D: 3–8 % opaque faces shaded by angle, hair-thin blue/violet
   edges that brighten where they catch the light, a very faint glow. Every cube has its own size,
   depth, drift speed and slowly turning heading, wandering path, tumble axis and spin speed: some
   cross the screen, some drift diagonally, some move toward and away from the viewer. Scrolling
   slides them past at a depth-dependent rate (near ones faster), as if moving through the space;
   instant jumps (opening a page, back/forward) don't move them.

It never takes clicks or taps, and doesn't cause sideways scrolling. It's sized to the largest
viewport height, so it doesn't resize when a phone's address bar shows or hides.

- **Performance:** the static parts are one background with no layers of their own; the clouds,
  waves and twinkles are slow transform/opacity animations the compositor runs on its own (no blur
  filters). Cubes: 14 on wide screens, 12 on desktop, 8 on tablets, 5 on phones. Each has its own small
  canvas that the compositor moves; it's repainted only when its outline visibly changes, and its glow
  is a CSS gradient. Phones, and devices that can't keep up, update the cubes at about 30 fps.
- **Intro and reduced motion:** the animations start as the intro dissolves (the cubes once it has
  finished). Visitors who prefer reduced motion see a still version of the whole background.

To tune it: colours and nebulae are at the top of `space.css`; the number of cubes per screen size is
`fragmentCount`, their colours `BLUE` and `VIOLET`, face and edge opacity in `draw()`
(`glass-fragments.ts`), and the scroll effect `PARALLAX` (`GlassFragments.tsx`). To turn the whole
background off, remove `<GlobalSpaceBackground />` from `App.tsx`.

### Skills section

The Skills section (`#skills`, `Skills.tsx` + `src/components/skills/`) shows technologies only:
six categories (full-stack, mobile, AI & intelligent agents, automation & integrations, backend &
databases, cloud & DevOps) as tabs on the left — a horizontally scrolling row above the cards on
smaller screens — and the selected category's technologies as cards on the right, each with its
official logo in its brand colours. Selecting a category fades the previous cards out and cascades
the new ones in (a single short fade for visitors who prefer reduced motion). The grid keeps the
height of the largest category, so switching never moves the page.

Everything is data in `src/data/skills.ts`: each technology has a name and an icon, which is one of

- `mono('react', '#61DAFB')` — a single-colour official mark filled with its brand colour (white for
  marks that are black, e.g. Next.js, Vercel, Prisma);
- `multicolor('python', '#3776AB')` — the official multicolour logo, drawn in its own colours (the
  colour is the brand's primary colour, used for a faint halo on hover);
- `generic('webhook')` — a Lucide icon in the accent colour, for capabilities without an official
  logo (and for PostGIS, pgvector, CLIP, which have none in the icon libraries).

**Logos** are generated, not hand-drawn: `scripts/generate-tech-logos.mjs` copies exactly the logos
listed in its `LOGOS` map from pinned versions of Simple Icons, the Iconify "logos" set and LobeHub
icons into `src/lib/tech-logos.ts`, which the site loads lazily in its own small chunk (no icon
library in the bundle, nothing fetched from a CDN). To add a technology with a new logo: add it to
`LOGOS`, run `npm run logos`, then add the technology to `skills.ts`.

### Experience timeline

The Experience section lists the positions in `src/data/experience.ts` newest first (sorted by start
month, so the order in the file doesn't matter). Each entry shows the company and role, the period
(`start`/`end` as `YYYY-MM`, or `end: 'present'` for a current role) and location, a summary, the key
responsibilities and achievements, and technology tags. On desktop the dates sit to the left of a
vertical line with a company marker (its initials); tablets keep the line and the card; phones show
the cards alone, with the marker in the card header. Each entry fades and rises in as it scrolls into
view, and the line draws down to the next one.

### Project visuals

Each project uses an original, resolution-independent CSS mockup (`src/components/visuals/`),
selected by the `visual` key in `projects.ts`. Mockup text is abstract by design (skeleton bars)
so it never implies data that doesn't exist. To use a real screenshot instead, place an optimised
image in `public/images/projects/` and render it in `ProjectCard` in place of `ProjectVisual`.

## SEO

- Head tags, Open Graph/Twitter cards and **Person JSON-LD** are generated from `src/data/profile.ts`
  by `config/seo-plugin.ts` — edit the data, not `index.html`.
- At build time each case study gets its own static HTML (`dist/projects/<slug>/index.html`) with
  route-specific title, description and canonical URL, so link previews and non-JS crawlers see the
  right metadata.
- `sitemap.xml` and `robots.txt` are generated into `dist/` on every build.
- Changing domains? Update `site.url` in `profile.ts`.
- The Person structured data contains no contact details (no email, phone, social or marketplace links).
- The OG image (`public/og-image.png`, 1200×630) and favicons are static files in `public/`.

## Performance

- Vendor code is split into long-cacheable chunks (`react`, `router`, `motion`).
- Case-study pages, brand-icon data and the Skills logos load lazily.
- The Latin Geist font file is preloaded; other subsets load only when needed.
- Animations are transform/opacity only, play once on reveal, and are disabled for users who prefer
  reduced motion. The portrait clip only runs while on screen; the global background is built to
  stay cheap (see "Global space background"). The Skills logos (~25 KB gzipped) load in their
  own chunk after the page renders; the cards cascade in once they are there.

## Deployment (Vercel)

1. Push the repository to GitHub and import it in Vercel (framework preset: **Vite**).
2. Build command `npm run build`, output directory `dist` (already set in `vercel.json`).
3. Deploy. No environment variables are needed.

`vercel.json` adds SPA rewrites (excluding `/api` and static files), long-term caching for hashed
assets and baseline security headers.

## Project structure

```
config/                   Build plugins: SEO/sitemap/robots, font preload
scripts/                  generate-tech-logos.mjs (Skills logos)
public/                   favicon.ico/.svg, touch & PWA icons, og-image.png, site.webmanifest,
                          images/portrait-*.webp and videos/portrait.mp4 (hero portrait)
src/
  components/
    background/           Global space background (nebulae, stars, light waves, glass fragments)
    intro/                Full-screen intro (provider, overlay, timeline, ribbon geometry, styles)
    layout/               Navbar, Footer, Container, Logo, ScrollManager
    sections/             Hero (+ HeroPortrait), TechHighlights, About, Skills,
                          Projects, Services, Experience, Process
    skills/               SkillCategorySelector, SkillGrid, SkillCard, TechIcon
    experience/           ExperienceEntry (one position in the timeline)
    ui/                   Button, SectionHeading, AnimatedSection, ProjectCard,
                          ServiceCard, SpotlightCard, TechChip, TechTag, IconBadge, BrandIcon
    visuals/              Original CSS product mockups for each project
    case-study/           ArchitectureDiagram
  data/                   All site content (see "Editing content")
  hooks/                  Scroll-spy, page metadata, scroll state, reduced motion
  lib/                    Icons, motion presets, helpers
  pages/                  HomePage, CaseStudyPage (lazy), NotFoundPage
  styles/index.css        Design tokens and utilities
  types/                  Shared content types
```

## Credits

Brand glyphs and technology logos: [Simple Icons](https://simpleicons.org) (CC0 1.0),
[SVG Logos](https://github.com/gilbarbara/logos) via Iconify (CC0 1.0) and
[LobeHub Icons](https://github.com/lobehub/lobe-icons) (MIT, © LobeHub). Generic icons:
[Lucide](https://lucide.dev) (ISC). Trademarks belong to their owners and are used only to identify
technologies.
