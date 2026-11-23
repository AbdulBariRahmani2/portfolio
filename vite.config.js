import { defineConfig } from "vite";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { SITE_ORIGIN, pageMeta } from "./src/pageMeta.js";

/*
  The site is deployed as static files, so a hard request for /about (shared
  link, refresh, crawler) has no file to serve and the host answers with its
  404 page. This plugin writes one index.html per public route, with that
  route's own title, description, canonical and social tags baked in, so every
  URL resolves with a 200 and React Router takes over. No server config needed.

  The markup inside #root is filled afterwards by scripts/prerender.mjs.
*/
function escapeHtml(value) {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

function replaceOnce(html, pattern, replacement, label) {
  if (!pattern.test(html)) throw new Error(`spa-route-fallbacks: could not find ${label} in index.html`);
  return html.replace(pattern, replacement);
}

function withRouteMetadata(template, meta) {
  const url = `${SITE_ORIGIN}${meta.canonical}`;
  const title = escapeHtml(meta.title);
  const description = escapeHtml(meta.description);

  let html = replaceOnce(template, /<title>[^<]*<\/title>/, `<title>${title}</title>`, "title");
  html = replaceOnce(html, /(<meta name="description" content=")[^"]*(")/, `$1${description}$2`, "description");
  html = replaceOnce(html, /(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`, "canonical");
  html = replaceOnce(html, /(<meta property="og:title" content=")[^"]*(")/, `$1${title}$2`, "og:title");
  html = replaceOnce(html, /(<meta property="og:description" content=")[^"]*(")/, `$1${description}$2`, "og:description");
  html = replaceOnce(html, /(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`, "og:url");
  html = replaceOnce(html, /(<meta name="twitter:title" content=")[^"]*(")/, `$1${title}$2`, "twitter:title");
  html = replaceOnce(html, /(<meta name="twitter:description" content=")[^"]*(")/, `$1${description}$2`, "twitter:description");
  return html;
}

/*
  The hero photo preload only makes sense on the home page; copied verbatim
  into /about/ etc. it makes the browser fetch an image those routes never
  show (Chrome warns "preloaded but not used").
*/
function withoutHeroPreload(html) {
  const stripped = html.replace(
    /[^\S\r\n]*<!-- First hero photo[\s\S]*?fetchpriority="high"\s*\/>\r?\n/,
    ""
  );
  if (stripped === html) throw new Error("spa-route-fallbacks: could not remove the home-page image preload");
  return stripped;
}

function spaRouteFallbacks() {
  let outDir = "dist";
  let enabled = true;

  return {
    name: "spa-route-fallbacks",
    apply: "build",
    configResolved(config) {
      outDir = config.build.outDir;
      // scripts/prerender.mjs runs its own SSR build; skip this there.
      enabled = !config.build.ssr;
    },
    closeBundle() {
      if (!enabled) return;
      const template = readFileSync(resolve(outDir, "index.html"), "utf8");
      for (const [path, meta] of Object.entries(pageMeta)) {
        if (path === "/") continue;
        const dir = resolve(outDir, meta.canonical.replace(/^\/+|\/+$/g, ""));
        mkdirSync(dir, { recursive: true });
        writeFileSync(resolve(dir, "index.html"), withoutHeroPreload(withRouteMetadata(template, meta)));
      }
    }
  };
}

export default defineConfig({
  base: "/",
  plugins: [spaRouteFallbacks()]
});
