# Product decisions

This file is the product decision register, from early decisions through the
Phase 0C policy review, Stage 1 planning decisions and Stage 1A design
decisions. `AGENTS.md` and
[`roadmap.md`](roadmap.md) are authoritative for current direction; where an
entry below was later superseded, the superseded wording is kept for history and
the current position is stated beside it.

## Curriculum governance

The school owns pre-designed courses. Administrator/academic-designer content is locked for teachers.

**Current rule (`AGENTS.md`):** administrators create, place, type, order,
assign and delete teacher slots. Assigned teachers may edit only the explicitly
permitted fields of the slots assigned to them; they cannot create, edit,
delete, move, rename, hide or unlock administrator core content, or change slot
structure.

*Superseded original wording:* "Teacher additions exist only in separate empty
slots and are visibly labelled as teacher additions. A teacher can modify or
delete only their own addition; they cannot alter the official lesson, name,
branding, quiz, assessment or navigation." The current rule replaces
teacher-created and teacher-deleted additions with administrator-created slots.

## First pilot

**Current pilot: IELTS Preparation (B2)**, as recorded in `AGENTS.md` and the
roadmap. The Phase 0C mock-test laboratory also uses IELTS Academic as its first
examination family.

*Superseded original decision:* a **B1 Preliminary Writing and Speaking
mini-course**, intended to test a normal lesson, original Cambridge-style
practice, writing feedback, speaking evidence, portfolio workflow and teacher
cohort delivery. No later decision records whether this mini-course will return
as a future course; that remains undecided.

## Free first, paid later

The design/pilot release is free. Payments are deferred until the platform and
business accounts are ready; no payment work is authorised.

Planned future currencies (`AGENTS.md`):

- AUD/USD for international learners.
- Iranian toman for Iranian learners.

*Superseded original wording:* "USD and a compliant international payment
provider for international learners" and "Iranian toman and an eligible Iranian
payment gateway for Iranian learners", as two separate routes.

Still unresolved (see the roadmap's Payments stage and
[`mock-test-commerce-foundation.md`](mock-test-commerce-foundation.md)):

- whether international pricing uses USD, AUD, or both;
- toman presentation and stored-unit convention;
- payment providers or gateways, including whether international and Iranian
  payments use separate routes;
- banking, business structure, tax, refunds, receipts, and webhook security.

## Phase 0C mock tests — architecture and product policy

Recorded on 1 November 2026 from the user's Phase 0C architecture and
product-policy review. The design detail lives in
[`mock-test-commerce-foundation.md`](mock-test-commerce-foundation.md).

**Approval boundary.** These are documentation and policy approvals only.
Nothing in this section is implemented, and nothing here authorises a migration,
Supabase change, engine, catalogue, scoring, marking, or payment work. Each
implementation stage needs its own explicit authorisation under `AGENTS.md`.

### Architecture — approved in principle

1. **Separated data domains.** Test identity and content, catalogue offers,
   ownership (entitlements), attempts and responses, scoring, and result release
   are separate domains. A change in one never silently changes another.
2. **Immutable published test versions.** Publication freezes a version. A
   correction to published content always creates a new immutable version linked
   to the one it supersedes; a published version is never edited in place.
3. **RLS and server authorisation.** Every exposed table uses Row Level Security,
   and the server rechecks identity, role, ownership and hierarchy. Clients never
   grant access, choose tests, score, or release results.
4. **Atomic, idempotent bundle allocation.** A bundle grants exactly its promised
   number of new tests in one transaction or nothing; a repeated request returns
   the original result.
5. **Independent scoring and result release.** Scoring runs and release events
   are separate server records; results become visible only through an explicit
   release event. A release event may be automatic (server-generated) or
   administrator-triggered, but only under an explicitly approved release
   policy; without one, nothing is released. Whether automatic-only
   assessments release results immediately remains unresolved (see D5).
6. **Audit history.** Grants, allocations, attempt events, allowance changes,
   resets, reviews and releases are recorded in append-only histories with actor
   and reason.

### Product defaults — selected

These defaults were selected for the IELTS Academic pilot. Defaults that depend
on an examination format (timing, pause, timeout, release and marking) are not
automatically shared by other examination profiles; each profile must confirm or
replace them, with its own source review, before publication.

| # | Selected default | Still open |
|---|---|---|
| D1 | **Allocation:** the server assigns the lowest-numbered eligible test the student does not already own. Students never choose test numbers. | How withdrawn or corrected tests affect eligibility (see unresolved item U3). |
| D2 | **Attempts:** one scored attempt per entitlement. Additional attempts are granted only by an audited administrator action. | Limits on additional attempts, unscored practice attempts, expiry of ownership, and institution overrides. |
| D3 | **No ordinary pause in timed tests.** A disconnect does not stop the server deadline; reconnecting before the deadline restores acknowledged responses and the remaining time. Exceptions arise only through P1 or P2. | Reconnection grace details. |
| D4 | **Timeout:** at the deadline, the last server-acknowledged responses are submitted. Unacknowledged local changes are not submitted; unanswered questions stay unanswered. | Confirmation for each non-IELTS profile; how the rule is explained to students before they start. |
| D5 | **Result release:** complete results are released only after all required marking is finished. No partial component scores are shown before then. | Whether automatic-only attempts release immediately or through an administrator action; explanation and answer-review policy (U1); turnaround targets. |
| D6 | **Review:** Writing and Speaking are reviewed by assigned reviewers; review changes are kept as audited revisions, never overwritten. | Covered by P4's open details. |
| D7 | **Initial engine-validation slice:** IELTS Academic Reading with mixed selection and completion questions, used to validate the shared test engine. It is not a full mock test or a product launch. | Exact question capabilities, passage and question count, and timing; the IELTS Reading source must be re-verified before its profile is published. |

### Policy baselines P1–P5 — approved

The baselines are approved; their operational details remain open and need
separate decisions before implementation depends on them.

| Policy | Approved baseline | Operational details still open |
|---|---|---|
| **P1 Accessibility accommodations** | Approved accommodations are honoured. Extra time is applied by the server, never by the client. Every exception is audited. | The accommodation catalogue, evidence and approval process, approver role, and handling of accommodation evidence under P5. |
| **P2 Technical-failure recovery** | Server-acknowledged responses are always preserved. A verified platform failure may lead to an audited replacement attempt. | Verification criteria and evidence, grace windows, whether a replacement consumes an allowance, and handling of student-side failures. |
| **P3 Resets** | Only an administrator can authorise a reset. Earlier attempt history is preserved, and the reset is recorded as a separate audit event. | Permitted reasons, limits, and student notification. |
| **P4 Manual marking** | Reviewers are qualified and assigned; assignment controls what they can see. A second review is used for appeals, disputed marks and selected quality-control cases. This does **not** introduce an `examiner` database role. | Qualification criteria and how qualification is recorded within the existing role model, quality-control selection, the appeal process and window, how reviewer disagreement is resolved, and turnaround targets. |
| **P5 Privacy** | Students receive privacy notices, acknowledge recording before Speaking is recorded, access to responses and recordings is restricted, and data is deleted or de-identified when appropriate. | Retention periods: the proposed 90-day and 24-month periods are **not approved**. Also data residency and regional or institutional requirements. |

### Still unresolved

These questions were not decided by this review. They are classified below by
when they need a decision; the identifiers and descriptions are unchanged.

**Active, stage-dependent.** Each must be decided before the implementation
stage that depends on it. Being active does not mean every item must be
resolved before initial implementation planning begins; planning may identify
which stage needs each one.

- **U1** Explanation and answer-review policy after release.
- **U2** Approval of the official examination-profile source register.
- **U3** Withdrawal and correction behaviour for owned, unstarted tests.
- **U4** Course and cohort inclusion, and whether it consumes attempt allowances.
- **U5** Profile governance: a named owner and re-verification cadence.
- **U8** How mock-test manual marking is sequenced against the roadmap's
  cohort-based assessment and feedback milestone.
- **B7** Privacy subject model: how student-linked mock-test records identify a
  student so that privacy and audit integrity are both protected on account
  deletion, without assuming retention periods or unrestricted cascading
  deletion. Added with the Stage 1 planning decisions; required before Stage 1B.

**Deferred.** Not needed until payments are reassessed under the roadmap's
deferred Payments stage.

- **U6** Future owned-test pricing credit or proration.
- **U7** All payment decisions (currency choice, toman convention, providers,
  banking, tax, refunds); payments remain deferred.

## Phase 0C Stage 1 planning decisions (B1–B6)

Recorded on 1 November 2026 from the user's Chat 01 review of the Stage 1
technical design proposal. They refine, and do not reopen, the architecture,
D1–D7 and P1–P5 above.

**Approval boundary.** B1–B6 are approved for planning only. Nothing here is
implemented, and nothing here authorises installing Docker or other tools,
initialising or linking Supabase, creating or applying a migration, or starting
any implementation stage. Each stage in the roadmap needs its own explicit
authorisation, and each commit and push needs separate approval.

| # | Approved for planning | Boundaries and open details |
|---|---|---|
| B1 | **Isolated database testing.** Migrations and RLS are tested on a local Supabase stack running in Docker, never against the existing Supabase project. | Installing Docker or the CLI tooling, `supabase init`, and any repository configuration it adds remain unauthorised until separately approved. |
| B2 | **Stage 1 split.** Stage 1A covers test content, examination profiles, immutable versions, protected answers and publication foundations. Stage 1B covers student subjects, entitlements, allowance ledgers, accommodations and their audit records. | Each needs separate implementation approval. Stage 1B also needs B7. |
| B3 | **Protected assessment data.** Answer rules and scoring policies live in a dedicated `assessment_private` schema. No client role has direct access to it, including client-facing administrators. | Server functions must independently verify authentication, the server-controlled role and authorisation, and expose only the minimum data required. |
| B4 | **Immutability.** Published test content, its protected answers and published examination profiles are immutable. A correction creates a new version; supersession and retirement are atomic; historical versions are preserved. | Applies to administrators as well as other roles. |
| B5 | **Administrator scope.** Existing authorised platform administrators keep platform-wide catalogue administration through named, server-controlled security helpers. | Institution-level administration is designed separately later. Future institution administrators must not automatically inherit platform-wide privileges. |
| B6 | **Capability registry.** An extensible, versioned capability registry, initially supporting single choice, multiple response, True/False/Not Given, typed completion and selection-based completion, for the approved D7 Reading validation slice. | Stage 1A holds the capability identifiers, schema versions and database integrity constraints; Stage 2 holds interactive rendering, response validation and delivery behaviour. This does not expand Stage 1A into engine implementation. Detailed response contracts (response schemas, normalisation, word limits and related constraints) are unresolved until the Stage 1A design review; none is invented or approved here. This records the initial capability set for D7's open "exact question capabilities" detail; D7's other open details are unchanged. *Partly refined by B6-1 to B6-8 and C1-A to C1-C (see [Stage 1A design decisions](#phase-0c-stage-1a-design-decisions-checkpoint-c1)): their principles are now approved at the stated levels, while exact SQL and JSON schemas and the B6-4 algorithms remain unapproved. Under C1-A, "response validation" in Stage 2 means validating student responses; Stage 1A validates authored content.* |

**Publication safeguard.** U2 (the examination-profile source register) and U5
(profile governance) must be resolved before any real examination profile is
published, including publication through the Stage 1C authoring workspace.

**Live-state safeguard.** The existing migrations were applied to the Supabase
project manually. Before any future remote migration operation, the live
migration state must be verified separately, with explicit approval.

B7 (the privacy subject model) is recorded as unresolved under
[Still unresolved](#still-unresolved) and is required before Stage 1B.

## Phase 0C Stage 1A design decisions (Checkpoint C1)

Recorded on 1 November 2026 from the user's Chat 01 review at Checkpoint C1.
They refine B6 and do not reopen B1–B5, D1–D7 or P1–P5.

**Approval boundary.** Each decision below is approved only at the level
stated, as design direction. Nothing here is implemented. Nothing here approves
exact SQL or JSON schemas; exact text-normalisation or word-counting
algorithms; student attempts, timers, autosave or delivery; scoring execution;
storage buckets, uploads or streaming; student entitlements or payments; any
actual draft deletion or destructive database operation; publication of real
examination-profile content; or Stage 1A implementation. Each implementation
stage, commit and push needs separate explicit approval.

### Capabilities and responses (B6-1 to B6-5)

**B6-1 — Approved in principle.** Five versioned capabilities:
`single_choice@1`, `multiple_response@1`, `true_false_not_given@1`,
`typed_completion@1` and `selection_completion@1`. The proposed canonical
response models, provider-neutral reuse, shared question groups, protected
answers and server-side validation of authored content are approved in
principle, under five conditions:

- capability identifiers and schema versions are stored separately;
- question groups and shared stimuli are reusable;
- correct answers remain protected in `assessment_private` (B3);
- publication requires server-side structural validation;
- future schema versions and examination-specific rules remain possible.

*Not approved:* exact SQL and JSON schemas.

**B6-2 — Approved.** Each question record holds one independently answerable,
numbered completion gap. Several gaps may share a question group, passage,
instructions or other stimulus. Gap mappings must be explicit, groups are
validated, and published references are immutable. This does not prohibit
future capabilities with different response structures.

**B6-3 — Approved.** Stable option UUIDs are the canonical identifiers for
selectable answers:

- published option identity is immutable;
- display order is separate from identity;
- option membership is validated on the server;
- historical references are preserved;
- correct-answer mappings are private;
- exact implementation details are deferred.

**B6-4 — Framework approved.** The original typed answer is preserved.
Comparison-normalisation and word-counting policies must be deterministic,
separately versioned and immutable after publication. Comparison is
conservative, and accepted alternatives are explicit. *Not approved:* exact
algorithms, provider-specific conventions, and final counting or scoring
behaviour. Real typed-completion content must not be published using
unapproved policies.

**B6-5 — Approved.** The initial multiple-response scoring-policy identifier is
`exact_set@1`:

- selected option UUIDs are compared as unordered sets;
- an exact match receives the configured full score; anything else receives
  zero;
- correct-answer sets and scoring definitions are protected;
- the policy must be compatible with the examination profile;
- future scoring policies are permitted only through separate approval.

Stage 1A defines scoring policies; it does not execute scoring.

### Media, lifecycle and availability (B6-6 to B6-8)

**B6-6 — Approved.** Stage 1A includes versioned media metadata: media
identities and content relationships; access classifications; accessibility
metadata and protected transcript references; provenance and usage rights; and
publication integrity with immutable asset references. Storage infrastructure,
uploads, signed URLs, streaming and student delivery remain deferred.

**B6-7 — Approved.** Unpublished drafts, and dependencies owned exclusively by
those drafts, may be deleted only through a controlled process. Referenced,
shared, published and historical content is protected. Consequential lifecycle
operations need an auditable reason, lifecycle history is protected and
append-only, and state transitions are atomic. *No actual deletion or
destructive database operation is authorised.*

**B6-8 — Approved.** Internal immutable publication is separate from catalogue
availability and student access:

- publication never exposes a test in the catalogue automatically;
- publication never grants student access or promotes a test automatically;
- availability changes are explicit, authorised and audited;
- protected answers remain private;
- synthetic internal validation fixtures remain restricted;
- U2 and U5 remain publication gates for real examination profiles.

### Checkpoint C1 clarifications (C1-A to C1-C)

**C1-A — Approved.** Stage 1A validates authored-content structures and
publication packages. Stage 2 validates actual student responses during
assessment delivery.

**C1-B — Approved.** Stage 1A defines the separate availability state and its
security and auditing foundations. Stage 3 implements student-facing catalogue
availability and access. Publication never automatically grants access.

**C1-C — Approved.** Stage 1A defines media metadata. Administrative media
uploads are provisionally assigned to Stage 1C or a later separately approved
milestone, and secure assessment-media delivery is provisionally assigned to
Stage 2. These provisional assignments are not implementation approvals.

### Publication gates (unchanged and added)

- U2 (official-source verification) and U5 (examination-profile governance)
  remain unresolved gates for publishing any real examination profile.
- Real typed-completion content must not be published under unapproved B6-4
  policies.
- Controlled synthetic internal fixtures remain distinct from real
  examination-profile publication and from student catalogue access.
