import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { A, CLOUD_NODES, type V3 } from './anchors';
import { BatteryAIOverlay, BatteryPack, EvoCoreUnit, ReferenceParts } from './parts';
import { COLORS, useVehicleState } from './state';

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const curve = (pts: V3[]) => new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(...p)), false, 'centripetal');

// Routed paths. HV = orange (as in real vehicles), coolant = aqua, vehicle network = cobalt.
export const ROUTES = {
  hvBattEvo: [[0.98, 0.3, 0.18], [1.3, 0.32, 0.2], [1.55, 0.4, 0.18], [1.7, 0.45, 0.16]] as V3[],
  hvInletEvo: [[1.05, 0.72, 1.12], [1.3, 0.62, 0.9], [1.55, 0.52, 0.45], [1.7, 0.47, 0.22]] as V3[],
  hvBattInv: [[-0.98, 0.3, 0.05], [-1.2, 0.36, 0.05], [-1.38, 0.52, 0.05]] as V3[],
  lvEvo12v: [[2.12, 0.47, -0.2], [2.18, 0.45, -0.36], [2.22, 0.43, -0.44]] as V3[],
  coolRad: [[2.33, 0.38, -0.35], [2.2, 0.32, -0.45], [2.13, 0.3, -0.5]] as V3[],
  coolBatt: [[2.05, 0.29, -0.5], [1.6, 0.25, -0.45], [1.02, 0.24, -0.36]] as V3[],
  coolEvo: [[2.1, 0.33, -0.46], [2.03, 0.37, -0.3], [1.97, 0.4, -0.22]] as V3[],
};
export const NET = {
  bms: [[0.86, 0.38, 0.05], [0.95, 0.46, 0.05], [1.15, 0.56, 0.03], [1.3, 0.62, 0]] as V3[],
  evo: [[1.82, 0.6, 0], [1.6, 0.66, 0], [1.42, 0.65, 0]] as V3[],
  thermal: [[2.1, 0.36, -0.46], [1.8, 0.45, -0.3], [1.5, 0.56, -0.1], [1.34, 0.61, 0]] as V3[],
  inverter: [[-1.48, 0.62, 0], [-0.8, 0.44, 0], [0.05, 0.42, 0], [0.8, 0.5, 0], [1.25, 0.6, 0]] as V3[],
  tcu: [[-0.35, 1.11, 0], [0.2, 1.04, 0], [0.8, 0.86, 0], [1.28, 0.66, 0]] as V3[],
  hmi: [[1.12, 0.82, 0], [1.2, 0.74, 0], [1.3, 0.66, 0]] as V3[],
};
export const GEN_LINKS = {
  battery: [[1.7, 0.5, -0.04], [1.35, 0.4, -0.02], [0.92, 0.36, 0]] as V3[],
  thermal: [[2.0, 0.5, -0.16], [2.08, 0.4, -0.34], [2.1, 0.33, -0.48]] as V3[],
  inverter: [[1.7, 0.45, 0.08], [0.6, 0.42, 0.1], [-0.6, 0.44, 0.08], [-1.42, 0.58, 0.04]] as V3[],
};


function Tube({ pts, radius, material }: { pts: V3[]; radius: number; material: THREE.Material }) {
  const geo = useMemo(() => new THREE.TubeGeometry(curve(pts), 48, radius, 8, false), [pts, radius]);
  return <mesh geometry={geo} material={material} />;
}

/** Data pulses travelling along the vehicle network toward PMG (or back out, for permitted requests). */
function Pulses() {
  const state = useVehicleState();
  const mesh = useRef<THREE.InstancedMesh>(null);
  const curves = useMemo(() => Object.values(NET).map(curve), []);
  const PER = 3;
  const tmp = useMemo(() => new THREE.Object3D(), []);
  useFrame(({ clock }) => {
    const s = state.current;
    const m = mesh.current;
    if (!m) return;
    const on = clamp01(s.network) * clamp01(s.pulse);
    m.visible = on > 0.02;
    if (!m.visible) return;
    const t = clock.elapsedTime;
    curves.forEach((c, i) => {
      for (let j = 0; j < PER; j++) {
        const u = (t * 0.32 + j / PER + i * 0.17) % 1;
        tmp.position.copy(c.getPointAt(u));
        tmp.scale.setScalar(on * (0.6 + 0.4 * Math.sin(u * Math.PI)));
        tmp.updateMatrix();
        m.setMatrixAt(i * PER + j, tmp.matrix);
      }
    });
    m.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, curves.length * PER]}>
      <sphereGeometry args={[0.016, 12, 12]} />
      <meshBasicMaterial color="#3d7bff" toneMapped={false} />
    </instancedMesh>
  );
}

function CloudLayer() {
  const state = useVehicleState();
  const group = useRef<THREE.Group>(null);
  const lines = useRef<(THREE.Object3D | null)[]>([]);
  const panel = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#ffffff', roughness: 0.25, metalness: 0, transparent: true, opacity: 0, transmission: 0, clearcoat: 1 }), []);
  const edge = useMemo(() => new THREE.MeshBasicMaterial({ color: COLORS.cobalt, transparent: true, opacity: 0 }), []);
  useFrame(() => {
    const s = state.current;
    const c = clamp01(s.cloud);
    if (group.current) group.current.visible = c > 0.01;
    panel.opacity = 0.92 * c;
    edge.opacity = 0.7 * c;
    lines.current.forEach((l) => {
      const mat = (l as unknown as { material?: THREE.Material & { opacity: number } })?.material;
      if (mat) mat.opacity = 0.85 * c * (0.15 + 0.85 * clamp01(s.online));
    });
  });
  return (
    <group ref={group}>
      {CLOUD_NODES.map((n, i) => (
        <group key={n.id} position={n.p}>
          <RoundedBox args={[0.62, 0.36, 0.04]} radius={0.04} smoothness={3} material={panel} />
          <mesh material={edge} position={[0, -0.2, 0]}>
            <boxGeometry args={[0.3, 0.008, 0.008]} />
          </mesh>
          <Line
            ref={(l) => void (lines.current[i] = l as unknown as THREE.Object3D)}
            points={[[0, -0.2, 0], [A.antenna[0] - n.p[0], A.antenna[1] + 0.06 - n.p[1], A.antenna[2] - n.p[2]]]}
            color={COLORS.cobalt}
            lineWidth={1.4}
            dashed
            dashSize={0.08}
            gapSize={0.06}
            transparent
            opacity={0}
          />
        </group>
      ))}
    </group>
  );
}

/** Generation extensions: Gen 2 battery + thermal coordination, Gen 3 dashed (future) inverter supervision. */
function GenerationLinks() {
  const state = useVehicleState();
  const g2 = useRef<THREE.Group>(null);
  const g3 = useRef<THREE.Group>(null);
  const m2 = useMemo(() => new THREE.MeshBasicMaterial({ color: COLORS.emerald, transparent: true, opacity: 0, toneMapped: false }), []);
  const m2t = useMemo(() => new THREE.MeshBasicMaterial({ color: '#3fbfb1', transparent: true, opacity: 0, toneMapped: false }), []);
  const l3 = useRef<THREE.Object3D | null>(null);
  useFrame(() => {
    const s = state.current;
    const show = clamp01(s.evo) * clamp01(s.systems);
    const a2 = clamp01(s.gen - 1) * show;
    const a3 = clamp01(s.gen - 2) * show;
    m2.opacity = a2;
    m2t.opacity = a2 * 0.9;
    if (g2.current) g2.current.visible = a2 > 0.01;
    if (g3.current) g3.current.visible = a3 > 0.01;
    const mat = (l3.current as unknown as { material?: THREE.Material & { opacity: number } })?.material;
    if (mat) mat.opacity = a3;
  });
  return (
    <>
      <group ref={g2}>
        <Tube pts={GEN_LINKS.battery} radius={0.007} material={m2} />
        <Tube pts={GEN_LINKS.thermal} radius={0.007} material={m2t} />
      </group>
      <group ref={g3}>
        <Line ref={(l) => void (l3.current = l as unknown as THREE.Object3D)} points={GEN_LINKS.inverter} color={COLORS.tangerine} lineWidth={2} dashed dashSize={0.06} gapSize={0.05} transparent opacity={0} />
      </group>
    </>
  );
}

/** Everything under the skin. Visibility/emphasis follows the shared VehicleState. */
export default function Systems({ cloud = true }: { cloud?: boolean }) {
  const state = useVehicleState();
  const root = useRef<THREE.Group>(null);
  const mats = useMemo(
    () => ({
      hv: new THREE.MeshStandardMaterial({ color: COLORS.hv, roughness: 0.4, emissive: COLORS.hv, emissiveIntensity: 0 }),
      lv: new THREE.MeshStandardMaterial({ color: '#8a96a6', roughness: 0.5 }),
      cool: new THREE.MeshStandardMaterial({ color: '#6fcfc4', roughness: 0.35, emissive: '#2bb5a5', emissiveIntensity: 0 }),
      net: new THREE.MeshBasicMaterial({ color: COLORS.cobalt, transparent: true, opacity: 0 }),
    }),
    []
  );
  useFrame(() => {
    const s = state.current;
    if (root.current) root.current.visible = s.systems > 0.01;
    mats.hv.emissiveIntensity = 0.5 * clamp01(s.hv);
    mats.cool.emissiveIntensity = 0.6 * clamp01(s.thermal);
    mats.net.opacity = 0.15 + 0.75 * clamp01(s.network);
    mats.net.visible = s.network > 0.01;
  });
  return (
    <>
      <group ref={root}>
        <BatteryPack />
        <BatteryAIOverlay />
        <group position={A.evo}>
          <EvoCoreUnit />
        </group>
        <ReferenceParts />
        <Tube pts={ROUTES.hvBattEvo} radius={0.016} material={mats.hv} />
        <Tube pts={ROUTES.hvInletEvo} radius={0.014} material={mats.hv} />
        <Tube pts={ROUTES.hvBattInv} radius={0.016} material={mats.hv} />
        <Tube pts={ROUTES.lvEvo12v} radius={0.009} material={mats.lv} />
        <Tube pts={ROUTES.coolRad} radius={0.012} material={mats.cool} />
        <Tube pts={ROUTES.coolBatt} radius={0.012} material={mats.cool} />
        <Tube pts={ROUTES.coolEvo} radius={0.011} material={mats.cool} />
        {Object.entries(NET).map(([k, pts]) => (
          <Tube key={k} pts={pts} radius={0.006} material={mats.net} />
        ))}
        <Pulses />
        <GenerationLinks />
      </group>
      {cloud && <CloudLayer />}
    </>
  );
}
