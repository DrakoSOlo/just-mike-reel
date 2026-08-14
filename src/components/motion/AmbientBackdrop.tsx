import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * A single fixed, GPU-composited light source that drifts with the pointer and
 * with scroll depth. One rAF loop, transform/opacity only — no layout work.
 */
export function AmbientBackdrop() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;

    let targetX = 0.5;
    let targetY = 0.35;
    let x = targetX;
    let y = targetY;
    let frame = 0;

    const loop = () => {
      x += (targetX - x) * 0.06;
      y += (targetY - y) * 0.06;
      const depth = window.scrollY / (window.innerHeight || 1);
      el.style.transform = `translate3d(${(x - 0.5) * 12}vw, ${(y - 0.5) * 10 - depth * 4}vh, 0) scale(${1 + Math.min(depth, 2) * 0.08})`;
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
      <div ref={ref} className="ambient-orb" />
    </div>
  );
}
