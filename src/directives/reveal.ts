import type { Directive } from 'vue'

/**
 * v-reveal — the scroll-entrance treatment.
 *
 * Where the browser has scroll-driven animations the work is pure CSS and this
 * only has to opt the element in. Where it does not, it falls back to an
 * IntersectionObserver — but only for elements that start below the fold, so an
 * element already on screen is never hidden and faded back in.
 */

let observer: IntersectionObserver | null = null

const supportsScrollTimeline = () =>
  typeof CSS !== 'undefined' && CSS.supports('animation-timeline', 'view()')

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

function getObserver(): IntersectionObserver {
  observer ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.classList.add('is-in')
        observer?.unobserve(entry.target)
      }
    },
    { rootMargin: '0px 0px -12% 0px' },
  )
  return observer
}

export const vReveal: Directive<HTMLElement> = {
  mounted(el) {
    if (prefersReducedMotion()) return

    if (supportsScrollTimeline()) {
      el.classList.add('enter')
      return
    }

    const belowTheFold = el.getBoundingClientRect().top > window.innerHeight * 0.9
    if (!belowTheFold) return

    el.classList.add('enter')
    getObserver().observe(el)
  },
  unmounted(el) {
    observer?.unobserve(el)
  },
}
