export const GOOGLE_DRIVE_SOURCE = "google_drive" as const;

export type GoogleDriveResourceType = "pdf" | "video";

export type GoogleDriveContent = {
  source: typeof GOOGLE_DRIVE_SOURCE;
  fileId: string;
  resourceType: GoogleDriveResourceType;
};

const GOOGLE_DRIVE_HOST = "drive.google.com";
const GOOGLE_DRIVE_FILE_ID_PATTERN = /^[A-Za-z0-9_-]{10,200}$/;
const GOOGLE_DRIVE_FILE_PATH_PATTERN =
  /^\/file\/d\/([A-Za-z0-9_-]{10,200})(?:\/(?:view|preview))?\/?$/;

export function isGoogleDriveResourceType(
  value: string,
): value is GoogleDriveResourceType {
  return value === "pdf" || value === "video";
}

export function getGoogleDriveBlockType(resourceType: GoogleDriveResourceType) {
  return resourceType === "pdf" ? ("file" as const) : ("video" as const);
}

export function isValidGoogleDriveFileId(fileId: string) {
  return GOOGLE_DRIVE_FILE_ID_PATTERN.test(fileId);
}

export function extractGoogleDriveFileId(shareLink: string) {
  let url: URL;

  try {
    url = new URL(shareLink);
  } catch {
    return null;
  }

  if (
    url.protocol !== "https:" ||
    url.hostname.toLowerCase() !== GOOGLE_DRIVE_HOST ||
    url.port !== "" ||
    url.username !== "" ||
    url.password !== ""
  ) {
    return null;
  }

  const filePathMatch = url.pathname.match(GOOGLE_DRIVE_FILE_PATH_PATTERN);

  if (filePathMatch) {
    return filePathMatch[1];
  }

  if (url.pathname === "/open" || url.pathname === "/open/") {
    const fileIds = url.searchParams.getAll("id");

    if (fileIds.length === 1 && isValidGoogleDriveFileId(fileIds[0])) {
      return fileIds[0];
    }
  }

  return null;
}

export function buildGoogleDrivePreviewUrl(fileId: string) {
  return isValidGoogleDriveFileId(fileId)
    ? `https://${GOOGLE_DRIVE_HOST}/file/d/${fileId}/preview`
    : null;
}

export function buildGoogleDriveOpenUrl(fileId: string) {
  return isValidGoogleDriveFileId(fileId)
    ? `https://${GOOGLE_DRIVE_HOST}/file/d/${fileId}/view`
    : null;
}

export function parseGoogleDriveContent(
  value: unknown,
): GoogleDriveContent | null {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return null;
  }

  const content = value as Record<string, unknown>;
  const keys = Object.keys(content).sort();
  const expectedKeys = ["fileId", "resourceType", "source"];

  if (
    keys.length !== expectedKeys.length ||
    keys.some((key, index) => key !== expectedKeys[index]) ||
    content.source !== GOOGLE_DRIVE_SOURCE ||
    typeof content.fileId !== "string" ||
    !isValidGoogleDriveFileId(content.fileId) ||
    typeof content.resourceType !== "string" ||
    !isGoogleDriveResourceType(content.resourceType)
  ) {
    return null;
  }

  return {
    source: GOOGLE_DRIVE_SOURCE,
    fileId: content.fileId,
    resourceType: content.resourceType,
  };
}
