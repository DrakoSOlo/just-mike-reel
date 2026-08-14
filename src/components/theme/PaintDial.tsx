import { useEffect, useState } from "react";

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
 * Works the same in both themes; the choice persists across visits.
 */
export function PaintDial() {
  const [level, setLevel] = useState<PaintLevel>(DEFAULT_PAINT);

  useEffect(() => {
    const attr = document.documentElement.dataset["paint"] as PaintLevel | undefined;
    if (attr && PAINT_LEVELS.includes(attr)) setLevel(attr);
  }, []);

  const choose = (next: PaintLevel) => {
    setLevel(next);
    applyPaint(next);
    track("paint_change", { level: next });
  };

  return (
    <div
      role="group"
      aria-label="Painted texture intensity"
      className="flex items-center"
    >
      {PAINT_LEVELS.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => choose(option)}
          aria-pressed={level === option}
          aria-label={`${PAINT_LABELS[option]} painted texture`}
          className="group inline-flex h-11 w-6 items-center justify-center sm:w-7"
        >
          <span
            aria-hidden="true"
            data-paint-swatch={option}
            className={`paint-swatch${level === option ? " paint-swatch-on" : ""}`}
          />
        </button>
      ))}
    </div>
  );
}
