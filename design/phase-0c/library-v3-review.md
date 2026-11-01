# My Mock Tests V3 — fixture alignment and UX review record

Non-production Phase 0C laboratory revision of `my-mock-tests.html`, prepared in
the `claude-visual-trial` worktree on 10 October 2026. Catalogue V3 remains the
visual authority; the approved Test Bundles page is the ownership reference. Test
Bundles files are unchanged.

## Fixture decision

The canonical student owns **Mock Tests 1 and 2 of 10**. The library previously
listed Tests 1–4 while Test Bundles and the catalogue said 2 of 10.

| Fixture | URL | Owned | Statuses shown |
|---|---|---|---|
| Canonical student (default) | `my-mock-tests.html` | Tests 1–2 (2 of 10, 8 available) | Ready to start, In progress |
| Internal review fixture | `my-mock-tests.html?state=review` | Tests 1–4 (4 of 10, 6 available) | All four statuses |

The review fixture reuses the existing `prototype.js` `?state=` mechanism; no
JavaScript changed and no development control appears on the student page. It is
labelled twice on the page (collection panel and above the list), linked from
`review-index.html`, and reached from the attempt page's waiting-for-feedback
(Test 3) and results (Test 4) views. Empty, loading, error and unavailable states
hide the fixture-specific summary and add-more panel rather than show wrong counts.

### Cross-page consistency

| Surface | Fixture reference | Status |
|---|---|---|
| `catalogue.html` | 2 of 10; Test 1 in library, Test 2 in progress | Already consistent |
| `bundle-builder.html` | 2 of 10; Tests 1 and 2 owned | Already consistent; unchanged |
| `test-details.html`, `pre-test-lobby.html` | Mock Test 1, ready to start | Already consistent |
| `attempt-results.html` (default) | Mock Test 2, Reading question 18 of 40, 27:00 left | Already consistent |
| `attempt-results.html?view=manual` / `?view=results` | Mock Tests 3 and 4 | Library links now go to `?state=review` (three `href` values changed) |

## UX changes

| Issue | Change |
|---|---|
| Ownership contradicted Test Bundles | Default shows Tests 1–2; collection panel reuses the Test Bundles “Your collection” design: `2 of 10 tests`, ten booklets, “8 more tests are available to add.” |
| Ownership and status were merged | Collection (ownership, availability) is separate from four attempt-status counts that exactly match the row chips. |
| Status text at 10–11 px | Chips, notes and summary labels are 13 px; the only remaining sub-13 px text is the shared Catalogue V3 eyebrow label. |
| Test 2 chip said “Continue” | Chip reads **In progress**; “Continue” is reserved for its action. |
| Duplicate, unscoped progress | One statement: “Reading section · question 18 of 40”, with a progress bar named “Reading section progress”. The note uses the attempt page’s facts: “Answers saved · 27 min left”. |
| Three competing orange actions | One primary on the page: the in-progress test’s **Continue**, whose row is tinted. Other row actions and **View bundles** use the glass style. Rule: in-progress first, otherwise the first ready test. |
| No current-page navigation cue; “↗” on the current page | My Mock Tests uses the same orange current-page treatment as Test Bundles; the arrow is removed on this page. |
| Test titles were `h2` beside “Your tests” | Titles are `h3`; exceptional-state headings are `h3` as well. |
| Repeated “IELTS Academic” and tall mobile rows | Visible titles read “Mock Test N” under the IELTS Academic section; the full name stays in the accessible name. Mobile rows put status inline, and the page fell from 2,460 to 1,788 px at 400 px. |
| Add-more copy repeated bundle messaging | “8 more tests to add.” with one sentence on no-repeat allocation and a glass **View bundles** action. |

## Verification

Measured in headless Microsoft Edge with exact viewports and the HTTP cache
disabled, in both fixtures at 1440, 1024, 400 and 320 px, plus `?state=empty` and
`?state=error`.

- Ownership: collection count, owned booklets and row count agree (2 and 4).
- Status counts match row chips in both fixtures.
- One primary action per page; no main-content control under 44 px; no horizontal
  overflow.
- Heading order: H1 My Mock Tests → H2 Your tests → H3 each test → H2 add-more.
- Real Tab presses: skip link, brand, navigation, row actions (with row focus ring),
  View bundles, footer — each with a visible 3 px focus ring.
- Links: Start test → `test-details.html`; Continue → `attempt-results.html`;
  View status / View results → review attempt views; View bundles →
  `bundle-builder.html` (2 of 10).
- `support-v3-validate.py` and `catalogue-v3-validate.py` pass; `library-v3.css`
  parses with only defined tokens; new contrast pairs are 3.73:1 (24 px bold zero
  counts) to 9.46:1.

## Cross-page consistency follow-up

- **Review fixture ↔ Test Bundles.** `prototype.js` now supports
  `bundle-builder.html?owned=4` for the four-owned review student: collection
  4 of 10, meters +1/+3/+5/+6, **Get the remaining 6**, and allocation previews of
  Tests 5, 5–7, 5–9 and 5–10. On `?state=review`, Test Bundles links gain
  `?owned=4`; on `?owned=4`, My Mock Tests links gain `?state=review`. The default
  and `?owned=8` paths are unchanged.
- **External-link arrow.** Removed from ten internal My Mock Tests links (navigation,
  footer and Catalogue V3’s **Open My Mock Tests**) on six pages. Links, focus
  rings and navigation styling are unchanged; pixel diffs confirm changes only in
  the navigation band, that button and footer links, with identical page heights.
- **Assessment navigation.** `attempt-results.html` no longer marks My Mock Tests as
  the current page. The visible “Reading · Passage 2” line has
  `aria-current="step"`, matching the step pattern on Before you begin.

## Open items

- `bundle-builder.html?owned=8` returns to the canonical library; no eight-owned
  library fixture exists.
- From the review fixture, **IELTS Mock Tests** still opens the canonical catalogue.
- `pre-test-lobby.html` still marks My Mock Tests as the current navigation page.
- “↗” remains on “Mock-test home” and Catalogue V3’s “Before you begin” links, and
  on the legacy `index.html`, which is preserved for comparison.
- Shared navigation text is 11 px at mobile widths (Catalogue V3).
- Real assistive-technology testing and 200% zoom checks were not performed.
