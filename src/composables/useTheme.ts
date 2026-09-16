import { ref, readonly } from 'vue'

export type Theme = 'light' | 'dark'

/**
 * Theme state. `null` means "follow the system", which is the default and is
 * handled entirely in CSS — the class only takes over once someone chooses.
 *
 * Module-level state on purpose: there is one theme per document, so every
 * caller of useTheme() shares it rather than each getting its own copy.
 */
const theme = ref<Theme | null>(null)
let bound = false

const prefersDark = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

function bind(): void {
  if (bound || typeof document === 'undefined') return
  bound = true
  const stored = (() => {
    try {
      return localStorage.getItem('theme')
    } catch {
      return null // private mode
    }
  })()
  if (stored === 'light' || stored === 'dark') theme.value = stored
}

export function useTheme() {
  bind()

  /** The theme the toggle will switch to — what the button icon shows. */
  const nextTheme = (): Theme => ((theme.value ?? (prefersDark() ? 'dark' : 'light')) === 'dark' ? 'light' : 'dark')

  function apply(next: Theme): void {
    theme.value = next
    document.documentElement.dataset.theme = next
    try {
      localStorage.setItem('theme', next)
    } catch {
      /* private mode: the choice just does not persist */
    }
  }

  /**
   * Toggle, wiping the new palette in as a circle expanding from the control
   * that was pressed. Falls back to a straight swap where View Transitions or
   * motion are unavailable.
   */
  function toggle(origin?: HTMLElement): void {
    const next = nextTheme()
    if (!document.startViewTransition || prefersReducedMotion() || !origin) {
      apply(next)
      return
    }
    const r = origin.getBoundingClientRect()
    const x = r.left + r.width / 2
    const y = r.top + r.height / 2
    const reach = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))

    const transition = document.startViewTransition(() => apply(next))
    transition.ready
      .then(() => {
        document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${reach}px at ${x}px ${y}px)`] },
          {
            duration: 520,
            easing: 'cubic-bezier(0.16,1,0.3,1)',
            pseudoElement: '::view-transition-new(root)',
          },
        )
      })
      .catch(() => {
        /* the transition was skipped; the theme still applied */
      })
  }

  return { theme: readonly(theme), toggle }
}
