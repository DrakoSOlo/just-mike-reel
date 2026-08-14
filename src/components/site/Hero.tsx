export function Hero() {
  return (
    <section
      id="top"
      className="grain relative flex min-h-[100svh] flex-col justify-end overflow-hidden px-6 pb-16 pt-32 md:px-10 md:pb-20"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,var(--color-surface),transparent_70%)]" />

      <div className="relative mx-auto w-full max-w-[1400px]">
        <p
          className="animate-rise text-xs uppercase tracking-[0.4em] text-muted-foreground"
          style={{ animationDelay: "120ms" }}
        >
          Videographer &amp; Director
        </p>

        <h1 className="mt-6 font-display text-[clamp(4rem,17vw,16rem)] leading-[0.82] tracking-[-0.03em]">
          <span className="animate-rise block" style={{ animationDelay: "260ms" }}>
            just
          </span>
          <span
            className="animate-rise block pl-[0.12em] italic text-accent"
            style={{ animationDelay: "420ms" }}
          >
            mike
          </span>
        </h1>

        <div className="mt-10 flex flex-col gap-8 border-t border-border pt-8 md:flex-row md:items-end md:justify-between">
          <p
            className="animate-rise max-w-md text-sm leading-relaxed text-muted-foreground"
            style={{ animationDelay: "620ms" }}
          >
            Cinematic films for brands, artists and people who'd rather be
            remembered than scrolled past. Based anywhere the light is good.
          </p>
          <a
            href="#reel"
            className="animate-rise group inline-flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-foreground"
            style={{ animationDelay: "760ms" }}
          >
            Watch the reel
            <span className="h-px w-12 bg-foreground transition-all duration-500 group-hover:w-20 group-hover:bg-accent" />
          </a>
        </div>
      </div>
    </section>
  );
}
