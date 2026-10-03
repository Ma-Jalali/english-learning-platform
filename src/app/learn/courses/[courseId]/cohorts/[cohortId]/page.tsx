import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  getStudentCohortContext,
  throwLearningQueryError,
} from "@/lib/learning";

export const metadata: Metadata = {
  title: "Course overview",
};

type CourseLearningPageProps = {
  params: Promise<{ courseId: string; cohortId: string }>;
};

export default async function CourseLearningPage({
  params,
}: CourseLearningPageProps) {
  const { courseId, cohortId } = await params;
  const context = await getStudentCohortContext(courseId, cohortId);

  if (!context) {
    notFound();
  }

  const { data: modules, error: modulesError } = await context.supabase
    .from("modules")
    .select("id, title, slug, description, sort_order, created_at")
    .eq("course_id", context.course.id)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (modulesError) {
    throwLearningQueryError("course module query", modulesError);
  }

  return (
    <>
      <nav aria-label="Learning breadcrumb" className="learning-breadcrumbs">
        <Link href="/learn">My courses</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{context.course.title}</span>
      </nav>

      <section className="learning-course-hero" aria-labelledby="course-heading">
        <div>
          <p className="eyebrow">Published course</p>
          <h1 id="course-heading">{context.course.title}</h1>
          <p>
            {context.course.description ||
              "Your course team is preparing a detailed introduction."}
          </p>
        </div>
        <dl className="learning-context-card">
          <div>
            <dt>Cohort</dt>
            <dd>{context.cohort.name}</dd>
          </div>
          <div>
            <dt>Organisation</dt>
            <dd>{context.organisation?.name || "Course organisation"}</dd>
          </div>
          <div>
            <dt>Course family</dt>
            <dd>{context.course.course_family || "Not specified"}</dd>
          </div>
          <div>
            <dt>Level</dt>
            <dd>{context.course.level || "Not specified"}</dd>
          </div>
        </dl>
      </section>

      <section className="learning-section" aria-labelledby="modules-heading">
        <div className="learning-section-heading">
          <div>
            <p className="eyebrow">Course pathway</p>
            <h2 id="modules-heading">Modules</h2>
          </div>
          <p>{modules?.length ?? 0} in this course</p>
        </div>

        {modules && modules.length > 0 ? (
          <ol className="learning-path-list">
            {modules.map((courseModule, index) => (
              <li key={courseModule.id}>
                <span className="learning-path-marker" aria-hidden="true">
                  {index + 1}
                </span>
                <div>
                  <span className="learning-path-label">Module {index + 1}</span>
                  <h3>{courseModule.title}</h3>
                  <p>
                    {courseModule.description ||
                      "Open this module to explore its lessons."}
                  </p>
                </div>
                <Link
                  aria-label={`Open module ${courseModule.title}`}
                  className="button-link secondary-link learning-path-link"
                  href={`/learn/courses/${context.course.id}/cohorts/${context.cohort.id}/modules/${courseModule.id}`}
                >
                  View lessons
                </Link>
              </li>
            ))}
          </ol>
        ) : (
          <div className="learning-empty-state">
            <span aria-hidden="true">00</span>
            <div>
              <h3>This course has no modules yet.</h3>
              <p>
                The course is available to your cohort, but its learning pathway
                is still being prepared.
              </p>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
