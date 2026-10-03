/* Mo/Pelwatta Navodya Secondary Collage — shared app logic
   Plain JS only. No build step. Content is fetched from /content/*.json
   and re-rendered in full (header + footer + page body) on every
   language change, so nothing gets "stuck" in one language. */

const SITE = {
  lang: localStorage.getItem('site_lang') || 'si',
  common: null,
  cache: {}
};

function getLang(){ return SITE.lang; }

function setLang(lang){
  SITE.lang = lang;
  localStorage.setItem('site_lang', lang);
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

function langButtonsHTML(){
  const langs = [['si','සිං'],['ta','த'],['en','EN']];
  return langs.map(([code,label]) =>
    `<button class="${SITE.lang===code?'active':''}" data-lang="${code}" aria-pressed="${SITE.lang===code}">${label}</button>`
  ).join('');
}

function renderHeader(common, currentKey){
  const nav = common.nav;
  const navHTML = Object.keys(nav).map(key => {
    const href = key === 'home' ? 'index.html' : `${key === 'studentlife' ? 'student-life' : key}.html`;
    return `<li><a href="${href}" class="${key===currentKey?'current':''}">${t(nav[key])}</a></li>`;
  }).join('');

  document.getElementById('site-header').innerHTML = `
    <div class="notice-bar">
      <div class="container">
        <span>${t(common.nationalSchoolNotice)}</span>
        <div class="a11y-toolbar" aria-label="${t(common.a11y.label)}">
          <button data-fsize="-1">A-</button>
          <button data-fsize="0" aria-pressed="true">A</button>
          <button data-fsize="1">A+</button>
          <button data-contrast-toggle>${t(common.a11y.contrast)}</button>
        </div>
      </div>
    </div>
    <header class="site-header">
      <div class="container header-row">
        <a class="brand" href="index.html">
          <img src="images/crest-placeholder.svg" alt="School crest">
          <span>
            <span class="name-si">${t(common.schoolName)}</span><br>
            <span class="loc">${t(common.location)}</span>
          </span>
        </a>
        <div class="header-actions">
          <div class="lang-switch" role="group" aria-label="Language">${langButtonsHTML()}</div>
          <button class="menu-toggle" aria-label="Menu" aria-expanded="false">&#9776;</button>
        </div>
      </div>
      <nav class="main-nav" id="main-nav"><div class="container"><ul>${navHTML}</ul></div></nav>
    </header>
  `;
  attachHeaderEvents();
}

function renderFooter(common){
  const f = common.footer;
  document.getElementById('site-footer').innerHTML = `
    <div class="container">
      <div class="footer-grid">
        <div>
          <h4>${t(common.schoolName)}</h4>
          <p>${t(f.freeSchoolNote)}</p>
          <div class="lang-switch" role="group" aria-label="Language">${langButtonsHTML()}</div>
        </div>
        <div>
          <h4>${t(f.quickLinksTitle)}</h4>
          <ul>
            <li><a href="admissions.html">${t(common.nav.admissions)}</a></li>
            <li><a href="news.html">${t(common.nav.news)}</a></li>
            <li><a href="downloads.html">${t(f.downloadsLink)}</a></li>
            <li><a href="sds.html">${t(f.sdsLink)}</a></li>
          </ul>
        </div>
        <div>
          <h4>${t(f.legalTitle)}</h4>
          <ul>
            <li><a href="privacy.html">${t(f.privacyLink)}</a></li>
            <li><a href="terms.html">${t(f.termsLink)}</a></li>
          </ul>
        </div>
        <div>
          <h4>${t(f.contactTitle)}</h4>
          <p>${t(common.location)}</p>
          <p><strong>${t(f.rti)}:</strong><br>${t(f.rtiName)}</p>
          <div class="social-row">
            <a href="#" aria-label="Facebook">f</a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">&copy; <span id="ftr-year"></span> ${t(common.schoolName)} — ${t(f.copyright)}</div>
    </div>
  `;
  document.getElementById('ftr-year').textContent = new Date().getFullYear();
  attachHeaderEvents(); // footer also has language buttons
}

function attachHeaderEvents(){
  document.querySelectorAll('[data-lang]').forEach(btn=>{
    btn.onclick = () => setLang(btn.getAttribute('data-lang'));
  });
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.getElementById('main-nav');
  if (toggle && nav){
    toggle.onclick = () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    };
  }
  document.querySelectorAll('[data-fsize]').forEach(btn=>{
    btn.onclick = () => {
      const step = parseInt(btn.getAttribute('data-fsize'),10);
      let scale = parseFloat(localStorage.getItem('site_fontscale') || '1');
      scale = step === 0 ? 1 : Math.min(1.3, Math.max(0.9, scale + step*0.1));
      localStorage.setItem('site_fontscale', scale);
      document.documentElement.style.setProperty('--font-scale', scale);
      document.querySelectorAll('[data-fsize]').forEach(b=>b.setAttribute('aria-pressed','false'));
      btn.setAttribute('aria-pressed','true');
    };
  });
  const contrastBtn = document.querySelector('[data-contrast-toggle]');
  if (contrastBtn){
    contrastBtn.onclick = () => {
      const on = document.documentElement.getAttribute('data-contrast') === 'high';
      document.documentElement.setAttribute('data-contrast', on ? 'normal' : 'high');
      localStorage.setItem('site_contrast', on ? 'normal' : 'high');
    };
  }
}

function applyStoredA11yPrefs(){
  const scale = localStorage.getItem('site_fontscale');
  if (scale) document.documentElement.style.setProperty('--font-scale', scale);
  const contrast = localStorage.getItem('site_contrast');
  if (contrast === 'high') document.documentElement.setAttribute('data-contrast','high');
}

/**
 * Every page calls this once. pageKey identifies the current nav item.
 * pageDataUrl is this page's own content JSON (or null if none).
 * renderBody(pageData, common) fills in the page-specific content and
 * is re-run in full on every language change — this is what keeps body
 * text in sync with the header, fixing the "half-translated" bug.
 */
async function initPage(pageKey, pageDataUrl, renderBody){
  applyStoredA11yPrefs();
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
