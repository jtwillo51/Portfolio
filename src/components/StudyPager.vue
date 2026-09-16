<script setup lang="ts">
export interface PagerLink { readonly eyebrow: string; readonly title: string; readonly to: string }
defineProps<{ prev: PagerLink; next: PagerLink }>()
</script>

<template>
  <nav class="pager" aria-label="More work">
    <RouterLink :to="prev.to"><span class="label">{{ prev.eyebrow }}</span><b>{{ prev.title }}</b></RouterLink>
    <RouterLink :to="next.to"><span class="label">{{ next.eyebrow }}</span><b>{{ next.title }}</b></RouterLink>
  </nav>
</template>

<style scoped>
.pager {
  display: grid;
  gap: 1px;
  grid-template-columns: 1fr;
  margin-top: clamp(3rem, 6vw, 4.5rem);
  background: var(--rule);
  border-top: 1px solid var(--rule);
}
@media (min-width: 44rem) { .pager { grid-template-columns: 1fr 1fr; } }
.pager a {
  background: var(--paper);
  padding: 1.5rem var(--gutter);
  text-decoration: none;
  color: inherit;
  transition: background 220ms;
}
.pager a:hover { background: var(--sheet); }
.pager a:last-child { text-align: right; }
.pager b {
  display: block;
  margin-top: 0.35rem;
  font-family: var(--display);
  font-size: 1.375rem;
  font-variation-settings: 'wght' 700, 'wdth' 86;
  letter-spacing: 0;
}
.pager a:hover b { color: var(--signal); }
</style>
