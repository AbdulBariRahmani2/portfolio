/*
  Prerender step, run after `vite build` (see package.json).

  The client build writes one index.html per public route (vite.config.js) with
  that route's metadata, but that file's #root is empty, so anything that does
  not execute JavaScript sees a blank page with correct head tags. This script
  builds src/entry-server.jsx with Vite, renders every route in pageMeta to a
  string with StaticRouter, and writes the markup into #root. main.jsx then
  hydrates that markup, so the browser keeps the already-painted content.
*/
import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { build } from "vite";
import { pageMeta } from "../src/pageMeta.js";

const root = process.cwd();
const distDir = resolve(root, "dist");
const ssrDir = resolve(root, "node_modules/.prerender");

const MIN_MARKUP_BYTES = 2000;

function htmlFileFor(canonical) {
  const relative = canonical.replace(/^\/+|\/+$/g, "");
  return relative === "" ? resolve(distDir, "index.html") : resolve(distDir, relative, "index.html");
}

async function buildServerBundle() {
  await build({
    root,
    logLevel: "warn",
    build: {
      ssr: "src/entry-server.jsx",
      outDir: ssrDir,
      emptyOutDir: true,
      ssrEmitAssets: false,
      minify: false
    }
  });

  const entry = readdirSync(ssrDir).find((file) => /^entry-server\.js$/.test(file));
  if (!entry) {
    throw new Error(`prerender: no entry-server.js in ${ssrDir} (found: ${readdirSync(ssrDir).join(", ")})`);
  }
  return import(pathToFileURL(resolve(ssrDir, entry)).href);
}

async function main() {
  const { render } = await buildServerBundle();
  const failures = [];

  for (const [path, meta] of Object.entries(pageMeta)) {
    const file = htmlFileFor(meta.canonical);
    const html = readFileSync(file, "utf8");

    const markup = render(path);

    if (markup.length < MIN_MARKUP_BYTES) {
      failures.push(`${path}: rendered markup is only ${markup.length} bytes`);
    }
    if (!markup.includes("<h1")) {
      failures.push(`${path}: rendered markup has no <h1>`);
    }

    const marker = '<div id="root"></div>';
    if (!html.includes(marker)) {
      failures.push(`${path}: ${file} has no empty #root to fill (already prerendered?)`);
      continue;
    }
    if (!html.includes(`<title>${meta.title.replace(/&/g, "&amp;")}</title>`)) {
      failures.push(`${path}: ${file} title does not match pageMeta`);
    }

    writeFileSync(file, html.replace(marker, `<div id="root">${markup}</div>`));
    console.log(`prerender  ${path.padEnd(11)} ${String(markup.length).padStart(6)} bytes of markup`);
  }

  if (failures.length) {
    throw new Error(`prerender failed:\n  - ${failures.join("\n  - ")}`);
  }
}

try {
  mkdirSync(ssrDir, { recursive: true });
  await main();
} finally {
  rmSync(ssrDir, { recursive: true, force: true });
}
