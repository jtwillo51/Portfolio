/**
 * The flat drawing kit behind the build film: rounded bodies, meshed gear
 * trains, coil springs and sparklines, as point lists and path strings.
 */

export type Pt = readonly [number, number]

/* ------------------------------------------------------------------ noise */

/**
 * Deterministic, seeded, in −1…1. Not `Math.random`: the server renders this
 * drawing during the prerender and the client has to agree with it exactly.
 */
export function rand(i: number, seed: number): number {
  const x = Math.sin(i * 127.1 + seed * 311.7) * 43758.5453
  return (x - Math.floor(x)) * 2 - 1
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t

/* ------------------------------------------------------------------ paths */

const round = (n: number) => (Math.round(n * 10) / 10).toString()

export function toPath(pts: readonly Pt[], close = false): string {
  if (pts.length === 0) return ''
  return `M${pts.map((p) => p.map(round).join(',')).join('L')}${close ? 'Z' : ''}`
}

/** A rounded rectangle as a closed point list, sampled every `step` units. */
export function roundRect(x: number, y: number, w: number, h: number, r: number, step = 7): Pt[] {
  const pts: Pt[] = []
  const corner = (cx: number, cy: number, from: number): void => {
    const arc = (Math.PI / 2) * r
    const n = Math.max(3, Math.round(arc / step))
    for (let i = 0; i <= n; i++) {
      const a = from + (i / n) * (Math.PI / 2)
      pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r])
    }
  }
  const edge = (ax: number, ay: number, bx: number, by: number): void => {
    const n = Math.max(1, Math.round(Math.hypot(bx - ax, by - ay) / step))
    for (let i = 1; i < n; i++) pts.push([lerp(ax, bx, i / n), lerp(ay, by, i / n)])
  }
  corner(x + w - r, y + r, -Math.PI / 2)
  edge(x + w, y + r, x + w, y + h - r)
  corner(x + w - r, y + h - r, 0)
  edge(x + w - r, y + h, x + r, y + h)
  corner(x + r, y + h - r, Math.PI / 2)
  edge(x, y + h - r, x, y + r)
  corner(x + r, y + r, Math.PI)
  edge(x + r, y, x + w - r, y)
  return pts
}

export function circle(cx: number, cy: number, r: number, segments = 44): Pt[] {
  const pts: Pt[] = []
  for (let i = 0; i < segments; i++) {
    const a = (i / segments) * Math.PI * 2
    pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r])
  }
  return pts
}

/* ------------------------------------------------------------------ gears */

export interface GearSpec {
  readonly id: string
  readonly teeth: number
  readonly from?: string
  /** Degrees around its parent. Screen angles, so positive is clockwise. */
  readonly at?: number
}

export interface Gear {
  readonly id: string
  readonly teeth: number
  readonly r: number
  readonly x: number
  readonly y: number
  readonly speed: number
  readonly offset: number
}

/**
 * Meshing, not decoration: center distance is the sum of the pitch radii, a
 * gear turns at its parent's speed scaled by the tooth ratio and the other
 * way round, and `offset` lands its teeth in its parent's gaps. Get any of the
 * three wrong and the drawing grinds instead of turning.
 */
export function buildTrain(
  specs: readonly GearSpec[],
  moduleSize: number,
  origin: Pt,
  drive = 1,
): Gear[] {
  const built = new Map<string, Gear>()
  for (const spec of specs) {
    const r = (moduleSize * spec.teeth) / 2
    let [x, y] = origin
    let speed = drive
    let offset = 0
    if (spec.from !== undefined) {
      const parent = built.get(spec.from)
      if (!parent) throw new Error(`gear ${spec.id} meshes with unknown gear ${spec.from}`)
      const theta = spec.at ?? 0
      const rad = (theta * Math.PI) / 180
      const d = parent.r + r
      x = parent.x + d * Math.cos(rad)
      y = parent.y + d * Math.sin(rad)
      const ratio = parent.teeth / spec.teeth
      speed = -ratio * parent.speed
      offset = -ratio * parent.offset + theta * (1 + ratio) + 180 - 180 / spec.teeth
    }
    built.set(spec.id, { id: spec.id, teeth: spec.teeth, r, x, y, speed, offset })
  }
  return [...built.values()]
}

/**
 * 1.06 is the tallest tooth that still clears the flank of the gear opposite
 * at a center distance of r1 + r2. Raising it makes the profiles overlap no
 * matter how well phased they are.
 */
const TIP = 1.06
const ROOT = 0.84

export function gearAngle(g: Gear, drive: number): number {
  return ((g.speed * drive + g.offset) * Math.PI) / 180
}

/** Root, rise, tip, fall — once per tooth. */
export function gearOutline(g: Gear, drive: number): Pt[] {
  const phase = gearAngle(g, drive)
  const step = (Math.PI * 2) / g.teeth
  const half = step * 0.28
  const pts: Pt[] = []
  const at = (radius: number, a: number): void => {
    pts.push([g.x + Math.cos(a) * radius, g.y + Math.sin(a) * radius])
  }
  for (let i = 0; i < g.teeth; i++) {
    const a = phase + i * step
    at(g.r * ROOT, a - half)
    at(g.r * TIP, a - half * 0.52)
    at(g.r * TIP, a + half * 0.52)
    at(g.r * ROOT, a + half)
  }
  return pts
}

export function gearSpokes(g: Gear, drive: number, count: number): [Pt, Pt][] {
  const phase = gearAngle(g, drive)
  const out: [Pt, Pt][] = []
  for (let i = 0; i < count; i++) {
    const a = phase + (i / count) * Math.PI * 2
    out.push([
      [g.x + Math.cos(a) * g.r * 0.24, g.y + Math.sin(a) * g.r * 0.24],
      [g.x + Math.cos(a) * g.r * 0.7, g.y + Math.sin(a) * g.r * 0.7],
    ])
  }
  return out
}

/* ----------------------------------------------------------------- springs */

/**
 * A coil seen from the side: each turn is a flattened ellipse, so it reads as
 * a spring rather than a zigzag. `compression` shortens it and fattens the
 * turns the way a real one bulges under load.
 */
export function coil(
  x: number,
  y0: number,
  y1: number,
  radius: number,
  turns: number,
  compression = 0,
  segments = 128,
): Pt[] {
  const end = lerp(y1, y0 + (y1 - y0) * 0.62, compression)
  const r = radius * (1 + compression * 0.22)
  const pts: Pt[] = []
  for (let i = 0; i <= segments; i++) {
    const t = i / segments
    const a = t * turns * Math.PI * 2
    pts.push([x + Math.cos(a) * r, lerp(y0, end, t) + Math.sin(a) * r * 0.3])
  }
  return pts
}

/* --------------------------------------------------------------- readouts */

/** Map a series into a box. Returns screen points, y already flipped. */
export function plot(
  values: readonly number[],
  x: number,
  y: number,
  w: number,
  h: number,
): Pt[] {
  const lo = Math.min(...values)
  const hi = Math.max(...values)
  const span = hi - lo || 1
  return values.map((v, i): Pt => [
    x + (i / (values.length - 1)) * w,
    y + h - ((v - lo) / span) * h,
  ])
}
