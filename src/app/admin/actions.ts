"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

type OrganisationFieldErrors = {
  name?: string;
  slug?: string;
};

export type OrganisationFormState = {
  status: "idle" | "error" | "success";
  message: string;
  fieldErrors: OrganisationFieldErrors;
};

const ORGANISATION_NAME_MAX_LENGTH = 120;
const ORGANISATION_SLUG_MAX_LENGTH = 80;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

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

export async function createOrganisation(
  _previousState: OrganisationFormState,
  formData: FormData,
): Promise<OrganisationFormState> {
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

  // The role comes from the server-controlled profile row, never form data or
  // editable Auth metadata. RLS repeats this authorization check in PostgreSQL.
  if (profileError || profile?.role !== "admin") {
    redirect("/dashboard");
  }

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
