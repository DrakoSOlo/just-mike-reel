import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Hero } from "@/components/site/Hero";
import { Showreel } from "@/components/site/Showreel";
import { Work } from "@/components/site/Work";
import { Studio } from "@/components/site/Studio";
import { Craft } from "@/components/site/Craft";
import { AccessibilityMenu } from "@/components/a11y/AccessibilityMenu";
import { CursorLens } from "@/components/motion/CursorLens";
import { AmbientBackdrop } from "@/components/motion/AmbientBackdrop";
import { PageCurtain } from "@/components/motion/PageCurtain";
import { ScrollProgress } from "@/components/motion/ScrollProgress";

const title = "just mike — Video Editor & Filmmaker";
const description =
  "Selected edits, short films and music videos by just mike — a video editor driven by honesty, rhythm and cinematic storytelling.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: "just mike",
          jobTitle: "Video Editor & Filmmaker",
          email: "hello@justmike.film",
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
