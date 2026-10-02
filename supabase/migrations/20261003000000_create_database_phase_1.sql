begin;

-- Application roles are deliberately narrow. The client must never be trusted to
-- choose a privileged role during sign-up.
create type public.app_role as enum ('student', 'teacher', 'admin');

-- Internal trigger functions live outside the exposed public schema. Application
-- roles receive no access to this schema or its functions.
create schema if not exists app_private;
revoke all privileges on schema app_private from public, anon, authenticated;

create table public.organisations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  role public.app_role not null default 'student',
  organisation_id uuid references public.organisations (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Keep updated_at server-controlled so future write policies do not need to trust
-- callers to maintain it correctly.
create function app_private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger organisations_set_updated_at
before update on public.organisations
for each row
execute function app_private.set_updated_at();

create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function app_private.set_updated_at();

-- This function runs with its owner's privileges because authenticated users do
-- not receive INSERT access to profiles. An empty search_path and schema-qualified
-- objects prevent object-shadowing attacks in this SECURITY DEFINER function.
-- Role and organisation are intentionally hard-coded instead of reading untrusted
-- user metadata, so a new user cannot promote or assign themselves at sign-up.
create function app_private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name, role, organisation_id)
  values (
    new.id,
    nullif(btrim(new.raw_user_meta_data ->> 'display_name'), ''),
    'student'::public.app_role,
    null
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function app_private.handle_new_user();

-- RLS is enabled before exposing any table privilege to application roles.
alter table public.organisations enable row level security;
alter table public.profiles enable row level security;

-- Organisations intentionally have no policies in phase 1, so neither anon nor
-- authenticated clients can access them. Profile writes are also withheld. This
-- prevents users from changing their role or organisation, even accidentally.
revoke all privileges on table public.organisations from anon, authenticated;
revoke all privileges on table public.profiles from anon, authenticated;
grant select on table public.profiles to authenticated;

-- Trigger functions are not public APIs. Revoking EXECUTE provides defence in
-- depth; PostgreSQL can still invoke them through their registered triggers.
revoke all privileges on function app_private.set_updated_at() from public, anon, authenticated;
revoke all privileges on function app_private.handle_new_user() from public, anon, authenticated;

-- The only client-facing access in phase 1 is an authenticated user's own row.
-- There are deliberately no INSERT, UPDATE, or DELETE policies on profiles.
create policy "Authenticated users can read their own profile"
on public.profiles
for select
to authenticated
using ((select auth.uid()) = id);

commit;
