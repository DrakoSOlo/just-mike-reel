/**
 * Reels / YouTube Shorts.
 *
 * Reels are added from the /reels page and stored in the browser
 * (localStorage) so Mike can curate the strip without a deploy. The seeded
 * list below is what a fresh visitor sees.
 */
import { useCallback, useEffect, useState } from "react";

export type Reel = {
  id: string;
  /** YouTube video ID. */
  mediaId: string;
  title: string;
  /** Optional short caption, e.g. "Client teaser". */
  note?: string;
};

const STORAGE_KEY = "jm.reels.v1";
const EVENT = "jm:reels";

export const seedReels: Reel[] = [
  { id: "r1", mediaId: "aqz-KE-bpKQ", title: "Cold open", note: "Vertical cut" },
  { id: "r2", mediaId: "9bZkp7q19f0", title: "Neon run", note: "Music short" },
  { id: "r3", mediaId: "YE7VzlLtp-4", title: "Golden hour", note: "Travel" },
  { id: "r4", mediaId: "b7k0a5hYnSI", title: "First look", note: "Wedding" },
];

/** Pull a YouTube video ID out of any watch / shorts / youtu.be / embed URL. */
export function parseYouTubeId(input: string): string | null {
  const value = input.trim();
  if (!value) return null;
  if (/^[\w-]{11}$/.test(value)) return value;
  try {
    const url = new URL(value.startsWith("http") ? value : `https://${value}`);
    const v = url.searchParams.get("v");
    if (v && /^[\w-]{11}$/.test(v)) return v;
    const parts = url.pathname.split("/").filter(Boolean);
    const last = parts[parts.length - 1];
    if (last && /^[\w-]{11}$/.test(last)) return last;
  } catch {
    return null;
  }
  return null;
}

export function reelPoster(reel: Reel) {
  return `https://i.ytimg.com/vi/${reel.mediaId}/hqdefault.jpg`;
}

export function reelEmbedUrl(reel: Reel, autoplay = true) {
  const params = new URLSearchParams({
    autoplay: autoplay ? "1" : "0",
    rel: "0",
    modestbranding: "1",
    playsinline: "1",
    cc_load_policy: "1",
  });
  return `https://www.youtube.com/embed/${reel.mediaId}?${params.toString()}`;
}

export function reelWatchUrl(reel: Reel) {
  return `https://www.youtube.com/shorts/${reel.mediaId}`;
}

function read(): Reel[] {
  if (typeof window === "undefined") return seedReels;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedReels;
    const parsed = JSON.parse(raw) as Reel[];
    return Array.isArray(parsed) ? parsed : seedReels;
  } catch {
    return seedReels;
  }
}

function write(reels: Reel[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(reels));
  } catch {
    /* storage unavailable — keep the in-memory list */
  }
  window.dispatchEvent(new CustomEvent(EVENT));
}

/** Reels list + mutators. SSR-safe: starts from the seed, syncs after mount. */
export function useReels() {
  const [reels, setReels] = useState<Reel[]>(seedReels);

  useEffect(() => {
    const sync = () => setReels(read());
    sync();
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const add = useCallback((reel: Omit<Reel, "id">) => {
    write([...read(), { ...reel, id: `r${Date.now().toString(36)}` }]);
  }, []);

  const remove = useCallback((id: string) => {
    write(read().filter((reel) => reel.id !== id));
  }, []);

  const move = useCallback((id: string, direction: -1 | 1) => {
    const list = read();
    const index = list.findIndex((reel) => reel.id === id);
    const next = index + direction;
    if (index < 0 || next < 0 || next >= list.length) return;
    const copy = [...list];
    const [item] = copy.splice(index, 1);
    if (item) copy.splice(next, 0, item);
    write(copy);
  }, []);

  const reset = useCallback(() => write(seedReels), []);

  return { reels, add, remove, move, reset };
}
