# Mathsya — Website Team Handoff
October 2026 (editing pack of 20 October 2026 applied)

## Purpose
A public automotive technology company website and a consistent source for founder, cohort, investor and OEM conversations. A visitor should quickly understand the problem, the role of each product, the potential customer and OEM benefit, the present development stage and the next practical step.

## Current public website
https://arjunmathsya.vercel.app/
Canonical tags, sharing images, the sitemap and robots.txt use `SITE_URL` when it is set, otherwise the Vercel production domain, otherwise https://arjunmathsya.vercel.app. Set `SITE_URL` on the host when a registered Mathsya domain goes live.

## Source and hosting
- Astro (static output) + React islands, Tailwind CSS and shadcn/ui (Radix), Motion and GSAP/Lenis for animation, three.js / React Three Fiber / drei for the 3D vehicle. Node 24 (`.nvmrc`).
- `npm install`, `npm run dev` (http://localhost:4321), `npm run build` → `dist/`. Vercel: `vercel.json` configures the build, clean URLs, the `/pitch` and `/investor-brief` redirects and the security headers.
- If WebGL is unavailable, data-saver is on, the model fails to load or the GPU drops the context, every 3D view falls back to a still image or SVG; no content depends on 3D.
- No analytics, trackers or third-party requests: fonts and 3D libraries are bundled with the site.

## Pages
| Route | Purpose |
| --- | --- |
| `/` | Hero with separate text and vehicle areas, 11-scene 3D story with chapter rail and Skip the story, proof path, collapsed product boundaries |
| `/explore` | Interactive vehicle explorer: rotate, zoom, cutaway, hotspots in a keyboard-accessible list, guided tour |
| `/platform` | Three levels in words, interactive architecture (data and recommendation interfaces, reference systems), roles, adoption, deployment, benefits and measures table |
| `/battery-ai` | Embedded software alongside a validated BMS: capabilities, how it works, interfaces, first proof, evaluation |
| `/pmg` | Vehicle software and optional cloud services, workflows, illustrative worked example, proposed 12–16 week software PoC |
| `/evo-core` | Proposed Gen 1–3 roadmap, interactive generations, static matrix, integration, hardware proof path |
| `/research` | Product Neural Chain, Engineering Intelligence, solar-assisted auxiliaries |
| `/investors`, `/investors/brief` | Narrative in the order problem → first application → products → benefits → revenue → proof → founder → next ask, one status summary and one evidence section; printable two-to-three-page brief |
| `/about`, `/contact`, `/privacy` | Founder and approach; enquiry draft preparation; current data behaviour |

## Editing
- Copy lives in typed data files: `src/data/products.ts`, `portfolio.ts` (generations, matrix, PoC gates, benefits and measures), `hotspots.ts`, and one file per page. Site-wide facts: `src/data/site.ts`.
- The editing pack that defines the current public copy is kept in `docs/editing-pack-2026-10-20.md`. Its implementation instructions, founder worksheet and acceptance checks stay outside the public pages.
- The homepage hero keeps text and vehicle apart: the 3D camera fits the car inside the hero's reserved visual area (`StoryCanvas.tsx`, `fitHero`). After changing the car, the hero camera or that area's aspect ratio, run `node scripts/capture-hero-poster.mjs` to refresh the matching still.
- Update the downloadable Markdown resources whenever product scope changes. Their size labels are read from the files at build time.

## Content requirements
Battery & Charging AI = embedded module software alongside a validated BMS. Evo Core = EV power hardware plus embedded software. PMG = vehicle software with optional cloud services.
Gen 1–3 are a proposed roadmap with no committed dates. Distinguish shared control, physical integration and connected interfaces. The 12–16 week PMG PoC is a software PoC, not a hardware release schedule; battery model development and Evo Core hardware are scoped separately.
Every numerical performance, savings, market, funding or traction claim needs approved evidence. Buttons that open an investor enquiry say "Discuss the investment"; navigation to /investors says "Explore the investment case".
All vehicle and component visuals are schematic concept renders and stay labelled as such. The founder is not named on the site, in downloads or in structured data.

## Contact modes (publish one at a time)
- **Draft mode (current):** no approved inbox or backend. The form prepares a plain-text draft in the browser; Copy enquiry and Download enquiry never claim that anything was sent. Editing a field clears a prepared draft.
- **Delivery mode (not built):** requires the approved public business email from the founder, a server-side endpoint with credentials in server configuration, server-side validation, abuse controls, verified inbox delivery with controlled test enquiries, and matching privacy text. Switch the page introduction, button, feedback, footer contact details and privacy wording together.

## Acceptance checks
1. At 360, 390, 768, 1024, 1280, 1348 and 1440 px the vehicle never covers text, buttons or navigation (`node scripts/qa-hero.mjs`). Tables scroll inside their containers; pages do not overflow horizontally (`node scripts/qa-overflow.mjs`).
2. Navigation, Technologies menu, chapter controls, Skip the story, product links, investor brief and contact CTAs work; query-prefilled categories are correct.
3. Battery AI tabs, Gen 1–3 tabs, PMG decision steps and both connectivity states work with pointer, touch and keyboard.
4. Content stays readable without JavaScript, without WebGL and with reduced motion.
5. Required contact fields reject empty and whitespace-only values; invalid email, preparation, editing after preparation, copy and download behave as described.
6. Print / save PDF of the brief is two to three readable A4 pages with no site chrome (`node scripts/qa-print.mjs`).
7. Titles, descriptions, canonical URLs, sharing image, sitemap and resource links are correct (`node scripts/check-links.mjs dist`); model attribution stays in the footer.
8. Review loading on a representative mobile device and connection; test on desktop Chrome, Android Chrome and iPhone Safari.

## Founder inputs still needed
Approved public business email; whether to enable actual submissions; current engineering approval of the Gen 1–3 scopes; founder photograph and approved career highlights; the first partner application and data access; measured demo or test evidence; and the costed investment milestone.
