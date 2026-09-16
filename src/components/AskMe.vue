<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useTemplateRef } from 'vue'
import { PERSON } from '@/data/site'
import { GREETING, OPENERS, ORDER, TOPICS, type Topic, type TopicId } from '@/data/conversation'
import { useMediaQuery } from '@/composables/useScrollProgress'
import { useLocalTime } from '@/composables/useLocalTime'

/**
 * A conversation instead of an About paragraph.
 *
 * The visitor picks a question; the answer arrives a bubble at a time, and the
 * next questions follow from it. It is scripted, and says so by being buttons
 * rather than a text box — nothing here pretends to be a live chat.
 *
 * Before hydration, and with JavaScript off, the same content renders as a
 * plain list of questions and answers, so nothing is locked behind the
 * interaction.
 */

interface Message {
  readonly id: number
  readonly from: 'me' | 'you'
  readonly text: string
  readonly link?: Topic['link']
}

const enhanced = ref(false)
const reduced = useMediaQuery('(prefers-reduced-motion: reduce)')
const { time, status } = useLocalTime()

let seq = 0
const greeting = (): Message[] => GREETING.map((text) => ({ id: seq++, from: 'me', text }))

const log = ref<Message[]>(greeting())
const asked = ref<TopicId[]>([])
const offered = ref<TopicId[]>([...OPENERS])
const typing = ref(false)
const last = ref<TopicId | null>(null)

const logEl = useTemplateRef<HTMLElement>('logEl')
const chipsEl = useTemplateRef<HTMLElement>('chipsEl')

let alive = true
let copyTimer: ReturnType<typeof setTimeout> | undefined
onMounted(() => {
  enhanced.value = true
})
onBeforeUnmount(() => {
  alive = false
  clearTimeout(copyTimer)
})

/** Pauses read as someone typing. Under reduced motion they are skipped. */
const wait = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, reduced.value ? 0 : ms))

async function toBottom(): Promise<void> {
  await nextTick()
  const el = logEl.value
  if (el) el.scrollTo({ top: el.scrollHeight, behavior: reduced.value ? 'auto' : 'smooth' })
}

function suggestionsAfter(topic: Topic): TopicId[] {
  const seen = new Set(asked.value)
  const out: TopicId[] = []
  for (const id of [...topic.next, ...ORDER]) {
    if (!seen.has(id) && !out.includes(id)) out.push(id)
    if (out.length === 3) break
  }
  return out
}

async function ask(id: TopicId): Promise<void> {
  if (typing.value) return
  // Only move focus afterwards if it was on the questions to begin with.
  const hadFocus = chipsEl.value?.contains(document.activeElement) ?? false
  const topic = TOPICS[id]
  asked.value = [...asked.value, id]
  last.value = id
  log.value = [...log.value, { id: seq++, from: 'you', text: topic.ask }]

  for (const [i, text] of topic.reply.entries()) {
    typing.value = true
    await toBottom()
    await wait(Math.min(1500, 380 + text.length * 10))
    if (!alive) return
    typing.value = false
    const link = i === topic.reply.length - 1 ? topic.link : undefined
    log.value = [...log.value, { id: seq++, from: 'me', text, link }]
    await toBottom()
    await wait(240)
  }

  // The questions stay on screen, disabled, until the answer is finished —
  // swapping them earlier would drop keyboard focus mid-reply.
  offered.value = suggestionsAfter(topic)
  if (hadFocus) {
    await nextTick()
    chipsEl.value?.querySelector<HTMLElement>('button, a')?.focus()
  }
}

function restart(): void {
  if (typing.value) return
  log.value = greeting()
  asked.value = []
  offered.value = [...OPENERS]
  last.value = null
}

/** The subject line picks up whatever they were asking about. */
const mailto = computed(() => {
  const subject = last.value
    ? `From your portfolio: ${TOPICS[last.value].subject}`
    : 'From your portfolio'
  return `mailto:${PERSON.email}?subject=${encodeURIComponent(subject)}`
})
/**
 * A mailto link does nothing for anyone without a mail app set up — webmail, a
 * locked-down work laptop — so the address can be copied too. Where the
 * clipboard is unavailable, the address itself appears, ready to select.
 */
const copy = ref<'idle' | 'done' | 'failed'>('idle')
async function copyEmail(): Promise<void> {
  try {
    await navigator.clipboard.writeText(PERSON.email)
  } catch {
    copy.value = 'failed'
    return
  }
  copy.value = 'done'
  clearTimeout(copyTimer)
  copyTimer = setTimeout(() => (copy.value = 'idle'), 2400)
}
const exhausted = computed(() => asked.value.length === ORDER.length)
</script>

<template>
  <div class="ask">
    <div class="ask__head">
      <!-- Decorative: the name sits right beside it. -->
      <img class="ask__avatar" src="/img/jeremy.jpg" alt="" width="96" height="96">

      <div class="ask__who">
        <p class="ask__name">{{ PERSON.name }}</p>
        <p class="ask__status">
          <i class="ask__dot" aria-hidden="true" />
          <template v-if="time">{{ time }} in Gilbert · {{ status }}</template>
          <template v-else>{{ PERSON.location }}</template>
        </p>
      </div>
      <button
        v-if="enhanced && asked.length > 0"
        type="button"
        class="ask__restart"
        :disabled="typing"
        @click="restart"
      >
        Start over
      </button>
    </div>

    <template v-if="enhanced">
      <div
        ref="logEl"
        class="ask__log"
        role="log"
        aria-label="Conversation with Jeremy"
        tabindex="0"
      >
        <TransitionGroup name="bubble" tag="ol" class="ask__msgs">
          <li v-for="m in log" :key="m.id" class="msg" :class="`msg--${m.from}`">
            <span class="sr-only">{{ m.from === 'me' ? 'Jeremy:' : 'You asked:' }}</span>
            <p class="msg__text">{{ m.text }}</p>
            <RouterLink v-if="m.link" class="msg__link" :to="m.link.to">{{ m.link.label }} →</RouterLink>
          </li>
        </TransitionGroup>
        <p v-if="typing" class="typing" aria-hidden="true"><span /><span /><span /></p>
      </div>

      <div ref="chipsEl" class="ask__chips" role="group" aria-label="Questions to ask">
        <button
          v-for="id in offered"
          :key="id"
          type="button"
          class="chip"
          :aria-disabled="typing ? 'true' : undefined"
          @click="ask(id)"
        >
          {{ TOPICS[id].ask }}
        </button>
        <p v-if="exhausted" class="ask__done">That's everything I've got scripted.</p>
        <a class="chip chip--mail" :href="mailto">
          {{ asked.length > 0 ? 'Keep talking over email' : 'Or just email me' }}
        </a>
        <button v-if="copy !== 'failed'" type="button" class="chip chip--copy" @click="copyEmail">
          {{ copy === 'done' ? 'Copied' : 'Copy email' }}
        </button>
        <span v-else class="chip chip--addr">{{ PERSON.email }}</span>
        <span class="sr-only" role="status">{{ copy === 'done' ? 'Email address copied' : '' }}</span>
      </div>
    </template>

    <!-- The same conversation, readable without the interaction. -->
    <div v-else class="ask__static">
      <p v-for="line in GREETING" :key="line" class="ask__static-hi">{{ line }}</p>
      <dl>
        <template v-for="id in ORDER" :key="id">
          <dt>{{ TOPICS[id].ask }}</dt>
          <dd>
            <p v-for="line in TOPICS[id].reply" :key="line">{{ line }}</p>
            <RouterLink v-if="TOPICS[id].link" class="lnk" :to="TOPICS[id].link!.to">
              {{ TOPICS[id].link!.label }} →
            </RouterLink>
          </dd>
        </template>
      </dl>
      <p>Email me at <a class="lnk" :href="`mailto:${PERSON.email}`">{{ PERSON.email }}</a></p>
    </div>
  </div>
</template>

<style scoped>
.ask {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--rule);
  border-radius: 10px;
  background: var(--paper);
  box-shadow: var(--shadow);
  overflow: hidden;
  min-width: 0;
}

/* ---- who you are talking to */
.ask__head {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem 1.1rem;
  border-bottom: 1px solid var(--rule);
  background: var(--sheet);
}
.ask__avatar {
  flex: none;
  display: block;
  width: 2.4rem;
  height: 2.4rem;
  border-radius: 50%;
  object-fit: cover;
  background: var(--sheet-2);
  box-shadow: 0 0 0 1px var(--rule);
}
.ask__who { min-width: 0; }
.ask__name { font-weight: 600; font-size: 0.95rem; color: var(--ink); }
.ask__status {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.8125rem;
  color: var(--ink-2);
}
.ask__dot {
  flex: none;
  width: 0.45rem;
  height: 0.45rem;
  border-radius: 50%;
  background: var(--signal);
}
.ask__restart {
  flex: none;
  margin-left: auto;
  white-space: nowrap;
  padding: 0.35rem 0.7rem;
  border: 1px solid var(--rule);
  border-radius: 3px;
  background: transparent;
  font-size: 0.8125rem;
  color: var(--ink-2);
  cursor: pointer;
}
.ask__restart:hover:not(:disabled) { color: var(--ink); border-color: var(--ink-3); }
.ask__restart:disabled { opacity: 0.5; cursor: default; }

/* ---- the thread */
.ask__log {
  height: clamp(20rem, 52svh, 27rem);
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 1.1rem;
}
.ask__msgs {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}
.msg { max-width: min(85%, 30rem); display: grid; justify-items: start; gap: 0.35rem; }
.msg--me { align-self: flex-start; }
.msg--you { align-self: flex-end; justify-items: end; }
.msg--you + .msg--me,
.msg--me + .msg--you { margin-top: 0.55rem; }
.msg__text {
  padding: 0.6rem 0.85rem;
  border-radius: 14px;
  font-size: 0.9375rem;
  line-height: 1.45;
  text-wrap: pretty;
}
.msg--me .msg__text { background: var(--sheet-2); color: var(--ink); border-bottom-left-radius: 4px; }
.msg--you .msg__text { background: var(--ink); color: var(--paper); border-bottom-right-radius: 4px; }
.msg__link { font-size: 0.875rem; color: var(--signal-txt); text-underline-offset: 3px; }

.typing {
  display: inline-flex;
  gap: 4px;
  margin-top: 0.55rem;
  padding: 0.75rem 0.85rem;
  border-radius: 14px;
  border-bottom-left-radius: 4px;
  background: var(--sheet-2);
}
.typing span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--ink-3);
}

/* ---- what you can ask */
.ask__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  padding: 0.9rem 1.1rem 1.1rem;
  border-top: 1px solid var(--rule);
  background: var(--sheet);
}
.chip {
  padding: 0.45rem 0.85rem;
  border: 1px solid var(--rule);
  border-radius: 999px;
  background: var(--paper);
  color: var(--ink);
  font-size: 0.875rem;
  line-height: 1.3;
  text-align: left;
  text-decoration: none;
  cursor: pointer;
  transition: border-color 160ms, background-color 160ms;
}
.chip:hover { border-color: var(--signal); }
.chip[aria-disabled='true'] { opacity: 0.45; cursor: progress; pointer-events: none; }
.chip--mail { border-style: dashed; color: var(--signal-txt); }
.chip--copy { color: var(--ink-2); }
.chip--addr { cursor: text; user-select: all; color: var(--ink); }
.ask__done { flex-basis: 100%; font-size: 0.8125rem; color: var(--ink-2); }

/* ---- without JavaScript */
.ask__static { padding: 1.1rem 1.25rem 1.4rem; display: grid; gap: 0.75rem; }
.ask__static-hi { font-size: 1rem; color: var(--ink); }
.ask__static dl { display: grid; gap: 0.35rem; margin: 0.5rem 0 0; }
.ask__static dt { margin-top: 0.9rem; font-weight: 600; color: var(--ink); }
.ask__static dd { margin: 0; display: grid; gap: 0.4rem; color: var(--ink-2); }

/* ---- motion, where it is welcome */
@media (prefers-reduced-motion: no-preference) {
  .bubble-enter-active { transition: opacity 220ms var(--ease-out), transform 260ms var(--ease-out); }
  .bubble-enter-from { opacity: 0; transform: translateY(6px); }
  .typing span { animation: typing 1s infinite ease-in-out; }
  .typing span:nth-child(2) { animation-delay: 0.15s; }
  .typing span:nth-child(3) { animation-delay: 0.3s; }
}
@keyframes typing {
  0%, 60%, 100% { opacity: 0.35; transform: translateY(0); }
  30% { opacity: 1; transform: translateY(-2px); }
}
</style>
