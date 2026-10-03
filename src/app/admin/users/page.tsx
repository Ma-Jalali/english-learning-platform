import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { SignOutButton } from "@/app/dashboard/sign-out-button";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "User directory | English Learning Platform",
};

type UserDirectoryPageProps = {
  searchParams: Promise<{ q?: string; role?: string }>;
};

const DIRECTORY_ROLES = ["student", "teacher", "admin"] as const;

export default async function UserDirectoryPage({
  searchParams,
}: UserDirectoryPageProps) {
  const { q: rawQuery, role: rawRole } = await searchParams;
  const query = typeof rawQuery === "string" ? rawQuery.trim().slice(0, 100) : "";
  const role = DIRECTORY_ROLES.includes(
    rawRole as (typeof DIRECTORY_ROLES)[number],
  )
    ? rawRole
    : "";
  const supabase = await createClient();
  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;

  if (claimsError || !userId) {
    redirect("/auth/login");
  }

  const { data: currentProfile, error: currentProfileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();

  if (currentProfileError || currentProfile?.role !== "admin") {
    redirect("/dashboard");
  }

  const [profilesResult, organisationsResult] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, email, display_name, role, organisation_id, created_at")
      .order("created_at", { ascending: true }),
    supabase.from("organisations").select("id, name").order("name"),
  ]);

  if (profilesResult.error) {
    console.error("Unexpected admin user directory profile query failure", {
      code: profilesResult.error.code,
      message: profilesResult.error.message,
    });
  }

  if (organisationsResult.error) {
    console.error("Unexpected admin user directory organisation query failure", {
      code: organisationsResult.error.code,
      message: organisationsResult.error.message,
    });
  }

  const organisationNames = new Map(
    organisationsResult.data?.map((organisation) => [
      organisation.id,
      organisation.name,
    ]) ?? [],
  );
  const normalizedQuery = query.toLocaleLowerCase();
  const profiles = (profilesResult.data ?? []).filter((profile) => {
    const matchesRole = !role || profile.role === role;
    const searchableText = `${profile.display_name ?? ""} ${profile.email ?? ""}`
      .toLocaleLowerCase();
    const matchesQuery = !normalizedQuery || searchableText.includes(normalizedQuery);

    return matchesRole && matchesQuery;
  });

  return (
    <main className="admin-main">
      <div className="admin-shell">
        <header className="admin-header">
          <Link className="auth-brand" href="/">
            English Learning Platform
          </Link>
          <div className="admin-header-actions">
            <Link className="button-link secondary-link" href="/admin">
              Back to admin
            </Link>
            <SignOutButton />
          </div>
        </header>

        <section
          className="course-editor-intro"
          aria-labelledby="user-directory-heading"
        >
          <p className="eyebrow">Identity and access</p>
          <h1 id="user-directory-heading">User directory</h1>
          <p>
            Find existing accounts by their verified Auth email and
            server-controlled profile role. This directory is read-only.
          </p>
        </section>

        <section
          className="admin-directory-section"
          aria-labelledby="directory-results-heading"
        >
          <div className="section-heading">
            <div>
              <p className="eyebrow">Administrator only</p>
              <h2 id="directory-results-heading">Platform accounts</h2>
            </div>
            <p>Use cohort membership pages to enrol students or assign teachers.</p>
          </div>

          <div className="admin-panel directory-panel">
            <form action="/admin/users" className="directory-filter" method="get">
              <div className="field-group">
                <label htmlFor="directory-query">Name or email</label>
                <input
                  defaultValue={query}
                  id="directory-query"
                  maxLength={100}
                  name="q"
                  placeholder="Search accounts"
                  type="search"
                />
              </div>
              <div className="field-group">
                <label htmlFor="directory-role">Role</label>
                <select defaultValue={role} id="directory-role" name="role">
                  <option value="">All roles</option>
                  <option value="student">Students</option>
                  <option value="teacher">Teachers</option>
                  <option value="admin">Admins</option>
                </select>
              </div>
              <div className="directory-filter-actions">
                <button type="submit">Filter directory</button>
                <Link className="button-link secondary-link" href="/admin/users">
                  Clear
                </Link>
              </div>
            </form>

            {profilesResult.error || organisationsResult.error ? (
              <p className="form-message form-message-error" role="alert">
                The user directory could not be loaded. Confirm the directory
                migration has been applied, then refresh the page.
              </p>
            ) : profiles.length > 0 ? (
              <>
                <p className="directory-result-count" role="status">
                  {profiles.length} {profiles.length === 1 ? "account" : "accounts"}
                  {query || role ? " matched" : " total"}
                </p>
                <ul className="directory-list">
                  {profiles.map((profile) => (
                    <li key={profile.id}>
                      <div className="directory-user-heading">
                        <div>
                          <h3>{profile.display_name || "Name not provided"}</h3>
                          <p>{profile.email || "Email unavailable"}</p>
                        </div>
                        <span className="role-badge">{profile.role}</span>
                      </div>
                      <dl className="directory-user-details">
                        <div>
                          <dt>Organisation</dt>
                          <dd>
                            {profile.organisation_id
                              ? organisationNames.get(profile.organisation_id) ??
                                "Unknown organisation"
                              : "Not assigned"}
                          </dd>
                        </div>
                        <div>
                          <dt>Directory status</dt>
                          <dd>Available for role-appropriate assignment</dd>
                        </div>
                      </dl>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="admin-empty-state">
                No accounts match these directory filters.
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
