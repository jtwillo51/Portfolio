<script setup lang="ts">
defineProps<{ label: string; wide?: boolean }>()
</script>

<template>
  <div class="note" :class="{ 'note--wide': wide }">
    <p class="label">{{ label }}</p>
    <slot />
  </div>
</template>

<style scoped>
.note {
  margin-top: 1.75rem;
  padding: 0.95rem 1.1rem;
  border: 1px solid var(--rule);
  border-left: 2px solid var(--signal);
  border-radius: 0 3px 3px 0;
  background: var(--sheet);
}
.note--wide { max-width: 52rem; }
.note .label { display: block; margin-bottom: 0.4rem; }
.note :deep(p) { font-size: 0.9375rem; line-height: 1.55; color: var(--ink-2); max-width: 62ch; }
.note :deep(p + p) { margin-top: 0.6rem; }
</style>
