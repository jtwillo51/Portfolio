<script setup lang="ts">
import type { Project } from '@/data/work'

defineProps<{ project: Project }>()
</script>

<template>
  <RouterLink class="job" :to="project.to">
    <div class="job__when">
      <p class="label num">{{ project.period }}</p>
      <p class="job__pills">
        <span v-for="pill in project.pills" :key="pill.text" class="pill" :class="{ 'pill--live': pill.live }">
          {{ pill.text }}
        </span>
      </p>
    </div>

    <div class="job__body">
      <h3 class="job__name" :style="{ viewTransitionName: project.vt }">{{ project.name }}</h3>
      <p class="job__what">{{ project.summary }}</p>
      <p class="job__quote">{{ project.quote }}</p>
      <p class="job__stack">
        <span v-for="tech in project.stack" :key="tech" class="label">{{ tech }}</span>
      </p>
    </div>

    <span class="job__go">
      Case study
      <svg width="16" height="10" viewBox="0 0 16 10" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M0 5h14M10 1l4 4-4 4" />
      </svg>
    </span>
  </RouterLink>
</template>

<style scoped>
.job {
  position: relative;
  display: grid;
  gap: 0.3rem 2rem;
  grid-template-columns: 1fr;
  padding-block: clamp(1.5rem, 3vw, 2.1rem);
  border-bottom: 1px solid var(--rule);
  text-decoration: none;
  color: inherit;
  isolation: isolate;
}
.job:last-child { border-bottom: 0; }
@media (min-width: 54rem) {
  .job { grid-template-columns: 13rem minmax(0, 1fr) auto; align-items: start; }
}
.job::after {
  content: '';
  position: absolute;
  inset: 0 -1rem;
  z-index: -1;
  background: var(--sheet-2);
  opacity: 0;
  border-radius: 3px;
  transition: opacity 260ms var(--ease-out);
}
.job:hover::after,
.job:focus-visible::after { opacity: 1; }
.job:focus-visible { outline-offset: 6px; }

.job__when { padding-top: 0.35rem; }
.job__pills { display: flex; flex-wrap: wrap; gap: 0.35rem; margin-top: 0.5rem; }
.job__body { min-width: 0; }

.job__name {
  font-family: var(--display);
  font-size: clamp(1.75rem, 3.6vw, 2.5rem);
  font-variation-settings: 'wght' 750, 'wdth' 84;
  letter-spacing: 0;
  line-height: 1.02;
  transition: color 200ms;
}
.job:hover .job__name { color: var(--signal); }

.job__what {
  margin-top: 0.45rem;
  color: var(--ink-2);
  font-size: 0.9375rem;
  max-width: 56ch;
}
.job__stack { display: flex; flex-wrap: wrap; gap: 0.35rem 0.75rem; margin-top: 0.85rem; }
.job__quote {
  margin-top: 1.05rem;
  padding-left: 0.9rem;
  border-left: 2px solid var(--signal);
  font-family: var(--prose);
  font-variation-settings: 'opsz' 22;
  font-size: 1.125rem;
  line-height: 1.5;
  color: var(--ink);
  max-width: 56ch;
}
.job__go {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  align-self: end;
  font-family: var(--mono);
  font-size: 0.625rem;
  font-weight: 500;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: var(--ink-3);
  white-space: nowrap;
  padding-top: 0.5rem;
}
.job:hover .job__go { color: var(--signal-txt); }
.job__go svg { transition: transform 300ms var(--ease-out); }
.job:hover .job__go svg { transform: translateX(4px); }
@media (min-width: 54rem) { .job__go { align-self: start; } }
</style>
