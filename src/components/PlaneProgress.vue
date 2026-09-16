<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useMediaQuery } from '@/composables/useScrollProgress'

/**
 * Airport HQ's loading indicator, ported from React to Vue for the case study.
 *
 * An aircraft taxis along a runway. It eases toward 95% over the expected
 * duration and holds there; it only reaches 100% when the caller says the
 * work is done, so it never claims completion early. Position comes from
 * wall-clock elapsed time on an interval rather than requestAnimationFrame,
 * because rAF is frozen in a hidden tab and would strand the aircraft
 * mid-runway if someone switched away and came back.
 *
 * The aircraft is Material Icons' "flight" glyph (Apache 2.0), rotated to
 * point along the direction of travel.
 */
const props = withDefaults(
  defineProps<{
    done?: boolean
    durationMs?: number
    label?: string
    /** Parked at the threshold: nothing is running yet. */
    idle?: boolean
  }>(),
  { done: false, durationMs: 2600, label: 'Working…', idle: false },
)

const reduced = useMediaQuery('(prefers-reduced-motion: reduce)')
const pct = ref(props.done ? 100 : 0)
let timer = 0

function start(): void {
  window.clearInterval(timer)
  if (props.idle) {
    pct.value = 0
    return
  }
  if (props.done) {
    pct.value = 100
    return
  }
  const startedAt = Date.now()
  pct.value = 0
  timer = window.setInterval(() => {
    const linear = Math.min((Date.now() - startedAt) / props.durationMs, 1)
    // A squared ease front-loads the motion and reads as a jump; 1.4 keeps a
    // steadier taxi while still easing into the hold.
    const eased = 1 - (1 - linear) ** 1.4
    pct.value = Math.min(eased * 95, 95)
    if (linear >= 1) window.clearInterval(timer)
  }, 40)
}

onMounted(start)
watch(() => [props.done, props.idle, props.durationMs], start)
onBeforeUnmount(() => window.clearInterval(timer))
</script>

<template>
  <div
    class="plane"
    role="progressbar"
    :aria-valuenow="Math.round(pct)"
    aria-valuemin="0"
    aria-valuemax="100"
    :aria-label="label"
  >
    <div class="plane__head">
      <span>{{ label }}</span>
      <span class="plane__pct num">{{ Math.round(pct) }}%</span>
    </div>
    <div class="plane__strip">
      <div class="plane__runway" />
      <div class="plane__covered" :class="{ 'is-still': reduced }" :style="{ width: `${pct}%` }" />
      <div class="plane__craft" :class="{ 'is-still': reduced }" :style="{ left: `${pct}%` }">
        <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">
          <path
            transform="rotate(90 12 12)"
            d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"
            fill="currentColor"
          />
        </svg>
      </div>
    </div>
  </div>
</template>

<style scoped>
.plane { width: min(100%, 22rem); padding-block: 0.4rem; }
.plane__head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 0.5rem;
  font-size: 0.8125rem;
  color: var(--ink-2);
}
.plane__pct { font-family: var(--mono); font-size: 0.75rem; color: var(--signal-txt); }

.plane__strip { position: relative; height: 2rem; }
.plane__runway,
.plane__covered {
  position: absolute;
  top: 50%;
  height: 1px;
  transform: translateY(-50%);
}
.plane__runway {
  left: 0;
  right: 0;
  background-image: repeating-linear-gradient(to right, var(--ink-3) 0 10px, transparent 10px 20px);
  opacity: 0.6;
}
.plane__covered { left: 0; background: var(--signal); transition: width 150ms ease-out; }
.plane__craft {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  color: var(--signal);
  filter: drop-shadow(0 0 6px color-mix(in srgb, var(--signal) 45%, transparent));
  transition: left 150ms ease-out;
}
.plane__craft svg { display: block; }
.is-still { transition: none; }
</style>
