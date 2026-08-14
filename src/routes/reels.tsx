import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowDown, ArrowUp, Trash2 } from "lucide-react";

import { parseYouTubeId, reelWatchUrl, useReels } from "@/data/reels";
import { Bloom } from "@/components/motion/Bloom";
import { AmbientBackdrop } from "@/components/motion/AmbientBackdrop";
import { PageCurtain } from "@/components/motion/PageCurtain";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { CursorLens } from "@/components/motion/CursorLens";
import { Reveal } from "@/components/Reveal";
import { Poster } from "@/components/media/Poster";

const title = "Add reels — just mike";
const description =
  "Paste a YouTube Shorts or video link to add it to the just mike reels strip, reorder the line-up or remove a cut.";

export const Route = createFileRoute("/reels")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "noindex, follow" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
  }),
  component: ReelsManager,
});

function ReelsManager() {
  const { reels, add, remove, move, reset } = useReels();
  const [link, setLink] = useState("");
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mediaId = parseYouTubeId(link);
    if (!mediaId) {
      setError("That doesn't look like a YouTube link. Paste a Shorts, watch or youtu.be URL.");
      return;
    }
    add({ mediaId, title: name.trim() || "Untitled reel", ...(note.trim() ? { note: note.trim() } : {}) });
    setError(null);
    setStatus(`Added ${name.trim() || "Untitled reel"} to the reels strip.`);
    setLink("");
    setName("");
    setNote("");
  };

  return (
    <>
      <PageCurtain />
      <AmbientBackdrop />
      <ScrollProgress />
      <CursorLens />
      <main className="relative min-h-svh overflow-hidden px-5 py-10 md:px-10 md:py-16">
        <Bloom variant="a" opacity={0.4} className="-left-24 top-10 h-[28rem] w-[28rem]" />
        <Bloom variant="b" opacity={0.2} className="-right-32 bottom-10 h-[24rem] w-[24rem]" />

        <div className="relative z-10 mx-auto max-w-[1000px]">
          <Reveal>
          <a
            href="/"
            className="inline-flex min-h-11 items-center text-xs uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground"
          >
            ← just.mike
          </a>

          <h1 className="mt-6 font-display text-[clamp(2.4rem,7vw,4.5rem)] leading-[0.95] tracking-tight">
            Add a reel
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Paste a YouTube Shorts (or regular video) link and it lands in the reels strip on the
            home page. The line-up is saved in this browser.
          </p>
          </Reveal>

          <Reveal delay={90}>
          <form onSubmit={onSubmit} className="mt-8 grid gap-4 border-t border-border pt-8 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="reel-link" className="spec-label">
                YouTube link
              </label>
              <input
                id="reel-link"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://www.youtube.com/shorts/…"
                aria-describedby={error ? "reel-error" : undefined}
                aria-invalid={error ? true : undefined}
                required
                className="mt-2 h-12 w-full border border-border bg-transparent px-3 text-sm text-foreground outline-none focus-visible:border-foreground"
              />
            </div>
            <div>
              <label htmlFor="reel-title" className="spec-label">
                Title
              </label>
              <input
                id="reel-title"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Cold open"
                className="mt-2 h-12 w-full border border-border bg-transparent px-3 text-sm text-foreground outline-none focus-visible:border-foreground"
              />
            </div>
            <div>
              <label htmlFor="reel-note" className="spec-label">
                Note (optional)
              </label>
              <input
                id="reel-note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Music short"
                className="mt-2 h-12 w-full border border-border bg-transparent px-3 text-sm text-foreground outline-none focus-visible:border-foreground"
              />
            </div>

            {error && (
              <p id="reel-error" role="alert" className="sm:col-span-2 text-sm text-destructive">
                {error}
              </p>
            )}

            <div className="sm:col-span-2 flex flex-wrap items-center gap-4">
              <button
                type="submit"
                className="inline-flex min-h-11 items-center border border-foreground px-5 text-xs uppercase tracking-[0.3em] transition-colors duration-300 hover:bg-foreground hover:text-background"
              >
                Add reel
              </button>
              <button
                type="button"
                onClick={() => {
                  reset();
                  setStatus("Reels reset to the default line-up.");
                }}
                className="inline-flex min-h-11 items-center text-xs uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground"
              >
                Reset to defaults
              </button>
            </div>
          </form>
          </Reveal>

          <p aria-live="polite" className="sr-only">
            {status}
          </p>

          <Reveal delay={140}>
          <h2 className="mt-12 font-display text-2xl tracking-tight md:text-3xl">
            Current line-up
          </h2>
          <ul className="mt-5 grid gap-px border-t border-border">
            {reels.map((reel, i) => (
              <li
                key={reel.id}
                className="group flex items-center gap-4 border-b border-border py-4"
              >
                <span className="h-14 w-10 shrink-0 overflow-hidden">
                  <Poster mediaId={reel.id} alt="" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-lg tracking-tight">{reel.title}</p>
                  <a
                    href={reelWatchUrl(reel)}
                    target="_blank"
                    rel="noreferrer"
                    className="spec-label underline-offset-4 hover:underline"
                  >
                    {reel.note ? `${reel.note} / ` : ""}
                    {reel.mediaId}
                  </a>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    onClick={() => move(reel.id, -1)}
                    disabled={i === 0}
                    aria-label={`Move ${reel.title} earlier`}
                    className="inline-flex h-11 w-11 items-center justify-center disabled:opacity-30"
                  >
                    <ArrowUp aria-hidden="true" className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(reel.id, 1)}
                    disabled={i === reels.length - 1}
                    aria-label={`Move ${reel.title} later`}
                    className="inline-flex h-11 w-11 items-center justify-center disabled:opacity-30"
                  >
                    <ArrowDown aria-hidden="true" className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      remove(reel.id);
                      setStatus(`Removed ${reel.title}.`);
                    }}
                    aria-label={`Remove ${reel.title}`}
                    className="inline-flex h-11 w-11 items-center justify-center hover:text-destructive"
                  >
                    <Trash2 aria-hidden="true" className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
          </Reveal>
        </div>
      </main>
    </>
  );
}
