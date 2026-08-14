import { useEffect, useState } from "react";
import { Accessibility, RotateCcw, Volume2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { PaintDial } from "@/components/theme/PaintDial";

type Prefs = {
  motion: boolean;
  contrast: boolean;
  underline: boolean;
  cursor: boolean;
  speech: boolean;
  scale: number;
};

const DEFAULTS: Prefs = {
  motion: true,
  contrast: false,
  underline: false,
  cursor: true,
  speech: false,
  scale: 100,
};

const STORAGE_KEY = "justmike:a11y";

function apply(prefs: Prefs) {
  const root = document.documentElement;
  root.dataset["a11yMotion"] = prefs.motion ? "on" : "off";
  root.dataset["a11yContrast"] = prefs.contrast ? "on" : "off";
  root.dataset["a11yUnderline"] = prefs.underline ? "on" : "off";
  root.dataset["a11yCursor"] = prefs.cursor ? "on" : "off";
  root.style.fontSize = prefs.scale === 100 ? "" : `${prefs.scale}%`;
}

/**
 * A user-controlled accessibility panel. Every option is applied through data
 * attributes on <html> and persisted to localStorage, so a visitor's choices
 * survive reloads. Keyboard and screen-reader operable via the shadcn Dialog.
 */
export function AccessibilityMenu() {
  const [prefs, setPrefs] = useState<Prefs>(DEFAULTS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setPrefs({ ...DEFAULTS, ...(JSON.parse(raw) as Partial<Prefs>) });
    } catch {
      /* ignore unreadable storage */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    apply(prefs);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch {
      /* ignore full/blocked storage */
    }
  }, [prefs, loaded]);

  // Read aloud: while enabled, clicking (or Enter/Space on) any block of text
  // speaks it with the browser speech engine. Escape stops the narration.
  useEffect(() => {
    if (!prefs.speech || typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const speak = (text: string) => {
      const clean = text.replace(/\s+/g, " ").trim();
      if (!clean) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.rate = 0.98;
      window.speechSynthesis.speak(utterance);
    };

    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const block = target?.closest("p, h1, h2, h3, h4, li, blockquote, figcaption");
      if (block instanceof HTMLElement) speak(block.innerText);
    };

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") window.speechSynthesis.cancel();
    };

    document.addEventListener("click", onClick, true);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("keydown", onKey);
      window.speechSynthesis.cancel();
    };
  }, [prefs.speech]);

  const set = <K extends keyof Prefs>(key: K, value: Prefs[K]) =>
    setPrefs((p) => ({ ...p, [key]: value }));

  const toggles: { key: keyof Prefs; label: string; hint: string; on: boolean }[] = [
    { key: "motion", label: "Animations", hint: "Parallax, marquee and hover motion", on: prefs.motion },
    { key: "contrast", label: "High contrast", hint: "Stronger text and border contrast", on: prefs.contrast },
    { key: "underline", label: "Underline links", hint: "Never rely on colour alone", on: prefs.underline },
    { key: "cursor", label: "Custom pointer", hint: "The decorative cursor ring", on: prefs.cursor },
    { key: "speech", label: "Read aloud", hint: "Tap any text to hear it. Esc stops.", on: prefs.speech },
  ];

  return (
    <Dialog>
      <DialogTrigger
        className="fixed bottom-5 right-5 z-[85] inline-flex h-12 w-12 items-center justify-center rounded-full border border-border bg-background/85 text-foreground shadow-lg backdrop-blur-md transition-transform duration-300 hover:scale-105 md:bottom-8 md:right-8"
        aria-label="Accessibility options"
      >
        <Accessibility className="h-5 w-5" aria-hidden="true" />
      </DialogTrigger>

      <DialogContent className="max-w-md border-border bg-background text-foreground">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl tracking-tight">
            Accessibility
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Set this site up the way it works best for you. Your choices are
            saved on this device.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2 space-y-5">
          <fieldset>
            <legend className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
              Text size
            </legend>
            <div className="mt-3 flex flex-wrap gap-2" role="group">
              {[100, 115, 130].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => set("scale", value)}
                  aria-pressed={prefs.scale === value}
                  className={cn(
                    "min-h-11 rounded-sm border border-border px-4 text-xs uppercase tracking-[0.2em] transition-colors duration-300 hover:border-foreground",
                    prefs.scale === value && "bg-foreground text-background",
                  )}
                >
                  {value === 100 ? "Default" : `${value}%`}
                </button>
              ))}
            </div>
          </fieldset>

          <ul className="space-y-2">
            {toggles.map((t) => (
              <li key={t.key}>
                <button
                  type="button"
                  onClick={() => set(t.key, !t.on as never)}
                  aria-pressed={t.on}
                  className="flex w-full min-h-11 items-center justify-between gap-4 rounded-sm border border-border px-4 py-3 text-left transition-colors duration-300 hover:border-foreground"
                >
                  <span>
                    <span className="block text-sm">{t.label}</span>
                    <span className="block text-xs text-muted-foreground">{t.hint}</span>
                  </span>
                  <span
                    aria-hidden="true"
                    className={cn(
                      "relative h-6 w-11 shrink-0 rounded-full border border-border transition-colors duration-300",
                      t.on && "bg-foreground",
                    )}
                  >
                    <span
                      className={cn(
                        "absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full transition-all duration-300",
                        t.on ? "left-6 bg-background" : "left-1 bg-foreground",
                      )}
                    />
                  </span>
                  <span className="sr-only">{t.on ? "on" : "off"}</span>
                </button>
              </li>
            ))}
          </ul>

          <fieldset>
            <legend className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
              Painted texture
            </legend>
            <div className="mt-2">
              <PaintDial />
            </div>
          </fieldset>

          <button
            type="button"
            onClick={() => setPrefs(DEFAULTS)}
            className="inline-flex min-h-11 items-center gap-2 text-xs uppercase tracking-[0.25em] text-muted-foreground underline-offset-8 transition-colors duration-300 hover:text-foreground hover:underline"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Reset to defaults
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
