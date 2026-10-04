/* Assessment-only presentation modes. No timing, answer or submission logic. */
(() => {
  const choices = [...document.querySelectorAll('input[name="practice-mode"]')];
  const summary = document.getElementById('assessment-mode-summary');
  const timer = document.querySelector('.timer');
  const labels = choices.map(choice => choice.closest('label'));
  if (!choices.length || !summary) return;
  function closeTips() {
    labels.forEach(label => label.classList.remove('tip-open'));
  }
  function openTip(label) {
    closeTips();
    label.classList.add('tip-open');
  }
  labels.forEach(label => {
    label.addEventListener('pointerenter', event => {
      if (event.pointerType !== 'touch') openTip(label);
    });
    label.addEventListener('pointerleave', () => {
      if (!label.contains(document.activeElement)) label.classList.remove('tip-open');
    });
    label.addEventListener('focusin', () => openTip(label));
    label.addEventListener('focusout', () => label.classList.remove('tip-open'));
    label.addEventListener('click', () => openTip(label));
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeTips();
  });
  document.addEventListener('pointerdown', event => {
    if (!event.target.closest('.assessment-mode-options')) closeTips();
  });
  function setMode(mode) {
    const strict = mode === 'strict';
    document.body.classList.toggle('strict-mode', strict);
    if (timer) timer.hidden = !strict;
    choices.forEach(choice => { choice.checked = choice.value === mode; });
    const title = document.createElement('strong');
    title.textContent = strict ? 'Exam mode: ' : 'Learning mode: ';
    summary.replaceChildren(title, document.createTextNode(strict
      ? 'Timer shown. Highlights and notes remain available. Underlining, answer checks and explanations are hidden.'
      : 'Untimed practice. Check answers, read explanations and use highlights, notes and underlines.'));
    document.dispatchEvent(new CustomEvent('assessment-mode-change', { detail: { mode } }));
  }
  choices.forEach(choice => choice.addEventListener('change', () => {
    if (choice.checked) setMode(choice.value);
  }));
  setMode(new URLSearchParams(location.search).get('state') === 'strict' ? 'strict' : 'learning');
})();
