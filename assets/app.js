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

async function loadCommon(){
  if (!SITE.common) SITE.common = await fetchJSON('content/common.json');
  return SITE.common;
}

function getShortLang(lang){
  if (lang === 'si') return 'සිං';
  if (lang === 'ta') return 'த';
  return 'EN';
}

function renderHeader(common, currentKey){
  const nav = common.nav;
  const navHTML = Object.keys(nav).map(key => {
    let href = 'index.html';
    if (key === 'about') href = 'about.html';
    else if (key === 'academic') href = 'academic.html';
    else if (key === 'studentlife') href = 'student-life.html';
    else if (key === 'gallery') href = 'gallery.html';
    else if (key === 'news') href = 'news.html';
    else if (key === 'admissions') href = 'admissions.html';
    else if (key === 'downloads') href = 'downloads.html';
    else if (key === 'contact') href = 'contact.html';
    else if (key === 'sds') href = 'sds-parents.html';
    else href = `${key}.html`;

    return `<li class="nav-item"><a href="${href}" class="nav-link ${key===currentKey?'active':''}">${t(nav[key])}</a></li>`;
  }).join('');

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
            <span>${t(common.location)}</span>
          </li>
          <li class="top-contact-item">
            <span>📞</span>
            <span>+94 55 227 6234</span>
          </li>
          <li class="top-contact-item">
            <span>✉️</span>
            <span>principal@pelwattacollege.sch.lk</span>
          </li>
        </ul>

        <div class="lang-desktop-switch" role="group" aria-label="Language Selector">
          <button type="button" class="lang-btn ${SITE.lang==='si'?'active':''}" data-lang="si" aria-label="Sinhala">සිංහල</button>
          <button type="button" class="lang-btn ${SITE.lang==='ta'?'active':''}" data-lang="ta" aria-label="Tamil">தமிழ்</button>
          <button type="button" class="lang-btn ${SITE.lang==='en'?'active':''}" data-lang="en" aria-label="English">English</button>
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
              <span class="brand-title name-si">${t(common.schoolName)}</span>
              <span class="brand-subtitle desktop-only-sub loc">${t(common.location)}</span>
            </div>
          </a>

          <!-- Header Actions: Mobile Lang Dropdown + Hamburger Toggle -->
          <div class="header-actions">
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

  footerRoot.innerHTML = `
    <div class="container">
      <div class="footer-grid">
        <div>
          <h4>${t(common.schoolName)}</h4>
          <p>${t(f.freeSchoolNote)}</p>
          <div style="font-size:0.8125rem; color:#94a3b8; margin-top:0.75rem;">
            <p>Census No: 18452 · MoE Sri Lanka</p>
          </div>
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
