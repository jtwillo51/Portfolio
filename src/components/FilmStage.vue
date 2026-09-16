<script setup lang="ts">
import { computed, useId } from 'vue'
import {
  buildTrain,
  circle,
  coil,
  gearOutline,
  gearSpokes,
  plot,
  rand,
  roundRect,
  toPath,
  type GearSpec,
} from '@/lib/mech'

/**
 * One frame of the build film, at any point in it.
 *
 * The story is a car shell: the front end the client approves is the finished
 * product's body, with nothing under it. It lifts off, the chassis is empty
 * apart from dashed outlines of what will go there, the back end is built into
 * those outlines, and the same front drops back on — now live.
 *
 * A pure function of `p`. Nothing animates in here and no time passes; the
 * section decides what `p` is, from scroll or from a fixed value, and the
 * fallback strip renders four of these at four constants.
 */
const props = withDefaults(
  defineProps<{
    p: number
    /** Overrides the shot the progress would choose: [x, y, zoom]. */
    camera?: readonly [number, number, number] | null
    /** Frame width over height. Zoom fixes the height, so a portrait still
        of the device keeps the same scale as the wide film. */
    aspect?: number
    /** Only one frame on the page should carry the long description. */
    describe?: boolean
    /** The client's margin callouts. Off in the stills: a portrait frame
        cannot reach them, and half a label reads as a bug. */
    clientNotes?: boolean
  }>(),
  { camera: null, describe: true, aspect: 1200 / 760, clientNotes: true },
)

const uid = useId()

/* ------------------------------------------------------------------ world */

const H = 760
/** The silhouette. The front and the chassis are both exactly this box. */
const DEV = { x: 440, y: 86, w: 320, h: 588, r: 28 } as const
const SCR = { x: 462, y: 122, w: 276, h: 516, r: 12 } as const
/** Where the front end sits while the chassis is open. */
const LIFT = { x: -372, y: -24 } as const

/* ---------------------------------------------------------------- shaping */

const clamp = (t: number) => Math.min(1, Math.max(0, t))
const seg = (a: number, b: number) => clamp((props.p - a) / (b - a))
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const easeOut = (t: number) => 1 - (1 - t) ** 3
const easeInOut = (t: number) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2)
/** Overshoots its target and settles back — the only hard beat in the film. */
const backOut = (t: number) => 1 + 2.7 * (t - 1) ** 3 + 1.7 * (t - 1) ** 2

/* ------------------------------------------------------------------- acts */

// Act one: the client pokes at it.
const TAP_ONE = 0.07
const TAP_TWO = 0.12
const worked = computed(() => seg(TAP_ONE, TAP_ONE + 0.01))
const toast = computed(() => seg(TAP_TWO, TAP_TWO + 0.008) * (1 - seg(0.185, 0.2)))
const notes = computed(() => 1 - seg(0.165, 0.2))
const pressedOpacity = computed(() => worked.value * (1 - seg(0.19, 0.22)))

/** The front lifts off the chassis, then comes back for the last act. */
const lifted = computed(() => easeInOut(seg(0.19, 0.29)) * (1 - easeInOut(seg(0.78, 0.87))))
const front = computed(() => ({ x: LIFT.x * lifted.value, y: LIFT.y * lifted.value }))

const stamp = computed(() => seg(0.3, 0.345))
const stampOut = computed(() => 1 - seg(0.43, 0.5))

/** Each part of the back end fills its outline in turn. */
const built = computed(() => ({
  data: easeOut(seg(0.45, 0.52)),
  api: easeOut(seg(0.5, 0.57)),
  logic: easeOut(seg(0.55, 0.64)),
  links: easeOut(seg(0.52, 0.6)),
  jobs: easeOut(seg(0.61, 0.68)),
}))
/** The gears only turn once the logic is actually in. */
const drive = computed(() => Math.max(0, props.p - 0.63) * 1400)
const load = computed(() => easeInOut(seg(0.68, 0.76)))

const plug = computed(() => easeOut(seg(0.84, 0.9)))
/** Real data. The accent is held back until the product is actually live. */
const live = computed(() => seg(0.88, 0.95))
const tag = computed(() => easeOut(seg(0.93, 1)))

/* ----------------------------------------------------------------- camera */

/** [at, x, y, zoom], keyed to the beats. */
const SHOTS: readonly (readonly [number, number, number, number])[] = [
  [0.0, 604, 392, 1.18],
  [0.17, 604, 392, 1.14],
  [0.3, 414, 362, 0.9],
  [0.42, 420, 362, 0.92],
  [0.5, 604, 390, 1.12],
  [0.74, 612, 395, 1.16],
  [0.84, 500, 380, 0.95],
  [0.92, 600, 384, 1.1],
  [1.0, 604, 384, 1.24],
]

const viewBox = computed(() => {
  let cx: number
  let cy: number
  let z: number
  if (props.camera) {
    ;[cx, cy, z] = props.camera
  } else {
    const p = clamp(props.p)
    let i = 0
    while (i < SHOTS.length - 2 && p > SHOTS[i + 1]![0]) i++
    const a = SHOTS[i]!
    const b = SHOTS[i + 1]!
    const t = easeInOut(clamp((p - a[0]) / (b[0] - a[0])))
    cx = lerp(a[1], b[1], t)
    cy = lerp(a[2], b[2], t)
    z = lerp(a[3], b[3], t)
  }
  const h = H / z
  const w = h * props.aspect
  return `${(cx - w / 2).toFixed(1)} ${(cy - h / 2).toFixed(1)} ${w.toFixed(1)} ${h.toFixed(1)}`
})

/* --------------------------------------------------------------- the body */

const bodyPath = toPath(roundRect(DEV.x, DEV.y, DEV.w, DEV.h, DEV.r), true)
const trayWall = toPath(roundRect(DEV.x + 9, DEV.y + 9, DEV.w - 18, DEV.h - 18, DEV.r - 8), true)
const screenPath = toPath(roundRect(SCR.x, SCR.y, SCR.w, SCR.h, SCR.r), true)

/** Exploded-view leaders from each chassis corner to the matching corner of the front. */
const guides = computed(() => {
  const { x: dx, y: dy } = front.value
  const corners: [number, number][] = [
    [DEV.x + 14, DEV.y + 14],
    [DEV.x + DEV.w - 14, DEV.y + 14],
    [DEV.x + 14, DEV.y + DEV.h - 14],
    [DEV.x + DEV.w - 14, DEV.y + DEV.h - 14],
  ]
  return corners.map(([x, y]) => `M${x},${y}L${(x + dx).toFixed(1)},${(y + dy).toFixed(1)}`).join('')
})

const BOSSES = [
  [472, 116],
  [728, 116],
  [472, 644],
  [728, 644],
] as const

/* ----------------------------------------------------- the back end, built */

const TRAIN: readonly GearSpec[] = [
  { id: 'a', teeth: 22 },
  { id: 'b', teeth: 10, from: 'a', at: 70 },
  { id: 'c', teeth: 18, from: 'b', at: 112 },
  { id: 'd', teeth: 9, from: 'c', at: 58 },
  { id: 'e', teeth: 15, from: 'd', at: 120 },
  { id: 'f', teeth: 12, from: 'a', at: 205 },
  { id: 'g', teeth: 19, from: 'f', at: 268 },
]
const GEARS = buildTrain(TRAIN, 3.6, [615, 258])

const gearPaths = computed(() =>
  GEARS.map((g) => ({
    id: g.id,
    rim: toPath(gearOutline(g, drive.value), true),
    hub: toPath(circle(g.x, g.y, g.r * 0.19, 20), true),
    spokes: gearSpokes(g, drive.value, g.teeth > 14 ? 5 : 3)
      .map(([a, b]) => toPath([a, b]))
      .join(''),
  })),
)
/** The outline each gear will fill: the space is reserved before the part exists. */
const gearGhosts = GEARS.map((g) => ({ id: g.id, x: g.x, y: g.y, r: g.r * 1.06 }))

const DB = { cx: 530, top: 484, bottom: 590, rx: 42, ry: 12 } as const
const dbArc = (y: number) => `M${DB.cx - DB.rx},${y}A${DB.rx},${DB.ry} 0 0 0 ${DB.cx + DB.rx},${y}`
const dbBody = `M${DB.cx - DB.rx},${DB.top}V${DB.bottom}A${DB.rx},${DB.ry} 0 0 0 ${DB.cx + DB.rx},${DB.bottom}V${DB.top}Z`
const dbLines = [
  `M${DB.cx - DB.rx},${DB.top}V${DB.bottom}M${DB.cx + DB.rx},${DB.top}V${DB.bottom}`,
  dbArc(DB.bottom),
  dbArc(520),
  dbArc(555),
].join('')

const SPRINGS = [
  { x: 650, y0: 484, y1: 604, r: 13, turns: 5 },
  { x: 700, y0: 490, y1: 604, r: 11, turns: 4 },
] as const
const springPaths = computed(() =>
  SPRINGS.map((s) => toPath(coil(s.x, s.y0, s.y1, s.r, s.turns, load.value))),
)

const CHIP = { x: 556, y: 612, w: 94, h: 32 } as const
const chipPins = Array.from({ length: 7 }, (_, i) => {
  const x = CHIP.x + 10 + i * ((CHIP.w - 20) / 6)
  return `M${x},${CHIP.y - 8}V${CHIP.y}M${x},${CHIP.y + CHIP.h}V${CHIP.y + CHIP.h + 8}`
}).join('')

const PORTS = [
  { x: 740, y: 282 },
  { x: 740, y: 320 },
] as const

/** Board traces: orthogonal with mitred corners, the way boards are routed. */
const TRACES = [
  [[566, 612], [566, 604], [552, 604]],
  [[603, 612], [603, 498], [620, 481], [620, 468]],
  [[640, 612], [640, 608], [726, 608], [742, 592], [742, 336]],
  [[657, 258], [700, 258], [716, 274], [716, 290], [740, 290]],
  [[556, 636], [472, 636], [462, 626], [462, 300], [478, 284], [522, 284]],
] as const
const tracePaths = TRACES.map((t) => toPath(t))
const tracePads = TRACES.flatMap((t) => [t[0], t[t.length - 1]!])

/** What each part is, in the terms the work is actually done in. */
const LABELS = [
  { key: 'logic', title: 'BUSINESS LOGIC', sub: 'pricing, thresholds, rules', y: 222, lead: 'M657,240L680,218H784' },
  { key: 'links', title: 'INTEGRATIONS', sub: 'vendors, payments, weather', y: 314, lead: 'M752,310H784' },
  { key: 'data', title: 'DATABASE', sub: 'history and audit trail', y: 452, lead: 'M556,478L566,468H772L784,448' },
  { key: 'jobs', title: 'JOBS & QUEUES', sub: 'the work nobody watches', y: 552, lead: 'M711,548H784' },
  { key: 'api', title: 'API', sub: 'auth, validation, contracts', y: 644, lead: 'M650,628L662,640H784' },
] as const
type Part = (typeof LABELS)[number]['key']
const partBuilt = (k: Part) => built.value[k]

/** The chassis only shows while the front is off it. */
const exposed = computed(() => clamp(lifted.value * 1.6))

/* ------------------------------------------ the front end: one screen, twice */

const TILES = [
  { label: 'PROFITABILITY', value: '12.4%', series: [4, 5, 4.6, 6, 5.8, 7.4, 8, 9.2, 11, 12.4] },
  { label: 'PRODUCTIVITY', value: '8.1%', series: [3, 3.4, 3.2, 4.4, 5, 5.2, 6.4, 7, 7.6, 8.1] },
] as const

const tiles = TILES.map((tile, i) => {
  const x = 478 + i * 126
  const pts = plot(tile.series, x + 2, 232, 112, 34)
  const line = toPath(pts)
  return {
    ...tile,
    x,
    arrow: `M${x + 1},210L${x + 9},198L${x + 17},210Z`,
    spark: line,
    area: `${line}L${x + 114},270L${x + 2},270Z`,
    end: pts[pts.length - 1]!,
  }
})

/** One sentence each — the whole point of the back end behind them. */
const INSIGHTS = [
  { lines: ['Warehouse 4 just broke a record!'], y: 316, h: 44 },
  { lines: ["Joe's 7-year work anniversary", 'is next week!'], y: 368, h: 60 },
] as const

/** Everything the dashboard knows and deliberately does not lead with. */
const BEHIND = [
  'Inventory variance',
  'Route cost per mile',
  'Overtime by shift',
  'Vendor SLA breaches',
  'Fuel index',
] as const

const TAP_AT = {
  one: [650, 346],
  two: [660, 512],
} as const

/** The client's thumb: to the first card, then to a row that is not wired yet. */
const thumb = computed(() => {
  const start = [790, 730] as const
  const a = easeInOut(seg(0.03, TAP_ONE))
  const b = easeInOut(seg(0.09, TAP_TWO))
  const x = lerp(lerp(start[0], TAP_AT.one[0], a), TAP_AT.two[0], b)
  const y = lerp(lerp(start[1], TAP_AT.one[1], a), TAP_AT.two[1], b)
  const p = props.p
  const pressed = (p >= TAP_ONE && p < TAP_ONE + 0.012) || (p >= TAP_TWO && p < TAP_TWO + 0.012)
  return { x, y, r: pressed ? 19 : 22, o: seg(0.02, 0.035) * (1 - seg(0.16, 0.19)) }
})
const ripple = computed(() => {
  const second = props.p >= TAP_TWO
  const at = second ? TAP_TWO : TAP_ONE
  const t = seg(at, at + 0.02)
  const [x, y] = second ? TAP_AT.two : TAP_AT.one
  return { x, y, r: lerp(12, 38, t), o: t > 0 && t < 1 ? 1 - t : 0 }
})

/** Annotations for the client, pointing at the parts of the screen that matter. */
const callouts = computed(() => [
  { title: 'SAMPLE DATA', sub: 'looks real, isn’t yet', y: 238, lead: 'M722,246H784', o: seg(0.012, 0.03) },
  { title: 'WORKS', sub: 'tap opens the detail', y: 334, lead: 'M722,338H784', o: worked.value },
  { title: 'NOT WIRED', sub: 'says what it will do', y: 502, lead: 'M722,506H784', o: seg(TAP_TWO, TAP_TWO + 0.01) },
])

/* -------------------------------------------------------------- the stamp */

const STAMP_AT = { x: 600 + LIFT.x, y: 330 + LIFT.y } as const
const stampTransform = computed(() => {
  const scale = lerp(2.6, 1, backOut(stamp.value))
  return `translate(${STAMP_AT.x} ${STAMP_AT.y}) rotate(-13) scale(${scale.toFixed(3)})`
})
const stampOpacity = computed(() => Math.min(clamp(stamp.value * 4), stampOut.value))

const specks = computed(() => {
  const t = easeOut(clamp((stamp.value - 0.55) * 2.4))
  return Array.from({ length: 16 }, (_, i) => {
    const a = (i / 16) * Math.PI * 2 + rand(i, 5) * 0.4
    const d = lerp(96, 170 + rand(i, 9) * 40, t)
    return {
      x: STAMP_AT.x + Math.cos(a) * d,
      y: STAMP_AT.y + Math.sin(a) * d * 0.72,
      r: 2 + Math.abs(rand(i, 12)) * 2.4,
      o: t > 0 ? (1 - t) * stampOut.value : 0,
    }
  })
})

/* ------------------------------------------------------------------ power */

/** Unplugged until the last act: the prototype runs, but on nothing. */
const plugY = computed(() => lerp(708, DEV.y + DEV.h - 4, plug.value))
const cablePath = computed(() => {
  const y = plugY.value
  return `M600,${(y + 28).toFixed(1)}C600,${(y + 92).toFixed(1)} 700,${(y + 96).toFixed(1)} 780,${(y + 190).toFixed(1)}`
})

/* ------------------------------------------------------------ description */

const SUMMARY =
  'A handheld device shown at four stages. One: it looks exactly like the ' +
  'finished product: an operations dashboard marked SAMPLE DATA. A tap on ' +
  'the first insight works; a tap on another row shows “Wired up after ' +
  'sign-off”. The front then lifts off like a car body, and the chassis under ' +
  'it is empty apart from dashed outlines of what will go there. Two: an ' +
  'APPROVED stamp lands on the front end. Three: the back end is built into ' +
  'those outlines: a database, an API, a gear train of business logic, ' +
  'integrations, and jobs and queues on springs. Four: the same front drops ' +
  'back on, power connects, and the dashboard switches from SAMPLE DATA to ' +
  'LIVE, with profitability up 12.4 percent, productivity up 8.1 percent, ' +
  'Warehouse 4 just broke a record, and Joe’s 7-year work anniversary is ' +
  'next week.'
</script>

<template>
  <svg
    class="stage"
    :viewBox="viewBox"
    preserveAspectRatio="xMidYMid meet"
    role="img"
    :aria-labelledby="describe ? `${uid}-t ${uid}-d` : `${uid}-t`"
  >
    <title :id="`${uid}-t`">From front-end prototype to shipped product</title>
    <desc v-if="describe" :id="`${uid}-d`">{{ SUMMARY }}</desc>

    <defs>
      <clipPath :id="`${uid}-screen`">
        <rect :x="SCR.x" :y="SCR.y" :width="SCR.w" :height="SCR.h" :rx="SCR.r" />
      </clipPath>
    </defs>

    <!-- ==================== the chassis: empty, then built ==================== -->
    <path class="tray" :d="bodyPath" />
    <path class="tray__wall" :d="trayWall" />

    <g :opacity="exposed">
      <circle v-for="(b, i) in BOSSES" :key="`bo${i}`" class="boss" :cx="b[0]" :cy="b[1]" r="7" />

      <!-- Reserved space: the outline of every part before it exists. -->
      <g class="ghost">
        <circle
          v-for="g in gearGhosts"
          :key="`gg${g.id}`"
          :cx="g.x"
          :cy="g.y"
          :r="g.r"
          :opacity="1 - built.logic"
        />
        <g :opacity="1 - built.data">
          <ellipse :cx="DB.cx" :cy="DB.top" :rx="DB.rx" :ry="DB.ry" />
          <path :d="dbLines" />
        </g>
        <rect
          v-for="s in SPRINGS"
          :key="`sg${s.x}`"
          :x="s.x - s.r - 2"
          :y="s.y0 - 4"
          :width="(s.r + 2) * 2"
          :height="s.y1 - s.y0 + 8"
          rx="6"
          :opacity="1 - built.jobs"
        />
        <rect :x="CHIP.x" :y="CHIP.y" :width="CHIP.w" :height="CHIP.h" rx="4" :opacity="1 - built.api" />
        <rect
          v-for="port in PORTS"
          :key="`pg${port.y}`"
          :x="port.x"
          :y="port.y"
          width="12"
          height="16"
          rx="2"
          :opacity="1 - built.links"
        />
      </g>
      <g :opacity="1 - built.data">
        <rect class="tray__plate" x="516" y="371" width="168" height="24" rx="3" />
        <text class="tray__empty" x="600" y="387" text-anchor="middle">NO BACK END YET</text>
      </g>

      <!-- The real parts, filling those outlines. -->
      <g>
        <path
          v-for="(t, i) in tracePaths"
          :key="`t${i}`"
          class="trace"
          :d="t"
          pathLength="1"
          :stroke-dashoffset="1 - built.links"
        />
        <circle
          v-for="(pad, i) in tracePads"
          :key="`pd${i}`"
          class="pad"
          :cx="pad[0]"
          :cy="pad[1]"
          r="3.2"
          :opacity="built.links"
        />
        <rect
          v-for="port in PORTS"
          :key="`p${port.y}`"
          class="port"
          :x="port.x"
          :y="port.y"
          width="12"
          height="16"
          rx="2"
          :opacity="built.links"
        />

        <g :opacity="built.data">
          <path class="db__body" :d="dbBody" />
          <ellipse class="db__top" :cx="DB.cx" :cy="DB.top" :rx="DB.rx" :ry="DB.ry" />
          <path class="db__line" :d="dbLines" />
        </g>

        <path
          v-for="(s, i) in springPaths"
          :key="`s${i}`"
          class="spring"
          :d="s"
          :opacity="built.jobs"
        />

        <g :opacity="built.logic">
          <g v-for="g in gearPaths" :key="g.id">
            <path class="gear__rim" :d="g.rim" />
            <path class="gear__hub" :d="g.hub" />
            <path class="gear__spoke" :d="g.spokes" />
          </g>
        </g>

        <g :opacity="built.api">
          <rect class="chip" :x="CHIP.x" :y="CHIP.y" :width="CHIP.w" :height="CHIP.h" rx="4" />
          <path class="chip__pins" :d="chipPins" />
        </g>
      </g>
    </g>

    <!-- Labels: what each part is, arriving as it is built. -->
    <g :opacity="exposed">
      <g v-for="l in LABELS" :key="l.key" :opacity="partBuilt(l.key)">
        <path class="lead" :d="l.lead" />
        <text class="note__title" x="790" :y="l.y">{{ l.title }}</text>
        <text class="note__sub" x="790" :y="l.y + 16">{{ l.sub }}</text>
      </g>
    </g>

    <!-- Exploded-view leaders while the front is off. -->
    <path class="guide" :d="guides" :opacity="lifted" />

    <!-- ============================ the front end ============================ -->
    <g :transform="`translate(${front.x.toFixed(1)} ${front.y.toFixed(1)})`">
      <path class="shadow" :d="bodyPath" transform="translate(12 16)" :opacity="lifted * 0.45" />
      <path class="body" :d="bodyPath" />
      <path class="screen-glass" :d="screenPath" />

      <g :clip-path="`url(#${uid}-screen)`">
        <g class="dash" :style="{ '--live': live }">
          <text class="dash__eyebrow" x="478" y="150">OPERATIONS</text>
          <text class="dash__badge" x="722" y="150" text-anchor="end" :opacity="1 - live">SAMPLE DATA</text>
          <g :opacity="live">
            <text class="dash__badge dash__badge--live" x="722" y="150" text-anchor="end">LIVE</text>
            <circle class="dash__dot" cx="685" cy="146.5" r="3" />
          </g>
          <path class="dash__rule" d="M478,162H722" />

          <g v-for="t in tiles" :key="t.label">
            <text class="dash__label" :x="t.x" y="186">{{ t.label }}</text>
            <path class="dash__arrow" :d="t.arrow" />
            <text class="dash__value" :x="t.x + 23" y="212">{{ t.value }}</text>
            <path class="dash__area" :d="t.area" />
            <path class="dash__spark" :d="t.spark" />
            <circle class="dash__tip" :cx="t.end[0]" :cy="t.end[1]" r="3.2" />
          </g>

          <path class="dash__rule" d="M478,288H722" />
          <text class="dash__label" x="478" y="306">WHAT YOU NEED TO KNOW</text>

          <g v-for="(n, i) in INSIGHTS" :key="`in${i}`">
            <rect class="dash__card" x="478" :y="n.y" width="244" :height="n.h" rx="5" />
            <rect class="dash__bar" x="478" :y="n.y" width="3" :height="n.h" />
            <text
              v-for="(l, j) in n.lines"
              :key="l"
              class="dash__insight"
              x="492"
              :y="n.y + (n.lines.length === 1 ? 27 : 25 + j * 19)"
            >{{ l }}</text>
          </g>
          <path class="dash__chev" d="M704,332L710,338L704,344" />
          <!-- The one button that works in the prototype. -->
          <rect class="dash__pressed" x="477" y="315" width="246" height="46" rx="6" :opacity="pressedOpacity" />

          <text class="dash__label" x="478" y="462">BEHIND GLASS · {{ BEHIND.length }}</text>
          <g v-for="(row, i) in BEHIND" :key="row">
            <text class="dash__row" x="478" :y="486 + i * 24">{{ row }}</text>
            <path class="dash__rowrule" :d="`M478,${494 + i * 24}H722`" />
          </g>

          <text class="dash__foot" x="478" y="620" :opacity="1 - live">PROTOTYPE · NOT CONNECTED</text>
          <text class="dash__foot" x="478" y="620" :opacity="live">12 SOURCES · UPDATED JUST NOW</text>

          <!-- And one that is not wired yet, saying so. -->
          <g :opacity="toast">
            <rect class="toast" x="496" y="530" width="208" height="34" rx="17" />
            <text class="toast__text" x="600" y="551" text-anchor="middle">Wired up after sign-off</text>
          </g>
        </g>
      </g>
    </g>

    <!-- The client's thumb, and what it found. -->
    <circle class="ripple" :cx="ripple.x" :cy="ripple.y" :r="ripple.r" :opacity="ripple.o" />
    <circle class="thumb" :cx="thumb.x" :cy="thumb.y" :r="thumb.r" :opacity="thumb.o" />

    <g v-if="clientNotes" :opacity="notes">
      <g v-for="c in callouts" :key="c.title" :opacity="c.o">
        <path class="lead" :d="c.lead" />
        <text class="note__title note__title--client" x="790" :y="c.y">{{ c.title }}</text>
        <text class="note__sub" x="790" :y="c.y + 16">{{ c.sub }}</text>
      </g>
    </g>

    <!-- ============================== power, tag ============================== -->
    <path class="power__cable" :d="cablePath" />
    <rect class="power__plug" x="580" :y="plugY" width="40" height="28" rx="4" />
    <path class="power__pin" :d="`M592,${plugY - 7}V${plugY}M608,${plugY - 7}V${plugY}`" />

    <g :opacity="tag" :transform="`translate(${lerp(46, 0, tag)} 0)`">
      <path class="tagg__string" d="M752,612C768,618 772,630 772,642" />
      <g transform="rotate(9 790 668)">
        <rect class="tagg__body" x="738" y="638" width="104" height="60" rx="6" />
        <circle class="tagg__hole" cx="751" cy="651" r="4" />
        <text class="tagg__text" x="764" y="662">SHIPPED</text>
        <path
          v-for="i in 10"
          :key="`br${i}`"
          class="tagg__bar"
          :d="`M${764 + (i - 1) * 6.4},672v16`"
          :stroke-width="i % 3 === 0 ? 2.6 : 1.2"
        />
      </g>
    </g>

    <!-- =============================== the beat =============================== -->
    <g :opacity="stampOpacity" :transform="stampTransform">
      <circle class="stamp__ring" r="92" />
      <circle class="stamp__ring stamp__ring--in" r="79" />
      <text class="stamp__word" y="8" text-anchor="middle">APPROVED</text>
      <text class="stamp__sub" y="36" text-anchor="middle">BUILD IT</text>
    </g>
    <circle
      v-for="(s, i) in specks"
      :key="`sk${i}`"
      class="speck"
      :cx="s.x"
      :cy="s.y"
      :r="s.r"
      :opacity="s.o"
    />
  </svg>
</template>

<style scoped>
.stage {
  display: block;
  width: 100%;
  height: 100%;

  /* The device is an object with its own materials, so none of these invert
     with the page: graphite body, a darker tray, a lit screen. */
  --body: #29313a;
  --body-edge: #3a444f;
  --tray: #161c22;
  --tray-part: #1f262d;
  --works-ink: #d3dbe2;
  --works-dim: #6f7c88;
  --glass: #0e141a;
  --glass-ink: #eef1f3;
  --glass-dim: #8e9aa6;
  --glass-rule: #25303a;
  --glass-accent: #ff9245;
  --stamp: #b3261e;
  --tag: #d6bb8c;
  --tag-edge: #b4955d;
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme='light']) .stage { --stamp: #ff5a4e; }
}
:root[data-theme='dark'] .stage { --stamp: #ff5a4e; }

/* Every stroke stays the same weight whatever the camera is doing. */
.stage :is(path, circle, rect, ellipse) {
  vector-effect: non-scaling-stroke;
}

/* ---- the chassis */
.tray { fill: var(--tray); stroke: var(--body-edge); stroke-width: 1.2; }
.tray__wall { fill: none; stroke: #2a333c; stroke-width: 1; }
.tray__empty { font: 600 11px var(--mono); letter-spacing: 0.24em; fill: var(--works-dim); }
.tray__plate { fill: var(--tray); stroke: var(--works-dim); stroke-width: 1; }
.boss { fill: var(--tray-part); stroke: var(--works-dim); stroke-width: 1; }

.ghost :is(circle, rect, path, ellipse) {
  fill: none;
  stroke: var(--works-dim);
  stroke-width: 1.1;
  stroke-dasharray: 4 4;
}

/* Traces route themselves in: normalized length, so the dash must scale too. */
.stage .trace {
  vector-effect: none;
  fill: none;
  stroke: var(--works-dim);
  stroke-width: 1.4;
  stroke-dasharray: 1;
}
.pad { fill: var(--tray); stroke: var(--works-dim); stroke-width: 1; }
.port { fill: var(--tray-part); stroke: var(--works-ink); stroke-width: 1; }
.db__body { fill: var(--tray-part); }
.db__top { fill: #232c35; stroke: var(--works-ink); stroke-width: 1.2; }
.db__line { fill: none; stroke: var(--works-ink); stroke-width: 1.2; }
.spring { fill: none; stroke: var(--works-ink); stroke-width: 1.3; }
.gear__rim { fill: var(--tray); stroke: var(--works-ink); stroke-width: 1.2; stroke-linejoin: round; }
.gear__hub { fill: none; stroke: var(--works-ink); stroke-width: 1.1; }
.gear__spoke { fill: none; stroke: var(--works-dim); stroke-width: 1; }
.chip { fill: var(--tray-part); stroke: var(--works-ink); stroke-width: 1.2; }
.chip__pins { fill: none; stroke: var(--works-dim); stroke-width: 1.4; }

/* Labels and callouts sit on the page, so they take the page's ink. */
.lead { fill: none; stroke: var(--ink-3); stroke-width: 1; }
.note__title { font: 600 11px var(--mono); letter-spacing: 0.12em; fill: var(--ink); }
.note__title--client { fill: var(--signal-txt); }
.note__sub { font: 500 12.5px var(--ui); fill: var(--ink-2); }
.guide { fill: none; stroke: var(--ink-3); stroke-width: 1; stroke-dasharray: 3 5; }

/* ---- the front end */
.shadow { fill: #000; }
.body { fill: var(--body); stroke: var(--body-edge); stroke-width: 1.2; }
.screen-glass { fill: var(--glass); }

/* Sample data is drawn in the screen's gray; live data takes the accent.
   One variable, --live, mixes between them. */
.dash { --now: color-mix(in srgb, var(--glass-accent) calc(var(--live) * 100%), var(--glass-dim)); }
.dash__eyebrow { font: 600 10px var(--mono); letter-spacing: 0.16em; fill: var(--glass-ink); }
.dash__badge { font: 600 8.5px var(--mono); letter-spacing: 0.16em; fill: var(--glass-dim); }
.dash__badge--live { fill: var(--glass-accent); }
.dash__dot { fill: var(--glass-accent); }
.dash__rule { stroke: var(--glass-rule); stroke-width: 1; }
.dash__label { font: 600 8.5px var(--mono); letter-spacing: 0.14em; fill: var(--glass-dim); }
.dash__arrow { fill: var(--now); }
.dash__value { font: 700 25px var(--display); fill: var(--glass-ink); font-variant-numeric: tabular-nums; }
.dash__area { fill: var(--now); opacity: 0.14; }
.dash__spark { fill: none; stroke: var(--now); stroke-width: 1.8; stroke-linejoin: round; }
.dash__tip { fill: var(--now); }
.dash__card { fill: #18212a; }
.dash__bar { fill: var(--now); }
.dash__chev { fill: none; stroke: var(--glass-dim); stroke-width: 1.4; }
.dash__pressed { fill: rgb(255 255 255 / 5%); stroke: var(--glass-ink); stroke-width: 1.4; }
.dash__insight { font: 600 12.5px var(--ui); fill: var(--glass-ink); }
.dash__row { font: 500 10.5px var(--ui); fill: var(--glass-dim); opacity: 0.7; }
.dash__rowrule { stroke: var(--glass-rule); stroke-width: 1; }
.dash__foot { font: 500 8px var(--mono); letter-spacing: 0.14em; fill: var(--glass-dim); }
.toast { fill: var(--glass-ink); }
.toast__text { font: 600 11.5px var(--ui); fill: var(--glass); }

.thumb { fill: rgb(120 132 144 / 22%); stroke: var(--ink-2); stroke-width: 1.4; }
.ripple { fill: none; stroke: var(--signal); stroke-width: 1.6; }

/* ---- power, tag, stamp */
.power__cable { fill: none; stroke: var(--ink); stroke-width: 5; stroke-linecap: round; }
.power__plug { fill: var(--ink); }
.power__pin { fill: none; stroke: var(--ink-2); stroke-width: 2.4; }

.tagg__string { fill: none; stroke: var(--ink-2); stroke-width: 1.2; }
.tagg__body { fill: var(--tag); stroke: var(--tag-edge); stroke-width: 1.2; }
.tagg__hole { fill: var(--paper); stroke: var(--tag-edge); stroke-width: 1; }
.tagg__text { font: 700 12px var(--mono); letter-spacing: 0.16em; fill: #26221b; }
.tagg__bar { stroke: #26221b; }

.stamp__ring { fill: none; stroke: var(--stamp); stroke-width: 4; }
.stamp__ring--in { stroke-width: 1.6; }
.stamp__word { font: 800 23px var(--display); letter-spacing: 0.08em; fill: var(--stamp); }
.stamp__sub { font: 600 11px var(--mono); letter-spacing: 0.3em; fill: var(--stamp); }
.speck { fill: var(--stamp); }
</style>
