"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";

import {
  createLockedTextBlock,
  type TextBlockFormState,
} from "@/app/admin/actions";

type BlockFormProps = {
  courseId: string;
  moduleId: string;
  lessonId: string;
};

const initialState: TextBlockFormState = {
  status: "idle",
  message: "",
  fieldErrors: {},
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button className="auth-submit" disabled={pending} type="submit">
      {pending ? "Creating locked text block…" : "Create locked text block"}
    </button>
  );
}

export function BlockForm({ courseId, moduleId, lessonId }: BlockFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const createBlockForLesson = createLockedTextBlock.bind(
    null,
    courseId,
    moduleId,
    lessonId,
  );
  const [state, formAction] = useActionState(
    createBlockForLesson,
    initialState,
  );

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state.status]);

  return (
    <form action={formAction} className="admin-form" ref={formRef}>
      <div className="field-group">
        <label htmlFor="block-title">
          Block title <span className="optional-label">Optional</span>
        </label>
        <input
          aria-describedby={
            state.fieldErrors.title ? "block-title-error" : undefined
          }
          aria-invalid={Boolean(state.fieldErrors.title)}
          id="block-title"
          maxLength={160}
          name="title"
          type="text"
        />
        {state.fieldErrors.title ? (
          <p className="field-error" id="block-title-error">
            {state.fieldErrors.title}
          </p>
        ) : null}
      </div>

      <div className="field-group">
        <label htmlFor="block-body">Text content</label>
        <textarea
          aria-describedby={
            state.fieldErrors.body ? "block-body-error" : "block-body-hint"
          }
          aria-invalid={Boolean(state.fieldErrors.body)}
          id="block-body"
          maxLength={20000}
          name="body"
          required
          rows={10}
        />
        <p className="field-hint" id="block-body-hint">
          Paragraphs and line breaks will be preserved.
        </p>
        {state.fieldErrors.body ? (
          <p className="field-error" id="block-body-error">
            {state.fieldErrors.body}
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
