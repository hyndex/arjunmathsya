import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Battery3D } from '@/components/three/Lazy3D';
import type { BatteryFocus } from '@/components/three/BatteryPackScene';
import { CAPABILITIES_HEAD, SCENARIOS, type TraceKind } from '@/data/battery';
import BatteryCutawaySvg from './BatteryCutawaySvg';
import { trace, TRACE_H, TRACE_W } from './traces';

// Signature: one pack, six proposed capabilities. The pack responds to the selected capability; the readout shows
// the signals it reads (illustrative traces), what the software interprets, the outcomes and the proof required.

function Trace({ kind }: { kind: TraceKind }) {
  return (
    <svg className="bx-trace" viewBox={`0 0 ${TRACE_W} ${TRACE_H}`} preserveAspectRatio="none" aria-hidden="true" focusable="false">
      {trace(kind).map((l, i) => (
        <path key={i} d={l.d} className={`bx-trace-${l.role}`} vectorEffect="non-scaling-stroke" />
      ))}
    </svg>
  );
}

// ponytail: shared tabs.tsx does not forward `orientation` to Radix, so ArrowUp/Down are added here for the vertical
// list. Skipped when Radix already handled the key (defaultPrevented); drop once tabs.tsx forwards orientation.
function verticalKeys(e: KeyboardEvent<HTMLDivElement>) {
  if (e.defaultPrevented || (e.key !== 'ArrowDown' && e.key !== 'ArrowUp')) return;
  const tabs = [...e.currentTarget.querySelectorAll<HTMLElement>('[role="tab"]')];
  const i = tabs.indexOf(document.activeElement as HTMLElement);
  if (i < 0) return;
  e.preventDefault();
  tabs[(i + (e.key === 'ArrowDown' ? 1 : tabs.length - 1)) % tabs.length].focus(); // Radix selects on focus
}

const packLabel = (s: (typeof SCENARIOS)[number]) =>
  `Schematic battery-pack cutaway (cell count and arrangement are schematic): tray, cooling plate, modules and cells, sensing harness, BMS, HV junction and terminals, and the vehicle interface. In focus for ${s.tab.toLowerCase()}: ${s.parts.join(', ')}.`;

export default function PackExplorer() {
  const [focus, setFocus] = useState<BatteryFocus>('health');
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const seen = useInView(rootRef, { once: true, amount: 0.25 });
  const live = useInView(stageRef, { amount: 0.2 });
  // Approach the pack as the section scrolls into view (bound after mount, so SSR and reduced motion stay untransformed).
  const { scrollYProgress } = useScroll({ target: stageRef, offset: ['start end', 'center center'] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.86, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [64, 0]);
  const active = SCENARIOS.find((s) => s.id === focus) ?? SCENARIOS[0];

  return (
    <Tabs
      ref={rootRef}
      value={focus}
      onValueChange={(v) => setFocus(v as BatteryFocus)}
      orientation="vertical"
      className="bx-explorer"
      data-inview={seen ? '' : undefined}
    >
      <div className="bx-select">
        <p className="bx-k" id="bx-select-label">Select a capability</p>
        <TabsList className="bx-tabs" aria-labelledby="bx-select-label" onKeyDown={verticalKeys} style={{ '--tab-accent': 'var(--p-battery)' } as CSSProperties}>
          {SCENARIOS.map((s) => (
            <TabsTrigger key={s.id} value={s.id} className="bx-tab">
              <span className="bx-tab-n">{s.n}</span>
              <span className="bx-tab-t">{s.tab}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      <div className="bx-stage-col">
        <div className="bx-stage" ref={stageRef}>
          <motion.div className="bx-stage-inner" style={mounted && !reduce ? { scale, y } : undefined}>
            <Battery3D
              focus={focus}
              className="bx-3d"
              label={packLabel(active)}
              fallback={<BatteryCutawaySvg focus={focus} label={packLabel(active)} live={live} />}
            />
          </motion.div>
        </div>
        <div className="bx-stage-foot">
          <p className="bx-infocus" aria-live="polite">
            <span className="bx-k">In focus</span>
            {active.parts.map((p) => (
              <span key={p} className="bx-part">{p}</span>
            ))}
          </p>
          <p className="fineprint">{CAPABILITIES_HEAD.visual}</p>
        </div>
      </div>

      {SCENARIOS.map((s) => (
        <TabsContent key={s.id} value={s.id} forceMount className="bx-readout data-[state=inactive]:hidden">
          <div className="bx-ro-head">
            <p className="bx-k">
              {s.n} / {s.short}
            </p>
            <h3 className="h3">{s.title}</h3>
          </div>

          <div className="bx-ro-signals">
            <p className="bx-ro-k">Accessible signals</p>
            <ul className="bx-channels">
              {s.channels.map((c, i) => (
                <li key={c.label}>
                  <span className="bx-ch-label">
                    <b>CH{i + 1}</b>
                    {c.label}
                  </span>
                  <span className="bx-ch-plot" style={{ '--d': `${i * 0.14}s` } as CSSProperties}>
                    <Trace kind={c.kind} />
                    <i className="bx-curtain" aria-hidden="true" />
                  </span>
                </li>
              ))}
            </ul>
            <p className="fineprint">{CAPABILITIES_HEAD.traces}</p>
          </div>

          <div className="bx-ro-interp">
            <p className="bx-ro-k">The software layer interprets</p>
            <p>{s.interprets}</p>
            <ul className="bx-ro-output" aria-label="Outputs">
              {s.output.map((o) => (
                <li key={o}>{o}</li>
              ))}
            </ul>
          </div>

          <dl className="bx-ro-out">
            <div>
              <dt>Customer outcome</dt>
              <dd>{s.customer}</dd>
            </div>
            <div>
              <dt>OEM outcome</dt>
              <dd>{s.oem}</dd>
            </div>
          </dl>

          <div className="bx-ro-proof">
            <p className="bx-ro-k">Evaluation &amp; proof needed</p>
            <p>{s.proof}</p>
            {s.note && <p className="bx-ro-note">{s.note}</p>}
            {s.link && (
              <a className="link-arrow" href={s.link.href}>
                {s.link.label} <ArrowRight size={16} aria-hidden="true" />
              </a>
            )}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
