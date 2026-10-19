import { Suspense, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import Vehicle from '@/components/three/Vehicle';
import Systems from '@/components/three/Systems';
import Studio from '@/components/three/Studio';
import Label3D, { LabelPortal } from '@/components/three/Label3D';
import { LABELS } from '@/components/three/labels';
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

/** Maps page scroll → continuous scene parameter → camera + vehicle state. */
function Director({ reduced }: { reduced: boolean }) {
  const drawn = useRef(0);
  const { camera, size } = useThree();
  const state = useContext(StateContext);
  const anchors = useRef<number[]>([]);
  const disp = useRef(0);
  const intro = useRef(1); // the static hero frame already shows the settled framing, so no dolly-in
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
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    window.addEventListener('load', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('load', measure);
    };
  }, []);

  useFrame((_, dt) => {
    if (drawn.current < 3 && ++drawn.current === 3) stageEl?.classList.add('is-3d');
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
    if (id === 'value') {
      const b = story.benefit;
      s.battery = k * (b === 'battery' || b === 'charging' ? 1 : 0.3);
      s.hv = k * (b === 'charging' ? 1 : 0.2);
      s.evo = k * (b === 'thermal' ? 1 : b === 'charging' ? 0.6 : 0.3);
      s.thermal = k * (b === 'thermal' ? 1 : 0.2);
      s.pmg = k * (b === 'service' ? 1 : 0.6);
      s.network = Math.max(0.3, k * (b === 'service' ? 1 : 0.5));
    }

    // camera along the authored path, dollied in on first load
    intro.current = Math.min(1, intro.current + dt / 1.8);
    const t = d / (SCENES.length - 1);
    CAM.getPoint(t, tmp.pos);
    TGT.getPoint(t, tmp.tgt);
    const narrow = size.width < 900;
    const phoneSpread = (n: number) => (SCENES[n].id === 'arrival' ? 2.5 : SCENES[n].id === 'ecosystem' ? 2.1 : 1.9);
    const base = size.width < 600 ? phoneSpread(i) + (phoneSpread(i + 1) - phoneSpread(i)) * f : narrow ? 1.25 : 1;
    const spread = base * (1 + 0.22 * (1 - smoother(intro.current)));
    tmp.pos.sub(tmp.tgt).multiplyScalar(spread).add(tmp.tgt);
    camera.position.copy(tmp.pos);
    camera.lookAt(tmp.tgt);
    const sideA = SIDE_X[SCENES[i].side];
    const sideB = SIDE_X[SCENES[i + 1].side];
    const sx = narrow ? 0 : sideA + (sideB - sideA) * f;
    // desktop hero: car sits low-right under the two-line headline
    const yOf = (n: number) => (SCENES[n].id === 'arrival' ? -0.13 : SCENES[n].id === 'ecosystem' ? 0.15 : 0);
    const heroY = yOf(i) + (yOf(i + 1) - yOf(i)) * f;
    const syOf = (n: number) => (SCENES[n].id === 'arrival' ? 0.11 : SCENES[n].id === 'ecosystem' ? -0.12 : 0.18);
    const sy = narrow ? syOf(i) + (syOf(i + 1) - syOf(i)) * f : heroY;
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
            </Suspense>
            <Systems />
            <SceneLabels />
          </LabelPortal.Provider>
        </StateContext.Provider>
      </Canvas>
    </>
  );
}
