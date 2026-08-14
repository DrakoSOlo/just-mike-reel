import { useEffect, useRef, useState } from "react";

import bloomA from "@/assets/bloom-a.png.asset.json";
import bloomB from "@/assets/bloom-b.png.asset.json";

const DURATION = 6400;
const WIPE_AT = 5400;

/**
 * Wordless opening: a single soft ball drops, bounces across the hairline
 * floor, loses energy, settles — then blooms open into the page.
 *
 * Everything moves on transform/opacity via CSS keyframes, so the sequence
 * never triggers a React render or a layout pass.
 */
export function IntroSequence({ onDone }: { onDone: () => void }) {
  const [wiping, setWiping] = useState(false);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    const wipe = window.setTimeout(() => setWiping(true), WIPE_AT);
    const end = window.setTimeout(() => doneRef.current(), DURATION);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") doneRef.current();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      window.clearTimeout(wipe);
      window.clearTimeout(end);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  return (
    <div
      role="dialog"
      aria-label="Opening sequence"
      className={`intro grain fixed inset-0 z-[100] overflow-hidden ${wiping ? "intro-out" : ""}`}
    >
      <img src={bloomA.url} alt="" aria-hidden="true" className="intro-bloom intro-bloom-1" />
      <img src={bloomB.url} alt="" aria-hidden="true" className="intro-bloom intro-bloom-2" />

      {/* Hairline framing guides — the floor the ball lands on. */}
      <div aria-hidden="true" className="intro-guides">
        <span className="intro-guide intro-guide-v" style={{ left: "12%" }} />
        <span className="intro-guide intro-guide-v" style={{ left: "88%", animationDelay: "120ms" }} />
        <span className="intro-guide intro-guide-h" style={{ top: "14%", animationDelay: "60ms" }} />
        <span className="intro-guide intro-guide-h intro-floor" style={{ top: "72%", animationDelay: "0ms" }} />
      </div>

      <div aria-hidden="true" className="intro-stage">
        <span className="intro-ball-x">
          <span className="intro-ball-y">
            <span className="intro-ball" />
          </span>
        </span>
        <span className="intro-shadow" />
        <span className="intro-ring intro-ring-1" />
        <span className="intro-ring intro-ring-2" />
      </div>

      <button
        type="button"
        onClick={onDone}
        aria-label="Skip opening sequence"
        className="intro-fade group absolute bottom-6 right-5 z-10 inline-flex h-11 w-11 items-center justify-center md:bottom-8 md:right-10"
        style={{ animationDelay: "900ms" }}
      >
        <span aria-hidden="true" className="intro-skip" />
      </button>
    </div>
  );
}
