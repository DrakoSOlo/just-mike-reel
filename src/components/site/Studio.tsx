import { Reveal } from "@/components/Reveal";
import { track } from "@/lib/analytics";
import { Magnetic } from "@/components/motion/Magnetic";
import { useParallax } from "@/hooks/use-parallax";

// TODO: replace with Mike's real details.
import { EMAIL, WHATSAPP_LINK, WHATSAPP_NUMBER } from "@/data/profile";

/**
 * About + Get in touch, side by side in one section.
 */
export function Studio() {
  const driftRef = useParallax<HTMLDivElement>();

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="cv-auto relative overflow-hidden border-t border-border px-5 py-16 md:px-10 md:py-32"
    >
      <div
        ref={driftRef}
        aria-hidden="true"
        className="glow-warm glow-warm-left pointer-events-none absolute z-0 -left-24 top-1/3"
      />

      <div className="relative z-10 mx-auto grid max-w-[1400px] gap-12 md:grid-cols-12 md:gap-20">
        {/* About */}
        <div className="md:col-span-7">
          <Reveal>
            <h2 id="about-heading" className="spec-label">
              About me
            </h2>
            <p className="mt-5 font-display md:mt-8 text-[clamp(1.6rem,3.2vw,2.8rem)] leading-[1.15] tracking-tight">
              Hi, I'm Mike. I love alternative rock, Miyazaki movies, and
              cinematic journeys that start with Lynch and end with Scorsese.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-5 max-w-xl text-sm md:mt-8 leading-relaxed text-muted-foreground">
              I studied Materials Science and Engineering, which mostly just
              gave me a micro-perspective on how the physical world works — and
              that's about it. My real drive is guided by honesty and passion.
              I've been editing videos for three years now, and I created this
              space to document my work, develop my skills, and keep expanding
              my knowledge. I still have a lot to learn, and I'm here for it.
            </p>
          </Reveal>
        </div>

        {/* Get in touch */}
        <div id="contact" className="md:col-span-5 md:border-l md:border-border md:pl-16">
          <Reveal delay={80}>
            <h2 className="spec-label">
              Get in touch
            </h2>
            <p className="mt-5 font-display md:mt-8 text-[clamp(1.4rem,2.4vw,2.1rem)] leading-[1.2] tracking-tight">
              Let's talk. Feel free to shoot me a message on WhatsApp, or send
              an email if you're that old.
            </p>
          </Reveal>

          <div className="mt-7 flex flex-col gap-6 md:mt-10 md:gap-8">
            <Reveal delay={160}>
              <Magnetic strength={0.12} className="block">
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noreferrer noopener"
                  onClick={() => track("contact_click", { channel: "whatsapp" })}
                  className="group block"
                >
                  <span className="spec-label">
                    WhatsApp
                  </span>
                  <span className="mt-2 block font-display text-[clamp(1.5rem,3vw,2.4rem)] leading-[1.1] tracking-[-0.02em]">
                    {WHATSAPP_NUMBER}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="mt-3 block h-px w-full origin-left scale-x-0 bg-foreground transition-transform duration-700 group-hover:scale-x-100 group-focus-visible:scale-x-100"
                  />
                </a>
              </Magnetic>
            </Reveal>

            <Reveal delay={240}>
              <Magnetic strength={0.12} className="block">
                <a
                  href={`mailto:${EMAIL}`}
                  onClick={() => track("contact_click", { channel: "email" })}
                  className="group block"
                >
                  <span className="spec-label">
                    Email
                  </span>
                  <span className="mt-2 block font-display text-[clamp(1.5rem,3vw,2.4rem)] leading-[1.1] tracking-[-0.02em]">
                    {EMAIL}
                  </span>
                  <span
                    aria-hidden="true"
                    className="mt-3 block h-px w-full origin-left scale-x-0 bg-foreground transition-transform duration-700 group-hover:scale-x-100 group-focus-visible:scale-x-100"
                  />
                </a>
              </Magnetic>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
