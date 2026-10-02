"use client";

import { FormEvent, useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

import {
  deleteLockedTextBlock,
  type DeleteTextBlockState,
  type TextBlockFormState,
  updateLockedTextBlock,
} from "@/app/admin/actions";

type TextBlockItemProps = {
  block: {
    body: string;
    id: string;
    position: number;
    title: string | null;
  };
  courseId: string;
  lessonId: string;
  moduleId: string;
};

const initialUpdateState: TextBlockFormState = {
  status: "idle",
  message: "",
  fieldErrors: {},
};

const initialDeleteState: DeleteTextBlockState = {
  status: "idle",
  message: "",
};

function UpdateButton() {
  const { pending } = useFormStatus();

  return (
    <button disabled={pending} type="submit">
      {pending ? "Saving…" : "Save changes"}
    </button>
  );
}

function DeleteButton() {
  const { pending } = useFormStatus();

  return (
    <button className="danger-button" disabled={pending} type="submit">
      {pending ? "Deleting…" : "Delete"}
    </button>
  );
}

export function TextBlockItem({
  block,
  courseId,
  lessonId,
  moduleId,
}: TextBlockItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const updateBlock = updateLockedTextBlock.bind(
    null,
    courseId,
    moduleId,
    lessonId,
    block.id,
  );
  const deleteBlock = deleteLockedTextBlock.bind(
    null,
    courseId,
    moduleId,
    lessonId,
    block.id,
  );
  const [updateState, updateAction] = useActionState(
    updateBlock,
    initialUpdateState,
  );
  const [deleteState, deleteAction] = useActionState(
    deleteBlock,
    initialDeleteState,
  );

  function confirmDelete(event: FormEvent<HTMLFormElement>) {
    const blockName = block.title || `Block ${block.position}`;
    const confirmed = window.confirm(
      `Delete “${blockName}”? This permanently removes the locked core block and cannot be undone.`,
    );

    if (!confirmed) {
      event.preventDefault();
    }
  }

  return (
    <li>
      <span className="block-position">Block {block.position}</span>
      <div className="text-block-heading">
        {block.title ? <h4>{block.title}</h4> : <span />}
        <span className="locked-block-badge">Locked core block</span>
      </div>
      <p className="text-block-body">{block.body}</p>

      <div className="text-block-actions">
        <button
          aria-controls={`edit-block-${block.id}`}
          aria-expanded={isEditing}
          className="secondary"
          onClick={() => setIsEditing((current) => !current)}
          type="button"
        >
          {isEditing ? "Cancel editing" : "Edit"}
        </button>
        <form action={deleteAction} onSubmit={confirmDelete}>
          <DeleteButton />
        </form>
      </div>

      {isEditing ? (
        <form
          action={updateAction}
          className="admin-form text-block-edit-form"
          id={`edit-block-${block.id}`}
        >
          <div className="field-group">
            <label htmlFor={`edit-block-title-${block.id}`}>
              Block title <span className="optional-label">Optional</span>
            </label>
            <input
              aria-describedby={
                updateState.fieldErrors.title
                  ? `edit-block-title-error-${block.id}`
                  : undefined
              }
              aria-invalid={Boolean(updateState.fieldErrors.title)}
              defaultValue={block.title ?? ""}
              id={`edit-block-title-${block.id}`}
              maxLength={160}
              name="title"
              type="text"
            />
            {updateState.fieldErrors.title ? (
              <p
                className="field-error"
                id={`edit-block-title-error-${block.id}`}
              >
                {updateState.fieldErrors.title}
              </p>
            ) : null}
          </div>

          <div className="field-group">
            <label htmlFor={`edit-block-body-${block.id}`}>Text content</label>
            <textarea
              aria-describedby={
                updateState.fieldErrors.body
                  ? `edit-block-body-error-${block.id}`
                  : undefined
              }
              aria-invalid={Boolean(updateState.fieldErrors.body)}
              defaultValue={block.body}
              id={`edit-block-body-${block.id}`}
              maxLength={20000}
              name="body"
              required
              rows={10}
            />
            {updateState.fieldErrors.body ? (
              <p
                className="field-error"
                id={`edit-block-body-error-${block.id}`}
              >
                {updateState.fieldErrors.body}
              </p>
            ) : null}
          </div>

          <UpdateButton />
        </form>
      ) : null}

      {updateState.message ? (
        <p
          className={`form-message ${
            updateState.status === "success"
              ? "form-message-success"
              : "form-message-error"
          }`}
          role={updateState.status === "success" ? "status" : "alert"}
        >
          {updateState.message}
        </p>
      ) : null}

      {deleteState.message ? (
        <p className="form-message form-message-error" role="alert">
          {deleteState.message}
        </p>
      ) : null}
    </li>
  );
}
