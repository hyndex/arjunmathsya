import type { ReactNode } from 'react';
import type { BatteryFocus } from '@/components/three/BatteryPackScene';

// 2.5D cutaway of a schematic battery pack (fallback for the three.js scene). World units: x = pack length,
// y = depth (toward the viewer), z = up. Front and right walls are cut low so the inside reads.

type V3 = [number, number, number];
type Part = 'modules' | 'bms' | 'current' | 'hv' | 'junction' | 'plate' | 'tsense' | 'coolant' | 'harness' | 'flag' | 'sensor' | 'lv' | 'wire';

export const VB_W = 900;
export const VB_H = 440;
const OX = 215;
const OY = 150;
export const proj = ([x, y, z]: V3): [number, number] => [OX + x * 0.97 - y * 0.489, OY + x * 0.242 + y * 0.382 - z * 0.95];
const pt = (v: V3) => proj(v).map((n) => n.toFixed(1)).join(' ');
const poly = (...vs: V3[]) => vs.map(pt).join(' ');
const line = (...vs: V3[]) => 'M' + vs.map(pt).join('L');

const HL: Record<BatteryFocus, Part[]> = {
  health: ['modules', 'bms'],
  charging: ['current', 'hv', 'junction', 'bms'],
  thermal: ['plate', 'tsense', 'coolant'],
  cells: ['harness', 'flag'],
  power: ['current', 'sensor', 'bms', 'hv'],
  connected: ['lv', 'wire', 'bms'],
};

/** Numbered callouts: 3D anchor + label offset (viewBox units). */
export const KEY: { n: number; label: string; at: V3; off: [number, number]; parts: Part[] }[] = [
  { n: 1, label: 'Tray & enclosure', at: [330, 300, 20], off: [0, 46], parts: [] },
  { n: 2, label: 'Cooling plate', at: [44, 306, 24], off: [-30, 40], parts: ['plate'] },
  { n: 3, label: 'Modules & cells', at: [330, 60, 88], off: [-24, -66], parts: ['modules', 'tsense', 'flag'] },
  { n: 4, label: 'Sensing harness', at: [420, 150, 94], off: [34, -80], parts: ['harness'] },
  { n: 5, label: 'BMS', at: [560, 64, 30], off: [36, -92], parts: ['bms', 'sensor'] },
  { n: 6, label: 'HV junction & terminals', at: [612, 240, 23], off: [52, 36], parts: ['hv', 'junction', 'current'] },
  { n: 7, label: 'Vehicle interface (LV)', at: [610, 87, 23], off: [62, 28], parts: ['lv', 'wire'] },
];
export const keyOn = (focus: BatteryFocus, n: number) => KEY[n - 1].parts.some((p) => HL[focus].includes(p));
export const balloonPos = (k: (typeof KEY)[number]) => {
  const [x, y] = proj(k.at);
  return { ax: x, ay: y, bx: x + k.off[0], by: y + k.off[1] };
};

function Box({ at: [x, y, z], size: [w, d, h], className, children }: { at: V3; size: V3; className: string; children?: ReactNode }) {
  const [x1, y1, z1] = [x + w, y + d, z + h];
  return (
    <g className={className}>
      <polygon className="f-side" points={poly([x1, y, z], [x1, y1, z], [x1, y1, z1], [x1, y, z1])} />
      <polygon className="f-front" points={poly([x, y1, z], [x1, y1, z], [x1, y1, z1], [x, y1, z1])} />
      <polygon className="f-top" points={poly([x, y, z1], [x1, y, z1], [x1, y1, z1], [x, y1, z1])} />
      {children}
    </g>
  );
}

/* ---------- Static geometry (computed once) ---------- */

const M = { w: 118, d: 122, z0: 16, z1: 88 };
const PITCH = M.w / 10;
const MODULES = [18, 160].flatMap((y, row) => [20, 146, 272, 398].map((x) => ({ x, y, row })));

function moduleDetail(x: number, y: number, row: number) {
  const { d, z0, z1 } = M;
  const k9 = Array.from({ length: 9 }, (_, k) => x + (k + 1) * PITCH);
  const cells = k9.map((cx) => line([cx, y + 3, z1], [cx, y + d - 3, z1])).join('');
  const ribs = k9.map((cx) => line([cx, y + d, z0 + 5], [cx, y + d, z1 - 5])).join('');
  const plate = (a: number, b: number, y0: number) =>
    poly([x + a * PITCH + 1.6, y0, z1], [x + (b + 1) * PITCH - 1.6, y0, z1], [x + (b + 1) * PITCH - 1.6, y0 + 10, z1], [x + a * PITCH + 1.6, y0 + 10, z1]);
  const plates = [
    ...[0, 2, 4, 6, 8].map((a) => plate(a, a + 1, y + 5)),
    ...[1, 3, 5, 7].map((a) => plate(a, a + 1, y + d - 15)),
  ];
  // Cell-voltage taps: a comb along the harness side of each module, one tick per cell.
  const cy = row === 0 ? y + d - 24 : y + 24;
  const tick = row === 0 ? 9 : -9;
  const comb =
    line([x + PITCH / 2, cy, z1], [x + M.w - PITCH / 2, cy, z1]) +
    Array.from({ length: 10 }, (_, k) => line([x + (k + 0.5) * PITCH, cy, z1], [x + (k + 0.5) * PITCH, cy + tick, z1])).join('');
  const sensors = [3, 7].map((k) => proj([x + k * PITCH, y + d / 2, z1]));
  return { cells, ribs, plates, comb, sensors };
}
const MOD_DETAIL = MODULES.map((m) => moduleDetail(m.x, m.y, m.row));

const CHANNEL = line(
  [56, 284, 16], [56, 262, 16], [500, 262, 16], [500, 222, 16], [40, 222, 16], [40, 182, 16], [500, 182, 16], [500, 142, 16],
  [40, 142, 16], [40, 102, 16], [500, 102, 16], [500, 62, 16], [40, 62, 16], [26, 62, 16], [26, 284, 16],
);
const CURRENT = line([536, 262, 60], [520, 272, 92], [24, 272, 92], [24, 28, 92], [520, 28, 92], [528, 120, 72], [536, 166, 60]);
const LOOM = line([20, 150, 94], [524, 150, 94], [540, 150, 70], [556, 116, 31]);
const TAPS = MODULES.map((m) => line([m.x + 58, 150, 94], [m.x + 58, m.row === 0 ? 136 : 164, 94])).join('');
const FLAG = (() => {
  const { x, y } = MODULES[6];
  return poly([x + 6 * PITCH, y + 3, M.z1], [x + 7 * PITCH, y + 3, M.z1], [x + 7 * PITCH, y + M.d - 3, M.z1], [x + 6 * PITCH, y + M.d - 3, M.z1]);
})();
const [WX, WY] = proj([610, 87, 23]);
export const WIRE = { d: `M${WX.toFixed(1)} ${WY.toFixed(1)}H${(WX + 34).toFixed(1)}V196H${VB_W - 14}`, labelY: 196 };
const LV_PINS = [0, 1, 2, 3].flatMap((k) => [proj([610, 76 + k * 7, 19]), proj([610, 76 + k * 7, 27])]);

const pc = (v: number, of: number) => `${((v / of) * 100).toFixed(2)}%`;

export default function BatteryCutawaySvg({ focus, label, live }: { focus: BatteryFocus; label: string; live?: boolean }) {
  const hl = (p: Part) => (HL[focus].includes(p) ? ' is-hl' : '');
  return (
    <div className="bxc-wrap" data-focus={focus} data-live={live ? '' : undefined}>
    <svg className="bxc" viewBox={`0 0 ${VB_W} ${VB_H}`} role="img" aria-label={label}>
      <defs>
        <pattern id="bxc-hatch" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="5" height="5" fill="#eef2f6" />
          <path d="M0 0V5" stroke="rgba(23,43,69,0.38)" strokeWidth="1.1" />
        </pattern>
      </defs>

      {/* Tray: floor, back and left walls at full height */}
      <Box at={[0, 0, 0]} size={[600, 300, 8]} className="bxc-tray" />
      <Box at={[0, 0, 8]} size={[600, 10, 88]} className="bxc-tray" />
      <Box at={[0, 10, 8]} size={[10, 280, 88]} className="bxc-tray" />

      {/* Cooling plate + coolant channels */}
      <g className={`bxc-plate${hl('plate')}`}>
        <Box at={[14, 14, 8]} size={[504, 272, 8]} className="bxc-plate-body" />
        <path d={CHANNEL} className="bxc-channel" />
        <path d={CHANNEL} className="bxc-flow" />
      </g>

      {/* Modules, harness and current path (lifted and ghosted when the cooling plate is in focus) */}
      <g className="bxc-upper">
        {MODULES.map((m, i) => {
          const det = MOD_DETAIL[i];
          return (
            <Box key={i} at={[m.x, m.y, M.z0]} size={[M.w, M.d, M.z1 - M.z0]} className={`bxc-mod${hl('modules')}`}>
              <path d={det.cells + det.ribs} className="bxc-mod-lines" />
              {det.plates.map((p, j) => (
                <polygon key={j} points={p} className="bxc-bus" />
              ))}
              <path d={det.comb} className={`bxc-comb${hl('harness')}`} />
              {det.sensors.map(([sx, sy], j) => (
                <circle key={j} cx={sx} cy={sy} r="2.6" className={`bxc-tsense${hl('tsense')}`} />
              ))}
              <Box at={[m.x + 48, m.row === 0 ? m.y + M.d - 14 : m.y + 4, M.z1]} size={[20, 10, 6]} className={`bxc-conn${hl('harness')}`} />
            </Box>
          );
        })}
        <polygon points={FLAG} className={`bxc-flag${hl('flag')}`} />
        <g className={`bxc-current${hl('current')}`}>
          <path d={CURRENT} className="bxc-bar" />
          <path d={CURRENT} className="bxc-flow" />
        </g>
        <g className={`bxc-harness${hl('harness')}`}>
          <path d={LOOM + TAPS} className="bxc-loom" />
        </g>
      </g>

      {/* Electronics bay */}
      <Box at={[534, 24, 8]} size={[50, 100, 22]} className={`bxc-bms${hl('bms')}`}>
        <polygon points={poly([542, 36, 30.5], [562, 36, 30.5], [562, 56, 30.5], [542, 56, 30.5])} className="bxc-chip" />
        <polygon points={poly([546, 70, 30.5], [558, 70, 30.5], [558, 82, 30.5], [546, 82, 30.5])} className="bxc-chip" />
        <polygon points={poly([566, 70, 30.5], [578, 70, 30.5], [578, 82, 30.5], [566, 82, 30.5])} className="bxc-chip" />
        <polygon points={poly([540, 106, 30.5], [578, 106, 30.5], [578, 116, 30.5], [540, 116, 30.5])} className="bxc-chip bxc-chip--hdr" />
      </Box>
      <Box at={[518, 76, 74]} size={[14, 16, 10]} className={`bxc-sensor${hl('sensor')}`} />
      <Box at={[534, 150, 8]} size={[50, 128, 52]} className={`bxc-junction${hl('junction')}`}>
        <Box at={[544, 168, 60]} size={[18, 24, 8]} className="bxc-junction-part" />
        <Box at={[544, 222, 60]} size={[18, 24, 8]} className="bxc-junction-part" />
      </Box>

      {/* Cut-down front and right walls, with what is mounted on their outer faces */}
      <Box at={[590, 10, 8]} size={[10, 280, 32]} className="bxc-tray bxc-cut" />
      <Box at={[600, 196, 16]} size={[12, 14, 14]} className={`bxc-hv${hl('hv')}`} />
      <Box at={[600, 236, 16]} size={[12, 14, 14]} className={`bxc-hv${hl('hv')}`} />
      <Box at={[600, 70, 14]} size={[10, 34, 18]} className={`bxc-lv${hl('lv')}`} />
      {LV_PINS.map(([px, py], i) => (
        <circle key={i} cx={px} cy={py} r="1.1" className="bxc-pin" />
      ))}
      <Box at={[0, 290, 8]} size={[600, 10, 32]} className="bxc-tray bxc-cut" />
      <Box at={[26, 300, 18]} size={[14, 12, 12]} className={`bxc-coolant${hl('coolant')}`} />
      <Box at={[50, 300, 18]} size={[14, 12, 12]} className={`bxc-coolant${hl('coolant')}`} />

      {/* Off-pack interface (connected focus only) */}
      <g className={`bxc-wire${hl('wire')}`}>
        <path d={WIRE.d} className="bxc-wire-line" />
        <path d={WIRE.d} className="bxc-flow" />
        <path d={`M${VB_W - 22} ${WIRE.labelY - 5}L${VB_W - 14} ${WIRE.labelY}L${VB_W - 22} ${WIRE.labelY + 5}`} className="bxc-wire-line" />
      </g>

      {/* Callout leaders */}
      {KEY.map((k) => {
        const b = balloonPos(k);
        return <line key={k.n} x1={b.ax} y1={b.ay} x2={b.bx} y2={b.by} className={`bxc-leader${keyOn(focus, k.n) ? ' is-hl' : ''}`} />;
      })}
    </svg>
      {KEY.map((k) => {
        const b = balloonPos(k);
        return (
          <span key={k.n} className={`bxc-label${keyOn(focus, k.n) ? ' is-hl' : ''}`} style={{ left: `clamp(54px, ${pc(b.bx, VB_W)}, calc(100% - 54px))`, top: pc(b.by, VB_H) }} aria-hidden="true">
            {k.label}
          </span>
        );
      })}
      <span className={`bxc-wire-label${hl('wire')}`} style={{ top: pc(WIRE.labelY, VB_H) }} aria-hidden="true">
        <b>To PMG · Evo Core</b> approved interfaces
      </span>
    </div>
  );
}
