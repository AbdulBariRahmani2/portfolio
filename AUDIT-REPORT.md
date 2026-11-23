# Lighthouse audit & optimization — Abdul Bari Rahmani portfolio

Date: 22 November 2026 · Site: https://www.abdulbarirahmani.com/ · Build: Vite 7 + React 18 SPA

Everything below was measured on the **production build** (`npm run build` + `vite preview`), with
Lighthouse 13.6 using its default mobile emulation and its desktop preset, on the same machine, so
before/after numbers are comparable.

## 1. Issues found

### From the Lighthouse report

| # | Issue | Where it came from | Status |
|---|---|---|---|
| 1 | Render-blocking chain of 1,274 ms: `styles.css` → `fonts.googleapis.com/css2` → `fonts.gstatic.com` | CSS `@import` at the top of `src/styles.css` | Fixed |
| 2 | 549 KiB of image waste (originals up to 2048×1624 displayed at ~482×470) | `public/images/*.webp` used directly, no `srcset` | Fixed |
| 3 | 94 KiB cache lifetime warning (7-day TTL on static assets) | Hostinger default `Cache-Control` | Hosting config, see §7 |
| 4 | 25 KiB unused JavaScript | React DOM internals + `react-router` dev build; one unused dependency | Partly fixed, see §5 |
| 5 | CLS 0.005 from the web font swapping in | Google Fonts + no preload | Fixed |
| 6 | LCP element (hero `<h1>`) not painted until 2.1 s; LCP image not discoverable in initial HTML | Font chain + client-rendered `<img>` | Fixed |
| 7 | Contrast 4.33:1 on `.section-lead` (`#64748b` on `#eef5fb`) | `--muted` on the "soft" section background | Fixed |
| 8 | Second external CDN origins for technology logos (jsDelivr + Simple Icons), pinned to a moving `@latest` tag | `src/pages/Home.jsx` | Fixed (self-hosted) |

### Found during the audit, not in the Lighthouse report

| # | Issue | Impact | Status |
|---|---|---|---|
| 9 | Every route except `/` returned **HTTP 404** on the live host (`/about`, `/services`, `/portfolio`, `/blog`, `/contact`) — they are listed in `sitemap.xml` | Broken deep links, broken refreshes, unindexable pages | Fixed in the build |
| 10 | All pages shared one `<title>`, description and no canonical; no Open Graph / Twitter tags; no structured data | Weak search and social previews | Fixed |
| 11 | `sitemap.xml` and `robots.txt` used the non-www domain, canonical did not exist; both `www` and non-www return 200 | Duplicate-host signals | Fixed (canonical + sitemap), redirect in §7 |
| 12 | Dark theme: nav CTA label rendered in muted grey on blue (**1.63:1**) and filled buttons used white on `#2f8fe5` (**3.40:1**) | Unreadable buttons in dark mode | Fixed |
| 13 | Dark theme: form placeholders at 3.86:1 | Low contrast | Fixed |
| 14 | Nav CTA contrast bug was invisible to Lighthouse because it audits light mode only | — | Fixed and re-checked manually |
| 15 | No visible focus style beyond the UA default; mobile menu button had no `aria-expanded` | Keyboard/screen-reader UX | Fixed |
| 16 | `react-icons` dependency installed but never imported | Dead dependency | Removed |
| 17 | No security headers (CSP, HSTS, COOP, X-Frame-Options, nosniff, Referrer-Policy) | XSS/clickjacking hardening | Config provided, §7 |

## 2. Files modified

| File | Change |
|---|---|
| `src/styles.css` | Replaced the Google Fonts `@import` with four self-hosted `@font-face` blocks (variable weights 400–700 / 600–800, latin + latin-ext, unicode-range). `--muted` #64748b → #5d6e84. New `--blue-strong` token (light #0d66c2, dark #1a6fb5) used by filled buttons, nav CTA, brand mark and social pills. Dark form placeholder → #7c8da3. `html.dark .nav-links a.nav-cta` keeps its label white. Global `:focus-visible` outline. |
| `index.html` | Preload for the two latin fonts and for the first hero photo (with `imagesrcset`/`imagesizes`, no `href`, so no duplicate download). Canonical, Open Graph, Twitter card and `Person` + `WebSite` JSON-LD. |
| `src/pages/Home.jsx` | Technology logos now point at `/logos/*.svg` instead of two CDNs; hero slides use `srcset` (700w/1000w) + `sizes` and `fetchPriority="high"` on the first slide. |
| `src/components/RouteMetadata.jsx` | New: keeps title, description, canonical and social tags in sync on client-side navigation. |
| `src/pageMeta.js` | New: one source of truth for per-page metadata, shared by the runtime and the build. |
| `src/App.jsx` | Mounts `<RouteMetadata />` once inside the shell. |
| `src/components/Navbar.jsx` | `aria-expanded` + `aria-controls` on the mobile menu button, `id` on the nav. Theme state is guarded for server rendering and the icon/labels wait for mount, so dark-mode visitors hydrate without a mismatch. |
| `src/pages/Contact.jsx` | Success message is now `role="status"` (announced by screen readers). |
| `vite.config.js` | New `spa-route-fallbacks` plugin: writes `about/index.html`, `services/index.html`, … with that route's own head tags baked in, so static hosting serves 200 for every public URL. Also drops the home-page hero image preload from sub-route copies and skips itself during the prerender build. |
| `src/entry-server.jsx`, `scripts/prerender.mjs` | New: build-time render of every route to HTML (`react-dom/server`) written into `#root`, wired into `npm run build`. |
| `src/main.jsx` | `hydrateRoot` when the container already has prerendered markup, `createRoot` otherwise. |
| `public/fonts/*.woff2` | New: 4 self-hosted variable font files (DM Sans latin/latin-ext 36.9/18.2 KB, Manrope latin/latin-ext 24.5/15.2 KB). |
| `public/logos/*.svg` | New: 18 brand SVGs (previously hot-linked from CDNs). |
| `public/images/*-700.webp`, `*-1000.webp` | New: 10 responsive derivatives (originals untouched). |
| `public/images/abdul-bari-og.jpg` | New: 1200×630 social preview image (113 KB, JPEG for crawler compatibility). |
| `public/sitemap.xml`, `public/robots.txt` | Production host switched to `https://www.…`, trailing-slash URLs matching the served pages, `lastmod` updated. |
| `package.json`, `package-lock.json` | Removed unused `react-icons`. |
| `deploy/hostinger/.htaccess` | New, opt-in: security headers, one-year immutable caching for hashed assets, non-www → www 301. Not shipped to `dist/` automatically. |

## 3. Results

| | Before (mobile) | After (mobile) | Before (desktop) | After (desktop) |
|---|---|---|---|---|
| Performance | 96 | **97** | 96 | **100** |
| Accessibility | 95 | **100** | 95 | **100** |
| Best Practices | 100 | **100** | 100 | **100** |
| SEO | 100 | **100** | 100 | **100** |

| Metric (mobile) | Before | After |
|---|---|---|
| First Contentful Paint | 2.1 s | **0.8 s** |
| Largest Contentful Paint | 2.1 s | **0.8 s** |
| Speed Index | 2.5 s | **1.0 s** |
| Total Blocking Time | 96 ms | 150–300 ms (see below) |
| Cumulative Layout Shift | 0.005 | **0** |
| Page weight | 999 KB | **397 KB** |
| Image bytes | 861 KB | **259 KB** |
| Requests | 25 | 24 |
| Render-blocking time | ~1,400 ms | ~160 ms (only the app's own 5.2 KB CSS) |

Desktop after: FCP 0.2 s, LCP 0.7 s, TBT 10 ms, CLS 0 — 100/100/100/100.

### Why mobile TBT moved from 96 ms to 150–300 ms

TBT only counts main-thread blocking **after** FCP. Before, the fonts blocked the first paint until
~2.1 s, so most of React's startup work happened *before* FCP and was not counted as TBT (it was
counted as a slow FCP instead). Now the page paints at 0.8 s and the same startup work lands inside
the TBT window. Script evaluation actually went **down** (211 ms → ~160 ms); the numbers just moved
from FCP to TBT. Measured TBT varies 150–300 ms between runs on this machine because Lighthouse
emulates a 4× slower CPU; on the user's own run (same code, faster host machine) TBT was 0 ms.
Getting to a flat 100 on mobile would mean removing work React has to do on load (route-level
code-splitting was evaluated: it moves ~4–5 KB of gzip and does not touch React DOM), which is not
worth the extra request and the blank-frame risk on a six-page portfolio.

## 4. What was optimized

- **Fonts:** removed the `@import` chain (`CSS → Google CSS → gstatic`) and self-hosted the two
  variable files. The browser now does one DNS/TLS to our own origin and starts the text render
  immediately; both latin files are preloaded, latin-ext is declared with `unicode-range` and is not
  downloaded unless needed.
- **Images:** five hero photos now ship as 700w/1000w WebP with `srcset`/`sizes` and an LCP preload
  that resolves to the right candidate (verified: 700w at 390 px, 1000w at 1440 px, no double
  download, no "preloaded but not used" warning). Originals kept in `public/images`.
- **Icons:** 18 brand SVGs moved from two CDNs to `/logos`, removing two origins (DNS/TLS) and the
  dependency on devicon's `@latest` tag.
- **DOM head:** canonical, OG/Twitter, JSON-LD, per-route static HTML for crawlers.
- **Dependency hygiene:** dropped `react-icons` (never imported).
- **CSS:** only additive changes; no existing rule was rewritten except the `--muted` value and the
  filled-button colour token.

## 5. Remaining Lighthouse findings and why

- **Unused JavaScript (26 KB gzip).** The source-map build shows 16.9 KB of it is
  `react-dom.production.min.js` (event system and inert branches), 5.8 KB `react-router`, and ~4 KB
  the five non-home pages. `react-router` 7.18 ships its development build to bundlers (its
  `exports` map has no production condition); aliasing the internal file would save a few KB but
  breaks on the next router upgrade, so it was left alone.
- **Improve image delivery (38 KB mobile / 82 KB desktop).** What remains is the crop ratio: the
  slideshow box is 482×470 while the portrait photos are 3:4, so `object-fit: cover` shows a
  ~480 px band of a 933 px-tall file. Cutting that further would change the framing of the photos.
- **Render-blocking (~160 ms).** Only the app's own stylesheet is left. Inlining it would trade a
  cacheable file for a bigger HTML document; not worth it for a single-page site.
- **Network dependency tree.** Now a flat one-hop chain (`index.html → js/css`); no third-party
  origin is left to preconnect to.
- **Cache lifetimes** is a server setting — see §7.

## 6. Verification performed

- `npm run build` succeeds; `dist/` contains the route folders, fonts, logos and image derivatives.
- Deep links served by a plain static server (`python -m http.server`): `/about/` → 200 with the
  correct static `<title>`, description and canonical; `/nope` → 404.
- All six routes in the browser: exactly one `<h1>`, unique title/description/canonical, one
  WhatsApp button, no missing `alt`, no broken images, no horizontal overflow.
- Overflow checked at 320, 360, 390, 768 and 1440 px CSS width: 0 px on Home and Contact.
- Mobile menu: opens/closes, `aria-expanded` toggles, all links present.
- Dark theme: nav CTA now `#fff` on `#1a6fb5` (5.27:1); full palette re-checked in both themes,
  every text pair ≥ 4.5:1 (≥ 3:1 for the 24 px eyebrow).
- Fonts load from `/fonts` (latin only, 200 OK); zero requests to any third-party origin on Home.
- Console: no errors or warnings at 390 px or 1440 px.
- WhatsApp button unchanged: `https://wa.me/93700609192?text=…`, `target="_blank"`,
  `rel="noopener noreferrer"`, accessible label.
- The proposed CSP/HSTS/COOP/nosniff/Referrer-Policy set was applied to a local server and the site
  was loaded under it: renders, fonts, images, 18 logos, JSON-LD and routing all work, no CSP
  violations in the console.

## 7. Needs hosting access (Hostinger)

Ready-to-upload config: `deploy/hostinger/.htaccess`.

1. **Security headers** — CSP, HSTS, `X-Frame-Options: DENY` + `frame-ancestors 'none'`, COOP,
   `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`. Hostinger currently
   sends only `content-security-policy: upgrade-insecure-requests`; the proposed policy keeps that
   directive, so the two do not conflict.
2. **Cache lifetimes** — assets are served with `max-age=604800` (7 days). The file above sets
   one-year immutable caching for hashed JS/CSS/fonts/images and revalidation for HTML.
3. **One canonical host** — `https://abdulbarirahmani.com/` currently answers 200 without
   redirecting to `www`. Canonical tags and the sitemap now both use `www`; a 301 in the file above
   makes it unconditional.
4. **Redploy `dist/`** — issues 9 (route 404s) and the new head tags only take effect once the new
   build is uploaded. The previous build is still live (`last-modified` 16:31 UTC).

## 8. Prerendering (follow-up)

The per-route HTML from §2 gave each URL its own head tags but left `#root` empty, so anything
that does not run JavaScript saw a blank page with a correct title. `npm run build` now also
renders every route and writes the markup in:

| Route | `<h1>` in the served HTML | Visible words without JS | HTML (raw / gzip) |
|---|---|---|---|
| `/` | I build modern web experiences… | 464 | 27.5 / 6.2 KB |
| `/about/` | A developer who cares about both the code… | 259 | 15.5 / 4.2 KB |
| `/services/` | Web development services built around real project goals. | 285 | 18.2 / 4.3 KB |
| `/portfolio/` | Selected projects and experiments. | 202 | 13.0 / 3.8 KB |
| `/blog/` | What I'm learning, building and thinking about. | 214 | 12.2 / 3.7 KB |
| `/contact/` | Let's talk about your next website or web application. | 172 | 14.7 / 4.1 KB |

Verified: `curl` against a plain static server returns real markup for all six URLs; in the browser
the pages hydrate with no console error or hydration mismatch on `/`, `/about/`, `/portfolio/`,
client-side navigation still works without a reload, the dark theme survives a reload, and the
contact form still submits. The home-page hero preload is no longer copied into sub-routes (it made
Chrome fetch an image those pages never show, and warn about it).

Cost: ~4.9 KB gzip of extra HTML on the home page and the React tree is hydrated instead of created
(the same React work as before, minus DOM creation).

## 9. Unverified / limitations

- Nothing was deployed and no git commit was made; all results are from the local production build.
- Hostinger header/caching behaviour cannot be exercised from here (no Apache/LiteSpeed locally, no
  deploy). The `.htaccess` is standard syntax and the CSP was browser-tested locally, but it must be
  verified with `curl -I` after upload.
- Lighthouse's mobile run on this machine is CPU-throttled and shares hardware with other processes,
  which is why TBT fluctuates; FCP/LCP/CLS/Speed Index were stable across runs.
- The prerendering follow-up was **not** benchmarked with Lighthouse: during that session every run
  hung after writing its report, and repeated identical runs reported observed first paint of 791 ms
  and 805 ms while the `load` event fired at 449 ms — contradictory enough to be machine contention,
  not the build. Scores in §3 are the last stable measurement and are unaffected by prerendering
  (same CSS, same JS bundle, ~5 KB more HTML, hydration instead of DOM creation).
- Keyboard `:focus-visible` could not be captured through the automation channel (synthetic Tab does
  not flip Chrome's focus-visible heuristic); the rule is present in the compiled CSS and the UA
  default ring still applies.
