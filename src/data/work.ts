/** Tabular content — the stuff that is genuinely data rather than prose. */

export interface Pill {
  readonly text: string
  readonly live?: boolean
}

export interface Project {
  readonly id: string
  readonly name: string
  readonly to: string
  readonly period: string
  readonly pills: readonly Pill[]
  readonly summary: string
  readonly quote: string
  readonly stack: readonly string[]
  /** view-transition-name shared with the case study's title. */
  readonly vt: string
}

export const PROJECTS: readonly Project[] = [
  {
    id: 'buffrhq',
    name: 'BuffrHQ',
    to: '/work/buffrhq',
    period: 'Mar 2026 – now',
    pills: [{ text: 'Live on the App Store', live: true }],
    summary:
      'An all-in-one CRM for mobile auto detailers. A React Native app, a Vue 3 owner dashboard, public booking sites, and a Node/Postgres backend, designed and built alone, shipped under Buffr LLC.',
    quote:
      '“No card processing, on purpose. Detailers already get paid through Cash App, Venmo, PayPal and Zelle, and skipping it removed a whole category of risk from a one-person company.”',
    stack: ['React Native', 'Expo', 'Vue 3', 'Node', 'Postgres', 'Mapbox', 'Anthropic API'],
    vt: 'vt-buffrhq',
  },
  {
    id: 'airport-hq',
    name: 'Airport HQ',
    to: '/work/airport-hq',
    period: 'Aug 2026',
    pills: [{ text: 'Prototype' }, { text: 'A couple of days' }],
    summary:
      'A front-end prototype for a small fixed-base operator. Their one-workbook-a-month Google Sheets became screens they already recognized, plus filters across months and questions answered in plain English.',
    quote:
      '“My goal was not to change their process at all, just to show them how powerful the data they already had was.”',
    stack: ['Next.js 16', 'React 19', 'TypeScript', 'Tailwind 4', 'Anthropic API', 'Zod'],
    vt: 'vt-airport',
  },
  {
    id: 'pipeline',
    name: 'Ticket to UAT',
    to: '/work/pipeline',
    period: '2026 · in use',
    pills: [{ text: 'Internal' }, { text: '6 eng · 3 repos' }],
    summary:
      'My team’s Claude Code pipeline, built by a teammate: it reads a ticket, branches, implements, opens a pull request per testing branch, merges into the testing environments, files tickets for what it found outside the scope, and sends the UAT email. Six engineers run it across three repositories. I contributed, and I write the rules and context files underneath it.',
    quote:
      '“Tests are written after a human has verified the behavior, never before. A model writing tests first is guessing at intent, and it will happily encode the wrong thing.”',
    stack: ['Claude Code', 'Agent design', 'CI/CD', 'Human-in-the-loop'],
    vt: 'vt-pipeline',
  },
]

export interface LedgerEntry {
  readonly value: string
  readonly unit?: string
  readonly what: string
  readonly source: string
}

export const LEDGER: readonly LedgerEntry[] = [
  {
    value: '~1',
    unit: 'million',
    what: 'People using the platform where I set front-end technical direction and own the charts',
    source: 'QsrSoft · current',
  },
  {
    value: 'Under 3',
    unit: 'months',
    what: 'First commit to App Store release: four client surfaces and a backend, solo, no specification and no team',
    source: 'BuffrHQ · Apr–Jun 2026',
  },
  {
    value: 'Same day',
    what: 'Turnaround on tickets that used to take two or three, after my team’s agentic pipeline went in',
    source: 'QsrSoft · measured Sep 2026',
  },
  {
    value: '$100M+',
    what: 'Revenue contributed by the enterprise React applications and microservices I built',
    source: 'Dogtopia · 2021',
  },
  {
    value: '60%',
    what: 'Average load-time reduction, through code splitting, lazy loading and state management',
    source: 'Dogtopia · 2021',
  },
  {
    value: '25%',
    what: 'Development-efficiency gain from reusable component patterns built onto the design system',
    source: 'Dogtopia · 2021',
  },
  {
    value: '~25',
    unit: 'reports',
    what: 'People I hired, trained and scheduled running a restaurant floor, before I wrote software for one',
    source: "Jimmy John's · 2015–2020",
  },
]

export interface Shot {
  readonly src: string
  readonly alt: string
  readonly title: string
  readonly caption: string
}

export const BUFFR_SHOTS: readonly Shot[] = [
  {
    src: '/img/buffr-today.webp',
    title: 'Today',
    alt: "BuffrHQ home screen showing the next job en route, low-stock and overdue-invoice alerts, five quick actions, and today's three jobs with times, vehicles and prices.",
    caption:
      'The daily driver: what is happening now, what needs attention, and the five things worth a single tap.',
  },
  {
    src: '/img/buffr-plate.webp',
    title: 'Plate scanner',
    alt: 'Plate scanner screen: a captured photo of a license plate with the characters pixelated, a state selector, a manual plate entry field, and a result panel offering to create a new client.',
    caption:
      'Point the camera at a plate to pull up a returning client. Manual entry and the state selector sit directly underneath, always. The plate is redacted here because it is a real one.',
  },
  {
    src: '/img/buffr-job.webp',
    title: 'Job detail',
    alt: 'Job detail screen with a four-step progress track (Scheduled, En Route, In Progress, Complete), a large Start Job button, services and total, service address, and customer notes.',
    caption:
      'Scheduled → En route → In progress → Complete. Clients are notified on transition, which ended the most common phone call a detailer gets: “are you still coming?”',
  },
  {
    src: '/img/buffr-invoice.webp',
    title: 'Invoice',
    alt: 'Invoice screen listing two line items, a subtotal, tax and total, with actions to resend the invoice, collect via QR, or mark it paid.',
    caption:
      'Generated on site, from the services on the job. Marking it paid is one tap and one thumb.',
  },
  {
    src: '/img/buffr-qrpay.webp',
    title: 'QR pay',
    alt: 'QR Pay screen showing a large QR code to show the client, a shareable pay link, and the four configured payment methods: Cash App, Venmo, PayPal and Zelle.',
    caption: 'Cash App, Venmo, PayPal, Zelle. The customer pays through something already on their phone.',
  },
  {
    src: '/img/buffr-booking.webp',
    title: 'Public booking page',
    alt: "A detailing business's public booking page in a mobile browser, showing the business name, rating, location, an about section, a service list with prices and durations, and a Book Now button.",
    caption:
      'Every business gets one. Requests arrive in the app as an incoming job rather than as an email to answer later.',
  },
]

export interface Figure {
  readonly src: string
  readonly alt: string
  readonly caption: string
}

export const AIRPORT_FIGURES: readonly Figure[] = [
  {
    src: '/img/ahq-dashboard.webp',
    alt: 'Airport HQ dashboard for a fictional FBO: cash box and fuel tank readouts, month-to-date gallons pumped, this month’s fuel revenue, landing fees and net profit estimate, and quick actions to log fuel, add a cash box entry, update the public site or view reports.',
    caption:
      'The morning view: tank levels, the cash box, month to date, and the four things staff start the day doing. The business name is invented; the real one stays anonymous.',
  },
  {
    src: '/img/ahq-insights.webp',
    alt: 'AI Insights page in sample mode: a summary of thirteen months, Jet A fuel as the top earner, the maintenance shop described as a gap in the records rather than a failing line, and a list of dated anomalies with explanations.',
    caption:
      'The analysis layer. The maintenance shop reads as a gap in the records, not a shop to cut, because the prompt was told what the books are missing.',
  },
  {
    src: '/img/ahq-ask.webp',
    alt: 'Ask the data panel: six example question buttons, the question “Which truck earns more, and by how much?”, and an answer comparing Truck #3 on Jet A with Truck #4 on 100LL.',
    caption:
      'The demo question, more or less word for word. In the monthly sheets it is an afternoon of copying columns; here it is one sentence.',
  },
  {
    src: '/img/ahq-profitability.webp',
    alt: 'Profitability page listing margin by service line with revenue, cost, margin percentage and gallons for Jet A, 100LL, landing and ramp fees, hangar rental and the maintenance shop, with explanatory notes under the split lines.',
    caption:
      'Deterministic arithmetic, no model involved, including the 80/20 landing fee split after tax and card fees, and the hangar owner’s 70% share of net rent.',
  },
  {
    src: '/img/ahq-site-content.webp',
    alt: 'Public Site Content page: the fictional FBO’s public homepage rendered inside the staff portal, with the headline, description and fuel prices editable where they appear, and a Save changes button.',
    caption:
      'The public page, editable where it appears: fuel prices, wording, and which detailers and mechanics are listed. No more asking whoever built the website.',
  },
]
