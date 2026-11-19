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
| Icons | Lucide React; brand glyphs from Simple Icons (CC0), lazy-loaded |
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

## Editing content

All copy and project data live in typed files under `src/data/` — components contain no content.

| File | Contents |
| --- | --- |
| `profile.ts` | Name, titles, brand icon, hero portrait, site URL and SEO defaults |
| `content.ts` | Section copy: hero, about, experience, process, footer, intro |
| `projects.ts` | Project cards (featured projects get a case study) and the `showProjectLinks` switch |
| `case-studies.ts` | Case-study narrative, architecture layers, decisions, results |
| `skills.ts` | Expertise categories and the core-technology strip |
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

### Hero background (glass fragments)

Behind the hero content, a few nearly transparent glass cubes float freely in 3D space
(`HeroFragments.tsx`; motion and drawing in `glass-fragments.ts`):

- **Look:** faces are 3–8 % opaque glass, shaded by angle, with hair-thin blue/violet edges that
  brighten where they catch the light (from the upper left) and a very faint glow behind each cube.
  They sit in the hero background, behind the text, buttons, portrait and navbar, and never take
  clicks or taps.
- **Movement:** every cube has its own size, depth, drift speed and slowly turning heading,
  wandering path, tumble axis and spin speed. Some cross the screen, some drift diagonally, some move
  toward and away from the camera; a cube that leaves one edge returns at the other once out of view.
- **Performance:** 12 cubes on desktop, 8 on tablets, 5 on phones. Each cube has its own small
  canvas that the compositor moves; it's repainted only when its outline visibly changes, and its
  glow is a CSS gradient. Nothing runs before the intro dissolves or while the hero is off screen, and
  devices that can't keep up drop to about 30 fps. Visitors who prefer reduced motion see a still frame.

To tune it: the number of cubes per screen size is `fragmentCount`, the colours are `BLUE` and
`VIOLET`, and face and edge opacity are set in `draw()`. To turn it off, remove `<HeroFragments />`
from `HeroBackground` in `Hero.tsx`.

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
- Case-study pages and brand-icon data load lazily.
- The Latin Geist font file is preloaded; other subsets load only when needed.
- Animations are transform/opacity only, play once on reveal, and are disabled for users who prefer
  reduced motion. The architecture graph's data "packets", the portrait clip and the hero's glass
  fragments only run while on screen.

## Deployment (Vercel)

1. Push the repository to GitHub and import it in Vercel (framework preset: **Vite**).
2. Build command `npm run build`, output directory `dist` (already set in `vercel.json`).
3. Deploy. No environment variables are needed.

`vercel.json` adds SPA rewrites (excluding `/api` and static files), long-term caching for hashed
assets and baseline security headers.

## Project structure

```
config/                   Build plugins: SEO/sitemap/robots, font preload
public/                   favicon.ico/.svg, touch & PWA icons, og-image.png, site.webmanifest,
                          images/portrait-*.webp and videos/portrait.mp4 (hero portrait)
src/
  components/
    intro/                Full-screen intro (provider, overlay, timeline, ribbon geometry, styles)
    layout/               Navbar, Footer, Container, Logo, ScrollManager
    sections/             Hero (+ HeroPortrait, HeroFragments), TechHighlights, About, Expertise (+ interactive
                          ProductArchitecture graph), Projects, Services, Experience, Process
    ui/                   Button, SectionHeading, AnimatedSection, ProjectCard, SkillCard,
                          ServiceCard, SpotlightCard, TechChip, IconBadge, BrandIcon
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

Brand glyphs: [Simple Icons](https://simpleicons.org) (CC0 1.0). Trademarks belong to their owners
and are used only to identify technologies.
