import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { createCohort } from "@/app/admin/actions";
import { SignOutButton } from "@/app/dashboard/sign-out-button";
import { createClient } from "@/lib/supabase/server";

import { CohortForm } from "./cohort-form";

export const metadata: Metadata = {
  title: "Cohort management | English Learning Platform",
};

type CohortsPageProps = {
  params: Promise<{ courseId: string }>;
};

export default async function CohortsPage({ params }: CohortsPageProps) {
  const { courseId } = await params;
  const supabase = await createClient();
  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;

  if (claimsError || !userId) {
    redirect("/auth/login");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();

  if (profileError || profile?.role !== "admin") {
    redirect("/dashboard");
  }

  const { data: course, error: courseError } = await supabase
    .from("courses")
    .select("id, title, course_family, level, status")
    .eq("id", courseId)
    .maybeSingle();

  if (courseError || !course) {
    notFound();
  }

  const { data: cohorts, error: cohortsError } = await supabase
    .from("cohorts")
    .select("id, name, slug, sort_order, created_at")
    .eq("course_id", course.id)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  const createCohortForCourse = createCohort.bind(null, course.id);

  return (
    <main className="admin-main">
      <div className="admin-shell">
        <header className="admin-header">
          <Link className="auth-brand" href="/">
            English Learning Platform
          </Link>
          <div className="admin-header-actions">
            <Link
              className="button-link secondary-link"
              href={`/admin/courses/${course.id}`}
            >
              Back to course
            </Link>
            <SignOutButton />
          </div>
        </header>

        <section
          className="course-editor-intro"
          aria-labelledby="cohorts-page-heading"
        >
          <p className="eyebrow">Course access structure</p>
          <h1 id="cohorts-page-heading">Cohorts</h1>
          <p>
            Create the ordered cohort shells for <strong>{course.title}</strong>.
            Student enrolment will be configured separately in a later phase.
          </p>
          <dl className="course-editor-summary">
            <div>
              <dt>Course family</dt>
              <dd>{course.course_family}</dd>
            </div>
            <div>
              <dt>Level</dt>
              <dd>{course.level}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>
                <span className="course-status-badge">
                  <span className="course-status-value">{course.status}</span>
                </span>
              </dd>
            </div>
          </dl>
        </section>

        <section
          className="admin-cohort-section"
          aria-labelledby="cohorts-heading"
        >
          <div className="section-heading">
            <div>
              <p className="eyebrow">Admin-controlled cohorts</p>
              <h2 id="cohorts-heading">Course cohorts</h2>
            </div>
            <p>New cohorts are placed after existing cohorts automatically.</p>
          </div>

          <div className="admin-module-grid">
            <div className="admin-panel">
              <h3>Create cohort</h3>
              <CohortForm action={createCohortForCourse} />
            </div>

            <div className="admin-panel" aria-live="polite">
              <h3>Created cohorts</h3>
              {cohortsError ? (
                <p className="form-message form-message-error" role="alert">
                  Cohorts could not be loaded. Please refresh and try again.
                </p>
              ) : cohorts && cohorts.length > 0 ? (
                <ol className="cohort-list">
                  {cohorts.map((cohort, index) => (
                    <li key={cohort.id}>
                      <span className="cohort-position">
                        Position {index + 1}
                      </span>
                      <h4>{cohort.name}</h4>
                      <dl className="cohort-details">
                        <div>
                          <dt>Slug</dt>
                          <dd>
                            <code>{cohort.slug}</code>
                          </dd>
                        </div>
                        <div>
                          <dt>Course</dt>
                          <dd>{course.title}</dd>
                        </div>
                      </dl>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="admin-empty-state">
                  No cohorts yet. Create the first cohort using the form.
                </p>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
