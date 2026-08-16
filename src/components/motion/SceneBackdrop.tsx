import bloom1 from "@/assets/bloom-hover-1.png.asset.json";
import bloom2 from "@/assets/bloom-hover-2.png.asset.json";
import bloom3 from "@/assets/bloom-hover-3.png.asset.json";
import { AmbientBackdrop } from "@/components/motion/AmbientBackdrop";
import { MotifDotField, MotifStripes, MotifSunburst } from "@/components/motion/Motif";

/**
 * The single background for every page: pointer-reactive light pools, three
 * slowly drifting printed blooms and the film grain, all in one fixed layer.
 *
 * Everything animates on transform/opacity via CSS keyframes (no JS ticker
 * beyond the ambient orbs), so it stays off the main thread and never enters
 * the LCP or TBT path.
 */
export function SceneBackdrop() {
  return (
    <>
      <AmbientBackdrop />
      <div aria-hidden="true" className="scene-backdrop grain pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <img src={bloom1.url} alt="" loading="lazy" decoding="async" className="scene-bloom scene-bloom-1" />
        <img src={bloom2.url} alt="" loading="lazy" decoding="async" className="scene-bloom scene-bloom-2" />
        <img src={bloom3.url} alt="" loading="lazy" decoding="async" className="scene-bloom scene-bloom-3" />
        <span className="scene-veil" />
        {/* Drafting guides — the hairline frame the whole layout sits inside. */}
        <span className="scene-guides">
          <span className="scene-guide scene-guide-v" style={{ left: "12%" }} />
          <span className="scene-guide scene-guide-v" style={{ left: "50%" }} />
          <span className="scene-guide scene-guide-v" style={{ left: "88%" }} />
          <span className="scene-guide scene-guide-h" style={{ top: "14%" }} />
          <span className="scene-guide scene-guide-h" style={{ top: "86%" }} />
        </span>
      </div>
    </>
  );
}
