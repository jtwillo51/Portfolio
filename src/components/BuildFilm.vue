<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'
import { useMediaQuery, useScrollProgress } from '@/composables/useScrollProgress'
import { ACTS, STILL_ASPECT, actIndex } from '@/lib/film'
import FilmStage from '@/components/FilmStage.vue'

/**
 * Front end to shipped, as one continuous shot.
 *
 * On a wide screen with motion allowed, the stage pins and scroll scrubs the
 * film forwards and backwards. Everywhere else — phones, reduced motion, no
 * JavaScript, the prerendered HTML — it is four stills in a row, each framed
 * for what it shows. The stills are the same renderer at four fixed points,
 * so if they do not tell the story on their own, the animation is not what
 * is broken.
 */

const track = useTemplateRef<HTMLElement>('track')
const progress = useScrollProgress(track)
const enhanced = useMediaQuery('(min-width: 48rem) and (prefers-reduced-motion: no-preference)')

const current = computed(() => actIndex(progress.value))

/**
 * The act buttons move the page, not the film: scroll stays the one source of
 * truth, so a keyboard user and a scrolling user are driving the same thing.
 */
function goTo(i: number): void {
  const el = track.value
  const act = ACTS[i]
  if (!el || !act) return
  const top = window.scrollY + el.getBoundingClientRect().top
  window.scrollTo({ top: top + act.frame * (el.offsetHeight - window.innerHeight), behavior: 'smooth' })
}
</script>

<template>
  <section id="front-end-first" class="film" aria-labelledby="film-h">
    <div class="shell film__head">
      <p class="label">How the work gets made</p>
      <h2 id="film-h">Front end first.</h2>
      <p class="film__lede">
        The first thing a client gets is the finished product: every screen, every button
        where it will live, running on nothing. A few buttons work; the rest say what they
        will do. It is quick to change and easy to say yes to. <em>Then</em> I build what it
        was pretending to do. <RouterLink class="lnk" to="/work/airport-hq">Airport HQ</RouterLink> was
        built exactly this way.
      </p>
    </div>

    <!-- Pinned: the film, scrubbed by scroll. -->
    <div v-if="enhanced" ref="track" class="film__track">
      <div class="film__pin">
        <div class="film__frame">
          <FilmStage :p="progress" />
        </div>

        <div class="shell film__hud">
          <div class="film__caption">
            <span class="film__n num">{{ ACTS[current]!.n }}</span>
            <span>
              <strong>{{ ACTS[current]!.title }}</strong>
              <span class="film__line">{{ ACTS[current]!.line }}</span>
            </span>
          </div>

          <nav class="film__acts" aria-label="Jump to an act">
            <button
              v-for="(act, i) in ACTS"
              :key="act.n"
              type="button"
              class="film__act"
              :aria-current="current === i ? 'step' : undefined"
              @click="goTo(i)"
            >
              <span class="num">{{ act.n }}</span> {{ act.title }}
            </button>
          </nav>

          <div class="film__meter" aria-hidden="true">
            <i :style="{ transform: `scaleX(${progress})` }" />
            <b v-for="act in ACTS.slice(1)" :key="act.n" :style="{ left: `${act.at * 100}%` }" />
          </div>
        </div>
      </div>
    </div>

    <!-- Everywhere else: the same film, as four stills. -->
    <ol v-else class="shell film__strip">
      <li v-for="act in ACTS" :key="act.n" class="film__still">
        <figure>
          <div class="film__plate">
            <FilmStage
              :p="act.frame"
              :camera="act.camera"
              :aspect="STILL_ASPECT"
              :describe="act.n === '04'"
              :client-notes="false"
            />
          </div>
          <figcaption>
            <span class="film__n num">{{ act.n }}</span>
            <span>
              <strong>{{ act.title }}</strong>
              <span class="film__line">{{ act.line }}</span>
            </span>
          </figcaption>
        </figure>
      </li>
    </ol>
  </section>
</template>

<style scoped>
.film {
  background: var(--sheet);
  border-block: 1px solid var(--rule);
  padding-top: clamp(3rem, 7vw, 5rem);
}

.film__head h2 {
  font-family: var(--display);
  font-size: clamp(2rem, 4.4vw, 3.4rem);
  font-variation-settings: 'wght' 760, 'wdth' 82;
  line-height: 0.96;
  margin-block: 0.7rem 1rem;
}
.film__lede {
  max-width: var(--measure);
  font-family: var(--prose);
  font-size: clamp(1.05rem, 1.5vw, 1.2rem);
  line-height: 1.55;
  color: var(--ink-2);
}
.film__lede em { color: var(--ink); }

/* ---- captions, shared by both modes */
.film__caption,
figcaption {
  display: flex;
  align-items: baseline;
  gap: 0.8rem;
}
.film__n {
  font-family: var(--mono);
  font-size: 0.75rem;
  color: var(--signal-txt);
}
.film__caption strong,
figcaption strong {
  display: block;
  font-family: var(--display);
  font-variation-settings: 'wght' 700, 'wdth' 88;
  font-size: 1.05rem;
  color: var(--ink);
}
.film__line { display: block; font-size: 0.875rem; color: var(--ink-2); text-wrap: pretty; }

/* ---- the strip */
.film__strip {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
  gap: clamp(1rem, 2.4vw, 1.75rem);
  padding-block: 2rem clamp(3rem, 7vw, 5rem);
  margin-block: 0;
}
.film__still { min-width: 0; }
.film__still figure { margin: 0; display: grid; gap: 0.8rem; }
.film__plate {
  aspect-ratio: 4 / 5;
  background: var(--paper);
  border: 1px solid var(--rule);
  border-radius: 6px;
  overflow: hidden;
}

/* ---- the pinned film */
.film__track {
  position: relative;
  height: 460svh;
  margin-top: 1rem;
}
.film__pin {
  position: sticky;
  top: 0;
  height: 100svh;
  display: grid;
  grid-template-rows: minmax(0, 1fr) auto;
  padding-block: 4.25rem 1.25rem;
  overflow: hidden;
}
.film__frame { min-height: 0; }

.film__hud {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: end;
  gap: 0.9rem 2rem;
  width: 100%;
}
.film__caption { min-height: 2.9rem; }

.film__acts { display: flex; flex-wrap: wrap; gap: 0.35rem; }
.film__act {
  padding: 0.4rem 0.7rem;
  border: 1px solid var(--rule);
  border-radius: 3px;
  background: transparent;
  font-size: 0.8125rem;
  color: var(--ink-2);
  cursor: pointer;
  transition: color 160ms, border-color 160ms, background-color 160ms;
}
.film__act .num { font-family: var(--mono); font-size: 0.6875rem; color: var(--ink-3); }
.film__act:hover { color: var(--ink); border-color: var(--ink-3); }
.film__act[aria-current='step'] {
  color: var(--ink);
  border-color: var(--signal);
  background: var(--signal-bg);
}
.film__act[aria-current='step'] .num { color: var(--signal-txt); }

.film__meter {
  grid-column: 1 / -1;
  position: relative;
  height: 2px;
  background: var(--rule);
}
.film__meter i {
  position: absolute;
  inset: 0;
  background: var(--signal);
  transform-origin: 0 50%;
}
.film__meter b {
  position: absolute;
  top: -3px;
  width: 1px;
  height: 8px;
  background: var(--ink-3);
}
</style>
