<script setup lang="ts">
defineProps<{ eyebrow: string; title: string }>()
</script>

<template>
  <section class="card">
    <p class="label">{{ eyebrow }}</p>
    <h3>{{ title }}</h3>
    <p class="card__body"><slot /></p>
    <span class="proof"><slot name="proof" /></span>
  </section>
</template>

<style scoped>
.card { background: var(--paper); padding: 1.4rem 1.35rem 1.5rem; }
h3 {
  font-family: var(--display);
  font-size: 1.25rem;
  font-variation-settings: 'wght' 700, 'wdth' 86;
  letter-spacing: 0;
  line-height: 1.12;
  margin-block: 0.6rem 0.7rem;
}
.card__body { color: var(--ink-2); font-size: 0.9375rem; line-height: 1.55; }
.proof {
  display: block;
  margin-top: 0.95rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--rule);
  font-family: var(--mono);
  font-size: 0.6875rem;
  font-stretch: 85%;
  line-height: 1.55;
  letter-spacing: 0.02em;
  color: var(--ink-2);
}
.proof :deep(b) { color: var(--signal-txt); font-weight: 600; }
</style>
