// Whether to render 3D at all (cached). Pages must stay complete when this returns false.
let cached: boolean | undefined;
export function canRender3D(): boolean {
  if (cached !== undefined) return cached;
  if (typeof window === 'undefined') return false;
  // Respect data-saver: the stills and SVG fallbacks carry the same information without ~1.5 MB of 3D.
  const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;
  try {
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl2') || c.getContext('webgl');
    cached = !!gl && !saveData;
    gl?.getExtension('WEBGL_lose_context')?.loseContext(); // free the probe context immediately
  } catch {
    cached = false;
  }
  return cached;
}

export const prefersReducedMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Call from a Canvas `onCreated`: switches the view to its fallback if the GPU drops the context. */
export function onContextLost(canvas: HTMLCanvasElement, fail?: () => void) {
  if (fail) canvas.addEventListener('webglcontextlost', fail, { once: true });
}
