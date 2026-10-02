import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { SignOutButton } from "@/app/dashboard/sign-out-button";
import { createClient } from "@/lib/supabase/server";

import { BlockForm } from "./block-form";
import { TextBlockItem } from "./text-block-item";

export const metadata: Metadata = {
  title: "Lesson editor | English Learning Platform",
};

type LessonEditorPageProps = {
  params: Promise<{ courseId: string; moduleId: string; lessonId: string }>;
  searchParams: Promise<{ notice?: string }>;
};

function getTextBody(content: unknown) {
  if (
    typeof content === "object" &&
    content !== null &&
    "body" in content &&
    typeof content.body === "string"
  ) {
    return content.body;
  }

  return "Text unavailable.";
}

export default async function LessonEditorPage({
  params,
  searchParams,
}: LessonEditorPageProps) {
  const [{ courseId, moduleId, lessonId }, { notice }] = await Promise.all([
    params,
    searchParams,
  ]);
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
    .select("id, title, course_family, level")
    .eq("id", courseId)
    .maybeSingle();

  if (courseError || !course) {
    notFound();
  }

  const { data: courseModule, error: moduleError } = await supabase
    .from("modules")
    .select("id, title")
    .eq("id", moduleId)
    .eq("course_id", course.id)
    .maybeSingle();

  if (moduleError || !courseModule) {
    notFound();
  }

  const { data: lesson, error: lessonError } = await supabase
    .from("lessons")
    .select("id, title, slug, description, is_locked")
    .eq("id", lessonId)
    .eq("module_id", courseModule.id)
    .maybeSingle();

  if (lessonError || !lesson) {
    notFound();
  }

  const { data: textBlocks, error: blocksError } = await supabase
    .from("lesson_blocks")
    .select("id, title, content, sort_order, is_locked, created_at")
    .eq("lesson_id", lesson.id)
    .eq("block_type", "text")
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
              href={`/admin/courses/${course.id}/modules/${courseModule.id}`}
            >
              Back to module
            </Link>
            <SignOutButton />
          </div>
        </header>

        <section
          className="course-editor-intro"
          aria-labelledby="lesson-editor-heading"
        >
          <p className="eyebrow">Lesson editor</p>
          <h1 id="lesson-editor-heading">{lesson.title}</h1>
          <p>
            Course: <strong>{course.title}</strong> · Module:{" "}
            <strong>{courseModule.title}</strong>
          </p>
          <p>
            Create the locked core content for this lesson. Text is stored and
            displayed as plain text.
          </p>
        </section>

        <section
          className="admin-block-section"
          aria-labelledby="blocks-heading"
        >
          <div className="section-heading">
            <div>
              <p className="eyebrow">Lesson content</p>
              <h2 id="blocks-heading">Text blocks</h2>
            </div>
            <p>New locked blocks are placed after existing blocks automatically.</p>
          </div>

          {notice === "block-deleted" ? (
            <p className="form-message form-message-success" role="status">
              The locked text block was deleted.
            </p>
          ) : null}

          <div className="admin-block-grid">
            <div className="admin-panel">
              <h3>Create locked text block</h3>
              <BlockForm
                courseId={course.id}
                lessonId={lesson.id}
                moduleId={courseModule.id}
              />
            </div>

            <div className="admin-panel" aria-live="polite">
              <h3>Lesson text blocks</h3>
              {blocksError ? (
                <p className="form-message form-message-error" role="alert">
                  Text blocks could not be loaded. Please refresh and try again.
                </p>
              ) : textBlocks && textBlocks.length > 0 ? (
                <ol className="text-block-list">
                  {textBlocks.map((block, index) => (
                    <TextBlockItem
                      block={{
                        body: getTextBody(block.content),
                        id: block.id,
                        position: index + 1,
                        title: block.title,
                      }}
                      canMoveDown={index < textBlocks.length - 1}
                      canMoveUp={index > 0}
                      courseId={course.id}
                      key={block.id}
                      lessonId={lesson.id}
                      moduleId={courseModule.id}
                    />
                  ))}
                </ol>
              ) : (
                <p className="admin-empty-state">
                  No text blocks yet. Create the first locked text block using
                  the form.
                </p>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
