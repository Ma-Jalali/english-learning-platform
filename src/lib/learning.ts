import "server-only";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type SupabaseError = {
  code?: string;
  message?: string;
};

export function isUuid(value: string) {
  return UUID_PATTERN.test(value);
}

export function throwLearningQueryError(
  operation: string,
  error: SupabaseError,
): never {
  console.error(`Unexpected student learning ${operation} failure`, {
    code: error.code,
    message: error.message,
  });

  throw new Error("Student learning content could not be loaded.");
}

export async function requireStudent() {
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

  if (profileError || profile?.role !== "student") {
    redirect("/dashboard");
  }

  return {
    email:
      typeof claims.email === "string" ? claims.email : "Email unavailable",
    supabase,
    userId,
  };
}

export async function getStudentCohortContext(
  courseId: string,
  cohortId: string,
) {
  const student = await requireStudent();

  if (!isUuid(courseId) || !isUuid(cohortId)) {
    return null;
  }

  // The student ID always comes from verified claims. RLS independently limits
  // enrolment reads to this authenticated student.
  const { data: enrolment, error: enrolmentError } = await student.supabase
    .from("enrolments")
    .select("id, cohort_id")
    .eq("student_id", student.userId)
    .eq("cohort_id", cohortId)
    .maybeSingle();

  if (enrolmentError) {
    throwLearningQueryError("enrolment lookup", enrolmentError);
  }

  if (!enrolment) {
    return null;
  }

  // Both identifiers are checked so a valid cohort cannot be mounted beneath
  // a different course URL. The cohort SELECT policy also requires publication.
  const { data: cohort, error: cohortError } = await student.supabase
    .from("cohorts")
    .select("id, course_id, name, slug")
    .eq("id", cohortId)
    .eq("course_id", courseId)
    .maybeSingle();

  if (cohortError) {
    throwLearningQueryError("cohort lookup", cohortError);
  }

  if (!cohort) {
    return null;
  }

  const { data: course, error: courseError } = await student.supabase
    .from("courses")
    .select(
      "id, organisation_id, title, slug, description, level, course_family, status",
    )
    .eq("id", courseId)
    .eq("status", "published")
    .maybeSingle();

  if (courseError) {
    throwLearningQueryError("course lookup", courseError);
  }

  if (!course) {
    return null;
  }

  const { data: organisation, error: organisationError } =
    await student.supabase
      .from("organisations")
      .select("id, name")
      .eq("id", course.organisation_id)
      .maybeSingle();

  if (organisationError) {
    throwLearningQueryError("organisation lookup", organisationError);
  }

  return {
    ...student,
    cohort,
    course,
    organisation,
  };
}

export async function getStudentModuleContext(
  courseId: string,
  cohortId: string,
  moduleId: string,
) {
  const context = await getStudentCohortContext(courseId, cohortId);

  if (!context || !isUuid(moduleId)) {
    return null;
  }

  const { data: courseModule, error: moduleError } = await context.supabase
    .from("modules")
    .select("id, course_id, title, slug, description, sort_order")
    .eq("id", moduleId)
    .eq("course_id", context.course.id)
    .maybeSingle();

  if (moduleError) {
    throwLearningQueryError("module lookup", moduleError);
  }

  if (!courseModule) {
    return null;
  }

  return {
    ...context,
    courseModule,
  };
}

export async function getStudentLessonContext(
  courseId: string,
  cohortId: string,
  moduleId: string,
  lessonId: string,
) {
  const context = await getStudentModuleContext(
    courseId,
    cohortId,
    moduleId,
  );

  if (!context || !isUuid(lessonId)) {
    return null;
  }

  const { data: lesson, error: lessonError } = await context.supabase
    .from("lessons")
    .select("id, module_id, title, slug, description, sort_order, is_locked")
    .eq("id", lessonId)
    .eq("module_id", context.courseModule.id)
    .eq("is_locked", true)
    .maybeSingle();

  if (lessonError) {
    throwLearningQueryError("lesson lookup", lessonError);
  }

  if (!lesson) {
    return null;
  }

  return {
    ...context,
    lesson,
  };
}
