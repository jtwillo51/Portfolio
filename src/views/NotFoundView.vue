<script setup lang="ts">
</script>

<template>
  <section class="hero">
    <div class="shell">
      <p class="label">Error 404</p>
      <h1>This page isn't here.</h1>
      <p class="hero__lede">
        A dead link on a portfolio is one of the things I say elsewhere on this site that you
        should hold against a candidate, so: sorry. The work is all one click away.
      </p>
      <p class="hero__actions">
        <RouterLink class="btn" to="/#work">Selected work</RouterLink>
        <RouterLink class="btn btn--ghost" to="/">Home</RouterLink>
      </p>
    </div>
  </section>
</template>

<style scoped>
h1 {
  font-family: var(--display);
  font-size: clamp(2.4rem, 6vw, 4rem);
  font-variation-settings: 'wght' 760, 'wdth' 84;
  line-height: 0.98;
  letter-spacing: 0;
  margin: 0.8rem 0 1rem;
}
</style>
