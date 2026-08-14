import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { PaintDial } from "@/components/theme/PaintDial";
import { ThemeDot } from "@/components/theme/ThemeDot";
import { track } from "@/lib/analytics";

const links = [
  { href: "#reel", label: "Reel", id: "reel" },
  { href: "#reels", label: "Shorts", id: "reels" },
  { href: "#work", label: "Work", id: "work" },
  { href: "#about", label: "About", id: "about" },
  { href: "#services", label: "Services", id: "services" },
];

/**
 * No wordmark, no menu: a rail of dots that fill as you scroll. The label
 * only appears on hover/focus — the graphic carries the navigation.
 */
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
          ? "border-b border-border bg-background/85 py-1 backdrop-blur-md"
          : "border-b border-transparent py-2 md:py-4",
      )}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-[1400px] items-center justify-between gap-3 px-5 md:px-10"
      >
        <a
          href="#top"
          aria-label="Back to top"
          className="group inline-flex h-11 w-11 items-center justify-center"
        >
          <span aria-hidden="true" className="mark-glyph" />
        </a>

        <div className="flex items-center gap-1 sm:gap-2">
          <ul className="flex items-center">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => track("nav_click", { section: link.id })}
                  aria-label={link.label}
                  aria-current={active === link.id ? "true" : undefined}
                  className="nav-dot-link group inline-flex h-11 w-8 items-center justify-center sm:w-10"
                >
                  <span
                    aria-hidden="true"
                    className={cn("nav-dot", active === link.id && "nav-dot-on")}
                  />
                  <span aria-hidden="true" className="nav-dot-label">
                    {link.label}
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <span aria-hidden="true" className="mx-1 h-4 w-px bg-border sm:mx-2" />

          <PaintDial />

          <span aria-hidden="true" className="mx-1 h-4 w-px bg-border sm:mx-2" />

          <ThemeDot />
        </div>
      </nav>
    </header>
  );
}
