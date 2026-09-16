/** Everything that appears in more than one place, in one place. */

export const SITE_URL = 'https://jeremywilloughby.com'

export const PERSON = {
  name: 'Jeremy Willoughby',
  role: 'Software Engineer',
  location: 'Gilbert, Arizona',
  availability: 'Remote or Phoenix metro',
  email: 'hello@jeremywilloughby.com',
} as const

export const LINKS = {
  linkedin: 'https://www.linkedin.com/in/jeremy-willoughby/',
  github: 'https://github.com/jtwillo51',
  appStore: 'https://apps.apple.com/us/app/buffrhq-detailing-app-crm/id6766998111',
} as const

/** The footer's contact row, used on every page. */
export const CONTACT_LINKS: ReadonlyArray<{ label: string; href: string; external?: boolean }> = [
  { label: PERSON.email, href: `mailto:${PERSON.email}` },
  { label: 'Résumé', href: '/resume' },
  { label: 'LinkedIn', href: LINKS.linkedin, external: true },
  { label: 'GitHub', href: LINKS.github, external: true },
  { label: 'App Store', href: LINKS.appStore, external: true },
]
