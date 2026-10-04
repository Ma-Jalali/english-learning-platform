# Product Roadmap

This is the live implementation roadmap for the English Learning Platform.
`README.md`, `docs/backlog.md`, and `docs/decisions.md` preserve useful early
planning context, but this file and git history are authoritative for current
delivery status.

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

Codex should read `AGENTS.md` and this roadmap. Phase 0B is complete. Do not infer
or begin a production implementation or mock-test extension; await a separately
authorised next milestone. Do not resume Progress Tracking automatically. For an authorised milestone, run all required
automated checks, perform relevant desktop/mobile and authorization checks, fix
discovered problems, update this roadmap with the verified result and next
active milestone, and commit the completed milestone locally with a clear
conventional commit. It must not push without explicit user approval.
