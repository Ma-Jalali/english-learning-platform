# English Learning Platform

A specialist English-language learning platform for General English (A1–C1), Cambridge English exams, IELTS, TOEFL iBT, PTE Academic, EAP, BEC and future CELPIP courses.

## Current stage

Phase 1: project foundation.

The initial pilot is a **B1 Preliminary Writing and Speaking mini-course**. The first end-to-end outcome is that an administrator creates a locked master lesson; a teacher runs an assigned cohort and adds a permitted class note; a student completes a task, receives feedback and sees progress.

## Confirmed content governance

- Administrators/academic designers own all master courses, modules, lessons, assessments, branding and publishing.
- Teachers cannot edit, hide, rename, move or delete administrator-created content.
- Teachers may create, edit and delete only their own additions inside separate empty teacher slots.
- Students can create only their own submissions and portfolio material.

## Planned technology

- Next.js + TypeScript
- Tailwind CSS
- Supabase: authentication, PostgreSQL, storage and row-level security
- Vercel hosting
- Payments later: separate international USD and Iranian toman routes

## Local development

1. Install Node.js 20+.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local` when Supabase is introduced.
4. Run `npm run dev`.

No real student data, credentials or copyrighted course material belongs in this repository.

## Documentation

- [Product decisions](docs/decisions.md)
- [Initial backlog](docs/backlog.md)

