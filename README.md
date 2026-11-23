# Abdul Bari Rahmani — Portfolio

A professional React + Vite portfolio inspired by the information architecture of a modern freelance developer website, but redesigned with a distinct visual identity, content structure and color system.

## Important

The reference website's layout/content was used only as design research. This project does not copy its private content, testimonials, claims, images or branding.

## Main sections

- Home
- About
- Services
- Portfolio
- Blog
- Contact
- Responsive navigation
- Mobile-first responsive layout
- SEO-ready title and description
- Centralized editable content in `src/data.js`

## Edit your information

Start with:

`src/data.js`

Replace:
- Email
- Phone
- Social links
- About text
- Statistics
- Technologies
- Services
- Projects
- Blog posts
- FAQs

Do not publish placeholder contact information.

## Run

```bash
npm install
npm run dev
```

Then open the local Vite URL.

## Build

```bash
npm run build
```

Two steps run here:

1. Vite builds the bundle and, via `vite.config.js`, writes one `dist/<route>/index.html`
   per public route with that route's own title, description and canonical tags.
2. `scripts/prerender.mjs` builds `src/entry-server.jsx`, renders every route in
   `src/pageMeta.js` with `react-dom/server` and writes the markup into `#root`.
   `src/main.jsx` then hydrates it, so crawlers, social unfurlers and visitors with
   JavaScript disabled get the real content instead of an empty container.

Adding a page means updating `src/App.jsx` and `src/pageMeta.js`; the route folder and its
prerendered HTML follow automatically. Components must stay render-safe on the server (guard
`window`/`localStorage` access — see `src/components/Navbar.jsx`).

## Contact-form triage with Nace Drex

`scripts/nace-drex.mjs` asks the [Nace Drex](https://console.nace.ai/docs/drex/quickstart) decision API two typed questions about a contact-form message (is it urgent, what kind of project is it) and routes it from the probability of each option. Low-confidence answers go to a person instead of a folder.

It is a Node module, not part of the site bundle: the API key must never reach the browser. The form itself stays a demo until a server calls `routeContactMessage()`.

1. Create an API key in the Nace console.
2. `cp .env.example .env` (or export `NACE_API_KEY` in your shell) and paste the key.
3. `npm run drex:triage` — or pass your own text: `npm run drex:triage -- "your message"` (add `--json` for the full answer).
