<script setup lang="ts">
defineProps<{ label?: string; heading?: string; id?: string }>()
</script>

<template>
  <section class="sect" :id="id">
    <div class="shell sect__grid">
      <p class="label sect__label"><slot name="label">{{ label }}</slot></p>
      <div>
        <h2 v-if="heading">{{ heading }}</h2>
        <slot />
      </div>
    </div>
  </section>
</template>
