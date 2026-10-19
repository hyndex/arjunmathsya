import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { buttonVariants } from '@/components/ui/button';
import { AUDIENCES } from '@/data/investors';

/** Strategic / OEM partner vs early-stage investor (legacy app.js audiences). Every panel is server-rendered. */
export default function AudienceTabs() {
  const [value, setValue] = useState<string>(AUDIENCES[0].id);
  const reduce = useReducedMotion();

  return (
    <Tabs value={value} onValueChange={setValue}>
      <TabsList aria-label="Choose a perspective" style={{ '--tab-accent': 'var(--c-cobalt)' } as React.CSSProperties}>
        {AUDIENCES.map((a) => (
          <TabsTrigger key={a.id} value={a.id}>
            {a.tab}
          </TabsTrigger>
        ))}
      </TabsList>
      {AUDIENCES.map((a) => {
        const on = a.id === value;
        return (
          <TabsContent key={a.id} value={a.id} forceMount className="data-[state=inactive]:hidden">
            <div className="inv-aud-panel">
              <div className="inv-aud-copy">
                <p className="inv-aud-label">{a.label}</p>
                <h3 className="h3">{a.title}</h3>
                <p>{a.copy}</p>
                <ul className="inv-aud-points">
                  {a.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
                <a className={buttonVariants({ variant: 'default' })} href={a.cta.href}>
                  {a.cta.label} <ArrowRight aria-hidden="true" />
                </a>
              </div>
              <ol className="inv-aud-chain" aria-label={`${a.tab} path`}>
                {a.chain.map((step, i) => (
                  <motion.li
                    key={step}
                    initial={false}
                    animate={on ? { opacity: 1, x: 0 } : { opacity: 0, x: -14 }}
                    transition={reduce ? { duration: 0 } : { duration: 0.5, delay: on ? 0.1 + i * 0.14 : 0, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <span>{['Start', 'Gate', 'Then'][i]}</span>
                    <strong>{step}</strong>
                  </motion.li>
                ))}
              </ol>
            </div>
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
