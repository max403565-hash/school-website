/**
 * Mo/Pelwatta Navodya Secondary College - Common Layout & Navigation
 * Generates unified trilingual header, footer, search overlay, and settings binding.
 * Plain vanilla JS, zero libraries, purely relative paths.
 */
(function (window) {
  'use strict';

  function getCurrentPageName() {
    const path = window.location.pathname || '';
    const segments = path.split('/').filter(Boolean);
    let last = segments[segments.length - 1] || 'index.html';
    last = last.split('?')[0].split('#')[0];
    if (!last || last === 'school-website' || !last.includes('.')) {
      last = 'index.html';
    }
    return last;
  }

  function getRootPrefix() {
    const path = window.location.pathname || '';
    if (path.includes('/xk92m-manage/')) {
      return '../';
    }
    return '';
  }

  const DEFAULT_MENU = [
    {
      "id": "home",
      "href": "index.html",
      "label": { "si": "මුල් පිටුව", "ta": "முகப்பு", "en": "Home" },
      "visible": true
    },
    {
      "id": "about",
      "href": "about.html",
      "label": { "si": "පාසල පිළිබඳව", "ta": "எங்களைப் பற்றி", "en": "About Us" },
      "visible": true
    },
    {
      "id": "academic",
      "href": "academic.html",
      "label": { "si": "අධ්‍යයන", "ta": "கல்வி", "en": "Academics" },
      "visible": true
    },
    {
      "id": "student-life",
      "href": "student-life.html",
      "label": { "si": "ශිෂ්‍ය ජීවිතය", "ta": "மாணவர் வாழ்க்கை", "en": "Student Life" },
      "visible": true
    },
    {
      "id": "media",
      "label": { "si": "මාධ්‍ය සහ පුවත්", "ta": "ஊடகம்", "en": "Media" },
      "visible": true,
      "children": [
        {
          "id": "news",
          "href": "news.html",
          "label": { "si": "පුවත් සහ සිදුවීම්", "ta": "செய்திகள்", "en": "News & Events" },
          "visible": true
        },
        {
          "id": "notices",
          "href": "notices.html",
          "label": { "si": "නිවේදන", "ta": "அறிவிப்புகள்", "en": "Notices" },
          "visible": true
        },
        {
          "id": "gallery",
          "href": "gallery.html",
          "label": { "si": "ඡායාරූප ගැලරිය", "ta": "படத்தொகுப்பு", "en": "Photo Gallery" },
          "visible": true
        }
      ]
    },
    {
      "id": "admissions",
      "href": "admissions.html",
      "label": { "si": "ඇතුළත් වීම්", "ta": "சேர்க்கை", "en": "Admissions" },
      "visible": true
    },
    {
      "id": "contact",
      "href": "contact.html",
      "label": { "si": "සම්බන්ධ වන්න", "ta": "தொடர்பු", "en": "Contact Us" },
      "visible": true
    },
    {
      "id": "more",
      "label": { "si": "තවත්", "ta": "மேலும்", "en": "More" },
      "visible": true,
      "children": [
        {
          "id": "downloads",
          "href": "downloads.html",
          "label": { "si": "බාගත කිරීම් (PDF)", "ta": "பதிவிறக்கங்கள்", "en": "Downloads" },
          "visible": true
        },
        {
          "id": "sds",
          "href": "sds-parents.html",
          "label": { "si": "සංවර්ධන සමිතිය", "ta": "அபிவிருத்தி சங்கம்", "en": "SDS & Parents" },
          "visible": true
        }
      ]
    }
  ];

  const DEFAULT_SETTINGS = {
    schoolName: {
      si: "මො/පැල්වත්ත නවෝද්‍යා ද්විතීයික විද්‍යාලය",
      ta: "மொ/பெல்வத்தை நவோத்யா இரண்டாம் நிலை கல்லூரி",
      en: "Mo/Pelwatta Navodya Secondary College"
    },
    shortName: {
      si: "පැල්වත්ත නවෝද්‍යා විද්‍යාලය",
      ta: "பெல்வத்தை நவோத்யா கல்லூரி",
      en: "Pelwatta Navodya College"
    },
    motto: {
      si: "විද්‍යා දදාති විනයං",
      ta: "அறிவே ஒழுக்கத்தைத் தரும்",
      en: "Knowledge Imparts Discipline"
    },
    nationalStatus: {
      si: "ජාතික පාසලක් ලෙස නම් කර ඇත (නිල ගැසට් පත්‍රය නිකුත්වීමට යටත්ව පවතින තත්ත්වයකි)",
      ta: "தேசிய பாடசாலையாக அறிவிக்கப்பட்டுள்ளது (வர்த்தமானி அறிவித்தலுக்கு உட்பட்டது)",
      en: "Designated as a National School (Status subject to gazette notification)"
    },
    address: {
      si: "පැල්වත්ත, බුත්තල, මොනරාගල දිස්ත්‍රික්කය, ඌව පළාත, ශ්‍රී ලංකාව",
      ta: "பெல்வத்தை, புத்தள, மொணராகலை மாவட்டம், ஊவா மாகாணம், இலங்கை",
      en: "Pelwatta, Buttala, Monaragala District, Uva Province, Sri Lanka"
    },
    phones: ["+94 55 227 6234", "+94 55 227 6235"],
    email: "principal@pelwattacollege.sch.lk",
    officeHours: {
      si: "සඳුදා – සිකුරාදා: පෙ.ව. 7.30 – ප.ව. 1.30 (පාසල් වේලාවන්)",
      ta: "திங்கள் – வெள்ளி: மு.ப. 7.30 – பி.ப. 1.30 (பள்ளி நேரம்)",
      en: "Monday – Friday: 7:30 AM – 1:30 PM (School Hours)"
    },
    facebookUrl: "https://www.facebook.com/pelwattacollege",
    youtubeUrl: "https://www.youtube.com/@pelwattacollege",
    whatsappUrl: "https://wa.me/94552276234",
    googleMaps: {
      embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3961.884560768462!2d81.2580798!3d6.7839218!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae4402ea2aaab61%3A0xe54e612f0df702eb!2sPelwatta%20Navodya%20School!5e0!3m2!1sen!2slk!4v1710000000000!5m2!1sen!2slk",
      directionsUrl: "https://maps.google.com/?q=Pelwatta+Navodya+School+Monaragala"
    },
    footerText: {
      si: "මො/පැල්වත්ත නවෝද්‍යා ද්විතීයික විද්‍යාලය. සියලුම හිමිකම් ඇවිරිණි. ශ්‍රී ලංකා රජයේ නිදහස් ජාතික පාසලකි.",
      ta: "மொ/பெல்வத்தை நவோத்யா இரண்டாம் நிலை கல்லூரி. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை. இலங்கை அரச இலவச தேசிய பாடசாலை.",
      en: "Mo/Pelwatta Navodya Secondary College. All Rights Reserved. A Sri Lankan Government Free National School."
    },
    developerCredit: "Website developed by [S.A.Chanuk Mithuja ]"
  };

  let menuItems = DEFAULT_MENU;
  let siteSettings = DEFAULT_SETTINGS;

  function pickText(obj, lang) {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    return obj[lang] || obj['si'] || obj['en'] || '';
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function getShortLang(lang) {
    if (lang === 'si') return 'සිං';
    if (lang === 'ta') return 'த';
    return 'EN';
  }

  function getLang() {
    return (window.i18n && window.i18n.getLanguage)
      ? window.i18n.getLanguage()
      : (localStorage.getItem('pelwatta_lang') || localStorage.getItem('site_lang') || 'si');
  }

  function renderHeader() {
    const root = document.getElementById('site-header-root') || document.getElementById('site-header');
    if (!root) return;

    const prefix = getRootPrefix();
    const current = getCurrentPageName();
    const curLang = getLang();
    const shortLabel = getShortLang(curLang);

    const s = siteSettings || DEFAULT_SETTINGS;
    const schoolNameStr = pickText(s.schoolName, curLang);
    const mottoStr = pickText(s.motto, curLang);
    const nationalNoticeStr = pickText(s.nationalStatus, curLang);
    const addressStr = pickText(s.address, curLang);
    const phoneStr = (s.phones && s.phones.length > 0) ? s.phones[0] : '+94 55 227 6234';
    const emailStr = s.email || 'principal@pelwattacollege.sch.lk';

    let navLinksHtml = '';
    (menuItems || DEFAULT_MENU).forEach(item => {
      if (item.visible === false) return;
      if (item.children && Array.isArray(item.children) && item.children.length > 0) {
        const visibleChildren = item.children.filter(c => c.visible !== false);
        if (visibleChildren.length === 0) return;
        const isChildActive = visibleChildren.some(c => current === c.href);
        const childrenHtml = visibleChildren.map(c => {
          const href = prefix + c.href;
          const isActive = current === c.href;
          return `
            <li>
              <a href="${href}" class="submenu-link ${isActive ? 'active' : ''}">${escapeHtml(pickText(c.label, curLang))}</a>
            </li>
          `;
        }).join('');

        navLinksHtml += `
          <li class="nav-item has-dropdown" id="nav-item-${item.id}">
            <button type="button" class="dropdown-toggle ${isChildActive ? 'active' : ''}" data-group="${item.id}" aria-haspopup="true" aria-expanded="false">
              <span>${escapeHtml(pickText(item.label, curLang))}</span> <span class="arrow-indicator">▾</span>
            </button>
            <ul class="nav-submenu" id="submenu-${item.id}">
              ${childrenHtml}
            </ul>
          </li>
        `;
      } else if (item.href) {
        const href = prefix + item.href;
        const isActive = current === item.href || (current === '' && item.href === 'index.html');
        navLinksHtml += `
          <li class="nav-item">
            <a href="${href}" class="nav-link ${isActive ? 'active' : ''}">${escapeHtml(pickText(item.label, curLang))}</a>
          </li>
        `;
      }
    });

    root.innerHTML = `
      <header class="site-header">
        <!-- Slim National School Notice Bar -->
        <div class="national-notice-bar">
          <div class="container">
            <span class="national-notice-text">${escapeHtml(nationalNoticeStr)}</span>
          </div>
        </div>

        <!-- Desktop Top Contact Strip (Hidden on Mobile < 768px) -->
        <div class="top-bar desktop-only-bar">
          <div class="container top-bar-inner">
            <ul class="top-contact-list">
              <li class="top-contact-item">
                <span>📍</span>
                <span>${escapeHtml(addressStr)}</span>
              </li>
              <li class="top-contact-item">
                <span>📞</span>
                <a href="tel:${escapeHtml(phoneStr.replace(/[^0-9+]/g, ''))}" style="color:inherit; text-decoration:none;">${escapeHtml(phoneStr)}</a>
              </li>
              <li class="top-contact-item">
                <span>✉️</span>
                <a href="mailto:${escapeHtml(emailStr)}" style="color:inherit; text-decoration:none;">${escapeHtml(emailStr)}</a>
              </li>
            </ul>

            <div style="display:flex; align-items:center; gap:12px;">
              <!-- Search Trigger in Top Bar -->
              <button type="button" class="search-trigger-btn" aria-label="Search website" title="Search (සොයන්න / தேடு)">
                🔍
              </button>

              <!-- Language Segmented Buttons -->
              <div class="lang-desktop-switch" role="group" aria-label="Language Selector">
                <button type="button" class="lang-btn ${curLang === 'si' ? 'active' : ''}" data-lang="si" aria-label="Sinhala">සිංහල</button>
                <button type="button" class="lang-btn ${curLang === 'ta' ? 'active' : ''}" data-lang="ta" aria-label="Tamil">தமிழ்</button>
                <button type="button" class="lang-btn ${curLang === 'en' ? 'active' : ''}" data-lang="en" aria-label="English">English</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Header Bar (ONE slim row at any screen width, switches to hamburger < 1100px) -->
        <div class="brand-bar-wrapper">
          <div class="container">
            <div class="brand-nav-bar">
              <a href="${prefix}index.html" class="brand-link" aria-label="Mo/Pelwatta Navodya Secondary College">
                <img src="${prefix}images/crest.svg" alt="College Crest" class="crest-img" width="42" height="42" />
                <div class="brand-text">
                  <span class="brand-title">${escapeHtml(schoolNameStr)}</span>
                  <span class="brand-subtitle desktop-only-sub">${escapeHtml(addressStr)}</span>
                  <span class="brand-motto desktop-only-sub">${escapeHtml(mottoStr)}</span>
                </div>
              </a>

              <!-- Header Actions: Mobile Search + Compact Lang Dropdown + Hamburger Toggle -->
              <div class="header-actions">
                <button type="button" class="search-trigger-btn" aria-label="Search website" title="Search">
                  🔍
                </button>

                <div class="lang-mobile-dropdown" id="lang-mobile-dropdown">
                  <button type="button" class="lang-dropdown-btn" id="mobile-lang-btn" aria-haspopup="true" aria-expanded="false" aria-label="Select Language">
                    <span id="mobile-lang-label">${shortLabel} ▾</span>
                  </button>
                  <div class="lang-dropdown-menu" id="mobile-lang-menu" role="menu">
                    <button type="button" class="lang-menu-item ${curLang === 'si' ? 'active' : ''}" data-lang="si" role="menuitem">සිංහල (Sinhala)</button>
                    <button type="button" class="lang-menu-item ${curLang === 'ta' ? 'active' : ''}" data-lang="ta" role="menuitem">தமிழ் (Tamil)</button>
                    <button type="button" class="lang-menu-item ${curLang === 'en' ? 'active' : ''}" data-lang="en" role="menuitem">English (English)</button>
                  </div>
                </div>

                <button type="button" class="mobile-toggle" id="mobile-nav-toggle" aria-label="Toggle navigation menu" aria-expanded="false">
                  ☰
                </button>
              </div>

              <!-- Main Navigation Menu -->
              <nav class="nav-container" id="nav-container">
                <ul class="nav-menu" id="primary-nav-menu">
                  ${navLinksHtml}
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </header>
    `;

    attachHeaderEvents(root);
  }

  function switchLanguage(lang) {
    if (window.i18n && window.i18n.setLanguage) {
      window.i18n.setLanguage(lang);
    } else {
      localStorage.setItem('pelwatta_lang', lang);
      localStorage.setItem('site_lang', lang);
      document.documentElement.lang = lang;
      document.documentElement.className = `lang-${lang}`;
    }

    renderHeader();
    renderFooter();

    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
  }

  function attachHeaderEvents(root) {
    // Language clicks
    root.querySelectorAll('[data-lang]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const lang = btn.getAttribute('data-lang');
        switchLanguage(lang);
      });
    });

    // Mobile Language Dropdown Toggle
    const mobileLangBtn = root.querySelector('#mobile-lang-btn');
    const mobileLangMenu = root.querySelector('#mobile-lang-menu');
    if (mobileLangBtn && mobileLangMenu) {
      mobileLangBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = mobileLangMenu.classList.toggle('open');
        mobileLangBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });
    }

    // Document click to close mobile language dropdown
    document.addEventListener('click', () => {
      if (mobileLangMenu && mobileLangMenu.classList.contains('open')) {
        mobileLangMenu.classList.remove('open');
        if (mobileLangBtn) mobileLangBtn.setAttribute('aria-expanded', 'false');
      }
    });

    // Mobile Navigation Toggle
    const mobileNavToggle = root.querySelector('#mobile-nav-toggle');
    const navMenu = root.querySelector('#primary-nav-menu');
    if (mobileNavToggle && navMenu) {
      mobileNavToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = navMenu.classList.toggle('open');
        mobileNavToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        mobileNavToggle.textContent = isOpen ? '✕' : '☰';
      });

      // Close mobile menu when tapping a link inside
      navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          navMenu.classList.remove('open');
          mobileNavToggle.setAttribute('aria-expanded', 'false');
          mobileNavToggle.textContent = '☰';
        });
      });
    }

    // Dropdown toggles on mobile / focus
    root.querySelectorAll('.dropdown-toggle').forEach(btn => {
      btn.addEventListener('click', (e) => {
        if (window.innerWidth <= 1100) {
          e.preventDefault();
          e.stopPropagation();
          const parent = btn.closest('.has-dropdown');
          if (parent) {
            parent.classList.toggle('open');
            const isOpen = parent.classList.contains('open');
            btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
          }
        }
      });
    });

    // Search button triggers
    root.querySelectorAll('.search-trigger-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openSearchOverlay();
      });
    });
  }

  function renderFooter() {
    const root = document.getElementById('site-footer-root') || document.getElementById('site-footer');
    if (!root) return;

    const prefix = getRootPrefix();
    const curLang = getLang();
    const s = siteSettings || DEFAULT_SETTINGS;

    const schoolNameStr = pickText(s.schoolName, curLang);
    const mottoStr = pickText(s.motto, curLang);
    const addressStr = pickText(s.address, curLang);
    const hoursStr = pickText(s.officeHours, curLang);
    const phoneStr = (s.phones && s.phones.length > 0) ? s.phones[0] : '+94 55 227 6234';
    const emailStr = s.email || 'principal@pelwattacollege.sch.lk';
    const footerTextStr = pickText(s.footerText, curLang);
    const devCredit = s.developerCredit || "Website developed by [S.A.Chanuk Mithuja ]";

    // Social Links: show ONLY when URL is set
    let socialHtml = '';
    if (s.facebookUrl || s.youtubeUrl || s.whatsappUrl) {
      socialHtml = '<div style="display:flex; gap:12px; margin-top:12px; align-items:center;">';
      if (s.facebookUrl) {
        socialHtml += `<a href="${escapeHtml(s.facebookUrl)}" target="_blank" rel="noopener" style="color:var(--color-gold); font-size:1.1rem; text-decoration:none;" aria-label="Facebook">📘 Facebook</a>`;
      }
      if (s.youtubeUrl) {
        socialHtml += `<a href="${escapeHtml(s.youtubeUrl)}" target="_blank" rel="noopener" style="color:var(--color-gold); font-size:1.1rem; text-decoration:none;" aria-label="YouTube">▶️ YouTube</a>`;
      }
      if (s.whatsappUrl) {
        socialHtml += `<a href="${escapeHtml(s.whatsappUrl)}" target="_blank" rel="noopener" style="color:var(--color-gold); font-size:1.1rem; text-decoration:none;" aria-label="WhatsApp">💬 WhatsApp</a>`;
      }
      socialHtml += '</div>';
    }

    const freeEduText = (curLang === 'si')
      ? 'ශ්‍රී ලංකා රජයේ නිදහස් අධ්‍යාපන සේවාවකි'
      : (curLang === 'ta' ? 'இலங்கை அரச இலவச கல்வி சேவை' : 'Free Government Education Service of Sri Lanka');

    const quickLinksTitle = (curLang === 'si') ? 'ක්ෂණික සබැඳි' : (curLang === 'ta' ? 'விரைவு இணைப்புகள்' : 'Quick Links');
    const servicesTitle = (curLang === 'si') ? 'සේවාවන් හා නීතිමය' : (curLang === 'ta' ? 'சேவைகள்' : 'Services & Legal');
    const contactTitle = (curLang === 'si') ? 'ලිපිනය හා සබඳතා' : (curLang === 'ta' ? 'முகவரி மற்றும் தொடர்புகள்' : 'Address & Inquiries');

    root.innerHTML = `
      <footer class="site-footer">
        <div class="container footer-grid">
          <div>
            <div style="display:flex; align-items:center; gap:0.75rem; margin-bottom:1rem;">
              <img src="${prefix}images/crest.svg" alt="Crest" style="width:48px; height:48px;" />
              <div>
                <h4 style="color:#ffffff; font-size:1.1rem; font-weight:800; margin:0;">${escapeHtml(schoolNameStr)}</h4>
                <p style="color:var(--gold-light); font-size:0.8125rem; font-weight:600; margin:2px 0 0;">${escapeHtml(mottoStr)}</p>
              </div>
            </div>
            <p style="color:#cbd5e1; font-size:0.875rem; line-height:1.6; margin-bottom:1rem;">
              ${escapeHtml(footerTextStr)}
            </p>
            <div style="font-size:0.8125rem; color:#94a3b8;">
              <p style="margin:2px 0;">🏛️ <strong>Mo/Pelwatta Navodya Secondary College</strong></p>
              <p style="margin:2px 0;">Census No: 18452 · MoE Sri Lanka</p>
            </div>
            ${socialHtml}
          </div>

          <div>
            <h4 class="footer-col-title">${escapeHtml(quickLinksTitle)}</h4>
            <ul class="footer-links">
              <li><a href="${prefix}index.html">මුල් පිටුව / Home</a></li>
              <li><a href="${prefix}about.html">පාසල පිළිබඳව / About Us</a></li>
              <li><a href="${prefix}academic.html">අධ්‍යයන අංශය / Academics</a></li>
              <li><a href="${prefix}student-life.html">ශිෂ්‍ය ජීවිතය / Student Life</a></li>
              <li><a href="${prefix}gallery.html">ඡායාරූප ගැලරිය / Gallery</a></li>
              <li><a href="${prefix}news.html">පුවත් සහ නිවේදන / News & Events</a></li>
              <li><a href="${prefix}notices.html">නිවේදන සහ සිදුවීම් / Notices</a></li>
            </ul>
          </div>

          <div>
            <h4 class="footer-col-title">${escapeHtml(servicesTitle)}</h4>
            <ul class="footer-links">
              <li><a href="${prefix}admissions.html">ඇතුළත් වීම් / Admissions</a></li>
              <li><a href="${prefix}downloads.html">බාගත කිරීම් (PDF) / Downloads</a></li>
              <li><a href="${prefix}sds-parents.html">පාසල් සංවර්ධන සමිතිය / SDS</a></li>
              <li><a href="${prefix}contact.html">සම්බන්ධ කර ගැනීමට / Contact Us</a></li>
              <li><a href="${prefix}privacy.html">පෞද්ගලිකත්ව ප්‍රතිපත්තිය / Privacy</a></li>
              <li><a href="${prefix}terms.html">භාවිත නියමයන් / Terms</a></li>
            </ul>
          </div>

          <div>
            <h4 class="footer-col-title">${escapeHtml(contactTitle)}</h4>
            <div style="font-size:0.875rem; color:#cbd5e1; line-height:1.7;">
              <p style="margin:0;">📍 ${escapeHtml(addressStr)}</p>
              <p style="margin:0.5rem 0 0;">📞 <a href="tel:${escapeHtml(phoneStr.replace(/[^0-9+]/g, ''))}" style="color:inherit; text-decoration:none;">${escapeHtml(phoneStr)}</a></p>
              <p style="margin:2px 0;">✉️ <a href="mailto:${escapeHtml(emailStr)}" style="color:inherit; text-decoration:none;">${escapeHtml(emailStr)}</a></p>
              <p style="margin-top:0.5rem; color:var(--gold-light);">🕒 ${escapeHtml(hoursStr)}</p>
            </div>
          </div>
        </div>

        <div class="footer-bottom">
          <div class="container" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem;">
            <div>
              &copy; ${new Date().getFullYear()} ${escapeHtml(schoolNameStr)}. All Rights Reserved.
              <div style="font-size:0.75rem; opacity:0.85; margin-top:0.25rem;">${escapeHtml(devCredit)}</div>
            </div>
            <div>
              <span style="font-size:0.85rem; color:var(--gold-light);">${escapeHtml(freeEduText)}</span>
            </div>
          </div>
        </div>
      </footer>
    `;
  }

  // =========================================================================
  // PART 5 - SITE SEARCH OVERLAY SYSTEM
  // =========================================================================
  let searchIndex = null;
  let isSearchLoading = false;

  async function loadSearchIndex() {
    if (searchIndex) return searchIndex;
    if (isSearchLoading) return [];
    isSearchLoading = true;
    const prefix = getRootPrefix();
    const items = [];

    try {
      const menuRes = await fetch(prefix + 'content/menu.json?_v=' + Date.now()).catch(() => null);
      if (menuRes && menuRes.ok) {
        const menu = await menuRes.json();
        function indexMenu(list) {
          list.forEach(m => {
            if (m.href) {
              items.push({
                type: 'menu',
                typeLabel: { si: 'මෙනුව', ta: 'பட்டி', en: 'Menu' },
                title: m.label,
                snippet: m.label,
                href: prefix + m.href
              });
            }
            if (m.children) indexMenu(m.children);
          });
        }
        indexMenu(menu);
      }
    } catch (e) {}

    try {
      const newsRes = await fetch(prefix + 'content/news-items.json?_v=' + Date.now()).catch(() => null);
      if (newsRes && newsRes.ok) {
        const news = await newsRes.json();
        news.forEach(n => {
          items.push({
            type: 'news',
            typeLabel: { si: 'පුවත්', ta: 'செய்தி', en: 'News' },
            title: n.title,
            snippet: n.summary || n.content || n.title,
            href: prefix + `news-detail.html?id=${n.id}`
          });
        });
      }
    } catch (e) {}

    try {
      const noticesRes = await fetch(prefix + 'content/notices.json?_v=' + Date.now()).catch(() => null);
      if (noticesRes && noticesRes.ok) {
        const notices = await noticesRes.json();
        notices.forEach(n => {
          items.push({
            type: 'notice',
            typeLabel: { si: 'නිවේදන', ta: 'அறிவிப்பு', en: 'Notice' },
            title: n.title,
            snippet: n.content || n.title,
            href: prefix + 'notices.html'
          });
        });
      }
    } catch (e) {}

    try {
      const dlRes = await fetch(prefix + 'content/downloads/index.json?_v=' + Date.now()).catch(() => null);
      if (dlRes && dlRes.ok) {
        const dl = await dlRes.json();
        if (dl.documents) {
          dl.documents.forEach(d => {
            items.push({
              type: 'download',
              typeLabel: { si: 'බාගත කිරීම්', ta: 'பதிவிறக்கம்', en: 'PDF Download' },
              title: d.title,
              snippet: d.filename,
              href: prefix + 'downloads/' + d.filename
            });
          });
        }
      }
    } catch (e) {}

    try {
      const galRes = await fetch(prefix + 'content/gallery-items.json?_v=' + Date.now()).catch(() => null);
      if (galRes && galRes.ok) {
        const gal = await galRes.json();
        gal.forEach(g => {
          items.push({
            type: 'gallery',
            typeLabel: { si: 'ඡායාරූප', ta: 'படம்', en: 'Gallery' },
            title: g.caption || g.alt || { si: 'ඡායාරූපය', ta: 'படம்', en: 'Photo' },
            snippet: g.caption || g.alt,
            href: prefix + 'gallery.html'
          });
        });
      }
    } catch (e) {}

    try {
      const cpRes = await fetch(prefix + 'content/custom-pages.json?_v=' + Date.now()).catch(() => null);
      if (cpRes && cpRes.ok) {
        const cp = await cpRes.json();
        for (const p of cp) {
          if (p.published) {
            items.push({
              type: 'page',
              typeLabel: { si: 'අභිරුචි පිටුව', ta: 'பக்கம்', en: 'Page' },
              title: p.title,
              snippet: p.description || p.title,
              href: prefix + `page.html?p=${p.slug}`
            });
          }
        }
      }
    } catch (e) {}

    const corePages = [
      {
        title: { si: "මුල් පිටුව", ta: "முகப்பு", en: "Home" },
        snippet: { si: "පැල්වත්ත නවෝද්‍යා විද්‍යාලයේ නිල මුල් පිටුව සහ ප්‍රධාන තොරතුරු", ta: "பெல்வத்தை நவோதயா கல்லூரி பிரதான தளம்", en: "Official homepage of Mo/Pelwatta Navodya Secondary College" },
        href: prefix + "index.html"
      },
      {
        title: { si: "පාසල පිළිබඳව", ta: "எங்களைப் பற்றி", en: "About Us" },
        snippet: { si: "පාසලේ ඉතිහාසය, දැක්ම, මෙහෙවර, විදුහල්පතිතුමාගේ පණිවිඩය සහ පිහිටීම", ta: "பாடசாலை வரலாறு, பார்வை, பணி மற்றும் விபரங்கள்", en: "History, vision, mission, principal message, and location map" },
        href: prefix + "about.html"
      },
      {
        title: { si: "අධ්‍යයන අංශය", ta: "கல்விப் பிரிவு", en: "Academics" },
        snippet: { si: "කනිෂ්ඨ, සාමාන්‍ය පෙළ සහ උසස් පෙළ විද්‍යා, කලා, වාණිජ අධ්‍යයන අංශ", ta: "சாதாரண தரம் மற்றும் உயர்தர கல்வி பிரிவுகள்", en: "Junior secondary, O/L, and A/L Science, Arts, Commerce streams" },
        href: prefix + "academic.html"
      },
      {
        title: { si: "ශිෂ්‍ය ජීවිතය", ta: "மாணவர் வாழ்க்கை", en: "Student Life" },
        snippet: { si: "ක්‍රීඩා, සමිති සමාගම්, බාලදක්ෂ, පරිසර නියමු සහ විෂය සමගාමී ක්‍රියාකාරකම්", ta: "விளையாட்டு, சங்கங்கள், சாரணர் மற்றும் இணைப்பாடவிதான செயற்பாடுகள்", en: "Sports, societies, scouting, environmental pioneer, and co-curriculars" },
        href: prefix + "student-life.html"
      },
      {
        title: { si: "ඇතුළත් වීම්", ta: "சேர்க்கை", en: "Admissions" },
        snippet: { si: "නොමිලේ රජයේ පාසල් ඇතුළත් වීම්, චක්‍රලේඛ මාර්ගෝපදේශ සහ අයදුම්පත් ලියාපදිංචිය", ta: "இலவச அரசு பாடசாலை சேர்க்கை மற்றும் விண்ணப்பப் படிவம்", en: "Free government school admissions guidance and online application registration" },
        href: prefix + "admissions.html"
      },
      {
        title: { si: "සම්බන්ධ කර ගැනීමට", ta: "தொடர்புகளுக்கு", en: "Contact Us" },
        snippet: { si: "ලිපිනය, දුරකථන අංක, විද්‍යුත් තැපෑල, කාර්යාල වේලාවන්, තොරතුරු නිලධාරී (RTI) සහ සිතියම", ta: "முகவரி, தொலைபேசி, மின்னஞ்சல் மற்றும் அமைவிடம்", en: "School address, phone numbers, email, office hours, RTI officer, and Google map" },
        href: prefix + "contact.html"
      },
      {
        title: { si: "පාසල් සංවර්ධන සමිතිය (SDS)", ta: "பாடசாலை அபிவிருத்தி சங்கம்", en: "SDS & Parents" },
        snippet: { si: "දෙමාපිය, ගුරු සහ ආදි ශිෂ්‍ය සංගමය, සංවර්ධන ව්‍යාපෘති සහ සහයෝගීතාවය", ta: "பெற்றோர் ஆசிரியர் மற்றும் பழைய மாணவர் சங்கம்", en: "Parent, teacher, and alumni partnership, infrastructure projects, and termly meetings" },
        href: prefix + "sds-parents.html"
      }
    ];

    corePages.forEach(cp => {
      items.push({
        type: 'core',
        typeLabel: { si: 'ප්‍රධාන පිටුව', ta: 'முக்கிய பக்கம்', en: 'Main Page' },
        title: cp.title,
        snippet: cp.snippet,
        href: cp.href
      });
    });

    searchIndex = items;
    isSearchLoading = false;
    return searchIndex;
  }

  function ensureSearchOverlayDom() {
    let overlay = document.getElementById('site-search-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'site-search-overlay';
      overlay.className = 'search-overlay';
      overlay.innerHTML = `
        <div class="search-modal" role="dialog" aria-modal="true" aria-label="Search">
          <div class="search-modal-header">
            <span class="search-modal-icon">🔍</span>
            <input type="search" class="search-modal-input" id="search-modal-input" placeholder="පාසල් තොරතුරු සොයන්න / Search school website..." autocomplete="off">
            <button type="button" class="search-modal-close" id="search-modal-close" aria-label="Close search">✕</button>
          </div>
          <ul class="search-results-list" id="search-results-list"></ul>
        </div>
      `;
      document.body.appendChild(overlay);

      // Close handlers
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeSearchOverlay();
      });
      document.getElementById('search-modal-close').addEventListener('click', closeSearchOverlay);
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('open')) {
          closeSearchOverlay();
        }
      });

      // Input listener
      const input = document.getElementById('search-modal-input');
      input.addEventListener('input', () => {
        performSearch(input.value);
      });
    }
    return overlay;
  }

  function openSearchOverlay() {
    const overlay = ensureSearchOverlayDom();
    const curLang = getLang();
    const input = document.getElementById('search-modal-input');
    if (input) {
      input.placeholder = (curLang === 'si')
        ? 'පාසල් තොරතුරු සොයන්න (උදා: volleyball, විභාග, පුවත්)...'
        : (curLang === 'ta' ? 'தேடுக (எ.கா: volleyball, பரீட்சை)...' : 'Search school website (e.g. volleyball, exams, news)...');
      input.value = '';
    }
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(() => { if (input) input.focus(); }, 50);

    // Trigger lazy loading of search index
    loadSearchIndex().then(() => {
      performSearch('');
    });
  }

  function closeSearchOverlay() {
    const overlay = document.getElementById('site-search-overlay');
    if (overlay) {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  function highlightMatches(text, query) {
    if (!text) return '';
    if (!query) return escapeHtml(text);
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedQuery})`, 'gi');
    return escapeHtml(text).replace(regex, '<mark>$1</mark>');
  }

  async function performSearch(query) {
    const listEl = document.getElementById('search-results-list');
    if (!listEl) return;

    const trimmed = (query || '').trim().toLowerCase();
    const curLang = getLang();

    if (!searchIndex) {
      listEl.innerHTML = `<li class="search-no-results">${curLang === 'si' ? 'දත්ත පූරණය වෙමින් පවතී...' : 'Loading search index...'}</li>`;
      await loadSearchIndex();
    }

    if (!trimmed) {
      listEl.innerHTML = `
        <li style="padding:18px 14px; text-align:center; color:var(--color-gray-500); font-size:0.9rem;">
          ${curLang === 'si' ? 'සොයන වචනය ඇතුළත් කරන්න (සිංහල, தமிழ், හෝ English).' : (curLang === 'ta' ? 'தேடல் சொல்லை உள்ளிடவும்.' : 'Type a keyword to search across news, custom pages, downloads, and gallery.')}
        </li>
      `;
      return;
    }

    const matches = [];
    (searchIndex || []).forEach(item => {
      const titleStr = pickText(item.title, curLang);
      const snippetStr = pickText(item.snippet, curLang);
      const allText = (titleStr + ' ' + snippetStr + ' ' + pickText(item.title, 'en') + ' ' + pickText(item.title, 'si') + ' ' + pickText(item.title, 'ta')).toLowerCase();

      if (allText.includes(trimmed)) {
        matches.push({
          item,
          titleStr,
          snippetStr
        });
      }
    });

    if (matches.length === 0) {
      const noRes = (curLang === 'si')
        ? `"${escapeHtml(query)}" සඳහා කිසිදු ප්‍රතිඵලයක් හමු නොවීය.`
        : (curLang === 'ta' ? `"${escapeHtml(query)}" க்கான முடிவுகள் எதுவும் இல்லை.` : `No results found matching "${escapeHtml(query)}".`);
      listEl.innerHTML = `<li class="search-no-results">${noRes}</li>`;
      return;
    }

    listEl.innerHTML = matches.slice(0, 15).map(m => {
      const typeText = escapeHtml(pickText(m.item.typeLabel, curLang));
      const badgeClass = m.item.type === 'news' ? 'badge-maroon' : (m.item.type === 'notice' ? 'badge-warning' : (m.item.type === 'download' ? 'badge-gold' : 'badge-neutral'));
      const highlightedTitle = highlightMatches(m.titleStr, query);
      const highlightedSnippet = highlightMatches(m.snippetStr, query);

      return `
        <li>
          <a href="${escapeHtml(m.item.href)}" class="search-result-item" onclick="document.getElementById('site-search-overlay').classList.remove('open'); document.body.style.overflow='';">
            <div class="search-result-top">
              <span class="search-result-title">${highlightedTitle}</span>
              <span class="badge ${badgeClass}">${typeText}</span>
            </div>
            <div class="search-result-snippet">${highlightedSnippet}</div>
          </a>
        </li>
      `;
    }).join('');
  }

  // =========================================================================
  // DATA INITIALIZATION & LIFECYCLE
  // =========================================================================
  async function loadSettings() {
    try {
      const prefix = getRootPrefix();
      const res = await fetch(prefix + 'content/settings.json?_v=' + Date.now());
      if (res.ok) {
        const data = await res.json();
        if (data && typeof data === 'object') {
          siteSettings = Object.assign({}, DEFAULT_SETTINGS, data);
          renderHeader();
          renderFooter();
        }
      }
    } catch (e) {
      // Fallback remains DEFAULT_SETTINGS
    }
  }

  async function loadMenu() {
    try {
      const prefix = getRootPrefix();
      const res = await fetch(prefix + 'content/menu.json?_v=' + Date.now());
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          menuItems = data;
          renderHeader();
        }
      }
    } catch (e) {
      // Fallback remains DEFAULT_MENU
    }
  }

  function initLayout() {
    renderHeader();
    renderFooter();
    loadSettings();
    loadMenu();
  }

  // Global exports for pages
  window.Pelwatta = {
    getSettings: () => siteSettings,
    getMenu: () => menuItems,
    openSearch: openSearchOverlay,
    closeSearch: closeSearchOverlay
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLayout);
  } else {
    initLayout();
  }
})(window);
