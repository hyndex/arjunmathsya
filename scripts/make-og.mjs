// Regenerates the social sharing images in public/og/ (1200 × 630) from the current headlines and the transparent
// 3D renders in public/posters/. Re-run whenever a page headline or render changes: node scripts/make-og.mjs
import puppeteer from 'puppeteer-core';
import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve('.');

const CARDS = [
  {
    out: 'mathsya-og.png',
    lines: ['Intelligence inside.', 'Value beyond.'],
    accent: '#185adb',
    body: 'Edge AI for battery health, charging readiness and connected vehicle intelligence.',
    label: 'Mathsya Connected Services · Architecture and proof of concept planning',
    img: 'public/posters/hero-car.webp',
  },
  {
    out: 'og-investors.png',
    lines: ['A focused first proof.', 'A connected growth path.'],
    accent: '#185adb',
    body: 'Automotive Edge AI: one observable problem, one accountable buyer and an agreed measure of value.',
    label: 'Mathsya · Investors and partnerships',
    img: 'public/posters/scene-cloud.webp',
  },
  {
    out: 'og-battery.png',
    lines: ['Care for the battery.', 'Prepare for the journey.'],
    accent: '#06705f',
    body: 'Battery & Charging AI: embedded software for health trends, charging readiness and thermal context, alongside a validated BMS.',
    label: 'Mathsya · Battery & Charging AI · Architecture & PoC planning',
    img: 'public/posters/scene-battery.webp',
  },
  {
    out: 'og-evo.png',
    lines: ['Power brought together.', 'Intelligence built in.'],
    accent: '#b0521a',
    body: 'Evo Core: a proposed EV power platform with common control across charging, conversion and distribution, on a Gen 1–3 roadmap.',
    label: 'Mathsya · Evo Core · Architecture & hardware planning',
    img: 'public/posters/scene-evo.webp',
    fade: true, // this render is cut off at its own top and left edges
  },
  {
    out: 'og-pmg.png',
    lines: ['Connect the insight.', 'Make it useful.'],
    accent: '#185adb',
    body: 'Proactive Mobility Guardian: vehicle software that prepares permitted recommendations and verifies the outcome.',
    label: 'Mathsya · PMG · Architecture & PoC planning',
    img: 'public/posters/scene-surface.webp',
  },
  {
    out: 'og-explore.png',
    lines: ['Explore the vehicle.', 'Understand each product’s role.'],
    accent: '#185adb',
    body: 'A schematic concept vehicle showing where Battery & Charging AI, Evo Core and PMG would work.',
    label: 'Mathsya · Interactive vehicle explorer',
    img: 'public/posters/explore-cutaway.webp',
  },
];

const html = (c) => `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face { font-family: Manrope; src: url(/node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2) format('woff2'); font-weight: 200 800; }
@font-face { font-family: Inter; src: url(/node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2) format('woff2'); font-weight: 100 900; }
@font-face { font-family: Plex; src: url(/node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-500-normal.woff2) format('woff2'); font-weight: 500; }
* { margin: 0; box-sizing: border-box; }
body { width: 1200px; height: 630px; overflow: hidden; color: #172b45; font-family: Inter;
  background: radial-gradient(60% 90% at 80% 45%, #fff 0%, rgba(255,255,255,0.4) 45%, transparent 75%), linear-gradient(180deg, #f3f6fa, #e4eaf2); }
canvas { position: absolute; left: 572px; top: 40px; }
${c.fade ? 'canvas { mask-image: linear-gradient(to right, transparent, #000 90px), linear-gradient(to bottom, transparent, #000 70px); mask-composite: intersect; }' : ''}
.copy { position: absolute; left: 64px; top: 56px; bottom: 52px; width: 476px; display: flex; flex-direction: column; }
.logo { display: flex; align-items: center; gap: 12px; }
.word { display: grid; line-height: 1; } .word b { font-family: Manrope; font-size: 24px; font-weight: 800; letter-spacing: -0.04em; }
.word small { margin-top: 5px; font-family: Plex; font-size: 9.5px; letter-spacing: 0.2em; text-transform: uppercase; color: #55667a; }
h1 { margin-top: 40px; font-family: Manrope; font-weight: 750; font-size: 52px; line-height: 1.03; letter-spacing: -0.045em; }
h1 span { display: block; } h1 span + span { color: ${c.accent}; }
p { margin-top: 20px; font-size: 19px; line-height: 1.45; color: #46586d; }
.label { margin-top: auto; font-family: Plex; font-size: 12.5px; line-height: 1.5; letter-spacing: 0.14em; text-transform: uppercase; color: ${c.accent}; }
.bar { position: absolute; left: 0; right: 0; bottom: 0; height: 8px; background: linear-gradient(90deg, #087f6b 0 33.3%, #185adb 33.3% 66.6%, #f07831 66.6%); }
</style></head><body>
<canvas width="600" height="540"></canvas>
<div class="copy">
  <div class="logo"><svg width="44" height="44" viewBox="0 0 48 48"><defs><linearGradient id="g" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#2a6ef0"/><stop offset="1" stop-color="#1249b8"/></linearGradient></defs><rect width="48" height="48" rx="13" fill="url(#g)"/><path d="M10 32V16h5l9 11 9-11h5v16h-5V23l-9 10-9-10v9z" fill="#fff"/><circle cx="38.5" cy="9.5" r="2.6" fill="#85ddd3"/></svg>
  <span class="word"><b>mathsya</b><small>Connected Services</small></span></div>
  <h1>${c.lines.map((l) => `<span>${l}</span>`).join('')}</h1>
  <p>${c.body}</p>
  <span class="label">${c.label}</span>
</div>
<div class="bar"></div>
<script type="module">
  // Crop the render to its visible pixels and fit it inside the canvas box: the text column never sits under the car.
  const img = new Image();
  img.src = '/${c.img}';
  await img.decode();
  const probe = new OffscreenCanvas(img.width, img.height).getContext('2d');
  probe.drawImage(img, 0, 0);
  const a = probe.getImageData(0, 0, img.width, img.height).data;
  let x0 = img.width, y0 = img.height, x1 = 0, y1 = 0;
  for (let y = 0; y < img.height; y++) for (let x = 0; x < img.width; x++) if (a[(y * img.width + x) * 4 + 3] > 10) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
  const cv = document.querySelector('canvas');
  const s = Math.min(cv.width / (x1 - x0), cv.height / (y1 - y0));
  const w = (x1 - x0) * s, h = (y1 - y0) * s;
  cv.getContext('2d').drawImage(img, x0, y0, x1 - x0, y1 - y0, (cv.width - w) / 2, (cv.height - h) / 2, w, h);
  await document.fonts.ready;
  document.body.dataset.ready = '';
</script>
</body></html>`;

const types = { '.webp': 'image/webp', '.woff2': 'font/woff2', '.html': 'text/html' };
const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 630 });
// Serve the card and the project's files from one origin, so the canvas may read the render's pixels.
let card;
await page.setRequestInterception(true);
page.on('request', (req) => {
  const url = new URL(req.url());
  if (url.host !== 'og.local') return req.abort();
  if (url.pathname === '/card.html') return req.respond({ contentType: types['.html'], body: html(card) });
  const path = join(root, decodeURIComponent(url.pathname));
  if (!path.startsWith(root + '/') || !existsSync(path)) return req.respond({ status: 404, body: '' });
  req.respond({ contentType: types[path.slice(path.lastIndexOf('.'))] ?? 'application/octet-stream', body: readFileSync(path) });
});
for (const c of CARDS) {
  card = c;
  await page.goto('http://og.local/card.html', { waitUntil: 'load' });
  await page.waitForSelector('body[data-ready]');
  await page.screenshot({ path: `public/og/${c.out}` });
  console.log(`public/og/${c.out}`);
}
await browser.close();
