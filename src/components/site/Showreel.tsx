import { Reveal } from "@/components/Reveal";
import {
  MotifBrackets,
  MotifDotField,
  MotifHalftone,
  MotifRings,
  MotifStar,
  MotifStripes,
  MotifSunburst,
} from "@/components/motion/Motif";
import { FilmPlayer } from "@/components/media/FilmPlayer";
import { showreel } from "@/data/films";
import { useParallax } from "@/hooks/use-parallax";

/**
 * The showreel sits in the layout as a framed element — an offset column with
 * its spec column beside it — rather than a full-bleed placeholder.
 */
export function Showreel() {
  const ref = useParallax<HTMLDivElement>();

  return (
    <section
      id="reel"
      aria-labelledby="reel-heading"
      className="cv-auto section-band px-5 md:px-10"
    >
      <div className="mx-auto grid max-w-[1400px] gap-6 md:grid-cols-12 md:gap-10">
        <div className="md:col-span-3">
          <Reveal>
            <div className="relative inline-block">
              <MotifSunburst className="pointer-events-none absolute -left-10 -top-10 h-32 w-32 opacity-40" />
              <MotifStar className="pointer-events-none absolute -right-5 -top-3 h-3 w-3" />
              <h2 id="reel-heading" className="relative font-display text-3xl tracking-tight md:text-4xl">
                just mike
              </h2>
            </div>
            <dl className="mt-5 space-y-2 border-t border-border pt-4">
              <div className="flex items-baseline justify-between gap-4">
                <dt className="spec-label">Year</dt>
                <dd className="spec-label text-foreground">2026</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <dt className="spec-label">Runtime</dt>
                <dd className="spec-label text-foreground">02:14</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <dt className="spec-label">Format</dt>
                <dd className="spec-label text-foreground">16:9 / 24fps</dd>
              </div>
            </dl>
            <MotifStripes className="mt-6 block h-6 w-20" />
            <div className="relative mt-6 hidden h-24 md:block">
              <MotifRings className="absolute left-0 top-0 h-24 w-24" />
              <MotifHalftone className="absolute bottom-1 right-0 h-10 w-24" />
              <MotifDotField className="absolute bottom-0 left-24 h-12 w-20" />
            </div>
          </Reveal>
        </div>

        <div className="md:col-span-8 md:col-start-5">
          <div
            ref={ref}
            className="parallax-fade origin-bottom will-change-transform"
            style={{
              transform:
                "scale(calc(0.96 + var(--enter, 1) * 0.04)) translate3d(0, calc(var(--parallax, 0) * -18px), 0)",
            }}
          >
            <div className="media-frame relative">
              <MotifBrackets className="pointer-events-none absolute -inset-2 h-[calc(100%+1rem)] w-[calc(100%+1rem)] opacity-60" />
              <FilmPlayer film={showreel} autoPlay />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
