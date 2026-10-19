// Brand mark keeps the original "M" glyph, recoloured into the cobalt identity. Static-renderable from .astro.
// `uid` keeps the SVG gradient id unique when several logos render on one page (header, drawer, footer).
export default function Logo({ size = 34, compact = false, uid = 'a' }: { size?: number; compact?: boolean; uid?: string }) {
  const grad = `mk-${uid}`;
  return (
    <span className="inline-flex items-center gap-[11px] text-ink">
      <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true" focusable="false" className="flex-none rounded-[11px] shadow-[0_6px_16px_-8px_rgba(24,90,219,0.7)]">
        <defs>
          <linearGradient id={grad} x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#2a6ef0" />
            <stop offset="1" stopColor="#1249b8" />
          </linearGradient>
        </defs>
        <rect width="48" height="48" rx="13" fill={`url(#${grad})`} />
        <path d="M10 32V16h5l9 11 9-11h5v16h-5V23l-9 10-9-10v9z" fill="#fff" />
        <circle cx="38.5" cy="9.5" r="2.6" fill="#85ddd3" />
      </svg>
      {!compact && (
        <span className="grid leading-none">
          <span className="font-display text-[1.32rem] font-extrabold tracking-[-0.04em]">mathsya</span>
          <span className="sr-only"> </span>
          <span className="mt-1 font-mono text-[0.56rem] font-medium tracking-[0.2em] text-slate uppercase">Connected Services</span>
        </span>
      )}
    </span>
  );
}
