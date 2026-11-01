# Test Bundles V3 — design proposal and review record

Non-production Phase 0C laboratory revision of `bundle-builder.html`, prepared in
the `claude-visual-trial` worktree on 10 October 2026. Catalogue V3 remains the
visual authority. Navigation, hero typography, card alignment, dialogs,
`prototype.js` behaviour and all process SVG artwork are unchanged.

## Source revision inspected

The Codex worktree (`english-learning-platform`, branch `main`, HEAD `9be4c94`)
was compared byte for byte before design work began. The files below were
identical in both worktrees (SHA-256 prefixes):

| File | SHA-256 prefix |
|---|---|
| `bundle-builder.html` (before revision) | `42e1eaad5107a891` |
| `catalogue-v3.html` | `6694bdc8382a265a` |
| `catalogue-v3.css` | `4bd1dfb6947ca2ae` |
| `support-v3.css` | `b9bf3a0f04cb21c6` |
| `assets/process-choose.svg` | `f0493374b5ad3114` |
| `assets/process-assign.svg` | `7f9624c464896f2a` |
| `assets/process-library.svg` | `4ccfeda8813ef4e7` |

The Codex worktree additionally carries uncommitted `docs/roadmap.md` and
`docs/visual-design-brief.md` edits and an untracked
`docs/mock-test-commerce-foundation.md`; these were read for product rules and
not copied. The Codex worktree was not modified.

## 1. Content hierarchy

Each student-relevant fact now has one home:

| Message | Where it lives | Removed from |
|---|---|---|
| What the page offers, and that new tests never repeat | Hero lead (unchanged) | Ownership bar, section intro, process intro |
| What the student already owns | Hero **Your collection** panel: count, ten numbered booklets, one sentence | Separate ownership bar |
| Free launch access, no payment details | One **Free during launch** note beside the offer heading | Eyebrow, hero note, section intro, every card, footer |
| What each option adds | Card gain row: `+N new tests` and `You’ll have X of 10` | Generic “N new tests included” labels |
| How allocation works | Process step 2: “We skip tests you own and add different ones.” | Process intro paragraph |

The footer keeps only the prototype disclaimer that no checkout or payment
service is connected. Visible “free” mentions fell from 8 to 1.

## 2. Bundle-card differences

- **Glyph progression.** The cards reuse Catalogue V3’s `.paper-stack` drawing:
  one sheet, three sheets, five sheets, then a warm five-sheet stack carrying
  Catalogue V3’s complete-collection seal. The glyphs are now visible on mobile,
  beside the numeral.
- **Comparison row.** A ten-segment meter shows owned tests in aubergine, the
  new tests the offer adds in orange, and the remainder in neutral. The adjacent
  text carries the same meaning for assistive technology and forced colours.
- **Aligned rows.** Cards share subgrid tracks, so descriptions, gain rows and
  actions line up across all four offers.
- **Complete-collection priority.** It keeps the orange numeral, warm surface and
  sole primary action, and adds the seal, a warmer edge and an orange gain label.
  Its action says exactly what happens: **Get the remaining 8** (or **2** in the
  `?owned=8` state).

## 3. Copy improvements

| Before | After | Reason |
|---|---|---|
| IELTS Academic · free during launch | IELTS Academic · 10 mock tests | Matches Catalogue V3; free is stated once below |
| More ways to prepare. | How many new tests? | The offers are the page’s main decision, not an alternative |
| A focused first step. | One full four-skill test to see where you stand. | States what a single test gives |
| Build a steady practice rhythm. | Three different tests to practise, review feedback and try again. | Distinct identities, not repeat attempts |
| Make practice a habit. | Five different tests to practise regularly and compare your results. | Distinct identities and a concrete use |
| More room to prepare. | Every test you don’t have yet, so the full series is yours. | Accurate to the complete-series allocation rule |
| Complete collection (button) | Get the remaining 8 / Get the remaining 2 | Names the result of the action |
| One test or a bundle. | Pick one test or a bundle. | Direct action |
| Assigned automatically, with no repeats. | We skip tests you own and add different ones. | Explains the rule once, plainly |

## 4. Compact mobile process

At 820 px and below, each step becomes one row: artwork on the left at
`clamp(124px, 36vw, 232px)` wide, step label, title and sentence on the right.
The three steps, their order, the original SVGs and the downward connectors are
preserved. Connectors are drawn once with a CSS mask, centred under the artwork
column, instead of rotating the desktop arrow. On desktop the horizontal arrows
are now centred on the artwork rather than on the whole card.

## Measurements

Measured in headless Microsoft Edge with exact CSS viewport widths.

| Metric | Before | After |
|---|---:|---:|
| Process section at 400 px | 1,382 px (40% of page) | 608 px (22%) |
| Page height at 400 px | 3,478 px | 2,728 px |
| Process section at 1440 px | 728 px | 636 px |
| Offer glyphs visible at 400 px | 0 of 4 | 4 of 4, all distinct |
| Visible “free” mentions | 8 | 1 |
| Horizontal overflow at 1440 / 1024 / 768 / 400 / 320 | none | none |
| Main-content controls under 44 px tall | none | none |

New contrast pairs: featured gain label 5.04:1, muted gain text 6.40:1, owned
booklet numerals 10.09:1, unowned booklet numerals 6.45:1.

## Verification performed

- `support-v3-validate.py` passes (6 pages, 103 local references, ARIA references,
  CSS parse, JS syntax, SVG safety, contrast). `postcss` was resolved read-only
  from the Codex worktree because this worktree has no `node_modules`.
- `bundles-v3.css` parses (221 declarations); it uses only defined tokens apart
  from the per-card `--owned` / `--new` values set inline.
- Offer dialog: opens with the correct title, summary and allocated test list in
  default and `?owned=8` states; closes; focus returns to the opening button. The
  card focus ring (`:focus-within`) is preserved.
- No trailing whitespace in changed files.

## Screenshots

In ignored `screenshots/bundles-v3/`: `before-bundles-{1440,400}`,
`after-bundles-{1440,1024,768,400,320}`, `after-bundles-owned8-{1440,400}` and
`catalogue-v3-{1440,400}`.

## Open items

- Real assistive-technology testing and 200% zoom checks were not performed.

## Two-offer state refinement

In the `?owned=8` state only the one-test and complete-collection offers remain.
Above 1100 px the grid now switches to two centred columns at the standard card
width (`bundles-v3.css`, `.bundle-grid:has(> .bundle-card[hidden])`). At 1440 px
both cards measure 316 × 357 px, identical to the four-offer layout, with 332 px
of space on each side; they occupy the same positions as cards 2 and 3 in the
default state. From 601 to 1100 px the existing two-column grid already fills
the row, and the mobile single column is unchanged. No markup, copy, meter,
illustration, action wording or allocation behaviour changed.
- Shared-component text under 13 px (eyebrows, footer, navigation at mobile) is
  inherited from Catalogue V3 and was not changed here.
