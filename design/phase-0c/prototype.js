(() => {
  const live = document.querySelector("[data-live-region]");
  const announce = (message) => {
    if (!live) return;
    live.textContent = "";
    requestAnimationFrame(() => { live.textContent = message; });
  };

  const dialogOpeners = new Map();
  const openDialog = (dialog, opener) => {
    if (!dialog) return;
    dialogOpeners.set(dialog, opener);
    dialog.showModal();
  };

  document.querySelectorAll("[data-dialog-open]").forEach((button) => {
    button.addEventListener("click", () => openDialog(document.getElementById(button.dataset.dialogOpen), button));
  });
  document.querySelectorAll("[data-dialog-close]").forEach((button) => {
    button.addEventListener("click", () => button.closest("dialog")?.close());
  });
  document.querySelectorAll("dialog").forEach((dialog) => {
    dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
    dialog.addEventListener("close", () => dialogOpeners.get(dialog)?.focus());
  });

  document.querySelectorAll("[data-tablist]").forEach((tablist) => {
    const tabs = [...tablist.querySelectorAll("[role='tab']")];
    const select = (tab) => {
      tabs.forEach((candidate) => {
        const active = candidate === tab;
        candidate.setAttribute("aria-selected", String(active));
        candidate.tabIndex = active ? 0 : -1;
        const panel = document.getElementById(candidate.getAttribute("aria-controls"));
        if (panel) panel.hidden = !active;
      });
    };
    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => select(tab));
      tab.addEventListener("keydown", (event) => {
        if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
        event.preventDefault();
        const next = event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1 :
          (index + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
        tabs[next].focus();
        select(tabs[next]);
      });
    });
  });

  /* Illustrative server-return fixtures. The browser never chooses final entitlements. */
  const allocationFixtures = {
    one: { label: "One mock test", count: 1, tests: [3] },
    three: { label: "3-test bundle", count: 3, tests: [3, 4, 5] },
    five: { label: "5-test bundle", count: 5, tests: [3, 4, 5, 6, 7] },
    collection: { label: "Complete collection", count: 8, tests: [3, 4, 5, 6, 7, 8, 9, 10] }
  };

  const allocationDialog = document.getElementById("allocation-dialog");
  const allocationTitle = document.querySelector("[data-allocation-title]");
  const allocationSummary = document.querySelector("[data-allocation-summary]");
  const allocationList = document.querySelector("[data-allocation-list]");
  let pendingAllocation = null;

  document.querySelectorAll("[data-offer]").forEach((button) => {
    button.addEventListener("click", () => {
      const isTwoRemaining = new URLSearchParams(location.search).get("owned") === "8";
      const fixture = button.dataset.offer === "collection" && isTwoRemaining
        ? { label: "Complete collection", count: 2, tests: [9, 10] }
        : allocationFixtures[button.dataset.offer];
      if (!fixture) return;
      pendingAllocation = fixture;
      if (allocationTitle) allocationTitle.textContent = fixture.label;
      if (allocationSummary) {
        const ownedCount = fixture.label === "Complete collection" ? 10 - fixture.count : null;
        allocationSummary.textContent = ownedCount === null
          ? `Get free access would add ${fixture.count} new ${fixture.count === 1 ? "test" : "tests"} to My Mock Tests, with no repeats.`
          : `You already have ${ownedCount} of 10 tests. Get free access would add the remaining ${fixture.count}, with no repeats.`;
      }
      if (allocationList) allocationList.innerHTML = fixture.tests
        .map((number) => `<li>IELTS Academic Mock Test ${number}</li>`).join("");
      openDialog(allocationDialog, button);
      announce(`${fixture.label} preview opened. ${fixture.count} new ${fixture.count === 1 ? "test" : "tests"} would be added.`);
    });
  });

  document.querySelectorAll("[data-allocation-confirm]").forEach((button) => {
    button.addEventListener("click", () => {
      allocationDialog?.close();
      const success = document.getElementById("success-dialog");
      const count = pendingAllocation?.count || 0;
      const successCopy = document.querySelector("[data-success-copy]");
      if (successCopy) successCopy.textContent = `${count} new ${count === 1 ? "test would" : "tests would"} appear in My Mock Tests. Nothing has been added in this design preview.`;
      openDialog(success, button);
      announce(`Preview complete. ${count} new ${count === 1 ? "test" : "tests"} would be added; no account change was made.`);
    });
  });

  document.querySelectorAll("[data-grant-one]").forEach((button) => {
    button.addEventListener("click", () => {
      const success = document.getElementById("success-dialog");
      openDialog(success, button);
      announce("Free access demonstration complete. No account data was changed.");
    });
  });

  const readinessChecks = [...document.querySelectorAll("[data-readiness] input")];
  const start = document.querySelector("[data-start-test]");
  const updateReadiness = () => {
    const ready = readinessChecks.length > 0 && readinessChecks.every((input) => input.checked);
    if (start) start.disabled = !ready;
  };
  readinessChecks.forEach((input) => input.addEventListener("change", () => {
    updateReadiness();
    announce(`${input.dataset.label} ${input.checked ? "confirmed" : "not confirmed"}.`);
  }));
  start?.addEventListener("click", () => {
    if (start.disabled || !start.dataset.startUrl) return;
    location.href = start.dataset.startUrl;
  });
  updateReadiness();

  document.querySelectorAll("[data-motion-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const reduced = document.documentElement.classList.toggle("motion-reduced");
      button.setAttribute("aria-pressed", String(reduced));
      button.textContent = reduced ? "Use standard motion" : "Reduce motion";
      announce(reduced ? "Prototype motion reduced." : "Prototype motion restored.");
    });
  });

  /* Preview-only controls explain their limit in the nearest status line instead of failing silently. */
  document.querySelectorAll("[data-preview-note]").forEach((control) => {
    control.addEventListener("click", () => {
      const status = control.parentElement.querySelector("[data-preview-status]");
      if (!status) return;
      status.textContent = "";
      requestAnimationFrame(() => { status.textContent = control.dataset.previewNote; });
    });
  });

  const params = new URLSearchParams(location.search);
  const state = params.get("state") || "default";
  document.querySelectorAll("[data-library-view]").forEach((view) => {
    view.hidden = view.dataset.libraryView !== state;
  });

  const journeyView = params.get("view") || "current";
  document.querySelectorAll("[data-journey-view]").forEach((view) => {
    view.hidden = view.dataset.journeyView !== journeyView;
    if (!view.hidden && view.dataset.pageTitle) document.title = view.dataset.pageTitle;
  });

  if (params.get("owned") === "8") {
    document.querySelectorAll("[data-needs-at-least-three]").forEach((element) => { element.hidden = true; });
    document.querySelectorAll("[data-two-remaining]").forEach((element) => { element.hidden = false; });
  }

  /* Review fixture bridge: the My Mock Tests review fixture (?state=review) owns Tests 1–4,
     and Test Bundles shows the same student at ?owned=4. Links between them keep that fixture. */
  const REVIEW_OWNED = 4;
  const keepFixture = (from, to) => document.querySelectorAll(`a[href="${from}"]`).forEach((link) => { link.href = to; });
  if (state === "review") keepFixture("bundle-builder.html", `bundle-builder.html?owned=${REVIEW_OWNED}`);

  if (params.get("owned") === String(REVIEW_OWNED) && document.querySelector(".bundle-grid")) {
    const owned = REVIEW_OWNED, remaining = 10 - owned;
    const tests = (count) => Array.from({ length: count }, (_, index) => owned + 1 + index);
    const plural = (count) => `${count} new ${count === 1 ? "test" : "tests"}`;
    const status = document.querySelector(".collection-status");
    status.querySelector(".status-count[data-needs-at-least-three] strong").textContent = owned;
    status.querySelectorAll(".status-strip[data-needs-at-least-three] li").forEach((item, index) => item.classList.toggle("owned", index < owned));
    status.querySelector(".status-note[data-needs-at-least-three]").textContent = `Mock Tests 1–${owned} are already in your library.`;
    const sizes = { one: 1, three: 3, five: 5, collection: remaining };
    document.querySelectorAll(".bundle-card [data-offer]").forEach((button) => {
      const card = button.closest(".bundle-card"), count = sizes[button.dataset.offer];
      card.hidden = count > remaining;
      const gain = card.querySelector(".bundle-gain:not([data-two-remaining])");
      gain.querySelector(".gain-meter").style.cssText = `--owned: ${owned}; --new: ${count}`;
      gain.querySelector(".gain-copy strong").textContent = `+${plural(count)}`;
      gain.querySelector(".gain-copy span").textContent = owned + count === 10 ? "You’ll have all 10" : `You’ll have ${owned + count} of 10`;
      allocationFixtures[button.dataset.offer] = { ...allocationFixtures[button.dataset.offer], count, tests: tests(count) };
    });
    document.querySelector("[data-offer='collection'] [data-needs-at-least-three]").textContent = `Get the remaining ${remaining}`;
    keepFixture("my-mock-tests.html", "my-mock-tests.html?state=review");
  }
})();
