import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { SignOutButton } from "@/app/dashboard/sign-out-button";
import { createClient } from "@/lib/supabase/server";

import { LessonForm } from "./lesson-form";

export const metadata: Metadata = {
  title: "Module editor | English Learning Platform",
};

type ModuleEditorPageProps = {
  params: Promise<{ courseId: string; moduleId: string }>;
};

export default async function ModuleEditorPage({
  params,
}: ModuleEditorPageProps) {
  const { courseId, moduleId } = await params;
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

  // Requiring both identifiers prevents a valid module ID from being opened
  // beneath a different course URL.
  const { data: courseModule, error: moduleError } = await supabase
    .from("modules")
    .select("id, title, slug, description, sort_order")
    .eq("id", moduleId)
    .eq("course_id", course.id)
    .maybeSingle();

  if (moduleError || !courseModule) {
    notFound();
  }

  const { data: lessons, error: lessonsError } = await supabase
    .from("lessons")
    .select("id, title, slug, description, sort_order, is_locked, created_at")
    .eq("module_id", courseModule.id)
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
          aria-labelledby="module-editor-heading"
        >
          <p className="eyebrow">Module editor</p>
          <h1 id="module-editor-heading">{courseModule.title}</h1>
          <p>
            Course: <strong>{course.title}</strong> · {course.course_family} ·{" "}
            {course.level}
          </p>
          <p>
            Create the fixed core lessons for this module. New lessons remain
            locked for admin control.
          </p>
        </section>

        <section
          className="admin-lesson-section"
          aria-labelledby="lessons-heading"
        >
          <div className="section-heading">
            <div>
              <p className="eyebrow">Core structure</p>
              <h2 id="lessons-heading">Lessons</h2>
            </div>
            <p>New locked lessons are placed after existing lessons automatically.</p>
          </div>

          <div className="admin-lesson-grid">
            <div className="admin-panel">
              <h3>Create locked lesson</h3>
              <LessonForm courseId={course.id} moduleId={courseModule.id} />
            </div>

            <div className="admin-panel" aria-live="polite">
              <h3>Module lessons</h3>
              {lessonsError ? (
                <p className="form-message form-message-error" role="alert">
                  Lessons could not be loaded. Please refresh and try again.
                </p>
              ) : lessons && lessons.length > 0 ? (
                <ol className="lesson-list">
                  {lessons.map((lesson, index) => (
                    <li key={lesson.id}>
                      <span className="lesson-position">Lesson {index + 1}</span>
                      <div className="lesson-list-heading">
                        <h4>{lesson.title}</h4>
                        <span className="locked-lesson-badge">
                          Locked core lesson
                        </span>
                      </div>
                      <span className="lesson-slug">
                        <span>Slug:</span>
                        <code>{lesson.slug}</code>
                      </span>
                      <p>{lesson.description || "No description provided."}</p>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="admin-empty-state">
                  No lessons yet. Create the first locked lesson using the form.
                </p>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
