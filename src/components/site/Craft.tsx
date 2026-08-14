import { Reveal } from "@/components/Reveal";
import { useParallax } from "@/hooks/use-parallax";

const services = [
  "Video editing",
  "Short films",
  "Music videos",
  "Colour grading",
  "Motion & titles",
  "Sound & rhythm",
];

const influences = [
  "Alternative rock",
  "Miyazaki",
  "Lynch",
  "Scorsese",
  "Natural light",
  "Long takes",
  "Slow fades",
  "Analog grain",
];

const socials = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "YouTube", href: "https://youtube.com" },
  { label: "Vimeo", href: "https://vimeo.com" },
];

/**
 * Closing section: services grid + the "on repeat" marquee.
 */
export function Craft() {
  const glowRef = useParallax<HTMLDivElement>();

  return (
    <footer
      id="services"
      aria-labelledby="services-heading"
      className="relative overflow-hidden border-t border-border px-6 py-24 md:px-10 md:py-32"
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

        <ol className="mt-14 grid gap-px border-t border-border sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <li
              key={service}
              className="service-row group relative flex items-baseline justify-between gap-6 border-b border-border py-7"
            >
              <Reveal delay={80 + i * 70} className="flex w-full items-baseline justify-between gap-6">
                <span className="relative z-10 font-display text-[clamp(1.3rem,2.4vw,2rem)] tracking-tight transition-transform duration-500 ease-out group-hover:translate-x-3">
                  {service}
                </span>
                <span className="relative z-10 text-xs tabular-nums tracking-[0.3em] text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </Reveal>
            </li>
          ))}
        </ol>

        <Reveal delay={140} className="mt-20">
          <h3 className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
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
          className="mt-20 flex flex-col gap-8 border-t border-border pt-8 md:flex-row md:items-center md:justify-between"
        >
          <span className="font-display text-lg tracking-tight">just.mike</span>
          <ul className="flex flex-wrap gap-7 text-xs uppercase tracking-[0.25em] text-muted-foreground">
            {socials.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="link-sweep inline-flex min-h-11 items-center transition-colors duration-300 hover:text-foreground"
                >
                  {social.label}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
          <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
            © {new Date().getFullYear()} just mike
          </span>
        </Reveal>
      </div>
    </footer>
  );
}
