/**
 * Mo/Pelwatta Navodya Secondary College
 * Trilingual Internationalization Engine (Sinhala / Tamil / English)
 * Accessibility Toolbar (Text Size & High Contrast Mode)
 * Unified Page Content Renderer & Lifecycle Manager
 */

(function () {
  const STORAGE_KEY_LANG = 'site_lang';
  const STORAGE_KEY_CONTRAST = 'site_contrast';
  const STORAGE_KEY_TEXT_SIZE = 'site_text_size';

  // Helper to reliably sanitize and resolve language parameter
  function resolveLang(lang) {
    if (typeof lang === 'string' && ['si', 'ta', 'en'].includes(lang)) {
      return lang;
    }
    if (lang && typeof lang === 'object') {
      if (lang.detail && typeof lang.detail.lang === 'string' && ['si', 'ta', 'en'].includes(lang.detail.lang)) {
        return lang.detail.lang;
      }
    }
    return currentLang || 'si';
  }

  // Strip Markdown syntax characters so they never display as raw characters
  function stripMarkdown(text) {
    if (!text) return '';
    return String(text)
      .replace(/\[(.*?)\]\([^)]*\)/g, '$1')
      .replace(/[*_~`#]/g, '')
      .trim();
  }

  // Render news title as an actual HTML link or styled heading with zero raw markdown syntax
  function renderTitleHtml(rawTitle, defaultHref = '#') {
    if (!rawTitle) return '';
    const str = String(rawTitle).trim();

    // Check if the title is in raw Markdown link syntax: [Title text](url)
    const exactMatch = str.match(/^\[(.*?)\]\((.*?)\)$/);
    if (exactMatch) {
      const text = stripMarkdown(exactMatch[1]);
      const href = exactMatch[2].trim() || defaultHref;
      return `<a href="${href}">${text}</a>`;
    }

    // Check if the title contains embedded Markdown links: ... [text](url) ...
    if (/\[(.*?)\]\((.*?)\)/.test(str)) {
      const firstLinkMatch = str.match(/\[(.*?)\]\((.*?)\)/);
      const primaryHref = firstLinkMatch ? (firstLinkMatch[2].trim() || defaultHref) : defaultHref;
      const cleanText = stripMarkdown(str);
      return `<a href="${primaryHref}">${cleanText}</a>`;
    }

    const clean = stripMarkdown(str);
    return `<a href="${defaultHref}">${clean}</a>`;
  }

  // Render inline markdown formatting (links, bold, italics) cleanly to HTML
  function renderMarkdown(text) {
    if (!text) return '';
    return String(text)
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>');
  }

  // Default to Sinhala per school requirement: "Default: Sinhala"
  let currentLang = localStorage.getItem(STORAGE_KEY_LANG) || 'si';
  if (!['si', 'ta', 'en'].includes(currentLang)) currentLang = 'si';

  let translationsCache = null;
  const contentCache = {};
  const pageRenderers = [];
  let isApplyingDOM = false;

  let readyResolve = null;
  const readyPromise = new Promise(resolve => {
    readyResolve = resolve;
  });

  // Accessibility State
  let highContrast = localStorage.getItem(STORAGE_KEY_CONTRAST) === 'high';
  let textSize = localStorage.getItem(STORAGE_KEY_TEXT_SIZE) || 'md';

  // Universal candidate-based JSON fetcher with caching
  async function fetchJSON(relativePath) {
    const clean = relativePath.replace(/^\/+/, '');
    if (contentCache[clean]) return contentCache[clean];

    const candidates = [
      '/' + clean,
      clean,
      './' + clean,
      '../' + clean
    ];

    for (const path of candidates) {
      try {
        const res = await fetch(path);
        if (res.ok) {
          const data = await res.json();
          contentCache[clean] = data;
          return data;
        }
      } catch (e) {
        // try next candidate
      }
    }
    console.warn('Could not fetch JSON from candidates:', relativePath);
    return null;
  }

  // Preload UI translations
  async function loadTranslations() {
    if (translationsCache) return translationsCache;
    const data = await fetchJSON('content/translations.json');
    if (data) {
      translationsCache = data;
      if (readyResolve) readyResolve(translationsCache);
      return translationsCache;
    }
    if (readyResolve) readyResolve({});
    return {};
  }

  const preloadPromise = loadTranslations();

  function getNestedValue(obj, keyPath) {
    if (!obj || !keyPath) return null;
    const parts = keyPath.split('.');
    let curr = obj;
    for (const part of parts) {
      if (curr && typeof curr === 'object' && part in curr) {
        curr = curr[part];
      } else {
        return null;
      }
    }
    return curr;
  }

  function pickLang(fieldObj, lang) {
    const targetLang = resolveLang(lang);
    if (!fieldObj) return '';
    if (typeof fieldObj === 'string') return fieldObj;
    if (typeof fieldObj === 'object') {
      if (fieldObj[targetLang]) return fieldObj[targetLang];
      if (fieldObj['si']) return fieldObj['si'];
      if (fieldObj['en']) return fieldObj['en'];
      if (fieldObj['ta']) return fieldObj['ta'];
      const values = Object.values(fieldObj);
      if (values.length > 0 && typeof values[0] === 'string') return values[0];
    }
    return '';
  }

  function applyLanguageDOM(lang = currentLang, dispatchEvent = true) {
    if (isApplyingDOM) return;
    isApplyingDOM = true;

    try {
      const activeLang = resolveLang(lang);
      currentLang = activeLang;
      document.documentElement.lang = activeLang;
      document.documentElement.classList.remove('lang-si', 'lang-ta', 'lang-en');
      document.documentElement.classList.add(`lang-${activeLang}`);

      // Update active state on all language switcher buttons across header/footer/drawers
      document.querySelectorAll('.lang-btn').forEach(btn => {
        const btnLang = btn.getAttribute('data-lang');
        if (btnLang === activeLang) {
          btn.classList.add('active');
          btn.setAttribute('aria-pressed', 'true');
        } else {
          btn.classList.remove('active');
          btn.setAttribute('aria-pressed', 'false');
        }
      });

      // Translate DOM elements marked with data-i18n
      if (translationsCache) {
        document.querySelectorAll('[data-i18n]').forEach(el => {
          const key = el.getAttribute('data-i18n');
          const val = getNestedValue(translationsCache, key);
          if (val) {
            const text = pickLang(val, activeLang);
            if (text) {
              el.textContent = text;
            }
          }
        });

        // Translate HTML elements marked with data-i18n-html
        document.querySelectorAll('[data-i18n-html]').forEach(el => {
          const key = el.getAttribute('data-i18n-html');
          const val = getNestedValue(translationsCache, key);
          if (val) {
            const html = pickLang(val, activeLang);
            if (html) {
              el.innerHTML = html;
            }
          }
        });

        // Translate attributes (placeholder, title, aria-label, etc.)
        document.querySelectorAll('[data-i18n-attr]').forEach(el => {
          const attrSpecs = el.getAttribute('data-i18n-attr').split(';');
          for (const spec of attrSpecs) {
            if (!spec.trim()) continue;
            const [attrName, key] = spec.split(':').map(s => s.trim());
            const val = getNestedValue(translationsCache, key);
            if (val) {
              const text = pickLang(val, activeLang);
              if (text) {
                el.setAttribute(attrName, text);
              }
            }
          }
        });
      }

      // Execute all registered page renderers with the active language
      for (const fn of pageRenderers) {
        try {
          fn(activeLang);
        } catch (err) {
          console.error('Error in registered page renderer:', err);
        }
      }
    } finally {
      isApplyingDOM = false;
    }

    if (dispatchEvent) {
      const event = new CustomEvent('languageChanged', { detail: { lang: currentLang } });
      window.dispatchEvent(event);
      document.dispatchEvent(event);
    }
  }

  async function setLanguage(lang) {
    const validLang = resolveLang(lang);
    currentLang = validLang;
    localStorage.setItem(STORAGE_KEY_LANG, validLang);
    await loadTranslations();
    applyLanguageDOM(validLang, true);
  }

  // Register page renderer function so it gets called automatically on language changes
  function registerPageRenderer(fn) {
    if (typeof fn !== 'function') return;
    if (!pageRenderers.includes(fn)) {
      pageRenderers.push(fn);
    }
    // Attempt an immediate render pass with current language
    try {
      fn(currentLang);
    } catch (e) {
      // Renderer will execute once its async data load completes
    }
  }

  // Re-trigger all renderers and DOM translation (called when page data finishes async fetch)
  function triggerRender() {
    applyLanguageDOM(currentLang, false);
    for (const fn of pageRenderers) {
      try {
        fn(currentLang);
      } catch (err) {
        console.error('Error in triggerRender registered page renderer:', err);
      }
    }
  }

  // Accessibility Toggles
  function setHighContrast(enable) {
    highContrast = enable;
    localStorage.setItem(STORAGE_KEY_CONTRAST, enable ? 'high' : 'normal');
    if (enable) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
    document.querySelectorAll('.btn-contrast-toggle').forEach(btn => {
      btn.classList.toggle('active', enable);
      btn.setAttribute('aria-pressed', enable ? 'true' : 'false');
    });
  }

  function setTextSize(size) {
    if (!['sm', 'md', 'lg'].includes(size)) size = 'md';
    textSize = size;
    localStorage.setItem(STORAGE_KEY_TEXT_SIZE, size);
    document.documentElement.classList.remove('text-size-sm', 'text-size-md', 'text-size-lg');
    document.documentElement.classList.add(`text-size-${size}`);
    document.querySelectorAll('.btn-text-size').forEach(btn => {
      const s = btn.getAttribute('data-size');
      btn.classList.toggle('active', s === size);
    });
  }

  // Initialization
  async function init() {
    if (highContrast) document.documentElement.classList.add('high-contrast');
    document.documentElement.classList.add(`text-size-${textSize}`);
    document.documentElement.lang = currentLang;
    document.documentElement.classList.add(`lang-${currentLang}`);

    await preloadPromise;
    applyLanguageDOM(currentLang, true);

    // Staggered deferred passes to guarantee elements rendered by common.js or async fetches get translated
    setTimeout(() => applyLanguageDOM(currentLang, false), 100);
    setTimeout(() => applyLanguageDOM(currentLang, false), 350);
    setTimeout(() => applyLanguageDOM(currentLang, false), 800);

    // Event delegation for language switcher buttons across whole document
    document.addEventListener('click', e => {
      const langBtn = e.target.closest('.lang-btn');
      if (langBtn) {
        e.preventDefault();
        const selectedLang = langBtn.getAttribute('data-lang');
        if (selectedLang) {
          setLanguage(selectedLang);
        }
      }

      // Accessibility text resize
      const sizeBtn = e.target.closest('.btn-text-size');
      if (sizeBtn) {
        e.preventDefault();
        const size = sizeBtn.getAttribute('data-size');
        setTextSize(size);
      }

      // Contrast toggle
      const contrastBtn = e.target.closest('.btn-contrast-toggle');
      if (contrastBtn) {
        e.preventDefault();
        setHighContrast(!highContrast);
      }
    });
  }

  // Expose API on window
  window.i18n = {
    getLanguage: () => currentLang,
    resolveLang,
    setLanguage,
    pickLang,
    stripMarkdown,
    renderTitleHtml,
    renderMarkdown,
    t: (key, lang = currentLang) => {
      const val = getNestedValue(translationsCache, key);
      return val ? pickLang(val, lang) : '';
    },
    loadTranslations,
    fetchJSON,
    registerPageRenderer,
    triggerRender,
    whenReady: () => (translationsCache ? Promise.resolve(translationsCache) : readyPromise),
    getTranslations: () => translationsCache,
    applyDOM: (lang) => applyLanguageDOM(lang || currentLang, false),
    setHighContrast,
    setTextSize,
    init
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
