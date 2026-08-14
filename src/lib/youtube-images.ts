/**
 * YouTube poster images, served responsively.
 *
 * YouTube publishes every still in both JPEG (`/vi/`) and WebP (`/vi_webp/`)
 * at four widths. We hand the browser a `<picture>` with a WebP source first
 * (roughly 30% smaller) and a JPEG fallback, each with a width-described
 * srcset so phones never download a 1280px still. AVIF is not published by
 * YouTube, so WebP is the smallest format available for these.
 */

export type PosterSources = {
  webpSrcSet: string;
  jpgSrcSet: string;
  src: string;
  width: number;
  height: number;
};

const WIDTHS = [
  { name: "mqdefault", w: 320 },
  { name: "hqdefault", w: 480 },
  { name: "sddefault", w: 640 },
  { name: "maxresdefault", w: 1280 },
] as const;

export function posterSources(mediaId: string): PosterSources {
  const webpSrcSet = WIDTHS.map(
    (v) => `https://i.ytimg.com/vi_webp/${mediaId}/${v.name}.webp ${v.w}w`,
  ).join(", ");
  const jpgSrcSet = WIDTHS.map(
    (v) => `https://i.ytimg.com/vi/${mediaId}/${v.name}.jpg ${v.w}w`,
  ).join(", ");

  return {
    webpSrcSet,
    jpgSrcSet,
    src: `https://i.ytimg.com/vi/${mediaId}/hqdefault.jpg`,
    width: 1280,
    height: 720,
  };
}
