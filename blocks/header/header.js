const NAV_LOCAL = '/content/nav.plain.html';

function getNavPath() {
  const meta = document.querySelector('meta[name="header"]')?.content;
  if (meta) return meta.replace(/\.plain\.html$/, '');
  return '/nav';
}

async function fetchNav() {
  let resp = await fetch(NAV_LOCAL);
  if (!resp.ok) {
    resp = await fetch(`${getNavPath()}.plain.html`);
  }
  if (!resp.ok) return null;
  const html = await resp.text();
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp;
}

function buildPromo(section) {
  const wrapper = document.createElement('div');
  wrapper.className = 'nav-promo';
  const inner = document.createElement('div');
  inner.className = 'nav-promo-inner';
  const ps = [...section.querySelectorAll('p')];
  const textP = ps[0];
  const linkA = section.querySelector('a');
  if (textP) {
    const span = document.createElement('span');
    span.className = 'nav-promo-text';
    span.textContent = textP.textContent;
    inner.append(span);
  }
  if (linkA) {
    linkA.className = 'nav-promo-cta';
    inner.append(linkA);
  }
  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'nav-promo-close';
  close.setAttribute('aria-label', 'Close banner');
  close.innerHTML = '&times;';
  close.addEventListener('click', () => wrapper.remove());
  wrapper.append(inner, close);
  return wrapper;
}

function buildBrand(section) {
  const brand = document.createElement('div');
  brand.className = 'nav-brand';
  const link = section.querySelector('a');
  if (link) brand.append(link);
  return brand;
}

function buildSearch() {
  const form = document.createElement('form');
  form.className = 'nav-search';
  form.setAttribute('role', 'search');
  form.action = 'https://www.gct.com/tripsavailable';
  const input = document.createElement('input');
  input.type = 'search';
  input.name = 'q';
  input.placeholder = 'Search Destinations';
  input.setAttribute('aria-label', 'Search Destinations');
  const btn = document.createElement('button');
  btn.type = 'submit';
  btn.className = 'nav-search-btn';
  btn.setAttribute('aria-label', 'Search');
  btn.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false"><path fill="currentColor" d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 4.99L20.49 19l-4.99-5Zm-6 0A4.5 4.5 0 1 1 14 9.5 4.49 4.49 0 0 1 9.5 14Z"/></svg>';
  form.append(input, btn);
  return form;
}

function buildUtility(section) {
  const util = document.createElement('div');
  util.className = 'nav-utility';
  const links = [...section.querySelectorAll('a')];
  links.forEach((a) => {
    const href = a.getAttribute('href') || '';
    if (href.startsWith('tel:')) {
      a.className = 'nav-phone';
      a.insertAdjacentHTML('afterbegin', '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false"><path fill="currentColor" d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24 11.36 11.36 0 0 0 3.57.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.36 11.36 0 0 0 .57 3.57 1 1 0 0 1-.25 1.02l-2.2 2.2Z"/></svg> ');
    } else if (/\/sign-in/.test(href)) {
      a.className = 'nav-signin';
      a.insertAdjacentHTML('afterbegin', '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-3.34 0-10 1.67-10 5v3h20v-3c0-3.33-6.66-5-10-5Z"/></svg> ');
    } else {
      a.className = 'nav-register';
    }
  });
  const account = document.createElement('div');
  account.className = 'nav-account';
  const signin = links.find((a) => a.classList.contains('nav-signin'));
  const register = links.find((a) => a.classList.contains('nav-register'));
  const phone = links.find((a) => a.classList.contains('nav-phone'));
  if (phone) util.append(phone);
  if (signin) account.append(signin);
  if (signin && register) {
    const sep = document.createElement('span');
    sep.className = 'nav-account-sep';
    sep.textContent = '/';
    account.append(sep);
  }
  if (register) account.append(register);
  if (account.childNodes.length) util.append(account);
  return util;
}

function buildMainNav(section) {
  const nav = document.createElement('nav');
  nav.className = 'nav-main';
  nav.setAttribute('aria-label', 'Main');
  const list = section.querySelector('ul');
  if (list) {
    list.className = 'nav-main-list';
    [...list.querySelectorAll('li')].forEach((li) => {
      li.className = 'nav-main-item';
      const a = li.querySelector('a');
      if (a && /special offers/i.test(a.textContent)) {
        a.className = 'nav-cta';
        li.classList.add('nav-main-item-cta');
      } else if (a) {
        a.className = 'nav-main-link';
      } else if (li.textContent.trim()) {
        // Text-only item (dropdown trigger with chevron; no panel content on source).
        const span = document.createElement('span');
        span.className = 'nav-main-link nav-main-trigger';
        span.textContent = li.textContent.trim();
        const chevron = document.createElement('span');
        chevron.className = 'nav-chevron';
        chevron.setAttribute('aria-hidden', 'true');
        chevron.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" focusable="false"><path fill="currentColor" d="M7 10l5 5 5-5z"/></svg>';
        span.append(chevron);
        li.textContent = '';
        li.append(span);
      }
    });
    nav.append(list);
  }
  return nav;
}

export default async function init(el) {
  const nav = await fetchNav();
  if (!nav) return;
  const sections = [...nav.children].filter((c) => c.tagName === 'DIV');
  // sections: [0]=promo, [1]=brand, [2]=utility links, [3]=main nav list
  const promoSection = sections[0];
  const brandSection = sections[1];
  const utilSection = sections[2];
  const navSection = sections[3];

  el.textContent = '';

  if (promoSection) el.append(buildPromo(promoSection));

  // Two-column header bar: logo (left, spans both rows) + right column that
  // stacks the utility row (search/phone/account) above the main nav row.
  const bar = document.createElement('div');
  bar.className = 'nav-bar';
  const barInner = document.createElement('div');
  barInner.className = 'nav-bar-inner';

  if (brandSection) barInner.append(buildBrand(brandSection));

  // Hamburger toggle (mobile only; hidden on desktop via CSS).
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'nav-toggle';
  toggle.setAttribute('aria-label', 'Open menu');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.innerHTML = '<span class="nav-toggle-bar"></span><span class="nav-toggle-bar"></span><span class="nav-toggle-bar"></span>';

  const barRight = document.createElement('div');
  barRight.className = 'nav-bar-right';
  barRight.id = 'nav-bar-right';
  toggle.setAttribute('aria-controls', 'nav-bar-right');

  toggle.addEventListener('click', () => {
    const open = el.classList.toggle('nav-open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });

  const utilityRow = document.createElement('div');
  utilityRow.className = 'nav-utility-row';
  utilityRow.append(buildSearch());
  if (utilSection) utilityRow.append(buildUtility(utilSection));

  const navRow = document.createElement('div');
  navRow.className = 'nav-row';
  if (navSection) navRow.append(buildMainNav(navSection));

  barRight.append(utilityRow, navRow);
  barInner.append(toggle, barRight);
  bar.append(barInner);

  el.append(bar);
}
