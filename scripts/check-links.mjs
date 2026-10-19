// Crawls dist/*.html and verifies internal links, anchors and assets resolve; flags /pitch links and missing alt/h1 issues.
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
const dist = process.argv[2] ?? 'dist';
const files = [];
const walk = (d) => readdirSync(d).forEach((f) => { const p = join(d, f); statSync(p).isDirectory() ? walk(p) : p.endsWith('.html') && files.push(p); });
walk(dist);
const pageFor = (url) => {
  const clean = url.split('#')[0].split('?')[0];
  if (clean === '/' || clean === '') return join(dist, 'index.html');
  const c = [join(dist, clean), join(dist, clean + '.html'), join(dist, clean, 'index.html')];
  return c.find((p) => existsSync(p) && statSync(p).isFile());
};
const ids = (html) => new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
let problems = 0;
const report = (f, msg) => { problems++; console.log(`${f.replace(dist, '')}: ${msg}`); };
for (const f of files) {
  const html = readFileSync(f, 'utf8');
  if (/meta http-equiv="refresh"/.test(html)) continue; // redirect stubs
  const h1 = (html.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) report(f, `h1 count = ${h1}`);
  for (const m of html.matchAll(/<img\b[^>]*>/g)) if (!/\salt=/.test(m[0])) report(f, `img without alt: ${m[0].slice(0, 80)}`);
  const own = ids(html);
  for (const m of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
    const url = m[1];
    if (/^(https?:|mailto:|tel:|data:|javascript:)/.test(url) || url.startsWith('//')) continue;
    if (/\/pitch(\.html)?($|[#?])/.test(url)) report(f, `links to retired /pitch: ${url}`);
    if (url.startsWith('#')) { if (url.length > 1 && !own.has(url.slice(1))) report(f, `missing anchor ${url}`); continue; }
    if (!url.startsWith('/')) continue;
    const target = pageFor(url);
    if (!target) { report(f, `broken ${url}`); continue; }
    const hash = url.split('#')[1];
    if (hash && target.endsWith('.html') && !ids(readFileSync(target, 'utf8')).has(hash)) report(f, `missing anchor ${url}`);
  }
}
console.log(`${files.length} html files checked, ${problems} problem(s)`);
process.exit(problems ? 1 : 0);
