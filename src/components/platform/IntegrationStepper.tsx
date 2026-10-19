import { useState, type CSSProperties } from 'react';
import { motion, MotionConfig } from 'motion/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { INTEGRATION_STATIONS, INTEGRATION_STEPS } from '@/data/platform';
import './stepper.css';

type StepId = (typeof INTEGRATION_STEPS)[number]['id'];

export default function IntegrationStepper() {
  const [step, setStep] = useState<StepId>('observe');
  const index = INTEGRATION_STEPS.findIndex((s) => s.id === step);
  const current = INTEGRATION_STEPS[index];
  const active: readonly number[] = current.stations;
  const head = active[0];
  const stationState = (i: number) => (active.includes(i) ? 'active' : i < head ? 'done' : 'next');
  const summary = `Signal path: ${INTEGRATION_STATIONS.map((s) => s.label).join(', ')}. Step ${index + 1}, ${current.verb}: ${current.carries} at ${active
    .map((i) => INTEGRATION_STATIONS[i].label)
    .join(' and ')}.`;

  return (
    <MotionConfig reducedMotion="user">
      <Tabs value={step} onValueChange={(v) => setStep(v as StepId)} className="steps">
        <TabsList variant="line" aria-label="Integration steps" className="steps-list" style={{ '--tab-accent': 'var(--c-cobalt)' } as CSSProperties}>
          {INTEGRATION_STEPS.map((s, i) => (
            <TabsTrigger key={s.id} value={s.id} className="steps-trigger">
              <span className="steps-trigger-n" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              {s.verb}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="steps-track" role="img" aria-label={summary} style={{ '--p': head / (INTEGRATION_STATIONS.length - 1) } as CSSProperties}>
          <span className="steps-rail" aria-hidden="true">
            <span className="steps-rail-fill" />
          </span>
          {INTEGRATION_STATIONS.map((st, i) => (
            <div key={st.label} className="steps-station" data-state={stationState(i)} data-optional={i === 4 ? '' : undefined}>
              <span className="steps-marker">
                {i === head && (
                  <motion.span layoutId="steps-packet" className="steps-packet" transition={{ type: 'tween', duration: 0.55, ease: [0.45, 0.05, 0.25, 1] }}>
                    {current.carries}
                  </motion.span>
                )}
              </span>
              <span className="steps-station-label">{st.label}</span>
              <span className="steps-station-detail">{st.detail}</span>
            </div>
          ))}
        </div>

        {INTEGRATION_STEPS.map((s, i) => (
          <TabsContent key={s.id} value={s.id} forceMount className="steps-panel data-[state=inactive]:hidden">
            <div className="steps-panel-main">
              <p className="steps-panel-n">
                Step {String(i + 1).padStart(2, '0')} · {s.verb}
              </p>
              <h3 className="h3">{s.title}</h3>
              <p className="steps-panel-body">{s.body}</p>
            </div>
            <div className="steps-panel-side">
              <p className="steps-carries">
                <span className="steps-tag-label">Passes on</span> {s.carries}
              </p>
              <p className="steps-tag-label">{s.tagLabel}</p>
              <ul className="steps-tags">
                {s.tags.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              <button
                type="button"
                className="steps-next"
                onClick={() => setStep(INTEGRATION_STEPS[(i + 1) % INTEGRATION_STEPS.length].id)}
              >
                {i < INTEGRATION_STEPS.length - 1 ? `Next: ${INTEGRATION_STEPS[i + 1].verb}` : 'Back to the first step'}
                <span aria-hidden="true">{i < INTEGRATION_STEPS.length - 1 ? '→' : '↺'}</span>
              </button>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </MotionConfig>
  );
}
