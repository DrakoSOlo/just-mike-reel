/**
 * Lightweight, privacy-friendly analytics.
 *
 * Page views are collected automatically by the hosting platform. This module
 * adds named interaction events on top of that, with zero third-party script
 * weight: each event is pushed to `window.dataLayer` and mirrored to any
 * analytics endpoint the site already has (gtag / plausible) if present.
 *
 * Nothing personal is collected — event name plus a couple of short labels.
 */

type Props = Record<string, string | number | boolean | undefined>;

type AnalyticsWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
  plausible?: (event: string, opts?: { props: Props }) => void;
};

export type AnalyticsEvent =
  | "film_open"
  | "film_play"
  | "reel_play"
  | "theme_change"
  | "grade_change"
  | "a11y_change"
  | "contact_click"
  | "social_click"
  | "nav_click";

export function track(event: AnalyticsEvent, props: Props = {}) {
  if (typeof window === "undefined") return;
  const w = window as AnalyticsWindow;
  const payload = { event, ...props };

  try {
    (w.dataLayer ??= []).push(payload);
    w.gtag?.("event", event, props);
    w.plausible?.(event, { props });
    if (import.meta.env.DEV) console.debug("[analytics]", payload);
  } catch {
    /* analytics must never break the page */
  }
}
