import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * Two fixed, GPU-composited light sources behind the page: a cool green pool
 * and a warm yellow haze that drift with the pointer and with scroll depth.
 * One rAF loop, transform/opacity only — no layout work.
 */
export function AmbientBackdrop() {
  const coolRef = useRef<HTMLDivElement>(null);
  const warmRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const cool = coolRef.current;
    const warm = warmRef.current;
    if (!cool || !warm || reduced) return;

    let targetX = 0.5;
    let targetY = 0.35;
    let x = targetX;
    let y = targetY;
    let frame = 0;

    const loop = () => {
      x += (targetX - x) * 0.06;
      y += (targetY - y) * 0.06;
      const depth = window.scrollY / (window.innerHeight || 1);
      const d = Math.min(depth, 3);
      cool.style.transform = `translate3d(${(x - 0.5) * 12}vw, ${(y - 0.5) * 10 - d * 4}vh, 0) scale(${1 + d * 0.08})`;
      warm.style.transform = `translate3d(${(0.5 - x) * 18}vw, ${(0.5 - y) * 14 + d * 9}vh, 0) scale(${1 + d * 0.12})`;
      frame = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      targetX = e.clientX / window.innerWidth;
      targetY = e.clientY / window.innerHeight;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    frame = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, [reduced]);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div ref={coolRef} className="ambient-orb" />
      <div ref={warmRef} className="ambient-orb ambient-orb-warm" />
    </div>
  );
}
