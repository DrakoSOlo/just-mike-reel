import { useEffect, useRef, useState } from "react";

import bloomA from "@/assets/bloom-a.png.asset.json";
import bloomB from "@/assets/bloom-b.png.asset.json";
import bloom1 from "@/assets/bloom-hover-1.png.asset.json";

const DURATION = 8000;
const WIPE_AT = 6800;

const word1 = "just".split("");
const word2 = "mike".split("");

/**
 * Eight-second title sequence played once per session on the home page.
 *
 * Everything moves on transform/opacity via CSS keyframes; the only JS work is
 * a single rAF that writes the loading counter straight into a text node, so
 * the sequence never triggers a React render or a layout pass.
 */
export function IntroSequence({ onDone }: { onDone: () => void }) {
  const [wiping, setWiping] = useState(false);
  const counterRef = useRef<HTMLSpanElement>(null);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    const start = performance.now();
    let frame = requestAnimationFrame(function tick(now) {
      const p = Math.min((now - start) / (WIPE_AT - 400), 1);
      const eased = 1 - Math.pow(1 - p, 3);
      if (counterRef.current) {
        counterRef.current.textContent = String(Math.round(eased * 100)).padStart(3, "0");
      }
      if (p < 1) frame = requestAnimationFrame(tick);
    });

    const wipe = window.setTimeout(() => setWiping(true), WIPE_AT);
    const end = window.setTimeout(() => doneRef.current(), DURATION);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") doneRef.current();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(wipe);
      window.clearTimeout(end);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  return (
    <div
      role="dialog"
      aria-label="Opening title sequence"
      className={`intro grain fixed inset-0 z-[100] overflow-hidden ${wiping ? "intro-out" : ""}`}
    >
      <img src={bloomA.url} alt="" aria-hidden="true" className="intro-bloom intro-bloom-1" />
      <img src={bloomB.url} alt="" aria-hidden="true" className="intro-bloom intro-bloom-2" />
      <img src={bloom1.url} alt="" aria-hidden="true" className="intro-bloom intro-bloom-3" />

      {/* Hairline framing guides */}
      <div aria-hidden="true" className="intro-guides">
        <span className="intro-guide intro-guide-v" style={{ left: "12%" }} />
        <span className="intro-guide intro-guide-v" style={{ left: "88%", animationDelay: "120ms" }} />
        <span className="intro-guide intro-guide-h" style={{ top: "14%", animationDelay: "60ms" }} />
        <span className="intro-guide intro-guide-h" style={{ top: "86%", animationDelay: "180ms" }} />
      </div>

      <div className="relative flex h-full w-full flex-col justify-between px-5 py-6 md:px-10 md:py-8">
        <div className="flex items-start justify-between text-[0.625rem] uppercase tracking-[0.4em] text-muted-foreground">
          <span className="intro-fade" style={{ animationDelay: "300ms" }}>
            just mike
          </span>
          <span className="intro-fade" style={{ animationDelay: "420ms" }}>
            title sequence
          </span>
        </div>

        <div className="mx-auto w-full max-w-[1400px]">
          <p
            className="intro-fade text-[0.625rem] uppercase tracking-[0.45em] text-muted-foreground"
            style={{ animationDelay: "700ms" }}
          >
            Video editor &amp; filmmaker
          </p>
          <h2 className="mt-3 font-display text-[clamp(3.2rem,15vw,14rem)] leading-[0.82] tracking-[-0.03em]">
            <span className="sr-only">just mike</span>
            <span aria-hidden="true" className="block">
              {word1.map((l, i) => (
                <span key={`i1-${i}`} className="intro-letter" style={{ animationDelay: `${1000 + i * 90}ms` }}>
                  {l}
                </span>
              ))}
            </span>
            <span aria-hidden="true" className="block pl-[0.12em] italic">
              {word2.map((l, i) => (
                <span key={`i2-${i}`} className="intro-letter" style={{ animationDelay: `${1700 + i * 90}ms` }}>
                  {l}
                </span>
              ))}
            </span>
          </h2>
          <p
            className="intro-fade mt-6 max-w-sm text-sm leading-relaxed text-muted-foreground"
            style={{ animationDelay: "3200ms" }}
          >
            Cuts built on rhythm, honesty and a stubborn love of the frame.
          </p>
        </div>

        <div className="flex items-end justify-between text-[0.625rem] uppercase tracking-[0.4em] text-muted-foreground">
          <span className="intro-fade tabular-nums" style={{ animationDelay: "500ms" }}>
            <span ref={counterRef}>000</span> / 100
          </span>
          <button
            type="button"
            onClick={onDone}
            className="intro-fade inline-flex min-h-11 items-center gap-3 px-1 text-[0.625rem] uppercase tracking-[0.4em] text-foreground"
            style={{ animationDelay: "900ms" }}
          >
            Skip intro
            <span aria-hidden="true" className="h-px w-8 bg-foreground transition-all duration-500 hover:w-14" />
          </button>
        </div>
      </div>
    </div>
  );
}
