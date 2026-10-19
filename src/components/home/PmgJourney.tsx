import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useStory } from '@/lib/storyStore';

// Scene 08 — an illustrative charging-readiness decision. Source: PMG charging-readiness workflow + permissions model.
const STEPS = [
  { t: 'Interpret module signals', d: 'Battery & Charging AI reports a warm pack and a health trend with its confidence; the charger reports the session state.', screen: { k: 'Battery', v: 'Warm after a long drive', s: 'Module insight received · confidence shown' } },
  { t: 'Add vehicle & journey context', d: 'PMG joins the insight with the planned 07:30 departure, the charging opportunity overnight and the customer’s permissions.', screen: { k: 'Departure', v: '07:30 tomorrow', s: 'Charging available overnight' } },
  { t: 'Evaluate a recommendation', d: 'A decision policy checks which actions are permitted for this vehicle and customer — and which belong to validated vehicle functions.', screen: { k: 'Plan', v: 'Schedule charging · precondition before departure', s: 'Within approved interfaces' } },
  { t: 'Present guidance or request an approved action', d: 'The customer sees the plan and confirms. PMG requests scheduling or preconditioning; the validated charging and thermal functions decide and execute.', screen: { k: 'Awaiting confirmation', v: 'Use the readiness plan?', s: 'You can change this at any time' } },
  { t: 'Check the result', d: 'Before departure, PMG verifies whether the vehicle actually reached the planned readiness — not just whether a command was sent.', screen: { k: 'Ready', v: 'Readiness plan completed', s: 'Outcome verified on the vehicle' } },
  { t: 'Retain the evidence', d: 'The decision, the outcome and any override are kept as focused, versioned evidence for engineering review — shared beyond the vehicle only with permission.', screen: { k: 'Evidence', v: 'Decision and outcome recorded', s: 'Shared only with permission' } },
];

export default function PmgJourney() {
  const [step, setStep] = useState(0);
  const set = useStory((s) => s.set);
  const reduce = useReducedMotion();
  const go = (n: number) => {
    const v = Math.max(0, Math.min(STEPS.length - 1, n));
    setStep(v);
    set({ pmgStep: v });
  };
  const cur = STEPS[step];
  return (
    <div className="grid gap-5">
      <div className="pmg-ui" role="img" aria-label={`Illustrative driver display, step ${step + 1}: ${cur.screen.k} — ${cur.screen.v}`}>
        <div className="pmg-ui-top">
          <span className="pmg-ui-dot" aria-hidden="true" />
          <span>Vehicle assistant</span>
          <span className="pmg-ui-tag">Illustrative interface</span>
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={step} initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={reduce ? undefined : { opacity: 0, y: -8 }} transition={{ duration: 0.28, ease: [0.45, 0.05, 0.25, 1] }}>
            <p className="pmg-ui-k">{cur.screen.k}</p>
            <p className="pmg-ui-v">{cur.screen.v}</p>
            <p className="pmg-ui-s">{cur.screen.s}</p>
          </motion.div>
        </AnimatePresence>
        <div className="pmg-ui-bar" aria-hidden="true">
          <motion.span animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }} transition={{ duration: reduce ? 0 : 0.5, ease: [0.45, 0.05, 0.25, 1] }} />
        </div>
      </div>

      <ol className="pmg-steps" aria-label="Decision steps">
        {STEPS.map((s, i) => (
          <li key={s.t}>
            <button type="button" onClick={() => go(i)} aria-current={i === step ? 'step' : undefined} className={i < step ? 'is-done' : undefined}>
              <span className="pmg-n">{i + 1}</span>
              <span className="pmg-t">{s.t}</span>
            </button>
          </li>
        ))}
      </ol>
      <p className="pmg-detail" aria-live="polite">
        {cur.d}
      </p>
      <div className="flex items-center gap-2">
        <button type="button" className="pmg-arrow" onClick={() => go(step - 1)} disabled={step === 0} aria-label="Previous step">
          <ChevronLeft aria-hidden="true" />
        </button>
        <button type="button" className="pmg-arrow" onClick={() => go(step + 1)} disabled={step === STEPS.length - 1} aria-label="Next step">
          <ChevronRight aria-hidden="true" />
        </button>
        <span className="fineprint ml-1">
          Step {step + 1} of {STEPS.length}
        </span>
      </div>
    </div>
  );
}
