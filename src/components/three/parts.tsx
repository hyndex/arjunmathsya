import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Edges, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { A, EVO_PARTS, type V3 } from './anchors';
import { COLORS, useVehicleState } from './state';

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const lerp3 = (a: V3, b: V3, t: number): V3 => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

const std = (color: string, roughness = 0.55, metalness = 0.1, extra: Partial<THREE.MeshStandardMaterialParameters> = {}) =>
  new THREE.MeshStandardMaterial({ color, roughness, metalness, ...extra });

/* ------------------------------------------------------------------------------------------------
 * Battery pack (reference vehicle system) — tray, cooling plate, 12 modules, 288 cells, BMS.
 * Cell colours animate per scenario (focus): health / charging / thermal / cells / power / connected.
 * ---------------------------------------------------------------------------------------------- */
const MODULES = Array.from({ length: 12 }, (_, i) => ({ x: -0.83 + (i % 6) * 0.332, z: i < 6 ? -0.36 : 0.36 }));
const CELL_COLS = 4;
const CELL_ROWS = 6;

export function BatteryPack({ cutaway = true }: { cutaway?: boolean }) {
  const state = useVehicleState();
  const cells = useRef<THREE.InstancedMesh>(null);
  const harness = useRef<THREE.LineSegments>(null);
  const mats = useMemo(
    () => ({
      tray: std('#3a4555', 0.6, 0.3),
      plate: std('#9fd9d2', 0.35, 0.2, { transparent: true, opacity: 0.9 }),
      module: std('#d7dee7', 0.45, 0.15),
      cell: new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.35, metalness: 0.2 }),
      bms: std('#1d3050', 0.4, 0.3),
      led: new THREE.MeshBasicMaterial({ color: COLORS.emeraldGlow, toneMapped: false }),
      lid: std('#cdd5df', 0.4, 0.4, { transparent: true, opacity: 0.35, depthWrite: false }),
      harness: new THREE.LineBasicMaterial({ color: COLORS.emerald, transparent: true, opacity: 0.6 }),
    }),
    []
  );
  const cellData = useMemo(() => {
    const list: { x: number; z: number; m: number; r: number; c: number }[] = [];
    MODULES.forEach((mod, m) => {
      for (let r = 0; r < CELL_ROWS; r++)
        for (let c = 0; c < CELL_COLS; c++) list.push({ x: mod.x - 0.11 + c * 0.073, z: mod.z - 0.27 + r * 0.108, m, r, c });
    });
    return list;
  }, []);
  const harnessGeo = useMemo(() => {
    const pts: number[] = [];
    MODULES.forEach((mod) => pts.push(A.bms[0] - 0.06, 0.37, 0, mod.x, 0.345, mod.z));
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    return g;
  }, []);

  const tmp = useMemo(() => ({ m: new THREE.Matrix4(), c: new THREE.Color(), base: new THREE.Color('#e9eef4'), em: new THREE.Color(COLORS.emeraldGlow), cool: new THREE.Color('#7fd3e6'), warm: new THREE.Color('#f0a35a'), dim: new THREE.Color('#cfd8e2') }), []);

  useFrame(({ clock }) => {
    const s = state.current;
    const mesh = cells.current;
    if (!mesh) return;
    const t = clock.elapsedTime;
    const k = clamp01(s.battery);
    cellData.forEach((d, i) => {
      if (i === 0 && !mesh.userData.init) {
        // first frame: place instances
        cellData.forEach((dd, ii) => {
          tmp.m.makeTranslation(dd.x, 0.347, dd.z);
          mesh.setMatrixAt(ii, tmp.m);
        });
        mesh.instanceMatrix.needsUpdate = true;
        mesh.userData.init = true;
      }
      let glow = 0;
      const c = tmp.c.copy(tmp.base);
      switch (s.focus) {
        case 'charging':
          glow = clamp01((Math.sin(t * 1.4) * 0.5 + 0.5) * 1.4 - (d.x + 1) * 0.35) ;
          c.lerp(tmp.em, glow);
          break;
        case 'thermal': {
          const temp = clamp01(0.25 + 0.5 * Math.exp(-((d.x - 0.35) ** 2 + (d.z - 0.2) ** 2) * 3) + 0.08 * Math.sin(t * 0.8 + d.x * 3));
          c.copy(tmp.cool).lerp(tmp.warm, temp);
          break;
        }
        case 'cells': {
          const odd = d.m === 7 && d.r === 2;
          c.copy(odd ? tmp.warm : tmp.dim);
          if (d.m === 7) c.lerp(tmp.em, odd ? 0 : 0.6 + 0.4 * Math.sin(t * 3 + d.r));
          break;
        }
        case 'power':
          glow = 0.55 + 0.45 * Math.sin(t * 2.2 - d.x * 2.5);
          c.lerp(tmp.em, glow * 0.8);
          break;
        default: // health / connected / none: a slow analytical sweep
          glow = Math.pow(clamp01(Math.sin(t * 0.9 - d.x * 2.2 - d.z) * 0.5 + 0.5), 3);
          c.lerp(tmp.em, glow * 0.9);
      }
      c.lerp(tmp.base, 1 - k);
      mesh.setColorAt(i, c);
    });
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    mats.harness.opacity = 0.15 + 0.6 * k;
    mats.led.color.setStyle(k > 0.05 ? COLORS.emeraldGlow : '#5c6b80');
  });

  return (
    <group>
      <RoundedBox args={[2.04, 0.05, 1.5]} radius={0.02} smoothness={2} position={[0, 0.205, 0]} material={mats.tray} />
      <mesh material={mats.plate} position={[0, 0.236, 0]}>
        <boxGeometry args={[1.96, 0.012, 1.42]} />
      </mesh>
      {MODULES.map((m, i) => (
        <mesh key={i} material={mats.module} position={[m.x, 0.289, m.z]}>
          <boxGeometry args={[0.3, 0.1, 0.68]} />
        </mesh>
      ))}
      <instancedMesh ref={cells} args={[undefined, undefined, cellData.length]} material={mats.cell}>
        <cylinderGeometry args={[0.03, 0.03, 0.012, 18]} />
      </instancedMesh>
      <lineSegments ref={harness} geometry={harnessGeo} material={mats.harness} />
      <group position={A.bms}>
        <RoundedBox args={[0.16, 0.05, 0.32]} radius={0.012} smoothness={2} material={mats.bms} />
        <mesh material={mats.led} position={[0.081, 0.006, 0.1]}>
          <boxGeometry args={[0.004, 0.012, 0.05]} />
        </mesh>
      </group>
      {!cutaway && (
        <mesh material={mats.lid} position={[0, 0.36, 0]}>
          <boxGeometry args={[2.02, 0.01, 1.46]} />
        </mesh>
      )}
    </group>
  );
}

/** Battery & Charging AI = software. Drawn as a hovering runtime overlay above the BMS, never as a hardware box. */
export function BatteryAIOverlay() {
  const state = useVehicleState();
  const g = useRef<THREE.Group>(null);
  const mats = useMemo(
    () => ({
      ring: new THREE.MeshBasicMaterial({ color: COLORS.emeraldGlow, transparent: true, opacity: 0, side: THREE.DoubleSide, toneMapped: false, depthWrite: false }),
      grid: new THREE.MeshBasicMaterial({ color: COLORS.emerald, transparent: true, opacity: 0, wireframe: true, depthWrite: false }),
      beam: new THREE.MeshBasicMaterial({ color: COLORS.emeraldGlow, transparent: true, opacity: 0, depthWrite: false, toneMapped: false }),
    }),
    []
  );
  useFrame(({ clock }, dt) => {
    const o = clamp01(state.current.batteryAI);
    mats.ring.opacity = 0.85 * o;
    mats.grid.opacity = 0.5 * o;
    mats.beam.opacity = 0.35 * o;
    if (g.current) {
      g.current.visible = o > 0.01;
      g.current.rotation.y += dt * 0.35;
      g.current.position.y = A.batteryAI[1] + Math.sin(clock.elapsedTime * 1.2) * 0.008;
    }
  });
  return (
    <group ref={g} position={A.batteryAI}>
      <mesh material={mats.ring} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.15, 0.162, 64]} />
      </mesh>
      <mesh material={mats.ring} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.1, 0.104, 6]} />
      </mesh>
      <mesh material={mats.grid} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.15, 6, 0]} />
      </mesh>
      <mesh material={mats.beam} position={[0, -0.08, 0]}>
        <cylinderGeometry args={[0.004, 0.004, 0.16, 8]} />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------------------------------------
 * Evo Core — proposed power unit. Exploded offsets, generation extras and per-function focus.
 * ---------------------------------------------------------------------------------------------- */
type EvoPartId = keyof typeof EVO_PARTS;

export function EvoCoreUnit() {
  const state = useVehicleState();
  const refs = useRef<Partial<Record<EvoPartId, THREE.Group | null>>>({});
  const outline = useRef<THREE.LineBasicMaterial>(null);
  const mats = useMemo(
    () => ({
      alu: std('#c6cfd9', 0.32, 0.75),
      board: std('#20365a', 0.5, 0.2),
      boardHi: std('#28477a', 0.45, 0.2),
      comp: std('#2a3442', 0.5, 0.25),
      copper: std('#c97b45', 0.3, 0.85),
      busbar: std(COLORS.tangerine, 0.35, 0.5),
      cap: std('#41536b', 0.4, 0.3),
      chip: std('#0f1826', 0.3, 0.4),
      gold: std('#d9b45a', 0.3, 0.9),
      battChip: new THREE.MeshStandardMaterial({ color: COLORS.emerald, emissive: COLORS.emerald, emissiveIntensity: 0.4, roughness: 0.4 }),
      ai: new THREE.MeshBasicMaterial({ color: COLORS.cobalt, transparent: true, opacity: 0.0, wireframe: true, depthWrite: false }),
      aiRing: new THREE.MeshBasicMaterial({ color: '#4f8dff', transparent: true, opacity: 0.0, side: THREE.DoubleSide, depthWrite: false, toneMapped: false }),
      focus: new THREE.LineBasicMaterial({ color: COLORS.tangerine, transparent: true, opacity: 0 }),
    }),
    []
  );
  const focusRefs = useRef<Partial<Record<EvoPartId, THREE.LineBasicMaterial | null>>>({});
  const gen2 = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const s = state.current;
    const e = clamp01(s.explode);
    (Object.keys(EVO_PARTS) as EvoPartId[]).forEach((id) => {
      const g = refs.current[id];
      if (!g) return;
      const p = lerp3(EVO_PARTS[id].at, EVO_PARTS[id].ex, e);
      g.position.set(p[0], p[1], p[2]);
      if (id === 'lid') g.rotation.z = -0.18 * e;
      const fm = focusRefs.current[id];
      if (fm) fm.opacity = s.focus === id ? 0.95 : 0;
    });
    mats.ai.opacity = 0.25 + 0.35 * e;
    mats.aiRing.opacity = (0.2 + 0.6 * e) * (0.75 + 0.25 * Math.sin(clock.elapsedTime * 2));
    if (refs.current.ai) refs.current.ai.visible = e > 0.15 || s.focus === 'ai';
    if (outline.current) outline.current.opacity = clamp01(s.evo) * (1 - e) * 0.9;
    if (gen2.current) gen2.current.visible = s.gen > 1.5;
  });

  const FocusEdges = ({ id }: { id: EvoPartId }) => (
    <Edges threshold={20} scale={1.04}>
      <lineBasicMaterial ref={(m) => void (focusRefs.current[id] = m)} color={COLORS.tangerine} transparent opacity={0} toneMapped={false} />
    </Edges>
  );

  return (
    <group>
      {/* housing (stays put) */}
      <group ref={(g) => void (refs.current.housing = g)}>
        <RoundedBox args={[0.56, 0.03, 0.46]} radius={0.01} smoothness={2} position={[0, 0.015, 0]} material={mats.alu}>
          <Edges threshold={20}>
            <lineBasicMaterial ref={outline} color={COLORS.tangerine} transparent opacity={0} toneMapped={false} />
          </Edges>
        </RoundedBox>
        {[
          [0.27, 0.075, 0, 0.02, 0.12, 0.46],
          [-0.27, 0.075, 0, 0.02, 0.12, 0.46],
          [0, 0.075, 0.22, 0.56, 0.12, 0.02],
          [0, 0.075, -0.22, 0.56, 0.12, 0.02],
        ].map(([x, y, z, w, h, d], i) => (
          <mesh key={i} material={mats.alu} position={[x, y, z]}>
            <boxGeometry args={[w, h, d]} />
          </mesh>
        ))}
        {[-0.12, 0.0, 0.12].map((z, i) => (
          <mesh key={i} material={mats.comp} position={[0.29, 0.08, z]}>
            <boxGeometry args={[0.03, 0.05, 0.07]} />
          </mesh>
        ))}
      </group>

      {/* OBC — onboard charger power stage */}
      <group ref={(g) => void (refs.current.obc = g)}>
        <mesh material={mats.board}>
          <boxGeometry args={[0.22, 0.012, 0.26]} />
          <FocusEdges id="obc" />
        </mesh>
        <mesh material={mats.comp} position={[-0.04, 0.04, -0.05]}>
          <boxGeometry args={[0.08, 0.07, 0.08]} />
        </mesh>
        <mesh material={mats.copper} position={[0.06, 0.035, 0.06]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.032, 0.014, 10, 24]} />
        </mesh>
        {[-0.07, -0.02, 0.03].map((x, i) => (
          <mesh key={i} material={mats.cap} position={[x, 0.03, 0.09]}>
            <cylinderGeometry args={[0.016, 0.016, 0.05, 16]} />
          </mesh>
        ))}
      </group>

      {/* DC/DC — low-voltage conversion */}
      <group ref={(g) => void (refs.current.dcdc = g)}>
        <mesh material={mats.board}>
          <boxGeometry args={[0.2, 0.012, 0.26]} />
          <FocusEdges id="dcdc" />
        </mesh>
        <mesh material={mats.copper} position={[-0.04, 0.03, -0.05]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.028, 0.012, 10, 24]} />
        </mesh>
        <mesh material={mats.comp} position={[0.05, 0.035, 0.02]}>
          <boxGeometry args={[0.07, 0.06, 0.07]} />
        </mesh>
        {[-0.05, 0.0].map((x, i) => (
          <mesh key={i} material={mats.cap} position={[x, 0.025, 0.09]}>
            <cylinderGeometry args={[0.014, 0.014, 0.04, 16]} />
          </mesh>
        ))}
      </group>

      {/* HV distribution / junction */}
      <group ref={(g) => void (refs.current.hv = g)}>
        <mesh material={mats.comp} position={[0, -0.005, 0]}>
          <boxGeometry args={[0.4, 0.01, 0.1]} />
          <FocusEdges id="hv" />
        </mesh>
        {[-0.03, 0, 0.03].map((z, i) => (
          <mesh key={i} material={mats.busbar} position={[0, 0.012, z]}>
            <boxGeometry args={[0.34, 0.012, 0.016]} />
          </mesh>
        ))}
        {[-0.12, 0.12].map((x, i) => (
          <mesh key={i} material={mats.comp} position={[x, 0.04, 0]}>
            <boxGeometry args={[0.06, 0.055, 0.06]} />
          </mesh>
        ))}
      </group>

      {/* EVCC — charging communication controller */}
      <group ref={(g) => void (refs.current.evcc = g)}>
        <mesh material={mats.boardHi}>
          <boxGeometry args={[0.1, 0.01, 0.09]} />
          <FocusEdges id="evcc" />
        </mesh>
        <mesh material={mats.chip} position={[-0.015, 0.01, 0]}>
          <boxGeometry args={[0.03, 0.008, 0.03]} />
        </mesh>
        <mesh material={mats.comp} position={[0.04, 0.015, 0]}>
          <boxGeometry args={[0.02, 0.025, 0.05]} />
        </mesh>
      </group>

      {/* Common control */}
      <group ref={(g) => void (refs.current.control = g)}>
        <mesh material={mats.boardHi}>
          <boxGeometry args={[0.48, 0.01, 0.38]} />
          <FocusEdges id="control" />
        </mesh>
        <mesh material={mats.chip} position={[0, 0.01, 0]}>
          <boxGeometry args={[0.07, 0.012, 0.07]} />
        </mesh>
        {[
          [-0.14, 0.08],
          [0.13, -0.1],
          [0.15, 0.1],
          [-0.12, -0.12],
        ].map(([x, z], i) => (
          <mesh key={i} material={mats.chip} position={[x, 0.008, z]}>
            <boxGeometry args={[0.035, 0.008, 0.025]} />
          </mesh>
        ))}
        <mesh material={mats.gold} position={[0, 0.006, 0.17]}>
          <boxGeometry args={[0.3, 0.003, 0.012]} />
        </mesh>
        <group ref={gen2}>
          <mesh material={mats.battChip} position={[-0.11, 0.012, 0]}>
            <boxGeometry args={[0.05, 0.014, 0.05]} />
          </mesh>
        </group>
      </group>

      {/* Supervisory intelligence: software, drawn as a wireframe layer above the control board */}
      <group ref={(g) => void (refs.current.ai = g)}>
        <mesh material={mats.ai} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.44, 0.34, 8, 6]} />
        </mesh>
        <mesh material={mats.aiRing} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.08, 0.088, 48]} />
        </mesh>
      </group>

      {/* Lid */}
      <group ref={(g) => void (refs.current.lid = g)}>
        <RoundedBox args={[0.58, 0.018, 0.48]} radius={0.008} smoothness={2} material={mats.alu} />
        {[-0.12, 0, 0.12].map((z, i) => (
          <mesh key={i} material={mats.alu} position={[0, 0.012, z]}>
            <boxGeometry args={[0.5, 0.008, 0.03]} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/* ------------------------------------------------------------------------------------------------
 * Reference vehicle systems (existing / partner) — neutral greys so Mathsya concepts stand out.
 * ---------------------------------------------------------------------------------------------- */
export function ReferenceParts() {
  const state = useVehicleState();
  const halo = useRef<THREE.Group>(null);
  const mats = useMemo(
    () => ({
      grey: std('#aeb9c6', 0.5, 0.3),
      radiator: std('#cfd8e2', 0.6, 0.2, { transparent: true, opacity: 0.55 }),
      dark: std('#3a4555', 0.5, 0.3),
      compute: std('#33445c', 0.4, 0.4),
      inlet: std('#26303d', 0.4, 0.3),
      fin: std('#dfe5ec', 0.3, 0.5),
      hmi: new THREE.MeshStandardMaterial({ color: '#0f1a2b', emissive: '#185adb', emissiveIntensity: 0.0, roughness: 0.2 }),
      haloRing: new THREE.MeshBasicMaterial({ color: '#3d7bff', transparent: true, opacity: 0, side: THREE.DoubleSide, toneMapped: false, depthWrite: false }),
      haloGrid: new THREE.MeshBasicMaterial({ color: COLORS.cobalt, transparent: true, opacity: 0, wireframe: true, depthWrite: false }),
    }),
    []
  );
  useFrame(({ clock }, dt) => {
    const s = state.current;
    const p = clamp01(s.pmg);
    mats.haloRing.opacity = 0.9 * p;
    mats.haloGrid.opacity = 0.45 * p;
    mats.hmi.emissiveIntensity = 0.15 + 0.6 * p;
    if (halo.current) {
      halo.current.visible = p > 0.01;
      halo.current.rotation.y += dt * 0.4;
      halo.current.position.y = A.pmg[1] + 0.16 + Math.sin(clock.elapsedTime * 1.3) * 0.006;
    }
  });
  return (
    <group>
      {/* rear drive unit: motor + inverter */}
      <mesh material={mats.grey} position={A.motor} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.42, 32]} />
      </mesh>
      <RoundedBox args={[0.3, 0.1, 0.34]} radius={0.015} smoothness={2} position={A.inverter} material={mats.dark} />
      {/* thermal: radiator + pump */}
      <mesh material={mats.radiator} position={A.radiator}>
        <boxGeometry args={[0.03, 0.22, 0.78]} />
      </mesh>
      <mesh material={mats.dark} position={A.pump} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.05, 0.05, 0.12, 20]} />
      </mesh>
      {/* 12 V low-voltage battery */}
      <RoundedBox args={[0.22, 0.16, 0.16]} radius={0.015} smoothness={2} position={A.lv} material={mats.dark} />
      {/* charge inlet on the front-left fender */}
      <group position={A.inlet} rotation={[0, 0, 0]}>{/* on the right fender, facing outward (+Z) */}
        <RoundedBox args={[0.12, 0.09, 0.03]} radius={0.012} smoothness={2} material={mats.inlet} />
        <mesh material={mats.grey} position={[0, 0, 0.018]}>
          <ringGeometry args={[0.022, 0.03, 24]} />
        </mesh>
      </group>
      {/* vehicle compute (gateway / central computer) — PMG runs here as software */}
      <RoundedBox args={[0.2, 0.05, 0.16]} radius={0.01} smoothness={2} position={A.pmg} material={mats.compute} />
      <group ref={halo} position={[A.pmg[0], A.pmg[1] + 0.16, A.pmg[2]]}>
        <mesh material={mats.haloRing} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.13, 0.14, 64]} />
        </mesh>
        <mesh material={mats.haloGrid} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.13, 8]} />
        </mesh>
      </group>
      {/* driver display */}
      <mesh material={mats.hmi} position={A.hmi} rotation={[0, -Math.PI / 2, -0.22]}>
        <boxGeometry args={[0.26, 0.085, 0.01]} />
      </mesh>
      {/* telematics unit + roof antenna */}
      <RoundedBox args={[0.16, 0.035, 0.12]} radius={0.008} smoothness={2} position={A.tcu} material={mats.compute} />
      <mesh material={mats.fin} position={A.antenna} rotation={[0, 0, -0.35]} scale={[1.6, 1, 0.35]}>
        <coneGeometry args={[0.05, 0.1, 24]} />
      </mesh>
    </group>
  );
}
