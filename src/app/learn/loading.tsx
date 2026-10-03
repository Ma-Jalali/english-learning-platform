export default function LearningLoading() {
  return (
    <section
      aria-busy="true"
      aria-live="polite"
      className="learning-loading"
    >
      <p className="eyebrow">Loading your learning space</p>
      <div className="learning-loading-title" />
      <div className="learning-loading-copy" />
      <div className="learning-loading-grid">
        <div />
        <div />
      </div>
      <span className="sr-only">Loading course content…</span>
    </section>
  );
}
