import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";

import { IntroSequence } from "@/components/motion/IntroSequence";
import { PageCurtain } from "@/components/motion/PageCurtain";
import { SceneBackdrop } from "@/components/motion/SceneBackdrop";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { CursorLens } from "@/components/motion/CursorLens";
import { AccessibilityMenu } from "@/components/a11y/AccessibilityMenu";
import { CookieBanner } from "@/components/consent/CookieBanner";

/**
 * One shared chrome for every page: the entrance curtain, ambient backdrop,
 * scroll progress, custom cursor and the persistent a11y / consent controls.
 *
 * Mounting it once in the root keeps the cursor and backdrop alive across
 * navigations, while the curtain is keyed by pathname so moving from the
 * home page into /reels replays the exact same wipe with the same timing.
 */
export function SiteChrome() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [intro, setIntro] = useState(false);
  // The page the intro covered: the curtain must not replay on top of it.
  const [introPath, setIntroPath] = useState<string | null>(null);

  // The title sequence plays once per session, on the home page only, and
  // never when the visitor asked for reduced motion.
  useEffect(() => {
    if (pathname !== "/") return;
    if (sessionStorage.getItem("jm-intro-seen") === "1") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (document.documentElement.dataset["a11yMotion"] === "off") return;
    sessionStorage.setItem("jm-intro-seen", "1");
    setIntro(true);
    setIntroPath(pathname);
  }, [pathname]);

  // Land at the top of the new page so reveals start from the same state
  // the home page does (they animate as they enter the viewport).
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  return (
    <>
      {intro && <IntroSequence onDone={() => setIntro(false)} />}
      {!intro && <PageCurtain key={pathname} />}
      <SceneBackdrop />
      <ScrollProgress />
      <CursorLens />
      <AccessibilityMenu />
      <CookieBanner />
    </>
  );
}
