# Content inventory — legacy site → redesigned site

Current public copy: `docs/editing-pack-2026-10-20.md` (applied 21 October 2026). Original source: the legacy static site (October 2026), mirrored in `docs/legacy-source/` (page text, `portfolio-data.js`, `app.js`, `modules.js`, `site.js`) and the Markdown resources in `public/assets` and `public/resources`. This table records where every meaningful block now lives, so nothing is lost when the presentation changes.

## Routes

| Legacy URL | New URL | Handling |
|---|---|---|
| `/` (`index.html`) | `/` | Rebuilt as the scroll story + essentials |
| `/platform` | `/platform` | Rebuilt |
| `/battery-ai` | `/battery-ai` | Rebuilt |
| `/pmg` | `/pmg` | Rebuilt |
| `/evo-core` | `/evo-core` | Rebuilt |
| `/investors` | `/investors` | Rebuilt; now also carries the pitch narrative |
| `/pitch` | → `/investors` | 301 in `public/_redirects` + instant meta-refresh page; removed from all navigation |
| `/investor-brief` | → `/investors/brief` | 301 + meta-refresh; printable brief kept |
| `/about`, `/research`, `/contact`, `/privacy` | same | Rebuilt |
| — | `/explore` | New: interactive vehicle explorer |
| `*.html` variants | clean URLs | `build.format: 'file'` keeps `platform.html` etc. serving |

## Home (legacy `index.txt`)

| Legacy block | Now |
|---|---|
| Hero "Intelligence inside. Value beyond." + development-stage note | Scene 01 hero (pack copy, separate text and vehicle areas, stage label); footer stage note |
| Ecosystem graphic (module → vehicle → organization) | Scenes 02, 07, 09; `/platform` architecture |
| "A vehicle has signals. Value needs context." + customer/module/OEM | Scene 02 "A useful signal needs a useful decision."; `/platform` |
| Product portfolio cards (3 products, stages, tags) | Scene 11 cards (`PRODUCTS.summary`); product boundaries in a collapsed section after the story |
| Benefits explorer (battery, charging, thermal, service) | Scene 10 short customer/OEM text → `/platform#benefits` (measures table + `BenefitFlow` with all 4 `BENEFITS`) |
| Evo Core Gen 1–3 teaser | Scene 05–06 (`GenSelector` + integration matrix) |
| "Make one use case work" + 12–16 week PoC + 4 steps | "From vision to proof" (`PROOF_PATH`, `PMG_POC`, `POC_NOTE`) |
| Company / founder teaser, enabling programs | "Built from vehicle experience" + programs list |
| CTA "Bring a problem. Build the first proof." | Closing `CtaBand` |

## Product, platform and company pages

| Legacy source | Destination |
|---|---|
| `platform.txt` (three levels, roles table, 4 integration steps, benefits, principles) | `/platform` (`src/data/platform.ts`) |
| `battery-ai.txt` (6 capabilities + proof lines, working principle, benefits, first proof, 4 FAQs, TI + arXiv references, overview download) | `/battery-ai` (`src/data/battery.ts`); signals and scenario summary also in scenes 03–04 |
| `pmg.txt` + `app.js` (workflows) + `modules.js` (applications) | `/pmg` (`src/data/pmg.ts`); decision journey in scene 08 |
| `evo-core.txt` + `portfolio-data.js` generations | `/evo-core` (`src/data/evo.ts`); `GENERATIONS` + `MATRIX` shared in `src/data/portfolio.ts` |
| `research.txt` (Product Neural Chain, Engineering Intelligence, solar) | `/research` (`src/data/research.ts`) |
| `about.txt` (vision, founder, approach) | `/about` (`src/data/about.ts`) |
| `investors.txt` + `pitch.txt` (12 chapters, evidence notes) + `app.js` audiences | `/investors` (`src/data/investors.ts`) in the pack's order; the per-chapter evidence notes are consolidated into one evidence section and milestone plan; old anchors (`#thesis`, `#entry`, `#opportunity`, `#partner`, `#milestone`) redirect in `BaseLayout` |
| `investor-brief.txt` | `/investors/brief` (pack section 09; print stylesheet for two to three A4 pages) |
| `contact.txt` + `site.js` (draft preparation, copy, download, mailto only when configured) | `/contact` — same honest behaviour; `SITE.contactEmail` stays empty until an approved inbox exists |
| `privacy.txt` | `/privacy`, updated to describe the implemented behaviour (self-hosted fonts and 3D, no trackers) |

## Downloads (paths unchanged so existing links keep working)

`/assets/Battery-AI-Program-Overview.md`, `/assets/PMG-Program-Overview.md`, `/assets/Evo-Core-Program-Overview.md`, `/assets/Mathsya-Investor-Brief.md` (route list updated), `/resources/Mathsya-Pitch-Deck-Source.md`, `/resources/Mathsya-Team-Handoff.md` (rewritten for the new build).

## Retired assets

`automotive-concept.webp`, `pmg-concept.webp`, `evo-concept.webp`, `portfolio-social.png` — dark-green AI renders that conflict with the light-first direction; the PMG render also depicted a circuit board for a software product. Replaced by the 3D concept vehicle (Khronos “Car Concept”, CC BY 4.0, logos removed — credited in the footer), posters in `public/posters/` and social images in `public/og/`.

## Claims deliberately preserved

- Stages: Battery AI and PMG "Architecture & PoC planning"; Evo Core "Architecture & hardware planning"; research stages verbatim.
- No revenue, customers, contracts, partners, valuation, funding amount, TAM/SAM/SOM, pricing, savings, battery-life or range figures, or release dates.
- BMS keeps sensing, balancing, limits and protection; PMG is software without unrestricted authority; cloud services are optional; Evo Core generations are a proposed roadmap; the 12–16 week plan is a PMG software PoC.
