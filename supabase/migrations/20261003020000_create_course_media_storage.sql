begin;

-- Official course media is private. Downloads therefore always pass through
-- storage.objects RLS; there is no public object URL for this bucket.
--
-- The 200 MiB per-object limit is this application's platform bucket limit.
-- The Supabase project or plan may impose a lower effective limit. Future upload
-- UI must validate file size before starting an upload. SVG is omitted because
-- active content is not needed for course media.
insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'course-media',
  'course-media',
  false,
  209715200,
  array[
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/avif',
    'video/mp4',
    'video/webm',
    'video/quicktime',
    'video/x-m4v'
  ]::text[]
);

-- Object names are an authorization boundary and must have exactly this shape:
-- org/{organisationId}/course/{courseId}/{unique-file-name}
--
-- This internal helper validates the complete path before returning a course ID.
-- It does not read storage object metadata, which is supplied by the client and
-- must never decide course access. Invalid UUIDs are rejected before casting, so
-- malformed object names return NULL instead of aborting an RLS policy check.
create function app_private.course_media_course_id(object_name text)
returns uuid
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  path_parts text[];
  path_course_id uuid;
  path_file_name text;
begin
  if object_name is null
    or object_name = ''
    or pg_catalog.octet_length(object_name) > 1024 then
    return null;
  end if;

  path_parts := pg_catalog.string_to_array(object_name, '/');

  if pg_catalog.array_length(path_parts, 1) is distinct from 5
    or path_parts[1] is distinct from 'org'
    or path_parts[3] is distinct from 'course'
    or path_parts[2] !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
    or path_parts[4] !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' then
    return null;
  end if;

  path_file_name := path_parts[5];

  if path_file_name is null
    or path_file_name = ''
    or path_file_name in ('.', '..')
    or pg_catalog.octet_length(path_file_name) > 255
    or path_file_name !~ '^[A-Za-z0-9][A-Za-z0-9._-]*$'
    or pg_catalog.lower(path_file_name)
      !~ '[.](pdf|jpe?g|png|webp|gif|avif|mp4|webm|mov|m4v)$' then
    return null;
  end if;

  -- The regular expressions above make these casts safe. The exception guard is
  -- retained as defence in depth so a malformed path can never break a policy.
  begin
    path_course_id := path_parts[4]::uuid;
  exception
    when invalid_text_representation then
      return null;
  end;

  return path_course_id;
end;
$$;

-- Uploads and reads also require the two path IDs to describe a real database
-- relationship. This check remains separate from syntax parsing so an admin can
-- still delete a well-formed orphan object after its course has been removed.
create function app_private.course_media_path_matches_course(object_name text)
returns boolean
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  path_parts text[];
  path_organisation_id uuid;
  path_course_id uuid;
begin
  path_course_id := app_private.course_media_course_id(object_name);

  if path_course_id is null then
    return false;
  end if;

  path_parts := pg_catalog.string_to_array(object_name, '/');

  begin
    path_organisation_id := path_parts[2]::uuid;
  exception
    when invalid_text_representation then
      return false;
  end;

  return exists (
    select 1
    from public.courses as course
    where course.id = path_course_id
      and course.organisation_id = path_organisation_id
  );
end;
$$;

-- Read access delegates to the existing course authorization helper. That helper
-- already distinguishes admins, assigned teachers, and students enrolled in a
-- published course cohort; this migration does not duplicate or weaken it.
create function app_private.can_read_course_media(object_name text)
returns boolean
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  target_course_id uuid;
begin
  target_course_id := app_private.course_media_course_id(object_name);

  if target_course_id is null then
    return false;
  end if;

  if not app_private.course_media_path_matches_course(object_name) then
    return false;
  end if;

  return coalesce(
    app_private.can_read_course(target_course_id),
    false
  );
end;
$$;

-- Only a server-controlled admin profile may create, replace, or rename
-- an object. A valid path is required for both the old and resulting row during
-- UPDATE, preventing an object from being moved outside the governed hierarchy.
create function app_private.can_administer_course_media(object_name text)
returns boolean
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not app_private.course_media_path_matches_course(object_name) then
    return false;
  end if;

  return coalesce(app_private.is_admin(), false);
end;
$$;

-- Deletion keeps the same admin check and strict path grammar but does not
-- require the course row to remain present. This provides a safe cleanup path
-- for orphaned Storage objects after an administrative course deletion.
create function app_private.can_delete_course_media(object_name text)
returns boolean
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if app_private.course_media_course_id(object_name) is null then
    return false;
  end if;

  return coalesce(app_private.is_admin(), false);
end;
$$;

-- The parser and relationship checker are internal implementation details.
-- Authenticated clients can execute only the three narrow boolean authorization
-- functions referenced by Storage RLS policies.
revoke all privileges on function app_private.course_media_course_id(text)
from public, anon, authenticated;
revoke all privileges on function app_private.course_media_path_matches_course(text)
from public, anon, authenticated;
revoke all privileges on function app_private.can_read_course_media(text)
from public, anon, authenticated;
revoke all privileges on function app_private.can_administer_course_media(text)
from public, anon, authenticated;
revoke all privileges on function app_private.can_delete_course_media(text)
from public, anon, authenticated;

grant usage on schema app_private to authenticated;
grant execute on function app_private.can_read_course_media(text)
to authenticated;
grant execute on function app_private.can_administer_course_media(text)
to authenticated;
grant execute on function app_private.can_delete_course_media(text)
to authenticated;

-- SELECT is required for authenticated downloads and for Storage upsert/replace
-- workflows. Every visible object must resolve to a course the caller can read.
create policy "Course members can read course media"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'course-media'
  and app_private.can_read_course_media(name)
);

-- Upload, replacement, and deletion are separate admin-only operations. INSERT
-- checks the new path; UPDATE checks both the existing row (USING) and resulting
-- row (WITH CHECK), so even admins cannot create a malformed course-media path.
create policy "Admins can upload course media"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'course-media'
  and app_private.can_administer_course_media(name)
);

create policy "Admins can replace course media"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'course-media'
  and app_private.can_administer_course_media(name)
)
with check (
  bucket_id = 'course-media'
  and app_private.can_administer_course_media(name)
);

create policy "Admins can delete course media"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'course-media'
  and app_private.can_delete_course_media(name)
);

commit;
