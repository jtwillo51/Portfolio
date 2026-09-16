/**
 * Static server for the built site, resolving paths the way Cloudflare Pages
 * does: `/resume` serves `resume.html`, and a trailing slash is 308-redirected
 * away, so local testing sees the same URLs the live site uses.
 */
import http from 'node:http'
import { readFile } from 'node:fs/promises'
import { extname, join, normalize } from 'node:path'

const ROOT = new URL('../dist/', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')
const PORT = Number(process.env.PORT ?? 4322)

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
}

const send = (res, status, body, type) => {
  res.writeHead(status, { 'Content-Type': type })
  res.end(body)
}

http
  .createServer(async (req, res) => {
    const [rawPath, query] = (req.url ?? '/').split('?')
    // Pages drops a trailing slash with a permanent redirect; so does this.
    if (rawPath.length > 1 && rawPath.endsWith('/')) {
      res.writeHead(308, { Location: rawPath.replace(/\/+$/, '') + (query ? `?${query}` : '') })
      return res.end()
    }
    const path = normalize(decodeURIComponent(rawPath))
    const candidates = extname(path)
      ? [path]
      : path === '/' || path === '\\'
        ? ['index.html']
        : [`${path}.html`, join(path, 'index.html')]
    for (const candidate of candidates) {
      try {
        const body = await readFile(join(ROOT, candidate))
        return send(res, 200, body, TYPES[extname(candidate)] ?? 'application/octet-stream')
      } catch {
        /* try the next candidate */
      }
    }
    try {
      return send(res, 404, await readFile(join(ROOT, '404.html')), TYPES['.html'])
    } catch {
      return send(res, 404, 'Not found', TYPES['.txt'])
    }
  })
  .listen(PORT, '127.0.0.1', () => console.log(`serving dist on http://127.0.0.1:${PORT}`))
