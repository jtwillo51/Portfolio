<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { AIRPORT_FIGURES } from '@/data/work'
import SpecList from '@/components/SpecList.vue'
import StudySection from '@/components/StudySection.vue'
import DecisionCall from '@/components/DecisionCall.vue'
import ShotFigure from '@/components/ShotFigure.vue'
import StudyPager from '@/components/StudyPager.vue'
import PlaneProgress from '@/components/PlaneProgress.vue'

const SPEC = [
  { term: 'Role', detail: 'Solo: discovery, product, design, build and the demo' },
  { term: 'Built in', detail: 'A couple of days · Aug 2026' },
  { term: 'Stack', detail: 'Next.js 16, React 19, TypeScript, Tailwind 4, Anthropic API, Zod' },
  { term: 'Status', detail: 'Prototype. Demoed; not adopted yet' },
  { term: 'Business', detail: 'Anonymous. The name in the screenshots is invented' },
]

/* The loading bar, pressable. */
const run = ref(0)
const done = ref(false)
let finish = 0
function taxi(): void {
  window.clearTimeout(finish)
  done.value = false
  run.value++
  finish = window.setTimeout(() => {
    done.value = true
  }, 3800)
}
onBeforeUnmount(() => window.clearTimeout(finish))
</script>

<template>
  <article class="study">
    <div class="shell">
      <header class="study__head">
        <p class="label">Case study: a prototype, on purpose</p>
        <h1 style="view-transition-name: vt-airport">Airport HQ</h1>
        <p class="study__sub">
          A front-end prototype for a small fixed-base operator, built in a couple of days on
          the shape of their real numbers, to show them what one workbook a month was hiding.
        </p>
      </header>
      <SpecList :items="SPEC" />
    </div>

    <StudySection label="How it started" heading="My dad asked me to look at their website.">
      <div class="prose">
        <p>
          My dad started working at a fixed-base operator, the business on an airfield that
          sells fuel, rents hangars and runs the maintenance shop. He wanted my read on their
          systems, and thought I might tidy up the website while I was at it.
        </p>
        <p>
          Once I heard how they were actually running the place, the website stopped being the
          interesting part. It was clear how simple it would be to bring their reporting into
          2026, and just as clear that some of their other systems needed attention before
          they'd be ready for it.
        </p>
      </div>
    </StudySection>

    <StudySection label="The problem" heading="One workbook per month.">
      <div class="prose">
        <p>
          Everything was entered by hand into Google Sheets, with a new workbook for every
          month. Each month is fine on its own. The trouble is anything that spans months:
          which truck earns more, what winter actually costs, whether a tank is losing fuel or
          a meter is drifting. Those answers are all in the sheets, spread across files that
          never talk to each other, so nobody asks.
        </p>
        <p>
          One detail told me I'd understood the business rather than just the request:
          <em>FBOs compete on posted fuel prices, and pilots decide where to buy fuel based on
          them.</em> A stale price on the website isn't a cosmetic bug. It's a plane landing
          somewhere else.
        </p>
      </div>
    </StudySection>

    <StudySection id="calls" heading="Five calls, and what each one cost.">
      <template #label>What I decided,<br>and what I rejected</template>

      <div class="calls">
        <DecisionCall
          v-reveal
          :index="1"
          title="Change nothing about how they work"
          chose="Every sheet became its own screen with data entry built in, laid out the way staff already track it."
          rejected="A new workflow modeled on what FBO software usually does."
          cost="Some screens inherit the sheets' quirks. That's the point: they recognized every one of them."
        >
          <p>
            They gave me one real month of numbers, exactly as they track them. My goal wasn't
            to change their process at all. It was to show them how powerful the data they
            already collect could be.
          </p>
          <p>
            If they'd had to learn a new way of working before they could see the value, the
            demo would have been about the new way of working. This way the only new thing on
            the screen was what their own numbers could now do.
          </p>
        </DecisionCall>

        <DecisionCall
          v-reveal
          :index="2"
          title="Make moving between months effortless"
          chose="Month filters on every report and side-by-side comparison across several months, with year-over-year next."
          rejected="More dashboards for a single month."
          cost="With one real month, the history had to be generated, in exactly the same shape as theirs, and I told them which was which."
        >
          <p>
            One workbook per month was the actual problem, so flipping between months (and
            laying several side by side) had to take a click rather than an afternoon. The
            goal was year-over-year comparison once there was a year of real data behind it.
          </p>
          <p>
            For the months I didn't have, I generated data with the same shape as the month
            they sent, and said so plainly. They were looking at their own sheet with more
            months attached, and they knew which month was real.
          </p>
        </DecisionCall>

        <DecisionCall
          v-reveal
          :index="3"
          title="Questions in plane English"
          chose="Natural-language questions answered by Claude over their own numbers, with example questions to start from."
          rejected="Another report to go looking for."
          cost="An answer is only as honest as the brief behind it, which is the next call."
        >
          <p>
            In the demo I asked it which fuel truck was the most profitable. That's a question
            their sheets can only answer with an afternoon of copying columns between monthly
            files. Here it's one sentence, and the answer shows its working.
          </p>
          <p>
            The example questions matter as much as the text box. Nobody knows what to ask a
            blank input about their own business; six good questions teach the shape of the
            thing in a glance.
          </p>
        </DecisionCall>

        <DecisionCall
          v-reveal
          :index="4"
          title="Put the known gap in the system prompt"
          chose="Encode known gaps in the records in the prompt, and show them next to the affected number."
          rejected="Hiding the line, or letting the model reason from books it doesn't know are incomplete."
          cost="The prompt now carries domain knowledge that has to be maintained alongside the data."
        >
          <p>
            The maintenance shop's labor billing isn't recorded anywhere; only parts spend is.
            So the shop always reads as a loss. An analysis layer looking at that will tell you
            to cut the shop, confidently and disastrously, for a business whose fuel customers
            land there <em>because</em> there's a mechanic on the field.
          </p>
          <p>
            So the gap is stated beside the line in the profitability view and in the prompt
            the model actually sees. The insights describe it as what it is, a gap in the
            records rather than a failing shop, and recommend starting to record what the shop
            bills. A model's output is only as honest as its brief, and the things you know are
            missing from your data are exactly the things it can't infer.
          </p>
        </DecisionCall>

        <DecisionCall
          v-reveal
          :index="5"
          title="Give them the keys to their own page"
          chose="In-place editing of the public site: fuel prices, wording, and which detailers and mechanics are listed."
          rejected="Asking whoever built the website every time a number changes."
          cost="No approval step. Right for a weekly fuel price; wrong for anything with legal weight."
        >
          <p>
            Changing the fuel price on their website meant working out who built it, getting in
            touch, and asking. That's a chain of people and an unknown wait standing in front of
            a number that changes weekly and decides where pilots buy.
          </p>
          <p>
            In the prototype, the staff portal renders the public page inside the admin and
            staff edit it where it appears: the prices, the wording, and which third parties
            (detailers, mechanics) show up on it. The bottleneck was a person, not a technology,
            and it would have been easy to fix the wrong half.
          </p>
        </DecisionCall>
      </div>
    </StudySection>

    <StudySection label="A detail I like" heading="The loading bar is a plane.">
      <div class="prose">
        <p>
          When the analysis is thinking, a small aircraft taxis down a dashed runway. It's there
          because it makes the software a little more fun to use, and because it's honest
          about time in two ways that are easy to get wrong.
        </p>
        <ul>
          <li>
            <strong>It never claims to be finished early.</strong> It eases toward 95% over the
            expected duration and holds there; only the finished answer takes it to 100%.
          </li>
          <li>
            <strong>It isn't stranded in a background tab.</strong> Its position comes from how
            much time has actually passed, not from animation frames. Browsers pause those in
            a hidden tab, which would leave the plane mid-runway when you came back.
          </li>
        </ul>
        <p>
          The easing curve is tuned too: a squared curve covers a fifth of the runway in the
          first tenth of the time and reads as a jump, so it uses a gentler one. Here it is,
          ported to Vue:
        </p>
      </div>
      <div class="planedemo">
        <PlaneProgress
          :key="run"
          :idle="run === 0"
          :done="done"
          :duration-ms="3000"
          :label="run === 0 ? 'Ready when you are' : done ? 'Answered' : 'Checking the figures…'"
        />
        <button type="button" class="btn btn--ghost" @click="taxi">
          {{ run === 0 ? 'Ask it something' : 'Ask again' }}
        </button>
      </div>
    </StudySection>

    <div class="shell figwrap">
      <ShotFigure
        v-for="(figure, i) in AIRPORT_FIGURES"
        :key="figure.src"
        :figure="figure"
        :first="i === 0"
      />
    </div>

    <StudySection label="The demo" heading="They liked it. They weren't ready.">
      <div class="prose">
        <p>
          I showed it to the owner and to the person he's preparing to take the business over.
          The owner has run it this way for years and didn't see a problem. The person taking
          over from him saw the value straight away.
        </p>
        <p>
          I was straight with them about the risk. I could build this for them, but it would be
          one person supporting software their business runs on. That's a real risk, and one they
          deserved to hear from me rather than discover later.
        </p>
        <p>
          I also looked at what else is out there. Most FBO reporting software is sold by fuel
          suppliers, and it's built to keep the FBO dependent on that supplier's product. An
          independent tool that works from their own records is a genuinely different offer.
        </p>
        <p>
          They're still deciding. The website changes and security updates went to the company
          that built their site originally, and I'm hoping to bring the reporting side back to
          them when the timing is right.
        </p>
      </div>
    </StudySection>

    <StudySection heading="Nothing. I went in knowing.">
      <template #label>What I'd do<br>differently</template>
      <div class="prose">
        <p>
          I built it knowing there was a strong chance they wouldn't adopt it, and that was
          fine. It was a new domain, a real business, and a chance to think a problem through
          from scratch using everything I've picked up across my career. I loved the exercise.
        </p>
        <p>
          And it did its job: it showed them what they were missing, in their own numbers. It's
          how I'd start with anyone: the finished-looking front end first, with the back end
          built once the answer is yes. That's the
          <RouterLink class="lnk" to="/#front-end-first">front end first</RouterLink> idea on
          the home page, done for real.
        </p>
      </div>
    </StudySection>
  </article>

  <StudyPager
    :prev="{ eyebrow: 'Previous case study', title: '← BuffrHQ', to: '/work/buffrhq' }"
    :next="{ eyebrow: 'Next case study', title: 'Ticket to UAT →', to: '/work/pipeline' }"
  />
</template>

<style scoped>
.planedemo {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem 2rem;
  margin-top: 1.5rem;
  padding: 1.1rem 1.4rem;
  border: 1px solid var(--rule);
  border-radius: 8px;
  background: var(--sheet);
}
</style>
