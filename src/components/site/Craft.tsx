import { Reveal } from "@/components/Reveal";
import { track } from "@/lib/analytics";
import { OPEN_CONSENT_EVENT } from "@/components/consent/CookieBanner";
import { useParallax } from "@/hooks/use-parallax";

import { influences, services, socials } from "@/data/profile";

/**
 * Closing section: services grid + the "on repeat" marquee.
 */
export function Craft() {
  const glowRef = useParallax<HTMLDivElement>();

  return (
    <footer
      id="services"
      aria-labelledby="services-heading"
      className="cv-auto figma-guides relative overflow-hidden border-t border-border px-5 py-10 md:px-10 md:py-16"
    >
      <div
        ref={glowRef}
        aria-hidden="true"
        className="glow-warm glow-warm-right pointer-events-none absolute z-0 -right-32 bottom-0"
      />

      <div className="relative z-10 mx-auto max-w-[1400px]">
        <Reveal>
          <h2
            id="services-heading"
            className="font-display text-[clamp(2.4rem,7vw,6rem)] leading-[0.95] tracking-[-0.03em]"
          >
            What I do
          </h2>
        </Reveal>

        <ol className="mt-6 grid gap-px border-t md:mt-8 border-border sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <li
              key={service}
              className="service-row group relative flex items-baseline justify-between gap-4 border-b border-border py-5 md:py-7"
            >
              <Reveal delay={80 + i * 70} className="flex w-full items-baseline justify-between gap-6">
                <span className="relative z-10 font-display text-[clamp(1.3rem,2.4vw,2rem)] tracking-tight transition-transform duration-500 ease-out group-hover:translate-x-3">
                  {service}
                </span>
                <span className="spec-label relative z-10 tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </Reveal>
            </li>
          ))}
        </ol>

        <Reveal delay={140} className="mt-10 md:mt-12">
          <h3 className="spec-label">
            On repeat
          </h3>
          <div className="relative mt-6 overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
            <ul className="marquee-track flex w-max gap-10 font-display text-[clamp(1.4rem,4vw,3rem)] tracking-tight text-muted-foreground">
              {[...influences, ...influences].map((item, i) => (
                <li
                  key={`${item}-${i}`}
                  aria-hidden={i >= influences.length}
                  className="whitespace-nowrap transition-colors duration-300 hover:text-foreground"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal
          delay={200}
          className="mt-10 flex flex-col gap-6 border-t border-border pt-6 md:mt-12 md:gap-8 md:pt-8 md:flex-row md:items-center md:justify-between"
        >
          <span className="font-display text-lg tracking-tight">just.mike</span>
          <ul className="spec-label flex flex-wrap gap-x-5 gap-y-2">
            {socials.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  onClick={() => track("social_click", { network: social.label })}
                  className="link-sweep inline-flex min-h-11 items-center transition-colors duration-300 hover:text-foreground"
                >
                  {social.label}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
            <li>
              <button
                type="button"
                onClick={() => window.dispatchEvent(new Event(OPEN_CONSENT_EVENT))}
                className="link-sweep inline-flex min-h-11 items-center uppercase transition-colors duration-300 hover:text-foreground"
              >
                Cookies
              </button>
            </li>
          </ul>
          <span className="spec-label">
            © {new Date().getFullYear()} just mike
          </span>
        </Reveal>
      </div>
    </footer>
  );
}
