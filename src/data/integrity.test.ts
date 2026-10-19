import { readFileSync, readdirSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { HOTSPOTS } from './hotspots';
import { LABELS } from '@/components/three/labels';
import { SCENES } from '@/components/home/storyScenes';

// Cross-references that TypeScript cannot check: a typo here silently breaks the explorer or the story.
describe('content integrity', () => {
  it('every explorer hotspot links only to existing hotspots', () => {
    const ids = new Set(HOTSPOTS.map((h) => h.id));
    expect(ids.size).toBe(HOTSPOTS.length);
    for (const h of HOTSPOTS) for (const r of h.related) expect(ids, `${h.id} → ${r}`).toContain(r);
  });

  it('every story scene label exists', () => {
    const labels = new Set(LABELS.map((l) => l.id));
    for (const s of SCENES) for (const l of s.labels) expect(labels, `${s.id}: ${l}`).toContain(l.split(':')[0]);
  });

  it('the homepage has exactly one section per story scene, in order', () => {
    const page = readFileSync('src/pages/index.astro', 'utf8');
    const sections = [...page.matchAll(/data-scene="([^"]+)"/g)].map((m) => m[1]);
    expect(sections).toEqual(SCENES.map((s) => s.id));
  });

  it('no page or data file links to the retired /pitch route', () => {
    const files = ['src/data', 'src/pages', 'src/components'].flatMap((d) =>
      readdirSync(d, { recursive: true, encoding: 'utf8' })
        .filter((f) => /\.(astro|tsx?|md)$/.test(f))
        .map((f) => `${d}/${f}`)
    );
    for (const f of files) expect(readFileSync(f, 'utf8'), f).not.toMatch(/href=["'{`]\/pitch\b/);
  });
});
