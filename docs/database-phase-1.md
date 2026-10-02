# Database phase 1

The first database migration creates the role type, organisations, profiles, the
new-user profile trigger, and the initial Row Level Security rules. It does not
create courses, payments, dashboards, or authentication pages.

Migration file:
[`supabase/migrations/20261003000000_create_database_phase_1.sql`](../supabase/migrations/20261003000000_create_database_phase_1.sql)

## Before running it

- Select the intended Supabase project and confirm that it is not a production
  project unless production is the intended target.
- Read the complete migration file. It is designed to be run once on a database
  that does not already contain these phase 1 objects.
- Do not add or use a service-role key. The SQL Editor is authenticated through
  the Supabase Dashboard and does not need an application secret pasted into SQL.

## Run it manually in the Supabase SQL Editor

1. Open the intended project in the Supabase Dashboard.
2. Open **SQL Editor** and choose **New query**.
3. Copy the complete contents of the migration file into the query editor.
4. Reconfirm the project name shown in the Dashboard.
5. Choose **Run** once. The migration is wrapped in a transaction, so an error
   should roll back the phase 1 changes instead of leaving a partial schema.
6. Save the successful execution date and project name in the team's deployment
   record.

Running a local migration file through SQL Editor changes the remote schema, but
it does not make the Supabase CLI treat that local file as applied. Do not later
replay the same migration through another workflow without first reconciling the
migration history.

## Verify the result

Run these read-only checks in a new SQL Editor query:

```sql
select enumlabel
from pg_enum
join pg_type on pg_type.oid = pg_enum.enumtypid
join pg_namespace on pg_namespace.oid = pg_type.typnamespace
where pg_namespace.nspname = 'public'
  and pg_type.typname = 'app_role'
order by enumsortorder;

select schemaname, tablename, rowsecurity
from pg_tables
where schemaname = 'public'
  and tablename in ('organisations', 'profiles')
order by tablename;

select schemaname, tablename, policyname, roles, cmd, qual, with_check
from pg_policies
where schemaname = 'public'
  and tablename in ('organisations', 'profiles')
order by tablename, policyname;

select event_object_schema, event_object_table, trigger_name
from information_schema.triggers
where trigger_name in (
  'on_auth_user_created',
  'organisations_set_updated_at',
  'profiles_set_updated_at'
)
order by trigger_name;
```

Expected results:

- `app_role` has `student`, `teacher`, and `admin` in that order.
- Both tables report `rowsecurity = true`.
- `profiles` has one `SELECT` policy for `authenticated`; `organisations` has no
  client policy in this phase.
- All three triggers are present.

The Auth trigger always inserts `student` with a null `organisation_id`. It does
not trust role or organisation values from sign-up metadata. There is no profile
write policy, so authenticated users cannot change their own role or organisation.
