import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

function baseUrl(request: Request) {
  const url = new URL(request.url);
  const host = request.headers.get("x-forwarded-host") ?? url.host;
  const proto =
    request.headers.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: async ({ request }: { request: Request }) => {
        const body = [
          "User-agent: Googlebot",
          "Allow: /",
          "",
          "User-agent: Bingbot",
          "Allow: /",
          "",
          "User-agent: Twitterbot",
          "Allow: /",
          "",
          "User-agent: facebookexternalhit",
          "Allow: /",
          "",
          "User-agent: *",
          "Allow: /",
          "",
          `Sitemap: ${baseUrl(request)}/sitemap.xml`,
          "",
        ].join("\n");

        return new Response(body, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
