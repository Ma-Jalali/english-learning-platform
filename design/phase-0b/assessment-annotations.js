/* Genuine browser ranges. Isolated session-only prototype state; never reads answers. */
(() => {
  const panel = document.getElementById('annotation-panel');
  if (!panel) return;
  const sheet = document.getElementById('annotation-sheet');
  const drawer = document.getElementById('annotation-drawer');
  const parking = document.getElementById('annotation-parking');
  const form = document.getElementById('annotation-note-form');
  const noteInput = document.getElementById('annotation-note');
  const live = document.getElementById('annotation-live');
  const narrow = matchMedia('(max-width: 760px)');
  const strict = () => document.body.classList.contains('strict-mode');
  const storageKey = document.body.dataset.annotationStorage || 'phase-0b.personal-ranges.v1';
  const roots = new Map();
  let records = [];
  let current = null;
  let savedRange = null;
  let drawerOpener = null;
  let pointerDown = false;
  let captureTimer;
  let liveTimer;
  let ignoreSelection = false;
  const make = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  };
  const button = (text, action) => {
    const node = make('button', '', text);
    node.type = 'button';
    node.addEventListener('click', action);
    return node;
  };
  const announce = message => {
    clearTimeout(liveTimer);
    live.textContent = '';
    liveTimer = setTimeout(() => { live.textContent = message; }, 30);
  };
  const inUI = target => target instanceof Element && Boolean(target.closest('#annotation-panel, #annotation-drawer, #annotation-sheet, .annotation-launch'));
  const getRoot = node => (node?.nodeType === Node.ELEMENT_NODE ? node : node?.parentElement)?.closest('[data-annotation-root]');
  const nodesIn = element => {
    const nodes = [];
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
      acceptNode: node => node.parentElement.closest('.annotation-note-anchor') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT
    });
    while (walker.nextNode()) nodes.push(walker.currentNode);
    return nodes;
  };
  function register(element, key, label) {
    element.dataset.annotationRoot = key;
    element.tabIndex = 0;
    element.setAttribute('aria-label', label);
    element.setAttribute('aria-describedby', 'annotation-help');
    roots.set(key, { element, label, html: element.innerHTML, text: element.textContent });
  }
  document.querySelectorAll('[data-annotation-key]').forEach(element => {
    element.querySelectorAll('mark').forEach(mark => mark.replaceWith(...mark.childNodes));
    if (element.matches('legend')) element.closest('fieldset')?.setAttribute('aria-label', element.textContent);
    register(element, element.dataset.annotationKey, element.dataset.annotationLabel || 'Eligible text. Select any text to annotate.');
  });

  const bar = make('aside', 'annotation-bar');
  bar.setAttribute('aria-label', 'Personal annotations');
  const help = make('p', '', 'Select eligible passage, context or question text. Keyboard: Tab to the text, use arrows and Shift+arrows to select, then Alt+A for annotation tools. Notes are personal—not answers.');
  help.id = 'annotation-help';
  const notesButton = button('Personal notes · 0', () => openDrawer(notesButton));
  notesButton.className = 'annotation-notes-button';
  notesButton.setAttribute('aria-haspopup', 'dialog');
  bar.append(help, notesButton);
  document.querySelector('.question-navigator')?.after(bar);
  const launch = button('Annotate selection', () => openTools(true, true));
  launch.className = 'annotation-launch';
  launch.hidden = true;
  launch.setAttribute('aria-haspopup', 'dialog');
  document.body.append(launch);
  const review = make('aside', 'annotation-review');
  review.setAttribute('aria-label', 'Personal annotations retained in review');
  const reviewLabel = make('p');
  const reviewButton = button('Review personal annotations', () => openDrawer(reviewButton));
  review.append(reviewLabel, reviewButton);
  document.querySelector('#results .results-header')?.after(review);
  document.querySelector('#immediate-feedback .rationale-list')?.after(make('p', 'annotation-feedback-note', 'Personal marks and notes stay anchored to your source text. They are separate from this feedback.'));

  function rangeFor(record) {
    const root = roots.get(record.root);
    if (!root) return null;
    let offset = 0;
    let start;
    let end;
    for (const node of nodesIn(root.element)) {
      const next = offset + node.length;
      if (!start && record.start >= offset && record.start < next) start = [node, record.start - offset];
      if (record.end > offset && record.end <= next) { end = [node, record.end - offset]; break; }
      offset = next;
    }
    if (!start || !end) return null;
    const range = document.createRange();
    range.setStart(...start); range.setEnd(...end);
    return range;
  }
  function readSelection() {
    const selection = window.getSelection();
    if (!selection?.rangeCount || selection.isCollapsed) return null;
    const range = selection.getRangeAt(0);
    const root = getRoot(range.startContainer);
    if (!root || root !== getRoot(range.endContainer)) return null;
    if (range.cloneContents().querySelector('button, input, select, textarea, label, a')) return null;
    const prefix = document.createRange();
    prefix.selectNodeContents(root);
    prefix.setEnd(range.startContainer, range.startOffset);
    const start = prefix.toString().length;
    const quote = range.toString();
    if (!quote.trim()) return null;
    return { root: root.dataset.annotationRoot, start, end: start + quote.length, quote };
  }
  const exact = value => records.find(record => record.root === value.root && record.start === value.start && record.end === value.end);
  const overlaps = value => records.some(record => record.root === value.root && record.start < value.end && record.end > value.start && record !== exact(value));
  const types = record => [record?.highlight && 'Highlight', record?.underline && !strict() && 'Practice underline', record?.note && 'Note'].filter(Boolean);
  function persist() {
    try { sessionStorage.setItem(storageKey, JSON.stringify(records)); }
    catch { announce('Annotations remain on this page, but this browser blocked session storage.'); }
  }
  try {
    const data = JSON.parse(sessionStorage.getItem(storageKey) || '[]');
    if (Array.isArray(data)) records = data.filter(record => {
      const root = roots.get(record?.root);
      return root && typeof record.id === 'string' && Number.isInteger(record.start) && Number.isInteger(record.end)
        && record.start >= 0 && record.end > record.start && record.end <= root.text.length
        && root.text.slice(record.start, record.end) === record.quote && typeof record.note === 'string' && record.note.length <= 500
        && typeof record.highlight === 'boolean' && typeof record.underline === 'boolean';
    }).slice(0, 200).filter((record, index, all) => !all.slice(0, index).some(other => other.root === record.root && other.start < record.end && other.end > record.start));
  } catch { records = []; }
  function renderMarks() {
    // Rebuild only immutable stimulus/prompt roots, never answer controls.
    for (const root of roots.values()) root.element.innerHTML = root.html;
    for (const record of [...records].sort((a, b) => b.start - a.start)) {
      if (!types(record).length) continue;
      const root = roots.get(record.root).element;
      let offset = 0;
      const slices = [];
      for (const node of nodesIn(root)) {
        const end = offset + node.length;
        if (offset < record.end && end > record.start) slices.push({ node, start: Math.max(0, record.start - offset), end: Math.min(node.length, record.end - offset) });
        offset = end;
      }
      let lastMark;
      for (const slice of slices.reverse()) {
        const range = document.createRange();
        range.setStart(slice.node, slice.start); range.setEnd(slice.node, slice.end);
        const mark = make('span', 'personal-mark');
        mark.dataset.annotationId = record.id;
        mark.classList.toggle('personal-highlight', record.highlight);
        mark.classList.toggle('personal-underline', record.underline && !strict());
        mark.classList.toggle('personal-note', Boolean(record.note));
        mark.setAttribute('aria-label', `Personal ${types(record).join(', ').toLowerCase()}`);
        range.surroundContents(mark);
        if (!lastMark) lastMark = mark;
      }
      if (record.note && lastMark) {
        const anchor = button('', () => editRecord(record.id, true));
        anchor.className = 'annotation-note-anchor'; anchor.dataset.noteId = record.id;
        anchor.setAttribute('aria-label', `Open personal note for “${record.quote.slice(0, 90)}”`);
        anchor.setAttribute('aria-haspopup', 'dialog');
        lastMark.after(anchor);
      }
    }
    renderIndex();
  }
  function renderIndex() {
    const count = records.filter(record => record.note).length;
    notesButton.textContent = `Personal notes · ${count}`;
    const highlights = records.filter(record => record.highlight).length;
    reviewLabel.textContent = `Personal annotations preserved · ${highlights} highlight${highlights === 1 ? '' : 's'} · ${count} note${count === 1 ? '' : 's'}. Not part of your result.`;
    const list = document.getElementById('annotation-list');
    list.replaceChildren();
    for (const record of records) {
      if (!types(record).length) continue;
      const item = make('article', 'annotation-entry');
      const excerpt = record.quote.length > 160 ? `${record.quote.slice(0, 157)}…` : record.quote;
      item.append(make('p', 'annotation-types', types(record).join(' · ')), make('blockquote', '', excerpt));
      if (record.note) item.append(make('p', 'annotation-note-content', record.note));
      const actions = make('div', 'annotation-commands');
      actions.append(button(record.note ? 'Edit note' : 'Edit annotation', () => { drawerOpener = null; drawer.close(); goTo(record); editRecord(record.id, Boolean(record.note)); }));
      if (record.note) actions.append(button('Delete note', () => {
        record.note = ''; prune(); persist(); renderMarks();
        drawer.querySelector('[data-annotation-drawer-close]').focus();
        announce('Personal note deleted. Other marks and answers are unchanged.');
      }));
      actions.append(button('Go to text', () => { drawerOpener = null; drawer.close(); goTo(record); }));
      item.append(actions); list.append(item);
    }
    if (!list.children.length) list.append(make('p', 'annotation-empty', 'No personal annotations yet. Select any words in the passage or question prompts.'));
    document.getElementById('annotation-clear').disabled = !records.length;
  }
  function goTo(record) {
    closeTools(false);
    const root = roots.get(record.root).element;
    document.body.classList.remove('review-group');
    document.querySelector(`button[data-mobile-pane="${root.closest('.stimulus-pane') ? 'stimulus' : 'questions'}"]`)?.click();
    root.closest('details')?.setAttribute('open', '');
    const marks = [...root.querySelectorAll('[data-annotation-id]')].filter(node => node.dataset.annotationId === record.id);
    (marks[0] || root).scrollIntoView({ block: 'center', behavior: 'instant' });
    root.focus({ preventScroll: true });
    marks.forEach(mark => mark.classList.add('annotation-located'));
    setTimeout(() => marks.forEach(mark => mark.classList.remove('annotation-located')), 1800);
    announce(`Source text: ${record.quote}`);
  }
  function prune() { records = records.filter(record => record.highlight || record.underline || record.note); }
  function closeTools(returnFocus = false) {
    const root = current && roots.get(current.root)?.element;
    panel.hidden = true; form.hidden = true; launch.hidden = true;
    if (sheet.open) sheet.close();
    parking.append(panel); current = null; savedRange = null;
    if (returnFocus) root?.focus({ preventScroll: true });
  }
  function configure() {
    const record = exact(current);
    const conflict = overlaps(current);
    document.getElementById('annotation-quote').textContent = current.quote;
    document.getElementById('annotation-state').textContent = conflict
      ? 'This selection overlaps an existing annotation. Select its complete range, use its note marker, or choose unmarked text.'
      : `${types(record).join(' · ') || 'Exact selected text'} · ${strict() ? 'Exam mode: highlight and notes only.' : 'Personal, not submitted.'}`;
    panel.querySelectorAll('[data-annotation-action]').forEach(command => { command.disabled = conflict; });
    panel.querySelector('[data-annotation-action="underline"]').hidden = strict();
    panel.querySelector('[data-annotation-action="highlight"]').setAttribute('aria-pressed', String(Boolean(record?.highlight)));
    panel.querySelector('[data-annotation-action="underline"]').setAttribute('aria-pressed', String(Boolean(record?.underline)));
    panel.querySelector('[data-annotation-action="note"]').lastChild.textContent = record?.note ? ' Edit note' : ' Add note';
    panel.querySelector('[data-annotation-action="remove-highlight"]').hidden = !record?.highlight;
    panel.querySelector('[data-annotation-action="remove"]').hidden = !record;
    panel.querySelector('[data-annotation-action="remove-note"]').hidden = !record?.note;
  }
  function placePanel() {
    if (panel.hidden || sheet.open || !savedRange) return;
    const rects = [...savedRange.getClientRects()].filter(rect => rect.width && rect.height);
    if (!rects.length) return closeTools(false);
    const top = Math.min(...rects.map(rect => rect.top));
    const bottom = Math.max(...rects.map(rect => rect.bottom));
    const box = panel.getBoundingClientRect();
    const pane = roots.get(current.root).element.closest('.stimulus-pane, .response-pane')?.getBoundingClientRect();
    const minX = pane && pane.width >= box.width + 24 ? Math.max(12, pane.left + 12) : 12;
    const maxX = pane && pane.width >= box.width + 24 ? Math.min(innerWidth - box.width - 12, pane.right - box.width - 12) : innerWidth - box.width - 12;
    const x = Math.max(minX, Math.min(rects[0].left, maxX));
    const controls = [...document.querySelectorAll('.response-pane .choice, .response-pane .response-actions')].map(node => node.getBoundingClientRect());
    const y = [bottom + 10, top - box.height - 10].find(candidate => candidate >= 12 && candidate + box.height <= innerHeight - 12
      && !controls.some(rect => rect.width && x < rect.right && x + box.width > rect.left && candidate < rect.bottom && candidate + box.height > rect.top));
    if (y === undefined) { sheet.append(panel); sheet.showModal(); return; }
    panel.style.left = `${x}px`;
    panel.style.top = `${y}px`;
  }
  function openTools(focus = false, mobile = narrow.matches) {
    if (!current) return;
    savedRange = rangeFor(current);
    if (!savedRange) return;
    configure(); launch.hidden = true; panel.hidden = false;
    if (mobile) { sheet.append(panel); if (!sheet.open) sheet.showModal(); }
    else { document.body.append(panel); placePanel(); }
    if (focus) panel.querySelector('button:not([disabled])')?.focus({ preventScroll: true });
  }
  function captureSelection(keyboard = false) {
    if (ignoreSelection || pointerDown || drawer.open || sheet.open || inUI(document.activeElement)) return;
    const selection = readSelection();
    if (!selection) { closeTools(false); return; }
    current = selection; savedRange = window.getSelection().getRangeAt(0).cloneRange(); form.hidden = true;
    if (narrow.matches && !keyboard) { panel.hidden = true; launch.hidden = false; }
    else openTools(keyboard);
  }
  function editRecord(id, note = false) {
    const record = records.find(candidate => candidate.id === id);
    if (!record) return;
    closeTools(false); current = { ...record }; openTools(true);
    if (note) showNote();
  }
  function showNote() {
    form.hidden = false; noteInput.value = exact(current)?.note || ''; noteInput.setCustomValidity('');
    placePanel(); noteInput.focus();
  }
  function commit(action) {
    if (!current || overlaps(current) || (strict() && action === 'underline')) return;
    let record = exact(current);
    const wasNote = Boolean(record?.note);
    if (!record) { record = { ...current, id: crypto.randomUUID(), highlight: false, underline: false, note: '' }; records.push(record); }
    if (action === 'highlight') record.highlight = true;
    if (action === 'underline') record.underline = !record.underline;
    if (action === 'remove-highlight') record.highlight = false;
    if (action === 'remove-note') record.note = '';
    if (action === 'remove') { record.highlight = false; record.underline = false; record.note = ''; }
    if (action === 'note') record.note = noteInput.value.trim();
    ignoreSelection = true; window.getSelection()?.removeAllRanges(); closeTools(true);
    prune(); persist(); renderMarks(); setTimeout(() => { ignoreSelection = false; }, 0);
    const messages = { highlight: 'Exact selected text highlighted.', underline: `Practice underline ${record.underline ? 'added' : 'removed'}.`, note: wasNote ? 'Personal note edited.' : 'Personal note saved beside its source text.', 'remove-note': 'Personal note deleted.', 'remove-highlight': `Personal highlight removed.${record.note ? ' Attached note retained.' : ''}`, remove: 'Selected annotation removed.' };
    announce(`${messages[action]} Answers and results unchanged.`);
  }
  function openDrawer(opener) {
    closeTools(false); drawerOpener = opener; document.getElementById('annotation-clear-confirmation').hidden = true;
    renderIndex(); drawer.showModal(); drawer.querySelector('[data-annotation-drawer-close]').focus();
  }
  document.addEventListener('selectionchange', () => { clearTimeout(captureTimer); captureTimer = setTimeout(() => captureSelection(), 180); });
  document.addEventListener('pointerdown', event => {
    if (inUI(event.target)) { if (event.target.closest('#annotation-panel button, .annotation-launch')) event.preventDefault(); return; }
    pointerDown = true; closeTools(false);
  });
  document.addEventListener('pointerup', () => { pointerDown = false; setTimeout(() => captureSelection(), 0); });
  document.addEventListener('click', event => {
    const mark = event.target.closest?.('.personal-mark');
    if (mark && window.getSelection()?.isCollapsed) {
      const record = records.find(candidate => candidate.id === mark.dataset.annotationId);
      if (record?.note) editRecord(record.id, true);
    }
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !panel.hidden) { event.preventDefault(); closeTools(true); return; }
    if ((event.altKey && event.key.toLowerCase() === 'a') || (event.shiftKey && event.key === 'F10')) {
      if (readSelection()) { event.preventDefault(); current = readSelection(); openTools(true); }
      return;
    }
    const root = event.target.closest?.('[data-annotation-root]');
    if (!root || event.target.closest('button')) return;
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const selection = window.getSelection();
    const backwards = ['ArrowLeft', 'ArrowUp', 'Home'].includes(event.key);
    if (getRoot(selection?.focusNode) !== root) {
      const range = document.createRange(); range.selectNodeContents(root); range.collapse(!backwards);
      selection.removeAllRanges(); selection.addRange(range);
    }
    const previous = selection.rangeCount ? selection.getRangeAt(0).cloneRange() : null;
    const unit = ['Home', 'End'].includes(event.key) ? 'lineboundary' : ['ArrowUp', 'ArrowDown'].includes(event.key) ? 'line' : event.ctrlKey || event.altKey ? 'word' : 'character';
    selection.modify(event.shiftKey ? 'extend' : 'move', backwards ? 'backward' : 'forward', unit);
    if (getRoot(selection.focusNode) !== root && previous) { selection.removeAllRanges(); selection.addRange(previous); }
  });
  panel.querySelector('[data-annotation-close]').addEventListener('click', () => closeTools(true));
  panel.querySelectorAll('[data-annotation-action]').forEach(command => command.addEventListener('click', () => {
    const action = command.dataset.annotationAction;
    if (action === 'note') return showNote();
    if (action === 'cancel-note') { form.hidden = true; configure(); placePanel(); panel.querySelector('[data-annotation-action="note"]').focus(); return; }
    commit(action);
  }));
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!noteInput.value.trim()) { noteInput.setCustomValidity('Enter a note, or use Remove note.'); noteInput.reportValidity(); return; }
    commit('note');
  });
  noteInput.addEventListener('input', () => noteInput.setCustomValidity(''));
  sheet.addEventListener('cancel', event => { event.preventDefault(); closeTools(true); });
  sheet.addEventListener('close', () => { if (sheet.contains(panel)) closeTools(true); });
  drawer.querySelector('[data-annotation-drawer-close]').addEventListener('click', () => drawer.close());
  drawer.addEventListener('close', () => drawerOpener?.focus({ preventScroll: true }));
  [sheet, drawer].forEach(dialog => dialog.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const controls = [...dialog.querySelectorAll('button,input,textarea')].filter(node => !node.disabled && node.getClientRects().length);
    const destination = event.shiftKey && document.activeElement === controls[0] ? controls.at(-1) : !event.shiftKey && document.activeElement === controls.at(-1) ? controls[0] : null;
    if (destination) { event.preventDefault(); destination.focus(); }
  }));
  document.getElementById('annotation-solid').addEventListener('change', event => document.body.classList.toggle('annotation-solid', event.target.checked));
  document.getElementById('annotation-clear').addEventListener('click', () => { document.getElementById('annotation-clear-confirmation').hidden = false; document.getElementById('annotation-clear-cancel').focus(); });
  document.getElementById('annotation-clear-cancel').addEventListener('click', () => { document.getElementById('annotation-clear-confirmation').hidden = true; document.getElementById('annotation-clear').focus(); });
  document.getElementById('annotation-clear-confirm').addEventListener('click', () => {
    records = []; persist(); renderMarks(); document.getElementById('annotation-clear-confirmation').hidden = true;
    drawer.querySelector('[data-annotation-drawer-close]').focus(); announce('All personal annotations cleared. Answers, completion and feedback unchanged.');
  });
  document.addEventListener('assessment-mode-change', () => { closeTools(false); renderMarks(); announce(strict() ? 'Exam mode: highlights and notes retained; practice underlines hidden.' : 'Learning mode: practice underlines restored.'); });
  document.querySelectorAll('.question-navigator a,[data-immediate-check],[data-group-check],button[data-mobile-pane]').forEach(control => control.addEventListener('click', () => closeTools(false)));
  window.addEventListener('resize', () => closeTools(false));
  window.addEventListener('scroll', () => { if (!sheet.open && !panel.hidden) placePanel(); }, { passive: true });
  renderMarks();
})();
