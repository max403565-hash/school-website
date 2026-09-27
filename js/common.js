/**
 * Mo/Pelwatta Navodya Secondary College
 * Common UI Components & Layout Controller
 * Injects top utility bar, sticky header with 3-zone contract, mobile drawer, and footer
 */

(function () {
  function renderLayout() {
    const headerContainer = document.getElementById('site-header-root');
    const footerContainer = document.getElementById('site-footer-root');

    const currentPath = window.location.pathname.split('/').pop() || 'index.html';

    const navItems = [
      { href: 'index.html', key: 'nav.home', defaultLabel: 'Home' },
      { href: 'about.html', key: 'nav.about', defaultLabel: 'About Us' },
      { href: 'academic.html', key: 'nav.academic', defaultLabel: 'Academic' },
      { href: 'student-life.html', key: 'nav.studentLife', defaultLabel: 'Student Life' },
      { href: 'gallery.html', key: 'nav.gallery', defaultLabel: 'Gallery' },
      { href: 'news.html', key: 'nav.news', defaultLabel: 'News & Events' },
      { href: 'admissions.html', key: 'nav.admissions', defaultLabel: 'Admissions' },
      { href: 'contact.html', key: 'nav.contact', defaultLabel: 'Contact Us' }
    ];

    if (headerContainer) {
      headerContainer.innerHTML = `
        <!-- Top Accessibility & Operational Utility Ribbon -->
        <div class="top-utility-bar" role="region" aria-label="Accessibility & Administrative Info">
          <div class="container top-utility-inner">
            <div class="top-utility-left">
              <span class="national-school-tag" data-i18n="common.nationalSchoolNote">
                Designated as a National School (Status pending formal gazette confirmation)
              </span>
            </div>
            <div class="top-utility-right">
              <div class="access-controls" style="display:flex; align-items:center; gap:4px;" aria-label="Text size and visual controls">
                <span style="font-size:0.75rem; color:#94A3B8; margin-right:4px;" data-i18n="common.accessibility">Accessibility:</span>
                <button type="button" class="access-control-btn btn-text-size" data-size="sm" title="Small Text">A-</button>
                <button type="button" class="access-control-btn btn-text-size active" data-size="md" title="Default Text">A</button>
                <button type="button" class="access-control-btn btn-text-size" data-size="lg" title="Large Text">A+</button>
                <button type="button" class="access-control-btn btn-contrast-toggle" title="Toggle High Contrast Mode" style="margin-left:6px;">
                  <span data-i18n="common.contrast">Contrast</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Sticky Site Header (3-Zone Top Bar Contract) -->
        <header class="site-header" role="banner">
          <div class="container header-container">
            <!-- Zone 1: Single Brand Lockup -->
            <a href="index.html" class="header-brand" aria-label="Mo/Pelwatta Navodya Secondary College Home">
              <img src="/images/crest.svg" alt="School Crest" class="header-crest" width="52" height="52" />
              <div class="header-brand-text">
                <span class="header-school-name" data-i18n="common.schoolName">
                  Mo/Pelwatta Navodya Secondary College
                </span>
                <span class="header-school-sub" data-i18n="common.subTitle">
                  Monaragala District, Uva Province · Sri Lanka
                </span>
              </div>
            </a>

            <!-- Zone 2: Navigation Links -->
            <nav class="header-nav" role="navigation" aria-label="Main Navigation">
              ${navItems.map(item => {
                const isActive = currentPath === item.href || (item.href === 'index.html' && currentPath === '');
                return `
                  <a href="${item.href}" class="nav-link ${isActive ? 'active' : ''}" data-i18n="${item.key}">
                    ${item.defaultLabel}
                  </a>
                `;
              }).join('')}
            </nav>

            <!-- Zone 3: Language Selector & Mobile Toggle -->
            <div class="header-actions">
              <div class="lang-switcher" role="group" aria-label="Select Language">
                <button type="button" class="lang-btn" data-lang="si" aria-label="Switch to Sinhala">සිං</button>
                <button type="button" class="lang-btn" data-lang="ta" aria-label="Switch to Tamil">த</button>
                <button type="button" class="lang-btn" data-lang="en" aria-label="Switch to English">EN</button>
              </div>

              <button type="button" class="menu-toggle" id="mobile-menu-open-btn" aria-label="Open Navigation Menu" aria-expanded="false" aria-controls="mobile-nav-drawer">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>
        </header>

        <!-- Mobile Navigation Drawer -->
        <div class="mobile-nav-backdrop" id="mobile-nav-backdrop" aria-hidden="true">
          <div class="mobile-nav-drawer" id="mobile-nav-drawer" role="dialog" aria-modal="true" aria-label="Navigation Menu">
            <div class="mobile-nav-header">
              <div style="display:flex; align-items:center; gap:8px;">
                <img src="/images/crest.svg" alt="Crest" width="36" height="36" />
                <span style="font-weight:700; font-size:0.9rem; color:#FFFFFF;" data-i18n="common.schoolName">
                  Pelwatta Navodya
                </span>
              </div>
              <button type="button" class="mobile-close-btn" id="mobile-menu-close-btn" aria-label="Close navigation menu">&times;</button>
            </div>

            <div style="margin-bottom:1.5rem; padding-bottom:1rem; border-bottom:1px solid rgba(255,255,255,0.1);">
              <span style="display:block; font-size:0.75rem; color:#94A3B8; margin-bottom:6px;">භාෂාව / மொழி / Language:</span>
              <div class="lang-switcher" style="width:100%; justify-content:space-around;">
                <button type="button" class="lang-btn" data-lang="si">සිංහල</button>
                <button type="button" class="lang-btn" data-lang="ta">தமிழ்</button>
                <button type="button" class="lang-btn" data-lang="en">English</button>
              </div>
            </div>

            <nav class="mobile-nav-links">
              ${navItems.map(item => {
                const isActive = currentPath === item.href || (item.href === 'index.html' && currentPath === '');
                return `
                  <a href="${item.href}" class="mobile-nav-link ${isActive ? 'active' : ''}" data-i18n="${item.key}">
                    ${item.defaultLabel}
                  </a>
                `;
              }).join('')}
            </nav>

            <div style="margin-top:auto; font-size:0.75rem; color:#94A3B8; line-height:1.5; border-top:1px solid rgba(255,255,255,0.1); padding-top:1rem;">
              <span data-i18n="common.freeSchoolBadge">
                Free Government School — Non-Fee-Charging Institution
              </span>
            </div>
          </div>
        </div>
      `;
    }

    if (footerContainer) {
      footerContainer.innerHTML = `
        <footer class="site-footer" role="contentinfo">
          <div class="container footer-top">
            <div class="footer-grid">
              <!-- Column 1: School Identity -->
              <div>
                <div style="display:flex; align-items:center; gap:12px; margin-bottom:1rem;">
                  <img src="/images/crest.svg" alt="School Crest" width="46" height="46" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.4));" />
                  <div>
                    <h3 style="color:#FFFFFF; font-size:1rem; font-weight:700;" data-i18n="common.schoolName">
                      Mo/Pelwatta Navodya Secondary College
                    </h3>
                    <p style="font-size:0.75rem; color:#FCD34D;" data-i18n="common.subTitle">
                      Monaragala District, Uva Province
                    </p>
                  </div>
                </div>
                <p style="color:#94A3B8; font-size:0.8125rem; line-height:1.6; margin-bottom:1rem;" data-i18n="footer.tagline">
                  Mo/Pelwatta Navodya Secondary College — A free, government-funded institution under the Ministry of Education, Sri Lanka.
                </p>
                <div style="font-size:0.75rem; color:#FEF08A; line-height:1.5; background:rgba(255,255,255,0.06); padding:8px 12px; border-left:3px solid var(--gold); border-radius:0 4px 4px 0;" data-i18n="footer.ministryAffiliation">
                  Governed under the Ministry of Education, Democratic Socialist Republic of Sri Lanka.
                </div>
              </div>

              <!-- Column 2: Quick Links -->
              <div>
                <h4 class="footer-col-title" data-i18n="footer.quickLinks">Quick Links</h4>
                <ul class="footer-links-list">
                  <li><a href="about.html" data-i18n="nav.about">About Us</a></li>
                  <li><a href="academic.html" data-i18n="nav.academic">Academic Sections & Exams</a></li>
                  <li><a href="admissions.html" data-i18n="nav.admissions">Admissions & Criteria</a></li>
                  <li><a href="student-life.html" data-i18n="nav.studentLife">Student Life & Societies</a></li>
                  <li><a href="gallery.html" data-i18n="nav.gallery">Photo Gallery</a></li>
                  <li><a href="news.html" data-i18n="nav.news">News & Circulars</a></li>
                </ul>
              </div>

              <!-- Column 3: Institutional & Parents -->
              <div>
                <h4 class="footer-col-title" data-i18n="footer.legalLinks">Governance & Policies</h4>
                <ul class="footer-links-list">
                  <li><a href="sds-parents.html" data-i18n="footer.sds">School Development Society (SDS)</a></li>
                  <li><a href="downloads.html" data-i18n="footer.downloads">Circulars & Downloads</a></li>
                  <li><a href="privacy.html" data-i18n="footer.privacy">Privacy Policy (PDPA Compliance)</a></li>
                  <li><a href="terms.html" data-i18n="footer.terms">Terms of Use & Disclaimer</a></li>
                </ul>
              </div>

              <!-- Column 4: Contact & RTI Information Officer -->
              <div>
                <h4 class="footer-col-title" data-i18n="nav.contact">Contact & RTI Desk</h4>
                <div class="footer-contact-item">
                  <span class="footer-contact-icon">📍</span>
                  <span style="font-size:0.8125rem;">Pelwatta, Buttala / Monaragala, Uva Province, Sri Lanka</span>
                </div>
                <div class="footer-contact-item">
                  <span class="footer-contact-icon">📞</span>
                  <span style="font-size:0.8125rem;">+94 (0) 55 227 3420</span>
                </div>
                <div class="footer-contact-item">
                  <span class="footer-contact-icon">✉️</span>
                  <span style="font-size:0.8125rem;">info@pelwattacollege.sch.lk</span>
                </div>
                <div style="margin-top:1rem; padding:8px 10px; background:rgba(255,255,255,0.05); border-radius:4px; font-size:0.75rem;">
                  <strong style="color:#FCD34D;" data-i18n="footer.rti">RTI Officer:</strong>
                  <div style="color:#CBD5E1;">Mr. S. M. Bandaranayake (Deputy Principal)</div>
                  <div style="color:#94A3B8;">rti@pelwattacollege.sch.lk · RTI Act No. 12 of 2016</div>
                </div>
              </div>
            </div>
          </div>

          <div class="footer-bottom">
            <div class="container footer-bottom-inner">
              <div>
                © 2026 Mo/Pelwatta Navodya Secondary College. <span data-i18n="footer.rights">All rights reserved.</span>
              </div>
              <div style="display:flex; align-items:center; gap:16px;">
                <span data-i18n="common.freeSchoolBadge">Free Government School</span>
                <span>·</span>
                <span data-i18n="common.nationalSchoolNote">Designated as a National School</span>
              </div>
            </div>
          </div>
        </footer>
      `;
    }

    // Attach Mobile Drawer Events
    setupDrawer();

    // Trigger i18n DOM translation pass
    if (window.i18n && window.i18n.applyDOM) {
      window.i18n.applyDOM();
    }
  }

  function setupDrawer() {
    const openBtn = document.getElementById('mobile-menu-open-btn');
    const closeBtn = document.getElementById('mobile-menu-close-btn');
    const backdrop = document.getElementById('mobile-nav-backdrop');

    if (!openBtn || !backdrop) return;

    function openMenu() {
      backdrop.classList.add('open');
      backdrop.setAttribute('aria-hidden', 'false');
      openBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      backdrop.classList.remove('open');
      backdrop.setAttribute('aria-hidden', 'true');
      openBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    openBtn.addEventListener('click', openMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);

    backdrop.addEventListener('click', e => {
      if (e.target === backdrop) closeMenu();
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && backdrop.classList.contains('open')) {
        closeMenu();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderLayout);
  } else {
    renderLayout();
  }
})();
