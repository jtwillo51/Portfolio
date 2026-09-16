/**
 * Prerender: render every route with Vue's server renderer and write it to disk
 * as real HTML, so the site ships as static files that a crawler can read and a
 * reader can get to with JavaScript switched off. The client bundle then
 * hydrates the same app.
 *
 * Runs after `vite build` and `vite build --ssr`.
 */
import { mkdirSync, readdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = dirname(fileURLToPath(import.meta.url))
const dist = join(root, 'dist')

// The route list comes from src/router.ts, so it cannot drift from the app.
const { render, PRERENDER_ROUTES: ROUTES } = await import('./dist-ssr/entry-server.js')

/* Guard against a real bug this project hit once: Vue's scoped-CSS transform
   silently dropped the descendant half of a `:global(:root…) .thing` selector,
   which left `:root { display: none }` in the bundle and blanked every page.
   The dev server was fine; only the build was broken. So the build asserts that
   both theme token sets survived minification. */
const cssFile = readdirSync(join(dist, 'assets')).find((f) => f.endsWith('.css'))
const css = readFileSync(join(dist, 'assets', cssFile), 'utf8')
const stripped = css.replace(/\s+/g, '')
for (const token of ['--paper:#e8e7e1', '--paper:#0c1116']) {
  if (!stripped.includes(token)) {
    throw new Error(`built CSS lost ${token} — a scoped style is leaking into :root`)
  }
}
for (const [, selector, body] of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
  const sel = selector.trim()
  const targetsRootItself = sel.includes(':root') && !/[\s>+~]/.test(sel.replace(/\([^)]*\)/g, ''))
  if (targetsRootItself && /(^|;)\s*display\s*:/.test(body)) {
    throw new Error(`built CSS sets display on :root itself — a scoped selector lost its descendant: ${sel}`)
  }
}

const template = readFileSync(join(dist, 'index.html'), 'utf8')

if (!template.includes('<!--app-html-->') || !template.includes('<!--app-head-->')) {
  throw new Error('index.html lost its render placeholders')
}

/** Every route is a flat `.html` file: `/resume` is `resume.html`. Cloudflare
 *  Pages serves that at `/resume` with no redirect, which matches the canonical
 *  URLs, the sitemap and every internal link. A folder index (`resume/index.html`)
 *  would make Pages 308 `/resume` to `/resume/`, away from all of them. */
function outputPath(url) {
  if (url === '/') return join(dist, 'index.html')
  return join(dist, `${url.slice(1)}.html`)
}

const written = []
for (const url of ROUTES) {
  const { html, head } = await render(url)
  const page = template.replace('<!--app-head-->', head).replace('<!--app-html-->', html)
  const file = outputPath(url)
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, page, 'utf8')
  written.push([url, Buffer.byteLength(page)])
}

// The sitemap is generated from the same list, so it cannot drift.
const origin = 'https://jeremywilloughby.com'
const indexable = ROUTES.filter((r) => r !== '/404')
writeFileSync(
  join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    indexable
      .map((r) => `  <url><loc>${origin}${r}</loc><priority>${r === '/' ? '1.0' : '0.8'}</priority></url>`)
      .join('\n') +
    `\n</urlset>\n`,
  'utf8',
)

// The SSR bundle is a build artifact, not something to deploy.
rmSync(join(root, 'dist-ssr'), { recursive: true, force: true })

console.log(`prerendered ${written.length} routes`)
for (const [url, bytes] of written) {
  console.log(`  ${(bytes / 1024).toFixed(1).padStart(6)} KB  ${url}`)
}
