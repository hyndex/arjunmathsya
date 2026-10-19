// Deterministic screenshots of pages / homepage scenes with the locally installed Chrome.
// Usage: node scripts/shoot.mjs <url> <outDir> [--w=1440 --h=900 --scenes=0,1,2 --wait=1800 --full]
import puppeteer from 'puppeteer-core';
import { mkdirSync } from 'node:fs';

const [url, outDir = 'shots', ...rest] = process.argv.slice(2);
const opt = Object.fromEntries(rest.map((a) => a.replace(/^--/, '').split('=')));
const w = Number(opt.w ?? 1440), h = Number(opt.h ?? 900), wait = Number(opt.wait ?? 1800);
mkdirSync(outDir, { recursive: true });
const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
  args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist', '--hide-scrollbars'],
});
const page = await browser.newPage();
await page.setViewport({ width: w, height: h, deviceScaleFactor: Number(opt.dpr ?? 1), isMobile: w < 768, hasTouch: w < 768 });
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000, timeout: 60000 });
await new Promise((r) => setTimeout(r, wait));
const name = (s) => `${outDir}/${s}-${w}x${h}.png`;
if (opt.scenes) {
  for (const i of opt.scenes.split(',').map(Number)) {
    await page.evaluate((i) => {
      const el = document.querySelectorAll('[data-scene]')[i];
      const r = el.getBoundingClientRect();
      const top = i === 0 ? 0 : r.top + scrollY + Math.max(0, r.height - innerHeight) * 0.5;
      window.scrollTo({ top, behavior: 'instant' });
    }, i);
    await new Promise((r) => setTimeout(r, wait));
    await page.screenshot({ path: name(`scene-${String(i).padStart(2, '0')}`) });
  }
} else if (opt.at) {
  // viewport-by-viewport captures starting at a selector: --at=#after-story --count=4
  const start = await page.evaluate((sel) => document.querySelector(sel).getBoundingClientRect().top + scrollY, opt.at);
  for (let k = 0; k < Number(opt.count ?? 3); k++) {
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), start + k * h * 0.9);
    await new Promise((r) => setTimeout(r, 700));
    await page.screenshot({ path: name(`at-${k}`) });
  }
} else {
  await page.screenshot({ path: name(opt.name ?? 'page'), fullPage: 'full' in opt });
}
if (errors.length) console.log('ERRORS:\n' + errors.join('\n'));
await browser.close();
console.log('done');
