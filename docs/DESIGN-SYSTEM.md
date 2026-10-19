# Mathsya website — design system & build rules

Concept: **"Intelligence inside. Value beyond."** A bright, light-first automotive design studio: pearl/white surfaces, deep-navy type, one accent colour per product, precise technical annotation, purposeful motion. Never dark-dominant, never neon-on-black, never a generic SaaS card grid.

## Stack (use these libraries — do not hand-roll equivalents)

| Need | Library | Where |
|---|---|---|
| Pages, routing, static HTML | Astro 7 (`src/pages/*.astro`, `build.format: 'file'`) | |
| Interactive islands | React 19 + `client:visible` / `client:load` / `client:idle` | `src/components/<page>/*.tsx` |
| Styling | Tailwind CSS v4 utilities + our CSS tokens/classes | `src/styles/*` |
| Accessible primitives | shadcn/ui (Radix): Button, Tabs, NavigationMenu, Sheet, ToggleGroup, Input, Textarea, Label | `src/components/ui/*` |
| Animated diagram helper | Magic UI `AnimatedBeam` (only on real data paths) | `src/components/ui/animated-beam.tsx` |
| Animation | Motion for React (`import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion } from 'motion/react'`) | GSAP + ScrollTrigger is installed for the homepage story only |
| 3D | three.js + React Three Fiber + drei (owned by the lead; use the `Battery3D` / `Evo3D` wrappers from `src/components/three/Lazy3D.tsx`) | |
| Icons | Lucide: `@lucide/astro` in `.astro`, `lucide-react` in `.tsx` | |
| Forms | react-hook-form + zod + `@hookform/resolvers/zod` | |

React components without a `client:*` directive render as static HTML — good for icons, Logo, static diagrams.

## Tokens (src/styles/tokens.css) and Tailwind names

| Role | CSS var | Tailwind | Notes |
|---|---|---|---|
| Page background | `--c-pearl` #F8FAFC | `bg-pearl` | |
| Surface | `--c-white` | `bg-white` | |
| Text / headings | `--c-ink` #172B45 | `text-ink` | |
| Secondary text | `--c-slate` #55667A | `text-slate` | AA on all light tints |
| Brand / software / PMG | `--c-cobalt` #185ADB, text-safe `--c-cobalt-ink` | `bg-cobalt` `text-cobalt-ink` | |
| Battery AI / energy | `--c-emerald` #087F6B, on mint use `--c-emerald-ink` | `bg-emerald` `text-emerald-ink` | |
| Evo Core / power | `--c-tangerine` #F07831 (**fills only**), text `--c-tangerine-ink` #B0521A | `bg-tangerine` `text-tangerine-ink` | Never use #F07831 for text |
| Supporting highlight | `--c-aqua` #85DDD3 | `bg-aqua` | decorative only |
| Tints | `--c-ice` #EAF4FF, `--c-mint` #E8F6EF, `--c-ivory` #FFF8EE | `bg-ice` `bg-mint` `bg-ivory` | |
| Hairlines | `--c-line`, `--c-line-strong` | `border-line` | |

Product aliases: `--p-battery`, `--p-evo`, `--p-pmg` (+ `-ink`, `-bg`). Shadows are blue-tinted: `--sh-1/2/3`. Radii: `--r-s/m/l/xl`. Motion: `--ease-out`, `--ease-mech` (Evo Core), `--ease-flow` (PMG), `--dur-*`.

## Typography & layout classes

- Headings: `.display` (hero only), `.h1`, `.h2`, `.h3`, `.h4` — Manrope. One `<h1>` per page; never skip levels.
- `.lead` (intro paragraph, slate), `.eyebrow` (mono uppercase label with rule; colour follows `--tone-accent` of the tone), `.mono`, `.fineprint`, `.muted`, `.soft-break` (span → line break in headlines).
- Containers: `.container` (1280), `.container--wide` (1480), `.container--narrow` (860). Sections: `.section`, `.section--tight`.
- Tones (set background + local `--tone-fg/--tone-muted/--tone-accent`): `.tone-pearl`, `.tone-white`, `.tone-ice`, `.tone-mint`, `.tone-ivory`, `.tone-cobalt` (saturated, white text — use sparingly). `.blueprint` adds a faint technical grid.
- `.section-head` (+ `--split`) for eyebrow/heading/lead groups.

## Shared components

- `buttonVariants({ variant, size })` from `@/components/ui/button` — variants `default` (cobalt), `secondary`, `outline`, `ghost`, `link`, `light`/`outlineLight` (on cobalt); sizes `default`, `sm`, `lg`. In `.astro`: `<a class={buttonVariants({variant:'secondary'})} href="…">`.
- `CtaBand.astro` — the closing cobalt band on every page (`title` supports `\n`).
- `PageNav.astro` — sticky in-page section nav for long pages (`items=[{id,label}]`).
- `StageMeter.astro` — honest maturity meter (`reached`, `label` verbatim from source, `color`).
- `Faq.astro` — native `<details>` accordion (answers stay in HTML).
- Tabs: shadcn `Tabs/TabsList/TabsTrigger/TabsContent`; set `style={{'--tab-accent':'var(--p-battery)'}}` on `TabsList`. Use `forceMount` + `className="data-[state=inactive]:hidden"` on content-rich `TabsContent` so every scenario's text is in the HTML.
- CSS classes: `.stage` (+ `--battery/--evo/--pmg/--neutral`) status chip, `.pchip` product chip, `.surface` card surface, `.note` dashed disclaimer box, `.fineprint`, `.table-wrap` + `.table` (scrolls inside its container on mobile; give it `tabindex="0"` and a `<caption>`), `.legend` + `.swatch--concept|reference|interface|future`, `.resource` download card, `.link-arrow`.
- `contactHref(topicId)` from `@/data/site` for every enquiry link (`oem-pilot`, `battery`, `evo`, `pmg`, `research`, `partnership`, `investor`, `general`).

## Shared content data (do not duplicate — import)

- `@/data/products` — `PRODUCTS`, `PRODUCT_LIST`, `STAGES`, `VALUE_CHAIN`, `BOUNDARIES`.
- `@/data/portfolio` — `BENEFITS` (4 scenarios), `GENERATIONS` (Gen 1–3), `MATRIX` + `MATRIX_NOTE`, `PMG_POC` + `POC_NOTE`, `HARDWARE_GATES`, `PROOF_PATH`, `PROGRAMS`, `BENEFIT_NOTE`.
- `@/data/site` — `SITE`, `TOPICS`, `contactHref`.
- Page-specific copy goes in `src/data/<page>.ts` (typed), transcribed from `docs/legacy-source/<page>.txt`.

## Art direction per page

| Route | Palette | Motion personality | Signature |
|---|---|---|---|
| `/platform` | ice + pearl, all three product colours | orchestrated, staggered, systemic | interactive 3-level architecture with animated data paths |
| `/battery-ai` | pearl + mint + emerald | analytical, precise (measured ticks, linear sweeps) | battery cutaway + signal traces + scenario selector |
| `/evo-core` | ivory + tangerine + navy | mechanical, engineered (`--ease-mech`, decisive stops) | exploded power assembly + Gen 1/2/3 selector + matrix |
| `/pmg` | ice + cobalt + white | connected, flowing (`--ease-flow`, beams) | vehicle-software network: event → context → policy → recommendation → verified result |
| `/research` | pearl + cool teal + electric blue | exploratory | three distinct chapters (lifecycle chain, investigation pipeline, solar energy path) |
| `/investors` | white + navy + cobalt | composed, editorial | numbered narrative, portfolio-to-market diagram, commercial matrix, proof timeline |
| `/about` | warm white + navy + restrained cobalt | human, editorial | typographic founder treatment + experience-to-portfolio timeline |
| `/contact` | pearl + cobalt + soft blue | calm | effortless enquiry-draft experience |

Vary layouts: asymmetric splits, full-bleed diagrams, editorial statements, tables, timelines. Avoid rows of identical cards and repeating the same fade-up on everything (`data-reveal` supports `up|fade|scale|left|line`).

## Motion rules

- Animate for clarity, progression or emphasis only. Transform/opacity only. No bounce.
- Respect reduced motion: `useReducedMotion()` in React; CSS already neutralises durations globally.
- Interactive state changes (tabs, generation switch) should animate the *diagram*, not just swap text.

## Accessibility (WCAG 2.2 AA)

Semantic landmarks and heading order; visible focus (global ring); every control keyboard-operable; `aria-live="polite"` where content changes on selection; meaningful `alt`/`aria-label` on illustrations (`role="img"` + label for SVG diagrams); never put meaning in colour alone (add text labels); no hover-only content; tables have captions; touch targets ≥ 44px.

## Content and claim rules (non-negotiable)

1. Source of truth: `docs/legacy-source/*.txt` (pages), `portfolio-data.js`, `app.js`, `modules.js`, and `public/assets|resources/*.md`. Rewrite for clarity, but do not drop technical meaning, caveats or proof requirements.
2. Never invent revenue, customers, partners, contracts, pilots, valuations, funding amounts, market sizes, prices, savings, battery-life or range gains, dates, team members, certifications or logos.
3. Stages verbatim: Battery AI & PMG "Architecture & PoC planning"; Evo Core "Architecture & hardware planning"; Product Neural Chain "Concept & PoC definition"; Engineering Intelligence "Workflow & validation design"; Solar "Research & energy modeling". Generations are a proposed roadmap with no committed dates. The 12–16 week PoC is a PMG *software* PoC that starts after partner/data/test access is agreed.
4. Boundaries: Battery AI is software alongside a validated BMS (BMS keeps sensing, balancing, limits, protection). PMG is vehicle software on suitable gateway/telematics/central compute — never draw it as a circuit board, never imply unrestricted control. Cloud/SaaS is optional and permission-governed; local runtime has defined offline behaviour. Evo Core: distinguish shared control vs physical integration vs connected interfaces vs future options; a shared housing does not prove lower cost or simpler qualification.
5. Label concept visuals: "Schematic concept illustration · not a production design".
6. No links to `/pitch` (it redirects to `/investors`). Use `/investors/brief` for the printable brief.

## Page skeleton

```astro
---
import BaseLayout from '@/layouts/BaseLayout.astro';
import CtaBand from '@/components/ui/CtaBand.astro';
import { contactHref } from '@/data/site';
---
<BaseLayout title="…" description="…unique, ≤160 chars…">
  <section class="hero …"> … <h1>…</h1> … </section>
  <!-- sections with ids for PageNav -->
  <CtaBand title={"…\n…"} primary={{ label: '…', href: contactHref('battery') }} />
</BaseLayout>
```

## Verification

Run `npm run dev` and check your route at 360/390/768/1024/1440/1920 (`node scripts/shoot.mjs <url> <dir> --full`), `node scripts/qa-overflow.mjs`, and after `npm run build`, `node scripts/check-links.mjs dist`.

## Gotchas

- shadcn defines global `--accent`, `--muted`, `--background` etc. as *surface* colours. For text colours use our tokens (`text-ink`, `text-slate`, `var(--tone-muted)`, `var(--tone-accent)`), never `var(--muted)`.
- Do not run `npx shadcn add …` (it rewrites shared files). Ask the lead if a primitive is missing.
- Keep `three` imports out of your files — only the `Battery3D`/`Evo3D` wrappers (they lazy-load).
- Every route needs a unique `title` (no brand suffix; the layout adds it) and a ≤160-character `description`.

## Anti-slop rules (hard quality gate — the client explicitly rejects "AI slop")

Every element must carry information or guide an action. Before shipping a section, ask: *what does a reader learn here that they could not learn from the previous section?* If nothing, cut it.

**Visual**
- No decorative effects without meaning. AnimatedBeam is allowed only where it traces a real data/energy/decision path. Ambient effects (particles, glowing borders, orbiting decorations): none.
- No gradient text, no glowing card borders, no floating blobs/orbs, no purple, no neon, no glassmorphism (except the site header), no heavy drop shadows, no emoji.
- No default "three identical icon cards in a row" sections. Prefer diagrams, tables, timelines, annotated illustrations, editorial typography, and asymmetric compositions. If items are a list, a well-set list or table beats cards.
- Lucide icons are functional markers (download, external, arrows, controls) — not decoration on every heading.
- Precision over flourish: align to a grid, consistent radii, hairlines, mono technical annotations, real labels with units of meaning (signal names, gates, owners).
- No stock/AI imagery. Visuals are schematic diagrams or our own 3D renders, labelled as concepts.

**Copy**
- Concrete nouns and verbs from the source material (cell voltages, pack current, EVCC, gate, baseline, false alerts, override rate…).
- Banned: revolutionize, seamless(ly), cutting-edge, state-of-the-art, unlock, unleash, empower, supercharge, harness, leverage, game-changing, next-gen (as filler), world-class, transform (as filler), "in today's fast-paced world", "the future of", journey (as filler), elevate, effortless (in copy), robust (as filler).
- No invented stats, testimonials, logos, "trusted by", counters or percentage claims. No number tickers.
- Avoid formulaic rhetoric: stacked "Not X. Y." lines, triple-adjective slogans, every heading in the same two-line pattern, ending sections with a rhetorical question.
- Keep caveats specific (what must be measured, who owns what), not vague hedges.

**Motion**
- Motion explains state change or progression. No infinite decorative loops except data-flow pulses inside diagrams (pause off-screen; static under reduced motion). Do not fade-up every block.
