<script setup lang="ts">
defineProps<{ title: string; where: string; period: string }>()
</script>

<template>
  <section class="role">
    <div class="role__top">
      <h2 class="role__title">{{ title }}</h2>
      <p class="label num">{{ period }}</p>
    </div>
    <p class="role__where"><slot name="where">{{ where }}</slot></p>
    <ul><slot /></ul>
  </section>
</template>

<style scoped>
.role { padding-block: 1.2rem; border-bottom: 1px solid var(--rule); }
.role:first-of-type { padding-top: 0; }
.role:last-of-type { border-bottom: 0; padding-bottom: 0; }
.role__top {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.25rem 1rem;
}
.role__title {
  font-family: var(--display);
  font-size: 1.3125rem;
  font-variation-settings: 'wght' 700, 'wdth' 88;
  letter-spacing: 0;
  line-height: 1.15;
}
.role__where { color: var(--ink-2); font-size: 0.9375rem; margin-top: 0.2rem; }
ul { margin-top: 0.8rem; display: grid; gap: 0.5rem; list-style: none; padding-left: 0; }
:deep(li) {
  position: relative;
  padding-left: 1rem;
  font-size: 0.9375rem;
  line-height: 1.55;
  color: var(--ink-2);
}
:deep(li)::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.66em;
  width: 6px;
  height: 1px;
  background: var(--signal);
}
:deep(li b), :deep(li strong) { color: var(--ink); font-weight: 600; }

@media print {
  :deep(li)::before { content: '–'; background: none; width: auto; height: auto; top: 0; color: #777; }
  :deep(li) { padding-left: 1.1rem; font-size: 0.86rem; line-height: 1.45; }
  .role { break-inside: avoid; padding-block: 0.8rem; border-color: #ddd; }
  .role__where { color: #222; }
}
</style>
