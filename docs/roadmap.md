# Product Roadmap

This is the live implementation roadmap for the English Learning Platform.
This file and git history are authoritative for current delivery status.
`README.md` is a current project summary that defers to this roadmap and to
`AGENTS.md`. `docs/decisions.md` records product decisions, marking superseded
entries alongside their current position, and `docs/backlog.md` preserves early
planning context.

## Product direction

- Specialised English-learning platform covering General English A1–C1, IELTS,
  TOEFL iBT, PTE, EAP, BEC, Cambridge exams, Young Learners, and future CELPIP.
- Current pilot: **IELTS Preparation (B2)**.
- Administrators own all core structure, content, branding, publishing, and
  permissions.
- Teachers will work only inside assigned, administrator-created teacher slots.
- Students will access only enrolled cohorts and will own only their learning
  evidence, submissions, projects, and portfolios.

## Current system state

The repository currently provides:

- Next.js 16 App Router with TypeScript, responsive shared styling, and a
  premium visual system across landing, authentication, dashboard, and admin
  interfaces.
- Supabase browser/server clients using the project URL and publishable key; no
  service-role key is used.
- Email/password sign-up, email confirmation, sign-in, sign-out, session refresh
  through the Next.js proxy, and protected routes using `getClaims()`.
- Profiles automatically created as students, with server-controlled
  `student`, `teacher`, and `admin` roles.
- RLS-protected organisations, courses, cohorts, modules, lessons, lesson
  blocks, enrolments, teacher assignments, and teacher slots.
- Admin interfaces to create organisations, draft courses, cohorts, modules,
  locked lessons, and locked core text blocks.
- Admin text-block editing, deletion, and ordered movement across the unified
  core-block list.
- Private Supabase Storage course media with a 200 MiB application bucket limit,
  strict course paths, direct authenticated PDF/video uploads, server-verified
  metadata, signed previews, deletion, and unified reordering.
- Allowlisted Google Drive PDF/video references without OAuth or Drive API
  credentials. Only canonical URLs reconstructed from validated file IDs are
  rendered.
- An administrator-only user directory and cohort membership workspace for
  enrolling existing students and assigning existing teachers, backed by
  server-controlled roles, hierarchy checks, database validation, and RLS.
- A protected student learning interface for enrolled, published courses with
  cohort-aware course, module, lesson, text-block, private-media, and
  allowlisted Google Drive views. Core content remains read-only and every
  nested route validates the complete hierarchy server-side.
- Fixed teacher-slot foundations, including role validation, hierarchy
  protection, and teacher update boundaries. The teacher workspace does not
  exist yet.
- Draft/published/archived course status in the database. Publishing workflow
  controls do not exist yet; student delivery respects the current status.

All committed migrations are treated as applied and immutable. Future database
changes require a new migration.

## Completed milestones

### Foundation and identity

- [x] Repository and Next.js foundation (`e623e09`, `1c9787b`).
- [x] Supabase browser-client foundation (`2837338`).
- [x] Secure profiles, roles, automatic student profile creation, and initial
  RLS (`f7085a4`).
- [x] Email/password authentication, confirmation, protected dashboard, server
  client, and session-refresh proxy (`b63a08a`).

### Secure course administration

- [x] Admin-controlled course hierarchy, membership tables, teacher slots,
  helper functions, triggers, and RLS (`524558e`).
- [x] Protected admin workspace and organisation creation (`55b8f95`).
- [x] Draft course creation (`94e3388`).
- [x] Module management (`cfa1e82`).
- [x] Locked lesson management (`753edc4`).
- [x] Locked text-block creation, editing, deletion, and reordering
  (`ebd685b`, `737a295`, `212ee24`).
- [x] Private course-media Storage security foundation (`247942c`).
- [x] Premium responsive interface redesign (`6ef7471`).
- [x] Private Supabase PDF/video blocks with preview, deletion, and unified
  ordering (`b109c10`).
- [x] Allowlisted Google Drive PDF/video blocks (`6796e89`).
- [x] Admin course cohort creation and ordered listing (`a763028`).
- [x] Secure administrator user directory, student enrolment, and teacher
  assignment foundation (completed 3 October 2026).
- [x] Secure student learning interface for enrolled published courses,
  read-only core lessons, and supported text and media blocks (completed 3
  October 2026).

The directory migration was applied manually to the current Supabase project.
The completed milestone was verified with real disposable student and teacher
accounts: administrator directory/filtering, enrolment, assignment, duplicate
option removal, unauthenticated redirects, student redirects from all new admin
routes, and desktop/mobile layouts all passed.

The student interface was verified with the enrolled disposable student while
the pilot course was temporarily published: course, module, lesson, ordered
plain-text content, the allowlisted Drive PDF preview, hierarchy rejection,
role redirects, and desktop/mobile layouts all passed. The pilot course was
restored to draft after testing, and the learner view again hides it.

## Active milestone

**Phase 0C is the active milestone.** Its visual laboratory is complete and
approved. Its architecture is approved in principle, seven product defaults are
selected, and policy baselines P1–P5 are approved; all were recorded on
1 November 2026 in [the decision register](decisions.md#phase-0c-mock-tests--architecture-and-product-policy).
These are documentation approvals only: no Phase 0C implementation stage is
authorised until the user explicitly selects and authorises one. **The next
activity is Phase 0C planning and review** (see [How to continue](#how-to-continue)),
not implementation. The Phase 0B and
Progress Tracking entries below are kept here for reference only: Phase 0B is
complete and Progress Tracking is paused. Neither is active.

### Phase 0C — Mock-test catalogue and future-commerce foundation

Status: **Active — architecture approved in principle; product defaults
selected; policy baselines P1–P5 approved (recorded 1 November 2026). Not implemented; no
implementation stage authorised.** The visual laboratory is complete and passed
the final integration audit on 10 October 2026.

Phase 0C is an isolated design-and-architecture milestone for a standalone
mock-test catalogue, student ownership/library, automatically allocated bundles,
secure attempts, scoring/release boundaries, manual review, and a future-ready
commerce boundary. IELTS is the first pilot; TOEFL iBT, PTE Academic, CELPIP,
and Cambridge English are represented through dated examination profiles rather
than separate incompatible engines.

The proposal and source register are recorded in
[the mock-test commerce foundation](mock-test-commerce-foundation.md). Responsive
non-production surfaces are preserved in the
[Phase 0C laboratory](../design/phase-0c/README.md). The launch model remains
free: no price, checkout, bank/tax workflow, payment SDK, currency conversion,
or transaction processing is active. Phase 0C does not modify production
application behaviour, Supabase, authentication, or migrations.

The proposed implementation sequence is below. Each stage needs its own
explicit authorisation; the policy approvals above do not authorise any of them.

1. mock-test database foundation, immutable versioning, RLS, and audit;
2. shared profile-driven test engine and secure attempt delivery, validated first
   with the selected IELTS Academic Reading slice (mixed selection and
   completion questions). The slice tests the engine; it does not widen this
   stage into a full mock test or a launch;
3. free access, server-assigned bundles, entitlements, and My Mock Tests;
4. protected scoring, result release, and review;
5. assignment-scoped Writing/Speaking manual marking;
6. future payment activation, **blocked** until business, legal, banking,
   international-currency (USD versus AUD), toman, tax, provider, refund, and
   webhook-security decisions are approved.

No implementation stage begins from this document alone.

#### Visual laboratory — complete (10 October 2026)

Porcelain Atlas V3 remains the approved master visual direction. The following
non-production prototypes in [the Phase 0C laboratory](../design/phase-0c/README.md)
are visually approved: Catalogue V3, Test Bundles, My Mock Tests, Test Details,
Before You Begin, Assessment, Waiting for feedback and Results. They passed a
final integration audit with no blocking defects. Decisions and verification are
recorded in the laboratory's five `*-v3-review.md` design records.

- **Fixtures:** the canonical student owns IELTS Academic Mock Tests 1 and 2 of 10
  (Test 1 ready to start, Test 2 in progress). A separately labelled internal
  review fixture (`my-mock-tests.html?state=review`, `bundle-builder.html?owned=4`)
  owns four tests to demonstrate the waiting-for-feedback and released-results
  states. Neither represents an account, entitlement or real student data.
- **Specimens:** Mock Test 1 starts at Listening, Part 1, Question 1 only. Mock
  Test 2 demonstrates answering, review and an illustrative submission dialog
  leading to the waiting view; released results open only through a labelled
  review-only route.
- **Transfer:** the approved laboratory was copied from the Claude design worktree
  into this worktree on 10 October 2026 and verified file by file with SHA-256
  hashes. Both Phase 0C validators, JavaScript syntax checks, CSS parsing,
  HTML/link/SVG checks, `npm run lint` and `git diff --check` pass.

Known limitations:

- No real screen-reader or physical-device testing has been performed.
- High contrast was tested through browser emulation only.
- Shared 11 px eyebrow and mobile-navigation text remains a known accessibility
  issue.
- Mock tests, timers, scoring, saving and results are illustrative. There is no
  attempt creation, autosave, server timer, scoring, result release or payment.
- One non-blocking ESLint warning remains in
  `design/phase-0c/assessment-preview.js`
  (`@next/next/no-location-assign-relative-destination`); the rule targets Next.js
  routes and does not apply to the static laboratory pages.

Visual completion does not authorise production implementation. The policy
decisions recorded on 1 November 2026 settle allocation, attempt allowance, pause,
timeout, release and review defaults for the IELTS Academic pilot, but their
operational details and the unresolved items U1–U8 in
[the decision register](decisions.md#still-unresolved) remain open. U1–U5 and U8
(including explanation policy and the examination-profile source register) are
active and stage-dependent; U6 and U7 are deferred with payments. Payments remain
deferred.

### Phase 0B — Chosen-direction surface prototypes

Status: **Complete — visually approved on 4 October 2026.**

Phase 0A is complete (4 October 2026): **Porcelain Atlas V3 is the visually
approved product direction**. V1 and V2 are preserved exploratory iterations.
Academic Instrument’s restraint remains the reference for serious assessment
and administration; selected Living Language Studio ideas may be used sparingly
for media-led and speaking/listening experiences.

The [Phase 0A laboratory](../design/phase-0a/README.md) and
[Phase 0B laboratory](../design/phase-0b/README.md) are isolated from production.
V3 and the approved surface prototypes are design foundations, not production-ready
application code.

Phase 0B created four non-production, responsive surface prototypes:

- public landing;
- student lesson;
- admin content workbench;
- assessment and detailed feedback experience.

The prototypes use the realistic IELTS pilot fixture and acceptance criteria in
the [approved design brief](visual-design-brief.md). The assessment surface also
includes genuine range-based personal annotations, distinct Learning and Exam
modes, anchored notes, detailed feedback states, and a separate lightweight
Listening interaction specimen. Browser-viewable source, shared tokens, original
vectors and change records are preserved under `design/phase-0b/`; raw audit
captures remain ignored.

Visual approval does not authorise production CSS redesign, component migration,
mock-test work or implementation. Product decisions unrelated to visual selection
remain unresolved. No production application, migration, Supabase configuration
or authentication files changed during Phase 0B.

### Progress tracking — paused

Status: **Paused at the user’s request during the design phase.** Resume only
when separately authorised; it is not the next active milestone.

Deliver the first secure learning-progress vertical slice that:

- adds a new RLS-protected progress model scoped to the authenticated student
  and enrolled course hierarchy;
- records lesson completion and exposes course/module progress summaries;
- defines administrator visibility while preventing students from writing
  progress for another user or inaccessible lesson;
- does not add teacher tools, assessment workflows, publishing controls, or
  payments yet.

## Remaining MVP milestones

### 1. Teacher workspace and fixed teacher slots

- [ ] Build an assigned-cohort teacher workspace.
- [ ] Let admins create and assign fixed announcement, homework, and
  supplementary-resource slots.
- [ ] Let teachers edit only title/content inside their assigned slots.
- [ ] Confirm teachers cannot create, delete, move, retype, reassign, unlock, or
  otherwise alter core content or slot structure.

### 2. Assessments, submissions, and feedback

- [ ] Add administrator-owned assessment definitions and criteria.
- [ ] Add student-owned submissions and evidence with strict cohort/course
  access checks.
- [ ] Add teacher feedback and simple rubric marking for assigned cohorts.
- [ ] Provide students with secure feedback and result views.

### 3. Course publishing

- [ ] Add admin-only publishing controls and readiness validation.
- [ ] Define how draft, published, and archived states affect each role.
- [ ] Prevent incomplete or inaccessible course structures from being published.
- [ ] Verify enrolled-student and assigned-teacher read paths end to end.

### 4. Production testing and deployment

- [ ] Add automated coverage for authorization helpers, server actions, URL
  allowlists, hierarchy validation, and critical user journeys.
- [ ] Complete accessibility, responsive-layout, browser, upload, and failure
  testing.
- [ ] Review production environment configuration, email redirects, Storage,
  logging, rate limits, backups, and recovery procedures.
- [ ] Deploy only after a security and data-privacy review using non-sensitive
  test data.

## Later commercial and expansion stages

These stages are outside the MVP unless the user explicitly promotes one into
the active roadmap.

### Payments — deferred

- [ ] **Deferred:** no bank account, ABN workflow, checkout, live payment
  provider, transaction handling, or financial integration during development.
- [ ] Reassess only when the platform, legal/business setup, and business
  accounts are ready.
- [ ] Plan AUD/USD options for international users and toman for Iranian users.
- [ ] Design entitlements, refunds, receipts, tax/compliance handling, and
  webhook security before choosing providers.

### Other later stages

- [ ] Localisation for interface, catalogue, communications, and regional
  operating requirements.
- [ ] Mature multi-organisation tenancy, delegated administration, branding,
  and tenant isolation.
- [ ] Academic, engagement, cohort, and operational reporting.
- [ ] Student projects and portfolio creation, curation, sharing, and export.
- [ ] Advanced block design tools for additional media, quiz, embed, layout, and
  authoring workflows while preserving locked-core governance.

## How to continue

Claude Code is the primary developer; ChatGPT manages planning and coordination,
and Codex is optional for independent verification or troubleshooting (see the AI
development workflow in `AGENTS.md`). The developer should read `AGENTS.md` and
this roadmap before every milestone. Phase 0B is complete. The Phase 0C
visual laboratory is complete, its architecture is approved in principle, and its
product defaults and policy baselines are recorded in
[the decision register](decisions.md).

**Next activity: Phase 0C planning and review.** This covers:

- reviewing the outstanding decisions: the active, stage-dependent items U1–U5
  and U8, and the open operational details of D1–D7 and P1–P5, identifying
  which implementation stage needs each one;
- preparing a scoped design proposal for Stage 1 (mock-test database
  foundation, immutable versioning, RLS and audit) for the user's review.

Planning and review produce documents for the user's decision only. A planning
document, a Stage 1 proposal, or the user's approval of either does not
authorise implementation. Do not infer or begin Phase 0C database, engine,
catalogue, scoring, marking, or payment implementation, and do not create or
apply migrations or change Supabase, until the user separately and explicitly
authorises a specific implementation stage. Do not resume Progress Tracking
automatically.

For an authorised milestone, run all required automated checks, perform
relevant desktop/mobile and authorization checks, fix discovered problems, and
update this roadmap with the verified result and next active milestone.

**Git approval.** Every commit operation and every push operation needs the
user's separate, explicit approval of that operation (see `AGENTS.md`).
Approval of a task, milestone, backup, planning document or implementation does
not authorise a commit or a push. When approved, use a clear conventional commit
message.
