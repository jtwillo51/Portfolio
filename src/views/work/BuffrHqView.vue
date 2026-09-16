<script setup lang="ts">
import { LINKS } from '@/data/site'
import { BUFFR_SHOTS } from '@/data/work'
import SpecList from '@/components/SpecList.vue'
import StudySection from '@/components/StudySection.vue'
import DecisionCall from '@/components/DecisionCall.vue'
import PhoneRail from '@/components/PhoneRail.vue'
import NoteBlock from '@/components/NoteBlock.vue'
import StudyPager from '@/components/StudyPager.vue'

const SPEC = [
  { term: 'Role', detail: 'Solo: product, design, four surfaces, backend' },
  { term: 'Timeline', detail: 'Mar 2026 → now · still shipping updates' },
  { term: 'Stack', detail: 'React Native / Expo, Vue 3, Node, Postgres, Mapbox' },
  { term: 'Status', detail: 'Live on the App Store, under Buffr LLC' },
  { term: 'Source', detail: 'Private (reason below)' },
]
</script>

<template>
  <article class="study">
    <div class="shell">
      <header class="study__head">
        <p class="label">Case study: independent product</p>
        <h1 style="view-transition-name: vt-buffrhq">BuffrHQ</h1>
        <p class="study__sub">
          An all-in-one CRM for mobile auto detailers: scheduling, client lookup, invoicing,
          inventory and route planning. Designed, built and shipped alone.
        </p>
        <p class="study__actions">
          <a class="btn" :href="LINKS.appStore" rel="noopener">
            Download on the App&nbsp;Store
            <svg class="arw" width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M4.5 11.5 11.5 4.5M5.5 4.5h6v6" />
            </svg>
          </a>
        </p>
      </header>
      <SpecList :items="SPEC" />
    </div>

    <StudySection label="The problem" heading="Every tool built for detailers assumes a desk and a receptionist.">
      <div class="prose">
        <p>
          Mobile detailers work out of a vehicle, not a shop. Between jobs they are booking
          work, looking up returning clients, taking payment and tracking how much product
          they burned through. The software sold to them was designed for somebody sitting
          down.
        </p>
        <p>
          The constraint that shaped everything else: the person using this is standing
          outside in sun glare with one dry hand and about fifteen seconds before the next
          thing needs their attention. That is not a styling problem. It decides how many taps
          a job transition can take, how large a target has to be, what belongs on a home
          screen at all, and which features are allowed to require typing.
        </p>
      </div>
    </StudySection>

    <StudySection label="Constraints" heading="What was fixed before I wrote anything.">
      <div class="prose">
        <ul>
          <li><strong>No team, no specification, no design partner.</strong> Every decision was mine, and every one of them came back to me later, usually at the worst time.</li>
          <li><strong>Real money and real location data from the first release.</strong> That is why the source is private, and it is why several of the calls below are risk decisions rather than engineering ones.</li>
          <li><strong>One person's operating budget.</strong> Anything priced per request had to justify itself against a subscription a solo detailer will actually pay.</li>
          <li><strong>The whole of it.</strong> Auth, edge cases, App Store review, subscription entitlements, and the unglamorous last twenty percent a team normally absorbs.</li>
        </ul>
      </div>
    </StudySection>

    <StudySection id="calls" heading="Four calls, and what each one cost.">
      <template #label>What I decided,<br>and what I rejected</template>

      <div class="prose">
        <p>
          These are the decisions I would want to be asked about in an interview, so they are
          the ones written down. Each has a cost, because all of them did.
        </p>
      </div>

      <div class="calls">
        <DecisionCall
          v-reveal
          :index="1"
          title="Route ordering without a routing bill"
          chose="Nearest-neighbor ordering on the owner's dashboard, behind an Optimize Route button; navigation handed to the maps app they already use."
          rejected="A paid optimization API, and building turn-by-turn navigation in-app."
          cost="The tour is not optimal, and at three or four jobs a day there is little to optimize. On the phone, stops simply follow the schedule."
        >
          <p>
            Commercial route-optimization APIs charge per request, and that cost scales badly
            against a price a solo operator will pay.
          </p>
          <p>
            So the owner's dashboard has an <strong>Optimize Route</strong> button: a
            nearest-neighbor heuristic over haversine distance, computed locally and anchored
            to the earliest scheduled job. The planner at the top of my
            <RouterLink class="lnk" to="/">home page</RouterLink> is the same algorithm. Jobs
            missing coordinates go to the end of the list instead of quietly disappearing from
            it. On the phone, where detailers actually are, the day simply follows the schedule.
          </p>
          <p>
            The drawn route calls a free public routing service for a road-following polyline,
            with a straight-line fallback if it is slow or unreachable, so the map degrades to
            useful rather than to blank. Turn-by-turn navigation is handed off to Apple Maps or
            Google Maps. I have no business trying to out-navigate them, and no detailer wants
            me to.
          </p>
          <p>
            In hindsight it is the one feature I would cut entirely
            (<RouterLink class="lnk" :to="{ hash: '#differently' }">more on that below</RouterLink>).
          </p>
        </DecisionCall>

        <DecisionCall
          v-reveal
          :index="2"
          title="Buy the recognition; engineer the uncertainty"
          chose="Buy recognition, proxy it server-side, and design the interface around the failure case."
          rejected="On-device OCR, and shipping the vendor token inside the app."
          cost="A network round trip, a per-scan cost, and a hard dependency on somebody else's uptime."
        >
          <p>
            Detailers rarely remember names. They always recognize the car. Matching the lookup
            key to how the user actually thinks was the highest-leverage product decision in
            the app: point the camera at a plate and the returning client comes up.
          </p>
          <p>
            Recognition itself is a solved problem sold as an API, and it is not where my
            advantage lives. The app captures a frame and hands it to my backend, which calls a
            commercial ALPR service. The token never ships to the client. In the bundle,
            anyone can pull it out of the IPA and spend my quota.
          </p>
          <p>
            The engineering that mattered was everything around the call. A
            <strong>confidence threshold</strong>, below which the app shows what it read and asks the user
            to confirm instead of silently searching for the wrong plate. A
            <strong>manual entry path that is always visible</strong>, never a fallback you have to
            discover. Recognition fails in rain, at angles and on novelty plates, and a
            feature that only works in good conditions is one people stop trusting. And a
            <strong>region selector</strong>, because plate strings are only unique within an issuing state
            and two clients can genuinely share one.
          </p>
          <p>
            The interesting part of integrating an ML service is rarely the call. It is
            deciding what to do when it is unsure.
          </p>
        </DecisionCall>

        <DecisionCall
          v-reveal
          :index="3"
          title="No card processing, on purpose"
          chose="Four payment handles behind a generated QR pay page."
          rejected="Card processing, and revenue from a take rate."
          cost="No payment revenue, and settlement stays a manual step. Reconciliation is the detailer's job."
        >
          <p>
            The obvious move is to integrate a card processor and take a cut of every job. I
            chose not to. Onboarding a solo operator into a payments platform means
            underwriting, KYC, payout delays, chargeback exposure and a compliance surface I
            would be carrying alone.
          </p>
          <p>
            Detailers already get paid through Cash App, Venmo, PayPal and Zelle. So the
            invoice generates a QR pay page with whichever of those the business has
            configured, the customer pays through a channel they already trust, and the
            detailer marks it settled. Tips are chosen by the customer at pay time rather than
            pre-set by the detailer, which converts better and is less awkward for both of
            them.
          </p>
          <p>
            It is a smaller-looking feature that removed an entire category of risk from a
            one-person company.
          </p>
        </DecisionCall>

        <DecisionCall
          v-reveal
          :index="4"
          title="Permissions before there were users to permission"
          chose="Two-axis permissions in the first release, with a fail-safe floor."
          rejected="Ship single-user, add roles when a team asks for them."
          cost="Weeks of work before a single team existed, and a check on every screen to keep correct."
        >
          <p>
            Access is gated on two independent axes: what your role allows, and what your
            subscription tier includes. A feature has to clear both.
          </p>
          <p>
            That is over-engineering for launch, and it was, right up until the first team
            account, at which point retrofitting it would have meant auditing every screen in
            the app.
          </p>
          <p>
            What made it survivable in production was a deliberate fail-safe: if the permission
            set cannot be loaded, a small set of account-essential screens stay reachable. An
            empty permission set rendering a dead app is a much worse failure than briefly
            showing someone a button they cannot use.
          </p>
        </DecisionCall>
      </div>
    </StudySection>

    <StudySection label="What it does" heading="Four client surfaces over one backend.">
      <div class="prose">
        <p>
          A React Native app for the detailer in the field. A Vue 3 dashboard for the owner
          planning a day or reconciling a week. A public booking site per business, so their
          customers can request work that lands in the app as an incoming job. And a platform
          admin for me. Behind all of it, a Node and Postgres backend handling auth,
          integrations, scheduled work, and push, SMS and email notification depending on
          urgency and on what the recipient has.
        </p>
        <p>
          Services are priced the way detailers actually sell them: one price for a small
          vehicle plus an increment per size step, rather than four unrelated prices per
          service. Setting up a price list stops being data entry and becomes one number and
          three adjustments. The distinction between <em>no increment configured</em> and
          <em>an increment of zero</em> turned out to matter, and getting it wrong is exactly the
          kind of bug that quietly overcharges someone's customer.
        </p>
      </div>
    </StudySection>

    <PhoneRail :shots="BUFFR_SHOTS" caption="Scroll or arrow through · six of the app's screens" />

    <StudySection label="Outcome" heading="Live, and still mine to maintain.">
      <div class="prose">
        <ul>
          <li>On the App&nbsp;Store with in-app subscriptions, operating under Buffr LLC, and still shipping updates.</li>
          <li>First commit to release in <strong>under three months</strong>, solo, across four client surfaces and one backend.</li>
          <li>Automatic status notification removed the single most common support conversation a detailer has.</li>
          <li>Plate lookup, barcode inventory, route planning, a four-app QR pay page and role-scoped multi-tenancy all shipped in the first year.</li>
        </ul>
        <p>
          I am not going to publish install or revenue numbers. It is a young product in a
          small market and the honest version of that chart is not impressive yet. What it does
          prove is delivery: I chose the scope, made every call above, and got it through
          App&nbsp;Store review without anyone to hand the hard parts to.
        </p>
      </div>

      <NoteBlock label="Why the source is private">
        <p>
          BuffrHQ handles payment handles, addresses and location data for real businesses. Git
          history exposes every commit, not the current state. One config file committed and
          removed a year later is still trivially recoverable. The case study carries the value
          here; the code does not need to. I am happy to walk through any part of the
          implementation in an interview.
        </p>
      </NoteBlock>
    </StudySection>

    <StudySection id="differently" heading="I built features instead of selling it.">
      <template #label>What I'd do<br>differently</template>
      <div class="prose">
        <p>
          The people I showed it to along the way loved it. But I got so focused on new
          features that I didn't sell it to anyone, and I haven't spent anything on ads. If I
          started again, I'd talk to detailers before building, launch a smaller product
          sooner, and put real effort into getting it in front of people from the start.
        </p>
        <p>
          I'd also skip the route planner. Solo detailers usually clean three or four cars a
          day, so there is nothing there to optimize. It was a bad idea from the start, and I
          would never build it again.
        </p>
      </div>
    </StudySection>
  </article>

  <StudyPager
    :prev="{ eyebrow: 'Back to', title: 'All work', to: '/#work' }"
    :next="{ eyebrow: 'Next case study', title: 'Airport HQ →', to: '/work/airport-hq' }"
  />
</template>
