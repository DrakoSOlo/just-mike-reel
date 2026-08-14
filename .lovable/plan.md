# just mike — videographer portfolio

A single-page scrolling site for the brand "just mike", built around embedded video, editorial serif typography, and smooth cinematic motion.

## Page flow (one continuous scroll)

1. **Hero** — fullscreen, near-black. Oversized "just mike" wordmark in the display serif, with a one-line role tag ("videographer / director"). Subtle animated grain + a scroll cue. Text reveals line-by-line on load.
2. **Showreel** — a large 16:9 embedded YouTube player that sits below the hero and scales up slightly as it scrolls into view. Click-to-play poster state so the page stays fast.
3. **Selected work** — a small set of video cards (placeholder YouTube IDs) in an offset grid; hovering lifts the card and reveals the title/year, clicking opens the video in a fullscreen lightbox.
4. **About** — short bio paragraph in large serif, plus a compact list of services and a client/credits list.
5. **Contact** — big mailto link as the visual anchor, plus social links and a footer with the wordmark.

A minimal fixed top bar holds the wordmark and anchor links (Work, About, Contact) that smooth-scroll to each section.

## Look and feel

- Dark cinematic palette: deep charcoal background, warm off-white text, one muted accent for hover states.
- Display serif lookalike for Canela: **Instrument Serif** for headings (high-contrast, similar spirit), paired with a clean grotesque for body copy. Loaded via a `<link>` in the root route so it can be swapped to real Canela files later.
- Motion: fade-and-rise reveals on scroll, letter-level hero animation, slow parallax on the showreel, and smooth hover transitions. Respects reduced-motion preferences.

## Technical notes

- Rewrite `src/routes/index.tsx` as the single page, composed of section components under `src/components/` (Hero, Showreel, Work, About, Contact, Nav).
- Add color/typography tokens to `src/styles.css` (oklch) — no hardcoded color classes in components.
- Scroll animations via a small `useInView` intersection-observer hook plus CSS transitions (no heavy dependency).
- YouTube embeds use a lightweight facade: thumbnail image + play button that swaps in the iframe on click. Placeholder video IDs now, easy to replace.
- Head metadata on the index route: unique title, description, og/twitter tags for "just mike".
