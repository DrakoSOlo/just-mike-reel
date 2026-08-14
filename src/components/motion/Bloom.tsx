import bloomA from "@/assets/bloom-a.png.asset.json";
import bloomB from "@/assets/bloom-b.png.asset.json";
import { useParallax } from "@/hooks/use-parallax";
import { cn } from "@/lib/utils";

const sources = { a: bloomA.url, b: bloomB.url } as const;

/**
 * A soft printed bloom used as a graphic element behind sections: the artwork
 * is blurred, blended into the paper and drifts a little with scroll.
 */
export function Bloom({
  variant = "a",
  className,
  depth = 30,
  opacity = 0.5,
}: {
  variant?: "a" | "b";
  className?: string;
  /** Vertical parallax travel in px. */
  depth?: number;
  opacity?: number;
}) {
  const ref = useParallax<HTMLDivElement>();

  return (
    <div
      ref={ref}
      aria-hidden="true"
      style={{
        opacity,
        transform: `translate3d(0, calc(var(--parallax, 0) * ${depth}px), 0)`,
      }}
      className={cn("bloom pointer-events-none absolute -z-10 will-change-transform", className)}
    >
      <img src={sources[variant]} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
    </div>
  );
}
