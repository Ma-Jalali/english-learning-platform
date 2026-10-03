(() => {
  const liveRegion = document.querySelector("[data-live-region]");

  const announce = (message) => {
    if (!liveRegion) return;
    liveRegion.textContent = "";
    window.setTimeout(() => {
      liveRegion.textContent = message;
    }, 20);
  };

  document.querySelectorAll("[data-reveal-target]").forEach((button) => {
    button.addEventListener("click", () => {
      const target = document.getElementById(button.dataset.revealTarget);
      if (!target) return;
      const willShow = target.hidden;
      target.hidden = !willShow;
      button.setAttribute("aria-expanded", String(willShow));
      if (willShow) {
        target.querySelector("[tabindex='-1']")?.focus();
        announce(button.dataset.announcement || "Demonstration feedback is now available.");
      }
    });
  });

  document.querySelectorAll("[data-retry-target]").forEach((button) => {
    button.addEventListener("click", () => {
      const target = document.getElementById(button.dataset.retryTarget);
      if (!target) return;
      target.hidden = true;
      const trigger = document.querySelector(`[data-reveal-target="${target.id}"]`);
      trigger?.setAttribute("aria-expanded", "false");
      trigger?.focus();
      announce("The fixed results demonstration has been reset.");
    });
  });

  document.querySelectorAll("[data-dialog-open]").forEach((button) => {
    button.addEventListener("click", () => {
      const dialog = document.getElementById(button.dataset.dialogOpen);
      if (dialog instanceof HTMLDialogElement) dialog.showModal();
    });
  });

  document.querySelectorAll("[data-dialog-close]").forEach((button) => {
    button.addEventListener("click", () => {
      const dialog = button.closest("dialog");
      if (dialog instanceof HTMLDialogElement) dialog.close();
    });
  });

  document.querySelectorAll("dialog a").forEach((link) => {
    link.addEventListener("click", () => {
      const dialog = link.closest("dialog");
      if (dialog instanceof HTMLDialogElement) dialog.close();
    });
  });

  document.querySelectorAll("[data-motion-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const isReduced = document.documentElement.classList.toggle("force-reduced-motion");
      button.setAttribute("aria-pressed", String(isReduced));
      button.textContent = isReduced ? "Motion reduced" : "Reduce motion";
      announce(isReduced ? "Prototype motion is reduced." : "Prototype motion is enabled.");
    });
  });

  document.querySelectorAll("[data-tabs]").forEach((tabSet) => {
    const tabs = [...tabSet.querySelectorAll('[role="tab"]')];
    const panels = tabs.map((tab) => document.getElementById(tab.getAttribute("aria-controls")));

    const activate = (nextTab, moveFocus = true) => {
      tabs.forEach((tab, index) => {
        const selected = tab === nextTab;
        tab.setAttribute("aria-selected", String(selected));
        tab.tabIndex = selected ? 0 : -1;
        if (panels[index]) panels[index].hidden = !selected;
      });
      if (moveFocus) nextTab.focus();
    };

    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => activate(tab, false));
      tab.addEventListener("keydown", (event) => {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        let nextIndex = index;
        if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
        if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
        if (event.key === 'Home') nextIndex = 0;
        if (event.key === 'End') nextIndex = tabs.length - 1;
        activate(tabs[nextIndex]);
      });
    });
  });
})();
