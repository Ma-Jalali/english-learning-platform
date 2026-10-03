# User Directory and Cohort Membership Migration

The migration
`supabase/migrations/20261003030000_create_admin_user_directory.sql` adds the
minimum database support for the admin user directory.

It does not create users, change roles, enrol students, assign teachers, or use
a service-role key. It:

- adds a server-controlled `email` field to `public.profiles`;
- backfills that field from `auth.users` for existing accounts;
- includes verified Auth email when future profile rows are created;
- synchronises later Auth email changes into the matching profile;
- lets authenticated administrators read the directory through profile RLS;
- leaves profile role, organisation, and membership writes unavailable to
  ordinary clients.

## Apply once in Supabase SQL Editor

The project owner applied this migration manually to the current Supabase
project on 3 October 2026. Do not run it again in that project. The steps below
are retained for setting up a separate fresh environment only.

1. Open the correct Supabase project.
2. Open **SQL Editor** and create a new query.
3. Open
   `supabase/migrations/20261003030000_create_admin_user_directory.sql` locally.
4. Copy the complete file into SQL Editor without modifying earlier migrations.
5. Confirm the query begins with `begin;` and ends with `commit;`.
6. Select **Run** once.
7. Confirm the editor reports success before testing the application.

Do not run the migration repeatedly. Do not paste `.env.local`, keys, tokens, or
other secrets into SQL Editor.

## Verify safely

While signed in to the application as an administrator:

1. Open `/admin/users` and confirm existing accounts appear with email and role.
2. Open the IELTS pilot cohort membership page from **Manage cohorts**.
3. Enrol a disposable student account and assign a disposable teacher account.
4. Confirm duplicate membership attempts show helpful errors.
5. Confirm a non-admin cannot open either admin page or perform either action.

The application actions use the authenticated user's publishable-key session.
Existing RLS policies and membership-role triggers remain the final database
enforcement layer.

## Rollback note

Do not run a rollback on a live project without explicit approval and a data
review. Removing the directory email column or policy after the application is
deployed would break the admin user and membership interfaces.
