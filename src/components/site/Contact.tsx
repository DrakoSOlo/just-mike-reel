import { Reveal } from "@/components/Reveal";
import { Magnetic } from "@/components/motion/Magnetic";

// TODO: replace with Mike's real details.
const EMAIL = "hello@justmike.film";
const WHATSAPP_NUMBER = "+30 000 000 0000";
const WHATSAPP_LINK = "https://wa.me/300000000000";

const socials = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "YouTube", href: "https://youtube.com" },
  { label: "Vimeo", href: "https://vimeo.com" },
];

export function Contact() {
  return (
    <footer id="contact" className="border-t border-border px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-[1400px]">
        <Reveal>
          <h2 className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Get in touch
          </h2>
          <p className="mt-8 font-display text-[clamp(1.6rem,3.4vw,3rem)] leading-[1.15] tracking-tight">
            Let's talk. Feel free to shoot me a message on WhatsApp, or send an
            email if you're that old.
          </p>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            <Magnetic strength={0.1} className="block">
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noreferrer noopener"
                className="group block"
              >
                <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  WhatsApp
                </span>
                <span className="mt-3 block font-display text-[clamp(1.8rem,4.5vw,3.4rem)] leading-[1] tracking-[-0.02em]">
                  {WHATSAPP_NUMBER}
                  <span className="sr-only"> (opens in a new tab)</span>
                </span>
                <span
                  aria-hidden="true"
                  className="mt-4 block h-px w-full origin-left scale-x-0 bg-foreground transition-transform duration-700 group-hover:scale-x-100 group-focus-visible:scale-x-100"
                />
              </a>
            </Magnetic>

            <Magnetic strength={0.1} className="block">
              <a href={`mailto:${EMAIL}`} className="group block">
                <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  Email
                </span>
                <span className="mt-3 block font-display text-[clamp(1.8rem,4.5vw,3.4rem)] leading-[1] tracking-[-0.02em]">
                  {EMAIL}
                </span>
                <span
                  aria-hidden="true"
                  className="mt-4 block h-px w-full origin-left scale-x-0 bg-foreground transition-transform duration-700 group-hover:scale-x-100 group-focus-visible:scale-x-100"
                />
              </a>
            </Magnetic>
          </div>
        </Reveal>

        <Reveal
          delay={140}
          className="mt-20 flex flex-col gap-8 border-t border-border pt-8 md:flex-row md:items-center md:justify-between"
        >
          <span className="font-display text-lg tracking-tight">just.mike</span>
          <ul className="flex gap-7 text-xs uppercase tracking-[0.25em] text-muted-foreground">
            {socials.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex min-h-11 items-center underline-offset-8 transition-colors duration-300 hover:text-foreground hover:underline"
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
