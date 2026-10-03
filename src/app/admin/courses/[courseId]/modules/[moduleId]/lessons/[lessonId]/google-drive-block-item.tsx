"use client";

import { FormEvent, useActionState } from "react";
import { useFormStatus } from "react-dom";

import {
  deleteLockedGoogleDriveBlock,
  type DeleteGoogleDriveBlockState,
  type MoveCoreBlockState,
  moveLockedCoreBlock,
} from "@/app/admin/actions";
import type { GoogleDriveResourceType } from "@/lib/google-drive";

import { BlockMoveButtons } from "./block-move-buttons";

type GoogleDriveBlockItemProps = {
  block: {
    id: string;
    openUrl: string;
    position: number;
    previewUrl: string;
    resourceType: GoogleDriveResourceType;
    title: string;
  };
  canMoveDown: boolean;
  canMoveUp: boolean;
  courseId: string;
  lessonId: string;
  moduleId: string;
};

const initialDeleteState: DeleteGoogleDriveBlockState = {
  status: "idle",
  message: "",
};

const initialMoveState: MoveCoreBlockState = {
  status: "idle",
  message: "",
};

function DeleteButton() {
  const { pending } = useFormStatus();

  return (
    <button className="danger-button" disabled={pending} type="submit">
      {pending ? "Deleting block…" : "Delete Drive block"}
    </button>
  );
}

export function GoogleDriveBlockItem({
  block,
  canMoveDown,
  canMoveUp,
  courseId,
  lessonId,
  moduleId,
}: GoogleDriveBlockItemProps) {
  const deleteBlock = deleteLockedGoogleDriveBlock.bind(
    null,
    courseId,
    moduleId,
    lessonId,
    block.id,
  );
  const moveBlock = moveLockedCoreBlock.bind(
    null,
    courseId,
    moduleId,
    lessonId,
    block.id,
  );
  const [deleteState, deleteAction] = useActionState(
    deleteBlock,
    initialDeleteState,
  );
  const [moveState, moveAction] = useActionState(moveBlock, initialMoveState);

  function confirmDelete(event: FormEvent<HTMLFormElement>) {
    const confirmed = window.confirm(
      `Delete the Drive block “${block.title}”? The original Google Drive file will not be deleted.`,
    );

    if (!confirmed) {
      event.preventDefault();
    }
  }

  return (
    <li className="media-block-item drive-block-item">
      <span className="block-position">Block {block.position}</span>
      <div className="text-block-heading">
        <div className="media-block-title">
          <span className="media-kind-badge media-kind-drive">
            Drive {block.resourceType === "pdf" ? "PDF" : "Video"}
          </span>
          <h4>{block.title}</h4>
        </div>
        <span className="locked-block-badge">Locked core block</span>
      </div>

      <p className="media-block-meta">
        Google Drive · externally hosted {block.resourceType}
      </p>

      <div className="drive-preview-shell">
        <iframe
          allow="autoplay; fullscreen"
          className="drive-preview"
          loading="lazy"
          referrerPolicy="no-referrer"
          src={block.previewUrl}
          title={`Google Drive preview: ${block.title}`}
        />
        <a
          className="media-open-link"
          href={block.openUrl}
          rel="noreferrer"
          target="_blank"
        >
          Open in Google Drive
        </a>
      </div>

      <div className="text-block-actions">
        <form action={moveAction} className="block-move-controls">
          <BlockMoveButtons
            blockName={block.title}
            canMoveDown={canMoveDown}
            canMoveUp={canMoveUp}
          />
        </form>
        <form action={deleteAction} onSubmit={confirmDelete}>
          <DeleteButton />
        </form>
      </div>

      {deleteState.message ? (
        <p className="form-message form-message-error" role="alert">
          {deleteState.message}
        </p>
      ) : null}

      {moveState.message ? (
        <p
          className={`form-message ${
            moveState.status === "success"
              ? "form-message-success"
              : "form-message-error"
          }`}
          role={moveState.status === "success" ? "status" : "alert"}
        >
          {moveState.message}
        </p>
      ) : null}
    </li>
  );
}
