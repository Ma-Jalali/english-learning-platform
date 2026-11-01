# Test journey V3 — Test details, Before you begin and assessment entry

Non-production Phase 0C laboratory revision prepared in the `claude-visual-trial`
worktree on 10 October 2026. Journey: My Mock Tests → Test details → Before you
begin → assessment. Catalogue V3, Test Bundles and My Mock Tests are unchanged.

## Terminology

| Step | Page | Purpose | Primary action |
|---|---|---|---|
| Test details | `test-details.html` | Understand the test | **Before you begin** |
| Before you begin | `pre-test-lobby.html` | Prepare and confirm readiness | **Start test** |
| Start test | `attempt-results.html?view=start` | Enter the illustrative assessment | **Save and continue** |

## Design decisions

### Assessment entry

- **Start test** opens `attempt-results.html?view=start`: IELTS Academic Mock Test 1,
  Listening · Part 1, Question 1. It reuses the existing assessment frame, rail,
  question heading, actions and question map. Mock Test 2 at Reading Question 18
  remains the default view and is pixel-identical to its previous render.
- The stimulus is an illustrative player labelled “This design preview has no
  audio”. The response is an original form-completion item (Riverside Community
  Centre course enquiry) with one typed gap; no official examination content.
- The timer shows `––:––` with “Shown during a real test.” No section timing is
  stated. The save state reads “Nothing to save yet.” rather than claiming a save.
  **Previous** is disabled on the first question. The question count follows the
  existing Mock Test 2 specimen (“1 of 40”).
- The browser title follows the visible view (`data-page-title`, set by
  `prototype.js`), so the tab reads Mock Test 1 on the starting view.

### Test details

- Removed the third preparation section (“Set yourself up well”, its checklist and
  the second primary action), which duplicated Before you begin. One primary action
  remains: **Before you begin**.
- Fact labels: Sections · Four skills; Progress · Saved as you go; Results · After
  review. Card note: “A teacher reviews Writing and Speaking, so their feedback can
  take longer.” Skill descriptions use plain wording; no section timings were added.
- Essential labels and descriptions are now 13–15 px.

### Before you begin

- The setup check now precedes the overview in the document, so mobile, keyboard
  and screen-reader order all lead with the confirmations. Desktop keeps the
  approved two-column layout (overview left, setup check right) through grid
  placement.
- Confirmations: **Quiet space**; **Equipment ready** (“I’ve checked my headphones,
  microphone and speakers myself. This page doesn’t test them.”); **Timer rules
  understood**. Each `data-label` equals its visible label, so announcements read
  “Quiet space confirmed.” and so on. Native checkboxes, focus rings and the
  all-three requirement are unchanged.
- “When you select Start test” states only what the prototype shows (the test opens
  at Listening, Part 1, and the timer begins) and says pause, resume and retake rules
  will be confirmed before launch, rather than presenting provisional policy.
- My Mock Tests is no longer marked as the current page. The breadcrumb reads
  **Test details › Before you begin**, and its link is now a 44 px target.
- Checkbox hover lift is removed under `prefers-reduced-motion` and the page’s
  **Reduce motion** setting.

## Verification

Headless Microsoft Edge, exact viewports, HTTP cache disabled.

| Check | Result |
|---|---|
| Journey click-through | Library **Start test** → Test details → **Before you begin** → Before you begin → **Start test** → Mock Test 1, Listening · Part 1 |
| Test identity | Mock Test 1 on Test details, Before you begin and the starting view; Mock Test 2 on the default assessment view; tab titles match |
| Duplicated preparation | None on Test details; one primary action per page |
| Mobile hierarchy | Start test at 1,075 of 2,208 px at 400 px (was 1,703 of 2,111) and 1,278 of 2,534 at 320 px (was 1,871 of 2,294) |
| Overflow | None at 1440, 768, 400 or 320 px on any of the three pages |
| Keyboard | Real Tab presses reach every control with a 3 px focus ring; Space toggles each checkbox; Enter on **Start test** opens the starting view |
| Announcements | “Quiet space confirmed.”, “Equipment ready confirmed.”, “Timer rules understood confirmed.”, and “… not confirmed.” on uncheck |
| Reduced motion | Hover transform `none` with the system preference and with the page toggle (normal: −1 px lift) |
| Links | Test details → `pre-test-lobby.html`, `my-mock-tests.html`; Before you begin → `test-details.html`, `attempt-results.html?view=start`, `my-mock-tests.html`; starting view → `my-mock-tests.html` |
| Approved surfaces | Catalogue V3, Test Bundles and My Mock Tests (both fixtures) at 1440 and 400 px are pixel-identical to their previous renders |
| Static checks | `support-v3-validate.py` (heading rule now expects one `h1` per assessment view) and `catalogue-v3-validate.py` pass; `journey-v3.css` parses with defined tokens only |

## Open items

- The shared assessment frame still uses 10–12 px labels (timer label, question-map
  label and buttons, mode badge, save note). Raising them would also change the
  preserved Mock Test 2 view and needs approval.
- The My Mock Tests row action for a ready test reads **Start test** but opens Test
  details; aligning it with the new terminology would change the approved library.
- Equipment readiness remains self-reported; no audio or microphone check exists.
- Pause, resume, retake and timing rules await product approval and a dated
  examination-profile review.
- Real assistive-technology, 200% zoom and physical-device testing were not
  performed.
