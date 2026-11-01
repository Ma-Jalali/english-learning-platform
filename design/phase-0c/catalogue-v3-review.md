# Catalogue V3 approval notes

**Status:** approved. Catalogue V3 is the customer homepage and visual authority
of the Phase 0C laboratory, which was visually approved as a whole on 10 October
2026. This is prototype approval only; it does not authorise production
implementation or the separately pending Phase 0C architecture.

This is the review record for the customer-facing surface at `catalogue-v3.html`.
The earlier Phase 0C catalogue remains available for comparison. When this record
was written, no other Phase 0C customer surface had adopted this direction; after
approval, the supporting surfaces were revised in it (see
[Later approved revisions](#later-approved-revisions)).

## Hero copy explored

1. **Walk into IELTS ready.** — selected because it is concise, motivational and
   immediately connects preparation with the test-day outcome.
2. **Ten tests. One clear goal.** — clear product framing, but less emotionally
   engaging as the opening promise.
3. **Practice that feels like test day.** — useful evidence language, but better
   suited to a supporting section than the main brand statement.

The selected hero is supported by two short product facts: “IELTS Academic · 10
mock tests” and “Free during launch.” The primary action is “Get free access.”

## Copy reset

| Previous wording | Problem | Catalogue V3 replacement | Reason |
| --- | --- | --- | --- |
| “Three clear ways forward.” | Describes page navigation rather than creating desire. | Removed; the three customer destinations sit quietly in navigation. | Keeps the opening focused on IELTS preparation. |
| “The pilot collection” / “Ten IELTS Academic mock tests.” | Internal programme language and a large administrative headline. | “Four skills. One clear goal.” | Leads with the learner’s purpose while retaining the ten-test fact in supporting copy. |
| “Flexible preparation” / “Start with one test or get a bundle.” | Accurate but flat and mechanically framed. | “Start small. Go further.” | Expresses a simple progression and gives the offers more energy. |
| “Your tests are assigned automatically. We check your library first…” | Repeats operational detail in a long paragraph. | “New tests are added automatically—with no repeats.” | Communicates the rule once, in plain English. |
| “New tests, without duplicates.” plus platform mechanics | Technical and visually dominant. | A compact three-step line: choose, check, open. | Explains access without interrupting the product story. |
| “Your next test is waiting.” | Oversized and slightly pressuring. | “Pick up your practice.” | Friendly, compact and appropriate for returning learners. |
| “More exams coming later” presented as competing cards | Unavailable products competed with IELTS. | “More exams are coming.” with a quiet text list. | Keeps future families visible but clearly secondary. |

## Spacing system

The page uses the existing Porcelain Atlas rhythm as a named scale:

- 4, 8, 12, 16, 20 and 24 px for close component relationships.
- 32, 40 and 48 px for card padding, component groups and mobile sections.
- 64, 80 and 96 px for major composition and desktop sections.
- Responsive page gutter: 64 px maximum, 24 px on mobile and 20 px at 320 px.
- Section separation: 80 px desktop, 64 px tablet and 48 px mobile.

The scale is implemented as custom properties in `catalogue-v3.css`; optical
adjustments are limited to places where text or artwork needs a closer visual
relationship.

## Additional defects found in the rejected surface

- The previous cascade referenced an undefined `--gutter` token in padding
  shorthand, so whole spacing declarations could become invalid.
- Internal review navigation was given the visual weight of customer products.
- Repeated two-column title-and-paragraph sections created detached copy and
  arbitrary empty regions.
- The route illustration scaled miniature labels and overlapping cards instead
  of communicating a product at a glance.
- Future examination families occupied the same visual tier as the available
  IELTS product.
- Long editorial headings were used repeatedly without enough contrast in
  purpose, making the page feel like documentation.
- The old page depended on a broad shared cascade. Catalogue V3 is deliberately
  isolated so approval is based on one controlled surface.

## Known prototype limitations

- This is a static, non-production design prototype. Access granting, account
  state, test assignment, results and payments are illustrative only.
- Offer links lead to the Phase 0C supporting prototypes, which now use the
  Catalogue V3 direction. *(Superseded: this originally said those pages kept
  their earlier art direction until Catalogue V3 was approved.)*
- Catalogue V3 itself remains non-personalised: it shows no owned-test count and
  offers a short **Pick up your practice** link to My Mock Tests. Ownership for
  the canonical fixture (Mock Tests 1 and 2 of 10) is shown on Test Bundles,
  My Mock Tests and `catalogue.html`; Test details, Before you begin and the
  attempt views follow the same fixture.
  *(Superseded: this originally said personalised counts were reserved for a
  later revision.)*
- Shared eyebrow labels and mobile navigation text remain 11 px, a known
  accessibility issue recorded across the laboratory.
- No remote fonts, scripts, analytics or raster images are loaded. The original
  SVG artwork and all interface assets are local.
- Captures live under the ignored `screenshots/` directory and are not prepared
  for commit.

## Later approved revisions

These later records changed or extended Catalogue V3 and take precedence over
this record where they differ:

- [`vectors-v3-review.md`](vectors-v3-review.md) — redrew the skill icons, booklet
  stacks, complete-collection seal and supporting icons on this page; the hero
  artwork (`catalogue-v3-collection.svg`) was not changed.
- [`bundles-v3-review.md`](bundles-v3-review.md),
  [`library-v3-review.md`](library-v3-review.md),
  [`journey-v3-review.md`](journey-v3-review.md) and
  [`assessment-v3-review.md`](assessment-v3-review.md) — applied this direction to
  the supporting surfaces and aligned them on the canonical 2-of-10 fixture.
- The laboratory's current status, fixtures and limitations are maintained in
  [`README.md`](README.md).
