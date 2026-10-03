# Visual Product, Block System, and Assessment Engine Design Brief

**Status:** Draft for approval — research and design analysis only

**Audit date:** 3 October 2026

**Scope boundary:** This document proposes a product direction. It does not authorise implementation, schema changes, migration changes, remote database work, or changes to the roadmap.

## 1. Executive design vision

The English Learning Platform should become a **premium learning publication with institutional discipline**, not a decorated dashboard. Its visual identity should combine the confidence of an academic press, the clarity of a precision instrument, and the warmth of a thoughtful teacher. Warm porcelain, deep ink, and a rich orange signature create continuity across the product; controlled course palettes, original diagrams, and editorial composition give each learning programme an appropriate voice.

The product has three distinct jobs:

1. **Learning:** give a student one calm, legible path through explanation, practice, feedback, and reflection.
2. **Authoring and governance:** let administrators build expressive courses without compromising structure, permissions, accessibility, or brand integrity.
3. **Assessment:** deliver format-independent activities whose meaning, scoring, feedback, and security remain stable even when an examination provider changes its interface or task inventory.

The system should therefore be designed as three cooperating layers:

- a global product shell and token system;
- a versioned, registry-driven content-block system;
- a versioned assessment-capability engine with exam profiles composed from reusable primitives.

“iOS-inspired” should mean precision, responsiveness, restraint, layered information, excellent states, and coherent motion—not copied controls, constant glass, or phone-only composition. The platform must remain credible when a university procurement team, a teacher, and a seventeen-year-old learner see it on the same day.

### Design success criteria

- A lesson is recognisably part of the same platform as an admin workspace, without making both screens look alike.
- The student can always answer: *Where am I? What should I do now? What did I learn?*
- Administrators get creative range through governed variants, not arbitrary HTML, CSS, or JavaScript.
- Course identity is strong but never overrides accessibility or fragments the master brand.
- Examination tasks are provider-profile configurations, not hard-coded page types.
- Correct answers and private feedback never arrive in the browser before their release policy permits them.
- Desktop, tablet, and mobile each have an intentional information architecture.

## 2. Audit of the current platform

### Evidence inspected

- Repository structure, recent Git history, project operating guidance, roadmap, and existing documentation.
- Landing, authentication, dashboard, admin organisation/course/cohort/module/lesson/block flows, membership management, and student learning routes.
- Global styles and their responsive and reduced-motion rules.
- Existing text, private Supabase PDF/video, and Google Drive media rendering and authoring flows.
- Current database-facing types and security boundaries as expressed by the application and existing migrations; no migration was changed.
- Desktop and mobile renderings of the landing and authentication experiences, plus source-level review of admin and student layouts.

**Access boundary:** The browser session available for this audit was not authenticated, so protected current-platform admin and student pages were not re-entered with test credentials. Their route composition, states, controls, responsive styles, and authorisation flows were audited from the repository rather than represented here as a fresh authenticated visual test. No credentials were requested or invented.

### What is already strong

- Server-side role and hierarchy checks are treated as product invariants, not UI affordances.
- The admin content hierarchy is explicit: organisation → course → module → lesson → block.
- The student interface is constrained to published, enrolled course content.
- Private media, signed access, safe plain-text rendering, and locked core content provide a sound trust foundation.
- Form states, helpful errors, focus treatments, mobile breakpoints, and reduced-motion handling are present.
- The current large editorial headings, generous spacing, rounded controls, and near-white field point in a more premium direction than the earlier application.

### Product and visual gaps

| Area | Finding | Consequence | Direction |
|---|---|---|---|
| Brand | The current violet/cobalt/peach atmosphere is polished but does not yet express a distinctive English-learning institution. Orange is not the memorable signature. | The product can be mistaken for a modern general-purpose SaaS product. | Establish porcelain + ink + warm orange as the master system, then use controlled course accents. |
| Shell | Landing, auth, admin, and learning reuse similar frosted cards, pills, and radial atmosphere. | Roles and tasks lack distinct spatial character. | Share tokens and primitives, but give learning, assessment, and operations different compositions. |
| Navigation | Student routes expose the hierarchy, but there is no mature course rail, lesson table of contents, or previous/next learning rhythm. | Orientation will weaken as courses grow. | Add a responsive course navigator and lesson-local navigation model. |
| Landing | The large editorial statement is confident; its current actions read visually as calls to action but do not form a complete product journey. | Strong first impression without enough evidence, audience differentiation, or action clarity. | Use an institutional editorial hero, outcome evidence, programme families, and purposeful next actions. |
| Authentication | Clean and accessible, but visually follows a familiar centred SaaS card pattern. | Low differentiation at a high-frequency entry point. | Use a split editorial/institutional composition on wide screens and a calm focused form on mobile. |
| Dashboard | User identity and role are clear, but the page is an account gateway rather than a learning command centre. | Limited sense of continuity, progress, or next action. | Design role-aware “continue” logic and quiet progress evidence later, without turning it into a widget wall. |
| Admin | Functional card grids and forms support the hierarchy well, but repeated containers make organisation, course, content, and membership tasks feel equivalent. | Operational hierarchy and risk are visually flattened. | Use a dense but calm workbench: navigator, canvas, inspector, preview, and explicit publish state. |
| Lesson | Unified text/PDF/video ordering is a strong foundation, but technical labels and repeated cards do not yet create an editorial reading experience. | Blocks feel like database records rather than a composed lesson. | Let blocks participate in a readable page rhythm while preserving visible author controls in edit mode. |
| Block model | Existing UI supports text, private/Drive PDF, and video; the database enum anticipates more, while JSON content is type-specific and ad hoc. | New blocks risk inconsistent schemas and bespoke renderers. | Introduce versioned block envelopes, a registry, schema validation, capabilities, and safe migrations. |
| Course identity | Course family and level are data, not yet a coherent visual system. | IELTS, General English, and EAP cannot signal different learning contexts gracefully. | Apply controlled course tokens to hero, progress, illustration, and accents—not arbitrary component colours. |
| Feedback | Success and errors are clear operationally; learning feedback has no mature policy or visual language yet. | Assessment expansion could produce inconsistent or punitive states. | Define semantic feedback tokens, release policies, and layered explanation patterns first. |
| Illustration | There is no reusable icon, diagram, vector, or illustration language. | Pages depend on cards and typography for all differentiation. | Build an original vector system for language, pathways, evidence, and examination contexts. |
| CSS architecture | A large global stylesheet contains tokens and many page-specific patterns. | It can become difficult to evolve variants without regressions. | In implementation, progressively separate tokens, primitives, compositions, and block-specific styles. |

### Current-state conclusion

The current product is technically ahead of its visual grammar. It should retain its calm typography, security discipline, generous spacing, and robust states, while replacing the “same premium card everywhere” pattern with more editorial learning pages, a more purposeful operational workbench, and a dedicated assessment environment.

## 3. Comprehensive audit of the earlier teaching application

### Resources and method

- Rendered application: [Inspire Upper-Intermediate Hub](https://ma-jalali.github.io/Inspire-Upper-Intermediate/)
- Source repository: [Ma-Jalali/Inspire-Upper-Intermediate](https://github.com/Ma-Jalali/Inspire-Upper-Intermediate)
- Repository revision inspected: `dd7e1505f07a43461a79e9cfe0eec599c8ba341b`
- The live navigation, units, parts, selected content pages, practice tools, interactive states, and desktop/mobile behaviour were inspected.
- The single-file source and the public content tree were inspected read-only to identify content and interaction types that are not obvious from the homepage. No remote data was changed.

**Access boundary:** The application and its public content tree were accessible. Hardware-dependent microphone recording, haptics, and every third-party media file were not executed end to end; their interfaces and implementation were inspected from source. Empty or partial published pages are recorded as findings rather than treated as inaccessible content.

The earlier application is a remarkable teaching notebook: it puts a wide repertoire of classroom ideas close to the learner, with low authoring friction. Its strongest contribution is not its visual system but its **teaching cadence**—explain, expose, practise, check, revisit. The mature platform should preserve that immediacy while replacing its trust, scale, accessibility, and layout constraints.

### Content footprint observed

- 56 accessible pages across the course overview, tools, podcasts, weekly schedule, and ten units with Vocabulary, Grammar, Extra Reading, and Songs parts.
- 1,304 published content blocks observed: headings, text, callouts, dividers, lists, tables, toggles, audio, video clips, links, tabs/tab pages, quizzes, readings, images, and embeds.
- 593 question records observed: per-gap dropdowns, typed gaps, multiple choice, and matching.
- Some later-unit areas and song/reading pages are empty or partial. The mature platform needs intentional empty, draft, scheduled, and unavailable states rather than silent blanks.

### Educational concepts worth carrying forward

- A visible unit/part journey with short, focused practice opportunities.
- Vocabulary, pronunciation, grammar, reading, and exam practice as related modes rather than disconnected products.
- Mistake review and “try again” loops.
- Teacher announcement, homework, exit-ticket, and live-class concepts—later expressed through admin-created teacher slots.
- Reading with audio, vocabulary support, questions, and print fallback.
- Reusable templates, nested pages, course-wide tools, and direct deep links.
- Timers and speaking rehearsal for exam preparation.
- A quick sense of momentum through progress, completion, and resume cues.

### Interaction and technical findings

**Strong:** quick navigation, compact practice loops, explanations after checking, variable per-gap option counts, multiple label styles, shared vocabulary tools, print/worksheet affordances, and a broad classroom-informed repertoire.

**Weak:** answer keys and scoring live in the client; authoring relies on a client-side PIN and public client data; progress and attempts are device-local; semantics and keyboard handling vary; drag-oriented interactions lack equivalent controls; feedback is inconsistent and often reveals answers immediately; visual density, glass, colour, animation, and bottom navigation compete for attention.

**Mobile assumptions:** fixed bottom navigation, narrow stacked cards, swipe gestures, haptic/sound cues, and modal sheets work as a personal phone app but do not scale directly to desktop instruction, institutional administration, split-screen reading, or keyboard-heavy assessment.

**Desktop limitations:** the experience often remains a centred enlarged phone column. It does not take advantage of side-by-side passage/question layouts, persistent course navigation, inspectors, compare modes, wide tables, or teacher review surfaces.

**Accessibility risks:** generic interactive containers, inconsistent headings and landmarks, incomplete keyboard equivalents, reliance on motion/colour in some states, uncertain focus return after modals, limited transcript/caption governance, and no robust accessible alternative for all drag, swipe, or timed interactions.

**Technical limitations:** a roughly 1.46 MB single HTML file couples content, styling, state, rendering, scoring, and authoring; there is no durable multi-user attempt model, versioned question schema, authoritative server scoring, institutional permission model, or safe extensibility boundary.

The mature replacement should not copy the earlier visual design, code, layout, or phone constraints. It should translate each worthy teaching idea into a governed platform capability.

## 4. Existing-component and activity audit table

Priorities mean: **Foundational** is required to establish the system safely; **MVP** is valuable in the first complete learning/assessment release; **Later** follows after the architecture is proven.

| Existing component or activity | Location in earlier application | Educational purpose | Existing strengths | Existing weaknesses | Proposed mature replacement | Priority |
|---|---|---|---|---|---|---|
| Course home | Home | Orient and resume | Immediate overview; personal energy | Dense launcher/dashboard mix | Editorial course home with one primary continuation and restrained secondary tools | Foundational |
| Progress ring/percentage | Home and units | Show momentum | Highly visible | Device-local; completion can outweigh learning | Server-backed progress evidence with scope and definition | MVP |
| Streak | Home | Encourage return | Simple motivation | Can punish interrupted learners; device-local | Optional wellbeing-safe study rhythm, not a primary achievement | Later |
| Badges | Home | Recognise milestones | Positive reinforcement | Decorative and locally derived | Criteria-based achievements with accessible evidence | Later |
| Word of the day | Home modal | Incidental vocabulary | Lightweight daily contact | Interruptive modal; isolated from course | Optional vocabulary spotlight linked to cards and spaced review | Later |
| Fixed bottom navigation | Global mobile | Fast mode switching | Thumb-friendly | Phone-specific; crowds small screens | Adaptive navigation: bottom bar only for a few student destinations; rail/sidebar on wide screens | Foundational |
| Search | Global tools | Find content | High utility | Coupled to one client document | Permission-aware global and in-course search | Later |
| Dictionary lookup | Dictionary | Support comprehension | Immediate learner autonomy | External dependency and weak provenance | Context dictionary with source, morphology, pronunciation, and saved vocabulary | Later |
| Flashcards | Cards/practice | Recall vocabulary | Familiar, fast | Local state; limited scheduling/a11y | Registry block plus saved deck and accessible keyboard/touch modes | MVP |
| Mistake review | Review mistakes | Target weak answers | Strong formative loop | Client-only; answer security weak | Server-backed retry queue generated by feedback policy | MVP |
| Sound/minimal-pair practice | Sound practice | Pronunciation discrimination | Useful specialist activity | Audio/accessibility and attempt model limited | Audio-choice and pronunciation-practice capabilities with transcript/fallback | Later |
| International-exam launcher | International Exams | Rehearse exam tasks | Relevant exam orientation | Fixed custom flows; provider changes costly | Versioned exam-profile launcher using common capabilities | MVP |
| Speaking recorder and timer | IELTS/PTE practice | Rehearse timed speaking | Prep/record/listen-back cadence | Browser/device dependence; no durable attempt/review | Recording response with device test, accessible timer, upload state, attempt policy, and teacher review | MVP |
| Grammar hub | Grammar hub | Consolidate form/usage | Course-wide reference | Separate experience from lesson context | Searchable grammar panels and practice collections | Later |
| Extra collocations | Extra Collocations | Expand lexical chunks | Valuable language focus | Separate local tool | Vocabulary/collocation collection linked to lesson objectives | Later |
| Course overview | Course pages | Explain course and resources | Clear top-level page | Same card grammar as activities | Course hero + overview sections + navigable syllabus | Foundational |
| Units and four-part structure | Units 1–10 | Organise learning sequence | Clear mental model | Fixed to one course shape | Flexible course/module/lesson navigation with optional unit labels | Foundational |
| Breadcrumbs | Unit and part pages | Maintain location | Clear hierarchy | Compact mobile-only treatment | Semantic breadcrumbs with responsive collapse and current-location announcement | Foundational |
| Previous/next page | Page footer/navigation | Continue sequence | Reduces dead ends | Weak visibility in long pages | Sticky/terminal lesson navigator with completion context | Foundational |
| Table of contents | Page tools/source | Scan long pages | Valuable for long lessons | Inconsistent exposure | Generated semantic lesson TOC with active section and mobile sheet | MVP |
| Favourite/save | Page actions | Return to useful content | Personal agency | Local-only; ambiguous save semantics | Server-backed bookmarks with scope and privacy | Later |
| Mark done | Page action | Record completion | Explicit closure | Binary local state | Progress checkpoint with clear completion criteria | MVP |
| Teacher announcement | Teacher tools/source | Timely cohort communication | Direct and contextual | Governance/auth weak | Admin-created teacher slot with announcement schema and cohort scope | Later |
| Homework | Teacher tools/source | Extend practice | Fits classroom workflow | Unversioned and local | Assigned teacher slot or assignment object with due state | Later |
| Exit ticket | Teacher tools/source | Quick formative evidence | Excellent teaching pattern | No durable aggregation | Short formative activity with teacher summary | Later |
| Live-class link | Teacher tools/source | Join synchronous class | Practical | URL safety and visibility unclear | Allowlisted external-resource slot with schedule and cohort access | Later |
| Heading | Many pages | Structure content | Frequent, legible | Visual levels can be selected decoratively | Semantic heading block constrained by document outline | Foundational |
| Rich/plain text | Many pages | Explain | Flexible | Markup and sanitisation risks | Structured rich text with restricted marks and semantic nodes | Foundational |
| Bulleted/numbered list | Lessons and tools | Sequence and summarise | Scannable | Inconsistent spacing/semantics | List node inside rich text plus standalone steps block | Foundational |
| Task list/checklist | Source-supported, rarely/never published | Guide completion | Actionable | Local state; purpose ambiguous | Checklist block with optional saved learner state | Later |
| Callout/banner | Many lesson pages | Emphasise guidance | Highly visible | Overused colour competes with hierarchy | Semantic callout variants: note, exam tip, caution, takeaway | Foundational |
| Quote | Source-supported | Highlight voice/evidence | Editorial potential | Citation model weak | Quote block with attribution and source | MVP |
| Divider/spacer | Many pages/source | Control rhythm | Simple author control | Can create arbitrary empty space | Governed section rhythm and restrained divider/spacer tokens | Foundational |
| Table | Many pages | Compare structured facts | Supports grammar/vocabulary | Mobile overflow and header semantics vary | Accessible table with headers, caption, responsive scroll or card fallback | MVP |
| Toggle/accordion | Vocabulary, podcasts, lessons | Progressive disclosure | Reduces initial density | Hidden content can be missed; save state unclear | Accordion block with heading semantics and print-expanded fallback | MVP |
| Tabs/tab pages | Grammar and content pages | Compare related views | Compact organisation | Mobile and keyboard complexity | Accessible tabs with overflow-to-select/accordion fallback | MVP |
| Reveal/answer reveal | Source-supported | Prompt retrieval before reveal | Good formative cadence | Can expose answers without policy | Reveal learning block; assessment answers remain server-policy controlled | MVP |
| Reading mode | Extra Reading | Combine text, audio, vocab, questions | Strong integrated pedagogy | Bespoke sub-application | Shared-stimulus lesson/assessment composition | MVP |
| Multiple choice | Quizzes | Recognition and discrimination | Simple check loop; explanations | Mostly 2–3 options in content; answer key client-side | Single/multiple-select meaning with renderer-independent options | Foundational |
| Typed gap | Quizzes | Recall exact language | Accepted alternatives; explanations | Normalisation/scoring simplistic | Typed-gap capability with versioned normalisation and word-limit rules | Foundational |
| Per-gap dropdown | Quizzes | Cloze/completion | Variable options per gap; very reusable | 414 records dominate; visual renderer tied to meaning | Gap response model rendered as inline/select/card/drag alternatives | Foundational |
| Matching | Quizzes | Relate features/items | Alpha/number/Roman labels; variable lists | Drag/selection and reuse rules unclear | Matching model with explicit cardinality, reuse, and non-drag alternative | MVP |
| Group check + score | Quizzes | Complete a set before feedback | Clear practice loop | Group size/feedback policy implicit | Question-group object with configurable release and retry policy | Foundational |
| Explanations | Quiz feedback | Teach after checking | Most questions contain explanations | Often only after wrong; answer revealed immediately | Layered rationale, strategy, misconception, and related revision | Foundational |
| Try again | Quiz results | Retrieval and correction | Encourages practice | No authoritative history or score policy | Policy-driven retry with immutable attempts | Foundational |
| Confetti, sound, haptics | Completion/feedback | Celebrate | Delightful in light practice | Distracting/inaccessible in serious exams | Restrained optional celebration, never in strict mode, with reduced-motion/sound control | Later |
| Image | Lessons | Visual evidence/context | Supports content variety | Alt/crop/focal governance incomplete | Responsive image asset with alt/decorative state, focal point, caption, credit | MVP |
| Gallery | Source-supported | Compare multiple images | Rich visual potential | Dense mobile presentation | Responsive gallery with ordered items, captions, lightbox, list fallback | Later |
| Supabase video clip | Lessons | Demonstrate/listen | Direct media | Basic player; public architecture in old app | Private media block with captions, poster, transcript, signed access | MVP |
| Google Drive video/file | Lessons | Reuse teacher resources | Low-friction linking | External sharing can bypass protection | Allowlisted external-media block with explicit privacy warning and fallback link | MVP |
| Audio/podcast | Podcast pages and lessons | Listening practice | 33 audio blocks; authentic cadence | Transcript and playback-governance gaps | Audio + synchronised/ordinary transcript, speed, chapters, download policy | MVP |
| Embed/link preview | Tools and lessons | Connect external resources | Versatile | Arbitrary external surface/privacy risk | Allowlisted external resource with canonical metadata; no arbitrary iframe/HTML | Foundational |
| Timer | Source/exam practice | Rehearse time pressure | Relevant to exams | Accessibility and persistence weak | Policy timer with warnings, pause rules, server time, and nonvisual announcements | MVP |
| Print/worksheet | Page tools | Offline/classroom use | Important teacher fallback | Layout generated from app view | Dedicated print renderer with answer/release rules | Later |
| Templates/duplicate/move | Authoring source | Reuse and restructure | Efficient course building | One-file authoring; weak version/audit | Versioned templates, governed block registry, transaction-safe move/duplicate | Later |
| Nested subpages/deep links | Course tree | Flexible organisation and sharing | Useful hierarchy | Can become unbounded | Bounded course/module/lesson hierarchy plus stable anchors | Foundational |
| Backup/restore | Settings/source | Protect author work | Sensible safety instinct | Client blob, no institutional audit | Server version history, export, restore permissions, audit log | Later |
| Teacher PIN/edit mode | Source | Gate authoring | Fast personal workflow | Not authentication; easy to expose/bypass | Supabase identity, role, hierarchy, RLS, and explicit slot permissions | Foundational |
| Hidden/locked page | Source | Control visibility | Recognises publishing need | Client enforcement | Server-authorised draft/published/archived and locked-field policies | Foundational |

## 5. Brand principles

1. **Learning before interface.** The page should foreground language, evidence, practice, and feedback—not containers.
2. **Warm authority.** Academic credibility and human encouragement should coexist. Avoid both bureaucratic coldness and childish gamification.
3. **One master brand, many programmes.** Course themes are accents within a stable typographic, spatial, and interaction system.
4. **Editorial hierarchy, product precision.** Use publication-scale headings and carefully composed media, supported by predictable controls and states.
5. **Restraint earns delight.** A small highlight, diagram, transition, or celebration is stronger when most of the interface is quiet.
6. **Trust is visible.** Permissions, draft/published state, answer release, data loss risk, and external-media privacy must be legible.
7. **Accessibility is a visual quality.** Focus, contrast, captions, reading width, touch targets, and motion alternatives belong to the core design language.
8. **No decorative glass dependency.** Translucency may clarify a floating navigator or focused overlay; it must not be the default surface.

## 6. Typography system

Use a licensed, self-hosted or system-safe family set; final font licensing and performance must be validated before implementation.

### Roles

- **Display/editorial:** a refined serif or humanist display face for public and course heroes, major module openings, and selective quotations. It should support Latin now and leave room for an appropriate Persian companion later. Never use it for dense controls.
- **Interface/text:** a highly legible sans with strong numerals, punctuation, and broad language support for body, forms, navigation, and assessment.
- **Data/code:** a restrained mono face only for slugs, IDs, answer labels when pedagogically meaningful, and technical metadata.

### Scale and rules

| Token | Fluid range | Use |
|---|---:|---|
| `display-xl` | 48–84 px | Marketing/course hero only |
| `display` | 40–64 px | Major page opening |
| `h1` | 34–52 px | One page title |
| `h2` | 28–38 px | Major lesson section |
| `h3` | 22–28 px | Block groups |
| `h4` | 18–22 px | Local headings |
| `body-lg` | 18–21 px | Introductory and lesson lead text |
| `body` | 16–18 px | Primary reading/UI copy |
| `body-sm` | 14–16 px | Secondary metadata; never essential tiny text |
| `label` | 13–15 px | Controls, badges, overlines with adequate tracking |

- Lesson prose measure: approximately 62–74 characters; long-form assessment passages may use 68–82 where split layouts justify it.
- Body line height: 1.55–1.75; headings: 0.98–1.2 according to size.
- Avoid all-caps beyond short category labels. Do not letter-space paragraphs.
- Use tabular numerals for timers and scores. Do not use mono type merely to look technical.
- At 200% zoom, content and actions must reflow without overlap or two-dimensional scrolling except necessary data tables/diagrams.

## 7. Colour system

### Global brand tokens

| Role | Proposed token | Starting value | Notes |
|---|---|---:|---|
| Canvas | `--colour-canvas` | `#F7F3EC` | Warm porcelain, not yellow |
| Canvas cool | `--colour-canvas-cool` | `#F5F7FA` | Assessment/operations alternative |
| Surface | `--colour-surface` | `#FFFCF8` | Primary reading surface |
| Ink | `--colour-ink` | `#171613` | Deep warm black |
| Ink muted | `--colour-ink-muted` | `#5E5B54` | Must remain contrast-compliant |
| Hairline | `--colour-line` | `#DDD7CD` | Used selectively |
| Brand orange | `--colour-brand` | `#D95D16` | Principal signature/actions |
| Brand orange hover | `--colour-brand-strong` | `#B9470E` | Dark enough for small text/controls |
| Cobalt | `--colour-cobalt` | `#214DC2` | Supporting information/course use |
| Violet | `--colour-violet` | `#6B4ACB` | Supporting course/creative use |
| Mint | `--colour-mint` | `#2F8D73` | Learning/progress support, not universal “correct” |
| Turquoise | `--colour-turquoise` | `#087F88` | Audio/speaking/context |
| Coral | `--colour-coral` | `#C94F52` | Theme accent, not error token |
| Gold | `--colour-gold` | `#A76A00` | Cambridge/accolade accent |
| Critical | `--colour-critical` | `#B42318` | Error/incorrect with icon/text |
| Positive | `--colour-positive` | `#157347` | Correct/success with icon/text |
| Partial | `--colour-partial` | `#956300` | Partial/warning with icon/text |
| Pending | `--colour-pending` | `#40566F` | Manual/pending state |

Values are design starting points, not implementation-ready approvals. Every foreground/background pair must pass contrast tests in its actual size and weight. Course accent names must never be reused as semantic state tokens.

### Pairing rules

- Default all reading surfaces to ink on porcelain/white.
- Use white text only on measured dark tones; a course accent does not automatically qualify.
- Brand orange may be a fill for large buttons with verified white contrast, or a text/icon accent using its stronger variant.
- Pale tints are background atmospheres only; body text remains ink.
- Correct/incorrect/partial/pending always use icon + label + pattern/structure, never colour alone.
- Links remain recognisable through underline or another persistent non-colour affordance.
- High-contrast/forced-colour modes must keep borders, focus, selected state, and answer state visible.

## 8. Course-theme architecture

A course theme is a controlled token set, selected by an administrator from approved families. It cannot override component geometry, focus, semantic feedback, type scale, or accessibility rules.

```text
CourseTheme v1
  id, family, version
  accent, accentStrong, accentSoft, secondary, atmosphere
  onAccent, illustrationPalette[3..6]
  heroTreatment, motif, progressAccent
  approvedSurfacePairs[]
```

| Course family | Primary direction | Supporting direction | Visual motif |
|---|---|---|---|
| IELTS | Cobalt | Warm orange | Measured bands, routes, evidence markers |
| TOEFL iBT | Indigo | Cyan | Connected discourse, signal/wave and modular sequence |
| PTE Academic | Violet | Coral | Speech geometry, responsive waveform, precision points |
| Cambridge | Deep red | Gold | Scholarly framing, craft, restrained heraldic geometry |
| General English | Mint | Blue | Conversation paths, everyday objects, gentle modular scenes |
| EAP | Navy | Amber | Citation, argument maps, research/index motifs |
| Business English/BEC | Graphite | Copper | Networks, negotiation, structured exchange |
| Young Learners | Peach | Turquoise + brighter support | Bold friendly shapes with age-appropriate sophistication |
| CELPIP/future | Teal | Orange | Everyday civic contexts and spoken exchange; provisional |

### Theme guardrails

- The global orange signature appears in brand moments and primary action logic; course colours identify context, not every control.
- No more than one course accent, one secondary accent, and semantic colours should compete in a viewport.
- Illustrations share line weight, texture, lighting, and composition rules across themes.
- Course heroes may vary by motif and atmosphere, but navigation, typography, surface hierarchy, and interaction remain global.
- Progress uses a course accent only for neutral completion; success/failure uses semantic tokens.
- Assessment mode reduces decorative theme intensity by approximately half; strict exam mode reduces it further.
- Young Learners may be brighter and more illustrative, but reading contrast, control placement, and institutional identity stay intact.
- A theme preview must include contrast results and representative lesson, assessment, feedback, and mobile states before publication.

## 9. Spacing and layout system

Use a 4 px base with semantic steps: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, and 128. Components consume named tokens (`control-gap`, `block-gap`, `section-gap`, `page-gutter`) rather than choosing arbitrary values.

### Layout frames

- **Reading:** 680–780 px primary measure, with optional 240–300 px TOC/notes rail.
- **Shared-stimulus assessment:** 12-column split, typically 5/7 or 6/6, independently scrollable only when focus and reading position remain understandable.
- **Admin workbench:** 240–280 px hierarchy rail, flexible canvas, optional 300–360 px inspector. Collapse intentionally at tablet sizes.
- **Marketing/institutional:** max 1280–1440 px with editorial asymmetry and full-bleed atmosphere, not full-width text.
- **Mobile:** 16–20 px gutters, one primary column, edge-to-edge media only when authored; sticky actions must not obscure content or keyboard.

Breakpoints should follow composition failures rather than device labels, approximately: compact `< 640`, medium `640–959`, wide `960–1279`, expansive `≥ 1280`. Container queries should govern reusable blocks.

## 10. Depth, surface, and translucency system

| Level | Treatment | Appropriate use |
|---|---|---|
| 0 — canvas | Porcelain/cool canvas, subtle texture/atmosphere | Page background |
| 1 — paper | Opaque warm surface, almost no border, faint ambient shadow | Reading sections, forms |
| 2 — raised | Opaque surface with delicate directional shadow | Selected cards, admin inspector |
| 3 — floating | 88–96% opaque with supported blur and firm edge | Sticky course navigator, command menu |
| 4 — overlay | Opaque/translucent system with scrim and focus containment | Modal, bottom sheet, intentional feedback interruption |

- Prefer tonal separation and whitespace to borders.
- Translucency is prohibited behind dense text, answer options, timers, and critical feedback.
- Background atmospheres use two or three large low-contrast colour fields or a very subtle paper grain; never a stack of small gradients.
- Shadows should suggest elevation, not outline every card. In high contrast/reduced transparency modes, substitute solid surfaces and explicit edges.

## 11. Vector, illustration, and image direction

### Illustration language

- Original vector compositions combining confident geometric construction with a small amount of human line/texture.
- Use language-learning metaphors—conversation, evidence, sequence, sound, place, argument—without stock graduation caps, flags, globes, or cartoon mascots.
- People, where used, should reflect Iranian and international learners without tokenism; avoid culture-as-decoration.
- Diagrams use a common grid, arrow, label, annotation, and legend system suitable for examination content.
- Decorative vectors are exported safely, contain no embedded scripts, and are hidden from assistive technology.

### Image/graphic asset contract

- Ratios: original, 1:1, 4:3, 3:2, 16:9, 21:9, portrait 3:4, and an administrator-defined bounded custom ratio.
- Fit: contain or crop; crop stores focal point `(x,y)` and safe-area hints, never destroys the source.
- Required metadata: asset ID/source, dimensions, ratio, focal point, alt text or explicit decorative flag, caption, credit/licence, and responsive renditions.
- Art direction: desktop/tablet/mobile sources may differ only when they preserve meaning; alt text belongs to the semantic image purpose, not the file.
- Layouts: inset, reading-width, full-bleed-within-lesson, float (wide screens only), split text/media, grid, gallery, annotated, and lightbox-enabled.
- Masks: approved soft rectangle, arch, circle, or course motif; never mask diagrams, screenshots, assessment stimuli, or text-bearing images.
- Lightbox: labelled close, focus trap and return, Escape, next/previous with button alternatives, caption/credit, zoom/pan controls, and non-lightbox link fallback.
- Mobile: remove floats, keep captions adjacent, respect focal points, avoid forced viewport-height crops, provide pan/zoom for essential diagrams.
- Course theme: may affect frame, caption marker, or illustration palette, never recolour documentary images or semantic diagrams automatically.

## 12. Motion system

Motion communicates hierarchy, continuity, causality, and feedback. It does not continuously advertise polish.

| Category | Typical duration | Character | Reduced-motion equivalent |
|---|---:|---|---|
| Control response | 90–150 ms | Immediate, ease-out | State changes instantly |
| Accordion/tab/reveal | 160–240 ms | Measured spatial continuity | Instant open/swap; preserve focus |
| Navigation | 180–300 ms | Subtle fade/translate ≤ 12 px | Crossfade ≤ 100 ms or none |
| Block entrance | 180–320 ms | Once, only when it clarifies insertion/loading | Content appears without movement |
| Feedback reveal | 180–280 ms | Calm emphasis; one focal transition | Instant border/icon/text state |
| Progress update | 240–450 ms | Small interpolated change | Static updated value + announcement |
| Completion celebration | 450–900 ms maximum | Rare, restrained, optional | Static congratulatory mark |
| Drag/reorder | 120–220 ms | Direct object tracking and settle | Keyboard move with position announcement |
| Theme atmosphere | 6–20 s if used | Extremely slow, nonessential | Frozen background |
| Skeleton/loading | 700–1,400 ms loop | Low-contrast pulse, not shimmer glare | Static skeleton/status text |

Use decelerating easing for entrances, accelerating easing for exits, and spring-like motion only for direct manipulation—not reading or assessment feedback. Never animate timers continuously, shake incorrect answers, parallax long passages, autoplay decorative video, or use celebration during strict/serious assessment. Maintain 60 fps where possible, animate opacity/transform rather than layout, limit concurrent animated regions, and cap decorative asset weight.

## 13. Complete block taxonomy

The taxonomy distinguishes **document blocks** from **assessment objects**. A quiz/assessment block references a versioned assessment; it does not embed answer keys in ordinary lesson JSON.

### Layout and navigation

Hero; banner; section; columns; divider; spacer; breadcrumbs; previous/next lesson navigation; course navigation; table of contents; anchor navigation.

### Content

Rich text; heading; quote; callout; checklist/to-do; table; definition; example; exam tip; key takeaway; vocabulary cards; grammar panel; timeline; steps/process; comparison; FAQ.

### Actions

Button; button group; call to action; download link; navigation card; external resource link.

### Interactive learning

Accordion/toggle; tabs; reveal; flashcards; vocabulary practice; worked example; reflection prompt; progress checkpoint; self-assessment; poll; sort/classify activity.

### Media and graphics

Image; full-width image; image with text; image grid; gallery; before/after image; diagram; annotated image; illustration; vector graphic; audio; audio with transcript; video; PDF; Google Drive media; caption; lightbox; downloadable resource.

### Assessment boundary

Assessment launcher; question group; shared stimulus; question; response renderer; timer; submission/review panel. These are composed by the assessment engine described in Sections 16–21 and are not arbitrary rich-content blocks.

## 14. Block schemas, contracts, and variants

### Universal block envelope

```json
{
  "id": "uuid",
  "type": "block-registry-key",
  "schemaVersion": 1,
  "lessonId": "uuid",
  "parentId": null,
  "position": 10,
  "status": "draft|published|archived",
  "visibility": { "audience": "course", "conditions": [] },
  "protection": { "locked": true, "lockedFields": ["type", "layout"] },
  "theme": { "mode": "inherit", "variant": "default" },
  "layout": { "width": "reading", "alignment": "start" },
  "motion": { "preset": "none" },
  "content": {},
  "accessibility": {},
  "responsive": {},
  "source": { "kind": "authored" }
}
```

The future persisted model may normalise parts of this envelope; this is a product contract, not a migration proposal.

### Contract inherited by every block

- **Admin authoring:** schema-driven fields, live preview, variant picker limited to the registry, keyboard move, duplicate, visibility, publish validation, version history, and explicit destructive confirmation.
- **Teacher permissions:** none on locked core blocks. A teacher can edit only fields whitelisted by an administrator in an administrator-created slot assigned to that teacher. The slot fixes location, type, layout, visibility bounds, and allowed fields.
- **Student rendering:** published, authorised, theme-resolved, sanitised, and free of author controls; empty authoring placeholders never render.
- **Validation:** server-side schema version, size/length bounds, reference ownership, URL/media allowlists, safe structured content, and publish-readiness rules.
- **Accessibility:** semantic native element first, named controls, logical heading/order, non-colour state, keyboard support, and block-specific alternatives.
- **Responsive:** registry defines allowed widths, collapse/reflow behaviour, and nonvisual/print fallbacks; authors cannot create arbitrary breakpoints.
- **Locking:** identity, ownership, protection, schema version, and published history are server-controlled. Admins may edit content/approved variants; teachers receive only explicit field capabilities.
- **States:** authoring empty, preview, loading, ready, recoverable error, unavailable/revoked external source, and published. Each registry entry supplies state copy and fallback.

The following rows define the per-block content schema and permitted deltas; combined with the universal contract, they specify authoring, permissions, rendering, validation, accessibility, responsiveness, locking, and states for every block.

### Layout and navigation block matrix

| Block | Content schema and admin authoring | Layout/theme/motion variants | Student, accessibility, responsive, and fallback behaviour |
|---|---|---|---|
| Hero | Eyebrow, title, summary, optional art/media, actions, motif | Compact/course/module/editorial; light/dark measured theme; still/ambient | One `h1` per view; actions follow summary; crop/focal rules; stacks on compact; no art placeholder when absent |
| Banner | Message, optional title/icon/action, semantic intent | Neutral/info/announcement/caution; inset/full; reveal | Landmark only when appropriate; icon+text; dismissible only with persisted preference and named control |
| Section | Optional heading, summary, child IDs | Reading/wide/tinted/quiet; theme accent; no entrance by default | Semantic `section` when named; container-query reflow; empty section blocked from publish |
| Columns | Child regions, ratios, collapse order | 1:1, 1:2, 2:1, thirds; top/centre; no decorative motion | DOM order is reading order; explicit mobile order; no horizontal squeeze; print stacks |
| Divider | Optional accessible label | Line/dots/space; theme-neutral; none | Decorative `hr` or labelled separator; no contrast-dependent ornament |
| Spacer | Token size only | XS–XL bounded | Collapses on compact; invisible to screen readers; cannot exceed approved scale |
| Breadcrumbs | Generated hierarchy, optional current label | Full/collapsed; neutral | Semantic `nav` and ordered list; compact middle-collapse; print text path |
| Previous/next | Generated targets and completion context | Terminal/sticky bar/cards | Descriptive labels; disabled endpoints; sticky becomes terminal on compact/zoom |
| Course navigation | Generated module/lesson tree, progress metadata | Rail/sheet/index | Current item announced; full keyboard; mobile modal/sheet with focus return; text fallback |
| Table of contents | Generated heading anchors, depth bound | Rail/inline/compact select | Active state not colour-only; correct heading relationships; print as contents or omit links |
| Anchor navigation | Author-selected valid anchors | Chips/list/local rail | Valid unique targets only; visible focus; horizontal chip row becomes select/list |

### Content block matrix

| Block | Content schema and admin authoring | Layout/theme/motion variants | Student, accessibility, responsive, and fallback behaviour |
|---|---|---|---|
| Rich text | Restricted document nodes, links, inline emphasis | Reading/lead/compact; inherit; none | Semantic HTML, sanitised URLs, no arbitrary style/script; natural reflow and print |
| Heading | Text, semantic level or outline intent, optional anchor | Display/section/subsection; accent marker; none | Outline validation prevents skipped/decorative levels; wraps without clipping |
| Quote | Quote, attribution, source/link | Pull quote/testimonial/evidence | `blockquote` + citation; attribution required for published sourced quote; no smart-column squeeze |
| Callout | Title, body, icon, intent | Note/info/caution/context | Semantic label + icon/text; not colour-only; long copy reflows; print border |
| Checklist/to-do | Items, optional learner-state mode | Static/interactive; compact/roomy | Native checkboxes for saved state; static list otherwise; clear persistence and reset |
| Table | Caption, headers, rows/cells, scope metadata | Data/comparison/compact | Proper caption/header scope; mobile scroll with cue or authorised card transform; CSV/print fallback |
| Definition | Term, part of speech, definition, pronunciation/example refs | Inline/card/glossary | `dfn`, readable pronunciation text/audio alternative; term never conveyed by colour |
| Example | Label, example, annotation/translation | Inline/panel/paired | Language/translation identified; safe wrapping; copy optional and labelled |
| Exam tip | Exam family/profile, title, guidance | Margin/inset/banner | Clearly advisory, not official-provider endorsement; collapses into flow on mobile |
| Key takeaway | Title, concise points | Terminal/inset | Landmark/heading, restrained positive emphasis; print preserved |
| Vocabulary cards | Entries: term, meaning, form, example, audio/image refs | List/cards/compact deck | List fallback; audio labels/transcript; no hover-only reveal; compact becomes swipe *plus buttons* |
| Grammar panel | Rule, form pattern, examples, exceptions, related practice | Rule/example/split | Table/formula alternatives; horizontal patterns wrap; language annotations |
| Timeline | Ordered events, dates, descriptions | Horizontal/vertical | Ordered-list semantic source; compact and print vertical; no meaning from position alone |
| Steps/process | Ordered steps, optional media/status | Vertical/horizontal/process diagram | Ordered list with explicit numbering; compact vertical; diagram has text equivalent |
| Comparison | Items, attributes, contrasts | Table/cards/split | Accessible table/list source; mobile cards retain attribute labels |
| FAQ | Question/answer pairs | Accordion/list | Heading + button semantics; print expanded; search/deep-link support |

### Action and interactive-learning block matrix

| Block | Content schema and admin authoring | Layout/theme/motion variants | Student, accessibility, responsive, and fallback behaviour |
|---|---|---|---|
| Button | Label, safe destination/action reference, purpose | Primary/secondary/quiet; sizes bounded | Link for navigation, button for action; no vague labels; full-width only on compact when useful |
| Button group | Child actions, hierarchy and alignment | Inline/stacked/split | One primary maximum; wraps predictably; group label where needed |
| Call to action | Title, body, primary/secondary actions, optional art | Panel/editorial/terminal | Clear outcome; no nested click targets; stacks on compact |
| Download link | Asset reference, file label/type/size | Link/card | Announces file type/size and external/new context; unavailable state; no forced download surprise |
| Navigation card | Destination, title, summary, optional progress/icon | Compact/editorial/index | Single coherent link; no nested controls; list fallback |
| External resource | Allowlisted URL, title, source, privacy/new-window note | Link/card/embed-preview | Domain and external context shown; canonical safe URL; unavailable/privacy fallback |
| Accordion/toggle | Items with title and rich child content, open policy | Single/multiple open | Native button + region; keyboard; print expanded; state optional, never required to find assessed content |
| Tabs | Labels, panels, default tab | Underline/segmented | ARIA tab pattern; arrow keys; overflow becomes select/accordion; print headings + panels |
| Reveal | Prompt, hidden learning content, label, reset policy | Inline/card | Button controls region; not used to protect assessment answers; print policy explicit |
| Flashcards | Card set refs, fronts/backs, media, deck policy | Stack/grid/study mode | Reveal and next buttons, keyboard shortcuts optional and documented; list/print fallback |
| Vocabulary practice | Lexical items, mode capabilities, attempt policy | Recall/match/listen/type | Uses assessment engine for scored responses; non-drag and transcript alternatives |
| Worked example | Problem/stimulus, staged solution, commentary | Steps/split/annotated | Step controls, “show all” alternative, print fully expanded |
| Reflection prompt | Prompt, response type, privacy/save policy | Journal/short response | Explicit audience/privacy; autosave state; textarea/recording alternatives where assigned |
| Progress checkpoint | Completion criteria, prompt/action, evidence | Inline/terminal | Never fabricates mastery; status announced; offline/retry state |
| Self-assessment | Statements, scale labels, reflection | Scale/cards | Meaning stored independent of control; endpoints and every value named; not graded unless stated |
| Poll | Prompt, options, anonymity/results policy | List/segmented | Server aggregate and privacy; result visibility policy; radio/checkbox semantics |
| Sort/classify | Items, categories/order, reuse rules | Drag/cards/select fallback | Keyboard move menus and select-based alternative; announcements; printable unscored version |

### Media and graphics block matrix

| Block | Content schema and admin authoring | Layout/theme/motion variants | Student, accessibility, responsive, and fallback behaviour |
|---|---|---|---|
| Image | Asset, alt/decorative, caption/credit, focal point | Inset/reading/wide/float; approved masks | Responsive sources; no empty alt unless decorative; float removed on compact; original link optional |
| Full-width image | Same as image + safe-area/art direction | Lesson-wide/edge-to-edge | Maximum height bound; meaning not cropped; compact art direction; print contained |
| Image with text | Image + rich text + order/alignment | 1:1/2:1/1:2, image first/second | DOM order authored explicitly; stacks in meaningful order; alt not duplicate adjacent prose |
| Image grid | Ordered assets, per-item metadata | 2/3/4 columns/masonry prohibited for semantic sequence | List reading order; adaptive columns; captions always associated |
| Gallery | Ordered assets, gallery title, lightbox policy | Grid/filmstrip | Buttons not swipe-only; lightbox focus/zoom; compact list/2-column; print contact sheet |
| Before/after | Two assets, labels, description | Side-by-side/slider | Side-by-side non-drag fallback; keyboard slider with values; compact toggle with both labels |
| Diagram | Asset/vector + long description/legend | Inset/wide/zoomable | Long description and data/table alternative; pan/zoom controls; print high-resolution |
| Annotated image | Base asset, anchored annotations, text alternatives | Pins/numbered legend | Annotation list is canonical accessible form; no hover-only pins; compact legend below |
| Illustration | Asset, purpose, alt/decorative, credit | Inset/hero/full | Decorative hidden; informative alt; theme palette approved; no essential embedded text |
| Vector graphic | Safe static SVG asset + accessible name/description | Inline/wide/themed | Sanitised/script-free; high contrast; raster/print fallback |
| Audio | Private/external safe source, title, duration, transcript ref, download policy | Compact/player/card | Native/custom accessible controls, transcript link, playback speed, status/error; no autoplay by default |
| Audio + transcript | Audio plus timed/untimed transcript, speaker labels | Stacked/split/follow mode | Searchable transcript; current cue not colour-only; compact stacked; printable transcript |
| Video | Safe source, poster, captions, transcript, audio description ref | Inset/wide/focus | Keyboard controls, captions/transcript, no autoplay, signed URL refresh/error; compact aspect preserved |
| PDF | Safe source, title, pages/size, text-alternative/download policy | Preview/link/split | Preview plus open/download; browser-failure state; accessible-source warning; compact avoids trapped scroll |
| Google Drive media | Validated file ID/type/title and canonical URLs | Preview/link | Authoring warns that “Anyone with the link” is unsuitable for confidential or strongly protected paid material; sandboxed allowlisted preview; open link; revocation state; never arbitrary embed code |
| Caption | Text, associated block ID, credit/source | Below/side on wide screens | Programmatically associated; always adjacent on compact/print |
| Lightbox | References gallery/image and controls policy | Overlay | Dialog semantics, focus trap/return, Escape, zoom/buttons, reduced motion; inline fallback |
| Downloadable resource | Private asset, title, description, type/size/version | Link/card/resource panel | Authorised signed access, clear format/size, expiry/retry, print URL policy |

## 15. Admin and teacher permissions

### Capability model

Permissions should be evaluated server-side as capabilities over a concrete resource hierarchy, not inferred from a role label supplied by the client.

| Capability | Admin | Assigned teacher | Student |
|---|---:|---:|---:|
| Define organisation brand/global theme | Yes | No | No |
| Create/rename/move/delete/publish course structure | Yes | No | No |
| Create/edit/delete/reorder/unlock core blocks | Yes | No | No |
| Choose approved block/layout/motion variants | Yes | No | No |
| Add arbitrary HTML/JS/CSS | Never | Never | Never |
| Create and assign teacher slot | Yes | No | No |
| Edit whitelisted fields in assigned teacher slot | Optional by slot | Yes, within exact capability | No |
| Publish teacher-slot changes | Policy-controlled; default admin | Only if explicitly granted later | No |
| Read authorised course | Yes | Assigned cohorts | Enrolled published cohorts |
| Submit assessment/work | For testing only | As reviewer where assigned | Yes, where assigned |

An admin-created teacher slot must record its location, slot type, assigned cohort/teacher, permitted fields, allowed block subtype/variants, moderation state, and visibility ceiling. Teachers cannot change ownership, location, layout, protection, publish scope, or organisation identity. Preview must clearly distinguish “teacher-editable content” from locked course content without exposing that distinction to students.

## 16. Assessment capability architecture

### Principle: meaning is not presentation

An assessment item is composed from independent, versioned contracts:

```text
Assessment → Section → QuestionGroup → QuestionVersion
QuestionVersion
  learningObjective / construct
  stimulus references
  response model
  validation model
  scoring policy reference
  feedback policy reference
  renderer preference (not requirement)
  exam-profile provenance

Attempt → immutable presented-version snapshot → Response(s)
        → automatic grade + manual grade + authoritative resolved grade
```

An **exam profile** names a provider, qualification, delivery mode, effective date, source set, timing rules, section recipe, allowed capability combinations, scoring transformation, and retirement/supersession state. Changing TOEFL or PTE task formats creates a new profile version; it does not alter historical attempts or require a new core question table.

### Option configuration

Every applicable response model supports two, three, four, five, or more options; generated or author-defined labels; letters, numbers, Roman numerals, or hidden labels; single or multiple correct meanings; shared or per-gap banks; reusable/single-use options; distractors; fixed/random order; and options above, below, beside, or embedded in a stimulus. Stored response values use stable option IDs and order snapshots—not displayed labels.

Radio buttons, checkboxes, segmented controls, dropdowns, inline dropdowns, drag-and-drop, keyboard selection, and expanded cards are renderers. They never redefine the answer.

### Composable stimuli

Plain/rich text, sentence, multi-paragraph passage, audio, video, image, diagram, map, plan, table, flow chart, conversation, interview, lecture, form, notes, summary, combined text/media, and a shared stimulus for any-size question groups. Stimuli are versioned, permission-scoped assets with transcripts/captions/descriptions where relevant.

### Composable responses

Single select; multiple select; dropdown; inline dropdown; typed gap; short answer; long-form writing; drag and drop; matching; reordering; text highlighting; sentence building; word completion; image/diagram hotspot; diagram-label placement; audio recording; read-aloud recording; spoken short answer; extended spoken response; file upload; and teacher/manual assessment.

### Timing and delivery capabilities

Untimed practice; whole-test, section, group, or per-question timer; preparation and recording time; playback limits; automatic audio where an exam profile requires it; one or multiple recording attempts; immediate/delayed feedback; exam, learning, and teacher-reviewed modes. Timing uses an authoritative server timeline and records accommodations. An accessible nonvisual timer announces only meaningful thresholds.

### Canonical assessment-capability matrix

The compact codes below avoid repeating policy text while specifying every canonical response type.

- **Feedback:** `P` policy-driven immediate/group/final; `M` pending manual; `H` hints possible.
- **History:** every row stores version ID, presented option/order snapshot, response events where necessary, submitted value, timestamps, time spent, release state, and all automatic/manual grade revisions.
- **Common accessibility:** labelled group/instructions, keyboard completion, error summary, state text, zoom/reflow, and no colour-only meaning.
- **Common visual/motion:** quiet paper-like question surface; course accent for context only; 90–280 ms state/reveal motion, none in strict/reduced mode.

| Response capability | Educational purpose | Admin authoring and data structure | Validation and answer storage | Scoring / feedback | Student, accessibility, responsive, print/fallback | Appropriate families |
|---|---|---|---|---|---|---|
| Single select | Distinguish one best answer | Prompt + option IDs + label/order/layout policy | One stable option ID; min/max options configurable | Exact/weighted; P/H | Native radio meaning; cards/segmented/select as compatible renderers; vertical on compact; print circles | All |
| Multiple select | Select a valid set | Options + min/max selections + order policy | Set of option IDs, never labels | Exact set, per-option partial, optional negative marking; P/H | Checkbox meaning; selection count; vertical/columns; print squares | IELTS, TOEFL, PTE, Cambridge, CELPIP, General |
| Dropdown | Compact selection | Question + option bank ref | One option ID | Exact/weighted; P | Native/select-like accessible control; expanded fallback | All |
| Inline dropdown | Complete text/table/form | Structured stimulus with gap IDs and per/shared banks | Map `gapId → optionId`; every gap independently validated | Per-gap/partial; P/H | Each gap has full accessible label; compact may render below sentence; print blanks + bank | IELTS, Cambridge, PTE, General |
| Typed gap/word completion | Recall exact language | Gap nodes + accepted variants + normalisation/word/number rules | Raw response plus normalised candidate per gap | Exact/variants/case/punctuation/word limit/per-gap; P/H | Text fields named by surrounding context; no placeholder-only instruction; print blanks | IELTS, Cambridge, PTE, TOEFL Complete Words, General |
| Short answer | Produce concise response | Prompt + constraints + accepted variants or manual rule | Raw text, normalised comparison, word count | Auto variants or manual; P/M/H | Text input/textarea by bound; live word limit; print lines | IELTS, PTE, General, CELPIP selection follow-ups |
| Long-form writing | Construct extended text | Prompt/stimulus + min/recommended words + rubric | Versioned document snapshots, final text, optional revision events | Rubric/manual; optional advisory automated checks; M | Distraction-light editor, autosave, word count, keyboard complete; printable prompt/response | IELTS, TOEFL, PTE, Cambridge, EAP, CELPIP, General |
| Drag and drop | Spatially place/classify | Draggables, targets, cardinality/reuse, alternative renderer | Stable item-to-target mapping/order | Exact/partial/ordered; P/H | Keyboard move and select-based alternative mandatory; announcements; print matching table | IELTS, Cambridge, PTE, General |
| Matching | Relate two sets | Items, options, reuse/cardinality and labels | `itemId → optionId(s)` | Per-pair, partial, optional reuse; P/H | Radios/selects or accessible move model; responsive stacked; print grid | IELTS, Cambridge, CELPIP, General |
| Reordering | Understand sequence/cohesion | Items + correct relation/order + distractor rules | Ordered stable IDs | Position, adjacency, or exact sequence partial; P/H | Up/down controls and numbered selects alternative; print numbered list | Cambridge, PTE, General, EAP |
| Text highlighting | Identify evidence/errors | Immutable text spans/token map + valid ranges | Character/token range IDs against version snapshot | Exact/overlap/partial/manual; P/H | Keyboard range/list alternative; high-contrast patterns; print underline/mark | TOEFL/PTE/General/EAP |
| Sentence building | Syntax and cohesion | Token/chunk bank + accepted sequences | Ordered token IDs, optional typed equivalent | Exact/multiple sequences/partial adjacency; P/H | Add/remove buttons and keyboard list, not drag-only; print bank | TOEFL, Cambridge, General |
| Image/diagram hotspot | Locate visual information | Image version + polygon/point targets + tolerance + alternative list | Coordinates + resolved target ID | Target/tolerance/partial; P/H | Keyboard-accessible named regions/list response and long description mandatory; printable labelled diagram | IELTS, PTE Describe Image support, General |
| Diagram-label placement | Map labels to locations | Diagram + labelled targets + option bank/reuse | `targetId → optionId/text` | Per-label/partial/word rule; P/H | Select fields associated with target legend; zoom/pan; print diagram + list | IELTS, General/EAP |
| Audio recording | Produce spoken language | Prompt/media + prep/record/attempt/device policy + rubric | Private recording asset + duration/device metadata + consent state | Manual rubric; future AI advisory separate; M | Device check, visible/nonvisual levels, pause rules, typed accommodation where authorised | IELTS, TOEFL, PTE, Cambridge, CELPIP, General |
| Read-aloud recording | Pronunciation/fluency from text | Passage + prep/record limits + rubric | Recording + passage/version | Manual; AI advisory future; M | Reading and recording controls separated; screen-reader/device support | PTE, TOEFL Listen/Repeat variant, General |
| Spoken short answer | Brief oral retrieval | Audio/text prompt + short timer + variants/rubric | Recording and optional transcript; authoritative audio retained | Manual/approved exact response; M/P | Repeat/playback policy explicit; accessible prompt transcript per profile | PTE, TOEFL, CELPIP, General |
| Extended spoken response | Organised sustained speech | Prompt/stimulus + prep/record + rubric | Recording, notes snapshot if captured, metadata | Rubric/manual; M | Accessible timers/recording, device recovery, upload progress; print prompt only | IELTS, TOEFL, PTE, Cambridge, CELPIP, EAP |
| File upload | Submit project/portfolio evidence | Allowed types/size/count + rubric and declaration | Private asset refs + hashes + filenames; malware workflow later | Manual/rubric; M | Keyboard file picker, upload progress/retry, non-file accommodation; print submission receipt | EAP, General, portfolio/future |
| Teacher/manual assessment | Evaluate performance/evidence | Rubric criteria, bands, annotations, moderation policy | Immutable submission snapshot + reviewer grades/comments | Rubric, moderation, resolved grade; M | Student sees only released feedback; printable accessible review | All productive skills |

## 17. Verified examination task inventory

### Evidence policy

The inventory below was checked against primary provider sources on **3 October 2026**. It is not a permanent truth table. Each production exam profile must record its source URLs, access/effective date, delivery jurisdiction/mode, and superseding version. Provider names and visual identities must be used only as legally appropriate; this platform should not imply endorsement.

### IELTS Academic and General Training

Official IELTS materials confirm multiple choice (one or more answers), True/False/Not Given, Yes/No/Not Given, matching information/headings/features/sentence endings, sentence/summary/note/table/flow-chart completion, diagram/plan/map labelling, short answers, and listening form completion. Completion instructions may impose variable word/number limits. Academic Writing uses a visual-information Task 1 and essay Task 2; General Training uses a letter Task 1 and essay Task 2. Speaking has interview, long turn with preparation, and discussion.

Profile mappings:

- T/F/NG and Y/N/NG → single select with fixed semantic values, provider-specific instructions.
- Multiple choice/response → select capabilities with variable option counts.
- Matching families → matching with reuse/cardinality rules.
- Completion with shared box → gaps + shared bank; dropdown, expanded, or accessible drag renderer.
- Completion without box → typed gaps with word/number rules and accepted variants.
- Per-gap options → independent gap banks of any valid size.
- Diagram/map/plan → diagram label/hotspot with a named-list alternative.
- Writing and speaking → long-form/manual rubric and recording/manual rubric.

Evidence references: IELTS-1 through IELTS-6 in the official-source register below.

### Cambridge English A2–C2

Across the verified A2 Key, B1 Preliminary, B2 First, C1 Advanced, and C2 Proficiency profiles, reusable capabilities cover multiple choice, multiple matching, multiple-choice cloze, open cloze, word formation, key-word transformation, gapped text, cross-text multiple matching, sentence/gap completion, listening selection and gap fill, varied writing genres, interview/long turn, and collaborative speaking. Lower levels include stronger picture-supported tasks; higher levels add denser transformation, cross-text, register, and discourse demands.

Multiple-choice cloze is modelled as passage gaps with a variable-length bank per gap. A four-option official profile may validate four for that version; the engine never assumes four. Options can render inline, above, below, beside, or as accessible expanded choices.

Evidence references: CAM-1 through CAM-5 in the official-source register below.

### TOEFL iBT

ETS’s current official section pages list:

- Reading: Complete the Words; Read in Daily Life; Read an Academic Passage.
- Listening: Listen and Choose a Response; Listen to a Conversation; Listen to an Announcement; Listen to an Academic Talk.
- Writing: Build a Sentence; Write an Email; Write for an Academic Discussion.
- Speaking: Listen and Repeat; Take an Interview.

These are a strong example of why dated profiles are essential: current formats differ from historical TOEFL preparation taxonomies, and adaptive delivery can affect item counts/timing.

Evidence references: TOEFL-1 through TOEFL-6 in the official-source register below. The canonical Reading and Writing URLs end in `reading.html` and `writing.html`; the previously recorded slash-before-extension variants were verified as non-canonical and removed.

### PTE Academic

Pearson’s current inventory includes:

- Speaking/Writing: Read Aloud, Repeat Sentence, Describe Image, Retell Lecture, Answer Short Question, Summarize Group Discussion, Respond to a Situation, Summarize Written Text, Write Essay.
- Reading: Reading & Writing Fill in the Blanks, Multiple Choice Multiple Answers, Reorder Paragraph, Fill in the Blanks, Multiple Choice Single Answer.
- Listening: Summarize Spoken Text, Multiple Choice Multiple Answers, Fill in the Blanks, Highlight Correct Summary, Multiple Choice Single Answer, Select Missing Word, Highlight Incorrect Words, Write from Dictation.

The profile must support partial and negative marking only where the effective official rule specifies it; the capability engine permits these policies but does not make them defaults.

Evidence references: PTE-1 through PTE-4 in the official-source register below.

### CELPIP

The official current inventory includes Listening to Problem Solving, Daily Life Conversation, Information, News Item, Discussion, and Viewpoints; Reading Correspondence, Apply a Diagram, Information, and Viewpoints; Writing an Email and Responding to Survey Questions; and Speaking Giving Advice, Personal Experience, Describing a Scene, Making Predictions, Comparing and Persuading, Difficult Situations, Expressing Opinions, and Describing an Unusual Situation.

The requested capability set covers these through selection, diagram-supported reading, long writing, preparation/recording, and manual rubric scoring. “Describing an Unusual Situation” is included because it appears in the current official inventory even though it was not in the initial requested list.

Evidence reference: CELPIP-1 in the official-source register below.

### Official-source register

Every URL in this register was opened and verified on **3 October 2026**. “Current as verified” means the provider page did not identify a separate effective date for that specific format; it must not be interpreted as proof that the format has never changed. Before implementing or revising a production profile, recheck the provider source and create a new dated profile version if anything has changed.

| ID | Provider | Exact official source title | Verified canonical URL | Access date | Applicable exam-profile date |
|---|---|---|---|---|---|
| IELTS-1 | IELTS | IELTS Academic sample test questions | [Official source](https://www.ielts.org/take-a-test/preparation-resources/sample-test-questions/academic-test) | 3 Oct 2026 | Current IELTS Academic task inventory as verified 3 Oct 2026; no separate task-profile effective date identified on this page |
| IELTS-2 | IELTS | IELTS General Training: Reading test format | [Official source](https://ielts.org/take-a-test/test-types/ielts-general-training-test/ielts-general-training-format-reading) | 3 Oct 2026 | Current IELTS General Training Reading profile as verified 3 Oct 2026; no separate task-profile effective date identified on this page |
| IELTS-3 | IELTS | IELTS Academic: Listening test format | [Official source](https://ielts.org/take-a-test/test-types/ielts-academic-test/ielts-academic-format-listening) | 3 Oct 2026 | Current IELTS Listening profile as verified 3 Oct 2026; Listening is shared by Academic and General Training |
| IELTS-4 | IELTS | IELTS Academic: Speaking test format | [Official source](https://www.ielts.org/take-a-test/test-types/ielts-academic-test/ielts-academic-format-speaking) | 3 Oct 2026 | Current IELTS Speaking profile as verified 3 Oct 2026; Speaking is shared by Academic and General Training |
| IELTS-5 | IELTS | IELTS General Training sample test questions | [Official source](https://www.ielts.org/take-a-test/preparation-resources/sample-test-questions/general-training-test) | 3 Oct 2026 | Current IELTS General Training sample-task profile as verified 3 Oct 2026 |
| IELTS-6 | IELTS | Updates to IELTS test delivery | [Official source](https://ielts.org/news-and-insights/updates-to-ielts-test-delivery) | 3 Oct 2026 | Delivery transition from mid-2026; the provider states that skills, construct, and result interpretation do not change |
| CAM-1 | Cambridge English | A2 Key for Schools and A2 Key exam format | [Official source](https://www.cambridgeenglish.org/exams-and-tests/qualifications/key/format/) | 3 Oct 2026 | Current A2 Key/A2 Key for Schools format as verified 3 Oct 2026; no separate effective date identified on this page |
| CAM-2 | Cambridge English | B1 Preliminary for Schools and B1 Preliminary exam format | [Official source](https://www.cambridgeenglish.org/exams-and-tests/qualifications/preliminary/format/) | 3 Oct 2026 | Current B1 Preliminary/B1 Preliminary for Schools format as verified 3 Oct 2026; no separate effective date identified on this page |
| CAM-3 | Cambridge English | B2 First for Schools and B2 First exam format | [Official source](https://www.cambridgeenglish.org/exams-and-tests/qualifications/first/format/) | 3 Oct 2026 | Current B2 First/B2 First for Schools format as verified 3 Oct 2026; no separate effective date identified on this page |
| CAM-4 | Cambridge English | C1 Advanced exam format | [Official source](https://www.cambridgeenglish.org/exams-and-tests/qualifications/advanced/format/) | 3 Oct 2026 | Current C1 Advanced format as verified 3 Oct 2026; no separate effective date identified on this page |
| CAM-5 | Cambridge English | C2 Proficiency exam format | [Official source](https://www.cambridgeenglish.org/exams-and-tests/qualifications/proficiency/format/) | 3 Oct 2026 | Current C2 Proficiency format as verified 3 Oct 2026; no separate effective date identified on this page |
| TOEFL-1 | ETS | Test Content and Structure | [Official source](https://www.ets.org/toefl/test-takers/ibt/about/content.html) | 3 Oct 2026 | Updated TOEFL iBT for tests on or after 21 Jan 2026 |
| TOEFL-2 | ETS | TOEFL iBT Reading Section | [Official source](https://www.ets.org/toefl/test-takers/ibt/about/content/reading.html) | 3 Oct 2026 | Updated TOEFL iBT for tests on or after 21 Jan 2026 |
| TOEFL-3 | ETS | TOEFL iBT Listening Section | [Official source](https://www.ets.org/toefl/test-takers/ibt/about/content/listening.html) | 3 Oct 2026 | Updated TOEFL iBT for tests on or after 21 Jan 2026 |
| TOEFL-4 | ETS | TOEFL iBT Test Writing Section | [Official source](https://www.ets.org/toefl/test-takers/ibt/about/content/writing.html) | 3 Oct 2026 | Updated TOEFL iBT for tests on or after 21 Jan 2026 |
| TOEFL-5 | ETS | TOEFL iBT Speaking Section | [Official source](https://www.ets.org/toefl/test-takers/ibt/about/content/speaking.html) | 3 Oct 2026 | Updated TOEFL iBT for tests on or after 21 Jan 2026 |
| TOEFL-6 | ETS | TOEFL® Score Scale Update: A Guide for Institutions | [Official source](https://www.ets.org/toefl/institutions/ibt/score-scale-update.html) | 3 Oct 2026 | Confirms the profile boundary for tests taken on or after 21 Jan 2026 and the transitional score reporting period |
| PTE-1 | Pearson PTE | PTE Academic & UKVI test format: Speaking & Writing | [Official source](https://www.pearsonpte.com/pte-academic/test-format/speaking-writing/) | 3 Oct 2026 | PTE Academic/PTE Academic UKVI for tests after 7 Aug 2025 |
| PTE-2 | Pearson PTE | PTE Academic & UKVI test format: Reading | [Official source](https://www.pearsonpte.com/pte-academic/test-format/reading/) | 3 Oct 2026 | PTE Academic/PTE Academic UKVI for tests after 7 Aug 2025 |
| PTE-3 | Pearson PTE | PTE Academic & UKVI test format: Listening | [Official source](https://www.pearsonpte.com/pte-academic/test-format/listening/) | 3 Oct 2026 | PTE Academic/PTE Academic UKVI for tests after 7 Aug 2025 |
| PTE-4 | Pearson PTE | Updates to PTE Academic | [Official source](https://www.pearsonpte.com/pte-updates-2025/) | 3 Oct 2026 | Explicitly applies to tests taken after 7 Aug 2025 |
| CELPIP-1 | CELPIP | Test Format & Scoring | [Official source](https://www.celpip.ca/test-format-scoring/) | 3 Oct 2026 | Current CELPIP-General format as verified 3 Oct 2026; no separate effective date identified on this page |

### General English, EAP, and future profiles

Reusable profiles may compose true/false, sequencing, classification, categorisation, error correction, sentence transformation, dictation, pronunciation recording, dialogue completion, reflection, portfolio submission, and teacher-reviewed writing/speaking. These are platform learning capabilities, not claims about a specific external provider.

## 18. Question renderer registry

The registry resolves a renderer from meaning and context rather than storing a UI component name as the question’s truth.

```text
resolveRenderer({
  responseKind,
  responseSchemaVersion,
  stimulusKinds,
  requestedVariant,
  deliveryMode,
  viewportCapabilities,
  accessibilityPreferences,
  examProfileConstraints
}) → renderer + compatibleFallbacks
```

Each registry entry declares:

- supported response/stimulus schema versions;
- minimum/maximum option and gap counts, if any;
- fixed/random order support and label modes;
- touch, pointer, keyboard, screen-reader, and switch compatibility;
- compact/wide/print renderer;
- timing and autosave compatibility;
- strict-exam eligibility;
- serialisation adapter to the canonical answer model;
- validation and error-focus behaviour;
- performance budget and test fixtures.

Example: `matching.v1` could resolve to `select-per-row`, `expanded-choice-grid`, or `drag-pairs`. All serialise the same `itemId → optionId` map. If drag is selected, `select-per-row` remains available as an equal, not inferior, alternative.

New interaction types register a new renderer or response capability without modifying historical questions. New exam formats add profile recipes and validation constraints. Neither should require rewriting existing attempts.

## 19. Scoring architecture

### Scoring pipeline

1. Accept an idempotent submission against an active attempt and immutable question version.
2. Validate response shape and delivery rules server-side.
3. Normalise only according to the question’s stored, versioned policy.
4. Produce per-response outcomes and evidence without releasing protected keys.
5. Apply exact, accepted-alternative, case/punctuation, word-limit, per-gap, partial, negative, or ordered rules as configured.
6. Queue rubric/manual work separately.
7. Resolve an authoritative grade from automatic and manual components according to moderation policy.
8. Transform raw scores only through the versioned course/exam scoring profile.
9. Evaluate feedback release and answer visibility independently from scoring completion.

Supported score modes: exact match; multiple accepted answers; case/punctuation sensitivity; word-limit and number validation; per-gap; partial credit; negative marking; ordered-sequence; rubric/manual; unscored practice; and future AI-assisted suggestions that are explicitly non-authoritative until an approved human/policy resolution.

Score policies support highest, latest, first, or average attempt; reduced score after hints/retries; and formative/summative mode. Historical results retain the exact scoring-policy version and cannot silently change when a rubric or accepted answer is edited.

## 20. Feedback and checking architecture

### Policy dimensions

- **Release:** immediately on response; “Check answer”; question-group check; section submit; complete-activity submit; after all attempts; administrator date/time; after teacher review; or never during strict simulation.
- **Visibility:** correctness only; correctness + explanation; correct answer; hide until final attempt/date; review read-only; corrections allowed; hint before answer; teacher-only key; strict no reveal.
- **Retry:** unlimited; fixed count; incorrect only; whole group/activity; score reduction; highest/latest/first/average; progressive hints; letter/word reveals; try again without answer exposure.
- **Authoring:** correct meaning, rubric, variants, option rationales, correct/incorrect/partial explanations, hints, related lesson, feedback media, release, visibility, retry, score, manual review, and formative/summative status.

### Feedback content levels

- Response: correct, incorrect, partially correct, unanswered, or pending manual review.
- Option rationale: why selected/correct/distractor; common misconception.
- Question: explanation, strategy, exam tip, grammar, vocabulary, example, related revision.
- Group: score and correct/incorrect/partial/unanswered totals; objective breakdown; revision and retry/continue actions.
- Final review: response, releasable answer, explanation, attempt history, time, teacher comments, and manual status.

### Presentation patterns

Inline state for a single compact response; expandable explanation below the question; dedicated feedback card for teaching depth; desktop side drawer when comparing passage/response; mobile bottom sheet for a summary that returns focus to inline detail; group results panel; complete results page; complete answer-review page. Modal feedback is reserved for intentional interruption, such as submission confirmation—not routine correctness.

### Supportive language and visual treatment

- **Correct:** check icon + “Correct” + concise evidence; deep green edge/icon on a pale neutral/green-tinted surface. Avoid celebratory interruption for every item.
- **Incorrect:** cross/adjust icon + “Not yet” or direct “Incorrect” according to exam context; red is restrained, explanation leads to the next useful action. Never shake the response.
- **Partial:** divided-circle icon + “Partially correct”; amber edge; show earned components and what remains when policy allows.
- **Pending:** clock/reviewer icon + “Awaiting review”; slate/cobalt treatment; preserve the submitted response and expected review state.
- **Unanswered:** neutral outlined state with an explicit prompt; warning only at submit/check boundaries.

Screen-reader live announcements are short (“Question 3, partially correct. Explanation available.”). Focus moves to the feedback heading after an explicit check/submit, not after every keystroke. Detailed explanations remain scannable with a headline, short diagnosis, evidence, strategy, and optional deeper content.

### Question groups

A group contains any number of questions and may own title, instructions, shared stimulus/media/passage, shared option bank, answer requirement, progress, navigation, flags, score, retry, and submission confirmation. “Check answers” validates unanswered requirements, focuses the error summary, and never assumes a group size such as eight.

### Student assessment state model

Not started → in progress → answered but unchecked → submitted, then automatic correct/incorrect/partial/unanswered or awaiting teacher review; later feedback available, retry available, completed. Availability can separately become expired or unavailable. State is textually identified, timestamped, and never inferred only from colour.

## 21. Assessment security requirements

- Authoritative scoring occurs on a trusted server boundary under authenticated, hierarchy-aware authorisation.
- Answer keys, accepted variants, private rationales, rubrics marked private, and future scoring prompts are stored separately from student-readable question payloads.
- Student payloads contain only what is needed to render the active question and released feedback.
- No protected answer appears in HTML, React payloads, client JavaScript, source maps, prefetch responses, hidden DOM, or premature network calls.
- Attempts reference immutable snapshots of every presented question/stimulus/profile version, option order, accommodations, and timing policy.
- Submissions use an idempotency key and server-enforced state transition to prevent double scoring.
- Automatic, manual, moderated, and authoritative final grade states are separate and auditable.
- Release state is explicit, server-evaluated, and recorded; clocks use authoritative time.
- RLS protects attempts, responses, assets, answer keys, feedback, and reviewer assignments, with server-side role/hierarchy rechecks.
- Randomisation happens from stable server-issued presentation snapshots so review and scoring use the same order.
- Signed private media access is short-lived and course/attempt-authorised; download restrictions are not misrepresented as perfect DRM.
- File/recording uploads require type/size validation, private storage, ownership paths, and later malware/content processing.
- Logs exclude answer text, recordings, tokens, credentials, and unnecessary personal data.
- AI-assisted scoring, if later introduced, is advisory unless an explicitly approved policy makes it authoritative; model/version, uncertainty, evidence, and human override are recorded.

## 22. Responsive behaviour

### Student learning

- Wide: course rail + reading canvas + optional TOC; media may widen beyond prose; next action remains visible without becoming sticky clutter.
- Medium/tablet: collapsible course rail, full reading canvas, split media only where legible; touch and keyboard both first-class.
- Compact: one stream, course navigator in a focus-managed sheet, headings scaled but still editorial, media naturally sized, 44 px minimum targets, no hidden horizontal action rows.

### Assessment

- Wide shared stimulus: passage/media and question pane side by side with synchronised question navigation but independent, understandable scroll positions.
- Tablet: split where content permits; otherwise stimulus drawer/top and persistent “Return to question” affordance.
- Mobile: stimulus and question use deliberate stacked or switcher views, not a squeezed split. Response remains preserved when switching. Submit/check actions respect the keyboard and safe area.
- Dense tables/diagrams offer controlled horizontal pan plus semantic alternative; option grids become vertical when labels wrap.

### Admin

- Wide workbench: hierarchy rail, canvas/preview, inspector.
- Tablet: rail becomes drawer; inspector becomes side sheet; authoring still supports external keyboard.
- Mobile: safe content edits and review are supported; complex layout composition clearly recommends a larger viewport rather than hiding controls or enabling error-prone drag-only authoring.

## 23. Accessibility requirements

The target is WCAG 2.2 AA as a baseline, with AAA-oriented reading contrast where practical.

- Verify contrast for every theme/state pair, including hover, disabled, selected, and charts.
- Use a consistent, high-visibility focus ring with offset and forced-colour support.
- Every action and response works fully by keyboard; custom shortcuts are optional, discoverable, and never replace standard interaction.
- Native semantics precede ARIA. Pages use landmarks, coherent headings, descriptive titles, and logical DOM/focus order.
- Images require meaningful alt text or an explicit decorative decision; diagrams require long descriptions/data alternatives.
- Audio/video require captions and transcripts; important visual video information needs an audio-description or textual alternative.
- Errors are identified in text, associated with fields, summarised on submit, and focused predictably without erasing entries.
- Instructions never depend on colour, position, sound, or gesture alone.
- Touch targets should generally be at least 44 × 44 CSS px with sufficient spacing.
- Support 200% browser zoom and text resizing without loss; test reflow at 320 CSS px.
- `prefers-reduced-motion` removes nonessential movement; reduced-transparency/high-contrast modes receive solid surfaces.
- Drag has button/select/keyboard alternatives. Hover has focus/tap equivalents.
- Timers offer textual remaining time, restrained threshold announcements, pause/accommodation rules, and no constant live-region chatter.
- Audio controls expose play/pause, time, speed, volume/mute, transcript, and status. Recording exposes permission, device, preparation, recording, review, retry, upload, and error states nonvisually.
- Tables use captions and header associations; responsive transforms preserve those relationships.
- Mobile screen readers must not encounter off-canvas navigation, hidden duplicate controls, or focus behind sheets.
- Feedback live regions announce state briefly; focus then lands on a real feedback heading/control.
- Strict exam profiles still honour approved accommodations and accessibility; “simulation fidelity” is never a reason to block access.

## 24. Three premium visual concepts

### Concept A — Porcelain Atlas

**Design philosophy:** Learning is a guided intellectual journey. A quiet editorial field holds precise routes, evidence markers, and moments of rich course colour.

- **Brand mood:** assured, warm, cosmopolitan, exacting.
- **Palette:** porcelain, deep ink, signature burnt orange; cobalt/violet/mint as controlled programme accents.
- **Typography:** characterful editorial serif for openings; highly legible humanist sans for learning and interface.
- **Surface treatment:** mostly opaque paper-like fields; selective floating translucent navigation; soft directional shadows.
- **Hero direction:** asymmetric editorial title paired with an original “learning atlas” vector—paths, annotations, and language fragments—not a stock dashboard illustration.
- **Navigation direction:** a slim course atlas rail on desktop, hierarchical sheet on mobile, strong breadcrumbs and next/previous rhythm.
- **Block appearance:** blocks compose a page; many have no card boundary. Special blocks use a left marker, tonal field, or widened measure.
- **Vector/illustration:** geometric maps of ideas with human line accents, diagrams, layered annotations, course-colour wayfinding.
- **Motion character:** quiet route continuity, small marker transitions, gentle reveal; almost absent in strict assessment.
- **Course themes:** programme colours affect atlas line, hero motif, section markers, and illustration palette while porcelain/ink remain dominant.
- **Student lesson:** opening context, readable narrative spine, occasional wide evidence/media, sticky but restrained TOC, terminal next lesson.
- **Admin workspace:** structured “map builder”: hierarchy rail, composed canvas, property inspector, publish/status strip.
- **Assessment composition:** clean instrument-like split layout inside the same editorial world; decoration recedes, course accent identifies context.
- **Feedback composition:** a precise evidence card—result, diagnosis, supporting evidence, strategy, next action.
- **Desktop:** takes full advantage of rails, reading measure, wide diagrams, and split assessment.
- **Mobile:** becomes a strong single narrative with sheets for map/navigation and feedback summary.
- **Strengths:** distinctive but credible, strong language-learning metaphor, scalable course themes, excellent editorial hierarchy.
- **Risks:** illustration and spatial discipline require a real design system; poor execution could become decorative cartography.

### Concept B — Academic Instrument

**Design philosophy:** The platform is a trusted scholarly instrument. Precision, evidence, and typographic structure replace atmospheric decoration.

- **Brand mood:** rigorous, institutional, calm, transparent.
- **Palette:** warm white, navy-black, oxide orange, graphite, measured data colours.
- **Typography:** modern grotesk/sans throughout with an optional scholarly serif for long quotations; strong numeric system.
- **Surface treatment:** flatter, grid-led, fine rules, little translucency, almost no ambient gradient.
- **Hero direction:** typographic manifesto with programme index and evidence/data motif.
- **Navigation direction:** persistent labelled rail, strong index numbers, command/search model for expert users.
- **Block appearance:** baseline-aligned modules with editorial rules; comparisons/tables/assessment feel exceptionally clear.
- **Vector/illustration:** technical line diagrams, typographic compositions, data/evidence visualisations.
- **Motion character:** crisp 100–220 ms state transitions; no ambient movement.
- **Course themes:** narrow accent bands, index markers, and chart palettes; master brand strongly dominant.
- **Student lesson:** resembles a beautifully typeset digital study guide with annotations and practice checkpoints.
- **Admin workspace:** efficient three-pane publishing system with dense metadata and predictable controls.
- **Assessment composition:** strongest concept for serious timed work—neutral, dense, stable, highly legible.
- **Feedback composition:** structured diagnostic report with rubric/evidence tables and clear next steps.
- **Desktop:** excellent information density and institutional work.
- **Mobile:** orderly and fast, though less emotionally rich; tables transform carefully.
- **Strengths:** maximum credibility, accessibility, assessment focus, and operational scalability.
- **Risks:** can feel austere or like academic publishing software; weaker emotional differentiation for general/young learning.

### Concept C — Living Language Studio

**Design philosophy:** Language is embodied, social, and situational. Lessons feel like curated studio scenes that shift between listening, observing, practising, and responding.

- **Brand mood:** cultured, expressive, optimistic, immersive.
- **Palette:** warm cream and ink with richer course atmospheres—peach/turquoise, violet/coral, cobalt/orange—used in larger spatial fields.
- **Typography:** expressive serif display paired with rounded-but-professional sans; larger conversational typography.
- **Surface treatment:** layered stages, occasional translucent media controls, more full-bleed colour and imagery.
- **Hero direction:** cinematic vector/photographic collage representing authentic contexts and voices.
- **Navigation direction:** scene/lesson timeline with contextual “studio dock”; conventional hierarchy remains available.
- **Block appearance:** media-rich compositions, split scenes, dialogue cards, animated annotations, and voice-led transitions.
- **Vector/illustration:** people, places, conversations, sound shapes, and editorial collage.
- **Motion character:** gentle scene transitions, waveform/annotation responses, richer completion moments.
- **Course themes:** more expressive, with distinct atmosphere and illustration sets per programme.
- **Student lesson:** staged arc—arrive, notice, explore, practise, perform, reflect.
- **Admin workspace:** storyboard canvas plus inspector and preview modes.
- **Assessment composition:** switches to a calmer “focus stage”; speaking/listening tasks feel especially natural.
- **Feedback composition:** coaching sequence with playback, annotated moments, rubric, and supportive next rehearsal.
- **Desktop:** expansive split scenes and media; potentially exceptional for speaking/listening.
- **Mobile:** immersive single-stage flow with bottom controls and careful media sizing.
- **Strengths:** most memorable and pedagogically expressive; excellent for authentic language, speaking, and Young Learners.
- **Risks:** highest content/asset cost; greater risk of visual noise, theme fragmentation, motion excess, and reduced institutional seriousness.

## 25. Recommended visual concept

**Recommend Concept A: Porcelain Atlas**, borrowing Academic Instrument’s restraint for assessment and operations and only selective Living Language Studio techniques for media-led lessons.

Why it is the best long-term fit:

- **Professional credibility:** porcelain, ink, editorial type, and precise wayfinding feel considered enough for universities without becoming bureaucratic.
- **Distinctive identity:** the language/learning “atlas” offers an ownable visual and navigational metaphor without copying a conventional LMS or Apple surface.
- **Scalability:** the stable paper/ink base accepts many course themes, block types, and institutional contexts.
- **Language learning:** routes, connections, evidence, annotation, and journey naturally support vocabulary, discourse, skills, and progression.
- **Examination preparation:** the concept can quiet itself into Academic Instrument mode without becoming a different product.
- **Institutional customers:** hierarchy, status, provenance, permissions, and evidence can be represented clearly.
- **Accessibility:** opaque reading surfaces, restrained motion, clear markers, and strong typography are inherent rather than corrective.
- **Responsive design:** atlas rails become navigable sheets and the editorial spine becomes a strong mobile sequence.

The recommendation is a direction, not a request to implement. It should first be tested through a small set of visual prototypes after approval.

## 26. Wire-level descriptions of essential screens and states

### A. Public landing

Wide: slim institutional masthead; asymmetric headline and short proof statement on the left; original atlas vector/course constellation on the right; one primary action and one quiet secondary action; below, audience/programme evidence rather than a card grid. Compact: masthead, title, proof, actions, then a cropped but meaningful vector; no decorative content before the primary action.

### B. Authentication

Wide: a 5/7 split—quiet editorial brand/programme context and an opaque focused form. Compact: remove the split artwork, keep identity, short reassurance, form, and support. Errors sit at summary and field level; success/check-email becomes a calm full-card state with next action.

### C. Student course home

Course hero with family/level/cohort and a restrained theme motif; one “Continue” panel; module route below as a vertical atlas with lesson status and clear locked/unavailable meanings; secondary resources after the route. Desktop course navigation remains visible; mobile uses a sheet.

### D. Student lesson

Breadcrumbs and progress context; editorial lesson title/description; optional sticky TOC; a continuous block canvas where ordinary prose has no card, while tips/examples/media widen or tint intentionally; progress checkpoint; terminal previous/next. Technical “Block 1” labels are absent from student view.

### E. Admin course/content workbench

Top status bar: course, draft/published, preview, save state, publish action. Left: hierarchy tree with modules/lessons. Centre: composed lesson canvas with insertion points and selected-block outline. Right: schema-generated inspector with Content/Layout/Theme/Accessibility/Visibility tabs. Protected fields show lock and reason. Mobile supports review/simple edits; structural composition is safer on tablet/desktop.

### F. Immediate single-question feedback

Question and response remain in place. On “Check answer,” control enters a brief checking state, then a 3–4 px semantic edge, icon, and explicit result label appear. Focus moves to the feedback heading. A short diagnosis is visible; “Why?”, hint/revision, and next action expand below. Correct answer appears only if policy permits. Screen reader receives one concise announcement. Reduced motion changes state instantly.

### G. Group “Check answers” feedback

Before submission, unanswered requirements produce a top error summary linked to each item; responses are preserved. After checking, a group result header shows score and counts, followed by question-number navigation carrying icon + text states. Each question contains inline result; a side panel (wide) or bottom summary sheet (mobile) offers skill breakdown, revision, retry, and continue. Group size is unconstrained.

### H. Full assessment-results review

Header: assessment identity, attempt, status, score if released, time, and primary next action. Summary: objective/skill breakdown, not decorative charts without data tables. Review list: stimulus reference, response, released correct meaning, explanation, time, flags, and attempt comparison. Persistent filters for incorrect/partial/unanswered/pending. Teacher comments and score changes show provenance.

### I. Teacher/manual-feedback state

Student sees submitted timestamp, immutable response/recording, “Awaiting teacher review,” expected process (not a false deadline), and any automatically releasable neutral receipt. No answer key or provisional AI grade leaks. When released, rubric criteria, teacher comments, annotated evidence, and revision action appear; recording feedback is transcript-supported.

### J. Mobile assessment and feedback

Compact header shows section, question number, flag, and accessible timer; it does not consume more than a modest band. Shared stimulus opens above or in a labelled full-height view with a persistent “Return to Question 4.” Options are full-width and not nested in horizontally scrolling cards. Check/next controls sit in normal flow or a keyboard-safe sticky footer. Feedback summary may rise as a bottom sheet, but detailed feedback is inline and focus returns predictably.

### K. Strict exam-simulation mode

Neutral cool canvas; minimal course colour; exam title, section, accessible timer, question navigation, flag, and response only. No correctness, hints, explanations, celebratory motion, ambient animation, or unreleased answer payload. Submission requires an unanswered count and confirmation. Connectivity/autosave status is quiet but available. Accommodations and emergency recovery remain active.

### L. Empty, loading, error, and unavailable

- Empty authoring: describe the educational opportunity and offer only authorised next actions.
- Empty student: distinguish “not published,” “not yet available,” and genuinely no content without leaking drafts.
- Loading: preserve page geometry; use low-contrast static/pulse skeleton and status text.
- Recoverable error: explain what remains safe, preserve input, offer retry, and log reference without raw database detail.
- Revoked external media: retain title/context, state that the source is unavailable, and provide authorised alternatives.

## 27. Prioritised implementation phases

No phase begins until this brief and then the relevant prototype are approved.

### Phase 0A — Visual direction comparison

Create one visual concept board for each of the three directions:

1. Porcelain Atlas
2. Academic Instrument
3. Living Language Studio

Every board must apply its concept to **the same representative slice** of the IELTS Preparation (B2) student lesson and the same assessment/feedback state. The content, learning objective, question data, feedback state, and target viewports remain fixed so the comparison evaluates design rather than different content. Each board must show enough course identity, module/lesson navigation, teaching content, an exam tip, original visual direction, media treatment, assessment interaction, and feedback to judge the system rather than a hero image alone.

The boards must be genuinely different compositions. Differences should be visible in spatial model, navigation, typography, surface hierarchy, block rhythm, illustration language, assessment arrangement, feedback presentation, desktop behaviour, and mobile behaviour—not merely palette, radius, or shadow changes.

Porcelain Atlas remains the written recommendation, not an approved visual direction. **No concept proceeds because this brief recommends it.** The three boards require an explicit visual review and selection decision. Unresolved product decisions in Section 28 remain open during this comparison and must not be silently settled by a concept board.

### Phase 0B — Chosen-direction prototypes

Only after one direction is explicitly selected through Phase 0A, create four non-production, high-fidelity responsive prototypes:

- public landing;
- student lesson;
- admin content workbench;
- assessment and detailed feedback experience.

These prototypes validate the chosen system across public identity, focused learning, operational authoring, and serious assessment. They must cover desktop and mobile compositions, meaningful state transitions, reduced-motion equivalents, course-theme restraint, reading measure, admin density, block hierarchy, and the boundary between assessment presentation and protected answers.

**Production gate:** the first visual prototype set must be judged visually and explicitly accepted before any production CSS redesign, design-system implementation, or component migration begins. Prototype approval does not by itself approve database, Supabase, roadmap, or product-policy changes.

### Required IELTS pilot prototype content

Phase 0A and 0B must use realistic content grounded in the existing pilot rather than lorem ipsum, generic analytics, or meaningless placeholder cards. The shared prototype fixture must include:

- the course identity **IELTS Preparation (B2)** and the **IELTS Pilot Cohort** where cohort context is appropriate;
- the module **Introduction to the IELTS Test** and lesson **IELTS Test Structure Overview**;
- module and lesson navigation that makes the hierarchy and current location unambiguous;
- realistic teaching text developed from the existing **What the IELTS test measures** content and verified IELTS concepts;
- at least one credible exam tip or callout, such as interpreting instructions and variable word/number limits;
- an original vector/illustration or diagram communicating the four skills or test structure;
- a believable PDF and media treatment, using authorised pilot media when available or an explicitly authored representative resource when it is not;
- multiple response types, including at minimum single select, True/False/Not Given, and one completion response, arranged as a realistic question group;
- immediate single-question feedback and group-level **Check answers** feedback;
- correct, incorrect, partially correct, and pending-manual-review examples;
- desktop and mobile versions using identical content and state meaning.

Content fidelity must be high enough to expose real line lengths, option wrapping, instructions, captions, hierarchy, feedback depth, and media constraints. Any authored prototype question must be clearly treated as platform demonstration content, not represented as an official live IELTS item.

### Prototype acceptance criteria

Phase 0 is accepted only when the review can demonstrate all of the following:

- visually distinctive from generic SaaS and LMS products;
- no repeated-card-grid approach as the primary composition;
- warm porcelain, deep ink, and rich orange master identity;
- controlled course-specific colour that does not fragment the master brand;
- an original vector or illustration direction rather than stock decoration;
- a clear editorial reading rhythm;
- distinct public, student, admin, and assessment shells;
- purposeful motion with complete reduced-motion equivalents;
- WCAG 2.2 AA-oriented contrast, semantics, states, and interaction;
- keyboard-complete controls, including non-drag alternatives;
- tested at 320 px, 400 px, tablet, standard desktop, and wide desktop sizes;
- no unintended horizontal overflow at any target size;
- excellent behaviour at 200% browser zoom;
- realistic loading, empty, error, and unavailable states;
- assessment answer keys are never exposed in prototype client payloads if any functional checking is demonstrated; static visual-state prototypes must not masquerade as secure scoring;
- performance-conscious images, vectors, fonts, media, blur, and motion;
- a professional, institutionally credible appearance suitable for schools and universities.

Acceptance evidence should record viewport results, keyboard paths, contrast checks, reduced-motion behaviour, known limitations, and unresolved decisions. Passing Phase 0 selects and validates a visual direction; it does not authorise broad feature implementation.

### Phase 1 — Foundational product system

- Tokens: colour, type, spacing, radii, elevation, motion, focus, state, and course-theme contract.
- Primitives: button/link, field, select, surface, badge, alert, status, empty/loading/error, page header, navigation, modal/sheet.
- Role compositions: public shell, student course shell, admin workbench shell, assessment shell.
- Registry interfaces and schema-version conventions, initially without broad schema migration.

### Phase 2 — First premium learning MVP

- Foundational blocks: hero, section, columns, heading/rich text, callout/exam tip/takeaway, divider, breadcrumbs, course navigation, TOC, previous/next.
- Media: image, audio + transcript, private video, PDF, and governed Drive media.
- Student course/module/lesson composition and core admin preview/authoring experience.
- Progress checkpoints may be visually prepared, but the paused Progress Tracking milestone remains separate.

### Phase 3 — Assessment foundations

- Versioned assessment/profile/question/attempt contracts and security review.
- Shared stimulus and any-size question groups.
- Single select, multiple select, typed gap, dropdown/inline dropdown, and short answer.
- Server-authoritative exact/variant/per-gap/partial scoring.
- Feedback/release/retry policies, group checking, strict mode, and results review.
- Start with General English formative practice and one dated IELTS pilot profile; do not build every provider at once.

### Phase 4 — Premium formative expansion

- Matching, ordering, classification, flashcards, vocabulary practice, worked examples, reflection, tables/diagrams, and richer feedback media.
- IELTS completion/matching/diagram variants and Cambridge cloze/transformation profiles.

### Phase 5 — Productive skills and teacher tooling

- Writing editor, private recordings, accessible timers, manual rubrics, reviewer assignment/moderation, and admin-created teacher slots.
- TOEFL/PTE/CELPIP dated profiles after provider-by-provider verification and device testing.

### Phase 6 — Advanced blocks and assessment

- Hotspots/annotation, highlighting, sentence building, complex drag with alternatives, galleries/timelines/comparisons, portfolio/file submission, print/worksheet renderers, and advanced institutional reporting.

### Future AI-assisted features

- Pronunciation indicators, writing suggestions, transcript support, content tagging, distractor assistance, and rubric evidence suggestions.
- AI remains visibly advisory until governance, evaluation, bias, privacy, appeal, and human override are proven. It must never receive or expose more learner/answer data than necessary.

## 28. Risks, dependencies, and unresolved decisions

### Risks

- **Scope inflation:** a broad taxonomy can become a promise to implement everything. Mitigation: registry architecture first, small vertical sets second.
- **Theme fragmentation:** course colour and illustration can overwhelm master identity. Mitigation: approved tokens, previews, and automated contrast checks.
- **Authoring complexity:** expressive layout controls can reduce consistency. Mitigation: constrained variants, templates, progressive disclosure, and publish validation.
- **Assessment leakage:** generic client-rendered components can accidentally receive keys. Mitigation: separate payloads/services and security tests before UI expansion.
- **Provider volatility:** exam formats, timing, and scoring change. Mitigation: dated source-backed profiles with immutable attempts and retirement.
- **Media privacy misconception:** Drive sharing and signed URLs are access mechanisms, not perfect DRM. Mitigation: explicit author warnings and institutional policy.
- **Accessibility debt:** custom interaction can outpace testing. Mitigation: native-first renderers, equal alternatives, automated and manual assistive-tech gates.
- **Content production cost:** original illustration, transcripts, captions, feedback, and responsive art direction require staffing and workflow.
- **Performance:** large media, fonts, glass, animation, and complex question groups can degrade lower-end devices. Mitigation: budgets, lazy loading, static fallbacks, and representative-device tests.
- **Internationalisation:** Persian/RTL, bilingual content, local calendars/currencies, and mixed scripts will affect type, layout, numerals, and authoring. These need a separate early design validation before localisation implementation.

### Dependencies

- Approved visual concept and prototype set.
- Font licensing and Persian/Latin compatibility decision.
- Final content governance and institutional brand-customisation boundary.
- Versioned block and assessment data design, reviewed alongside RLS and storage policies.
- Media processing/caption/transcript workflow and asset rights policy.
- Provider trademark/content-licensing review for commercial exam preparation.
- Accessibility test plan covering keyboard, VoiceOver, NVDA, zoom, reduced motion, captions, recording, and timers.

### Unresolved decisions for approval/discovery

1. Should the public master brand use an editorial serif, or reserve serif only for course moments?
2. How much organisation-level co-branding is allowed without weakening the platform identity?
3. Which first IELTS task group is the best assessment vertical slice: reading completion, listening completion, or mixed reading selection?
4. Which feedback defaults distinguish low-stakes lesson practice from formal mock exams?
5. What student data retention, recording consent, moderation, and deletion policies apply by market/institution?
6. What Persian/RTL launch horizon should influence the first font and layout choices?
7. Which media must support offline/print access, and what rights permit it?
8. Should teacher slot changes always require admin publication in the MVP?
9. Which progress evidence represents meaningful learning rather than simple completion?

---

## Approval gate

This brief intentionally stops before visual prototyping or implementation. Approval of the written brief authorises only the separately requested Phase 0A comparison work: equivalent concept boards for Porcelain Atlas, Academic Instrument, and Living Language Studio. It does not select Porcelain Atlas or any other direction. Phase 0B begins only after explicit visual selection, and production CSS redesign or component migration begins only after the first high-fidelity prototype set is visually reviewed and explicitly accepted. Application code, schemas, migrations, unresolved product decisions, and the roadmap remain unchanged until a separately approved implementation milestone.
