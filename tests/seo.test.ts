import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { homeJsonLd, homeMeta, SITE_URL, seoDescription, seoTitle } from "../src/lib/seo";

const meta = homeMeta();
const graph = homeJsonLd()["@graph"] as Array<Record<string, unknown>>;
const node = (type: string) => graph.find((n) => n["@type"] === type)!;
const abs = (v: unknown) => typeof v === "string" && /^https:\/\//.test(v);

const routeSrc = readFileSync(new URL("../src/routes/index.tsx", import.meta.url), "utf8");
const sitemapSrc = readFileSync(new URL("../src/routes/sitemap[.]xml.tsx", import.meta.url), "utf8");
const robotsSrc = readFileSync(new URL("../src/routes/robots[.]txt.tsx", import.meta.url), "utf8");

describe("head metadata", () => {
  it("has a unique, length-safe title", () => {
    expect(seoTitle.length).toBeGreaterThan(10);
    expect(seoTitle.length).toBeLessThan(60);
    expect(seoTitle).not.toMatch(/Lovable/i);
  });

  it("has a length-safe description", () => {
    expect(seoDescription.length).toBeGreaterThan(50);
    expect(seoDescription.length).toBeLessThan(160);
    expect(seoDescription).not.toMatch(/Lovable Generated Project/i);
  });

  it("ships every social tag", () => {
    const keys = meta.map((m) => ("name" in m ? m.name : "property" in m ? m.property : "title"));
    for (const required of [
      "description",
      "og:title",
      "og:description",
      "og:type",
      "og:url",
      "og:image",
      "twitter:card",
      "twitter:title",
      "twitter:description",
      "twitter:image",
    ]) {
      expect(keys, `missing ${required}`).toContain(required);
    }
  });

  it("uses absolute social URLs on the canonical domain", () => {
    for (const key of ["og:url", "og:image", "twitter:image"]) {
      const entry = meta.find((m) => ("property" in m ? m.property : m.name) === key)!;
      expect(abs((entry as { content: string }).content), `${key} must be absolute`).toBe(true);
    }
    const ogUrl = meta.find((m) => "property" in m && m.property === "og:url") as {
      content: string;
    };
    expect(ogUrl.content.startsWith(SITE_URL)).toBe(true);
  });

  it("self-references a canonical link on the production domain", () => {
    expect(routeSrc).toContain(`rel: "canonical"`);
    expect(routeSrc).toContain(`href: \`\${SITE_URL}/\``);
  });

  it("is indexable", () => {
    const robots = meta.find((m) => "name" in m && m.name === "robots") as { content: string };
    expect(robots.content).not.toMatch(/noindex/i);
  });
});

describe("structured data", () => {
  it("declares a schema.org context", () => {
    expect(homeJsonLd()["@context"]).toBe("https://schema.org");
  });

  it("has a valid Person node", () => {
    const person = node("Person");
    expect(person.name).toBeTruthy();
    expect(abs(person["@id"])).toBe(true);
    expect(abs(person.url)).toBe(true);
    expect(abs(person.image)).toBe(true);
  });

  it("has a WebSite node published by the Person", () => {
    const site = node("WebSite");
    expect(abs(site.url)).toBe(true);
    expect((site.publisher as { "@id": string })["@id"]).toBe(node("Person")["@id"]);
  });

  it("has valid VideoObject nodes with all Google-required fields", () => {
    const list = node("ItemList").itemListElement as Array<{
      position: number;
      item: Record<string, unknown>;
    }>;
    expect(list.length).toBeGreaterThan(0);
    list.forEach((entry, i) => {
      expect(entry.position).toBe(i + 1);
      const v = entry.item;
      expect(v["@type"]).toBe("VideoObject");
      expect(v.name).toBeTruthy();
      expect(String(v.description).length).toBeGreaterThan(20);
      expect(Array.isArray(v.thumbnailUrl) && v.thumbnailUrl.every(abs)).toBe(true);
      expect(abs(v.contentUrl) || abs(v.embedUrl)).toBe(true);
      expect(Number.isNaN(Date.parse(String(v.uploadDate)))).toBe(false);
    });
  });

  it("serialises without circular references", () => {
    expect(() => JSON.stringify(homeJsonLd())).not.toThrow();
  });
});

describe("crawler files", () => {
  it("robots.txt does not block the whole site", () => {
    expect(robotsSrc).not.toMatch(/Disallow:\s*\/\s*$/m);
    expect(robotsSrc).toMatch(/Allow:\s*\//);
  });

  it("sitemap advertises the canonical absolute domain and the home route", () => {
    expect(sitemapSrc).toContain(SITE_URL);
    expect(sitemapSrc).toMatch(/path:\s*"\/"/);
    expect(sitemapSrc).toContain("<urlset");
  });
});
