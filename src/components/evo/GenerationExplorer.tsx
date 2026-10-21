import { useState } from 'react';
import { motion, useReducedMotion, type Variants } from 'motion/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GENERATIONS, type GenId } from '@/data/portfolio';
import { DOMAINS, GEN_SCOPE, LINK_CHANGE, SCOPE_STATUS } from '@/data/evo';

const IDS: GenId[] = ['gen1', 'gen2', 'gen3'];
const MECH = [0.7, 0, 0.18, 1] as const;
const STATUS_LABEL = Object.fromEntries(SCOPE_STATUS.map((s) => [s.id, s.label]));

type C = { i: number; isNew?: boolean; status?: string; reduce: boolean };
// Retained parts seat first, new scope slides in along the x-axis, options settle last.
const itemV: Variants = {
  out: ({ isNew, status }: C) => ({ opacity: 0, x: isNew ? -28 : 0, y: status === 'retained' ? -10 : 0 }),
  in: ({ i, isNew, status, reduce }: C) => ({
    opacity: 1,
    x: 0,
    y: 0,
    transition: reduce ? { duration: 0 } : { duration: 0.5, ease: MECH, delay: status === 'retained' ? 0 : (isNew ? 0.16 : 0.04) + i * 0.07 },
  }),
};
const wireV: Variants = {
  out: { scaleX: 0 },
  in: ({ i, reduce }: C) => ({ scaleX: 1, transition: reduce ? { duration: 0 } : { duration: 0.45, ease: MECH, delay: 0.42 + i * 0.09 } }),
};
const tagV: Variants = {
  out: { opacity: 0, x: 10 },
  in: ({ i, reduce }: C) => ({ opacity: 1, x: 0, transition: reduce ? { duration: 0 } : { duration: 0.4, ease: MECH, delay: 0.6 + i * 0.09 } }),
};

function delta(id: GenId) {
  const s = GEN_SCOPE[id];
  if (s.newNote) return s.newNote;
  const prev = id === 'gen2' ? GENERATIONS.gen1 : GENERATIONS.gen2;
  const added = s.integrated.filter((m) => m.isNew && m.status === 'core').length;
  const options = s.integrated.filter((m) => m.status === 'option').length;
  return `Retains the evaluated ${prev.short} foundation · adds ${added} proposed scope items · ${options} ${options === 1 ? 'option needs' : 'options need'} validation`;
}

function GenPanel({ id, active, reduce }: { id: GenId; active: boolean; reduce: boolean }) {
  const g = GENERATIONS[id];
  const s = GEN_SCOPE[id];
  const v = active ? 'in' : 'out';
  return (
    <TabsContent value={id} forceMount className="gx-panel data-[state=inactive]:hidden">
      <header className="gx-head">
        <p className="gx-number">{g.number}</p>
        <h3 className="h3">{g.title}</h3>
        <p className="gx-intro">{g.intro}</p>
      </header>

      <div className="gx-body">
        <div className="gx-diagram">
          <div className="gx-boundary">
            <p className="gx-boundary-k">Evo Core · proposed product scope</p>
            <ul className="gx-scope" aria-label={`${g.short} proposed product scope`}>
              {g.integrated.map((t, i) => {
                const m = s.integrated[i];
                return (
                  <motion.li key={t} className="gx-item" data-domain={m.domain} data-status={m.status} initial={false} animate={v} variants={itemV} custom={{ i, isNew: m.isNew, status: m.status, reduce }}>
                    <span className="gx-mark" aria-hidden="true" />
                    <span className="gx-item-t">{t}</span>
                    {m.status === 'core' && !m.isNew ? (
                      <span className="visually-hidden"> — {STATUS_LABEL.core}</span>
                    ) : (
                      <span className="gx-item-s">
                        {m.isNew && <span className="gx-new">New</span>}
                        {STATUS_LABEL[m.status]}
                      </span>
                    )}
                  </motion.li>
                );
              })}
            </ul>
          </div>
          <div className="gx-links">
            <p className="gx-k gx-links-k">Connected through interfaces</p>
            <ul aria-label={`${g.short}: connected through interfaces`}>
              {g.connected.map((t, i) => {
                const c = s.connected[i];
                return (
                  <li key={t} className="gx-link" data-domain={c.domain} data-change={c.change}>
                    <motion.span className="gx-wire" aria-hidden="true" initial={false} animate={v} variants={wireV} custom={{ i, reduce }} />
                    <span className="gx-port" aria-hidden="true" />
                    <motion.span className="gx-link-body" initial={false} animate={v} variants={tagV} custom={{ i, reduce }}>
                      <span className="gx-link-t">{t}</span>
                      <span className="gx-link-change">{LINK_CHANGE[c.change]}</span>
                      <span className="gx-link-note">{c.note}</span>
                    </motion.span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <aside className="gx-side" aria-label={`What changes in ${g.short}`}>
          <p className="gx-k">What changes</p>
          <p className="gx-delta">{delta(id)}</p>
          <p className="gx-k">How integration works</p>
          <p className="gx-method">{g.method}</p>
          <div className="gx-gate">
            <p className="gx-gate-k">Next engineering proof</p>
            <p>{g.gate}</p>
          </div>
        </aside>
      </div>

      <div className="gx-foot">
        <div>
          <p className="gx-k">Customer outcome to test</p>
          <p>{g.customer}</p>
        </div>
        <div>
          <p className="gx-k">OEM outcome to test</p>
          <p>{g.oem}</p>
        </div>
        <p className="gx-boundary-note">
          <span className="gx-k">Boundary</span>
          {g.boundary}
        </p>
      </div>
    </TabsContent>
  );
}

export default function GenerationExplorer() {
  const [gen, setGen] = useState<GenId>('gen1');
  const reduce = useReducedMotion() ?? false;
  return (
    <Tabs value={gen} onValueChange={(v) => setGen(v as GenId)} className="gx">
      <TabsList className="gx-selector" aria-label="Evo Core generations">
        {IDS.map((id, i) => (
          <TabsTrigger key={id} value={id} className="gx-trigger">
            {gen === id && <motion.span layoutId="gx-carriage" className="gx-carriage" transition={reduce ? { duration: 0 } : { duration: 0.42, ease: MECH }} />}
            <span className="gx-trigger-n">0{i + 1}</span>
            <span className="gx-trigger-gen">{GENERATIONS[id].short}</span>
            <span className="gx-trigger-label">{GENERATIONS[id].label}</span>
          </TabsTrigger>
        ))}
      </TabsList>

      {IDS.map((id) => (
        <GenPanel key={id} id={id} active={gen === id} reduce={reduce} />
      ))}

      <div className="gx-legend" aria-label="Diagram key" role="group">
        <ul className="gx-legend-row">
          {SCOPE_STATUS.map((st) => (
            <li key={st.id}>
              <span className="gx-key" data-status={st.id} aria-hidden="true" />
              {st.label}
            </li>
          ))}
        </ul>
        <ul className="gx-legend-row">
          {DOMAINS.map((d) => (
            <li key={d.id}>
              <span className="gx-dot" data-domain={d.id} aria-hidden="true" />
              {d.label}
            </li>
          ))}
        </ul>
      </div>
    </Tabs>
  );
}
