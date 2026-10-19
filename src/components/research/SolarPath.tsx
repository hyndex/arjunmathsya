import { useId, useRef, useState } from 'react';
import { Tabs } from 'radix-ui';
import { useInView } from 'motion/react';
import { SOLAR_CONDITIONS, SOLAR_PATH, type SolarConditionId } from '@/data/research';

// Solar-assisted auxiliaries: a schematic daylight scene. The operating-condition selector changes the scene
// (clouds, a parking canopy) and the relative emphasis of the two energy paths — qualitatively, never as values.

const LEVEL: Record<SolarConditionId, { ray: number; solar: number; backup: number; dur: string }> = {
  sunny: { ray: 1, solar: 1, backup: 0.4, dur: '1.2s' },
  cloudy: { ray: 0.35, solar: 0.55, backup: 0.85, dur: '2.4s' },
  shaded: { ray: 0, solar: 0.16, backup: 1, dur: '2.4s' },
};
const SCENE: Record<SolarConditionId, string> = {
  sunny: 'in clear sunshine. Sunlight reaches the roof panel, and energy flows through power conversion and storage to the defined auxiliary load, with the vehicle supply on standby as backup.',
  cloudy: 'under cloud. Less sunlight reaches the roof panel, so less energy flows to the auxiliary load and the vehicle supply covers more of it.',
  shaded: 'in shaded parking under a canopy. The canopy blocks most sunlight from the roof panel, and the vehicle supply carries the auxiliary load.',
};
// Badge positions as % of the 760 × 452 scene, placed beside (not over) the parts they label
const BADGES = [
  { n: 1, x: 39.5, y: 30.5 },
  { n: 2, x: 72.9, y: 46.9 },
  { n: 3, x: 68.7, y: 71 },
  { n: 4, x: 45.5, y: 63.3 },
  { n: 5, x: 25.8, y: 65 },
];
const RAYS = [
  { from: [162.8, 113.2], to: [420, 212], stop: [284.7, 160] },
  { from: [163.6, 111.1], to: [468, 212], stop: [311.1, 160] },
  { from: [164.1, 109.4], to: [516, 212], stop: [337.6, 160] },
];

function Flow({ d, className, level, dur, run, marker }: { d: string; className: string; level: number; dur: string; run: boolean; marker?: string }) {
  return (
    <g className={`sp-flow ${className}`} style={{ opacity: level, ['--dur' as string]: dur }} data-run={run ? '' : undefined}>
      <path d={d} className="sp-base" markerEnd={marker} />
      <path d={d} className="sp-dots" />
    </g>
  );
}

export default function SolarPath() {
  const [cond, setCond] = useState<SolarConditionId>('sunny');
  const figRef = useRef<HTMLElement>(null);
  const inView = useInView(figRef);
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const lv = LEVEL[cond];

  return (
    <Tabs.Root value={cond} onValueChange={(v) => setCond(v as SolarConditionId)} className="sp">
      <figure className="sp-figure" ref={figRef} data-condition={cond} data-flow={inView ? 'on' : 'off'}>
        <div className="sp-stage">
          <svg viewBox="0 0 760 452" role="img" aria-labelledby={`${uid}-t`} className="sp-svg">
            <title id={`${uid}-t`}>{`Schematic: a vehicle with a modest roof solar panel, parked ${SCENE[cond]}`}</title>
            <defs>
              <linearGradient id={`${uid}-sky`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#dcebff" />
                <stop offset="1" stopColor="#f7fbff" />
              </linearGradient>
              <linearGradient id={`${uid}-grey`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#dfe5ec" />
                <stop offset="1" stopColor="#f4f6f9" />
              </linearGradient>
              {(['solar', 'backup'] as const).map((m) => (
                <marker key={m} id={`${uid}-${m}`} viewBox="0 0 10 10" refX="7" refY="5" markerWidth="9" markerHeight="9" markerUnits="userSpaceOnUse" orient="auto">
                  <path d="M0,1 L9,5 L0,9 Z" className={`sp-head sp-head--${m}`} />
                </marker>
              ))}
            </defs>

            {/* Sky + ground */}
            <rect width="760" height="452" fill={`url(#${uid}-sky)`} />
            <rect width="760" height="452" fill={`url(#${uid}-grey)`} className="sp-overcast" />
            <rect y="410" width="760" height="42" className="sp-ground" />
            <line x1="0" y1="410.5" x2="760" y2="410.5" className="sp-groundline" />

            {/* Sun */}
            <g className="sp-sun">
              <circle cx="118" cy="96" r="54" className="sp-halo" />
              <circle cx="118" cy="96" r="38" className="sp-disc" />
            </g>

            {/* 1 · Sunlight */}
            <g className="sp-rays" style={{ opacity: lv.ray }} data-run={lv.ray > 0 ? '' : undefined}>
              {RAYS.map((r) => (
                <g key={r.to[0]} className="sp-flow sp-flow--sun" style={{ ['--dur' as string]: lv.dur }}>
                  <path d={`M${r.from} L${r.to}`} className="sp-base" />
                  <path d={`M${r.from} L${r.to}`} className="sp-dots" />
                </g>
              ))}
            </g>
            <g className="sp-blocked">
              {RAYS.map((r) => (
                <path key={r.to[0]} d={`M${r.from} L${r.stop}`} />
              ))}
            </g>

            {/* Vehicle (schematic side view) */}
            <g className="sp-car">
              <path
                className="sp-body"
                d="M130 372 L130 342 Q132 318 158 312 L280 294 Q298 291 310 282 L372 234 Q382 227 396 226 L540 226 Q556 227 566 236 L620 280 Q644 298 648 322 L650 372 L586 372 A46 46 0 0 0 494 372 L296 372 A46 46 0 0 0 204 372 Z"
              />
              <path className="sp-glass" d="M320 282 L376 240 Q384 235 394 235 L458 235 L458 282 Z" />
              <path className="sp-glass" d="M468 235 L536 235 Q550 236 558 244 L598 282 L468 282 Z" />
              <path className="sp-line" d="M463 287 L463 352 M180 318 L300 300" />
              {[250, 540].map((cx) => (
                <g key={cx}>
                  <circle cx={cx} cy="372" r="38" className="sp-tyre" />
                  <circle cx={cx} cy="372" r="15" className="sp-hub" />
                </g>
              ))}
            </g>

            {/* 2 · Roof panel */}
            <g className="sp-panel">
              <path className="sp-line" d="M420 223 L420 226 M516 223 L516 226" />
              <rect x="404" y="213" width="128" height="10" rx="2" className="sp-cells" />
              <path className="sp-cell-lines" d={Array.from({ length: 7 }, (_, i) => `M${420 + i * 16} 213 L${420 + i * 16} 223`).join(' ')} />
              <rect x="404" y="213" width="128" height="4" rx="2" className="sp-glint" style={{ opacity: lv.ray * 0.5 }} />
            </g>

            {/* 3 · Conversion / storage, 4 · auxiliary load, 5 · vehicle supply */}
            <g className="sp-unit">
              <rect x="432" y="306" width="64" height="30" rx="6" />
              <path d="M440 330 L460 312 M468 315 L468 327 M474 318 L474 324 M480 315 L480 327 M486 318 L486 324" />
            </g>
            <g className="sp-unit sp-unit--load">
              <rect x="318" y="310" width="56" height="26" rx="6" />
              <path d="M324 323 L330 323 L333 316 L338 330 L343 316 L348 330 L353 316 L356 323 L368 323" />
            </g>
            <g className="sp-unit sp-unit--backup">
              <rect x="170" y="318" width="52" height="26" rx="6" />
              <path d="M188 324 L188 338 M194 327 L194 335 M200 324 L200 338 M206 327 L206 335" />
            </g>

            <Flow d="M468 224 L468 304" className="sp-flow--solar" level={lv.solar} dur={lv.dur} run={lv.solar > 0.3} marker={`url(#${uid}-solar)`} />
            <Flow d="M431 321 L377 323" className="sp-flow--solar" level={lv.solar} dur={lv.dur} run={lv.solar > 0.3} marker={`url(#${uid}-solar)`} />
            <Flow d="M223 331 C262 331 280 323 315 323" className="sp-flow--backup" level={lv.backup} dur="1.8s" run={lv.backup > 0.5} marker={`url(#${uid}-backup)`} />

            {/* Weather and shade */}
            <g className="sp-clouds">
              <g>
                <circle cx="98" cy="120" r="18" />
                <circle cx="124" cy="106" r="26" />
                <circle cx="154" cy="116" r="20" />
                <rect x="98" y="116" width="56" height="22" />
              </g>
              <g>
                <circle cx="248" cy="74" r="14" />
                <circle cx="268" cy="62" r="20" />
                <circle cx="292" cy="72" r="15" />
                <rect x="248" y="70" width="44" height="18" />
              </g>
            </g>
            <g className="sp-canopy">
              <rect x="100" y="174" width="588" height="236" className="sp-shade" />
              <rect x="76" y="160" width="636" height="14" rx="3" className="sp-roof" />
              <rect x="92" y="174" width="8" height="236" className="sp-post" />
              <rect x="688" y="174" width="8" height="236" className="sp-post" />
            </g>
          </svg>
          {BADGES.map((b) => (
            <span key={b.n} className="sp-badge" style={{ left: `${b.x}%`, top: `${b.y}%` }} aria-hidden="true">
              {b.n}
            </span>
          ))}
        </div>
        <figcaption className="sp-caption">
          <span>Schematic concept illustration · not a production design</span>
          <span>Line strength shows direction and relative change between conditions, not measured energy.</span>
        </figcaption>
      </figure>

      <div className="sp-side">
        <div className="sp-select">
          <p className="rs-label" id={`${uid}-cond`}>
            Operating condition
          </p>
          <Tabs.List className="sp-tabs" aria-labelledby={`${uid}-cond`}>
            {SOLAR_CONDITIONS.map((c) => (
              <Tabs.Trigger key={c.id} value={c.id} className="sp-tab">
                {c.label}
              </Tabs.Trigger>
            ))}
          </Tabs.List>
          {SOLAR_CONDITIONS.map((c) => (
            <Tabs.Content key={c.id} value={c.id} forceMount className="sp-panel-text">
              <h3 className="h4">{c.title}</h3>
              <p>{c.body}</p>
              <p className="sp-model">
                <span>To model</span>
                {c.model}
              </p>
            </Tabs.Content>
          ))}
        </div>
        <ol className="sp-legend" aria-label="Energy path">
          {SOLAR_PATH.map((s) => (
            <li key={s.n}>
              <span className="sp-legend-n" aria-hidden="true">
                {s.n}
              </span>
              <span>
                <strong>{s.label}</strong> {s.body}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </Tabs.Root>
  );
}
