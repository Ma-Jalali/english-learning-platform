"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";

import {
  createLockedLesson,
  type LessonFormState,
} from "../../../../actions";

type LessonFormProps = {
  courseId: string;
  moduleId: string;
};

const initialState: LessonFormState = {
  status: "idle",
  message: "",
  fieldErrors: {},
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button className="auth-submit" disabled={pending} type="submit">
      {pending ? "Creating locked lesson…" : "Create locked lesson"}
    </button>
  );
}

export function LessonForm({ courseId, moduleId }: LessonFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const createLessonForModule = createLockedLesson.bind(
    null,
    courseId,
    moduleId,
  );
  const [state, formAction] = useActionState(
    createLessonForModule,
    initialState,
  );

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state.status]);

  const slugDescription = state.fieldErrors.slug
    ? "lesson-slug-hint lesson-slug-error"
    : "lesson-slug-hint";

  return (
    <form action={formAction} className="admin-form" ref={formRef}>
      <div className="field-group">
        <label htmlFor="lesson-title">Lesson title</label>
        <input
          aria-describedby={
            state.fieldErrors.title ? "lesson-title-error" : undefined
          }
          aria-invalid={Boolean(state.fieldErrors.title)}
          id="lesson-title"
          maxLength={160}
          name="title"
          required
          type="text"
        />
        {state.fieldErrors.title ? (
          <p className="field-error" id="lesson-title-error">
            {state.fieldErrors.title}
          </p>
        ) : null}
      </div>

      <div className="field-group">
        <label htmlFor="lesson-slug">Slug</label>
        <input
          aria-describedby={slugDescription}
          aria-invalid={Boolean(state.fieldErrors.slug)}
          autoCapitalize="none"
          autoComplete="off"
          id="lesson-slug"
          maxLength={80}
          name="slug"
          pattern="[a-z0-9]+(-[a-z0-9]+)*"
          placeholder="ielts-test-format"
          required
          spellCheck={false}
          type="text"
        />
        <p className="field-hint" id="lesson-slug-hint">
          Lowercase letters, numbers, and hyphens only.
        </p>
        {state.fieldErrors.slug ? (
          <p className="field-error" id="lesson-slug-error">
            {state.fieldErrors.slug}
          </p>
        ) : null}
      </div>

      <div className="field-group">
        <label htmlFor="lesson-description">
          Description <span className="optional-label">Optional</span>
        </label>
        <textarea
          aria-describedby={
            state.fieldErrors.description
              ? "lesson-description-error"
              : undefined
          }
          aria-invalid={Boolean(state.fieldErrors.description)}
          id="lesson-description"
          maxLength={2000}
          name="description"
          rows={5}
        />
        {state.fieldErrors.description ? (
          <p className="field-error" id="lesson-description-error">
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
