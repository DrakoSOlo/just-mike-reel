import { Reveal } from "@/components/Reveal";

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
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Available for commissions
          </p>
          <a
            href="mailto:hello@justmike.film"
            className="group mt-8 block font-display text-[clamp(2.2rem,8vw,7rem)] leading-[0.95] tracking-[-0.03em] transition-colors duration-500 hover:text-accent"
          >
            hello@justmike.film
            <span className="mt-4 block h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-700 group-hover:scale-x-100" />
          </a>
        </Reveal>

        <Reveal
          delay={140}
          className="mt-20 flex flex-col gap-8 border-t border-border pt-8 md:flex-row md:items-center md:justify-between"
        >
          <span className="font-display text-lg tracking-tight">
            just<span className="text-accent">.</span>mike
          </span>
          <ul className="flex gap-7 text-xs uppercase tracking-[0.25em] text-muted-foreground">
            {socials.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="transition-colors duration-300 hover:text-accent"
                >
                  {social.label}
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
