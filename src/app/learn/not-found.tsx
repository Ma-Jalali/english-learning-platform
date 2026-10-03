import Link from "next/link";

export default function LearningNotFound() {
  return (
    <section className="learning-state" aria-labelledby="learning-not-found">
      <span className="learning-state-icon" aria-hidden="true">
        ?
      </span>
      <p className="eyebrow">Content unavailable</p>
      <h1 id="learning-not-found">This learning page is not available.</h1>
      <p>
        It may not belong to your cohort, or the course may not be published.
        Your enrolment and the complete course hierarchy are checked on every
        page.
      </p>
      <Link className="button-link" href="/learn">
        Return to my courses
      </Link>
    </section>
  );
}
