(() => {
  const liveRegion = document.querySelector("[data-live-region]");
  const announce = (message) => {
    if (!liveRegion || !message) return;
    liveRegion.textContent = "";
    window.requestAnimationFrame(() => { liveRegion.textContent = message; });
  };

  document.querySelectorAll("[data-motion-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const reduced = document.documentElement.classList.toggle("motion-reduced");
      button.setAttribute("aria-pressed", String(reduced));
      button.textContent = reduced ? "Use standard motion" : "Reduce motion";
      announce(reduced ? "Prototype motion reduced." : "Prototype motion restored.");
    });
  });

  document.querySelectorAll("[data-disclosure]").forEach((disclosure) => {
    const trigger = disclosure.querySelector(":scope > button");
    const panel = disclosure.querySelector(":scope > .disclosure-panel");
    if (!trigger || !panel) return;
    panel.setAttribute("inert", "");
    trigger.addEventListener("click", () => {
      const opening = trigger.getAttribute("aria-expanded") !== "true";
      trigger.setAttribute("aria-expanded", String(opening));
      panel.setAttribute("aria-hidden", String(!opening));
      disclosure.classList.toggle("is-open", opening);
      if (opening) panel.removeAttribute("inert"); else panel.setAttribute("inert", "");
    });
  });

  const openers = new Map();
  document.querySelectorAll("[data-dialog-open]").forEach((button) => {
    button.addEventListener("click", () => {
      const dialog = document.getElementById(button.dataset.dialogOpen);
      if (!dialog) return;
      openers.set(dialog, button);
      dialog.showModal();
    });
  });
  document.querySelectorAll("[data-dialog-close]").forEach((button) => {
    button.addEventListener("click", () => button.closest("dialog")?.close());
  });
  document.querySelectorAll("dialog").forEach((dialog) => {
    dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
    dialog.addEventListener("close", () => openers.get(dialog)?.focus());
  });

  document.querySelectorAll("[data-reveal-target]").forEach((button) => {
    button.addEventListener("click", () => {
      const target = document.getElementById(button.dataset.revealTarget);
      if (!target) return;
      const opening = target.hidden;
      target.hidden = !opening;
      button.setAttribute("aria-expanded", String(opening));
      if (opening) {
        target.querySelector("[tabindex='-1']")?.focus({ preventScroll: true });
        announce(button.dataset.announcement || "Additional information shown.");
      } else {
        announce("Additional information hidden.");
      }
    });
  });

  document.querySelectorAll("[data-tablist]").forEach((tablist) => {
    const tabs = [...tablist.querySelectorAll("[role='tab']")];
    const activate = (tab) => {
      tabs.forEach((candidate) => {
        const selected = candidate === tab;
        candidate.setAttribute("aria-selected", String(selected));
        candidate.tabIndex = selected ? 0 : -1;
        const panel = document.getElementById(candidate.getAttribute("aria-controls"));
        if (panel) panel.hidden = !selected;
      });
    };
    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => activate(tab));
      tab.addEventListener("keydown", (event) => {
        if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
        event.preventDefault();
        const nextIndex = event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1 : (index + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
        tabs[nextIndex].focus();
        activate(tabs[nextIndex]);
      });
    });
  });

  document.querySelectorAll("[data-block]").forEach((block) => {
    block.addEventListener("keydown", (event) => {
      if (event.target !== block || !["Enter", " "].includes(event.key)) return;
      event.preventDefault();
      block.click();
    });
    block.addEventListener("click", (event) => {
      if (event.target.closest("a, button, input, select")) return;
      document.querySelectorAll("[data-block]").forEach((candidate) => candidate.classList.remove("is-selected"));
      block.classList.add("is-selected");
      block.focus({ preventScroll: true });
      const label = block.dataset.block;
      document.querySelectorAll("[data-inspector-title]").forEach((node) => { node.textContent = label; });
      const title = document.getElementById("callout-title");
      const body = document.getElementById("callout-body");
      const kind = document.getElementById("callout-kind");
      if (title) title.value = block.querySelector("h2,h3")?.textContent || label;
      if (body) body.value = [...block.querySelectorAll("p")].find((p) => !p.classList.contains("eyebrow"))?.textContent || "";
      if (kind) kind.value = label;
      announce(`${label} block selected. Inspector updated.`);
    });
  });

  document.querySelectorAll("[data-preview-size]").forEach((button) => {
    button.addEventListener("click", () => {
      const size = button.dataset.previewSize;
      document.querySelectorAll("[data-preview-size]").forEach((candidate) => candidate.setAttribute("aria-pressed", String(candidate === button)));
      const canvas = document.querySelector("[data-preview-canvas]");
      if (canvas) canvas.dataset.preview = size;
      announce(`${size} preview selected.`);
    });
  });

  document.querySelectorAll("[data-save-demo]").forEach((button) => {
    button.addEventListener("click", () => {
      const state = document.querySelector("[data-save-state]");
      if (!state) return;
      state.innerHTML = '<span class="status-dot"></span> Saving…';
      button.disabled = true;
      window.setTimeout(() => {
        state.innerHTML = '<span class="status-dot"></span> Saved just now';
        button.disabled = false;
        announce("Save-state demonstration complete. Nothing was persisted.");
      }, 650);
    });
  });

  document.querySelectorAll("[data-publish-demo]").forEach((button) => {
    button.addEventListener("click", () => {
      button.closest("dialog")?.close();
      const status = document.querySelector("[data-publish-state]");
      if (status) { status.textContent = "Published preview"; status.classList.add("badge-success"); }
      announce("Publish demonstration complete. No content was persisted.");
    });
  });

  document.querySelectorAll("[data-flag]").forEach((button) => {
    button.addEventListener("click", () => {
      const flagged = button.getAttribute("aria-pressed") !== "true";
      button.setAttribute("aria-pressed", String(flagged));
      button.classList.toggle("is-flagged", flagged);
      announce(flagged ? "Question flagged for review." : "Review flag removed.");
    });
  });

  document.querySelectorAll("[data-mobile-pane]").forEach((button) => {
    button.addEventListener("click", () => {
      const pane = button.dataset.mobilePane;
      document.body.dataset.mobilePane = pane;
      document.querySelectorAll("[data-mobile-pane]").forEach((candidate) => candidate.setAttribute("aria-pressed", String(candidate === button)));
      announce(`${pane} pane shown.`);
    });
  });

  document.querySelectorAll("[data-strict-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      const strict = document.body.classList.toggle("strict-mode");
      button.setAttribute("aria-pressed", String(strict));
      button.querySelector("span:last-child").textContent = strict ? "Exam mode on" : "Learning mode";
      announce(strict ? "Exam mode presentation enabled. Feedback and hints hidden." : "Learning mode restored.");
    });
  });

  document.querySelectorAll("[data-word-bank] button").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.classList.contains("is-used")) return;
      const pressed = button.getAttribute("aria-pressed") !== "true";
      button.setAttribute("aria-pressed", String(pressed));
    });
  });

  const params = new URLSearchParams(window.location.search);
  const state = params.get("state");
  const revealReviewState = (selector) => {
    document.querySelector(selector)?.click();
  };
  if (state === "feedback") revealReviewState("[data-immediate-check]");
  if (state === "group") {
    revealReviewState("[data-group-check]");
    document.body.classList.add("review-group");
  }
  if (state === "strict") document.querySelector("[data-strict-mode]")?.click();
  if (state === "publish") document.querySelector('[data-dialog-open="publish-dialog"]')?.click();
  if (state === "themes") document.body.classList.add("review-themes");
  if (state === "specimens") document.body.classList.add("review-specimens");

  window.addEventListener("error", () => document.documentElement.dataset.prototypeError = "true");
})();
