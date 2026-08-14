import { useEffect, useRef, useState } from "react";

import { track } from "@/lib/analytics";
import {
  DEFAULT_PAINT,
  PAINT_LABELS,
  PAINT_LEVELS,
  applyPaint,
  type PaintLevel,
} from "@/lib/theme";

/**
 * Painted blot texture intensity — three blots, densest on the right.
 * Exposed as a radio group: arrow keys move and select, Home/End jump to
 * the ends, and only the active blot is in the tab order (roving tabindex).
 */
export function PaintDial() {
  const [level, setLevel] = useState<PaintLevel>(DEFAULT_PAINT);
  const refs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    const attr = document.documentElement.dataset["paint"] as PaintLevel | undefined;
    if (attr && PAINT_LEVELS.includes(attr)) setLevel(attr);
  }, []);

  const choose = (next: PaintLevel, focus = false) => {
    setLevel(next);
    applyPaint(next);
    track("paint_change", { level: next });
    if (focus) refs.current[PAINT_LEVELS.indexOf(next)]?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent, index: number) => {
    const last = PAINT_LEVELS.length - 1;
    let next: number | null = null;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = Math.min(index + 1, last);
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = Math.max(index - 1, 0);
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = last;
    if (next === null) return;
    event.preventDefault();
    choose(PAINT_LEVELS[next]!, true);
  };

  return (
    <div
      role="radiogroup"
      aria-label="Painted texture intensity"
      className="flex items-center"
    >
      {PAINT_LEVELS.map((option, index) => (
        <button
          key={option}
          type="button"
          ref={(node) => {
            refs.current[index] = node;
          }}
          role="radio"
          aria-checked={level === option}
          tabIndex={level === option ? 0 : -1}
          onClick={() => choose(option)}
          onKeyDown={(event) => onKeyDown(event, index)}
          aria-label={`${PAINT_LABELS[option]} painted texture`}
          className="group inline-flex h-11 w-6 items-center justify-center rounded-sm outline-none sm:w-7"
        >
          <span
            aria-hidden="true"
            data-paint-swatch={option}
            className={`paint-swatch${level === option ? " paint-swatch-on" : ""}`}
          />
        </button>
      ))}
      <span aria-live="polite" className="sr-only">
        {`Painted texture: ${PAINT_LABELS[level]}`}
      </span>
    </div>
  );
}
