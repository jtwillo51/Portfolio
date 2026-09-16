/**
 * The four beats of the build film, in one place.
 *
 * The pinned sequence and the static fallback strip both read this: the
 * sequence to caption whichever act the scroll is in, the strip to render four
 * frozen frames. `frame` is where in the film each still is taken from, and
 * `camera` is how that still is framed — a strip frame is composed for its own
 * content. The first and last stills share a camera on purpose: the front end
 * the client approves and the product that ships should look the same.
 */
export interface Act {
  readonly n: string
  readonly title: string
  readonly line: string
  /** Where this act starts, as a fraction of the film. */
  readonly at: number
  /** The moment the still is taken from. */
  readonly frame: number
  readonly camera: readonly [number, number, number]
}

export const ACTS: readonly Act[] = [
  {
    n: '01',
    title: 'Front end',
    line: 'Looks finished. Runs on nothing.',
    at: 0,
    frame: 0.14,
    camera: [612, 390, 1.28],
  },
  {
    n: '02',
    title: 'Approved',
    line: 'Signed off on what they can see.',
    at: 0.3,
    frame: 0.36,
    camera: [414, 380, 0.84],
  },
  {
    n: '03',
    title: 'Back end',
    line: 'Now build what it was pretending to do.',
    at: 0.43,
    frame: 0.74,
    camera: [680, 400, 1.05],
  },
  {
    n: '04',
    title: 'Shipped',
    line: 'Same screen. Real data, in their hands.',
    at: 0.78,
    frame: 0.995,
    camera: [612, 390, 1.28],
  },
]

/** Stills are portrait: the subject is a handheld device, and phones scroll down. */
export const STILL_ASPECT = 4 / 5

/** Which act a position in the film belongs to. */
export function actIndex(p: number): number {
  let i = 0
  for (let k = 0; k < ACTS.length; k++) if (p >= ACTS[k]!.at) i = k
  return i
}
