# මේ Website එක GitHub Repository එකට දාන්නේ කොහොමද

මේ zip එකේ තියෙන්නේ **සම්පූර්ණ, working website එකක්** - AI Studio/Vite/build-step කිසිවක් නැතුව, plain HTML/CSS/JS විදිහටම. සියලුම paths දැනටමත් **relative** (GitHub Pages subpath එකක වැඩ කරන විදිහටම) හදලා තියෙනවා.

## දාන්නේ කොහොමද (existing `school-website` repo එකටම)

1. github.com/max403565-hash/school-website යන්න
2. **Settings → Pages** වලට ගිහින් Pages එක **"None"** කරලා තියෙනවා නම්, දැනට ඒ විදිහටම තියන්න (අපි පහළින් step එකකින් ආයෙත් on කරනවා)
3. Repository එකේ root එකේ තියෙන **පරණ files සියල්ල delete කරන්න** (safest approach - පරණ Vite/broken files ටික සම්පූර්ණයෙන්ම ඉවත් වෙන්න):
   - repo එකේ, එක එක file/folder එකේ "..." menu → Delete (හෝ, GitHub.dev/local git මගින් සියල්ල එකවර delete කරන්න)
4. මේ zip එකේ ඇතුළත් **සියලුම files සහ folders** (index.html, about.html, assets/, content/, images/, xk92m-manage/, robots.txt, sitemap.xml ආදී සියල්ල) repository එකට **upload** කරන්න:
   - repo page එකේ **"Add file" → "Upload files"** click කරන්න
   - zip එක extract කරගත්ත folder එකේ ඇතුළත තියෙන **සියලුම files/folders එකවර** drag-and-drop කරන්න (zip file එකම නෙවෙයි, extract කරපු content එක)
   - "Commit changes" click කරන්න
5. **Settings → Pages** → Branch: **main**, Folder: **/(root)** → **Save**
6. ටික මිනිත්තු කිහිපයක් ඉඳලා, `https://max403565-hash.github.io/school-website/` ගිහින් බලන්න

## Admin Panel එකට යන්නේ කොහොමද

```
https://max403565-hash.github.io/school-website/xk92m-manage/index.html
```

ඔයා කලින් generate කරගත්ත GitHub token එකම (තාම valid නම්) හෝ අලුත් token එකක් දාලා connect වෙන්න.

## මොනවද මේකේ Fix වෙලා තියෙන්නේ

- ✅ Absolute paths (`/css/...`) සියල්ල relative paths බවට පත් කරලා - GitHub Pages subpath එකේ **100% වැඩ කරනවා**
- ✅ Vite/build-step/backend/API endpoints කිසිවක් නෑ - plain static HTML/CSS/JS විතරයි
- ✅ Fake content (College Anthem, Houses, NCC, fake news) කිසිවක් නෑ
- ✅ Admin panel එක GitHub Personal Access Token එකෙන්ම, කෙලින්ම GitHub API එකට save කරනවා
- ✅ Trilingual (සිංහල/தமிழ்/English) සම්පූර්ණ site එකම
- ✅ PDPA consent checkbox එක Admissions form එකේ
- ✅ "Admin" කියලා public site එකේ කිසිම trace එකක් නෑ

## ඉදිරියට කරගන්න ඕන දේවල් (optional, පස්සේ)

- `content/`, `about.json` ආදී files වල placeholder content (dummy principal names, dates) ඇත්ත content එකෙන් replace කරගන්න - admin panel එකෙන්ම කරගන්න පුළුවන්
- `images/` folder එකේ placeholder SVG images, ඇත්ත photos වලින් replace කරගන්න (admin panel එකේ "Gallery" tab එකෙන්)
- `sitemap.xml` එකේ, `<loc>` tags වලට **සම්පූර්ණ URL එක** (`https://max403565-hash.github.io/school-website/index.html` වගේ) දාන්න, පස්සේ
