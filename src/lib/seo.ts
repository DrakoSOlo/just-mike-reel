import { films, posterUrl, showreel, watchUrl } from "@/data/films";

/** Canonical production origin — never a preview host. */
export const SITE_URL = "https://justmike.gr";

export const seoTitle = "just mike — Video Editor & Filmmaker";

export const seoDescription =
  "Selected edits, short films and music videos by just mike — a video editor driven by honesty, rhythm and cinematic storytelling.";

export const seoImage = posterUrl(showreel);

export const seoImageAlt = "Still frame from the just mike showreel";

/** Head meta for the home route, kept here so regression tests can assert it. */
export function homeMeta() {
  return [
    { title: seoTitle },
    { name: "description", content: seoDescription },
    { name: "author", content: "just mike" },
    { name: "robots", content: "index, follow" },
    { property: "og:title", content: seoTitle },
    { property: "og:description", content: seoDescription },
    { property: "og:type", content: "website" },
    { property: "og:url", content: `${SITE_URL}/` },
    { property: "og:site_name", content: "just mike" },
    { property: "og:locale", content: "en_US" },
    { property: "og:image", content: seoImage },
    { property: "og:image:alt", content: seoImageAlt },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: seoTitle },
    { name: "twitter:description", content: seoDescription },
    { name: "twitter:image", content: seoImage },
    { name: "twitter:image:alt", content: seoImageAlt },
  ];
}

/** schema.org graph for the home route. */
export function homeJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#mike`,
        name: "just mike",
        alternateName: "Mike",
        jobTitle: "Video Editor & Filmmaker",
        description: seoDescription,
        url: `${SITE_URL}/`,
        image: seoImage,
        knowsAbout: [
          "Video editing",
          "Colour grading",
          "Short films",
          "Music videos",
          "Documentary",
        ],
        worksFor: { "@type": "Organization", name: "just mike" },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: "just mike",
        url: `${SITE_URL}/`,
        description: seoDescription,
        inLanguage: "en",
        publisher: { "@id": `${SITE_URL}/#mike` },
      },
      {
        "@type": "ItemList",
        name: "Selected work",
        itemListElement: films.map((film, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "VideoObject",
            name: film.title,
            description: `${film.title} — a ${film.category.toLowerCase()} from ${film.year}, edited by just mike.`,
            genre: film.category,
            thumbnailUrl: [posterUrl(film)],
            contentUrl: watchUrl(film),
            embedUrl: `https://www.youtube.com/embed/${film.mediaId}`,
            url: watchUrl(film),
            uploadDate: `${film.year}-01-01T00:00:00+00:00`,
            creator: { "@id": `${SITE_URL}/#mike` },
          },
        })),
      },
    ],
  };
}
