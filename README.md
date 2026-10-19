# Mathsya Connected Services — website

Light-first, multi-page site with a scroll-driven 3D vehicle story, an interactive vehicle explorer and product, platform, research, investor and company pages.

```bash
nvm use            # Node 24 (see .nvmrc)
npm install
npm run dev        # http://localhost:4321
npm run build      # static output in dist/ — deploy to any static host
npm run preview
npm run check      # TypeScript + Astro diagnostics
npm test           # contact-form rules and content cross-references (Vitest)
```

- **Stack:** Astro 7 (static, `build.format: 'file'`), React 19 islands, Tailwind CSS 4 + shadcn/ui (Radix), Magic UI, Motion, GSAP ScrollTrigger + Lenis (homepage), three.js + React Three Fiber + drei. The vehicle is Khronos' “Car Concept” glTF (CC BY 4.0, credited in the footer), prepared by `scripts/prepare-car-model.mjs` (logos removed, Meshopt + WebP, 1.7 MB); studio lighting is procedural (no HDR files).
- **Content:** typed data in `src/data/`. Site-wide facts and the (currently empty) public inbox: `src/data/site.ts`.
- **Rules for contributors:** `docs/DESIGN-SYSTEM.md` (tokens, components, claim rules, anti-slop rules). Content mapping from the legacy site: `docs/content-inventory.md`. Legacy text archive: `docs/legacy-source/`.
- **3D:** `src/components/three/` (vehicle, systems, labels, studio). Homepage camera and per-scene states: `src/components/home/storyScenes.ts`. Explorer hotspots: `src/data/hotspots.ts`.
- **Redirects:** `/pitch` → `/investors`, `/investor-brief` → `/investors/brief` (`astro.config.mjs` meta-refresh pages + `public/_redirects` 301s).
- **Deploy on Vercel:** import the GitHub repo at vercel.com/new — `vercel.json` sets the Astro preset, `npm run build` → `dist`, clean URLs, the `/pitch` and `/investor-brief` 301 redirects, and security/cache headers (Vercel ignores `public/_redirects` and `public/_headers`, which serve Netlify/Cloudflare Pages). Node 24 comes from `engines`.
- **Domain:** canonical tags, social images, the sitemap and `robots.txt` use `SITE_URL` if set, else Vercel's production domain (automatic on Vercel), else the current chatgpt.site address. Set `SITE_URL=https://your-domain` in the host's environment variables when a custom domain goes live.
- **Security & caching:** every page ships a hash-pinned Content-Security-Policy `<meta>` (`astro.config.mjs` → `security.csp`); `public/_headers` adds clickjacking protection, HSTS and cache rules on hosts that read it (Cloudflare Pages, Netlify). No third-party requests: fonts, 3D libraries and the model are self-hosted.
- **Resilience:** if WebGL is unavailable, data-saver is on, the model or a chunk fails to load, or the GPU drops the context, each 3D view falls back to a still image or SVG; all content is server-rendered HTML.
- **QA scripts** (need the installed Google Chrome): `node scripts/shoot.mjs <url> <outDir> [--scenes=0,1 | --at=#id --count=3 | --full] [--w= --h=]`, `node scripts/qa-interactions.mjs <url>`, `node scripts/qa-overflow.mjs <url>`, and after `npm run build` + `npm run preview -- --port 4400`: `node scripts/check-links.mjs dist` and `node scripts/qa-console.mjs http://localhost:4400` (console errors, CSP violations, failed requests, 3D render).
