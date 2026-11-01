# Phase 0C — Mock-test catalogue and future-commerce foundation

**Status:** Architecture approved in principle, with seven product defaults
selected and policy baselines P1–P5 approved, as recorded on 1 November 2026 in [the decision register](decisions.md#phase-0c-mock-tests--architecture-and-product-policy). This is not implemented, and no implementation stage is authorised;
each needs separate explicit approval. The open items in section 9 remain
unresolved. The Phase 0C visual laboratory, built in the approved Porcelain
Atlas V3 direction, was visually approved on 10 October 2026. No production
code, migration, Supabase configuration, payment connection, or live catalogue
is included in Phase 0C.

## 1. Product boundary

The mock-test product is independent of course enrolment. A student can own a
test directly, while a future administrator may also grant access from a course,
cohort, support action, or fulfilled order. IELTS is the first pilot, but all
content is governed by a dated examination profile so TOEFL iBT, PTE Academic,
CELPIP, and Cambridge English can use the same delivery capabilities without
pretending their formats are interchangeable.

The launch catalogue is free. User-facing acquisition language is **Get free
access**. Prices, discounts, tax, checkout, bank details, ABNs, payment providers,
and currency conversion remain inactive. The future paid-state specimen in the
design lab illustrates information hierarchy only.

## 2. Architectural principles

1. **Identity is not content.** A test retains a durable identity while immutable
   published versions preserve the exact content used by attempts.
2. **Profiles describe formats.** Dated examination profiles select reusable
   capabilities, timings, navigation, response constraints, and scoring policies.
3. **Offers are not ownership.** Catalogue offers can change without changing an
   entitlement, attempt, response, or result.
4. **Ownership is not an attempt.** Resetting or invalidating an attempt never
   silently removes the student's entitlement.
5. **The server is authoritative.** Clients cannot grant access, select a price,
   set role or ownership, alter a version, score responses, or release feedback.
6. **Publication is a one-way boundary.** Once published, a version cannot be
   edited. A correction always creates a new immutable version linked to the
   version it supersedes; a published version is never revised in place.
7. **Answers stay protected.** Answer keys, hidden scoring data, and unreleased
   explanations are not sent to the browser before the configured release point.

## 3. Proposed data model

This is a precise implementation plan, not a migration. Names may be refined in
the database milestone, but the boundaries should remain.

```text
exam_families ──< examination_profiles ──< examination_profile_sources
      │                    │
      └──< mock_test_series ──< mock_tests ──< mock_test_versions
                                                │
                                                ├──< test_sections ──< test_parts
                                                │        │
                                                │        └──< question_groups
                                                │                  └──< questions
                                                ├──< stimuli ──< stimulus_assets
                                                └──< version_media_assets

catalogue_offers ──< offer_prices
      │
      ├──< bundle_allocation_rules
      └──< curated_bundle_items                 (future optional model)

future_orders ──< future_order_lines ──< future_payment_events
      │
      └── fulfilment_operations ──< bundle_allocations ──< bundle_allocation_items
                                      │
students ──< mock_test_entitlements <─┘
      │              ├──< entitlement_events
      │              └──< attempt_allowance_events
      │
      └──< mock_test_attempts ──< attempt_responses
                     │                 └──< response_revisions
                     ├──< attempt_events
                     ├──< score_runs ──< score_components
                     ├──< manual_review_assignments ──< manual_reviews
                     └──< feedback_releases
```

### Catalogue and versioning

| Table | Purpose and essential constraints |
|---|---|
| `exam_families` | Stable family key (`ielts`, `toefl_ibt`, `pte_academic`, `celpip`, `cambridge`) and display metadata. Admin-managed. |
| `examination_profiles` | Family, provider profile name, effective dates, version, lifecycle state, timed/navigation/feedback capability document. Unique family + version. Published rows immutable. |
| `examination_profile_sources` | Exact official source title, provider, canonical URL, accessed date, applicable date, uncertainty note, and source checksum/record timestamp. |
| `mock_test_series` | Business-owned series and catalogue grouping, independent of a course. |
| `mock_tests` | Durable test identity, family, series, public number/title, availability status, accessibility/technical summary. No questions or scores. The IELTS Academic pilot has exactly ten public identities, numbered 1–10. |
| `mock_test_versions` | Test identity, profile, version number, content status, publication and retirement timestamps, predecessor/correction link, manifest checksum. Unique test + version. Publication freezes the manifest. |
| `test_sections` / `test_parts` | Ordered structure, timings, navigation rules, break rules, and manual-review capability. |
| `stimuli` / `stimulus_assets` | Version-owned Reading, Listening, image, diagram, map, audio, video, and contextual material. Media references private asset records rather than public URLs. |
| `question_groups` / `questions` | Ordered capability type plus accessible prompt/layout metadata. The renderer uses capabilities, not provider-specific component names. |
| `app_private.answer_rules` | Accepted responses, normalisation, cardinality, word limits, mappings, and protected answer data. No browser grants. |
| `app_private.scoring_policies` | Versioned automatic rules and manual criteria references. No browser grants. |
| `app_private.feedback_content` | Explanations and rationales gated by release policy. Read only through an authorised server path after release. |

Question capability keys include single choice, multiple response, T/F/NG,
Y/N/NG, four matching families, sentence/summary/note/table/flow-chart
completion, map/diagram labelling, short answer, variable-option cloze, typed or
banked gap, dropdown/drag matching, reordering, Writing, recorded Speaking, and
provider-profile extensions. A profile composes these capabilities; it does not
fork the engine.

### Offers, future orders, and ownership

| Table | Purpose and essential constraints |
|---|---|
| `catalogue_offers` | One-test, automatically allocated bundle, complete-collection, or future curated-bundle offer; lifecycle; eligibility window; free/paid presentation state. No ownership status. |
| `offer_prices` | Future administrator-configured amount, minor-unit currency value, region, effective dates. Launch offers have no paid price. Toman display needs an approved storage convention before implementation. |
| `bundle_allocation_rules` | Required count of new tests (1, 3, 5) or complete-series policy; eligible family/series/publication policy; approved allocation policy; and configurable future discount relationship. Never permits a client-selected test list. |
| `bundle_allocations` / `bundle_allocation_items` | Server-created allocation result and unique tests selected from eligible, published, unowned inventory. Unique allocation + test and student + test entitlement constraints. Pending rows are not ownership. |
| `future_orders` / `future_order_lines` | Reserved boundary for a later approved commerce milestone. Never required for free administrative/course grants. |
| `future_payment_events` | Future provider event id, verification state, idempotency key, and raw-event reference. Server-only and append-only. Not created in the launch phase. |
| `mock_test_entitlements` | Student + test identity, source, status, granted/revoked timestamps. A partial unique constraint prevents more than one active entitlement per student/test. |
| `entitlement_events` | Append-only grant, bundle fulfilment, course/cohort grant, revoke, withdraw, and restore audit history with actor and reason. |
| `attempt_allowance_events` | Append-only default allowance, reset, additional attempt, consumption, and reversal ledger. Avoids a silently mutable counter. |

An entitlement points to the durable test, not a mutable offer. When an attempt
starts, the server resolves and locks an eligible published version. Retirement
may block new starts without erasing ownership or historical review.

### IELTS Academic pilot collection

The customer-facing collection contains exactly:

1. IELTS Academic Mock Test 1
2. IELTS Academic Mock Test 2
3. IELTS Academic Mock Test 3
4. IELTS Academic Mock Test 4
5. IELTS Academic Mock Test 5
6. IELTS Academic Mock Test 6
7. IELTS Academic Mock Test 7
8. IELTS Academic Mock Test 8
9. IELTS Academic Mock Test 9
10. IELTS Academic Mock Test 10

Internal version numbers, revisions, profile identifiers and checksums are never
part of customer-facing names. They remain administrator metadata required for
reproducibility.

### Attempts, scoring, and release

| Table | Purpose and essential constraints |
|---|---|
| `mock_test_attempts` | Student, entitlement, immutable test version, state, server start/deadline/submission timestamps, active section, allowance event, invalidation reason. One active attempt per applicable rule. |
| `attempt_responses` | Attempt + question, current response payload, server revision, save timestamp. Unique attempt + question. Payload is validated against the version capability. |
| `response_revisions` | Optional append-only audit snapshots for high-risk responses and final submission. |
| `attempt_events` | Append-only lifecycle, time warning, disconnect/resume, autosave conflict, submit, timeout, reset, and invalidation events. |
| `score_runs` / `score_components` | Idempotent scoring run and component results tied to version/rule identifiers. Never client-authored. |
| `manual_review_assignments` | Response/section assignment to a qualified, authorised reviewer, status, due metadata. Assignment controls visibility. Reviewers hold existing server-controlled roles; there is no `examiner` database role. |
| `manual_reviews` | Criterion decisions, feedback, reviewer, revision and completion timestamps. Append/revision model, not destructive overwrite. |
| `feedback_releases` | Explicit release event and scope. Results views depend on this record rather than a client-controlled attempt flag. |

Personal highlights and notes are isolated attempt annotations. They do not enter
responses, scoring, completion, or feedback. Exam mode permits genuine range
highlighting and anchored notes; practice-only underline is never available in
Exam mode. Reading and Listening remain separate delivery contexts.

## 4. Atomic system allocation and fulfilment

```text
Choose offer → authenticate student and load server-owned offer rule
             → lock or safely evaluate current entitlements and idempotency key
             → calculate eligible published tests not already owned
             → confirm enough new tests exist for the promise
             → select the required number using the approved server policy
             → record the allocation and grant all entitlements atomically
             → append entitlement events and mark fulfilment complete
             → return only the newly granted tests
```

- Students choose the number of tests, never individual test identities. The
  client sends an offer identifier, not a requested list of tests.
- A one-test offer grants one new unowned eligible test; three- and five-test
  offers grant exactly three or five new unowned eligible tests.
- The complete-collection offer grants every missing test in the ten-test IELTS
  Academic series. If a student owns two, it adds eight. Existing tests are not
  granted or charged again.
- The selected policy (D1) assigns the lowest-numbered eligible tests the
  student does not already own. It is explicit, auditable and owned by the
  server.
- Database uniqueness is the final duplicate defence. `ON CONFLICT DO NOTHING`
  must not conceal a short bundle: inserted count must match the promised count,
  or the transaction rolls back.
- The operation is idempotent. A repeated request with the same student and key
  returns the original completed result rather than issuing new entitlements.
- If fewer than three or five eligible tests remain, that fixed-size offer is
  unavailable. The customer is offered **Complete your collection** with the
  exact remaining count instead.
- Future payment confirmation may call the same fulfilment boundary only after a
  separately approved, authenticated, verified webhook process.
- During free launch, collection completion grants all remaining tests. Future
  pricing must account for already owned tests, but credit/proration is unresolved.

## 5. Attempt state model

```text
eligible
   │ start confirmation + allowance reservation + server time
   ▼
starting ──failure──> eligible
   │
   ▼
in_progress ──disconnect──> in_progress (server deadline continues)
   │     │
   │     ├──administrator invalidation──> invalidated
   │     ├──deadline──> timed_out ──policy submit──> submitted
   │     └──student submit────────────────────────> submitted
   ▼
submitted ──automatic-only──> scoring ──> results_ready
   │
   └──manual component──> awaiting_manual_review ──> results_ready
                                                  │
                                      release rule ▼
                                               released
```

### Selected defaults and approved policy baselines

The full wording, qualifications and open details are in [the decision register](decisions.md#phase-0c-mock-tests--architecture-and-product-policy). In summary, for
the IELTS Academic pilot:

- **D2** One scored attempt per entitlement; additional attempts only through an
  audited administrator grant.
- **D3** No ordinary pause in a timed test. Disconnecting does not stop the
  server deadline; reconnecting before it restores acknowledged responses and
  remaining time.
- **D4** Timeout submits the last server-acknowledged responses and leaves
  unanswered questions unanswered.
- **D5** Complete results are released only after all required marking.
- **D6** Assigned reviewers; review changes are audited revisions.
- **P1–P3** Server-applied accommodations and extra time; audited replacement
  attempts after verified platform failures; administrator-only resets that
  preserve earlier attempt history as separate audit events.

Timing, pause, timeout, release and marking defaults are not automatically
shared by other examination profiles; each must confirm or replace them before
publication. The approved accommodation records (P1) are not yet in the data
model in section 3 and must be designed in the database milestone.

Further proposed attempt rules, part of the architecture approved in principle
but not separately decided:

- Restart means using another allowance, never silently replacing a submitted
  attempt.
- Autosave uses a monotonic response revision and idempotency key. Stale writes
  receive a conflict instead of overwriting a newer answer.
- Explanations and answers remain unavailable until the configured release.
- Abandoned is an operational observation, not a client-selected escape from a
  running deadline.

## 6. Permissions matrix

| Capability | Student | Assigned reviewer | Administrator | Unauthenticated |
|---|---|---|---|---|
| Read published catalogue metadata | Allowed | Allowed | Allowed | Public subset only |
| Grant/revoke entitlement | Own: no | No | Yes, audited | No |
| Read entitlement | Own only | No | Organisation/support scope only | No |
| Start/resume attempt | Own eligible entitlement only | No | Preview uses isolated non-scored context | No |
| Read/write response | Own active attempt only | Assigned review is read-only after submission | Audited support scope | No |
| Read protected answer/scoring rules | Never directly | Only released/manual criteria required for assignment | Authorised admin server path | No |
| Score automatically | No | No | Server process only | No |
| Review Writing/Speaking | No | Assigned responses only | Assign/reassign/audit | No |
| Release results | No | Only if a future explicit permission permits | Yes | No |
| Author/version/publish test | No | No by default | Yes | No |
| Manage offers | No | No | Yes | No |
| Read private media | Short-lived access for entitled active context | Short-lived access for assignment | Authorised admin preview | No |

An assigned reviewer is a qualified user with an existing server-controlled role
and an explicit assignment (P4); this design adds no `examiner` database role.
How qualification is recorded remains open.

Every future exposed table requires RLS. Policies use server-controlled profile
roles and full hierarchy/assignment checks. Security-definer helpers belong in
`app_private`, pin an empty `search_path`, schema-qualify objects, and receive
only narrow execution grants. No service-role key enters browser code.

## 7. Administration foundation

The future workspace should let administrators create series and tests, attach
dated profiles, compose sections/parts/stimuli/question groups, upload private
media, preview in an isolated student view, run validation, publish immutable
versions, retire availability, configure free/single/automatically allocated offers, set
eligibility and attempt allowances, grant/revoke access with a reason, inspect
entitlement history, assign manual reviews, release results, and audit changes.

Validation blocks publication when timings, accessible names, alternative text,
transcripts/captions, response constraints, answer rules, scoring coverage,
manual criteria, media access, or release policy are incomplete. Teachers cannot
edit business-owned test content unless a later administrator-controlled author
permission is explicitly designed and approved.

## 8. Official examination-profile source register

Accessed **4 October 2026**. Only official provider sources were used. These
sources establish format capabilities; Phase 0C contains no copied exam items.

| Exact source title | Provider | Canonical URL | Applicable profile date | Recorded structure and uncertainty |
|---|---|---|---|---|
| IELTS Academic: Listening test format | IELTS | <https://ielts.org/take-a-test/test-types/ielts-academic-test/ielts-academic-format-listening> | Current page; pair with July 2026 delivery profile | Four parts, 40 questions, about 30 minutes; current question families. Provider may update delivery details. |
| IELTS Academic: Reading test format | IELTS | <https://ielts.org/take-a-test/test-types/ielts-academic-test/ielts-academic-format-reading> | Current page; pair with July 2026 delivery profile | Three sections, 40 questions, 60 minutes; current question families. Page retrieval was intermittently unavailable during this review, so implementation must re-verify before profile publication. |
| IELTS Academic: Writing test format | IELTS | <https://ielts.org/take-a-test/test-types/ielts-academic-test/ielts-academic-format-writing> | Current page; pair with July 2026 delivery profile | Two tasks in 60 minutes; manual criteria. |
| IELTS Academic: Speaking test format | IELTS | <https://ielts.org/take-a-test/test-types/ielts-academic-test/ielts-academic-format-speaking> | Current page; pair with July 2026 delivery profile | Three-part recorded face-to-face interview, 11–14 minutes. A platform mock must be labelled as simulation rather than official delivery. |
| Updates to IELTS test delivery | IELTS | <https://ielts.org/news-and-insights/updates-to-ielts-test-delivery> | Mid-2026 / local market rollout | Published 5 March 2026: IELTS moves away from paper delivery, with selected-market Writing on Paper; skills and construct remain. Exact local availability varies. |
| TOEFL iBT Test Content - A Breakdown of Test Sections | ETS | <https://www.ets.org/toefl/test-takers/ibt/about/content.html> | 21 January 2026 | Updated adaptive structure and current Reading, Listening, Writing, Speaking task families. Item counts/timing may vary. |
| The Updated TOEFL iBT Test Structure | ETS | <https://www.ets.org/pdfs/toefl/toefl-ibt-test-at-a-glance.pdf> | 21 January 2026 | Official overview of updated task sequence and approximate duration; adaptive counts can vary. |
| PTE Academic & UKVI test format: Speaking & Writing | Pearson PTE | <https://www.pearsonpte.com/pte-academic/test-format/speaking-writing/> | Current post-7 August 2025 profile | Nine scored task families plus personal introduction. Automated/human review details may change with score-guide revisions. |
| PTE Academic & UKVI test format: Reading | Pearson PTE | <https://www.pearsonpte.com/pte-academic/test-format/reading/> | Current post-7 August 2025 profile | Five current Reading task families. |
| PTE Academic & UKVI test format: Listening | Pearson PTE | <https://www.pearsonpte.com/pte-academic/test-format/listening/> | Current post-7 August 2025 profile | Eight current Listening task families. |
| 2025 PTE Academic test updates | Pearson PTE | <https://www.pearsonpte.com/pte-updates-2025/> | 7 August 2025 | Records added task types and scoring changes; re-check before publishing a version. |
| Test Format & Scoring | CELPIP | <https://www.celpip.ca/test-format-scoring/> | Current page; no separate effective date stated | Listening 6 parts, Reading 4, Writing 2 tasks, Speaking 8. Timings are ranges and should remain profile data. |
| B2 First for Schools and B2 First exam format | Cambridge English | <https://www.cambridgeenglish.org/exams-and-tests/qualifications/first/format/> | Current page; no separate effective date stated | Four components, seven Reading/Use parts, two Writing, four Listening, four Speaking. Other Cambridge qualifications need their own profiles. |

The Cambridge prototype label means a future examination family, not a claim
that every Cambridge qualification shares the B2 First structure.

### Preparation-product language review

Accessed **4 October 2026**. These official pages were reviewed to favour short,
familiar learner language. Phase 0C does not copy their promotional copy.

| Exact source title | Provider | Canonical URL | Language signal used |
|---|---|---|---|
| IELTS sample test questions | IELTS | <https://ielts.org/take-a-test/preparation-resources/sample-test-questions> | “Sample test questions,” practice and resources support direct **Mock Tests** and **Practice** labels. |
| IELTS Preparation resources | IELTS | <https://ielts.org/take-a-test/preparation-resources> | “Practice tests” and “Get ready” support plain preparation and start language. |
| TOEFL TestReady | ETS | <https://www.ets.org/content/ets-org/language-master/in/home/preparation-toefl/testready.html> | “Free Practice Test,” “Mock Tests,” “Get Started,” scores and feedback are familiar learner terms. |
| Practice for a Test | ETS | <https://www.ets.org/practice.html> | “Get ready for test day” and “Practice Now” support direct action wording. |
| B2 First preparation | Cambridge English | <https://www.cambridgeenglish.org/exams-and-tests/qualifications/first/preparation/> | “Sample tests,” learner resources and “Get ready” support plain exam-preparation labels. |
| Exam preparation FAQs | Cambridge English | <https://www.cambridgeenglish.org/learning-english/exam-preparation/faqs/> | Direct learner-oriented preparation wording supports **Before you begin** and **Results** over internal workflow names. |

## 9. Approval decisions and open items

Status as of 1 November 2026; see [the decision register](decisions.md#phase-0c-mock-tests--architecture-and-product-policy).

1. International catalogue currency: USD or AUD. Toman presentation and stored
   unit convention also need accounting/legal review; no conversion is assumed.
   **Unresolved (U7); payments deferred.**
2. Payment provider, merchant location, banking, ABN/business structure, tax,
   invoices, refund law, receipts, chargebacks, and webhook retention.
   **Unresolved (U7); payments deferred.**
3. Attempt allowance. **Selected (D2):** one scored attempt per entitlement,
   with audited administrator-granted additional attempts; resets follow P3.
   *Open:* additional-attempt limits, institution overrides, and whether
   ownership can expire.
4. Timing and failure. **Selected (D3, D4)** and **approved baseline (P2):** no
   ordinary pause; timeout submits last acknowledged responses; audited
   replacement attempts after verified platform failures. *Open:* reconnection
   grace, failure evidence and verification, whether a replacement consumes an
   allowance, and support invalidation policy.
5. Results release. **Selected (D5):** complete results only after all required
   marking; no partial component scores. *Open:* release trigger for
   automatic-only attempts and per-profile confirmation outside IELTS.
6. Manual marking. **Selected (D6)** and **approved baseline (P4):** qualified
   assigned reviewers, audited revisions, second review for appeals, disputed
   marks and selected quality-control cases; no `examiner` database role.
   *Open:* qualification criteria and recording, quality-control selection,
   appeal process, disagreement resolution, turnaround targets.
7. Test withdrawal and correction behaviour for entitled but unstarted students.
   **Unresolved (U3).** Corrections themselves always create new immutable
   versions.
8. Course/cohort inclusion rules and whether these consume an attempt allowance.
   **Unresolved (U4).**
9. Privacy. **Approved baseline (P5):** privacy notices, recording
   acknowledgement, restricted access, and appropriate deletion or
   de-identification. *Open:* retention periods (the proposed 90-day and
   24-month periods are not approved), residency, and regional or institutional
   requirements.
10. Profile governance: named owner and cadence for re-verifying official
    sources. **Unresolved (U5).**
11. Future owned-test pricing credit or proration for completing a collection.
    **Unresolved (U6).**
12. Allocation policy. **Selected (D1):** lowest-numbered eligible unowned test,
    decided by the server. The browser never decides.
13. Explanation and answer-review policy after release. **Unresolved (U1).**
14. Approval of the official examination-profile source register in section 8.
    **Unresolved (U2).**

## 10. Implementation sequence after separate approval

1. **Architecture approval** — *recorded 1 November 2026:* the architecture is
   approved in principle and the product defaults are selected. Approval of the
   official profile register (U2) remains open. The Phase 0C visual direction
   was approved separately on 10 October 2026.

Every following stage needs its own explicit authorisation.

2. **Database foundation** — new migration for identities, immutable versions,
   offers, entitlements, audit ledgers, RLS, and transaction boundaries.
3. **Test engine** — profile/capability registry, protected content delivery,
   server time, autosave, annotations, responses, and submission lifecycle,
   validated first with the selected IELTS Academic Reading slice (D7: mixed
   selection and completion questions). The slice validates the engine; it is
   not a full mock test or a launch.
4. **Catalogue and access** — free offer acquisition, automatic server allocation,
   duplicate-safe atomic entitlement fulfilment, and My Mock Tests.
5. **Scoring and release** — protected automatic scoring, reproducible score runs,
   release policy, and student review.
6. **Manual marking** — assignment-scoped Writing/Speaking review, moderation,
   audit, and release.
7. **Future payments (blocked)** — only after business, legal, banking, currency,
   tax, provider, refund, and security decisions are approved.

Progress Tracking remains paused and is not erased or implicitly resumed by this
proposal.
