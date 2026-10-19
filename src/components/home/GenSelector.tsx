import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GENERATIONS, type GenId } from '@/data/portfolio';
import { useStory } from '@/lib/storyStore';

const IDS: GenId[] = ['gen1', 'gen2', 'gen3'];

export default function GenSelector() {
  const [value, setValue] = useState<GenId>('gen1');
  const set = useStory((s) => s.set);
  const reduce = useReducedMotion();
  return (
    <Tabs
      value={value}
      onValueChange={(v) => {
        setValue(v as GenId);
        set({ gen: GENERATIONS[v as GenId].n });
      }}
      className="gap-4"
    >
      <TabsList style={{ '--tab-accent': 'var(--c-tangerine-ink)' } as React.CSSProperties} aria-label="Evo Core generations">
        {IDS.map((id) => (
          <TabsTrigger key={id} value={id} className="flex-col gap-0 px-4 py-1.5 leading-tight">
            <span>{GENERATIONS[id].short}</span>
            <span className="text-[0.7rem] font-medium opacity-80">{GENERATIONS[id].label}</span>
          </TabsTrigger>
        ))}
      </TabsList>
      {IDS.map((id) => {
        const g = GENERATIONS[id];
        return (
          <TabsContent key={id} value={id} forceMount className="data-[state=inactive]:hidden" aria-live="polite">
            <h3 className="h4">{g.title}</h3>
            <p className="mt-1.5 text-[0.95rem] text-slate">{g.intro}</p>
            <div className="gen-cols">
              <div>
                <p className="gen-k">Proposed product scope</p>
                <ul className="gen-list gen-list--core">
                  <AnimatePresence initial={false}>
                    {g.integrated.map((item, i) => (
                      <motion.li key={item} initial={reduce ? false : { opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05, duration: 0.3, ease: [0.7, 0, 0.18, 1] }}>
                        {item}
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              </div>
              <div>
                <p className="gen-k">Connected through interfaces</p>
                <ul className="gen-list gen-list--iface">
                  {g.connected.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="gen-gate">
              <span>Next proof</span>
              {g.gate}
            </p>
            <p className="fineprint mt-2">{g.boundary}</p>
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
