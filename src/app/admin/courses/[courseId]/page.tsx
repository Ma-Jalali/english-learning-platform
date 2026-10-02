import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { SignOutButton } from "@/app/dashboard/sign-out-button";
import { createClient } from "@/lib/supabase/server";

import { ModuleForm } from "./module-form";

export const metadata: Metadata = {
  title: "Course editor | English Learning Platform",
};

type CourseEditorPageProps = {
  params: Promise<{ courseId: string }>;
};

export default async function CourseEditorPage({
  params,
}: CourseEditorPageProps) {
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

  const { data: modules, error: modulesError } = await supabase
    .from("modules")
    .select("id, title, slug, description, sort_order, created_at")
    .eq("course_id", course.id)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

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
          aria-labelledby="course-editor-heading"
        >
          <p className="eyebrow">Course editor</p>
          <h1 id="course-editor-heading">{course.title}</h1>
          <p>
            Build the course structure one module at a time. Lessons and content
            will be added in a later phase.
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
                  <span className="course-status-value">
                    {course.status}
                  </span>
                </span>
              </dd>
            </div>
          </dl>
        </section>

        <section
          className="admin-module-section"
          aria-labelledby="modules-heading"
        >
          <div className="section-heading">
            <div>
              <p className="eyebrow">Core structure</p>
              <h2 id="modules-heading">Modules</h2>
            </div>
            <p>New modules are placed after the existing modules automatically.</p>
          </div>

          <div className="admin-module-grid">
            <div className="admin-panel">
              <h3>Create module</h3>
              <ModuleForm courseId={course.id} />
            </div>

            <div className="admin-panel" aria-live="polite">
              <h3>Course modules</h3>
              {modulesError ? (
                <p className="form-message form-message-error" role="alert">
                  Modules could not be loaded. Please refresh and try again.
                </p>
              ) : modules && modules.length > 0 ? (
                <ol className="module-list">
                  {modules.map((courseModule, index) => (
                    <li key={courseModule.id}>
                      <span className="module-position">Module {index + 1}</span>
                      <h4>{courseModule.title}</h4>
                      <span className="module-slug">
                        <span>Slug:</span>
                        <code>{courseModule.slug}</code>
                      </span>
                      <p>
                        {courseModule.description || "No description provided."}
                      </p>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="admin-empty-state">
                  No modules yet. Create the first module using the form.
                </p>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
