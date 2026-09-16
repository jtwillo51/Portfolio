<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { useTheme } from '@/composables/useTheme'

const { toggle } = useTheme()
const button = useTemplateRef<HTMLButtonElement>('button')
</script>

<template>
  <button ref="button" class="theme-btn" type="button" aria-label="Switch color theme" @click="toggle(button ?? undefined)">
    <svg class="i-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2v2.4M12 19.6V22M4.2 4.2l1.7 1.7M18.1 18.1l1.7 1.7M2 12h2.4M19.6 12H22M4.2 19.8l1.7-1.7M18.1 5.9l1.7-1.7" />
    </svg>
    <svg class="i-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M20 14.2A8.2 8.2 0 0 1 9.8 4a8.4 8.4 0 1 0 10.2 10.2Z" />
    </svg>
  </button>
</template>

<style scoped>
.theme-btn {
  display: grid;
  place-items: center;
  width: 2rem;
  height: 2rem;
  border: 1px solid var(--rule);
  border-radius: 50%;
  background: transparent;
  color: var(--ink-2);
  cursor: pointer;
  transition: color 180ms, border-color 180ms, transform 300ms var(--ease-spring);
}
.theme-btn:hover { color: var(--signal); border-color: var(--signal); transform: rotate(-25deg); }
.theme-btn svg { width: 15px; height: 15px; }

/* The button shows the theme it will switch to. */
.i-sun { display: none; }
.i-moon { display: block; }
@media (prefers-color-scheme: dark) {
  :root:not([data-theme='light']) .i-sun { display: block; }
  :root:not([data-theme='light']) .i-moon { display: none; }
}
:root[data-theme='dark'] .i-sun { display: block; }
:root[data-theme='dark'] .i-moon { display: none; }
</style>
