import { Suspense, useEffect, useMemo, useRef, type MutableRefObject, type RefObject } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { CameraControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import Vehicle from '@/components/three/Vehicle';
import Systems from '@/components/three/Systems';
import Studio from '@/components/three/Studio';
import { StateContext, createState, dampState, useVehicleState, type VehicleState } from '@/components/three/state';
import { HOTSPOTS } from '@/data/hotspots';
import { onContextLost } from '@/components/three/webgl';
import type { View } from './ExplorerApp';

export type ExplorerHandle = { rotate: (dir: number) => void; tilt: (dir: number) => void; zoom: (dir: number) => void; reset: () => void };

const HOME = { pos: [6.4, 2.7, 6.9] as const, target: [0.1, 0.55, 0] as const };
const Z_RANGE: [number, number] = [20, 0];
const MARKER_STYLE = { pointerEvents: 'none' as const };

function targetState(view: View, selected: string): VehicleState {
  const base: Partial<VehicleState> =
    view === 'exterior'
      ? { body: 1, xray: 0, glass: 1, systems: 0 }
      : { body: 0.05, xray: 0.68, glass: 0.16, systems: 1, wheels: 0.4, battery: 0.45, evo: 0.55, network: 0.45, pmg: 0.55, hv: 0.55, thermal: 0.35, pulse: 0.35 };
  const s = createState(base);
  const h = HOTSPOTS.find((x) => x.id === selected);
  if (!h || view === 'exterior') return s;
  if (h.explode) Object.assign(s, { evo: 1, explode: 1, focus: h.id === 'control' ? 'control' : h.id });
  switch (h.id) {
    case 'battery':
      Object.assign(s, { battery: 1, focus: 'cells' });
      break;
    case 'battery-ai':
      Object.assign(s, { battery: 1, batteryAI: 1, network: 0.7, pulse: 0.7 });
      break;
    case 'thermal':
      Object.assign(s, { thermal: 1, battery: 0.6 });
      break;
    case 'pmg':
      Object.assign(s, { pmg: 1, network: 1, pulse: 1 });
      break;
    case 'network':
      Object.assign(s, { network: 1, pulse: 1, pmg: 0.8 });
      break;
    case 'cloud':
      Object.assign(s, { cloud: 1, pmg: 1, network: 0.7, pulse: 0.6 });
      break;
    case 'inverter':
      Object.assign(s, { hv: 1, evo: 0.7, gen: 3 });
      break;
  }
  return s;
}

function Director({ view, selected, reduced, controls, onSelect, portal }: { view: View; selected: string; reduced: boolean; controls: MutableRefObject<CameraControls | null>; onSelect: (id: string) => void; portal: RefObject<HTMLElement> }) {
  const state = useMemo(() => ({ current: createState() }), []);
  return (
    <StateContext.Provider value={state}>
      <DampLoop target={targetState(view, selected)} reduced={reduced} />
      <Studio />
      <Suspense fallback={null}>
        <Vehicle />
      </Suspense>
      <Systems />
      <Markers selected={selected} onSelect={onSelect} portal={portal} />
      <CameraFocus selected={selected} view={view} controls={controls} reduced={reduced} />
    </StateContext.Provider>
  );
}

/** Eases the shared vehicle state toward the view/selection target every frame. */
function DampLoop({ target, reduced }: { target: VehicleState; reduced: boolean }) {
  const state = useVehicleState();
  const ref = useRef(target);
  ref.current = target;
  useFrame((_, dt) => dampState(state.current, ref.current, reduced ? 60 : 5, dt));
  return null;
}

function CameraFocus({ selected, view, controls, reduced }: { selected: string; view: View; controls: MutableRefObject<CameraControls | null>; reduced: boolean }) {
  const first = useRef(true);
  useEffect(() => {
    const c = controls.current;
    if (!c) return;
    const h = HOTSPOTS.find((x) => x.id === selected);
    const animate = !reduced && !first.current;
    first.current = false;
    if (!h || view === 'exterior') {
      void c.setLookAt(...HOME.pos, ...HOME.target, animate);
      return;
    }
    void c.setLookAt(...h.cam, ...h.at, animate);
  }, [selected, view, controls, reduced]);
  return null;
}

// Markers are mouse/touch shortcuts; keyboard and screen-reader users use the equivalent list in the panel.
function Markers({ selected, onSelect, portal }: { selected: string; onSelect: (id: string) => void; portal: RefObject<HTMLElement> }) {
  return (
    <>
      {HOTSPOTS.map((h, i) => (
        <group key={h.id} position={h.at}>
          <Html zIndexRange={Z_RANGE} style={MARKER_STYLE} portal={portal}>
            <button type="button" tabIndex={-1} aria-hidden="true" onClick={() => onSelect(h.id)} className={`hs3d hs3d--${h.kind} ${h.id === selected ? 'is-selected' : ''}`} data-product={h.product}>
              <span className="hs3d-n">{i + 1}</span>
              <span className="hs3d-name">{h.name}</span>
            </button>
          </Html>
        </group>
      ))}
    </>
  );
}

export default function ExplorerScene({
  selected,
  view,
  onSelect,
  handleRef,
  reduced,
  onLost,
}: {
  selected: string;
  view: View;
  onSelect: (id: string) => void;
  handleRef: MutableRefObject<ExplorerHandle | null>;
  reduced: boolean;
  onLost?: () => void;
}) {
  const controls = useRef<CameraControls | null>(null);
  const markerLayer = useRef<HTMLDivElement>(null);
  useEffect(() => {
    handleRef.current = {
      rotate: (d) => void controls.current?.rotate((d * Math.PI) / 8, 0, !reduced),
      tilt: (d) => void controls.current?.rotate(0, (d * Math.PI) / 16, !reduced),
      zoom: (d) => void controls.current?.dolly(d * 0.9, !reduced),
      reset: () => void controls.current?.setLookAt(...HOME.pos, ...HOME.target, !reduced),
    };
    return () => {
      handleRef.current = null;
    };
  }, [handleRef, reduced]);
  return (
    <>
    <div ref={markerLayer} className="explorer-markers" />
    <Canvas
      className="explorer-canvas"
      dpr={[1, 1.75]}
      camera={{ position: [...HOME.pos], fov: 32, near: 0.1, far: 80 }}
      gl={{ antialias: true, alpha: true, toneMapping: THREE.NeutralToneMapping }}
      onCreated={({ gl }) => onContextLost(gl.domElement, onLost)}
    >
      <CameraControls ref={controls} makeDefault minDistance={1.6} maxDistance={15} maxPolarAngle={Math.PI * 0.49} smoothTime={reduced ? 0 : 0.55} />
      <Director view={view} selected={selected} reduced={reduced} controls={controls} onSelect={onSelect} portal={markerLayer as RefObject<HTMLElement>} />
    </Canvas>
    </>
  );
}
