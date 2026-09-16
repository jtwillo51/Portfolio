<script setup lang="ts">
import { PERSON, LINKS } from '@/data/site'
import RoleEntry from '@/components/RoleEntry.vue'
import StudyPager from '@/components/StudyPager.vue'

function print(): void {
  window.print()
}
</script>

<template>
  <article class="cv">
    <div class="shell">
      <header class="cv__head">
        <div>
          <p class="label">Résumé · Senior Software Engineer</p>
          <h1>{{ PERSON.name }}</h1>
          <p class="cv__role">
            Senior engineer who builds for named customers rather than a backlog. Front-end and
            data-visualization subject matter expert; ships alone when that is what the job
            needs.
          </p>
        </div>
        <div>
          <p class="cv__contact">
            <a class="lnk" :href="`mailto:${PERSON.email}`">{{ PERSON.email }}</a>
            <a class="lnk" :href="LINKS.linkedin" rel="noopener">LinkedIn</a>
            <a class="lnk" :href="LINKS.github" rel="noopener">GitHub</a>
            <a class="lnk" :href="LINKS.appStore" rel="noopener">App Store</a>
          </p>
          <p class="label cv__where">{{ PERSON.location }} · {{ PERSON.availability }}</p>
          <p class="no-print cv__print">
            <button class="btn btn--ghost" type="button" @click="print">
              Print or save as PDF
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M4 6V2h8v4M4 12H2.5V6.5h11V12H12M4.5 9.5h7V14h-7z" />
              </svg>
            </button>
          </p>
        </div>
      </header>
    </div>

    <section class="cvsect">
      <div class="shell cvsect__grid">
        <p class="label">Summary</p>
        <div class="prose cv__summary">
          <p>
            I sat down with a small airport operator, learned their month-by-month spreadsheet
            workflow, and built them a working prototype, with natural-language questions over
            their own data, in a couple of days. At QsrSoft I am the subject matter expert for front-end architecture and
            for data visualization on a platform serving <strong>close to a million users</strong>,
            working in JavaScript against REST and GraphQL. I write and maintain the Claude Code
            rules and context files that <strong>six engineers work from across three
            repositories</strong>, and I contributed to the team's agentic pipeline, which took
            two-to-three-day tickets to same-day close. And I designed, built and shipped a commercial product
            to the App Store alone, from first commit to release in <strong>under three months</strong>
            with no specification.
          </p>
          <p>
            Before that, I spent five years as second in command of a restaurant location
            with roughly twenty-five reports, which is where the habit of explaining a trade-off to someone who didn't
            ask for one started.
          </p>
        </div>
      </div>
    </section>

    <section class="cvsect">
      <div class="shell cvsect__grid">
        <p class="label">Experience</p>
        <div>
          <RoleEntry title="Senior Software Engineer" where="QsrSoft · Lombard, IL (remote)" period="Dec 2023 – present">
            <li>Writes and maintains the <b>Claude Code rules, context files and hooks</b> six engineers work from across three repositories, and contributed to the team's agentic development pipeline, which cut two-to-three-day ticket turnaround to same-day close.</li>
            <li>Serves as <b>front-end subject matter expert</b> for a live platform used by close to a million people: sets technical direction, and is the team's go-to on component architecture, interaction standards and code quality.</li>
            <li>Serves as <b>SME for charting and data visualization</b> (Highcharts), owning the presentation layer for data-heavy operational dashboards: the screens customers run their business from.</li>
            <li>Builds reusable component libraries against a shared design system, applying WCAG accessibility, responsive layouts and cross-browser compatibility while building rather than as a later pass.</li>
            <li>Helped plan and drive a <b>Vue 2 to Vue 3 migration</b> across 60+ engineers, alongside a monorepo-to-microservices move, writing shared components and repeatable patterns for other teams, teaching Vue 3 and simplifying the process to shorten the learning curve. Finished in about a year, with no disruption to customers.</li>
            <li>Advocates surrounding AI-written code with tests that check for explicit behavior, written against behavior a developer has already verified.</li>
            <li>Partners with product owners, designers and leadership to scope ambiguous requests into deliverable work; mentors junior and mid-level engineers through pairing and review.</li>
          </RoleEntry>

          <RoleEntry title="Software Engineer" where="QsrSoft · Lombard, IL (remote)" period="Jan 2022 – Nov 2023">
            <li>Built customized UI components and interactive dashboards, integrating REST APIs to surface operational metrics customers make live decisions from.</li>
            <li>Developed reporting surfaces that gave restaurant owners the specific answer they were after rather than a generic export.</li>
            <li>Collaborated with product owners, UX designers and leadership through design reviews and rapid iteration on interface concepts.</li>
            <li>Led brainstorming sessions with engineering teams to drive new ideas and reduce technical debt.</li>
          </RoleEntry>

          <RoleEntry title="Jr Software Developer" where="Dogtopia · Phoenix, AZ" period="Jun 2021 – Jan 2022">
            <li>Built enterprise React.js applications and managed enterprise microservices on Node.js, Azure, MySQL and MongoDB, contributing to <b>over $100M in revenue</b>.</li>
            <li>Achieved a <b>60% average decrease in load times</b> through code splitting, lazy loading and efficient state management.</li>
            <li>Designed reusable React component patterns integrated with design systems, improving development efficiency by <b>25%</b>.</li>
            <li>Implemented Google Cloud functions that improved customer retention and reduced bounce rate and run time.</li>
            <li>Ran system audits and feature-feasibility discussions with third-party vendors, franchisees and stakeholders.</li>
          </RoleEntry>

          <RoleEntry title="Assistant Manager" where="Jimmy John's · Orem, UT" period="2015 – 2020">
            <li>Ran the location with full operational authority whenever the general manager was away: roughly <b>25 direct reports</b>, 2 to 20 staff on shift.</li>
            <li>Owned the full people lifecycle: hiring, termination, training, scheduling and day-to-day performance management, plus inventory and ordering.</li>
            <li>Stepped back from the manager role in 2020 to retrain as a software engineer through Lambda School, and moved into engineering full-time in 2021.</li>
          </RoleEntry>
        </div>
      </div>
    </section>

    <section class="cvsect">
      <div class="shell cvsect__grid">
        <p class="label">Independent<br>projects</p>
        <div>
          <RoleEntry title="BuffrHQ: live on the App Store" where="" period="Mar 2026 – present">
            <template #where>
              Solo · Buffr LLC · <RouterLink class="lnk" to="/work/buffrhq">read the case study →</RouterLink>
            </template>
            <li>Commercial CRM for mobile auto detailers: a React Native app, a Vue 3 owner dashboard, public booking sites and a Node/Postgres backend. Designed, built and shipped alone in under three months.</li>
            <li>Camera-based plate recognition, route optimization with Mapbox, a QR pay page for Cash App, Venmo, PayPal and Zelle (no card processing, by design), barcode inventory, and multi-tenant scoped permissions over customer financial data.</li>
            <li>Anthropic API integration that ingests a business's advertising flyer and generates a claimable booking page carrying their real prices and services.</li>
          </RoleEntry>

          <RoleEntry title="Airport HQ: FBO operations prototype" where="" period="Aug 2026">
            <template #where>
              Prototype for a small FBO (anonymized) ·
              <RouterLink class="lnk" to="/work/airport-hq">read the case study →</RouterLink>
            </template>
            <li>Turned a one-workbook-per-month Google Sheets process into a working prototype in a couple of days. Each sheet became its own report with data entry, laid out the way staff already track it, plus filters and comparison across months.</li>
            <li>Anthropic API natural-language questions over the operator's own numbers, with the known gaps in their records written into the prompt so the model never reasons from books it doesn't know are incomplete.</li>
            <li>In-place editing of the public site: fuel prices, wording, and which third-party detailers and mechanics are listed. Demoed to the owner and his successor; not adopted yet.</li>
          </RoleEntry>
        </div>
      </div>
    </section>

    <section class="cvsect">
      <div class="shell cvsect__grid">
        <p class="label">What I work in</p>
        <div>
          <dl class="kit">
            <div>
              <dt class="label">Languages &amp; UI</dt>
              <dd>Expert <b>ES6+ JavaScript</b>, <b>Vue&nbsp;3</b> (Composition API, Pinia, Vue&nbsp;Router), <b>React</b>, React&nbsp;Native, semantic HTML5, CSS3, SASS/SCSS, Tailwind, TypeScript (learning)</dd>
            </div>
            <div>
              <dt class="label">Data &amp; services</dt>
              <dd>REST and <b>GraphQL</b> at production scale, Node.js, enterprise microservices, MySQL, MongoDB, Postgres</dd>
            </div>
            <div>
              <dt class="label">Visualization</dt>
              <dd><b>Highcharts</b> for data-dense operational dashboards, <b>Mapbox</b> across mobile and web surfaces</dd>
            </div>
            <div>
              <dt class="label">Cloud</dt>
              <dd>AWS Lambda, Amazon EKS, Google Cloud Platform and Cloud Functions, Azure</dd>
            </div>
            <div>
              <dt class="label">AI in products &amp; practice</dt>
              <dd><b>Anthropic API</b> shipped in two products, <b>Claude Code</b> daily, agentic workflow design with human gates, GitHub Copilot</dd>
            </div>
            <div>
              <dt class="label">Craft</dt>
              <dd><b>WCAG accessibility</b> and responsive design applied while building rather than audited after, design systems, performance optimization, Figma partnership through to production code</dd>
            </div>
            <div>
              <dt class="label">Shipping practice</dt>
              <dd>Jest, Vitest, API mocking, unit and integration testing, code review and Git-based branching, npm, CI/CD, Agile/Scrum, mentoring</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>

    <section class="cvsect">
      <div class="shell cvsect__grid">
        <p class="label">Education &amp;<br>certifications</p>
        <div>
          <RoleEntry title="Full Stack Web Development" where="Lambda School (now BloomTech)" period="Dec 2019 – Apr 2021">
            <li>Intensive full-stack program covering JavaScript, React, Node.js, relational databases and full-stack application development.</li>
            <li>Certifications: Full-Stack Web Development · Technical Interviewing.</li>
          </RoleEntry>
        </div>
      </div>
    </section>
  </article>

  <div class="no-print">
    <StudyPager
      :prev="{ eyebrow: 'Back to', title: 'Selected work', to: '/#work' }"
      :next="{ eyebrow: 'How this site is built', title: 'Colophon →', to: '/colophon' }"
    />
  </div>
</template>

<style scoped>
.cv { padding-block: clamp(2.5rem, 6vw, 4rem) 0; }
.cv :deep(.shell) { max-width: 62rem; }

.cv__head { display: grid; gap: 1.5rem; }
@media (min-width: 50rem) {
  .cv__head { grid-template-columns: minmax(0, 1fr) auto; align-items: end; }
}
.cv__head h1 {
  font-family: var(--display);
  font-size: clamp(2.5rem, 6.4vw, 4rem);
  font-variation-settings: 'wght' 780, 'wdth' 80;
  line-height: 0.94;
  letter-spacing: 0;
  margin-top: 0.7rem;
}
.cv__role {
  margin-top: 0.85rem;
  font-family: var(--prose);
  font-variation-settings: 'opsz' 20;
  font-size: clamp(1.0625rem, 1.8vw, 1.1875rem);
  line-height: 1.55;
  color: var(--ink-2);
  max-width: 42ch;
}
.cv__contact { display: flex; flex-wrap: wrap; gap: 0.4rem 1.2rem; }
.cv__contact a { font-size: 0.875rem; }
.cv__where { margin-top: 0.6rem; }
.cv__print { margin-top: 1.1rem; }
.cv__summary { max-width: 44rem; }
.cv__summary :deep(p) { font-size: 1.0625rem; }

.cvsect { padding-block: clamp(2rem, 4vw, 2.75rem); border-top: 1px solid var(--rule); }
.cvsect__grid { display: grid; gap: 1.1rem 3rem; grid-template-columns: 1fr; }
@media (min-width: 58rem) {
  .cvsect__grid { grid-template-columns: 9rem minmax(0, 1fr); }
}

.kit {
  display: grid;
  gap: 1px;
  background: var(--rule);
  border: 1px solid var(--rule);
  border-radius: 3px;
  overflow: hidden;
  box-shadow: var(--bezel);
}
.kit > div {
  background: var(--paper);
  padding: 0.85rem 1rem;
  display: grid;
  gap: 0.3rem 1.5rem;
  grid-template-columns: 1fr;
}
@media (min-width: 46rem) {
  .kit > div { grid-template-columns: 9rem minmax(0, 1fr); align-items: baseline; }
}
.kit dd { font-size: 0.875rem; line-height: 1.55; color: var(--ink-2); }
.kit dd b { color: var(--ink); font-weight: 600; }

@media print {
  .cv { padding-block: 0; }
  .cvsect { padding-block: 0.85rem; border-color: #bbb; }
  .cvsect__grid { grid-template-columns: 8rem 1fr; gap: 0 1.5rem; }
  .cv__head { grid-template-columns: 1fr auto; gap: 1rem; }
  .cv__head h1 { font-size: 2.4rem; }
  .cv__role { font-size: 0.9rem; max-width: 34ch; color: #222; }
  .cv__summary :deep(p) { font-size: 0.95rem; line-height: 1.5; }
  .kit { box-shadow: none; }
  .kit > div { background: #fff; padding: 0.5rem 0.7rem; }
  .kit dd { font-size: 0.82rem; color: #222; }
}
</style>
