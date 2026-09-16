<script setup lang="ts">
import { PERSON, LINKS } from '@/data/site'
import { PROJECTS, LEDGER } from '@/data/work'
import RoutePlanner from '@/components/RoutePlanner.vue'
import BuildFilm from '@/components/BuildFilm.vue'
import AskMe from '@/components/AskMe.vue'
import RoleFit from '@/components/RoleFit.vue'
import JobRow from '@/components/JobRow.vue'
import DepthCard from '@/components/DepthCard.vue'
import { useLocalTime } from '@/composables/useLocalTime'

const HEADLINE = ['I build software', 'for people who are'] as const

/** The prerender says where I am; the browser adds what time it is there. */
const { time, status } = useLocalTime()
</script>

<template>
  <!-- ================= Hero ================= -->
  <section class="hero">
    <div class="shell hero__top">
      <p class="label rise" :style="{ '--i': 0 }">{{ PERSON.location }} · {{ time ? `${time}, ${status}` : PERSON.availability.toLowerCase() }}</p>
      <h1>
        <span v-for="(line, i) in HEADLINE" :key="line" class="ln" :style="{ '--i': i }">{{ line + ' ' }}</span>
        <span class="ln" :style="{ '--i': HEADLINE.length }"><em>standing up.</em></span>
      </h1>
    </div>

    <div class="shell hero__grid">
      <div>
        <p class="hero__lede rise" :style="{ '--i': 3 }">
          Detailers in a driveway. Line crew on a ramp. A shift manager at eleven at night.
          The interfaces I care about get used by someone with one free hand and about
          fifteen seconds.
        </p>
        <p class="hero__lede rise" :style="{ '--i': 4 }">
          I'm a senior engineer and the subject matter expert for front-end architecture and
          data visualization on a platform <strong>close to a million people</strong> use. I designed, built and
          shipped a commercial iOS product <strong>alone</strong> (first commit to App Store in under
          three months), and I write the Claude Code rules and context files <strong>six engineers</strong>
          work from across three repositories.
        </p>
        <div class="hero__actions rise" :style="{ '--i': 5 }">
          <a class="btn" :href="LINKS.appStore" rel="noopener">
            BuffrHQ on the App&nbsp;Store
            <svg class="arw" width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M4.5 11.5 11.5 4.5M5.5 4.5h6v6" />
            </svg>
          </a>
          <a class="btn btn--ghost" href="#work">Read the three case studies</a>
          <a class="btn btn--ghost" href="#about">Ask me something</a>
        </div>
      </div>

      <div class="rise" :style="{ '--i': 6 }">
        <RoutePlanner />
      </div>
    </div>
  </section>

  <!-- ================= Hiring? The evidence, sorted for your role ================= -->
  <RoleFit />

  <!-- ================= How the work gets made ================= -->
  <BuildFilm />

  <!-- ================= Work ================= -->
  <section id="work" class="band" aria-labelledby="work-h">
    <div class="shell">
      <div class="band__head">
        <h2 id="work-h">Selected work</h2>
        <p class="label">Three projects · problem, decisions, cost</p>
      </div>
      <div class="board">
        <JobRow v-for="project in PROJECTS" :key="project.id" v-reveal :project="project" />
      </div>
    </div>
  </section>

  <!-- ================= Depth ================= -->
  <section class="band band--sheet" aria-labelledby="depth-h">
    <div class="shell">
      <div class="band__head">
        <h2 id="depth-h">Where I go deep</h2>
        <p class="label">Two SME titles, one practice I maintain</p>
      </div>

      <div v-reveal class="depth">
        <DepthCard eyebrow="Subject matter expert" title="Interfaces under time pressure">
          Operational screens where somebody is deciding something with a queue behind them.
          How many taps a state change can take, how big a target has to be, what earns a
          place on a home screen at all. I've been on the other side of that screen at eleven
          at night, which is where the interest comes from.
          <template #proof>
            Front-end architecture, interaction standards and the shared design system for
            surfaces <b>close to a million people</b> use · QsrSoft
          </template>
        </DepthCard>

        <DepthCard eyebrow="Subject matter expert" title="Data visualization">
          I own the charting layer on data-heavy operational dashboards: the screens
          customers actually run their business from, where the visualization is the product
          rather than decoration on it. Density, legibility and hierarchy for someone who
          reads a number and then has to act on it.
          <template #proof>
            <b>Highcharts</b> in production at QsrSoft · <b>Mapbox</b> across two surfaces of
            BuffrHQ · design-system-backed components
          </template>
        </DepthCard>

        <DepthCard eyebrow="Practice I maintain" title="Agentic development practice">
          Not just using the tools, but making them work for a whole team. I write the rules,
          context files and hooks that make our repositories legible to an agent, so the
          standards I used to re-teach by hand get checked without anyone doing it. And I hold
          one line on AI-written code: it should be surrounded by tests that check for explicit
          behavior.
          <template #proof>
            <b>6 engineers · 3 repositories</b> · alongside a teammate's pipeline, two-to-three-day
            tickets now close <b>same day</b>
          </template>
        </DepthCard>
      </div>
    </div>
  </section>

  <!-- ================= Ledger ================= -->
  <section class="band" aria-labelledby="num-h">
    <div class="shell">
      <div class="band__head">
        <h2 id="num-h">The numbers, and where they come from</h2>
        <p class="label">Every figure is attributable</p>
      </div>
      <div class="ledger">
        <div v-for="entry in LEDGER" :key="entry.what" v-reveal class="ledger__row">
          <p class="ledger__val num">{{ entry.value }} <small v-if="entry.unit">{{ entry.unit }}</small></p>
          <p class="ledger__what">{{ entry.what }}</p>
          <p class="ledger__src label">{{ entry.source }}</p>
        </div>
      </div>
    </div>
  </section>

  <!-- ================= About, as a conversation ================= -->
  <section id="about" class="band band--sheet" aria-labelledby="about-h">
    <div class="shell">
      <div class="band__head">
        <h2 id="about-h">Ask me something</h2>
        <p class="label">The short version · <RouterLink class="lnk" to="/resume">full résumé →</RouterLink></p>
      </div>
      <div class="about">
        <div class="prose about__intro">
          <p>
            Pick a question. The answers are what I'd tell you across a table, and the long
            version is a link away whenever one catches.
          </p>
          <p>
            It's scripted (they're buttons, not a text box), but every word of it is mine.
          </p>
        </div>
        <AskMe />
      </div>
    </div>
  </section>
</template>

<style scoped>
.depth {
  display: grid;
  gap: 1px;
  grid-template-columns: 1fr;
  margin-top: 2rem;
  background: var(--rule);
  border: 1px solid var(--rule);
  border-radius: 4px;
  overflow: hidden;
  box-shadow: var(--bezel);
}
@media (min-width: 56rem) { .depth { grid-template-columns: repeat(3, 1fr); } }

.board { border-bottom: 1px solid var(--rule); }

.ledger { border-top: 1px solid var(--ink); }
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

/* ---- About, as a conversation */
.about { display: grid; gap: 1.5rem 3rem; padding-top: 2rem; grid-template-columns: minmax(0, 1fr); }
.about > * { min-width: 0; }
.about__intro p { font-size: 1.0625rem; }
.about__intro p + p { margin-top: 0.8rem; color: var(--ink-2); font-size: 0.9375rem; }
@media (min-width: 64rem) {
  .about { grid-template-columns: minmax(0, 17rem) minmax(0, 44rem); align-items: start; }
}
</style>
