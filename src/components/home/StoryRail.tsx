import { useEffect, useState } from 'react';
import { useStory } from '@/lib/storyStore';
import { SCENES } from './storyScenes';

/** Scrolls to where a chapter has settled: the camera has arrived and the chapter's text is in view (not its top edge). */
function go(i: number, instant = false) {
  const el = document.querySelectorAll<HTMLElement>('[data-scene]')[i];
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY + (i === 0 ? 0 : Math.max(0, el.offsetHeight - window.innerHeight) / 2);
  const lenis = useStory.getState().lenis; // absent with reduced motion
  if (lenis) lenis.scrollTo(top, { immediate: instant });
  else window.scrollTo({ top, behavior: 'auto' });
}

/** Chapter navigation for the scroll story (desktop rail, compact pill on small screens). */
export default function StoryRail() {
  const scene = useStory((s) => s.scene);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const story = document.querySelector('[data-story]');
    if (!story) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting && e.intersectionRatio > 0), { threshold: [0, 0.01] });
    io.observe(story);
    // Without WebGL the 3D director never runs; keep the chapter index in sync from the DOM.
    const els = [...document.querySelectorAll<HTMLElement>('[data-scene]')];
    const io2 = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && useStory.getState().set({ scene: els.indexOf(e.target as HTMLElement) })),
      { rootMargin: '-45% 0px -45% 0px' }
    );
    els.forEach((el) => io2.observe(el));
    // In-page chapter links (e.g. "Explore the intelligence") land where the chapter has settled, like the rail.
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href*="#scene-"]');
      const i = a && a.pathname === location.pathname ? els.findIndex((el) => el.id === a.hash.slice(1)) : -1;
      if (i < 0) return;
      e.preventDefault();
      e.stopPropagation(); // Lenis would otherwise scroll to the chapter's top edge as well
      history.pushState(null, '', a!.hash);
      go(i);
    };
    document.addEventListener('click', onClick);
    // Arriving with a chapter in the URL (/#scene-…): settle on it once laid out.
    const fromHash = els.findIndex((el) => el.id === location.hash.slice(1));
    if (fromHash > 0) requestAnimationFrame(() => go(fromHash, true));
    return () => {
      io.disconnect();
      io2.disconnect();
      document.removeEventListener('click', onClick);
    };
  }, []);
  return (
    <nav className={`story-rail ${visible && scene > 0 ? 'is-visible' : ''}`} aria-label="Story chapters" aria-hidden={!(visible && scene > 0)}>
      <ol>
        {SCENES.map((s, i) => (
          <li key={s.id}>
            <button type="button" onClick={() => go(i)} aria-current={scene === i ? 'step' : undefined} tabIndex={visible && scene > 0 ? 0 : -1}>
              <span className="rail-num">{String(i + 1).padStart(2, '0')}</span>
              <span className="rail-title">{s.title}</span>
            </button>
          </li>
        ))}
      </ol>
      <p className="rail-now" aria-hidden="true">
        <span>{String(scene + 1).padStart(2, '0')}</span> / {String(SCENES.length).padStart(2, '0')} · {SCENES[scene]?.title}
      </p>
    </nav>
  );
}
