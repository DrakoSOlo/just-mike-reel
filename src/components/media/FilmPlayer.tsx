import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Captions, CaptionsOff, ExternalLink, Pause, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import type { Film } from "@/data/films";
import { embedUrl, posterUrl, watchUrl } from "@/data/films";
import { cn } from "@/lib/utils";

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

const controlClass =
  "inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-sm border border-border px-3 text-xs uppercase tracking-[0.2em] text-foreground transition-colors duration-300 hover:border-foreground hover:bg-surface";

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

  const isYouTube = film.source === "youtube";

  useEffect(() => {
    if (!active || !isYouTube) return;
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
  }, [active, isYouTube]);

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
      <div className="group relative aspect-video w-full overflow-hidden rounded-sm bg-surface">
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
            onClick={() => setSelfActive(true)}
            className="absolute inset-0 h-full w-full cursor-pointer"
          >
            <span className="sr-only">{`Play ${film.title}, ${film.category}, ${film.year}`}</span>
            <img
              src={posterUrl(film)}
              alt=""
              loading="lazy"
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
              className="h-full w-full object-cover opacity-85 transition-all duration-700 ease-out group-hover:scale-[1.03] group-hover:opacity-100"
            />
            <span
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/10 to-transparent"
            />
            <span
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-foreground/70 bg-background/40 backdrop-blur-sm transition-all duration-500 group-hover:scale-110 group-hover:border-foreground group-hover:bg-background/60"
            >
              <Play className="ml-0.5 h-5 w-5" fill="currentColor" />
            </span>
          </button>
        )}
      </div>

      {active && (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          {isYouTube ? (
            <>
              <button
                type="button"
                onClick={togglePlay}
                disabled={!ready}
                aria-pressed={playing}
                aria-describedby={statusId}
                className={cn(controlClass, "disabled:opacity-50")}
              >
                {playing ? <Pause className="h-4 w-4" aria-hidden="true" /> : <Play className="h-4 w-4" aria-hidden="true" />}
                {playing ? "Pause" : "Play"}
              </button>
              <button
                type="button"
                onClick={toggleMute}
                disabled={!ready}
                aria-pressed={muted}
                className={cn(controlClass, "disabled:opacity-50")}
              >
                {muted ? <VolumeX className="h-4 w-4" aria-hidden="true" /> : <Volume2 className="h-4 w-4" aria-hidden="true" />}
                {muted ? "Unmute" : "Mute"}
              </button>
              <button
                type="button"
                onClick={toggleCaptions}
                disabled={!ready}
                aria-pressed={captionsOn}
                className={cn(controlClass, "disabled:opacity-50")}
              >
                {captionsOn ? <Captions className="h-4 w-4" aria-hidden="true" /> : <CaptionsOff className="h-4 w-4" aria-hidden="true" />}
                Captions
              </button>
              <button
                type="button"
                onClick={restart}
                disabled={!ready}
                className={cn(controlClass, "disabled:opacity-50")}
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                Restart
              </button>
            </>
          ) : (
            <p className="text-xs leading-relaxed text-muted-foreground">
              This film streams from Google Drive. Use the player's own
              keyboard controls: space or K to play and pause, arrow keys to
              seek, M to mute, C for captions when the file has them.
            </p>
          )}

          <a
            href={watchUrl(film)}
            target="_blank"
            rel="noreferrer"
            className={cn(controlClass, "link-sweep")}
          >
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
            <span>
              Open {film.title}
              <span className="sr-only"> in a new tab on {isYouTube ? "YouTube" : "Google Drive"}</span>
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
