"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";

import type { CohortFormState } from "../../../actions";

type CohortFormProps = {
  action: (
    previousState: CohortFormState,
    formData: FormData,
  ) => Promise<CohortFormState>;
};

const initialState: CohortFormState = {
  status: "idle",
  message: "",
  fieldErrors: {},
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button className="auth-submit" disabled={pending} type="submit">
      {pending ? "Creating cohort…" : "Create cohort"}
    </button>
  );
}

export function CohortForm({ action }: CohortFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState(action, initialState);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state.status]);

  const slugDescription = state.fieldErrors.slug
    ? "cohort-slug-hint cohort-slug-error"
    : "cohort-slug-hint";

  return (
    <form action={formAction} className="admin-form" ref={formRef}>
      <div className="field-group">
        <label htmlFor="cohort-name">Cohort name</label>
        <input
          aria-describedby={
            state.fieldErrors.name ? "cohort-name-error" : undefined
          }
          aria-invalid={Boolean(state.fieldErrors.name)}
          id="cohort-name"
          maxLength={160}
          name="name"
          placeholder="IELTS Pilot Cohort"
          required
          type="text"
        />
        {state.fieldErrors.name ? (
          <p className="field-error" id="cohort-name-error">
            {state.fieldErrors.name}
          </p>
        ) : null}
      </div>

      <div className="field-group">
        <label htmlFor="cohort-slug">Slug</label>
        <input
          aria-describedby={slugDescription}
          aria-invalid={Boolean(state.fieldErrors.slug)}
          autoCapitalize="none"
          autoComplete="off"
          id="cohort-slug"
          maxLength={80}
          name="slug"
          pattern="[a-z0-9]+(-[a-z0-9]+)*"
          placeholder="ielts-pilot"
          required
          spellCheck={false}
          type="text"
        />
        <p className="field-hint" id="cohort-slug-hint">
          Lowercase letters, numbers, and hyphens only.
        </p>
        {state.fieldErrors.slug ? (
          <p className="field-error" id="cohort-slug-error">
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
