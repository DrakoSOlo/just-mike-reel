import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Captions, CaptionsOff, ExternalLink, Pause, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import type { Film } from "@/data/films";
import { embedUrl, posterUrl, watchUrl } from "@/data/films";
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
  loadModule: (m: string) => void;
  unloadModule: (m: string) => void;
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

/* Bare text controls, in the spirit of a screening-room player: no chrome,
   just labels on the hairline under the frame. */
const controlClass =
  "inline-flex min-h-11 items-center px-0 text-[0.625rem] uppercase tracking-[0.3em] text-muted-foreground transition-colors duration-300 hover:text-foreground focus-visible:text-foreground disabled:opacity-40";


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

  const frameRef = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(autoPlay);
  const [muted, setMuted] = useState(false);
  const [captionsOn, setCaptionsOn] = useState(true);
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

  const toggleCaptions = useCallback(() => {
    const p = playerRef.current;
    if (!p) return;
    if (captionsOn) {
      p.unloadModule("captions");
      p.unloadModule("cc");
      setCaptionsOn(false);
      setStatus("Captions off");
    } else {
      p.loadModule("captions");
      p.loadModule("cc");
      setCaptionsOn(true);
      setStatus("Captions on");
    }
  }, [captionsOn]);

  const restart = useCallback(() => {
    const p = playerRef.current;
    if (!p) return;
    p.seekTo(0, true);
    p.playVideo();
    setStatus("Restarted from the beginning");
  }, []);

  return (
    <div className={cn("w-full", className)}>
      <div className="group relative aspect-video w-full overflow-hidden bg-surface">
        {active ? (
          <iframe
            ref={frameRef}
            className="absolute inset-0 h-full w-full"
            src={embedUrl(film, autoPlay)}
            title={`${film.title} — ${film.category}, ${film.year}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
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
        <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-1 border-t border-border pt-2">
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
          <button
            type="button"
            onClick={toggleMute}
            disabled={!ready}
            aria-pressed={muted}
            className={controlClass}
          >
            {muted ? "Unmute" : "Mute"}
          </button>
          <button
            type="button"
            onClick={toggleCaptions}
            disabled={!ready}
            aria-pressed={captionsOn}
            className={controlClass}
          >
            {captionsOn ? "Captions off" : "Captions on"}
          </button>
          <button
            type="button"
            onClick={restart}
            disabled={!ready}
            className={controlClass}
          >
            Restart
          </button>

          <a
            href={watchUrl(film)}
            target="_blank"
            rel="noreferrer"
            className={cn(controlClass, "ml-auto")}
          >
            <span>
              YouTube
              <span className="sr-only">
                {` — open ${film.title} in a new tab`}
              </span>
            </span>
          </a>

          <p id={statusId} role="status" aria-live="polite" className="sr-only">
            {status}
          </p>
        </div>
      )}
    </div>
  );
}

