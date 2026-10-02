"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";

import { createModule, type ModuleFormState } from "../../actions";

type ModuleFormProps = {
  courseId: string;
};

const initialState: ModuleFormState = {
  status: "idle",
  message: "",
  fieldErrors: {},
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button className="auth-submit" disabled={pending} type="submit">
      {pending ? "Creating module…" : "Create module"}
    </button>
  );
}

export function ModuleForm({ courseId }: ModuleFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const createModuleForCourse = createModule.bind(null, courseId);
  const [state, formAction] = useActionState(
    createModuleForCourse,
    initialState,
  );

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state.status]);

  const slugDescription = state.fieldErrors.slug
    ? "module-slug-hint module-slug-error"
    : "module-slug-hint";

  return (
    <form action={formAction} className="admin-form" ref={formRef}>
      <div className="field-group">
        <label htmlFor="module-title">Module title</label>
        <input
          aria-describedby={
            state.fieldErrors.title ? "module-title-error" : undefined
          }
          aria-invalid={Boolean(state.fieldErrors.title)}
          id="module-title"
          maxLength={160}
          name="title"
          required
          type="text"
        />
        {state.fieldErrors.title ? (
          <p className="field-error" id="module-title-error">
            {state.fieldErrors.title}
          </p>
        ) : null}
      </div>

      <div className="field-group">
        <label htmlFor="module-slug">Slug</label>
        <input
          aria-describedby={slugDescription}
          aria-invalid={Boolean(state.fieldErrors.slug)}
          autoCapitalize="none"
          autoComplete="off"
          id="module-slug"
          maxLength={80}
          name="slug"
          pattern="[a-z0-9]+(-[a-z0-9]+)*"
          placeholder="introduction-to-ielts"
          required
          spellCheck={false}
          type="text"
        />
        <p className="field-hint" id="module-slug-hint">
          Lowercase letters, numbers, and hyphens only.
        </p>
        {state.fieldErrors.slug ? (
          <p className="field-error" id="module-slug-error">
            {state.fieldErrors.slug}
          </p>
        ) : null}
      </div>

      <div className="field-group">
        <label htmlFor="module-description">
          Description <span className="optional-label">Optional</span>
        </label>
        <textarea
          aria-describedby={
            state.fieldErrors.description
              ? "module-description-error"
              : undefined
          }
          aria-invalid={Boolean(state.fieldErrors.description)}
          id="module-description"
          maxLength={2000}
          name="description"
          rows={5}
        />
        {state.fieldErrors.description ? (
          <p className="field-error" id="module-description-error">
            {state.fieldErrors.description}
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
