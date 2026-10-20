// Reports horizontal overflow (px) per route and width; lists the widest offending elements.
import puppeteer from 'puppeteer-core';
const base = process.argv[2] ?? 'http://localhost:4321';
const routes = (process.argv[3] ?? '/,/explore,/platform,/pmg,/battery-ai,/evo-core,/research,/investors,/investors/brief,/about,/contact,/privacy,/404').split(',');
const widths = [360, 390, 768, 1024, 1280, 1348, 1440, 1920];
const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true, args: ['--use-angle=metal', '--enable-gpu'] });
const page = await browser.newPage();
for (const r of routes) {
  const row = [];
  for (const w of widths) {
    await page.setViewport({ width: w, height: 900, isMobile: w < 768, hasTouch: w < 768 });
    await page.goto(base + r, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise((res) => setTimeout(res, 600));
    const res = await page.evaluate((w) => {
      // Compare with the device width: on mobile, overflowing content widens the layout viewport (innerWidth) itself.
      const layout = Math.max(document.documentElement.scrollWidth, window.innerWidth);
      const over = layout - w;
      const bad = [...document.querySelectorAll('body *')]
        .filter((el) => el.getBoundingClientRect().right > w + 1 && getComputedStyle(el).position !== 'fixed')
        .filter((el) => {
          for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) if (getComputedStyle(a).overflowX !== 'visible') return false;
          return true;
        })
        .slice(0, 3)
        .map((el) => el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (typeof el.className === 'string' && el.className ? '.' + el.className.split(' ')[0] : ''));
      return { over, bad };
    }, w);
    row.push(`${w}:${res.over}${res.bad.length ? ' [' + res.bad.join(', ') + ']' : ''}`);
  }
  console.log(r.padEnd(18), row.join('  '));
}
await browser.close();
