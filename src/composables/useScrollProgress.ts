import { onBeforeUnmount, onMounted, readonly, ref, type Ref } from 'vue'

/**
 * Progress through a tall section, 0 → 1, for a pinned scroll sequence.
 *
 * The rest of the site does its scroll work in CSS with `animation-timeline`.
 * This one piece is driven from JavaScript on purpose: it needs a value that
 * several unrelated things read at once — a camera, a front end lifting off
 * its chassis, a gear train, springs, a dashboard going live — and one shared number is simpler to reason
 * about than a dozen coordinated CSS timelines with different ranges.
 *
 * It stays cheap: a passive listener that only schedules a frame, one
 * `getBoundingClientRect()` per frame, and one custom property written back.
 */
export function useScrollProgress(target: Ref<HTMLElement | null>) {
  const progress = ref(0)
  let frame = 0

  function measure(): void {
    frame = 0
    const el = target.value
    if (!el) return
    const rect = el.getBoundingClientRect()
    const travel = rect.height - window.innerHeight
    progress.value = travel <= 0 ? 0 : Math.min(1, Math.max(0, -rect.top / travel))
  }

  function schedule(): void {
    frame ||= requestAnimationFrame(measure)
  }

  onMounted(() => {
    measure()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule, { passive: true })
  })

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', schedule)
    window.removeEventListener('resize', schedule)
    if (frame) cancelAnimationFrame(frame)
  })

  return readonly(progress)
}

/** A media query as a ref. Safe during SSR, where it reports false. */
export function useMediaQuery(query: string) {
  const matches = ref(false)
  let list: MediaQueryList | undefined
  const sync = () => {
    matches.value = list?.matches ?? false
  }

  onMounted(() => {
    list = window.matchMedia(query)
    sync()
    list.addEventListener('change', sync)
  })
  onBeforeUnmount(() => list?.removeEventListener('change', sync))

  return readonly(matches)
}
