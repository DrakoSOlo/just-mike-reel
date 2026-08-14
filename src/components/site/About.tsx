import { Reveal } from "@/components/Reveal";

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
];

export function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="border-t border-border px-6 py-24 md:px-10 md:py-32"
    >
      <div className="mx-auto grid max-w-[1400px] gap-16 md:grid-cols-12">
        <Reveal className="md:col-span-7">
          <h2 id="about-heading" className="mb-8 text-xs uppercase tracking-[0.3em] text-muted-foreground">
            About
          </h2>
          <p className="font-display text-[clamp(1.6rem,3.4vw,3rem)] leading-[1.15] tracking-tight">
            Hi, I'm Mike. I love alternative rock, Miyazaki movies, and
            cinematic journeys that start with Lynch and end with Scorsese.
          </p>
          <p className="mt-8 max-w-xl text-sm leading-relaxed text-muted-foreground">
            I studied Materials Science and Engineering, which mostly just gave
            me a micro-perspective on how the physical world works — and that's
            about it. My real drive is guided by honesty and passion. I've been
            editing videos for three years now, and I created this space to
            document my work, develop my skills, and keep expanding my
            knowledge. I still have a lot to learn, and I'm here for it.
          </p>
        </Reveal>

        <div className="md:col-span-5 md:pt-16">
          <Reveal delay={120}>
            <h3 className="mb-5 text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Services
            </h3>
            <ul className="grid grid-cols-2 gap-y-3 text-sm">
              {services.map((service) => (
                <li
                  key={service}
                  className="group flex items-center gap-2 transition-colors duration-300"
                >
                  <span
                    aria-hidden="true"
                    className="h-px w-0 bg-foreground transition-all duration-500 group-hover:w-4"
                  />
                  {service}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={220} className="mt-12">
            <h3 className="mb-5 text-xs uppercase tracking-[0.3em] text-muted-foreground">
              On repeat
            </h3>
            <div className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
              <ul className="marquee-track flex w-max gap-8 text-sm text-muted-foreground">
                {[...influences, ...influences].map((item, i) => (
                  <li key={`${item}-${i}`} aria-hidden={i >= influences.length}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
