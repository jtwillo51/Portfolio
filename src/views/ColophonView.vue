<script setup lang="ts">
import StudySection from '@/components/StudySection.vue'
import SpecList from '@/components/SpecList.vue'

const SPEC = [
  { term: 'Framework', detail: 'Vue 3, Composition API, single-file components' },
  { term: 'Language', detail: 'TypeScript, strict' },
  { term: 'Build', detail: 'Vite, then prerendered to static HTML' },
  { term: 'Runtime deps', detail: 'Two: vue and vue-router' },
  { term: 'Third-party requests', detail: 'Zero' },
]

/** Measured against the built site, not estimated. */
const WEIGHT = [
  { value: '179', unit: 'KB', what: 'Four variable typefaces, subset, and still the largest thing on the page', source: 'woff2, preloaded' },
  { value: '44.5', unit: 'KB', what: 'Vue, Vue Router and the app shell, gzipped: the whole framework cost', source: 'Entry bundle' },
  { value: '11.9', unit: 'KB', what: "This route's own chunk, gzipped. The other five are not downloaded", source: 'Code-split per route' },
  { value: '8.1', unit: 'KB', what: 'The whole stylesheet, gzipped (38 KB before compression)', source: 'One file, no reset library' },
  { value: '~253', unit: 'KB', what: 'Everything the home page fetches, cold and uncached, in nine requests', source: 'Measured, gzip on' },
  { value: '0', what: 'Third-party requests, trackers, cookies and consent banners', source: 'By construction' },
]

const CHECKS = [
  { strong: 'Every page is real HTML on disk.', rest: 'The build renders each route with Vue’s server renderer and writes it out, so the content is there before a byte of JavaScript executes, and stays there if it never does.' },
  { strong: 'A skip link is the first tab stop', rest: 'on every page, and it is visible when focused.' },
  { strong: 'Every focusable element has a visible ring', rest: '(2px signal, 3px offset), and nothing relies on hover alone to be discoverable.' },
  { strong: 'The route planner works without a pointer.', rest: 'Add stop and Reset do everything clicking the plot does, and the result is announced to a live region driven by a computed property.' },
  { strong: 'One h1 per page, headings in order,', rest: 'landmark elements throughout, and no heading level skipped to get a font size.' },
  { strong: 'Alt text describes the screenshot,', rest: 'not the file. If you cannot see the image, the sentence still tells you what is on that screen.' },
  { strong: 'The screenshot rail is focusable', rest: 'and scrolls with the arrow keys, so a horizontally scrolling region is not a pointer-only region.' },
  { strong: 'The pipeline diagram has a text description', rest: 'generated from the same step list that draws it, so the two can never drift apart.' },
  { strong: 'The build film can be driven without scrolling.', rest: 'Each act has a button, and the buttons move the page to that act rather than setting the film directly, so a keyboard user drives exactly the same thing as a scrolling one, not a second, parallel state.' },
  { strong: 'The conversation on the home page is buttons, not a text box.', rest: 'It is scripted and does not pretend otherwise. Replies arrive in a live region, keyboard focus moves to the next questions once an answer finishes, and without JavaScript the same questions and answers render as a plain list.' },
  { strong: 'The hiring section is a real tab set.', rest: 'Arrow keys, Home and End move between roles, only the selected tab sits in the tab order, and the choice is kept in the address bar so the link can go to the rest of a hiring panel. Without JavaScript every role renders in full.' },
  { strong: 'No keyboard traps, no positive tabindex,', rest: 'and the tab order follows the reading order because the DOM order does.' },
]
</script>

<template>
  <article class="study">
    <div class="shell">
      <header class="study__head">
        <p class="label">Colophon</p>
        <h1>How this site is put together</h1>
        <p class="study__sub">
          Every CV I send claims accessibility, responsive design and measurable performance
          work. A portfolio that failed a contrast check would contradict my own documents in
          front of the audience most likely to check. So: the receipts.
        </p>
      </header>
      <SpecList :items="SPEC" />
    </div>

    <StudySection label="Construction" heading="Vue 3 and TypeScript, prerendered to static HTML.">
      <div class="prose">
        <p>
          Single-file components with <code>&lt;script setup&gt;</code> and the Composition API,
          Vue Router for six routes, and strict TypeScript throughout, including the router's
          <code>RouteMeta</code>, so a page that forgets its description fails the type check
          rather than shipping an empty tag.
        </p>
        <p>
          It does not ship as a single-page app. At build time every route is rendered with
          Vue's server renderer and written to disk as real HTML, and the client hydrates that
          same app. The case studies are the point of this site; they should exist as documents
          a crawler can read and a reader can get to with JavaScript switched off.
        </p>
        <p>
          There are also no third-party requests at all: no CDN, no analytics, no fonts
          fetched from Google, no embeds. Nothing on this site phones anywhere, which is a
          privacy decision as much as a performance one.
        </p>
      </div>
    </StudySection>

    <StudySection label="Why a framework" heading="What Vue costs here, and what it buys.">
      <div class="prose">
        <p>
          The honest accounting first: the previous version of this site was hand-written HTML
          with no framework and no build step, and it was <strong>56&nbsp;KB lighter over the
          wire</strong>: 197&nbsp;KB against 253. That is what the framework costs here, measured
          rather than estimated, and I am not going to pretend it is free.
        </p>
        <p>
          What it buys is the part of this site that is actually a program. The route planner
          on the home page is a composable: reactive stops, a computed tour, computed distance
          and saving, and a computed sentence for the live region. Push a stop and everything
          downstream recomputes; the component only has to draw the result. The previous
          version built those SVG nodes by hand, and that is where its one real bug lived.
        </p>
        <p>
          The rest of it is the same argument at a smaller scale. The design system is enforced
          by typed component props rather than by remembering which class goes where. The
          pipeline diagram is generated from an eleven-item step list, so adding a step moves the
          boxes, the connectors, the numbering, the viewBox <em>and</em> the screen-reader
          description together. The build film on the home page makes the same point about process: the front
          end the client approves and the product that ships are one piece of markup, and a single
          variable moves it from sample data to live. And, plainly, Vue 3 is what I do all day. A Vue engineer's
          portfolio should contain Vue you can read.
        </p>
      </div>
    </StudySection>

    <StudySection label="Type" heading="Four variable faces, subset to what is actually used.">
      <div class="prose">
        <ul>
          <li><strong>Anybody</strong> for display, set condensed at a width of about 78. It descends from technical wayfinding lettering, which is why it suits a site about equipment and operations, and its 50–150 width axis is what the headline animates along on load.</li>
          <li><strong>Archivo</strong> for the interface: a neutral grotesque whose job is to get out of the way of the display face.</li>
          <li><strong>Newsreader</strong> for reading, with the optical-size axis tuned per context: tighter for pull quotes, looser for body.</li>
          <li><strong>Martian&nbsp;Mono</strong> for labels, figures and anything carrying a state.</li>
        </ul>
        <p>
          All four are self-hosted and subset to the <em>exact</em> glyph set this site uses: 114
          characters, derived by scraping the rendered text out of the pages and adding the
          case-transformed forms, so the uppercase labels have letters to render. The result is
          <strong>179&nbsp;KB for four variable families</strong>, down from 310&nbsp;KB unsubset, with
          every axis intact. Preloaded, with <code>font-display: swap</code> and a real fallback
          stack behind each one.
        </p>
      </div>
    </StudySection>

    <StudySection label="Color" heading="One ink, one signal, two states of the same object.">
      <div class="prose">
        <p>
          The palette is a chalky sheet, ink, and a single signal orange used <em>only</em> where
          something has a state: a live badge, the first stop on a route, a human step in the
          pipeline diagram, the rule that grows under a link you are hovering. There is no
          second accent. Links are ink with a signal rule under them, because restricting the
          color to state is what keeps a two-color page from looking like a two-color page.
        </p>
        <p>
          Light is the default, because it is the harder of the two to get right and most
          portfolios avoid it. Dark is the same object under panel lighting: blue-black rather
          than neutral, with a one-pixel bezel on every raised surface. It follows your system
          setting until you press the toggle, after which it remembers.
        </p>
        <p>
          Every token is declared on <code>:root</code> before any media query redefines it, so
          nothing has its only definition behind a preference. Every text pair clears WCAG AA,
          body text clears AAA in both themes, and <code>prefers-contrast: more</code> collapses
          the muted grays to full ink.
        </p>
      </div>
    </StudySection>

    <StudySection label="Motion" heading="Native where possible, and it all switches off.">
      <div class="prose">
        <ul>
          <li><strong>Page transitions</strong> use the View Transitions API. Navigating from the board into a case study morphs the project title into the page title. The shared <code>view-transition-name</code> is bound from the project data, so the board and the case study cannot fall out of step.</li>
          <li><strong>Scroll reveals</strong> are a custom <code>v-reveal</code> directive. Where the browser has <code>animation-timeline: view()</code> it only opts the element in and CSS does the work; where it does not, it falls back to an IntersectionObserver, and only for elements that start below the fold, so nothing already on screen is hidden and faded back in.</li>
          <li><strong>The headline settles along the width axis</strong> of the display face as the page loads. Its lines are pre-broken, so the animation never reflows the paragraph, and it is dropped entirely below the mobile breakpoint.</li>
          <li><strong>The build film</strong> on the home page is the one place with a scroll listener, and it is deliberate: a camera, a front end that lifts off its chassis, a back end built part by part into its own outlines, a seven-gear train, two springs and a dashboard going from sample data to live all read the same number, and one shared value is simpler than a dozen coordinated CSS timelines. The listener is passive, coalesced into a single frame, and reads one rect per frame. The frame itself is a pure function of that number, with no clocks and no tweens, which is why it scrubs backwards exactly. On phones and under reduced motion it does not pin at all: the same renderer draws four stills at four fixed points.</li>
          <li><strong>The theme toggle</strong> wipes the new palette in as a circle expanding from the button you pressed.</li>
          <li><strong>The route planner's stops</strong> land through a <code>TransitionGroup</code>, and its tour draws itself using <code>pathLength="1"</code>. The stroke is normalized in SVG, so the animation needs no measuring code at all.</li>
        </ul>
        <p>
          All of it is disabled under <code>prefers-reduced-motion: reduce</code>, including the
          page transitions.
        </p>
      </div>
    </StudySection>

    <StudySection heading="Things I would want to be checked on.">
      <template #label>Keyboard<br>and screen reader</template>
      <ul class="checks">
        <li v-for="check in CHECKS" :key="check.strong">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M2.5 8.5 6 12l7.5-8" />
          </svg>
          <span><b>{{ check.strong }}</b> {{ check.rest }}</span>
        </li>
      </ul>
    </StudySection>

    <StudySection label="Weight" heading="What actually goes over the wire.">
      <div class="ledger">
        <div v-for="row in WEIGHT" :key="row.what" class="ledger__row">
          <p class="ledger__val num">{{ row.value }} <small v-if="row.unit">{{ row.unit }}</small></p>
          <p class="ledger__what">{{ row.what }}</p>
          <p class="ledger__src label">{{ row.source }}</p>
        </div>
      </div>
      <div class="prose weight__note">
        <p>
          Screenshots are WebP, sized to their display width, lazy-loaded below the fold, and
          carry intrinsic dimensions so nothing shifts as they arrive. Routes are code-split, so
          a visitor who only reads one case study never downloads the other two.
        </p>
      </div>
    </StudySection>

    <StudySection label="What I'd change" heading="The fonts are still the whole budget.">
      <div class="prose">
        <p>
          179&nbsp;KB of typefaces against about 65&nbsp;KB of framework, styles and script
          combined is not a balanced page. Dropping the serif and setting the case studies in
          Archivo would cut the type budget by nearly half, and the site would be measurably
          faster and slightly worse to read.
        </p>
        <p>
          I chose reading, because the case studies are the point and people spend minutes in
          them rather than seconds. If this were a product with a conversion rate attached
          rather than a portfolio, I would have made the other call, and I would want to be
          asked why in either direction.
        </p>
      </div>
    </StudySection>
  </article>
</template>

<style scoped>
.checks { margin-top: 1.5rem; border-top: 1px solid var(--rule); list-style: none; padding: 0; }
.checks li {
  display: grid;
  grid-template-columns: 1.1rem 1fr;
  gap: 0.75rem;
  padding-block: 0.75rem;
  border-bottom: 1px solid var(--rule);
  font-size: 0.9375rem;
  color: var(--ink-2);
  align-items: baseline;
}
.checks li b { color: var(--ink); font-weight: 600; }
.checks svg { width: 13px; height: 13px; color: var(--signal); }

.ledger { border-top: 1px solid var(--ink); margin-top: 1.5rem; }
.ledger__row {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.1rem 1.5rem;
  padding-block: 0.95rem;
  border-bottom: 1px solid var(--rule);
  align-items: baseline;
}
@media (min-width: 46rem) {
  .ledger__row { grid-template-columns: 12rem minmax(0, 1fr) auto; }
}
.ledger__val {
  font-family: var(--mono);
  font-size: clamp(1.0625rem, 2.2vw, 1.3125rem);
  font-weight: 600;
  font-stretch: 85%;
  letter-spacing: -0.03em;
  color: var(--ink);
}
.ledger__val small { font-size: 0.6em; font-weight: 500; color: var(--ink-3); }
.ledger__what { color: var(--ink-2); font-size: 0.9375rem; }
.ledger__src { font-size: 0.75rem; }

.weight__note { margin-top: 1.75rem; }
</style>
