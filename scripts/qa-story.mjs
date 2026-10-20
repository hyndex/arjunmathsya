// Story controls QA: first pointer clicks / touch taps right after an automatic (anchor or chapter-rail) scroll,
// tab ↔ panel agreement, keyboard tabs, the connectivity simulation and Skip the story.
// Usage: node scripts/qa-story.mjs [http://localhost:4321]
import puppeteer from 'puppeteer-core';

const base = process.argv[2] ?? 'http://localhost:4321';
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
let failures = 0;
const check = (name, ok, extra = '') => {
  if (!ok) failures++;
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${name}${extra ? ` (${extra})` : ''}`);
};

const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true, args: ['--use-angle=metal', '--enable-gpu'] });

async function run(label, viewport, press) {
  const page = await browser.newPage();
  await page.setViewport(viewport);
  await page.goto(`${base}/`, { waitUntil: 'networkidle2', timeout: 60000 });
  await wait(2500); // islands hydrate (client:idle / client:visible)
  // Press the element's centre as soon as the automatic scroll has settled enough to show it.
  const pressSel = async (sel) => {
    const el = await page.waitForSelector(sel, { visible: true });
    let b = await el.boundingBox();
    if (b.y < 0 || b.y + b.height > viewport.height) {
      await el.scrollIntoView(); // only when the automatic scroll did not bring it into view
      await wait(250);
      b = await el.boundingBox();
    }
    await press(page, b.x + b.width / 2, b.y + b.height / 2);
    await wait(250);
  };
  const rail = async (i) => {
    if (viewport.width > 1100) await pressSel(`.story-rail li:nth-child(${i + 1}) button`);
    else await page.evaluate((i) => document.querySelectorAll('[data-scene]')[i].scrollIntoView({ block: 'center' }), i);
    await wait(1600);
  };

  // Hero link → lands where chapter 02 has settled (its text in view, the camera arrived), then the rail to chapter 04.
  await pressSel('#scene-arrival a[href="#scene-surface"]');
  await wait(1800);
  const landing = await page.$eval('#scene-surface [data-plate]', (p) => ({ top: Math.round(p.getBoundingClientRect().top), h: innerHeight }));
  check(`${label}: "Explore the intelligence" lands on chapter 02 with its text in view`, landing.top > 0 && landing.top < landing.h * 0.75, `plate top ${landing.top}px of ${landing.h}`);
  await rail(3);
  await pressSel('#scene-battery-ai [role="tab"]:nth-child(3)');
  check(`${label}: first press on a battery tab after rail scroll`, await page.$eval('#scene-battery-ai [role="tab"]:nth-child(3)', (t) => t.getAttribute('aria-selected') === 'true'));
  const agree = await page.$eval('#scene-battery-ai', (s) => {
    const tab = s.querySelector('[role="tab"][aria-selected="true"]');
    const panel = document.getElementById(tab.getAttribute('aria-controls'));
    return panel && !panel.hidden && getComputedStyle(panel).display !== 'none';
  });
  check(`${label}: selected battery tab matches the visible panel`, agree);

  await rail(5);
  await pressSel('#scene-evo [role="tab"]:nth-child(2)');
  const gen = await page.$eval('#scene-evo', (s) => {
    const tab = s.querySelector('[role="tab"][aria-selected="true"]');
    const panel = document.getElementById(tab.getAttribute('aria-controls'));
    return { tab: tab.textContent.trim(), heading: panel?.querySelector('h3')?.textContent.trim(), visible: panel && getComputedStyle(panel).display !== 'none' };
  });
  check(`${label}: Gen 2 tab updates heading and panel together`, gen.tab.startsWith('Gen 2') && gen.visible && gen.heading === 'Connect energy conversion to battery intelligence.', `${gen.tab} → ${gen.heading}`);
  if (label === 'desktop') {
    await page.keyboard.press('ArrowRight');
    await wait(300);
    const kb = await page.$eval('#scene-evo [role="tab"][aria-selected="true"]', (t) => t.textContent.trim());
    check(`${label}: arrow key moves to Gen 3`, kb.startsWith('Gen 3'), kb);
  }

  await rail(7);
  await pressSel('#scene-pmg .pmg-steps li:nth-child(4) button');
  check(`${label}: PMG decision step 4 selected`, await page.$eval('#scene-pmg .pmg-steps li:nth-child(4) button', (b) => b.getAttribute('aria-current') === 'step'));

  await rail(8);
  await pressSel('#scene-cloud [aria-label="No connectivity"]');
  const conn = await page.$eval('#scene-cloud', (s) => ({ on: s.querySelector('[aria-label="No connectivity"]').getAttribute('data-state'), text: s.textContent }));
  check(
    `${label}: No connectivity shows local behaviour, retained evidence and a waiting state`,
    conn.on === 'on' && conn.text.includes('Evidence is retained until connectivity returns') && conn.text.includes('waiting for connectivity') && conn.text.includes('Connectivity simulation')
  );

  // Skip the story from the top.
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await wait(800);
  await pressSel('.skip-story');
  await wait(2200);
  const top = await page.$eval('#after-story', (el) => Math.round(el.getBoundingClientRect().top));
  const focused = await page.evaluate(() => document.activeElement?.id);
  check(`${label}: Skip the story lands on the proof section and moves focus there`, top > -40 && top < 200 && focused === 'after-story', `top ${top}px, focus #${focused}`);
  if (label === 'desktop') await page.screenshot({ path: process.argv[3] ?? '/tmp/qa-skip.png' });
  await page.close();
}

await run('desktop', { width: 1440, height: 900 }, (page, x, y) => page.mouse.click(x, y));
await run('touch', { width: 390, height: 844, isMobile: true, hasTouch: true }, (page, x, y) => page.touchscreen.tap(x, y));
await browser.close();
process.exit(failures ? 1 : 0);
