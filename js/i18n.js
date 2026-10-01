/**
 * Mo/Pelwatta Navodya Secondary College - Trilingual Translation Engine
 * Zero dependencies, pure vanilla JavaScript for static GitHub Pages hosting.
 */
(function (window) {
  'use strict';

  const STORAGE_KEY = 'pelwatta_lang';
  const SUPPORTED_LANGS = ['si', 'ta', 'en'];
  const DEFAULT_LANG = 'si';

  let currentLang = DEFAULT_LANG;
  let translations = {};
  const listeners = [];

  function getSavedLanguage() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && SUPPORTED_LANGS.includes(saved)) {
        return saved;
      }
    } catch (e) {}
    return DEFAULT_LANG;
  }

  function setLanguage(lang) {
    if (!SUPPORTED_LANGS.includes(lang)) return;
    currentLang = lang;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {}

    // Update html lang and class
    document.documentElement.lang = lang;
    document.documentElement.className = `lang-${lang}`;

    // Update active state on language buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
      const btnLang = btn.getAttribute('data-lang');
      if (btnLang === lang) {
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
      }
    });

    translatePage();

    // Trigger registered change listeners
    listeners.forEach(fn => {
      try { fn(currentLang); } catch (err) { console.error('i18n listener error:', err); }
    });
  }

  function resolvePath(relPath) {
    if (!relPath) return '';
    if (relPath.startsWith('http://') || relPath.startsWith('https://') || relPath.startsWith('data:')) {
      return relPath;
    }
    // Remove leading slashes to force relative resolution
    return relPath.replace(/^\/+/, '');
  }

  async function fetchJSON(relativePath) {
    const clean = resolvePath(relativePath);
    const candidates = [clean, './' + clean, '../' + clean];

    for (const path of candidates) {
      try {
        const url = path + (path.includes('?') ? '&' : '?') + '_v=1.0';
        const res = await fetch(url);
        if (res.ok) {
          return await res.json();
        }
      } catch (e) {
        // try next candidate
      }
    }
    throw new Error(`Failed to load JSON resource: ${relativePath}`);
  }

  async function init() {
    currentLang = getSavedLanguage();
    document.documentElement.lang = currentLang;
    document.documentElement.className = `lang-${currentLang}`;

    try {
      translations = await fetchJSON('content/translations.json');
    } catch (e) {
      console.warn('translations.json could not be loaded directly:', e);
    }

    setLanguage(currentLang);
  }

  function getNestedTranslation(key, lang) {
    if (!translations || !key) return null;
    const parts = key.split('.');
    let cur = translations;
    for (const p of parts) {
      if (!cur || typeof cur !== 'object') return null;
      cur = cur[p];
    }
    if (cur && typeof cur === 'object') {
      return cur[lang] || cur['en'] || cur['si'] || null;
    }
    return null;
  }

  function translatePage() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const val = getNestedTranslation(key, currentLang);
      if (val) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = val;
        } else {
          el.textContent = val;
        }
      }
    });

    document.querySelectorAll('[data-i18n-attr]').forEach(el => {
      const spec = el.getAttribute('data-i18n-attr'); // e.g. "title:nav.home|aria-label:nav.home"
      spec.split('|').forEach(pair => {
        const [attr, key] = pair.split(':');
        const val = getNestedTranslation(key, currentLang);
        if (val) {
          el.setAttribute(attr, val);
        }
      });
    });
  }

  function pickLang(obj, lang) {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    const targetLang = lang || currentLang;
    return obj[targetLang] || obj['si'] || obj['en'] || obj['ta'] || '';
  }

  function onLanguageChange(fn) {
    if (typeof fn === 'function') {
      listeners.push(fn);
    }
  }

  window.i18n = {
    init,
    getLanguage: () => currentLang,
    setLanguage,
    translatePage,
    pickLang,
    fetchJSON,
    resolvePath,
    onLanguageChange
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})(window);
