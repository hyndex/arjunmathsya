import { createRef, useMemo, useRef, useState, type CSSProperties, type RefObject } from 'react';
import { useInView, useReducedMotion } from 'motion/react';
import { AnimatedBeam } from '@/components/ui/animated-beam';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FLOW_LOOP, FLOW_NOTE, FLOW_STAGES, PMG_WORKFLOWS, type WorkflowId } from '@/data/pmg';
import './workflow.css';

const IDS = Object.keys(PMG_WORKFLOWS) as WorkflowId[];
// SVG gradient stops need literal colours; these mirror src/styles/tokens.css.
const HEX = { battery: '#087f6b', module: '#55667a', reference: '#8494a7', pmg: '#185adb', aqua: '#85ddd3' };

type Refs = { box: RefObject<HTMLDivElement | null>; nodes: RefObject<HTMLLIElement | null>[]; loopFrom: RefObject<HTMLSpanElement | null>; loopTo: RefObject<HTMLSpanElement | null> };

/** Event → context → policy → recommendation → verified result, with the result written back to vehicle memory. */
function Beams({ refs, source, reduce }: { refs: Refs; source: keyof typeof HEX; reduce: boolean }) {
  const common = {
    containerRef: refs.box,
    pathOpacity: reduce ? 0.7 : 0.3,
    pathWidth: 2,
    duration: reduce ? 0 : 3.8,
    repeat: reduce ? 0 : Infinity,
  };
  return (
    <div className="wf-beams" aria-hidden="true">
      {[0, 1, 2, 3].map((i) => (
        <AnimatedBeam
          key={i}
          {...common}
          fromRef={refs.nodes[i]}
          toRef={refs.nodes[i + 1]}
          pathColor={i === 0 ? HEX[source] : HEX.pmg}
          gradientStartColor={i === 0 ? HEX[source] : HEX.pmg}
          gradientStopColor={HEX.aqua}
        />
      ))}
      <AnimatedBeam
        {...common}
        fromRef={refs.loopFrom}
        toRef={refs.loopTo}
        curvature={-84}
        reverse
        delay={reduce ? 0 : 1.1}
        pathColor={HEX.pmg}
        gradientStartColor={HEX.pmg}
        gradientStopColor={HEX.aqua}
      />
    </div>
  );
}

export default function WorkflowFlow() {
  const [wf, setWf] = useState<WorkflowId>('charging');
  const reduce = useReducedMotion() ?? false;
  const rootRef = useRef<HTMLDivElement>(null);
  const live = useInView(rootRef, { amount: 0.2 }); // pulses run only while the flow is on screen
  const refs = useMemo(
    () =>
      Object.fromEntries(
        IDS.map((id) => [
          id,
          {
            box: createRef<HTMLDivElement>(),
            nodes: Array.from({ length: 5 }, () => createRef<HTMLLIElement>()),
            loopFrom: createRef<HTMLSpanElement>(),
            loopTo: createRef<HTMLSpanElement>(),
          },
        ])
      ) as Record<WorkflowId, Refs>,
    []
  );

  return (
    <div className="wf" ref={rootRef} data-live={live ? '' : undefined}>
      <Tabs value={wf} onValueChange={(v) => setWf(v as WorkflowId)} className="wf-tabs">
        <div className="wf-bar">
          <TabsList aria-label="Candidate PMG workflows" style={{ '--tab-accent': 'var(--p-pmg)' } as CSSProperties}>
            {IDS.map((id) => (
              <TabsTrigger key={id} value={id}>
                {PMG_WORKFLOWS[id].tab}
              </TabsTrigger>
            ))}
          </TabsList>
          <p className="wf-note">{FLOW_NOTE}</p>
        </div>

        {IDS.map((id) => {
          const w = PMG_WORKFLOWS[id];
          const r = refs[id];
          return (
            <TabsContent key={id} value={id} forceMount className="wf-panel">
              <header className="wf-head">
                <p className="wf-number">Illustrative workflow · {w.number}</p>
                <h3 className="wf-title">{w.title}</h3>
                <p className="wf-intro">{w.intro}</p>
              </header>

              <div className="wf-canvas" ref={r.box}>
                {id === wf && live && <Beams refs={r} source={w.source} reduce={reduce} />}
                <ol className="wf-flow">
                  {w.stages.map((st, i) => (
                    <li
                      key={FLOW_STAGES[i]}
                      ref={r.nodes[i]}
                      className="wf-node"
                      data-stage={i}
                      data-source={i === 0 ? w.source : undefined}
                      style={{ '--i': i } as CSSProperties}
                    >
                      <span className="wf-node-k">
                        <span className="wf-node-n">{String(i + 1).padStart(2, '0')}</span> {FLOW_STAGES[i]}
                      </span>
                      {i === 0 && <span className="wf-node-src">{w.sourceLabel}</span>}
                      <h4 className="wf-node-title">{st.title}</h4>
                      <p className="wf-node-body">{st.body}</p>
                      {i === 1 && <span className="wf-anchor" ref={r.loopTo} aria-hidden="true" />}
                      {i === 4 && <span className="wf-anchor" ref={r.loopFrom} aria-hidden="true" />}
                      {i < 4 && <span className="wf-pulse" aria-hidden="true" />}
                    </li>
                  ))}
                </ol>
                <p className="wf-loop">
                  <span aria-hidden="true">↺ </span>
                  {FLOW_LOOP}
                </p>
              </div>

              <p className="wf-proof">
                <span className="wf-proof-k">Proof to earn</span>
                {w.proof}
              </p>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
