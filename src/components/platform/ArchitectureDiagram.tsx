import { useMemo, useRef, useState, createRef, type CSSProperties, type ReactNode, type RefObject } from 'react';
import { useInView, useReducedMotion } from 'motion/react';
import { AnimatedBeam } from '@/components/ui/animated-beam';
import {
  ARCH_CONNECTORS,
  ARCH_EXPLAIN,
  ARCH_LEGEND,
  ARCH_LEVELS,
  ARCH_NODES,
  ARCH_OPTIONS,
  ARCH_RELATIONS,
  type ArchSelection,
} from '@/data/platform';
import './architecture.css';

type NodeId = 'battery' | 'evo' | 'other' | 'bms' | 'pmg' | 'safety' | 'cloud';

// SVG gradient stops need literal colours; these mirror src/styles/tokens.css.
const HEX = { battery: '#087f6b', evo: '#f07831', pmg: '#185adb', slate: '#55667a', faint: '#8494a7' };

/** Real data paths only (module → vehicle → optional learning). */
const BEAMS: { id: string; from: NodeId; to: NodeId; c0: string; c1: string; curvature: number; delay: number }[] = [
  { id: 'battery-pmg', from: 'battery', to: 'pmg', c0: HEX.battery, c1: HEX.pmg, curvature: 18, delay: 0 },
  { id: 'evo-pmg', from: 'evo', to: 'pmg', c0: HEX.evo, c1: HEX.pmg, curvature: 0, delay: 0.12 },
  { id: 'other-pmg', from: 'other', to: 'pmg', c0: HEX.slate, c1: HEX.pmg, curvature: -18, delay: 0.24 },
  { id: 'pmg-cloud', from: 'pmg', to: 'cloud', c0: HEX.pmg, c1: HEX.faint, curvature: 0, delay: 0.36 },
];

const SELECTABLE: NodeId[] = ['battery', 'evo', 'pmg', 'cloud'];

export default function ArchitectureDiagram({ eyebrow, title, lead }: { eyebrow: string; title: string; lead: string }) {
  const [sel, setSel] = useState<ArchSelection>('all');
  const reduce = useReducedMotion() ?? false;
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const live = useInView(rootRef, { amount: 0.15 }); // beams only run while the diagram is on screen
  const refs = useMemo(
    () => Object.fromEntries((['battery', 'evo', 'other', 'bms', 'pmg', 'safety', 'cloud'] as NodeId[]).map((id) => [id, createRef<HTMLDivElement>()])) as Record<NodeId, RefObject<HTMLDivElement | null>>,
    []
  );

  const rel = ARCH_RELATIONS[sel];
  const pathOn = (id: string) => rel.paths.includes(id);
  const nodeState = (id: NodeId) => (sel !== 'all' && id === sel ? 'active' : rel.nodes.includes(id) ? 'related' : 'dim');
  const choose = (id: ArchSelection) => setSel((cur) => (cur === id && id !== 'all' ? 'all' : id));
  const selColor = ARCH_OPTIONS.find((o) => o.id === sel)?.color;

  const node = (id: NodeId, kind: 'concept' | 'interface' | 'reference' | 'future', accent: string | undefined, body: ReactNode, extra = '') => {
    const selectable = (SELECTABLE as string[]).includes(id);
    return (
      <div
        ref={refs[id]}
        className={`arch-node ${extra}`}
        data-node={id}
        data-kind={kind}
        data-state={nodeState(id)}
        data-selectable={selectable ? '' : undefined}
        style={accent ? ({ '--node': accent } as CSSProperties) : undefined}
        onClick={selectable ? () => choose(id as ArchSelection) : undefined}
      >
        {body}
      </div>
    );
  };

  const N = ARCH_NODES;

  return (
    <div className="arch" ref={rootRef} data-sel={sel} data-live={live ? '' : undefined} style={{ '--sel': selColor } as CSSProperties}>
      <header className="arch-head">
        <p className="eyebrow">{eyebrow}</p>
        <h2 id="architecture-title" className="h2">{title}</h2>
        <p className="lead">{lead}</p>
      </header>

      <div className="arch-bar">
        <p className="arch-bar-label" id="arch-options-label">
          Select a product to trace its relationships
        </p>
        <div className="arch-options" role="group" aria-labelledby="arch-options-label">
          {ARCH_OPTIONS.map((o) => (
            <button
              key={o.id}
              type="button"
              className="arch-option"
              aria-pressed={sel === o.id}
              style={{ '--opt': o.color } as CSSProperties}
              onClick={() => choose(o.id)}
            >
              <span className="arch-option-dot" aria-hidden="true" data-kind={o.id} />
              {o.label}
            </button>
          ))}
        </div>
      </div>

      <div className="arch-explain" aria-live="polite">
        {(Object.keys(ARCH_EXPLAIN) as ArchSelection[]).map((id) => {
          const e = ARCH_EXPLAIN[id];
          return (
            <article key={id} className="arch-explain-item" data-active={id === sel ? '' : undefined}>
              <p className="arch-explain-kicker">{id === 'all' ? 'All relationships' : 'Relationships of'}</p>
              <h3 className="arch-explain-title">{e.title}</h3>
              <p className="arch-explain-where">{e.where}</p>
              <ul className="arch-explain-links">
                {e.links.map((l) => (
                  <li key={l.to}>
                    <span className="arch-explain-to">{l.to}</span>
                    <span>{l.text}</span>
                  </li>
                ))}
              </ul>
              <p className="arch-explain-boundary">
                <span>Boundary</span>
                {e.boundary}
              </p>
            </article>
          );
        })}
      </div>

      <div className="arch-stage" ref={stageRef} role="group" aria-label="Three-level platform architecture">
        {live && (
          <div className="arch-beams" aria-hidden="true">
            {BEAMS.map((b) => {
              const on = pathOn(b.id);
              const animate = on && !reduce;
              return (
                <AnimatedBeam
                  key={`${b.id}-${on}-${reduce}`}
                  containerRef={stageRef}
                  fromRef={refs[b.from]}
                  toRef={refs[b.to]}
                  curvature={b.curvature}
                  pathColor={on ? b.c0 : HEX.faint}
                  pathOpacity={on ? (reduce ? 0.8 : 0.42) : 0.14}
                  pathWidth={on ? 2.5 : 1.25}
                  gradientStartColor={b.c0}
                  gradientStopColor={b.c1}
                  duration={animate ? 4.2 : 0}
                  repeat={animate ? Infinity : 0}
                  delay={b.delay}
                />
              );
            })}
          </div>
        )}

        {/* Level 01 */}
        <div className="arch-col arch-col--1" role="group" aria-labelledby="arch-l1">
          <div className="arch-level">
            <span className="arch-level-n">{ARCH_LEVELS[0].n}</span>
            <h3 className="arch-level-title" id="arch-l1">{ARCH_LEVELS[0].title}</h3>
          </div>
          <div className="arch-col-body">
            <div className="arch-group">
              {node(
                'battery',
                'concept',
                'var(--p-battery)',
                <>
                  <span className="arch-node-level">{N.battery.level}</span>
                  <span className="arch-node-name">{N.battery.name}</span>
                  <span className="arch-node-role">{N.battery.role}</span>
                  <span className="arch-node-kind">{N.battery.kind}</span>
                </>
              )}
              <div className="arch-conn arch-conn--link" data-on={pathOn('battery-evo') ? '' : undefined}>
                <span className="arch-conn-line" aria-hidden="true" />
                <span className="arch-conn-label">↕ {ARCH_CONNECTORS.batteryEvo}</span>
              </div>
              {node(
                'evo',
                'concept',
                'var(--p-evo)',
                <>
                  <span className="arch-node-level">{N.evo.level}</span>
                  <span className="arch-node-name">{N.evo.name}</span>
                  <span className="arch-node-role">{N.evo.role}</span>
                  <span className="arch-node-kind">{N.evo.kind}</span>
                </>
              )}
              {node(
                'other',
                'interface',
                undefined,
                <>
                  <span className="arch-node-level">{N.other.level}</span>
                  <span className="arch-node-name">{N.other.name}</span>
                  <span className="arch-node-role">{N.other.role}</span>
                  <span className="arch-node-kind">{N.other.kind}</span>
                </>
              )}
            </div>
            <div className="arch-conn arch-conn--signals" data-on={pathOn('signals') ? '' : undefined}>
              <span className="arch-conn-line" aria-hidden="true" />
              <span className="arch-conn-label">
                <span className="arch-conn-arrow" aria-hidden="true">↑</span> {ARCH_CONNECTORS.signals}
              </span>
            </div>
            {node(
              'bms',
              'reference',
              undefined,
              <>
                <span className="arch-node-level">Reference vehicle system</span>
                <span className="arch-node-name">{N.bms.name}</span>
                <span className="arch-node-role">{N.bms.role}</span>
              </>,
              'arch-node--ref'
            )}
          </div>
        </div>

        {/* Mobile-only vertical pipe: module level → vehicle level */}
        <div className="arch-pipe" aria-hidden="true">
          {(['battery-pmg', 'evo-pmg', 'other-pmg'] as const).map((p, i) => (
            <span key={p} className="arch-pipe-lane" data-lane={p} data-on={pathOn(p) ? '' : undefined} style={{ '--i': i } as CSSProperties}>
              <i />
            </span>
          ))}
        </div>

        {/* Level 02 */}
        <div className="arch-col arch-col--2" role="group" aria-labelledby="arch-l2">
          <div className="arch-level">
            <span className="arch-level-n">{ARCH_LEVELS[1].n}</span>
            <h3 className="arch-level-title" id="arch-l2">{ARCH_LEVELS[1].title}</h3>
          </div>
          <div className="arch-col-body">
            {node(
              'pmg',
              'concept',
              'var(--p-pmg)',
              <>
                <span className="arch-node-level">{N.pmg.level}</span>
                <span className="arch-node-name">{N.pmg.name}</span>
                <span className="arch-node-role">{N.pmg.role}</span>
                <span className="arch-node-adds">+ {N.pmg.adds}</span>
                <span className="arch-node-kind">{N.pmg.kind}</span>
              </>,
              'arch-node--pmg'
            )}
            <div className="arch-conn arch-conn--requests" data-on={pathOn('requests') ? '' : undefined}>
              <span className="arch-conn-line" aria-hidden="true" />
              <span className="arch-conn-label">↓ {ARCH_CONNECTORS.requests}</span>
            </div>
            {node(
              'safety',
              'reference',
              undefined,
              <>
                <span className="arch-node-level">Reference vehicle system</span>
                <span className="arch-node-name">{N.safety.name}</span>
                <span className="arch-node-role">{N.safety.role}</span>
              </>,
              'arch-node--ref'
            )}
          </div>
        </div>

        {/* Vehicle boundary: horizontal + pipe on mobile, vertical dashed line on desktop */}
        <div className="arch-boundary" data-on={pathOn('pmg-cloud') ? '' : undefined}>
          <span className="arch-boundary-label">{ARCH_CONNECTORS.boundary}</span>
          <span className="arch-pipe-lane arch-pipe-lane--cloud" aria-hidden="true" data-on={pathOn('pmg-cloud') ? '' : undefined}>
            <i />
          </span>
        </div>

        {/* Level 03 */}
        <div className="arch-col arch-col--3" role="group" aria-labelledby="arch-l3">
          <div className="arch-level">
            <span className="arch-level-n">{ARCH_LEVELS[2].n}</span>
            <h3 className="arch-level-title" id="arch-l3">
              {ARCH_LEVELS[2].title} <span className="arch-level-tag">{ARCH_LEVELS[2].note}</span>
            </h3>
          </div>
          <div className="arch-col-body">
            {node(
              'cloud',
              'future',
              'var(--c-slate-2)',
              <>
                <span className="arch-node-level">{N.cloud.level}</span>
                <span className="arch-node-name">{N.cloud.name}</span>
                <span className="arch-node-role">{N.cloud.role}</span>
                <span className="arch-node-kind">{N.cloud.kind}</span>
              </>
            )}
            <p className="arch-cloud-note">The cloud adds learning without becoming a prerequisite for local operation.</p>
          </div>
        </div>
      </div>

      <footer className="arch-foot">
        <ul className="legend" aria-label="Diagram legend">
          {ARCH_LEGEND.map((l) => (
            <li key={l.swatch} className="legend-item">
              <span className={`swatch swatch--${l.swatch}`} aria-hidden="true" />
              {l.label}
            </li>
          ))}
        </ul>
        <p className="fineprint">Schematic concept illustration · not a production design</p>
      </footer>
    </div>
  );
}
