/**
 * Film sources.
 *
 * A film can live on YouTube or on Google Drive. To move a Drive film to
 * YouTube later, change `source` to "youtube" and swap `id` for the YouTube
 * video ID — nothing else has to change.
 *
 * YouTube id  -> the part after `watch?v=` or `youtu.be/`
 * Drive id    -> the part after `/file/d/` in the share link
 *                (the file must be shared as "Anyone with the link").
 */
export type FilmSource = "youtube" | "drive";

export type Film = {
  id: string;
  source: FilmSource;
  /** YouTube video ID or Google Drive file ID. */
  mediaId: string;
  title: string;
  category: string;
  year: string;
  /** Optional poster override; Drive films fall back to the Drive thumbnail. */
  poster?: string;
  /** True when the film ships with burned-in or uploaded captions. */
  captions?: boolean;
};

export function posterUrl(film: Film) {
  if (film.poster) return film.poster;
  return film.source === "youtube"
    ? `https://img.youtube.com/vi/${film.mediaId}/maxresdefault.jpg`
    : `https://drive.google.com/thumbnail?id=${film.mediaId}&sz=w1600`;
}

export function embedUrl(film: Film, autoplay = true) {
  if (film.source === "youtube") {
    const params = new URLSearchParams({
      autoplay: autoplay ? "1" : "0",
      rel: "0",
      modestbranding: "1",
      cc_load_policy: "1",
      enablejsapi: "1",
      playsinline: "1",
    });
    return `https://www.youtube.com/embed/${film.mediaId}?${params.toString()}`;
  }
  return `https://drive.google.com/file/d/${film.mediaId}/preview`;
}

export function watchUrl(film: Film) {
  return film.source === "youtube"
    ? `https://www.youtube.com/watch?v=${film.mediaId}`
    : `https://drive.google.com/file/d/${film.mediaId}/view`;
}

/** The showreel. Swap to a YouTube ID once it's uploaded. */
export const showreel: Film = {
  id: "reel",
  source: "drive",
  mediaId: "1HOsDuBim9oQXIC4qx_9Nn00YxyHU3z1Z",
  title: "Florianna & Spiros — trailer",
  category: "Wedding film",
  year: "2026",
};

export const films: Film[] = [
  {
    id: "f1",
    source: "drive",
    mediaId: "1HOsDuBim9oQXIC4qx_9Nn00YxyHU3z1Z",
    title: "Florianna & Spiros",
    category: "Wedding trailer",
    year: "2026",
  },
  { id: "f2", source: "youtube", mediaId: "aqz-KE-bpKQ", title: "Northbound", category: "Brand film", year: "2026" },
  { id: "f3", source: "youtube", mediaId: "9bZkp7q19f0", title: "Salt & Static", category: "Music video", year: "2025" },
  { id: "f4", source: "youtube", mediaId: "YE7VzlLtp-4", title: "The Long Room", category: "Documentary", year: "2025" },
];
