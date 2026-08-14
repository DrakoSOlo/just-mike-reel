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

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "border-b border-border bg-background/90 py-2 backdrop-blur-md"
          : "border-b border-transparent py-5",
      )}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-[1400px] items-center justify-between px-6 md:px-10"
      >
        <a
          href="#top"
          className="inline-flex min-h-11 items-center font-display text-xl tracking-tight"
        >
          just.mike
        </a>
        <div className="flex items-center gap-4 sm:gap-6">
          <ul className="flex items-center gap-4 text-[0.7rem] uppercase tracking-[0.2em] sm:gap-7">
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
        </div>

      </nav>
    </header>
  );
}
