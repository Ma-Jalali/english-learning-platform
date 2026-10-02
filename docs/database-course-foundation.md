# Admin-controlled course database foundation

This phase adds the hierarchy `organisation → course → cohort → module → lesson
→ lesson block`, plus enrolments, teacher assignments, and isolated teacher
slots. The existing `organisations` table from phase 1 remains the root.

Migration file:
[`supabase/migrations/20261003010000_create_admin_course_foundation.sql`](../supabase/migrations/20261003010000_create_admin_course_foundation.sql)

## Security model

- Students read only published courses connected to their own enrolments.
- Teachers read course content only through their own cohort assignments.
- Core structure and course publication are writable only by profiles whose
  server-controlled role is `admin`.
- Admins pre-create each fixed `teacher_slots` record and assign it to a teacher
  and cohort. Teachers cannot insert or delete slots.
- Teachers can update only `title` and `content` in slots assigned to them. A
  database trigger rejects non-admin changes to slot placement, assignment,
  type, order, identity, or creation timestamp.
- Price columns are catalogue placeholders only; there is no payment logic.
- No authorization rule trusts Auth user metadata or a client-supplied role.

## Apply once in Supabase SQL Editor

1. Confirm the phase-1 migration has already been applied to the intended
   Supabase project.
2. In that project, open **SQL Editor** and choose **New query**.
3. Open the migration file above locally and copy its complete contents.
4. Paste the SQL into the new query and reconfirm the project name.
5. Choose **Run** exactly once. The transaction will roll back the whole phase if
   any statement fails.
6. Record the project and successful execution time. SQL Editor does not mark the
   local file as applied in Supabase CLI migration history, so do not replay it
   through another workflow without reconciling that history first.

No service-role key or application secret is needed in the SQL Editor.

## Verify

Run this read-only query after a successful application:

```sql
select tablename, rowsecurity
from pg_tables
where schemaname = 'public'
  and tablename in (
    'organisations',
    'courses',
    'cohorts',
    'modules',
    'lessons',
    'lesson_blocks',
    'enrolments',
    'teacher_assignments',
    'teacher_slots'
  )
order by tablename;

select tablename, policyname, cmd, roles
from pg_policies
where schemaname = 'public'
  and tablename in (
    'organisations',
    'courses',
    'cohorts',
    'modules',
    'lessons',
    'lesson_blocks',
    'enrolments',
    'teacher_assignments',
    'teacher_slots'
  )
order by tablename, cmd, policyname;
```

Every listed table should report `rowsecurity = true`. Core tables should have
one role-scoped `SELECT` policy plus separate admin-only `INSERT`, `UPDATE`, and
`DELETE` policies. `teacher_slots` should instead show admin-only `INSERT` and
`DELETE` policies, plus an `UPDATE` policy for admins and the assigned teacher.
The update-boundary trigger keeps the fixed slot structure under admin control.
