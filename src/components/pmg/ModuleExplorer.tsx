import type { CSSProperties } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MODULES_INTRO, PMG_MODULE_APPS, type ModuleAppId } from '@/data/pmg';
import './modules.css';

const IDS = Object.keys(PMG_MODULE_APPS) as ModuleAppId[];
const ACCENT = { battery: 'var(--p-battery)', evo: 'var(--p-evo)', pmg: 'var(--p-pmg)' } as const;
const INK = { battery: 'var(--p-battery-ink)', evo: 'var(--p-evo-ink)', pmg: 'var(--p-pmg-ink)' } as const;

/** Candidate module applications (modules.js): signals → module intelligence → vehicle value → organizational value. */
export default function ModuleExplorer() {
  return (
    <Tabs defaultValue={IDS[0]} className="mx">
      <TabsList variant="line" aria-label="Illustrative module applications" className="mx-list">
        {IDS.map((id) => (
          <TabsTrigger key={id} value={id} className="mx-trigger" style={{ '--tab-accent': ACCENT[PMG_MODULE_APPS[id].accent] } as CSSProperties}>
            <span className="mx-dot" aria-hidden="true" />
            {PMG_MODULE_APPS[id].tab}
          </TabsTrigger>
        ))}
      </TabsList>

      {IDS.map((id) => {
        const m = PMG_MODULE_APPS[id];
        const rows = [
          { k: 'Signals', v: m.signals },
          { k: 'Module intelligence', v: m.module },
          { k: 'Vehicle value', v: m.vehicle },
          { k: 'Organizational value', v: m.organization },
        ];
        return (
          <TabsContent
            key={id}
            value={id}
            forceMount
            className="mx-panel"
            style={{ '--acc': ACCENT[m.accent], '--acc-ink': INK[m.accent] } as CSSProperties}
          >
            <div className="mx-side">
              <p className="mx-k">Illustrative application</p>
              <h3 className="mx-title">{m.title}</h3>
              <div className="mx-proof">
                <p className="mx-k">Proof to earn</p>
                <p>{m.proof}</p>
              </div>
              <p className="mx-candidate">{MODULES_INTRO.note}</p>
            </div>
            <ol className="mx-chain">
              {rows.map((r, i) => (
                <li key={r.k} className="mx-row" style={{ '--i': i } as CSSProperties}>
                  <span className="mx-row-k">
                    <span className="mx-row-n">{String(i + 1).padStart(2, '0')}</span>
                    {r.k}
                  </span>
                  <p className="mx-row-v">{r.v}</p>
                </li>
              ))}
            </ol>
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
