"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";

import { createDraftCourse, type CourseFormState } from "./actions";
import { COURSE_FAMILIES, COURSE_LEVELS } from "./course-options";

type OrganisationOption = {
  id: string;
  name: string;
};

type CourseFormProps = {
  organisations: OrganisationOption[];
};

const initialState: CourseFormState = {
  status: "idle",
  message: "",
  fieldErrors: {},
};

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      className="auth-submit"
      disabled={disabled || pending}
      type="submit"
    >
      {pending ? "Creating draft course…" : "Create draft course"}
    </button>
  );
}

export function CourseForm({ organisations }: CourseFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState(createDraftCourse, initialState);
  const hasOrganisations = organisations.length > 0;

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state.status]);

  const slugDescription = state.fieldErrors.slug
    ? "course-slug-hint course-slug-error"
    : "course-slug-hint";

  return (
    <form action={formAction} className="admin-form" ref={formRef}>
      <div className="field-group">
        <label htmlFor="course-organisation">Organisation</label>
        <select
          aria-describedby={
            state.fieldErrors.organisationId
              ? "course-organisation-error"
              : undefined
          }
          aria-invalid={Boolean(state.fieldErrors.organisationId)}
          defaultValue=""
          disabled={!hasOrganisations}
          id="course-organisation"
          name="organisationId"
          required
        >
          <option disabled value="">
            Select an organisation
          </option>
          {organisations.map((organisation) => (
            <option key={organisation.id} value={organisation.id}>
              {organisation.name}
            </option>
          ))}
        </select>
        {state.fieldErrors.organisationId ? (
          <p className="field-error" id="course-organisation-error">
            {state.fieldErrors.organisationId}
          </p>
        ) : null}
      </div>

      <div className="field-group">
        <label htmlFor="course-title">Course title</label>
        <input
          aria-describedby={
            state.fieldErrors.title ? "course-title-error" : undefined
          }
          aria-invalid={Boolean(state.fieldErrors.title)}
          id="course-title"
          maxLength={160}
          name="title"
          required
          type="text"
        />
        {state.fieldErrors.title ? (
          <p className="field-error" id="course-title-error">
            {state.fieldErrors.title}
          </p>
        ) : null}
      </div>

      <div className="field-group">
        <label htmlFor="course-slug">Slug</label>
        <input
          aria-describedby={slugDescription}
          aria-invalid={Boolean(state.fieldErrors.slug)}
          autoCapitalize="none"
          autoComplete="off"
          id="course-slug"
          maxLength={80}
          name="slug"
          pattern="[a-z0-9]+(-[a-z0-9]+)*"
          placeholder="general-english-a1"
          required
          spellCheck={false}
          type="text"
        />
        <p className="field-hint" id="course-slug-hint">
          Lowercase letters, numbers, and hyphens only.
        </p>
        {state.fieldErrors.slug ? (
          <p className="field-error" id="course-slug-error">
            {state.fieldErrors.slug}
          </p>
        ) : null}
      </div>

      <div className="admin-form-row">
        <div className="field-group">
          <label htmlFor="course-family">Course family</label>
          <select
            aria-describedby={
              state.fieldErrors.courseFamily
                ? "course-family-error"
                : undefined
            }
            aria-invalid={Boolean(state.fieldErrors.courseFamily)}
            defaultValue=""
            id="course-family"
            name="courseFamily"
            required
          >
            <option disabled value="">
              Select a family
            </option>
            {COURSE_FAMILIES.map((family) => (
              <option key={family} value={family}>
                {family}
              </option>
            ))}
          </select>
          {state.fieldErrors.courseFamily ? (
            <p className="field-error" id="course-family-error">
              {state.fieldErrors.courseFamily}
            </p>
          ) : null}
        </div>

        <div className="field-group">
          <label htmlFor="course-level">Level</label>
          <select
            aria-describedby={
              state.fieldErrors.level ? "course-level-error" : undefined
            }
            aria-invalid={Boolean(state.fieldErrors.level)}
            defaultValue=""
            id="course-level"
            name="level"
            required
          >
            <option disabled value="">
              Select a level
            </option>
            {COURSE_LEVELS.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
          {state.fieldErrors.level ? (
            <p className="field-error" id="course-level-error">
              {state.fieldErrors.level}
            </p>
          ) : null}
        </div>
      </div>

      <div className="field-group">
        <label htmlFor="course-description">
          Description <span className="optional-label">Optional</span>
        </label>
        <textarea
          aria-describedby={
            state.fieldErrors.description
              ? "course-description-error"
              : undefined
          }
          aria-invalid={Boolean(state.fieldErrors.description)}
          id="course-description"
          maxLength={2000}
          name="description"
          rows={5}
        />
        {state.fieldErrors.description ? (
          <p className="field-error" id="course-description-error">
            {state.fieldErrors.description}
          </p>
        ) : null}
      </div>

      {!hasOrganisations ? (
        <p className="form-message form-message-error" role="alert">
          Create an organisation before creating a course.
        </p>
      ) : null}

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

      <SubmitButton disabled={!hasOrganisations} />
    </form>
  );
}
