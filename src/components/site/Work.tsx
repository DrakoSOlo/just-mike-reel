import { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Reveal } from "@/components/Reveal";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
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
  { id: "p2", videoId: "9bZkp7q19f0", title: "Salt & Static", category: "Music video", year: "2025" },
  { id: "p3", videoId: "YE7VzlLtp-4", title: "The Long Room", category: "Documentary", year: "2025" },
  { id: "p4", videoId: "LXb3EKWsInQ", title: "Halcyon", category: "Commercial", year: "2024" },
];

function ProjectCard({ project, onOpen }: { project: Project; onOpen: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const reduced = useReducedMotion();
  const [style, setStyle] = useState<React.CSSProperties>({});

  const onMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    setStyle({
      transform: `perspective(1100px) rotateX(${(0.5 - py) * 6}deg) rotateY(${(px - 0.5) * 8}deg) translateY(-6px)`,
    });
    ref.current.style.setProperty("--spot-x", `${px * 100}%`);
    ref.current.style.setProperty("--spot-y", `${py * 100}%`);
    ref.current.style.setProperty("--spot-opacity", "0.9");
  };

  const reset = () => {
    setStyle({});
    ref.current?.style.setProperty("--spot-opacity", "0");
  };

  return (
    <button
      ref={ref}
      type="button"
      onMouseMove={onMove}
      onMouseLeave={reset}
      onBlur={reset}
      onClick={onOpen}
      style={style}
      className="spotlight group relative block w-full text-left transition-transform duration-500 ease-out"
    >
      <div className="relative aspect-[16/10] overflow-hidden rounded-sm bg-surface">
        <img
          src={`https://img.youtube.com/vi/${project.videoId}/maxresdefault.jpg`}
          alt={`Still frame from ${project.title}, a ${project.category.toLowerCase()} from ${project.year}`}
          loading="lazy"
          onLoad={(e) => {
            const img = e.currentTarget;
            if (img.naturalWidth < 200 && !img.dataset["fallback"]) {
              img.dataset["fallback"] = "1";
              img.src = img.src.replace("maxresdefault", "hqdefault");
            }
          }}
          onError={(e) => {
            const img = e.currentTarget;
            if (!img.dataset["fallback"]) {
              img.dataset["fallback"] = "1";
              img.src = img.src.replace("maxresdefault", "hqdefault");
            }
          }}
          className="h-full w-full object-cover opacity-80 transition-all duration-[900ms] ease-out group-hover:scale-105 group-hover:opacity-100"
        />
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-background/70 to-transparent opacity-70 transition-opacity duration-700 group-hover:opacity-30"
        />
        <span
          aria-hidden="true"
          className="absolute bottom-4 left-4 translate-y-3 rounded-full border border-foreground/60 bg-background/70 px-4 py-2 text-[0.65rem] uppercase tracking-[0.25em] opacity-0 backdrop-blur-sm transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
        >
          Play film
        </span>
      </div>
      <div className="mt-5 flex items-baseline justify-between gap-6 border-t border-border pt-4 transition-colors duration-500 group-hover:border-foreground">
        <h3 className="font-display text-2xl tracking-tight md:text-3xl">{project.title}</h3>
        <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
          {project.category} — {project.year}
        </span>
      </div>
    </button>
  );
}

export function Work() {
  const [active, setActive] = useState<Project | null>(null);

  return (
    <section
      id="work"
      aria-labelledby="work-heading"
      className="border-t border-border px-6 py-24 md:px-10 md:py-32"
    >
      <div className="mx-auto max-w-[1400px]">
        <Reveal className="mb-14 flex items-baseline justify-between gap-6">
          <h2 id="work-heading" className="font-display text-3xl tracking-tight md:text-5xl">
            Selected work
          </h2>
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
              <ProjectCard project={project} onOpen={() => setActive(project)} />
            </Reveal>
          ))}
        </div>
      </div>

      <Dialog open={Boolean(active)} onOpenChange={(open) => !open && setActive(null)}>
        <DialogContent className="max-w-5xl border-border bg-background p-4 sm:p-6">
          <DialogHeader className="sr-only">
            <DialogTitle>{active?.title ?? "Film"}</DialogTitle>
            <DialogDescription>
              {active ? `${active.category}, ${active.year}` : ""}
            </DialogDescription>
          </DialogHeader>
          {active && (
            <>
              <div className="aspect-video w-full overflow-hidden rounded-sm bg-surface">
                <iframe
                  className="h-full w-full"
                  src={`https://www.youtube.com/embed/${active.videoId}?autoplay=1&rel=0&modestbranding=1&cc_load_policy=1`}
                  title={`${active.title} — ${active.category}, ${active.year}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                {active.title} — {active.category}, {active.year}
              </p>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
