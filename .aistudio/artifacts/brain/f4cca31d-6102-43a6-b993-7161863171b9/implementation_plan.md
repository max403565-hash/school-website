# Implementation Plan: Teacher-Friendly Admin Panel Extension & Governance

This plan outlines the architecture, data schemas, UI components, and safety controls to upgrade the administrative portal (`xk92m-manage/index.html`) for non-technical teachers and school staff at Mo/Pelwatta Navodya Secondary College.

---

## 1. User Review & Decision Points

- **Mode Switching Protection**: Simple Mode is the default. Switching to Advanced Mode (Code Editor, Import, Theme, Menu, History, Assistant Profile, Diagnostics) displays a safety warning dialog detailing the technical risks, and verifies the admin passphrase if configured.
- **Printable Collection Sheet**: Formats department owner worksheets (Principal's Office, Sectional Heads, Sports Master, IT Coordinator, Administration) with clean blank fill-in lines, checkboxes, signature blocks, and CSS `@media print` page breaks.
- **Photo Upload Standards**: Enforces client-side Canvas auto-resizing (max 1600×1200px) with JPEG/WebP compression, alongside a mandatory student parental consent verification checkbox.

---

## 2. Proposed Changes & Architecture

### Part 1: Admin Interface for Non-Technical Staff
- **Trilingual Localization**:
  - Update `content/admin-i18n.json` and client-side fallback dictionary with comprehensive translations across Sinhala, Tamil, and English.
  - Admin language switcher persists preference to `localStorage`.
- **Simple Mode vs. Advanced Mode Navigation**:
  - **Simple Mode (Default)**: Dashboard, News, Notices, Events, Gallery, Downloads, Pages, Site Settings, School Knowledge, Information Needed, Applications, AI Assistant.
  - **Advanced Mode**: Unlocks Code Editor, Import Site, Theme, Menu, Version History, Assistant Profile, Diagnostics.
  - Mode switch modal with explicit confirmation and safety warnings.
- **"Start Here" Setup Checklist**:
  - 10 auto-detected progress checks:
    1. GitHub Token connected & Passphrase active.
    2. School Details (name, address, motto) populated in `settings.json`.
    3. Official crest/logo verified.
    4. Principal message & official details provided.
    5. Official contact phone & email provided.
    6. Facebook & Google Maps links configured.
    7. First news item published in `news-items.json`.
    8. Gallery photos uploaded in `gallery-items.json`.
    9. Admissions Google Form URL linked in `admissions.json`.
    10. Trilingual coverage verified across all primary tabs.
  - Visual progress bar, percentage indicator, completion badges, and direct navigation buttons.
- **Inline Guidance & Contextual Help**:
  - Plain-language labels, required/optional indicators, and concrete examples for every input field.
  - Collapsible `❓` drawer populated from `content/admin-help.json`.
  - Built-in "User Guide" with actionable steps for publishing news, photo uploads, and disaster recovery.
- **Photo Consent & Canvas Auto-Resize**:
  - Auto-scales image uploads to max 1600×1200 via client-side HTML5 Canvas.
  - Displays recommended dimensions (hero: 1600×900, gallery: 1200×800, portrait: 600×600).
  - Mandatory parental consent checkbox (`#photo-consent-check`) disabling upload until acknowledged.

---

### Part 2: Information Needed System
- **Data Contract (`content/info-needs.json`)**:
  - Grouped by institutional section:
    - Principal's Office (principal message, vision, history milestone dates)
    - Sectional Heads (curriculum streams, subject baskets, exam results)
    - Sports Master (teams, achievements, annual sports meet records)
    - IT & Media Unit (school crest high-res, staff directory photos, campus photos)
    - School Development Society (SDS committee members, constitution summary)
  - Fields: `id`, `section`, `owner`, `title` (si/ta/en), `description`, `example`, `type` (`text`, `photo`, `document`, `date`), `priority` (`high`, `medium`, `low`).
- **Dynamic Content Audit**:
  - Auto-evaluates real content files (`settings.json`, `about.json`, `academic.json`, `sds.json`, `home.json`, etc.) to mark items as `done`, `placeholder`, or `missing`.
- **Information Needed Tab (`#tab-info-needs`)**:
  - Filter by section, owner, and status (`all`, `missing`, `done`).
  - Progress gauge showing institutional data completeness.
  - **"Print Collection Sheet"**: Formatted paper worksheet ready for staff room distribution with blank lines and signature areas.
  - **"Download CSV"**: Exports pending requirements to spreadsheet format.
  - **Missing Info Resolution Drawer**: Allows staff to input answers directly and commit to GitHub upon confirmation.

---

### Part 3: Editable Assistant Profile & Safety Core
- **Data Contract (`content/ai-assistant.json`)**:
  - Assistant Name & Purpose.
  - Scope Mode: `"website_only"` (default) vs. `"website_and_knowledge"`.
  - Permitted Task Types: Toggles for page creation, news drafting, translation, styling adjustments, content auditing.
  - Communication Tone & Language Rules.
  - Refusal Message & School-Specific Scope Rules.
  - Library of staff-editable reusable prompt templates.
- **Immutable Safety Core (Hardcoded Invariants)**:
  - Strict path protections: Disallow editing `xk92m-manage/`, `.github/`, `css/`, or `.env`.
  - Zero leakage of student applicant data or API tokens.
  - Change limits: Max 15 files per operation.
  - Mandatory pre-flight: Review diff + type "APPLY" + auto-create backup branch before commit.
  - Warning banner: *"This repository is public - never store private data here."*
- **Assistant Profile Tab (`#tab-asst-profile`)**:
  - Intuitive editing form with "Reset to Default" and "Test (Dry Run)" simulation panel.

---

### Part 4: Verification & Final QA
- Test all tabs on desktop (1440px) and mobile viewport (360px-390px).
- Verify zero dead buttons, no unhandled exceptions, and run built-in Self-Test.
- Update `BUILD-PROGRESS.md` under Phase 3 tracking all deliverables.
