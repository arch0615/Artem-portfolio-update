import type { CaseStudy } from '../types'

/**
 * Detailed case studies for featured projects, keyed by project slug.
 *
 * The narrative is written strictly from the verified project facts in `projects.ts`
 * (description, technologies, features, contribution, metrics). When you add new
 * details — screenshots, diagrams, measured outcomes — extend these entries rather
 * than editing the UI. Never add numbers that were not actually measured.
 */
export const caseStudies: Record<string, CaseStudy> = {
  swan: {
    slug: 'swan',
    seoDescription:
      'Case study: Swan — an embedded banking platform for accounts with IBANs, cards, payments and KYC onboarding, with full stack work in TypeScript, React, Node.js and GraphQL.',
    role: 'Full stack: accounts & IBANs, cards, payments, onboarding & KYC',
    overview:
      'Swan is a European embedded banking platform: software companies use it to offer bank accounts, cards and payments inside their own products, white-labeled under their own brand. I worked on it as a full stack engineer across four product areas — accounts and IBANs, cards, payments, and account holder onboarding with KYC — with React and TypeScript on the frontend, Node.js on the backend and GraphQL in between.',
    problem:
      'Software platforms usually send their users to a bank for anything involving money. Swan lets a platform offer those features itself — an account with its own IBAN, cards, transfers and direct debits — without building banking infrastructure. Every flow has to be dependable and embeddable: account holders are onboarded and verified before they bank, and the same features have to work behind each partner’s brand.',
    challenges: [
      {
        title: 'Onboarding and KYC',
        description:
          'Creating individual and company account holders, collecting supporting documents and verifying identity as part of opening an account.',
      },
      {
        title: 'Accounts with IBANs',
        description: 'Accounts that work like real bank accounts, each with its own IBAN, for individuals and companies.',
      },
      {
        title: 'Cards',
        description: 'Issuing and managing virtual, physical and digital cards linked to accounts.',
      },
      {
        title: 'Payments',
        description: 'Moving money in and out of accounts with SEPA and instant credit transfers, direct debits and card payments.',
      },
    ],
    architecture: {
      caption: 'React interfaces and partner integrations use one GraphQL API, backed by Node.js services.',
      layers: [
        {
          label: 'Clients',
          title: 'React + TypeScript',
          items: ['Banking interfaces', 'Onboarding flows', 'Partner integrations'],
        },
        {
          label: 'API',
          title: 'GraphQL',
          items: ['Accounts & IBANs', 'Cards', 'Payments', 'Onboarding & KYC'],
        },
        {
          label: 'Services',
          title: 'Node.js + TypeScript',
          items: ['Account holders', 'Card issuing', 'Credit transfers & direct debits', 'Identity verification'],
        },
      ],
    },
    stack: [
      { group: 'Frontend', items: ['React', 'TypeScript'] },
      { group: 'API', items: ['GraphQL'] },
      { group: 'Backend', items: ['Node.js', 'TypeScript'] },
    ],
    implementation: [
      {
        title: 'Accounts and IBANs',
        description:
          'Full stack work on accounts and their IBANs, from the Node.js backend through the GraphQL API to the React interface.',
      },
      {
        title: 'Cards',
        description: 'Full stack work on card issuing and management for virtual, physical and digital cards.',
      },
      {
        title: 'Payments',
        description:
          'Full stack work on sending and receiving money: SEPA and instant credit transfers, direct debits and card payments.',
      },
      {
        title: 'Onboarding and KYC',
        description:
          'Full stack work on onboarding individual and company account holders, including document collection and identity verification.',
      },
    ],
    decisions: [
      {
        title: 'One GraphQL API',
        description:
          'Accounts, cards, payments and onboarding are exposed through a single GraphQL API, so each client asks for exactly the data it needs.',
      },
      {
        title: 'TypeScript across the stack',
        description: 'TypeScript on both the React frontend and the Node.js backend: one language and one type system end to end.',
      },
      {
        title: 'Verification as part of onboarding',
        description:
          'Identity verification and supporting documents are built into the onboarding flow, so an account holder is verified as part of opening an account.',
      },
      {
        title: 'Built to be embedded',
        description: 'Banking features run inside partners’ products, white-labeled under the partner’s brand.',
      },
    ],
    results: {
      summary:
        'Full stack contributions across the core of an embedded banking platform: accounts and IBANs, cards, payments, and onboarding with KYC.',
      points: [
        'Accounts with IBANs for individual and company account holders',
        'Virtual, physical and digital cards',
        'SEPA and instant credit transfers, direct debits and card payments',
        'Onboarding with document collection and identity verification',
      ],
    },
  },

  'radar-app': {
    slug: 'radar-app',
    seoDescription:
      'Case study: Radar App — a location-based mobile platform with geospatial search, interactive maps, alerts and admin moderation, built with Fastify, PostgreSQL + PostGIS, React Native and Expo.',
    role: 'Backend architecture, geospatial database, mobile app, API & admin system',
    overview:
      'Radar is a location-based mobile platform that helps users discover nearby information through interactive maps, GPS functionality and alerts. I designed and implemented the system end to end: the backend architecture, the geospatial database, the mobile application, the API and the administration system.',
    problem:
      'Location-based information is only valuable when it is relevant to where someone is right now. The platform needed to let people find what is around them on a map, receive alerts about nearby activity and contribute content from their camera or gallery — while giving administrators the tools to keep that content accurate and trustworthy.',
    challenges: [
      {
        title: 'Fast geospatial search',
        description: 'Answering “what is near me?” queries accurately and efficiently against location data.',
      },
      {
        title: 'Clean user-generated content',
        description: 'Detecting duplicate submissions and routing content through moderation before it reaches the map.',
      },
      {
        title: 'Native device capabilities',
        description: 'GPS, camera, gallery and notifications on Android and iOS from a single codebase.',
      },
      {
        title: 'Operational control',
        description: 'A separate administration experience for moderation and user management.',
      },
    ],
    architecture: {
      caption: 'Clients talk to a single typed API; spatial logic lives in PostgreSQL with PostGIS.',
      layers: [
        {
          label: 'Clients',
          title: 'Mobile app & web administration',
          items: ['React Native', 'Expo', 'Next.js', 'Tailwind CSS'],
        },
        {
          label: 'API',
          title: 'Fastify + TypeScript',
          items: ['Authentication', 'Geospatial search', 'Uploads', 'Alerts', 'Moderation', 'User management'],
        },
        {
          label: 'Data',
          title: 'PostgreSQL + PostGIS',
          items: ['Drizzle ORM', 'Spatial queries', 'Duplicate detection'],
        },
      ],
    },
    stack: [
      { group: 'Backend', items: ['Fastify', 'TypeScript', 'Drizzle ORM'] },
      { group: 'Database', items: ['PostgreSQL', 'PostGIS'] },
      { group: 'Mobile', items: ['React Native', 'Expo'] },
      { group: 'Web & admin', items: ['Next.js', 'Tailwind CSS'] },
    ],
    implementation: [
      {
        title: 'Backend API',
        description:
          'Designed and implemented the Fastify API in TypeScript, covering authentication, geospatial search, uploads, alerts and moderation.',
      },
      {
        title: 'Geospatial database',
        description:
          'Modelled location data in PostgreSQL with PostGIS so proximity queries run inside the database, accessed through Drizzle ORM.',
      },
      {
        title: 'Mobile application',
        description:
          'Built the React Native + Expo app with interactive maps, GPS, alerts and notifications, plus camera and gallery uploads.',
      },
      {
        title: 'Administration system',
        description: 'Built the moderation and user-management tooling that keeps platform content trustworthy.',
      },
    ],
    decisions: [
      {
        title: 'Spatial logic in the database',
        description:
          'PostGIS keeps location queries close to the data instead of re-implementing distance calculations in application code.',
      },
      {
        title: 'Type-safe data access',
        description:
          'Drizzle ORM keeps SQL explicit while sharing TypeScript types between the database schema and the Fastify API.',
      },
      {
        title: 'One codebase for mobile',
        description:
          'React Native with Expo covers Android and iOS together, with access to location, camera, media library and notifications.',
      },
      {
        title: 'Quality at ingestion',
        description:
          'Duplicate detection and moderation keep the map clean and let administrators focus on genuinely new content.',
      },
    ],
    results: {
      summary:
        'A complete location platform — mobile app, typed API, geospatial database and administration system — designed and implemented end to end.',
      points: [
        'Geospatial search and interactive maps backed by PostgreSQL + PostGIS',
        'Cross-platform mobile app with GPS, alerts, notifications and media uploads',
        'Moderation pipeline with duplicate detection and user management',
        'A single TypeScript API serving both the mobile app and the admin system',
      ],
    },
  },

  'email-campaign-module': {
    slug: 'email-campaign-module',
    seoDescription:
      'Case study: a custom email campaign system with a six-step wizard, database-backed sending queue, background workers, rate limiting, verified webhooks and open/click tracking across six email providers.',
    role: 'Campaign workflow, sending infrastructure, provider integrations, webhooks & tracking',
    overview:
      'A custom email campaign management system that automates campaign creation, audience selection, message delivery and tracking. I developed the campaign workflow, the sending infrastructure, the provider integrations, webhook verification and the tracking system.',
    problem:
      'Sending campaigns reliably takes more than calling an email API. A team needs to build a campaign, choose the right audience, deliver at a safe rate, recover from failures and understand what happened afterwards — without being locked into a single email provider.',
    challenges: [
      {
        title: 'Reliable delivery',
        description:
          'A durable sending queue processed by background workers, with retries for failures and rate limiting to respect provider limits.',
      },
      {
        title: 'Failing safely',
        description: 'Automatic campaign pausing, so a problem stops a send instead of compounding.',
      },
      {
        title: 'Many providers, one workflow',
        description: 'SMTP, Resend, SendGrid, Mailgun, Postmark and Amazon SES behind a consistent sending flow.',
      },
      {
        title: 'Trustworthy tracking',
        description: 'Verifying provider webhooks and recording opens, clicks and unsubscribes accurately.',
      },
    ],
    architecture: {
      caption: 'Campaigns flow from an authenticated dashboard through a durable queue to the delivery provider — and events flow back through verified webhooks.',
      layers: [
        {
          label: 'Dashboard',
          title: 'Authenticated campaign management',
          items: ['Six-step wizard', 'Audience selection', 'Campaign management'],
        },
        {
          label: 'Queue',
          title: 'Database-backed sending queue',
          items: ['Durable jobs', 'Retry mechanisms'],
        },
        {
          label: 'Workers',
          title: 'Background workers',
          items: ['Rate limiting', 'Automatic pausing', 'Retries'],
        },
        {
          label: 'Providers',
          title: 'Delivery integrations',
          items: ['SMTP', 'Resend', 'SendGrid', 'Mailgun', 'Postmark', 'Amazon SES'],
        },
        {
          label: 'Feedback',
          title: 'Webhooks & tracking',
          items: ['Webhook verification', 'Open tracking', 'Click tracking', 'Unsubscribes'],
        },
      ],
    },
    stack: [
      { group: 'Delivery providers', items: ['SMTP', 'Resend', 'SendGrid', 'Mailgun', 'Postmark', 'Amazon SES'] },
      { group: 'Processing', items: ['Database-backed queue', 'Background workers', 'Rate limiting', 'Retries'] },
      { group: 'Tracking', items: ['Webhook processing', 'Open & click tracking', 'Unsubscribe management'] },
      { group: 'Security', items: ['Dashboard authentication', 'Webhook verification'] },
    ],
    implementation: [
      {
        title: 'Campaign workflow',
        description: 'A six-step wizard that guides campaign creation, including audience selection, through to sending.',
      },
      {
        title: 'Sending infrastructure',
        description:
          'A database-backed queue processed by background workers, with rate limiting, retry mechanisms and automatic campaign pausing.',
      },
      {
        title: 'Provider integrations',
        description: 'Delivery through SMTP, Resend, SendGrid, Mailgun, Postmark and Amazon SES.',
      },
      {
        title: 'Webhooks & tracking',
        description:
          'Verified webhook processing for provider events, open and click tracking, and unsubscribe management.',
      },
    ],
    decisions: [
      {
        title: 'A queue in the database',
        description:
          'Keeping sending state in the database makes it durable and inspectable alongside the campaign data it belongs to.',
      },
      {
        title: 'Throttle in the workers',
        description: 'Rate limiting at the worker level keeps delivery within provider limits regardless of campaign size.',
      },
      {
        title: 'Pause, don’t push through',
        description: 'Automatic pausing stops a campaign when sending runs into trouble, so issues are fixed before more messages go out.',
      },
      {
        title: 'Verify every webhook',
        description: 'Provider events are verified before they update tracking data, so opens, clicks and unsubscribes can be trusted.',
      },
    ],
    results: {
      summary:
        'An end-to-end campaign pipeline — from a guided six-step wizard to verified delivery events — that works across six email delivery options.',
      points: [
        'Campaign creation, audience selection and sending in one guided workflow',
        'Durable queueing with retries, rate limiting and automatic pausing',
        'Provider flexibility across SMTP, Resend, SendGrid, Mailgun, Postmark and Amazon SES',
        'Open, click and unsubscribe tracking fed by verified webhooks',
      ],
    },
  },

  'django-performance-optimization': {
    slug: 'django-performance-optimization',
    seoDescription:
      'Case study: Django backend performance optimization with Celery, Redis and Django Channels — p95 response time improved from approximately 2.4 seconds to 180 milliseconds.',
    role: 'Performance analysis, async processing, Redis integration & backend improvements',
    overview:
      'Backend performance and asynchronous-processing optimization for a Django application built with Celery, Redis and Django Channels. The work improved p95 response time from approximately 2.4 seconds to 180 milliseconds.',
    problem:
      'Slow responses affect every user of an application. With a p95 response time of roughly 2.4 seconds, the slowest 5% of requests were taking 2.4 seconds or longer to complete.',
    challenges: [
      {
        title: 'Finding the real bottlenecks',
        description: 'Understanding where request time was actually being spent before changing anything.',
      },
      {
        title: 'Getting work off the request path',
        description: 'Deciding what must happen during a request and what can be processed asynchronously.',
      },
      {
        title: 'Healthy async infrastructure',
        description: 'Making Celery, Redis and Django Channels work together reliably.',
      },
    ],
    architecture: {
      caption: 'The request path stays lean; asynchronous work is handled by Celery, Redis and Django Channels.',
      layers: [
        {
          label: 'Request path',
          title: 'Django application',
          items: ['Python', 'Django', 'Backend improvements'],
        },
        {
          label: 'Async processing',
          title: 'Background & real-time work',
          items: ['Celery', 'Django Channels'],
        },
        {
          label: 'In-memory layer',
          title: 'Redis',
          items: ['Redis integration'],
        },
      ],
    },
    stack: [
      { group: 'Language & framework', items: ['Python', 'Django'] },
      { group: 'Asynchronous processing', items: ['Celery', 'Django Channels'] },
      { group: 'In-memory data', items: ['Redis'] },
    ],
    implementation: [
      {
        title: 'Performance analysis',
        description: 'Analysed the application to identify where response time was being spent.',
      },
      {
        title: 'Asynchronous processing',
        description: 'Optimized asynchronous processing across Celery and Django Channels.',
      },
      {
        title: 'Redis integration',
        description: 'Integrated Redis into the backend’s processing flow.',
      },
      {
        title: 'Backend improvements',
        description: 'Applied targeted improvements to the Django backend based on the analysis.',
      },
    ],
    decisions: [
      {
        title: 'Measure first',
        description: 'Optimizing from performance analysis rather than assumptions keeps changes focused on what affects response time.',
      },
      {
        title: 'Respond fast, process later',
        description: 'Asynchronous processing lets the application respond quickly while heavier work completes in the background.',
      },
      {
        title: 'Track p95, not averages',
        description: 'The 95th percentile reflects the slow requests users actually notice — the ones averages tend to hide.',
      },
    ],
    results: {
      summary: 'p95 response time improved from approximately 2.4 seconds to 180 milliseconds.',
      metrics: [
        { label: 'p95 before', value: '~2.4 s' },
        { label: 'p95 after', value: '~180 ms' },
        { label: 'Faster at p95', value: '~13×' },
        { label: 'Lower p95 latency', value: '~92%' },
      ],
      points: [
        'Bottlenecks identified through performance analysis',
        'Asynchronous processing optimized across Celery and Django Channels',
        'Redis integrated into the backend',
        'Faster responses for the slowest requests users experience',
      ],
    },
  },
}

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies[slug]
}
