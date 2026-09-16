<script setup lang="ts">
import { CONTACT_LINKS } from '@/data/site'

defineProps<{ headline?: string }>()
</script>

<template>
  <footer class="foot">
    <div class="shell foot__grid">
      <div>
        <h2>{{ headline ?? 'Open to forward deployed and senior front-end roles, remote or Phoenix.' }}</h2>
        <p class="foot__links">
          <template v-for="link in CONTACT_LINKS" :key="link.href">
            <a v-if="link.external || link.href.startsWith('mailto:')" class="lnk" :href="link.href" rel="noopener">{{ link.label }}</a>
            <RouterLink v-else class="lnk" :to="link.href">{{ link.label }}</RouterLink>
          </template>
        </p>
      </div>
      <p class="foot__meta">
        <slot name="meta">
          Vue 3 and TypeScript, prerendered to static HTML.<br>
          Four self-hosted variable typefaces, subset to 179&nbsp;KB.<br>
          <RouterLink class="lnk" to="/colophon">How this site is put together →</RouterLink>
        </slot>
      </p>
    </div>
  </footer>
</template>

<style scoped>
.foot {
  border-top: 1px solid var(--ink);
  padding-block: 2.5rem 3rem;
  margin-top: clamp(3rem, 7vw, 5rem);
}
.foot__grid { display: grid; gap: 2rem; grid-template-columns: 1fr; }
@media (min-width: 46rem) {
  .foot__grid { grid-template-columns: minmax(0, 1fr) auto; align-items: start; }
}
.foot h2 {
  font-family: var(--display);
  font-size: clamp(1.6rem, 3.4vw, 2.3rem);
  font-variation-settings: 'wght' 740, 'wdth' 84;
  letter-spacing: 0;
  line-height: 1.05;
  max-width: 20ch;
}
.foot__links { display: flex; flex-wrap: wrap; gap: 0.4rem 1.4rem; margin-top: 1.1rem; }
.foot__links a { font-size: 0.9375rem; }
.foot__meta { font-size: 0.75rem; color: var(--ink-3); line-height: 1.6; }
.foot__meta :deep(a) { color: var(--ink-2); }
</style>
