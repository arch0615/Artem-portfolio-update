import type { ShowcaseProject } from '../types'

/**
 * The Selected work showcase in the Expertise section: one tab per project, each with its real
 * application screens.
 *
 * Screenshots: save each screen in `src/assets/work/` under its `file` name (.webp, .png, .jpg or
 * .avif) and it appears automatically; until then its frame shows a "Screenshot coming soon"
 * placeholder. Only real screenshots of the finished applications belong here: never mockups,
 * illustrations or generated images. The whole screenshot is always shown, never cropped or
 * stretched. Recommended sizes (WebP, under ~250 KB each):
 * - phone screens: a full portrait screen, e.g. 1080 × 2340 px (9:19.5)
 * - browser screens: the browser window's content, 1600 × 1000 px (16:10) or 1920 × 1080 px (16:9)
 *
 * Features: three or four, taken from the project's recorded features in `projects.ts`.
 */
export const showcaseProjects: ShowcaseProject[] = [
  {
    slug: 'radar-app',
    description:
      'A mobile application for location discovery, map-based search, GPS functionality, alerts, and content moderation.',
    features: [
      'Interactive maps with GPS location',
      'Geospatial search for nearby places',
      'Alerts and notifications',
      'Admin moderation and user management',
    ],
    screens: [
      { file: 'radar-map', label: 'Map', device: 'phone', alt: 'Radar App map screen' },
      { file: 'radar-location', label: 'Location details', device: 'phone', alt: 'Radar App location details screen' },
      { file: 'radar-search', label: 'Search & discovery', device: 'phone', alt: 'Radar App search and discovery screen' },
      {
        file: 'radar-moderation',
        label: 'Moderation dashboard',
        device: 'browser',
        alt: 'Radar App administration and moderation dashboard',
      },
    ],
  },
  {
    slug: 'email-campaign-module',
    description: 'A campaign management system for creating, sending and tracking email campaigns.',
    features: [
      'Six-step campaign wizard',
      'Audience selection',
      'Queued sending with rate limiting and retries',
      'Open and click tracking',
    ],
    screens: [
      { file: 'email-wizard', label: 'Campaign wizard', device: 'browser', alt: 'Email Campaign Module campaign creation wizard' },
      { file: 'email-audience', label: 'Audience selection', device: 'browser', alt: 'Email Campaign Module audience selection' },
      { file: 'email-dashboard', label: 'Campaign dashboard', device: 'browser', alt: 'Email Campaign Module campaign dashboard' },
      { file: 'email-tracking', label: 'Open & click tracking', device: 'browser', alt: 'Email Campaign Module open and click tracking' },
    ],
  },
  // AI & automation: add once real screenshots and its key features are available, e.g. the
  // BYD Technical Library Agent (`byd-technical-library-agent`, no features recorded yet):
  // {
  //   slug: 'byd-technical-library-agent',
  //   description: '…',
  //   features: ['…', '…', '…'],
  //   screens: [
  //     { file: 'byd-assistant', label: 'AI assistant', device: 'browser', alt: '…' },
  //     { file: 'byd-workflow', label: 'Automation workflow', device: 'browser', alt: '…' },
  //     { file: 'byd-results', label: 'Results', device: 'browser', alt: '…' },
  //   ],
  // },
]
