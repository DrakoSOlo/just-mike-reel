import { Reveal } from "@/components/Reveal";
import { VideoEmbed } from "@/components/VideoEmbed";
import { useParallax } from "@/hooks/use-parallax";

// Placeholder — swap for the real showreel ID.
const REEL_ID = "dQw4w9WgXcQ";

export function Showreel() {
  const ref = useParallax<HTMLDivElement>();

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
          className="parallax-fade origin-bottom will-change-transform"
          style={{
            transform:
              "scale(calc(0.94 + var(--enter, 1) * 0.06)) translate3d(0, calc(var(--parallax, 0) * -22px), 0)",
          }}
        >
          <VideoEmbed videoId={REEL_ID} title="just mike — 2026 showreel" />
        </div>
      </div>
    </section>
  );
}
