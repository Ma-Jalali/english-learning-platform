# Phase 0B — Porcelain Atlas surface prototypes

Phase 0B tests the selected Porcelain Atlas V3 direction across four distinct product surfaces. Everything in this directory is a non-production design and interaction prototype. Nothing here is imported into `src/`, authenticates a user, reads or writes Supabase, persists content edits, publishes content, or scores an answer. Personal assessment annotations alone use tab-session storage for prototype navigation, as described below.

**Status:** Visually approved on 4 October 2026. This laboratory is the approved
Phase 0B design record, not production application code. Production migration,
the mock-test extension and any product implementation require separate approval.

## Open the lab

From the repository root:

```sh
python3 -m http.server 4176 --directory design
```

Then open <http://127.0.0.1:4176/phase-0b/index.html>.

Direct surfaces:

- [`public-landing.html`](public-landing.html) — public institutional identity and product evidence
- [`student-lesson.html`](student-lesson.html) — complete IELTS Preparation (B2) lesson surface
- [`admin-workbench.html`](admin-workbench.html) — governed three-pane content workbench
- [`assessment-feedback.html`](assessment-feedback.html) — Reading assessment, group checking, review, manual feedback and Exam mode
- [`listening-annotation-specimen.html`](listening-annotation-specimen.html) — separate lightweight Listening interaction specimen; not part of the Reading test

## Shared prototype system

- [`tokens.css`](tokens.css) contains colour, typography, spacing, width, radius, shadow/elevation, glass, motion, focus, semantic-state and course-theme tokens.
- [`shared.css`](shared.css) contains shared brand, route, disclosure, state, specimen and responsive compositions.
- [`prototype.js`](prototype.js) supplies presentation-only disclosure, dialog, tab, block-selection, preview, save/publish, flag, mobile-pane, strict-mode and feedback-reveal interactions.
- The corrected student surface uses exact local snapshots of the final approved V3 styles: `v3-foundation.css`, `v3-materials.css`, and `lesson-v3.js`. Its geometry is preserved, not approximated with the newer shared classes.
- `landing-refinement.css` tightens the public composition; `surface-refinement.css` adjusts operational density. The earlier `lesson.css` is retained as unused exploratory source.
- [`assets/`](assets/) contains original vectors and local copies of approved V3 artwork. The landing hero now uses the user-supplied `learning-atlas-hero.svg`, without a surrounding panel. The earlier `public-learning-atlas.svg` and generated `learning-still-life.webp` are preserved as unused iterations. Assets are served locally.

## Visual correction after review

The initial Phase 0B interpretation was rejected; the corrected revision was
subsequently approved on 4 October 2026. See [the correction record](visual-correction-record.md)
for the specific regressions, restored components, generated-image provenance
and full generation prompt. Phase 0A source remains unchanged.

The lesson now directly preserves V3's rails, breadcrumb, disclosure, compass,
media composition, resource row, typography and final clear-glass controls.
Landing uses an original detailed SVG composition, smaller headings, tighter
section rhythm and a near-white block preview instead of a large dark panel.
The three landing primary actions share `#C44216` (white contrast 5.07:1),
including hover, focus, visited and pressed states; neutral shadows and movement
provide interaction feedback without changing the fill. The course label reads
“Explore our courses,” with pilot availability explained separately. The lesson
preview action uses a neutral translucent-white glass treatment and fine border.
`lesson-rail-refinement.css` aligns all four course badges, uses a neutral route
connector and extends the active background 10 px left without moving its badge.

## Deliberate surface differences

- **Public landing:** asymmetric editorial narrative, programme route and institutional proof language; no dashboard composition or invented statistics.
- **Student lesson:** persistent course route, continuous reading canvas, widened media, quiet resource treatment, inline language controls and a mobile course-map dialog.
- **Admin workbench:** Academic Instrument restraint; dense hierarchy/canvas/inspector composition, opaque forms, protected-field explanations and deliberate publish/destructive confirmations.
- **Assessment:** neutral split stimulus/response instrument, Exam-mode timer and navigation, restrained feedback and results evidence. Exam mode removes learning help and decorative motion, while retaining the same glass answer controls.

Academic Instrument supplies restraint in the admin and assessment surfaces. Living Language Studio contributes only the more expressive listening/media moment; it does not change the product shell.

## Prototype interactions

### Final assessment refinement: personal annotations

The four-surface visual direction and the final assessment annotation refinement
were visually approved on 4 October 2026. Approval closes the design laboratory;
it does not authorise production implementation.

Open `assessment-feedback.html?annotations=4`. Annotation code and styling are
isolated in `assessment-annotations.js` and `assessment-annotations.css`; the
same engine is reused by the separate `listening-annotation-specimen.html`.

- **Exam mode:** Highlight, Add/Edit note, Remove highlight and Remove note apply
  to arbitrary eligible passage/context/question text ranges. No Writing answer
  editor receives annotation controls. Underline is not offered or rendered in
  Exam mode. Practice underlines are retained in tab-session state and reappear
  only when learning mode is restored.
- **Learning/practice:** Highlight, distinct double-rule Underline, Add/Edit
  note, Remove annotation for the exact selected range, and Clear annotations with
  an explicit confirmation. Removing a highlight alone keeps its attached note.
- **Personal, not assessed:** a translucent marker, double-rule underline, inline
  N note buttons, accessible annotation-type names,
  a note count and a notes/marks drawer distinguish annotations from answers and
  correctness. They never change answer values, completion, scoring or feedback.
  A separate annotation-only array uses sessionStorage to survive same-tab
  prototype navigation; no localStorage, network, database, answer inspection or
  scoring architecture is involved. This is not production persistence.
- **Genuine selection model:** the previous implementation replaced three exact
  strings with buttons, which is why other words could not be selected for
  annotation. That model and its hover underline have been removed completely.
  Browser Selection/Range now captures start/end character offsets and the exact
  quote within an eligible whole passage or question-prompt root. No sentence IDs,
  prepared segments or click-to-toggle text are used. A text-node walker restores
  ranges, including visual wraps and paragraph boundaries. Marks wrap only the
  selected text-node slices, preserving paragraph structure. Stored quotes and
  offsets are validated before restoration. Answer controls, labels, navigation,
  interface instructions and Writing-answer editing are excluded.
- **Tools:** drag to select any word or phrase. The compact floating panel is
  placed above or below the selected range, never on the selected words. When
  there is insufficient room, a modal sheet repeats the exact quote. Normal
  clicks do not annotate anything. Clicking tool buttons preserves the captured
  range; applying a mark clears the temporary blue browser selection so it cannot
  be confused with saved amber marking. Escape/outside click dismiss without
  altering the text. Partial overlaps are rejected with an explanation; an exact
  existing range can combine a highlight, practice underline and note.
- **Anchored notes:** saved note text remains marked, with a compact N button
  immediately after its exact range. Either the marked words or N reopens the
  note for editing/removal. The secondary notes index lists excerpts, notes,
  edit/delete actions and Go to text, which scrolls to and briefly outlines the
  exact source. No permanent note box interrupts passage paragraphs.
- **Keyboard and mobile:** Tab to an eligible text region, use arrows to move
  the selection caret and Shift+arrows to extend it (Ctrl/Alt for word steps),
  then Alt+A or Shift+F10 to focus annotation commands. On narrow screens native
  selection remains active until the reviewer chooses the compact “Annotate
  selection” launcher; an accessible bottom action sheet then shows the exact
  quote and commands. Notes have directly focusable inline buttons.
- **Preservation:** marks and notes survive question links, stimulus/question
  switching, mode changes, immediate/group feedback and detailed review in the
  same page. “Review personal annotations” opens the same notes/marks drawer.
  Reloading and leaving/returning through the review index retain annotations
  in the same tab session. Clear annotations explicitly removes them. Browser
  session restoration may retain sessionStorage; do not treat closing a tab as a
  security guarantee. Unsaved note drafts are discarded when the tool is closed.
- **Accessibility:** semantic buttons, labelled note field, live creation and
  removal announcements, offset blue focus, explicit modal Tab wrapping,
  Escape and focus return. Commands are at least 44 px tall; inline N anchors
  are 24 × 24 px with surrounding space. Marker
  colour is separate from green/red/partial/pending feedback; double warm-ink
  underlining differs from links, wavy spelling indicators and blue focus.
- **Preferences:** system reduced-motion and reduced-transparency rules are
  supported. “Reduce motion” and “Use solid annotation surfaces” provide local
  review equivalents. Exam mode suppresses annotation entrance motion. The
  reading canvas and note editor remain opaque.

#### Official-feature boundary

Verified on 4 October 2026: official IELTS parity in this prototype currently
includes highlighting and note-taking. Sources: British Council,
[How can I highlight and make notes on a computer?](https://www.britishcouncil.org.bd/en/exam/ielts/prepare/explaining-ielts-computer/highlights-notes)
and [Explaining IELTS on Computer](https://www.britishcouncil.org.bd/en/exam/ielts/prepare/explaining-ielts-computer).
These establish the feature family, not pixel-for-pixel or platform-version
parity. Underline is restricted to general learning/practice pending verification
for the targeted IELTS-on-computer profile; this is not a claim that every IELTS
product lacks underlining. Listening is demonstrated only in the separately
labelled interaction specimen, with instructions, an illustrative audio state
and questions. It contains no transcript or answer-revealing text in Exam mode.

#### Annotation review checks

- Revision 4: genuine mouse-drag single-word and wrapped multiword selections
  tested in first, middle and final Reading paragraphs, plus keyboard selection
  in a question prompt. Exact marked text was inspected after each operation.
- Tested saving/reopening/editing/deleting an anchored note, individual removal,
  overlap rejection, clear confirmation/cancellation, and same-tab navigation.
- Keyboard creation, editing/removal, confirmation cancellation, clearing,
  Escape/focus return, mode switching and feedback preservation exercised.
- Answer values and the displayed completion state compared before/after
  annotation changes: unchanged.
- Revision 4 desktop 1440, tablet 768, 400 × 755 and 320 × 755 checks: no
  horizontal page overflow; narrow note sheets also have no internal horizontal
  overflow. Pointer selection at 400 px opened the launcher and action sheet.
- Marker uses `rgba(246,205,79,.38)` over the opaque reading canvas with ink
  `#171714`: measured contrast 15.12:1 on warm paper and 15.27:1 on white.
  Temporary blue selection with white text measures 6.58:1; the inline N glyph
  on its pale note surface measures 8.71:1.
- Reduced-motion review reports no annotation animation; solid-surface review
  reports an opaque background and no backdrop filter. System-media rules are
  also present; native assistive-technology, OS preference integration and real
  mobile keyboard testing remain production acceptance checks.
- Current ignored captures: `range-annotations-desktop.jpg`,
  `range-annotations-mobile-400.jpg`, `range-annotations-mobile-320.jpg`,
  `range-toolbar-desktop.jpg`, `range-notes-index.jpg`,
  `feedback-actions-desktop.jpg`, `feedback-actions-mobile-400.jpg`, and
  `feedback-actions-mobile-320.jpg` in `screenshots/`. Previous `annotations-*`
  captures are superseded.
- JavaScript syntax, explicit HTML nesting/unique IDs/local asset links, PostCSS
  parsing, lint, build and `git diff --check` passed. Browser error/warning logs
  were empty. Build-only `next-env.d.ts` edits were restored. A 320 px modal
  Tab/Shift+Tab loop and Escape return to the source region were verified.

#### Feedback action spacing correction

The feedback grid and its following action row had no separating block margin;
the row's generic flex gap only separated buttons from each other. Shadows made
the adjacent boxes appear to collide. The assessment-only stylesheet now places
the row in normal flow with `--s8` (32 px) separation on desktop/tablet and `--s6`
(24 px) at narrow widths. Desktop buttons remain aligned; mobile buttons stack
with `--s3` between them. No negative margin, row transform or absolute position
is used. Measured card heights varied from 119–195 px across mobile widths while
the 24 px separation remained intact; the desktop/tablet gap measured 32 px.

Other surface interactions:

- Global reduced-motion demonstration
- Native modal dialogs with Escape, backdrop close and focus return
- Student course-map sheet, transcript/resource reveals and dynamic-height field note
- Admin block selection, inspector tabs, approved block picker, responsive preview switcher, lock explanation, save state, publish confirmation and destructive-action cancellation
- Assessment immediate feedback, group results, flag-for-review, mobile stimulus/question switching, inline native selects and typed gap, and Exam mode

These interactions illustrate presentation states only. The HTML contains authored demonstration content, not production answer keys. No response is inspected, scored, sent, stored or authenticated. A production assessment must keep keys and unreleased feedback outside the client payload.

## Accessibility and responsive intent

- Semantic landmarks, native controls, native dialogs and explicit labels are preferred.
- Primary controls use 44–48 CSS px targets. Compact text-navigation links retain the approved V3 geometry; a full touch-target audit remains an acceptance gate.
- Focus uses a high-visibility blue ring with offset and remains stable through disclosures and dialog close.
- Feedback uses icon, text and position as well as colour.
- Inline gaps contain the real input or select and preserve punctuation outside the control.
- Mobile assessment switches intentionally between stimulus and questions; it does not squeeze the desktop split view.
- `prefers-reduced-motion`, `prefers-reduced-transparency`, `prefers-contrast` and forced-colour fallbacks are present.
- The target review matrix is 320, 400 × 755, 768, 1024, 1280, 1440, 1680, 1920/2048 CSS pixels and native 200% zoom.

## Course themes

The index demonstrates IELTS, General English, Cambridge and EAP. A course theme may change route, illustration, monogram and contextual badge colour. It does not replace the signature orange, action colour, semantic states, type system, geometry or interaction patterns.

## Validation evidence

- All four surfaces were checked at 320, 400, 720, 768, 1024, 1280, 1440, 1680, 1920 and 2048 CSS-pixel widths with no horizontal page overflow or broken local images. The 720 px pass is the 1440 px / 200% reflow equivalent.
- Dialog Escape/focus return, disclosure state, inspector tabs, block selection, feedback focus, Exam mode and reduced-motion presentation were exercised in-browser.
- Visible mobile controls have accessible names. Product control or enclosing choice-label targets measure at least 44 × 44 CSS pixels.
- Measured contrast includes white on action orange at 5.38:1, white on its lighter gradient endpoint at 4.69:1, ink on paper at 17.83:1, muted ink on paper at 6.58:1 and semantic state text on its tint between 5.33:1 and 6.77:1.
- JavaScript syntax, SVG XML, local links, CSS brace structure, lint, production build and whitespace checks pass. The browser console stayed clear during the review matrix.
- Raw screenshots are ignored review evidence. Native assistive-technology, hardware-level reduced-transparency and browser-toolbar zoom checks remain production/human-review gates.

## Screenshots

Raw browser captures belong in `design/phase-0b/screenshots/`, which is ignored. They are reproducible review evidence and are not prepared for commit during this milestone.

Use the `revised-*.jpg` captures for this review. Earlier PNG captures are
superseded. The revised captures come directly from the browser viewport, including
actual 400 CSS px mobile rendering; they are not cropped desktop layouts.
The subsequent vector/button/rail refinements are captured in
`refined-vector-hero-desktop.jpg`, `refined-vector-hero-mobile.jpg` and
`refined-course-rail.jpg`. Both affected pages were rechecked at 320, 400, 1024,
1440 and 1920 px without horizontal overflow.
Reproduce by serving the lab, setting the browser viewport, navigating to the
surface, waiting for the opening transition to settle and saving a screenshot.
For lesson details use `?capture=measures`, `?capture=media` or
`?capture=v3-q3`. These URL states do not score or persist responses.

Revision checks: all four surfaces at 320, 400, 768, 1024, 1280, 1440, 1680, 1920
and 2048 CSS px report no horizontal page overflow and no broken images.
HTML nesting/IDs/local files/image alternatives, PostCSS parsing, JavaScript
syntax, SVG XML, lint and build pass. Build-only `next-env.d.ts` changes were
restored. Native 200% zoom, full screen-reader testing and OS-level reduced
transparency still require acceptance testing; viewport reflow is not a substitute.

Suggested names:

```text
public-desktop.png
public-mobile-400.png
lesson-desktop.png
lesson-mobile-320.png
admin-wide.png
admin-mobile-review.png
assessment-split.png
assessment-immediate-feedback.png
assessment-group-results.png
assessment-strict.png
index-theme-specimen.png
index-vector-glass-specimen.png
```

### Assessment timer dial refinement

The remaining-time badge now uses the original `assets/assessment-timer-dial.svg`:
a finely graduated porcelain dial, 60 minute indices, longer hour indices,
sculpted ink hands, a restrained orange needle and a small layered centre pin.
It is a static decorative symbol, not a wall clock or a second source of timing
information. The adjacent digital figure remains authoritative visually and is
exposed through the existing accessible timer name. The icon is hidden from
assistive technology, has no animation, and remains visible at 320 px in Exam mode.
Learning mode is untimed and hides the whole timer badge.
The displayed 18:42 is still a fixed prototype specimen; this refinement adds
no countdown, expiry, submission or production behaviour. A genuine countdown
and its accessible announcements require separate production implementation.
Checked at 1440, 768, 400 and 320 px: dial loads and stays visible, no horizontal
page overflow, and the timer retains its accessible name without adding a Tab
stop. SVG XML, CSS parsing, lint, build and whitespace checks pass. Ignored review
captures: `timer-dial-desktop.jpg`, `timer-dial-detail.jpg` and
`timer-dial-mobile-320.jpg`. The approved timer remains illustrative only.

### Compact assessment mode controls — final review refinement

Learning mode and Exam mode remain native radio choices with arrow-key
operation and a programmatically exposed checked state. They form a balanced,
equal-width segmented control inside one fine-bordered porcelain/glass container.
The inactive segment has its own pale tint and border, never a plain-text or
disabled appearance. There are no check marks, visible legend, permanent help row
or comparison table. A raised, fine-edged glass surface and short orange accent
identify the selected option independently of colour alone. Keyboard focus has
a separate visible outline. Compact tips explain the available tools on pointer
hover, keyboard focus or tap. Escape, moving focus away, or clicking outside
dismisses the tip without changing the selected mode; tips remain hoverable.
The legend and mode-change announcement remain available to assistive technology.

Learning mode is untimed: the entire timer badge is hidden. Exam mode alone
shows the timer specimen. The lab documentation records that it is fixed rather
than a running countdown. “Pause practice” remains removed: it was an unwired placeholder,
not a mode selector or functional pause. Switching retains answers and annotations;
Exam mode hides practice underlines, answer checks and explanations. Returning
to learning restores them. The same glass backgrounds, borders and selected-state
shadows now apply to both modes, including T/F/NG and multiple choice. Exam mode
still suppresses decorative motion; the selector uses a restrained 180 ms state
transition with reduced-motion equivalents. All assessment-facing labels, tips,
annotation instructions and live announcements say “Exam mode”; internal
`strict` state names remain unchanged. No timing, submission or scoring logic added.

Review checks: native arrow-key selection and visible focus; Escape and outside
dismissal; timer visibility in each mode; computed-style parity for all eight
T/F/NG and multiple-choice options; 44 px mode targets; no horizontal page overflow
at 1440, 768, 400 and 320 px. Mobile tips stay within the viewport. Reduced-motion
control suppresses transitions. Reduced-transparency and forced-colour fallbacks
are defined; OS-level preference and physical-device/screen-reader testing remain
separate acceptance checks. Updated ignored captures: `mode-tooltips-desktop.jpg`,
`mode-strict-glass.jpg`, `mode-glass-mobile-320.jpg` and `mode-header-review.jpg`.
These supersede the previous `mode-controls` / `mode-help` captures.
HTML parsing, local asset/description references, unique IDs, JavaScript syntax,
CSS parsing, lint, build and whitespace checks pass. Browser console has no
warnings or errors during these checks. Mode/tooltip text contrast is at least
6.3:1 for the muted copy and 17:1 for ink on the porcelain surface.
Build-only `next-env.d.ts` changes were restored. No commit or push was made.

Latest segmented-control review: both selected states captured at 1440, 400 and
320 px in `screenshots/segmented-{learning,exam}-{1440,400,320}.jpg` (ignored).
Desktop header crops use `segmented-{learning,exam}-desktop-header.jpg`. Equal
segment widths and 44 px targets were verified in each state, with no overflow.
Arrow keys, selected radio state, focus outline, tooltip dismissal, timer/feedback
visibility, annotation restoration and reduced-motion behavior pass. Minimum
measured selector text contrast is 5.2:1 and boundary contrast exceeds 3:1, including
the solid fallback palette. OS-level reduced-transparency and physical-device
screen-reader checks remain manual follow-ups. Lint, build, CSS parsing, JavaScript
syntax, HTML/reference checks and whitespace checks pass; no console warnings/errors.

### Reading and Listening modality separation

The Reading assessment no longer creates or displays a Listening disclosure.
Its annotation roots are declarative and limited to the Reading passage and
three Reading question prompts. The reusable range engine now registers any
explicitly eligible `data-annotation-key` region, allowing the separate
`listening-annotation-specimen.html` to use the same highlighting, note anchoring,
underline gating, persistence and accessibility behavior without entering the
Reading flow. Each modality uses a separate session-only annotation storage key.

The review index labels Listening as a separate interaction specimen. That page
provides Listening instructions, an illustrative audio/player state and Listening
questions; annotation is limited to the displayed instructions and prompts. It
does not expose a transcript or answer-revealing content. It is intentionally not
a complete Listening assessment.

In Reading Learning mode, the explanatory Evidence route remains available. In
Exam mode the Evidence route, lab banner, prototype copy, learning feedback and
other specimen material are hidden, leaving the passage, questions, navigation,
timer, flagging and permitted personal annotations. Switching modes preserved
the selected answer and highlight; the practice underline was hidden in Exam mode
and restored in Learning mode. Browser checks at 1440, 400 and 320 px found no
Listening content in Reading, no explanatory specimen content in Exam mode and
no horizontal overflow. Separate Listening checks at the same widths also passed.
Ignored Reading captures: `reading-learning-modality-desktop.jpg`,
`reading-exam-modality-desktop.jpg`, `reading-{learning,exam}-{1440,400,320}.jpg`.

## Known limitations

- Media, PDFs and recording states are representative; the Listening specimen supplies no transcript.
- The timer is static and does not produce live-region chatter.
- Save, publish, delete, progress and completion actions do not persist.
- Feedback and results are authored visual states; the prototype is not a secure scoring implementation.
- Browser validation is not a substitute for production VoiceOver, NVDA, switch-control, low-end device, media-rights or security testing.
- The admin mobile view is intentionally limited to review and simple-edit presentation; complex structural composition recommends a larger screen.
- Copy is realistic pilot content but remains demonstration material rather than an official examination item.

## Production gate

Phase 0B received visual approval on 4 October 2026. That approval covers only
the browser-viewable design laboratory. Production CSS redesign, component
migration, route changes, mock-test work and feature implementation remain
separate milestones requiring explicit authorisation.

## Closeout and reproducibility

- Browser-viewable HTML, CSS, JavaScript and original SVG source is committed;
  the `screenshots/` directory remains ignored because its audit captures are
  reproducible from the source.
- The committed laboratory contains no production imports, application routes,
  migrations, Supabase configuration, authentication changes, environment files
  or secrets.
- Local links, HTML references, JavaScript syntax, CSS structure and SVG XML were
  checked at closeout together with the repository lint, production build and
  whitespace checks.
- Source assets were reviewed for accidental temporary content and size. No
  committed Phase 0B file exceeds 1 MB; unused visual iterations retained for
  provenance are identified under **Shared prototype system** above.
