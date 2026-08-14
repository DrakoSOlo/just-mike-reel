/**
 * Graphic motifs lifted from the bloom artwork — concentric rings, a halftone
 * dot field, and hairline corner brackets. All are pure SVG/CSS, decorative
 * only, and cost nothing at runtime.
 */

export function MotifRings({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 120 120"
      className={`motif motif-spin ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="0.5"
    >
      <circle cx="60" cy="60" r="59" opacity="0.5" />
      <circle cx="60" cy="60" r="44" opacity="0.35" strokeDasharray="2 5" />
      <circle cx="60" cy="60" r="27" opacity="0.6" />
      <circle cx="60" cy="60" r="4" fill="currentColor" stroke="none" opacity="0.7" />
    </svg>
  );
}

export function MotifBloom({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 120 120" className={`motif motif-breathe ${className}`}>
      <defs>
        <radialGradient id="motif-bloom-g" cx="36%" cy="30%">
          <stop offset="0%" stopColor="oklch(0.95 0.05 92)" />
          <stop offset="45%" stopColor="oklch(0.83 0.14 72)" />
          <stop offset="100%" stopColor="oklch(0.55 0.11 262)" stopOpacity="0.15" />
        </radialGradient>
      </defs>
      <circle cx="60" cy="60" r="52" fill="url(#motif-bloom-g)" />
    </svg>
  );
}

export function MotifHalftone({ className = "" }: { className?: string }) {
  return <span aria-hidden="true" className={`motif motif-halftone block ${className}`} />;
}

export function MotifBrackets({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className={`motif ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="0.6"
    >
      <path d="M0 8 V0 H8 M92 0 H100 V8 M100 92 V100 H92 M8 100 H0 V92" />
    </svg>
  );
}
