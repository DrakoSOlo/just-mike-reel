import bloom1 from "@/assets/bloom-hover-1.png.asset.json";
import bloom2 from "@/assets/bloom-hover-2.png.asset.json";
import bloom3 from "@/assets/bloom-hover-3.png.asset.json";
import { cn } from "@/lib/utils";

const blooms = [bloom1.url, bloom2.url, bloom3.url];

/** Deterministic bloom per film so a card always shows the same graphic. */
function bloomFor(mediaId: string) {
  let n = 0;
  for (let i = 0; i < mediaId.length; i += 1) n = (n + mediaId.charCodeAt(i)) % 997;
  return blooms[n % blooms.length];
}

/**
 * Placeholder poster. The YouTube stills were visually noisy, so cards show a
 * blank paper tile with the printed bloom graphic as the hover element: it
 * fades and scales in on hover/focus, purely in CSS (no JS, no LCP image).
 */
export function Poster({
  mediaId,
  alt,
  priority = false,
  eager = false,
  className,
}: {
  mediaId: string;
  alt: string;
  priority?: boolean;
  /** Load immediately but at normal priority (first below-the-fold poster). */
  eager?: boolean;
  sizes?: string;
  className?: string;
}) {
  return (
    <span
      role={alt ? "img" : undefined}
      aria-label={alt || undefined}
      className={cn("poster-blank relative block h-full w-full overflow-hidden bg-surface", className)}
    >
      <img
        src={bloomFor(mediaId)}
        alt=""
        aria-hidden="true"
        loading={priority || eager ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "low"}
        decoding="async"
        className="poster-bloom h-full w-full object-cover"
      />
      <span aria-hidden="true" className="poster-grid absolute inset-0" />
    </span>
  );
}
