import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * A two-part pointer: a small solid dot that tracks exactly, and a soft ring
 * that lags behind, swells over interactive elements and shows a label over
 * film cards. Decorative, pointer-devices only, and switchable off from the
 * accessibility panel (`[data-a11y-cursor="off"]`).
 */
export function CursorLens() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const state = useRef({ hot: false, media: false, down: false });
  const [visible, setVisible] = useState(false);
  const [label, setLabel] = useState("");
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let frame = 0;

    const onMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
      if (!visible) setVisible(true);
      const el = e.target as HTMLElement | null;
      const media = Boolean(el?.closest("[data-cursor='play']"));
      const hot = media || Boolean(el?.closest("a, button, [role='button'], input, summary"));
      state.current.hot = hot;
      state.current.media = media;
      setLabel(media ? "Play" : "");
    };
    const onLeave = () => setVisible(false);
    const onDown = () => (state.current.down = true);
    const onUp = () => (state.current.down = false);

    const tick = () => {
      const { x, y } = target.current;
      current.current.x += (x - current.current.x) * 0.14;
      current.current.y += (y - current.current.y) * 0.14;
      const { hot, media, down } = state.current;
      const scale = (media ? 3.4 : hot ? 2.1 : 1) * (down ? 0.85 : 1);
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${current.current.x}px, ${current.current.y}px, 0) translate(-50%, -50%) scale(${scale})`;
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${hot ? 0 : 1})`;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, [reduced, visible]);

  if (reduced) return null;

  return (
    <div aria-hidden="true" className="cursor-layer">
      <div
        ref={ringRef}
        className="cursor-ring pointer-events-none fixed left-0 top-0 z-[80] hidden h-10 w-10 items-center justify-center rounded-full border border-foreground/60 md:flex"
        style={{ opacity: visible ? 1 : 0 }}
      >
        <span className="cursor-label text-[0.32rem] uppercase tracking-[0.25em]">
          {label}
        </span>
      </div>
      <div
        ref={dotRef}
        className="cursor-dot pointer-events-none fixed left-0 top-0 z-[80] hidden h-1.5 w-1.5 rounded-full bg-foreground md:block"
        style={{ opacity: visible ? 1 : 0 }}
      />
    </div>
  );
}
