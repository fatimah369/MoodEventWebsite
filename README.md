# Mood Event — Website

A bilingual (Arabic-first / English toggle) corporate marketing site for **Mood Event**, a Saudi experience-led event management company. Plain HTML/CSS/JS — no framework, no build step, no backend. Clone it, open `index.html`, and it works.

Live repo: https://github.com/fatimah369/MoodEventWebsite

## Quick start

No install, no build. Any static file server works:

```bash
python -m http.server 4173
# then open http://localhost:4173
```

or just double-click `index.html` to open it directly in a browser (everything except the lead forms' network calls works from `file://` too).

## Pages

| File | Purpose |
|---|---|
| `index.html` | Homepage — hero, portfolio ("كل الأعمال"), services, stats, news, contact form |
| `booths.html` | Standalone sales landing page for the Exhibition Booths service, own purple color system layered under the shared header/footer |
| `days-calendar.html` | "World Days Calendar" tool — live countdown row, month-by-month tabs, industry lead-magnet form |
| `mood-camp.html` | Mood Camp sub-brand page |
| `admin.html` | Local-only tool to edit `news.json` through a form UI (not linked publicly — don't deploy it if you don't want it reachable) |

All pages share `style.css` and `script.js`. `booths.html` additionally carries its own `<style>` block (classes prefixed `bp-`) for its distinct purple palette — see below.

## How the bilingual system works

Every piece of visible text is written twice, inline, as a pair of spans:

```html
<span data-ar>النص بالعربي</span><span data-en>The English text</span>
```

CSS hides whichever language isn't active:

```css
html[dir="rtl"] [data-en]{display:none!important}
html[dir="ltr"] [data-ar]{display:none!important}
```

`setLanguage('ar' | 'en')` in `script.js` (section 1) flips `<html lang>`/`dir`, swaps `<title>` (from `data-title-ar`/`data-title-en` on `<html>`), and re-translates `<select>` options. The site boots in Arabic (`setLanguage('ar')` at the very end of `script.js`). **There is no dash (—/–) anywhere in visible copy** — that's a deliberate house style; use commas, periods, colons, or a middot (`·`) instead.

## Color system

Main site (`style.css` `:root`):

| Token | Hex | Use |
|---|---|---|
| `--magenta` | `#B22EC9` | primary accent — buttons, links, focus |
| `--violet` | `#8C2AA2` | hover states, gradient partner |
| `--plum` | `#601C6C` | deep accent — icon gradients |
| `--lilac` | `#8A4DA0` | eyebrows, tags, kickers |
| `--bg` | `#F5F2F7` | page background |
| `--surface` / `--surface-2` | `#FFFFFF` / `#EFE8F4` | cards / card hover |
| `--white` | `#1B1420` | headings (named `white` for historical reasons — it's actually the ink color) |

`booths.html` runs its own separate palette (`--bp-purple-900 #3D2755`, `--bp-purple-500 #7851A0`, `--bp-lavender-300 #B19EC4`, `--bp-lavender-100 #E1DBE7`), scoped entirely to that page.

## Forms

Three forms, all wired through a shared `wireForm()` helper in `script.js` (section 6) that handles validation, error messages, and a honeypot field — look for `[name="website"]` inputs hidden off-screen.

- **Contact form** (`index.html`, `#contact-form`) — currently local-only (shows a success message but doesn't send anywhere). Needs a real submission endpoint before launch — see "What's not finished" below.
- **Lead-magnet form** (`days-calendar.html`, `#lead-form`) — posts JSON to `LEAD_WEBHOOK_URL` (set near the top of script.js section 6b; currently empty, so it just logs to console and demos the success state).
- **Booth inquiry form** (`booths.html`, `#booth-lead-form`) — opens a prefilled `mailto:sales@moodevent.net` link. No backend needed, works as-is.

## Editing content

- **Most text**: edit the HTML directly, keeping the `data-ar`/`data-en` span pattern and no dashes.
- **News section**: open `admin.html` locally, edit/add/reorder items, click "تنزيل news.json", and replace `news.json` with the downloaded file.
- **Portfolio photos**: real client images live in `images/project-*.jpg`; logos live in `images/logos/`. The `الأعمال/` and `logos/` folders at the project root are a working archive of originals (not referenced by any page) — keep them for future edits, they're not needed to serve the site.
- **"World Days" data**: the real 33 fixed-date events (and niche tags) are defined directly in `script.js` (section 3e, `WORLD_DAYS_FIXED`) and section 3f (`MONTH_EVENTS`). This was manually cross-checked against a separate internal "Days Calendar" data project — don't add entries without a verified source; the whole feature's value is that none of it is invented.

## What's not finished / needs a decision before launch

1. **Contact form has no real backend.** Recommended: [Web3Forms](https://web3forms.com) (free, portable) or Netlify Forms if hosting there — see `script.js` section 6, `wireForm(document.getElementById('contact-form'), ...)`.
2. **`LEAD_WEBHOOK_URL`** in `script.js` is empty. To make the Days Calendar lead form actually email a file: create a Zapier "Catch Hook" webhook, add a Path step keyed on the `industry` field, attach the matching file per industry in an email action, then paste the Catch Hook URL into that constant.
3. **Content-Security-Policy** meta tags are already set on every page (`script-src 'self'`, Google Fonts allowed, `connect-src` allows `hooks.zapier.com`) — update `connect-src` if you add a different form backend.
4. **Not deployed anywhere live yet.** Any static host works (Netlify, Vercel, GitHub Pages, Cloudflare Pages); no build step required, just point the host at the repo root.
5. **A few portfolio cards still use placeholder SVGs** instead of real photos (e.g. "Al Ghadir Resort launch", "The Royal Commission"). Search `index.html` for `project-al-ghadir-ceremony.svg` to find them — swap in real photos as they become available, following the pattern of the other `project-*.jpg` cards.

## Repo housekeeping

- `main` is the default branch; active work has been happening on `feature/lead-form-and-content-updates` (see open PR).
- `.claude/launch.json` configures the local dev server for the Claude Code preview pane — irrelevant to any other workflow, safe to ignore or delete.
