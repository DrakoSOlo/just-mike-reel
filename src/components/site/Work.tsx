import { useRef, useState } from "react";
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
      style={{
        transform:
          "perspective(1100px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)) translate3d(0, var(--lift, 0px), 0)",
      }}
      className="spotlight group relative block w-full text-left transition-transform duration-500 ease-out will-change-transform"
    >
      <div ref={mediaRef} className="relative aspect-[16/10] overflow-hidden rounded-sm bg-surface">
        <img
          src={posterUrl(film)}
          alt={`Still frame from ${film.title}, a ${film.category.toLowerCase()} from ${film.year}`}
          loading="lazy"
          referrerPolicy="no-referrer"
          onLoad={(e) => {
            const img = e.currentTarget;
            if (img.naturalWidth < 200 && !img.dataset["fallback"] && film.source === "youtube") {
              img.dataset["fallback"] = "1";
              img.src = img.src.replace("maxresdefault", "hqdefault");
            }
          }}
          onError={(e) => {
            const img = e.currentTarget;
            if (!img.dataset["fallback"] && film.source === "youtube") {
              img.dataset["fallback"] = "1";
              img.src = img.src.replace("maxresdefault", "hqdefault");
            }
          }}
          className="parallax-media h-full w-full object-cover opacity-80 transition-opacity duration-[900ms] ease-out group-hover:opacity-100"
        />
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-background/70 to-transparent opacity-70 transition-opacity duration-700 group-hover:opacity-30"
        />
        <span
          aria-hidden="true"
          className="absolute bottom-4 left-4 translate-y-3 rounded-full border border-foreground/60 bg-background/70 px-4 py-2 text-[0.65rem] uppercase tracking-[0.25em] opacity-0 backdrop-blur-sm transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
        >
          Play film
        </span>
      </div>
      <div className="mt-5 flex items-baseline justify-between gap-6 border-t border-border pt-4 transition-colors duration-500 group-hover:border-foreground">
        <h3 className="font-display text-2xl tracking-tight md:text-3xl">{film.title}</h3>
        <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
          {film.category} — {film.year}
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
      className="border-t border-border px-6 py-24 md:px-10 md:py-32"
    >
      <div className="mx-auto max-w-[1400px]">
        <Reveal className="mb-14 flex items-baseline justify-between gap-6">
          <h2 id="work-heading" className="font-display text-3xl tracking-tight md:text-5xl">
            Selected work
          </h2>
          <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            {films.length} films
          </span>
        </Reveal>

        <div className="grid gap-x-10 gap-y-16 md:grid-cols-2">
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
