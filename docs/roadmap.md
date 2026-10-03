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
- Database foundations for enrolments, teacher assignments, and fixed teacher
  slots, including role validation, hierarchy protection, and teacher update
  boundaries. Admin management interfaces for those records do not exist yet.
- Draft/published/archived course status in the database. Publishing workflow
  and student course delivery do not exist yet.

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

## Active milestone

### Secure user directory, cohort enrolment, and teacher assignment foundation

Status: **Next — not started**

Deliver one secure vertical admin milestone that:

- adds the minimum new migration needed for an administrator-safe user
  directory, without editing existing migrations;
- exposes only the identity fields administrators genuinely need and never
  exposes secrets or trusts editable Auth metadata for authorization;
- lets admins find existing users and see their server-controlled profile role
  and organisation context;
- lets admins enrol student profiles into a selected cohort;
- lets admins assign teacher profiles to a selected cohort;
- rejects role mismatches, duplicate memberships, invalid hierarchy IDs, and
  unauthorized requests with helpful messages;
- provides clear cohort membership lists without adding student or teacher
  workspaces;
- rechecks identity, admin role, and course/cohort/user relationships in every
  server action;
- preserves the existing database role-validation triggers and RLS rather than
  bypassing them;
- includes responsive, keyboard-accessible admin interfaces and appropriate
  empty, success, and error states;
- documents any manual Supabase migration step and does not apply it remotely
  without explicit approval.

Completion requires lint, production build, whitespace checks, relevant
desktop/mobile browser checks, authorization checks, roadmap update, and a local
conventional commit.

## Remaining MVP milestones

### 1. Student learning interface

- [ ] Show only published courses available through the student's enrolments.
- [ ] Provide cohort-aware course, module, lesson, and supported block views.
- [ ] Keep locked core content read-only and protect private media access.
- [ ] Add accessible loading, empty, unavailable, and completion-ready states.

### 2. Progress tracking

- [ ] Add a new RLS-protected progress model scoped to the authenticated student
  and enrolled course hierarchy.
- [ ] Record lesson completion and expose course/module progress summaries.
- [ ] Define administrator visibility and prevent students from writing progress
  for another user or inaccessible lesson.

### 3. Teacher workspace and fixed teacher slots

- [ ] Build an assigned-cohort teacher workspace.
- [ ] Let admins create and assign fixed announcement, homework, and
  supplementary-resource slots.
- [ ] Let teachers edit only title/content inside their assigned slots.
- [ ] Confirm teachers cannot create, delete, move, retype, reassign, unlock, or
  otherwise alter core content or slot structure.

### 4. Assessments, submissions, and feedback

- [ ] Add administrator-owned assessment definitions and criteria.
- [ ] Add student-owned submissions and evidence with strict cohort/course
  access checks.
- [ ] Add teacher feedback and simple rubric marking for assigned cohorts.
- [ ] Provide students with secure feedback and result views.

### 5. Course publishing

- [ ] Add admin-only publishing controls and readiness validation.
- [ ] Define how draft, published, and archived states affect each role.
- [ ] Prevent incomplete or inaccessible course structures from being published.
- [ ] Verify enrolled-student and assigned-teacher read paths end to end.

### 6. Production testing and deployment

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

Codex should read `AGENTS.md` and this roadmap, then implement the next
incomplete milestone as one secure vertical slice. It should run all required
automated checks, perform relevant desktop/mobile and authorization checks, fix
discovered problems, update this roadmap with the verified result and next
active milestone, and commit the completed milestone locally with a clear
conventional commit. It must not push without explicit user approval.
