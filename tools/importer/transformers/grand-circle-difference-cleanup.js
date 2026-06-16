/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: grand-circle-difference site-wide cleanup.
 *
 * Removes non-authorable site chrome so the import contains only page-level
 * authorable content (page hero H1 + six feature sections).
 *
 * All selectors below were verified against migration-work/cleaned.html
 * (source: https://pnamadobe.github.io/gcdifference/).
 */

const TransformHook = {
  beforeTransform: 'beforeTransform',
  afterTransform: 'afterTransform',
};

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Promo / sweepstakes banner that sits above the header.
    // Found in cleaned.html line 10:
    //   <div class="relative z-50 mb-1 bg-primary-70 text-white pb-1 last:pb-0">
    WebImporter.DOMUtils.remove(element, [
      'div.bg-primary-70.text-white',
    ]);

    // Empty in-page anchor target. Found line 8: <div id="top-page">
    WebImporter.DOMUtils.remove(element, ['#top-page']);

    // Left sub-navigation column inside <main> (the col-span-1 xl:col-span-3
    // sibling of the content column). Convert it into a `section-nav` block
    // table so it is preserved as page content (the active item + the two
    // expandable chevron items are encoded via leading flag text). This must
    // run in beforeTransform so the block table survives the global <nav>
    // removal in afterTransform.
    const subNavCol = element.querySelector('div.col-span-1.xl\\:col-span-3');
    if (subNavCol) {
      const navEl = subNavCol.querySelector('nav') || subNavCol;
      // Each top-level child is a nav entry: a link, or a wrapper containing
      // a button (expandable) + link.
      const entries = [];
      [...navEl.children].forEach((child) => {
        const a = child.matches('a') ? child : child.querySelector('a');
        if (!a) return;
        const href = a.getAttribute('href') || '';
        const text = a.textContent.replace(/\s+/g, ' ').trim();
        if (!text) return;
        const expandable = !!(child.querySelector('button') || child.matches('button'));
        // The active (current-page) item carries a standalone `active` class
        // and the larger `text-body-2xl` size — NOT the Tailwind `active:`
        // pseudo-class prefix that decorates every link.
        const cls = ` ${a.className} `;
        const active = /\sactive\s/.test(cls) || /text-body-2xl/.test(cls);
        entries.push({ href, text, expandable, active });
      });

      if (entries.length) {
        const { document } = payload;
        const rows = entries.map((e) => {
          const flags = [];
          if (e.active) flags.push('active');
          if (e.expandable) flags.push('expand');
          const cell = document.createElement('div');
          const flagText = flags.length ? `[${flags.join(' ')}] ` : '';
          const link = document.createElement('a');
          link.setAttribute('href', e.href);
          link.textContent = e.text;
          cell.append(document.createTextNode(flagText), link);
          return [cell];
        });
        const block = WebImporter.Blocks.createBlock(document, {
          name: 'section-nav',
          cells: rows,
        });
        // Place the section-nav block as the first element of <main>.
        const main = element.querySelector('main') || element;
        main.insertBefore(block, main.firstChild);
      }
      subNavCol.remove();
    }

    // Analytics / feature-flag tracking inputs (non-authorable).
    // Found lines 196-197 and 810:
    //   <input id="page-analytics">, <input id="analytics-user-status">,
    //   <input id="analytics-feature-flags">
    WebImporter.DOMUtils.remove(element, [
      '#page-analytics',
      '#analytics-user-status',
      '#analytics-feature-flags',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Global chrome: header (search, utility nav, main nav) and footer
    // (email signup, link columns, legal). Found lines 26 and 457.
    WebImporter.DOMUtils.remove(element, [
      'header',
      'footer',
      'nav',
    ]);

    // Leftover empty responsive <source> elements inside <picture> tags
    // (lines 303-306). The <img> is preserved for block parsing; the bare
    // <source> tags carry no authorable value.
    WebImporter.DOMUtils.remove(element, ['source']);
  }
}
