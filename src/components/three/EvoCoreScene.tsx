import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';
import Studio from './Studio';
import { EvoCoreUnit } from './parts';
import Label3D, { LabelPortal } from './Label3D';
import { LABELS } from './labels';
import { StateContext, createState, dampState, type VehicleState } from './state';
import { A, type V3 } from './anchors';
import { onContextLost, prefersReducedMotion } from './webgl';

export type EvoFocus = 'obc' | 'dcdc' | 'evcc' | 'hv' | 'control' | 'ai';

const FUNCTION_LABELS = LABELS.filter((l) => l.id.startsWith('evo-'));
const off = (d: V3): V3 => [A.evo[0] + d[0], A.evo[1] + d[1], A.evo[2] + d[2]];
// Relationships each later generation adds (Gen 1 interfaces are named in the page legend, not drawn).
const STUBS: { id: string; from: V3; to: V3; color: string; dashed?: boolean; minGen: number; text: string; kind: 'interface' | 'concept' | 'future'; product?: 'battery' | 'pmg' }[] = [
  { id: 'st-batt', from: off([-0.29, 0.1, -0.05]), to: off([-0.95, 0.3, -0.15]), color: '#087f6b', minGen: 2, text: 'Battery & Charging AI runtime · Gen 2', kind: 'concept', product: 'battery' },
  { id: 'st-inv', from: off([0.29, 0.06, -0.12]), to: off([0.62, 0.06, -0.48]), color: '#b0521a', dashed: true, minGen: 3, text: 'Inverter supervision · Gen 3 option', kind: 'future' },
];

function Rig({ generation, explode, focus }: { generation: number; explode: number; focus: EvoFocus | null }) {
  const { camera, size } = useThree();
  const state = useMemo(() => ({ current: createState({ systems: 1, evo: 1 }) }), []);
  const target = useRef<VehicleState>(createState());
  const reduced = useMemo(() => prefersReducedMotion(), []);
  target.current = createState({ systems: 1, evo: 1, explode, gen: generation, focus });
  const look = useMemo(() => new THREE.Vector3(), []);
  const want = useMemo(() => new THREE.Vector3(), []);
  useFrame((_, dt) => {
    dampState(state.current, target.current, reduced ? 60 : 6, dt); // mechanical: quick, decisive settle
    const e = state.current.explode;
    const narrow = size.width < 640;
    const k = (narrow ? 1.45 : 1) * (1 + e * 0.35);
    want.set(A.evo[0] + 1.25 * k, A.evo[1] + 0.95 * k + e * 0.15, A.evo[2] + 1.35 * k);
    camera.position.lerp(want, reduced ? 1 : 1 - Math.exp(-dt * 4));
    look.set(A.evo[0], A.evo[1] + 0.1 + e * 0.24, A.evo[2]);
    camera.lookAt(look);
  });
  return (
    <StateContext.Provider value={state}>
      <Studio shadowY={A.evo[1] - 0.004} footprint="unit" unitSize={[0.95, 0.85]} unitAt={[A.evo[0], A.evo[2]]} />
      <group position={A.evo}>
        <EvoCoreUnit />
      </group>
      {STUBS.filter((s) => generation >= s.minGen).map((s) => (
        <group key={s.id}>
          <Line points={[s.from, s.to]} color={s.color} lineWidth={2} dashed={!!s.dashed} dashSize={0.05} gapSize={0.04} />
          <Label3D def={{ id: s.id, text: s.text, kind: s.kind, product: s.product, at: s.to, side: s.to[0] < A.evo[0] ? 'left' : 'right' }} visible />
        </group>
      ))}
      {FUNCTION_LABELS.map((l) => (
        <Label3D key={l.id} def={l} visible={focus === l.id.slice(4)} selected={focus === l.id.slice(4)} />
      ))}
    </StateContext.Provider>
  );
}

export default function EvoCoreScene({
  generation,
  explode,
  focus,
  className,
  label,
  onLost,
}: {
  generation: 1 | 2 | 3;
  explode: number;
  focus: EvoFocus | null;
  className?: string;
  label?: string;
  onLost?: () => void;
}) {
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
    <div ref={wrap} className={className} role="img" aria-label={label ?? `Schematic Evo Core concept, Gen ${generation}: housing, OBC and DC/DC power stages, HV distribution, EVCC, common control board, supervisory intelligence layer and lid.`} style={{ position: 'relative', minHeight: 320 }}>
      <div ref={layer} className="scene-labels" style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none' }} />
      <Canvas
        style={{ position: 'absolute', inset: 0 }}
        frameloop={visible ? 'always' : 'never'}
        dpr={[1, 1.75]}
        camera={{ position: [A.evo[0] + 1.3, A.evo[1] + 1, A.evo[2] + 1.4], fov: 30, near: 0.05, far: 40 }}
        gl={{ antialias: true, alpha: true, toneMapping: THREE.NeutralToneMapping }}
        onCreated={({ gl }) => onContextLost(gl.domElement, onLost)}
      >
        <LabelPortal.Provider value={layer}>
          <Rig generation={generation} explode={explode} focus={focus} />
        </LabelPortal.Provider>
      </Canvas>
    </div>
  );
}
