/**
 * Film sources — YouTube only.
 *
 * `mediaId` is the YouTube video ID: the part after `watch?v=` or `youtu.be/`.
 * To add a film, drop a new entry in `films` below.
 */
export type Film = {
  id: string;
  /** YouTube video ID. */
  mediaId: string;
  title: string;
  category: string;
  year: string;
  /** Optional poster override. */
  poster?: string;
  /** True when the film ships with uploaded captions. */
  captions?: boolean;
};

export function posterUrl(film: Film) {
  return film.poster ?? `https://img.youtube.com/vi/${film.mediaId}/maxresdefault.jpg`;
}

export function embedUrl(film: Film, autoplay = true) {
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

export function watchUrl(film: Film) {
  return `https://www.youtube.com/watch?v=${film.mediaId}`;
}

/** The showreel — swap `mediaId` when the new cut goes up. */
export const showreel: Film = {
  id: "reel",
  mediaId: "aqz-KE-bpKQ",
  title: "Showreel 2026",
  category: "Selected cuts",
  year: "2026",
};

/** Showcase: three films plus one trailer. */
export const films: Film[] = [
  { id: "f1", mediaId: "aqz-KE-bpKQ", title: "Northbound", category: "Film", year: "2026" },
  { id: "f2", mediaId: "9bZkp7q19f0", title: "Salt & Static", category: "Film", year: "2025" },
  { id: "f3", mediaId: "YE7VzlLtp-4", title: "The Long Room", category: "Film", year: "2025" },
  { id: "f4", mediaId: "b7k0a5hYnSI", title: "Florianna & Spiros", category: "Trailer", year: "2026" },
];
