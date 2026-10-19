import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useStory, type BatteryScenario } from '@/lib/storyStore';

// Scene 04 — "From raw signals to useful intelligence". Source: Battery AI capabilities + proof lines.
const SCENARIOS: { id: BatteryScenario; tab: string; signals: string; evaluates: string; outcome: string; evidence: string; note?: string }[] = [
  {
    id: 'health',
    tab: 'Battery health',
    signals: 'Cell voltages, pack current, temperatures and approved operating history.',
    evaluates: 'Ageing patterns and state-of-health estimates, with a confidence value — and an explicit flag when the data is insufficient.',
    outcome: 'Clearer battery-health guidance and better-informed service planning.',
    evidence: 'Accuracy on batteries and operating conditions held out of model development, checked against independent reference measurements.',
  },
  {
    id: 'charging',
    tab: 'Charging readiness',
    signals: 'Charge state, battery temperature, permitted charge limits, charger/session status and departure intent.',
    evaluates: 'Session behaviour and readiness for the next departure, within approved charging limits.',
    outcome: 'A permitted charging or readiness recommendation that fits the next journey.',
    evidence: 'Completion and readiness rates, false recommendations and energy impact compared with today’s behaviour.',
  },
  {
    id: 'thermal',
    tab: 'Thermal behaviour',
    signals: 'Temperature trends alongside accessible load and ambient context.',
    evaluates: 'Patterns that justify an approved cooling or service evaluation.',
    outcome: 'An understandable explanation when temperature limits charging or performance.',
    evidence: 'Detection of known events, false-alert rate and independently verified thermal outcomes.',
  },
  {
    id: 'cells',
    tab: 'Cell patterns',
    signals: 'Cell-level voltages and temperatures — only where the pack exposes them.',
    evaluates: 'Imbalance trends and unusual cell behaviour.',
    outcome: 'Earlier, better-evidenced service decisions.',
    evidence: 'Cell-event detection, data quality and service evidence that a technician can act on.',
    note: 'The pack’s sensing and balancing hardware define what can be acted on. Software does not create independent charging paths per cell.',
  },
  {
    id: 'power',
    tab: 'Available power',
    signals: 'Present conditions, temperatures, state estimates and the BMS operating limits.',
    evaluates: 'Available charge and discharge power under current conditions — always inside the BMS and power-system limits.',
    outcome: 'Fewer surprises when power is temporarily limited.',
    evidence: 'Estimation error, limit compliance and usefulness over the existing estimate.',
  },
];

const FLOW = ['Signals', 'Data quality', 'Edge interpretation', 'Reviewable insight', 'Permitted recommendation', 'Verified outcome'];

export default function BatteryScenarios() {
  const [value, setValue] = useState<BatteryScenario>('health');
  const set = useStory((s) => s.set);
  const reduce = useReducedMotion();
  return (
    <div className="grid gap-5">
      <ol className="flow-chain" aria-label="How an insight earns its way to a decision">
        {FLOW.map((step, i) => (
          <motion.li
            key={`${value}-${step}`}
            initial={reduce ? false : { opacity: 0.25, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.11, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{ '--i': i } as React.CSSProperties}
          >
            <span className="flow-n">{String(i + 1).padStart(2, '0')}</span>
            {step}
          </motion.li>
        ))}
      </ol>
      <Tabs
        value={value}
        onValueChange={(v) => {
          setValue(v as BatteryScenario);
          set({ battery: v as BatteryScenario });
        }}
        className="gap-4"
      >
        <TabsList style={{ '--tab-accent': 'var(--p-battery)' } as React.CSSProperties} aria-label="Battery scenarios">
          {SCENARIOS.map((s) => (
            <TabsTrigger key={s.id} value={s.id} className="px-3.5 text-[0.85rem]">
              {s.tab}
            </TabsTrigger>
          ))}
        </TabsList>
        {SCENARIOS.map((s) => (
          <TabsContent key={s.id} value={s.id} forceMount className="data-[state=inactive]:hidden" aria-live="polite">
            <dl className="scenario-dl">
              <div>
                <dt>Signals</dt>
                <dd>{s.signals}</dd>
              </div>
              <div>
                <dt>The software evaluates</dt>
                <dd>{s.evaluates}</dd>
              </div>
              <div>
                <dt>Customer outcome</dt>
                <dd>{s.outcome}</dd>
              </div>
              <div className="is-evidence">
                <dt>Evidence the pilot must produce</dt>
                <dd>{s.evidence}</dd>
              </div>
            </dl>
            {s.note && <p className="note mt-3">{s.note}</p>}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
