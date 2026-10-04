# V3 fidelity correction — 4 October 2026

## Latest supplied-artwork review

- Installed the user's `learning-atlas-hero.svg` without altering its artwork
  or metadata (only a final file newline was added). Removed the image wrapper's
  background, border, radius and shadow; the vector's own detail remains intact.
- All landing primary buttons use one `--landing-primary: #C44216` token in
  resting, visited, hover, focus and pressed states. Removed the darker pressed
  fill and coloured outer shadows, and matched control sizing. The stylesheet
  URL was versioned to refresh browser caches. White contrast remains 5.07:1.
- Replaced the long programme label with “Explore our courses.” Pilot status
  remains accurate in the separate sentence below the section heading.
- Replaced the warm secondary action with translucent white glass and a thin,
  neutral border, retaining focus and reduced-transparency fallbacks.
- Rechecked landing widths 320, 400, 768, 1024, 1440 and 1920 px: no overflow,
  SVG loads and the new label stays on one line. Keyboard focus is visible;
  no console warnings/errors were reported. Current captures use
  `supplied-hero-*.jpg` and `neutral-glass-lesson-action.jpg`.

The first Phase 0B interpretation was rejected in visual review. It enlarged
components, substituted weaker graphics and reintroduced strong tints, oversized
type and excessive whitespace. Passing layout checks did not establish fidelity.

## Student: preserve, do not reinterpret

- Rebuilt student-lesson.html directly from the final approved Phase 0A V3 HTML.
- v3-foundation.css, v3-materials.css and lesson-v3.js are local snapshots of
  the approved styles and interactions. They do not import production code.
- Original V3 book, headphone, writing, microphone, compass, evidence-route and
  light-route SVGs are copied locally without changing their geometry.
- Rail widths, heading measures, breadcrumb, controls, callout, resource row,
  disclosure padding, near-white sections and neutral outer canvas are preserved.
- Only lab navigation, a truthful “not stored” status and a terminal state-library
  disclosure differ from the approved lesson. V3 itself is untouched.
- One isolated accessibility override gives summary selects 9.2 rem at 320 px:
  the approved 8 rem width clipped “select a word” in the browser. No other
  lesson typography or proportions are changed.

## Public landing

- Replaced the low-detail hero diagram with an original generated editorial image.
- Reduced hero size, heading scale, section gaps, programme rows and lower-page
  typography. Removed ambient purple/orange fields and the huge dark block panel.
- Retained V3 typography, orange actions and compact route details.
- Public copy leads with learning rather than internal implementation terminology.
- The catalogue distinguishes the IELTS pilot from planned course families.

## Operational surfaces

- Admin and assessment retain their job-specific layouts, with smaller headings,
  quieter neutral backgrounds and tighter spacing.
- Admin now uses the approved compass and evidence-route artwork.
- Block selection also responds to Enter/Space; explicit keyboard focus retained.
- Strict assessment hides checking controls and highlighted hints, and removes
  decorative motion. These remain visual states, not secure assessment delivery.

## Image provenance

### Latest review: vector, action colour and course rail

- Replaced the photo in the live landing page with `public-learning-atlas.svg`:
  a source-native composition of layered pages, headphones, microphone and an
  annotated writing sheet linked by a coral route. The artwork is resolution
  independent, with original paths, subtle material gradients and an accessible
  description. No third-party artwork or raster image is embedded.
- Header, hero and final lesson actions now share the exact solid `#C44216`
  orange. White labels measure 5.07:1 contrast; hover adds elevation without
  changing the orange. Pressed state uses `#B43A13`; keyboard focus is retained.
- The course connector is neutral `#D9D2CD`. All four badge left edges align
  exactly. The active surface extends 10 px left independently of badge/text
  positioning; the underlying approved V3 snapshots remain untouched.
- Browser checks cover both affected pages at 320, 400, 1024, 1440 and 1920 px:
  no horizontal overflow, landing images loaded, visible keyboard focus and no
  console warnings/errors during this check. Raw captures use `refined-*.jpg`.

### Earlier photographic iteration (preserved, no longer displayed)

Built-in image-generation tool; new image, no third-party reference asset.
Delivered asset: assets/learning-still-life.webp, 1536 × 1024, 213,448 bytes.
The generated original remains outside the repository. No copied provider art.

Final prompt:

> Use case: ads-marketing. Asset: high-resolution editorial hero image for a
> premium English-learning platform named Porcelain Atlas (do not include text).
> Create an exquisite tactile still-life photographed in a daylight architectural
> studio: an open cream-paper book, a refined coral-orange pencil resting across
> a small warm-white notebook, and beautifully designed ivory over-ear headphones
> with one restrained burnt-orange detail. A single clear optical-glass plane
> with soft rounded corners catches a subtle caustic, suggesting clarity and
> learning; it must not cover the objects. Warm porcelain tabletop and pale
> off-white background, deep neutral subtle shadows, fine realistic paper edges
> and fabric texture. Composition: landscape 3:2, camera slightly above desk level,
> tightly art-directed asymmetric arrangement filling frame, calm sophisticated
> editorial product photography, physically plausible objects, tack-sharp details.
> No people, no logos, no writing, no typography, no UI, no icons, no arbitrary
> floating objects, no neon, no blue/purple gradient, no stock educational symbols.
> Aim for quiet contemporary design-magazine quality, not a generic 3D SaaS illustration.

The image-generation skill influenced the new raster hero only; existing approved
SVGs were reused as source, not regenerated. No application files or Phase 0A
sources were changed. This record preserves the rejected first interpretation;
the corrected Phase 0B laboratory was visually approved on 4 October 2026.
