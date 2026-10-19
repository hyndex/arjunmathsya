import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BENEFITS, BENEFIT_NOTE, type BenefitId } from '@/data/portfolio';
import { useStory } from '@/lib/storyStore';

const IDS = Object.keys(BENEFITS) as BenefitId[];

/** Scene 10 — observed issue → module + vehicle response → outcomes → measurement plan. */
export default function ValueScenarios() {
  const [value, setValue] = useState<BenefitId>('battery');
  const set = useStory((s) => s.set);
  return (
    <Tabs
      value={value}
      onValueChange={(v) => {
        setValue(v as BenefitId);
        set({ benefit: v as BenefitId });
      }}
      className="gap-4"
    >
      <TabsList aria-label="Illustrative scenarios">
        {IDS.map((id) => (
          <TabsTrigger key={id} value={id} className="px-3.5 text-[0.85rem]">
            {BENEFITS[id].tab}
          </TabsTrigger>
        ))}
      </TabsList>
      {IDS.map((id) => {
        const b = BENEFITS[id];
        return (
          <TabsContent key={id} value={id} forceMount className="data-[state=inactive]:hidden" aria-live="polite">
            <p className="value-scene">{b.scene}</p>
            <ol className="value-chain">
              <li>
                <span>Module intelligence</span>
                {b.module}
              </li>
              <li>
                <span>PMG · vehicle context</span>
                {b.pmg}
              </li>
            </ol>
            <div className="value-out">
              <div>
                <span>For the customer</span>
                {b.customer}
              </div>
              <div>
                <span>For the OEM</span>
                {b.oem}
              </div>
            </div>
            <p className="gen-gate">
              <span>Measurement plan</span>
              {b.proof}
            </p>
          </TabsContent>
        );
      })}
      <p className="fineprint">{BENEFIT_NOTE}</p>
    </Tabs>
  );
}
