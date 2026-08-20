/**
 * The page ground: Japanese-white paper with a charcoal print texture.
 *
 * No lines, no drifting shapes, no JS — two static layers that read as
 * pressed ink on stock, so the type stays the loudest thing on the page.
 */
export function SceneBackdrop() {
  return (
    <div aria-hidden="true" className="scene-backdrop pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <span className="paper-tooth" />
      <span className="paper-charcoal" />
      <span className="paper-vignette" />
    </div>
  );
}
