<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'
import { PLOT, useRoutePlanner, type Stop } from '@/composables/useRoutePlanner'

const planner = useRoutePlanner()
const { stops, tour, miles, savedPercent, summary, isFull } = planner

const svg = useTemplateRef<SVGSVGElement>('svg')

const points = (list: readonly Stop[]) => list.map((s) => `${s.x},${s.y}`).join(' ')

/** Changing this remounts the polyline, which replays its draw animation. */
const tourKey = computed(() => tour.value.map((s) => s.id).join('-'))

function plot(event: MouseEvent): void {
  const el = svg.value
  if (!el) return
  const box = el.getBoundingClientRect()
  planner.addStop(
    ((event.clientX - box.left) / box.width) * PLOT.w,
    ((event.clientY - box.top) / box.height) * PLOT.h,
  )
}
</script>

<template>
  <figure class="wrap">
    <div class="planner">
      <div class="planner__top">
        <span class="label">Route planner · Wednesday</span>
        <span class="planner__ctl">
          <button type="button" :disabled="isFull" @click="planner.addRandomStop()">Add stop</button>
          <button type="button" @click="planner.reset()">Reset</button>
        </span>
      </div>

      <div
        class="planner__stage"
        role="img"
        :aria-label="`Route plot: ${stops.length} stops ordered by the planner.`"
        @click="plot"
      >
        <svg ref="svg" :viewBox="`0 0 ${PLOT.w} ${PLOT.h}`" aria-hidden="true">
          <g class="plot-grid">
            <line v-for="y in 3" :key="`h${y}`" x1="0" :y1="y * 75" :x2="PLOT.w" :y2="y * 75" />
            <line v-for="x in 3" :key="`v${x}`" :x1="x * 100" y1="0" :x2="x * 100" :y2="PLOT.h" />
          </g>

          <!-- The order they were booked in, for comparison. -->
          <polyline class="tour tour--ghost" :points="points(stops)" />
          <!-- pathLength normalizes the stroke so the draw needs no measuring. -->
          <polyline :key="tourKey" class="tour tour--plan" :points="points(tour)" path-length="1" />

          <TransitionGroup tag="g" name="stop">
            <g
              v-for="(stop, i) in tour"
              :key="stop.id"
              class="stop"
              :class="{ 'stop--first': i === 0 }"
              :transform="`translate(${stop.x} ${stop.y})`"
              :style="{ '--i': i }"
            >
              <g class="stop__pop">
                <circle r="11" />
                <text y="0.5">{{ i + 1 }}</text>
              </g>
            </g>
          </TransitionGroup>
        </svg>
      </div>

      <dl class="planner__readout" aria-hidden="true">
        <div><dt class="label">Stops</dt><dd class="num">{{ stops.length }}</dd></div>
        <div><dt class="label">Planned</dt><dd class="num">{{ miles.toFixed(1) }} mi</dd></div>
        <div><dt class="label">Shorter</dt><dd class="num saved">{{ savedPercent }}%</dd></div>
      </dl>

      <p class="sr-only" role="status" aria-live="polite">{{ summary }}</p>
    </div>

    <figcaption class="planner__note">
      Nearest-neighbor ordering over straight-line distance, anchored to the first job of the
      day. Tap the plot or press <b>Add stop</b> and it re-plans. It's the heuristic behind
      BuffrHQ's route planner, a feature I'd now cut, since solo detailers run three or four jobs
      a day. The demo stays because the interaction is the point.
      <RouterLink class="lnk" to="/work/buffrhq#differently">Why I'd cut it →</RouterLink>
    </figcaption>
  </figure>
</template>

<style scoped>
.wrap { margin: 0; }

.planner {
  background: var(--sheet);
  border: 1px solid var(--rule);
  border-radius: 4px;
  box-shadow: var(--bezel), var(--shadow);
  overflow: hidden;
}

.planner__top {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem 1rem;
  padding: 0.6rem 0.85rem;
  border-bottom: 1px solid var(--rule-soft);
  background: var(--sheet-2);
}

.planner__ctl { display: flex; gap: 0.4rem; }
.planner__ctl button {
  border: 1px solid var(--rule);
  background: var(--sheet);
  border-radius: 2px;
  padding: 0.25rem 0.55rem;
  font-family: var(--mono);
  font-size: 0.625rem;
  font-weight: 500;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--ink-2);
  cursor: pointer;
  white-space: nowrap;
  transition: color 160ms, border-color 160ms, background 160ms;
}
.planner__ctl button:hover:not(:disabled) { color: var(--signal-txt); border-color: var(--signal); }
.planner__ctl button:disabled { opacity: 0.45; cursor: not-allowed; }

.planner__stage {
  position: relative;
  aspect-ratio: 4 / 3;
  touch-action: manipulation;
  cursor: crosshair;
}
.planner__stage svg { width: 100%; height: 100%; }

.plot-grid line { stroke: var(--rule-soft); stroke-width: 1; }

.tour {
  fill: none;
  stroke: var(--signal);
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.tour--ghost {
  stroke: var(--ink-3);
  stroke-width: 1;
  stroke-dasharray: 3 5;
  opacity: 0.45;
}
.tour--plan { animation: draw 900ms cubic-bezier(0.16, 1, 0.3, 1) both; }
@keyframes draw {
  from { stroke-dasharray: 1; stroke-dashoffset: 1; }
  to   { stroke-dasharray: 1; stroke-dashoffset: 0; }
}

.stop circle {
  fill: var(--sheet);
  stroke: var(--ink);
  stroke-width: 1.5;
  transition: fill 200ms, stroke 200ms;
}
.stop text {
  font-family: var(--mono);
  font-size: 9px;
  font-weight: 600;
  fill: var(--ink);
  text-anchor: middle;
  dominant-baseline: central;
}
.stop--first circle { fill: var(--signal); stroke: var(--signal); }
.stop--first text { fill: #fdf6f1; }
@media (prefers-color-scheme: dark) {
  :root:not([data-theme='light']) .stop--first text { fill: #1a0d05; }
}
:root[data-theme='dark'] .stop--first text { fill: #1a0d05; }

/* The inner group carries the pop, so it scales about the stop's own center
   rather than the SVG origin. */
.stop-enter-active .stop__pop {
  transition: opacity 400ms, transform 400ms cubic-bezier(0.22, 1.4, 0.36, 1);
  transition-delay: calc(var(--i, 0) * 45ms);
}
.stop-enter-from .stop__pop { opacity: 0; transform: scale(0.3); }
.stop-leave-active { display: none; }

.planner__readout {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border-top: 1px solid var(--rule-soft);
}
.planner__readout div {
  padding: 0.6rem 0.85rem;
  border-right: 1px solid var(--rule-soft);
}
.planner__readout div:last-child { border-right: 0; }
.planner__readout dt { font-size: 0.625rem; }
.planner__readout dd {
  font-family: var(--mono);
  font-size: clamp(0.875rem, 1.6vw, 1.0625rem);
  font-weight: 600;
  font-stretch: 88%;
  letter-spacing: -0.02em;
  margin-top: 0.15rem;
}
.planner__readout .saved { color: var(--signal-txt); }

.planner__note {
  margin-top: 0.85rem;
  font-size: 0.8125rem;
  line-height: 1.5;
  color: var(--ink-3);
  max-width: 34rem;
}
.planner__note a { color: var(--ink-2); }

@media (prefers-reduced-motion: reduce) {
  .tour--plan { animation: none; }
  .stop-enter-active .stop__pop { transition: none; }
}
</style>
