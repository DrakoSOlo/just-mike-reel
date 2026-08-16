/**
 * The single, static background for every page: a soft printed wash, film
 * grain and the bold drafting rules the layout sits inside.
 *
 * Nothing here animates — no JS ticker, no keyframes — so the backdrop costs
 * one paint and never competes with the content for attention or CPU.
 */
export function SceneBackdrop() {
  return (
    <div aria-hidden="true" className="scene-backdrop grain pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <span className="scene-wash" />
      <span className="scene-veil" />
      {/* Drafting rules — the bold, textured frame the whole layout sits inside. */}
      <span className="scene-guides">
        <span className="scene-guide scene-guide-v" style={{ left: "12%" }} />
        <span className="scene-guide scene-guide-v" style={{ left: "88%" }} />
        <span className="scene-guide scene-guide-h" style={{ top: "14%" }} />
        <span className="scene-guide scene-guide-h" style={{ top: "86%" }} />
      </span>
    </div>
  );
}
