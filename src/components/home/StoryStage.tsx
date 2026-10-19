import { lazy, Suspense, useEffect, useState } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Guard from '@/components/three/Guard';
import { canRender3D, prefersReducedMotion } from '@/components/three/webgl';
import { useStory } from '@/lib/storyStore';
import { SCENES } from './storyScenes';

gsap.registerPlugin(ScrollTrigger);

// three.js and the scene graph download after first paint; the pre-rendered poster holds the frame until then.
const StoryCanvas = lazy(() => import('./StoryCanvas'));

export default function StoryStage() {
  const [webgl, setWebgl] = useState<boolean | null>(null);
  const [ready, setReady] = useState(false);
  const [reduced, setReduced] = useState<boolean | null>(null);
  const scene = useStory((s) => s.scene);

  // Load three.js on the first sign of engagement, or shortly after the page has settled.
  useEffect(() => {
    setWebgl(canRender3D());
    setReduced(prefersReducedMotion());
    let done = false;
    let timer = 0;
    const go = () => {
      if (done) return;
      done = true;
      setReady(true);
      cleanup();
    };
    const events = ['pointerdown', 'pointermove', 'wheel', 'touchstart', 'keydown', 'scroll'] as const;
    const cleanup = () => {
      events.forEach((e) => window.removeEventListener(e, go));
      window.clearTimeout(timer);
    };
    events.forEach((e) => window.addEventListener(e, go, { passive: true, once: true }));
    const onLoad = () => (timer = window.setTimeout(go, 2500));
    if (document.readyState === 'complete') onLoad();
    else window.addEventListener('load', onLoad, { once: true });
    return cleanup;
  }, []);

  // Smooth scrolling + scroll-synced plate choreography (GSAP ScrollTrigger). Skipped for reduced motion.
  useEffect(() => {
    if (reduced !== false) return;
    const lenis = new Lenis({ anchors: { offset: -80 }, lerp: 0.11 });
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-scene] [data-plate]').forEach((plate) => {
        gsap.from(plate.querySelectorAll(':scope > *'), {
          y: 26,
          opacity: 0,
          duration: 0.9,
          ease: 'expo.out',
          stagger: 0.06,
          scrollTrigger: { trigger: plate, start: 'top 82%', toggleActions: 'play none none reverse' },
        });
      });
    });
    // Lenis handles in-page anchors itself; hand keyboard focus to focusable targets (e.g. "Skip the story").
    const onAnchor = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      const el = a && document.getElementById(a.hash.slice(1));
      if (el?.hasAttribute('tabindex')) window.setTimeout(() => el.focus({ preventScroll: true }), 50);
    };
    document.addEventListener('click', onAnchor);
    return () => {
      document.removeEventListener('click', onAnchor);
      ctx.revert();
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, [reduced]);

  // Without 3D (no WebGL, data-saver, or a failure), show a still for the scene in view; the static hero frame covers scene 1.
  useEffect(() => {
    if (webgl !== false) return;
    const stage = document.querySelector('[data-story-stage]');
    stage?.classList.remove('is-3d');
    stage?.classList.toggle('is-scrolled', scene > 0);
  }, [webgl, scene]);
  const still = scene > 0 ? <div className="story-poster" data-scene-poster={SCENES[scene]?.id} aria-hidden="true" /> : null;
  if (webgl === false) return still;
  if (!ready || !webgl) return null;
  const fail = () => setWebgl(false);
  return (
    <Guard fallback={null} onError={fail}>
      <Suspense fallback={null}>
        <StoryCanvas onLost={fail} />
      </Suspense>
    </Guard>
  );
}
