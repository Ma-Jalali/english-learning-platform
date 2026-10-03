# Repository Operating Guide

These instructions apply to the entire repository. Read this file and
`docs/roadmap.md` before starting every milestone.

## Product

- This is a specialised English-learning platform.
- The planned catalogue includes General English A1–C1, IELTS, TOEFL iBT, PTE,
  EAP, BEC, Cambridge exams, Young Learners, and future CELPIP courses.
- The current pilot is **IELTS Preparation (B2)**.
- Keep the product focused on structured language learning, cohort delivery,
  assessment, feedback, and learner progress.

## Roles and content governance

- Administrators own and control organisations, courses, cohorts, modules,
  lessons, core blocks, branding, publishing, and permissions.
- Teachers must never create, edit, delete, move, rename, hide, or unlock
  administrator core content.
- Teachers may later edit only administrator-created teacher slots assigned to
  them. Administrators create, place, type, order, assign, and delete the slots.
- Students may access only courses and cohorts in which they are enrolled.
- Students may later create only their own submissions, projects, and
  portfolios.
- Never add a client workflow that lets a user promote themselves, select a
  privileged role, assign their own organisation, enrol themselves, or assign
  themselves to a cohort.

## Security rules

- Enable Supabase Row Level Security on every exposed table and define explicit,
  least-privilege policies.
- Never trust client-supplied roles, ownership identifiers, hierarchy IDs, lock
  state, ordering, publishing state, or permission claims.
- Every server action or route handler must recheck authentication, the
  server-controlled profile role, and the complete relevant hierarchy.
- Use Supabase `getClaims()` for verified identity. Do not substitute unverified
  session metadata for authorization.
- Never expose or use a service-role key in client code. Do not request a
  service-role key unless a future, explicitly approved server-only design
  genuinely requires one.
- Never commit `.env.local`, tokens, passwords, banking details, API keys, or
  other secrets.
- Official course media belongs in private Supabase Storage. Use authenticated
  access and short-lived signed URLs where a server-rendered preview needs one.
- Validate external URLs with strict scheme, host, path, and identifier
  allowlists. Never render caller-supplied iframe HTML or embed code.
- Treat every committed migration in `supabase/migrations/` as already applied
  and immutable. Create a new timestamped migration for every future schema,
  function, trigger, policy, or Storage change.
- Never apply a remote migration or run a destructive database action unless the
  user explicitly approves that exact operation.
- Keep security-definer helpers in `app_private`, pin an empty `search_path`, use
  schema-qualified objects, and grant only the narrow execution rights required
  by RLS.

### Known Supabase/PostgreSQL pitfall

When a table's SELECT policy calls a `STABLE` helper that queries that same
table, avoid chaining `.select()` or `.single()` to an insert unless the returned
row is genuinely required and proven safe. PostgREST turns that into
`INSERT ... RETURNING`; the same-statement helper snapshot may not see the new
row and can reject an otherwise authorized insert. Prefer a minimal insert,
then read the row in a separate statement or refreshed server render.

## Current business decisions

- Courses remain free during development.
- Do not add a bank account, ABN workflow, live payments, checkout, or financial
  integration now.
- Payments are deferred until the platform and business accounts are ready.
- Future payment currencies are AUD/USD for international users and toman for
  Iranian users.
- Price columns currently present in the schema are placeholders only; they do
  not authorize payment work.

## Development workflow

1. Read this file and `docs/roadmap.md` before every milestone.
2. Inspect `git status`, the relevant code, and all applicable migrations before
   editing. Use the roadmap and git history as the live project record; older
   planning documents may be historical.
3. Preserve unrelated user changes. Never discard, rewrite, stage, or commit
   them.
4. Work only on the active roadmap milestone requested by the user. Do not pull
   later-stage features into the current milestone.
5. Prefer a complete, secure vertical milestone over a collection of tiny,
   disconnected edits. Keep changes no broader than the milestone.
6. Reuse established server authentication, admin checks, hierarchy validation,
   form feedback, design primitives, and RLS patterns.
7. Before completion, run:
   - `npm run lint`
   - `npm run build`
   - `git diff --check`
8. Perform relevant desktop and mobile browser checks for changed interfaces,
   including keyboard focus, validation, success/error states, and protected
   route behavior. Fix discovered problems before completion.
9. Do not claim manual checks that were not performed. If important manual
   testing remains, report it and do not commit.
10. When the user explicitly requests a roadmap milestone, commit it locally
    only after all checks and required manual testing pass. Use a clear
    conventional commit message.
11. For work that is not an explicitly requested roadmap milestone, do not infer
    permission to commit; follow the user's instruction.
12. Never push unless the user explicitly requests it.
13. Do not commit when tests fail, build errors remain, security behavior is
    uncertain, or important manual testing is still required.
14. At handoff, report:
    - changed files;
    - automated tests and their results;
    - browser/manual checks performed;
    - manual checks still required;
    - the local commit hash, when a commit was created.

## Roadmap maintenance

- Implement only the next incomplete milestone unless the user explicitly names
  another one.
- Update `docs/roadmap.md` in the same milestone commit to record material
  completed work, verification, and the next active milestone.
- Do not mark a milestone complete until its security checks, automated checks,
  and required manual checks pass.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
