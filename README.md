# English Learning Platform

A specialist English-language learning platform for General English (A1–C1), Cambridge English exams, IELTS, TOEFL iBT, PTE Academic, EAP, BEC, Young Learners and future CELPIP courses.

## Current stage

[`docs/roadmap.md`](docs/roadmap.md) is the live record of delivery status and the next active milestone; [`AGENTS.md`](AGENTS.md) holds the operating rules for anyone working in this repository.

- **Current pilot:** IELTS Preparation (B2).
- **Delivered:** the secure foundation — authentication, server-controlled roles, RLS-protected course hierarchy, administrator course and media management, cohort membership, and a read-only student learning interface.
- **Design:** Porcelain Atlas V3 is the approved visual direction. The Phase 0C mock-test visual laboratory (`design/phase-0c/`) was visually approved on 10 October 2026. Its architecture ([`docs/mock-test-commerce-foundation.md`](docs/mock-test-commerce-foundation.md)) is approved in principle, and its product defaults and policy baselines were recorded in [`docs/decisions.md`](docs/decisions.md) on 1 November 2026. None of it is implemented; prototype and policy approval do not authorise production implementation, and each stage needs separate explicit authorisation.
- **Payments:** deferred. Courses are free during development; no checkout, payment provider or financial integration is active.

*History:* the project was initialised with a **B1 Preliminary Writing and Speaking mini-course** as its pilot. IELTS Preparation (B2) has since replaced it as the current pilot; no decision has been recorded about whether the B1 mini-course will return.

## Development workflow

- **Claude Code** is the primary developer.
- **ChatGPT** handles planning, requirements, architecture discussions and coordination.
- **Codex** is optional, mainly for independent verification or troubleshooting.

See the AI development workflow in [`AGENTS.md`](AGENTS.md).

## Content governance

- Administrators own and control organisations, courses, cohorts, modules, lessons, core blocks, branding, publishing and permissions.
- Teachers cannot create, edit, delete, move, rename, hide or unlock administrator core content.
- Teachers may later edit only administrator-created teacher slots assigned to them; administrators create, place, type, order, assign and delete the slots.
- Students may access only courses and cohorts in which they are enrolled, and may later create only their own submissions, projects and portfolios.

## Technology

- Next.js (App Router) + TypeScript
- Supabase: authentication, PostgreSQL, private Storage and row-level security
- Payments later: AUD/USD for international learners and toman for Iranian learners. Providers, routes, tax and banking remain undecided.

*History:* the initial plan also listed Tailwind CSS and Vercel hosting. The current application uses shared CSS without Tailwind, and hosting has not yet been chosen; deployment is a later roadmap milestone.

## Local development

1. Install Node.js 20+.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local` and add the Supabase project URL and publishable key. Never commit `.env.local` or use a service-role key in client code.
4. Run `npm run dev`.

No real student data, credentials or copyrighted course material belongs in this repository.

## Documentation

- [Repository operating guide](AGENTS.md)
- [Product roadmap](docs/roadmap.md) — authoritative current status
- [Product decisions](docs/decisions.md)
- [Visual design brief](docs/visual-design-brief.md)
- [Mock-test commerce foundation](docs/mock-test-commerce-foundation.md) — architecture approved in principle; not implemented
- [Initial backlog](docs/backlog.md) — early planning context
