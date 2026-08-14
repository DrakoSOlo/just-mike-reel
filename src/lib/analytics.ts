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

import { getConsent } from "./consent";

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
  | "paint_change"
  | "a11y_change"
  | "contact_click"
  | "social_click"
  | "nav_click";

/** Events captured before the visitor answered the consent banner. */
const queue: { event: AnalyticsEvent; props: Props }[] = [];

function send(event: AnalyticsEvent, props: Props) {
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

export function track(event: AnalyticsEvent, props: Props = {}) {
  if (typeof window === "undefined") return;

  const consent = getConsent();
  if (consent === "denied") return;
  if (consent === "unset") {
    // Hold, don't drop: replayed only if the visitor later opts in.
    if (queue.length < 20) queue.push({ event, props });
    return;
  }

  send(event, props);
}

/** Replay anything captured before consent was granted. */
export function flushAnalyticsQueue() {
  if (typeof window === "undefined" || getConsent() !== "granted") return;
  while (queue.length) {
    const item = queue.shift()!;
    send(item.event, item.props);
  }
}

