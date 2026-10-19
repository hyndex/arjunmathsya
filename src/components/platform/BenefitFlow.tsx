import type { CSSProperties } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BENEFITS, BENEFIT_NOTE, type BenefitId } from '@/data/portfolio';
import './benefits.css';

const IDS = Object.keys(BENEFITS) as BenefitId[];
const ACCENT = { battery: 'var(--p-battery)', evo: 'var(--p-evo)', pmg: 'var(--p-pmg)' } as const;
const INK = { battery: 'var(--p-battery-ink)', evo: 'var(--p-evo-ink)', pmg: 'var(--p-pmg-ink)' } as const;

/** Four candidate scenarios as a signal path: input → module → PMG → customer / OEM → what to measure. */
export default function BenefitFlow() {
  return (
    <Tabs defaultValue={IDS[0]} className="bf">
      <TabsList aria-label="Benefit scenarios" className="bf-list">
        {IDS.map((id) => (
          // white label on the active pill: use the text-safe ink tones (tangerine fill fails AA under white text)
          <TabsTrigger key={id} value={id} style={{ '--tab-accent': INK[BENEFITS[id].focus] } as CSSProperties}>
            {BENEFITS[id].tab}
          </TabsTrigger>
        ))}
      </TabsList>

      {IDS.map((id) => {
        const b = BENEFITS[id];
        return (
          <TabsContent
            key={id}
            value={id}
            forceMount
            className="bf-panel data-[state=inactive]:hidden"
            style={{ '--acc': ACCENT[b.focus], '--acc-ink': INK[b.focus] } as CSSProperties}
          >
            <div className="bf-intro">
              <p className="bf-number">{b.number}</p>
              <h3 className="h3 bf-title">{b.title}</h3>
              <p className="bf-scene">{b.scene}</p>
            </div>
            <ol className="bf-path">
              <li className="bf-st bf-st--input" style={{ '--i': 0 } as CSSProperties}>
                <span className="bf-k">The input</span>
                <p>{b.signals}</p>
              </li>
              <li className="bf-st bf-st--module" style={{ '--i': 1 } as CSSProperties}>
                <span className="bf-k">01 · Module intelligence</span>
                <p>{b.module}</p>
              </li>
              <li className="bf-st bf-st--pmg" style={{ '--i': 2 } as CSSProperties}>
                <span className="bf-k">02 · PMG / vehicle context</span>
                <p>{b.pmg}</p>
              </li>
              <li className="bf-st bf-st--outcome" style={{ '--i': 3 } as CSSProperties}>
                <span className="bf-k">Outcome</span>
                <div className="bf-split">
                  <div>
                    <span className="bf-sub">For the customer</span>
                    <p>{b.customer}</p>
                  </div>
                  <div>
                    <span className="bf-sub">For the OEM</span>
                    <p>{b.oem}</p>
                  </div>
                </div>
              </li>
              <li className="bf-st bf-st--measure" style={{ '--i': 4 } as CSSProperties}>
                <span className="bf-k">What to measure</span>
                <p>{b.proof}</p>
              </li>
            </ol>
          </TabsContent>
        );
      })}
      <p className="note bf-note">{BENEFIT_NOTE}</p>
    </Tabs>
  );
}
