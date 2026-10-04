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
    const panel = disclosure.querySelector(":scope > .v3-disclosure-panel");
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

  document.querySelectorAll("[data-reveal-target]").forEach((button) => {
    button.addEventListener("click", () => {
      const target = document.getElementById(button.dataset.revealTarget);
      if (!target) return;
      const opening = target.hidden;
      target.hidden = !opening;
      button.setAttribute("aria-expanded", String(opening));
      if (opening) {
        const focusTarget = target.querySelector("[tabindex='-1']");
        focusTarget?.focus({ preventScroll: true });
        announce(button.dataset.announcement || "Additional information shown.");
      } else {
        announce("Additional information hidden.");
      }
    });
  });

  document.querySelectorAll("[data-retry-target]").forEach((button) => {
    button.addEventListener("click", () => {
      const target = document.getElementById(button.dataset.retryTarget);
      if (target) target.hidden = true;
      const opener = document.querySelector(`[data-reveal-target="${button.dataset.retryTarget}"]`);
      opener?.setAttribute("aria-expanded", "false");
      opener?.focus();
      announce("Group feedback hidden. Responses remain available for this visual retry demonstration.");
    });
  });

  document.querySelectorAll("[data-dialog-open]").forEach((button) => {
    button.addEventListener("click", () => document.getElementById(button.dataset.dialogOpen)?.showModal());
  });
  document.querySelectorAll("[data-dialog-close]").forEach((button) => {
    button.addEventListener("click", () => button.closest("dialog")?.close());
  });
  document.querySelectorAll("dialog").forEach((dialog) => {
    dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
    dialog.addEventListener("close", () => document.querySelector(`[data-dialog-open="${dialog.id}"]`)?.focus());
  });

  document.querySelectorAll(".v3-word-bank button").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.classList.contains("is-used")) return;
      const selected = button.classList.toggle("is-selected");
      button.setAttribute("aria-pressed", String(selected));
    });
  });

  const pageLinks = [...document.querySelectorAll(".v3-page-index a[href^='#']")];
  if (pageLinks.length && "IntersectionObserver" in window) {
    const sections = pageLinks.map((link) => document.querySelector(link.getAttribute("href"))).filter(Boolean);
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a,b) => b.intersectionRatio-a.intersectionRatio)[0];
      if (!visible) return;
      pageLinks.forEach((link) => link.classList.toggle("is-current", link.hash === `#${visible.target.id}`));
    }, { rootMargin: "-20% 0px -68%", threshold: [.05,.3] });
    sections.forEach((section) => observer.observe(section));
  }

  const params = new URLSearchParams(window.location.search);
  const parseHex = (hex) => [1, 3, 5].map((index) => Number.parseInt(hex.slice(index, index + 2), 16));
  const luminance = (hex) => parseHex(hex).map((channel) => {
    const value = channel / 255;
    return value <= .03928 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4;
  }).reduce((sum, value, index) => sum + value * [.2126, .7152, .0722][index], 0);
  document.querySelectorAll("[data-contrast]").forEach((cell) => {
    const [foreground, background] = cell.dataset.contrast.split("|");
    const values = [luminance(foreground), luminance(background)].sort((a,b) => b-a);
    cell.textContent = `${((values[0]+.05)/(values[1]+.05)).toFixed(2)}:1`;
  });

  const capture = params.get("capture");
  const state = params.get("state");
  const view = params.get("view");
  if (state === "toggle-open") document.querySelector("#v3-band-disclosure > button")?.click();
  if (state === "toggle-motion") {
    const disclosure = document.querySelector("#v3-band-disclosure");
    disclosure?.classList.add("is-open", "is-motion-sample");
    disclosure?.querySelector(":scope > button")?.setAttribute("aria-expanded", "true");
    disclosure?.querySelector(":scope > .v3-disclosure-panel")?.removeAttribute("inert");
    disclosure?.querySelector(":scope > .v3-disclosure-panel")?.setAttribute("aria-hidden", "false");
  }
  if (state === "feedback") document.querySelector('[data-reveal-target="v3-results"]')?.click();
  if (view === "focus") window.requestAnimationFrame(() => document.querySelector('[data-reveal-target="v3-immediate"]')?.focus());
  if (capture) {
    document.documentElement.style.scrollBehavior = "auto";
    window.requestAnimationFrame(() => document.getElementById(capture)?.scrollIntoView({ block: "start" }));
  }
})();
