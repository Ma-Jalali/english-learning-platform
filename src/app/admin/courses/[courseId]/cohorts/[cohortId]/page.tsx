import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import {
  createStudentEnrolment,
  createTeacherAssignment,
} from "@/app/admin/actions";
import { SignOutButton } from "@/app/dashboard/sign-out-button";
import { createClient } from "@/lib/supabase/server";

import { MembershipForm } from "./membership-form";

export const metadata: Metadata = {
  title: "Cohort members | English Learning Platform",
};

type CohortMembersPageProps = {
  params: Promise<{ courseId: string; cohortId: string }>;
};

type DirectoryProfile = {
  id: string;
  display_name: string | null;
  email: string | null;
  role: "student" | "teacher" | "admin";
  organisation_id: string | null;
};

function profileName(profile: DirectoryProfile | undefined) {
  return profile?.display_name || profile?.email || "Unavailable account";
}

function profileOptionLabel(
  profile: DirectoryProfile,
  organisationNames: Map<string, string>,
) {
  const parts = [profile.display_name || profile.email || "Unnamed account"];

  if (profile.display_name && profile.email) {
    parts.push(profile.email);
  }

  if (profile.organisation_id) {
    parts.push(
      organisationNames.get(profile.organisation_id) ?? "Unknown organisation",
    );
  }

  return parts.join(" · ");
}

export default async function CohortMembersPage({
  params,
}: CohortMembersPageProps) {
  const { courseId, cohortId } = await params;
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

  const { data: course, error: courseError } = await supabase
    .from("courses")
    .select("id, title, course_family, level, status")
    .eq("id", courseId)
    .maybeSingle();

  if (courseError || !course) {
    notFound();
  }

  const { data: cohort, error: cohortError } = await supabase
    .from("cohorts")
    .select("id, name, slug")
    .eq("id", cohortId)
    .eq("course_id", course.id)
    .maybeSingle();

  if (cohortError || !cohort) {
    notFound();
  }

  const [
    profilesResult,
    organisationsResult,
    enrolmentsResult,
    assignmentsResult,
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, display_name, email, role, organisation_id")
      .order("created_at", { ascending: true }),
    supabase.from("organisations").select("id, name").order("name"),
    supabase
      .from("enrolments")
      .select("id, student_id, created_at")
      .eq("cohort_id", cohort.id)
      .order("created_at", { ascending: true }),
    supabase
      .from("teacher_assignments")
      .select("id, teacher_id, created_at")
      .eq("cohort_id", cohort.id)
      .order("created_at", { ascending: true }),
  ]);

  const profiles = (profilesResult.data ?? []) as DirectoryProfile[];
  const profileById = new Map(profiles.map((profile) => [profile.id, profile]));
  const organisationNames = new Map(
    organisationsResult.data?.map((organisation) => [
      organisation.id,
      organisation.name,
    ]) ?? [],
  );
  const enrolledStudentIds = new Set(
    enrolmentsResult.data?.map((enrolment) => enrolment.student_id) ?? [],
  );
  const assignedTeacherIds = new Set(
    assignmentsResult.data?.map((assignment) => assignment.teacher_id) ?? [],
  );
  const studentOptions = profiles
    .filter(
      (profile) =>
        profile.role === "student" && !enrolledStudentIds.has(profile.id),
    )
    .map((profile) => ({
      id: profile.id,
      label: profileOptionLabel(profile, organisationNames),
    }))
    .sort((left, right) => left.label.localeCompare(right.label));
  const teacherOptions = profiles
    .filter(
      (profile) =>
        profile.role === "teacher" && !assignedTeacherIds.has(profile.id),
    )
    .map((profile) => ({
      id: profile.id,
      label: profileOptionLabel(profile, organisationNames),
    }))
    .sort((left, right) => left.label.localeCompare(right.label));
  const enrolStudentForCohort = createStudentEnrolment.bind(
    null,
    course.id,
    cohort.id,
  );
  const assignTeacherForCohort = createTeacherAssignment.bind(
    null,
    course.id,
    cohort.id,
  );

  return (
    <main className="admin-main">
      <div className="admin-shell">
        <header className="admin-header">
          <Link className="auth-brand" href="/">
            English Learning Platform
          </Link>
          <div className="admin-header-actions">
            <Link className="button-link secondary-link" href="/admin/users">
              User directory
            </Link>
            <Link
              className="button-link secondary-link"
              href={`/admin/courses/${course.id}/cohorts`}
            >
              Back to cohorts
            </Link>
            <SignOutButton />
          </div>
        </header>

        <section
          className="course-editor-intro"
          aria-labelledby="cohort-members-heading"
        >
          <p className="eyebrow">Cohort membership</p>
          <h1 id="cohort-members-heading">{cohort.name}</h1>
          <p>
            Enrol existing student accounts and assign existing teacher accounts
            to <strong>{course.title}</strong>. Roles come only from protected
            profiles.
          </p>
          <dl className="course-editor-summary">
            <div>
              <dt>Course</dt>
              <dd>{course.title}</dd>
            </div>
            <div>
              <dt>Cohort slug</dt>
              <dd>
                <code>{cohort.slug}</code>
              </dd>
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

        {profilesResult.error || organisationsResult.error ? (
          <p className="form-message form-message-error" role="alert">
            The secure user directory could not be loaded. Confirm the user
            directory migration has been applied before managing membership.
          </p>
        ) : null}

        <section
          className="membership-section"
          aria-labelledby="student-membership-heading"
        >
          <div className="section-heading">
            <div>
              <p className="eyebrow">Learner access</p>
              <h2 id="student-membership-heading">Student enrolments</h2>
            </div>
            <p>Only profiles whose current protected role is student appear.</p>
          </div>

          <div className="membership-grid">
            <div className="admin-panel">
              <h3>Enrol a student</h3>
              <MembershipForm
                action={enrolStudentForCohort}
                kind="student"
                options={studentOptions}
              />
            </div>

            <div className="admin-panel" aria-live="polite">
              <h3>Enrolled students</h3>
              {enrolmentsResult.error ? (
                <p className="form-message form-message-error" role="alert">
                  Student enrolments could not be loaded. Please refresh and try
                  again.
                </p>
              ) : enrolmentsResult.data && enrolmentsResult.data.length > 0 ? (
                <ul className="membership-list">
                  {enrolmentsResult.data.map((enrolment) => {
                    const profile = profileById.get(enrolment.student_id);

                    return (
                      <li key={enrolment.id}>
                        <div>
                          <h4>{profileName(profile)}</h4>
                          <p>{profile?.email || "Email unavailable"}</p>
                        </div>
                        <span className="role-badge">Student</span>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="admin-empty-state">
                  No students are enrolled in this cohort yet.
                </p>
              )}
            </div>
          </div>
        </section>

        <section
          className="membership-section"
          aria-labelledby="teacher-membership-heading"
        >
          <div className="section-heading">
            <div>
              <p className="eyebrow">Teaching access</p>
              <h2 id="teacher-membership-heading">Teacher assignments</h2>
            </div>
            <p>Assignment does not grant permission to alter locked core content.</p>
          </div>

          <div className="membership-grid">
            <div className="admin-panel">
              <h3>Assign a teacher</h3>
              <MembershipForm
                action={assignTeacherForCohort}
                kind="teacher"
                options={teacherOptions}
              />
            </div>

            <div className="admin-panel" aria-live="polite">
              <h3>Assigned teachers</h3>
              {assignmentsResult.error ? (
                <p className="form-message form-message-error" role="alert">
                  Teacher assignments could not be loaded. Please refresh and
                  try again.
                </p>
              ) : assignmentsResult.data && assignmentsResult.data.length > 0 ? (
                <ul className="membership-list">
                  {assignmentsResult.data.map((assignment) => {
                    const profile = profileById.get(assignment.teacher_id);

                    return (
                      <li key={assignment.id}>
                        <div>
                          <h4>{profileName(profile)}</h4>
                          <p>{profile?.email || "Email unavailable"}</p>
                        </div>
                        <span className="role-badge">Teacher</span>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="admin-empty-state">
                  No teachers are assigned to this cohort yet.
                </p>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
