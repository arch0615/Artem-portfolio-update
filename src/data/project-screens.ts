import type { ProjectScreen } from '../types'

/**
 * Real application screens per project (by slug), shown in the Skills section next to the projects
 * that demonstrate each skill area (`skills.ts` can show a subset per skill).
 *
 * Screenshots: save each screen in `src/assets/work/` under its `file` name (.webp, .png, .jpg or
 * .avif) and it appears automatically; until then its frame shows a "Screenshot coming soon"
 * placeholder. Only real screenshots of the finished applications belong here: never mockups,
 * illustrations or generated images. The whole screenshot is always shown, never cropped or
 * stretched. Recommended sizes (WebP, under ~250 KB each):
 * - phone screens: a full portrait screen, e.g. 1080 × 2340 px (9:19.5)
 * - browser screens: the browser window's content, 1600 × 1000 px (16:10) or 1920 × 1080 px (16:9)
 *
 * Labels name only what the project's recorded facts mention.
 */
export const projectScreens: Record<string, ProjectScreen[]> = {
  'radar-app': [
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
  'email-campaign-module': [
    { file: 'email-wizard', label: 'Campaign wizard', device: 'browser', alt: 'Email Campaign Module campaign creation wizard' },
    { file: 'email-audience', label: 'Audience selection', device: 'browser', alt: 'Email Campaign Module audience selection' },
    { file: 'email-dashboard', label: 'Campaign dashboard', device: 'browser', alt: 'Email Campaign Module campaign dashboard' },
    { file: 'email-tracking', label: 'Open & click tracking', device: 'browser', alt: 'Email Campaign Module open and click tracking' },
  ],
  'nexa-betfair-demo': [
    { file: 'nexa-marketplace', label: 'Marketplace interface', device: 'browser', alt: 'Nexa Betfair Demo marketplace interface' },
    { file: 'nexa-deployment', label: 'Automated deployment', device: 'browser', alt: 'Nexa Betfair Demo automated deployment with GitHub Actions' },
  ],
  'django-performance-optimization': [
    { file: 'django-performance', label: 'Performance analysis', device: 'browser', alt: 'Django application performance analysis' },
  ],
  'style4u': [
    { file: 'style4u-ios', label: 'iOS', device: 'phone', alt: 'Style4U running on iOS' },
    { file: 'style4u-android', label: 'Android', device: 'phone', alt: 'Style4U running on Android' },
  ],
  'byd-technical-library-agent': [
    { file: 'byd-assistant', label: 'Knowledge assistant', device: 'browser', alt: 'BYD Technical Library Agent knowledge assistant' },
  ],
}
