import { useEffect, useRef, useState } from "react";
import { Magnetic } from "@/components/motion/Magnetic";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const word1 = "just".split("");
const word2 = "mike".split("");

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const el = sectionRef.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setTilt({ x: (x - 0.5) * 2, y: (y - 0.5) * 2 });
      el.style.setProperty("--spot-x", `${x * 100}%`);
      el.style.setProperty("--spot-y", `${y * 100}%`);
      el.style.setProperty("--spot-opacity", "1");
    };
    const onLeave = () => {
      setTilt({ x: 0, y: 0 });
      el.style.setProperty("--spot-opacity", "0");
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [reduced]);

  return (
    <section
      ref={sectionRef}
      id="top"
      className="grain spotlight relative flex min-h-[100svh] flex-col justify-end overflow-hidden px-6 pb-16 pt-32 md:px-10 md:pb-20"
    >
      <div className="relative mx-auto w-full max-w-[1400px]">
        <p
          className="animate-rise text-xs uppercase tracking-[0.4em] text-muted-foreground"
          style={{ animationDelay: "120ms" }}
        >
          Videographer &amp; Director
        </p>

        <h1
          className="mt-6 font-display text-[clamp(4rem,17vw,16rem)] leading-[0.82] tracking-[-0.03em] transition-transform duration-500 ease-out"
          style={{ transform: `translate3d(${tilt.x * -14}px, ${tilt.y * -8}px, 0)` }}
        >
          <span className="sr-only">just mike</span>
          <span aria-hidden="true" className="block">
            {word1.map((letter, i) => (
              <span
                key={`a-${i}`}
                className="animate-rise inline-block transition-transform duration-500 ease-out hover:-translate-y-3"
                style={{ animationDelay: `${260 + i * 60}ms` }}
              >
                {letter}
              </span>
            ))}
          </span>
          <span aria-hidden="true" className="block pl-[0.12em] italic">
            {word2.map((letter, i) => (
              <span
                key={`b-${i}`}
                className="animate-rise inline-block transition-transform duration-500 ease-out hover:translate-y-3"
                style={{ animationDelay: `${460 + i * 60}ms` }}
              >
                {letter}
              </span>
            ))}
          </span>
        </h1>

        <div className="mt-10 flex flex-col gap-8 border-t border-border pt-8 md:flex-row md:items-end md:justify-between">
          <p
            className="animate-rise max-w-md text-sm leading-relaxed text-muted-foreground"
            style={{ animationDelay: "700ms" }}
          >
            Cinematic films for brands, artists and people who'd rather be
            remembered than scrolled past. Based anywhere the light is good.
          </p>
          <Magnetic className="animate-rise" strength={0.25}>
            <a
              href="#reel"
              className="group inline-flex min-h-11 items-center gap-3 text-xs uppercase tracking-[0.3em] text-foreground"
              style={{ animationDelay: "820ms" }}
            >
              Watch the reel
              <span
                aria-hidden="true"
                className="h-px w-12 bg-foreground transition-all duration-500 group-hover:w-24"
              />
            </a>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
