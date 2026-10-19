import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { Tabs } from 'radix-ui';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { CHAIN_LINKS, CHAIN_STAGES, type ChainStageId } from '@/data/research';

// Product Neural Chain: the six lifecycle stages as an arc diagram. Arcs above (or right of) the chain carry
// decisions forward; arcs below (or left) return evidence to an earlier stage. Selecting a stage highlights its
// flows and shows the proposed, owner-reviewed decision support. Every stage panel is in the server HTML.

const ORDER = CHAIN_STAGES.map((s) => s.id);
const idx = (id: ChainStageId) => ORDER.indexOf(id);
const label = (id: ChainStageId) => CHAIN_STAGES[idx(id)].label;
const key = (l: { from: ChainStageId; to: ChainStageId }) => `${l.from}>${l.to}`;

type Arc = { key: string; d: string; from: ChainStageId; to: ChainStageId };
type Geo = { w: number; h: number; arcs: Arc[] };

function layout(root: HTMLElement): Geo | null {
  const box = root.getBoundingClientRect();
  const rects = new Map<ChainStageId, DOMRect>();
  root.querySelectorAll<HTMLElement>('[data-stage]').forEach((el) => rects.set(el.dataset.stage as ChainStageId, el.getBoundingClientRect()));
  if (rects.size !== ORDER.length) return null;
  const a = rects.get(ORDER[0])!;
  const b = rects.get(ORDER[1])!;
  const vertical = Math.abs(b.top - a.top) > Math.abs(b.left - a.left);

  // Forward arcs attach to side "a" (top / right), returning arcs to side "b" (bottom / left).
  // Endpoints sharing a side are spread along it, ordered by the far end, so arcs nest instead of crossing.
  const slots = new Map<string, { k: string; other: number }[]>();
  for (const l of CHAIN_LINKS) {
    const side = idx(l.to) < idx(l.from) ? 'b' : 'a';
    for (const [end, other] of [[l.from, l.to], [l.to, l.from]] as const) {
      const s = `${end}:${side}`;
      if (!slots.has(s)) slots.set(s, []);
      slots.get(s)!.push({ k: key(l), other: idx(other) });
    }
  }
  slots.forEach((list) => list.sort((p, q) => p.other - q.other));
  const point = (id: ChainStageId, side: 'a' | 'b', k: string) => {
    const r = rects.get(id)!;
    const list = slots.get(`${id}:${side}`)!;
    const f = (list.findIndex((e) => e.k === k) + 1) / (list.length + 1);
    if (vertical) return { x: (side === 'a' ? r.right : r.left) - box.left, y: r.top + r.height * (0.2 + 0.6 * f) - box.top };
    return { x: r.left + r.width * (0.22 + 0.56 * f) - box.left, y: (side === 'a' ? r.top : r.bottom) - box.top };
  };

  const first = rects.get(ORDER[0])!;
  const room = vertical
    ? { a: box.right - first.right - 10, b: first.left - box.left - 10 }
    : { a: first.top - box.top - 14, b: box.bottom - first.bottom - 14 };

  const arcs = CHAIN_LINKS.map((l) => {
    const side = idx(l.to) < idx(l.from) ? 'b' : 'a';
    const span = Math.abs(idx(l.to) - idx(l.from));
    const reach = Math.max(18, Math.min(room[side], 22 + ((room[side] - 22) * (span - 1)) / 4));
    const k = reach / 0.75; // a symmetric cubic peaks at 3/4 of its control offset
    const p = point(l.from, side, key(l));
    const q = point(l.to, side, key(l));
    const dir = side === 'a' ? -1 : 1;
    const d = vertical
      ? `M${p.x},${p.y} C${p.x - dir * k},${p.y} ${q.x - dir * k},${q.y} ${q.x},${q.y}`
      : `M${p.x},${p.y} C${p.x},${p.y + dir * k} ${q.x},${q.y + dir * k} ${q.x},${q.y}`;
    return { key: key(l), d, from: l.from, to: l.to };
  });
  return { w: box.width, h: box.height, arcs };
}

export default function NeuralChain() {
  const [active, setActive] = useState<ChainStageId>('requirements');
  const [geo, setGeo] = useState<Geo | null>(null);
  const graphRef = useRef<HTMLDivElement>(null);
  const inView = useInView(graphRef);
  const reduce = useReducedMotion();
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');

  const measure = useCallback(() => {
    if (graphRef.current) setGeo(layout(graphRef.current));
  }, []);

  useEffect(() => {
    const el = graphRef.current;
    if (!el) return;
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    document.fonts?.ready.then(measure);
    return () => ro.disconnect();
  }, [measure]);

  const relation = (id: ChainStageId) =>
    CHAIN_LINKS.some((l) => l.from === id && l.to === active) ? 'in' : CHAIN_LINKS.some((l) => l.from === active && l.to === id) ? 'out' : undefined;
  const stateOf = (a: Arc) => (a.to === active ? 'in' : a.from === active ? 'out' : 'idle');

  return (
    <Tabs.Root value={active} onValueChange={(v) => setActive(v as ChainStageId)} className="nc">
      <div className="nc-graph" ref={graphRef} data-flow={inView ? 'on' : 'off'}>
        {geo && (
          <svg className="nc-svg" width={geo.w} height={geo.h} viewBox={`0 0 ${geo.w} ${geo.h}`} aria-hidden="true" focusable="false">
            <defs>
              {(['idle', 'in', 'out'] as const).map((s) => (
                <marker key={s} id={`${uid}-${s}`} viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="8" markerHeight="8" markerUnits="userSpaceOnUse" orient="auto">
                  <path d="M0,1 L9,5 L0,9 Z" className={`nc-head nc-head--${s}`} />
                </marker>
              ))}
            </defs>
            {geo.arcs.map((a) => (
              <path key={a.key} d={a.d} className="nc-arc" data-state={stateOf(a)} markerEnd={stateOf(a) === 'idle' ? `url(#${uid}-idle)` : undefined} />
            ))}
            {geo.arcs
              .filter((a) => stateOf(a) !== 'idle')
              .map((a) => (
                <g key={`${active}:${a.key}`} data-state={stateOf(a)}>
                  <motion.path
                    d={a.d}
                    className="nc-live"
                    markerEnd={`url(#${uid}-${stateOf(a)})`}
                    initial={{ pathLength: reduce ? 1 : 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: reduce ? 0 : 0.7, ease: [0.16, 1, 0.3, 1] }}
                  />
                  <path d={a.d} className="nc-pulse" />
                </g>
              ))}
          </svg>
        )}
        <Tabs.List className="nc-list" aria-label="Lifecycle stages">
          {CHAIN_STAGES.map((s, i) => (
            <Tabs.Trigger key={s.id} value={s.id} data-stage={s.id} data-rel={relation(s.id)} className="nc-node">
              <span className="nc-num" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              {s.label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
      </div>

      <ul className="nc-key" aria-label="How to read the chain">
        <li>
          <span className="nc-swatch nc-swatch--in" aria-hidden="true" />
          Flows into the selected stage
        </li>
        <li>
          <span className="nc-swatch nc-swatch--out" aria-hidden="true" />
          Flows out of it
        </li>
        <li className="nc-key-note">
          <span className="nc-h">Arcs above the chain carry decisions forward; arcs below return evidence to an earlier stage.</span>
          <span className="nc-v">Arcs on the right carry decisions forward; arcs on the left return evidence to an earlier stage.</span>
        </li>
      </ul>

      {CHAIN_STAGES.map((s, i) => {
        const ins = CHAIN_LINKS.filter((l) => l.to === s.id);
        const outs = CHAIN_LINKS.filter((l) => l.from === s.id);
        return (
          <Tabs.Content key={s.id} value={s.id} forceMount className="nc-panel">
            <div className="nc-panel-head">
              <p className="nc-kicker">
                Stage {String(i + 1).padStart(2, '0')} of 06
              </p>
              <h3 className="h3">{s.label}</h3>
              <p className="nc-role">{s.role}</p>
            </div>
            <div className="nc-flows">
              <div>
                <h4 className="nc-label nc-label--in">Receives</h4>
                <ul>
                  {ins.map((l) => (
                    <li key={key(l)}>
                      <span className="nc-peer">
                        <span className="visually-hidden">From </span>
                        {label(l.from)}
                      </span>
                      {l.carries}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="nc-label nc-label--out">Sends</h4>
                <ul>
                  {outs.map((l) => (
                    <li key={key(l)}>
                      <span className="nc-peer">
                        <span className="visually-hidden">To </span>
                        {label(l.to)}
                      </span>
                      {l.carries}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="nc-support">
              <h4 className="nc-label">Proposed decision support</h4>
              <p>{s.support}</p>
              <p className="nc-owner">
                <span>Reviewed by</span> {s.owner}, who accepts or rejects each recommendation.
              </p>
            </div>
          </Tabs.Content>
        );
      })}
    </Tabs.Root>
  );
}
