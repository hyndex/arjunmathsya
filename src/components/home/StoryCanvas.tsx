import { Suspense, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import Vehicle from '@/components/three/Vehicle';
import Drawn from '@/components/three/Drawn';
import Systems from '@/components/three/Systems';
import Studio from '@/components/three/Studio';
import Label3D, { LabelPortal } from '@/components/three/Label3D';
import { LABELS } from '@/components/three/labels';
import { CAR } from '@/components/three/anchors';
import { StateContext, createState, lerpState, type VehicleState } from '@/components/three/state';
import { onContextLost, prefersReducedMotion } from '@/components/three/webgl';
import { useStory } from '@/lib/storyStore';
import { SCENES } from './storyScenes';

const smoother = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const KEY_STATES = SCENES.map((s) => createState(s.state));
const CAM = new THREE.CatmullRomCurve3(SCENES.map((s) => new THREE.Vector3(...s.cam)), false, 'centripetal');
const TGT = new THREE.CatmullRomCurve3(SCENES.map((s) => new THREE.Vector3(...s.target)), false, 'centripetal');
const SIDE_X = { left: -0.15, right: 0.15, center: 0 } as const;

/** Camera distance multiplier + view offset (fractions of the stage size) for one scene. */
type Framing = { spread: number; sx: number; sy: number };
type HeroFit = Framing & { follow: boolean; top: number };

// The car's bounding box. Its projection is a little larger than the silhouette, which keeps a margin around the car.
const CAR_BOX = [CAR.tail, CAR.nose].flatMap((x) => [0, CAR.roof].flatMap((y) => [-CAR.halfWidth, CAR.halfWidth].map((z) => new THREE.Vector3(x, y, z))));

/** Fits the car, seen from the arrival camera, inside `rect` (stage pixels): the hero's reserved visual area. */
function fitHero(rect: { x: number; y: number; width: number; height: number }, W: number, H: number): Framing {
  const cam = new THREE.PerspectiveCamera(30, W / H);
  const c0 = new THREE.Vector3(...SCENES[0].cam);
  const t = new THREE.Vector3(...SCENES[0].target);
  const p = new THREE.Vector3();
  const box = (spread: number) => {
    cam.position.copy(c0).sub(t).multiplyScalar(spread).add(t);
    cam.lookAt(t);
    cam.updateMatrixWorld();
    const b = { x0: Infinity, x1: -Infinity, y0: Infinity, y1: -Infinity };
    for (const v of CAR_BOX) {
      p.copy(v).project(cam);
      const x = ((p.x + 1) * W) / 2;
      const y = ((1 - p.y) * H) / 2;
      b.x0 = Math.min(b.x0, x);
      b.x1 = Math.max(b.x1, x);
      b.y0 = Math.min(b.y0, y);
      b.y1 = Math.max(b.y1, y);
    }
    return b;
  };
  let spread = 1;
  let b = box(spread);
  for (let k = 0; k < 4; k++) {
    spread /= Math.min(rect.width / (b.x1 - b.x0), rect.height / (b.y1 - b.y0));
    b = box(spread);
  }
  // setViewOffset shifts the image by (-x, -y): move the box centre onto the rect centre.
  return { spread, sx: ((b.x0 + b.x1) / 2 - rect.x - rect.width / 2) / W, sy: ((b.y0 + b.y1) / 2 - rect.y - rect.height / 2) / H };
}

/** Maps page scroll → continuous scene parameter → camera + vehicle state. */
function Director({ reduced }: { reduced: boolean }) {
  const { camera, size } = useThree();
  const state = useContext(StateContext);
  const anchors = useRef<number[]>([]);
  const hero = useRef<HeroFit | null>(null);
  const disp = useRef(0);
  const tmp = useMemo(() => ({ a: createState(), pos: new THREE.Vector3(), tgt: new THREE.Vector3(), tint: new THREE.Color(), tintA: new THREE.Color(), tintB: new THREE.Color(), gen: 1, online: 1 }), []);
  const stageEl = useMemo(() => document.querySelector<HTMLElement>('[data-story-stage]'), []);
  const lastTint = useRef('');

  useEffect(() => {
    const measure = () => {
      const els = [...document.querySelectorAll<HTMLElement>('[data-scene]')];
      anchors.current = els.map((el, i) => {
        if (i === 0) return 0;
        const r = el.getBoundingClientRect();
        const top = r.top + window.scrollY;
        return top + Math.max(0, r.height - window.innerHeight) * 0.5;
      });
      // Hero: frame the car inside its reserved area, in stage pixels as laid out at scroll 0 (the stage starts with the story).
      const vis = document.querySelector<HTMLElement>('[data-hero-visual]')?.getBoundingClientRect();
      const story = document.querySelector<HTMLElement>('[data-story]')?.getBoundingClientRect();
      const text = document.querySelector<HTMLElement>('.hero-body')?.getBoundingClientRect();
      hero.current =
        vis?.width && vis.height && story && stageEl
          ? {
              ...fitHero({ x: vis.left - story.left, y: vis.top - story.top, width: vis.width, height: vis.height }, stageEl.clientWidth, stageEl.clientHeight),
              follow: !!text && vis.left < text.right, // stacked layout: the visual shares the text column
              top: story.top + window.scrollY,
            }
          : null;
      // Stacked layout: the car leaves with the hero, so the next camera move starts only once the hero has scrolled
      // out under the header (otherwise the hero's last lines would pass over the arriving x-ray view).
      if (hero.current?.follow && els[0] && anchors.current.length > 1) {
        const gone = els[0].getBoundingClientRect().bottom + window.scrollY - (document.querySelector('.site-header')?.getBoundingClientRect().height ?? 0);
        const a1 = anchors.current[1];
        anchors.current[0] = Math.min(Math.max(0, (gone - 0.12 * a1) / 0.88), a1 - 1); // transition starts at 12% of the window
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    window.addEventListener('load', measure);
    document.fonts?.ready.then(measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('load', measure);
    };
  }, [stageEl]);

  useFrame((_, dt) => {
    const a = anchors.current;
    if (!a.length) return;
    const y = window.scrollY;
    let p = 0;
    if (y >= a[a.length - 1]) p = a.length - 1;
    else if (y > a[0]) {
      let i = 0;
      while (y > a[i + 1]) i++;
      const f = (y - a[i]) / Math.max(1, a[i + 1] - a[i]);
      p = i + smoother(clamp01((f - 0.12) / 0.76)); // dwell at each scene, travel between
    }
    p = Math.min(p, SCENES.length - 1);
    if (reduced) disp.current = Math.round(p);
    else disp.current += (p - disp.current) * (1 - Math.exp(-dt * 4.2));
    const d = disp.current;
    const i = Math.min(SCENES.length - 2, Math.floor(d));
    const f = d - i;

    // vehicle state
    lerpState(KEY_STATES[i], KEY_STATES[i + 1], f, tmp.a);
    const s = state.current;
    Object.assign(s, tmp.a);
    const story = useStory.getState();
    const near = Math.round(d);
    if (story.scene !== near) story.set({ scene: near });
    const id = SCENES[near].id;
    const k = 1 - Math.min(1, Math.abs(d - near) * 2); // how settled we are in the nearest scene
    if (id === 'battery-ai' || id === 'battery') s.focus = id === 'battery' ? 'health' : story.battery;
    tmp.gen += ((id === 'evo' ? story.gen : 1) - tmp.gen) * (1 - Math.exp(-dt * 5));
    s.gen = tmp.gen;
    tmp.online += ((story.online ? 1 : 0) - tmp.online) * (1 - Math.exp(-dt * 5));
    s.online = id === 'cloud' ? tmp.online : 1;
    if (id === 'cloud') s.cloud *= 0.25 + 0.75 * tmp.online;
    if (id === 'pmg') {
      const step = story.pmgStep;
      s.battery = Math.max(s.battery, k * (step === 0 || step === 4 ? 1 : 0.4));
      s.evo = Math.max(s.evo, k * (step === 3 ? 1 : 0.35));
      s.thermal = Math.max(s.thermal, k * (step === 3 ? 1 : 0.2));
      s.pulse = step === 5 ? 0.4 : 1;
    }
    // camera along the authored path; each scene frames the car beside (desktop) or above (narrow) its text plate
    const t = d / (SCENES.length - 1);
    CAM.getPoint(t, tmp.pos);
    TGT.getPoint(t, tmp.tgt);
    const narrow = size.width < 900;
    const frame = (n: number): Framing => {
      const sid = SCENES[n].id;
      if (sid === 'arrival' && hero.current) return hero.current;
      return {
        spread: size.width < 600 ? (sid === 'arrival' ? 2.5 : sid === 'ecosystem' ? 2.1 : 1.9) : narrow ? 1.25 : 1,
        sx: narrow ? 0 : SIDE_X[SCENES[n].side],
        sy: narrow ? (sid === 'arrival' ? 0.11 : sid === 'ecosystem' ? -0.12 : 0.18) : sid === 'arrival' ? -0.13 : sid === 'ecosystem' ? 0.15 : 0,
      };
    };
    const fa = frame(i);
    const fb = frame(i + 1);
    // Stacked hero (phones, tablets): the car scrolls with its reserved area, so the text below it never passes over it.
    const lift = i === 0 && hero.current?.follow ? Math.max(0, window.scrollY - hero.current.top) / size.height : 0;
    tmp.pos.sub(tmp.tgt).multiplyScalar(fa.spread + (fb.spread - fa.spread) * f).add(tmp.tgt);
    camera.position.copy(tmp.pos);
    camera.lookAt(tmp.tgt);
    const sx = fa.sx + (fb.sx - fa.sx) * f;
    const sy = (fa.sy + lift) * (1 - f) + fb.sy * f;
    (camera as THREE.PerspectiveCamera).setViewOffset(size.width, size.height, sx * size.width, sy * size.height, size.width, size.height);

    // studio tint follows the technology in focus
    tmp.tintA.set(SCENES[i].tint);
    tmp.tintB.set(SCENES[i + 1].tint);
    tmp.tint.copy(tmp.tintA).lerp(tmp.tintB, f);
    const hex = '#' + tmp.tint.getHexString();
    if (hex !== lastTint.current && stageEl) {
      stageEl.style.setProperty('--stage-tint', hex);
      lastTint.current = hex;
    }
  });
  return null;
}

// Scene label entries are "id" or "id:left|right" (per-scene side override).
const USED = new Set(SCENES.flatMap((s) => s.labels.map((l) => l.split(':')[0])));
function SceneLabels() {
  const scene = useStory((s) => s.scene);
  const active = new Map((SCENES[scene]?.labels ?? []).map((l) => l.split(':') as [string, string | undefined]));
  return (
    <>
      {LABELS.filter((l) => USED.has(l.id)).map((l) => {
        const side = active.get(l.id) as 'left' | 'right' | undefined;
        return <Label3D key={l.id} def={side ? { ...l, side } : l} visible={active.has(l.id)} />;
      })}
    </>
  );
}

/** The heavy part of the homepage: three.js scene, director and labels. Loaded lazily by StoryStage. */
export default function StoryCanvas({ onLost }: { onLost?: () => void }) {
  const [active, setActive] = useState(true);
  const reduced = useMemo(() => prefersReducedMotion(), []);
  const vehicle = useMemo(() => ({ current: createState(SCENES[0].state) as VehicleState }), []);
  const labelLayer = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const story = document.querySelector('[data-story]');
    if (!story) return;
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { rootMargin: '10% 0px' });
    io.observe(story);
    return () => io.disconnect();
  }, []);
  return (
    <>
      <div ref={labelLayer} className="story-labels" />
      <Canvas
        className="story-canvas"
        frameloop={active ? 'always' : 'never'}
        dpr={[1, 1.75]}
        camera={{ position: SCENES[0].cam, fov: 30, near: 0.1, far: 80 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance', toneMapping: THREE.NeutralToneMapping }}
        onCreated={({ gl }) => onContextLost(gl.domElement, onLost)}
        aria-hidden="true"
      >
        <StateContext.Provider value={vehicle}>
          <LabelPortal.Provider value={labelLayer}>
            <Director reduced={reduced} />
            <Studio />
            <Suspense fallback={null}>
              <Vehicle />
              <Drawn onDrawn={() => document.querySelector('[data-story-stage]')?.classList.add('is-3d')} />
            </Suspense>
            <Systems />
            <SceneLabels />
          </LabelPortal.Provider>
        </StateContext.Provider>
      </Canvas>
    </>
  );
}
