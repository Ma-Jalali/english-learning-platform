# Assessment and results V3 — interaction specimen and UX corrections

Non-production Phase 0C laboratory revision of `attempt-results.html`, prepared in
the `claude-visual-trial` worktree on 10 October 2026. It is a design prototype,
not an assessment engine: no attempt, timer, autosave, submission, scoring or
result release exists.

## Interaction model

| Step | Where | What happens |
|---|---|---|
| 1. Select a response | Mock Test 2, Question 18 | Native radio selection; the save note reads “Answer selected. Preview only, not stored.” |
| 2. Save and continue | Question 18 → 19 | Shows an original True / False / Not given question on the same passage; heading receives focus; progress, context and question map update |
| 3. Review answers | Question 19 → review | Lists Listening (completed earlier, illustrative), Reading Questions 18 and 19 with Answered / Not answered and **Change**, and Writing and Speaking as not included in this preview |
| 4. Submit test | Review | Opens a native dialog: “Submit Mock Test 2?”, the real-test consequence and “Design preview. Nothing will be submitted.” |
| 5. Confirm | Dialog | **Submit test** opens `?view=manual&submitted=2`; **Keep reviewing** or Escape closes and returns focus to **Submit test** |
| 6. Waiting | `?view=manual&submitted=2` | Mock Test 2 identity, design-preview banner, one **Back to My Mock Tests** action (canonical library) |
| 7. Results (review only) | Waiting → results | A dashed review-only route explains results are not available straight after submitting and opens the released-results specimen (Mock Test 4) |

Controls outside the sample (Questions 16, 17 and 20, **Previous** on Question 18,
Mock Test 1 **Play recording**, **Save and continue** and Questions 2–5) write a
specific explanation into a visible status line (`role="status"`). No visible
control is silently inert. Mock Test 1 still starts at Listening, Part 1,
Question 1; the review fixture’s waiting view (Mock Test 3) remains available at
`?view=manual`.

## UI corrections

- **Labels.** Assessment labels and metadata are 13 px minimum: timer label,
  passage label, question-map label, mode badge, save note, test identity, status
  chips, section-status labels, band labels and score notes. Question-map buttons,
  progress and save headings are 14 px. Editorial headings and numerals are
  unchanged. Shared Catalogue V3 category eyebrows remain 11 px.
- **Selected answer.** Plum border, inset ring, subtle tint and a “✓ Selected”
  marker (a tick alone on narrow screens), generated with an empty alternative so
  assistive technology hears only the native radio state. Arrow-key and Space
  behaviour is unchanged.
- **Duplicate count removed.** The question heading no longer repeats “18 of 40”;
  the progress summary carries it.
- **Mobile order.** The rail is split in the document: a time-and-progress summary
  before the question and a navigation/save panel after it. Desktop places both in
  the right-hand column; mobile, keyboard and screen-reader order follow the
  document.
- **Reduced motion.** The page’s **Reduce motion** setting now suppresses answer
  hover movement, as the system preference already did.

## Waiting and results

- Waiting: one library action; sections in test order with “Scored automatically”
  and “Reviewed by a teacher”; plain copy with no review deadline.
- Results: separators restored between stacked score cards (the second card’s top
  border was suppressed by a tablet rule); the overall band is a paragraph whose
  text reads “Overall band 7.0 Illustrative result”; **Review feedback** toggles a
  released Writing Task 2 · Coherence and cohesion comment with a concrete next
  step. The unsupported promise of answer explanations is removed; the panel says
  Speaking feedback and explanations are not included. No answer keys appear.

## Cross-page

My Mock Tests row actions that open Test details now read **View test details**
(Mock Test 1 in both fixtures). No other library change.

## Verification

Headless Microsoft Edge, exact viewports, HTTP cache disabled, real keyboard
events.

- Full keyboard click-through: select (Space, arrow keys) → Save and continue →
  select → Review answers → Change → Submit test → Escape (focus returns) → Keep
  reviewing (focus returns) → Submit test → waiting (Mock Test 2, preview banner,
  canonical library link) → review-only route → results → Review feedback
  (expanded, focus on the feedback heading).
- Selected state: border, tint and marker differ from unselected choices.
- Mobile order at 768, 400 and 320 px: summary → question → answers → question map
  → save status.
- Score separators present on every stacked card at 400 and 320 px.
- Answer hover transform `none` with the system preference and the page toggle.
- No horizontal overflow at 1440, 768, 400 or 320 px in any view; no remaining
  assessment label below 13 px other than shared category eyebrows.
- Fixture links: start and Mock Test 2 → `my-mock-tests.html`; review waiting and
  results → `?state=review`; submitted waiting → `my-mock-tests.html`.
- Catalogue V3, Test Bundles, Test details and Before you begin are pixel-identical
  to their previous renders; My Mock Tests differs only in the Mock Test 1 row.
- `support-v3-validate.py` and `catalogue-v3-validate.py` pass; `assessment-preview.js`
  passes `node --check`.

## Limitations

- Only Questions 18–19 of Mock Test 2 and Question 1 of Mock Test 1 exist. Writing
  and Speaking are represented only in review and status states.
- The timer value is static and labelled illustrative.
- Results are a fixed specimen; release timing and explanation policy are
  unapproved product decisions.
- Real assistive-technology, 200% zoom and physical-device testing were not
  performed.

## Icon refinement (journey and assessment)

Seven inline icons were redrawn at their existing sizes and positions: the waiting
clock, both assessment timers, the Before you begin setup-check badge and its three
fact icons. Each now uses a gradient rim and face with a light highlight,
precisely spaced 60 minute marks and 12 square hour marks (dashed circles),
tapered hands with a two-tone pivot, and orange accents that carry meaning:
review progress on the waiting clock, the 27 minutes remaining on the Mock Test 2
stopwatch (Mock Test 1’s is at zero, not running), three markers for the three
confirmations, a 2 hr 45 min arc, a saved badge and a bevelled shield. Gradient IDs
are unique per instance. Pixel comparison confirms changes only inside the icon
boxes; Catalogue V3, Test Bundles, My Mock Tests and Test details are unchanged.
Before-and-after comparison: `screenshots/assessment-v3/icons-before-after.png`.
