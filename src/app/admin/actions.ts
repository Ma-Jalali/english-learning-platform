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

type ModuleFieldErrors = {
  title?: string;
  slug?: string;
  description?: string;
};

export type ModuleFormState = {
  status: "idle" | "error" | "success";
  message: string;
  fieldErrors: ModuleFieldErrors;
};

type LessonFieldErrors = {
  title?: string;
  slug?: string;
  description?: string;
};

export type LessonFormState = {
  status: "idle" | "error" | "success";
  message: string;
  fieldErrors: LessonFieldErrors;
};

type TextBlockFieldErrors = {
  title?: string;
  body?: string;
};

export type TextBlockFormState = {
  status: "idle" | "error" | "success";
  message: string;
  fieldErrors: TextBlockFieldErrors;
};

export type DeleteTextBlockState = {
  status: "idle" | "error";
  message: string;
};

const ORGANISATION_NAME_MAX_LENGTH = 120;
const ORGANISATION_SLUG_MAX_LENGTH = 80;
const COURSE_TITLE_MAX_LENGTH = 160;
const COURSE_SLUG_MAX_LENGTH = 80;
const COURSE_DESCRIPTION_MAX_LENGTH = 2000;
const MODULE_TITLE_MAX_LENGTH = 160;
const MODULE_SLUG_MAX_LENGTH = 80;
const MODULE_DESCRIPTION_MAX_LENGTH = 2000;
const LESSON_TITLE_MAX_LENGTH = 160;
const LESSON_SLUG_MAX_LENGTH = 80;
const LESSON_DESCRIPTION_MAX_LENGTH = 2000;
const TEXT_BLOCK_TITLE_MAX_LENGTH = 160;
const TEXT_BLOCK_BODY_MAX_LENGTH = 20000;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function readTextField(formData: FormData, fieldName: string) {
  const value = formData.get(fieldName);
  return typeof value === "string" ? value.trim() : "";
}

function readMultilineField(formData: FormData, fieldName: string) {
  const value = formData.get(fieldName);
  return typeof value === "string"
    ? value.replace(/\r\n?/g, "\n").trim()
    : "";
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

function validateModule(fields: {
  title: string;
  slug: string;
  description: string;
}) {
  const fieldErrors: ModuleFieldErrors = {};

  if (!fields.title) {
    fieldErrors.title = "Enter a module title.";
  } else if (fields.title.length > MODULE_TITLE_MAX_LENGTH) {
    fieldErrors.title = `Use ${MODULE_TITLE_MAX_LENGTH} characters or fewer.`;
  }

  if (!fields.slug) {
    fieldErrors.slug = "Enter a URL-friendly slug.";
  } else if (fields.slug.length > MODULE_SLUG_MAX_LENGTH) {
    fieldErrors.slug = `Use ${MODULE_SLUG_MAX_LENGTH} characters or fewer.`;
  } else if (!SLUG_PATTERN.test(fields.slug)) {
    fieldErrors.slug =
      "Use lowercase letters, numbers, and single hyphens only.";
  }

  if (fields.description.length > MODULE_DESCRIPTION_MAX_LENGTH) {
    fieldErrors.description =
      `Use ${MODULE_DESCRIPTION_MAX_LENGTH} characters or fewer.`;
  }

  return fieldErrors;
}

function validateLesson(fields: {
  title: string;
  slug: string;
  description: string;
}) {
  const fieldErrors: LessonFieldErrors = {};

  if (!fields.title) {
    fieldErrors.title = "Enter a lesson title.";
  } else if (fields.title.length > LESSON_TITLE_MAX_LENGTH) {
    fieldErrors.title = `Use ${LESSON_TITLE_MAX_LENGTH} characters or fewer.`;
  }

  if (!fields.slug) {
    fieldErrors.slug = "Enter a URL-friendly slug.";
  } else if (fields.slug.length > LESSON_SLUG_MAX_LENGTH) {
    fieldErrors.slug = `Use ${LESSON_SLUG_MAX_LENGTH} characters or fewer.`;
  } else if (!SLUG_PATTERN.test(fields.slug)) {
    fieldErrors.slug =
      "Use lowercase letters, numbers, and single hyphens only.";
  }

  if (fields.description.length > LESSON_DESCRIPTION_MAX_LENGTH) {
    fieldErrors.description =
      `Use ${LESSON_DESCRIPTION_MAX_LENGTH} characters or fewer.`;
  }

  return fieldErrors;
}

function validateTextBlock(fields: { title: string; body: string }) {
  const fieldErrors: TextBlockFieldErrors = {};

  if (fields.title.length > TEXT_BLOCK_TITLE_MAX_LENGTH) {
    fieldErrors.title = `Use ${TEXT_BLOCK_TITLE_MAX_LENGTH} characters or fewer.`;
  }

  if (!fields.body) {
    fieldErrors.body = "Enter the text block content.";
  } else if (fields.body.length > TEXT_BLOCK_BODY_MAX_LENGTH) {
    fieldErrors.body = `Use ${TEXT_BLOCK_BODY_MAX_LENGTH} characters or fewer.`;
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

async function findLockedTextBlock(
  supabase: Awaited<ReturnType<typeof createClient>>,
  courseId: string,
  moduleId: string,
  lessonId: string,
  blockId: string,
) {
  const { data: courseModule, error: moduleError } = await supabase
    .from("modules")
    .select("id")
    .eq("id", moduleId)
    .eq("course_id", courseId)
    .maybeSingle();

  if (moduleError || !courseModule) {
    return null;
  }

  const { data: lesson, error: lessonError } = await supabase
    .from("lessons")
    .select("id")
    .eq("id", lessonId)
    .eq("module_id", courseModule.id)
    .eq("is_locked", true)
    .maybeSingle();

  if (lessonError || !lesson) {
    return null;
  }

  const { data: block, error: blockError } = await supabase
    .from("lesson_blocks")
    .select("id, title")
    .eq("id", blockId)
    .eq("lesson_id", lesson.id)
    .eq("block_type", "text")
    .eq("is_locked", true)
    .maybeSingle();

  if (blockError || !block) {
    return null;
  }

  return { block, lesson };
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

export async function createModule(
  courseId: string,
  _previousState: ModuleFormState,
  formData: FormData,
): Promise<ModuleFormState> {
  const supabase = await createAdminClient();

  if (!UUID_PATTERN.test(courseId)) {
    return {
      status: "error",
      message: "This course link is invalid. Return to the admin workspace.",
      fieldErrors: {},
    };
  }

  const fields = {
    title: readTextField(formData, "title"),
    slug: readTextField(formData, "slug"),
    description: readTextField(formData, "description"),
  };
  const fieldErrors = validateModule(fields);

  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: "error",
      message: "Check the highlighted fields and try again.",
      fieldErrors,
    };
  }

  const { data: course, error: courseError } = await supabase
    .from("courses")
    .select("id, title")
    .eq("id", courseId)
    .maybeSingle();

  if (courseError || !course) {
    return {
      status: "error",
      message: "This course is no longer available. Return to the admin workspace.",
      fieldErrors: {},
    };
  }

  const { data: lastModule, error: orderError } = await supabase
    .from("modules")
    .select("sort_order")
    .eq("course_id", courseId)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (orderError) {
    return {
      status: "error",
      message: "The next module position could not be determined. Try again.",
      fieldErrors: {},
    };
  }

  const nextSortOrder = (lastModule?.sort_order ?? -1) + 1;
  const { data: module, error: insertError } = await supabase
    .from("modules")
    .insert({
      course_id: courseId,
      title: fields.title,
      slug: fields.slug,
      description: fields.description || null,
      sort_order: nextSortOrder,
    })
    .select("id, title")
    .single();

  if (insertError) {
    if (insertError.code === "23505") {
      return {
        status: "error",
        message: "That module slug is already in use for this course.",
        fieldErrors: {
          slug: "Choose a different slug for this course.",
        },
      };
    }

    return {
      status: "error",
      message: "The module could not be created. Please try again.",
      fieldErrors: {},
    };
  }

  revalidatePath(`/admin/courses/${courseId}`);
  revalidatePath("/admin");

  return {
    status: "success",
    message: `${module.title} was added to ${course.title}.`,
    fieldErrors: {},
  };
}

export async function createLockedLesson(
  courseId: string,
  moduleId: string,
  _previousState: LessonFormState,
  formData: FormData,
): Promise<LessonFormState> {
  const supabase = await createAdminClient();

  if (!UUID_PATTERN.test(courseId) || !UUID_PATTERN.test(moduleId)) {
    return {
      status: "error",
      message: "This module link is invalid. Return to the course editor.",
      fieldErrors: {},
    };
  }

  const fields = {
    title: readTextField(formData, "title"),
    slug: readTextField(formData, "slug"),
    description: readTextField(formData, "description"),
  };
  const fieldErrors = validateLesson(fields);

  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: "error",
      message: "Check the highlighted fields and try again.",
      fieldErrors,
    };
  }

  // Matching both IDs prevents a route or action call from attaching a lesson
  // to a module outside the course represented by the editor URL.
  const { data: courseModule, error: moduleError } = await supabase
    .from("modules")
    .select("id, title")
    .eq("id", moduleId)
    .eq("course_id", courseId)
    .maybeSingle();

  if (moduleError || !courseModule) {
    return {
      status: "error",
      message: "This module does not belong to the selected course.",
      fieldErrors: {},
    };
  }

  const { data: lastLesson, error: orderError } = await supabase
    .from("lessons")
    .select("sort_order")
    .eq("module_id", moduleId)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (orderError) {
    return {
      status: "error",
      message: "The next lesson position could not be determined. Try again.",
      fieldErrors: {},
    };
  }

  const nextSortOrder = (lastLesson?.sort_order ?? -1) + 1;
  // Do not chain .select() here. The lesson SELECT policy calls the STABLE
  // can_read_lesson() helper, which queries public.lessons. During an
  // INSERT ... RETURNING statement that helper cannot see the row inserted by
  // the same statement, so requesting the representation causes RLS to reject
  // an otherwise authorized admin insert. A minimal insert avoids that
  // self-referential read check; the refreshed page reads the row normally in
  // a subsequent statement.
  const { error: insertError } = await supabase
    .from("lessons")
    .insert({
      module_id: moduleId,
      title: fields.title,
      slug: fields.slug,
      description: fields.description || null,
      sort_order: nextSortOrder,
      is_locked: true,
    });

  if (insertError) {
    if (insertError.code === "23505") {
      return {
        status: "error",
        message: "That lesson slug is already in use for this module.",
        fieldErrors: {
          slug: "Choose a different slug for this module.",
        },
      };
    }

    if (insertError.code === "42501") {
      return {
        status: "error",
        message: "Your account is not permitted to create lessons.",
        fieldErrors: {},
      };
    }

    if (insertError.code === "23503") {
      return {
        status: "error",
        message: "This module is no longer available. Return to the course editor.",
        fieldErrors: {},
      };
    }

    // Keep diagnostics server-side and exclude form values, session data, and
    // database details that should not be sent back to the browser.
    console.error("Unexpected locked lesson insert failure", {
      code: insertError.code,
      message: insertError.message,
    });

    return {
      status: "error",
      message: "The lesson could not be created. Please try again.",
      fieldErrors: {},
    };
  }

  revalidatePath(`/admin/courses/${courseId}/modules/${moduleId}`);
  revalidatePath(`/admin/courses/${courseId}`);

  return {
    status: "success",
    message: `${fields.title} was added to ${courseModule.title} as a locked lesson.`,
    fieldErrors: {},
  };
}

export async function createLockedTextBlock(
  courseId: string,
  moduleId: string,
  lessonId: string,
  _previousState: TextBlockFormState,
  formData: FormData,
): Promise<TextBlockFormState> {
  const supabase = await createAdminClient();

  if (
    !UUID_PATTERN.test(courseId) ||
    !UUID_PATTERN.test(moduleId) ||
    !UUID_PATTERN.test(lessonId)
  ) {
    return {
      status: "error",
      message: "This lesson link is invalid. Return to the module editor.",
      fieldErrors: {},
    };
  }

  const fields = {
    title: readTextField(formData, "title"),
    body: readMultilineField(formData, "body"),
  };
  const fieldErrors = validateTextBlock(fields);

  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: "error",
      message: "Check the highlighted fields and try again.",
      fieldErrors,
    };
  }

  // Validate every parent relationship using server-bound route identifiers.
  const { data: courseModule, error: moduleError } = await supabase
    .from("modules")
    .select("id")
    .eq("id", moduleId)
    .eq("course_id", courseId)
    .maybeSingle();

  if (moduleError || !courseModule) {
    return {
      status: "error",
      message: "This module does not belong to the selected course.",
      fieldErrors: {},
    };
  }

  const { data: lesson, error: lessonError } = await supabase
    .from("lessons")
    .select("id, title")
    .eq("id", lessonId)
    .eq("module_id", courseModule.id)
    .maybeSingle();

  if (lessonError || !lesson) {
    return {
      status: "error",
      message: "This lesson does not belong to the selected module.",
      fieldErrors: {},
    };
  }

  const { data: lastBlock, error: orderError } = await supabase
    .from("lesson_blocks")
    .select("sort_order")
    .eq("lesson_id", lesson.id)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (orderError) {
    return {
      status: "error",
      message: "The next block position could not be determined. Try again.",
      fieldErrors: {},
    };
  }

  const nextSortOrder = (lastBlock?.sort_order ?? -1) + 1;
  const { error: insertError } = await supabase.from("lesson_blocks").insert({
    lesson_id: lesson.id,
    block_type: "text",
    title: fields.title || null,
    content: { body: fields.body },
    sort_order: nextSortOrder,
    is_locked: true,
  });

  if (insertError) {
    if (insertError.code === "42501") {
      return {
        status: "error",
        message: "Your account is not permitted to create lesson blocks.",
        fieldErrors: {},
      };
    }

    if (insertError.code === "23503") {
      return {
        status: "error",
        message: "This lesson is no longer available. Return to the module editor.",
        fieldErrors: {},
      };
    }

    console.error("Unexpected locked text block insert failure", {
      code: insertError.code,
      message: insertError.message,
    });

    return {
      status: "error",
      message: "The text block could not be created. Please try again.",
      fieldErrors: {},
    };
  }

  revalidatePath(
    `/admin/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`,
  );

  return {
    status: "success",
    message: `A locked text block was added to ${lesson.title}.`,
    fieldErrors: {},
  };
}

export async function updateLockedTextBlock(
  courseId: string,
  moduleId: string,
  lessonId: string,
  blockId: string,
  _previousState: TextBlockFormState,
  formData: FormData,
): Promise<TextBlockFormState> {
  const supabase = await createAdminClient();

  if (
    !UUID_PATTERN.test(courseId) ||
    !UUID_PATTERN.test(moduleId) ||
    !UUID_PATTERN.test(lessonId) ||
    !UUID_PATTERN.test(blockId)
  ) {
    return {
      status: "error",
      message: "This text block link is invalid. Refresh the lesson editor.",
      fieldErrors: {},
    };
  }

  const fields = {
    title: readTextField(formData, "title"),
    body: readMultilineField(formData, "body"),
  };
  const fieldErrors = validateTextBlock(fields);

  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: "error",
      message: "Check the highlighted fields and try again.",
      fieldErrors,
    };
  }

  const context = await findLockedTextBlock(
    supabase,
    courseId,
    moduleId,
    lessonId,
    blockId,
  );

  if (!context) {
    return {
      status: "error",
      message: "This locked text block is not available in the selected lesson.",
      fieldErrors: {},
    };
  }

  // Only these two columns are client-editable. The database trigger maintains
  // updated_at; all structural and lock columns remain untouched.
  const { error: updateError } = await supabase
    .from("lesson_blocks")
    .update({
      title: fields.title || null,
      content: { body: fields.body },
    })
    .eq("id", context.block.id)
    .eq("lesson_id", context.lesson.id)
    .eq("block_type", "text")
    .eq("is_locked", true);

  if (updateError) {
    if (updateError.code === "42501") {
      return {
        status: "error",
        message: "Your account is not permitted to edit lesson blocks.",
        fieldErrors: {},
      };
    }

    console.error("Unexpected locked text block update failure", {
      code: updateError.code,
      message: updateError.message,
    });

    return {
      status: "error",
      message: "The text block could not be updated. Please try again.",
      fieldErrors: {},
    };
  }

  revalidatePath(
    `/admin/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`,
  );

  return {
    status: "success",
    message: "The locked text block was updated.",
    fieldErrors: {},
  };
}

export async function deleteLockedTextBlock(
  courseId: string,
  moduleId: string,
  lessonId: string,
  blockId: string,
  _previousState: DeleteTextBlockState,
  _formData: FormData,
): Promise<DeleteTextBlockState> {
  const supabase = await createAdminClient();

  if (
    !UUID_PATTERN.test(courseId) ||
    !UUID_PATTERN.test(moduleId) ||
    !UUID_PATTERN.test(lessonId) ||
    !UUID_PATTERN.test(blockId)
  ) {
    return {
      status: "error",
      message: "This text block link is invalid. Refresh the lesson editor.",
    };
  }

  const context = await findLockedTextBlock(
    supabase,
    courseId,
    moduleId,
    lessonId,
    blockId,
  );

  if (!context) {
    return {
      status: "error",
      message: "This locked text block is not available in the selected lesson.",
    };
  }

  const { error: deleteError } = await supabase
    .from("lesson_blocks")
    .delete()
    .eq("id", context.block.id)
    .eq("lesson_id", context.lesson.id)
    .eq("block_type", "text")
    .eq("is_locked", true);

  if (deleteError) {
    if (deleteError.code === "42501") {
      return {
        status: "error",
        message: "Your account is not permitted to delete lesson blocks.",
      };
    }

    console.error("Unexpected locked text block delete failure", {
      code: deleteError.code,
      message: deleteError.message,
    });

    return {
      status: "error",
      message: "The text block could not be deleted. Please try again.",
    };
  }

  revalidatePath(
    `/admin/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`,
  );
  redirect(
    `/admin/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}?notice=block-deleted`,
  );
}
