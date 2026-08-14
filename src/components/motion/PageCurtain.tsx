import { useEffect, useState } from "react";

/**
 * One-time entrance wipe. Purely decorative and removed from the DOM once it
 * finishes, so it never costs anything after the first second.
 */
export function PageCurtain() {
  const [done, setDone] = useState(false);
  const [lifted, setLifted] = useState(false);

  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setDone(true);
      return;
    }
    const a = window.setTimeout(() => setLifted(true), 60);
    const b = window.setTimeout(() => setDone(true), 1300);
    return () => {
      window.clearTimeout(a);
      window.clearTimeout(b);
    };
  }, []);

  if (done) return null;

  return (
    <div
      aria-hidden="true"
      className={`page-curtain pointer-events-none fixed inset-0 z-[70] ${lifted ? "page-curtain-lifted" : ""}`}
    />
  );
}
