// Print check for the investor brief: renders the page through Chrome's print pipeline (A4, @page rules from the
// stylesheet) and reports the page count. Usage: node scripts/qa-print.mjs [http://localhost:4321] [out.pdf]
import puppeteer from 'puppeteer-core';

const base = process.argv[2] ?? 'http://localhost:4321';
const out = process.argv[3] ?? 'brief.pdf';
const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
const page = await browser.newPage();
await page.goto(`${base}/investors/brief`, { waitUntil: 'networkidle2', timeout: 60000 });
const pdf = await page.pdf({ path: out, preferCSSPageSize: true, printBackground: true });
const pages = Number(Buffer.from(pdf).toString('latin1').match(/\/Count\s+(\d+)/)?.[1] ?? 0);
// Anything from the site chrome or controls that would still print:
await page.emulateMediaType('print');
const leaks = await page.$$eval('.site-header, .site-footer, [data-print-hide], button', (els) => els.filter((e) => getComputedStyle(e).display !== 'none' && e.getClientRects().length).map((e) => e.className || e.tagName));
console.log(`${out}: ${pages} A4 page(s)${leaks.length ? ` · visible in print: ${leaks.join(', ')}` : ' · no site chrome or controls in print'}`);
await browser.close();
