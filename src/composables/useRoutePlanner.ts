import { computed, ref, type Ref } from 'vue'

/**
 * Nearest-neighbor ordering over straight-line distance, anchored to the first
 * stop of the day. It is the same heuristic BuffrHQ uses to plan a detailer's
 * route, and it is deliberately not an optimal tour — see the case study.
 *
 * Reactive by construction: push a stop and the tour, the distance and the
 * saving all recompute. The component only has to draw the result.
 */

export interface Stop {
  readonly id: number
  readonly x: number
  readonly y: number
}

export const PLOT = { w: 400, h: 300 } as const
const MILES_PER_UNIT = 0.06
const MAX_STOPS = 11
const MIN_SEPARATION = 26
const EDGE = 22

/** A believable spread: a home base plus jobs across a service area. */
const SEED: ReadonlyArray<readonly [number, number]> = [
  [58, 232],
  [318, 74],
  [104, 88],
  [268, 236],
  [196, 148],
  [342, 178],
]

const distance = (a: Stop, b: Stop) => Math.hypot(a.x - b.x, a.y - b.y)

const pathLength = (order: readonly Stop[]) =>
  order.reduce((sum, stop, i) => (i === 0 ? 0 : sum + distance(order[i - 1]!, stop)), 0)

export function nearestNeighbor(stops: readonly Stop[]): Stop[] {
  if (stops.length === 0) return []
  const remaining = stops.slice(1)
  const order: Stop[] = [stops[0]!]
  while (remaining.length > 0) {
    const last = order[order.length - 1]!
    let best = 0
    let bestDistance = Infinity
    remaining.forEach((candidate, i) => {
      const d = distance(last, candidate)
      if (d < bestDistance) {
        bestDistance = d
        best = i
      }
    })
    order.push(remaining.splice(best, 1)[0]!)
  }
  return order
}

export interface RoutePlanner {
  stops: Ref<Stop[]>
  /** Stops in the order the planner would drive them. */
  tour: Readonly<Ref<Stop[]>>
  /** Planned distance, in miles. */
  miles: Readonly<Ref<number>>
  /** How much shorter the plan is than driving them as booked, as a percentage. */
  savedPercent: Readonly<Ref<number>>
  /** What a screen reader is told after each change. */
  summary: Readonly<Ref<string>>
  isFull: Readonly<Ref<boolean>>
  addStop: (x: number, y: number) => boolean
  addRandomStop: () => boolean
  reset: () => void
}

export function useRoutePlanner(): RoutePlanner {
  let nextId = 0
  const seed = (): Stop[] => SEED.map(([x, y]) => ({ id: nextId++, x, y }))

  const stops = ref<Stop[]>(seed())

  const tour = computed(() => nearestNeighbor(stops.value))
  const miles = computed(() => pathLength(tour.value) * MILES_PER_UNIT)
  const savedPercent = computed(() => {
    const asBooked = pathLength(stops.value)
    if (asBooked <= 0) return 0
    return Math.max(0, Math.round((1 - pathLength(tour.value) / asBooked) * 100))
  })
  const isFull = computed(() => stops.value.length >= MAX_STOPS)
  const summary = computed(
    () =>
      `${stops.value.length} stops. Planned route ${miles.value.toFixed(1)} miles, ` +
      `${savedPercent.value} percent shorter than driving them in the order they were booked.`,
  )

  function addStop(x: number, y: number): boolean {
    if (isFull.value) return false
    const clamped: Stop = {
      id: nextId++,
      x: Math.min(PLOT.w - EDGE, Math.max(EDGE, x)),
      y: Math.min(PLOT.h - EDGE, Math.max(EDGE, y)),
    }
    if (stops.value.some((s) => distance(s, clamped) < MIN_SEPARATION)) return false
    stops.value = [...stops.value, clamped]
    return true
  }

  /** Keyboard equivalent of clicking the plot: drop a stop somewhere plausible. */
  function addRandomStop(): boolean {
    for (let attempt = 0; attempt < 60; attempt++) {
      const x = 30 + Math.random() * (PLOT.w - 60)
      const y = 30 + Math.random() * (PLOT.h - 60)
      if (addStop(x, y)) return true
    }
    return false
  }

  function reset(): void {
    stops.value = seed()
  }

  return { stops, tour, miles, savedPercent, summary, isFull, addStop, addRandomStop, reset }
}
