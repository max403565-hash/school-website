/* Mo/Pelwatta Navodya Secondary Collage — shared app logic
   Plain JS only. No build step. Content is fetched from /content/*.json
   and re-rendered in full (header + footer + page body) on every
   language change, so nothing gets "stuck" in one language. */

const SITE = {
  lang: localStorage.getItem('pelwatta_lang') || localStorage.getItem('site_lang') || 'si',
  common: null,
  cache: {}
};

function getLang(){ return SITE.lang; }

function setLang(lang){
  SITE.lang = lang;
  localStorage.setItem('site_lang', lang);
  localStorage.setItem('pelwatta_lang', lang);
  document.documentElement.lang = lang;
  window.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
  if (typeof window.__renderCurrentPage === 'function') window.__renderCurrentPage();
}

/** Translate a {si,ta,en} object to the current language, falling back to Sinhala. */
function t(field){
  if (!field) return '';
  return field[SITE.lang] || field.si || field.en || '';
}

async function fetchJSON(url){
  if (SITE.cache[url]) return SITE.cache[url];
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to load ' + url);
  const data = await res.json();
  SITE.cache[url] = data;
  return data;
}

const DEFAULT_SITE_MENU = [
  { "id": "home", "href": "index.html", "label": { "si": "මුල් පිටුව", "ta": "முகப்பு", "en": "Home" }, "visible": true },
  { "id": "about", "href": "about.html", "label": { "si": "පාසල පිළිබඳව", "ta": "எங்களைப் பற்றி", "en": "About Us" }, "visible": true },
  { "id": "academic", "href": "academic.html", "label": { "si": "අධ්‍යයන අංශය", "ta": "கல்විப் பிரிவு", "en": "Academics" }, "visible": true },
  { "id": "student-life", "href": "student-life.html", "label": { "si": "ශිෂ්‍ය ජීවිතය", "ta": "மாணவர் வாழ்க்கை", "en": "Student Life" }, "visible": true },
  { "id": "gallery", "href": "gallery.html", "label": { "si": "ඡායාරූප", "ta": "படத்தொகுப்பு", "en": "Gallery" }, "visible": true },
  { "id": "news", "href": "news.html", "label": { "si": "පුවත් සහ නිවේදන", "ta": "செய்திகள் & நிகழ்வுகள்", "en": "News & Events" }, "visible": true },
  { "id": "admissions", "href": "admissions.html", "label": { "si": "ඇතුළත් වීම්", "ta": "சேர்க்கை", "en": "Admissions" }, "visible": true },
  { "id": "contact", "href": "contact.html", "label": { "si": "සම්බන්ධ කර ගැනීමට", "ta": "தொடர்புகளுக்கு", "en": "Contact Us" }, "visible": true },
  {
    "id": "more",
    "label": { "si": "තවත්", "ta": "மேலும்", "en": "More" },
    "visible": true,
    "children": [
      { "id": "notices", "href": "notices.html", "label": { "si": "නිවේදන සහ සිදුවීම්", "ta": "அறிவிப்புகள் & நிகழ்வுகள்", "en": "Notices & Events" }, "visible": true },
      { "id": "downloads", "href": "downloads.html", "label": { "si": "බාගත කිරීම්", "ta": "பதிவிறக்கங்கள்", "en": "Downloads" }, "visible": true },
      { "id": "sds", "href": "sds-parents.html", "label": { "si": "සංවර්ධන සමිතිය", "ta": "அபிவிருத்தி சங்கம்", "en": "SDS & Parents" }, "visible": true }
    ]
  }
];

async function loadCommon(){
  if (!SITE.common) {
    try {
      SITE.common = await fetchJSON('content/common.json');
    } catch (e) {
      SITE.common = {};
    }
  }
  if (!SITE.settings) {
    try {
      SITE.settings = await fetchJSON('content/settings.json');
    } catch (e) {
      SITE.settings = null;
    }
  }
  if (!SITE.menu) {
    try {
      SITE.menu = await fetchJSON('content/menu.json');
    } catch (e) {
      SITE.menu = DEFAULT_SITE_MENU;
    }
  }
  return SITE.common;
}

function getShortLang(lang){
  if (lang === 'si') return 'සිං';
  if (lang === 'ta') return 'த';
  return 'EN';
}

function renderHeader(common, currentKey){
  const menuData = (SITE.menu && Array.isArray(SITE.menu)) ? SITE.menu : DEFAULT_SITE_MENU;

  let navHTML = '';
  menuData.forEach(item => {
    if (item.visible === false) return;
    if (item.children && Array.isArray(item.children) && item.children.length > 0) {
      const visibleChildren = item.children.filter(c => c.visible !== false);
      if (!visibleChildren.length) return;
      const isGroupActive = visibleChildren.some(c => c.id === currentKey || c.href === `${currentKey}.html`);
      const childrenHTML = visibleChildren.map(c => {
        const isActive = c.id === currentKey || c.href === `${currentKey}.html`;
        return `<li><a href="${c.href}" class="submenu-link ${isActive ? 'active' : ''}">${t(c.label)}</a></li>`;
      }).join('');

      navHTML += `
        <li class="nav-item has-dropdown" id="nav-item-${item.id}">
          <button type="button" class="dropdown-toggle ${isGroupActive ? 'active' : ''}" data-group="${item.id}" aria-haspopup="true" aria-expanded="false">
            <span>${t(item.label)}</span> ▾
          </button>
          <ul class="nav-submenu" id="submenu-${item.id}">
            ${childrenHTML}
          </ul>
        </li>
      `;
    } else if (item.href) {
      const isActive = item.id === currentKey || item.href === `${currentKey}.html` || (currentKey === 'home' && item.href === 'index.html');
      navHTML += `<li class="nav-item"><a href="${item.href}" class="nav-link ${isActive ? 'active' : ''}">${t(item.label)}</a></li>`;
    }
  });

  const shortLabel = getShortLang(SITE.lang);

  const headerRoot = document.getElementById('site-header');
  if (!headerRoot) return;

  headerRoot.innerHTML = `
    <!-- Slim National School Notice Bar -->
    <div class="national-notice-bar">
      <div class="container">
        <span class="national-notice-text">${t(common.nationalSchoolNotice)}</span>
      </div>
    </div>

    <!-- Desktop Top Contact Strip (Hidden on Mobile < 768px) -->
    <div class="top-bar desktop-only-bar">
      <div class="container top-bar-inner">
        <ul class="top-contact-list">
          <li class="top-contact-item">
            <span>📍</span>
            <span>${t((SITE.settings && SITE.settings.address) || common.location)}</span>
          </li>
          <li class="top-contact-item">
            <span>📞</span>
            <span>${(SITE.settings && SITE.settings.phones && SITE.settings.phones[0]) || '+94 55 227 6234'}</span>
          </li>
          <li class="top-contact-item">
            <span>✉️</span>
            <span>${(SITE.settings && SITE.settings.email) || 'principal@pelwattacollege.sch.lk'}</span>
          </li>
        </ul>

        <div style="display:flex; align-items:center; gap:12px;">
          <button type="button" class="search-trigger-btn" aria-label="Search" title="Search" onclick="window.Pelwatta && window.Pelwatta.openSearch ? window.Pelwatta.openSearch() : openSearchOverlayApp()">🔍</button>
          <div class="lang-desktop-switch" role="group" aria-label="Language Selector">
            <button type="button" class="lang-btn ${SITE.lang==='si'?'active':''}" data-lang="si" aria-label="Sinhala">සිංහල</button>
            <button type="button" class="lang-btn ${SITE.lang==='ta'?'active':''}" data-lang="ta" aria-label="Tamil">தமிழ்</button>
            <button type="button" class="lang-btn ${SITE.lang==='en'?'active':''}" data-lang="en" aria-label="English">English</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Header Bar (ONE slim row on Mobile < 768px) -->
    <header class="site-header">
      <div class="container">
        <div class="brand-nav-bar header-row">
          <a class="brand brand-link" href="index.html" aria-label="Mo/Pelwatta Navodya Secondary College">
            <img src="images/crest.svg" alt="College Crest" class="crest-img" width="42" height="42">
            <div class="brand-text">
              <span class="brand-title name-si">${t((SITE.settings && SITE.settings.schoolName) || common.schoolName)}</span>
              <span class="brand-subtitle desktop-only-sub loc">${t((SITE.settings && SITE.settings.address) || common.location)}</span>
            </div>
          </a>

          <!-- Header Actions: Search + Mobile Lang Dropdown + Hamburger Toggle -->
          <div class="header-actions">
            <button type="button" class="search-trigger-btn" aria-label="Search" title="Search" onclick="window.Pelwatta && window.Pelwatta.openSearch ? window.Pelwatta.openSearch() : openSearchOverlayApp()">🔍</button>

            <div class="lang-mobile-dropdown" id="lang-mobile-dropdown">
              <button type="button" class="lang-dropdown-btn" id="mobile-lang-btn" aria-haspopup="true" aria-expanded="false" aria-label="Select Language">
                <span id="mobile-lang-label">${shortLabel} ▾</span>
              </button>
              <div class="lang-dropdown-menu" id="mobile-lang-menu" role="menu">
                <button type="button" class="lang-menu-item ${SITE.lang==='si'?'active':''}" data-lang="si" role="menuitem">සිංහල (Sinhala)</button>
                <button type="button" class="lang-menu-item ${SITE.lang==='ta'?'active':''}" data-lang="ta" role="menuitem">தமிழ் (Tamil)</button>
                <button type="button" class="lang-menu-item ${SITE.lang==='en'?'active':''}" data-lang="en" role="menuitem">English (English)</button>
              </div>
            </div>

            <button type="button" class="mobile-toggle menu-toggle" id="mobile-nav-toggle" aria-label="Toggle navigation menu" aria-expanded="false">
              ☰
            </button>
          </div>

          <nav class="main-nav" id="main-nav">
            <ul class="nav-menu" id="primary-nav-menu">${navHTML}</ul>
          </nav>
        </div>
      </div>
    </header>
  `;
  attachHeaderEvents();
}

function renderFooter(common){
  const f = common.footer;
  const footerRoot = document.getElementById('site-footer');
  if (!footerRoot) return;

  const s = SITE.settings || {};
  let socialHtml = '';
  if (s.facebookUrl || s.youtubeUrl || s.whatsappUrl) {
    socialHtml = '<div style="display:flex; gap:12px; margin-top:12px; align-items:center;">';
    if (s.facebookUrl) socialHtml += `<a href="${s.facebookUrl}" target="_blank" rel="noopener" style="color:var(--color-gold); font-size:1.1rem; text-decoration:none;">📘 Facebook</a>`;
    if (s.youtubeUrl) socialHtml += `<a href="${s.youtubeUrl}" target="_blank" rel="noopener" style="color:var(--color-gold); font-size:1.1rem; text-decoration:none;">▶️ YouTube</a>`;
    if (s.whatsappUrl) socialHtml += `<a href="${s.whatsappUrl}" target="_blank" rel="noopener" style="color:var(--color-gold); font-size:1.1rem; text-decoration:none;">💬 WhatsApp</a>`;
    socialHtml += '</div>';
  }

  footerRoot.innerHTML = `
    <div class="container">
      <div class="footer-grid">
        <div>
          <h4>${t((s.schoolName) || common.schoolName)}</h4>
          <p>${t((s.footerText) || f.freeSchoolNote)}</p>
          <div style="font-size:0.8125rem; color:#94a3b8; margin-top:0.75rem;">
            <p>Census No: 18452 · MoE Sri Lanka</p>
          </div>
          ${socialHtml}
        </div>
        <div>
          <h4>${t(f.quickLinksTitle)}</h4>
          <ul>
            <li><a href="index.html">${t(common.nav.home)}</a></li>
            <li><a href="about.html">${t(common.nav.about)}</a></li>
            <li><a href="academic.html">${t(common.nav.academic)}</a></li>
            <li><a href="student-life.html">${t(common.nav.studentlife)}</a></li>
            <li><a href="gallery.html">${t(common.nav.gallery)}</a></li>
            <li><a href="news.html">${t(common.nav.news)}</a></li>
            <li><a href="notices.html">${t(common.nav.notices || { si: 'නිවේදන සහ සිදුවීම්', ta: 'அறிவிப்புகள் & நிகழ்வுகள்', en: 'Notices & Events' })}</a></li>
          </ul>
        </div>
        <div>
          <h4>${t(f.legalTitle)}</h4>
          <ul>
            <li><a href="admissions.html">${t(common.nav.admissions)}</a></li>
            <li><a href="downloads.html">${t(f.downloadsLink)}</a></li>
            <li><a href="sds-parents.html">${t(f.sdsLink)}</a></li>
            <li><a href="privacy.html">${t(f.privacyLink)}</a></li>
            <li><a href="terms.html">${t(f.termsLink)}</a></li>
          </ul>
        </div>
        <div>
          <h4>${t(f.contactTitle)}</h4>
          <p>${t(common.location)}</p>
          <p style="margin-top:0.5rem;">📞 +94 55 227 6234</p>
          <p>✉️ info@pelwattacollege.sch.lk</p>
          <p style="margin-top:0.5rem; font-size:0.85rem;"><strong>${t(f.rti)}:</strong><br>${t(f.rtiName)}</p>
        </div>
      </div>
      <div class="footer-bottom">
        &copy; <span id="ftr-year"></span> ${t(common.schoolName)} — ${t(f.copyright)}
        <div style="font-size:0.75rem; opacity:0.85; margin-top:0.25rem;">Website developed by [S.A.Chanuk Mithuja ]</div>
      </div>
    </div>
  `;
  const yr = document.getElementById('ftr-year');
  if (yr) yr.textContent = new Date().getFullYear();
}

function attachHeaderEvents(){
  // Language button clicks
  document.querySelectorAll('[data-lang]').forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const lang = btn.getAttribute('data-lang');
      setLang(lang);
    };
  });

  // Mobile Language Dropdown Toggle
  const mobileLangBtn = document.getElementById('mobile-lang-btn');
  const mobileLangMenu = document.getElementById('mobile-lang-menu');
  if (mobileLangBtn && mobileLangMenu) {
    mobileLangBtn.onclick = (e) => {
      e.stopPropagation();
      const isOpen = mobileLangMenu.classList.toggle('open');
      mobileLangBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    };
  }

  // Mobile Navigation Toggle
  const toggle = document.getElementById('mobile-nav-toggle') || document.querySelector('.menu-toggle');
  const nav = document.getElementById('main-nav') || document.getElementById('primary-nav-menu');
  if (toggle && nav){
    toggle.onclick = (e) => {
      e.stopPropagation();
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    };

    // Close menu when tapping any link inside
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Dropdown Group Toggles (expandable groups on desktop & mobile)
  document.querySelectorAll('.dropdown-toggle').forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const parent = btn.closest('.has-dropdown');
      if (!parent) return;
      const submenu = parent.querySelector('.nav-submenu');
      const isOpen = parent.classList.toggle('open');
      if (submenu) submenu.classList.toggle('open', isOpen);
      btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    };
  });

  // Close dropdowns when clicking outside
  document.addEventListener('click', (e) => {
    if (mobileLangMenu && mobileLangMenu.classList.contains('open')) {
      if (!mobileLangMenu.contains(e.target) && e.target !== mobileLangBtn && !mobileLangBtn.contains(e.target)) {
        mobileLangMenu.classList.remove('open');
        if (mobileLangBtn) mobileLangBtn.setAttribute('aria-expanded', 'false');
      }
    }
    if (nav && nav.classList.contains('open')) {
      if (!nav.contains(e.target) && e.target !== toggle && !toggle.contains(e.target)) {
        nav.classList.remove('open');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
      }
    }
    document.querySelectorAll('.has-dropdown.open').forEach(parent => {
      if (!parent.contains(e.target)) {
        parent.classList.remove('open');
        const sub = parent.querySelector('.nav-submenu');
        if (sub) sub.classList.remove('open');
        const b = parent.querySelector('.dropdown-toggle');
        if (b) b.setAttribute('aria-expanded', 'false');
      }
    });
  });
}

/**
 * Every page calls this once. pageKey identifies the current nav item.
 * pageDataUrl is this page's own content JSON (or null if none).
 * renderBody(pageData, common) fills in the page-specific content and
 * is re-run in full on every language change — this is what keeps body
 * text in sync with the header, fixing the "half-translated" bug.
 */
async function initPage(pageKey, pageDataUrl, renderBody){
  document.documentElement.lang = SITE.lang;
  const common = await loadCommon();
  let pageData = null;
  if (pageDataUrl) pageData = await fetchJSON(pageDataUrl);

  window.__renderCurrentPage = () => {
    renderHeader(common, pageKey);
    renderFooter(common);
    if (renderBody) renderBody(pageData, common);
  };
  window.__renderCurrentPage();
}

/* Simple lightbox helper used by gallery.html */
function openLightbox(src, caption){
  let lb = document.getElementById('lightbox');
  if (!lb){
    lb = document.createElement('div');
    lb.id = 'lightbox';
    lb.className = 'lightbox';
    lb.innerHTML = `<button class="close" aria-label="Close">&times;</button><div><img id="lightbox-img" src=""><div class="cap" id="lightbox-cap"></div></div>`;
    document.body.appendChild(lb);
    lb.querySelector('.close').onclick = () => lb.classList.remove('open');
    lb.onclick = (e) => { if (e.target === lb) lb.classList.remove('open'); };
  }
  lb.querySelector('#lightbox-img').src = src;
  lb.querySelector('#lightbox-cap').textContent = caption || '';
  lb.classList.add('open');
}

function openSearchOverlayApp(){
  if (window.Pelwatta && window.Pelwatta.openSearch) {
    window.Pelwatta.openSearch();
    return;
  }
  // If common.js is not loaded, dynamically inject it or open overlay
  let s = document.createElement('script');
  s.src = 'js/common.js';
  s.onload = () => {
    if (window.Pelwatta && window.Pelwatta.openSearch) window.Pelwatta.openSearch();
  };
  document.body.appendChild(s);
}
