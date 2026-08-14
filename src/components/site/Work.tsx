import { useRef, useState } from "react";
import { Play } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FilmPlayer } from "@/components/media/FilmPlayer";
import { Reveal } from "@/components/Reveal";
import type { Film } from "@/data/films";
import { films, posterUrl } from "@/data/films";
import { useParallax } from "@/hooks/use-parallax";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";
import { Poster } from "@/components/media/Poster";
import { track } from "@/lib/analytics";


function FilmCard({ film, onOpen }: { film: Film; onOpen: (el: HTMLButtonElement) => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const mediaRef = useParallax<HTMLDivElement>();
  const reduced = useReducedMotion();

  // Tilt is written straight to CSS variables — no state, no re-render per frame.
  const onMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const el = ref.current;
    if (reduced || !el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    el.style.setProperty("--rx", `${(0.5 - py) * 7}deg`);
    el.style.setProperty("--ry", `${(px - 0.5) * 10}deg`);
    el.style.setProperty("--lift", "-8px");
    el.style.setProperty("--spot-x", `${px * 100}%`);
    el.style.setProperty("--spot-y", `${py * 100}%`);
    el.style.setProperty("--spot-opacity", "0.9");
  };

  const reset = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--lift", "0px");
    el.style.setProperty("--spot-opacity", "0");
  };

  return (
    <button
      ref={ref}
      type="button"
      onPointerMove={onMove}
      onPointerLeave={reset}
      onBlur={reset}
      onClick={() => ref.current && onOpen(ref.current)}
      data-cursor="play"
      style={{
        transform:
          "perspective(1100px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)) translate3d(0, var(--lift, 0px), 0)",
      }}
      className="spotlight group relative block w-full text-left transition-transform duration-500 ease-out will-change-transform"
    >
      <div ref={mediaRef} className="relative aspect-[16/10] overflow-hidden bg-surface">
        <Poster
          mediaId={film.mediaId}
          alt={`Still frame from ${film.title}, a ${film.category.toLowerCase()} from ${film.year}`}
          className="parallax-media opacity-90 transition-opacity duration-500 ease-out group-hover:opacity-100"
        />
        <span aria-hidden="true" className="frame-ticks absolute inset-0" />
        <span aria-hidden="true" className="absolute bottom-4 left-4">
          <span className="play-badge">
            <Play fill="currentColor" aria-hidden="true" />
            Play film
          </span>
        </span>
      </div>
      <div className="mt-4 flex items-baseline justify-between gap-4 border-t border-border pt-4 transition-colors duration-500 group-hover:border-foreground">
        <h3 className="font-display text-2xl tracking-tight md:text-3xl">{film.title}</h3>
        <span className="spec-label">
          {film.category} / {film.year}
        </span>
      </div>

    </button>
  );
}

export function Work() {
  const [active, setActive] = useState<Film | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);


  return (
    <section
      id="work"
      aria-labelledby="work-heading"
      className="cv-auto figma-guides relative border-t border-border px-5 py-16 md:px-10 md:py-32"
    >
      <div className="relative z-10 mx-auto max-w-[1400px]">
        <Reveal className="mb-8 flex items-baseline md:mb-14 justify-between gap-6">
          <h2 id="work-heading" className="font-display text-3xl tracking-tight md:text-5xl">
            Selected work
          </h2>
          <span className="spec-label">{films.length} films</span>
        </Reveal>

        <div className="grid gap-x-10 gap-y-10 md:grid-cols-2 md:gap-y-16">
          {films.map((film, i) => (
            <Reveal
              key={film.id}
              delay={(i % 2) * 120}
              className={cn(i % 2 === 1 && "md:mt-24")}
            >
              <FilmCard
                film={film}
                onOpen={(el: HTMLButtonElement) => {
                  triggerRef.current = el;
                  setActive(film);
                  track("film_open", { title: film.title, category: film.category });
                }}
              />
            </Reveal>
          ))}

        </div>
      </div>

      <Dialog open={Boolean(active)} onOpenChange={(open) => !open && setActive(null)}>
        <DialogContent
          className="max-w-5xl border-border bg-background p-4 sm:p-6"
          onOpenAutoFocus={(e) => {
            // Keep focus on the dialog itself: an autoplaying YouTube iframe
            // would otherwise swallow focus and trap keyboard users (WCAG 2.1.2).
            e.preventDefault();
            (e.currentTarget as HTMLElement).focus();
          }}
          onCloseAutoFocus={(e) => {
            e.preventDefault();
            triggerRef.current?.focus();
          }}
        >

          <DialogHeader className="sr-only">
            <DialogTitle>{active?.title ?? "Film"}</DialogTitle>
            <DialogDescription>
              {active ? `${active.category}, ${active.year}` : ""}
            </DialogDescription>
          </DialogHeader>
          {active && (
            <>
              <FilmPlayer film={active} active autoPlay />
              <p className="mt-4 text-xs uppercase tracking-[0.3em] text-muted-foreground">
                {active.title} — {active.category}, {active.year}
              </p>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
