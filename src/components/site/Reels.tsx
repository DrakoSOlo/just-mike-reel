import { useRef, useState } from "react";
import { Play } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Reveal } from "@/components/Reveal";
import { Bloom } from "@/components/motion/Bloom";
import { useReels, reelEmbedUrl, reelPoster, type Reel } from "@/data/reels";
import { track } from "@/lib/analytics";

export function Reels() {
  const { reels } = useReels();
  const [active, setActive] = useState<Reel | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const dragRef = useRef<{ x: number; y: number; moved: boolean } | null>(null);

  return (
    <section
      id="reels"
      aria-labelledby="reels-heading"
      className="cv-auto relative overflow-hidden border-t border-border px-5 py-10 md:px-10 md:py-16"
    >
      <Bloom variant="b" opacity={0.22} className="-left-40 top-0 h-[20rem] w-[20rem] md:h-[28rem] md:w-[28rem]" />

      <div className="relative z-10 mx-auto max-w-[1400px]">
        <Reveal className="mb-6 flex items-baseline justify-between gap-6 border-b border-border pb-4 md:mb-8">
          <h2 id="reels-heading" className="font-display text-3xl tracking-tight md:text-5xl">
            Reels
          </h2>
          <a
            href="/reels"
            className="spec-label inline-flex min-h-11 items-center underline-offset-4 hover:underline"
          >
            {reels.length} shorts / manage
          </a>
        </Reveal>

        {reels.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No reels yet — add YouTube Shorts links from the{" "}
            <a href="/reels" className="underline underline-offset-4">
              reels manager
            </a>
            .
          </p>
        ) : (
          <ul className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 md:mx-0 md:grid md:grid-cols-4 md:overflow-visible md:px-0">
            {reels.map((reel, i) => (
              <li key={reel.id} className="w-[62vw] shrink-0 snap-start sm:w-[38vw] md:w-auto">
                <Reveal delay={(i % 4) * 90}>
                  <button
                    type="button"
                    data-cursor="play"
                    onPointerDown={(e) => {
                      dragRef.current = { x: e.clientX, y: e.clientY, moved: false };
                    }}
                    onPointerMove={(e) => {
                      const d = dragRef.current;
                      if (!d) return;
                      if (Math.abs(e.clientX - d.x) > 10 || Math.abs(e.clientY - d.y) > 10) d.moved = true;
                    }}
                    onClick={(e) => {
                      if (dragRef.current?.moved) {
                        dragRef.current = null;
                        return;
                      }
                      dragRef.current = null;
                      triggerRef.current = e.currentTarget;
                      setActive(reel);
                      track("reel_play", { title: reel.title });
                    }}
                    className="group block w-full text-left"
                  >
                    <span className="relative block aspect-[9/16] overflow-hidden bg-surface">
                      <img
                        src={reelPoster(reel)}
                        alt={`Still frame from the reel ${reel.title}`}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full scale-[1.6] object-cover opacity-90 transition-transform duration-700 ease-out group-hover:scale-[1.7]"
                      />
                      <span aria-hidden="true" className="frame-ticks absolute inset-0" />
                      <span aria-hidden="true" className="absolute bottom-3 left-3">
                        <span className="play-badge">
                          <Play fill="currentColor" aria-hidden="true" />
                          Play
                        </span>
                      </span>
                    </span>
                    <span className="mt-3 flex items-baseline justify-between gap-3 border-t border-border pt-3 transition-colors duration-500 group-hover:border-foreground">
                      <span className="font-display text-lg tracking-tight">{reel.title}</span>
                      {reel.note && <span className="spec-label">{reel.note}</span>}
                    </span>
                  </button>
                </Reveal>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Dialog open={Boolean(active)} onOpenChange={(open) => !open && setActive(null)}>
        <DialogContent
          className="max-w-sm border-border bg-background p-4"
          onOpenAutoFocus={(e) => {
            e.preventDefault();
            (e.currentTarget as HTMLElement).focus();
          }}
          onCloseAutoFocus={(e) => {
            e.preventDefault();
            triggerRef.current?.focus();
          }}
        >
          <DialogHeader className="sr-only">
            <DialogTitle>{active?.title ?? "Reel"}</DialogTitle>
            <DialogDescription>{active?.note ?? "Vertical short"}</DialogDescription>
          </DialogHeader>
          {active && (
            <>
              <div className="aspect-[9/16] w-full overflow-hidden bg-surface">
                <iframe
                  key={active.id}
                  src={reelEmbedUrl(active)}
                  title={`${active.title} — vertical reel`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full"
                />
              </div>
              <p className="mt-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">
                {active.title}
                {active.note ? ` — ${active.note}` : ""}
              </p>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
