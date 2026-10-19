import { useEffect, useState } from 'react';
import { useStory } from '@/lib/storyStore';
import { SCENES } from './storyScenes';

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
    return () => {
      io.disconnect();
      io2.disconnect();
    };
  }, []);
  const go = (i: number) => {
    const el = document.querySelectorAll<HTMLElement>('[data-scene]')[i];
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY + (i === 0 ? 0 : Math.max(0, el.offsetHeight - window.innerHeight) / 2);
    window.scrollTo({ top, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  };
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
