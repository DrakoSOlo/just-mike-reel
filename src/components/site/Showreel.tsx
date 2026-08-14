import { Reveal } from "@/components/Reveal";
import { FilmPlayer } from "@/components/media/FilmPlayer";
import { showreel } from "@/data/films";
import { useParallax } from "@/hooks/use-parallax";

export function Showreel() {
  const ref = useParallax<HTMLDivElement>();

  return (
    <section
      id="reel"
      aria-labelledby="reel-heading"
      className="cv-auto px-6 py-24 md:px-10 md:py-32"
    >
      <div className="mx-auto max-w-[1400px]">
        <Reveal className="mb-10 flex items-baseline justify-between gap-6 border-b border-border pb-5">
          <h2 id="reel-heading" className="font-display text-3xl tracking-tight md:text-5xl">
            Showreel
          </h2>
          <span className="spec-label">
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
          <FilmPlayer film={showreel} autoPlay />
        </div>
      </div>
    </section>
  );
}
