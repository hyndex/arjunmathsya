// Hero overlap check: renders the homepage with 3D, isolates the vehicle (transparent page, text hidden) and counts
// vehicle pixels under every hero text line, button, link and the header. Also checks a few scroll positions; once
// scrolled, the strip under the sticky header is skipped (the header covers it).
// Usage: node scripts/qa-hero.mjs [http://localhost:4321] [outDir]
import puppeteer from 'puppeteer-core';

const base = process.argv[2] ?? 'http://localhost:4321';
const out = process.argv[3];
const sizes = [[360, 740], [390, 844], [768, 1024], [1024, 768], [1280, 800], [1348, 900], [1440, 900]];
const scrolls = [0, 120, 260];
const PROTECTED = '.site-header, .hero-head .eyebrow, .hero-title, .hero-lead, .hero-body a, .hero-stage .stage, .hero-visual figcaption, .hero-foot a, .hero-foot .scroll-cue';

const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
  args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist', '--hide-scrollbars'],
});
let failures = 0;
for (const [w, h] of sizes) {
  const page = await browser.newPage();
  await page.setViewport({ width: w, height: h, isMobile: w < 768, hasTouch: w < 768 });
  await page.goto(`${base}/`, { waitUntil: 'networkidle2', timeout: 60000 });
  await page.mouse.move(5, 5);
  await page.waitForSelector('.story-stage.is-3d', { timeout: 60000 });
  await new Promise((r) => setTimeout(r, 1500));
  const row = [];
  for (const y of scrolls) {
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), y);
    await new Promise((r) => setTimeout(r, 900));
    if (out && y === 0) await page.screenshot({ path: `${out}/hero-${w}x${h}.png` });
    // Line boxes of every protected element still on screen (text lines, not whole blocks).
    const boxes = await page.$$eval(
      PROTECTED,
      (els, scrolled) => {
        const top = scrolled ? document.querySelector('.site-header').getBoundingClientRect().bottom : 0;
        return els.flatMap((el) => {
          if (scrolled && el.matches('.site-header')) return [];
          const range = document.createRange();
          range.selectNodeContents(el);
          const rects = el.matches('a, .stage, .site-header') ? [el.getBoundingClientRect()] : [...range.getClientRects()];
          return rects
            .map((r) => ({ name: el.className.split(' ')[0] || el.tagName, x: r.left, y: Math.max(r.top, top), w: r.width, h: r.bottom - Math.max(r.top, top) }))
            .filter((r) => r.w > 1 && r.h > 1 && r.y < innerHeight);
        });
      },
      y > 0
    );
    const style = await page.addStyleTag({
      content: `html, body, .story-stage { background: transparent !important; }
        .site-header, .site-footer, .skip-link, .story-scenes, .story-rail, .story-floor, .story-labels, main > :not(.story) { opacity: 0 !important; }`,
    });
    const png = await page.screenshot({ omitBackground: true, encoding: 'base64' });
    await page.evaluate((s) => s.remove(), style);
    // Count clearly visible vehicle pixels (alpha > 64) inside each box.
    const hits = await page.evaluate(
      async (png, boxes) => {
        const img = new Image();
        img.src = `data:image/png;base64,${png}`;
        await img.decode();
        const c = new OffscreenCanvas(img.width, img.height);
        const ctx = c.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const k = img.width / innerWidth;
        return boxes
          .map((b) => {
            const x = Math.max(0, Math.round(b.x * k)), y = Math.max(0, Math.round(b.y * k));
            const bw = Math.min(img.width - x, Math.round(b.w * k)), bh = Math.min(img.height - y, Math.round(b.h * k));
            if (bw < 1 || bh < 1) return null;
            const d = ctx.getImageData(x, y, bw, bh).data;
            let n = 0;
            for (let i = 3; i < d.length; i += 4) if (d[i] > 64) n++;
            return n ? `${b.name}:${n}px` : null;
          })
          .filter(Boolean);
      },
      png,
      boxes
    );
    if (hits.length) failures++;
    row.push(`scroll ${y}: ${hits.length ? 'OVERLAP ' + hits.join(', ') : 'clear'} (${boxes.length} boxes)`);
  }
  console.log(`${w}x${h}`.padEnd(10), row.join(' | '));
  await page.close();
}
await browser.close();
process.exit(failures ? 1 : 0);
