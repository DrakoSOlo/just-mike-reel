import { useEffect, useRef, useState } from "react";

const DURATION = 3600;
const WIPE_AT = 2700;

/**
 * Minimal opening: a single black ink droplet falls onto Japanese-white
 * stock, lands, flicks once and spreads into a printed ring — then the sheet
 * lifts away. Transform/opacity keyframes only, no React renders mid-flight.
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
      className={`intro fixed inset-0 z-[100] overflow-hidden ${wiping ? "intro-out" : ""}`}
    >
      <span aria-hidden="true" className="paper-tooth" />
      <span aria-hidden="true" className="paper-charcoal" />

      <div aria-hidden="true" className="drop-stage">
        <span className="drop-fall">
          <span className="drop" />
        </span>
        <span className="drop-splat" />
        <span className="drop-ring drop-ring-1" />
        <span className="drop-ring drop-ring-2" />
      </div>

      <button
        type="button"
        onClick={onDone}
        aria-label="Skip opening sequence"
        className="intro-fade absolute bottom-6 right-5 z-10 inline-flex h-11 w-11 items-center justify-center md:bottom-8 md:right-10"
        style={{ animationDelay: "600ms" }}
      >
        <span aria-hidden="true" className="intro-skip" />
      </button>
    </div>
  );
}
