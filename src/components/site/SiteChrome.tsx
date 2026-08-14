import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";

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

  // Land at the top of the new page so reveals start from the same state
  // the home page does (they animate as they enter the viewport).
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  return (
    <>
      <PageCurtain key={pathname} />
      <SceneBackdrop />
      <ScrollProgress />
      <CursorLens />
      <AccessibilityMenu />
      <CookieBanner />
    </>
  );
}
