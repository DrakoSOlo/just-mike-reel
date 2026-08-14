import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const links = [
  { href: "#work", label: "Work" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "border-b border-border bg-background/80 py-3 backdrop-blur-md"
          : "border-b border-transparent py-6",
      )}
    >
      <nav className="mx-auto flex max-w-[1400px] items-center justify-between px-6 md:px-10">
        <a href="#top" className="font-display text-xl tracking-tight text-foreground">
          just<span className="text-accent">.</span>mike
        </a>
        <ul className="flex items-center gap-7 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="transition-colors duration-300 hover:text-accent">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
