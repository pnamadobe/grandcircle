const FOOTER_LOCAL = '/content/footer.plain.html';

function getFooterPath() {
  const meta = document.querySelector('meta[name="footer"]')?.content;
  if (meta) return meta.replace(/\.plain\.html$/, '');
  return '/footer';
}

async function fetchFooter() {
  let resp = await fetch(FOOTER_LOCAL);
  if (!resp.ok) {
    resp = await fetch(`${getFooterPath()}.plain.html`);
  }
  if (!resp.ok) return null;
  const html = await resp.text();
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp;
}

const SOCIAL_ICONS = {
  facebook: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false"><path fill="currentColor" d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12Z"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false"><path fill="currentColor" d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05a3.75 3.75 0 0 1 3.38-1.86c3.61 0 4.28 2.38 4.28 5.47v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.55V9h3.57v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z"/></svg>',
};

function detectPlatform(href) {
  if (/facebook\./.test(href)) return 'facebook';
  if (/linkedin\./.test(href)) return 'linkedin';
  return null;
}

function buildLinkColumn(section) {
  const col = document.createElement('div');
  col.className = 'footer-col';
  const h = section.querySelector('h2');
  if (h) {
    const heading = document.createElement('p');
    heading.className = 'footer-col-heading';
    heading.textContent = h.textContent;
    col.append(heading);
  }
  const list = section.querySelector('ul');
  if (list) {
    list.className = 'footer-link-list';
    list.querySelectorAll('a').forEach((a) => a.classList.add('footer-link'));
    col.append(list);
  }
  return col;
}

function buildNewsletterColumn(section) {
  const col = document.createElement('div');
  col.className = 'footer-col footer-col-newsletter';

  const headings = [...section.querySelectorAll('h2')];
  const lists = [...section.querySelectorAll('ul')];

  // 1) Newsletter signup
  const nlHeading = document.createElement('p');
  nlHeading.className = 'footer-col-heading';
  nlHeading.textContent = headings[0] ? headings[0].textContent : '';
  col.append(nlHeading);

  const form = document.createElement('form');
  form.className = 'footer-newsletter';
  form.setAttribute('role', 'form');
  const input = document.createElement('input');
  input.type = 'email';
  input.name = 'email';
  input.placeholder = 'Email Address';
  input.setAttribute('aria-label', 'Email Address');
  const btn = document.createElement('button');
  btn.type = 'submit';
  btn.className = 'footer-newsletter-btn';
  btn.textContent = 'Sign-Up';
  form.append(input, btn);
  col.append(form);

  // 2) Travel Counselors (heading + phone list)
  if (headings[1]) {
    const tcHeading = document.createElement('p');
    tcHeading.className = 'footer-col-heading footer-col-heading-sub';
    tcHeading.textContent = headings[1].textContent;
    col.append(tcHeading);
  }
  if (lists[0]) {
    lists[0].className = 'footer-contact-list';
    const phone = lists[0].querySelector('a');
    if (phone) {
      phone.classList.add('footer-phone');
      phone.insertAdjacentHTML('afterbegin', '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false"><path fill="currentColor" d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24 11.36 11.36 0 0 0 3.57.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.36 11.36 0 0 0 .57 3.57 1 1 0 0 1-.25 1.02l-2.2 2.2Z"/></svg> ');
    }
    col.append(lists[0]);
  }

  // 3) Connect With Us (heading + social icons)
  if (headings[2]) {
    const cwHeading = document.createElement('p');
    cwHeading.className = 'footer-col-heading footer-col-heading-sub';
    cwHeading.textContent = headings[2].textContent;
    col.append(cwHeading);
  }
  if (lists[1]) {
    const social = document.createElement('div');
    social.className = 'footer-social';
    lists[1].querySelectorAll('a').forEach((a) => {
      const platform = detectPlatform(a.getAttribute('href') || '');
      a.className = 'footer-social-icon';
      a.setAttribute('aria-label', a.textContent.trim());
      a.textContent = '';
      if (platform && SOCIAL_ICONS[platform]) a.innerHTML = SOCIAL_ICONS[platform];
      social.append(a);
    });
    col.append(social);
  }

  return col;
}

function buildBrandColumn(section) {
  const col = document.createElement('div');
  col.className = 'footer-brand';
  [...section.children].forEach((node) => {
    if (node.querySelector && node.querySelector('img')) {
      node.querySelector('img').classList.add('footer-brand-logo');
    }
    col.append(node);
  });
  return col;
}

function buildFamilyColumn(section) {
  const col = document.createElement('div');
  col.className = 'footer-family';
  const h = section.querySelector('h2');
  if (h) {
    const heading = document.createElement('p');
    heading.className = 'footer-col-heading';
    heading.textContent = h.textContent;
    col.append(heading);
  }
  const list = section.querySelector('ul');
  if (list) {
    list.className = 'footer-link-list';
    list.querySelectorAll('a').forEach((a) => a.classList.add('footer-link'));
    col.append(list);
  }
  return col;
}

function buildAccreditationColumn(section) {
  const col = document.createElement('div');
  col.className = 'footer-accreditation';
  section.querySelectorAll('a').forEach((a) => {
    a.classList.add('footer-accreditation-logo');
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener');
    col.append(a);
  });
  return col;
}

function buildLegalColumn(section) {
  const col = document.createElement('div');
  col.className = 'footer-legal';
  const list = section.querySelector('ul');
  if (list) {
    list.className = 'footer-legal-list';
    list.querySelectorAll('a').forEach((a) => a.classList.add('footer-legal-link'));
    col.append(list);
  }
  return col;
}

export default async function init(el) {
  const frag = await fetchFooter();
  if (!frag) return;
  const sections = [...frag.children].filter((c) => c.tagName === 'DIV');
  // [0]=newsletter+counselors+social, [1..4]=link columns,
  // [5]=brand/address, [6]=family of brands, [7]=accreditation, [8]=legal
  el.textContent = '';
  el.classList.add('footer-dark');

  // ---- Top band ----
  const topBand = document.createElement('div');
  topBand.className = 'footer-band footer-band-top';
  const topInner = document.createElement('div');
  topInner.className = 'footer-band-inner footer-top-grid';
  if (sections[0]) topInner.append(buildNewsletterColumn(sections[0]));
  [1, 2, 3, 4].forEach((i) => { if (sections[i]) topInner.append(buildLinkColumn(sections[i])); });
  topBand.append(topInner);

  // ---- Bottom band ----
  const bottomBand = document.createElement('div');
  bottomBand.className = 'footer-band footer-band-bottom';
  const bottomInner = document.createElement('div');
  bottomInner.className = 'footer-band-inner footer-bottom-grid';
  if (sections[5]) bottomInner.append(buildBrandColumn(sections[5]));
  if (sections[6]) bottomInner.append(buildFamilyColumn(sections[6]));

  const rightCol = document.createElement('div');
  rightCol.className = 'footer-bottom-right';
  if (sections[7]) rightCol.append(buildAccreditationColumn(sections[7]));
  if (sections[8]) rightCol.append(buildLegalColumn(sections[8]));
  bottomInner.append(rightCol);

  bottomBand.append(bottomInner);

  // Divider between the two bands (matches the source's 1px divider section).
  const divider = document.createElement('div');
  divider.className = 'footer-divider';

  el.append(topBand, divider, bottomBand);
}
