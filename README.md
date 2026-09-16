# jeremywilloughby.com

> **Two files never leave this machine.** `guide.md` holds private notes, and
> `preview.html` is a complete single-file copy of the site. Both are in
> `.gitignore`, and neither lives in `public/`, so the build never copies them.
> Keep it that way.

A portfolio site. Vue 3 with the Composition API, strict TypeScript, Vue Router
and Vite, **prerendered to static HTML at build time**, so every page is a real
document that a crawler can read and a reader can use with JavaScript off.

Two runtime dependencies (`vue`, `vue-router`). No third-party requests, no
analytics, no cookies.

```
index.html              Vite entry, plus the head placeholders the prerender fills
prerender.mjs           Renders every route to disk after the build; writes the sitemap
vite.config.ts          One CSS file, @ alias, ES2022, and the preview build's settings
src/
  main.ts               App factory shared by the client and the prerender
  entry-client.ts       Hydrates prerendered markup; mounts fresh when #app is empty
                        (the dev server and the single-file preview)
  entry-server.ts       render(url) for the prerender pass
  router.ts             Seven routes (six pages and a 404) with typed meta
  App.vue               Skip link, header, <RouterView>, footer
  assets/site.css       The design system: tokens, primitives, layout, motion
  composables/
    useTheme.ts           Theme state and the View Transitions wipe
    useRoutePlanner.ts    The nearest-neighbor planner, as reactive state
    useScrollProgress.ts  Pinned-section progress for the build film
    useLocalTime.ts       Phoenix time and a rough reply status, client-only
  directives/reveal.ts  v-reveal, the scroll-entrance treatment
  lib/head.ts           One source of truth for <head> (title, canonical, Open Graph),
                        used by both the prerender and client navigation
  lib/mech.ts           Flat drawing kit: meshed gear trains, coil springs,
                        rounded bodies, sparklines
  lib/film.ts           The film's four acts: timing, captions, still framing
  components/           21 SFCs, each with its own <style scoped>.
                        BuildFilm and FilmStage are the home page's cinematic
                        piece: front-end prototype to shipped product, as one
                        scroll-scrubbed shot. FilmStage is a pure function of
                        progress, so the fallback is four stills from it.
  views/                Seven views: six pages and the 404
  data/                 site.ts (name, email, links, SITE_URL), work.ts (tabular
                        content), conversation.ts (the home page Q&A, AskMe.vue),
                        roles.ts (the hiring view, RoleFit.vue)
public/                 Fonts, images, og.png, favicon, robots.txt
scripts/
  serve.mjs             Static server for dist, resolving paths like a real host
  bundle-preview.mjs    Packs the site into one HTML file for a shareable preview
  og-card.html          Source for public/og.png
```

## Running it

```bash
npm install
```

```bash
npm run dev
```

The dev server does not prerender, so it sends an empty `#app` and the client
mounts fresh. To see what actually ships, build and serve it:

```bash
npm run build
```

```bash
npm run serve
```

```bash
npm run typecheck
```

## Building

`npm run build` runs three steps: a client build, an SSR build, and
`prerender.mjs`, which renders each route with `vue/server-renderer` and writes it
to `dist/`. Every route is a flat file (`/resume` is `resume.html`), which
Cloudflare Pages serves at `/resume` with no redirect. Don't switch to folder
indexes (`resume/index.html`): Pages would 308 `/resume` to `/resume/`, away from
the canonical URLs, the sitemap and every internal link. The sitemap is generated
from the same route list, so it cannot drift.

`npm run build:preview` produces `preview.html`: the whole site in one file, with
hash routing and every font and image inlined, for sharing as a single link. It is
gitignored and is not part of deploying.

## Deploying (Cloudflare Pages)

`dist/` is the whole site. It goes up by direct upload, with no Git integration,
so only the built site ever leaves this machine.

```bash
npm run build
```

```bash
npx wrangler pages deploy dist --project-name jeremywilloughby
```

The first time only, log in and create the project before deploying:

```bash
npx wrangler login
```

```bash
npx wrangler pages project create jeremywilloughby --production-branch main
```

- **Domains.** `jeremywilloughby.com` is the site, with `www` redirected to it.
  `jeremywiloughby.com` (one L, a likely misspelling) is also owned and redirects
  to the real domain through proxied placeholder DNS records and a redirect rule.
- **The domain is written in three places** that must agree: `SITE_URL` in
  `src/data/site.ts`, `origin` in `prerender.mjs`, and the `Sitemap` line in
  `public/robots.txt`.
- **Email.** The address the site shows is `PERSON.email` in `src/data/site.ts`,
  the only place it is defined. A domain address goes through Cloudflare Email
  Routing to a personal inbox.
- **Cloudflare must not rewrite the pages.** Left alone, the proxy injects a Web
  Analytics beacon from `static.cloudflareinsights.com` (breaking the colophon's
  "no third-party requests") and obfuscates every email address into
  `[email protected]`, which only JavaScript restores. `public/_headers` sets
  `Cache-Control: ... no-transform` on every path, which stops both. Also keep
  Email Address Obfuscation, Web Analytics automatic setup and Rocket Loader off
  in the dashboard. After any deploy, fetch a page with a browser user agent and
  confirm it matches `dist/` byte for byte.
- **No SPA fallback.** Every route is a file, and `404.html` is served for
  anything else.
- **Page weight.** Measure against the live site after deploying, and keep the
  figures on `/colophon` in step with it.

## Things to know before editing

**Every claim on the site has to be true and defensible in an interview.**
Airport HQ stays anonymous: the operator, the airport and its location are never
named, and the business in the screenshots is invented. BuffrHQ install and revenue
numbers are not published. QsrSoft clients are described generically. The résumé
omits the phone number that is on the PDF CVs; anything here is public and
permanently scrapeable, and email plus LinkedIn is enough for a recruiter.

**Writing style.** No em dashes in visible copy; they read as machine-written. Use
a comma, a colon, parentheses or a new sentence. American spelling throughout.
Code comments are exempt from both.

**Hydration.** Production pages must hydrate without a mismatch. Check the console
on the built site (`npm run build` then `npm run serve`), not on the dev server,
which has no prerendered markup to compare against.

**A build guard exists because of a real bug.** Vue's scoped-CSS transform
silently dropped the descendant half of a `:global(:root…) .thing` selector,
leaving `:root { display: none }` in the bundle and blanking every page. The dev
server was fine; only the production build was broken. `prerender.mjs` now asserts
that both theme token sets survive minification and that nothing sets `display` on
`:root` itself. **Do not use `:global()` with a descendant in scoped styles.**
Scoped CSS already appends the scope attribute to the *last* compound selector, so
`:root[data-theme='dark'] .thing { }` works as written.

**The design tokens are all in one block** at the top of `src/assets/site.css`:
`:root` for light, then a `prefers-color-scheme: dark` block guarded by
`:root:not([data-theme='light'])`, then `:root[data-theme='dark']` so the toggle
wins in both directions. Never give a color its only definition inside a media
query, or the toggle will half-work.

**`--signal` is only for state.** A live badge, the first stop on a route, a human
step in the pipeline diagram, the rule under a hovered link. The moment it becomes
decoration, the page stops reading as an instrument.

**Global stylesheet vs scoped styles.** `site.css` holds tokens, the reset,
typographic primitives and page scaffolding. Anything belonging to one component
lives in that component's `<style scoped>`. If you find yourself adding a
component's appearance to `site.css`, it probably wants to be a component.

**The claims on `/colophon` are checkable, so keep them true.** The stated weights,
the contrast levels and the accessibility list were all measured against the built
site. If you change the palette, re-check contrast. If you add a dependency,
re-measure the bundle.

## How the fonts were made

Downloaded from Google Fonts as variable woff2 (Latin subset), then subset again to
the glyph set this site actually uses, with all variable axes preserved:

```bash
pip install fonttools brotli
```

```bash
python -m fontTools.subset anybody.woff2 --unicodes='U+0020-007E,U+00A0,U+00A9,U+00B0,U+00B7,U+00C9,U+00D7,U+00E9,U+2013,U+2014,U+2018,U+2019,U+201C,U+201D,U+2022,U+2026,U+2190,U+2192,U+2197,U+2212' --layout-features='kern,liga,calt,tnum,case' --flavor=woff2 --no-hinting --output-file=anybody.sub.woff2
```

The character list is derived by scraping the rendered text out of the built pages
and adding case-transformed forms (so `text-transform: uppercase` has an `É` to
render). 179 KB for four families, down from 310 KB. If you add a glyph that isn't
in it (a new symbol, an accented name), it will silently fall back to the system
font. Re-subset instead.

One known exception: the source families don't ship `→`, `←` or `↗` in their Latin
subsets, so the arrows in link text come from the system font. At 13px that is
invisible; if it ever isn't, swap them for the inline SVG arrow the buttons use.

## Images

Screenshots are WebP in `public/img/`, sized to roughly twice their display width,
and carry `width`/`height` so nothing shifts as they load.

`public/img/jeremy.jpg` is the chat avatar: a copy of the GitHub profile photo,
self-hosted so the page makes no request to GitHub. If the GitHub photo changes,
this copy does not.

`public/og.png` is the 1200×630 link-preview card that `lib/head.ts` points every
page at. Its source is `scripts/og-card.html`. To regenerate it, run headless
Chrome from the project root in Git Bash. Chrome needs the card as a full
`file:///` URL (a bare relative path is read as a web address), and the virtual
time budget lets the fonts load before the capture:

```bash
"/c/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --hide-scrollbars --force-device-scale-factor=1 --window-size=1200,630 --virtual-time-budget=5000 --screenshot="$(pwd -W)/public/og.png" "file:///$(pwd -W)/scripts/og-card.html"
```

The preview bundler inlines `.webp` and `.jpg` from `public/img/`. Add a case in
`scripts/bundle-preview.mjs` before using any other format there.

The license plate in `buffr-plate.webp` is redacted in two places: the photo and
the recognized string beneath it. It is a real plate. If that screenshot is ever
regenerated, redact it again.

## Verification

Checked with axe-core (WCAG 2.0/2.1/2.2 AA plus best practice) across all seven
routes and both themes, plus a scripted pass for horizontal overflow at seven
widths from 1440 down to 320, tab order, the no-JavaScript path, console errors,
and the route planner's reactive state. Re-run something equivalent after any
significant change; the site's argument depends on those claims holding.

## Content shape

The case studies follow a fixed skeleton: problem → constraints → what I decided
and what I rejected → what it does → outcome → what I'd do differently. The
decisions section is the point of each page. Each decision ends in a
chose / rejected / cost triple, and the cost is not optional: a decision with no
stated cost reads as a slogan. `DecisionCall.vue` takes those three as required
props for exactly that reason.
