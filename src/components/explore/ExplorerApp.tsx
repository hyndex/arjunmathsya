import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, Minus, Plus, RotateCcw, RotateCw, Crosshair, ChevronLeft, ChevronRight, Play, Square } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { HOTSPOTS, type Hotspot } from '@/data/hotspots';
import Guard from '@/components/three/Guard';
import { canRender3D, prefersReducedMotion } from '@/components/three/webgl';
import type { ExplorerHandle } from './ExplorerScene';

const ExplorerScene = lazy(() => import('./ExplorerScene'));

export type View = 'exterior' | 'cutaway';
const KIND_LABEL = { concept: 'Mathsya product concept', reference: 'Reference vehicle system', interface: 'Approved interface', future: 'Optional / future proposal' } as const;
const QUESTIONS: [keyof Hotspot, string][] = [
  ['what', 'What am I looking at?'],
  ['does', 'What does it do?'],
  ['mathsya', 'What exactly is Mathsya developing?'],
  ['connects', 'How does it connect with other systems?'],
  ['value', 'What value could it create?'],
  ['stage', 'What stage is the concept in?'],
  ['validate', 'What must be validated?'],
];

const STILL = <img className="explorer-still" src="/posters/explore-cutaway.webp" alt="" width={1600} height={1000} fetchPriority="high" />;

export default function ExplorerApp() {
  const [selected, setSelected] = useState<string>('battery-ai');
  const [view, setView] = useState<View>('cutaway');
  const [tour, setTour] = useState(false);
  const [webgl, setWebgl] = useState<boolean | null>(null);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false); // start 3D on first interaction or shortly after load; the still shows meanwhile
  const [drawn, setDrawn] = useState(false); // the still stays until the car itself has rendered (the model may load slowly)
  const fail = () => {
    setFailed(true);
    setWebgl(false);
  };
  const saveData = typeof navigator !== 'undefined' && (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;
  const handle = useRef<ExplorerHandle | null>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const reduced = useMemo(() => (typeof window === 'undefined' ? false : prefersReducedMotion()), []);

  useEffect(() => {
    let timer = 0;
    const events = ['pointerdown', 'keydown', 'touchstart', 'wheel'] as const;
    const cleanup = () => {
      events.forEach((e) => window.removeEventListener(e, go));
      window.removeEventListener('load', onLoad);
      window.clearTimeout(timer);
    };
    const go = () => {
      setReady(true);
      cleanup();
    };
    const onLoad = () => (timer = window.setTimeout(go, 2500));
    events.forEach((e) => window.addEventListener(e, go, { passive: true }));
    if (document.readyState === 'complete') onLoad();
    else window.addEventListener('load', onLoad, { once: true });
    return cleanup;
  }, []);

  useEffect(() => {
    setWebgl(canRender3D());
    const fromHash = location.hash.slice(1);
    if (HOTSPOTS.some((h) => h.id === fromHash)) setSelected(fromHash);
  }, []);

  const idx = HOTSPOTS.findIndex((h) => h.id === selected);
  const current = HOTSPOTS[idx];
  const select = (id: string, focusDetail = false) => {
    setSelected(id);
    if (view === 'exterior') setView('cutaway');
    history.replaceState(null, '', `#${id}`);
    if (focusDetail) requestAnimationFrame(() => detailRef.current?.focus());
  };
  const step = (d: number) => select(HOTSPOTS[(idx + d + HOTSPOTS.length) % HOTSPOTS.length].id);

  const onKey = (e: React.KeyboardEvent) => {
    const h = handle.current;
    if (!h) return;
    const map: Record<string, () => void> = {
      ArrowLeft: () => h.rotate(-1),
      ArrowRight: () => h.rotate(1),
      ArrowUp: () => h.tilt(-1),
      ArrowDown: () => h.tilt(1),
      '+': () => h.zoom(1),
      '=': () => h.zoom(1),
      '-': () => h.zoom(-1),
      '0': () => h.reset(),
    };
    if (map[e.key]) {
      e.preventDefault();
      map[e.key]();
    }
  };

  return (
    <div className="explorer">
      <div className="explorer-stage" tabIndex={0} onKeyDown={onKey} aria-label="Interactive 3D vehicle. Arrow keys rotate, plus and minus zoom, zero resets the view. All details are also listed in the panel." role="application">
        {webgl && ready && (
          <Guard fallback={null} onError={fail}>
            <Suspense fallback={null}>
              <ExplorerScene selected={selected} view={view} onSelect={(id) => select(id, true)} handleRef={handle} reduced={reduced} onLost={fail} onDrawn={() => setDrawn(true)} />
            </Suspense>
          </Guard>
        )}
        {/* The still is server-rendered, so it paints before any JavaScript; it covers the 3D view until the car has drawn. */}
        {webgl !== false && !drawn && STILL}
        {webgl === false && (
          <div className="explorer-fallback">
            <img src="/posters/explore-cutaway.webp" alt="Schematic cutaway of the concept vehicle showing the battery pack, Evo Core power unit, vehicle compute and networks." width={1600} height={1000} />
            <p>
              {failed ? 'The 3D view could not start in this browser.' : saveData ? 'Data saver is on, so the 3D view has not been downloaded.' : 'Interactive 3D is not available in this browser.'} Every system is
              described in the panel.
            </p>
            {saveData && !failed && (
              <button type="button" className="tour-start" onClick={() => setWebgl(true)}>
                Load the 3D view (about 1.5 MB)
              </button>
            )}
          </div>
        )}
        <div className="explorer-tools" aria-label="View controls" hidden={!webgl}>
          <ToggleGroup type="single" value={view} onValueChange={(v) => v && setView(v as View)} className="tool-toggle" aria-label="View">
            <ToggleGroupItem value="exterior">Exterior</ToggleGroupItem>
            <ToggleGroupItem value="cutaway">Technical cutaway</ToggleGroupItem>
          </ToggleGroup>
          <div className="tool-buttons">
            <button type="button" onClick={() => handle.current?.rotate(-1)} aria-label="Rotate left">
              <RotateCcw aria-hidden="true" />
            </button>
            <button type="button" onClick={() => handle.current?.rotate(1)} aria-label="Rotate right">
              <RotateCw aria-hidden="true" />
            </button>
            <button type="button" onClick={() => handle.current?.zoom(1)} aria-label="Zoom in">
              <Plus aria-hidden="true" />
            </button>
            <button type="button" onClick={() => handle.current?.zoom(-1)} aria-label="Zoom out">
              <Minus aria-hidden="true" />
            </button>
            <button type="button" onClick={() => handle.current?.reset()} aria-label="Reset camera">
              <Crosshair aria-hidden="true" />
            </button>
          </div>
        </div>
        <ul className="explorer-legend" aria-label="Legend">
          {(['concept', 'reference', 'interface', 'future'] as const).map((k) => (
            <li key={k}>
              <span className={`swatch swatch--${k}`} aria-hidden="true" />
              {KIND_LABEL[k]}
            </li>
          ))}
        </ul>
        <p className="explorer-note fineprint">Schematic concept vehicle · not a production design or prototype</p>
      </div>

      <aside className="explorer-panel" aria-label="Vehicle systems">
        <div className="panel-top">
          <div className="tour-bar">
            {tour ? (
              <>
                <button type="button" className="tour-btn" onClick={() => step(-1)} aria-label="Previous system">
                  <ChevronLeft aria-hidden="true" />
                </button>
                <span className="tour-count" aria-live="polite">
                  Guided tour · {idx + 1} / {HOTSPOTS.length}
                </span>
                <button type="button" className="tour-btn" onClick={() => step(1)} aria-label="Next system">
                  <ChevronRight aria-hidden="true" />
                </button>
                <button type="button" className="tour-stop" onClick={() => setTour(false)}>
                  <Square aria-hidden="true" /> End tour
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="tour-start"
                  onClick={() => {
                    setTour(true);
                    select(HOTSPOTS[0].id);
                  }}
                >
                  <Play aria-hidden="true" /> Guided tour
                </button>
                <a className="tour-story" href="/#scene-surface">
                  Back to the story <ArrowRight aria-hidden="true" />
                </a>
              </>
            )}
          </div>
          <ol className="hs-list">
            {HOTSPOTS.map((h, i) => (
              <li key={h.id}>
                <button type="button" onClick={() => select(h.id, true)} aria-current={h.id === selected ? 'true' : undefined} className={`hs-item hs-item--${h.kind}`} data-product={h.product}>
                  <span className="hs-n">{String(i + 1).padStart(2, '0')}</span>
                  <span className="hs-name">{h.name}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>
        <div className="hs-details" ref={detailRef} tabIndex={-1} aria-live="polite">
          {HOTSPOTS.map((h) => (
            <article key={h.id} id={`detail-${h.id}`} hidden={h.id !== selected} className="hs-detail" data-product={h.product}>
              <p className="hs-kind">
                <span className={`swatch swatch--${h.kind}`} aria-hidden="true" />
                {KIND_LABEL[h.kind]}
              </p>
              <h2 className="hs-title">{h.name}</h2>
              <dl className="hs-qa">
                {QUESTIONS.map(([k, q]) => (
                  <div key={k} className={k === 'stage' ? 'is-stage' : k === 'validate' ? 'is-validate' : undefined}>
                    <dt>{q}</dt>
                    <dd>{h[k] as string}</dd>
                  </div>
                ))}
              </dl>
              <div className="hs-foot">
                {h.href && (
                  <a className="link-arrow" href={h.href}>
                    Open the product page <ArrowRight size={16} aria-hidden="true" />
                  </a>
                )}
                <div className="hs-related">
                  <span>Related</span>
                  {h.related.map((r) => {
                    const rel = HOTSPOTS.find((x) => x.id === r);
                    return rel ? (
                      <button key={r} type="button" onClick={() => select(r, true)}>
                        {rel.name}
                      </button>
                    ) : null;
                  })}
                </div>
              </div>
            </article>
          ))}
        </div>
      </aside>
    </div>
  );
}
