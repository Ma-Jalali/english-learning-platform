/* Illustrative assessment interactions for attempt-results.html only.
   Nothing here creates an attempt, stores answers, runs a timer, submits, scores or releases results. */
(() => {
  const params = new URLSearchParams(location.search);
  const live = document.querySelector("[data-live-region]");
  const announce = (message) => {
    if (!live) return;
    live.textContent = "";
    requestAnimationFrame(() => { live.textContent = message; });
  };

  /* Controls outside the sample explain their limit in the view's visible status line. */
  document.querySelectorAll("[data-preview-limit]").forEach((control) => {
    control.addEventListener("click", () => {
      const view = control.closest("[data-journey-view]");
      const status = view?.querySelector("[data-preview-status]");
      if (status) {
        status.textContent = "";
        requestAnimationFrame(() => { status.textContent = control.dataset.previewLimit; });
      }
      const audioState = control.classList.contains("audio-play") ? view.querySelector("[data-audio-state]") : null;
      if (audioState) audioState.textContent = "Preview: no audio";
    });
  });

  /* Typed or selected responses update the save note honestly. */
  document.querySelectorAll("[data-answer-input]").forEach((input) => {
    input.addEventListener("input", () => {
      const note = input.closest("[data-journey-view]").querySelector("[data-save-note]");
      if (note) note.textContent = input.value.trim() ? "Answer entered. Preview only, not stored." : "Nothing entered yet.";
    });
  });

  /* Mock Test 2: Question 18 → Question 19 → review → submission confirmation. */
  const flow = document.querySelector("[data-assessment-flow]");
  if (flow) {
    const steps = [...flow.querySelectorAll("[data-step]")];
    const context = flow.querySelector("[data-flow-context]");
    const count = flow.querySelector("[data-flow-count]");
    const progress = flow.querySelector("[data-flow-progress]");
    const status = flow.querySelector("[data-preview-status]");
    const saveNote = flow.querySelector("[data-save-note]");
    const mapButtons = [...flow.querySelectorAll(".question-map [data-go]")];
    const answerOf = (name) => flow.querySelector(`input[name="${name}"]:checked`)?.value;

    const show = (target, { focus = true } = {}) => {
      steps.forEach((step) => { step.hidden = step.dataset.step !== target; });
      if (status) status.textContent = "";
      const isReview = target === "review";
      const question = isReview ? null : Number(target);
      if (context) context.textContent = isReview ? "Reading · Review" : "Reading · Passage 2";
      if (count) count.textContent = isReview ? "Review" : `Question ${question} of 40`;
      if (progress && question) {
        progress.setAttribute("aria-valuenow", String(question));
        progress.setAttribute("aria-valuetext", `Question ${question} of 40`);
        progress.firstElementChild.style.width = `${(question / 40) * 100}%`;
      }
      mapButtons.forEach((button) => {
        if (button.dataset.go === target) button.setAttribute("aria-current", "step");
        else button.removeAttribute("aria-current");
      });
      if (isReview) {
        flow.querySelectorAll("[data-review-for]").forEach((row) => {
          const answer = answerOf(row.dataset.reviewFor);
          row.classList.toggle("answered", Boolean(answer));
          row.querySelector("[data-review-state]").textContent = answer ? "Answered" : "Not answered";
        });
      }
      const heading = flow.querySelector(`[data-step="${target}"] [tabindex="-1"]`);
      if (!focus) return;
      heading?.focus();
      announce(isReview ? "Review your answers." : `Question ${question}.`);
    };

    flow.querySelectorAll("[data-go]").forEach((control) => {
      control.addEventListener("click", () => show(control.dataset.go));
    });
    flow.querySelectorAll('input[type="radio"]').forEach((input) => {
      input.addEventListener("change", () => {
        if (saveNote) saveNote.textContent = "Answer selected. Preview only, not stored.";
      });
    });
    show("18", { focus: false });
  }

  document.querySelectorAll("[data-submit-confirm]").forEach((button) => {
    button.addEventListener("click", () => {
      location.href = "attempt-results.html?view=manual&submitted=2";
    });
  });

  /* Waiting view reached from the simulated submission shows Mock Test 2 with a preview banner. */
  if (params.get("view") === "manual" && params.get("submitted") === "2") {
    const view = document.querySelector('[data-journey-view="manual"]');
    view.querySelectorAll("[data-submitted-only]").forEach((element) => { element.hidden = false; });
    view.querySelectorAll("[data-fixture-only]").forEach((element) => { element.hidden = true; });
    view.querySelectorAll("[data-submitted-identity]").forEach((element) => { element.textContent = "IELTS Academic Mock Test 2"; });
    view.querySelectorAll("[data-library-link]").forEach((link) => { link.setAttribute("href", "my-mock-tests.html"); });
    document.title = "IELTS Academic Mock Test 2 · English Learning Platform";
  }

  /* Results: Review feedback discloses the released feedback specimen. */
  document.querySelectorAll("[data-feedback-toggle]").forEach((button) => {
    const panel = document.getElementById(button.getAttribute("aria-controls"));
    button.addEventListener("click", () => {
      const open = button.getAttribute("aria-expanded") !== "true";
      button.setAttribute("aria-expanded", String(open));
      panel.hidden = !open;
      button.firstChild.textContent = open ? "Hide feedback " : "Review feedback ";
      if (open) panel.querySelector('[tabindex="-1"]')?.focus();
    });
  });
})();
