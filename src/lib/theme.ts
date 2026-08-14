/**
 * Theme + colour correction (grade).
 *
 * Both are applied as data attributes on <html> and persisted to
 * localStorage. An inline pre-hydration script (see __root.tsx) applies the
 * stored values before first paint so there is no flash of the wrong palette.
 *
 * Two themes only — light paper and dark midnight — toggled by a single dot.
 */

export const THEMES = ["paper", "midnight"] as const;
export const GRADES = ["neutral"] as const;

export type Theme = (typeof THEMES)[number];
export type Grade = (typeof GRADES)[number];

export const THEME_LABELS: Record<Theme, string> = {
  paper: "Paper",
  midnight: "Midnight",
};

export const GRADE_LABELS: Record<Grade, string> = {
  neutral: "Neutral",
};

export const THEME_KEY = "justmike:theme";
export const GRADE_KEY = "justmike:grade";
export const PAINT_KEY = "justmike:paint";

export const DEFAULT_THEME: Theme = "paper";
export const DEFAULT_GRADE: Grade = "neutral";

/** How heavy the painted blot texture reads — shared by both themes. */
export const PAINT_LEVELS = ["subtle", "medium", "heavy"] as const;
export type PaintLevel = (typeof PAINT_LEVELS)[number];

export const PAINT_LABELS: Record<PaintLevel, string> = {
  subtle: "Subtle",
  medium: "Medium",
  heavy: "Heavy",
};

export const DEFAULT_PAINT: PaintLevel = "medium";

export function applyPaint(level: PaintLevel) {
  document.documentElement.dataset["paint"] = level;
  try {
    localStorage.setItem(PAINT_KEY, level);
  } catch {
    /* ignore blocked storage */
  }
}

let fadeTimer: number | undefined;

/**
 * Enable colour transitions for the length of one crossfade, then remove them
 * so ordinary interactions stay snappy.
 */
export function crossfadeThemes() {
  const root = document.documentElement;
  root.setAttribute("data-theme-fade", "");
  window.clearTimeout(fadeTimer);
  fadeTimer = window.setTimeout(() => root.removeAttribute("data-theme-fade"), 700);
}

export function applyTheme(theme: Theme, grade: Grade = DEFAULT_GRADE) {
  const root = document.documentElement;
  root.dataset["theme"] = theme;
  root.dataset["grade"] = grade;
  root.style.colorScheme = theme === "paper" ? "light" : "dark";
}

/** Runs before hydration — keep it tiny and dependency-free. */
export const themeBootScript = `(function(){try{var t=localStorage.getItem(${JSON.stringify(
  THEME_KEY,
)})||${JSON.stringify(DEFAULT_THEME)};if(t!=="paper"&&t!=="midnight")t=${JSON.stringify(
  DEFAULT_THEME,
)};var r=document.documentElement;r.dataset.theme=t;r.dataset.grade="neutral";r.style.colorScheme=t==="paper"?"light":"dark";var p=localStorage.getItem(${JSON.stringify(
  PAINT_KEY,
)})||${JSON.stringify(DEFAULT_PAINT)};if(["subtle","medium","heavy"].indexOf(p)<0)p=${JSON.stringify(
  DEFAULT_PAINT,
)};r.dataset.paint=p;}catch(e){}})();`;
