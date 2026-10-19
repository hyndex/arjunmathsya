import { lazy, Suspense, useEffect, useState, type ReactNode } from 'react';
import Guard from './Guard';
import { canRender3D } from './webgl';
import type { BatteryFocus } from './BatteryPackScene';
import type { EvoFocus } from './EvoCoreScene';

// three.js is only downloaded when one of these mounts and 3D can render; otherwise `fallback` renders.
// Any failure (download, GPU, lost context) also lands on `fallback`.
const BatteryPackScene = lazy(() => import('./BatteryPackScene'));
const EvoCoreScene = lazy(() => import('./EvoCoreScene'));

function use3D() {
  const [ok, setOk] = useState<boolean | null>(null);
  useEffect(() => setOk(canRender3D()), []);
  return [ok === true, () => setOk(false)] as const;
}

export function Battery3D(props: { focus: BatteryFocus; className?: string; fallback: ReactNode; label?: string }) {
  const [ok, fail] = use3D();
  if (!ok) return <>{props.fallback}</>;
  return (
    <Guard fallback={props.fallback}>
      <Suspense fallback={props.fallback}>
        <BatteryPackScene focus={props.focus} className={props.className} label={props.label} onLost={fail} />
      </Suspense>
    </Guard>
  );
}

export function Evo3D(props: { generation: 1 | 2 | 3; explode: number; focus?: EvoFocus | null; className?: string; fallback: ReactNode; label?: string }) {
  const [ok, fail] = use3D();
  if (!ok) return <>{props.fallback}</>;
  return (
    <Guard fallback={props.fallback}>
      <Suspense fallback={props.fallback}>
        <EvoCoreScene generation={props.generation} explode={props.explode} focus={props.focus ?? null} className={props.className} label={props.label} onLost={fail} />
      </Suspense>
    </Guard>
  );
}
