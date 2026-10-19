import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import Studio from './Studio';
import { BatteryAIOverlay, BatteryPack } from './parts';
import Label3D, { LabelPortal } from './Label3D';
import { StateContext, createState, dampState, type VehicleState } from './state';
import type { LabelDef } from './labels';
import { A } from './anchors';
import { onContextLost, prefersReducedMotion } from './webgl';

export type BatteryFocus = 'health' | 'charging' | 'thermal' | 'cells' | 'power' | 'connected';

const LABELS: (LabelDef & { show: BatteryFocus[] | 'all' })[] = [
  { id: 'bp-bms', text: 'Existing BMS', sub: 'Sensing · balancing · limits · protection', kind: 'reference', at: [A.bms[0] - 0.02, A.bms[1] - 0.01, A.bms[2] - 0.16], side: 'left', show: 'all' },
  { id: 'bp-ai', text: 'Battery & Charging AI', sub: 'Software runtime · reviewable insight', kind: 'concept', product: 'battery', at: [A.batteryAI[0], A.batteryAI[1] + 0.06, A.batteryAI[2]], show: 'all' },
  { id: 'bp-cells', text: 'Cell voltages & temperatures', kind: 'reference', at: [-0.62, 0.36, 0.4], side: 'left', show: ['health', 'cells', 'thermal'] },
  { id: 'bp-current', text: 'Pack current & limits', kind: 'reference', at: [0.98, 0.3, 0.62], show: ['charging', 'power'] },
  { id: 'bp-cool', text: 'Cooling plate', kind: 'reference', at: [-0.9, 0.24, -0.6], side: 'left', show: ['thermal'] },
  { id: 'bp-pmg', text: 'Approved insight → PMG', kind: 'interface', at: [0.86, 0.75, 0], show: ['connected'] },
];

function Rig({ focus }: { focus: BatteryFocus }) {
  const { camera, size } = useThree();
  const state = useMemo(() => ({ current: createState({ systems: 1, battery: 1 }) }), []);
  const target = useRef<VehicleState>(createState());
  const reduced = useMemo(() => prefersReducedMotion(), []);
  const pointer = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);
  target.current = createState({
    systems: 1,
    battery: 1,
    batteryAI: focus === 'connected' ? 1 : 0.65,
    focus: focus === 'connected' ? 'health' : focus,
  });
  const look = useMemo(() => new THREE.Vector3(0.05, 0.27, 0), []);
  useFrame((_, dt) => {
    dampState(state.current, target.current, reduced ? 60 : 4, dt);
    state.current.focus = target.current.focus;
    const narrow = size.width < 640;
    const px = reduced ? 0 : pointer.current.x * 0.25;
    const py = reduced ? 0 : pointer.current.y * 0.12;
    const dist = narrow ? 1.35 : 1;
    camera.position.lerp(new THREE.Vector3((2.35 + px) * dist, (2.25 - py) * dist, 2.85 * dist), 1 - Math.exp(-dt * 3));
    camera.lookAt(look);
  });
  return (
    <StateContext.Provider value={state}>
      <Studio shadowY={0.176} footprint="unit" unitSize={[2.7, 2.1]} />
      <BatteryPack cutaway />
      <BatteryAIOverlay />
      {focus === 'connected' && (
        <mesh position={[0.86, 0.62, 0]}>
          <cylinderGeometry args={[0.005, 0.005, 0.26, 8]} />
          <meshBasicMaterial color="#185adb" />
        </mesh>
      )}
      {LABELS.map((l) => (
        <Label3D key={l.id} def={l} visible={l.show === 'all' || l.show.includes(focus)} />
      ))}
    </StateContext.Provider>
  );
}

export default function BatteryPackScene({ focus, className, label, onLost }: { focus: BatteryFocus; className?: string; label?: string; onLost?: () => void }) {
  const wrap = useRef<HTMLDivElement>(null);
  const layer = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    if (!wrap.current) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    io.observe(wrap.current);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={wrap} className={className} role="img" aria-label={label ?? 'Schematic battery pack: modules, cells, BMS and the Battery & Charging AI software layer above it.'} style={{ position: 'relative', minHeight: 320 }}>
      <div ref={layer} className="scene-labels" style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none' }} />
      <Canvas
        style={{ position: 'absolute', inset: 0 }}
        frameloop={visible ? 'always' : 'never'}
        dpr={[1, 1.75]}
        camera={{ position: [2.35, 2.25, 2.85], fov: 30, near: 0.1, far: 40 }}
        gl={{ antialias: true, alpha: true, toneMapping: THREE.NeutralToneMapping }}
        onCreated={({ gl }) => onContextLost(gl.domElement, onLost)}
      >
        <LabelPortal.Provider value={layer}>
          <Rig focus={focus} />
        </LabelPortal.Provider>
      </Canvas>
    </div>
  );
}
