import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Hero } from "@/components/site/Hero";
import { Showreel } from "@/components/site/Showreel";
import { Work } from "@/components/site/Work";
import { Studio } from "@/components/site/Studio";
import { Craft } from "@/components/site/Craft";
import { AccessibilityMenu } from "@/components/a11y/AccessibilityMenu";
import { CookieBanner } from "@/components/consent/CookieBanner";
import { CursorLens } from "@/components/motion/CursorLens";
import { AmbientBackdrop } from "@/components/motion/AmbientBackdrop";
import { PageCurtain } from "@/components/motion/PageCurtain";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { showreel, posterUrl, watchUrl, films } from "@/data/films";
import { posterSources } from "@/lib/youtube-images";


const title = "just mike — Video Editor & Filmmaker";
const description =
  "Selected edits, short films and music videos by just mike — a video editor driven by honesty, rhythm and cinematic storytelling.";
const image = posterUrl(showreel);

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "author", content: "just mike" },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://just-mike-reel.lovable.app/" },
      { property: "og:site_name", content: "just mike" },
      { property: "og:locale", content: "en_US" },
      { property: "og:image", content: image },
      { property: "og:image:alt", content: "Still frame from the just mike showreel" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: image },
      { name: "twitter:image:alt", content: "Still frame from the just mike showreel" },
    ],
    links: [
      { rel: "canonical", href: "https://just-mike-reel.lovable.app/" },
      // The showreel still is the first poster a visitor sees — fetch it early.
      {
        rel: "preload",
        as: "image",
        href: `https://i.ytimg.com/vi_webp/${showreel.mediaId}/hqdefault.webp`,
        imagesrcset: posterSources(showreel.mediaId).webpSrcSet,
        imagesizes: "(min-width: 1024px) 900px, 100vw",
        fetchpriority: "high",
      },
    ],

    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Person",
              "@id": "/#mike",
              name: "just mike",
              alternateName: "Mike",
              jobTitle: "Video Editor & Filmmaker",
              description,
              url: "/",
              image,
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
              "@id": "/#website",
              name: "just mike",
              url: "/",
              description,
              inLanguage: "en",
              publisher: { "@id": "/#mike" },
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
                  creator: { "@id": "/#mike" },
                },

              })),
            },
          ],
        }),
      },
    ],
  }),
  component: Index,
});


function Index() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[90] focus:rounded-sm focus:bg-foreground focus:px-4 focus:py-3 focus:text-sm focus:text-background"
      >
        Skip to main content
      </a>
      <PageCurtain />
      <AmbientBackdrop />
      <ScrollProgress />
      <CursorLens />
      <AccessibilityMenu />
      <CookieBanner />
      <Nav />
      <main id="main" className="relative text-foreground">
        <Hero />
        <Showreel />
        <Work />
        <Studio />
        <Craft />
      </main>
    </>
  );
}
