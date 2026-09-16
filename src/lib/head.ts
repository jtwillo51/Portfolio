import type { RouteMeta } from 'vue-router'
import { SITE_URL } from '@/data/site'

/**
 * Document head, driven off typed route meta. Two implementations of the same
 * source of truth: one that returns a string for the prerender pass, one that
 * mutates the live document after a client-side navigation.
 */

interface Tag {
  readonly el: 'title' | 'meta' | 'link'
  readonly attrs?: Record<string, string>
  readonly text?: string
}

/** One card for every page, at the 1200×630 LinkedIn, Slack and iMessage crop to.
 *  Absolute, because link scrapers do not resolve relative URLs. */
const OG_IMAGE = `${SITE_URL}/og.png`
const OG_IMAGE_ALT =
  'Jeremy Willoughby, software engineer in Gilbert, Arizona: I build software for people who are standing up.'

function tagsFor(meta: RouteMeta, path: string): Tag[] {
  const canonical = SITE_URL + (path === '/' ? '/' : path)
  const tags: Tag[] = [
    { el: 'title', text: meta.title },
    { el: 'meta', attrs: { name: 'description', content: meta.description } },
    { el: 'link', attrs: { rel: 'canonical', href: canonical } },
    { el: 'meta', attrs: { property: 'og:type', content: meta.ogType ?? 'website' } },
    { el: 'meta', attrs: { property: 'og:title', content: meta.ogTitle ?? meta.title } },
    { el: 'meta', attrs: { property: 'og:description', content: meta.ogDescription ?? meta.description } },
    { el: 'meta', attrs: { property: 'og:url', content: canonical } },
    { el: 'meta', attrs: { name: 'twitter:card', content: 'summary_large_image' } },
    { el: 'meta', attrs: { property: 'og:image', content: OG_IMAGE } },
    { el: 'meta', attrs: { property: 'og:image:width', content: '1200' } },
    { el: 'meta', attrs: { property: 'og:image:height', content: '630' } },
    { el: 'meta', attrs: { property: 'og:image:alt', content: OG_IMAGE_ALT } },
    { el: 'meta', attrs: { name: 'twitter:image', content: OG_IMAGE } },
  ]
  if (meta.noindex) tags.push({ el: 'meta', attrs: { name: 'robots', content: 'noindex' } })
  return tags
}

const escapeAttr = (v: string) =>
  v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/** Prerender: serialize the head so the HTML on disk is already correct. */
export function renderHead(meta: RouteMeta, path: string): string {
  return tagsFor(meta, path)
    .map((t) => {
      const attrs = Object.entries(t.attrs ?? {})
        .map(([k, v]) => ` ${k}="${escapeAttr(v)}"`)
        .join('')
      // Marked so a client-side navigation replaces these rather than
      // appending a second set beside them.
      return t.el === 'title'
        ? `<title>${escapeAttr(t.text ?? '')}</title>`
        : `<${t.el}${attrs} data-head>`
    })
    .join('\n')
}

/**
 * Client: reconcile the head after a route change. Tags this function owns are
 * marked, so it can replace exactly its own and leave the static ones alone.
 */
export function applyHead(meta: RouteMeta, path: string): void {
  document.title = meta.title
  document.querySelectorAll('[data-head]').forEach((n) => n.remove())
  for (const t of tagsFor(meta, path)) {
    if (t.el === 'title') continue
    const node = document.createElement(t.el)
    for (const [k, v] of Object.entries(t.attrs ?? {})) node.setAttribute(k, v)
    node.setAttribute('data-head', '')
    document.head.appendChild(node)
  }
}
