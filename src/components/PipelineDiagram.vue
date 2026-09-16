<script setup lang="ts">
import { computed } from 'vue'

/**
 * The pipeline, drawn from the step list rather than from hand-placed
 * coordinates — so adding or reordering a step is a one-line change and the
 * connectors, numbering and viewBox all follow.
 */

interface Step {
  readonly label: string
  /** Marks a step a person performs, not the pipeline. */
  readonly human?: boolean
}

const STEPS: readonly Step[] = [
  { label: 'Read the ticket' },
  { label: 'Create a branch' },
  { label: 'Implement the change' },
  { label: 'A developer verifies the behavior', human: true },
  { label: 'Tests, against what was verified' },
  { label: 'One PR per testing branch' },
  { label: 'Merge into the testing environments' },
  { label: 'Send the UAT email' },
  { label: 'UAT approval', human: true },
  { label: 'Guardrails before master' },
  { label: 'A person moves it to master', human: true },
]

/** The step the out-of-scope branch hangs off, zero-indexed. */
const BRANCH_AT = 2

const BOX = { x: 56, w: 240, h: 40 } as const
const PITCH = 60
const TOP = 16
const MID = BOX.x + BOX.w / 2

const boxes = computed(() =>
  STEPS.map((step, i) => ({
    ...step,
    n: String(i + 1).padStart(2, '0'),
    y: TOP + i * PITCH,
  })),
)

/** "04, 09 and 11" — derived, so the caption can never disagree with the drawing. */
const humanSteps = computed(() => {
  const ns = boxes.value.filter((b) => b.human).map((b) => b.n)
  return ns.length > 1 ? `${ns.slice(0, -1).join(', ')} and ${ns[ns.length - 1]}` : (ns[0] ?? '')
})

const connectors = computed(() =>
  boxes.value.slice(0, -1).map((box) => ({
    key: box.label,
    d: `M${MID} ${box.y + BOX.h} V${box.y + PITCH - 4}`,
  })),
)

const branchY = computed(() => TOP + BRANCH_AT * PITCH)
const height = computed(() => TOP + (STEPS.length - 1) * PITCH + BOX.h + TOP)

const description = computed(() => {
  const list = STEPS.map((s, i) => `${i + 1}: ${s.label}${s.human ? ', which is a human step' : ''}`).join('. ')
  return `A vertical flow of ${STEPS.length} steps. ${list}. Anything found outside the ticket's scope becomes a new ticket rather than a commit.`
})
</script>

<template>
  <figure v-reveal class="diagram">
    <svg :viewBox="`0 0 520 ${height}`" role="img" aria-labelledby="dg-title dg-desc">
      <title id="dg-title">The pipeline, from ticket to master</title>
      <desc id="dg-desc">{{ description }}</desc>

      <defs>
        <marker id="dg-arrow" viewBox="0 0 8 8" refX="6.5" refY="4" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0 0.5 L7 4 L0 7.5 z" class="dg-arrow" />
        </marker>
      </defs>

      <g class="dg-line" marker-end="url(#dg-arrow)" aria-hidden="true">
        <path v-for="line in connectors" :key="line.key" :d="line.d" />
      </g>
      <path
        class="dg-line dg-line--branch"
        :d="`M${BOX.x + BOX.w} ${branchY + BOX.h / 2} H336`"
        marker-end="url(#dg-arrow)"
        aria-hidden="true"
      />

      <g aria-hidden="true">
        <g v-for="box in boxes" :key="box.label">
          <text class="dg-s" :class="{ 'dg-s--human': box.human }" x="34" :y="box.y + 24">{{ box.n }}</text>
          <rect class="dg-box" :class="{ 'dg-box--human': box.human }" :x="BOX.x" :y="box.y" :width="BOX.w" :height="BOX.h" rx="3" />
          <text v-if="box.human" class="dg-s dg-s--human" :x="MID" :y="box.y + 16">Human</text>
          <text class="dg-t" :x="MID" :y="box.y + (box.human ? 32 : 25)">{{ box.label }}</text>
        </g>

        <rect class="dg-box dg-box--dashed" x="336" :y="branchY" width="168" :height="BOX.h" rx="3" />
        <text class="dg-s" x="420" :y="branchY + 16">Out of scope</text>
        <text class="dg-t dg-t--small" x="420" :y="branchY + 32">File a new ticket</text>
      </g>
    </svg>
    <figcaption>
      Steps {{ humanSteps }} are people. None of them is a hedge about model quality. Each is
      a step where a decision gets made that no agent is in a position to make.
    </figcaption>
  </figure>
</template>

<style scoped>
.diagram {
  margin-top: 2rem;
  padding: 1.5rem 1.15rem;
  border: 1px solid var(--rule);
  border-radius: 4px;
  background: var(--sheet);
  box-shadow: var(--bezel);
}
svg { max-width: 34rem; width: 100%; }

.dg-box { fill: var(--paper); stroke: var(--rule); stroke-width: 1; }
.dg-box--human { fill: var(--signal-bg); stroke: var(--signal); }
.dg-box--dashed { fill: none; stroke: var(--rule); stroke-dasharray: 3 3; }

.dg-t { font-family: var(--ui); font-size: 12.5px; font-weight: 500; fill: var(--ink); text-anchor: middle; }
.dg-t--small { font-size: 11px; }
.dg-s {
  font-family: var(--mono);
  font-size: 8.5px;
  font-weight: 500;
  letter-spacing: 0.08em;
  fill: var(--ink-3);
  text-anchor: middle;
}
.dg-s--human { fill: var(--signal-txt); }
.dg-line { fill: none; stroke: var(--ink-3); stroke-width: 1.25; }
.dg-line--branch { stroke: var(--rule); stroke-dasharray: 3 3; }
.dg-arrow { fill: var(--ink-3); }

figcaption {
  margin-top: 0.9rem;
  font-size: 0.8125rem;
  line-height: 1.5;
  color: var(--ink-3);
  max-width: 52ch;
}
</style>
