import { Reveal } from "@/components/Reveal";

const services = [
  "Brand films",
  "Music videos",
  "Documentary",
  "Commercial direction",
  "Colour grading",
  "Aerial / FPV",
];

const clients = ["Nike", "Spotify", "Aesop", "Red Bull", "Monocle", "Ace Hotel"];

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
            I'm Mike — a videographer who builds films around the small,
            unrepeatable moments. Ten years behind the camera, a stubborn
            attachment to natural light, and a habit of shooting one more take.
          </p>
          <p className="mt-8 max-w-xl text-sm leading-relaxed text-muted-foreground">
            I work end to end: concept, shoot, edit, grade. Small crews, honest
            frames, and a cut that holds attention from the first second. If you
            have a story that deserves more than a template, let's talk.
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
              Selected clients
            </h3>
            <div className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
              <ul className="marquee-track flex w-max gap-8 text-sm text-muted-foreground">
                {[...clients, ...clients].map((client, i) => (
                  <li key={`${client}-${i}`} aria-hidden={i >= clients.length}>
                    {client}
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
