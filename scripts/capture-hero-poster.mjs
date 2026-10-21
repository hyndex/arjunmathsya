// Captures public/posters/hero-car.webp: the 3D hero vehicle exactly as the camera frames it inside the hero's
// reserved visual area (.hero-frame), on a transparent background. Re-run whenever the car, the hero camera or
// the frame's aspect ratio changes. Usage: npm run dev, then `node scripts/capture-hero-poster.mjs [http://localhost:4321]`
import puppeteer from 'puppeteer-core';

const base = process.argv[2] ?? 'http://localhost:4321';
const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
  args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist', '--hide-scrollbars'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1600, height: 1000, deviceScaleFactor: 2 });
await page.goto(`${base}/`, { waitUntil: 'networkidle2', timeout: 60000 });
await page.mouse.move(20, 20); // the homepage starts 3D on the first interaction
await page.waitForSelector('.story-stage.is-3d', { timeout: 60000 });
await new Promise((r) => setTimeout(r, 2500)); // environment map and materials settle
await page.addStyleTag({
  content: `html, body, .story-stage { background: transparent !important; }
    .site-header, .skip-link, .story-floor, .story-labels, .hero-head, .hero-body, .hero-foot, .hero-visual figcaption, .hero-poster { opacity: 0 !important; }`,
});
const clip = await page.$eval('[data-hero-visual]', (el) => {
  const r = el.getBoundingClientRect();
  return { x: r.left, y: r.top, width: r.width, height: r.height };
});
await page.screenshot({ path: 'public/posters/hero-car.webp', type: 'webp', quality: 82, omitBackground: true, clip });
console.log(`public/posters/hero-car.webp ← ${Math.round(clip.width * 2)}×${Math.round(clip.height * 2)} px`);
await browser.close();
