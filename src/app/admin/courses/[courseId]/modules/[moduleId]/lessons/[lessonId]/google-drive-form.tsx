"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";

import {
  createLockedGoogleDriveBlock,
  type GoogleDriveBlockFormState,
} from "@/app/admin/actions";

type GoogleDriveFormProps = {
  courseId: string;
  lessonId: string;
  moduleId: string;
};

const initialState: GoogleDriveBlockFormState = {
  status: "idle",
  message: "",
  fieldErrors: {},
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button className="auth-submit" disabled={pending} type="submit">
      {pending ? "Adding Drive block…" : "Add from Google Drive"}
    </button>
  );
}

export function GoogleDriveForm({
  courseId,
  lessonId,
  moduleId,
}: GoogleDriveFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const createDriveBlock = createLockedGoogleDriveBlock.bind(
    null,
    courseId,
    moduleId,
    lessonId,
  );
  const [state, formAction] = useActionState(createDriveBlock, initialState);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state.status]);

  return (
    <form action={formAction} className="admin-form" ref={formRef}>
      <div className="field-group">
        <label htmlFor="drive-block-title">Display title</label>
        <input
          aria-describedby={
            state.fieldErrors.title ? "drive-block-title-error" : undefined
          }
          aria-invalid={Boolean(state.fieldErrors.title)}
          id="drive-block-title"
          maxLength={160}
          name="title"
          required
          type="text"
        />
        {state.fieldErrors.title ? (
          <p className="field-error" id="drive-block-title-error">
            {state.fieldErrors.title}
          </p>
        ) : null}
      </div>

      <div className="field-group">
        <label htmlFor="drive-share-link">Google Drive share link</label>
        <input
          aria-describedby={
            state.fieldErrors.shareLink
              ? "drive-share-link-error"
              : "drive-share-link-hint"
          }
          aria-invalid={Boolean(state.fieldErrors.shareLink)}
          id="drive-share-link"
          maxLength={2048}
          name="shareLink"
          placeholder="https://drive.google.com/file/d/…/view"
          required
          type="url"
        />
        <p className="field-hint" id="drive-share-link-hint">
          Paste a Drive file link. Embed code and links from other domains are
          rejected.
        </p>
        {state.fieldErrors.shareLink ? (
          <p className="field-error" id="drive-share-link-error">
            {state.fieldErrors.shareLink}
          </p>
        ) : null}
      </div>

      <div className="field-group">
        <label htmlFor="drive-resource-type">Resource type</label>
        <select
          aria-describedby={
            state.fieldErrors.resourceType
              ? "drive-resource-type-error"
              : undefined
          }
          aria-invalid={Boolean(state.fieldErrors.resourceType)}
          defaultValue=""
          id="drive-resource-type"
          name="resourceType"
          required
        >
          <option disabled value="">
            Select a resource type
          </option>
          <option value="pdf">PDF</option>
          <option value="video">Video</option>
        </select>
        {state.fieldErrors.resourceType ? (
          <p className="field-error" id="drive-resource-type-error">
            {state.fieldErrors.resourceType}
          </p>
        ) : null}
      </div>

      <div className="drive-sharing-warning" role="note">
        <strong>Check Drive sharing before publishing</strong>
        <p>
          The file must be shared with every intended viewer. “Anyone with the
          link” is unsuitable for confidential or strongly protected paid
          material because the link can be forwarded.
        </p>
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
