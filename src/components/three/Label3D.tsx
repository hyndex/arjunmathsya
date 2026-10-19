import { createContext, useContext, useRef, type RefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import type { LabelDef } from './labels';
import { useVehicleState } from './state';

/** Optional stable DOM target for labels (avoids drei re-creating each label root on first render). */
export const LabelPortal = createContext<RefObject<HTMLElement | null> | undefined>(undefined);

const Z_RANGE: [number, number] = [30, 0];
const HTML_STYLE = { pointerEvents: 'none' as const };
const DOT: Record<string, string> = { battery: 'var(--p-battery)', evo: 'var(--p-evo)', pmg: 'var(--p-pmg)' };

/** A technical annotation pinned to a 3D anchor. Pure DOM, so it stays crisp and readable. */
export default function Label3D({ def, visible, onSelect, selected = false }: { def: LabelDef; visible: boolean; onSelect?: () => void; selected?: boolean }) {
  const state = useVehicleState();
  const portal = useContext(LabelPortal);
  const group = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!group.current) return;
    const p = typeof def.at === 'function' ? def.at(state.current) : def.at;
    group.current.position.set(p[0], p[1], p[2]);
  });
  const color = def.product ? DOT[def.product] : def.kind === 'interface' ? 'var(--c-cobalt)' : 'var(--c-slate-2)';
  const Tag = onSelect ? 'button' : 'div';
  return (
    <group ref={group}>
      <Html zIndexRange={Z_RANGE} style={HTML_STYLE} portal={portal as RefObject<HTMLElement> | undefined}>
        <Tag
          type={onSelect ? 'button' : undefined}
          onClick={onSelect}
          aria-pressed={onSelect ? selected : undefined}
          className={`lbl3d lbl3d--${def.kind} ${def.side === 'left' ? 'lbl3d--left' : ''} ${def.big ? 'lbl3d--big' : ''} ${visible ? 'is-on' : ''} ${selected ? 'is-selected' : ''}`}
          style={{ '--lbl': color, pointerEvents: onSelect && visible ? 'auto' : 'none' } as React.CSSProperties}
          tabIndex={onSelect && visible ? 0 : -1}
          aria-hidden={onSelect ? undefined : true}
        >
          <span className="lbl3d-dot" />
          <span className="lbl3d-line" />
          <span className="lbl3d-text">
            <strong>{def.text}</strong>
            {def.sub && <small>{def.sub}</small>}
          </span>
        </Tag>
      </Html>
    </group>
  );
}
