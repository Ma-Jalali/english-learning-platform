import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { SignOutButton } from "@/app/dashboard/sign-out-button";
import { createClient } from "@/lib/supabase/server";

import { CourseForm } from "./course-form";
import { OrganisationForm } from "./organisation-form";

export const metadata: Metadata = {
  title: "Admin workspace | English Learning Platform",
};

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();
  const claims = claimsData?.claims;
  const userId = claims?.sub;

  if (claimsError || !userId) {
    redirect("/auth/login");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();

  // Fail closed: only the role stored in public.profiles can open this page.
  if (profileError || profile?.role !== "admin") {
    redirect("/dashboard");
  }

  const { data: organisations, error: organisationsError } = await supabase
    .from("organisations")
    .select("id, name, slug, created_at")
    .order("created_at", { ascending: false });

  const { data: courses, error: coursesError } = await supabase
    .from("courses")
    .select(
      "id, organisation_id, title, slug, course_family, level, status, created_at",
    )
    .order("created_at", { ascending: false });

  const email =
    typeof claims.email === "string" ? claims.email : "Email unavailable";
  const organisationCount = organisations?.length ?? 0;
  const courseCount = courses?.length ?? 0;
  const organisationNames = new Map(
    organisations?.map((organisation) => [
      organisation.id,
      organisation.name,
    ]) ?? [],
  );

  const overviewCards = [
    {
      title: "Organisations",
      value:
        organisationCount === 0
          ? "No organisations yet"
          : `${organisationCount} ${
              organisationCount === 1 ? "organisation" : "organisations"
            }`,
    },
    {
      title: "Courses",
      value:
        courseCount === 0
          ? "No courses yet"
          : `${courseCount} ${courseCount === 1 ? "course" : "courses"}`,
    },
    { title: "Cohorts", value: "No cohorts yet" },
    { title: "Content", value: "No modules or lessons yet" },
  ];

  return (
    <main className="admin-main">
      <div className="admin-shell">
        <header className="admin-header">
          <Link className="auth-brand" href="/">
            English Learning Platform
          </Link>
          <div className="admin-header-actions">
            <Link className="button-link secondary-link" href="/dashboard">
              Dashboard
            </Link>
            <SignOutButton />
          </div>
        </header>

        <section className="admin-intro" aria-labelledby="admin-heading">
          <p className="eyebrow">Administration</p>
          <h1 id="admin-heading">Admin workspace</h1>
          <p>
            Set up the platform structure. Core content remains available only
            to administrators.
          </p>
          <p className="admin-identity">
            Signed in as <strong>{email}</strong>
          </p>
        </section>

        <section aria-labelledby="overview-heading">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Overview</p>
              <h2 id="overview-heading">Workspace status</h2>
            </div>
          </div>
          <ul className="admin-overview-grid">
            {overviewCards.map((card) => (
              <li className="admin-overview-card" key={card.title}>
                <h3>{card.title}</h3>
                <p>{card.value}</p>
              </li>
            ))}
          </ul>
        </section>

        <section
          className="admin-organisation-section"
          aria-labelledby="organisations-heading"
        >
          <div className="section-heading">
            <div>
              <p className="eyebrow">First step</p>
              <h2 id="organisations-heading">Organisations</h2>
            </div>
            <p>Create the organisation that will own future courses.</p>
          </div>

          <div className="admin-organisation-grid">
            <div className="admin-panel">
              <h3>Create an organisation</h3>
              <OrganisationForm />
            </div>

            <div className="admin-panel" aria-live="polite">
              <h3>Created organisations</h3>
              {organisationsError ? (
                <p className="form-message form-message-error" role="alert">
                  Organisations could not be loaded. Please refresh and try
                  again.
                </p>
              ) : organisations && organisations.length > 0 ? (
                <ul className="organisation-list">
                  {organisations.map((organisation) => (
                    <li key={organisation.id}>
                      <strong>{organisation.name}</strong>
                      <span className="organisation-slug">
                        <span>Slug:</span>
                        <code>{organisation.slug}</code>
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="admin-empty-state">
                  No organisations yet. Create the first one using the form.
                </p>
              )}
            </div>
          </div>
        </section>

        <section
          className="admin-course-section"
          aria-labelledby="courses-heading"
        >
          <div className="section-heading">
            <div>
              <p className="eyebrow">Course setup</p>
              <h2 id="courses-heading">Draft courses</h2>
            </div>
            <p>Create the course shell. Publishing and course content come later.</p>
          </div>

          <div className="admin-course-grid">
            <div className="admin-panel">
              <h3>Create a draft course</h3>
              <CourseForm
                organisations={
                  organisations?.map(({ id, name }) => ({ id, name })) ?? []
                }
              />
            </div>

            <div className="admin-panel" aria-live="polite">
              <h3>Created courses</h3>
              {coursesError ? (
                <p className="form-message form-message-error" role="alert">
                  Courses could not be loaded. Please refresh and try again.
                </p>
              ) : courses && courses.length > 0 ? (
                <ul className="course-list">
                  {courses.map((course) => (
                    <li key={course.id}>
                      <div className="course-list-heading">
                        <h4 className="course-card-title">{course.title}</h4>
                        <span className="course-status-badge">
                          <span className="course-status-label">Status:</span>
                          <span className="course-status-value">Draft</span>
                        </span>
                      </div>
                      <dl className="course-details">
                        <div>
                          <dt>Organisation</dt>
                          <dd>
                            {organisationNames.get(course.organisation_id) ??
                              "Unknown organisation"}
                          </dd>
                        </div>
                        <div>
                          <dt>Course family</dt>
                          <dd>{course.course_family}</dd>
                        </div>
                        <div>
                          <dt>Level</dt>
                          <dd>{course.level}</dd>
                        </div>
                        <div>
                          <dt>Slug</dt>
                          <dd>
                            <code>{course.slug}</code>
                          </dd>
                        </div>
                      </dl>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="admin-empty-state">
                  No draft courses yet. Create the first one using the form.
                </p>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
