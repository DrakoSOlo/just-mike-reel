import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";

type Project = {
  id: string;
  videoId: string;
  title: string;
  category: string;
  year: string;
};

// Placeholder YouTube IDs — swap for the real films.
const projects: Project[] = [
  { id: "p1", videoId: "aqz-KE-bpKQ", title: "Northbound", category: "Brand film", year: "2026" },
  { id: "p2", videoId: "Cs6b2vSuUcQ", title: "Salt & Static", category: "Music video", year: "2025" },
  { id: "p3", videoId: "b4tCplbeJmM", title: "The Long Room", category: "Documentary", year: "2025" },
  { id: "p4", videoId: "LXb3EKWsInQ", title: "Halcyon", category: "Commercial", year: "2024" },
];

export function Work() {
  const [active, setActive] = useState<Project | null>(null);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active]);

  return (
    <section id="work" className="border-t border-border px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-[1400px]">
        <Reveal className="mb-14 flex items-baseline justify-between gap-6">
          <h2 className="font-display text-3xl tracking-tight md:text-5xl">Selected work</h2>
          <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            {projects.length} films
          </span>
        </Reveal>

        <div className="grid gap-x-10 gap-y-16 md:grid-cols-2">
          {projects.map((project, i) => (
            <Reveal
              key={project.id}
              delay={(i % 2) * 120}
              className={cn(i % 2 === 1 && "md:mt-24")}
            >
              <button
                type="button"
                onClick={() => setActive(project)}
                className="group block w-full text-left"
              >
                <div className="relative aspect-[16/10] overflow-hidden rounded-sm bg-surface">
                  <img
                    src={`https://img.youtube.com/vi/${project.videoId}/maxresdefault.jpg`}
                    alt={project.title}
                    loading="lazy"
                    className="h-full w-full object-cover opacity-75 transition-all duration-[900ms] ease-out group-hover:scale-105 group-hover:opacity-100"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-background/70 to-transparent opacity-70 transition-opacity duration-700 group-hover:opacity-40" />
                </div>
                <div className="mt-5 flex items-baseline justify-between gap-6 border-t border-border pt-4 transition-colors duration-500 group-hover:border-accent">
                  <h3 className="font-display text-2xl tracking-tight transition-colors duration-500 group-hover:text-accent md:text-3xl">
                    {project.title}
                  </h3>
                  <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                    {project.category} — {project.year}
                  </span>
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={active.title}
          onClick={() => setActive(null)}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-background/95 px-4 backdrop-blur-sm"
        >
          <button
            type="button"
            aria-label="Close video"
            onClick={() => setActive(null)}
            className="absolute right-6 top-6 rounded-full border border-border p-2 text-muted-foreground transition-colors hover:border-accent hover:text-accent"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <div className="aspect-video w-full overflow-hidden rounded-sm bg-surface">
              <iframe
                className="h-full w-full"
                src={`https://www.youtube.com/embed/${active.videoId}?autoplay=1&rel=0&modestbranding=1`}
                title={active.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <p className="mt-4 text-xs uppercase tracking-[0.3em] text-muted-foreground">
              {active.title} — {active.category}, {active.year}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
