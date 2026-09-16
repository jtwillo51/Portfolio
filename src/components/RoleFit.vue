<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useTemplateRef } from 'vue'
import { PERSON } from '@/data/site'
import { ROLES } from '@/data/roles'
import RoleEvidence from '@/components/RoleEvidence.vue'

/**
 * The page, re-sorted for whoever is hiring.
 *
 * A proper tab set: arrow keys move between roles, only the selected tab is in
 * the tab order, and the choice lives in the address bar as `?for=` — so the
 * view a hiring manager lands on is the view they can send to the rest of the
 * panel. Before hydration and with JavaScript off, every role renders in full.
 */

const DEFAULT = ROLES[0]!.id

const enhanced = ref(false)
const active = ref(DEFAULT)
const copied = ref(false)
const tabEls = useTemplateRef<HTMLButtonElement[]>('tabs')

const role = computed(() => ROLES.find((r) => r.id === active.value) ?? ROLES[0]!)

let copiedTimer = 0
onMounted(() => {
  const wanted = new URLSearchParams(window.location.search).get('for')
  if (wanted && ROLES.some((r) => r.id === wanted)) active.value = wanted
  enhanced.value = true
})
onBeforeUnmount(() => window.clearTimeout(copiedTimer))

function linkFor(id: string): string {
  const url = new URL(window.location.href)
  url.searchParams.set('for', id)
  url.hash = 'fit'
  return url.toString()
}

function select(id: string, moveFocus = false): void {
  active.value = id
  copied.value = false
  // replaceState rather than a router navigation: switching roles should not
  // scroll the page or add a history entry per click.
  window.history.replaceState(window.history.state, '', linkFor(id))
  if (moveFocus) {
    void nextTick(() => tabEls.value?.find((el) => el.dataset.id === id)?.focus())
  }
}

function onKey(event: KeyboardEvent, index: number): void {
  const n = ROLES.length
  const next: Record<string, number> = {
    ArrowRight: (index + 1) % n,
    ArrowDown: (index + 1) % n,
    ArrowLeft: (index - 1 + n) % n,
    ArrowUp: (index - 1 + n) % n,
    Home: 0,
    End: n - 1,
  }
  const to = next[event.key]
  if (to === undefined) return
  event.preventDefault()
  select(ROLES[to]!.id, true)
}

async function copyLink(): Promise<void> {
  try {
    await navigator.clipboard.writeText(linkFor(active.value))
    copied.value = true
    window.clearTimeout(copiedTimer)
    copiedTimer = window.setTimeout(() => {
      copied.value = false
    }, 2400)
  } catch {
    // Clipboard refused (permissions, insecure context): the address bar
    // already holds the same link, so there is nothing to recover.
  }
}

const mailto = computed(
  () =>
    `mailto:${PERSON.email}?subject=${encodeURIComponent(`A ${role.value.title.toLowerCase()} role`)}`,
)
</script>

<template>
  <section id="fit" class="band fit" aria-labelledby="fit-h">
    <div class="shell">
      <div class="band__head">
        <h2 id="fit-h">Hiring? Start with the role.</h2>
        <p class="label">Pick one · the evidence, sorted for it</p>
      </div>

      <template v-if="enhanced">
        <div class="fit__tabs" role="tablist" aria-label="Role you're hiring for">
          <button
            v-for="(r, i) in ROLES"
            :id="`fit-tab-${r.id}`"
            :key="r.id"
            ref="tabs"
            :data-id="r.id"
            type="button"
            role="tab"
            class="fit__tab"
            :aria-selected="active === r.id"
            aria-controls="fit-panel"
            :tabindex="active === r.id ? 0 : -1"
            @click="select(r.id)"
            @keydown="onKey($event, i)"
          >
            {{ r.title }}
          </button>
        </div>

        <div
          id="fit-panel"
          class="fit__panel"
          role="tabpanel"
          :aria-labelledby="`fit-tab-${role.id}`"
          tabindex="0"
        >
          <Transition name="fit" mode="out-in">
            <RoleEvidence :key="role.id" :role="role" />
          </Transition>

          <div class="fit__actions">
            <a class="btn" :href="mailto">Email me about this role</a>
            <button type="button" class="btn btn--ghost" @click="copyLink">
              {{ copied ? 'Link copied' : 'Copy a link to this view' }}
            </button>
            <RouterLink class="btn btn--ghost" to="/resume">Full résumé</RouterLink>
            <span class="sr-only" aria-live="polite">{{ copied ? 'Link copied to clipboard' : '' }}</span>
          </div>
        </div>
      </template>

      <!-- Without JavaScript: every role, one after another. -->
      <div v-else class="fit__all">
        <article v-for="r in ROLES" :key="r.id" class="fit__panel">
          <h3 class="fit__title">{{ r.title }}</h3>
          <RoleEvidence :role="r" />
        </article>
      </div>

      <p class="fit__other">
        <strong>Remote, or on-site anywhere around Phoenix.</strong> I just moved back to Arizona
        at the beginning of 2026, so I'm not ready to relocate just yet.
        Hiring for something else?
        <RouterLink class="lnk" to="/resume">The résumé has all of it</RouterLink>, or
        <a class="lnk" :href="`mailto:${PERSON.email}`">ask me directly</a>.
      </p>
    </div>
  </section>
</template>

<style scoped>
.fit { border-top: 1px solid var(--rule); }

.fit__tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 2rem;
}
.fit__tab {
  padding: 0.55rem 0.95rem;
  border: 1px solid var(--rule);
  border-radius: 999px;
  background: transparent;
  font-size: 0.9rem;
  color: var(--ink-2);
  cursor: pointer;
  transition: color 160ms, border-color 160ms, background-color 160ms;
}
.fit__tab:hover { color: var(--ink); border-color: var(--ink-3); }
.fit__tab[aria-selected='true'] {
  color: var(--ink);
  border-color: var(--signal);
  background: var(--signal-bg);
}

.fit__panel {
  margin-top: 1.4rem;
  padding: clamp(1.25rem, 3vw, 2rem);
  border: 1px solid var(--rule);
  border-radius: 10px;
  background: var(--sheet);
  box-shadow: var(--shadow);
}
.fit__panel:focus-visible { outline: 2px solid var(--signal); outline-offset: 3px; }

.fit__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-top: 1.6rem;
}

.fit__all { display: grid; gap: 1.4rem; }
.fit__title {
  margin-bottom: 1rem;
  font-family: var(--display);
  font-variation-settings: 'wght' 720, 'wdth' 86;
  font-size: 1.3rem;
  color: var(--ink);
}

.fit__other { margin-top: 1.2rem; font-size: 0.9rem; color: var(--ink-2); }

@media (prefers-reduced-motion: no-preference) {
  .fit-enter-active,
  .fit-leave-active { transition: opacity 180ms var(--ease-out), transform 220ms var(--ease-out); }
  .fit-enter-from { opacity: 0; transform: translateY(6px); }
  .fit-leave-to { opacity: 0; }
}
</style>
