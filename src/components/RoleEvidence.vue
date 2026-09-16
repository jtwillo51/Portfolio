<script setup lang="ts">
import type { Role } from '@/data/roles'

/** One role's case, laid out for someone reading between interviews. */
defineProps<{ role: Role }>()
</script>

<template>
  <div class="ev">
    <p class="ev__fit">{{ role.fit }}</p>

    <div class="ev__grid">
      <div>
        <p class="label ev__head">The evidence</p>
        <ul class="ev__proof">
          <li v-for="p in role.proof" :key="p.text">
            <span>{{ p.text }}</span>
            <RouterLink class="lnk ev__src" :to="p.to">{{ p.label }} →</RouterLink>
          </li>
        </ul>
      </div>

      <div class="ev__side">
        <dl class="ev__nums">
          <div v-for="n in role.numbers" :key="n.what">
            <dt class="num">{{ n.value }}</dt>
            <dd>{{ n.what }}</dd>
          </div>
        </dl>
        <p class="label ev__head">Stack for this role</p>
        <ul class="ev__stack">
          <li v-for="s in role.stack" :key="s">{{ s }}</li>
        </ul>
      </div>
    </div>

    <div class="ev__foot">
      <p><span class="label">Ask me about</span>{{ role.askMe }}</p>
      <p><span class="label">Straight answer</span>{{ role.straight }}</p>
    </div>
  </div>
</template>

<style scoped>
.ev { display: grid; gap: 1.6rem; }

.ev__fit {
  max-width: 44rem;
  font-family: var(--prose);
  font-size: clamp(1.15rem, 2vw, 1.4rem);
  line-height: 1.45;
  color: var(--ink);
  text-wrap: pretty;
}

.ev__grid {
  display: grid;
  gap: 1.6rem 3rem;
  grid-template-columns: minmax(0, 1fr);
}
@media (min-width: 60rem) {
  .ev__grid { grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr); }
}
.ev__head { margin-bottom: 0.7rem; }

.ev__proof { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.9rem; }
.ev__proof li {
  display: grid;
  gap: 0.3rem;
  padding-left: 1rem;
  border-left: 2px solid var(--rule);
  color: var(--ink-2);
  line-height: 1.5;
  text-wrap: pretty;
}
/* Padding keeps each proof link a 24px-plus tap target clear of its neighbors. */
.ev__src { justify-self: start; padding-block: 0.3rem; font-size: 0.8125rem; color: var(--signal-txt); }

.ev__side { display: grid; gap: 0.9rem; align-content: start; }
.ev__nums { display: grid; gap: 0.75rem; margin: 0 0 0.6rem; }
.ev__nums div {
  display: grid;
  grid-template-columns: 5.5rem minmax(0, 1fr);
  gap: 0.8rem;
  align-items: baseline;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--rule-soft);
}
.ev__nums dt {
  font-family: var(--display);
  font-variation-settings: 'wght' 720, 'wdth' 84;
  font-size: 1.45rem;
  line-height: 1;
  color: var(--ink);
  font-variant-numeric: tabular-nums;
}
.ev__nums dd { margin: 0; font-size: 0.875rem; color: var(--ink-2); }

.ev__stack { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; gap: 0.35rem; }
.ev__stack li {
  padding: 0.25rem 0.55rem;
  border: 1px solid var(--rule);
  border-radius: 3px;
  font-family: var(--mono);
  font-size: 0.6875rem;
  letter-spacing: 0.04em;
  color: var(--ink-2);
}

.ev__foot {
  display: grid;
  gap: 0.8rem 3rem;
  grid-template-columns: minmax(0, 1fr);
  padding-top: 1.2rem;
  border-top: 1px solid var(--rule);
}
@media (min-width: 60rem) {
  .ev__foot { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
.ev__foot p { display: grid; gap: 0.35rem; color: var(--ink-2); line-height: 1.5; text-wrap: pretty; }
</style>
