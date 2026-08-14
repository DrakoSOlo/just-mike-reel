import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Play } from "lucide-react";
import type { Film } from "@/data/films";
import { embedUrl } from "@/data/films";
import { cn } from "@/lib/utils";
import { Poster } from "@/components/media/Poster";
import { track } from "@/lib/analytics";


/* ------------------------------------------------------------------ */
/* YouTube IFrame API loader                                           */
/* ------------------------------------------------------------------ */

type YTPlayer = {
  playVideo: () => void;
  pauseVideo: () => void;
  mute: () => void;
  unMute: () => void;
  isMuted: () => boolean;
  seekTo: (s: number, allow: boolean) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  destroy: () => void;
};

let apiPromise: Promise<void> | null = null;

function loadYouTubeApi(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  const w = window as unknown as { YT?: { Player?: unknown }; onYouTubeIframeAPIReady?: () => void };
  if (w.YT?.Player) return Promise.resolve();
  apiPromise ??= new Promise<void>((resolve) => {
    const previous = w.onYouTubeIframeAPIReady;
    w.onYouTubeIframeAPIReady = () => {
      previous?.();
      resolve();
    };
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    document.head.appendChild(script);
  });
  return apiPromise;
}

function timecode(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) seconds = 0;
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/* Dot controls: no words, just small graphic marks on the hairline. */
const controlClass =
  "ctl inline-flex h-11 w-11 items-center justify-center disabled:opacity-40";


/* ------------------------------------------------------------------ */
/* Film player                                                         */
/* ------------------------------------------------------------------ */

export function FilmPlayer({
  film,
  className,
  autoPlay = true,
  /** Render the player immediately instead of behind a poster. */
  active: activeProp,
}: {
  film: Film;
  className?: string;
  autoPlay?: boolean;
  active?: boolean;
}) {
  const [selfActive, setSelfActive] = useState(false);
  const active = activeProp ?? selfActive;

  const stageRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const timeRef = useRef<HTMLSpanElement>(null);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(autoPlay);
  const [muted, setMuted] = useState(false);
  const statusId = useId();
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!active) return;
    let cancelled = false;

    loadYouTubeApi().then(() => {
      if (cancelled || !frameRef.current) return;
      const YT = (window as unknown as { YT: { Player: new (el: Element, o: unknown) => YTPlayer } }).YT;
      playerRef.current = new YT.Player(frameRef.current, {
        events: {
          onReady: () => {
            if (cancelled) return;
            setReady(true);
            setMuted(Boolean(playerRef.current?.isMuted()));
          },
          onStateChange: (e: { data: number }) => {
            if (e.data === 1) {
              setPlaying(true);
              setStatus("Playing");
            } else if (e.data === 2) {
              setPlaying(false);
              setStatus("Paused");
            } else if (e.data === 0) {
              setPlaying(false);
              setStatus("Ended");
            }
          },
        },
      });
    });

    return () => {
      cancelled = true;
      playerRef.current?.destroy();
      playerRef.current = null;
      setReady(false);
    };
  }, [active]);

  /* Timecode is written straight into the text node once a second, so the
     running clock never triggers a React render. */
  useEffect(() => {
    if (!ready) return;
    const tick = () => {
      const p = playerRef.current;
      const el = timeRef.current;
      if (!p || !el) return;
      el.textContent = `${timecode(p.getCurrentTime())} / ${timecode(p.getDuration())}`;
    };
    tick();
    const id = window.setInterval(tick, 500);
    return () => window.clearInterval(id);
  }, [ready]);

  const togglePlay = useCallback(() => {
    const p = playerRef.current;
    if (!p) return;
    if (playing) p.pauseVideo();
    else p.playVideo();
  }, [playing]);

  const toggleMute = useCallback(() => {
    const p = playerRef.current;
    if (!p) return;
    if (p.isMuted()) {
      p.unMute();
      setMuted(false);
      setStatus("Sound on");
    } else {
      p.mute();
      setMuted(true);
      setStatus("Muted");
    }
  }, []);

  const toggleFullscreen = useCallback(() => {
    const el = stageRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      void document.exitFullscreen();
      setStatus("Exited fullscreen");
    } else {
      void el.requestFullscreen?.();
      setStatus("Fullscreen");
    }
  }, []);

  return (
    <div className={cn("w-full", className)}>
      <div ref={stageRef} className="group relative aspect-video w-full overflow-hidden bg-surface">
        {active ? (
          <iframe
            ref={frameRef}
            className="absolute inset-0 h-full w-full"
            src={embedUrl(film, autoPlay)}
            title={`${film.title} — ${film.category}, ${film.year}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => {
              setSelfActive(true);
              track("film_play", { title: film.title });
            }}
            data-cursor="play"
            className="absolute inset-0 h-full w-full cursor-pointer"
          >
            <span className="sr-only">{`Play ${film.title}, ${film.category}, ${film.year}`}</span>
            <Poster
              mediaId={film.mediaId}
              alt=""
              priority
              sizes="(min-width: 1024px) 900px, 100vw"
              className="opacity-90 transition-opacity duration-500 ease-out group-hover:opacity-100"
            />
            {/* Same hairline graphic as the rest of the page; inverts on hover. */}
            <span aria-hidden="true" className="frame-ticks absolute inset-0" />
            <span aria-hidden="true" className="absolute bottom-4 left-4">
              <span className="play-badge">
                <Play fill="currentColor" aria-hidden="true" />
                Play
              </span>
            </span>

          </button>
        )}
      </div>

      {active && (
        <div className="mt-3 flex items-center gap-x-6 border-t border-border pt-2">
          <button
            type="button"
            onClick={togglePlay}
            disabled={!ready}
            aria-pressed={playing}
            aria-describedby={statusId}
            className={controlClass}
          >
            {playing ? "Pause" : "Play"}
          </button>

          <span
            ref={timeRef}
            aria-hidden="true"
            className="font-mono text-[0.625rem] tabular-nums tracking-[0.2em] text-muted-foreground"
          >
            00:00 / 00:00
          </span>

          <button
            type="button"
            onClick={toggleMute}
            disabled={!ready}
            aria-pressed={muted}
            className={cn(controlClass, "ml-auto")}
          >
            {muted ? "Unmute" : "Mute"}
          </button>
          <button type="button" onClick={toggleFullscreen} className={controlClass}>
            Full
          </button>

          <p id={statusId} role="status" aria-live="polite" className="sr-only">
            {status}
          </p>
        </div>
      )}
    </div>
  );
}
