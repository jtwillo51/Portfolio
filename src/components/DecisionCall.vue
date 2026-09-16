<script setup lang="ts">
defineProps<{
  index: number
  title: string
  chose: string
  rejected: string
  cost: string
}>()
</script>

<template>
  <section class="call">
    <h3 class="call__q">
      <span class="label">Call {{ String(index).padStart(2, '0') }}</span>{{ title }}
    </h3>
    <div class="call__body">
      <slot />
      <dl class="tri">
        <div class="t-chose"><dt class="label">Chose</dt><dd>{{ chose }}</dd></div>
        <div><dt class="label">Rejected</dt><dd>{{ rejected }}</dd></div>
        <div><dt class="label">The cost</dt><dd>{{ cost }}</dd></div>
      </dl>
    </div>
  </section>
</template>

<style scoped>
.call {
  border: 1px solid var(--rule);
  border-radius: 3px;
  background: var(--sheet);
  overflow: hidden;
  box-shadow: var(--bezel);
}
.call__q {
  padding: 1rem 1.15rem;
  border-bottom: 1px solid var(--rule);
  font-family: var(--display);
  font-size: 1.25rem;
  font-variation-settings: 'wght' 700, 'wdth' 88;
  letter-spacing: 0;
  line-height: 1.18;
}
.call__q .label { display: block; margin-bottom: 0.4rem; font-size: 0.625rem; }
.call__body { padding: 1.05rem 1.15rem 1.15rem; }
.call__body :deep(p) {
  font-family: var(--prose);
  font-variation-settings: 'opsz' 16;
  font-size: 1.0625rem;
  line-height: 1.6;
  color: var(--ink);
  max-width: 60ch;
}
.call__body :deep(p + p) { margin-top: 0.85rem; }

.tri {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1px;
  margin-top: 1.15rem;
  background: var(--rule);
  border-top: 1px solid var(--rule);
}
@media (min-width: 44rem) { .tri { grid-template-columns: repeat(3, 1fr); } }
.tri > div { background: var(--sheet); padding: 0.8rem 0.95rem 0.9rem; }
.tri dt { font-size: 0.625rem; margin-bottom: 0.35rem; }
.tri dd { font-size: 0.875rem; line-height: 1.45; color: var(--ink-2); }
.tri .t-chose dt { color: var(--signal-txt); }
.tri .t-chose dd { color: var(--ink); }
</style>
