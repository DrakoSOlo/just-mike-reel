import { useEffect, useState } from "react";
import { Palette } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";
import {
  DEFAULT_GRADE,
  DEFAULT_THEME,
  GRADES,
  GRADE_KEY,
  GRADE_LABELS,
  THEMES,
  THEME_KEY,
  THEME_LABELS,
  applyTheme,
  type Grade,
  type Theme,
} from "@/lib/theme";

const swatch: Record<Theme, string> = {
  midnight: "bg-[oklch(0.2551_0.0367_250.9)]",
  forest: "bg-[oklch(0.2712_0.0393_176.8)]",
  paper: "bg-[oklch(0.9585_0.0098_87.5)]",
};

/**
 * Theme + colour correction picker. Both values live on <html> as data
 * attributes and are restored before paint by the boot script in __root.
 */
export function ThemeMenu() {
  const [theme, setTheme] = useState<Theme>(DEFAULT_THEME);
  const [grade, setGrade] = useState<Grade>(DEFAULT_GRADE);

  // Read what the boot script already applied, so UI and DOM agree.
  useEffect(() => {
    const root = document.documentElement;
    setTheme((root.dataset["theme"] as Theme) ?? DEFAULT_THEME);
    setGrade((root.dataset["grade"] as Grade) ?? DEFAULT_GRADE);
  }, []);

  const commit = (nextTheme: Theme, nextGrade: Grade) => {
    setTheme(nextTheme);
    setGrade(nextGrade);
    applyTheme(nextTheme, nextGrade);
    try {
      localStorage.setItem(THEME_KEY, nextTheme);
      localStorage.setItem(GRADE_KEY, nextGrade);
    } catch {
      /* ignore blocked storage */
    }
  };

  return (
    <Popover>
      <PopoverTrigger
        className="inline-flex h-11 w-11 items-center justify-center rounded-sm border border-border text-foreground transition-colors duration-300 hover:border-foreground"
        aria-label="Theme and colour correction"
      >
        <Palette className="h-4 w-4" aria-hidden="true" />
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="w-72 border-border bg-background text-foreground"
      >
        <fieldset>
          <legend className="spec-label">Theme</legend>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {THEMES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  commit(t, grade);
                  track("theme_change", { theme: t });
                }}
                aria-pressed={theme === t}
                className={cn(
                  "flex min-h-11 flex-col items-start justify-between gap-2 rounded-sm border border-border p-2 text-left text-[0.7rem] transition-colors duration-300 hover:border-foreground",
                  theme === t && "border-foreground",
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn("h-5 w-full rounded-[2px] border border-border", swatch[t])}
                />
                {THEME_LABELS[t]}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="mt-5">
          <legend className="spec-label">Colour correction</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {GRADES.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => {
                  commit(theme, g);
                  track("grade_change", { grade: g });
                }}
                aria-pressed={grade === g}
                className={cn(
                  "min-h-11 rounded-sm border border-border px-3 text-[0.7rem] uppercase tracking-[0.18em] transition-colors duration-300 hover:border-foreground",
                  grade === g && "bg-foreground text-background",
                )}
              >
                {GRADE_LABELS[g]}
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Grades tint the ambient light only — text contrast stays at AA.
          </p>
        </fieldset>
      </PopoverContent>
    </Popover>
  );
}
