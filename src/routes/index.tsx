import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Hero } from "@/components/site/Hero";
import { Showreel } from "@/components/site/Showreel";
import { Reels } from "@/components/site/Reels";
import { Work } from "@/components/site/Work";
import { Studio } from "@/components/site/Studio";
import { Craft } from "@/components/site/Craft";
import { AccessibilityMenu } from "@/components/a11y/AccessibilityMenu";
import { CookieBanner } from "@/components/consent/CookieBanner";
import { CursorLens } from "@/components/motion/CursorLens";
import { AmbientBackdrop } from "@/components/motion/AmbientBackdrop";
import { PageCurtain } from "@/components/motion/PageCurtain";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { showreel } from "@/data/films";
import { posterSources } from "@/lib/youtube-images";


import { homeJsonLd, homeMeta, SITE_URL } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: homeMeta(),
    links: [
      { rel: "canonical", href: `${SITE_URL}/` },
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
    scripts: [{ type: "application/ld+json", children: JSON.stringify(homeJsonLd()) }],
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
        <Reels />
        <Work />
        <Studio />
        <Craft />
      </main>
    </>
  );
}
