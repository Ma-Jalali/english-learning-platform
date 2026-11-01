# Phase 0C — Mock-test catalogue and future-commerce foundation

**Status:** visual laboratory complete and visually approved on 10 October 2026,
in the approved Porcelain Atlas V3 direction. The architecture in
[`../../docs/mock-test-commerce-foundation.md`](../../docs/mock-test-commerce-foundation.md)
is approved in principle, and its product defaults and policy baselines were
recorded in [`../../docs/decisions.md`](../../docs/decisions.md) on 1 November
2026. None of it is
implemented, and no implementation stage is authorised.

This is a non-production browser laboratory. It does not authenticate, persist,
score, grant access, publish, transact or connect to Supabase. Visual approval of
these prototypes does not authorise production implementation.

## Open the laboratory

From the repository root:

```sh
python3 -m http.server 4176 --directory design
```

- Customer homepage: <http://127.0.0.1:4176/phase-0c/catalogue-v3.html>
- Internal review directory: <http://127.0.0.1:4176/phase-0c/review-index.html>

The customer homepage is the primary experience. `review-index.html` is clearly
labelled as an internal directory and contains administrative, exceptional-state
and workflow-review links that must not appear as student product choices.

## Surfaces

- `catalogue-v3.html` — current customer homepage and visual authority.
- `index.html` — legacy homepage preserved only for internal visual comparison.
- `review-index.html` — internal design/product directory and exceptional states.
- `catalogue.html` — Catalogue V3 presentation of all ten IELTS Academic mock tests.
- `test-details.html` — **Test details** for an owned test: what it contains, its
  four skills and overall duration, with one primary action to **Before you begin**.
- `bundle-builder.html` — one, three, five and complete-collection offers using
  automatic assignment rather than student test-number selection.
- `my-mock-tests.html` — student library for the canonical fixture (Mock Tests 1
  and 2 owned). The four attempt statuses (Ready to start, In progress, Waiting for
  feedback, Results ready) are shown together only in the internal review fixture
  `?state=review`. Empty/loading/error/unavailable specimens are accessible only
  through the internal review directory.
- `pre-test-lobby.html` — **Before you begin**: three readiness confirmations, then
  **Start test**. On mobile the setup check comes before the overview.
- `attempt-results.html` — distinct task-focused layouts: Mock Test 1 starting at
  Listening Part 1, Question 1 (`?view=start`); Mock Test 2 in progress at Reading
  Question 18 with an illustrative Question 19, answer review and submission
  confirmation (default); waiting for feedback; and released results with one
  teacher-feedback specimen. `assessment-preview.js` drives these preview-only
  interactions.
- `admin-catalogue.html` — administrator-only **Manage mock tests** workspace.

`catalogue-v3.css`, `support-v3.css`, the page-local `bundles-v3.css` (Test
Bundles), `library-v3.css` (My Mock Tests) and `journey-v3.css` (Test details,
Before you begin and the starting view), `catalogue-v3.js`, `prototype.js`
and the earlier laboratory styles remain local to Phase 0C and are not imported by
production code.

## Design records

Each revised surface has a review record with its decisions, copy changes,
measurements and verification:

- [`bundles-v3-review.md`](bundles-v3-review.md) — Test Bundles hierarchy, offer
  cards, two-offer state and compact process.
- [`library-v3-review.md`](library-v3-review.md) — My Mock Tests fixture alignment,
  status hierarchy and cross-page navigation.
- [`journey-v3-review.md`](journey-v3-review.md) — Test details, Before you begin and
  the Mock Test 1 starting view.
- [`assessment-v3-review.md`](assessment-v3-review.md) — assessment interaction
  sequence, submission, waiting, results and journey icons.
- [`vectors-v3-review.md`](vectors-v3-review.md) — the approved vector system.

[`catalogue-v3-review.md`](catalogue-v3-review.md) records the earlier Catalogue
V3 approval and notes which of its statements later revisions superseded.

## Corrected access model

The student chooses an amount of preparation, never individual test numbers:

- **One mock test** grants one eligible new test.
- **3-test bundle** grants three eligible new tests.
- **5-test bundle** grants five eligible new tests.
- **Complete 10-test collection** grants every remaining eligible test.

The canonical demonstration student owns IELTS Academic Mock Tests 1 and 2
(2 of 10). Test 1 is ready to start and Test 2 is in progress. Every customer
surface uses this fixture by default; see [Student fixture rules](#student-fixture-rules).
Test Bundles therefore says: **“You already have 2 tests. This adds the remaining 8.”** The
`?owned=8` review state shows the insufficient-inventory rule: three- and
five-test bundles are not offered, and the learner may complete the collection
with the exact two tests remaining.

The client-side fixture only visualises a hypothetical server response. It does
not choose or grant entitlements. Production must lock or safely evaluate current
ownership, calculate eligible published tests, confirm inventory, apply the
approved secure allocation policy, grant the complete set atomically, return the
new tests, and make repeated requests idempotent.

## Copy revision table

| Existing wording | Problem | Replacement | Reason |
|---|---|---|---|
| Catalogue | Internal/retail language | IELTS Mock Tests | Familiar and immediately specific |
| Choose one or compose a set | Abstract and implies manual assembly | Start with one test or get a bundle | Plain international English |
| Choose 3 / Choose 5 / Choose 10 | Implies selecting test numbers | Get 3 tests / Get 5 tests / Get the complete collection | Matches automatic assignment |
| Build a set | Wrong business model | Removed | Students never pick test numbers |
| Pre-test lobby | Product-team jargon | Before you begin | Familiar preparation wording |
| Attempt journey | Internal system language | Take a test / Results ready | Describes the student action or state |
| Admin catalogue overview | Internal and vague | Manage mock tests | Clear administrator action |
| Withdrawn | Harsh and unexplained | Currently unavailable | Customer-friendly, with guidance |
| Populated / empty / loading / error | Development-state labels | Removed from customer navigation | Kept only as internal review states |
| Entitlement / allocation | Technical language | Access / assigned automatically | Keeps security terms in architecture, not UI |

## Official-language review

Accessed 4 October 2026. These sources inform familiar action language and
product naming; their promotional copy and protected test content are not copied.

- IELTS, **IELTS sample test questions** — uses “sample test questions,” “practice”
  and “resources”: <https://ielts.org/take-a-test/preparation-resources/sample-test-questions>
- IELTS, **IELTS Preparation resources** — uses “practice tests,” “Get ready” and
  direct try/start language: <https://ielts.org/take-a-test/preparation-resources>
- ETS, **TOEFL TestReady** — uses “Free Practice Test,” “Mock Tests,” “Get Started”
  and results/feedback language: <https://www.ets.org/content/ets-org/language-master/in/home/preparation-toefl/testready.html>
- ETS, **Practice for a Test** — uses “Get ready for test day” and “Practice Now”:
  <https://www.ets.org/practice.html>
- Cambridge English, **B2 First preparation** — uses “Sample tests,” “Get ready”
  and learner resources: <https://www.cambridgeenglish.org/exams-and-tests/qualifications/first/preparation/>
- Cambridge English, **Preparation FAQs** — uses direct learner-oriented exam
  preparation language: <https://www.cambridgeenglish.org/learning-english/exam-preparation/faqs/>

## Visual system

The revision returns to Porcelain Atlas V3: warm near-white canvas, deep ink,
editorial display typography, an accessible dark-orange action identity,
controlled aubergine/blue support, selective glass, fine borders and restrained
elevation. Library, test overview, active test, status and result layouts use
compact information density, deliberate spacing and purpose-built state visuals.
Student pages avoid generic ecommerce grids, giant headings, decorative full-page
diagrams and repeated frosted cards.

## Prototype interactions and states

- Offer actions open a review dialog that explains the ownership check and shows
  an illustrative server-returned set. Dialogs close with Escape, outside click
  or an explicit action and return focus to their opener.
- `bundle-builder.html?owned=8` demonstrates only two tests remaining.
- `bundle-builder.html?owned=4` shows the review-fixture student (Mock Tests 1–4).
- Library review-only states use `?state=review` (all four attempt statuses),
  `?state=empty`, `?state=loading`, `?state=error` and `?state=unavailable`.
- Attempt states use `?view=start` (Mock Test 1, reached from **Start test**),
  the default view (Mock Test 2 in progress), `?view=manual` (Mock Test 3) and
  `?view=results` (Mock Test 4); their library links return to `my-mock-tests.html?state=review`.

## Student fixture rules

- **Canonical default:** the student owns Mock Tests 1 and 2 of 10, with 8 still
  available. Test 1 is ready to start; Test 2 is in progress (Reading section,
  question 18 of 40). Catalogue, Test Bundles, My Mock Tests, Test Details,
  Before you begin and the default attempt view all agree on this fixture.
- **Ownership, availability and attempt status are separate.** Ownership is which
  tests are in the library (2 of 10). Availability is how many can still be added
  (8). Attempt status is per owned test (ready, in progress, waiting, results).
- **Review fixture:** `my-mock-tests.html?state=review` owns Mock Tests 1–4 so that
  one test can show each attempt status. It is labelled as an internal review
  fixture on the page, is reached only from `review-index.html` and the review
  attempt views, and never replaces the canonical student library. Its Test
  Bundles links go to `bundle-builder.html?owned=4`, whose My Mock Tests links
  return to `?state=review`, so neither page falls back to the 2-of-10 student.
- **Navigation:** internal My Mock Tests links carry no external-link arrow. The
  assessment page does not mark a navigation item as current; its visible section
  line (for example “Reading · Passage 2”) carries `aria-current="step"`.
- Neither fixture represents an account, entitlement or real student data.
- The Before you begin action remains disabled until all confirmations are checked.
- Assessment controls outside the illustrative sample explain their limit in a
  visible status line instead of failing silently. Confirming **Submit test** opens
  `?view=manual&submitted=2`, a Mock Test 2 waiting view with a design-preview
  banner; its review-only link opens the released-results specimen (Mock Test 4).
- **Mock Test 1 starting specimen** (`attempt-results.html?view=start`, reached from
  **Start test**): Listening, Part 1, Question 1 only. Its player, **Save and
  continue** and Questions 2–5 explain that they are outside the preview.
- **Mock Test 2 submission specimen** (`attempt-results.html`, reached from
  **Continue**): Reading Questions 18 and 19, answer review and the submission
  dialog. It is the only place the submit sequence is shown.
- The My Mock Tests error state’s **Try again** explains that nothing is reloaded in
  the preview.
- `admin-catalogue.html` is an administrator specimen. Its **Preview**, **View all**
  and **Manage offers** buttons are intentionally non-functional; no admin tooling
  is part of Phase 0C.
- All actions are in-memory presentation only.

## Validation scope

Run from the repository root (needs Node.js with `postcss` resolvable):

```sh
python3 design/phase-0c/support-v3-validate.py
python3 design/phase-0c/catalogue-v3-validate.py
```

`support-v3-validate.py` checks the six supporting pages (HTML nesting, unique IDs,
one `h1` per page or per assessment view, ARIA references, local links and anchors,
no remote dependencies); local links and anchors in `review-index.html`; parsing and
design tokens for `support-v3.css`, `bundles-v3.css`, `library-v3.css` and
`journey-v3.css`; JavaScript syntax for `catalogue-v3.js`, `prototype.js` and
`assessment-preview.js`; SVG safety, IDs and process-asset dimensions; and four
contrast pairs. `catalogue-v3-validate.py` covers `catalogue-v3.html` and its CSS,
JS and SVGs. `index.html` (legacy comparison) and `admin-catalogue.html` are not
covered by either script.

Browser checks for each revision were run at 1440, 768, 400 and 320 CSS pixels for
overflow, focus visibility, 44 px actions, keyboard operation, dialog focus and
Escape/return, 200% zoom, reduced motion and emulated forced colours. Raw browser
captures belong in ignored `screenshots/` or `audit/` directories.

## Known limitations

- Test content and result data are original illustrative fixtures, not official
  exam questions or secure scoring.
- The allocation preview (Tests 3, 4, 5…) already matches the selected policy:
  the server assigns the lowest-numbered eligible tests the student does not
  own (D1). The preview itself remains illustrative and grants nothing.
- There is no audio playback, recording, autosave, server timer, grant operation,
  immutable version store, RLS or manual-review assignment.
- Future paid access, owned-test credits, international currency (USD or AUD),
  Iranian toman presentation, tax, banking and payment provider remain unresolved.
- Official formats can change. Every examination profile needs a dated source
  review and named owner before publication.
- Only Mock Test 1 Question 1 and Mock Test 2 Questions 18–19 exist. The timer value
  is static; results are a fixed specimen. The waiting view matches the selected
  complete-release default (D5); explanation policy remains unresolved.
- Equipment readiness is self-reported; nothing tests audio or the microphone.
- Shared Catalogue V3 eyebrows and mobile navigation remain at 11 px.
- No real screen-reader, Windows High Contrast, 200% zoom on a physical device, or
  physical-device testing has been performed. High contrast was emulated.

Neither visual approval of this laboratory nor the policy decisions recorded in
`docs/decisions.md` authorise production implementation, migrations, Supabase
changes or payment work. Operational details of those policies and unresolved
items such as explanation policy remain open. Each implementation stage needs
separate approval.
