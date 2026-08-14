import { posterSources } from "@/lib/youtube-images";
import { cn } from "@/lib/utils";

/**
 * Responsive YouTube still: WebP with a JPEG fallback, width-described
 * srcset, intrinsic dimensions to prevent layout shift, and lazy decoding
 * everywhere except the LCP candidate (the showreel).
 */
export function Poster({
  mediaId,
  alt,
  priority = false,
  eager = false,
  sizes = "(min-width: 768px) 50vw, 100vw",
  className,
}: {
  mediaId: string;
  alt: string;
  priority?: boolean;
  /** Load immediately but at normal priority (first below-the-fold poster). */
  eager?: boolean;
  sizes?: string;
  className?: string;
}) {
  const s = posterSources(mediaId);

  return (
    <picture>
      <source type="image/webp" srcSet={s.webpSrcSet} sizes={sizes} />
      <img
        src={s.src}
        srcSet={s.jpgSrcSet}
        sizes={sizes}
        alt={alt}
        width={s.width}
        height={s.height}
        loading={priority || eager ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : eager ? "auto" : "low"}
        decoding={priority ? "sync" : "async"}
        className={cn("h-full w-full object-cover", className)}
      />
    </picture>
  );
}
