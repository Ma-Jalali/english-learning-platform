"use client";

import { FormEvent, useActionState } from "react";
import { useFormStatus } from "react-dom";

import {
  deleteLockedMediaBlock,
  type DeleteMediaBlockState,
  type MoveCoreBlockState,
  moveLockedCoreBlock,
} from "@/app/admin/actions";
import {
  formatCourseMediaSize,
  type CourseMediaBlockType,
} from "@/lib/course-media";

import { BlockMoveButtons } from "./block-move-buttons";

type MediaBlockItemProps = {
  block: {
    blockType: CourseMediaBlockType;
    fileName: string;
    id: string;
    mimeType: string;
    position: number;
    signedUrl: string | null;
    sizeBytes: number;
  };
  canMoveDown: boolean;
  canMoveUp: boolean;
  courseId: string;
  lessonId: string;
  moduleId: string;
};

const initialDeleteState: DeleteMediaBlockState = {
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
      {pending ? "Deleting file and block…" : "Delete media"}
    </button>
  );
}

export function MediaBlockItem({
  block,
  canMoveDown,
  canMoveUp,
  courseId,
  lessonId,
  moduleId,
}: MediaBlockItemProps) {
  const blockLabel =
    block.blockType === "file" ? `PDF ${block.fileName}` : `video ${block.fileName}`;
  const deleteBlock = deleteLockedMediaBlock.bind(
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
  const [moveState, moveAction] = useActionState(
    moveBlock,
    initialMoveState,
  );

  function confirmDelete(event: FormEvent<HTMLFormElement>) {
    const confirmed = window.confirm(
      `Delete “${block.fileName}”? This permanently removes both the locked core block and its private Storage file.`,
    );

    if (!confirmed) {
      event.preventDefault();
    }
  }

  return (
    <li className="media-block-item">
      <span className="block-position">Block {block.position}</span>
      <div className="text-block-heading">
        <div className="media-block-title">
          <span className={`media-kind-badge media-kind-${block.blockType}`}>
            {block.blockType === "file" ? "PDF" : "Video"}
          </span>
          <h4>{block.fileName}</h4>
        </div>
        <span className="locked-block-badge">Locked core block</span>
      </div>

      <p className="media-block-meta">
        {formatCourseMediaSize(block.sizeBytes)} · {block.mimeType}
      </p>

      {block.signedUrl ? (
        block.blockType === "file" ? (
          <div className="pdf-preview-shell">
            <iframe
              className="pdf-preview"
              loading="lazy"
              referrerPolicy="no-referrer"
              src={block.signedUrl}
              title={`PDF preview: ${block.fileName}`}
            />
            <a
              className="media-open-link"
              href={block.signedUrl}
              rel="noreferrer"
              target="_blank"
            >
              Open PDF in a new tab
            </a>
          </div>
        ) : (
          <video
            className="video-preview"
            controls
            playsInline
            preload="metadata"
          >
            <source src={block.signedUrl} type={block.mimeType} />
            Your browser does not support this video format.
          </video>
        )
      ) : (
        <p className="form-message form-message-error" role="alert">
          A secure preview could not be created. Refresh the page to try again.
        </p>
      )}

      <div className="text-block-actions">
        <form action={moveAction} className="block-move-controls">
          <BlockMoveButtons
            blockName={blockLabel}
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
