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

export const DEFAULT_THEME: Theme = "paper";
export const DEFAULT_GRADE: Grade = "neutral";

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
)};var r=document.documentElement;r.dataset.theme=t;r.dataset.grade="neutral";r.style.colorScheme=t==="paper"?"light":"dark";}catch(e){}})();`;
