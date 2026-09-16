/**
 * The hiring-manager view: the same career, sorted by what a particular role
 * is looking for.
 *
 * Every line here is on the record elsewhere on the site — this reorders the
 * evidence for a reader in a hurry; it does not add any. Each role also gets a
 * straight answer about where the fit is thinner, because a hiring manager
 * will find it anyway and would rather hear it first.
 */

export interface Proof {
  readonly text: string
  readonly to: string
  readonly label: string
}

export interface Figure {
  readonly value: string
  readonly what: string
}

export interface Role {
  /** The value in `?for=`, so a view can be shared with a hiring panel. */
  readonly id: string
  readonly title: string
  /** The one-sentence answer to "why you, for this?" */
  readonly fit: string
  readonly proof: readonly Proof[]
  readonly numbers: readonly Figure[]
  readonly stack: readonly string[]
  /** Something worth asking me about in an interview for this role. */
  readonly askMe: string
  /** Where the fit is thinner, said plainly. */
  readonly straight: string
}

const RESUME = { to: '/resume', label: 'Résumé' } as const
const BUFFR = { to: '/work/buffrhq', label: 'BuffrHQ case study' } as const
const AIRPORT = { to: '/work/airport-hq', label: 'Airport HQ case study' } as const
const PIPELINE = { to: '/work/pipeline', label: 'Pipeline case study' } as const

export const ROLES: readonly Role[] = [
  {
    id: 'forward-deployed',
    title: 'Senior forward deployed engineer',
    fit: "I'm at my best sitting with the people who'll use the software, learning how they actually work, then building against that instead of an assumption.",
    proof: [
      {
        text: "Airport HQ: learned a small FBO's one-workbook-a-month Google Sheets and built a working prototype on the shape of their real numbers in a couple of days, without changing their process.",
        ...AIRPORT,
      },
      {
        text: 'Told them the truth about the risk (one person supporting software their business runs on) and found that most FBO reporting software is sold by fuel suppliers to keep FBOs dependent on them.',
        ...AIRPORT,
      },
      {
        text: 'Five years as second in command of a restaurant (about twenty-five people, hiring through inventory) before writing software for operators like them.',
        ...RESUME,
      },
      {
        text: 'Scope ambiguous requests with product owners, designers and leadership at QsrSoft; ran feasibility discussions with vendors and franchisees at Dogtopia.',
        ...RESUME,
      },
    ],
    numbers: [
      { value: 'Days', what: "from a customer's real data to a working demo" },
      { value: '~25', what: 'people I managed on a restaurant floor' },
    ],
    stack: ['Discovery', 'Rapid prototyping', 'Customer demos', 'Next.js', 'Vue 3', 'Anthropic API'],
    askMe: 'Why the Airport HQ prototype deliberately changed nothing about how the operator works.',
    straight:
      "I haven't held the title. Airport HQ didn't become a client because the owner wasn't ready, but it was the job itself: go to the business, learn the process nobody wrote down, and show them their own data.",
  },
  {
    id: 'frontend',
    title: 'Senior front-end / Vue engineer',
    fit: 'Vue 3 is what I work in every day, on a platform close to a million people use. I set its front-end technical direction and own its charts.',
    proof: [
      {
        text: 'Front-end subject matter expert at QsrSoft, on a live platform used by close to a million people: I set technical direction, and the team comes to me on component architecture and interaction standards.',
        ...RESUME,
      },
      {
        text: 'Helped plan and drive a Vue 2 to Vue 3 migration across 60+ engineers, alongside a monorepo-to-microservices move: shared components, teaching Vue 3, and a simpler process. Finished in about a year, with no disruption to customers.',
        ...RESUME,
      },
      {
        text: 'Subject matter expert for charting and data visualization (Highcharts): the dashboards operators run their business from.',
        ...RESUME,
      },
      {
        text: 'Built this site in Vue 3: prerendered, no third-party requests, and zero accessibility violations across every page, theme and width.',
        to: '/colophon',
        label: 'How this site is built',
      },
    ],
    numbers: [
      { value: '~1M', what: 'people on the platform where I set front-end direction' },
      { value: '60%', what: 'average load-time reduction, Dogtopia' },
      { value: '25%', what: 'development-efficiency gain from reusable components' },
    ],
    stack: ['Vue 3', 'JavaScript', 'Pinia', 'Vue Router', 'Highcharts', 'React', 'Accessibility', 'Performance'],
    askMe: 'How sixty-plus engineers moved to Vue 3 without pausing feature work.',
    straight:
      "Engineering since 2021, and front-end heavy the whole way. Before that, five years as second in command of a restaurant, which is where the product sense comes from. I'm strongest in JavaScript; TypeScript I'm still learning.",
  },
  {
    id: 'fullstack',
    title: 'Full-stack / product engineer',
    fit: "I've taken a product from first commit to a live App Store release, alone: app, dashboard, public sites and backend.",
    proof: [
      {
        text: 'BuffrHQ: a React Native app, a Vue 3 owner dashboard, public booking sites and a Node/Postgres backend, designed, built and shipped solo in under three months.',
        ...BUFFR,
      },
      {
        text: 'Camera-based plate recognition, Mapbox route optimization, a QR pay page for four payment apps, and multi-tenant scoped permissions over customer financial data.',
        ...BUFFR,
      },
      {
        text: 'Knowing what not to build: no card processing. Payments go through the four apps detailers already use, which kept a one-person company out of underwriting, chargebacks and compliance.',
        ...BUFFR,
      },
      {
        text: 'Enterprise React applications and Node microservices on Azure, MySQL and MongoDB at Dogtopia, contributing to over $100M in revenue.',
        ...RESUME,
      },
    ],
    numbers: [
      { value: '< 3 mo', what: 'first commit to the App Store, solo' },
      { value: '4', what: 'payment apps behind one QR pay page, no card processing' },
      { value: '$100M+', what: 'revenue the Dogtopia applications contributed to' },
    ],
    stack: ['Vue 3', 'React Native', 'Expo', 'Node', 'Postgres', 'Mapbox', 'REST & GraphQL', 'AWS · GCP · Azure'],
    askMe: 'Why BuffrHQ deliberately doesn’t process cards.',
    straight:
      "BuffrHQ is a solo product, so it runs at small-business scale. For scale, look at QsrSoft: close to a million people on the platform where I set front-end direction.",
  },
  {
    id: 'ai',
    title: 'AI / agentic engineer',
    fit: 'I use Claude Code every day, and I write the rules, context files and hooks that let a whole team’s agents follow the same standards.',
    proof: [
      {
        text: 'Write and maintain the Claude Code rules and context files six engineers work from across three repositories, and contributed to the team’s ticket-to-UAT pipeline, which took two-to-three-day tickets to same-day close.',
        ...PIPELINE,
      },
      {
        text: 'I hold the line that tests get written after a person verifies the behavior, never before, because a model writing tests first is guessing at intent. In our pipeline, UAT approval stays a human gate.',
        ...PIPELINE,
      },
      {
        text: 'AI-written code should be surrounded by tests that check for explicit behavior. In the pipeline, those tests are written against behavior a person has already verified.',
        ...PIPELINE,
      },
      {
        text: "Anthropic API shipped in two products: BuffrHQ turns a business's flyer into a claimable booking page; Airport HQ answers questions over an operator's numbers, with the known gaps in their records written into the prompt.",
        ...AIRPORT,
      },
    ],
    numbers: [
      { value: '6 · 3', what: 'engineers · repositories working from the rules I maintain' },
      { value: 'Same day', what: 'turnaround on tickets that used to take two or three' },
      { value: '2', what: 'products shipping the Anthropic API' },
    ],
    stack: ['Claude Code', 'Anthropic API', 'Agent design', 'Prompt design', 'Evals', 'Human-in-the-loop', 'Zod'],
    askMe: 'What goes into a rules file that a whole team’s agents actually follow, and what I cut.',
    straight: 'My AI work is applied (team rules and context, product features and the guardrails around them), not model training. The pipeline itself is a teammate’s; my part is the layer underneath it.',
  },
  {
    id: 'lead',
    title: 'Tech lead',
    fit: 'I set standards, pair with the people who have to meet them, and explain the trade-off even when nobody asked for one.',
    proof: [
      {
        text: 'Turned the standards I kept re-teaching into Claude Code rules and hooks that six engineers now work from, so nobody has to check for them by hand.',
        ...PIPELINE,
      },
      {
        text: 'Mentor junior and mid-level engineers, mostly by pairing. Showing a pattern done well travels further than mandating it.',
        ...RESUME,
      },
      {
        text: 'Own front-end technical direction as the subject matter expert on a platform close to a million people use.',
        ...RESUME,
      },
      {
        text: 'Five years as an assistant manager: hiring, training, scheduling and performance for about twenty-five people.',
        ...RESUME,
      },
    ],
    numbers: [
      { value: '~25', what: 'people I hired, trained and scheduled' },
      { value: '6', what: 'engineers running a workflow I designed' },
    ],
    stack: ['Standards', 'Code review', 'Pairing', 'Mentoring', 'Scoping', 'Stakeholder communication'],
    askMe: 'How I mentor by pairing instead of mandating.',
    straight:
      "I haven't held an engineering-manager title. The people leadership comes from five years on a restaurant floor; in engineering I lead through standards and pairing.",
  },
]
