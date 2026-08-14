import { useEffect, useRef, useState } from "react";
import { getConsent, onConsentChange, setConsent, type Consent } from "@/lib/consent";
import { flushAnalyticsQueue } from "@/lib/analytics";

export const OPEN_CONSENT_EVENT = "jm:open-consent";

export function CookieBanner() {
  const [consent, setLocal] = useState<Consent>("granted"); // assume settled until mounted
  const acceptRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setLocal(getConsent());
    const off = onConsentChange(setLocal);
    const reopen = () => setLocal("unset");
    window.addEventListener(OPEN_CONSENT_EVENT, reopen);
    return () => {
      off();
      window.removeEventListener(OPEN_CONSENT_EVENT, reopen);
    };
  }, []);

  useEffect(() => {
    if (consent === "unset") acceptRef.current?.focus();
  }, [consent]);

  if (consent !== "unset") return null;

  const choose = (value: "granted" | "denied") => {
    setConsent(value);
    if (value === "granted") flushAnalyticsQueue();
  };

  return (
    <div
      role="region"
      aria-label="Cookie and analytics consent"
      className="fixed inset-x-3 bottom-3 z-[70] mx-auto max-w-2xl border border-border bg-background p-5 shadow-lg sm:inset-x-6 sm:bottom-6 sm:p-6"
    >
      <p className="spec-label mb-2">Measurement</p>
      <p className="text-sm leading-relaxed text-muted-foreground">
        I&apos;d like to count anonymous interactions — which films get played, which links get
        clicked — to make this site better. Nothing loads and nothing is measured until you say
        yes. Your theme and accessibility settings are saved either way.
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        <button
          ref={acceptRef}
          type="button"
          onClick={() => choose("granted")}
          className="inline-flex min-h-11 items-center rounded-sm bg-foreground px-5 text-xs uppercase tracking-[0.2em] text-background transition-opacity duration-300 hover:opacity-90"
        >
          Accept
        </button>
        <button
          type="button"
          onClick={() => choose("denied")}
          className="inline-flex min-h-11 items-center rounded-sm border border-border px-5 text-xs uppercase tracking-[0.2em] text-foreground transition-colors duration-300 hover:border-foreground hover:bg-surface"
        >
          Decline
        </button>
      </div>
    </div>
  );
}
