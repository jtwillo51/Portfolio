<script setup lang="ts">
import SpecList from '@/components/SpecList.vue'
import StudySection from '@/components/StudySection.vue'
import DecisionCall from '@/components/DecisionCall.vue'
import PipelineDiagram from '@/components/PipelineDiagram.vue'
import NoteBlock from '@/components/NoteBlock.vue'
import StudyPager from '@/components/StudyPager.vue'

const SPEC = [
  { term: 'Role', detail: 'Contributor. A teammate built the pipeline; I write the rules and context files underneath it' },
  { term: 'Where', detail: 'QsrSoft, internal engineering tooling' },
  { term: 'Scale', detail: '6 engineers, 3 repositories' },
  { term: 'Built on', detail: 'Claude Code, on the CI we already had' },
  { term: 'Measured', detail: '2–3 day tickets → same-day close' },
]
</script>

<template>
  <article class="study">
    <div class="shell">
      <header class="study__head">
        <p class="label">Case study: internal engineering tooling</p>
        <h1 style="view-transition-name: vt-pipeline">Ticket to UAT</h1>
        <p class="study__sub">
          My team's agentic development pipeline, built on Claude Code. A teammate built it and I
          contributed; my part is the rules and context files that make our repositories legible
          to it. Six engineers run it across three repositories. Tickets that used to take two
          or three days close the same day.
        </p>
      </header>
      <SpecList :items="SPEC" />

      <NoteBlock label="What this page does and doesn't say" wide>
        <p>
          This is internal work at my employer. What follows is the shape of the workflow, the
          reasoning behind each guardrail, and the turnaround number. There is no employer code
          here, no repository names, no ticket contents, and no detail about internal tooling.
          If that seems like a strange thing to point out on a portfolio, it is the same
          judgment I would be applying to your codebase.
        </p>
      </NoteBlock>
    </div>

    <StudySection label="The problem" heading="A ten-minute change, surrounded by two days of overhead.">
      <div class="prose">
        <p>
          “This report should show net sales, not gross.” “Add average check as a metric in
          this widget.” The change itself is ten minutes of work.
        </p>
        <p>
          Everything around it is not. Load the context. Find the code. Branch. Make the
          change. Work out what to test. Write the tests. Open the pull request. Write the UAT
          email. Then remember, three days later, to check whether anyone approved it.
        </p>
        <p>
          That fixed cost is why a ten-minute change took two or three days. Not because it
          was hard, but because it was surrounded. And the smaller the ticket, the worse the
          ratio, which is exactly backwards from how it should feel to fix something small.
        </p>
      </div>
    </StudySection>

    <StudySection label="The shape of it" heading="Eleven steps, three of which are people.">
      <div class="prose">
        <p>
          The pipeline reads and understands the issue on a ticket, creates a branch, and
          attempts the change. Once a developer has verified the behavior, it writes the tests,
          opens a separate pull request for each testing branch, merges them into the testing
          environments from the command line, files new tickets for anything it found outside
          the original scope, and sends the UAT email.
        </p>
        <p>
          From there it is people. UAT approval comes first; then, once the guardrails pass, a
          person moves the change to master. Where those three human steps sit is the entire
          design, and everything below is an argument about their placement.
        </p>
      </div>

      <PipelineDiagram />
    </StudySection>

    <StudySection id="calls" heading="Three calls, and what each one cost.">
      <template #label>The calls,<br>and what they rejected</template>

      <div class="calls">
        <DecisionCall
          v-reveal
          :index="1"
          title="Tests come after a human has verified the behavior"
          chose="Implement → a human verifies → generate tests against verified behavior."
          rejected="Test-first. It is the received best practice, and here it is the wrong one."
          cost="You give up the design pressure TDD puts on an interface. What you buy is tests that assert the thing that was actually wanted."
        >
          <p>
            This is the call that gets argued with most, and the one I believe in most, so it
            goes first. It is deliberately <strong>not</strong> test-first.
          </p>
          <p>
            The pipeline implements the change. A developer then verifies the new behavior is
            actually correct. Only then are tests generated, against that verified behavior.
          </p>
          <p>
            The reasoning: a model writing tests before the implementation is guessing at
            intent. It will produce tests that pass, that look thorough, and that encode the
            wrong requirement. Now the wrong requirement is locked in and defended by a
            green suite. Test-first works because a human holds the intent while writing the
            test. That property does not transfer to an agent holding only the ticket text.
          </p>
          <p>
            The exception is characterizing existing behavior, where writing the test first is
            exactly right, because the intent genuinely is “whatever it does today.”
          </p>
          <p>
            Human verification sits between implementation and test generation. That position
            is the whole design, and it is the first thing I would defend in a review.
          </p>
        </DecisionCall>

        <DecisionCall
          v-reveal
          :index="2"
          title="Out-of-scope findings become tickets, not commits"
          chose="File a ticket, keep the diff small, one pull request per testing branch."
          rejected="“Fix it while you're in there.”"
          cost="Real problems wait in a backlog instead of being fixed while the file was already open. Some of them will not get picked up."
        >
          <p>
            An agent opening a file to fix one thing will find three others. Left alone, the
            default outcome is a pull request that began as a one-line fix and arrives as forty
            files, which is unreviewable and therefore gets rubber-stamped.
          </p>
          <p>
            So the pipeline files new tickets for anything outside the original scope and
            leaves the branch alone. Same reasoning behind one pull request per testing branch
            rather than one large one: a reviewer should be able to hold the whole change in
            their head.
          </p>
          <p>
            Scope discipline is the thing careful senior engineers do by hand and almost nobody
            encodes in tooling. Encoding it is what makes it safe for a whole team to run.
          </p>
        </DecisionCall>

        <DecisionCall
          v-reveal
          :index="3"
          title="Merge freely into test; master is a person's call"
          chose="Merge into the testing environments from the command line; gate master behind UAT approval, guardrails and a person."
          rejected="Stopping at a pull request and hand-merging every environment, or letting a green suite promote straight to master."
          cost="More guardrails to maintain, and throughput is capped by how fast UAT comes back. The pipeline can finish quickly and the ticket still waits on UAT. That is the correct cap."
        >
          <p>
            We run several testing environments, and moving a change through them is exactly the
            repetitive work the pipeline exists to remove. So it merges into them directly from
            the command line, the way a developer would by hand, just every time, and without
            forgetting one.
          </p>
          <p>
            Master is different. Before anything moves there, guardrails check that every test
            passes, submodules are up to date, and the change has already been merged into the
            testing environments. UAT approval is a business decision about whether this is the
            change that was wanted, and nobody in the loop can make it except the person who
            asked for it. After that approval, a person, not the pipeline, moves it to master.
          </p>
          <p>
            Underneath all of it is the belief I push for hardest: AI-written code should be
            surrounded by tests that check for explicit behavior. Speed without that just moves
            the defects downstream.
          </p>
        </DecisionCall>
      </div>
    </StudySection>

    <StudySection label="Outcome" heading="Six engineers, three repositories, same-day close.">
      <div class="prose">
        <ul>
          <li><strong>Tickets that took two or three days now close the same day.</strong> The effect is largest on small tickets, which is where the overhead-to-work ratio was worst.</li>
          <li>Review stayed reviewable as throughput went up, because the pull requests did not get bigger.</li>
          <li>Out-of-scope findings became a backlog instead of pull-request sprawl.</li>
          <li>Six engineers use it daily. That is a different bar from a workflow that only has to work for the person who built it.</li>
        </ul>
        <p>
          My main contribution is the layer underneath: the rules, context files and hooks that
          make those repositories legible to an agent in the first place. That turned out to be
          more work than I expected, and it is the part that does not show up in a demo.
        </p>
        <p>
          It keeps getting tuned. The latest pass rewrote its commands to use fewer tokens,
          shortened the commit messages it writes, and narrowed test generation to the new
          behavior. Regression is already covered by the existing suite, so re-testing it
          was cost without coverage.
        </p>
      </div>
    </StudySection>

    <StudySection heading="Speed is measured. Quality is next.">
      <template #label>What I'd do<br>differently</template>
      <div class="prose">
        <p>
          The number I have is turnaround: tickets that took two or three days now close the
          same day. What I don't have yet is a defect-rate comparison: bugs that escape,
          before and after.
        </p>
        <p>
          So far it's going well. But “faster” is only half the story for any AI tooling, and
          escaped defects are the number I want next, even if it comes back inconvenient.
        </p>
      </div>
    </StudySection>
  </article>

  <StudyPager
    :prev="{ eyebrow: 'Previous case study', title: '← Airport HQ', to: '/work/airport-hq' }"
    :next="{ eyebrow: 'Back to', title: 'All work', to: '/#work' }"
  />
</template>
