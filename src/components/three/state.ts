import { createContext, useContext } from 'react';

/**
 * Mutable visual state read every frame by the 3D parts (no React re-renders).
 * Story mode writes interpolated keyframes into it; Explorer mode damps toward targets.
 */
export type VehicleState = {
  body: number; // paint opacity 1 = solid
  xray: number; // ghost outline visibility
  glass: number;
  wheels: number;
  systems: number; // internal systems visible
  battery: number; // battery emphasis (emerald)
  batteryAI: number; // Battery AI runtime overlay
  evo: number; // Evo Core emphasis (tangerine)
  explode: number; // Evo Core exploded view 0..1
  gen: number; // 1..3 Evo Core generation highlight
  network: number; // PMG vehicle network
  pmg: number; // PMG compute emphasis
  cloud: number; // optional cloud layer
  online: number; // 1 connected, 0 offline (cloud links)
  thermal: number; // thermal loop emphasis
  hv: number; // high-voltage path emphasis
  focus: string | null; // highlighted part id
  pulse: number; // data pulse intensity
};

export const createState = (p: Partial<VehicleState> = {}): VehicleState => ({
  body: 1,
  xray: 0,
  glass: 1,
  wheels: 1,
  systems: 0,
  battery: 0,
  batteryAI: 0,
  evo: 0,
  explode: 0,
  gen: 1,
  network: 0,
  pmg: 0,
  cloud: 0,
  online: 1,
  thermal: 0,
  hv: 0,
  focus: null,
  pulse: 0,
  ...p,
});

const NUM_KEYS = ['body', 'xray', 'glass', 'wheels', 'systems', 'battery', 'batteryAI', 'evo', 'explode', 'gen', 'network', 'pmg', 'cloud', 'online', 'thermal', 'hv', 'pulse'] as const;

export function lerpState(a: VehicleState, b: VehicleState, t: number, out: VehicleState) {
  for (const k of NUM_KEYS) out[k] = a[k] + (b[k] - a[k]) * t;
  out.focus = t < 0.5 ? a.focus : b.focus;
  return out;
}

/** Frame-rate independent damping of `cur` toward `target`. */
export function dampState(cur: VehicleState, target: VehicleState, lambda: number, dt: number) {
  const f = 1 - Math.exp(-lambda * dt);
  for (const k of NUM_KEYS) cur[k] += (target[k] - cur[k]) * f;
  cur.focus = target.focus;
}

export const StateContext = createContext<{ current: VehicleState }>({ current: createState() });
export const useVehicleState = () => useContext(StateContext);

/** Shared palette for 3D (sRGB hex; three converts). */
export const COLORS = {
  paint: '#dfe5ec',
  ink: '#172b45',
  slate: '#55667a',
  cobalt: '#185adb',
  emerald: '#087f6b',
  emeraldGlow: '#2bd4a9',
  tangerine: '#f07831',
  aqua: '#85ddd3',
  glass: '#1b2638',
  tyre: '#1c222b',
  dark: '#2a3442',
  alu: '#c3ccd6',
  copper: '#c87a46',
  hv: '#f07831',
};
