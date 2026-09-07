import { cn } from "@/lib/utils";

/**
 * The house symbol: the ink droplet from the opening sequence.
 * Same silhouette everywhere — nav, favicon, error pages, share cards.
 */
export function Mark({ className, title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("mark-drop", className)}
      role={title ? "img" : "presentation"}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      focusable="false"
    >
      <path
        d="M12 1.6c0 0-8.2 9.3-8.2 13.6a8.2 8.2 0 0 0 16.4 0C20.2 10.9 12 1.6 12 1.6Z"
        fill="currentColor"
      />
      <ellipse cx="9.1" cy="12.6" rx="1.7" ry="2.4" fill="var(--color-background)" opacity="0.32" />
    </svg>
  );
}
