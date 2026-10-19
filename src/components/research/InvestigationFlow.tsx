import { useRef, useState } from 'react';
import { Tabs } from 'radix-ui';
import { useInView } from 'motion/react';
import { Check, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { INVESTIGATION_STEPS } from '@/data/research';

// Engineering Intelligence: a step-through of the proposed investigation workflow. The evidence board is a
// schematic (no real data): each step adds one evidence lane on a shared release timeline, step 4 links them at
// the first failure, step 5 re-tests after an approved correction. All step text is server-rendered.

const N1 = 36; // release N+1 boundary (% of track)
const FIX = 74; // approved correction boundary
const CURSOR = 43; // first failure after N+1

const TESTS = [
  { x: 6, ok: true }, { x: 15, ok: true }, { x: 24, ok: true }, { x: 31, ok: true },
  { x: 43, ok: false }, { x: 51, ok: true }, { x: 59, ok: false }, { x: 67, ok: false },
  { x: 81, ok: true }, { x: 89, ok: true }, { x: 96, ok: true },
];
const LOGS = Array.from({ length: 32 }, (_, i) => {
  const x = 2.5 + i * 3.05;
  return { x, event: x > 40 && x < 70 && i % 2 === 0, h: 9 + ((i * 7) % 5) * 2 };
});
const SOURCES = ['Release context', 'Test results', 'System logs'];

export default function InvestigationFlow() {
  const [step, setStep] = useState(0);
  const boardRef = useRef<HTMLElement>(null);
  const inView = useInView(boardRef);
  const last = INVESTIGATION_STEPS.length - 1;
  const go = (i: number) => setStep(Math.max(0, Math.min(last, i)));
  const after = (x: number) => x > FIX;
  const fixed = step >= 4;

  return (
    <Tabs.Root value={INVESTIGATION_STEPS[step].id} onValueChange={(v) => go(INVESTIGATION_STEPS.findIndex((s) => s.id === v))} className="ei">
      <Tabs.List className="ei-rail" aria-label="Investigation workflow steps">
        {INVESTIGATION_STEPS.map((s, i) => (
          <Tabs.Trigger key={s.id} value={s.id} className="ei-step" data-done={i < step ? '' : undefined}>
            <span className="ei-step-num">{String(i + 1).padStart(2, '0')}</span>
            <span className="ei-step-label">{s.label}</span>
          </Tabs.Trigger>
        ))}
        <span className="ei-rail-fill" style={{ transform: `scaleX(${step / last})` }} aria-hidden="true" />
      </Tabs.List>

      <div className="ei-body">
        <figure className="ei-board" ref={boardRef} data-step={step} data-flow={inView ? 'on' : 'off'} aria-hidden="true">
          <div className="ei-sources">
            <span className="ei-sources-title">Evidence linked</span>
            {SOURCES.map((s, i) => (
              <span key={s} className="ei-source" data-on={step >= i ? '' : undefined}>
                {step >= i ? <Check strokeWidth={2.5} /> : <span className="ei-dash" />}
                {s}
              </span>
            ))}
          </div>

          <div className="ei-axis">
            <span style={{ left: 0, width: `${N1}%` }}>Release N</span>
            <span style={{ left: `${N1}%`, width: `${FIX - N1}%` }}>Release N+1</span>
            <span style={{ left: `${FIX}%`, width: `${100 - FIX}%` }} data-on={fixed ? '' : undefined}>
              With correction
            </span>
          </div>

          <div className="ei-lanes">
            <div className="ei-zone ei-zone--diverge" data-on={step >= 3 ? '' : undefined} style={{ left: `${N1}%`, width: `${FIX - N1}%` }} />
            <div className="ei-zone ei-zone--fixed" data-on={fixed ? '' : undefined} style={{ left: `${FIX}%`, width: `${100 - FIX}%` }} />
            <span className="ei-boundary" style={{ left: `${N1}%` }} />
            <span className="ei-boundary ei-boundary--fix" data-on={fixed ? '' : undefined} style={{ left: `${FIX}%` }} />

            <div className="ei-lane" data-on="">
              <span className="ei-lane-label">Release changes</span>
              <div className="ei-track">
                {[-1.6, 0, 1.6].map((o, i) => (
                  <i key={o} className="ei-change" style={{ left: `${N1 + o}%`, transitionDelay: `${i * 60}ms` }} data-hit={step >= 3 && o === 0 ? '' : undefined} />
                ))}
                <i className="ei-change ei-change--fix" style={{ left: `${FIX}%` }} data-on={fixed ? '' : undefined} />
              </div>
            </div>

            <div className="ei-lane" data-on={step >= 1 ? '' : undefined}>
              <span className="ei-lane-label">Test evidence</span>
              <div className="ei-track">
                {TESTS.map((t, i) => (
                  <i
                    key={t.x}
                    className="ei-test"
                    data-ok={t.ok ? '' : undefined}
                    data-on={step >= 1 && (!after(t.x) || fixed) ? '' : undefined}
                    data-hit={step >= 3 && t.x === CURSOR ? '' : undefined}
                    style={{ left: `${t.x}%`, transitionDelay: `${(after(t.x) ? i - 8 : i) * 45}ms` }}
                  >
                    {t.ok ? <Check strokeWidth={3} /> : <X strokeWidth={3} />}
                  </i>
                ))}
              </div>
            </div>

            <div className="ei-lane" data-on={step >= 2 ? '' : undefined}>
              <span className="ei-lane-label">Connected system logs</span>
              <div className="ei-track">
                {LOGS.map((l, i) => (
                  <i
                    key={l.x}
                    className="ei-log"
                    data-event={l.event ? '' : undefined}
                    data-on={step >= 2 && (!after(l.x) || fixed) ? '' : undefined}
                    style={{ left: `${l.x}%`, height: l.event ? 24 : l.h, transitionDelay: `${(after(l.x) ? i - 24 : i) * 18}ms` }}
                  />
                ))}
              </div>
            </div>

            <div className="ei-cursor" data-on={step >= 3 ? '' : undefined} style={{ left: `${CURSOR}%` }}>
              <i className="ei-pulse" />
              <i className="ei-pulse" />
            </div>
          </div>

          <div className="ei-finding" data-on={step >= 3 ? '' : undefined} data-fixed={fixed ? '' : undefined}>
            {fixed ? (
              <>
                <strong>Correction verified</strong>
                <span>The tests that failed after release N+1 pass with the approved correction. The linked evidence is kept for the next investigation.</span>
              </>
            ) : step >= 3 ? (
              <>
                <strong>Likely explanation · awaiting engineer review</strong>
                <span>Failures start after release N+1 and coincide with connectivity transitions in the logs.</span>
              </>
            ) : (
              <>
                <strong>Investigation not started</strong>
                <span>Evidence is still being linked.</span>
              </>
            )}
          </div>
          <figcaption className="ei-caption">Schematic workflow illustration · no real test data</figcaption>
        </figure>

        <div className="ei-side">
          {INVESTIGATION_STEPS.map((s, i) => (
            <Tabs.Content key={s.id} value={s.id} forceMount className="ei-panel">
              <p className="ei-kicker">Step {i + 1} of 5</p>
              <h3 className="h3">{s.label}</h3>
              <dl className="ei-facts">
                <div>
                  <dt>Evidence</dt>
                  <dd>{s.evidence}</dd>
                </div>
                <div>
                  <dt>Engineering responsibility</dt>
                  <dd>{s.responsibility}</dd>
                </div>
                <div>
                  <dt>Proposed assistance</dt>
                  <dd>{s.assist}</dd>
                </div>
              </dl>
            </Tabs.Content>
          ))}
          {/* aria-disabled (not disabled) keeps focus on the button at either end of the sequence */}
          <div className="ei-nav">
            <button type="button" className="ei-btn" onClick={() => go(step - 1)} aria-disabled={step === 0}>
              <ChevronLeft aria-hidden="true" /> Previous
            </button>
            <span className="ei-count" aria-hidden="true">
              {step + 1} / {last + 1}
            </span>
            <button type="button" className="ei-btn ei-btn--next" onClick={() => go(step + 1)} aria-disabled={step === last}>
              Next step <ChevronRight aria-hidden="true" />
            </button>
            <p className="visually-hidden" aria-live="polite">
              Step {step + 1} of {last + 1}: {INVESTIGATION_STEPS[step].label}
            </p>
          </div>
        </div>
      </div>
    </Tabs.Root>
  );
}
