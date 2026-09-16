/**
 * Packs the site into one self-contained HTML file for a hosted preview.
 * Not part of deploying — `dist/` is what ships. This exists so the work can be
 * shared as a single link with no server behind it, which is why the preview
 * build uses hash routing.
 *
 *   npm run build:preview
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const src = join(root, 'dist-preview')
const publicDir = join(root, 'public')

if (!existsSync(src)) throw new Error('run `vite build --mode preview` first')

const dataUri = (path, mime) =>
  `data:${mime};base64,${readFileSync(path).toString('base64')}`

/** Public assets are referenced by absolute path, so they are swapped by name. */
function inlinePublicAssets(text) {
  return text
    // The preview build writes fonts as ../fonts/x.woff2; swallow the relative
    // prefix too, or the result is url(..data:…), which is not a URL at all.
    .replace(/(?:\.{1,2})?\/fonts\/([a-z0-9-]+)\.woff2/gi, (_, name) =>
      dataUri(join(publicDir, 'fonts', `${name}.woff2`), 'font/woff2'),
    )
    .replace(/\/img\/([a-z0-9-]+)\.(webp|jpg)/gi, (_, name, ext) =>
      dataUri(join(publicDir, 'img', `${name}.${ext}`), ext === 'jpg' ? 'image/jpeg' : 'image/webp'),
    )
}

const assets = readdirSync(join(src, 'assets'))
const jsFile = assets.find((f) => f.endsWith('.js'))
const cssFile = assets.find((f) => f.endsWith('.css'))
if (!jsFile || !cssFile) throw new Error('expected exactly one js and one css chunk')

const css = inlinePublicAssets(readFileSync(join(src, 'assets', cssFile), 'utf8'))
const js = inlinePublicAssets(readFileSync(join(src, 'assets', jsFile), 'utf8'))

const html = readFileSync(join(src, 'index.html'), 'utf8')

// Everything the artifact host wraps for us comes out; everything the page
// needs goes in.
const body = html
  .slice(html.indexOf('<body>') + '<body>'.length, html.indexOf('</body>'))
  .replace(/<script[^>]*src="[^"]*"[^>]*><\/script>/g, '')
  .trim()

const themeScript = `<script>try{var t=localStorage.getItem('theme');if(t)document.documentElement.dataset.theme=t;}catch(e){}</script>`

const out = `<title>Jeremy Willoughby</title>
${themeScript}
<style>
${css}
</style>

${body}

<script type="module">
${js}
</script>
`

const target = join(root, 'preview.html')
writeFileSync(target, out, 'utf8')
console.log(`preview.html  ${(Buffer.byteLength(out) / 1024 / 1024).toFixed(2)} MB`)
