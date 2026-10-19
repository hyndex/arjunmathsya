import { useEffect, useRef, useState } from 'react';
import { useInView, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';
import { Evo3D } from '@/components/three/Lazy3D';
import type { EvoFocus } from '@/components/three/EvoCoreScene';
import IsometricSvg from './IsometricSvg';
import { ASSEMBLY, FUNCTIONS, RELATIONS } from '@/data/evo';

// Same query as the pinned layout in evo.css: the stage pins only when the viewport is tall enough to hold it.
const PIN_QUERY = '(min-width: 1200px) and (min-height: 780px)';
const clamp = (v: number) => Math.min(1, Math.max(0, v));
const q = (v: number) => Math.round(clamp(v) * 400) / 400;

const ROWS = [
  { rel: 'control', label: 'Control', key: 'control' },
  { rel: 'physical', label: 'Physical integration', key: 'physical' },
  { rel: 'interface', label: 'External interfaces', key: 'interfaces' },
] as const;

export default function ExplodedView() {
  const trackRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef(false);
  const reduce = useReducedMotion() ?? false;
  const live = useInView(trackRef, { amount: 0.05 });
  const [sel, setSel] = useState<EvoFocus | null>(null);
  const [explode, setExplode] = useState(0);
  const [compact, setCompact] = useState(false);
  const [still, setStill] = useState(false); // reduced motion, applied after hydration so SSR text matches

  // Pinned: separate over the first 70% of the pinned scroll. Flow: separate while the section scrolls in.
  const pinned = useScroll({ target: trackRef, offset: ['start start', 'end end'] }).scrollYProgress;
  const entering = useScroll({ target: trackRef, offset: ['start 0.9', 'start 0.12'] }).scrollYProgress;
  const progress = useTransform(() => clamp(pinRef.current ? pinned.get() / 0.7 : entering.get()));
  const smooth = useSpring(progress, { stiffness: 240, damping: 40, restDelta: 0.001 });
  useMotionValueEvent(smooth, 'change', (v) => {
    if (!reduce) setExplode(q(v));
  });

  useEffect(() => {
    const mq = window.matchMedia(PIN_QUERY);
    const sync = () => {
      pinRef.current = mq.matches;
      setExplode(reduce ? 1 : q(progress.get()));
      setStill(reduce);
    };
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, [reduce, progress]);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)');
    const sync = () => setCompact(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  const fn = FUNCTIONS.find((f) => f.id === sel);
  const stateLabel = explode < 0.05 ? 'Assembled' : explode > 0.95 ? 'Exploded' : 'Separating';

  return (
    <div ref={trackRef} className="xv-track">
      <div className="xv-stage container--wide">
        <figure className="xv-figure" aria-labelledby="xv-caption">
          <div className="xv-visual" data-focus={sel ?? undefined}>
            <Evo3D
              generation={1}
              explode={explode}
              focus={sel}
              className="xv-3d"
              label={`Schematic concept of the proposed Evo Core Gen 1 assembly${fn ? `, ${fn.code} highlighted` : ''}. Not a production design.`}
              fallback={<IsometricSvg explode={explode} focus={sel} live={live && !reduce} compact={compact} />}
            />
            <div className="xv-gauge" aria-hidden="true">
              <span className="xv-gauge-k">{stateLabel}</span>
              <span className="xv-gauge-bar">
                <span style={{ transform: `scaleX(${explode})` }} />
              </span>
            </div>
          </div>
          <figcaption id="xv-caption" className="xv-caption">
            <span>Schematic concept illustration · not a production design</span>
            <span className="xv-caption-hint">{still ? 'Shown exploded' : 'Scroll to separate the layers'}</span>
          </figcaption>
        </figure>

        <div className="xv-panel">
          <div className="xv-panel-head">
            <p className="xv-k" id="xv-parts-label">
              Parts list · Gen 1 proposed scope
            </p>
            <button type="button" className="xv-reset" aria-pressed={sel === null} aria-controls="xv-detail" onClick={() => setSel(null)}>
              Full assembly
            </button>
          </div>
          <div className="xv-parts" role="group" aria-labelledby="xv-parts-label">
            {FUNCTIONS.map((f) => (
              <button
                key={f.id}
                type="button"
                className="xv-part"
                aria-pressed={sel === f.id}
                aria-controls="xv-detail"
                onClick={() => setSel((cur) => (cur === f.id ? null : f.id))}
              >
                <span className="xv-part-n">{f.n}</span>
                <span className="xv-part-code">{f.code}</span>
                <span className="visually-hidden">{f.name}</span>
              </button>
            ))}
          </div>

          <div id="xv-detail" className="xv-detail" aria-live="polite" role="region" aria-label="Selected function details" tabIndex={0}>
            <div className="xv-sheet" hidden={sel !== null}>
              <h3 className="xv-title">{ASSEMBLY.title}</h3>
              <p className="xv-what">{ASSEMBLY.body}</p>
              <ul className="xv-legend" aria-label="Three relationships to Evo Core">
                {RELATIONS.map((r) => (
                  <li key={r.id} data-rel={r.id}>
                    <span className={`xv-glyph xv-glyph--${r.id}`} aria-hidden="true" />
                    <div>
                      <p className="xv-legend-k">{r.label}</p>
                      <p className="xv-members">
                        {r.members.map((m) => (
                          <span key={m}>{m}</span>
                        ))}
                      </p>
                      <p className="xv-legend-body">{r.body}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            {FUNCTIONS.map((f) => (
              <div key={f.id} className="xv-sheet" hidden={sel !== f.id}>
                <p className="xv-k">
                  {f.n} · {f.code} · <span className="xv-role">Role: {f.role}</span>
                </p>
                <h3 className="xv-title">{f.name}</h3>
                <p className="xv-what">{f.what}</p>
                <p className="xv-propose">
                  <span className="xv-k">Mathsya proposes</span>
                  {f.proposal}
                </p>
                <ul className="xv-rel">
                  {ROWS.map((r) => (
                    <li key={r.rel} data-rel={r.rel}>
                      <span className={`xv-glyph xv-glyph--${r.rel}`} aria-hidden="true" />
                      <span className="xv-rel-k">{r.label}</span>
                      <span className="xv-rel-v">{f[r.key]}</span>
                    </li>
                  ))}
                </ul>
                <p className="xv-proof">
                  <span className="xv-k">Proof needed</span>
                  {f.proof}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
