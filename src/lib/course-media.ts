export const COURSE_MEDIA_BUCKET = "course-media";
export const COURSE_MEDIA_MAX_SIZE_BYTES = 209_715_200;
export const COURSE_MEDIA_SIGNED_URL_TTL_SECONDS = 10 * 60;
export const COURSE_MEDIA_SOURCE = "supabase-storage" as const;

export type CourseMediaBlockType = "file" | "video";

export type CourseMediaUploadMetadata = {
  storagePath: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
};

export type CourseMediaContent = CourseMediaUploadMetadata & {
  source: typeof COURSE_MEDIA_SOURCE;
};

type CourseMediaDescriptor = {
  blockType: CourseMediaBlockType;
  extension: "pdf" | "mp4" | "webm" | "mov" | "m4v";
  label: string;
};

const COURSE_MEDIA_DESCRIPTORS: Record<string, CourseMediaDescriptor> = {
  "application/pdf": {
    blockType: "file",
    extension: "pdf",
    label: "PDF",
  },
  "video/mp4": {
    blockType: "video",
    extension: "mp4",
    label: "MP4 video",
  },
  "video/webm": {
    blockType: "video",
    extension: "webm",
    label: "WebM video",
  },
  "video/quicktime": {
    blockType: "video",
    extension: "mov",
    label: "QuickTime video",
  },
  "video/x-m4v": {
    blockType: "video",
    extension: "m4v",
    label: "M4V video",
  },
};

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const SAFE_DISPLAY_FILE_NAME_PATTERN =
  /^[A-Za-z0-9][A-Za-z0-9._-]{0,179}$/;

export const COURSE_MEDIA_INPUT_ACCEPT = Object.keys(
  COURSE_MEDIA_DESCRIPTORS,
).join(",");

export function getCourseMediaDescriptor(mimeType: string) {
  return COURSE_MEDIA_DESCRIPTORS[mimeType.toLowerCase()] ?? null;
}

export function formatCourseMediaSize(sizeBytes: number) {
  if (!Number.isFinite(sizeBytes) || sizeBytes < 0) {
    return "Unknown size";
  }

  if (sizeBytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(sizeBytes / 1024))} KB`;
  }

  return `${(sizeBytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function sanitizeCourseMediaDisplayName(
  originalName: string,
  mimeType: string,
) {
  const descriptor = getCourseMediaDescriptor(mimeType);

  if (!descriptor) {
    return null;
  }

  const originalStem = originalName.replace(/\.[^.]*$/, "");
  const safeStem = originalStem
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Za-z0-9_-]+/g, "-")
    .replace(/^[-_]+|[-_]+$/g, "")
    .slice(0, 120);

  return `${safeStem || "course-media"}.${descriptor.extension}`;
}

export function createCourseMediaStorageFileName(
  mimeType: string,
  uniqueId: string,
) {
  const descriptor = getCourseMediaDescriptor(mimeType);

  if (!descriptor || !UUID_PATTERN.test(uniqueId)) {
    return null;
  }

  return `${uniqueId.toLowerCase()}.${descriptor.extension}`;
}

export function buildCourseMediaStoragePath(
  organisationId: string,
  courseId: string,
  storageFileName: string,
) {
  return `org/${organisationId}/course/${courseId}/${storageFileName}`;
}

export function isExpectedCourseMediaStoragePath(
  storagePath: string,
  organisationId: string,
  courseId: string,
  mimeType: string,
) {
  const descriptor = getCourseMediaDescriptor(mimeType);
  const pathParts = storagePath.split("/");

  if (
    !descriptor ||
    pathParts.length !== 5 ||
    pathParts[0] !== "org" ||
    pathParts[1] !== organisationId ||
    pathParts[2] !== "course" ||
    pathParts[3] !== courseId
  ) {
    return false;
  }

  const storageFileName = pathParts[4];
  return (
    new RegExp(`^${UUID_PATTERN.source.slice(1, -1)}[.]${descriptor.extension}$`, "i").test(
      storageFileName,
    ) &&
    storagePath ===
      buildCourseMediaStoragePath(
        organisationId,
        courseId,
        storageFileName,
      )
  );
}

export function isValidCourseMediaUploadMetadata(
  value: unknown,
  organisationId: string,
  courseId: string,
): value is CourseMediaUploadMetadata {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const metadata = value as Record<string, unknown>;
  const descriptor =
    typeof metadata.mimeType === "string"
      ? getCourseMediaDescriptor(metadata.mimeType)
      : null;

  return Boolean(
    descriptor &&
      typeof metadata.storagePath === "string" &&
      typeof metadata.fileName === "string" &&
      SAFE_DISPLAY_FILE_NAME_PATTERN.test(metadata.fileName) &&
      metadata.fileName.toLowerCase().endsWith(`.${descriptor.extension}`) &&
      typeof metadata.sizeBytes === "number" &&
      Number.isSafeInteger(metadata.sizeBytes) &&
      metadata.sizeBytes > 0 &&
      metadata.sizeBytes <= COURSE_MEDIA_MAX_SIZE_BYTES &&
      isExpectedCourseMediaStoragePath(
        metadata.storagePath,
        organisationId,
        courseId,
        metadata.mimeType as string,
      ),
  );
}

export function parseCourseMediaContent(
  value: unknown,
): CourseMediaContent | null {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return null;
  }

  const content = value as Record<string, unknown>;
  const keys = Object.keys(content).sort();
  const expectedKeys = [
    "fileName",
    "mimeType",
    "sizeBytes",
    "source",
    "storagePath",
  ];

  if (
    keys.length !== expectedKeys.length ||
    keys.some((key, index) => key !== expectedKeys[index]) ||
    content.source !== COURSE_MEDIA_SOURCE ||
    typeof content.storagePath !== "string" ||
    typeof content.fileName !== "string" ||
    !SAFE_DISPLAY_FILE_NAME_PATTERN.test(content.fileName) ||
    typeof content.mimeType !== "string" ||
    !getCourseMediaDescriptor(content.mimeType) ||
    typeof content.sizeBytes !== "number" ||
    !Number.isSafeInteger(content.sizeBytes) ||
    content.sizeBytes <= 0 ||
    content.sizeBytes > COURSE_MEDIA_MAX_SIZE_BYTES
  ) {
    return null;
  }

  return {
    source: COURSE_MEDIA_SOURCE,
    storagePath: content.storagePath,
    fileName: content.fileName,
    mimeType: content.mimeType,
    sizeBytes: content.sizeBytes,
  };
}
