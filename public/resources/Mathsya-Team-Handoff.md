# Mathsya — Website Team Handoff
October 2026 (redesign)

## Purpose
A public automotive technology company website and a consistent source for cohort, investor and OEM conversations. The product journey is preserved: problem → portfolio → benefits → proof → business model → partner enquiry. The former separate pitch page now lives inside `/investors`.

## Current public website
https://mathsya-connected-services.arjtha.chatgpt.site
Moving to a registered Mathsya domain is a separate DNS/hosting task. When it happens, change the single `site` value in `astro.config.mjs` and the sitemap line in `public/robots.txt`.

## Source and hosting
- Built with Astro (static output) + React islands, Tailwind CSS and shadcn/ui (Radix) components, Motion and GSAP/Lenis for animation, and three.js / React Three Fiber / drei for the 3D vehicle. Node 24 (`.nvmrc`).
- If WebGL is unavailable, data-saver is on, the model fails to load or the GPU drops the context, every 3D view falls back to a still image or SVG; no content depends on 3D.
- `npm install`, `npm run dev` (http://localhost:4321), `npm run build` → deploy the `dist/` folder to any static host.
- `build.format: 'file'` emits `platform.html`, `pmg.html` … so both clean URLs and legacy `*.html` links work on hosts that map `/platform` → `platform.html`.
- Redirects: `public/_redirects` gives true 301s on hosts that read it (Cloudflare Pages, Netlify); every build also emits instant meta-refresh pages for `/pitch` → `/investors` and `/investor-brief` → `/investors/brief`.
- No analytics, trackers or third-party requests: fonts and 3D libraries are bundled with the site.

## Pages
| Route | Purpose |
| --- | --- |
| `/` | Scroll-driven 3D story (11 scenes), proof path, product roles and boundaries |
| `/explore` | Interactive vehicle explorer: rotate, zoom, cutaway, 12 hotspots, guided tour |
| `/platform` | Three-level architecture, product roles, integration path, benefits, principles |
| `/battery-ai` | BMS-adjacent Edge AI: signals, capabilities, limitations, first proof |
| `/pmg` | Vehicle software, optional SaaS, workflows, proposed 12–16 week software PoC |
| `/evo-core` | Gen 1–3 roadmap, integration matrix, hardware gates, value and cost case |
| `/research` | Product Neural Chain, Engineering Intelligence, solar-assisted auxiliaries |
| `/investors`, `/investors/brief` | Investment narrative, business model, proof roadmap, resources; printable brief |
| `/about`, `/contact`, `/privacy` | Founder and approach; honest enquiry-draft preparation; current data behaviour |

## Editing
- Copy lives in typed data files: `src/data/products.ts`, `portfolio.ts` (benefits, generations, matrix, PoC, gates), `hotspots.ts` (explorer), and one file per page (`platform.ts`, `battery.ts`, `pmg.ts`, `evo.ts`, `research.ts`, `investors.ts`, `about.ts`).
- Site-wide facts and navigation: `src/data/site.ts`. Set the approved public inbox in `SITE.contactEmail` (empty = drafts are prepared locally and nothing is sent).
- Design tokens: `src/styles/tokens.css`; rules for contributors: `docs/DESIGN-SYSTEM.md` (including the anti-slop rules); content mapping: `docs/content-inventory.md`.
- 3D: `src/components/three/` (vehicle, systems, labels); story camera and states: `src/components/home/storyScenes.ts`. The vehicle body is Khronos' “Car Concept” glTF sample (CC BY 4.0 — keep the footer credit), prepared with `scripts/prepare-car-model.mjs` (logos removed, compressed to ~1.7 MB in `public/models/`).
- Stills: `public/posters/` (no-WebGL fallbacks and the homepage hero frame) and `public/og/` (social images) are captures of the 3D scenes. Recapture them if the vehicle or scene framing changes, keeping the hero frame's camera identical to the first story scene.
- Update the downloadable Markdown resources whenever product scope changes.

## Content requirements
Battery AI = embedded module software alongside a validated BMS. Evo Core = EV power hardware plus embedded software. PMG = vehicle software with optional cloud/SaaS.
Gen 1–3 are a proposed roadmap, with no committed dates. Distinguish shared control, physical integration and connected interfaces.
Every numerical performance, savings, market, funding or traction claim needs approved evidence. Do not imply company/product certification, customer contracts or investor/cohort endorsements.
Keep public architecture at the product/interface level. Do not add internal schematics, confidential supplier material or detailed implementation artifacts.
All vehicle and component visuals are schematic concept renders and must stay labelled as such. Replace with approved prototype photography only when it exists.

## Public contact and launch work
1. Obtain and configure the approved business inbox (`SITE.contactEmail`); test the email-draft route.
2. If a true submission form is wanted, implement a delivery backend, protect it against abuse, update the privacy page and verify delivery. Never display a "sent" confirmation for the current draft behaviour.
3. Register or confirm the Mathsya domain, configure hosting/DNS/HTTPS, and redirect the existing address if supported.
4. Update `site` in `astro.config.mjs` and `public/robots.txt` for the confirmed domain.
5. Run desktop/mobile checks in Chrome and Safari: navigation, the scroll story forwards and backwards, explorer controls, tabs, form validation, downloads and print output.

## Acceptance checks
No broken local URLs/anchors; one h1 per page; labelled fields; keyboard-operable tabs, menus and explorer controls; visible focus; correct active navigation.
At 360/390/768/1024/1440/1920 widths, no page overflow, clipped controls or overlapping text. Wide tables scroll within their own container.
Reduced-motion users get discrete scene changes and no smooth scrolling. Without WebGL, the story and explorer fall back to still images and every system is still described in text.
Blank or whitespace-only required fields cannot create a draft. Editing a prepared enquiry invalidates it. Copy/download never claims delivery.

## Investor pitch source
`resources/Mathsya-Pitch-Deck-Source.md` supplies twelve slide narratives, suggested visuals and evidence gaps. Add a validated demo, sourced market/pricing figures, a costed investment ask and approved team details before using it as a fundraising deck.
