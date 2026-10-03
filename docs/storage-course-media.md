# Course media storage foundation

This phase creates one private Supabase Storage bucket, `course-media`, for
official files that may later be referenced by lesson blocks.

Migration file:
[`supabase/migrations/20261003020000_create_course_media_storage.sql`](../supabase/migrations/20261003020000_create_course_media_storage.sql)

## Storage design

Every object must use this exact path shape:

```text
org/{organisationId}/course/{courseId}/{unique-file-name}
```

For example:

```text
org/aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa/course/bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb/550e8400-e29b-41d4-a716-446655440000.pdf
```

The organisation and course segments must be canonical UUIDs. The course must
exist and belong to the organisation in the path. The generated file name may
contain only letters, numbers, dots, hyphens, and underscores, and must end in
an allowed PDF, raster-image, or video extension. The Storage bucket
independently enforces a matching MIME-type allowlist. The application
platform's bucket limit is 200 MiB (`209715200` bytes), but the Supabase project
configuration or plan may impose a lower effective limit. The later upload UI
must validate the file size before starting an upload; Storage remains the final
enforcement boundary.

The bucket is private. Do not switch its `public` setting on: authenticated
downloads and short-lived signed URLs must continue to pass through RLS.

## Access model

| Actor | Read | Upload or replace | Delete |
| --- | --- | --- | --- |
| Authenticated admin | Yes | Yes | Yes |
| Assigned teacher | Only for an assigned course | No | No |
| Enrolled student | Only for a published enrolled course | No | No |
| Anonymous visitor | No | No | No |

The read policy extracts the course ID from the object name and delegates to the
existing `app_private.can_read_course(uuid)` helper. The path parser also checks
the organisation/course relationship against `public.courses`. It never trusts
the object's client-supplied `metadata`, ownership fields, or Auth user metadata.
Malformed paths resolve to no course and are denied without raising a UUID-cast
error.

The upload, update, and delete policies independently call the existing secure
admin-role helper. An `UPDATE` checks both the old and resulting path, which
prevents replacement or movement outside the required hierarchy. Admin deletion
still accepts a well-formed orphan path after its course row is removed, so an
administrator can clean up the underlying object; malformed paths remain denied.

## Later upload workflow

When upload UI is introduced in a later phase:

1. Recheck the signed-in user's admin role on the server.
2. Load the selected course and its organisation from the database; do not
   accept either ID as trusted authorization data from the browser.
3. Generate a collision-resistant file name, preferably a UUID plus the
   validated original extension. Build the exact governed path shown above.
4. Upload through the Supabase Storage API using the admin's authenticated
   session and the `course-media` bucket. Do not use a service-role key.
5. For deliberate replacement, use Storage upsert or update semantics. The
   migration supplies the required `SELECT` and `UPDATE` policies in addition
   to `INSERT`.
6. After a successful upload, a future migration may define how a lesson block
   stores the private object path. This phase adds no lesson-block fields or UI.
7. Download with an authenticated Storage request or a short-lived signed URL.
   Delete through the Storage API, never by deleting `storage.objects` metadata
   directly, because the API must also remove the underlying stored object.

MIME and extension allowlists reduce accidental uploads; they are not malware
scanning or proof of a file's contents. Add content inspection separately if the
platform's risk profile later requires it.

## Optional Google Drive source later

A future block type may use a validated Google Drive sharing link as an external
source instead of copying a file into Supabase Storage. That should remain a
distinct content path with explicit link validation and clear sharing guidance.
This phase adds no Google OAuth flow, Drive API credentials, Drive field,
embedding, or access-token handling.

## Apply once in Supabase SQL Editor

1. Confirm both existing database migrations have already been applied to the
   intended Supabase project.
2. In **Storage**, confirm that a bucket named `course-media` does not already
   exist. If it does, stop and reconcile it instead of rerunning this migration.
3. Open **SQL Editor** in that same project and choose **New query**.
4. Open the migration file linked above locally and copy its complete contents,
   including `begin;` and `commit;`.
5. Paste it into the new query, reconfirm the project name, and choose **Run**
   exactly once. The transaction rolls back the whole change if a statement
   fails.
6. Record the project and successful execution time. SQL Editor does not add the
   local file to Supabase CLI migration history, so reconcile that history
   before using a separate migration workflow later.

No service-role key, application secret, or remote CLI command is required.

## Verify after applying

Run these read-only queries in SQL Editor:

```sql
select id, name, public, file_size_limit, allowed_mime_types
from storage.buckets
where id = 'course-media';

select policyname, cmd, roles, qual, with_check
from pg_policies
where schemaname = 'storage'
  and tablename = 'objects'
  and policyname in (
    'Course members can read course media',
    'Admins can upload course media',
    'Admins can replace course media',
    'Admins can delete course media'
  )
order by cmd, policyname;

select
  app_private.course_media_course_id('malformed/path.pdf') is null
    as malformed_path_is_denied,
  app_private.course_media_course_id(
    'org/not-a-uuid/course/also-not-a-uuid/file.pdf'
  ) is null as invalid_uuids_are_denied;
```

The bucket row should report `public = false` and
`file_size_limit = 209715200`.
The policy query should return one policy each for `SELECT`, `INSERT`, `UPDATE`,
and `DELETE`. Both malformed-path checks should return `true`.
