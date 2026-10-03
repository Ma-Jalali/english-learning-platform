"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function LearningError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Student learning route failed", error);
  }, [error]);

  return (
    <section className="learning-state" aria-labelledby="learning-error">
      <span className="learning-state-icon" aria-hidden="true">
        !
      </span>
      <p className="eyebrow">Temporarily unavailable</p>
      <h1 id="learning-error">Your learning space could not be loaded.</h1>
      <p>
        Your access has not changed. Try loading the page again, or return to
        your course list.
      </p>
      <div className="learning-state-actions">
        <button onClick={reset} type="button">
          Try again
        </button>
        <Link className="button-link secondary-link" href="/learn">
          My courses
        </Link>
      </div>
    </section>
  );
}
