"use client";

import { ChangeEvent, FormEvent, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { createLockedMediaBlock } from "@/app/admin/actions";
import {
  buildCourseMediaStoragePath,
  COURSE_MEDIA_BUCKET,
  COURSE_MEDIA_INPUT_ACCEPT,
  COURSE_MEDIA_MAX_SIZE_BYTES,
  createCourseMediaStorageFileName,
  formatCourseMediaSize,
  getCourseMediaDescriptor,
  sanitizeCourseMediaDisplayName,
} from "@/lib/course-media";
import { createClient } from "@/lib/supabase/client";

type MediaUploadFormProps = {
  courseId: string;
  lessonId: string;
  moduleId: string;
  organisationId: string;
};

type UploadState = {
  status: "idle" | "uploading" | "creating" | "error" | "success";
  message: string;
};

const initialState: UploadState = {
  status: "idle",
  message: "",
};

function validateSelectedFile(file: File) {
  const descriptor = getCourseMediaDescriptor(file.type);

  if (!descriptor) {
    return "Choose a PDF, MP4, WebM, MOV, or M4V file.";
  }

  if (!file.name.toLowerCase().endsWith(`.${descriptor.extension}`)) {
    return "The file extension does not match its reported file type.";
  }

  if (file.size <= 0) {
    return "Choose a file that is not empty.";
  }

  if (file.size > COURSE_MEDIA_MAX_SIZE_BYTES) {
    return "Choose a file no larger than 200 MiB.";
  }

  return null;
}

export function MediaUploadForm({
  courseId,
  lessonId,
  moduleId,
  organisationId,
}: MediaUploadFormProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [state, setState] = useState<UploadState>(initialState);
  const isBusy = state.status === "uploading" || state.status === "creating";

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setSelectedFile(file);

    if (!file) {
      setState(initialState);
      return;
    }

    const validationMessage = validateSelectedFile(file);
    setState(
      validationMessage
        ? { status: "error", message: validationMessage }
        : { status: "idle", message: "" },
    );
  }

  async function removeUploadedObject(storagePath: string) {
    const { error } = await supabase.storage
      .from(COURSE_MEDIA_BUCKET)
      .remove([storagePath]);

    return !error;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedFile || isBusy) {
      setState({
        status: "error",
        message: "Choose a PDF or supported video file first.",
      });
      return;
    }

    const validationMessage = validateSelectedFile(selectedFile);
    const descriptor = getCourseMediaDescriptor(selectedFile.type);

    if (validationMessage || !descriptor) {
      setState({
        status: "error",
        message: validationMessage ?? "Choose a supported media file.",
      });
      return;
    }

    const storageFileName = createCourseMediaStorageFileName(
      selectedFile.type,
      crypto.randomUUID(),
    );
    const displayFileName = sanitizeCourseMediaDisplayName(
      selectedFile.name,
      selectedFile.type,
    );

    if (!storageFileName || !displayFileName) {
      setState({
        status: "error",
        message: "A safe file name could not be generated. Choose the file again.",
      });
      return;
    }

    const storagePath = buildCourseMediaStoragePath(
      organisationId,
      courseId,
      storageFileName,
    );

    setState({
      status: "uploading",
      message: `Uploading ${displayFileName} directly to secure Storage…`,
    });

    const { error: uploadError } = await supabase.storage
      .from(COURSE_MEDIA_BUCKET)
      .upload(storagePath, selectedFile, {
        cacheControl: "3600",
        contentType: selectedFile.type,
        upsert: false,
      });

    if (uploadError) {
      setState({
        status: "error",
        message:
          "The file could not be uploaded. Check your connection and try again.",
      });
      return;
    }

    setState({
      status: "creating",
      message: "Upload complete. Creating the locked lesson block…",
    });

    try {
      const result = await createLockedMediaBlock(
        courseId,
        moduleId,
        lessonId,
        {
          storagePath,
          fileName: displayFileName,
          mimeType: selectedFile.type,
          sizeBytes: selectedFile.size,
        },
      );

      if (result.status !== "success") {
        const cleanupSucceeded = await removeUploadedObject(storagePath);
        setState({
          status: "error",
          message: cleanupSucceeded
            ? `${result.message} The uploaded file was removed safely.`
            : `${result.message} Automatic cleanup failed; remove the orphaned file from Storage before retrying.`,
        });
        return;
      }

      setSelectedFile(null);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
      setState({ status: "success", message: result.message });
      router.refresh();
    } catch {
      const cleanupSucceeded = await removeUploadedObject(storagePath);
      setState({
        status: "error",
        message: cleanupSucceeded
          ? "The block could not be created. The uploaded file was removed safely; please try again."
          : "The block could not be created and automatic cleanup failed. Remove the orphaned file from Storage before retrying.",
      });
    }
  }

  return (
    <form className="media-upload-form" onSubmit={handleSubmit}>
      <label className="media-upload-dropzone" htmlFor="lesson-media-file">
        <span aria-hidden="true" className="media-upload-icon">
          ↑
        </span>
        <span className="media-upload-copy">
          <strong>Choose a PDF or video</strong>
          <span>PDF, MP4, WebM, MOV or M4V · up to 200 MiB</span>
        </span>
        <input
          accept={`${COURSE_MEDIA_INPUT_ACCEPT},.pdf,.mp4,.webm,.mov,.m4v`}
          className="media-file-input"
          disabled={isBusy}
          id="lesson-media-file"
          onChange={handleFileChange}
          ref={inputRef}
          type="file"
        />
      </label>

      {selectedFile ? (
        <div className="media-selected-file">
          <span>
            <strong>{selectedFile.name}</strong>
            <small>{formatCourseMediaSize(selectedFile.size)}</small>
          </span>
          <span className="media-selected-type">
            {getCourseMediaDescriptor(selectedFile.type)?.label ?? "Unsupported"}
          </span>
        </div>
      ) : null}

      {state.message ? (
        <p
          className={`form-message ${
            state.status === "success"
              ? "form-message-success"
              : state.status === "error"
                ? "form-message-error"
                : "form-message-progress"
          }`}
          role={state.status === "error" ? "alert" : "status"}
        >
          {state.message}
        </p>
      ) : null}

      <button className="auth-submit" disabled={!selectedFile || isBusy} type="submit">
        {state.status === "uploading"
          ? "Uploading securely…"
          : state.status === "creating"
            ? "Creating media block…"
            : "Upload and add media"}
      </button>
    </form>
  );
}
