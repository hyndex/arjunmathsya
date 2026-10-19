import type { TraceKind } from '@/data/battery';

// Deterministic, illustrative signal shapes (not measured data). Every mark is a line, so a trace can be
// stretched horizontally (preserveAspectRatio="none" + non-scaling-stroke) without distorting.
// One synthetic timeline: drive (0.04–0.48) → rest → charge (0.56–0.9) → parked.

export type TraceLayer = { d: string; role: 'main' | 'ghost' | 'limit' | 'marker' };

export const TRACE_W = 300;
export const TRACE_H = 44;
const PAD = 6;
const y = (v: number) => +(TRACE_H - PAD - Math.min(1, Math.max(0, v)) * (TRACE_H - 2 * PAD)).toFixed(2);
const x = (t: number) => +(t * TRACE_W).toFixed(2);

const curve = (fn: (t: number) => number, n = 150) =>
  Array.from({ length: n + 1 }, (_, i) => {
    const t = i / n;
    return `${i ? 'L' : 'M'}${x(t)} ${y(fn(t))}`;
  }).join('');

/** Step function from [t, v] breakpoints (each value holds until the next t). */
const steps = (pts: [number, number][]) =>
  pts.map(([t, v], i) => (i ? `H${x(t)}V${y(v)}` : `M${x(t)} ${y(v)}`)).join('') + `H${TRACE_W}`;

const bump = (t: number, c: number, w: number) => Math.exp(-(((t - c) / w) ** 2));
const rise = (t: number, from: number, k: number) => (t > from ? 1 - Math.exp(-(t - from) * k) : 0);
const ripple = (t: number) => 0.008 * Math.sin(t * 173) + 0.006 * Math.sin(t * 61 + 1.3);

const DRIVE_PULSES = [0.09, 0.16, 0.22, 0.29, 0.35, 0.42];

const voltage = (t: number, offset = 0, drift = 0) => {
  const drive = t < 0.5 ? 0.64 - 0.2 * (t / 0.5) : 0.44;
  const sag = t < 0.48 ? DRIVE_PULSES.reduce((s, c) => s + 0.1 * bump(t, c, 0.014), 0) : 0;
  const charge = 0.4 * rise(t, 0.56, 6.5) - (t > 0.9 ? 0.04 * rise(t, 0.9, 20) : 0);
  return drive - sag + charge + ripple(t) + offset - drift * t * t;
};

const temperature = (t: number) => {
  const drive = 0.34 * rise(t, 0.04, 5.5);
  const rest = t > 0.48 ? -0.08 * rise(t, 0.48, 18) : 0;
  const charge = 0.2 * rise(t, 0.56, 6);
  const cool = t > 0.9 ? -0.22 * rise(t, 0.9, 14) : 0;
  return 0.22 + drive + rest + charge + cool + ripple(t) * 0.5;
};

const soc = (t: number) => {
  if (t < 0.04) return 0.72;
  if (t < 0.48) return 0.72 - 0.34 * ((t - 0.04) / 0.44);
  if (t < 0.56) return 0.38;
  if (t < 0.9) return 0.38 + 0.5 * (1 - Math.exp(-(t - 0.56) * 4.2)) / (1 - Math.exp(-0.34 * 4.2));
  return 0.88;
};

const CURRENT: [number, number][] = [
  [0, 0.5], [0.04, 0.3], [0.08, 0.18], [0.12, 0.34], [0.15, 0.22], [0.19, 0.64], [0.22, 0.26], [0.27, 0.12],
  [0.31, 0.36], [0.34, 0.6], [0.37, 0.2], [0.42, 0.3], [0.46, 0.5], [0.56, 0.86], [0.74, 0.8], [0.8, 0.72],
  [0.85, 0.62], [0.9, 0.5],
];

export function trace(kind: TraceKind): TraceLayer[] {
  switch (kind) {
    case 'voltage':
      return [{ d: curve((t) => voltage(t)), role: 'main' }];
    case 'current':
      return [
        { d: `M0 ${y(0.5)}H${TRACE_W}`, role: 'ghost' },
        { d: steps(CURRENT), role: 'main' },
      ];
    case 'temperature':
      return [{ d: curve(temperature), role: 'main' }];
    case 'soc':
      return [{ d: curve(soc, 90), role: 'main' }];
    case 'ambient':
      return [{ d: curve((t) => 0.46 + 0.2 * Math.sin(Math.PI * 2 * (t * 1.05 - 0.2)) + ripple(t) * 0.4), role: 'main' }];
    case 'history': {
      // Charge sessions over past weeks: one vertical mark per session, height = energy added.
      const h = [0.5, 0, 0.8, 0, 0, 0.35, 0.6, 0, 0.9, 0, 0.4, 0, 0.7, 0.3, 0, 0, 0.85, 0, 0.5, 0.45, 0, 0.75, 0, 0.3, 0, 0.95, 0, 0.6];
      const d = h.map((v, i) => (v ? `M${x((i + 0.5) / h.length)} ${y(0)}V${y(v)}` : '')).join('');
      return [
        { d: `M0 ${y(0)}H${TRACE_W}`, role: 'ghost' },
        { d, role: 'main' },
      ];
    }
    case 'limit':
      return [
        { d: curve((t) => (t > 0.56 && t < 0.9 ? Math.min(0.62, 0.86 - 0.18 * rise(t, 0.6, 3)) - 0.06 : 0.04), 90), role: 'ghost' },
        { d: steps([[0, 0.86], [0.3, 0.7], [0.62, 0.62], [0.78, 0.74], [0.9, 0.86]]), role: 'main' },
      ];
    case 'session':
      return [
        { d: steps([[0, 0.12], [0.5, 0.12], [0.56, 0.82], [0.86, 0.48]]), role: 'main' },
        { d: `M${x(0.94)} 2V${TRACE_H - 2}`, role: 'marker' },
      ];
    case 'cells': {
      const offsets = [0.035, 0.015, -0.005, -0.025];
      return [
        ...offsets.map((o) => ({ d: curve((t) => voltage(t, o) * 0.9 + 0.05), role: 'ghost' as const })),
        { d: curve((t) => voltage(t, 0.005, 0.22) * 0.9 + 0.05), role: 'main' },
      ];
    }
    case 'envelope':
      return [
        { d: steps([[0, 0.92], [0.3, 0.84], [0.62, 0.8], [0.9, 0.92]]), role: 'limit' },
        { d: steps([[0, 0.06], [0.24, 0.14], [0.5, 0.08]]), role: 'limit' },
        { d: steps(CURRENT.map(([t, v]) => [t, 0.12 + (v - 0.1) * 0.82] as [number, number])), role: 'main' },
      ];
    case 'events': {
      const at = [0.12, 0.3, 0.47, 0.64, 0.82];
      return [
        { d: `M0 ${y(0.5)}H${TRACE_W}`, role: 'ghost' },
        { d: at.map((t) => `M${x(t)} ${y(0.2)}V${y(0.8)}`).join(''), role: 'main' },
      ];
    }
    case 'intent':
      return [
        { d: `M0 ${y(0.2)}H${TRACE_W}`, role: 'ghost' },
        { d: `M${x(0.94)} 2V${TRACE_H - 2}`, role: 'marker' },
        { d: `M${x(0.6)} ${y(0.2)}V${y(0.62)}H${x(0.94)}`, role: 'main' },
      ];
    case 'steps':
      return [{ d: steps([[0, 0.7], [0.48, 0.3], [0.56, 0.55], [0.86, 0.3], [0.94, 0.75]]), role: 'main' }];
  }
}
