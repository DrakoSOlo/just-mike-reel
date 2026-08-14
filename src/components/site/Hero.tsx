import { useEffect, useRef } from "react";
import { Magnetic } from "@/components/motion/Magnetic";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useParallax } from "@/hooks/use-parallax";
import { Bloom } from "@/components/motion/Bloom";

const word1 = "just".split("");
const word2 = "mike".split("");

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const scrollRef = useParallax<HTMLDivElement>();
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const el = sectionRef.current;
    if (!el) return;

    // Pointer state is written to CSS variables inside one rAF frame, so the
    // parallax never triggers a React render or a layout pass.
    let targetX = 0;
    let targetY = 0;
    let x = 0;
    let y = 0;
    let frame = 0;

    const loop = () => {
      x += (targetX - x) * 0.08;
      y += (targetY - y) * 0.08;
      const title = titleRef.current;
      if (title) {
        title.style.setProperty("--tilt-x", `${x * -18}px`);
        title.style.setProperty("--tilt-y", `${y * -10}px`);
        title.style.setProperty("--tilt-rot", `${x * 1.2}deg`);
      }
      frame = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      targetX = (px - 0.5) * 2;
      targetY = (py - 0.5) * 2;
      el.style.setProperty("--spot-x", `${px * 100}%`);
      el.style.setProperty("--spot-y", `${py * 100}%`);
      el.style.setProperty("--spot-opacity", "1");
    };
    const onLeave = () => {
      targetX = 0;
      targetY = 0;
      el.style.setProperty("--spot-opacity", "0");
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    frame = requestAnimationFrame(loop);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(frame);
    };
  }, [reduced]);

  return (
    <section
      ref={sectionRef}
      id="top"
      className="grain spotlight relative flex min-h-[80svh] flex-col justify-end overflow-hidden px-5 pb-10 pt-24 md:min-h-[88svh] md:px-10 md:pb-14 md:pt-28"
    >
      <Bloom variant="a" opacity={0.16} depth={44} className="-left-40 -top-40 h-[22rem] w-[22rem] md:h-[30rem] md:w-[30rem]" />
      <Bloom variant="b" opacity={0.14} depth={-30} className="-right-44 -bottom-24 h-[22rem] w-[22rem] md:h-[32rem] md:w-[32rem]" />

      <div ref={scrollRef} className="relative mx-auto w-full max-w-[1400px]">
        <p
          className="animate-rise text-xs uppercase tracking-[0.4em] text-muted-foreground"
          style={{ animationDelay: "120ms" }}
        >
          Video editor &amp; filmmaker
        </p>

        <h1
          ref={titleRef}
          className="mt-4 font-display text-[clamp(3.4rem,17vw,16rem)] md:mt-6 leading-[0.82] tracking-[-0.03em] will-change-transform"
          style={{
            transform:
              "translate3d(var(--tilt-x, 0px), calc(var(--tilt-y, 0px) + var(--parallax, 0) * 40px), 0) rotate(var(--tilt-rot, 0deg))",
          }}
        >
          <span className="sr-only">just mike — Video Editor &amp; Filmmaker</span>
          <span aria-hidden="true" className="block">
            {word1.map((letter, i) => (
              <span
                key={`a-${i}`}
                className="animate-rise inline-block transition-transform duration-500 ease-out hover:-translate-y-4 hover:rotate-[-4deg]"
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
                className="animate-rise inline-block transition-transform duration-500 ease-out hover:translate-y-4 hover:rotate-[4deg]"
                style={{ animationDelay: `${460 + i * 60}ms` }}
              >
                {letter}
              </span>
            ))}
          </span>
        </h1>

        <div className="mt-6 flex flex-col gap-5 border-t md:mt-8 md:gap-8 border-border pt-8 md:flex-row md:items-end md:justify-between">
          <p
            className="animate-rise max-w-md text-sm leading-relaxed text-muted-foreground"
            style={{ animationDelay: "700ms" }}
          >
            Cuts built on rhythm, honesty and a stubborn love of the frame.
            Short films, music videos and everything in between.
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
