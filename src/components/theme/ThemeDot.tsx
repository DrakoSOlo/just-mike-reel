import { useEffect, useState } from "react";

import { track } from "@/lib/analytics";
import {
  DEFAULT_THEME,
  THEME_KEY,
  THEME_LABELS,
  applyTheme,
  crossfadeThemes,
  type Theme,
} from "@/lib/theme";

/**
 * The whole theme control: one dot. Filled = paper, hollow = midnight.
 * No labels, no popover — the graphic does the job.
 */
export function ThemeDot() {
  const [theme, setTheme] = useState<Theme>(DEFAULT_THEME);

  useEffect(() => {
    const attr = document.documentElement.dataset["theme"];
    setTheme(attr === "midnight" ? "midnight" : "paper");
  }, []);

  const toggle = () => {
    const next: Theme = theme === "paper" ? "midnight" : "paper";
    setTheme(next);
    crossfadeThemes();
    applyTheme(next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      /* ignore blocked storage */
    }
    track("theme_change", { theme: next });
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${THEME_LABELS[theme === "paper" ? "midnight" : "paper"]} theme`}
      className="group inline-flex h-11 w-11 items-center justify-center"
    >
      <span aria-hidden="true" className={`theme-dot${theme === "midnight" ? " theme-dot-on" : ""}`} />
    </button>
  );
}
