/* Display preferences only. No account, payment or entitlement operations. */
(() => {
  const classes = { motion: 'reduce-motion', transparency: 'solid-surfaces' };
  document.querySelectorAll('[data-preference]').forEach((input) => {
    input.addEventListener('change', () => {
      document.documentElement.classList.toggle(classes[input.dataset.preference], input.checked);
    });
  });
})();
