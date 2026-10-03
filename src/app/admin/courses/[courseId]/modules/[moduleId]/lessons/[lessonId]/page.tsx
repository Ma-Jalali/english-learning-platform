import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { SignOutButton } from "@/app/dashboard/sign-out-button";
import {
  COURSE_MEDIA_BUCKET,
  COURSE_MEDIA_SIGNED_URL_TTL_SECONDS,
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
import { createClient } from "@/lib/supabase/server";

import { BlockForm } from "./block-form";
import { GoogleDriveBlockItem } from "./google-drive-block-item";
import { GoogleDriveForm } from "./google-drive-form";
import { MediaBlockItem } from "./media-block-item";
import { MediaUploadForm } from "./media-upload-form";
import { TextBlockItem } from "./text-block-item";

export const metadata: Metadata = {
  title: "Lesson editor | English Learning Platform",
};

type LessonEditorPageProps = {
  params: Promise<{ courseId: string; moduleId: string; lessonId: string }>;
  searchParams: Promise<{ notice?: string }>;
};

function getTextBody(content: unknown) {
  if (
    typeof content === "object" &&
    content !== null &&
    "body" in content &&
    typeof content.body === "string"
  ) {
    return content.body;
  }

  return "Text unavailable.";
}

export default async function LessonEditorPage({
  params,
  searchParams,
}: LessonEditorPageProps) {
  const [{ courseId, moduleId, lessonId }, { notice }] = await Promise.all([
    params,
    searchParams,
  ]);
  const supabase = await createClient();
  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;

  if (claimsError || !userId) {
    redirect("/auth/login");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();

  if (profileError || profile?.role !== "admin") {
    redirect("/dashboard");
  }

  const { data: course, error: courseError } = await supabase
    .from("courses")
    .select("id, organisation_id, title, course_family, level")
    .eq("id", courseId)
    .maybeSingle();

  if (courseError || !course) {
    notFound();
  }

  const { data: courseModule, error: moduleError } = await supabase
    .from("modules")
    .select("id, title")
    .eq("id", moduleId)
    .eq("course_id", course.id)
    .maybeSingle();

  if (moduleError || !courseModule) {
    notFound();
  }

  const { data: lesson, error: lessonError } = await supabase
    .from("lessons")
    .select("id, title, slug, description, is_locked")
    .eq("id", lessonId)
    .eq("module_id", courseModule.id)
    .maybeSingle();

  if (lessonError || !lesson) {
    notFound();
  }

  const { data: lessonBlocks, error: blocksError } = await supabase
    .from("lesson_blocks")
    .select(
      "id, block_type, title, content, sort_order, is_locked, created_at",
    )
    .eq("lesson_id", lesson.id)
    .eq("is_locked", true)
    .in("block_type", ["text", "file", "video"])
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  const blockViews = await Promise.all(
    (lessonBlocks ?? []).map(async (block, index) => {
      const position = index + 1;

      if (block.block_type === "text") {
        return {
          kind: "text" as const,
          block: {
            body: getTextBody(block.content),
            id: block.id,
            position,
            title: block.title,
          },
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

      const content = parseCourseMediaContent(block.content);
      const descriptor = content
        ? getCourseMediaDescriptor(content.mimeType)
        : null;

      if (
        !content ||
        !descriptor ||
        descriptor.blockType !== block.block_type ||
        !isExpectedCourseMediaStoragePath(
          content.storagePath,
          course.organisation_id,
          course.id,
          content.mimeType,
        )
      ) {
        return {
          kind: "invalid" as const,
          block: {
            id: block.id,
            position,
          },
        };
      }

      // Signed preview URLs are created only after the server-side admin and
      // hierarchy checks above. The private object path is never made public.
      const { data: signedUrlData, error: signedUrlError } =
        await supabase.storage
          .from(COURSE_MEDIA_BUCKET)
          .createSignedUrl(
            content.storagePath,
            COURSE_MEDIA_SIGNED_URL_TTL_SECONDS,
          );

      return {
        kind: "media" as const,
        block: {
          blockType: descriptor.blockType,
          fileName: content.fileName,
          id: block.id,
          mimeType: content.mimeType,
          position,
          signedUrl: signedUrlError ? null : signedUrlData.signedUrl,
          sizeBytes: content.sizeBytes,
        },
      };
    }),
  );

  return (
    <main className="admin-main">
      <div className="admin-shell">
        <header className="admin-header">
          <Link className="auth-brand" href="/">
            English Learning Platform
          </Link>
          <div className="admin-header-actions">
            <Link
              className="button-link secondary-link"
              href={`/admin/courses/${course.id}/modules/${courseModule.id}`}
            >
              Back to module
            </Link>
            <SignOutButton />
          </div>
        </header>

        <section
          className="course-editor-intro"
          aria-labelledby="lesson-editor-heading"
        >
          <p className="eyebrow">Lesson editor</p>
          <h1 id="lesson-editor-heading">{lesson.title}</h1>
          <p>
            Course: <strong>{course.title}</strong> · Module:{" "}
            <strong>{courseModule.title}</strong>
          </p>
          <p>
            Shape the locked core lesson with ordered text, PDF, and video
            blocks. Supabase media stays private and course-authorised; external
            Drive access follows the file owner&apos;s sharing settings.
          </p>
        </section>

        <section
          className="admin-block-section"
          aria-labelledby="blocks-heading"
        >
          <div className="section-heading">
            <div>
              <p className="eyebrow">Lesson content</p>
              <h2 id="blocks-heading">Core blocks</h2>
            </div>
            <p>
              New locked blocks are placed after existing content automatically.
            </p>
          </div>

          {notice === "block-deleted" ? (
            <p className="form-message form-message-success" role="status">
              The locked text block was deleted.
            </p>
          ) : null}

          {notice === "media-deleted" ? (
            <p className="form-message form-message-success" role="status">
              The locked media block and its private file were deleted.
            </p>
          ) : null}

          {notice === "drive-deleted" ? (
            <p className="form-message form-message-success" role="status">
              The locked Drive block was deleted. The original Drive file was
              not changed.
            </p>
          ) : null}

          <div className="admin-block-grid">
            <div className="block-creator-stack">
              <div className="admin-panel">
                <h3>Create locked text block</h3>
                <BlockForm
                  courseId={course.id}
                  lessonId={lesson.id}
                  moduleId={courseModule.id}
                />
              </div>

              <div className="admin-panel media-upload-panel">
                <p className="panel-kicker">Private course media</p>
                <h3>Add media</h3>
                <p className="media-upload-intro">
                  Files upload directly to Supabase Storage. The browser never
                  sends large files through a Next.js action.
                </p>
                <MediaUploadForm
                  courseId={course.id}
                  lessonId={lesson.id}
                  moduleId={courseModule.id}
                  organisationId={course.organisation_id}
                />
              </div>

              <div className="admin-panel drive-source-panel">
                <p className="panel-kicker">Externally hosted media</p>
                <h3>Add from Google Drive</h3>
                <p className="media-upload-intro">
                  Add a validated Drive file reference without Google
                  credentials or API access.
                </p>
                <GoogleDriveForm
                  courseId={course.id}
                  lessonId={lesson.id}
                  moduleId={courseModule.id}
                />
              </div>
            </div>

            <div className="admin-panel" aria-live="polite">
              <h3>Ordered lesson content</h3>
              {blocksError ? (
                <p className="form-message form-message-error" role="alert">
                  Lesson blocks could not be loaded. Please refresh and try again.
                </p>
              ) : blockViews.length > 0 ? (
                <ol className="text-block-list lesson-block-list">
                  {blockViews.map((view, index) => {
                    const canMoveUp = index > 0;
                    const canMoveDown = index < blockViews.length - 1;

                    if (view.kind === "text") {
                      return (
                        <TextBlockItem
                          block={view.block}
                          canMoveDown={canMoveDown}
                          canMoveUp={canMoveUp}
                          courseId={course.id}
                          key={view.block.id}
                          lessonId={lesson.id}
                          moduleId={courseModule.id}
                        />
                      );
                    }

                    if (view.kind === "media") {
                      return (
                        <MediaBlockItem
                          block={view.block}
                          canMoveDown={canMoveDown}
                          canMoveUp={canMoveUp}
                          courseId={course.id}
                          key={view.block.id}
                          lessonId={lesson.id}
                          moduleId={courseModule.id}
                        />
                      );
                    }

                    if (view.kind === "drive") {
                      return (
                        <GoogleDriveBlockItem
                          block={view.block}
                          canMoveDown={canMoveDown}
                          canMoveUp={canMoveUp}
                          courseId={course.id}
                          key={view.block.id}
                          lessonId={lesson.id}
                          moduleId={courseModule.id}
                        />
                      );
                    }

                    return (
                      <li className="media-block-item" key={view.block.id}>
                        <span className="block-position">
                          Block {view.block.position}
                        </span>
                        <div className="text-block-heading">
                          <h4>Media block unavailable</h4>
                          <span className="locked-block-badge">
                            Locked core block
                          </span>
                        </div>
                        <p className="form-message form-message-error" role="alert">
                          This block has invalid media metadata and cannot be
                          previewed. Review the stored record before continuing.
                        </p>
                      </li>
                    );
                  })}
                </ol>
              ) : (
                <p className="admin-empty-state">
                  No lesson blocks yet. Create text, upload private media, or add
                  a validated Google Drive file using the controls provided.
                </p>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
