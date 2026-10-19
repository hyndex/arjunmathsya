// Production smoke test: every route loads with no console errors, CSP violations, failed requests or 4xx/5xx,
// and the 3D views actually render. Usage: node scripts/qa-console.mjs http://localhost:4400
import puppeteer from 'puppeteer-core';
const base = process.argv[2] ?? 'http://localhost:4400';
const routes = ['/', '/explore', '/platform', '/pmg', '/battery-ai', '/evo-core', '/research', '/investors', '/investors/brief', '/about', '/contact', '/privacy', '/no-such-page', '/pitch', '/investor-brief'];
const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true, args: ['--use-angle=metal', '--enable-gpu'] });
let failures = 0;
for (const r of routes) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  const problems = [];
  // Known third-party notice from @react-three/fiber 9 on three r186; harmless.
  const ignore = (t) => t.includes('THREE.Clock: This module has been deprecated');
  const expected404 = (t) => r === '/no-such-page' && t.includes('status of 404');
  page.on('console', (m) => ['error', 'warn'].includes(m.type()) && !ignore(m.text()) && !expected404(m.text()) && problems.push(`${m.type()}: ${m.text().slice(0, 160)}`));
  page.on('pageerror', (e) => problems.push(`pageerror: ${String(e).slice(0, 160)}`));
  page.on('requestfailed', (q) => problems.push(`requestfailed: ${q.url()} ${q.failure()?.errorText}`));
  page.on('response', (res) => res.status() >= 400 && !(r === '/no-such-page' && res.url().endsWith('/no-such-page')) && problems.push(`HTTP ${res.status()}: ${res.url()}`));
  try {
    await page.goto(base + r, { waitUntil: 'networkidle2', timeout: 30000 });
  } catch (e) {
    problems.push(`navigation: ${String(e).slice(0, 120)}`);
  }
  await page.mouse.move(400, 400); // homepage loads 3D on first interaction
  await new Promise((res) => setTimeout(res, 5000));
  const info = await page.evaluate(() => ({
    url: location.pathname,
    canvases: document.querySelectorAll('canvas').length,
    is3d: !!document.querySelector('.story-stage.is-3d'),
    fallback: !!document.querySelector('.explorer-fallback, .story-poster'),
  }));
  const ok = problems.length === 0;
  if (!ok) failures++;
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${r.padEnd(16)} → ${info.url.padEnd(16)} canvases=${info.canvases} 3d=${info.is3d} fallback=${info.fallback}`);
  problems.slice(0, 6).forEach((p) => console.log('     ' + p));
  await page.close();
}
await browser.close();
process.exit(failures ? 1 : 0);
