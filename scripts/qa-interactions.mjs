// Interaction QA: mega-menu, mobile drawer, reduced motion, no-WebGL fallback.
import puppeteer from 'puppeteer-core';
const base = process.argv[2] ?? 'http://localhost:4321';
const out = process.argv[3] ?? '/tmp';
const exe = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const log = (...a) => console.log(...a);

let browser = await puppeteer.launch({ executablePath: exe, headless: true, args: ['--use-angle=metal', '--enable-gpu'] });
let page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto(`${base}/platform`, { waitUntil: 'networkidle2', timeout: 30000 });
await wait(1500); // the header hydrates on idle
// 1. Mega-menu via keyboard
await page.focus('[data-slot="navigation-menu-trigger"]');
await page.keyboard.press('Enter');
await wait(400);
log('mega open:', await page.$eval('[data-slot="navigation-menu-trigger"]', (b) => b.getAttribute('aria-expanded')));
log('mega links:', await page.$$eval('[data-slot="navigation-menu-content"] a', (a) => a.map((x) => x.textContent.trim().slice(0, 30))));
await page.screenshot({ path: `${out}/qa-mega.png` });
await page.keyboard.press('Escape');
await wait(200);
log('mega after Esc:', await page.$eval('[data-slot="navigation-menu-trigger"]', (b) => b.getAttribute('aria-expanded')));

// 2. Mobile drawer
await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
await page.goto(`${base}/research`, { waitUntil: 'networkidle2', timeout: 30000 });
await wait(1500);
await page.click('button[aria-label="Open menu"]');
await wait(500);
log('drawer dialog:', await page.$eval('[role="dialog"]', (d) => d.getAttribute('data-state')));
log('focus in drawer:', await page.evaluate(() => !!document.activeElement?.closest('[role="dialog"]')));
await page.screenshot({ path: `${out}/qa-drawer.png` });
await page.keyboard.press('Escape');
await wait(400);
log('drawer closed:', !(await page.$('[role="dialog"][data-state="open"]')));
log('overflow-x (research 390):', await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth));

// 3. Reduced motion on the story
await page.setViewport({ width: 1440, height: 900 });
await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
await page.goto(`${base}/`, { waitUntil: 'networkidle2', timeout: 30000 });
await wait(1500);
log('lenis active (reduced):', await page.evaluate(() => document.documentElement.classList.contains('lenis')));
await page.evaluate(() => { const el = document.querySelectorAll('[data-scene]')[4]; window.scrollTo(0, el.getBoundingClientRect().top + scrollY); });
await wait(1200);
await page.screenshot({ path: `${out}/qa-reduced-scene.png` });
await browser.close();

// 4. No WebGL
browser = await puppeteer.launch({ executablePath: exe, headless: true, args: ['--disable-webgl', '--disable-3d-apis'] });
page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto(`${base}/`, { waitUntil: 'networkidle2', timeout: 30000 });
await wait(1200);
log('no-webgl canvas count:', await page.$$eval('canvas', (c) => c.length), 'hero still shown:', await page.$eval('.hero-poster', (img) => img.complete && img.naturalWidth > 0 && getComputedStyle(img).opacity === '1'));
await page.screenshot({ path: `${out}/qa-nowebgl-hero.png` });
await page.evaluate(() => { const el = document.querySelectorAll('[data-scene]')[2]; window.scrollTo(0, el.getBoundingClientRect().top + scrollY); });
await wait(1200);
log('no-webgl scene still:', !!(await page.$('.story-poster')));
await page.screenshot({ path: `${out}/qa-nowebgl-home.png` });
await page.goto(`${base}/explore`, { waitUntil: 'networkidle2', timeout: 30000 });
await wait(1200);
log('explorer fallback:', !!(await page.$('.explorer-fallback')));
await page.screenshot({ path: `${out}/qa-nowebgl-explore.png` });
await browser.close();
