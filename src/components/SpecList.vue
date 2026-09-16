<script setup lang="ts">
export interface Spec { readonly term: string; readonly detail: string }
defineProps<{ items: readonly Spec[] }>()
</script>

<template>
  <dl class="spec">
    <div v-for="item in items" :key="item.term">
      <dt class="label">{{ item.term }}</dt>
      <dd>{{ item.detail }}</dd>
    </div>
  </dl>
</template>

<style scoped>
.spec {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(9rem, 1fr));
  gap: 1px;
  margin-top: clamp(2rem, 4vw, 3rem);
  background: var(--rule);
  border: 1px solid var(--rule);
  border-radius: 3px;
  overflow: hidden;
  box-shadow: var(--bezel);
}
.spec > div { background: var(--paper); padding: 0.8rem 0.95rem; }
.spec dt { font-size: 0.625rem; margin-bottom: 0.3rem; }
.spec dd { font-size: 0.875rem; color: var(--ink); line-height: 1.4; }
</style>
