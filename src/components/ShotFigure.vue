<script setup lang="ts">
import type { Figure } from '@/data/work'
defineProps<{ figure: Figure; first?: boolean }>()
</script>

<template>
  <figure :class="{ 'is-stacked': !first }">
    <div class="shot">
      <img :src="figure.src" width="1600" height="1067" :alt="figure.alt" loading="lazy" decoding="async">
    </div>
    <figcaption>{{ figure.caption }}</figcaption>
  </figure>
</template>

<style scoped>
.is-stacked { margin-top: 2.25rem; }
.shot {
  border: 1px solid var(--rule);
  border-radius: 4px;
  overflow: hidden;
  background: var(--sheet);
  box-shadow: var(--bezel), var(--shadow);
}
.shot img { width: 100%; display: block; }
figcaption {
  margin-top: 0.7rem;
  font-size: 0.8125rem;
  line-height: 1.5;
  color: var(--ink-3);
  max-width: 52ch;
}
</style>
