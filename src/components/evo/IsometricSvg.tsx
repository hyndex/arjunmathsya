import type { ReactNode } from 'react';
import type { EvoFocus } from '@/components/three/EvoCoreScene';
import type { Layer } from '@/data/evo';

// Isometric exploded drawing of the proposed Gen 1 Evo Core assembly (fallback for the 3D scene).
// Units are abstract drawing units — no dimensions, ratings or real geometry are implied.

const C = 0.8660254;
const S = 0.42; // slightly flatter than true isometric: thinner slabs, clearer gaps
type V3 = [number, number, number];
const iso = (x: number, y: number, z: number): [number, number] => [(x - y) * C, (x + y) * S - z];
const pts = (...p: V3[]) => p.map(([x, y, z]) => iso(x, y, z).map((n) => n.toFixed(1)).join(',')).join(' ');
const clamp = (v: number) => Math.min(1, Math.max(0, v));

/** cubic-bezier(0.7, 0, 0.18, 1) = --ease-mech: slow release, fast travel, decisive stop. */
const bez = (a: number, b: number) => (u: number) => 3 * a * u * (1 - u) ** 2 + 3 * b * u * u * (1 - u) + u ** 3;
const bx = bez(0.7, 0.18);
const by = bez(0, 1);
export function mech(t: number) {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  let lo = 0;
  let hi = 1;
  let u = t;
  for (let i = 0; i < 18; i++) {
    u = (lo + hi) / 2;
    if (bx(u) < t) lo = u;
    else hi = u;
  }
  return by(u);
}
const win = (e: number, a: number, b: number) => mech(clamp((e - a) / (b - a)));
const fade = (e: number, a: number, b: number) => clamp((e - a) / (b - a));

type Shade = { top: string; left: string; right: string };
const LINE = 'rgba(23,43,69,.45)';

/** Solid box: +x face (right), +y face (left), top. */
function Box({ b, s, stroke = LINE, sw = 0.8, dash }: { b: number[]; s: Shade; stroke?: string; sw?: number; dash?: string }) {
  const [x, y, z, w, d, h] = b;
  const X = x + w;
  const Y = y + d;
  const Z = z + h;
  const p = { fill: 'none', stroke, strokeWidth: sw, strokeLinejoin: 'round' as const, strokeDasharray: dash };
  return (
    <>
      <polygon points={pts([X, y, z], [X, Y, z], [X, Y, Z], [X, y, Z])} {...p} fill={s.right} />
      <polygon points={pts([x, Y, z], [X, Y, z], [X, Y, Z], [x, Y, Z])} {...p} fill={s.left} />
      <polygon points={pts([x, y, Z], [X, y, Z], [X, Y, Z], [x, Y, Z])} {...p} fill={s.top} />
    </>
  );
}

/** Text printed on a top face, reading along +x. */
function TopText({ x, y, z, size = 11, children, fill = 'currentColor', weight = 600 }: { x: number; y: number; z: number; size?: number; children: ReactNode; fill?: string; weight?: number }) {
  const [ox, oy] = iso(x, y, z);
  return (
    <text transform={`matrix(${C} ${S} ${-C} ${S} ${ox.toFixed(1)} ${oy.toFixed(1)})`} fontSize={size} fill={fill} fontWeight={weight} className="iso-print">
      {children}
    </text>
  );
}

const SH = {
  rim: { top: '#efe4d6', left: '#e2d3c1', right: '#d3c0aa' },
  lid: { top: '#f8f1e7', left: '#e9dccb', right: '#dccab5' },
  stage: { top: '#fbdcc4', left: '#f3bf98', right: '#e69c69' },
  stageOn: { top: '#f6a46f', left: '#ea8448', right: '#d06628' },
  ivory: { top: '#fff7ec', left: '#f1e3d0', right: '#e3d0b8' },
  dark: { top: '#2b4160', left: '#22364f', right: '#1a2b42' },
  pcb: { top: '#24426a', left: '#1b3352', right: '#152a45' },
  pcbOn: { top: '#2f5a8f', left: '#234873', right: '#1b3a5e' },
  chip: { top: '#0f1f33', left: '#0b1726', right: '#08111d' },
  copper: { top: '#f07831', left: '#c4581c', right: '#a8481a' },
};

type PortId = 'hvbatt' | 'charge' | 'lv' | 'cooling' | 'signal';
const PORTS: { id: PortId; face: 'x' | 'y'; at: number; label: string[] }[] = [
  { id: 'hvbatt', face: 'y', at: 95, label: ['HV battery', '& HV loads'] },
  { id: 'charge', face: 'y', at: 238, label: ['Charge port', 'AC supply · station'] },
  { id: 'lv', face: 'x', at: 42, label: ['LV network'] },
  { id: 'cooling', face: 'x', at: 112, label: ['Vehicle cooling'] },
  { id: 'signal', face: 'x', at: 172, label: ['Vehicle network', 'BMS · PMG · diagnostics'] },
];
const PORTS_FOR: Record<EvoFocus, PortId[]> = {
  obc: ['charge', 'signal'],
  dcdc: ['lv'],
  evcc: ['charge'],
  hv: ['hvbatt'],
  control: ['signal', 'cooling'],
  ai: ['signal'],
};
// Supervisory plane: smaller than the board, anchored over the shared controller.
const AI = { x0: 90, y0: 50, x1: 230, y1: 150 };

export default function IsometricSvg({
  explode,
  focus = null,
  live = true,
  compact = false,
  label,
}: {
  explode: number;
  focus?: EvoFocus | null;
  live?: boolean;
  compact?: boolean;
  label?: string;
}) {
  const e = clamp(explode);
  const k = compact ? 0.84 : 1; // phones: a tighter stack so the drawing can fill the width
  // Staged separation along z: the lid releases first, the housing settles last; each part stops decisively.
  const dz = {
    lid: win(e, 0, 0.45) * 408 * k,
    ai: win(e, 0.1, 0.55) * 288 * k,
    control: win(e, 0.18, 0.65) * 210 * k,
    hv: win(e, 0.3, 0.8) * 40 * k,
    obc: win(e, 0.33, 0.83) * 52 * k,
    dcdc: win(e, 0.36, 0.86) * 52 * k,
    evcc: win(e, 0.4, 0.9) * 64 * k,
    tray: -win(e, 0.45, 1) * 40 * k,
  };
  const links = fade(e, 0.55, 0.8);
  const notes = fade(e, 0.62, 0.86);
  const plane = fade(e, 0.08, 0.3);

  // Fit the current extent: the closed unit is drawn large, the camera pulls back as parts separate.
  const vb = compact ? { x: -235, w: 545 } : { x: -330, w: 740 };
  const VH = compact ? 700 : 820;
  const VY = compact ? -450 : -520;
  const top = -(58 + dz.lid);
  const bottom = 500 * S - dz.tray + 34 * links;
  const sc = Math.min(1.5, (VH - 40) / (bottom - top));
  const cx = vb.x + vb.w / 2;
  const shift = `translate(${cx} ${VY + VH / 2}) scale(${sc.toFixed(3)}) translate(-43 ${(-(top + bottom) / 2).toFixed(1)})`;

  const dim = (id: EvoFocus) => (focus && focus !== id ? 0.3 : 1);
  const frame = focus ? 0.3 : 1;
  const on = (id: EvoFocus) => focus === id;
  const portOn = (p: PortId) => !focus || PORTS_FOR[focus].includes(p);

  const zt = dz.tray;
  const T = 8; // wall
  const cbZ = 38 + dz.control;
  const aiZ = 44 + dz.ai;
  const parts: { id: EvoFocus; cx: number; cy: number; top: number }[] = [
    { id: 'obc', cx: 95, cy: 70, top: 38 + dz.obc },
    { id: 'dcdc', cx: 232, cy: 70, top: 34 + dz.dcdc },
    { id: 'hv', cx: 95, cy: 160, top: 26 + dz.hv },
    { id: 'evcc', cx: 232, cy: 160, top: 14 + dz.evcc },
  ];

  // Callout balloons (numbers match the parts list beside the drawing)
  const col = compact ? { l: -195, r: 280 } : { l: -250, r: 330 };
  const R = compact ? 19 : 15;
  const balloons: { id: EvoFocus; n: string; code: string; side: 'l' | 'r'; a: [number, number] }[] = [
    { id: 'ai', n: '6', code: 'AI', side: 'l', a: iso(160, 100, aiZ) },
    { id: 'control', n: '5', code: 'CTRL', side: 'l', a: iso(150, 100, cbZ + 4) },
    { id: 'obc', n: '1', code: 'OBC', side: 'l', a: iso(95, 70, 38 + dz.obc) },
    { id: 'hv', n: '4', code: 'HV', side: 'l', a: iso(95, 160, 26 + dz.hv) },
    { id: 'dcdc', n: '2', code: 'DC/DC', side: 'r', a: iso(232, 70, 34 + dz.dcdc) },
    { id: 'evcc', n: '3', code: 'EVCC', side: 'r', a: iso(255, 175, 14 + dz.evcc) },
  ];
  const lidY = iso(150, 100, 58 + dz.lid)[1];
  const houseA = iso(30, 200, 30 + zt);

  return (
    <svg
      className="iso-svg"
      viewBox={`${vb.x} ${VY} ${vb.w} ${VH}`}
      role="img"
      aria-label={
        label ??
        'Schematic concept illustration of the proposed Evo Core Gen 1 assembly, shown exploded: lid, supervisory layer, common control board, OBC and DC/DC power stages, HV distribution, EVCC, and the housing with its cooling plate and external interface ports. Not a production design.'
      }
      data-live={live ? '' : undefined}
      data-compact={compact ? '' : undefined}
    >
      <g transform={shift}>
        {/* ground shadow */}
        <polygon points={pts([-14, -10, zt], [314, -10, zt], [314, 214, zt], [-14, 214, zt])} fill="rgba(23,43,69,.07)" transform="translate(6 10)" />

        {/* assembly axes: parts travel along z */}
        <g stroke="rgba(23,43,69,.28)" strokeWidth="0.9" strokeDasharray="10 4 2 4" opacity={links}>
          {[
            [300, 0],
            [0, 200],
            [300, 200],
          ].map(([x, y]) => {
            const [ax, ay] = iso(x, y, 44 + zt);
            const [bx2, by2] = iso(x, y, 44 + dz.lid);
            return <line key={`${x}-${y}`} x1={ax} y1={ay} x2={bx2} y2={by2} />;
          })}
        </g>

        {/* ---------- housing: back pass (rim, cooling plate, inner walls) ---------- */}
        <g opacity={frame} className="iso-part">
          <polygon points={pts([0, 0, 44 + zt], [300, 0, 44 + zt], [300, 200, 44 + zt], [0, 200, 44 + zt])} fill={SH.rim.top} stroke={LINE} strokeWidth="0.8" />
          <polygon points={pts([T, T, 6 + zt], [300 - T, T, 6 + zt], [300 - T, 200 - T, 6 + zt], [T, 200 - T, 6 + zt])} fill="#e3d4c1" />
          {/* serpentine coolant channel in the cold plate */}
          <polyline
            points={pts([30, 30, 6 + zt], [270, 30, 6 + zt], [270, 75, 6 + zt], [30, 75, 6 + zt], [30, 120, 6 + zt], [270, 120, 6 + zt], [270, 165, 6 + zt], [30, 165, 6 + zt])}
            fill="none"
            stroke="#c8b197"
            strokeWidth="5"
            strokeLinejoin="round"
          />
          <polygon points={pts([T, T, 6 + zt], [T, 200 - T, 6 + zt], [T, 200 - T, 44 + zt], [T, T, 44 + zt])} fill="#cdb8a0" />
          <polygon points={pts([T, T, 6 + zt], [300 - T, T, 6 + zt], [300 - T, T, 44 + zt], [T, T, 44 + zt])} fill="#dccbb7" />
        </g>

        {/* ---------- power layer ---------- */}
        <g opacity={dim('obc')} className="iso-part">
          <Box b={[20, 20, 6 + dz.obc, 150, 100, 32]} s={on('obc') ? SH.stageOn : SH.stage} sw={on('obc') ? 1.4 : 0.8} />
          <Box b={[34, 34, 38 + dz.obc, 62, 44, 14]} s={SH.ivory} />
          <Box b={[108, 36, 38 + dz.obc, 34, 34, 11]} s={SH.ivory} />
          {[0, 1, 2, 3].map((i) => (
            <Box key={i} b={[36 + i * 30, 94, 38 + dz.obc, 16, 12, 4]} s={SH.dark} sw={0.5} />
          ))}
          <TopText x={112} y={80} z={38 + dz.obc} size={15} fill="#8a3f12">
            OBC
          </TopText>
        </g>
        <g opacity={dim('dcdc')} className="iso-part">
          <Box b={[185, 20, 6 + dz.dcdc, 95, 100, 28]} s={on('dcdc') ? SH.stageOn : SH.stage} sw={on('dcdc') ? 1.4 : 0.8} />
          <Box b={[198, 32, 34 + dz.dcdc, 44, 40, 13]} s={SH.ivory} />
          {[0, 1].map((i) => (
            <Box key={i} b={[200 + i * 30, 92, 34 + dz.dcdc, 16, 12, 4]} s={SH.dark} sw={0.5} />
          ))}
          <TopText x={248} y={44} z={34 + dz.dcdc} size={12} fill="#8a3f12">
            DC/DC
          </TopText>
        </g>
        <g opacity={dim('hv')} className="iso-part">
          <Box b={[20, 135, 6 + dz.hv, 150, 50, 20]} s={on('hv') ? SH.pcbOn : SH.dark} sw={on('hv') ? 1.4 : 0.8} />
          {[0, 1, 2].map((i) => (
            <Box key={i} b={[30, 141 + i * 14, 26 + dz.hv, 122, 6, 4]} s={SH.copper} sw={0.4} />
          ))}
          <Box b={[154, 142, 26 + dz.hv, 10, 34, 9]} s={SH.ivory} sw={0.5} />
        </g>
        <g opacity={dim('evcc')} className="iso-part">
          <Box b={[185, 135, 6 + dz.evcc, 95, 50, 6]} s={on('evcc') ? SH.pcbOn : SH.pcb} sw={on('evcc') ? 1.4 : 0.8} />
          <Box b={[205, 148, 12 + dz.evcc, 26, 22, 5]} s={SH.chip} sw={0.5} />
          <Box b={[258, 142, 12 + dz.evcc, 14, 34, 10]} s={SH.ivory} sw={0.5} />
        </g>

        {/* ---------- housing: front pass (outer faces, front rim) ---------- */}
        <g opacity={frame} className="iso-part">
          <polygon points={pts([300, 0, zt], [300, 200, zt], [300, 200, 44 + zt], [300, 0, 44 + zt])} fill={SH.rim.right} stroke={LINE} strokeWidth="0.8" />
          <polygon points={pts([0, 200, zt], [300, 200, zt], [300, 200, 44 + zt], [0, 200, 44 + zt])} fill={SH.rim.left} stroke={LINE} strokeWidth="0.8" />
          <polygon
            points={pts([300 - T, 0, 44 + zt], [300, 0, 44 + zt], [300, 200, 44 + zt], [0, 200, 44 + zt], [0, 200 - T, 44 + zt], [300 - T, 200 - T, 44 + zt])}
            fill={SH.rim.top}
            stroke={LINE}
            strokeWidth="0.6"
          />
          {[30, 60, 90, 130, 160].map((y) => (
            <line key={y} x1={iso(300, y, 8 + zt)[0]} y1={iso(300, y, 8 + zt)[1]} x2={iso(300, y, 36 + zt)[0]} y2={iso(300, y, 36 + zt)[1]} stroke="rgba(23,43,69,.12)" strokeWidth="2" />
          ))}
        </g>
        {/* physical-integration envelope: a shared housing is drawn as an option (dashed) */}
        <polygon className="iso-envelope" points={pts([0, 0, 44 + zt], [300, 0, 44 + zt], [300, 0, zt], [300, 200, zt], [0, 200, zt], [0, 200, 44 + zt])} opacity={frame} />

        {/* external interface ports on the housing */}
        <g className="iso-ports" opacity={links}>
          {PORTS.map((p) => {
            const [px, py] = p.face === 'y' ? iso(p.at, 200, 22 + zt) : iso(300, p.at, 22 + zt);
            const dir = p.face === 'y' ? [-C, S] : [C, S];
            const len = p.face === 'y' ? 46 : 40;
            const lx = px + dir[0] * len;
            const ly = py + dir[1] * len;
            const isOn = portOn(p.id);
            const tx = lx + (p.face === 'y' ? -6 : 6);
            return (
              <g key={p.id} className="iso-port" data-on={focus && isOn ? '' : undefined} opacity={isOn ? 1 : 0.3}>
                <line x1={px} y1={py} x2={lx} y2={ly} />
                <circle cx={px} cy={py} r={compact ? 8 : 6.5} />
                {!compact && (
                  <text x={tx} y={ly + 4} textAnchor={p.face === 'y' ? 'end' : 'start'}>
                    {p.label.map((l, i) => (
                      <tspan key={l} x={tx} dy={i ? 14 : 0} className={i ? 'iso-port-sub' : undefined}>
                        {l}
                      </tspan>
                    ))}
                  </text>
                )}
              </g>
            );
          })}
        </g>

        {/* shared-control links: common control → each power function */}
        <g className="iso-links" opacity={links}>
          {parts.map((p) => {
            const [x1, y1] = iso(p.cx, p.cy, cbZ);
            const [x2, y2] = iso(p.cx, p.cy, p.top);
            return (
              <g key={p.id} className="iso-link" data-on={!focus || on(p.id) || on('control') ? '' : undefined} opacity={focus && !on(p.id) && !on('control') ? 0.25 : 1}>
                <line x1={x1} y1={y1} x2={x2} y2={y2} />
                <line className="iso-pulse" x1={x1} y1={y1} x2={x2} y2={y2} />
                <circle cx={x2} cy={y2} r="3" />
              </g>
            );
          })}
        </g>

        {/* ---------- common control board ---------- */}
        <g opacity={dim('control')} className="iso-part">
          <Box b={[14, 14, cbZ, 272, 172, 4]} s={on('control') ? SH.pcbOn : SH.pcb} sw={on('control') ? 1.4 : 0.8} />
          <g stroke="rgba(255,248,238,.22)" strokeWidth="1" fill="none">
            {[44, 58, 128, 142].map((y) => (
              <polyline key={y} points={pts([30, y, cbZ + 4], [118, y, cbZ + 4])} />
            ))}
            {[176, 190, 204].map((x) => (
              <polyline key={x} points={pts([x, 40, cbZ + 4], [x, 112, cbZ + 4], [x + 40, 112, cbZ + 4])} />
            ))}
          </g>
          <Box b={[128, 70, cbZ + 4, 40, 40, 5]} s={SH.chip} stroke="#f07831" sw={1.1} />
          {[0, 1, 2].map((i) => (
            <Box key={i} b={[40 + i * 26, 80, cbZ + 4, 16, 16, 3]} s={SH.chip} sw={0.4} />
          ))}
          <Box b={[262, 120, cbZ + 4, 14, 44, 10]} s={SH.ivory} sw={0.5} />
          <TopText x={36} y={176} z={cbZ + 4} size={10} fill="#fbd9bf" weight={500}>
            COMMON CONTROL
          </TopText>
        </g>

        {/* supervision reads through common control: dashed, never a control path */}
        <g className="iso-observe" opacity={plane * (focus && !on('ai') && !on('control') ? 0.25 : 1)}>
          {[
            [112, 70],
            [208, 130],
          ].map(([x, y]) => {
            const [x1, y1] = iso(x, y, aiZ);
            const [x2, y2] = iso(x, y, cbZ + 4);
            return <line key={x} x1={x1} y1={y1} x2={x2} y2={y2} />;
          })}
        </g>

        {/* ---------- supervisory layer: software on the shared compute, drawn as a plane ---------- */}
        <g opacity={plane * dim('ai')} className="iso-part iso-plane" data-on={on('ai') ? '' : undefined}>
          <polygon points={pts([AI.x0, AI.y0, aiZ], [AI.x1, AI.y0, aiZ], [AI.x1, AI.y1, aiZ], [AI.x0, AI.y1, aiZ])} />
          <g className="iso-plane-grid">
            {[136, 183].map((x) => (
              <line key={x} x1={iso(x, AI.y0, aiZ)[0]} y1={iso(x, AI.y0, aiZ)[1]} x2={iso(x, AI.y1, aiZ)[0]} y2={iso(x, AI.y1, aiZ)[1]} />
            ))}
            <line x1={iso(AI.x0, 100, aiZ)[0]} y1={iso(AI.x0, 100, aiZ)[1]} x2={iso(AI.x1, 100, aiZ)[0]} y2={iso(AI.x1, 100, aiZ)[1]} />
          </g>
          <TopText x={98} y={64} z={aiZ} size={10} fill="#8a3f12">
            SUPERVISORY LAYER
          </TopText>
          <TopText x={98} y={80} z={aiZ} size={7.5} fill="#8a3f12" weight={500}>
            observes module health
          </TopText>
          <TopText x={98} y={92} z={aiZ} size={7.5} fill="#8a3f12" weight={500}>
            not real-time control
          </TopText>
        </g>

        {/* ---------- lid ---------- */}
        <g opacity={frame} className="iso-part">
          <Box b={[0, 0, 44 + dz.lid, 300, 200, 14]} s={SH.lid} />
          <polygon points={pts([170, 128, 58 + dz.lid], [276, 128, 58 + dz.lid], [276, 176, 58 + dz.lid], [170, 176, 58 + dz.lid])} fill="#fff" stroke="rgba(23,43,69,.3)" strokeWidth="0.8" />
          <TopText x={180} y={146} z={58 + dz.lid} size={13} fill="#172b45" weight={700}>
            EVO CORE
          </TopText>
          <TopText x={180} y={164} z={58 + dz.lid} size={8} fill="#55667a" weight={500}>
            CONCEPT · NOT A PRODUCT
          </TopText>
        </g>
        <polygon
          className="iso-envelope"
          points={pts([0, 0, 58 + dz.lid], [300, 0, 58 + dz.lid], [300, 0, 44 + dz.lid], [300, 200, 44 + dz.lid], [0, 200, 44 + dz.lid], [0, 200, 58 + dz.lid])}
          opacity={frame}
        />

        {/* ---------- annotations ---------- */}
        <g className="iso-notes" opacity={notes}>
          {balloons.map((b) => {
            const bxp = b.side === 'l' ? col.l : col.r;
            const [ax, ay] = b.a;
            return (
              <g key={b.id} className="iso-balloon" data-on={on(b.id) ? '' : undefined} opacity={focus && !on(b.id) ? 0.4 : 1}>
                <line x1={ax} y1={ay} x2={b.side === 'l' ? bxp + R : bxp - R} y2={ay} />
                <circle cx={ax} cy={ay} r="3" className="iso-anchor" />
                <circle cx={bxp} cy={ay} r={R} />
                <text x={bxp} y={ay + (compact ? 7 : 5)} textAnchor="middle" className="iso-balloon-n">
                  {b.n}
                </text>
                {!compact && (
                  <text x={b.side === 'l' ? bxp - 22 : bxp + 22} y={ay + 4.5} textAnchor={b.side === 'l' ? 'end' : 'start'} className="iso-balloon-code">
                    {b.code}
                  </text>
                )}
              </g>
            );
          })}
          {!compact && (
            <g className="iso-tag" opacity={focus ? 0.4 : 1}>
              <text x={col.l + 8} y={lidY + 4} textAnchor="end">
                LID
              </text>
              <line x1={iso(40, 100, 58 + dz.lid)[0]} y1={lidY} x2={col.l + 15} y2={lidY} />
              <text x={col.l + 8} y={houseA[1] + 4} textAnchor="end">
                HOUSING
              </text>
              <line x1={houseA[0]} y1={houseA[1]} x2={col.l + 15} y2={houseA[1]} />
              <text x={col.l + 8} y={houseA[1] + 18} textAnchor="end" className="iso-tag-sub">
                cooling plate
              </text>
            </g>
          )}
        </g>
      </g>
    </svg>
  );
}

/* ---------------------------------------------------------------- mini glyph for the integration steps */

const MUTE = { top: '#f3ece3', left: '#e6dacb', right: '#d9c9b6' };
const HOT = { top: '#f8b88c', left: '#ee985f', right: '#dc7a3c' };

/** Small static exploded stack. The layer an integration step concerns is drawn in tangerine. */
export function IsoStack({ layer }: { layer: Layer }) {
  const hot = (l: Layer) => layer === l || layer === 'all';
  const g = (l: Layer, el: ReactNode) => (
    <g className="iso-stack-layer" data-hot={hot(l) ? '' : undefined}>
      {el}
    </g>
  );
  return (
    <svg className="iso-stack" viewBox="-182 -272 452 490" aria-hidden="true" focusable="false">
      {g('housing', <Box b={[0, 0, 0, 300, 200, 30]} s={hot('housing') ? HOT : MUTE} dash={layer === 'housing' ? '6 4' : undefined} sw={1.2} />)}
      {g(
        'power',
        <>
          <Box b={[20, 20, 70, 150, 100, 26]} s={hot('power') ? HOT : MUTE} sw={1.2} />
          <Box b={[185, 20, 70, 95, 100, 22]} s={hot('power') ? HOT : MUTE} sw={1.2} />
          <Box b={[20, 135, 70, 150, 50, 16]} s={hot('power') ? SH.dark : MUTE} sw={1.2} />
          <Box b={[185, 135, 70, 95, 50, 6]} s={hot('power') ? SH.pcb : MUTE} sw={1.2} />
        </>
      )}
      {g('control', <Box b={[14, 14, 160, 272, 172, 6]} s={hot('control') ? SH.pcb : MUTE} sw={1.2} />)}
      {g('control', <polygon points={pts([14, 14, 205], [286, 14, 205], [286, 186, 205], [14, 186, 205])} fill={hot('control') ? 'rgba(240,120,49,.16)' : 'none'} stroke={hot('control') ? '#b0521a' : 'rgba(23,43,69,.3)'} strokeWidth="1.4" strokeDasharray="6 4" />)}
      {g('housing', <Box b={[0, 0, 245, 300, 200, 14]} s={hot('housing') ? HOT : MUTE} dash={layer === 'housing' ? '6 4' : undefined} sw={1.2} />)}
    </svg>
  );
}
