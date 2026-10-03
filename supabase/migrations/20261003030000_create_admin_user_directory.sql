begin;

-- The admin directory needs one stable identifier that administrators can use
-- to distinguish accounts. Email is copied from auth.users by trusted database
-- triggers; clients cannot insert or update profiles and therefore cannot forge
-- this value or use it as an authorization claim.
alter table public.profiles
add column email text;

comment on column public.profiles.email is
  'Server-synchronised email from auth.users for the admin user directory.';

-- Populate existing profiles before new sign-ups start using the revised
-- creation trigger. Phone-only or otherwise email-less Auth users remain NULL.
update public.profiles as profile
set email = nullif(pg_catalog.btrim(auth_user.email), '')
from auth.users as auth_user
where auth_user.id = profile.id;

alter table public.profiles
add constraint profiles_email_length_check
check (email is null or pg_catalog.length(email) <= 320);

create index profiles_role_created_idx
on public.profiles (role, created_at);

create index profiles_email_lower_idx
on public.profiles (pg_catalog.lower(email))
where email is not null;

-- Preserve the existing security decisions: every new account is a student,
-- organisation remains unassigned, and no role comes from client-editable Auth
-- metadata. Only the verified auth.users email is added to the profile row.
create or replace function app_private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (
    id,
    email,
    display_name,
    role,
    organisation_id
  )
  values (
    new.id,
    nullif(pg_catalog.btrim(new.email), ''),
    nullif(pg_catalog.btrim(new.raw_user_meta_data ->> 'display_name'), ''),
    'student'::public.app_role,
    null
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

-- Keep the directory identifier current when Supabase Auth changes an email.
-- The function changes no role, organisation, display name, or membership.
create function app_private.sync_profile_email()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.profiles as profile
  set email = nullif(pg_catalog.btrim(new.email), '')
  where profile.id = new.id;

  return new;
end;
$$;

create trigger on_auth_user_email_updated
after update of email on auth.users
for each row
when (old.email is distinct from new.email)
execute function app_private.sync_profile_email();

-- Authenticated users retain access to their own profile. This additional
-- policy grants directory reads only when the server-controlled profile role is
-- admin. It does not grant profile INSERT, UPDATE, or DELETE privileges.
create policy "Admins can read user directory"
on public.profiles
for select
to authenticated
using ((select app_private.is_admin()));

-- Trigger functions are internal implementation details, not callable APIs.
revoke all privileges on function app_private.handle_new_user()
from public, anon, authenticated;
revoke all privileges on function app_private.sync_profile_email()
from public, anon, authenticated;

commit;
