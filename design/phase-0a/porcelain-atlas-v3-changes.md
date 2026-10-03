# Porcelain Atlas V2 → V3 refinement record

V1 and V2 remain unchanged. V3 is a separate Phase 0A visual study and is not imported by the production application.

## Visual-review refinements

- Final approved refinement (4 October 2026): neutral near-white outer canvas, `#FFFEFD` reading/practice surfaces, clear untinted glass-style selects and choice controls, fine light edges and preserved keyboard-focus rings. V3 is visually selected; Phase 0B remains unstarted and production implementation needs separate approval.
- Glass-material pass: introduced a separate prototype-only material stylesheet for navigation shelves, course-map dialog, route inset and floating media controls, with bright edges, translucent fills and warm layered shadows. The reading canvas, questions and critical feedback remain opaque.
- Added an original static light-route backdrop and a detailed glass compass for exam tips. Updated the four-skills diagram with pearlescent panels and a shaded ink centre while retaining the approved simple skill silhouettes.
- Added explicit opaque fallbacks for unsupported backdrop filtering, reduced transparency and high-contrast mode. No continuous animation or pointer-tracking effects were introduced.
- October 4, simplified skill family: four original SVGs use a bound book, cushioned headphones, a microphone and a writing page. The supplied stock image informed the preference for simple silhouettes; no source pixels or paths are used.
- Shared the same drawings across the lesson tiles, Evidence route, Evidence planes and icon-family specimen. Added a large four-skill study for review.
- Refined the skill tiles with local tints and soft light edges, the lesson-route inset, course monogram, section markers, resource surface and floating transcript controls. Added a static 4/6 practice-progress ring that mirrors the existing demonstration count. Typography and teaching content are preserved.
- Replaced the breadcrumb pin with a precisely centred atlas waypoint, including a centred focal dot and quiet coordinate guides.
- Simplified Listening to a literal headphone silhouette with an internal sound trace; no human head or ear anatomy is needed to decode it.
- Redrew Speaking as a clear learner portrait with an eye, mouth, shoulders and outward voice paths, and redrew the compact Writing mark as ruled text with a pencil.
- Applied the revised Listening, Speaking and Writing language consistently to the live lesson, both four-skills alternatives and the icon-family specimen.
- Native select menus now keep the placeholder deliberately emphasised while rendering real options at a regular weight. A chosen answer also returns to the regular interface weight.
- Disclosures now read as intentional toggle objects: an inset teaching-note marker, balanced left/right padding, a contained indicator, and aligned open-panel text replace the earlier edge-to-edge rules.
- The active course-rail lesson no longer uses an orange inset sideline. A quiet plum surface, hairline edge and small contact shadow communicate selection, while the sticky rail has a slightly clearer elevation.
- Rebuilt the Reading, Listening, Writing, Speaking and Resource symbols around literal learning actions: open book, learner with headphones, hand and pen, speaking profile with voice paths, and governed folder/document.
- Rebuilt both four-skills illustrations with the same clearer symbol family. SVG filters now affect only background planes, never whole text/icon groups, preserving sharp strokes and labels.
- Enlarged the Evidence Profile capsule, corrected its internal spacing and removed the filter rasterisation that allowed the previous label to appear soft or escape its container.

## Composition and width

- Rebuilt the large-screen shell to use up to 94% of the viewport, with a 240–276 px course rail, flexible central canvas, 190–224 px page rail, and 18–30 px responsive gaps.
- Preserved readable prose at approximately 62–74 characters while allowing the hero, four-skills graphic, media, questions, and group feedback to use the wider lesson canvas.
- Reduced the visual weight of both side rails. At compact desktop the page index disappears; at tablet the course rail becomes a native modal course map; mobile becomes one deliberate reading stream.

## Brand and colour

- Kept vivid coral-orange `#F15A2A` as the signature and introduced `#BD4013` as the measured white-text interaction colour.
- Selected deep aubergine/plum as the global supporting colour. It gives the editorial system more distinction and reduces cobalt coverage.
- Reserved cobalt for IELTS course identity, selected evidence details, and course-route context. Semantic correct, incorrect, partial, and pending colours remain independent.
- Preserved all three tested relationships—restrained cobalt, aubergine, and petrol—in the specimen page for review.

## Navigation, surfaces, and elevation

- Replaced the plain breadcrumb with a compact glass route shelf: a custom atlas marker, fine chevrons, distinct current page, shortening on compact widths, and an accessible full-path disclosure on mobile.
- Added glass only to floating navigation and control clusters. Prose, questions, answers, and critical feedback remain opaque.
- Defined four elevation levels: flat editorial canvas; delicate selected-content lift; floating controls; sticky navigation/dialogs/feedback sheets.
- Added solid fallbacks for unsupported backdrop filtering and reduced-transparency preferences.

## Controls and assessment

- Changed primary actions to white on the darker interaction orange with a restrained highlight, contact shadow, compact geometry, and distinct hover, press, focus, and disabled states.
- Placed the real typed-gap input directly inside the sentence, with punctuation outside the field and a full screen-reader label.
- Removed visible “Gap 1 / Gap 2” labels from summary completion while retaining explicit accessible names.
- Reworked word-bank chips to demonstrate available, focused, selected, and used states.
- Refined native selects around content-sized widths, custom indicators, sentence baselines, phrase-aware wrapping, and mobile line flow.
- Kept all feedback pre-authored: no answer keys, response inspection, scoring, authentication, or persistence exists in the prototype.

## Motion and vector language

- Replaced fixed-height disclosure animation with a dynamic grid-row reveal: 260 ms open, subtle 8 px translation, shorter perceived close, stable trigger focus, and instant reduced-motion behaviour.
- Rebuilt the four-skills system as a coherent original family with reading planes, an evidence waveform, constructed writing path, intersecting dialogue geometry, route markers, checkpoints, insight, and resource symbols.
- Added two full four-skills illustration alternatives: Evidence route and Evidence planes.
- Added three callout meanings: Evidence lens, Strategy compass, and Timing marker.

## Ideas matured from Inspire Upper-Intermediate

The earlier application was reinspected at the live site and source revision `d06e52c599bf2e3f454751445a7fee51f4760e2e`. V3 borrows teaching rhythm, not its design, code, insecure client behaviour, or mobile limitations.

| Original idea | Earlier weakness | Mature Porcelain Atlas interpretation | V3 location |
|---|---|---|---|
| Different activities have strong visual identities | Identity often depends on many colours, repeated cards, or emoji-like marks | A shared geometric icon family gives Reading, Listening, Writing, Speaking, resources, strategy, and feedback distinct but related identities | Skill index and icon specimen |
| Section labels and animated entry create momentum | Staggered animation and decorated sections can compete with reading | Small numbered route markers and one progress line establish rhythm without animating every block | Lesson sections and course route |
| Toggle/reveal content supports progressive teaching | Earlier toggle motion uses a simple content animation and can snap with changing height | Dynamic-height disclosure with stable focus, restrained lift, precise indicator motion, and reduced-motion equivalence | Skill-band field note and feedback explanation |
| Check, explain, and try-again forms a useful practice cadence | Correct answers and scoring are client-side; wrong answers shake and answers can reveal immediately | Fixed visual feedback demonstrates a supportive hierarchy, detailed strategy, group state summary, and focus return without scoring or keys | Question 1 and group review |
| Practice types benefit from quick visual recognition | Phone-first card density and fixed bottom navigation constrain desktop | Wide assessment rhythm, clear type labels, and compact controls use desktop space while reflowing intentionally on mobile | Practice group |

## Prototype boundary

V3 remains a visual and interaction prototype. It does not establish production tokens, settle unresolved product decisions, implement secure assessment, or authorise application migration. Native assistive-technology testing and production performance budgets remain future gates.
