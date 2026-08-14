/**
 * Cookie / analytics consent.
 *
 * Nothing is measured until the visitor opts in. The choice is stored on the
 * device (localStorage, not a tracking cookie) so the banner only shows once.
 */

export type Consent = "granted" | "denied" | "unset";

const KEY = "jm-consent";
const listeners = new Set<(c: Consent) => void>();

export function getConsent(): Consent {
  if (typeof window === "undefined") return "unset";
  try {
    const v = window.localStorage.getItem(KEY);
    return v === "granted" || v === "denied" ? v : "unset";
  } catch {
    return "unset";
  }
}

export function setConsent(consent: Exclude<Consent, "unset">) {
  try {
    window.localStorage.setItem(KEY, consent);
  } catch {
    /* private mode — keep the choice for this session only */
  }
  listeners.forEach((fn) => fn(consent));
}

export function resetConsent() {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
  listeners.forEach((fn) => fn("unset"));
}

export function onConsentChange(fn: (c: Consent) => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
