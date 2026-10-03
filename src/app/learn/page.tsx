import type { Metadata } from "next";
import Link from "next/link";

import {
  requireStudent,
  throwLearningQueryError,
} from "@/lib/learning";

export const metadata: Metadata = {
  title: "My learning",
};

export default async function LearningHomePage() {
  const { email, supabase, userId } = await requireStudent();
  const { data: enrolments, error: enrolmentsError } = await supabase
    .from("enrolments")
    .select("id, cohort_id, created_at")
    .eq("student_id", userId)
    .order("created_at", { ascending: true });

  if (enrolmentsError) {
    throwLearningQueryError("course-list enrolment query", enrolmentsError);
  }

  const cohortIds = enrolments?.map((enrolment) => enrolment.cohort_id) ?? [];
  const { data: cohorts, error: cohortsError } = cohortIds.length
    ? await supabase
        .from("cohorts")
        .select("id, course_id, name, slug, sort_order")
        .in("id", cohortIds)
        .order("sort_order", { ascending: true })
    : { data: [], error: null };

  if (cohortsError) {
    throwLearningQueryError("course-list cohort query", cohortsError);
  }

  const courseIds = [...new Set(cohorts?.map((cohort) => cohort.course_id))];
  const { data: courses, error: coursesError } = courseIds.length
    ? await supabase
        .from("courses")
        .select(
          "id, organisation_id, title, slug, description, level, course_family, status, sort_order",
        )
        .in("id", courseIds)
        .eq("status", "published")
        .order("sort_order", { ascending: true })
    : { data: [], error: null };

  if (coursesError) {
    throwLearningQueryError("course-list course query", coursesError);
  }

  const organisationIds = [
    ...new Set(courses?.map((course) => course.organisation_id)),
  ];
  const { data: organisations, error: organisationsError } =
    organisationIds.length
      ? await supabase
          .from("organisations")
          .select("id, name")
          .in("id", organisationIds)
      : { data: [], error: null };

  if (organisationsError) {
    throwLearningQueryError(
      "course-list organisation query",
      organisationsError,
    );
  }

  const coursesById = new Map(courses?.map((course) => [course.id, course]));
  const organisationsById = new Map(
    organisations?.map((organisation) => [organisation.id, organisation.name]),
  );
  const availableCohorts =
    cohorts?.flatMap((cohort) => {
      const course = coursesById.get(cohort.course_id);

      return course ? [{ cohort, course }] : [];
    }) ?? [];

  return (
    <>
      <section className="learning-hero" aria-labelledby="learning-heading">
        <div>
          <p className="eyebrow">My learning</p>
          <h1 id="learning-heading">Continue where English takes you next.</h1>
          <p>
            Published courses appear here only when your account is enrolled in
            the matching cohort.
          </p>
        </div>
        <div className="learning-identity" aria-label="Current learner">
          <span>Signed in as</span>
          <strong>{email}</strong>
        </div>
      </section>

      <section className="learning-section" aria-labelledby="courses-heading">
        <div className="learning-section-heading">
          <div>
            <p className="eyebrow">Enrolled access</p>
            <h2 id="courses-heading">Your courses</h2>
          </div>
          <p>
            {availableCohorts.length} published {availableCohorts.length === 1 ? "cohort" : "cohorts"}
          </p>
        </div>

        {availableCohorts.length > 0 ? (
          <ul className="learning-course-grid">
            {availableCohorts.map(({ cohort, course }, index) => (
              <li key={cohort.id}>
                <span className="learning-card-number" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="learning-card-heading">
                  <div>
                    <p>{organisationsById.get(course.organisation_id) ?? "Course organisation"}</p>
                    <h3>{course.title}</h3>
                  </div>
                  <span className="published-badge">Published</span>
                </div>
                <p className="learning-card-description">
                  {course.description || "Course description coming soon."}
                </p>
                <dl className="learning-card-details">
                  <div>
                    <dt>Cohort</dt>
                    <dd>{cohort.name}</dd>
                  </div>
                  <div>
                    <dt>Course family</dt>
                    <dd>{course.course_family || "Not specified"}</dd>
                  </div>
                  <div>
                    <dt>Level</dt>
                    <dd>{course.level || "Not specified"}</dd>
                  </div>
                </dl>
                <Link
                  aria-label={`Open ${course.title} for ${cohort.name}`}
                  className="button-link learning-card-link"
                  href={`/learn/courses/${course.id}/cohorts/${cohort.id}`}
                >
                  Open course
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="learning-empty-state">
            <span aria-hidden="true">01</span>
            <div>
              <h3>No published courses are available yet.</h3>
              <p>
                {cohortIds.length > 0
                  ? "Your enrolment is active, but its course is still being prepared. It will appear automatically after an administrator publishes it."
                  : "Your account is ready. An administrator needs to enrol you in a published course cohort before lessons appear here."}
              </p>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
