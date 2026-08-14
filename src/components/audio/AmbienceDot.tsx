import { useEffect, useState } from "react";

import { track } from "@/lib/analytics";
import {
  AMBIENCE_KEY,
  isAmbiencePlaying,
  onAmbienceChange,
  startAmbience,
  stopAmbience,
} from "@/lib/ambience";

/**
 * Sound control: one painted dot with rain lines that fall while the forest
 * ambience is on. Silent by default — audio only ever starts from a gesture.
 */
export function AmbienceDot() {
  const [on, setOn] = useState(false);

  useEffect(() => onAmbienceChange(setOn), []);

  // Remembered preference resumes on the visitor's next interaction, since
  // browsers refuse to start audio without one.
  useEffect(() => {
    let wanted = false;
    try {
      wanted = localStorage.getItem(AMBIENCE_KEY) === "on";
    } catch {
      /* ignore blocked storage */
    }
    if (!wanted) return;

    const resume = () => {
      if (!isAmbiencePlaying()) void startAmbience();
      cleanup();
    };
    const cleanup = () => {
      window.removeEventListener("pointerdown", resume);
      window.removeEventListener("keydown", resume);
      window.removeEventListener("scroll", resume);
    };
    window.addEventListener("pointerdown", resume, { once: true });
    window.addEventListener("keydown", resume, { once: true });
    window.addEventListener("scroll", resume, { once: true, passive: true });
    return cleanup;
  }, []);

  const toggle = () => {
    const next = !on;
    if (next) void startAmbience();
    else stopAmbience();
    try {
      localStorage.setItem(AMBIENCE_KEY, next ? "on" : "off");
    } catch {
      /* ignore blocked storage */
    }
    track("ambience_toggle", { state: next ? "on" : "off" });
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={on}
      aria-label={on ? "Turn off forest rain ambience" : "Play forest rain ambience"}
      className="group inline-flex h-11 w-11 items-center justify-center"
    >
      <span aria-hidden="true" className={`rain-dot${on ? " rain-dot-on" : ""}`}>
        <i />
        <i />
        <i />
      </span>
    </button>
  );
}
