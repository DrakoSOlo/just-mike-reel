import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ThemeMenu } from "@/components/theme/ThemeMenu";
import { track } from "@/lib/analytics";

const links = [
  { href: "#reel", label: "Reel", id: "reel" },
  { href: "#work", label: "Work", id: "work" },
  { href: "#about", label: "About", id: "about" },
  { href: "#services", label: "Services", id: "services" },
];


export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = links
      .map((link) => document.getElementById(link.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!sections.length || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const [open, setOpen] = useState(false);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled || open
          ? "border-b border-border bg-background/90 py-2 backdrop-blur-md"
          : "border-b border-transparent py-3 md:py-5",
      )}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-[1400px] items-center justify-between gap-3 px-5 md:px-10"
      >
        <a
          href="#top"
          className="inline-flex min-h-11 shrink-0 items-center font-display text-lg tracking-tight md:text-xl"
        >
          just.mike
        </a>

        <div className="flex shrink-0 items-center gap-1 sm:gap-4 md:gap-6">
          <ul className="hidden items-center gap-5 text-[0.7rem] uppercase tracking-[0.2em] md:flex lg:gap-7">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => track("nav_click", { section: link.id })}
                  aria-current={active === link.id ? "true" : undefined}
                  className={cn(
                    "relative inline-flex min-h-11 items-center transition-colors duration-300 hover:text-foreground",
                    active === link.id ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {link.label}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute -bottom-0.5 left-0 h-px w-full origin-left bg-foreground transition-transform duration-500",
                      active === link.id ? "scale-x-100" : "scale-x-0",
                    )}
                  />
                </a>
              </li>
            ))}
          </ul>

          <ThemeMenu />

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="inline-flex h-11 w-11 items-center justify-center rounded-sm border border-border md:hidden"
          >
            <span aria-hidden="true" className="relative block h-3 w-4">
              <span
                className={cn(
                  "absolute left-0 block h-px w-full bg-foreground transition-transform duration-300",
                  open ? "top-1.5 rotate-45" : "top-0",
                )}
              />
              <span
                className={cn(
                  "absolute left-0 block h-px w-full bg-foreground transition-transform duration-300",
                  open ? "top-1.5 -rotate-45" : "top-3",
                )}
              />
            </span>
          </button>
        </div>
      </nav>

      <div
        id="mobile-nav"
        hidden={!open}
        className="mx-auto max-w-[1400px] px-5 pb-3 pt-2 md:hidden"
      >
        <ul className="grid grid-cols-2 gap-px overflow-hidden border border-border">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={() => {
                  track("nav_click", { section: link.id });
                  setOpen(false);
                }}
                aria-current={active === link.id ? "true" : undefined}
                className={cn(
                  "flex min-h-12 items-center justify-center border border-border/50 text-[0.7rem] uppercase tracking-[0.2em]",
                  active === link.id ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}

