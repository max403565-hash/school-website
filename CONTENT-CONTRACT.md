# Mo/Pelwatta Navodya Secondary College — Content & Architecture Contract

> **CRITICAL REFERENCE FOR DEVELOPERS & AI SYSTEMS**  
> This contract defines the exact data structures, file paths, integration rules, and operational requirements connecting the public website with the static administrative panel (`xk92m-manage/index.html`). Any new version, redesign, or refactoring of the website **must strictly abide by this contract** to ensure uninterrupted compatibility with the admin panel.
>
> **Core Constraint:** Do NOT change any file in `xk92m-manage/` or `.github/`. All changes must be fully backward-compatible with the admin panel.

---

## 1. Core Architectural Principles & Public Site Rules

1. **Pure Static GitHub Pages Architecture:**
   - **No build steps**, no bundlers (no Vite, Webpack, Parcel, Rollup), and no static-site generators / framework compilers (no Next.js, Nuxt, Astro, Gatsby, Hugo, Jekyll).
   - Plain, handwritten HTML5, CSS3, and vanilla ES6+ JavaScript only.
   - Deploys directly to GitHub Pages with no automated compilation pipeline.
   - If any external library is ever needed, it must run via CDN script tags (note: the admin panel itself loads zero external libraries for token security).
2. **Strictly Relative Paths Only:**
   - **Never** use leading slashes in `href`, `src`, or `fetch()` calls.
   - Correct: `href="css/style.css"`, `src="images/crest.svg"`, `fetch('content/common.json')`, `href="news.html"`.
   - Forbidden: `href="/css/style.css"`, `src="/images/crest.svg"`, `fetch('/content/common.json')`.
   - Subdirectories (e.g. `xk92m-manage/`) must resolve relative to repository root (`../`).
3. **Mandatory Trilingual Standard (No Monolingual Content):**
   - Every page, heading, paragraph, button, label, and navigation link must support all three official languages:
     - `si`: Sinhala (Default language: `<html lang="si" class="lang-si">`)
     - `ta`: Tamil (`lang="ta"`, `class="lang-ta"`)
     - `en`: English (`lang="en"`, `class="lang-en"`)
   - Never add English-only or Sinhala-only text to any public interface.
   - Data fields follow the trilingual standard object format:
     ```json
     {
       "si": "සිංහල පාඨය",
       "ta": "தமிழ் உரை",
       "en": "English text"
     }
     ```
4. **Complete Separation of Public & Administrative Interfaces:**
   - **Never** add any visible link, button, icon, or menu item referencing "Admin", "Login", "CMS", "Manage", or similar anywhere on public-facing pages.
   - The administrative control panel exists exclusively at the unlinked URL: `xk92m-manage/index.html`.
5. **Zero Paid Cloud Services / No Billing Accounts:**
   - Never suggest or add Firebase, Cloudflare Workers, Netlify Functions, AWS, or any service requiring a credit card or billing account.
   - All persistence operates client-side via the GitHub REST API (Contents API & Git Trees API) using a fine-grained Personal Access Token supplied by authorized school staff directly in their browser session.
6. **No Grievance / "Report a Concern" Systems:**
   - In accordance with school policy, do not include any "Report a Concern", complaint, or grievance-reporting feature. Contact channels are purely administrative (office phone, official email, physical address, RTI officer).
7. **Mandatory Developer Credit:**
   - Every page's footer must include the developer credit line in small text:
     `<div style="font-size:0.75rem; opacity:0.85;">Website developed by [S.A.Chanuk Mithuja ]</div>`
   - The HTML entry point (`index.html`) must contain the comment on line 1:
     `<!-- Website developed by [S.A.Chanuk Mithuja ] -->`

---

## 2. Inviolable & Protected Paths

The following paths and directories **must never be renamed, moved, overwritten, or deleted**:

| Path | Description | Protection & Operational Rules |
| :--- | :--- | :--- |
| `xk92m-manage/` | Static Administrative Control Panel | **PROTECTED PATH**: Contains `index.html` (the client-side CMS). Never touched, renamed, or deleted by the public site. Automatically skipped during site import. |
| `.github/` | GitHub Actions / Pages Workflows | **PROTECTED PATH**: Contains repository automation. Never touched, renamed, or deleted. Automatically skipped during site import. |
| `images/` | Uploaded Photos & Visual Emblems | Managed by admin panel. Uploaded binary images (`news-*.jpg`, `gallery-*.jpg`) and official SVG crests are written here. |
| `downloads/` | Official PDFs & Circulars | Managed by admin panel. Uploaded academic calendars, exam timetables, and ministry circulars are written here. |
| `content/` | Content JSON Files & Schemas | Structured data consumed by public pages and edited by the admin panel. All files must maintain their exact key paths. |

---

## 3. Admin Panel Tab-to-File Integration Matrix

The administrative panel (`xk92m-manage/index.html`) operates directly on the GitHub repository. The table below lists each tab, its target files, and what it expects:

| Tab Title | Tab Selector | Target Files & Directories | Admin Expectations & Formats |
| :--- | :--- | :--- | :--- |
| **News & Events** | `data-tab="news"` | Reads & writes `content/news-items.json`<br>Writes images to `images/news-[timestamp]-[idx].jpg` | • Expects a JSON array of news objects.<br>• Compresses uploaded photos to max 1200px JPEG (quality 0.82) via client-side canvas.<br>• Commits back to `content/news-items.json` via GitHub Contents API. |
| **Gallery** | `data-tab="gallery"` | Reads & writes `content/gallery-items.json`<br>Writes images to `images/gallery-[timestamp]-[idx].jpg` | • Expects a JSON array of gallery objects.<br>• Compresses uploaded photos to max 1200px JPEG.<br>• Validates trilingual caption `{si, ta, en}`.<br>• Commits to `content/gallery-items.json`. |
| **Downloads (PDFs)** | `data-tab="downloads"` | Writes binary PDF to `downloads/[timestamp]-[filename].pdf`<br>Appends to `downloads` in `content/pages/academic.json` | • Expects PDF file upload (`accept="application/pdf"`).<br>• Expects trilingual label inputs: `pdf-label-si`, `pdf-label-ta`, `pdf-label-en`.<br>• Reads `content/pages/academic.json`, appends `{ label: { si, ta, en }, file: "downloads/..." }`, and commits with SHA. |
| **Page Text** | `data-tab="pages"` | Reads & writes 9 core JSON content files:<br>1. `content/common.json`<br>2. `content/pages/home.json`<br>3. `content/pages/about.json`<br>4. `content/pages/academic.json`<br>5. `content/pages/student-life.json`<br>6. `content/pages/gallery.json`<br>7. `content/pages/news.json`<br>8. `content/pages/admissions.json`<br>9. `content/pages/contact.json` | • Recursively parses the selected JSON file.<br>• Detects trilingual objects containing `si`, `ta`, and `en` properties, rendering side-by-side editable text boxes.<br>• Handles nested objects, arrays, and primitive strings.<br>• Serializes with 2-space indentation and commits back to GitHub. |
| **Applications** | `data-tab="applications"` | Reads published Google Sheet CSV URL saved in browser `localStorage` (`pelwatta_apps_csv_url`) | • Read-only table view of student admissions.<br>• Client-side CSV parser with sortable columns and search.<br>• Does NOT modify files in repo (view-only to prevent accidental data loss). |
| **Code Editor** | `data-tab="code"` | Any text file in repository (HTML, CSS, JS, JSON, TXT) | • Monospace code editor with file tree navigation.<br>• Quick selector of core files (`DEFAULT_KNOWN_CODE_FILES`).<br>• Supports creating new text files and committing with custom commit message. |
| **Theme** | `data-tab="theme"` | Reads & writes `:root { ... }` in `css/style.css` | • Parses CSS custom properties from `:root` block.<br>• Offers color pickers for primary/maroon and gold palettes.<br>• Commits updated `:root` block back to `css/style.css`. |
| **Import Site** | `data-tab="import"` | Uploads multi-file sets or folders | • Computes Git blob SHA-1 (`blob <length>\0<content>`).<br>• Identifies New, Changed, and Unchanged files.<br>• **Strictly skips** `xk92m-manage/` and `.github/`. |
| **Version History** | `data-tab="history"` | Reads commit history for any core file | • Queries `GET /repos/{owner}/{repo}/commits?path={file}`.<br>• Displays commit author, date, message.<br>• Allows 1-click restore/rollback of older commits. |

---

## 4. Deep-Dive Admin Tab Expectations

### 4.1. News & Events Tab (`data-tab="news"`)
- **Target File:** `content/news-items.json`
- **Image Upload Folder:** `images/`
- **Image Filename Pattern:** `images/news-[timestamp]-[idx].jpg` (e.g. `images/news-1728000000000-0.jpg`)
- **Required Object Keys per Item:**
  - `id`: Unique string (e.g. `"n1728000000000"` or `"n2"`)
  - `date`: ISO date string `YYYY-MM-DD`
  - `category`: Must match one of: `"academic"`, `"sports"`, `"events"`, `"circulars"`
  - `image`: Relative path to image (e.g. `"images/news-1728000000000-0.jpg"` or `"images/campus-hero.jpg"`)
  - `title`: Trilingual object `{ "si": "...", "ta": "...", "en": "..." }`
  - `excerpt`: Trilingual object `{ "si": "...", "ta": "...", "en": "..." }`
- **Public Rendering:** Consumed by `index.html` (latest 3 items) and `news.html` / `news-detail.html`.

### 4.2. Gallery Tab (`data-tab="gallery"`)
- **Target File:** `content/gallery-items.json`
- **Image Upload Folder:** `images/`
- **Image Filename Pattern:** `images/gallery-[timestamp]-[idx].jpg` (e.g. `images/gallery-1728000000000-0.jpg`)
- **Required Object Keys per Item:**
  - `id`: Unique string (e.g. `"g1728000000000"` or `"g-1"`)
  - `category`: Must match one of: `"sports"`, `"prizegiving"`, `"cultural"`, `"daily"`
  - `image`: Relative path to image (e.g. `"images/gallery-1728000000000-0.jpg"`)
  - `caption`: Trilingual object `{ "si": "...", "ta": "...", "en": "..." }`
- **Public Rendering:** Consumed by `gallery.html` (with category filtering and lightbox).

### 4.3. Downloads (PDFs) Tab (`data-tab="downloads"`)
- **Target Upload Folder:** `downloads/`
- **Target Metadata File:** `content/pages/academic.json`
- **Upload Filename Pattern:** `downloads/[timestamp]-[sanitized-name].pdf` (spaces and special characters replaced with `_`)
- **Metadata Update:** Appends to the `downloads` array in `content/pages/academic.json`:
  ```json
  {
    "label": {
      "si": "2026 පළමු පාසල් වාර විභාග කාලසටහන",
      "ta": "2026 முதலாம் தவணை பரீட்சை கால அட்டவணை",
      "en": "First Term Examination Timetable 2026"
    },
    "file": "downloads/1728000000000-first-term-timetable.pdf"
  }
  ```
- **Public Rendering:** Listed on `academic.html` and cataloged on `downloads.html`. Every file referenced must physically exist in `downloads/`.

### 4.4. Page Text Tab (`data-tab="pages"`)
- **Target Selectable Files:**
  1. `content/common.json` (Header branding, navigation, footer, accessibility labels)
  2. `content/pages/home.json` (Hero title, subtitle, badges, slides, quick tiles, principal quote)
  3. `content/pages/about.json` (School history, vision, mission, principal message, past principals)
  4. `content/pages/academic.json` (Academic streams, exam results, download links)
  5. `content/pages/student-life.json` (Athletics, clubs, societies, prefects leadership)
  6. `content/pages/gallery.json` (Gallery intro, category tab labels, search placeholder)
  7. `content/pages/news.json` (News intro, category tab labels, search placeholder)
  8. `content/pages/admissions.json` (Free notice, ministry circular notice, form labels, FAQs)
  9. `content/pages/contact.json` (Direct contact channels, office hours, telephone lines, RTI details)
- **Parser Rules:**
  - If an object has properties `si`, `ta`, and `en`, the admin UI renders a trilingual card.
  - If a key has sub-objects or arrays, they are rendered recursively.
  - On save, validates that non-empty text was provided, formats JSON with 2 spaces, and commits via GitHub API.

### 4.5. Applications Tab (`data-tab="applications"`)
- **Data Source:** A published Google Sheet CSV URL stored in `localStorage.getItem('pelwatta_apps_csv_url')`.
- **Expected Columns in CSV:**
  - `Timestamp`
  - `Student Full Name`
  - `Date of Birth`
  - `Gender`
  - `Grade Applying For`
  - `Parent / Guardian Name`
  - `Phone Number`
  - `Email Address`
  - `Permanent Address`
  - `Reference Number` (format: `PEL-2026-XXXX`)
- **Mode:** Strictly read-only to prevent tampering or data loss.

### 4.6. Theme Tab (`data-tab="theme"`)
- **Target File:** `css/style.css`
- **Expected Structure:** A top-level `:root { ... }` block containing hex color variables:
  ```css
  :root {
    --maroon: #7a1c28;
    --maroon-dark: #58121b;
    --maroon-light: #9a2b3b;
    --maroon-subtle: #fbf2f3;
    --gold: #c99738;
    --gold-dark: #9e7323;
    --gold-light: #dfb55d;
    --gold-subtle: #fdf8ed;
  }
  ```
- **Update Mechanism:** Admin regex extracts the `:root { ... }` block, swaps user-chosen hex colors, and commits `css/style.css`.

---

## 5. Every Content JSON File: Path, Fields & Schema Examples

### 5.1. Shared Global Site Data: `content/common.json`
Loaded on every page. Provides site branding, trilingual navigation, accessibility labels, and footer metadata.

```json
{
  "schoolName": {
    "si": "මො/පැල්වත්ත නවෝද්‍යා ද්විතීයික විද්‍යාලය",
    "ta": "மொ/பெல்வத்தை நவோத்யா இரண்டாம் நிலை கல்லூரி",
    "en": "Mo/Pelwatta Navodya Secondary College"
  },
  "location": {
    "si": "පැල්වත්ත, බුත්තල (මොනරාගල පාර), ශ්‍රී ලංකා",
    "ta": "பெல்வத்தை, புத்தள (மொணராகலை வீதி), இலங்கை",
    "en": "Pelwatta, Buttala (Monaragala Road), Sri Lanka"
  },
  "nationalSchoolNotice": {
    "si": "ශ්‍රී ලංකා රජයේ නිදහස් ජාතික පාසලකි",
    "ta": "இலங்கை அரச இலவச தேசிய பாடசாலை",
    "en": "Sri Lankan Free Government National School"
  },
  "nav": {
    "home": { "si": "මුල් පිටුව", "ta": "முகப்பு", "en": "Home" },
    "about": { "si": "පාසල පිළිබඳව", "ta": "எங்களைப் பற்றி", "en": "About Us" },
    "academic": { "si": "අධ්‍යයන අංශය", "ta": "கல்விப் பிரிவு", "en": "Academics" },
    "studentlife": { "si": "ශිෂ්‍ය ජීවිතය", "ta": "மாணவர் வாழ்க்கை", "en": "Student Life" },
    "gallery": { "si": "ඡායාරූප", "ta": "படத்தொகுப்பு", "en": "Gallery" },
    "news": { "si": "පුවත් සහ නිවේදන", "ta": "செய்திகள் & நிகழ்வுகள்", "en": "News & Events" },
    "admissions": { "si": "ඇතුළත් වීම්", "ta": "சேர்க்கை", "en": "Admissions" },
    "downloads": { "si": "බාගත කිරීම්", "ta": "பதிவிறக்கங்கள்", "en": "Downloads" },
    "sds": { "si": "සංවර්ධන සමිතිය", "ta": "அபிவிருத்தி சங்கம்", "en": "SDS & Parents" },
    "contact": { "si": "සම්බන්ධ කර ගැනීමට", "ta": "தொடர்புகளுக்கு", "en": "Contact Us" }
  },
  "a11y": {
    "label": { "si": "ප්‍රවේශ්‍යතා මෙවලම්", "ta": "அணுகல்தன்மை கருவிகள்", "en": "Accessibility Tools" },
    "contrast": { "si": "වර්ණ වෙනස", "ta": "மாறுபாடு", "en": "Contrast" }
  },
  "footer": {
    "freeSchoolNote": {
      "si": "6 ශ්‍රේණියේ සිට 13 ශ්‍රේණිය (උසස් පෙළ) දක්වා පූර්ණ නිදහස් අධ්‍යාපනය ලබාදෙන රජයේ පාසලකි.",
      "ta": "தரம் 6 முதல் 13 வரை இலவசக் கல்வியை வழங்கும் அரச பாடசாலை.",
      "en": "A state school offering free education from Grade 6 to Grade 13 (Advanced Level)."
    },
    "quickLinksTitle": { "si": "ක්ෂණික සබැඳි", "ta": "விரைவு இணைப்புகள்", "en": "Quick Links" },
    "downloadsLink": { "si": "බාගත කිරීම්", "ta": "பதிவிறக்கங்கள்", "en": "Downloads" },
    "sdsLink": { "si": "පාසල් සංවර්ධන සමිතිය", "ta": "அபிவிருத்தி சங்கம்", "en": "SDS & Parents" },
    "legalTitle": { "si": "නීතිමය තොරතුරු", "ta": "சட்ட விபரங்கள்", "en": "Legal Information" },
    "privacyLink": { "si": "පෞද්ගලිකත්ව ප්‍රතිපත්තිය", "ta": "தனியுரிமைக் கொள்கை", "en": "Privacy Policy" },
    "termsLink": { "si": "භාවිත නියමයන්", "ta": "விதிமுறைகள்", "en": "Terms of Use" },
    "contactTitle": { "si": "ලිපිනය හා සබඳතා", "ta": "தொடர்பு விபரம்", "en": "Contact & Location" },
    "rti": { "si": "තොරතුරු දැනගැනීමේ නිලධාරී", "ta": "தகவல் அதிகாரி", "en": "RTI Officer" },
    "rtiName": { "si": "ඩබ්. කරුණාරත්න මිය", "ta": "திருமதி டபிள்யூ. கருணாரத்ன", "en": "Mrs. W. Karunaratne" },
    "copyright": { "si": "සියලු හිමිකම් ඇවිරිණි.", "ta": "அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.", "en": "All Rights Reserved." }
  }
}
```

---

### 5.2. UI Translations Dictionary: `content/translations.json`
Consumed by `js/i18n.js` and `index.html` to translate navigation, headers, badges, sections, and accessibility tools.

```json
{
  "nav": {
    "home": { "si": "මුල් පිටුව", "ta": "முகப்பு", "en": "Home" },
    "about": { "si": "පාසල පිළිබඳව", "ta": "எங்களைப் பற்றி", "en": "About Us" },
    "academics": { "si": "අධ්‍යයන අංශය", "ta": "கல்විப் பிரிவு", "en": "Academics" },
    "studentLife": { "si": "ශිෂ්‍ය ජීවිතය", "ta": "மாணவர் வாழ்க்கை", "en": "Student Life" },
    "gallery": { "si": "ඡායාරූප", "ta": "படத்தொகுப்பு", "en": "Gallery" },
    "news": { "si": "පුවත් සහ නිවේදන", "ta": "செய்திகள் & நிகழ்வுகள்", "en": "News & Events" },
    "admissions": { "si": "ඇතුළත් වීම්", "ta": "சேர்க்கை", "en": "Admissions" },
    "downloads": { "si": "බාගත කිරීම්", "ta": "பதிவிறக்கங்கள்", "en": "Downloads" },
    "sds": { "si": "සංවර්ධන සමිතිය", "ta": "அபிவிருத்தி சங்கம்", "en": "SDS & Parents" },
    "contact": { "si": "සම්බන්ධ කර ගැනීමට", "ta": "தொடர்புகளுக்கு", "en": "Contact Us" }
  },
  "school": {
    "name": {
      "si": "මො/පැල්වත්ත නවෝද්‍යා ද්විතීයික විද්‍යාලය",
      "ta": "மொ/பெல்வத்தை நவோத்யா இரண்டாம் நிலை கல்லூரி",
      "en": "Mo/Pelwatta Navodya Secondary College"
    },
    "type": {
      "si": "රජයේ ජාතික පාසලකි · මොනරාගල දිස්ත්‍රික්කය",
      "ta": "அரச தேசிய பாடசாலை · மொணராகலை மாவட்டம்",
      "en": "Sri Lankan Free Government Secondary National School"
    },
    "motto": {
      "si": "විද්‍යා දදාති විනයං",
      "ta": "வித்யா ததாதி வினயம்",
      "en": "Knowledge Imparts Discipline"
    }
  },
  "home": {
    "latestNews": { "si": "නවතම පුවත් සහ නිවේදන", "ta": "சமீபத்திய செய்திகள் & அறிவிப்புகள்", "en": "Latest Notices & Events" },
    "sectionsTitle": { "si": "ද්විතීයික අධ්‍යාපන අංශ සහ පහසුකම්", "ta": "இடைநிலைக் கல்விப் பிரிவுகள் மற்றும் வசதிகள்", "en": "Academic Sections & School Facilities" },
    "explore": { "si": "පිවිසෙන්න", "ta": "பார்க்க", "en": "Explore" }
  }
}
```

---

### 5.3. News & Events Data: `content/news-items.json`
Directly edited and saved by the **News & Events** tab in the admin panel.

```json
[
  {
    "id": "n1728000000000",
    "date": "2026-03-20",
    "category": "academic",
    "image": "images/news-1728000000000-0.jpg",
    "title": {
      "si": "2026 පළමු පාසල් වාර විභාග කාලසටහන ප්‍රකාශයට පත් කෙරේ",
      "ta": "2026 முதலாம் தவணை பரீட்சை கால அட்டவணை வெளியிடப்பட்டது",
      "en": "First Term Examination Timetables 2026 Released for All Grades"
    },
    "excerpt": {
      "si": "6 ශ්‍රේණියේ සිට 13 ශ්‍රේණිය දක්වා සියලුම ශ්‍රේණි සඳහා පළමු පාසල් වාර විභාග කාලසටහන් බාගත කරගත හැක.",
      "ta": "தரம் 6 முதல் 13 வரையான மாணவர்களுக்கான முதலாம் தவணை பரீட்சை கால அட்டவணை கிடைக்கிறது.",
      "en": "The First Term Examinations timetables for Grades 6 through 13 are now available for download."
    }
  }
]
```

---

### 5.4. Gallery Photos: `content/gallery-items.json`
Directly edited and saved by the **Gallery** tab in the admin panel.

```json
[
  {
    "id": "g1728000000000",
    "category": "sports",
    "image": "images/gallery-1728000000000-0.jpg",
    "caption": {
      "si": "වාර්ෂික ක්‍රීඩා උළෙලේ ජයග්‍රාහී අවස්ථාවක්",
      "ta": "வருடாந்த விளையாட்டுப் போட்டியின் வெற்றித் தருணம்",
      "en": "Victory moment at the Annual Inter-House Athletic Meet"
    }
  }
]
```

---

### 5.5. Academic & Downloads Data: `content/pages/academic.json` (and `content/academic.json`)
Edited via **Page Text** tab and automatically appended to by the **Downloads (PDFs)** tab.

```json
{
  "intro": {
    "si": "ශ්‍රේණි 6 සිට උසස් පෙළ දක්වා පාසලේ අධ්‍යයන කටයුතු පිළිබඳ තොරතුරු",
    "ta": "தரம் 6 முதல் உயர்தரம் வரையிலான கல்விச் செயற்பாடுகள்",
    "en": "Academic offerings from Grade 6 through Advanced Level"
  },
  "sections": [
    {
      "title": { "si": "ද්විතීයික අංශය (6-11 ශ්‍රේණි)", "ta": "இடைநிலைப் பிரிவு (தரம் 6-11)", "en": "Junior & Senior Secondary (Grades 6-11)" },
      "body": { "si": "සාමාන්‍ය පෙළ විභාගය සඳහා සියලුම විෂය ධාරා ලබාදෙනු ලැබේ.", "ta": "சாதாரணத் தர பரீட்சைக்கான அனைத்து பாடங்களும் வழங்கப்படுகின்றன.", "en": "All subject streams offered in preparation for the G.C.E. Ordinary Level examination." }
    }
  ],
  "resultsTitle": { "si": "විභාග ප්‍රතිඵල හා ජයග්‍රහණ", "ta": "தேர்வு முடிவுகள் மற்றும் சாதனைகள்", "en": "Examination Results & Achievements" },
  "results": [
    { "year": "2025", "text": { "si": "සාමාන්‍ය පෙළ සමත් ප්‍රතිශතය 94%ක් විය.", "ta": "சாதாரணத் தர சித்தி விகிதம் 94% ஆக இருந்தது.", "en": "O/L pass rate reached 94%." } }
  ],
  "downloadsTitle": { "si": "බාගත කිරීම් සහ විභාග කාලසටහන්", "ta": "பதிவிறக்கங்கள் மற்றும் பரீட்சை அட்டவணைகள்", "en": "Downloads & Exam Timetables" },
  "downloads": [
    {
      "label": {
        "si": "2026 වාර්ෂික පාසල් අධ්‍යයන දින දර්ශනය",
        "ta": "2026 வருடாந்த பாடசாலை கல்வி நாட்காட்டி",
        "en": "Annual School Academic Calendar 2026"
      },
      "file": "downloads/academic-calendar-2026.pdf"
    }
  ]
}
```

---

### 5.6. Standalone Downloads Registry: `content/downloads/index.json`
Provides a searchable and categorizable index of all documents rendered on `downloads.html`.

```json
{
  "documents": [
    {
      "id": "doc-1",
      "filename": "academic-calendar-2026.pdf",
      "size": "240 KB",
      "category": "academic",
      "date": "2026-01-10",
      "title": {
        "si": "2026 වාර්ෂික පාසල් අධ්‍යයන දින දර්ශනය",
        "ta": "2026 வருடாந்த பாடசாலை கல்வி நாட்காட்டி",
        "en": "Annual School Academic Calendar 2026"
      }
    }
  ]
}
```

---

### 5.7. Home Page Content: `content/pages/home.json` (and `content/home.json`)
Supplies the hero banner, slides, quick navigation cards, and principal snippet for `index.html`.

```json
{
  "heroBadge": {
    "si": "රජයේ නිදහස් අධ්‍යාපන ආයතනයකි",
    "ta": "இலவச அரச கல்வி நிறுவனம்",
    "en": "Free Government Educational Institution"
  },
  "heroTitle": {
    "si": "නැණ ගුණ සපිරි අනාගත පරපුරක් දැයට දායාද කරන",
    "ta": "அறிவும் நற்பண்பும் மிக்க எதிர்கால சந்ததியை உருவாக்கும்",
    "en": "Inspiring Academic Excellence and Character for the Nation"
  },
  "heroDesc": {
    "si": "මොනරාගල දිස්ත්‍රික්කයේ පැල්වත්ත හරිත සොඳුරු පරිසරයක පිහිටි විද්‍යාලයකි.",
    "ta": "மொணராகலை மாவட்டத்தின் பெல்வத்தை பசுமை சூழலில் அமைந்துள்ள கல்லூரி.",
    "en": "Situated in scenic Pelwatta, Monaragala, offering free secondary education."
  },
  "heroSlides": [
    {
      "image": "images/campus-hero.jpg",
      "caption": {
        "si": "විද්‍යාලීය ප්‍රධාන පරිශ්‍රය හා ශාස්ත්‍රීය ගොඩනැගිලි සංකීර්ණය",
        "ta": "பிரதான கல்லூரி வளாகம் மற்றும் கல்வி கட்டிடத் தொகுதி",
        "en": "Main College Campus and Academic Complex"
      }
    }
  ],
  "quickTiles": [
    {
      "icon": "🎓",
      "title": { "si": "අධ්‍යයන අංශය", "ta": "கல்விப் பிரிவுகள்", "en": "Academic Streams" },
      "desc": { "si": "සාමාන්‍ය පෙළ සහ උසස් පෙළ විෂය ධාරාවන්.", "ta": "சா/த மற்றும் உயர்தர பிரிவுகள்.", "en": "G.C.E. O/L and A/L streams." },
      "link": "academic.html"
    }
  ],
  "principalSnippet": {
    "photo": "images/principal.jpg",
    "name": { "si": "කේ. එම්. සුනිල් ශාන්ත මහතා", "ta": "திரு. கே. எம். சுனில் சாந்த", "en": "Mr. K. M. Sunil Shantha" },
    "role": { "si": "විදුහල්පති (SLEAS)", "ta": "அதிபர் (SLEAS)", "en": "Principal (SLEAS)" },
    "quote": {
      "si": "\"දැනුම පමණක් නොව විනය හා සාරධර්මවලින් පිරිපුන් පුරවැසියන් බිහිකිරීම අපගේ අරමුණයි.\"",
      "ta": "\"அறிவை மட்டுமல்லாது ஒழுக்கம் மற்றும் விழுமியங்களைக் கொண்ட பிரஜைகளை உருவாக்குவதே நோக்கம்.\"",
      "en": "\"Our mission is to empower youth with balanced knowledge, discipline, and civic values.\""
    }
  }
}
```

---

### 5.8. About Us Page Data: `content/pages/about.json` (and `content/about.json`)
Supplies school history, vision, mission, principal message, past principals list, and Google Maps embed for `about.html`.

```json
{
  "intro": { "si": "පාසලේ ඉතිහාසය, දැක්ම සහ මෙහෙවර", "ta": "வரலாறு, பார்வை மற்றும் நோக்கம்", "en": "History, Vision, and Mission" },
  "historyTitle": { "si": "අපගේ ඉතිහාසය", "ta": "எமது வரலாறு", "en": "Our History" },
  "historyBody": { "si": "1954 දී ආරම්භ කරන ලද විද්‍යාලය...", "ta": "1954 இல் ஆரம்பிக்கப்பட்ட கல்லூரி...", "en": "Founded in 1954..." },
  "visionTitle": { "si": "දැක්ම", "ta": "தொலைநோக்கு", "en": "Vision" },
  "visionBody": { "si": "නැණ ගුණ සපිරි දරු පරපුරක්.", "ta": "அறிவும் நற்பண்பும் மிக்க தலைமுறை.", "en": "Nurturing an enlightened generation." },
  "missionTitle": { "si": "මෙහෙවර", "ta": "பணி", "en": "Mission" },
  "missionBody": { "si": "සමබර අධ්‍යාපනයක් ලබා දීම.", "ta": "சமநிலையான கல்வியை வழங்குதல்.", "en": "Delivering holistic secondary education." },
  "principalMsgTitle": { "si": "විදුහල්පතිතුමාගේ පණිවිඩය", "ta": "அதிபரின் செய்தி", "en": "Principal's Message" },
  "principalMsgBody": { "si": "පැල්වත්ත නවෝද්‍යා විද්‍යාලයීය වෙබ් අඩවියට ඔබ සාදරයෙන් පිළිගනිමු...", "ta": "கல்லூரி இணையத்தளத்திற்கு உங்களை அன்போடு வரவேற்கிறோம்...", "en": "Welcome to our official college portal..." },
  "pastPrincipalsTitle": { "si": "හිටපු විදුහල්පතිවරුන්", "ta": "முன்னாள் அதிபர்கள்", "en": "Past Principals" },
  "pastPrincipals": [
    { "years": "1998 - 2008", "name": "Mr. D. M. Gunasekara" }
  ],
  "mapNote": { "si": "බුත්තල - මොනරාගල ප්‍රධාන මාර්ගයේ පැල්වත්ත හන්දිය අසල පිහිටා ඇත.", "ta": "புத்தள - மொணராகலை பிரதான வீதியில் அமைந்துள்ளது.", "en": "Located along the Buttala-Monaragala highway near Pelwatta junction." },
  "mapEmbedUrl": "https://www.google.com/maps?q=6.7167,81.0833&z=15&output=embed",
  "getDirectionsUrl": "https://maps.google.com/?q=6.7167,81.0833"
}
```

---

### 5.9. Contact Page Data: `content/pages/contact.json` (and `content/contact.json`)
Supplies direct administrative channels, office hours, phone lines, and RTI compliance. **Never show fake forms or false submission confirmations.**

```json
{
  "intro": {
    "si": "විදුහල්පති කාර්යාලය, පරිපාලන අංශය සහ තොරතුරු දැනගැනීමේ නිලධාරී (RTI) විමසීම්",
    "ta": "அதிபர் அலுவலகம், நிர்வாகப் பிரிவு மற்றும் தகவல் அதிகாரி விபரங்கள்",
    "en": "Direct administrative channels, admissions inquiries, and RTI contact details"
  },
  "emailUsTitle": { "si": "විද්‍යුත් තැපෑලෙන් විමසන්න", "ta": "மின்னஞ்சல் மூலம் விசாரிக்கவும்", "en": "Email Us Directly" },
  "emailUsDesc": { "si": "ඔබගේ විමසීම් පාසල් පරිපාලනය වෙත යොමු කරන්න.", "ta": "உங்கள் விசாரணைகளை நிர்வாகத்திற்கு அனுப்பவும்.", "en": "Send your official correspondence directly to the school administration." },
  "emailButton": { "si": "✉️ ඊමේල් පණිවිඩයක් යවන්න", "ta": "✉️ மின்னஞ்சல் அனுப்பவும்", "en": "✉️ Send an Email" },
  "callUsTitle": { "si": "දුරකථන ඇමතුම්", "ta": "தொலைபேசி அழைப்புகள்", "en": "Telephone Inquiries" },
  "callUsDesc": { "si": "පාසල් කාර්යාල වේලාවන් තුළ අමතන්න.", "ta": "அலுவலக நேரங்களில் அழைக்கவும்.", "en": "Contact our administration during school operating hours." },
  "officeHoursTitle": { "si": "කාර්යාල වේලාවන්", "ta": "அலுவலக நேரம்", "en": "Office Hours" },
  "officeHours": { "si": "සඳුදා - සිකුරාදා: පෙ.ව. 7.30 - ප.ව. 2.30", "ta": "திங்கள் - வெள்ளி: காலை 7.30 - பிற்பகல் 2.30", "en": "Monday – Friday: 7:30 AM – 2:30 PM" },
  "phone": "+94 55 227 6234",
  "phoneSecondary": "+94 55 227 6235",
  "email": "info@pelwattanavodya.lk",
  "principalEmail": "principal@pelwattacollege.sch.lk",
  "rtiTitle": { "si": "තොරතුරු දැනගැනීමේ අයිතිය (RTI)", "ta": "தகவல் அறியும் உரிமை (RTI)", "en": "Right to Information (RTI)" },
  "rtiOfficerName": "Mrs. W. Karunaratne — Chief Incumbent Administrative Officer",
  "mapEmbedUrl": "https://www.google.com/maps?q=6.7167,81.0833&z=15&output=embed"
}
```

---

### 5.10. Admissions Page Data & Integration: `content/pages/admissions.json` (and `content/admissions.json`)
Supplies free education disclaimers, Ministry circular notices, PDPA consent text, form field labels, and FAQs for `admissions.html`.

```json
{
  "intro": {
    "si": "1 ශ්‍රේණිය සහ අතරමැදි ශ්‍රේණි සඳහා රජයේ චක්‍රලේඛ මාර්ගෝපදේශ, අවශ්‍ය ලේඛන සහ අයදුම්පත් ලියාපදිංචිය",
    "ta": "தரம் 1 மற்றும் இடைநிலை தரங்களுக்கான அரசாங்க சுற்றறிக்கை வழிகாட்டல், தேவையான ஆவணங்கள்",
    "en": "Grade 1 & transfer admission guidance, required documents, and application registration"
  },
  "freeNotice": {
    "si": "නොමිලේ අධ්‍යාපනය ලබාදෙන රජයේ පාසලක් පිළිබඳ නිල ප්‍රකාශය: මො/පැල්වත්ත නවෝද්‍යා ද්විතීයික විද්‍යාලය ශ්‍රී ලංකා ප්‍රජාතාන්ත්‍රික සමාජවාදී ජනරජයේ අධ්‍යාපන අමාත්‍යාංශය මගින් පාලනය වන නිදහස් රජයේ පාසලකි. කිසිදු ශ්‍රේණියකට සිසුන් ඇතුළත් කිරීමේදී මුදලක් අය නොකෙරේ.",
    "ta": "இலவச கல்வி வழங்கும் அரசுப் பள்ளி பற்றிய அறிவிப்பு: மோ/பெல்வத்த நவோதயா இடைநிலைப் பள்ளி இலங்கை கல்வி அமைச்சின் கீழ் இயங்கும் இலவச அரசுப் பள்ளியாகும். எந்த தரத்திற்கும் மாணவர் சேர்க்கைக்கு கட்டணம் அறவிடப்படுவதில்லை.",
    "en": "Official notice: Mo/Pelwatta Navodya Secondary College is a free government school regulated by the Ministry of Education of Sri Lanka. No fee is charged for admission to any grade."
  },
  "adminToolNotice": {
    "si": "⚠️ මෙම පෝරමය අයදුම්පත් පරිපාලනමය වශයෙන් ලුහුබැඳීම සඳහා පමණි. අවසාන ඇතුළත් කිරීමේ තීරණය අධ්‍යාපන අමාත්‍යාංශයේ නිල චක්‍රලේඛයට සහ පාසලේ ඇතුළත් කිරීමේ කමිටුවේ තීරණයට අනුව ගනු ලැබේ.",
    "ta": "⚠️ இந்த படிவம் நிர்வாக ரீதியான கண்காணிப்புக்காக மட்டுமே. இறுதி சேர்க்கை முடிவு அமைச்சின் உத்தியோகபூர்வ சுற்றறிக்கை மற்றும் பள்ளி சேர்க்கைக் குழுவின் முடிவின்படி எடுக்கப்படும்.",
    "en": "⚠️ This form is for administrative tracking only. Final admission decisions follow the official Ministry of Education circular and the school's admission committee."
  },
  "consentLabel": {
    "si": "2022 අංක 09 දරන ශ්‍රී ලංකා පෞද්ගලික දත්ත ආරක්ෂණ පනතට අනුකූලව ඇතුළත් කිරීමේ පරිපාලන කටයුතු උදෙසා මාගේ දරුවාගේ තොරතුරු ගැනීම හා සැකසීමට මම මෙයින් කැමැත්ත ප්‍රකාශ කරමි.",
    "ta": "2022 ஆம் ஆண்டு இலக்கம் 09 இலங்கை தனிநபர் தரவுப் பாதுகாப்புச் சட்டத்திற்கு இணங்க, சேர்க்கை நிர்வாக நடவடிக்கைகளுக்காக எனது பிள்ளையின் தகவல்களைப் பெறவும் செயலாக்கவும் இதன்மூலம் சம்மதிக்கிறேன்.",
    "en": "I consent to this school storing and processing my child's information for admission purposes, in line with Sri Lanka's Personal Data Protection Act No. 09 of 2022."
  },
  "formFields": {
    "studentName": { "si": "ශිෂ්‍යයාගේ සම්පූර්ණ නම", "ta": "மாணவர் முழுப் பெயர்", "en": "Student's Full Name" },
    "dob": { "si": "උපන් දිනය", "ta": "பிறந்த தேதி", "en": "Date of Birth" },
    "gender": { "si": "ස්ත්‍රී / පුරුෂ භාවය", "ta": "பாலினம்", "en": "Gender" },
    "grade": { "si": "අයදුම් කරන ශ්‍රේණිය", "ta": "விண்ணப்பிக்கும் தரம்", "en": "Grade Applying For" },
    "parentName": { "si": "දෙමාපිය / භාරකරුගේ නම", "ta": "பெற்றோர்/பாதுகாவலர் பெயர்", "en": "Parent / Guardian Name" },
    "phone": { "si": "දුරකථන අංකය", "ta": "தொலைபேசி இலக்கம்", "en": "Phone Number" },
    "email": { "si": "විද්‍යුත් තැපෑල", "ta": "மின்னஞ்சல்", "en": "Email Address" },
    "address": { "si": "ස්ථීර පදිංචි ලිපිනය", "ta": "நிரந்தர முகவரி", "en": "Permanent Address" }
  },
  "submitLabel": { "si": "අයදුම්පත ඉදිරිපත් කරන්න", "ta": "விண்ணப்பத்தை சமர்ப்பிக்க", "en": "Submit Application" },
  "successPrefix": { "si": "ලියාපදිංචිය සාර්ථකයි! යොමු අංකය:", "ta": "பதிவு வெற்றிகரமாக முடிந்தது! குறிப்பு எண்:", "en": "Registration successful! Reference No:" }
}
```

#### Admissions Submission Mechanism:
- Submissions are sent via client-side `fetch()` with `mode: "no-cors"` POST directly to the public Google Form endpoint:  
  `https://docs.google.com/forms/d/e/1FAIpQLSdgIyw0gj49Ljrr36KQYWYjjR0Zxa5L6gwgTSXRRwAbnwbdgA/formResponse`
- Form entry ID mapping:
  - Student Name: `entry.1432907719`
  - Date of Birth: `entry.1108585059`
  - Gender: `entry.1713704593`
  - Grade: `entry.1870348017`
  - Parent Name: `entry.476165141`
  - Phone: `entry.791239928`
  - Email: `entry.1210606851`
  - Address: `entry.368470239`
- Upon submission, generates and displays reference number `PEL-2026-XXXX`.

---

### 5.11. Gallery Page Labels: `content/pages/gallery.json`
Provides filter button titles and UI text for `gallery.html`.

```json
{
  "intro": {
    "si": "පාසල් ක්‍රියාකාරකම් වල ඡායාරූප එකතුව",
    "ta": "பள்ளி நிகழ்வுகளின் புகைப்படத் தொகுப்பு",
    "en": "Photos from school activities and events"
  },
  "categories": {
    "all": { "si": "සියල්ල", "ta": "அனைத்தும்", "en": "All" },
    "sports": { "si": "ක්‍රීඩා", "ta": "விளையாட்டு", "en": "Sports" },
    "prizegiving": { "si": "ත්‍යාග ප්‍රදානය", "ta": "பரிசளிப்பு", "en": "Prize Giving" },
    "cultural": { "si": "සංස්කෘතික", "ta": "கலாசார", "en": "Cultural" },
    "daily": { "si": "දෛනික ජීවිතය", "ta": "தினசரி வாழ்க்கை", "en": "Daily Life" }
  },
  "searchPlaceholder": { "si": "සොයන්න...", "ta": "தேடுக...", "en": "Search photos..." },
  "noResults": { "si": "ගැලපෙන ඡායාරූප හමු නොවීය.", "ta": "பொருந்தும் படங்கள் இல்லை.", "en": "No matching photos found." }
}
```

---

### 5.12. News Page Labels: `content/pages/news.json`
Provides filter button titles and UI text for `news.html`.

```json
{
  "intro": {
    "si": "විද්‍යාලයේ නවතම තොරතුරු, විභාග නිවේදන, ක්‍රීඩා ජයග්‍රහණ සහ අමාත්‍යාංශ චක්‍රලේඛ",
    "ta": "பள்ளியின் புதிய தகவல்கள், பரீட்சை அறிவிப்புகள், விளையாட்டு சாதனைகள்",
    "en": "Latest school updates, exam notices, sports achievements and ministry circulars"
  },
  "categories": {
    "all": { "si": "සියල්ල", "ta": "அனைத்தும்", "en": "All" },
    "academic": { "si": "අධ්‍යයන", "ta": "கல்வி", "en": "Academic" },
    "sports": { "si": "ක්‍රීඩා", "ta": "விளையாட்டு", "en": "Sports" },
    "events": { "si": "උත්සව සහ සමාරෝහ", "ta": "நிகழ்வுகள்", "en": "Events & Ceremonies" },
    "circulars": { "si": "නිල චක්‍රලේඛ", "ta": "சுற்றறிக்கைகள்", "en": "Circulars" }
  },
  "searchPlaceholder": { "si": "සොයන්න...", "ta": "தேடுக...", "en": "Search news..." },
  "noResults": { "si": "අදාළ පුවත් හමු නොවීය.", "ta": "பொருந்தும் செய்திகள் இல்லை.", "en": "No matching news found." },
  "readMore": { "si": "වැඩිදුර කියවන්න →", "ta": "மேலும் படிக்க →", "en": "Read more →" }
}
```

---

### 5.13. Student Life Data: `content/pages/student-life.json` (and `content/student-life.json`)
Supplies sports squads, clubs, societies, and prefects leadership guild for `student-life.html`.

```json
{
  "subtitle": { "si": "ක්‍රීඩා, සමාජ හා සමිති, විෂය සමගාමී ක්‍රියාකාරකම්", "ta": "விளையாட்டு, சங்கங்கள்", "en": "Sports, clubs, societies, and co-curricular leadership" },
  "sportsHeader": {
    "badge": { "si": "ක්‍රීඩා ක්ෂේත්‍රය", "ta": "விளையாட்டு", "en": "Athletics & Sports" },
    "title": { "si": "පාසල් ක්‍රීඩා", "ta": "விளையாட்டுகள்", "en": "College Sports" },
    "desc": { "si": "කායික හා මානසික සුවතාවය...", "ta": "உடல் ஆரோக்கியம்...", "en": "Cultivating fitness and sportsmanship..." }
  },
  "clubsHeader": {
    "badge": { "si": "සමිති හා සංගම්", "ta": "சங்கங்கள்", "en": "Clubs & Societies" },
    "title": { "si": "ශිෂ්‍ය සමිති", "ta": "மாணவர் சங்கங்கள்", "en": "Student Societies" },
    "desc": { "si": "ප්‍රායෝගික කුසලතා...", "ta": "நடைமுறை திறன்கள்...", "en": "Co-curricular activities..." }
  },
  "prefectsHeader": {
    "badge": { "si": "ශිෂ්‍ය නායකත්වය", "ta": "தலைமைத்துவம்", "en": "Student Leadership" },
    "title": { "si": "ශිෂ්‍ය නායක මණ්ඩලය", "ta": "தலைவர்கள் மன்றம்", "en": "Prefects' Guild" },
    "body": { "si": "පාසලේ විනය පවත්වාගෙන යාම...", "ta": "ஒழுக்கத்தை பேணுதல்...", "en": "Upholding campus discipline..." }
  },
  "sports": [
    {
      "name": { "si": "මලල ක්‍රීඩා (Athletics)", "ta": "தடகள விளையாட்டு", "en": "Athletics & Track and Field" },
      "desc": { "si": "කලාප සහ පළාත් මට්ටමින් පදක්කම් දිනූ ක්‍රීඩක ක්‍රීඩිකාවන්.", "ta": "பதக்கங்களை வென்ற வீரர்கள்.", "en": "Zone and provincial champions in track and field." }
    }
  ],
  "clubs": [
    {
      "name": { "si": "පරිසර නියමු බලකාය", "ta": "சுற்றாடல் முன்னோடிப் படை", "en": "Environmental Pioneer Corps" },
      "desc": { "si": "පාසල් පරිශ්‍රය සහ පරිසරය රැකගැනීමේ හරිත ව්‍යාපෘති.", "ta": "சுற்றாடல் பாதுகாப்பு திட்டங்கள்.", "en": "Ecological preservation and green initiatives." }
    }
  ]
}
```

---

### 5.14. SDS & Parents Data: `content/sds.json`
Supplies community partnerships, ongoing infrastructure projects, and termly parent-teacher meetings for `sds-parents.html`.

```json
{
  "subtitle": { "si": "දෙමාපිය, ගුරු සහ ආදි ශිෂ්‍ය සහයෝගීතාවය", "ta": "பெற்றோர், ஆசிரியர், பழைய மாணவர் ஒத்துழைப்பு", "en": "Parent, teacher, and alumni partnership" },
  "communityBadge": { "si": "ප්‍රජා සහභාගීත්වය", "ta": "சமூக பங்களிப்பு", "en": "Community Engagement" },
  "title": { "si": "පාසල් සංවර්ධන සමිතිය සහ ආදි ශිෂ්‍ය සංගමය", "ta": "பாடசாலை அபிவிருத்தி சங்கம்", "en": "School Development Society & Past Pupils Association" },
  "intro": { "si": "පාසලේ භෞතික හා අධ්‍යාපනික සම්පත් දියුණු කිරීම...", "ta": "பாடசாலை வளங்களை மேம்படுத்துதல்...", "en": "Supporting infrastructural growth..." },
  "projectsBadge": { "si": "සංවර්ධන ව්‍යාපෘති", "ta": "அபிவிருத்தி திட்டங்கள்", "en": "Key Initiatives" },
  "projectsTitle": { "si": "ප්‍රමුඛ සංවර්ධන වැඩසටහන්", "ta": "முன்னணி திட்டங்கள்", "en": "Major Development Programs" },
  "meetings": {
    "title": { "si": "වාර්ෂික මහා සභා රැස්වීම සහ දෙමාපිය හමු", "ta": "பொதுக் கூட்டம் மற்றும் பெற்றோர் சந்திப்பு", "en": "Annual General Meeting & Parent Conferences" },
    "desc": { "si": "සෑම පාසල් වාරයක් අවසානයේම පැවැත්වේ.", "ta": "ஒவ்வொரு தவணையின் இறுதியிலும் நடைபெறும்.", "en": "Held at the conclusion of each academic term." }
  },
  "initiatives": [
    {
      "name": { "si": "විද්‍යාගාර හා තාක්ෂණික උපකරණ නවීකරණය", "ta": "ஆய்வுகூட உபகரணங்கள் புனரமைப்பு", "en": "Laboratory Equipment Modernization" },
      "desc": { "si": "ද්විතීයික විද්‍යා හා තාක්ෂණ පීඨ සඳහා අවශ්‍ය උපකරණ.", "ta": "விஞ்ஞான ஆய்வுக்கூட உபகரணங்கள்.", "en": "Procuring precision scientific instruments." }
    }
  ]
}
```

---

### 5.15. Legal Policies Data: `content/legal.json`
Supplies compliance notices with the Sri Lanka Personal Data Protection Act (PDPA No. 9 of 2022) and official crest intellectual property notices for `privacy.html` and `terms.html`.

```json
{
  "privacyPolicy": {
    "title": { "si": "පෞද්ගලිකත්ව ප්‍රතිපත්තිය", "ta": "தனியுரிமைக் கொள்கை", "en": "Privacy Policy" },
    "subtitle": { "si": "ශ්‍රී ලංකා පෞද්ගලික දත්ත ආරක්ෂණ පනතට (PDPA) අනුකූලතාවය", "ta": "இலங்கை தரவுப் பாதுகாப்பு சட்டம் (PDPA)", "en": "Compliance with PDPA No. 9 of 2022" },
    "body": { "si": "මො/පැල්වත්ත නවෝද්‍යා විද්‍යාලයීය නිල වෙබ් අඩවිය...", "ta": "எமது உத்தியோகபூர்வ இணையத்தளம்...", "en": "Mo/Pelwatta Navodya Secondary College respects visitor privacy..." },
    "principlesTitle": { "si": "දත්ත භාවිතය පිළිබඳ මූලධර්ම", "ta": "கொள்கைகள்", "en": "Key Data Protection Principles" },
    "principles": [
      { "si": "කිසිදු පෞද්ගලික තොරතුරක් තෙවන පාර්ශව වෙත ලබා නොදේ.", "ta": "தகவல்கள் மூன்றாம் தரப்பினருக்கு வழங்கப்படாது.", "en": "No user personal data is disclosed to outside commercial entities." }
    ]
  },
  "termsOfUse": {
    "title": { "si": "භාවිත නියමයන්", "ta": "பயன்பாட்டு விதிமுறைகள்", "en": "Terms of Use" },
    "subtitle": { "si": "වෙබ් අඩවිය පරිශීලනය කිරීමේ නීතිමය කොන්දේසි", "ta": "சட்ட நிபந்தனைகள்", "en": "Terms and conditions" },
    "body": { "si": "මෙම වෙබ් අඩවියේ පළවන සියලුම තොරතුරු විද්‍යාලය සතු වේ.", "ta": "தகவல்கள் அனைத்தும் கல்லூரிக்கே சொந்தமானவை.", "en": "All official school notices belong to the college." },
    "ipTitle": { "si": "බුද්ධිමය දේපළ අයිතිය", "ta": "அறிவுசார் சொத்துரிமை", "en": "Intellectual Property & Emblems" },
    "ipDesc": { "si": "පාසල් ලාංඡනය වාණිජ අරමුණු සඳහා භාවිත කිරීම තහනම්ය.", "ta": "இலச்சினையை வணிக நோக்கங்களுக்காக பயன்படுத்துவது தடைசெய்யப்பட்டுள்ளது.", "en": "The official college crest may not be reproduced for commercial purposes." }
  }
}
```

---

### 5.16. News Articles Index & Detail Files: `content/news/index.json` and `content/news/news-[id].json`
Used by `news.html` and `news-detail.html` for deep articles and category navigation.

#### Articles Index: `content/news/index.json`
```json
{
  "categories": [
    { "id": "all", "title": { "si": "සියල්ල", "ta": "அனைத்தும்", "en": "All News" } },
    { "id": "academic", "title": { "si": "ශාස්ත්‍රීය", "ta": "கல்வி", "en": "Academic" } },
    { "id": "sports", "title": { "si": "ක්‍රීඩා", "ta": "விளையாட்டு", "en": "Sports" } },
    { "id": "events", "title": { "si": "විශේෂ උත්සව", "ta": "நிகழ்வுகள்", "en": "Events" } },
    { "id": "circulars", "title": { "si": "නිල චක්‍රලේඛ", "ta": "சுற்றறிக்கைகள்", "en": "Official Circulars" } }
  ],
  "articles": [
    {
      "id": "news-1",
      "date": "2026-03-20",
      "category": "academic",
      "title": {
        "si": "2026 පළමු පාසල් වාර විභාග කාලසටහන ප්‍රකාශයට පත් කෙරේ",
        "ta": "2026 முதலாம் தவணை பரீட்சை கால அட்டவணை வெளியிடப்பட்டது",
        "en": "First Term Examination Timetables 2026 Released for All Grades"
      },
      "excerpt": {
        "si": "6 ශ්‍රේණියේ සිට 13 ශ්‍රේණිය දක්වා පළමු පාසල් වාර විභාග අප්‍රේල් මස මුල් සතියේදී ආරම්භ වේ.",
        "ta": "தரம் 6 முதல் 13 வரையான மாணவர்களுக்கான முதலாம் தவணை பரீட்சை ஏப்ரல் முதல் வாரத்தில் தொடங்கும்.",
        "en": "First Term Examinations for Grades 6 through 13 will commence in the first week of April."
      },
      "thumbnail": "images/campus-hero.jpg"
    }
  ]
}
```

#### Individual Article: `content/news/news-1.json`
```json
{
  "id": "news-1",
  "date": "2026-03-20",
  "category": "academic",
  "image": "images/campus-hero.jpg",
  "title": {
    "si": "2026 පළමු පාසල් වාර විභාග කාලසටහන ප්‍රකාශයට පත් කෙරේ",
    "ta": "2026 முதலாம் தவணை பரீட்சை கால அட்டவணை வெளியிடப்பட்டது",
    "en": "First Term Examination Timetables 2026 Released for All Grades"
  },
  "content": [
    {
      "si": "මො/පැල්වත්ත නවෝද්‍යා ද්විතීයික විද්‍යාලයේ 6 ශ්‍රේණියේ සිට 13 ශ්‍රේණිය දක්වා සියලුම ශ්‍රේණි සඳහා වන 2026 පළමු පාසල් වාර ඇගයීම් විභාග කාලසටහන මේ වන විට විද්‍යාලීය දැන්වීම් පුවරුවේ සහ මෙම වෙබ් අඩවියේ බාගත කිරීම් අංශයේ පළ කර ඇත.",
      "ta": "தரம் 6 முதல் 13 வரையான சகல மாணவர்களுக்கான முதலாம் தவணை பரீட்சை கால அட்டவணை தற்போது வெளியிடப்பட்டுள்ளது.",
      "en": "The First Term Examination schedule for all classes from Grade 6 to Grade 13 has been officially published under the Downloads section."
    }
  ]
}
```

---

### 5.17. Standalone Gallery Catalog: `content/gallery/index.json`
Provides structured albums and categorized photos for `gallery.html`.

```json
{
  "albums": [
    { "id": "all", "title": { "si": "සියල්ල", "ta": "அனைத்தும்", "en": "All Photos" } },
    { "id": "campus", "title": { "si": "පරිශ්‍රය", "ta": "வளாகம்", "en": "Campus" } },
    { "id": "academics", "title": { "si": "අධ්‍යයන", "ta": "கல்வி", "en": "Academics" } },
    { "id": "sports", "title": { "si": "ක්‍රීඩා", "ta": "விளையாட்டு", "en": "Sports" } },
    { "id": "cultural", "title": { "si": "සංස්කෘතික", "ta": "கலாச்சாரம்", "en": "Cultural" } }
  ],
  "items": [
    {
      "id": "g-1",
      "albumId": "campus",
      "image": "images/campus-hero.jpg",
      "caption": {
        "si": "පැල්වත්ත හරිත සොඳුරු වටපිටාවේ පිහිටි ද්විතීයික විද්‍යාලීය ප්‍රධාන පරිශ්‍රය",
        "ta": "பசுமையான இயற்கை சூழலில் அமைந்துள்ள பிரதான கல்லூரி வளாகம்",
        "en": "The main secondary academic campus set amid scenic greenery in Pelwatta"
      },
      "date": "2026-02-15"
    }
  ]
}
```

---

## 6. Public Site Implementation Rules

### 6.1. Language Engine & Synchronization
- Active language is stored in browser `localStorage` under **both** keys:
  - `pelwatta_lang`
  - `site_lang`
- Supported codes: `'si'` (Sinhala, default), `'ta'` (Tamil), `'en'` (English).
- When a visitor selects a language button:
  1. `document.documentElement.lang = lang;`
  2. `document.documentElement.className = 'lang-' + lang;`
  3. `localStorage.setItem('pelwatta_lang', lang);` and `localStorage.setItem('site_lang', lang);`
  4. Dynamic content re-renders completely using the helper:
     ```javascript
     function t(obj) {
       if (!obj) return '';
       if (typeof obj === 'string') return obj;
       const lang = localStorage.getItem('pelwatta_lang') || 'si';
       return obj[lang] || obj['si'] || obj['en'] || '';
     }
     ```
  5. Static DOM elements bearing `[data-i18n]` attributes have their text updated from `content/translations.json`.
  6. **Zero Mixed-Language Rule:** When switching to Tamil, zero Sinhala or English remains visible; when switching to English, zero Sinhala or Tamil remains visible.

### 6.2. Accessibility Toolbar
- Present on every page in the top notice bar.
- Controls:
  - **A-**: Decreases base font size (`--font-scale: 0.9` or `calc(1rem - 2px)`).
  - **A**: Restores default font size (`--font-scale: 1.0`).
  - **A+**: Increases base font size (`--font-scale: 1.15` or `calc(1rem + 2px)`).
  - **Contrast Toggle**: Toggles `data-contrast="high"` on `document.documentElement` and stores state in `localStorage.setItem('site_contrast', 'high')`.
- High contrast CSS sets high-contrast black background, high-contrast gold/yellow borders, and dark inverted elements.

### 6.3. Visual Identity
- **Maroon (Primary):** `--primary: #7a1c28;` / `--primary-dark: #58121b;` / `--primary-subtle: #fbf2f3;`
- **Gold (Accent):** `--gold: #c99738;` / `--gold-dark: #9e7323;` / `--gold-light: #dfb55d;` / `--gold-subtle: #fdf8ed;`
- **Theme Editor Compatibility:** All primary and accent colors in `css/style.css` must remain inside a `:root { ... }` block using standard hex notation so the admin panel's **Theme** tab can parse and edit them.

---

## 7. Compatibility & Verification Checklist

Before publishing any new version, redesign, or page overhaul of the site, verify every item on this checklist:

### News Verification:
- [ ] Adding or editing a news item in the admin panel updates `content/news-items.json`.
- [ ] News items render on `index.html` (latest cards) and `news.html` (with category filter and search).
- [ ] Uploaded news photos are saved into `images/` with the filename pattern `news-[timestamp]-[idx].jpg`.

### Gallery Verification:
- [ ] Adding a photo in the admin panel updates `content/gallery-items.json`.
- [ ] Uploaded gallery photos are saved into `images/` with the filename pattern `gallery-[timestamp]-[idx].jpg`.
- [ ] Photos render on `gallery.html`, category filters work, and lightbox opens with trilingual caption.

### Page Text Verification:
- [ ] All 9 selectable files in the **Page Text** dropdown load without errors:
  `content/common.json`, `content/pages/home.json`, `content/pages/about.json`, `content/pages/academic.json`, `content/pages/student-life.json`, `content/pages/gallery.json`, `content/pages/news.json`, `content/pages/admissions.json`, `content/pages/contact.json`.
- [ ] Saving modifications in the admin panel commits clean, 2-space indented JSON to GitHub.
- [ ] Public site re-reads and displays the committed text.

### Downloads Verification:
- [ ] Uploading a PDF via the Downloads tab stores the binary PDF in `downloads/` and appends its trilingual label to `content/pages/academic.json`.
- [ ] Every PDF link on `downloads.html` and `academic.html` corresponds to a physical file in `downloads/` (zero 404 errors).

### Applications Verification:
- [ ] Entering a valid Google Sheet "Publish to web" CSV URL in the Applications tab loads and renders admissions records in the read-only table.
- [ ] Form submission on `admissions.html` sends a background `fetch()` POST to Google Forms and renders a real reference number `PEL-2026-XXXX`.

### Architectural & Trilingual Integrity:
- [ ] **Zero Absolute Links:** Run `grep -rnE "(href|src|fetch)\s*[\(=]\s*[\"']/[^\"']+" .` — must return 0 results.
- [ ] **No Build Tools:** Zero build steps. Site deploys directly to GitHub Pages.
- [ ] **No Admin Links on Public Pages:** Search all public HTML files for `Admin`, `CMS`, `Manage`, `Login` — must return 0 links or buttons.
- [ ] **Protected Paths Untouched:** `xk92m-manage/` and `.github/` remain completely intact.
- [ ] **Trilingual Switch:** Switching between Sinhala, Tamil, and English updates 100% of visible UI copy with zero untranslated leftovers.
- [ ] **Mandatory Developer Credit:** HTML comment present on line 1 of `index.html` and visible credit line present in footer bottom across all pages: `Website developed by [S.A.Chanuk Mithuja ]`.
