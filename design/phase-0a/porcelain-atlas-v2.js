(() => {
  const search = new URLSearchParams(window.location.search);
  const view = search.get("view");
  const capture = search.get("capture");
  if (view && document.body.classList.contains("atlas-v2-specimen")) {
    document.body.dataset.specimenView = view;
  }

  if (view === "focus") {
    window.requestAnimationFrame(() => {
      document.querySelector("[data-focus-sample]")?.focus();
    });
  }

  if (capture) {
    document.documentElement.style.scrollBehavior = "auto";
    document.body.dataset.capture = capture;
    window.requestAnimationFrame(() => {
      document.getElementById(capture)?.scrollIntoView({ block: "start" });
    });
  }

  const parseHex = (hex) => {
    const value = hex.replace("#", "");
    return [0, 2, 4].map((index) => Number.parseInt(value.slice(index, index + 2), 16));
  };

  const luminance = (colour) => {
    const channels = colour.map((channel) => {
      const value = channel / 255;
      return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
  };

  document.querySelectorAll("[data-contrast]").forEach((cell) => {
    const [foreground, background] = cell.dataset.contrast.split("|").map(parseHex);
    const values = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
    cell.textContent = `${((values[0] + 0.05) / (values[1] + 0.05)).toFixed(2)}:1`;
  });

  const pageLinks = [...document.querySelectorAll(".v2-page-index a[href^='#']")];
  if (pageLinks.length && "IntersectionObserver" in window) {
    const sections = pageLinks
      .map((link) => document.querySelector(link.getAttribute("href")))
      .filter(Boolean);

    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      pageLinks.forEach((link) => {
        link.classList.toggle("is-current", link.getAttribute("href") === `#${visible.target.id}`);
      });
    }, { rootMargin: "-20% 0px -65%", threshold: [0.05, 0.3] });

    sections.forEach((section) => observer.observe(section));
  }
})();
