import { Environment, Lightformer, Shadow } from '@react-three/drei';
import { CAR } from './anchors';

/**
 * Bright automotive studio: a procedural light-box environment (no HDR download) with long strip lights
 * that draw clean reflection lines along the body, a cool blue fill, and soft blue-tinted floor shadows.
 * Shadows are drei <Shadow> gradient blobs (ContactShadows renders nothing with three r186 + drei 10.7).
 */
export default function Studio({
  shadows = true,
  shadowY = 0.002,
  footprint = 'car',
  unitSize = [1.3, 1.1],
  unitAt = [0, 0],
}: {
  shadows?: boolean;
  shadowY?: number;
  footprint?: 'car' | 'unit';
  unitSize?: [number, number];
  unitAt?: [number, number]; // x, z of the isolated unit
}) {
  return (
    <>
      <ambientLight intensity={0.55} color="#f2f6ff" />
      <directionalLight position={[4, 7, 5]} intensity={1.35} color="#ffffff" />
      <directionalLight position={[-5, 3, -4]} intensity={0.45} color="#cfe0ff" />
      <Environment resolution={256} frames={1}>
        <color attach="background" args={['#c9d3df']} />
        {/* overhead soft box */}
        <Lightformer form="rect" intensity={2.4} position={[0, 7, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[14, 7, 1]} color="#ffffff" />
        {/* long strip lights → crisp reflection lines on paint and glass */}
        <Lightformer form="rect" intensity={4} position={[0, 3.2, 7]} rotation={[0, Math.PI, 0]} scale={[16, 0.45, 1]} color="#ffffff" />
        <Lightformer form="rect" intensity={3} position={[0, 1.6, -7]} scale={[16, 0.35, 1]} color="#ffffff" />
        <Lightformer form="rect" intensity={2.2} position={[8, 2.2, 0]} rotation={[0, -Math.PI / 2, 0]} scale={[10, 0.6, 1]} color="#ffffff" />
        <Lightformer form="rect" intensity={1.6} position={[-8, 1.4, 0]} rotation={[0, Math.PI / 2, 0]} scale={[10, 2.4, 1]} color="#bcd3ff" />
        {/* warm kicker for the pearl coat */}
        <Lightformer form="circle" intensity={1.4} position={[-3, 4, 5]} scale={[3, 3, 1]} color="#fff1e2" />
        {/* darker studio floor: gives the lower body a defined horizon line */}
        <Lightformer form="rect" intensity={1} position={[0, -1.6, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[30, 30, 1]} color="#7a8698" />
        <Lightformer form="rect" intensity={0.6} position={[0, 0.2, 9]} rotation={[0, Math.PI, 0]} scale={[30, 1.2, 1]} color="#6c7a8f" />
      </Environment>
      {shadows && footprint === 'car' && (
        <group position={[0, shadowY, 0]}>
          {/* broad ambient-occlusion pool under the body */}
          <Shadow position={[(CAR.nose + CAR.tail) / 2, 0, 0]} rotation-x={-Math.PI / 2} scale={[6.1, 3.3, 1]} color="#14305e" opacity={0.4} colorStop={0} fog={false} />
          {/* tighter contact patches where the tyres meet the floor */}
          {[CAR.axleFront, CAR.axleRear].flatMap((x) =>
            [CAR.track, -CAR.track].map((z) => (
              <Shadow key={`${x}${z}`} position={[x, 0.001, z]} rotation-x={-Math.PI / 2} scale={[1.05, 0.55, 1]} color="#0c1f3d" opacity={0.55} colorStop={0} fog={false} />
            ))
          )}
        </group>
      )}
      {shadows && footprint === 'unit' && <Shadow position={[unitAt[0], shadowY, unitAt[1]]} rotation-x={-Math.PI / 2} scale={[unitSize[0], unitSize[1], 1]} color="#14305e" opacity={0.3} colorStop={0} fog={false} />}
    </>
  );
}
