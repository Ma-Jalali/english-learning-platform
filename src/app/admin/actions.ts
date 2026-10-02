"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import { COURSE_FAMILIES, COURSE_LEVELS } from "./course-options";

type OrganisationFieldErrors = {
  name?: string;
  slug?: string;
};

export type OrganisationFormState = {
  status: "idle" | "error" | "success";
  message: string;
  fieldErrors: OrganisationFieldErrors;
};

type CourseFieldErrors = {
  organisationId?: string;
  title?: string;
  slug?: string;
  courseFamily?: string;
  level?: string;
  description?: string;
};

export type CourseFormState = {
  status: "idle" | "error" | "success";
  message: string;
  fieldErrors: CourseFieldErrors;
};

const ORGANISATION_NAME_MAX_LENGTH = 120;
const ORGANISATION_SLUG_MAX_LENGTH = 80;
const COURSE_TITLE_MAX_LENGTH = 160;
const COURSE_SLUG_MAX_LENGTH = 80;
const COURSE_DESCRIPTION_MAX_LENGTH = 2000;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function readTextField(formData: FormData, fieldName: string) {
  const value = formData.get(fieldName);
  return typeof value === "string" ? value.trim() : "";
}

function validateOrganisation(name: string, slug: string) {
  const fieldErrors: OrganisationFieldErrors = {};

  if (!name) {
    fieldErrors.name = "Enter an organisation name.";
  } else if (name.length > ORGANISATION_NAME_MAX_LENGTH) {
    fieldErrors.name = `Use ${ORGANISATION_NAME_MAX_LENGTH} characters or fewer.`;
  }

  if (!slug) {
    fieldErrors.slug = "Enter a URL-friendly slug.";
  } else if (slug.length > ORGANISATION_SLUG_MAX_LENGTH) {
    fieldErrors.slug = `Use ${ORGANISATION_SLUG_MAX_LENGTH} characters or fewer.`;
  } else if (!SLUG_PATTERN.test(slug)) {
    fieldErrors.slug =
      "Use lowercase letters, numbers, and single hyphens only.";
  }

  return fieldErrors;
}

function isAllowedOption(options: readonly string[], value: string) {
  return options.includes(value);
}

function validateDraftCourse(fields: {
  organisationId: string;
  title: string;
  slug: string;
  courseFamily: string;
  level: string;
  description: string;
}) {
  const fieldErrors: CourseFieldErrors = {};

  if (!fields.organisationId || !UUID_PATTERN.test(fields.organisationId)) {
    fieldErrors.organisationId = "Select an existing organisation.";
  }

  if (!fields.title) {
    fieldErrors.title = "Enter a course title.";
  } else if (fields.title.length > COURSE_TITLE_MAX_LENGTH) {
    fieldErrors.title = `Use ${COURSE_TITLE_MAX_LENGTH} characters or fewer.`;
  }

  if (!fields.slug) {
    fieldErrors.slug = "Enter a URL-friendly slug.";
  } else if (fields.slug.length > COURSE_SLUG_MAX_LENGTH) {
    fieldErrors.slug = `Use ${COURSE_SLUG_MAX_LENGTH} characters or fewer.`;
  } else if (!SLUG_PATTERN.test(fields.slug)) {
    fieldErrors.slug =
      "Use lowercase letters, numbers, and single hyphens only.";
  }

  if (!isAllowedOption(COURSE_FAMILIES, fields.courseFamily)) {
    fieldErrors.courseFamily = "Select a valid course family.";
  }

  if (!isAllowedOption(COURSE_LEVELS, fields.level)) {
    fieldErrors.level = "Select a valid course level.";
  }

  if (fields.description.length > COURSE_DESCRIPTION_MAX_LENGTH) {
    fieldErrors.description =
      `Use ${COURSE_DESCRIPTION_MAX_LENGTH} characters or fewer.`;
  }

  return fieldErrors;
}

async function createAdminClient() {
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

  // Roles are read from server-controlled profiles, never form data or editable
  // Auth metadata. PostgreSQL RLS independently enforces the same admin rule.
  if (profileError || profile?.role !== "admin") {
    redirect("/dashboard");
  }

  return supabase;
}

export async function createOrganisation(
  _previousState: OrganisationFormState,
  formData: FormData,
): Promise<OrganisationFormState> {
  const supabase = await createAdminClient();

  const name = readTextField(formData, "name");
  const slug = readTextField(formData, "slug");
  const fieldErrors = validateOrganisation(name, slug);

  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: "error",
      message: "Check the highlighted fields and try again.",
      fieldErrors,
    };
  }

  const { data: organisation, error: insertError } = await supabase
    .from("organisations")
    .insert({ name, slug })
    .select("id, name")
    .single();

  if (insertError) {
    if (insertError.code === "23505") {
      return {
        status: "error",
        message: "That organisation slug is already in use.",
        fieldErrors: {
          slug: "Choose a different slug.",
        },
      };
    }

    return {
      status: "error",
      message: "The organisation could not be created. Please try again.",
      fieldErrors: {},
    };
  }

  revalidatePath("/admin");

  return {
    status: "success",
    message: `${organisation.name} was created.`,
    fieldErrors: {},
  };
}

export async function createDraftCourse(
  _previousState: CourseFormState,
  formData: FormData,
): Promise<CourseFormState> {
  const supabase = await createAdminClient();
  const fields = {
    organisationId: readTextField(formData, "organisationId"),
    title: readTextField(formData, "title"),
    slug: readTextField(formData, "slug"),
    courseFamily: readTextField(formData, "courseFamily"),
    level: readTextField(formData, "level"),
    description: readTextField(formData, "description"),
  };
  const fieldErrors = validateDraftCourse(fields);

  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: "error",
      message: "Check the highlighted fields and try again.",
      fieldErrors,
    };
  }

  const { data: selectedOrganisation, error: organisationError } =
    await supabase
      .from("organisations")
      .select("id")
      .eq("id", fields.organisationId)
      .maybeSingle();

  if (organisationError || !selectedOrganisation) {
    return {
      status: "error",
      message: "Select an organisation that still exists and try again.",
      fieldErrors: {
        organisationId: "Select an existing organisation.",
      },
    };
  }

  const { data: course, error: insertError } = await supabase
    .from("courses")
    .insert({
      organisation_id: fields.organisationId,
      title: fields.title,
      slug: fields.slug,
      description: fields.description || null,
      course_family: fields.courseFamily,
      level: fields.level,
      status: "draft",
    })
    .select("id, title")
    .single();

  if (insertError) {
    if (insertError.code === "23505") {
      return {
        status: "error",
        message:
          "That course slug is already in use for the selected organisation.",
        fieldErrors: {
          slug: "Choose a different slug for this organisation.",
        },
      };
    }

    return {
      status: "error",
      message: "The draft course could not be created. Please try again.",
      fieldErrors: {},
    };
  }

  revalidatePath("/admin");

  return {
    status: "success",
    message: `${course.title} was created as a draft.`,
    fieldErrors: {},
  };
}
