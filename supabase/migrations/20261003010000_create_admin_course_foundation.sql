begin;

-- organisations is the existing root table from phase 1. This migration adds
-- the course hierarchy beneath it and extends its RLS access safely.
create type public.course_status as enum ('draft', 'published', 'archived');
create type public.lesson_block_type as enum (
  'text',
  'image',
  'video',
  'file',
  'quiz',
  'embed'
);
create type public.teacher_slot_type as enum (
  'announcement',
  'homework',
  'supplementary_resources'
);

create table public.courses (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references public.organisations (id) on delete restrict,
  title text not null,
  slug text not null,
  description text,
  level text,
  course_family text,
  status public.course_status not null default 'draft',
  -- Price data is a catalogue placeholder only. No payment provider, checkout,
  -- transaction, or entitlement logic is introduced by this migration.
  price_amount numeric(12, 2),
  price_currency text,
  sort_order integer not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint courses_organisation_slug_key unique (organisation_id, slug),
  constraint courses_price_fields_check check (
    (price_amount is null and price_currency is null)
    or (
      price_amount is not null
      and price_amount >= 0
      and price_currency ~ '^[A-Z]{3}$'
    )
  )
);

create table public.cohorts (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete cascade,
  name text not null,
  slug text not null,
  sort_order integer not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint cohorts_course_slug_key unique (course_id, slug)
);

create table public.modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete cascade,
  title text not null,
  slug text not null,
  description text,
  sort_order integer not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint modules_course_slug_key unique (course_id, slug)
);

create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.modules (id) on delete cascade,
  title text not null,
  slug text not null,
  description text,
  sort_order integer not null default 0 check (sort_order >= 0),
  is_locked boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint lessons_module_slug_key unique (module_id, slug)
);

create table public.lesson_blocks (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.lessons (id) on delete cascade,
  block_type public.lesson_block_type not null,
  title text,
  content jsonb not null default '{}'::jsonb,
  sort_order integer not null default 0 check (sort_order >= 0),
  is_locked boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Membership rows are admin-managed. A row grants access; clients cannot create
-- their own enrolment or teaching assignment.
create table public.enrolments (
  id uuid primary key default gen_random_uuid(),
  cohort_id uuid not null references public.cohorts (id) on delete cascade,
  student_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint enrolments_cohort_student_key unique (cohort_id, student_id)
);

create table public.teacher_assignments (
  id uuid primary key default gen_random_uuid(),
  cohort_id uuid not null references public.cohorts (id) on delete cascade,
  teacher_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint teacher_assignments_cohort_teacher_key unique (cohort_id, teacher_id)
);

-- Admins pre-create these fixed content areas and assign each one to a teacher.
-- Teachers can fill assigned slots, but cannot create, remove, or restructure
-- them. The composite foreign key requires a real teacher assignment.
create table public.teacher_slots (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.lessons (id) on delete cascade,
  cohort_id uuid not null,
  teacher_id uuid not null,
  slot_type public.teacher_slot_type not null,
  title text,
  content jsonb not null default '{}'::jsonb,
  sort_order integer not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint teacher_slots_assignment_fkey
    foreign key (cohort_id, teacher_id)
    references public.teacher_assignments (cohort_id, teacher_id)
    on delete cascade
);

-- Foreign-key and ordering indexes support hierarchy navigation and the RLS
-- membership checks. Unique constraints above supply their own indexes.
create index courses_organisation_status_sort_idx
on public.courses (organisation_id, status, sort_order);

create index cohorts_course_sort_idx
on public.cohorts (course_id, sort_order);

create index modules_course_sort_idx
on public.modules (course_id, sort_order);

create index lessons_module_sort_idx
on public.lessons (module_id, sort_order);

create index lesson_blocks_lesson_sort_idx
on public.lesson_blocks (lesson_id, sort_order);

create index enrolments_student_idx
on public.enrolments (student_id, cohort_id);

create index teacher_assignments_teacher_idx
on public.teacher_assignments (teacher_id, cohort_id);

create index teacher_slots_cohort_lesson_sort_idx
on public.teacher_slots (cohort_id, lesson_id, sort_order);

create index teacher_slots_lesson_sort_idx
on public.teacher_slots (lesson_id, sort_order);

create index teacher_slots_assignment_idx
on public.teacher_slots (cohort_id, teacher_id);

create index teacher_slots_teacher_idx
on public.teacher_slots (teacher_id, cohort_id);

-- Reuse the phase-1 timestamp trigger. Keeping timestamps server-controlled
-- prevents clients from forging update times in future write workflows.
create trigger courses_set_updated_at
before update on public.courses
for each row execute function app_private.set_updated_at();

create trigger cohorts_set_updated_at
before update on public.cohorts
for each row execute function app_private.set_updated_at();

create trigger modules_set_updated_at
before update on public.modules
for each row execute function app_private.set_updated_at();

create trigger lessons_set_updated_at
before update on public.lessons
for each row execute function app_private.set_updated_at();

create trigger lesson_blocks_set_updated_at
before update on public.lesson_blocks
for each row execute function app_private.set_updated_at();

create trigger enrolments_set_updated_at
before update on public.enrolments
for each row execute function app_private.set_updated_at();

create trigger teacher_assignments_set_updated_at
before update on public.teacher_assignments
for each row execute function app_private.set_updated_at();

create trigger teacher_slots_set_updated_at
before update on public.teacher_slots
for each row execute function app_private.set_updated_at();

-- Enforce the expected profile role when an admin creates membership. RLS never
-- trusts a role sent by the client, and this trigger prevents accidental
-- student/teacher membership inversion by privileged workflows.
create function app_private.validate_membership_role()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_table_name = 'enrolments' then
    if not exists (
      select 1
      from public.profiles as profile
      where profile.id = new.student_id
        and profile.role = 'student'::public.app_role
    ) then
      raise exception 'Enrolments require a student profile'
        using errcode = '23514';
    end if;
  elsif tg_table_name = 'teacher_assignments' then
    if not exists (
      select 1
      from public.profiles as profile
      where profile.id = new.teacher_id
        and profile.role = 'teacher'::public.app_role
    ) then
      raise exception 'Teacher assignments require a teacher profile'
        using errcode = '23514';
    end if;
  else
    raise exception 'Unexpected membership table'
      using errcode = '23514';
  end if;

  return new;
end;
$$;

create trigger enrolments_validate_student_role
before insert or update of student_id on public.enrolments
for each row execute function app_private.validate_membership_role();

create trigger teacher_assignments_validate_teacher_role
before insert or update of teacher_id on public.teacher_assignments
for each row execute function app_private.validate_membership_role();

-- A teacher slot may reference only a lesson from the same course as its cohort.
-- This protects the hierarchy even for privileged writes that bypass RLS.
create function app_private.validate_teacher_slot_scope()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  lesson_course_id uuid;
  cohort_course_id uuid;
begin
  select course_module.course_id
  into lesson_course_id
  from public.lessons as lesson
  join public.modules as course_module on course_module.id = lesson.module_id
  where lesson.id = new.lesson_id;

  select cohort.course_id
  into cohort_course_id
  from public.cohorts as cohort
  where cohort.id = new.cohort_id;

  if lesson_course_id is null
    or cohort_course_id is null
    or lesson_course_id is distinct from cohort_course_id then
    raise exception 'Teacher slot lesson and cohort must belong to the same course'
      using errcode = '23514';
  end if;

  return new;
end;
$$;

create trigger teacher_slots_validate_scope
before insert or update of lesson_id, cohort_id on public.teacher_slots
for each row execute function app_private.validate_teacher_slot_scope();

-- Parent moves must not invalidate already stored slot scope. Admins can still
-- restructure courses after removing or relocating the affected teacher slots.
create function app_private.prevent_teacher_slot_scope_break()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_course_id uuid;
begin
  if tg_table_name = 'cohorts' then
    if exists (
      select 1
      from public.teacher_slots as slot
      join public.lessons as lesson on lesson.id = slot.lesson_id
      join public.modules as course_module on course_module.id = lesson.module_id
      where slot.cohort_id = old.id
        and course_module.course_id is distinct from new.course_id
    ) then
      raise exception 'Move or remove cohort teacher slots before changing its course'
        using errcode = '23514';
    end if;
  elsif tg_table_name = 'modules' then
    if exists (
      select 1
      from public.lessons as lesson
      join public.teacher_slots as slot on slot.lesson_id = lesson.id
      join public.cohorts as cohort on cohort.id = slot.cohort_id
      where lesson.module_id = old.id
        and cohort.course_id is distinct from new.course_id
    ) then
      raise exception 'Move or remove module teacher slots before changing its course'
        using errcode = '23514';
    end if;
  elsif tg_table_name = 'lessons' then
    select course_module.course_id
    into target_course_id
    from public.modules as course_module
    where course_module.id = new.module_id;

    if exists (
      select 1
      from public.teacher_slots as slot
      join public.cohorts as cohort on cohort.id = slot.cohort_id
      where slot.lesson_id = old.id
        and cohort.course_id is distinct from target_course_id
    ) then
      raise exception 'Move or remove lesson teacher slots before changing its module'
        using errcode = '23514';
    end if;
  else
    raise exception 'Unexpected course hierarchy table'
      using errcode = '23514';
  end if;

  return new;
end;
$$;

create trigger cohorts_preserve_teacher_slot_scope
before update of course_id on public.cohorts
for each row execute function app_private.prevent_teacher_slot_scope_break();

create trigger modules_preserve_teacher_slot_scope
before update of course_id on public.modules
for each row execute function app_private.prevent_teacher_slot_scope_break();

create trigger lessons_preserve_teacher_slot_scope
before update of module_id on public.lessons
for each row execute function app_private.prevent_teacher_slot_scope_break();

-- Authorization helpers live outside the exposed public schema, pin an empty
-- search_path, and read only server-controlled profiles and membership rows.
-- No authorization decision uses client-editable Auth user metadata.
create function app_private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles as profile
    where profile.id = (select auth.uid())
      and profile.role = 'admin'::public.app_role
  );
$$;

-- Admins control slot placement, ownership, type, and order. This trigger is a
-- second line of defence behind RLS: non-admin teachers can change only title
-- and content in a slot that the update policy assigns to them. The automatic
-- updated_at trigger remains free to maintain the server-controlled timestamp.
create function app_private.enforce_teacher_slot_update_boundaries()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not app_private.is_admin() then
    if new.id is distinct from old.id
      or new.lesson_id is distinct from old.lesson_id
      or new.cohort_id is distinct from old.cohort_id
      or new.teacher_id is distinct from old.teacher_id
      or new.slot_type is distinct from old.slot_type
      or new.sort_order is distinct from old.sort_order
      or new.created_at is distinct from old.created_at then
      raise exception
        'Teachers may update only title and content in assigned teacher slots'
        using errcode = '42501';
    end if;
  end if;

  return new;
end;
$$;

create trigger teacher_slots_enforce_update_boundaries
before update on public.teacher_slots
for each row execute function app_private.enforce_teacher_slot_update_boundaries();

create function app_private.can_read_course(target_course_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles as profile
    where profile.id = (select auth.uid())
      and (
        profile.role = 'admin'::public.app_role
        or (
          profile.role = 'student'::public.app_role
          and exists (
            select 1
            from public.courses as course
            join public.cohorts as cohort on cohort.course_id = course.id
            join public.enrolments as enrolment on enrolment.cohort_id = cohort.id
            where course.id = target_course_id
              and course.status = 'published'::public.course_status
              and enrolment.student_id = profile.id
          )
        )
        or (
          profile.role = 'teacher'::public.app_role
          and exists (
            select 1
            from public.cohorts as cohort
            join public.teacher_assignments as assignment
              on assignment.cohort_id = cohort.id
            where cohort.course_id = target_course_id
              and assignment.teacher_id = profile.id
          )
        )
      )
  );
$$;

create function app_private.can_read_cohort(target_cohort_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles as profile
    join public.cohorts as cohort on cohort.id = target_cohort_id
    join public.courses as course on course.id = cohort.course_id
    where profile.id = (select auth.uid())
      and (
        profile.role = 'admin'::public.app_role
        or (
          profile.role = 'student'::public.app_role
          and course.status = 'published'::public.course_status
          and exists (
            select 1
            from public.enrolments as enrolment
            where enrolment.cohort_id = cohort.id
              and enrolment.student_id = profile.id
          )
        )
        or (
          profile.role = 'teacher'::public.app_role
          and exists (
            select 1
            from public.teacher_assignments as assignment
            where assignment.cohort_id = cohort.id
              and assignment.teacher_id = profile.id
          )
        )
      )
  );
$$;

create function app_private.can_read_organisation(target_organisation_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select (select app_private.is_admin())
    or exists (
      select 1
      from public.courses as course
      where course.organisation_id = target_organisation_id
        and app_private.can_read_course(course.id)
    );
$$;

create function app_private.can_read_lesson(target_lesson_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.lessons as lesson
    join public.modules as course_module on course_module.id = lesson.module_id
    where lesson.id = target_lesson_id
      and app_private.can_read_course(course_module.course_id)
  );
$$;

create function app_private.can_write_teacher_slot(
  target_teacher_id uuid,
  target_cohort_id uuid,
  target_lesson_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles as profile
    join public.teacher_assignments as assignment
      on assignment.teacher_id = profile.id
      and assignment.cohort_id = target_cohort_id
    join public.cohorts as cohort on cohort.id = assignment.cohort_id
    join public.lessons as lesson on lesson.id = target_lesson_id
    join public.modules as course_module on course_module.id = lesson.module_id
    where profile.id = (select auth.uid())
      and profile.id = target_teacher_id
      and profile.role = 'teacher'::public.app_role
      and course_module.course_id = cohort.course_id
  );
$$;

-- Trigger functions are internal-only. Authenticated callers receive EXECUTE
-- only on the narrow boolean helpers required by RLS policies.
revoke all privileges on function app_private.validate_membership_role()
from public, anon, authenticated;
revoke all privileges on function app_private.validate_teacher_slot_scope()
from public, anon, authenticated;
revoke all privileges on function app_private.prevent_teacher_slot_scope_break()
from public, anon, authenticated;
revoke all privileges on function app_private.enforce_teacher_slot_update_boundaries()
from public, anon, authenticated;
revoke all privileges on function app_private.is_admin()
from public, anon, authenticated;
revoke all privileges on function app_private.can_read_course(uuid)
from public, anon, authenticated;
revoke all privileges on function app_private.can_read_cohort(uuid)
from public, anon, authenticated;
revoke all privileges on function app_private.can_read_organisation(uuid)
from public, anon, authenticated;
revoke all privileges on function app_private.can_read_lesson(uuid)
from public, anon, authenticated;
revoke all privileges on function app_private.can_write_teacher_slot(uuid, uuid, uuid)
from public, anon, authenticated;

grant usage on schema app_private to authenticated;
grant execute on function app_private.is_admin() to authenticated;
grant execute on function app_private.can_read_course(uuid) to authenticated;
grant execute on function app_private.can_read_cohort(uuid) to authenticated;
grant execute on function app_private.can_read_organisation(uuid) to authenticated;
grant execute on function app_private.can_read_lesson(uuid) to authenticated;
grant execute on function app_private.can_write_teacher_slot(uuid, uuid, uuid)
to authenticated;

-- All new public tables use RLS. Explicit grants and operation-specific policies
-- are both required: grants expose an operation, while policies restrict rows.
alter table public.courses enable row level security;
alter table public.cohorts enable row level security;
alter table public.modules enable row level security;
alter table public.lessons enable row level security;
alter table public.lesson_blocks enable row level security;
alter table public.enrolments enable row level security;
alter table public.teacher_assignments enable row level security;
alter table public.teacher_slots enable row level security;

revoke all privileges on table public.organisations from anon, authenticated;
revoke all privileges on table
  public.courses,
  public.cohorts,
  public.modules,
  public.lessons,
  public.lesson_blocks,
  public.enrolments,
  public.teacher_assignments,
  public.teacher_slots
from anon, authenticated;

grant select, insert, update, delete on table public.organisations to authenticated;
grant select, insert, update, delete on table
  public.courses,
  public.cohorts,
  public.modules,
  public.lessons,
  public.lesson_blocks,
  public.enrolments,
  public.teacher_assignments,
  public.teacher_slots
to authenticated;

-- Organisation visibility follows accessible courses. Only admins can mutate
-- organisation identity or branding.
create policy "Members can read accessible organisations"
on public.organisations for select to authenticated
using (app_private.can_read_organisation(id));

create policy "Admins can insert organisations"
on public.organisations for insert to authenticated
with check ((select app_private.is_admin()));

create policy "Admins can update organisations"
on public.organisations for update to authenticated
using ((select app_private.is_admin()))
with check ((select app_private.is_admin()));

create policy "Admins can delete organisations"
on public.organisations for delete to authenticated
using ((select app_private.is_admin()));

-- Core course structure: members receive only the reads allowed by enrolment or
-- assignment; every insert, update, publish, reorder, rename, and delete is admin-only.
create policy "Members can read accessible courses"
on public.courses for select to authenticated
using (app_private.can_read_course(id));

create policy "Admins can insert courses"
on public.courses for insert to authenticated
with check ((select app_private.is_admin()));

create policy "Admins can update courses"
on public.courses for update to authenticated
using ((select app_private.is_admin()))
with check ((select app_private.is_admin()));

create policy "Admins can delete courses"
on public.courses for delete to authenticated
using ((select app_private.is_admin()));

create policy "Members can read accessible cohorts"
on public.cohorts for select to authenticated
using (app_private.can_read_cohort(id));

create policy "Admins can insert cohorts"
on public.cohorts for insert to authenticated
with check ((select app_private.is_admin()));

create policy "Admins can update cohorts"
on public.cohorts for update to authenticated
using ((select app_private.is_admin()))
with check ((select app_private.is_admin()));

create policy "Admins can delete cohorts"
on public.cohorts for delete to authenticated
using ((select app_private.is_admin()));

create policy "Members can read accessible modules"
on public.modules for select to authenticated
using (app_private.can_read_course(course_id));

create policy "Admins can insert modules"
on public.modules for insert to authenticated
with check ((select app_private.is_admin()));

create policy "Admins can update modules"
on public.modules for update to authenticated
using ((select app_private.is_admin()))
with check ((select app_private.is_admin()));

create policy "Admins can delete modules"
on public.modules for delete to authenticated
using ((select app_private.is_admin()));

create policy "Members can read accessible lessons"
on public.lessons for select to authenticated
using (app_private.can_read_lesson(id));

create policy "Admins can insert lessons"
on public.lessons for insert to authenticated
with check ((select app_private.is_admin()));

create policy "Admins can update lessons"
on public.lessons for update to authenticated
using ((select app_private.is_admin()))
with check ((select app_private.is_admin()));

create policy "Admins can delete lessons"
on public.lessons for delete to authenticated
using ((select app_private.is_admin()));

create policy "Members can read accessible lesson blocks"
on public.lesson_blocks for select to authenticated
using (app_private.can_read_lesson(lesson_id));

create policy "Admins can insert lesson blocks"
on public.lesson_blocks for insert to authenticated
with check ((select app_private.is_admin()));

create policy "Admins can update lesson blocks"
on public.lesson_blocks for update to authenticated
using ((select app_private.is_admin()))
with check ((select app_private.is_admin()));

create policy "Admins can delete lesson blocks"
on public.lesson_blocks for delete to authenticated
using ((select app_private.is_admin()));

-- Membership is visible only to the member concerned and to admins. Teachers do
-- not receive a student roster in this phase.
create policy "Students can read their own enrolments"
on public.enrolments for select to authenticated
using (
  (select app_private.is_admin())
  or student_id = (select auth.uid())
);

create policy "Admins can insert enrolments"
on public.enrolments for insert to authenticated
with check ((select app_private.is_admin()));

create policy "Admins can update enrolments"
on public.enrolments for update to authenticated
using ((select app_private.is_admin()))
with check ((select app_private.is_admin()));

create policy "Admins can delete enrolments"
on public.enrolments for delete to authenticated
using ((select app_private.is_admin()));

create policy "Teachers can read their own assignments"
on public.teacher_assignments for select to authenticated
using (
  (select app_private.is_admin())
  or teacher_id = (select auth.uid())
);

create policy "Admins can insert teacher assignments"
on public.teacher_assignments for insert to authenticated
with check ((select app_private.is_admin()));

create policy "Admins can update teacher assignments"
on public.teacher_assignments for update to authenticated
using ((select app_private.is_admin()))
with check ((select app_private.is_admin()));

create policy "Admins can delete teacher assignments"
on public.teacher_assignments for delete to authenticated
using ((select app_private.is_admin()));

-- Students read teacher additions only in their published enrolled cohort.
-- Admins alone create and delete fixed slot records. Teachers can update only
-- assigned slots, and the boundary trigger limits those updates to content.
create policy "Members can read accessible teacher slots"
on public.teacher_slots for select to authenticated
using (app_private.can_read_cohort(cohort_id));

create policy "Admins can insert teacher slots"
on public.teacher_slots for insert to authenticated
with check ((select app_private.is_admin()));

create policy "Teachers and admins can update teacher slots"
on public.teacher_slots for update to authenticated
using (
  (select app_private.is_admin())
  or app_private.can_write_teacher_slot(teacher_id, cohort_id, lesson_id)
)
with check (
  (select app_private.is_admin())
  or app_private.can_write_teacher_slot(teacher_id, cohort_id, lesson_id)
);

create policy "Admins can delete teacher slots"
on public.teacher_slots for delete to authenticated
using ((select app_private.is_admin()));

commit;
