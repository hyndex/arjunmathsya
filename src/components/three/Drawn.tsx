import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

/**
 * Place inside the same <Suspense> as <Vehicle />: it mounts only once the model has loaded, and calls `onDrawn`
 * after the car has rendered a few frames — the moment a still image standing in for the 3D view may go.
 */
export default function Drawn({ onDrawn }: { onDrawn: () => void }) {
  const frames = useRef(0);
  useFrame(() => {
    if (frames.current < 3 && ++frames.current === 3) onDrawn();
  });
  return null;
}
