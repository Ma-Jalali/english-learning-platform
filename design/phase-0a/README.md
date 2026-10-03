# Phase 0A visual direction laboratory

This directory contains three isolated, non-production visual prototypes for comparing the English Learning Platform’s visual direction, plus a preserved and separately refined Porcelain Atlas study:

1. Porcelain Atlas
2. Academic Instrument
3. Living Language Studio

## Selection decision — 4 October 2026

**Phase 0A is complete. Porcelain Atlas V3 is the user’s visually approved product direction.**

- Academic Instrument’s restraint remains the reference for serious assessment and administration.
- Selected Living Language Studio ideas may be used sparingly for media-led and speaking/listening experiences.
- V1 and V2 are preserved exploratory iterations, not approved production designs.
- V3 is the approved foundation, not production-ready application code.
- Phase 0B is next and **has not started**. It requires a separate request, four non-production surface prototypes (public landing, student lesson, admin content workbench, assessment/detailed feedback), and separate visual approval before production CSS redesign or component migration.
- Product decisions unrelated to visual selection remain open in the [design brief](../../docs/visual-design-brief.md#28-risks-dependencies-and-unresolved-decisions).

No file in this directory is imported by the Next.js application. The prototypes do not use Supabase, authentication, storage, application routes, production CSS, or database state.

## Open locally

From the repository root, start any static HTTP server pointed at this directory. For example:

```sh
python3 -m http.server 4173 --directory design/phase-0a
```

Then open:

```text
http://127.0.0.1:4173/index.html
```

Opening the HTML files directly also works in modern browsers, but a local HTTP server provides more representative browser behaviour.

## Fair-comparison fixture

All concepts use the same IELTS Preparation (B2) identity, module, lesson, teaching meaning, question families, and feedback-state meanings. Layout, typography, surface, graphics, navigation, motion, and feedback composition differ.

The question controls are visual and interaction demonstrations only. “Check answer” and “Check answers” reveal fixed pre-authored states. JavaScript does not inspect responses, contain answer keys, compute scores, authenticate, or store data.

## Prototype interactions

- Desktop course/scene navigation
- Mobile course navigation in a native dialog
- Native accordion/details disclosure
- Keyboard-operable tabs in Living Language Studio
- Fixed immediate-feedback reveal
- Fixed group-results reveal and reset
- PDF/resource preview disclosure
- Media transcript disclosure
- Manual reduced-motion demonstration toggle plus `prefers-reduced-motion` support

## Files

- `index.html` — neutral comparison index
- `porcelain-atlas.html` — warm editorial route concept
- `porcelain-atlas-v2.html` — refined warm editorial route study
- `porcelain-atlas-v2-specimens.html` — V2 palette, component, and focus specimens
- `porcelain-atlas-v2-changes.md` — V1-to-V2 visual change record
- `porcelain-atlas-v2.css` and `porcelain-atlas-v2.js` — isolated V2 styling and specimen behaviour
- `porcelain-atlas-v3.html` — wider editorial V3 lesson study
- `porcelain-atlas-v3-specimens.html` — V3 colour, vector, icon, callout, control and elevation specimens
- `porcelain-atlas-v3-changes.md` — V2-to-V3 change record and matured Inspire ideas
- `porcelain-atlas-v3.css`, `porcelain-atlas-v3-glass.css`, `porcelain-atlas-v3-specimens.css`, and `porcelain-atlas-v3.js` — isolated V3 presentation and interaction
- `academic-instrument.html` — rigorous evidence-grid concept
- `living-language-studio.html` — immersive scene-based concept
- `shared.css` and `prototype.js` — prototype-only shared foundations
- concept CSS files — isolated composition and visual direction
- `assets/*.svg` — original prototype vectors
- `previews/*.webp` — four optimised representative previews retained in Git
- `screenshots/` — ignored, reproducible audit captures retained locally, not committed

The V2 review set includes 1440 px desktop, 1024 px tablet, 400 × 755 mobile, 320 px mobile, focus-state detail, assessment-control detail, palette, and component specimens. The mobile files have the requested pixel dimensions; the page was additionally exercised at native 400 px and 320 px CSS viewports because the headless capture browser enforces a wider minimum layout viewport.

The V3 review set adds 1440 px and 1920 px desktop captures, 1024 px tablet, 400 × 755 and 320 px mobile, inline typed-gap and summary-completion details, breadcrumb, disclosure closed/open/motion states, focus, controls/elevation, all three supporting-colour relationships, both four-skills alternatives, and the callout/icon family.

## Screenshot hygiene and regeneration

Before closeout, the local audit folder contained 45 images occupying approximately
8.3 MiB on disk; one raw PNG exceeded 1 MB. All audit captures remain locally in
the ignored `screenshots/` directory. No prototype source was removed.

Only these four WebP previews are versioned (combined size below 2 MB, each below 1 MB):

- `previews/porcelain-atlas-v3-desktop.webp` — approved V3 opening, 1440 px desktop.
- `previews/porcelain-atlas-v3-mobile.webp` — approved V3 opening, 400 × 755 viewport.
- `previews/academic-instrument-desktop.webp` — comparison reference.
- `previews/living-language-studio-desktop.webp` — comparison reference.

The final four previews total **178,174 bytes** (approximately 174 KiB); the largest
is 59,946 bytes. Two fresh approved V3 captures were added during closeout; the
entire raw capture directory remains excluded, including those new captures.

To reproduce captures:

1. Start the static server using the command above. Open the desired HTML page.
2. Use browser responsive mode at 1440 × 1000, 1024 × 768, 400 × 755, or 320 × 755 CSS pixels; wait for layout and fonts to settle. Use actual browser zoom for the 200% check, then restore it.
3. Capture the viewport through the browser’s screenshot command; save raw captures under `design/phase-0a/screenshots/`. Desktop previews use the page opening; the V3 mobile preview uses `porcelain-atlas-v3.html?capture=opening` to foreground the lesson.
4. For V3 details, append `?capture=measures`, `?capture=media`, `?capture=practice`, or `?capture=v3-q3`. Open disclosures/feedback through their normal controls. These are fixed visual demonstrations, not scoring.
5. Optimise a selected image using the existing `sharp` dependency, from the repository root:

   ```sh
   node -e 'require("sharp")(process.argv[1]).resize({width:1440,withoutEnlargement:true}).webp({quality:78,effort:6}).toFile(process.argv[2])' design/phase-0a/screenshots/capture.png design/phase-0a/previews/preview.webp
   ```

6. Review the compressed image visually, keep at most four representative previews, and inspect sizes before staging. Never stage raw captures or screenshots containing personal/account information.

The comparison index references only committed previews or original SVGs, so a
fresh clone does not depend on ignored captures. V1/V2 remain fully browser-viewable.

## Intended limitations

- These are visual studies, not production component specifications.
- No real scoring, secure answer release, persistence, media playback, PDF file, upload, authentication, or server behaviour is implemented.
- Form selections are not submitted or retained after reload.
- Screen-reader checks are structural/browser-level only; full assistive-technology testing belongs to Phase 0B and production validation.
- Text uses system fonts so the comparison does not prematurely decide font licensing or Persian-script support.

## Validation record

- Closeout: all eight HTML pages passed nesting, duplicate-attribute/ID, image-alt, and local-resource/anchor checks; all fourteen SVGs passed XML/ID checks; all nine CSS files parsed and their local resources resolved; all three JavaScript files passed `node --check`. Markdown fences and whitespace passed.
- Closeout: `npm run lint`, `npm run build`, and `git diff --check` passed. The build-only `next-env.d.ts` change was restored. The updated index was checked at 1440 px and 400 px, with no horizontal page overflow and all six preview/vector images loaded. Compressed previews were visually inspected.
- V3 was visually reviewed at 1280, 1440, 1680, 1920, and 2048 px desktop widths; 1024 × 768; 400 × 755; and 320 × 700.
- Native Safari page zoom was exercised at 200%, verified without a horizontal scrollbar, and restored to actual size after the check. The earlier viewport-pressure check remains useful as a repeatable browser-automation test.
- Document widths were measured at every review size; the pages have no horizontal page overflow.
- Primary text and action contrast was checked against its rendered surface. V2 records measured pairings directly on its palette specimen; the bright signature-orange action uses deep ink rather than white text. V3 separates the bright signature from a darker white-text action orange and records its ratios in the V3 specimen.
- V2’s recorded core contrast ratios are 17.68:1 for ink on paper, 6.76:1 for muted ink on paper, 5.33:1 for ink on signature orange, 4.87:1 for white on dark interactive orange, 9.26:1 for deep cobalt on cobalt tint, and 16.15:1 for ink on orange tint.
- Mobile navigation, immediate feedback, group feedback, retry focus return, disclosures, and the Studio tab keyboard pattern were exercised in a browser.
- Keyboard focus rings, 44 px minimum primary touch targets, native form semantics, live-region announcements, and non-colour feedback labels were checked structurally.
- The manual motion override reduces animation and transition durations to effectively zero; the same override is present under `prefers-reduced-motion: reduce`.
- HTML was parsed in a browser without console errors; JavaScript syntax, SVG XML, local references, whitespace, and responsive screenshot assets were checked locally.

The native zoom and structural semantics checks are not substitutes for full assistive-technology testing with target browser and screen-reader combinations. That remains part of Phase 0B acceptance testing.
