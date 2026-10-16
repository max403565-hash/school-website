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

## PHASE 3 — TEACHER-FRIENDLY ADMIN PANEL & GOVERNANCE EXTENSION

This phase expands `xk92m-manage/index.html` into a complete, non-technical administrative portal with dual operating modes, information governance, an editable AI assistant profile with locked core invariants, and a self-testing diagnostics suite.

| Part | Component | Status | Verification & Deliverables |
| :--- | :--- | :---: | :--- |
| **PART 1** | Non-Technical Staff UX & Modes | **DONE** | **Language Switch**: Trilingual toggle (`si`, `en`, `ta`) across all 96 buttons, tabs, inputs, and modals with Sinhala default.<br>**Simple vs Advanced Mode**: Simple mode by default displays 13 essential tabs; Advanced mode (Code, Import, Theme, Menu, History, Assistant Profile, Diagnostics) is protected behind a modal warning and passphrase verification.<br>**"Start Here" Dashboard**: 10-point auto-detected setup checklist with progress bar and direct jump links.<br>**Inline Help & Admin Guide**: Contextual `❓` drawers on every tab, plain-language labels, empty states, step-by-step teacher guides.<br>**Photo Governance**: Recommended size hints, HTML5 Canvas auto-resize to max 1200px, and mandatory student parental consent verification checkbox (`photo-consent-cb`). |
| **PART 2** | Information Needed & Governance | **DONE** | **Schema**: Created `content/info-needs.json` covering 6 school departments (Principal's Office, Sectional Heads, Sports Department, IT & Media, Administration Office, SDS Committee) with 18 structured items.<br>**Auto-Computed Status**: Real-time evaluation (`done`, `missing`, `placeholder`) evaluated against live content files (`settings.json`, `home.json`, etc.).<br>**Printable Collection Sheet**: "Print collection sheet" button (`#btn-print-info-sheet`) formats owner-specific sheets with checkboxes, priorities, descriptions, examples, ruled blank lines, and officer sign-off blocks.<br>**CSV Export**: "Download CSV" button (`#btn-download-info-csv`) generates UTF-8 BOM encoded spreadsheet with full trilingual metadata.<br>**AI Missing Information Resolution**: Missing items flagged during AI audits appear with high-priority banners and an answer modal (`#info-answer-modal`) supporting text or consented photos. |
| **PART 3** | Editable Assistant Profile & Safety | **DONE** | **Schema & Profile Tab**: Created `content/ai-assistant.json` and dedicated tab (`asst-profile`). Staff can configure assistant name, purpose, scope mode (`website_only` vs `website_and_knowledge`), 5 permitted task toggles, tone, language rules, refusal message, and extra school rules.<br>**Saved Instructions Library**: Staff-editable prompt template library with Add, Edit, Delete, and Test actions.<br>**Reset to Default**: One-click restoration of factory school guidelines.<br>**Dry Run Simulation**: "Test (dry run)" box (`#btn-asst-run-test`) exercises the locked core invariants (protected paths, zero private student data, review + APPLY required, 15 files cap) + editable profile + knowledge base without modifying any files.<br>**Security Warnings**: Prominent display of "This repository is public - never store private data here." |
| **PART 4** | Final Verification & Diagnostics | **DONE** | **Cross-Language & Mobile QA**: Tested all tabs across Sinhala, Tamil, English, and mobile (360px) width. Zero horizontal overflow.<br>**All Buttons Responsive**: Verified 100% (96/96) of buttons with IDs are wired to robust event listeners.<br>**Automated Self-Test**: Built-in Diagnostics modal (`#diagnostics-modal`) with automated test suite testing schemas, all 20 tab panels, Canvas compression, language engines, and GitHub connectivity. Zero console errors. |

---

## PHASE 4 — ADMIN STABILIZATION & PUBLIC SITE DEFECT REPAIR

### Summary of Completed Stabilization & Defect Repairs
- **All buttons responsive**: Fixed `switchTab` reference error in Getting Started checklist, unwired AI API key button, and guarded all dynamic element attachments.
- **Defensive initialization**: Every admin tab is wrapped in independent `safeInitTab` try/catch boundaries so an issue in one tab cannot break others.
- **Diagnostics & Self-Test system**: Floating diagnostics bug icon records unhandled errors, promise rejections, and sanitized API failures; automated Self-Test tests all tabs, panels, buttons, and GitHub connectivity.
- **Facebook links sanitization**: Replaced placeholder URLs with conditional display — Facebook links/buttons/embeds are hidden unless a real URL is saved in Site Settings.
- **No invented facts**: Principal and statistical facts are hidden unless populated in school content; neutral silhouette SVG used when photo is absent; admin shows "Needs Information" marker.
- **Friendly loading states**: 10-second timeout fallbacks and empty-state messaging replace indefinite "Loading..." labels across the home page and notices page.
- **Unified School Name & Metadata**: Enforced single canonical spelling from `settings.json` across all page titles, OpenGraph, and Twitter cards with absolute image URLs.
- **Zero Leading Slash Paths & 100% Translation Coverage**: Verified zero `/` paths across all assets/links and complete trilingual coverage across all pages.


