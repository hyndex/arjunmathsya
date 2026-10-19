import { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { CAR } from './anchors';
import { COLORS, useVehicleState } from './state';

// Body: "Car Concept" by Eric Chadwick, © 2024 Darmstadt Graphics Group GmbH, CC BY 4.0
// (https://creativecommons.org/licenses/by/4.0/). Modified for this site by scripts/prepare-car-model.mjs:
// logos removed, pearl paint baked, engine block and wipers removed, compressed (Meshopt + WebP).
export const MODEL_URL = '/models/concept-ev.glb';
const WHEEL_MATERIALS = new Set(['Tireside', 'Tiretread', 'Rim1', 'Rim2', 'Brake', 'Disc']);

/** View-dependent rim shader: the "x-ray" ghost of the body used in technical views. */
export function makeGhostMaterial(color = COLORS.cobalt) {
  return new THREE.ShaderMaterial({
    uniforms: { uColor: { value: new THREE.Color(color) }, uOpacity: { value: 0 }, uPower: { value: 2.2 } },
    vertexShader: /* glsl */ `
      varying vec3 vN; varying vec3 vV;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vN = normalize(normalMatrix * normal);
        vV = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor; uniform float uOpacity; uniform float uPower;
      varying vec3 vN; varying vec3 vV;
      void main() {
        float f = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), uPower);
        gl_FragColor = vec4(uColor, (0.03 + f * 0.8) * uOpacity);
        #include <colorspace_fragment>
      }`,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
}

const setFade = (m: THREE.Material, o: number) => {
  m.opacity = o;
  const t = o < 0.995;
  if (m.transparent !== t) {
    m.transparent = t;
    m.depthWrite = !t;
    m.needsUpdate = true;
  }
  m.visible = o > 0.004;
};

type Prepared = {
  root: THREE.Group;
  body: Set<THREE.Material>;
  wheels: Set<THREE.Material>;
  glass: THREE.MeshPhysicalMaterial;
  ghost: THREE.ShaderMaterial;
  ghostGlass: THREE.ShaderMaterial;
};

/** Studio paint: restrained pearl white (Paint 1) with graphite accents (Paint 2) instead of the source's holographic sheen. */
function tunePaint(m: THREE.MeshStandardMaterial) {
  if (!(m instanceof THREE.MeshPhysicalMaterial)) return;
  if (m.name === 'Paint 1 Pearl') {
    m.color.set('#eef1f5');
    m.metalness = 0.42;
    m.roughness = 0.22;
    m.clearcoat = 1;
    m.clearcoatRoughness = 0.035;
    m.iridescence = 0.1;
    m.iridescenceIOR = 1.3;
    m.iridescenceThicknessMap = null;
    m.iridescenceThicknessRange = [220, 380];
    m.envMapIntensity = 1.1;
    m.needsUpdate = true;
  } else if (m.name === 'Paint 2 Pearl') {
    m.color.set('#1c2431');
    m.metalness = 0.55;
    m.roughness = 0.3;
    m.clearcoat = 1;
    m.clearcoatRoughness = 0.05;
    m.iridescence = 0;
    m.iridescenceThicknessMap = null;
    m.envMapIntensity = 1.2;
    m.needsUpdate = true;
  }
}

/** Places the model in the vehicle frame and sorts its materials into body / wheels / glass layers. */
function prepare(scene: THREE.Group): Prepared {
  const glass = new THREE.MeshPhysicalMaterial({ color: '#0f1724', metalness: 0.3, roughness: 0.04, clearcoat: 1, clearcoatRoughness: 0.02, envMapIntensity: 2, side: THREE.DoubleSide });
  const ghost = makeGhostMaterial(COLORS.cobalt);
  const ghostGlass = makeGhostMaterial(COLORS.slate);
  const body = new Set<THREE.Material>();
  const wheels = new Set<THREE.Material>();
  const overlays: [THREE.Mesh, THREE.Material][] = [];

  scene.traverse((o) => {
    if (!(o instanceof THREE.Mesh)) return;
    const m = o.material as THREE.MeshStandardMaterial;
    const isGlass = m.name === 'Glass';
    if (isGlass) o.material = glass;
    else if (WHEEL_MATERIALS.has(m.name)) wheels.add(m);
    else {
      body.add(m);
      tunePaint(m);
    }
    // x-ray outline only for the outer shell (the interior stays hidden in technical views)
    let named: THREE.Object3D | null = o;
    while (named && !named.name) named = named.parent;
    if (named?.name.startsWith('Body')) overlays.push([o, isGlass ? ghostGlass : ghost]);
  });
  for (const [mesh, mat] of overlays) {
    const g = new THREE.Mesh(mesh.geometry, mat);
    g.renderOrder = 5;
    g.raycast = () => {};
    mesh.add(g);
  }

  const root = new THREE.Group();
  scene.rotation.y = Math.PI / 2; // model front (+Z) → frame front (+X)
  scene.scale.setScalar(CAR.scale);
  scene.position.x = -CAR.modelAxleMid * CAR.scale;
  root.add(scene);
  return { root, body, wheels, glass, ghost, ghostGlass };
}

/** Pearl-white schematic concept vehicle. Each layer's opacity follows the shared VehicleState. */
export default function Vehicle() {
  const state = useVehicleState();
  const { scene } = useGLTF(MODEL_URL, false, true); // Meshopt-compressed; no Draco (avoids a third-party decoder download)
  const v = useMemo(() => prepare(scene), [scene]);

  useFrame(() => {
    const s = state.current;
    for (const m of v.body) setFade(m, s.body);
    for (const m of v.wheels) setFade(m, s.wheels);
    setFade(v.glass, s.glass * s.body);
    v.ghost.uniforms.uOpacity.value = s.xray;
    v.ghost.visible = s.xray > 0.004;
    v.ghostGlass.uniforms.uOpacity.value = s.xray * 0.8;
    v.ghostGlass.visible = s.xray > 0.004;
  });

  return <primitive object={v.root} />;
}
