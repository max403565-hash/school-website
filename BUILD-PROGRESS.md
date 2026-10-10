# Mo/Pelwatta Navodya Secondary College — Build Progress

This document tracks implementation status across the six major upgrade phases per system specification.

---

## Progress Overview

| Phase | Description | Status | Verification & Notes |
| :--- | :--- | :---: | :--- |
| **PART 1** | Design System & Token Standardization | **DONE** | Unified CSS variable tokens in `css/style.css` and `assets/style.css` (maroon & gold identity, 8-pt spacing, trilingual type scale, radius, shadows, container max 1200px). Rebuilt `admissions.html` with shared hero, cards, form components, alerts, and breadcrumbs while preserving Google Form submission. Removed accessibility toolbars. Created `DESIGN-SYSTEM.md` and `design-system.html`. |
| **PART 2** | Site Settings System | **DONE** | Created `content/settings.json` prefilled with real school data. Configured headers, footers, `contact.html`, and `about.html` maps to dynamically consume settings with fallbacks. Added "Site Settings" tab in admin panel (`xk92m-manage/index.html`) with Google Maps embed parser/validator (`https://www.google.com/maps/embed`) and sha-based GitHub API persistence. |
| **PART 3** | Menu and Page System (Public Site) | **DONE** | Grouped navigation into `content/menu.json` with single-row desktop layout, dropdown hover/focus support, and mobile accordion hamburger drawer. Built generic `page.html` block renderer reading `?p=<slug>` with safe DOM methods (zero innerHTML on user data) for 8 block types (heading, text, image, gallery, cards, table, links, embed). Whitelisted Facebook, YouTube, Google Maps embeds. Created `content/custom-pages.json` index and unpublished `content/custom-pages/sample.json`. Documented in `CONTENT-CONTRACT.md`. |
| **PART 4** | Admin: Pages and Menu Tabs | **DONE** | "Pages" tab (`custom-pages`) in `xk92m-manage/index.html` supports listing, new page creation with slug generation, block editor for all 8 types, Canvas image compression, and previewing (`page.html?p=slug`). "Menu" tab (`menu`) supports item reordering, visibility toggle, and dropdown creation with mandatory Home item enforcement. "Site Settings" tab (`settings`) allows full editing with confirmation prompts and Version History support. |
| **PART 5** | Site Search System | **DONE** | Search trigger button in header (desktop and mobile) opening search overlay modal. Lazy loads and caches content index across news, custom pages, page text, gallery captions, downloads, and navigation menu. Real-time trilingual filtering (Sinhala, Tamil, English) with `<mark>` keyword highlighting, type badges, keyboard accessibility (Esc to close), and mobile responsive display. |
| **PART 6** | Final Verification & Quality Assurance | **DONE** | Responsive layout tested for 360px, 390px, 768px, 1024px, 1100px, 1280px, and 1440px with zero sideways scrolling. Every link uses strictly relative paths (zero links starting with `/`). Language switching preserves URL path. 404 page base tag and Home button resolve correctly from any depth. Header never wraps into two rows. Admin panel tabs verified. |

---

## Detailed Part Breakdown

### Part 1 - Design System
- [x] Master tokens defined in `:root` in `css/style.css` and mirrored in `assets/style.css`.
- [x] Trilingual typography scale with base font $\ge$ 16px and line-height 1.7 (1.75 for Sinhala/Tamil).
- [x] Spacing scale (4, 8, 12, 16, 24, 32, 48, 64px) via `--space-1` to `--space-16`.
- [x] Shared components: `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.btn-gold`, `.card`, `.section-header`, `.page-hero`, `.badge`, `.form-group`, `.alert`, `.table-container`, `.table`, `.breadcrumb`, `.site-footer`.
- [x] `admissions.html` rebuilt to match visual hierarchy and shared tokens.
- [x] Created `design-system.html` (style guide, noindex, unlinked).
- [x] Created `DESIGN-SYSTEM.md` token specification.

### Part 2 - Site Settings
- [x] Created `content/settings.json` with trilingual school name, short name, motto, national status, address, phones, email, office hours, RTI officer, social links, Google Maps location, footer text, developer credit.
- [x] Public site headers, footers, `contact.html`, and `about.html` read from `content/settings.json` with fallback.
- [x] Google Maps embed validator enforces `https://www.google.com/maps/embed` and extracts `src` if iframe HTML is pasted.
- [x] Added "Site Settings" tab in `xk92m-manage/index.html` with sha-based GitHub API saving and confirmation dialog.

### Part 3 - Menu and Page System
- [x] Main navigation in `content/menu.json` grouped to fit ONE row on desktop: Home, About Us, Academics, Student Life, Media (News, Notices, Gallery), Admissions, Contact Us, More (Downloads, SDS).
- [x] Dropdown menus open on hover and keyboard focus (`focusin`/`focusout`).
- [x] Hamburger navigation switches on screens $< 1100$px to prevent double-row header wrapping.
- [x] `page.html` dynamic block renderer with safe DOM construction (`document.createElement`, `textContent`).
- [x] 8 block types supported: heading, text (markdown bold/links), image, gallery, cards (2 columns on mobile), table, links, embed.
- [x] Embed whitelist strictly enforced (Facebook, YouTube, Google Maps).
- [x] `content/custom-pages.json` index and unpublished `content/custom-pages/sample.json` created.
- [x] Documented in `CONTENT-CONTRACT.md`.

### Part 4 - Admin: Pages and Menu Tabs
- [x] "Pages" tab (`custom-pages`) in `xk92m-manage/index.html` with New Page drawer, slug validator, published toggle, block editor, and draft preview.
- [x] "Menu" tab (`menu`) with drag/button reordering, dropdown child groups, and mandatory Home link validation.
- [x] "Site Settings" tab (`settings`) with trilingual input controls and validation.
- [x] Version History supports `content/settings.json`, `content/menu.json`, and `content/custom-pages.json`.

### Part 5 - Site Search
- [x] Magnifying glass icon in desktop top bar and mobile header actions.
- [x] Fullscreen search modal overlay with backdrop filter blur.
- [x] Lazy loads content index on first search input.
- [x] Trilingual instant filtering across news, notices, custom pages, static pages, gallery captions, downloads, and navigation.
- [x] `<mark>` highlighting in titles and snippets with type badges.
- [x] Escape key, close button, and backdrop click close the modal.

### Part 6 - Final Check
- [x] Tested across 360px, 390px, 768px, 1024px, 1100px, 1280px, 1440px.
- [x] Zero links start with `/` (100% purely relative paths).
- [x] Language switching never alters URL path.
- [x] 404 page base tag and home button functional from any URL depth.
- [x] Admin panel backwards compatibility verified.

---

## PHASE 3 — TEACHER-FRIENDLY ADMIN PANEL UPGRADE

This phase transforms `xk92m-manage/index.html` into an accessible, bilingual/trilingual interface tailored for non-technical teachers, without any third-party scripts, frameworks, or backend requirements.

| Part | Component | Status | Verification & Deliverables |
| :--- | :--- | :---: | :--- |
| **PART 1** | Admin Interface Language Switch | **DONE** | Trilingual admin localization (`si`, `en`, `ta`) with Sinhala as default. Saved choice in `localStorage`. Technical words (GitHub, Token, Commit, Branch, Passphrase, Publish, Backup) retained in English alongside clear Sinhala/Tamil explanations. Stored in `content/admin-i18n.json` with client-side fallback dictionary. |
| **PART 2** | Getting Started Dashboard | **DONE** | First tab (`dashboard`) featuring an automated 9-point readiness checklist and dynamic progress bar. Detects GitHub connection, passphrase protection, Site Settings completion, Knowledge Base score, first news, photos, admissions form, site health, and optional AI key. Each item explains purpose and provides direct jump buttons. |
| **PART 3** | Contextual Help on Every Tab | **DONE** | Collapsible `❓` help panels on all tabs detailing purpose, required information with examples, common mistakes to avoid, public site verification links (`../index.html`, `../news.html`, etc.), and safe rollback steps. Powered by `content/admin-help.json` with trilingual glossary tooltips modal. |
| **PART 4** | School Knowledge Base & AI Assistant | **DONE** | School Knowledge tab (`knowledge`) displaying 8 institutional sections with status badges (Complete, Needs Review, Missing) and completeness percentage. Supports non-AI "Guided Questions" wizard, AI Assistant interview mode with public-repository warnings, configurable assistant settings in `content/assistant-config.json`, and clickable sample prompt previews. |
| **PART 5** | Activity Log & Safety Protections | **DONE** | "Activity" tab (`activity`) listing recent commits with friendly language, author, relative dates, and one-click forward-commit `Undo`. Global plain-language Safety Confirmation dialog (`safety-confirm-modal`) intercepting risky saves, publications, deletions, and restores. Live multi-viewport Preview panel (`preview`) supporting phone (375px), tablet (768px), and desktop (100%). |
| **PART 6** | Teacher User Guide & Print View | **DONE** | "User Guide" tab (`guide`) providing 8 step-by-step guides in current admin language (news publishing, gallery photos, custom pages, menu reordering, contact details, admissions, mistake rollback, expired tokens). Print-ready layout via `@media print` and "What's New" system changelog. |
| **PART 7** | Quality Assurance & Cross-Platform Testing | **DONE** | Verified on mobile (360px), tablet (768px), and desktop (1280px). Confirmed zero paths starting with `/` (100% relative `../` root paths). Backwards compatibility with all older tabs verified. Zero third-party dependencies or leaks. |

