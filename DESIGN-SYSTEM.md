# Mo/Pelwatta Navodya Secondary College — Design System Specification

## 1. Overview & Identity Principles
This design system provides a unified visual language and component architecture for the official trilingual web presence of **Mo/Pelwatta Navodya Secondary College**, Monaragala. It operates under a zero-build, plain HTML/CSS/JS paradigm optimized for GitHub Pages hosting, strict trilingual typography (Sinhala, Tamil, English), and full WCAG 2.1 AA accessibility.

---

## 2. Design Tokens (`:root`)

### 2.1 Color Palette
The color identity centers on Sri Lankan national academic heritage — Deep Maroon and Royal Gold, accented with high-contrast neutrals and accessible semantic feedback states.

| Token Name | Value | Purpose |
| :--- | :--- | :--- |
| `--color-maroon` | `#7a1c28` | Primary school brand color, main headers, button fills |
| `--color-maroon-dark` | `#58121b` | Top notice bar, high-contrast dark accents |
| `--color-maroon-light` | `#9a2b3b` | Hover states and subtle gradients |
| `--color-maroon-subtle` | `#fbf2f3` | Tinted background fills and active menu states |
| `--color-gold` | `#c99738` | Secondary brand accent, borders, crest highlights |
| `--color-gold-dark` | `#9e7323` | High-contrast gold text on light backgrounds |
| `--color-gold-light` | `#dfb55d` | Hover accents on dark banners |
| `--color-gold-subtle` | `#fdf8ed` | Light badge and notice card backgrounds |
| `--color-gray-50` | `#f8fafc` | Page canvas background |
| `--color-gray-100` | `#f1f5f9` | Section zebra fills and card borders |
| `--color-gray-200` | `#e2e8f0` | Standard UI borders and table dividers |
| `--color-gray-300` | `#cbd5e1` | Disabled controls and placeholder borders |
| `--color-gray-400` | `#94a3b8` | Muted icons and disabled text |
| `--color-gray-500` | `#64748b` | Captions and metadata text |
| `--color-gray-600` | `#475569` | Secondary body text |
| `--color-gray-700` | `#334155` | Primary body copy in high contrast |
| `--color-gray-800` | `#1e293b` | Dark container backgrounds |
| `--color-gray-900` | `#0f172a` | Primary headings and title copy |
| `--color-white` | `#ffffff` | Pure white cards and text inverse |

#### Semantic Feedback States
| Token Name | Background | Text / Border | Purpose |
| :--- | :--- | :--- | :--- |
| **Success** | `#f0fdf4` (`--color-success-bg`) | `#166534` (`--color-success-text`) / `#bbf7d0` | Verified admissions, published states, saved forms |
| **Warning** | `#fffbeb` (`--color-warning-bg`) | `#92400e` (`--color-warning-text`) / `#fde68a` | Draft previews, deadlines, notice callouts |
| **Error** | `#fef2f2` (`--color-error-bg`) | `#991b1b` (`--color-error-text`) / `#fecaca` | Form validation failures, 404 alerts, network errors |
| **Info** | `#f0f9ff` (`--color-info-bg`) | `#075985` (`--color-info-text`) / `#bae6fd` | Informational announcements, RTI disclosures |

---

### 2.2 Spacing Scale (8-point System)
Consistent layout rhythm based on proportional multiples of 4px and 8px:

| Token | Size | Common Usage |
| :--- | :--- | :--- |
| `--space-1` | `4px` | Badge padding, micro icon spacing, border radius |
| `--space-2` | `8px` | Button padding vertical, card internal gap, chip gap |
| `--space-3` | `12px` | Form input vertical padding, compact card padding |
| `--space-4` | `16px` | Standard button padding horizontal, container mobile gutter |
| `--space-6` | `24px` | Desktop card padding, standard section internal margins |
| `--space-8` | `32px` | Section header bottom spacing, hero vertical padding |
| `--space-12` | `48px` | Desktop section vertical spacing, large hero padding |
| `--space-16` | `64px` | Major page section separation on large displays |

---

### 2.3 Typography & Trilingual Line Heights
Base font size is strictly enforced at minimum **16px (`1rem`)** for readability without zooming.

- **Font Family Stack:**  
  `'Inter', 'Noto Sans Sinhala', 'Iskoola Pota', 'Sinhala Sangam MN', 'Noto Sans Tamil', 'Latha', 'Tamil Sangam MN', system-ui, -apple-system, sans-serif`
- **Body Line Height:** `1.7`
- **Sinhala & Tamil Script Line Height (`:lang(si)`, `:lang(ta)`):** `1.75` to prevent diacritic glyph clipping.

| Token | Size | Relative | Desktop Target | Usage |
| :--- | :--- | :--- | :--- | :--- |
| `--font-xs` | `0.75rem` | 12px | 12px | Metadata, badges, developer credit |
| `--font-sm` | `0.875rem` | 14px | 14px | Form help text, breadcrumb, table body |
| `--font-base` | `1.000rem` | 16px | 16px | Standard body paragraphs, inputs, buttons |
| `--font-lg` | `1.125rem` | 18px | 18px | Subheadings, card titles, intro leads |
| `--font-xl` | `1.250rem` | 20px | 20px | Major card headers, modal titles |
| `--font-2xl` | `1.500rem` | 24px | 24px | Section titles (`<h2>`) |
| `--font-3xl` | `1.875rem` | 30px | 30px | Page hero subheadings, featured banners |
| `--font-4xl` | `2.250rem` | 36px | 38px | Page Hero Title (`<h1>`) |

---

### 2.4 Border Radius & Elevation (Shadows)

- **Radius:**
  - `--radius-sm`: `4px` (Inputs, badges, micro tags)
  - `--radius-md`: `8px` (Buttons, small cards, dropdowns)
  - `--radius-lg`: `12px` (Standard cards, modals, hero banners)
  - `--radius-xl`: `16px` (Feature tiles, quick links)
  - `--radius-full`: `9999px` (Pill badges, circular buttons)
- **Shadows:**
  - `--shadow-sm`: `0 1px 3px rgba(0, 0, 0, 0.06)` (Subtle card border relief)
  - `--shadow-md`: `0 4px 12px -2px rgba(15, 23, 42, 0.08)` (Cards on hover, dropdowns)
  - `--shadow-lg`: `0 10px 25px -4px rgba(122, 28, 40, 0.12)` (Hero elements, modals)
  - `--shadow-xl`: `0 20px 30px -6px rgba(15, 23, 42, 0.15)` (Search modal, lightbox)

---

## 3. Core Shared Components

### 3.1 Buttons
- `.btn`: Base class setting inline-flex, minimum touch target (44px), centered alignment, 600 weight.
- `.btn-primary`: Maroon background (`#7a1c28`), white text, gold border on focus/hover.
- `.btn-secondary`: Light grey background (`#f1f5f9`), maroon text, border `#cbd5e1`.
- `.btn-ghost`: Transparent background, maroon border (`1px solid #7a1c28`), maroon text.
- `.btn-gold`: Rich gold background (`#c99738`), dark maroon text (`#58121b`), high prominence.

### 3.2 Cards
- `.card`: White background (`#ffffff`), border `1px solid var(--border)`, border-radius `var(--radius-lg)`, shadow `var(--shadow-sm)`.
- `.card-header`: Padding `var(--space-4)`, border-bottom `1px solid var(--border)`.
- `.card-body`: Padding `var(--space-6)`.
- `.card-footer`: Padding `var(--space-4)`, border-top `1px solid var(--border)`, subtle grey background.

### 3.3 Section Headers
- `.section-header`: Centered or left-aligned grouping for page sections.
- `.section-badge`: Pill badge (`.badge-gold`) indicating school category or section context.
- `.section-title`: `font-size: var(--font-2xl)`, bold, maroon color.
- `.section-subtitle`: `font-size: var(--font-base)`, muted gray, max-width 700px.

### 3.4 Page Hero Banner
- `.page-hero`: Gradient from maroon-dark (`#58121b`) to maroon (`#7a1c28`), bottom border `4px solid var(--color-gold)`.
- `.page-hero-title`: White `<h1>`, clamp(1.75rem, 4vw, 2.4rem), bold.
- `.page-hero-subtitle`: White 85% opacity, readable font size.

### 3.5 Badges
- `.badge`: Inline-block, padding 4px 10px, radius full, font size 0.75rem, font-weight 700.
- Variations: `.badge-maroon`, `.badge-gold`, `.badge-success`, `.badge-warning`, `.badge-error`, `.badge-neutral`.

### 3.6 Form Fields
- `.form-group`: Margin bottom `var(--space-4)`.
- `.form-label`: Block, font-weight 700, font-size 0.875rem, color `#0f172a`.
- `.form-input`, `.form-select`, `.form-textarea`: 100% width, min-height 44px, padding 10px 14px, border `1px solid var(--border)`, radius `var(--radius-md)`. Focus outline `2px solid var(--color-gold)`.
- `.form-check`: Flex container with checkbox and label, proper touch sizing.
- `.form-help`: Muted 0.8125rem text.
- `.form-error`: Red 0.8125rem text with alert indicator.

### 3.7 Tables
- `.table-container`: Responsive overflow-x auto wrapper with styled custom scrollbar.
- `.table`: 100% width, border-collapse collapse, alternating zebra rows (`#f8fafc`), maroon header row (`#7a1c28`) with white text.

### 3.8 Breadcrumb
- `.breadcrumb`: Clean inline trail with slash separator (`/`), relative links to parent pages, current page in bold muted text.

### 3.9 Site Header
- **Desktop (>= 1100px):** Single slim header row containing Crest + School Name (wrapped cleanly on two lines if needed) + Trilingual navigation items + Search button + Language switch.
- **Mobile (< 1100px):** Hamburger menu button toggling full-width drawer, preventing any double-row wrapping on screens 360px–1100px.

---

## 4. Responsive Breakpoints & Viewport Discipline
- **Phones (360px - 480px):** Single column cards, full width buttons, 14px container gutters, zero horizontal overflow (`overflow-x: clip`).
- **Tablets (481px - 768px):** Two column cards where appropriate, slim top notice bar.
- **Medium Screens (769px - 1099px):** Clean hamburger navigation, two or three column grid layouts.
- **Desktop (>= 1100px):** Full desktop top bar with contact details, full horizontal menu with dropdowns on hover/focus.
- **Max Container Width:** 1200px centered with automatic margins.
