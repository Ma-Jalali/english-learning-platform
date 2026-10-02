"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";

import {
  createOrganisation,
  type OrganisationFormState,
} from "./actions";

const initialState: OrganisationFormState = {
  status: "idle",
  message: "",
  fieldErrors: {},
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button className="auth-submit" disabled={pending} type="submit">
      {pending ? "Creating organisation…" : "Create organisation"}
    </button>
  );
}

export function OrganisationForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState(createOrganisation, initialState);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state.status]);

  const nameErrorId = state.fieldErrors.name
    ? "organisation-name-error"
    : undefined;
  const slugDescription = state.fieldErrors.slug
    ? "organisation-slug-hint organisation-slug-error"
    : "organisation-slug-hint";

  return (
    <form
      action={formAction}
      className="admin-form"
      ref={formRef}
    >
      <div className="field-group">
        <label htmlFor="organisation-name">Organisation name</label>
        <input
          aria-describedby={nameErrorId}
          aria-invalid={Boolean(state.fieldErrors.name)}
          autoComplete="organization"
          id="organisation-name"
          maxLength={120}
          name="name"
          required
          type="text"
        />
        {state.fieldErrors.name ? (
          <p className="field-error" id="organisation-name-error">
            {state.fieldErrors.name}
          </p>
        ) : null}
      </div>

      <div className="field-group">
        <label htmlFor="organisation-slug">Slug</label>
        <input
          aria-describedby={slugDescription}
          aria-invalid={Boolean(state.fieldErrors.slug)}
          autoCapitalize="none"
          autoComplete="off"
          id="organisation-slug"
          maxLength={80}
          name="slug"
          pattern="[a-z0-9]+(-[a-z0-9]+)*"
          placeholder="example-language-school"
          required
          spellCheck={false}
          type="text"
        />
        <p className="field-hint" id="organisation-slug-hint">
          Lowercase letters, numbers, and hyphens only.
        </p>
        {state.fieldErrors.slug ? (
          <p className="field-error" id="organisation-slug-error">
            {state.fieldErrors.slug}
          </p>
        ) : null}
      </div>

      {state.message ? (
        <p
          className={`form-message ${
            state.status === "success"
              ? "form-message-success"
              : "form-message-error"
          }`}
          role={state.status === "success" ? "status" : "alert"}
        >
          {state.message}
        </p>
      ) : null}

      <SubmitButton />
    </form>
  );
}
