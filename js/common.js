/**
 * Mo/Pelwatta Navodya Secondary College - Common Navigation and Layout
 * Generates unified trilingual header and footer with purely relative links.
 */
(function (window) {
  'use strict';

  function getCurrentPageName() {
    const path = window.location.pathname;
    const segments = path.split('/').filter(Boolean);
    const last = segments[segments.length - 1] || 'index.html';
    return last.split('?')[0].split('#')[0] || 'index.html';
  }

  function getRootPrefix() {
    // If running in subfolder like xk92m-manage/
    const path = window.location.pathname;
    if (path.includes('/xk92m-manage/')) {
      return '../';
    }
    return '';
  }

  function renderHeader() {
    const root = document.getElementById('site-header-root');
    if (!root) return;

    const prefix = getRootPrefix();
    const current = getCurrentPageName();

    const navItems = [
      { file: 'index.html', key: 'nav.home' },
      { file: 'about.html', key: 'nav.about' },
      { file: 'academic.html', key: 'nav.academics' },
      { file: 'student-life.html', key: 'nav.studentLife' },
      { file: 'gallery.html', key: 'nav.gallery' },
      { file: 'news.html', key: 'nav.news' },
      { file: 'admissions.html', key: 'nav.admissions' },
      { file: 'downloads.html', key: 'nav.downloads' },
      { file: 'sds-parents.html', key: 'nav.sds' },
      { file: 'contact.html', key: 'nav.contact' }
    ];

    const navLinksHtml = navItems.map(item => {
      const href = prefix + item.file;
      const isActive = current === item.file || (current === '' && item.file === 'index.html');
      return `
        <li class="nav-item">
          <a href="${href}" class="nav-link ${isActive ? 'active' : ''}" data-i18n="${item.key}"></a>
        </li>
      `;
    }).join('');

    root.innerHTML = `
      <header class="site-header">
        <div class="top-bar">
          <div class="container top-bar-inner">
            <ul class="top-contact-list">
              <li class="top-contact-item">
                <span>📍</span>
                <span data-i18n="topBar.location">Pelwatta, Monaragala, Sri Lanka</span>
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

            <div class="lang-switcher" aria-label="Language Selector">
              <button type="button" class="lang-btn" data-lang="si" aria-label="Sinhala">සිංහල</button>
              <button type="button" class="lang-btn" data-lang="ta" aria-label="Tamil">தமிழ்</button>
              <button type="button" class="lang-btn" data-lang="en" aria-label="English">English</button>
            </div>
          </div>
        </div>

        <div class="container">
          <div class="brand-nav-bar">
            <a href="${prefix}index.html" class="brand-link">
              <img src="${prefix}images/crest.svg" alt="College Crest" class="crest-img" />
              <div class="brand-text">
                <span class="brand-title" data-i18n="school.name">මො/පැල්වත්ත නවෝද්‍යා ද්විතීයික විද්‍යාලය</span>
                <span class="brand-subtitle" data-i18n="school.type">රජයේ ජාතික පාසලකි · මොනරාගල දිස්ත්‍රික්කය</span>
                <span class="brand-motto" data-i18n="school.motto">විද්‍යා දදාති විනයං</span>
              </div>
            </a>

            <button type="button" class="mobile-toggle" id="mobile-nav-toggle" aria-label="Toggle navigation menu">
              ☰
            </button>

            <nav>
              <ul class="nav-menu" id="primary-nav-menu">
                ${navLinksHtml}
              </ul>
            </nav>
          </div>
        </div>
      </header>
    `;

    // Attach Language Switcher Events
    root.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const lang = btn.getAttribute('data-lang');
        if (window.i18n && window.i18n.setLanguage) {
          window.i18n.setLanguage(lang);
        }
      });
    });

    // Mobile Navigation Toggle
    const toggle = document.getElementById('mobile-nav-toggle');
    const menu = document.getElementById('primary-nav-menu');
    if (toggle && menu) {
      toggle.addEventListener('click', () => {
        menu.classList.toggle('open');
      });
    }

    if (window.i18n && window.i18n.translatePage) {
      window.i18n.translatePage();
    }
  }

  function renderFooter() {
    const root = document.getElementById('site-footer-root');
    if (!root) return;

    const prefix = getRootPrefix();

    root.innerHTML = `
      <footer class="site-footer">
        <div class="container footer-grid">
          <div>
            <div style="display:flex; align-items:center; gap:0.75rem; margin-bottom:1rem;">
              <img src="${prefix}images/crest.svg" alt="Crest" style="width:48px; height:48px;" />
              <div>
                <h4 style="color:#ffffff; font-size:1.1rem; font-weight:800;" data-i18n="school.name">මො/පැල්වත්ත නවෝද්‍යා ද්විතීයික විද්‍යාලය</h4>
                <p style="color:var(--gold-light); font-size:0.8125rem; font-weight:600;" data-i18n="school.motto">විද්‍යා දදාති විනයං</p>
              </div>
            </div>
            <p style="color:#cbd5e1; font-size:0.875rem; line-height:1.6; margin-bottom:1rem;" data-i18n="footer.aboutText">
              ඌව පළාත් මොනරාගල අධ්‍යාපන කලාපයේ ප්‍රමුඛතම රජයේ පාසලක් වන මො/පැල්වත්ත නවෝද්‍යා ද්විතීයික විද්‍යාලය දරුවන්ගේ අධ්‍යාපන, ක්‍රීඩා හා සාරධර්ම සංවර්ධනය උදෙසා කැපවී ක්‍රියා කරයි.
            </p>
            <div style="font-size:0.8125rem; color:#94a3b8;">
              <p>🏛️ <strong>Mo/Pelwatta Navodya Secondary College</strong></p>
              <p>Census No: 18452 · MoE Sri Lanka</p>
            </div>
          </div>

          <div>
            <h4 class="footer-col-title" data-i18n="footer.linksTitle">ක්ෂණික සබැඳි</h4>
            <ul class="footer-links">
              <li><a href="${prefix}index.html" data-i18n="nav.home">මුල් පිටුව</a></li>
              <li><a href="${prefix}about.html" data-i18n="nav.about">පාසල පිළිබඳව</a></li>
              <li><a href="${prefix}academic.html" data-i18n="nav.academics">අධ්‍යයන අංශය</a></li>
              <li><a href="${prefix}student-life.html" data-i18n="nav.studentLife">ශිෂ්‍ය ජීවිතය</a></li>
              <li><a href="${prefix}gallery.html" data-i18n="nav.gallery">ඡායාරූප ගැලරිය</a></li>
              <li><a href="${prefix}news.html" data-i18n="nav.news">පුවත් සහ නිවේදන</a></li>
            </ul>
          </div>

          <div>
            <h4 class="footer-col-title" data-i18n="footer.servicesTitle">සේවාවන්</h4>
            <ul class="footer-links">
              <li><a href="${prefix}admissions.html" data-i18n="nav.admissions">ඇතුළත් වීම්</a></li>
              <li><a href="${prefix}downloads.html" data-i18n="nav.downloads">බාගත කිරීම්</a></li>
              <li><a href="${prefix}sds-parents.html" data-i18n="nav.sds">පාසල් සංවර්ධන සමිතිය</a></li>
              <li><a href="${prefix}contact.html" data-i18n="nav.contact">සම්බන්ධ කර ගැනීමට</a></li>
              <li><a href="${prefix}privacy.html" data-i18n="footer.privacy">පෞද්ගලිකත්ව ප්‍රතිපත්තිය</a></li>
              <li><a href="${prefix}terms.html" data-i18n="footer.terms">භාවිත නියමයන්</a></li>
            </ul>
          </div>

          <div>
            <h4 class="footer-col-title" data-i18n="footer.contactTitle">ලිපිනය හා සබඳතා</h4>
            <div style="font-size:0.875rem; color:#cbd5e1; line-height:1.7;">
              <p>📍 මො/පැල්වත්ත නවෝද්‍යා ද්විතීයික විද්‍යාලය,<br>පැල්වත්ත, බුත්තල (මොනරාගල පාර),<br>ශ්‍රී ලංකා.</p>
              <p style="margin-top:0.5rem;">📞 +94 55 227 6234</p>
              <p>✉️ info@pelwattacollege.sch.lk</p>
              <p style="margin-top:0.5rem; color:var(--gold-light);">🕒 සඳුදා - සිකුරාදා: පෙ.ව. 7:30 - ප.ව. 1:30</p>
            </div>
          </div>
        </div>

        <div class="footer-bottom">
          <div class="container" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem;">
            <div>
              &copy; 2026 Mo/Pelwatta Navodya Secondary College. All Rights Reserved.
            </div>
            <div>
              <span data-i18n="footer.freeEdu">ශ්‍රී ලංකා රජයේ නිදහස් අධ්‍යාපන සේවාවකි</span>
            </div>
          </div>
        </div>
      </footer>
    `;

    if (window.i18n && window.i18n.translatePage) {
      window.i18n.translatePage();
    }
  }

  function initLayout() {
    renderHeader();
    renderFooter();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLayout);
  } else {
    initLayout();
  }
})(window);
