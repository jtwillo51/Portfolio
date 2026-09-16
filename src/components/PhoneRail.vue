<script setup lang="ts">
import type { Shot } from '@/data/work'
defineProps<{ shots: readonly Shot[]; caption: string }>()
</script>

<template>
  <div class="shell shell--wide">
    <div class="rail" tabindex="0" role="group" aria-label="Screens, scrollable">
      <figure v-for="shot in shots" :key="shot.src">
        <div class="phone">
          <img :src="shot.src" width="640" height="1385" :alt="shot.alt" loading="lazy" decoding="async">
        </div>
        <figcaption><b>{{ shot.title }}</b>{{ shot.caption }}</figcaption>
      </figure>
    </div>
    <p class="label rail__note">{{ caption }}</p>
  </div>
</template>

<style scoped>
.rail {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  padding-block: 0.5rem 1.25rem;
  margin-top: 1.75rem;
  scrollbar-width: thin;
  scrollbar-color: var(--rule) transparent;
}
.rail::-webkit-scrollbar { height: 8px; }
.rail::-webkit-scrollbar-thumb { background: var(--rule); border-radius: 4px; }
.rail figure { flex: 0 0 auto; width: min(15rem, 62vw); scroll-snap-align: start; }
.phone {
  border: 1px solid var(--rule);
  border-radius: 18px;
  padding: 5px;
  background: var(--sheet-2);
  box-shadow: var(--bezel), var(--shadow);
}
.phone img { border-radius: 13px; width: 100%; }
figcaption {
  margin-top: 0.65rem;
  font-size: 0.75rem;
  line-height: 1.5;
  color: var(--ink-3);
}
figcaption b {
  display: block;
  color: var(--ink);
  font-family: var(--display);
  font-variation-settings: 'wght' 700, 'wdth' 90;
  font-size: 0.9375rem;
  margin-bottom: 0.15rem;
}
.rail__note { margin-top: -0.25rem; }
</style>
