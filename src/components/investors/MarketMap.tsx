import { createRef, useEffect, useMemo, useRef, useState, type RefObject } from 'react';
import { useInView, useReducedMotion } from 'motion/react';
import { AnimatedBeam } from '@/components/ui/animated-beam';
import { BUYERS, COMMERCIAL, type OfferingId } from '@/data/investors';

// Hex needed for SVG gradient stops (CSS vars are not reliable in presentation attributes).
const HEX = { battery: '#087F6B', pmg: '#185ADB', evo: '#F07831', neutral: '#55667A' } as const;
const pcClass = (id: OfferingId) => `inv-pc-${id === 'tools' ? 'neutral' : id}`;

/** (a) Portfolio-to-market diagram: select an offering to trace product → buyer → paid entry → expansion. */
export default function MarketMap() {
  const [active, setActive] = useState<OfferingId>('battery');
  const [mounted, setMounted] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  const inView = useInView(container, { margin: '0px 0px -15% 0px' });
  const reduce = useReducedMotion();
  useEffect(() => setMounted(true), []);

  const refs = useMemo(() => {
    const ids = [...COMMERCIAL.flatMap((o) => [`o-${o.id}`, `e-${o.id}`, `x-${o.id}`]), ...BUYERS.map((b) => `b-${b.id}`)];
    return Object.fromEntries(ids.map((id) => [id, createRef<HTMLElement>()])) as Record<string, RefObject<HTMLElement | null>>;
  }, []);

  const o = COMMERCIAL.find((c) => c.id === active)!;
  const color = HEX[o.tone];
  const beams: [string, string][] = [
    ...o.buyers.map((b): [string, string] => [`o-${o.id}`, `b-${b}`]),
    ...o.buyers.map((b): [string, string] => [`b-${b}`, `e-${o.id}`]),
    [`e-${o.id}`, `x-${o.id}`],
  ];

  return (
    <div className="inv-map-wrap">
      <div ref={container} className="inv-map" role="group" aria-label="Portfolio-to-market diagram">
        <div className="inv-map-col inv-map-col--offer">
          <p className="inv-map-colhead">
            <b>01</b> Offering
          </p>
          <ul className="inv-map-list" aria-label="Choose an offering to trace">
            {COMMERCIAL.map((c) => (
              <li key={c.id} data-active={c.id === active}>
                <button
                  ref={refs[`o-${c.id}`] as RefObject<HTMLButtonElement>}
                  type="button"
                  className={`inv-map-node inv-map-offer ${pcClass(c.id)}`}
                  data-active={c.id === active}
                  aria-pressed={c.id === active}
                  onClick={() => setActive(c.id)}
                >
                  {c.short}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="inv-map-col">
          <p className="inv-map-colhead">
            <b>02</b> Potential buyer
          </p>
          <ul className="inv-map-list">
            {BUYERS.map((b) => {
              const on = o.buyers.includes(b.id);
              const offers = COMMERCIAL.filter((c) => c.buyers.includes(b.id));
              return (
                <li key={b.id} data-active={on}>
                  <div ref={refs[`b-${b.id}`] as RefObject<HTMLDivElement>} className={`inv-map-node ${pcClass(active)}`} data-active={on}>
                    <span>
                      {b.label}
                      {b.detail && <span className="inv-map-detail"> · {b.detail}</span>}
                    </span>
                    <span className="inv-map-dots" role="img" aria-label={`Potential buyer in ${offers.length} of ${COMMERCIAL.length} proposed paths`}>
                      {offers.map((c) => (
                        <i key={c.id} className={pcClass(c.id)} aria-hidden="true" />
                      ))}
                      <span aria-hidden="true">
                        {offers.length} of {COMMERCIAL.length} paths
                      </span>
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="inv-map-col">
          <p className="inv-map-colhead">
            <b>03</b> Paid entry
          </p>
          <ul className="inv-map-list">
            {COMMERCIAL.map((c) => (
              <li key={c.id} data-active={c.id === active}>
                <div ref={refs[`e-${c.id}`] as RefObject<HTMLDivElement>} className={`inv-map-node ${pcClass(c.id)}`} data-active={c.id === active}>
                  {c.entryShort}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="inv-map-col">
          <p className="inv-map-colhead">
            <b>04</b> Expansion
          </p>
          <ul className="inv-map-list">
            {COMMERCIAL.map((c) => (
              <li key={c.id} data-active={c.id === active}>
                <div ref={refs[`x-${c.id}`] as RefObject<HTMLDivElement>} className={`inv-map-node ${pcClass(c.id)}`} data-active={c.id === active}>
                  {c.expansionShort}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {mounted &&
          (inView || reduce) &&
          beams.map(([from, to]) => (
            <AnimatedBeam
              key={`${active}-${from}-${to}`}
              className="inv-map-beam"
              containerRef={container}
              fromRef={refs[from]}
              toRef={refs[to]}
              pathColor={color}
              pathWidth={2}
              pathOpacity={reduce ? 0.8 : 0.45}
              gradientStartColor={color}
              gradientStopColor={color}
              duration={reduce ? 0.01 : 2.8}
              repeat={reduce ? 0 : Infinity}
              repeatDelay={0.6}
            />
          ))}
      </div>

      <div className="inv-map-live" aria-live="polite">
        <span className="mono">Traced path</span>
        <span>
          <strong>{o.offering}</strong> → {o.buyer} → {o.entry} → {o.expansion}
        </span>
      </div>
    </div>
  );
}
