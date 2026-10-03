"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";

import type { MembershipFormState } from "@/app/admin/actions";

type DirectoryOption = {
  id: string;
  label: string;
};

type MembershipFormProps = {
  action: (
    previousState: MembershipFormState,
    formData: FormData,
  ) => Promise<MembershipFormState>;
  kind: "student" | "teacher";
  options: DirectoryOption[];
};

const initialState: MembershipFormState = {
  status: "idle",
  message: "",
  fieldErrors: {},
};

function SubmitButton({
  disabled,
  kind,
}: {
  disabled: boolean;
  kind: "student" | "teacher";
}) {
  const { pending } = useFormStatus();
  const idleLabel = kind === "student" ? "Enrol student" : "Assign teacher";
  const pendingLabel =
    kind === "student" ? "Enrolling student…" : "Assigning teacher…";

  return (
    <button className="auth-submit" disabled={disabled || pending} type="submit">
      {pending ? pendingLabel : idleLabel}
    </button>
  );
}

export function MembershipForm({
  action,
  kind,
  options,
}: MembershipFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState(action, initialState);
  const isStudent = kind === "student";
  const fieldId = `${kind}-profile-id`;
  const errorId = `${kind}-profile-error`;

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state.status]);

  return (
    <form action={formAction} className="admin-form" ref={formRef}>
      <div className="field-group">
        <label htmlFor={fieldId}>
          {isStudent ? "Student account" : "Teacher account"}
        </label>
        <select
          aria-describedby={state.fieldErrors.profileId ? errorId : undefined}
          aria-invalid={Boolean(state.fieldErrors.profileId)}
          defaultValue=""
          disabled={options.length === 0}
          id={fieldId}
          name="profileId"
          required
        >
          <option disabled value="">
            {options.length === 0
              ? isStudent
                ? "No un-enrolled students available"
                : "No unassigned teachers available"
              : isStudent
                ? "Select a student"
                : "Select a teacher"}
          </option>
          {options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
        {state.fieldErrors.profileId ? (
          <p className="field-error" id={errorId}>
            {state.fieldErrors.profileId}
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

      <SubmitButton disabled={options.length === 0} kind={kind} />
    </form>
  );
}
