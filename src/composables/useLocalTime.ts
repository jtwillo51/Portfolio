import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

/**
 * The time where I am, and roughly what that means for a reply.
 *
 * Arizona does not observe daylight saving, so America/Phoenix is right all
 * year round. Both values are null until the component mounts: the prerendered
 * page has no idea when it will be read, and a server-rendered clock would be
 * wrong by definition.
 */
const TZ = 'America/Phoenix'
const clock = new Intl.DateTimeFormat('en-US', { timeZone: TZ, hour: 'numeric', minute: '2-digit' })
const parts = new Intl.DateTimeFormat('en-US', {
  timeZone: TZ,
  hour: 'numeric',
  hourCycle: 'h23',
  weekday: 'short',
})

export function useLocalTime() {
  const now = ref<Date | null>(null)
  let timer = 0

  onMounted(() => {
    now.value = new Date()
    timer = window.setInterval(() => {
      now.value = new Date()
    }, 30_000)
  })
  onBeforeUnmount(() => window.clearInterval(timer))

  /** "9:14 am". ICU may put a narrow no-break space before the meridiem. */
  const time = computed(() =>
    now.value
      ? clock.format(now.value).replace(/\s*([AP]M)$/, (_, m: string) => ` ${m.toLowerCase()}`)
      : null,
  )

  const status = computed(() => {
    if (!now.value) return null
    const p = parts.formatToParts(now.value)
    const hour = Number(p.find((x) => x.type === 'hour')?.value ?? 12)
    const day = p.find((x) => x.type === 'weekday')?.value ?? 'Mon'
    if (day === 'Sat' || day === 'Sun') return 'the weekend here'
    if (hour >= 8 && hour < 17) return 'probably at my desk'
    if (hour >= 17 && hour < 22) return 'evening here'
    return 'probably asleep'
  })

  return { time, status }
}
