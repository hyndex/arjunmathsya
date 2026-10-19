import { useCallback, useEffect, useRef, useState, type PointerEvent } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { DISCIPLINES, INFORMS, PORTFOLIO_NODES, type DisciplineId, type PortfolioId } from '@/data/about';

// Disciplines → portfolio map. Connectors are measured from the dot anchors, so the layout stays pure CSS.
// Lines draw in once when the map enters view; selecting a node redraws its connections. Hover previews the lines
// only; pressing a node (click, tap, Enter, Space) pins it and updates the polite live description.

type Sel = { kind: 'd'; id: DisciplineId } | { kind: 'p'; id: PortfolioId } | null;
type Path = { key: string; d: string };

const dName = (id: DisciplineId) => DISCIPLINES.find((d) => d.id === id)!.label;
const pName = (id: PortfolioId) => PORTFOLIO_NODES.find((p) => p.id === id)!.label;
const same = (a: Sel, b: Sel) => !!a && !!b && a.kind === b.kind && a.id === b.id;
const touches = (l: (typeof INFORMS)[number], s: NonNullable<Sel>) => (s.kind === 'd' ? l.from === s.id : l.to === s.id);
const ease = [0.16, 1, 0.3, 1] as const;

export default function DisciplineMap() {
  const [sel, setSel] = useState<Sel>(null);
  const [hover, setHover] = useState<Sel>(null);
  const [paths, setPaths] = useState<Path[] | null>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });
  const rootRef = useRef<HTMLDivElement>(null);
  const lastRef = useRef<HTMLButtonElement | null>(null); // focus returns here after "Show all connections"
  const seen = useInView(rootRef, { once: true, margin: '0px 0px -15% 0px' });
  const reduce = useReducedMotion();

  const measure = useCallback(() => {
    const root = rootRef.current;
    if (!root) return;
    const r = root.getBoundingClientRect();
    const at = (anchor: string) => {
      const b = root.querySelector(`[data-anchor="${anchor}"]`)!.getBoundingClientRect();
      return { x: b.left + b.width / 2 - r.left, y: b.top + b.height / 2 - r.top };
    };
    setBox({ w: r.width, h: r.height });
    setPaths(
      INFORMS.map((l) => {
        const a = at(`d:${l.from}`);
        const b = at(`p:${l.to}`);
        const dx = (b.x - a.x) * 0.55;
        return { key: `${l.from}>${l.to}`, d: `M${a.x},${a.y} C${a.x + dx},${a.y} ${b.x - dx},${b.y} ${b.x},${b.y}` };
      })
    );
  }, []);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    document.fonts?.ready.then(measure);
    return () => ro.disconnect();
  }, [measure]);

  const focus = hover ?? sel;
  const lineOn = (i: number) => !!focus && touches(INFORMS[i], focus);
  const nodeState = (s: NonNullable<Sel>) => {
    if (!focus) return undefined;
    if (same(s, focus)) return 'focus';
    const linked = INFORMS.some((l) => touches(l, focus) && (s.kind === 'd' ? l.from === s.id : l.to === s.id));
    return linked ? 'linked' : 'dim';
  };
  const press = (s: NonNullable<Sel>, el: HTMLButtonElement) => {
    lastRef.current = el;
    setSel((cur) => (same(cur, s) ? null : s));
  };
  const hoverProps = (s: NonNullable<Sel>) => ({
    onPointerEnter: (e: PointerEvent) => e.pointerType === 'mouse' && setHover(s),
    onPointerLeave: (e: PointerEvent) => e.pointerType === 'mouse' && setHover(null),
  });
  const draw = reduce ? 1 : seen ? 1 : 0;

  const links = sel ? INFORMS.filter((l) => touches(l, sel)) : [];

  return (
    <div className="dm-wrap">
      <div className="dm" ref={rootRef} data-focus={focus ? '' : undefined}>
        {paths && (
          <svg className="dm-svg" width={box.w} height={box.h} viewBox={`0 0 ${box.w} ${box.h}`} aria-hidden="true" focusable="false">
            {paths.map((p, i) => (
              <motion.path
                key={p.key}
                d={p.d}
                className="dm-line"
                data-dim={focus && !lineOn(i) ? '' : undefined}
                initial={{ pathLength: reduce ? 1 : 0 }}
                animate={{ pathLength: draw }}
                transition={{ duration: reduce ? 0 : 1.1, delay: reduce ? 0 : 0.15 + i * 0.09, ease }}
              />
            ))}
            {focus &&
              paths.map((p, i) =>
                lineOn(i) ? (
                  <motion.path
                    key={`${focus.kind}:${focus.id}:${p.key}`}
                    d={p.d}
                    className="dm-line dm-line--on"
                    initial={{ pathLength: reduce ? 1 : 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: reduce ? 0 : 0.55, ease }}
                  />
                ) : null
              )}
          </svg>
        )}

        <div className="dm-col dm-col--d">
          <p className="dm-head" id="dm-d">
            Engineering disciplines
          </p>
          <ul aria-labelledby="dm-d">
            {DISCIPLINES.map((d) => {
              const s = { kind: 'd', id: d.id } as const;
              return (
                <li key={d.id}>
                  <button type="button" className="dm-node" data-state={nodeState(s)} aria-pressed={same(sel, s)} onClick={(e) => press(s, e.currentTarget)} {...hoverProps(s)}>
                    <span className="dm-label">{d.label}</span>
                    <span className="dm-dot" data-anchor={`d:${d.id}`} aria-hidden="true" />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="dm-col dm-col--p">
          <p className="dm-head" id="dm-p">
            Portfolio
          </p>
          <ul aria-labelledby="dm-p">
            {PORTFOLIO_NODES.map((p) => {
              const s = { kind: 'p', id: p.id } as const;
              return (
                <li key={p.id}>
                  <button type="button" className="dm-node" data-state={nodeState(s)} aria-pressed={same(sel, s)} onClick={(e) => press(s, e.currentTarget)} {...hoverProps(s)}>
                    <span className="dm-dot" data-anchor={`p:${p.id}`} aria-hidden="true" />
                    <span className="dm-text">
                      <span className="dm-label">{p.label}</span>
                      <span className="dm-role">
                        <i style={{ background: p.swatch }} aria-hidden="true" />
                        {p.role}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="dm-note" aria-live="polite">
        {sel ? (
          <>
            <p className="dm-note-head">
              {sel.kind === 'd' ? (
                <>
                  <strong>{dName(sel.id)}</strong> informs
                </>
              ) : (
                <>
                  <strong>{pName(sel.id)}</strong> draws on
                </>
              )}
            </p>
            <ul>
              {links.map((l) => (
                <li key={`${l.from}>${l.to}`}>
                  <span>{sel.kind === 'd' ? pName(l.to) : dName(l.from)}</span>
                  {l.why}
                </li>
              ))}
            </ul>
            <button
              type="button"
              className="dm-reset"
              onClick={() => {
                setSel(null);
                lastRef.current?.focus();
              }}
            >
              Show all connections
            </button>
          </>
        ) : (
          <p className="dm-note-head">Select a discipline or a product to trace its connections.</p>
        )}
      </div>
    </div>
  );
}
