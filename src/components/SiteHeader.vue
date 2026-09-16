<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { PERSON } from '@/data/site'
import ThemeToggle from '@/components/ThemeToggle.vue'

interface NavItem {
  label: string
  to: string
  /** Hidden on narrow screens, where it is still reachable from the footer. */
  optional?: boolean
  /** How this item decides it is the current section. */
  match?: (path: string) => boolean
}

const NAV: NavItem[] = [
  { label: 'Work', to: '/#work', match: (p) => p.startsWith('/work') },
  { label: 'Hiring', to: '/#fit' },
  { label: 'About', to: '/#about' },
  { label: 'Résumé', to: '/resume', match: (p) => p === '/resume' },
  { label: 'Colophon', to: '/colophon', optional: true, match: (p) => p === '/colophon' },
]

const route = useRoute()
// The two hash links point at the same record, so router-link-active would
// light both of them up at once. Current section is decided here instead.
const currentLabel = computed(() => NAV.find((item) => item.match?.(route.path))?.label)
</script>

<template>
  <header class="masthead">
    <div class="shell masthead__in">
      <RouterLink class="wordmark" to="/">
        <b>{{ PERSON.name }}</b>
        <span class="label">{{ PERSON.role }}</span>
      </RouterLink>
      <nav class="nav" aria-label="Primary">
        <RouterLink
          v-for="item in NAV"
          :key="item.label"
          :to="item.to"
          active-class=""
          exact-active-class=""
          :class="{ 'nav__opt': item.optional, 'is-current': currentLabel === item.label }"
          :aria-current="currentLabel === item.label ? 'page' : undefined"
        >
          {{ item.label }}
        </RouterLink>
        <ThemeToggle />
      </nav>
    </div>
    <!-- Scroll position. Pure CSS, and it reports something true. -->
    <div class="progress" aria-hidden="true" />
  </header>
</template>

<style scoped>
.masthead {
  position: sticky;
  top: 0;
  z-index: 40;
  background: color-mix(in srgb, var(--paper) 86%, transparent);
  backdrop-filter: saturate(1.6) blur(10px);
  border-bottom: 1px solid var(--rule-soft);
}
/* Wraps onto a second line rather than overflowing on very narrow phones. */
.masthead__in {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.35rem 1rem;
  min-height: 3.5rem;
  padding-block: 0.4rem;
}

.wordmark {
  display: flex;
  align-items: baseline;
  gap: 0.55rem;
  text-decoration: none;
  color: var(--ink);
  margin-right: auto;
}
.wordmark b {
  font-family: var(--display);
  font-variation-settings: 'wght' 700, 'wdth' 86;
  letter-spacing: 0.005em;
  font-size: 1.0625rem;
  white-space: nowrap;
}
.wordmark span { color: var(--ink-3); white-space: nowrap; }
@media (max-width: 46rem) { .wordmark span { display: none; } }

.nav { display: flex; align-items: center; gap: clamp(0.7rem, 2.2vw, 1.5rem); }
.nav a {
  color: var(--ink-2);
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 180ms;
}
.nav a:hover,
.nav a.is-current { color: var(--ink); }
.nav a.is-current { box-shadow: 0 1px 0 var(--signal); }
@media (max-width: 40rem) { .nav .nav__opt { display: none; } }

.progress {
  position: absolute;
  inset: auto 0 -1px 0;
  height: 2px;
  background: var(--signal);
  transform: scaleX(0);
  transform-origin: 0 50%;
  display: none;
}
@supports (animation-timeline: scroll()) {
  @media (prefers-reduced-motion: no-preference) {
    .progress {
      display: block;
      animation: progress linear both;
      animation-timeline: scroll(root block);
    }
    @keyframes progress { to { transform: scaleX(1); } }
  }
}
</style>
