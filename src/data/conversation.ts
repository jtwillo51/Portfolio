/**
 * The conversation on the home page: what a visitor can ask, and what I'd say.
 *
 * The chat is a friendlier way in, not a second set of claims — where a story
 * has a long version elsewhere on the site, the answer links to it. Replies are
 * short on purpose: a bubble is read at a glance.
 */

export type TopicId =
  | 'job'
  | 'origin'
  | 'outside'
  | 'proud'
  | 'together'
  | 'forward'
  | 'ai'
  | 'airport'
  | 'hardest'
  | 'vue'
  | 'first'
  | 'mistake'
  | 'day'
  | 'looking';

export interface Topic {
  /** The visitor's side, as it appears on the button. */
  readonly ask: string;
  /** My side, one bubble each. */
  readonly reply: readonly string[];
  /** Where the long version lives, if there is one. */
  readonly link?: { readonly to: string; readonly label: string };
  /** What someone would naturally ask next. */
  readonly next: readonly TopicId[];
  /** The subject line if they email me after this. */
  readonly subject: string;
}

export const GREETING: readonly string[] = [
  "Hi, I'm Jeremy.",
  "I'm a software engineer in Gilbert, Arizona. Ask me whatever you'd ask if we'd just sat down for coffee.",
];

/** The first five on offer. The rest turn up as follow-ups. */
export const OPENERS: readonly TopicId[] = [
  'job',
  'origin',
  'outside',
  'proud',
  'together',
];

/** Fallback order for suggestions once the obvious follow-ups are used up. */
export const ORDER: readonly TopicId[] = [
  'job',
  'origin',
  'outside',
  'proud',
  'together',
  'forward',
  'ai',
  'airport',
  'hardest',
  'vue',
  'first',
  'mistake',
  'day',
  'looking',
];

export const TOPICS: Readonly<Record<TopicId, Topic>> = {
  job: {
    ask: 'So what do you actually do?',
    reply: [
      "I'm a senior software engineer at QsrSoft, and the front-end subject matter expert on a platform close to a million people use, mostly restaurant operators running their day from dashboards whose charts I own.",
      "In practice that means setting the front end's technical direction, owning the charts on the data-heavy screens, and being who the team comes to on components and code quality.",
    ],
    next: ['day', 'vue', 'ai'],
    subject: 'Your work at QsrSoft',
  },
  origin: {
    ask: 'How did you get into software?',
    reply: [
      'Sideways. I spent five years as the second-in-command manager at a Jimmy John’s in Orem, Utah. About twenty-five people, hiring through inventory, and the whole store whenever the general manager was out.',
      "In 2020 I stepped back from managing to retrain through Lambda School, and I've been an engineer full-time since 2021.",
      'I wanted a career that could support the life I wanted. Then I fell in love with it: the logic, the order, the rules, the possibilities. Full-time work by day, school at night.',
      "It's why I keep building operational software. I know what someone running a shift doesn't have time for.",
    ],
    next: ['first', 'together', 'job'],
    subject: 'From restaurants to software',
  },
  outside: {
    ask: 'What do you do when you’re not working?',
    reply: [
      "Mostly I'm helping take care of my two young kids.",
      "When there's time left over I'm making things, cleaning cars, trying new restaurants, or hunting, when I get the shot. I miss looking after my goats and chickens.",
      "Put that next to my résumé and there's a pattern. I clean cars, and I built a CRM for auto detailers. I love animals, and my first engineering job was at a dog daycare company. I helped run a restaurant, and now I build software for them.",
    ],
    next: ['proud', 'origin', 'looking'],
    subject: 'Outside work',
  },
  proud: {
    ask: 'What are you proudest of?',
    reply: [
      'BuffrHQ. It’s a CRM for mobile auto detailers, and I built all of it alone: the iPhone app, the owner dashboard, the booking sites, the backend. First commit to the App Store in under three months.',
      "My favorite decision in it is something I didn't build: card processing. Detailers already get paid through Cash App, Venmo, PayPal and Zelle, so the invoice meets them there, and a one-person company never takes on chargebacks or compliance.",
    ],
    link: { to: '/work/buffrhq', label: 'Read the BuffrHQ case study' },
    next: ['airport', 'mistake', 'looking'],
    subject: 'BuffrHQ',
  },
  together: {
    ask: 'What are you like to work with?',
    reply: [
      "I'll explain the trade-off even when nobody asked for one. That habit is from managing a restaurant floor. People carry out a decision better when they know why it was made.",
      'I mentor mostly by pairing. Showing a pattern done well travels further than mandating it. And when I kept teaching every new hire the same standards, I built them into Claude hooks and rules instead, so nobody has to check for them by hand.',
      "And one thing I'm firm on: AI-written code should be surrounded by tests that check for explicit behavior.",
    ],
    next: ['day', 'ai', 'looking'],
    subject: 'Working together',
  },
  forward: {
    ask: 'Why forward deployed?',
    reply: [
      "I like seeing how people actually work, and finding where I can make their day easier. There's something great about handing someone the right tool for the job.",
      'Most businesses are the same shape underneath: a product or service, and a profit. They all need to track numbers, show what they sell, and help new customers find them. Good tools take that mental work off people so they can enjoy the job.',
      "Recently I sat in on a client call about a delivery-partner report I'd built for a major quick-service chain. I'd led with a combined five-week average and some tax metrics. They wanted each delivery partner stacked separately, and average checks, so that's what it shows first now.",
    ],
    next: ['airport', 'hardest', 'looking'],
    subject: 'Forward deployed work',
  },
  ai: {
    ask: 'How do you use AI?',
    reply: [
      'Every day. A teammate built a Claude Code pipeline that six of us now run across three repositories: a ticket goes in, and it comes out merged into our testing environments with the UAT email sent. My part is underneath it: the rules, context files and hooks that make our repositories legible to an agent.',
      'Tickets that used to take two or three days close the same day.',
      "The rule I care most about: tests get written after a person has checked the behavior, never before. A model writing tests first is guessing at what you meant, and it'll happily lock in the wrong thing.",
    ],
    link: { to: '/work/pipeline', label: 'How the pipeline works' },
    next: ['together', 'proud', 'job'],
    subject: 'AI at work',
  },
  airport: {
    ask: 'What’s the most unusual project you’ve done?',
    reply: [
      "Airport HQ. My dad started working at a small airport's FBO (the business that sells the fuel and rents the hangars) and asked me to look over their systems.",
      'They ran everything on hand-entered Google Sheets, one workbook per month, so nobody could see a trend. I built a prototype in a couple of days on the shape of their real numbers, without changing how they work at all, and you could ask it questions in plain English.',
      "They liked it but weren't ready to switch, and I was upfront that it would have been one person supporting it. I'd do it again tomorrow.",
    ],
    link: { to: '/work/airport-hq', label: 'Read the Airport HQ case study' },
    next: ['forward', 'proud', 'looking'],
    subject: 'Airport HQ',
  },
  hardest: {
    ask: 'What’s the hardest thing you’ve shipped?',
    reply: [
      'Our Vue 2 to Vue 3 migration at QsrSoft: over sixty engineers across a lot of teams, while we were also moving from a monorepo to microservices.',
      'Nobody could pause feature work to migrate, so we maintained both for a while. I wrote shared components, helped plan it, taught people Vue 3, and simplified the process so the learning curve was as short as possible.',
      'Getting leadership on board took a few months (Vue 2 was reaching end of life, and we needed the performance), and I helped a little with that. The migration itself took about a year. It’s done.',
    ],
    link: { to: '/resume', label: 'See it on my résumé' },
    next: ['mistake', 'vue', 'together'],
    subject: 'The Vue 3 migration',
  },
  vue: {
    ask: 'Why Vue?',
    reply: [
      "It's what I work in every day. I helped drive our Vue 2 to Vue 3 migration on a live codebase without customers noticing.",
      "I'm not precious about it. BuffrHQ's app is React Native, and I've shipped React professionally. Vue is where I'm fastest. This site is Vue 3, too.",
    ],
    next: ['hardest', 'job', 'looking'],
    subject: 'Vue',
  },
  first: {
    ask: 'What was your first engineering job?',
    reply: [
      'Dogtopia, the dog daycare company. I worked on an internal tool for running the daycares, and not many people ended up using it.',
      'It taught me the lesson I use most: put the effort where people will feel it. I can spend forever polishing something that doesn’t matter, or a little time on the part that makes someone’s day noticeably easier.',
    ],
    next: ['origin', 'mistake', 'job'],
    subject: 'Your first engineering job',
  },
  mistake: {
    ask: 'Tell me about a mistake you made.',
    reply: [
      "I shipped a chart that assumed every user had a store assigned. A test account didn't, and the whole app crashed. It reached production, though luckily only internal users hit it.",
      'I reverted, fixed it, added checks, and redeployed. Now that chart says “please select at least one store” instead of taking everything down with it.',
      'The real lesson was containment: when one piece breaks, only that piece should break, not the whole application.',
    ],
    next: ['hardest', 'first', 'together'],
    subject: 'A mistake you learned from',
  },
  day: {
    ask: 'What’s a normal day like?',
    reply: [
      "Mostly building, and following up on work I've got in testing. A call with my manager, a junior engineer with a question now and then, and only a few meetings a week.",
      "I also try to keep the team feeling like a team. We started a quick 30-minute weekly check-in (what we're working on, what's going well, where we're stuck), and our manager ties the company's goals to what they mean for us.",
      "The point is more pairing. You can't feel like a team if you don't know who your teammates are.",
    ],
    next: ['together', 'job', 'looking'],
    subject: 'Your day to day',
  },
  looking: {
    ask: 'What are you looking for next?',
    reply: [
      "Forward deployed or senior front-end work, remote or on-site anywhere around Phoenix. I just moved back to Arizona at the beginning of 2026, so I'm not ready to relocate just yet.",
      "Ideally software that people run a shift or a business from. That's where I'm most useful: I've been on the other side of that screen.",
    ],
    next: ['forward', 'together', 'proud'],
    subject: 'A role you might like',
  },
};
