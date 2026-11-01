# Phase 0C vector refinement

Non-production Phase 0C laboratory revision, prepared in the `claude-visual-trial`
worktree on 10 October 2026 at the user’s request. Every icon keeps its existing
box, position and meaning; only the drawing changed. Before-and-after comparisons:
`screenshots/assessment-v3/icons-before-after.png` (journey icons) and
`screenshots/assessment-v3/vectors-before-after.png` (everything else).

## Shared construction

- Plum gradient rims over a near-white radial face, with a small white highlight.
- Orange accents only where they carry meaning (selection, progress, saved, new).
- Dial marks drawn as dashed circles: 60 minute marks and 12 square-ended hour marks.
- Booklets share one construction: page edges, a stitched mid-plum spine, an
  embossed cover frame, a notched bookmark ribbon, skill-colour tabs and a soft
  ground shadow.
- Gradient IDs are unique per page. Straight horizontal or vertical strokes use solid
  orange (`#d9531f`), because object-bounding-box gradients do not render on
  zero-width or zero-height lines.

## Inventory

| Surface | Icon | Change |
|---|---|---|
| Catalogue V3, Test details | Reading, Listening, Writing, Speaking (`assets/catalogue-v3-skills.svg`) | Same silhouettes with tinted pages, page stack and ribbon; headband padding, cushions and sound arcs; folded page, handwriting, ferrule and graphite; grille lines, voice arcs and weighted base. Flat layered fills only, because gradients are unreliable through external `<use>`. |
| Catalogue V3, Test Bundles | Booklet stacks (`.paper-stack`) | Tinted spine, second title line, refined edge; notched ribbon on the front booklet only. |
| Catalogue V3, Test Bundles | Complete-collection seal | Scalloped orange rosette with stitched inner ring, highlight and check. |
| Catalogue V3 | Assignment shield, test-day calendar, feedback bubble, open padlock, library books | The ↗ and ≡ text characters are replaced with drawn icons; shield, padlock and books redrawn with depth. |
| Test Bundles | `process-choose.svg`, `process-assign.svg`, `process-library.svg` | Rebuilt from one booklet construction; page-stack depth grows for 1, 3, 5 and 10 and the collection carries the seal. Assign arrows now curve into the open library slot. viewBox, size, title and description structure are unchanged. |
| My Mock Tests, Test details, `catalogue.html` | Test emblems (17) | Answer-sheet glyph: two columns of bubbles and lines with one plum and one orange mark. |
| My Mock Tests | Empty, loading, error and unavailable symbols | The ＋, •••, ! and i text characters are replaced with a new-test page, a loading ring, an offline cloud and a paused state. |
| Before you begin, waiting view | “i” marks | Drawn information mark with an orange dot. |
| Before you begin, assessment | Waiting clock, timers, setup badge, fact icons | See the icon refinement section of `assessment-v3-review.md`. |

## Verification

- Every affected page keeps its exact height at 1440 and 400 px; pixel differences
  fall only inside icon regions.
- `support-v3-validate.py` (including SVG safety and process-asset structure) and
  `catalogue-v3-validate.py` pass; all four stylesheets parse; no duplicate IDs; no
  trailing whitespace.
- The legacy `index.html` and the Catalogue V3 hero artwork
  (`catalogue-v3-collection.svg`) were not changed.
