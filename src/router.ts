import {
  createRouter,
  createMemoryHistory,
  createWebHashHistory,
  createWebHistory,
  type RouteRecordRaw,
  type Router,
} from 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    /** Document title, verbatim. */
    title: string
    description: string
    ogType?: string
    ogTitle?: string
    ogDescription?: string
    noindex?: boolean
  }
}

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: {
      title: 'Jeremy Willoughby · Software Engineer',
      description:
        'Senior software engineer in Gilbert, Arizona. Subject matter expert for front-end architecture and data visualization on a platform close to a million people use, with a shipped App Store product, an FBO operations prototype, and the Claude Code rules and context files six engineers work from across three repositories.',
      ogDescription:
        'I build software for people who are standing up. Three case studies: a shipped App Store product, an FBO operations prototype, and my team’s agentic development pipeline.',
    },
  },
  {
    path: '/work/buffrhq',
    name: 'buffrhq',
    component: () => import('@/views/work/BuffrHqView.vue'),
    meta: {
      title: 'BuffrHQ · Jeremy Willoughby',
      description:
        'An all-in-one CRM for mobile auto detailers, designed and built solo and shipped to the App Store in under three months. The decisions behind route planning, plate recognition, payments and permissions.',
      ogType: 'article',
      ogTitle: 'BuffrHQ: a CRM for mobile detailers, shipped solo',
      ogDescription:
        'Four client surfaces, one backend, no team and no specification. The trade-offs behind route planning, plate recognition, payments and permissions.',
    },
  },
  {
    path: '/work/airport-hq',
    name: 'airport-hq',
    component: () => import('@/views/work/AirportHqView.vue'),
    meta: {
      title: 'Airport HQ · Jeremy Willoughby',
      description:
        'A front-end prototype for a small fixed-base operator, built in a couple of days on the shape of their real numbers: one workbook per month became filters across months and questions answered in plain English.',
      ogType: 'article',
      ogTitle: 'Airport HQ: a prototype for a small FBO',
      ogDescription:
        'My dad asked me to look at their website. I built them a prototype instead, without changing how they work at all, and told them the truth about the risk.',
    },
  },
  {
    path: '/work/pipeline',
    name: 'pipeline',
    component: () => import('@/views/work/PipelineView.vue'),
    meta: {
      title: 'Ticket to UAT · Jeremy Willoughby',
      description:
        'A team agentic development pipeline built on Claude Code, run by six engineers across three repositories, and the rules and context files I write underneath it. Why the tests are written after a human verifies the behavior, why out-of-scope findings become tickets, and why it merges into test while a person moves the change to master.',
      ogType: 'article',
      ogTitle: 'Ticket to UAT: a team agentic development pipeline',
      ogDescription:
        'Six engineers, three repositories, two-to-three-day tickets closing same day. The guardrails are structural, and the interesting one is where the human sits.',
    },
  },
  {
    path: '/resume',
    name: 'resume',
    component: () => import('@/views/ResumeView.vue'),
    meta: {
      title: 'Résumé · Jeremy Willoughby',
      description:
        'Jeremy Willoughby, senior software engineer in Gilbert, AZ. Front-end and data-visualization subject matter expert at QsrSoft, a shipped App Store product, and the Claude Code rules and context files six engineers work from across three repositories.',
      ogType: 'profile',
      ogTitle: 'Jeremy Willoughby · Résumé',
    },
  },
  {
    path: '/colophon',
    name: 'colophon',
    component: () => import('@/views/ColophonView.vue'),
    meta: {
      title: 'Colophon · Jeremy Willoughby',
      description:
        'How this site is built: Vue 3 and TypeScript, prerendered to static HTML at build time, four self-hosted variable typefaces, no third-party requests, and an accessibility pass I am willing to be checked on.',
      ogType: 'article',
      ogTitle: 'Colophon: how this site is built',
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
    meta: {
      title: 'Not found · Jeremy Willoughby',
      description: 'That page is not here.',
      noindex: true,
    },
  },
]

export function createAppRouter(ssr: boolean): Router {
  // The deployed site uses real paths — every one of them is a file on disk.
  // The single-file preview build has no server, so it falls back to hashes.
  // Built lazily: createWebHistory touches `window`, which the prerender lacks.
  const clientHistory = () =>
    import.meta.env.MODE === 'preview' ? createWebHashHistory() : createWebHistory()

  return createRouter({
    history: ssr ? createMemoryHistory() : clientHistory(),
    routes,
    scrollBehavior(to, _from, savedPosition) {
      if (savedPosition) return savedPosition
      if (to.hash) return { el: to.hash, top: 88 }
      return { top: 0 }
    },
  })
}

/** The paths the prerender pass writes to disk. */
export const PRERENDER_ROUTES = [
  '/',
  '/work/buffrhq',
  '/work/airport-hq',
  '/work/pipeline',
  '/resume',
  '/colophon',
  '/404',
] as const
