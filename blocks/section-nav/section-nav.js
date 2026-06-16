export default function init(el) {
  el.classList.add('section-nav');
  const items = [...el.querySelectorAll(':scope > div')];

  const nav = document.createElement('nav');
  nav.className = 'section-nav-list';
  nav.setAttribute('aria-label', 'Section');

  items.forEach((row) => {
    const link = row.querySelector('a');
    if (!link) return;
    link.classList.add('section-nav-link');

    // First cell may carry a marker word ("active" / "expand") authored in
    // the block; detect from row class or a leading flag cell.
    const flag = (row.textContent.match(/\[(active|expand|active expand|expand active)\]/i) || [])[1];
    if (flag) {
      // remove the flag text node if present
      row.childNodes.forEach((n) => {
        if (n.nodeType === Node.TEXT_NODE && /\[(active|expand)/i.test(n.textContent)) n.remove();
      });
    }

    const isActive = row.classList.contains('active') || /active/i.test(flag || '');
    const isExpand = row.classList.contains('expand') || /expand/i.test(flag || '');

    const item = document.createElement('div');
    item.className = 'section-nav-item';
    if (isActive) item.classList.add('is-active');

    if (isActive) link.classList.add('is-active');

    item.append(link);

    if (isExpand) {
      const chevron = document.createElement('span');
      chevron.className = 'section-nav-chevron';
      chevron.setAttribute('aria-hidden', 'true');
      chevron.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" focusable="false"><path fill="currentColor" d="M7 10l5 5 5-5z"/></svg>';
      item.append(chevron);
    }

    nav.append(item);
  });

  el.textContent = '';
  el.append(nav);
}
