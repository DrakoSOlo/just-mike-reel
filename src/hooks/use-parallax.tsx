import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * Shared scroll ticker: one rAF loop and one passive scroll listener for the
 * whole page, no matter how many parallax elements are mounted.
 */
type Subscriber = () => void;
const subscribers = new Set<Subscriber>();
let frame = 0;
let listening = false;

function tick() {
  frame = 0;
  for (const fn of subscribers) fn();
}

function schedule() {
  if (frame) return;
  frame = requestAnimationFrame(tick);
}

function subscribe(fn: Subscriber) {
  subscribers.add(fn);
  if (!listening && typeof window !== "undefined") {
    listening = true;
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
  }
  schedule();
  return () => {
    subscribers.delete(fn);
  };
}

/**
 * Writes a -1..1 progress value to the element as `--parallax` (and a 0..1
 * `--enter` while the element crosses the viewport). Values are written
 * straight to the style object, so React never re-renders on scroll.
 *
 * Only runs while the element is on screen, and is disabled entirely for
 * visitors who prefer reduced motion (WCAG 2.1 — 2.3.3).
 */
export function useParallax<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;

    let visible = false;
    let unsubscribe: (() => void) | undefined;

    const update = () => {
      if (!visible) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const centre = rect.top + rect.height / 2;
      const p = (centre - vh / 2) / (vh / 2 + rect.height / 2);
      const enter = 1 - Math.min(Math.max(rect.top / vh, 0), 1);
      el.style.setProperty("--parallax", Math.max(-1, Math.min(1, p)).toFixed(4));
      el.style.setProperty("--enter", enter.toFixed(4));
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = Boolean(entry?.isIntersecting);
        if (visible) {
          unsubscribe ??= subscribe(update);
          update();
        } else {
          unsubscribe?.();
          unsubscribe = undefined;
        }
      },
      { rootMargin: "20% 0px" },
    );

    io.observe(el);
    return () => {
      io.disconnect();
      unsubscribe?.();
    };
  }, [reduced]);

  return ref;
}
