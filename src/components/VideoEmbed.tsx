import { useState } from "react";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Lightweight YouTube facade: shows the poster frame until the viewer clicks,
 * then swaps in the real iframe so the page stays fast.
 */
export function VideoEmbed({
  videoId,
  title,
  className,
  autoPlayOnClick = true,
}: {
  videoId: string;
  title: string;
  className?: string;
  autoPlayOnClick?: boolean;
}) {
  const [playing, setPlaying] = useState(false);

  return (
    <div
      className={cn(
        "group relative aspect-video w-full overflow-hidden rounded-sm bg-surface",
        className,
      )}
    >
      {playing ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=${autoPlayOnClick ? 1 : 0}&rel=0&modestbranding=1&cc_load_policy=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`Play ${title}`}
          className="absolute inset-0 h-full w-full cursor-pointer"
        >
          <img
            src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
            alt=""
            loading="lazy"
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
  );
}
