import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Hero } from "@/components/site/Hero";
import { Showreel } from "@/components/site/Showreel";
import { Work } from "@/components/site/Work";
import { About } from "@/components/site/About";
import { Contact } from "@/components/site/Contact";
import { CursorLens } from "@/components/motion/CursorLens";
import { ScrollProgress } from "@/components/motion/ScrollProgress";

const title = "just mike — Videographer & Director";
const description =
  "Cinematic brand films, music videos and documentaries by just mike. Watch the 2026 showreel and selected work.";

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
          jobTitle: "Videographer & Director",
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
      <ScrollProgress />
      <CursorLens />
      <Nav />
      <main id="main" className="bg-background text-foreground">
        <Hero />
        <Showreel />
        <Work />
        <About />
        <Contact />
      </main>
    </>
  );
}
