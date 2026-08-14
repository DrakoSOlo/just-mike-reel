import { useEffect, useState } from "react";
import { Reveal } from "@/components/Reveal";
import { VideoEmbed } from "@/components/VideoEmbed";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useReveal } from "@/hooks/use-reveal";

// Placeholder — swap for the real showreel ID.
const REEL_ID = "ScMzIvxBSi4";

export function Showreel() {
  const { ref, shown } = useReveal<HTMLDivElement>(0.15);
  const [progress, setProgress] = useState(1);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const onScroll = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      setProgress(1 - Math.min(Math.max(rect.top / window.innerHeight, 0), 1));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [ref, reduced]);

  return (
    <section
      id="reel"
      aria-labelledby="reel-heading"
      className="px-6 py-24 md:px-10 md:py-32"
    >
      <div className="mx-auto max-w-[1400px]">
        <Reveal className="mb-10 flex items-baseline justify-between gap-6 border-b border-border pb-5">
          <h2 id="reel-heading" className="font-display text-3xl tracking-tight md:text-5xl">
            Showreel
          </h2>
          <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            2026 / 02:14
          </span>
        </Reveal>

        <div
          ref={ref}
          style={{ transform: `scale(${0.94 + progress * 0.06})` }}
          className="origin-bottom transition-transform duration-300 ease-out"
        >
          <div className={`transition-opacity duration-1000 ${shown ? "opacity-100" : "opacity-0"}`}>
            <VideoEmbed videoId={REEL_ID} title="just mike — 2026 showreel" />
          </div>
        </div>
      </div>
    </section>
  );
}
