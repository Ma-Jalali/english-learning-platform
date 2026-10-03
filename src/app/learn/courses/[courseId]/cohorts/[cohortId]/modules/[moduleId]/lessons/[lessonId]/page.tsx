import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  COURSE_MEDIA_BUCKET,
  COURSE_MEDIA_SIGNED_URL_TTL_SECONDS,
  formatCourseMediaSize,
  getCourseMediaDescriptor,
  isExpectedCourseMediaStoragePath,
  parseCourseMediaContent,
} from "@/lib/course-media";
import {
  buildGoogleDriveOpenUrl,
  buildGoogleDrivePreviewUrl,
  getGoogleDriveBlockType,
  parseGoogleDriveContent,
} from "@/lib/google-drive";
import {
  getStudentLessonContext,
  throwLearningQueryError,
} from "@/lib/learning";

export const metadata: Metadata = {
  title: "Lesson",
};

type LessonLearningPageProps = {
  params: Promise<{
    courseId: string;
    cohortId: string;
    moduleId: string;
    lessonId: string;
  }>;
};

function getTextBody(content: unknown) {
  if (
    typeof content === "object" &&
    content !== null &&
    !Array.isArray(content) &&
    "body" in content &&
    typeof content.body === "string"
  ) {
    return content.body;
  }

  return null;
}

export default async function LessonLearningPage({
  params,
}: LessonLearningPageProps) {
  const { courseId, cohortId, moduleId, lessonId } = await params;
  const context = await getStudentLessonContext(
    courseId,
    cohortId,
    moduleId,
    lessonId,
  );

  if (!context) {
    notFound();
  }

  const { data: lessonBlocks, error: blocksError } = await context.supabase
    .from("lesson_blocks")
    .select("id, block_type, title, content, sort_order, is_locked, created_at")
    .eq("lesson_id", context.lesson.id)
    .eq("is_locked", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (blocksError) {
    throwLearningQueryError("lesson block query", blocksError);
  }

  const blockViews = await Promise.all(
    (lessonBlocks ?? []).map(async (block, index) => {
      const position = index + 1;

      if (block.block_type === "text") {
        const body = getTextBody(block.content);

        return body
          ? {
              kind: "text" as const,
              block: {
                body,
                id: block.id,
                position,
                title: block.title,
              },
            }
          : {
              kind: "unavailable" as const,
              block: { id: block.id, position },
            };
      }

      const driveContent = parseGoogleDriveContent(block.content);
      const drivePreviewUrl = driveContent
        ? buildGoogleDrivePreviewUrl(driveContent.fileId)
        : null;
      const driveOpenUrl = driveContent
        ? buildGoogleDriveOpenUrl(driveContent.fileId)
        : null;

      if (
        driveContent &&
        drivePreviewUrl &&
        driveOpenUrl &&
        typeof block.title === "string" &&
        block.title.trim() !== "" &&
        getGoogleDriveBlockType(driveContent.resourceType) === block.block_type
      ) {
        return {
          kind: "drive" as const,
          block: {
            id: block.id,
            openUrl: driveOpenUrl,
            position,
            previewUrl: drivePreviewUrl,
            resourceType: driveContent.resourceType,
            title: block.title,
          },
        };
      }

      const mediaContent = parseCourseMediaContent(block.content);
      const descriptor = mediaContent
        ? getCourseMediaDescriptor(mediaContent.mimeType)
        : null;

      if (
        !mediaContent ||
        !descriptor ||
        descriptor.blockType !== block.block_type ||
        !isExpectedCourseMediaStoragePath(
          mediaContent.storagePath,
          context.course.organisation_id,
          context.course.id,
          mediaContent.mimeType,
        )
      ) {
        return {
          kind: "unavailable" as const,
          block: { id: block.id, position },
        };
      }

      // The private URL is minted only after verified student identity,
      // enrolment, publication, and full course hierarchy checks. Storage RLS
      // independently rechecks course access for this exact object path.
      const { data: signedUrlData, error: signedUrlError } =
        await context.supabase.storage
          .from(COURSE_MEDIA_BUCKET)
          .createSignedUrl(
            mediaContent.storagePath,
            COURSE_MEDIA_SIGNED_URL_TTL_SECONDS,
          );

      if (signedUrlError) {
        console.error("Unexpected student media signed URL failure", {
          code: signedUrlError.name,
          message: signedUrlError.message,
        });
      }

      return {
        kind: "media" as const,
        block: {
          blockType: descriptor.blockType,
          fileName: mediaContent.fileName,
          id: block.id,
          mimeType: mediaContent.mimeType,
          position,
          signedUrl: signedUrlError ? null : signedUrlData.signedUrl,
          sizeBytes: mediaContent.sizeBytes,
          title: block.title,
        },
      };
    }),
  );

  const courseHref = `/learn/courses/${context.course.id}/cohorts/${context.cohort.id}`;
  const moduleHref = `${courseHref}/modules/${context.courseModule.id}`;

  return (
    <>
      <nav aria-label="Learning breadcrumb" className="learning-breadcrumbs">
        <Link href="/learn">My courses</Link>
        <span aria-hidden="true">/</span>
        <Link href={courseHref}>{context.course.title}</Link>
        <span aria-hidden="true">/</span>
        <Link href={moduleHref}>{context.courseModule.title}</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{context.lesson.title}</span>
      </nav>

      <article className="learning-lesson" aria-labelledby="lesson-heading">
        <header className="learning-lesson-header">
          <p className="eyebrow">Core lesson</p>
          <h1 id="lesson-heading">{context.lesson.title}</h1>
          <p>
            {context.lesson.description ||
              "Work through the learning materials below in order."}
          </p>
          <div className="learning-lesson-meta">
            <span>{context.courseModule.title}</span>
            <span>{context.cohort.name}</span>
            <span>Read-only lesson</span>
          </div>
        </header>

        <section className="learning-content" aria-labelledby="content-heading">
          <div className="learning-section-heading learning-content-heading">
            <div>
              <p className="eyebrow">Lesson materials</p>
              <h2 id="content-heading">Content</h2>
            </div>
            <p>{blockViews.length} ordered {blockViews.length === 1 ? "block" : "blocks"}</p>
          </div>

          {blockViews.length > 0 ? (
            <ol className="learning-block-list">
              {blockViews.map((view) => {
                if (view.kind === "text") {
                  return (
                    <li className="learning-block learning-text-block" key={view.block.id}>
                      <span className="learning-block-position">
                        {String(view.block.position).padStart(2, "0")}
                      </span>
                      {view.block.title ? <h3>{view.block.title}</h3> : null}
                      <div className="learning-text-body">{view.block.body}</div>
                    </li>
                  );
                }

                if (view.kind === "drive") {
                  return (
                    <li className="learning-block learning-media-block" key={view.block.id}>
                      <span className="learning-block-position">
                        {String(view.block.position).padStart(2, "0")}
                      </span>
                      <div className="learning-media-heading">
                        <div>
                          <span className="learning-media-kind">
                            Drive {view.block.resourceType === "pdf" ? "PDF" : "video"}
                          </span>
                          <h3>{view.block.title}</h3>
                        </div>
                        <span>Externally hosted</span>
                      </div>
                      <div className="learning-preview-shell">
                        <iframe
                          allow="autoplay; fullscreen"
                          className="learning-drive-preview"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          src={view.block.previewUrl}
                          title={`Google Drive preview: ${view.block.title}`}
                        />
                        <a
                          className="learning-open-link"
                          href={view.block.openUrl}
                          rel="noreferrer"
                          target="_blank"
                        >
                          Open in Google Drive
                        </a>
                      </div>
                    </li>
                  );
                }

                if (view.kind === "media") {
                  const mediaTitle = view.block.title || view.block.fileName;

                  return (
                    <li className="learning-block learning-media-block" key={view.block.id}>
                      <span className="learning-block-position">
                        {String(view.block.position).padStart(2, "0")}
                      </span>
                      <div className="learning-media-heading">
                        <div>
                          <span className="learning-media-kind">
                            {view.block.blockType === "file" ? "PDF" : "Video"}
                          </span>
                          <h3>{mediaTitle}</h3>
                        </div>
                        <span>{formatCourseMediaSize(view.block.sizeBytes)}</span>
                      </div>
                      {view.block.signedUrl ? (
                        view.block.blockType === "file" ? (
                          <div className="learning-preview-shell">
                            <iframe
                              className="learning-pdf-preview"
                              loading="lazy"
                              referrerPolicy="no-referrer"
                              src={view.block.signedUrl}
                              title={`PDF preview: ${view.block.fileName}`}
                            />
                            <a
                              className="learning-open-link"
                              href={view.block.signedUrl}
                              rel="noreferrer"
                              target="_blank"
                            >
                              Open PDF in a new tab
                            </a>
                          </div>
                        ) : (
                          <video
                            className="learning-video-preview"
                            controls
                            playsInline
                            preload="metadata"
                          >
                            <source
                              src={view.block.signedUrl}
                              type={view.block.mimeType}
                            />
                            Your browser does not support this video format.
                          </video>
                        )
                      ) : (
                        <p className="learning-inline-unavailable" role="status">
                          A secure preview could not be created. Refresh the page
                          to request a new short-lived link.
                        </p>
                      )}
                    </li>
                  );
                }

                return (
                  <li className="learning-block learning-unavailable-block" key={view.block.id}>
                    <span className="learning-block-position">
                      {String(view.block.position).padStart(2, "0")}
                    </span>
                    <h3>Content unavailable</h3>
                    <p>
                      This block is not in a supported learner-safe format yet.
                    </p>
                  </li>
                );
              })}
            </ol>
          ) : (
            <div className="learning-empty-state">
              <span aria-hidden="true">00</span>
              <div>
                <h3>This lesson has no available content yet.</h3>
                <p>
                  The lesson is part of your course, but its materials are still
                  being prepared.
                </p>
              </div>
            </div>
          )}
        </section>
      </article>
    </>
  );
}
