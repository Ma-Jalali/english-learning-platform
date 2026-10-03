import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  getStudentModuleContext,
  throwLearningQueryError,
} from "@/lib/learning";

export const metadata: Metadata = {
  title: "Module lessons",
};

type ModuleLearningPageProps = {
  params: Promise<{
    courseId: string;
    cohortId: string;
    moduleId: string;
  }>;
};

export default async function ModuleLearningPage({
  params,
}: ModuleLearningPageProps) {
  const { courseId, cohortId, moduleId } = await params;
  const context = await getStudentModuleContext(
    courseId,
    cohortId,
    moduleId,
  );

  if (!context) {
    notFound();
  }

  const { data: lessons, error: lessonsError } = await context.supabase
    .from("lessons")
    .select("id, title, slug, description, sort_order, is_locked, created_at")
    .eq("module_id", context.courseModule.id)
    .eq("is_locked", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (lessonsError) {
    throwLearningQueryError("module lesson query", lessonsError);
  }

  const courseHref = `/learn/courses/${context.course.id}/cohorts/${context.cohort.id}`;

  return (
    <>
      <nav aria-label="Learning breadcrumb" className="learning-breadcrumbs">
        <Link href="/learn">My courses</Link>
        <span aria-hidden="true">/</span>
        <Link href={courseHref}>{context.course.title}</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{context.courseModule.title}</span>
      </nav>

      <section className="learning-course-hero learning-module-hero" aria-labelledby="module-heading">
        <div>
          <p className="eyebrow">Course module</p>
          <h1 id="module-heading">{context.courseModule.title}</h1>
          <p>
            {context.courseModule.description ||
              "Work through the lessons below in the order shown."}
          </p>
        </div>
        <dl className="learning-context-card">
          <div>
            <dt>Course</dt>
            <dd>{context.course.title}</dd>
          </div>
          <div>
            <dt>Cohort</dt>
            <dd>{context.cohort.name}</dd>
          </div>
          <div>
            <dt>Core lessons</dt>
            <dd>{lessons?.length ?? 0}</dd>
          </div>
        </dl>
      </section>

      <section className="learning-section" aria-labelledby="lessons-heading">
        <div className="learning-section-heading">
          <div>
            <p className="eyebrow">Module pathway</p>
            <h2 id="lessons-heading">Lessons</h2>
          </div>
          <p>Read-only core course content</p>
        </div>

        {lessons && lessons.length > 0 ? (
          <ol className="learning-path-list learning-lesson-list">
            {lessons.map((lesson, index) => (
              <li key={lesson.id}>
                <span className="learning-path-marker" aria-hidden="true">
                  {index + 1}
                </span>
                <div>
                  <span className="learning-path-label">Lesson {index + 1}</span>
                  <h3>{lesson.title}</h3>
                  <p>
                    {lesson.description ||
                      "Open this lesson to view its learning materials."}
                  </p>
                </div>
                <Link
                  aria-label={`Open lesson ${lesson.title}`}
                  className="button-link secondary-link learning-path-link"
                  href={`${courseHref}/modules/${context.courseModule.id}/lessons/${lesson.id}`}
                >
                  Open lesson
                </Link>
              </li>
            ))}
          </ol>
        ) : (
          <div className="learning-empty-state">
            <span aria-hidden="true">00</span>
            <div>
              <h3>This module has no available lessons yet.</h3>
              <p>
                Your access is active. The course team is still preparing the
                locked lesson content.
              </p>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
